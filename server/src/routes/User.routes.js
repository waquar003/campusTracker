import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import {
  loginUser,
  logoutUser,
  profile,
  registerUser,
  updateProfile,
  updateProfilePicture,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAllAssignments,
} from '../controllers/User.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

//secured Routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/profile').get(verifyJWT, profile);

router.route('/update-profile').patch(verifyJWT, updateProfile);
router
  .route('/update-profile-picture')
  .patch(verifyJWT, upload.single('profilePicture'), updateProfilePicture);

router.route('/assignments').get(verifyJWT, getAllAssignments);
router.route('/assignments').post(verifyJWT, createAssignment);
router.route('/assignments/:assignmentId').patch(verifyJWT, updateAssignment);
router.route('/assignments/:assignmentId').delete(verifyJWT, deleteAssignment);

export default router;
