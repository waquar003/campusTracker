import { AcademicGoal } from '../models/AcademicGoal.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const addAcademicGoal = asyncHandler(async (req, res) => {
  let goals = await AcademicGoal.findOne({ userId: req.user._id });

  if (!goals) {
    goals = await AcademicGoal.create({ userId: req.user._id, events: [] });
  }

  const { title, description, deadline } = req.body;

  const newGoal = {
    id: Date.now().toString(),
    title,
    description,
    deadline: new Date(deadline),
    completed: false,
  };

  goals.goals.push(newGoal);
  await goals.save();

  return res
    .status(201)
    .json(new ApiResponse(201, newGoal, 'Academic goal added successfully'));
});

const getAcademicGoals = asyncHandler(async (req, res) => {
  const goals = await AcademicGoal.findOne({ userId: req.user._id });

  return res
    .status(200)
    .json(new ApiResponse(200, goals, 'Academic goals retrieved successfully'));
});

const markGoalComplete = asyncHandler(async (req, res) => {
  const { goalId } = req.params;

  const goal = await AcademicGoal.findOne({ userId: req.user._id });

  const goalIndex = goal.goals.findIndex((goal) => goal.id === goalId);

  if (goalIndex === -1) {
    throw new ApiError(404, 'Goal not found');
  }

  goal.goals[goalIndex].completed = true;
  await goal.save();

  return res
    .status(200)
    .json(new ApiResponse(200, goal, 'Goal marked as complete'));
});

const deleteAcademicGoal = asyncHandler(async (req, res) => {
  const { goalId } = req.params;

  const goal = await AcademicGoal.findOne({ userId: req.user._id });

  if (!goal) {
    throw new ApiError(404, 'Goal not found');
  }

  goal.goals = goal.goals.filter((goal) => goal.id !== goalId);

  await goal.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Academic goal deleted successfully'));
});

export {
  addAcademicGoal,
  getAcademicGoals,
  markGoalComplete,
  deleteAcademicGoal,
};
