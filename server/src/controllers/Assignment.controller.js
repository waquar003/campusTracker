import { Assignment } from '../models/Assignment.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const createAssignment = asyncHandler(async (req, res) => {
  let assignments = await Assignment.findOne({ userId: req.user._id });

  if (!assignments) {
    assignments = await Assignment.create({
      userId: req.user._id,
      assignments: [],
    });
  }

  const { title, course, dueDate, description, priority, auraPoints } =
    req.body;

  const newAssignment = {
    id: Date.now().toString(),
    title,
    course,
    dueDate: new Date(dueDate),
    status: 'pending',
    description,
    priority,
    auraPoints,
  };

  assignments.assignments.push(newAssignment);
  await assignments.save();

  return res
    .status(201)
    .json(
      new ApiResponse(201, newAssignment, 'Assignment created successfully')
    );
});

const getAllAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.findOne({ userId: req.user._id });

  if (!assignments) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], 'No assignments found'));
  }

  const priorityWeight = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const sortedAssignments = assignments.assignments.sort((a, b) => {
    // First sort by due date
    const dateComparison =
      new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();

    // If dates are equal, sort by priority
    if (dateComparison === 0) {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }

    return dateComparison;
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        sortedAssignments,
        'Assignments retrieved successfully'
      )
    );
});

const updateAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const updateData = req.body;
  // console.log(updateData)

  const assignments = await Assignment.findOne({ userId: req.user._id });

  const assignmentIndex = assignments.assignments.findIndex(
    (assignment) => assignment.id === assignmentId
  );

  if (assignmentIndex === -1) {
    throw new ApiError(404, 'Assignment not found');
  }

  assignments.assignments[assignmentIndex] = {
    ...assignments.assignments[assignmentIndex],
    ...updateData,
    dueDate: new Date(updateData.dueDate),
  };

  await assignments.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        assignments.assignments[assignmentIndex],
        'Assignment updated successfully'
      )
    );
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const assignments = await Assignment.findOne({ userId: req.user._id });

  if (!assignments) {
    throw new ApiError(404, 'Assignments not found');
  }

  assignments.assignments = assignments.assignments.filter(
    (assignment) => assignment.id !== assignmentId
  );

  await assignments.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Assignment deleted successfully'));
});

const updateAssignmentStatus = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;
  const { status, timeSpent } = req.body;

  const assignments = await Assignment.findOne({ userId: req.user._id });

  const assignmentIndex = assignments.assignments.findIndex(
    (assignment) => assignment.id === assignmentId
  );

  if (assignmentIndex === -1) {
    throw new ApiError(404, 'Assignment not found');
  }

  assignments.assignments[assignmentIndex] = {
    ...assignments.assignments[assignmentIndex],
    status,
    timeSpent,
    lastUpdated: new Date(),
  };

  await assignments.save();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        assignments.assignments[assignmentIndex],
        'Assignment status updated successfully'
      )
    );
});

export {
  createAssignment,
  getAllAssignments,
  updateAssignment,
  deleteAssignment,
  updateAssignmentStatus,
};
