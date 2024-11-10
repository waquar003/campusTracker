import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Target,
  CheckCircle2,
  Circle,
  PlusCircle,
  X,
  Trash2,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchAcademicGoals,
  createAcademicGoal,
  markGoalComplete,
  deleteAcademicGoal,
} from '@/store/slices/AcademicGoalSlice';

interface Goal {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  completed: boolean;
}

const NewGoalModal = ({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: Omit<Goal, 'id' | 'completed'>) => void;
}) => {
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    deadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      title: newGoal.title,
      description: newGoal.description,
      deadline: new Date(newGoal.deadline),
    });
    setNewGoal({ title: '', description: '', deadline: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Goal</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={newGoal.description}
              onChange={(e) =>
                setNewGoal({ ...newGoal, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Deadline
            </label>
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) =>
                setNewGoal({ ...newGoal, deadline: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 p-2"
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AcademicGoals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const { goals } = useSelector((state: any) => state.academicGoals) || [];

  console.log(goals);

  //TODO: add the feature to immediately show the marked goals
  useEffect(() => {
    dispatch(fetchAcademicGoals());
  }, [dispatch]);

  const toggleGoalCompletion = async (goalId: string) => {
    await dispatch(markGoalComplete(goalId));
  };

  const handleAddGoal = async (newGoal: Omit<Goal, 'id' | 'completed'>) => {
    await dispatch(createAcademicGoal(newGoal));
    setIsModalOpen(false);
  };

  const deleteGoal = async (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      await dispatch(deleteAcademicGoal(goalId));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Academic Goals</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusCircle className="w-5 h-5" />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" />
                {goal.title}
              </CardTitle>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleGoalCompletion(goal.id)}
                  className="text-gray-600 hover:text-blue-600"
                >
                  {goal.completed ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </button>
                <button
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-600 hover:text-red-600"
                >
                  <Trash2 className="w-6 h-6" />
                </button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-2">{goal.description}</p>
              <p className="text-sm text-gray-500">
                Deadline: {new Date(goal.deadline).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <NewGoalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddGoal}
      />
    </div>
  );
};

export default AcademicGoals;
