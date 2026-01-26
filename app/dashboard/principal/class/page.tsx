'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, X, Users, Edit, Trash2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useStudentsClassWiseStats } from '@/app/querry/useStudent';
import { apiFetch } from '@/lib/api';

import {
  useClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass
} from '@/app/querry/useClasses';

interface Class {
  id: string;
  name: string;
  section: string;
  teacher?: string;
  studentCount: number;
  color?: string;
}

type BulkSections = {
  count: number;
  names: string[];
};

export default function ClassesPage() {
  const queryClient = useQueryClient();
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isBulkCreateOpen, setIsBulkCreateOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const [formData, setFormData] = useState({
    className: '',
    section: ''
  });

  const [bulkSelectedClasses, setBulkSelectedClasses] = useState<string[]>([]);
  const [bulkSections, setBulkSections] = useState<BulkSections>({ count: 1, names: ['A'] });
  const [isBulkCreating, setIsBulkCreating] = useState(false);

  const { data: classes = [], isLoading } = useClasses();
  const { mutate: createClass, isPending: isCreating } = useCreateClass();
  const { mutate: updateClass, isPending: isUpdating } = useUpdateClass();
  const { mutate: deleteClass } = useDeleteClass();
  const { data: classWiseStats = [] } = useStudentsClassWiseStats();

  const getClassSortKey = (nameRaw: string) => {
    const name = (nameRaw ?? '').trim().toUpperCase();
    if (name === 'LKG') return -2;
    if (name === 'UKG') return -1;
    const n = Number(name);
    if (Number.isFinite(n)) return n;
    return Number.MAX_SAFE_INTEGER;
  };

  const sortedClasses = [...classes].sort((a: Class, b: Class) => {
    const aKey = getClassSortKey(a.name);
    const bKey = getClassSortKey(b.name);
    if (aKey !== bKey) return aKey - bKey;

    const nameCompare = a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    if (nameCompare !== 0) return nameCompare;

    return (a.section ?? '').localeCompare(b.section ?? '', undefined, { numeric: true, sensitivity: 'base' });
  });

  const stats = {
    total: classes.length,
    withTeacher: classes.filter((c: Class) => c.teacher).length,

    totalStudents: classWiseStats.reduce(
      (sum, c) => sum + c.totalStudents,
      0
    ),

    needTeacher: classes.filter((c: Class) => !c.teacher).length
  };

  const bulkClassOptions = ['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  const resetBulkCreateState = () => {
    setBulkSelectedClasses([]);
    setBulkSections({ count: 1, names: ['A'] });
  };

  const toggleBulkClass = (className: string) => {
    setBulkSelectedClasses((prev) => {
      const isSelected = prev.includes(className);
      return isSelected ? prev.filter((c) => c !== className) : [...prev, className];
    });
  };

  const setBulkSectionCount = (countRaw: string) => {
    const count = Math.max(1, Math.min(20, Number(countRaw || 1)));

    setBulkSections((prev) => {
      const nextNames = [...(prev.names ?? [])];
      if (nextNames.length < count) {
        for (let i = nextNames.length; i < count; i += 1) nextNames.push('');
      }
      if (nextNames.length > count) nextNames.length = count;

      return {
        count,
        names: nextNames
      };
    });
  };

  const setBulkSectionName = (index: number, value: string) => {
    setBulkSections((prev) => {
      const nextNames = [...(prev.names ?? [])];
      nextNames[index] = value.toUpperCase();
      return {
        ...prev,
        names: nextNames
      };
    });
  };

  const handleBulkCreateSubmit = async () => {
    if (bulkSelectedClasses.length === 0) {
      toast.error('Please select at least one class');
      return;
    }

    if (!bulkSections.count || bulkSections.count < 1) {
      toast.error('Please enter number of sections');
      return;
    }

    const cleaned = (bulkSections.names ?? []).map((s) => (s ?? '').trim().toUpperCase());
    if (cleaned.length !== bulkSections.count || cleaned.some((s) => !s)) {
      toast.error('Please fill all section names');
      return;
    }
    if (cleaned.some((s) => /[a-z]/.test(s))) {
      toast.error('Section names must be in UPPERCASE only');
      return;
    }
    if (new Set(cleaned).size !== cleaned.length) {
      toast.error('Section names must be unique');
      return;
    }

    const existingPairs = new Set(
      (classes ?? []).map((c: Class) => `${(c.name ?? '').trim().toUpperCase()}__${(c.section ?? '').trim().toUpperCase()}`)
    );

    const duplicates: string[] = [];
    for (const className of bulkSelectedClasses) {
      for (const sectionName of cleaned) {
        const key = `${(className ?? '').trim().toUpperCase()}__${(sectionName ?? '').trim().toUpperCase()}`;
        if (existingPairs.has(key)) duplicates.push(`${className}-${sectionName}`);
      }
    }

    if (duplicates.length > 0) {
      const preview = duplicates.slice(0, 8).join(', ');
      const suffix = duplicates.length > 8 ? ` (+${duplicates.length - 8} more)` : '';
      toast.error(`These class sections already exist: ${preview}${suffix}`);
      return;
    }

    const toastId = toast.loading('Creating classes...');
    setIsBulkCreating(true);

    try {
      const requests: Promise<unknown>[] = [];
      for (const className of bulkSelectedClasses) {
        for (const sectionName of cleaned) {
          requests.push(
            apiFetch('/api/class', {
              method: 'POST',
              body: JSON.stringify({ name: className, section: sectionName })
            })
          );
        }
      }

      const results = await Promise.allSettled(requests);
      const successCount = results.filter((r) => r.status === 'fulfilled').length;

      const failed = results.filter(
        (r): r is PromiseRejectedResult => r.status === 'rejected'
      );
      const failedCount = failed.length;

      const extractErrorMessage = (reason: any) =>
        reason?.response?.data?.message || reason?.message || String(reason);

      const alreadyExistsFailures = failed.filter((r) => {
        const msg = extractErrorMessage(r.reason);
        return typeof msg === 'string' && msg.toLowerCase().includes('already exists');
      }).length;
      const otherFailures = failedCount - alreadyExistsFailures;

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['classes'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      ]);
      await queryClient.refetchQueries({ queryKey: ['classes'] });

      toast.dismiss(toastId);
      if (failedCount === 0) {
        toast.success(`Created ${successCount} class section(s) successfully!`);
        setIsBulkCreateOpen(false);
        resetBulkCreateState();
      } else {
        if (alreadyExistsFailures > 0 && otherFailures === 0) {
          toast.error(
            `Some class sections already exist. Created ${successCount}. Skipped ${alreadyExistsFailures}.`
          );
        } else if (alreadyExistsFailures > 0 && otherFailures > 0) {
          toast.error(
            `Created ${successCount}. Already exists: ${alreadyExistsFailures}. Other failures: ${otherFailures}.`
          );
        } else {
          toast.error(`Created ${successCount} class section(s). Failed: ${failedCount}.`);
        }
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create classes';

      if (typeof errorMessage === 'string' && errorMessage.includes('No active academic session')) {
        toast.error('No active session found. Please create or activate a session first.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsBulkCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'section') {
      if (/[a-z]/.test(value)) {
        toast.error('Section must be in UPPERCASE only');
        return;
      }
      setFormData({ ...formData, [name]: value.toUpperCase() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.className || !formData.section) {
      toast.error('Please fill in all required fields');
      return;
    }

    const toastId = toast.loading('Creating class...');
    createClass(
      {
        name: formData.className,
        section: formData.section
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('Class created successfully!');
          setFormData({ className: '', section: '' });
          setIsAddClassOpen(false);
        },
        onError: (error: any) => {
          toast.dismiss(toastId);

          const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create class';

          if (errorMessage.includes('No active academic session')) {
            toast.error('No active session found. Please create or activate a session first.');
          } else if (errorMessage.includes('already exists')) {
            toast.error('This class already exists for the current session');
          } else {
            toast.error(errorMessage);
          }
        }
      }
    );
  };

  const handleEditClick = (cls: Class) => {
    setEditingClass(cls);
    setFormData({
      className: cls.name,
      section: cls.section
    });
    setIsEditOpen(true);
  };

  const handleEditSubmit = () => {
    if (!editingClass) return;

    if (!formData.className || !formData.section) {
      toast.error('Please fill in all required fields');
      return;
    }

    const toastId = toast.loading('Updating class...');
    updateClass(
      {
        id: editingClass.id,
        data: {
          name: formData.className,
          section: formData.section
        }
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success('Class updated successfully!');
          setIsEditOpen(false);
          setEditingClass(null);
        },
        onError: (error: any) => {
          toast.dismiss(toastId);

          const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update class';

          if (errorMessage.includes('No active session')) {
            toast.error('No active session found. Please activate a session first.');
          } else {
            toast.error(errorMessage);
          }
        }
      }
    );
  };

  const handleDelete = (id: string, className: string, section: string) => {
    toast.custom(
      (t) => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
              <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Delete Class
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{className} - {section}</span>? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    toast.dismiss(t);
                  }}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(t);
                    const loadingId = toast.loading('Deleting class...');

                    deleteClass(id, {
                      onSuccess: () => {
                        toast.dismiss(loadingId);
                        toast.success('Class deleted successfully!');
                      },
                      onError: (error: any) => {
                        toast.dismiss(loadingId);

                        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete class';

                        if (errorMessage.includes('No active session')) {
                          toast.error('No active session found. Please activate a session first.');
                        } else {
                          toast.error(errorMessage);
                        }
                      }
                    });
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: 'top-center',
      }
    );
  };

  const studentCountMap = classWiseStats.reduce<Record<string, number>>(
    (acc, stat) => {
      acc[`${stat.classId}`] = stat.totalStudents;
      return acc;
    },
    {}
  );

  const statsData = [
    { label: 'Total Classes', value: stats.total, bgGradient: 'from-purple-500 to-blue-500', icon: BookOpen },
    { label: 'Total Students', value: stats.totalStudents, bgGradient: 'from-blue-500 to-indigo-500', icon: Users },
    { label: 'With Teachers', value: stats.withTeacher, bgGradient: 'from-indigo-500 to-purple-500', icon: Users },
    { label: 'Need Teachers', value: stats.needTeacher, bgGradient: 'from-purple-400 to-blue-400', icon: Users }
  ];

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 overflow-hidden min-h-screen">
      <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-900 shadow-2xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                School's Classes
              </h1>
              <p className="mt-2 text-sm sm:text-base text-purple-100 font-medium">
                View and manage your school's classes
              </p>
            </div>
            <button
              onClick={() => setIsAddClassOpen(!isAddClassOpen)}
              className="px-4 mx-3 sm:px-6 py-2.5 sm:py-3 bg-white/95 backdrop-blur-sm text-purple-600 rounded-xl text-sm font-semibold hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center border border-purple-200/50"
            >
              {isAddClassOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> : <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />}
              <span>{isAddClassOpen ? 'Cancel' : 'Add Class'}</span>
            </button>
            <button
              onClick={() => setIsBulkCreateOpen(true)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/95 backdrop-blur-sm text-indigo-600 rounded-xl text-sm font-semibold hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center border border-indigo-200/50"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span>Bulk Create</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-200/50 dark:border-purple-700/30 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.bgGradient}`}></div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-lg`}>
                      <stat.icon className="w-5 h-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">
                    {stat.label}
                  </p>

                  <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {isAddClassOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                      <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">Add New Class</h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Create a new class for your school</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Class Name</Label>
                      <Input
                        name="className"
                        placeholder="Class Name"
                        value={formData.className}
                        onChange={handleInputChange}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Section</Label>
                      <Input
                        name="section"
                        placeholder="Section"
                        value={formData.section}
                        onChange={handleInputChange}
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isCreating}
                    className="mt-6 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCreating ? 'Creating...' : 'Create Class'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isLoading ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">Loading classes...</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No classes found. Create your first class to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {sortedClasses.map((cls: Class, index: number) => (
                <motion.div
                  key={`${cls.id}-${index}`}
                  className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 flex flex-col transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {cls.name} - {cls.section}
                  </h3>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {cls.teacher || 'No teacher assigned'}
                  </p>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <Users size={14} className="mr-1" />
                    {studentCountMap[cls.id] ?? 0} students
                  </div>

                  <div className="mt-auto flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(cls)}
                      className="flex-1 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
                    >
                      <Edit size={14} />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(cls.id, cls.name, cls.section)}
                      className="text-red-500 flex-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsEditOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Class</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Class Name</Label>
                  <select
                    name="className"
                    value={formData.className}
                    onChange={handleSelectChange}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    {[
                      { label: 'Class 1', value: '1' },
                      { label: 'Class 2', value: '2' },
                      { label: 'Class 3', value: '3' },
                      { label: 'Class 4', value: '4' },
                      { label: 'Class 5', value: '5' },
                      { label: 'Class 6', value: '6' },
                      { label: 'Class 7', value: '7' },
                      { label: 'Class 8', value: '8' },
                      { label: 'Class 9', value: '9' },
                      { label: 'Class 10', value: '10' },
                      { label: 'Class 11', value: '11' },
                      { label: 'Class 12', value: '12' }
                    ].map((cls) => (
                      <option key={cls.value} value={cls.value}>
                        {cls.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Section</Label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleSelectChange}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    {['A', 'B', 'C', 'D'].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <button
                  onClick={handleEditSubmit}
                  disabled={isUpdating}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-br from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isBulkCreateOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setIsBulkCreateOpen(false);
              resetBulkCreateState();
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-3xl"
            >
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Bulk Create Classes</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Select classes and define their sections</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsBulkCreateOpen(false);
                    resetBulkCreateState();
                  }}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                >
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Classes</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                    {bulkClassOptions.map((c) => {
                      const checked = bulkSelectedClasses.includes(c);
                      return (
                        <label
                          key={c}
                          className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                            checked
                              ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700'
                              : 'bg-white/70 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleBulkClass(c)}
                            className="h-4 w-4"
                          />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{c}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Sections</div>
                  {bulkSelectedClasses.length === 0 ? (
                    <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center text-sm text-gray-600 dark:text-gray-400">
                      Select one or more classes to configure sections.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-white/80 dark:bg-gray-900/20 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                          <div className="text-base font-bold text-gray-900 dark:text-white">
                            Selected: {bulkSelectedClasses.join(', ')}
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">No. of sections</Label>
                            <Input
                              type="number"
                              value={bulkSections.count}
                              min={1}
                              max={20}
                              onChange={(e) => setBulkSectionCount(e.target.value)}
                              className="w-24 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[45vh] overflow-auto pr-1">
                          {Array.from({ length: bulkSections.count }).map((_, idx) => (
                            <div key={idx} className="space-y-1">
                              <Label className="text-xs font-medium text-gray-700 dark:text-gray-300">Section {idx + 1}</Label>
                              <Input
                                value={bulkSections.names?.[idx] ?? ''}
                                onChange={(e) => setBulkSectionName(idx, e.target.value)}
                                placeholder="A"
                                className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsBulkCreateOpen(false);
                    resetBulkCreateState();
                  }}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <button
                  onClick={handleBulkCreateSubmit}
                  disabled={isBulkCreating}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBulkCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}