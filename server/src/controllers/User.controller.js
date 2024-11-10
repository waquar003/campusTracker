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
    sameSite: 'None',
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

export {
  registerUser,
  loginUser,
  logoutUser,
  profile,
  updateProfile,
  updateProfilePicture,
};
