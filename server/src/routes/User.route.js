import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import {
  loginUser,
  logoutUser,
  profile,
  registerUser,
  getScheduleByDate,
  createEvent,
  updateProfile,
  updateProfilePicture,
} from '../controllers/User.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register').post(
  upload.fields([
    {
      name: 'profilePicture',
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route('/login').post(loginUser);

//secured Routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/dashboard').post(verifyJWT, profile);
router.route('/schedule').post(verifyJWT, getScheduleByDate);
router.route('/event').post(verifyJWT, createEvent);

// New settings routes
router.route('/update-profile').patch(verifyJWT, updateProfile);
router
  .route('/update-profile-picture')
  .patch(verifyJWT, upload.single('profilePicture'), updateProfilePicture);

export default router;
