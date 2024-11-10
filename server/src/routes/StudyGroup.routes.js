import express from 'express';
import { studyGroupController } from '../controllers/StudyGroup.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', verifyJWT, studyGroupController.createGroup);
router.get('/', verifyJWT, studyGroupController.getAllGroups);
router.post('/:groupId/join', verifyJWT, studyGroupController.joinGroup);

export default router;
