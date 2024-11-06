import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  addAcademicGoal,
  getAcademicGoals,
  markGoalComplete,
  deleteAcademicGoal,
} from '../controllers/AcademicGoal.controller.js';

const router = express.Router();

router
  .route('/')
  .get(verifyJWT, getAcademicGoals)
  .post(verifyJWT, addAcademicGoal);

router.route('/:goalId/complete').patch(verifyJWT, markGoalComplete);

router.route('/:goalId').delete(verifyJWT, deleteAcademicGoal);

export default router;
