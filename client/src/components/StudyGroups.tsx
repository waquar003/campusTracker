import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, Plus, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import {
  createGroup,
  joinGroup,
  fetchGroup,
} from '../store/slices/studyGroupSlice.js';

interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: number;
  maxMembers: number;
  level: number;
  nextSession: Date;
  description: string;
  tags: string[];
}

interface StudySession {
  id: string;
  groupId: string;
  startTime: Date;
  duration: number;
  topic: string;
  participants: number;
  meetLink: string;
}

const StudyGroups = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    subject: '',
    description: '',
    tags: '',
  });
  const [activeGroups, setActiveGroups] = useState<StudyGroup[]>([
    {
      id: '1',
      name: 'Database Masters',
      subject: 'Database Systems',
      members: 5,
      maxMembers: 8,
      level: 3,
      nextSession: new Date(2024, 9, 27, 14, 0),
      description: 'Advanced SQL and NoSQL concepts study group',
      tags: ['SQL', 'MongoDB', 'Database Design'],
    },
  ]);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);

  const [upcomingSessions] = useState<StudySession[]>([
    {
      id: '1',
      groupId: '1',
      startTime: new Date(2024, 9, 27, 14, 0),
      duration: 90,
      topic: 'Query Optimization',
      participants: 4,
      meetLink: 'https://meet.google.com/your-meeting-id',
    },
  ]);
  useEffect(() => {
    dispatch(fetchGroup());
  }, []);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { groups } = useSelector((state) => state.studyGroups);

  console.log(groups);

  const handleCreateGroup = () => {
    const newGroupData = {
      name: newGroup.name,
      subject: newGroup.subject,
      members: 1,
      creator: user._id,
      maxMembers: 8,
      level: 1,
      nextSession: new Date(),
      description: newGroup.description,
      tags: newGroup.tags.split(',').map((tag) => tag.trim()),
    };

    dispatch(createGroup(newGroupData));
    // setActiveGroups([...activeGroups, newGroupData]);
    setNewGroup({ name: '', subject: '', description: '', tags: '' });
    setIsCreateModalOpen(false);
  };

  const handleJoinGroup = (groupId: string) => {
    dispatch(joinGroup(groupId));
    user.studyGroups.push(user._id);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Study Groups</h1>
          <p className="text-gray-600">Join groups and learn together</p>
        </div>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Group
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {/* My Groups */}
          {user.studyGroups.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>My Groups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {groups
                    .filter((groups) => groups.members.includes(user._id))
                    .map((group) => (
                      <div
                        key={group._id}
                        className="p-4 border rounded-lg border-blue-200 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">
                              {group.name}
                            </h3>
                            <p className="text-gray-600">{group.subject}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                              Level {group.level}
                            </span>
                            <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                              {group.members.length}/{group.maxMembers}
                            </span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">
                          {group.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {group.tags.map((tag) => (
                            <span
                              key={tag}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            Next session:{' '}
                            {new Date(group.nextSession).toLocaleString(
                              'en-US',
                              {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Available Groups */}
          <Card>
            <CardHeader>
              <CardTitle>Available Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {groups
                  .filter((groups) => !groups.members.includes(user._id))
                  .map((group) => (
                    <div
                      key={group._id}
                      className="p-4 border rounded-lg hover:border-blue-200 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-lg">{group.name}</h3>
                          <p className="text-gray-600">{group.subject}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
                            Level {group.level}
                          </span>
                          <span className="bg-green-100 text-green-600 px-2 py-1 rounded text-sm">
                            {group.members}/{group.maxMembers}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        {group.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {group.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-between items-center">
                        <div className="text-sm text-gray-600">
                          Next session:{' '}
                          {new Date(group.nextSession).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                        <button
                          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                          onClick={() => handleJoinGroup(group._id)}
                        >
                          Join Group
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* TODO: HardCoded need to be removed after implementing the logic for upcoming sessions */}
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-3 border rounded-lg">
                    <div className="font-medium">{session.topic}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <Clock className="w-4 h-4" />
                      {new Date(session.startTime).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <Users className="w-4 h-4" />
                      {session.participants} participants
                    </div>
                    <a
                      href={session.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 w-full px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm text-center block"
                    >
                      Join Session
                    </a>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Study Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Sessions</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hours Studied</span>
                  <span className="font-medium">36</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Groups</span>
                  <span className="font-medium">{joinedGroupIds.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Group Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Study Group</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Group Name</label>
              <Input
                value={newGroup.name}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, name: e.target.value })
                }
                placeholder="Enter group name"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={newGroup.subject}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, subject: e.target.value })
                }
                placeholder="Enter subject"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newGroup.description}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, description: e.target.value })
                }
                placeholder="Enter group description"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Tags (comma-separated)
              </label>
              <Input
                value={newGroup.tags}
                onChange={(e) =>
                  setNewGroup({ ...newGroup, tags: e.target.value })
                }
                placeholder="e.g., SQL, Database, Programming"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudyGroups;
