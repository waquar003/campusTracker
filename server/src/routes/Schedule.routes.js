import express from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
  getScheduleByDate,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/Schedule.controller.js';

const router = express.Router();

router.route('/').get(verifyJWT, getScheduleByDate);
router.post('/events', verifyJWT, createEvent);
router.put('/events/:eventId', verifyJWT, updateEvent);
router.delete('/events/:eventId', verifyJWT, deleteEvent);

export default router;
