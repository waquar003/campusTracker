import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import {
  loginUser,
  logoutUser,
  profile,
  registerUser,
  getScheduleByDate,
  createEvent,
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

export default router;
