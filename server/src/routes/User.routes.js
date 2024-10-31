import express from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import {
  loginUser,
  logoutUser,
  profile,
  registerUser,
  getScheduleByDate,
  createEvent,
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
  deleteEvent,
  updateEvent,
} from '../controllers/User.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/register').post(registerUser);

router.route('/login').post(loginUser);

//secured Routes
router.route('/logout').post(verifyJWT, logoutUser);
router.route('/profile').get(verifyJWT, profile);
router.route('/schedule').post(verifyJWT, getScheduleByDate);
router.post('/events', verifyJWT, createEvent);
router.put('/events/:eventId', verifyJWT, updateEvent);
router.delete('/events/:eventId', verifyJWT, deleteEvent);

router.route('/update-profile').patch(verifyJWT, updateProfile);
router
  .route('/update-profile-picture')
  .patch(verifyJWT, upload.single('profilePicture'), updateProfilePicture);

// Academic Goals routes
router.route('/academic-goals').get(verifyJWT, getAcademicGoals);
router.route('/academic-goals').post(verifyJWT, addAcademicGoal);
router
  .route('/academic-goals/:goalId/complete')
  .patch(verifyJWT, markGoalComplete);
router.route('/academic-goals/:goalId').delete(verifyJWT, deleteAcademicGoal);

router.route('/assignments').get(verifyJWT, getAllAssignments);
router.route('/assignments').post(verifyJWT, createAssignment);
router.route('/assignments/:assignmentId').patch(verifyJWT, updateAssignment);
router.route('/assignments/:assignmentId').delete(verifyJWT, deleteAssignment);

export default router;
