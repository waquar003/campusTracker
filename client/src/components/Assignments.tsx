import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  fetchAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from '@/store/slices/assignmentSlice';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useDispatch } from 'react-redux';

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'overdue';
  description: string;
  priority: 'high' | 'medium' | 'low';
  auraPoints: number;
}

const AssignmentForm = ({
  assignment,
  onSubmit,
  onClose,
}: {
  assignment?: Assignment;
  onSubmit: (data: Partial<Assignment>) => void;
  onClose: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: assignment?.title || '',
    course: assignment?.course || '',
    dueDate: assignment?.dueDate
      ? new Date(assignment.dueDate).toISOString().split('T')[0]
      : '',
    status: assignment?.status || 'pending',
    description: assignment?.description || '',
    priority: assignment?.priority || 'medium',
    auraPoints: assignment?.auraPoints || 10,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dueDate: new Date(formData.dueDate),
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Course
        </label>
        <input
          type="text"
          value={formData.course}
          onChange={(e) => setFormData({ ...formData, course: e.target.value })}
          className="mt-1 block w-full rounded-md border p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) =>
            setFormData({ ...formData, dueDate: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as Assignment['status'],
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          value={formData.priority}
          onChange={(e) =>
            setFormData({
              ...formData,
              priority: e.target.value as Assignment['priority'],
            })
          }
          className="mt-1 block w-full rounded-md border p-2"
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Aura Points
        </label>
        <input
          type="number"
          value={formData.auraPoints}
          onChange={(e) =>
            setFormData({ ...formData, auraPoints: parseInt(e.target.value) })
          }
          className="mt-1 block w-full rounded-md border p-2"
          min="0"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="mt-1 block w-full rounded-md border p-2"
          rows={3}
          required
        />
      </div>
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
          {assignment ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

const Assignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Database Design Project',
      course: 'Database Systems',
      dueDate: new Date('2024-02-15'),
      status: 'pending',
      description:
        'Design and implement a database schema for a university system',
      priority: 'high',
      auraPoints: 50,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<
    Assignment | undefined
  >();

  const dispatch = useDispatch();
  const isAuthenticated = localStorage.getItem('isAuthenticated');

  useEffect(() => {
    console.log('Assignment.tsx: ', isAuthenticated);
    if (isAuthenticated) {
      console.log('Fetching Assignment');
      dispatch(fetchAssignments());
    }
  }, [dispatch, isAuthenticated]);

  // const handleCreate = (data: Partial<Assignment>) => {
  // const newAssignment = {
  //   ...data,
  //   id: Date.now().toString(),
  // } as Assignment;
  // setAssignments([...assignments, newAssignment]);
  // };

  const handleCreate = async (data) => {
    await dispatch(createAssignment(data));
    setIsDialogOpen(false);
  };

  // const handleEdit = (data: Partial<Assignment>) => {
  //   setAssignments(
  //     assignments.map((a) =>
  //       a.id === editingAssignment?.id ? { ...a, ...data } : a
  //     )
  //   );
  //   setEditingAssignment(undefined);
  // };
  const handleEdit = async (data) => {
    console.log('Edit triggered with data:', data);
    console.log(editingAssignment);
    if (editingAssignment?._id) {
      const updateData = {
        id: editingAssignment._id,
        data: {
          title: data.title,
          course: data.course,
          dueDate: data.dueDate,
          status: data.status,
          description: data.description,
          priority: data.priority,
          auraPointa: data.auraPoints,
        },
      };
      console.log('Dispatching update with:', updateData);
      await dispatch(updateAssignment(updateData));
      dispatch(fetchAssignments());
    }
    setIsDialogOpen(false);
    setEditingAssignment(undefined);
  };

  const handleEditClick = (assignment) => {
    console.log('Editing assignment:', assignment); // Debug log
    setAssignments({
      ...assignment,
      dueDate: new Date(assignment.start),
      status: assignment.status,
      priority: assignment.priority,
      auraPoints: assignment.auraPoints,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      await dispatch(deleteAssignment(id));
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || colors.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      high: 'bg-red-50 text-red-700 border-red-200',
      medium: 'bg-orange-50 text-orange-700 border-orange-200',
      low: 'bg-green-50 text-green-700 border-green-200',
    };
    return badges[priority];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Assignments</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              New Assignment
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingAssignment ? 'Edit' : 'New'} Assignment
              </DialogTitle>
            </DialogHeader>
            <AssignmentForm
              assignment={editingAssignment}
              onSubmit={editingAssignment ? handleEdit : handleCreate}
              onClose={() => {
                setIsDialogOpen(false);
                setEditingAssignment(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {assignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{assignment.title}</CardTitle>
                  <p className="text-sm text-gray-500">{assignment.course}</p>
                  <div className="flex gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getStatusColor(assignment.status)}`}
                    >
                      {assignment.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm border ${getPriorityBadge(assignment.priority)}`}
                    >
                      {assignment.priority} priority
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      {assignment.auraPoints} points
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    onClick={() => {
                      setEditingAssignment(assignment);
                      setIsDialogOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    onClick={() => handleDelete(assignment.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{assignment.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Due: {assignment.dueDate.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
