import { Schedule } from '../models/Schedule.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const getScheduleByDate = asyncHandler(async (req, res) => {
  const { date } = req.query;
  let schedule = await Schedule.findOne({ userId: req.user._id });

  if (!schedule) {
    schedule = await Schedule.create({ userId: req.user._id, events: [] });
  }

  const selectedDate = new Date(date);
  // Normalize selected date to start of day
  selectedDate.setHours(0, 0, 0, 0);

  const dailySchedule = schedule.events.filter((event) => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const startDay = new Date(eventStart).setHours(0, 0, 0, 0);
    const endDay = new Date(eventEnd).setHours(0, 0, 0, 0);
    const selectedDay = selectedDate.getTime();

    // Single day or multi-day event check
    const isWithinDateRange = selectedDay >= startDay && selectedDay <= endDay;

    // Recurring event check
    const isRecurring = event.recurring && event.recurring.days.length > 0;
    if (isRecurring) {
      const dayNames = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
      ];
      const selectedDayName = dayNames[selectedDate.getDay()];
      const untilDate = new Date(event.recurring.until);
      untilDate.setHours(23, 59, 59, 999);

      return (
        event.recurring.days.includes(selectedDayName) &&
        selectedDate <= untilDate &&
        selectedDate >= new Date(startDay) // Changed this line
      );
    }

    return isWithinDateRange;
  });

  // Sort events by start time
  const sortedSchedule = dailySchedule.sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        sortedSchedule,
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
  console.log('Updating event:', eventId, req.body);

  const schedule = await Schedule.findOne({ userId: req.user._id });
  if (!schedule) {
    throw new ApiError(404, 'Schedule not found');
  }

  const eventIndex = schedule.events.findIndex(
    (event) => event._id === eventId || event._id.toString() === eventId
  );
  if (eventIndex === -1) {
    throw new ApiError(404, 'Event not found');
  }

  // Preserve the existing id while updating other fields
  const updatedEvent = {
    id: eventId,
    ...req.body,
    start: new Date(req.body.start),
    end: new Date(req.body.end),
    recurring: req.body.recurring || { days: [] },
  };

  schedule.events[eventIndex] = updatedEvent;
  await schedule.save();
  console.log('Updated event:', updatedEvent); // Debug log

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
