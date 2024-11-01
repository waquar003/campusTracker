import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Trophy,
  Book,
  Clock,
  Target,
  Calendar,
  Flag,
  LogOut,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

const StatsCard = ({ title, value, icon, description }: StatsCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

interface AcademicGoal {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  auraPoints: number;
}

const Dashboard = () => {
  const [goals, setGoals] = useState<AcademicGoal[]>([
    {
      id: '1',
      title: 'Complete Database Project',
      dueDate: '2024-02-20',
      completed: false,
      auraPoints: 100,
    },
    {
      id: '2',
      title: 'Study for Algorithm Quiz',
      dueDate: '2024-02-25',
      completed: false,
      auraPoints: 50,
    },
  ]);

  const [userData, setUserData] = useState({
    name: '',
    level: 1,
    auraPoints: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(
          'http://localhost:4000/api/v1/user/profile',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUserData(response.data.data);
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('accessToken');
    window.location.href = '/auth';
  };

  const firstName = userData.name.split(' ')[0];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {firstName}!
          </h1>
          <p className="text-gray-600">
            Track your progress and stay motivated
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
              Level {userData.level}
            </div>
            <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm">
              {userData.auraPoints} XP
            </div>
          </div>
          <div className="border-l pl-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-red-600"
              onClick={handleLogout}
            >
              <User className="h-4 w-4" />
              <span className="font-medium">{firstName}</span>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Aura Points"
          value={userData.auraPoints}
          icon={<Trophy className="h-4 w-4 text-blue-600" />}
          description="+150 points this week"
        />
        <StatsCard
          title="Completed Chapters"
          value="24/36"
          icon={<Book className="h-4 w-4 text-green-600" />}
          description="6 chapters ahead of schedule"
        />
        <StatsCard
          title="Study Time"
          value="12.5 hrs"
          icon={<Clock className="h-4 w-4 text-orange-600" />}
          description="This week"
        />
        <StatsCard
          title="Goals Completed"
          value="8/10"
          icon={<Target className="h-4 w-4 text-purple-600" />}
          description="2 goals remaining"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5" />
              Academic Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{goal.title}</h3>
                    <p className="text-sm text-gray-600">
                      Due {new Date(goal.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-600">
                      +{goal.auraPoints} XP
                    </span>
                    <Button variant="outline" size="sm">
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  course: 'Database Systems',
                  time: '09:00 - 10:30',
                  room: 'Room 301',
                  professor: 'Dr. Smith',
                },
                {
                  course: 'Web Development',
                  time: '11:00 - 12:30',
                  room: 'Room 205',
                  professor: 'Prof. Johnson',
                },
                {
                  course: 'Algorithms',
                  time: '14:00 - 15:30',
                  room: 'Room 401',
                  professor: 'Dr. Brown',
                },
              ].map((class_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{class_.course}</h3>
                    <p className="text-sm text-gray-600">
                      {class_.time} • {class_.room}
                    </p>
                    <p className="text-sm text-gray-600">{class_.professor}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Check-in
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Database Systems</span>
                  <span className="text-sm text-gray-600">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Web Development</span>
                  <span className="text-sm text-gray-600">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">Algorithms</span>
                  <span className="text-sm text-gray-600">45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: 'Database Assignment',
                  due: 'Tomorrow',
                  points: 100,
                  type: 'assignment',
                },
                {
                  title: 'Web Dev Project',
                  due: 'In 3 days',
                  points: 200,
                  type: 'project',
                },
                {
                  title: 'Algorithm Quiz',
                  due: 'Next week',
                  points: 150,
                  type: 'quiz',
                },
              ].map((task, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-gray-600">Due {task.due}</p>
                  </div>
                  <div className="text-sm text-blue-600 font-medium">
                    +{task.points} XP
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
