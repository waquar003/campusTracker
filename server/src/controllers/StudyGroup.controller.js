import { StudyGroup } from '../models/StudyGroup.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const studyGroupController = {
  createGroup: asyncHandler(async (req, res) => {
    const { name, subject, description, tags } = req.body;

    if (!name || !subject || !description) {
      throw new ApiError(400, 'All fields are required');
    }

    const newGroup = new StudyGroup({
      name,
      subject,
      description,
      creator: req.user._id,
      members: [req.user._id],
      tags,
    });

    const savedGroup = await newGroup.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, savedGroup, 'Study group created successfully')
      );
  }),

  getAllGroups: asyncHandler(async (req, res) => {
    const groups = await StudyGroup.find()
      .populate('creator', 'name email')
      .populate('members', 'name email');

    return res
      .status(200)
      .json(new ApiResponse(200, groups, 'Groups fetched successfully'));
  }),

  joinGroup: asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const group = await StudyGroup.findById(groupId);

    if (!group) {
      throw new ApiError(404, 'Study group not found');
    }

    if (group.members.length >= group.maxMembers) {
      throw new ApiError(400, 'Group is full');
    }

    if (!group.members.includes(req.user._id)) {
      group.members.push(req.user._id);
      await group.save();
    }

    return res
      .status(200)
      .json(new ApiResponse(200, group, 'Successfully joined the group'));
  }),
};
