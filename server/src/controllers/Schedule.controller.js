import { Schedule } from '../models/Schedule.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const getScheduleByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;
  const schedule = await Schedule.findOne({ userId: req.user._id });

  if (!schedule) {
    throw new ApiError(404, 'Schedule not found');
  }

  const selectedDate = new Date(date);

  const dailySchedule = schedule.events
    .filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === selectedDate.toDateString();
    })
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dailySchedule,
        'Daily schedule retrieved successfully'
      )
    );
});

const createEvent = asyncHandler(async (req, res) => {
  const { title, start, end, type, location, recurring } = req.body;
  let schedule = await Schedule.findOne({ userId: req.user._id });

  if (!schedule) {
    schedule = await Schedule.create({ userId: req.user._id, events: [] });
  }

  if (!title || !start || !end || !type) {
    throw new ApiError(400, 'Required fields missing');
  }

  const newEvent = {
    id: Date.now().toString(),
    title,
    start: new Date(start),
    end: new Date(end),
    type,
    location,
    recurring,
  };

  schedule.events.push(newEvent);
  await schedule.save();

  return res
    .status(201)
    .json(new ApiResponse(201, newEvent, 'Event created successfully'));
});

const updateEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const { title, start, end, type, location, recurring } = req.body;
  const schedule = await Schedule.findOne({ userId: req.user._id });

  if (!schedule) {
    throw new ApiError(404, 'Schedule not found');
  }

  const eventIndex = schedule.events.findIndex((event) => event.id === eventId);
  if (eventIndex === -1) {
    throw new ApiError(404, 'Event not found');
  }

  const updatedEvent = {
    ...schedule.events[eventIndex],
    title,
    start: new Date(start),
    end: new Date(end),
    type,
    location,
    recurring,
  };

  schedule.events[eventIndex] = updatedEvent;
  await schedule.save();

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEvent, 'Event updated successfully'));
});

const deleteEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const schedule = await Schedule.findOne({ userId: req.user._id });

  if (!schedule) {
    throw new ApiError(404, 'Schedule not found');
  }

  schedule.events = schedule.events.filter((event) => event.id !== eventId);
  await schedule.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, 'Event deleted successfully'));
});

export { getScheduleByDate, createEvent, updateEvent, deleteEvent };
