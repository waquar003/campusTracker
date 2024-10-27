import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    throw new ApiError(401, 'Unauthorized');
  }

  const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decodedToken.id).select('-password');

  if (!user) {
    throw new ApiError(401, 'Unauthorized');
  }

  req.user = user;
  next();
});
