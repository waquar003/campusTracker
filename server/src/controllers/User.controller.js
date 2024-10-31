import { User } from '../models/User.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].includes(undefined)) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, 'User already exists');
  }

  const defaultProfilePicture =
    'https://res.cloudinary.com/dx9cokbaj/image/upload/v1730399953/cytpla2ebylvczzhoapq.png';

  const user = await User.create({
    name,
    email,
    password,
    profilePicture: defaultProfilePicture,
  });

  const createdUser = await User.findById(user._id).select('-password');

  if (!createdUser) {
    throw new ApiError(500, 'Something went wrong while registering user');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, 'User registered successfully'));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if ([email, password].includes(undefined)) {
    throw new ApiError(400, 'All fields are required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User doesn't exist");
  }

  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(400, 'Incorrect password');
  }

  const accessToken = user.generateAccessToken();

  const loggedInUser = await User.findById(user._id).select('-password');

  const option = {
    httpOnly: true,
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    secure: true,
  };

  res
    .status(200)
    .cookie('accessToken', accessToken, option)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken },
        'User logged in successfully'
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .clearCookie('accessToken')
    .json(new ApiResponse(200, null, 'User logged out successfully'));
});

const profile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'User fetched successfully'));
});

const getScheduleByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const selectedDate = new Date(date);

  const dailySchedule = user.schedule
    .filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === selectedDate.toDateString();
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dailySchedule,
        'Daily schedule retrieved successfully'
      )
    );
});

const createEvent = asyncHandler(async (req, res) => {
  const { title, start, end, type, location, recurring } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!title || !start || !end || !type) {
    throw new ApiError(400, 'Required fields missing');
  }

  const newEvent = {
    id: Date.now().toString(),
    title,
    start: new Date(start),
    end: new Date(end),
    type,
    location,
    recurring,
  };

  user.schedule.push(newEvent);
  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(201, newEvent, 'Event created successfully'));
});

const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { title, start, end, type, location, recurring } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const eventIndex = user.schedule.findIndex((event) => event.id === eventId);
  if (eventIndex === -1) {
    throw new ApiError(404, 'Event not found');
  }

  const updatedEvent = {
    ...user.schedule[eventIndex],
    title,
    start: new Date(start),
    end: new Date(end),
    type,
    location,
    recurring,
  };

  user.schedule[eventIndex] = updatedEvent;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEvent, 'Event updated successfully'));
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.schedule = user.schedule.filter((event) => event.id !== eventId);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Event deleted successfully'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (currentPassword && newPassword) {
    const isPasswordValid = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordValid) {
      throw new ApiError(400, 'Current password is incorrect');
    }
    user.password = newPassword;
  }

  if (name) {
    user.name = name;
  }

  await user.save();

  const updatedUser = await User.findById(user._id).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, 'Profile updated successfully'));
});

const updateProfilePicture = asyncHandler(async (req, res) => {
  const profilePictureLocalPath = req.file?.path;

  if (!profilePictureLocalPath) {
    throw new ApiError(400, 'Profile picture is required');
  }

  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { profilePicture: profilePicture.url },
    { new: true }
  ).select('-password');

  return res
    .status(200)
    .json(new ApiResponse(200, user, 'Profile picture updated successfully'));
});

const addAcademicGoal = asyncHandler(async (req, res) => {
  const { title, description, deadline } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const newGoal = {
    id: Date.now().toString(),
    title,
    description,
    deadline: new Date(deadline),
    completed: false,
  };

  user.academicGoals.push(newGoal);
  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(201, newGoal, 'Academic goal added successfully'));
});

const getAcademicGoals = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.academicGoals,
        'Academic goals retrieved successfully'
      )
    );
});

const markGoalComplete = asyncHandler(async (req, res) => {
  const { goalId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const goalIndex = user.academicGoals.findIndex((goal) => goal.id === goalId);

  if (goalIndex === -1) {
    throw new ApiError(404, 'Goal not found');
  }

  user.academicGoals[goalIndex].completed = true;
  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.academicGoals[goalIndex],
        'Goal marked as complete'
      )
    );
});

const deleteAcademicGoal = asyncHandler(async (req, res) => {
  const { goalId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.academicGoals = user.academicGoals.filter((goal) => goal.id !== goalId);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Academic goal deleted successfully'));
});

const createAssignment = asyncHandler(async (req, res) => {
  const { title, course, dueDate, description, priority, auraPoints } =
    req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const newAssignment = {
    id: Date.now().toString(),
    title,
    course,
    dueDate: new Date(dueDate),
    status: 'pending',
    description,
    priority,
    auraPoints,
  };

  user.assignments.push(newAssignment);
  await user.save();

  return res
    .status(201)
    .json(
      new ApiResponse(201, newAssignment, 'Assignment created successfully')
    );
});

const updateAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const updateData = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const assignmentIndex = user.assignments.findIndex(
    (assignment) => assignment.id === assignmentId
  );

  if (assignmentIndex === -1) {
    throw new ApiError(404, 'Assignment not found');
  }

  user.assignments[assignmentIndex] = {
    ...user.assignments[assignmentIndex],
    ...updateData,
    dueDate: new Date(updateData.dueDate),
  };

  await user.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user.assignments[assignmentIndex],
        'Assignment updated successfully'
      )
    );
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.assignments = user.assignments.filter(
    (assignment) => assignment.id !== assignmentId
  );

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Assignment deleted successfully'));
});

const getAllAssignments = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const assignments = user.assignments.sort(
    (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, assignments, 'Assignments retrieved successfully')
    );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  profile,
  getScheduleByDate,
  createEvent,
  updateEvent,
  deleteEvent,
  updateProfile,
  updateProfilePicture,
  addAcademicGoal,
  getAcademicGoals,
  markGoalComplete,
  deleteAcademicGoal,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAllAssignments,
};
