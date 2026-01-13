'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, X, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  useSessions,
  useCreateSession,
  useUpdateSession,
  useDeleteSession
} from '@/app/querry/useSessions';

export default function SessionsPage() {
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [formData, setFormData] = useState({
    sessionName: '',
    startDate: '',
    endDate: ''
  });

  const { data: sessions = [], isLoading } = useSessions();
  const { mutate: createSession } = useCreateSession();
  const { mutate: updateSession } = useUpdateSession();
  const { mutate: deleteSession } = useDeleteSession();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* =========================
     ✅ MAX 1 YEAR VALIDATION
  ========================= */
  const isWithinOneYear = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return false;
    }

    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    return diffInDays <= 365;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ validation (NO UI change)
    if (!isWithinOneYear(formData.startDate, formData.endDate)) {
      alert('Session duration cannot be more than one year');
      return;
    }

    createSession({
      name: formData.sessionName,
      startDate: formData.startDate,
      endDate: formData.endDate
    });

    setFormData({ sessionName: '', startDate: '', endDate: '' });
    setIsAddSessionOpen(false);
  };

  const handleCancel = () => {
    setFormData({ sessionName: '', startDate: '', endDate: '' });
    setIsAddSessionOpen(false);
  };

  const handleSetActive = (id: string) => {
    updateSession({
      id,
      data: { isActive: true }
    });
  };

  const handleDelete = (id: string) => {
    deleteSession(id);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return dateString.split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Sessions Management
              </h1>
              <p className="text-blue-100">
                View and manage your school's academic sessions
              </p>
            </div>
            <button
              onClick={() => setIsAddSessionOpen(!isAddSessionOpen)}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-medium shadow-lg flex items-center"
            >
              {isAddSessionOpen ? (
                <>
                  <X className="w-5 h-5 mr-2" /> Cancel
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" /> Add Session
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 space-y-8">
        {/* Add Session */}
        <AnimatePresence>
          {isAddSessionOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>Session Name</Label>
                    <Input
                      name="sessionName"
                      value={formData.sessionName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>Start Date</Label>
                    <Input
                      type="date"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <Input
                      type="date"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSubmit}>Create Session</Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sessions List */}
        {isLoading ? (
          <p className="text-center">Loading sessions...</p>
        ) : (
          sessions.map((session: any, i: number) => (
            <motion.div
              key={`${session._id}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 ${
                session.isActive ? 'border-2 border-teal-500' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Calendar className="w-8 h-8 text-teal-500" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{session.name}</h3>
                      {session.isActive && <Badge>Active</Badge>}
                    </div>
                    <p className="text-sm text-gray-500">
                      {formatDate(session.startDate)} –{' '}
                      {formatDate(session.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {!session.isActive && (
                    <Button onClick={() => handleSetActive(session._id)}>
                      Set Active
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={session.isActive}
                    title={
                      session.isActive
                        ? 'Active session cannot be deleted'
                        : 'Delete session'
                    }
                    className={`rounded-xl ${
                      session.isActive
                        ? 'text-gray-400 cursor-not-allowed opacity-50'
                        : 'text-red-500 hover:bg-red-50'
                    }`}
                    onClick={() => {
                      if (!session.isActive) {
                        handleDelete(session._id);
                      }
                    }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </main>
    </div>
  );
}
