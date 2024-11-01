import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Calendar as ShadcnCalendar } from '@/components/ui/calendar';
import { Clock } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

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
    startDate: event?.start ? format(event.start, 'yyyy-MM-dd') : '',
    startTime: event?.start ? format(event.start, 'HH:mm') : '',
    endDate: event?.end ? format(event.end, 'yyyy-MM-dd') : '',
    endTime: event?.end ? format(event.end, 'HH:mm') : '',
    isRecurring: !!event?.recurring,
    recurringDays: event?.recurring?.days || [],
    recurringUntil: event?.recurring?.until
      ? format(event.recurring.until, 'yyyy-MM-dd')
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
      start: startDateTime,
      end: endDateTime,
    };

    if (formData.isRecurring && formData.recurringDays.length > 0) {
      eventData.recurring = {
        days: formData.recurringDays,
        until: new Date(formData.recurringUntil),
      };
    }

    onSubmit(eventData);
    onClose();
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
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [events, setEvents] = useState<Event[]>([]);

  const handleCreate = (data: Partial<Event>) => {
    const newEvent = {
      ...data,
      id: Date.now().toString(),
    } as Event;
    setEvents([...events, newEvent]);
  };

  const handleEdit = (data: Partial<Event>) => {
    setEvents(
      events.map((e) => (e.id === editingEvent?.id ? { ...e, ...data } : e))
    );
    setEditingEvent(undefined);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  const getDayEvents = (date: Date | undefined) => {
    if (!date) return [];
    return events
      .filter((event) => {
        if (isSameDay(event.start, date)) return true;
        if (event.recurring) {
          const eventDay = event.start.getDay();
          const selectedDay = date.getDay();
          return (
            event.recurring.days.includes(
              [
                'sunday',
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
              ][selectedDay]
            ) && date <= event.recurring.until
          );
        }
        return false;
      })
      .sort((a, b) => a.start.getTime() - b.start.getTime());
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <ShadcnCalendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Daily Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getDayEvents(date).length > 0 ? (
                getDayEvents(date).map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${getEventColor(event.type).bg} ${getEventColor(event.type).text} ${getEventColor(event.type).border} ${getEventColor(event.type).hover} transition-shadow`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{event.title}</h3>
                        <p className="text-sm text-gray-500">
                          {format(event.start, 'HH:mm')} -{' '}
                          {format(event.end, 'HH:mm')}
                        </p>
                        {event.location && (
                          <p className="text-sm text-gray-500">
                            {event.location}
                          </p>
                        )}
                        {event.recurring && (
                          <p className="text-sm text-blue-600">
                            Recurring every {event.recurring.days.join(', ')}{' '}
                            until {format(event.recurring.until, 'MMM d, yyyy')}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setIsDialogOpen(true);
                          }}
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
