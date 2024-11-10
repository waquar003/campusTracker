import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar as ShadcnCalendar } from '@/components/ui/calendar';

import { format, isSameDay, parse } from 'date-fns';
import {
  fetchSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} from '@/store/slices/scheduleSlice';
import { RootState } from '@reduxjs/toolkit/query';

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'lecture' | 'assignment' | 'study' | 'event';
  location?: string;
  recurring?: {
    days: (
      | 'monday'
      | 'tuesday'
      | 'wednesday'
      | 'thursday'
      | 'friday'
      | 'saturday'
      | 'sunday'
    )[];
    until: Date;
  };
}

const EventForm = ({
  event,
  onSubmit,
  onClose,
}: {
  event?: Event;
  onSubmit: (data: Partial<Event>) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    type: event?.type || 'event',
    location: event?.location || '',

    startDate: event?.start ? format(new Date(event.start), 'yyyy-MM-dd') : '',
    startTime: event?.start ? format(new Date(event.start), 'HH:mm') : '',
    endDate: event?.end ? format(new Date(event.end), 'yyyy-MM-dd') : '',
    endTime: event?.end ? format(new Date(event.end), 'HH:mm') : '',
    isRecurring: Boolean(event?.recurring?.days?.length),
    recurringDays: event?.recurring?.days || [],
    recurringUntil: event?.recurring?.until
      ? format(new Date(event.recurring.until), 'yyyy-MM-dd')
      : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const startDateTime = new Date(
      `${formData.startDate}T${formData.startTime}`
    );
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    const eventData: Partial<Event> = {
      title: formData.title,
      type: formData.type as Event['type'],
      location: formData.location,

      start: startDateTime.toISOString(),
      end: endDateTime.toISOString(),
      recurring:
        formData.isRecurring && formData.recurringDays.length > 0
          ? {
              days: formData.recurringDays,
              until: new Date(formData.recurringUntil).toISOString(),
            }
          : { days: [] },
    };

    onSubmit(eventData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as Event['type'] })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="lecture">Lecture</option>
          <option value="assignment">Assignment</option>
          <option value="study">Study</option>
          <option value="event">Event</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Start Date</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) =>
              setFormData({ ...formData, startDate: e.target.value })
            }
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Start Time</label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) =>
              setFormData({ ...formData, startTime: e.target.value })
            }
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">End Date</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) =>
              setFormData({ ...formData, endDate: e.target.value })
            }
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">End Time</label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) =>
              setFormData({ ...formData, endTime: e.target.value })
            }
            className="mt-1 block w-full rounded-md border p-2"
            required
          />
        </div>
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isRecurring}
            onChange={(e) =>
              setFormData({ ...formData, isRecurring: e.target.checked })
            }
            className="mr-2"
          />
          <span className="text-sm font-medium">Recurring Event</span>
        </label>
      </div>

      {formData.isRecurring && (
        <>
          <div>
            <label className="block text-sm font-medium">Repeat on</label>
            <div className="grid grid-cols-7 gap-2 mt-1">
              {[
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
                'sunday',
              ].map((day) => (
                <label key={day} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.recurringDays.includes(day)}
                    onChange={(e) => {
                      const days = e.target.checked
                        ? [...formData.recurringDays, day]
                        : formData.recurringDays.filter((d) => d !== day);
                      setFormData({ ...formData, recurringDays: days });
                    }}
                    className="mr-1"
                  />
                  <span className="text-sm">{day.charAt(0).toUpperCase()}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Repeat Until</label>
            <input
              type="date"
              value={formData.recurringUntil}
              onChange={(e) =>
                setFormData({ ...formData, recurringUntil: e.target.value })
              }
              className="mt-1 block w-full rounded-md border p-2"
              required={formData.isRecurring}
              min={formData.startDate}
            />
          </div>
        </>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          {event ? 'Update' : 'Create'} Event
        </button>
      </div>
    </form>
  );
};

const Schedule = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Initialize date from URL or current date
  const initialDate = searchParams.get('date')
    ? new Date(searchParams.get('date'))
    : new Date();

  const [date, setDate] = useState(initialDate);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(undefined);

  const dispatch = useDispatch();
  //TODO: Check for it
  // const { isAuthenticated } = useSelector((state:RootState) => state.auth);
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const { schedules: events, loading } = useSelector((state) => state.schedule);

  // Update URL when date changes
  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate && !isNaN(newDate.getTime())) {
      const formattedDate = format(newDate, 'yyyy-MM-dd');
      setSearchParams({ date: formattedDate });
      setDate(newDate);
    }
  };

  // Fetch schedules when date or auth status changes
  useEffect(() => {
    console.log('Schedule.tsx: ', date, isAuthenticated);
    if (isAuthenticated && date) {
      console.log('Fetching schedule for date:', format(date, 'yyyy-MM-dd'));
      dispatch(fetchSchedules(format(date, 'yyyy-MM-dd')));
    }
  }, [date, dispatch, isAuthenticated]);

  // Sync with URL parameters
  useEffect(() => {
    const urlDate = searchParams.get('date');
    if (urlDate) {
      const parsedDate = new Date(urlDate);
      if (!isNaN(parsedDate.getTime()) && !isSameDay(parsedDate, date)) {
        setDate(parsedDate);
      }
    }
  }, [searchParams]);

  const handleCreate = async (data) => {
    await dispatch(createSchedule(data));
    setIsDialogOpen(false);
  };

  const handleEditClick = (event) => {
    console.log('Editing event:', event); // Debug log
    setEditingEvent({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end),
      recurring: {
        days: event.recurring?.days || [],
        until: event.recurring?.until ? new Date(event.recurring.until) : null,
      },
    });
    setIsDialogOpen(true);
  };

  const handleEdit = async (data) => {
    console.log('Edit triggered with data:', data);
    console.log(editingEvent);
    if (editingEvent?._id) {
      const updateData = {
        id: editingEvent._id,
        data: {
          title: data.title,
          start: data.start,
          end: data.end,
          type: data.type,
          location: data.location,
          recurring: data.recurring || { days: [] },
        },
      };
      console.log('Dispatching update with:', updateData);
      await dispatch(updateSchedule(updateData));
      dispatch(fetchSchedules(format(date, 'yyyy-MM-dd')));
    }
    setIsDialogOpen(false);
    setEditingEvent(undefined);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await dispatch(deleteSchedule(id));
    }
  };

  const getEventColor = (type: string) => {
    const colors = {
      lecture: {
        bg: 'bg-indigo-100',
        text: 'text-indigo-800',
        border: 'border-indigo-200',
        hover: 'hover:bg-indigo-50',
      },
      assignment: {
        bg: 'bg-rose-100',
        text: 'text-rose-800',
        border: 'border-rose-200',
        hover: 'hover:bg-rose-50',
      },
      study: {
        bg: 'bg-emerald-100',
        text: 'text-emerald-800',
        border: 'border-emerald-200',
        hover: 'hover:bg-emerald-50',
      },
      event: {
        bg: 'bg-amber-100',
        text: 'text-amber-800',
        border: 'border-amber-200',
        hover: 'hover:bg-amber-50',
      },
    };
    return colors[type] || colors.event;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Schedule</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Add Event
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingEvent ? 'Edit' : 'New'} Event</DialogTitle>
            </DialogHeader>
            <EventForm
              event={editingEvent}
              onSubmit={editingEvent ? handleEdit : handleCreate}
              onClose={() => {
                setIsDialogOpen(false);
                setEditingEvent(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className=" flex gap-6 flex-wrap xl:flex-nowrap">
        <Card className="w-full flex items-center flex-col">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <ShadcnCalendar
              mode="single"
              selected={date}
              onSelect={handleDateChange}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Daily Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {events && events.length > 0 ? (
                events.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${getEventColor(event.type).bg} ${getEventColor(event.type).text} ${getEventColor(event.type).border} ${getEventColor(event.type).hover} transition-shadow`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(event.start).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}{' '}
                          -{' '}
                          {new Date(event.end).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </p>
                        {event.location && (
                          <p className="text-sm text-gray-500">
                            {event.location}
                          </p>
                        )}

                        {event.recurring?.days?.length > 0 && (
                          <p className="text-sm text-blue-600">
                            Recurring every {event.recurring.days.join(', ')}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditClick(event)}
                          className="text-gray-600 hover:bg-gray-100 p-2 rounded"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:bg-red-50 p-2 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No events scheduled for this day
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
