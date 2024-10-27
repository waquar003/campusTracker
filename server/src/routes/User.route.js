import express from 'express';
import upload from '../middlewares/multer.middleware.js';
import { registerUser } from '../controllers/User.controller.js';

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
