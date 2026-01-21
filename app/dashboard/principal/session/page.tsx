'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Plus, X, Trash2, CheckCircle2, Clock, Pencil } from 'lucide-react';
import { toast } from 'sonner';

import { apiFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ConfirmDangerModal from '@/components/admin/ConfirmDangerModal';

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
  const [isEditSessionOpen, setIsEditSessionOpen] = useState(false);
  const [editSessionId, setEditSessionId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    sessionName: '',
    startDate: '',
    endDate: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

  const { data: sessions = [], isLoading } = useSessions();
  const { mutate: createSession } = useCreateSession();
  const { mutate: updateSession } = useUpdateSession();
  const { mutate: deleteSession } = useDeleteSession();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const toDateInputValue = (dateValue: any) => {
    const d = new Date(dateValue);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
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

    createSession(
      {
        name: formData.sessionName,
        startDate: formData.startDate,
        endDate: formData.endDate
      },
      {
        onSuccess: () => {
          toast.success('Session created successfully');
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Failed to create session');
        }
      }
    );

    setFormData({ sessionName: '', startDate: '', endDate: '' });
    setIsAddSessionOpen(false);
  };

  const handleCancel = () => {
    setFormData({ sessionName: '', startDate: '', endDate: '' });
    setIsAddSessionOpen(false);
  };

  const handleEditCancel = () => {
    setIsEditSessionOpen(false);
    setEditSessionId(null);
    setEditFormData({ sessionName: '', startDate: '', endDate: '' });
  };

  const handleEditOpen = (session: any) => {
    setEditSessionId(session._id);
    setEditFormData({
      sessionName: session.name || '',
      startDate: toDateInputValue(session.startDate),
      endDate: toDateInputValue(session.endDate)
    });
    setIsEditSessionOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!editSessionId) {
      toast.error('Invalid session');
      return;
    }

    const validationError = validateSessionDates(
      editFormData.startDate,
      editFormData.endDate
    );

    if (validationError) {
      toast.error(validationError);
      return;
    }

    updateSession(
      {
        id: editSessionId,
        data: {
          name: editFormData.sessionName,
          startDate: editFormData.startDate,
          endDate: editFormData.endDate
        }
      },
      {
        onSuccess: () => {
          toast.success('Session updated successfully');
          handleEditCancel();
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Failed to update session');
        }
      }
    );
  };

  const handleSetActive = (id: string) => {
    updateSession(
      {
        id,
        data: { isActive: true }
      },
      {
        onSuccess: () => {
          toast.success('Session switched successfully');
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Failed to switch session');
        }
      }
    );
  };

  const handleDelete = (id: string) => {
    const checkDeleteStatus = async () => {
      try {
        const res = await apiFetch(`/api/session/${id}/delete-status`);
        const canDelete = Boolean(res?.data?.canDelete);

        if (!canDelete) {
          toast.error('Cannot delete session because data is associated with it');
          return;
        }

        setDeleteSessionId(id);
      } catch (err: any) {
        toast.error(err?.message || 'Failed to check session delete status');
      }
    };

    checkDeleteStatus();
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
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 overflow-hidden min-h-screen">
      <ConfirmDangerModal
        open={Boolean(deleteSessionId)}
        title="Delete Session"
        description="Are you sure you want to delete this session? This action cannot be undone."
        confirmLabel="Delete"
        dangerLevel="high"
        onClose={() => setDeleteSessionId(null)}
        onConfirm={async () => {
          if (!deleteSessionId) return;

          await new Promise<void>((resolve) => {
            deleteSession(deleteSessionId, {
              onSuccess: () => {
                toast.success('Session deleted successfully');
                setDeleteSessionId(null);
                resolve();
              },
              onError: (err: any) => {
                toast.error(err?.message || 'Failed to delete session');
                resolve();
              }
            });
          });
        }}
      />

      <AnimatePresence>
        {isEditSessionOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          >
            <motion.div
              initial={{ scale: 0.98, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                      <Pencil className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Edit Session
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Update session name and dates
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleEditCancel}
                    className="h-10 w-10 rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Session Name
                      </Label>
                      <Input
                        name="sessionName"
                        placeholder="e.g., 2024-2025"
                        value={editFormData.sessionName}
                        onChange={handleEditInputChange}
                        required
                        className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Start Date
                      </Label>
                      <Input
                        type="date"
                        name="startDate"
                        value={editFormData.startDate}
                        onChange={handleEditInputChange}
                        required
                        className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        End Date
                      </Label>
                      <Input
                        type="date"
                        name="endDate"
                        value={editFormData.endDate}
                        onChange={handleEditInputChange}
                        required
                        className="h-12 border-2 focus:border-blue-500 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      type="submit"
                      className="flex-1 h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleEditCancel}
                      className="h-12 px-8 border-2 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit session"
                          className="h-11 w-11 rounded-xl transition-all duration-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950"
                          onClick={() => handleEditOpen(session)}
                        >
                          <Pencil className="w-5 h-5" />
                        </Button>
                      </motion.div>

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