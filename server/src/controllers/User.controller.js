import { User } from '../models/User.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { uploadOnCloudinary } from '../utils/uploadOnCloudinary.js';

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if ([name, email, password].includes(undefined)) {
    throw new ApiError(400, 'All fields are required');
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(400, 'User already exists');
  }

  const profilePictureLocalPath = req.files.profilePicture[0].path;
  const profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

  const user = await User.create({
    name,
    email,
    password,
    profilePicture: profilePicture.url,
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

  const accessToken = user.generateAccesToken();

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

    return res.status(200).json(new ApiResponse(200, user, 'User fetched successfully'));
)

const getScheduleByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const selectedDate = new Date(date);
  
  const dailySchedule = user.schedule
    .filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === selectedDate.toDateString();
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return res
    .status(200)
    .json(new ApiResponse(200, dailySchedule, 'Daily schedule retrieved successfully'));
});

const createEvent = asyncHandler(async (req, res) => {
  const { title, start, end, type, location } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  if (!title || !start || !end || !type) {
    throw new ApiError(400, 'Required fields missing');
  }

  const newEvent = {
    id: Date.now().toString(), // Simple unique ID generation
    title,
    start: new Date(start),
    end: new Date(end),
    type,
    location
  };

  user.schedule.push(newEvent);
  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(201, newEvent, 'Event created successfully'));
});

export { 
  registerUser, 
  loginUser, 
  logoutUser, 
  profile, 
  getScheduleByDate,
  createEvent  
};
