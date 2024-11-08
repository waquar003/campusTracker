import express from 'express';
import {
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getAllAssignments,
} from '../controllers/Assignment.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.route('/').get(verifyJWT, getAllAssignments);
router.route('/').post(verifyJWT, createAssignment);
router.route('/:assignmentId').patch(verifyJWT, updateAssignment);
router.route('/:assignmentId').delete(verifyJWT, deleteAssignment);

export default router;
