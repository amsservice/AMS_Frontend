




'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, X, Mail, BookOpen, Trash2, Edit, UserX } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  useTeachers,
  useCreateTeacher,
  useDeleteTeacher,
  useAssignClassToTeacher,
  useDeactivateTeacher,
  useSwapTeacherClasses
} from '@/app/querry/useTeachers';

import { useClasses } from '@/app/querry/useClasses';

/* ================= TYPES ================= */

interface Class {
  id: string;
  name: string;
  section: string;
  sessionId: string;
  teacherId?: string | null;
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'pending';
  currentClass?: {
    classId: string;
    className: string;
    section: string;
  };
}

/* ================= COMPONENT ================= */

export default function TeachersPage() {
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [assigningTeacherId, setAssigningTeacherId] = useState<string | null>(null);
  const [swappingTeacherId, setSwappingTeacherId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  /* ================= API ================= */

  const { data: teachers = [], isLoading } = useTeachers();
  const { data: classes = [] } = useClasses();

  const { mutate: createTeacher } = useCreateTeacher();
  const { mutate: deleteTeacher } = useDeleteTeacher();
  const { mutate: deactivateTeacher } = useDeactivateTeacher();
  const assignClassMutation = useAssignClassToTeacher();
  const swapClassMutation = useSwapTeacherClasses();

  /* ================= HANDLERS ================= */

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();

    createTeacher(formData);
    setFormData({ name: '', email: '', password: '' });
    setIsAddTeacherOpen(false);
  };

  const handleAssignClass = () => {
    if (!assigningTeacherId || !selectedClassId) return;

    const selectedClass = classes.find(
      (cls: Class) => cls.id === selectedClassId
    );

    if (!selectedClass) return;

    assignClassMutation.mutate({
      teacherId: assigningTeacherId,
      classId: selectedClass.id,
      sessionId: selectedClass.sessionId,
      className: selectedClass.name,
      section: selectedClass.section
    });

    setAssigningTeacherId(null);
    setSelectedClassId('');
  };

  const handleSwapClass = () => {
    if (!swappingTeacherId || !selectedClassId) return;

    const swappingTeacher = teachers.find((t: Teacher) => t.id === swappingTeacherId);
    const targetClass = classes.find((cls: Class) => cls.id === selectedClassId);

    if (!swappingTeacher || !targetClass || !swappingTeacher.currentClass) return;

    // If target class has a teacher, swap them
    if (targetClass.teacherId) {
      const targetTeacher = teachers.find((t: Teacher) => t.id === targetClass.teacherId);
      if (!targetTeacher || !targetTeacher.currentClass) return;

      swapClassMutation.mutate({
        sessionId: targetClass.sessionId,
        teacherAId: swappingTeacher.id,
        classAId: swappingTeacher.currentClass.classId,
        classAName: swappingTeacher.currentClass.className,
        sectionA: swappingTeacher.currentClass.section,
        teacherBId: targetTeacher.id,
        classBId: targetClass.id,
        classBName: targetClass.name,
        sectionB: targetClass.section
      });
    } else {
      // If target class is empty, just reassign
      assignClassMutation.mutate({
        teacherId: swappingTeacher.id,
        classId: targetClass.id,
        sessionId: targetClass.sessionId,
        className: targetClass.name,
        section: targetClass.section
      });
    }

    setSwappingTeacherId(null);
    setSelectedClassId('');
  };

  const stats = [
    { label: 'Total Teachers', value: teachers.length, color: 'accent-blue' },
    { label: 'Active', value: teachers.filter((t: Teacher) => t.status === 'active').length, color: 'accent-green' },
    { label: 'Pending', value: teachers.filter((t: Teacher) => t.status === 'pending').length, color: 'accent-orange' },
    { label: 'Assigned', value: teachers.filter((t: Teacher) => t.currentClass).length, color: 'accent-purple' }
  ];

  /* ================= UI ================= */

  return (
    <div className="space-y-4 lg:pt-3 lg:space-y-6">
      {/* Welcome Section with Add Teacher Button - Desktop */}
      <div className="hidden lg:flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold dashboard-text mb-1">Teachers Management 👥</h2>
          <p className="text-sm dashboard-text-muted">
            Manage teachers and class assignments
          </p>
        </div>
        <button
          className="accent-blue text-white font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
          onClick={() => setIsAddTeacherOpen(!isAddTeacherOpen)}
        >
          {isAddTeacherOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          <span>{isAddTeacherOpen ? 'Cancel' : 'Add Teacher'}</span>
        </button>
      </div>

      {/* Mobile Welcome Section */}
      <div className="lg:hidden">
        <h2 className="text-xl font-bold dashboard-text mb-1">Teachers Management 👥</h2>
        <p className="text-sm dashboard-text-muted">
          Manage teachers and class assignments
        </p>
      </div>

      {/* Add Teacher Button - Mobile Only */}
      <button
        className="lg:hidden w-full accent-blue text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg"
        onClick={() => setIsAddTeacherOpen(!isAddTeacherOpen)}
      >
        {isAddTeacherOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
        <span>{isAddTeacherOpen ? 'Cancel' : 'Add Teacher'}</span>
      </button>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="dashboard-card border rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-3 lg:gap-4">
              <div className={`${stat.color} p-2.5 lg:p-3 rounded-xl w-fit`}>
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <div className="text-xs dashboard-text-muted mb-1">{stat.label}</div>
                <div className="text-2xl lg:text-4xl font-bold dashboard-text">{stat.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Teacher Form */}
      <AnimatePresence>
        {isAddTeacherOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="dashboard-card border rounded-xl p-4 lg:p-6">
              <h3 className="text-base lg:text-xl font-semibold dashboard-text mb-1">
                Add New Teacher
              </h3>
              <p className="text-xs lg:text-sm dashboard-text-muted mb-4 lg:mb-6">
                Create a new teacher account
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs lg:text-sm dashboard-text-muted">Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="dashboard-card border dashboard-card-border dashboard-text"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs lg:text-sm dashboard-text-muted">Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="dashboard-card border dashboard-card-border dashboard-text"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs lg:text-sm dashboard-text-muted">Password</Label>
                  <Input
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="dashboard-card border dashboard-card-border dashboard-text"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={handleAddTeacher}
                  className="accent-teal text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Create Teacher
                </button>
                <Button
                  variant="outline"
                  onClick={() => setIsAddTeacherOpen(false)}
                  className="dashboard-card border dashboard-card-border dashboard-text"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teachers Table */}
      <div className="dashboard-card border rounded-xl overflow-hidden">
        <div className="px-4 lg:px-6 py-4 border-b dashboard-card-border">
          <h3 className="text-base lg:text-xl font-semibold dashboard-text mb-1">
            All Teachers
          </h3>
          <p className="text-xs lg:text-sm dashboard-text-muted">
            {teachers.length} teachers registered
          </p>
        </div>

        {/* Table Header - Desktop */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 border-b dashboard-card-border bg-gray-50 dark:bg-gray-800/50">
          <div className="col-span-3 text-xs font-semibold dashboard-text-muted uppercase">Name</div>
          <div className="col-span-3 text-xs font-semibold dashboard-text-muted uppercase">Email</div>
          <div className="col-span-2 text-xs font-semibold dashboard-text-muted uppercase">Assigned Class</div>
          <div className="col-span-2 text-xs font-semibold dashboard-text-muted uppercase">Status</div>
          <div className="col-span-2 text-xs font-semibold dashboard-text-muted uppercase text-right">Actions</div>
        </div>

        {/* Teacher List */}
        <div className="divide-y dashboard-card-border">
          {isLoading ? (
            <div className="p-6 text-center">
              <p className="dashboard-text-muted">Loading teachers...</p>
            </div>
          ) : teachers.length === 0 ? (
            <div className="p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 dashboard-text-muted opacity-50" />
              <p className="dashboard-text-muted">No teachers found</p>
            </div>
          ) : (
            teachers.map((teacher: Teacher) => (
              <div
                key={teacher.id}
                className="p-4 lg:px-6 lg:py-5 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                {/* Mobile Layout */}
                <div className="lg:hidden space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="accent-teal w-12 h-12">
                      <AvatarFallback className="text-white font-semibold">
                        {teacher.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold dashboard-text">{teacher.name}</h3>
                        <Badge className={`${teacher.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                          {teacher.status}
                        </Badge>
                      </div>
                      <p className="text-sm dashboard-text-muted flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {teacher.email}
                      </p>
                    </div>
                  </div>

                  {teacher.currentClass ? (
                    <div className="flex items-center gap-2 text-sm dashboard-text">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">
                        Class {teacher.currentClass.className} - {teacher.currentClass.section}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      No class assigned
                    </p>
                  )}

                  <div className="flex gap-2">
                    {teacher.currentClass && (
                      <button
                        onClick={() => setSwappingTeacherId(teacher.id)}
                        className="flex-1 dashboard-card border dashboard-card-border dashboard-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Swap Class
                      </button>
                    )}
                    {!teacher.currentClass && (
                      <button
                        onClick={() => setAssigningTeacherId(teacher.id)}
                        className="flex-1 dashboard-card border dashboard-card-border dashboard-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                      >
                        Assign Class
                      </button>
                    )}
                    {teacher.status === 'active' ? (
                      <Button
                        variant="ghost"
                        className="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        onClick={() => deactivateTeacher(teacher.id)}
                      >
                        <UserX className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => deleteTeacher(teacher.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                  <div className="col-span-3 flex items-center gap-3">
                    <Avatar className="accent-teal">
                      <AvatarFallback className="text-white font-semibold">
                        {teacher.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold dashboard-text">{teacher.name}</span>
                  </div>

                  <div className="col-span-3 flex items-center gap-2 dashboard-text-muted text-sm">
                    <Mail className="w-4 h-4" />
                    {teacher.email}
                  </div>

                  <div className="col-span-2">
                    {teacher.currentClass ? (
                      <div className="flex items-center gap-2 text-sm dashboard-text">
                        <BookOpen className="w-4 h-4 text-blue-500" />
                        <span className="font-medium">
                          {teacher.currentClass.className} - {teacher.currentClass.section}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-orange-600 dark:text-orange-400">
                        Not assigned
                      </span>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Badge className={`${teacher.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'}`}>
                      {teacher.status}
                    </Badge>
                  </div>

                  <div className="col-span-2 flex gap-2 justify-end">
                    {teacher.currentClass && (
                      <button
                        onClick={() => setSwappingTeacherId(teacher.id)}
                        className="dashboard-card border dashboard-card-border dashboard-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm flex items-center gap-2"
                      >
                        <Edit className="w-4 h-4" />
                        Swap
                      </button>
                    )}
                    {!teacher.currentClass && (
                      <button
                        onClick={() => setAssigningTeacherId(teacher.id)}
                        className="dashboard-card border dashboard-card-border dashboard-text font-semibold py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
                      >
                        Assign Class
                      </button>
                    )}
                    {teacher.status === 'active' ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                        onClick={() => deactivateTeacher(teacher.id)}
                        title="Deactivate Teacher"
                      >
                        <UserX className="w-5 h-5" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => deleteTeacher(teacher.id)}
                        title="Delete Teacher"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assign Class Modal */}
      <AnimatePresence>
        {assigningTeacherId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setAssigningTeacherId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="dashboard-card border rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold dashboard-text mb-4">Assign Class</h3>

              <select
                className="w-full dashboard-card border dashboard-card-border p-3 rounded-lg dashboard-text mb-4"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="">Select class</option>
                {classes.map((cls: Class) => (
                  <option
                    key={`${cls.id}-${cls.sessionId}`}
                    value={cls.id}
                    disabled={!!cls.teacherId}
                  >
                    {cls.name} - {cls.section}
                    {cls.teacherId ? ' (Occupied)' : ''}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  className="accent-teal text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedClassId}
                  onClick={handleAssignClass}
                >
                  Assign
                </button>
                <Button
                  variant="outline"
                  onClick={() => setAssigningTeacherId(null)}
                  className="dashboard-card border dashboard-card-border dashboard-text"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swap Class Modal */}
      <AnimatePresence>
        {swappingTeacherId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={() => setSwappingTeacherId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="dashboard-card border rounded-xl p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold dashboard-text mb-2">Swap/Change Class</h3>
              <p className="text-sm dashboard-text-muted mb-4">
                Select a new class for this teacher. If occupied, teachers will be swapped.
              </p>

              <select
                className="w-full dashboard-card border dashboard-card-border p-3 rounded-lg dashboard-text mb-4"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="">Select class</option>
                {classes.map((cls: Class) => (
                  <option
                    key={`${cls.id}-${cls.sessionId}`}
                    value={cls.id}
                  >
                    {cls.name} - {cls.section}
                    {cls.teacherId ? ' (Occupied - will swap)' : ' (Available)'}
                  </option>
                ))}
              </select>

              <div className="flex gap-3">
                <button
                  className="accent-teal text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!selectedClassId}
                  onClick={handleSwapClass}
                >
                  Confirm
                </button>
                <Button
                  variant="outline"
                  onClick={() => setSwappingTeacherId(null)}
                  className="dashboard-card border dashboard-card-border dashboard-text"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

