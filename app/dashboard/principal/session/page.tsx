'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, X, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

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
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const { data: sessions = [], isLoading } = useSessions();
  const { mutate: createSession } = useCreateSession();
  const { mutate: updateSession } = useUpdateSession();
  const { mutate: deleteSession } = useDeleteSession();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateSessionDates = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return 'Invalid start or end date';
    }

    if (endDate.getTime() < startDate.getTime()) {
      return 'End date cannot be smaller than start date';
    }

    const diffInMs = endDate.getTime() - startDate.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const maxDays = 730;

    if (diffInDays > maxDays) {
      return `Session duration cannot be more than ${maxDays} days`;
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateSessionDates(
      formData.startDate,
      formData.endDate
    );

    if (validationError) {
      toast.error(validationError);
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isFormValid = formData.sessionName && formData.startDate && formData.endDate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-5"></div>
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white tracking-tight">
                Sessions Management
              </h1>
              <p className="text-blue-100 text-lg">
                View and manage your school's academic sessions
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddSessionOpen(!isAddSessionOpen)}
              className="px-8 py-3.5 bg-white text-blue-600 rounded-xl font-semibold shadow-2xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-all duration-200"
            >
              {isAddSessionOpen ? (
                <>
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add New Session</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Add Session Form */}
        <AnimatePresence>
          {isAddSessionOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0, y: -20 }}
              animate={{ height: 'auto', opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Create New Session
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Fill in the details to create a new academic session
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Session Name */}
                      <motion.div
                        className="space-y-2"
                        animate={{
                          scale: focusedField === 'sessionName' ? 1.02 : 1
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Session Name
                        </Label>
                        <div className="relative">
                          <Input
                            name="sessionName"
                            placeholder="e.g., 2024-2025"
                            value={formData.sessionName}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('sessionName')}
                            onBlur={() => setFocusedField(null)}
                            required
                            className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
                          />
                          {formData.sessionName && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>

                      {/* Start Date */}
                      <motion.div
                        className="space-y-2"
                        animate={{
                          scale: focusedField === 'startDate' ? 1.02 : 1
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Start Date
                        </Label>
                        <div className="relative">
                          <Input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('startDate')}
                            onBlur={() => setFocusedField(null)}
                            required
                            className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
                          />
                          {formData.startDate && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>

                      {/* End Date */}
                      <motion.div
                        className="space-y-2"
                        animate={{
                          scale: focusedField === 'endDate' ? 1.02 : 1
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          End Date
                        </Label>
                        <div className="relative">
                          <Input
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            onFocus={() => setFocusedField('endDate')}
                            onBlur={() => setFocusedField(null)}
                            required
                            className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
                          />
                          {formData.endDate && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                            >
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          onClick={handleSubmit}
                          disabled={!isFormValid}
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Create Session
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          className="h-12 px-8 border-2 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sessions List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Loading sessions...</p>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No Sessions Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Click "Add New Session" to create your first academic session
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session: any, i: number) => (
              <motion.div
                key={`${session._id}-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                whileHover={{ y: -2, transition: { duration: 0.2 } }}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  session.isActive
                    ? 'ring-2 ring-teal-500 ring-offset-2 dark:ring-offset-gray-900'
                    : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-4 rounded-2xl ${
                          session.isActive
                            ? 'bg-gradient-to-br from-teal-500 to-emerald-600'
                            : 'bg-gradient-to-br from-blue-500 to-purple-600'
                        }`}
                      >
                        {session.isActive ? (
                          <Clock className="w-7 h-7 text-white" />
                        ) : (
                          <Calendar className="w-7 h-7 text-white" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {session.name}
                          </h3>
                          {session.isActive && (
                            <Badge className="bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300 font-semibold px-3 py-1">
                              Active Session
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4" />
                          <p className="text-sm font-medium">
                            {formatDate(session.startDate)} – {formatDate(session.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 lg:ml-auto">
                      {!session.isActive && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => handleSetActive(session._id)}
                            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-semibold px-6 h-11 rounded-xl shadow-md"
                          >
                            Set Active
                          </Button>
                        </motion.div>
                      )}

                      <motion.div
                        whileHover={{ scale: session.isActive ? 1 : 1.05 }}
                        whileTap={{ scale: session.isActive ? 1 : 0.95 }}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={session.isActive}
                          title={
                            session.isActive
                              ? 'Active session cannot be deleted'
                              : 'Delete session'
                          }
                          className={`h-11 w-11 rounded-xl transition-all duration-200 ${
                            session.isActive
                              ? 'text-gray-300 cursor-not-allowed opacity-40'
                              : 'text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950'
                          }`}
                          onClick={() => {
                            if (!session.isActive) {
                              handleDelete(session._id);
                            }
                          }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}