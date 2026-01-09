


'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, X, Users, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

/* 🔗 React Query hooks */
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

export default function ClassesPage() {

  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [formData, setFormData] = useState({
    className: '',
    section: ''
  });

  /* =====================
     API CALLS
  ===================== */
  const { data: classes = [], isLoading } = useClasses();
  const { mutate: createClass } = useCreateClass();
  const { mutate: updateClass } = useUpdateClass();
  const { mutate: deleteClass } = useDeleteClass();

  const stats = {
    total: classes.length,
    withTeacher: classes.filter((c: Class) => c.teacher).length,
    totalStudents: classes.reduce(
      (sum: number, c: Class) => sum + c.studentCount,
      0
    ),
    needTeacher: classes.filter((c: Class) => !c.teacher).length
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.className || !formData.section) return;

    createClass({
      name: formData.className,
      section: formData.section
    });

    setFormData({ className: '', section: '' });
    setIsAddClassOpen(false);
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

    updateClass({
      id: editingClass.id,
      data: {
        name: formData.className,
        section: formData.section
      }
    });

    setIsEditOpen(false);
    setEditingClass(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    deleteClass(id);
  };

  return (
    <div >
      

      <main className="flex-1 flex flex-col overflow-hidden">
       

        {/* CONTENT */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold dashboard-text mb-2">School's Classes</h1>
        <p className="dashboard-text-muted">View and manage your school's Classes</p>
      </div>
          <div className="max-w-[1400px] mx-auto space-y-4 lg:space-y-6">
            {/* ADD CLASS BUTTON */}
            <div className="flex  justify-end">
              <button 
                onClick={() => setIsAddClassOpen(!isAddClassOpen)}
                className="accent-blue text-white font-semibold py-2.5 px-6 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                {isAddClassOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                <span>{isAddClassOpen ? 'Cancel' : 'Add Class'}</span>
              </button>
              </div>
               

          
            {/* STATS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
              {[
                { label: 'Total Classes', value: stats.total, color: 'accent-blue', icon: BookOpen },
                { label: 'Total Students', value: stats.totalStudents, color: 'accent-green', icon: Users },
                { label: 'With Teachers', value: stats.withTeacher, color: 'accent-teal', icon: Users },
                { label: 'Need Teachers', value: stats.needTeacher, color: 'accent-orange', icon: Users }
              ].map((s, i) => (
                <div key={i} className="dashboard-card border rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col gap-3 lg:gap-4">
                    <div className={`${s.color} p-2.5 lg:p-3 rounded-xl w-fit`}>
                      <s.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs dashboard-text-muted mb-1">{s.label}</div>
                      <div className="text-2xl lg:text-4xl font-bold dashboard-text">{s.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

              {/* ADD FORM */}
            <AnimatePresence>
              {isAddClassOpen && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="dashboard-card border rounded-xl p-4 lg:p-6"
                >
                  <h3 className="text-lg font-semibold dashboard-text mb-4">Add New Class</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      name="className"
                      placeholder="Class Name"
                      value={formData.className}
                      onChange={handleInputChange}
                      className="dashboard-card border dashboard-card-border dashboard-text"
                    />
                    <Input
                      name="section"
                      placeholder="Section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="dashboard-card border dashboard-card-border dashboard-text"
                    />
                  </div>
                  <button 
                    onClick={handleSubmit}
                    className="mt-4 accent-blue text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Create Class
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            

            {/* CLASS GRID */}
            {isLoading ? (
              <div className="dashboard-card border rounded-xl p-8 text-center">
                <p className="dashboard-text-muted">Loading classes...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
                {classes.map((cls: Class, index: number) => (
                  <motion.div
                    key={`${cls.id}-${index}`}
                    className="dashboard-card border rounded-xl p-5 flex flex-col  hover:shadow-lg transition-shadow"
                  >
                    <div className="accent-blue p-3 rounded-xl w-fit mb-4">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>

                    <h3 className="text-lg font-bold dashboard-text mb-1">
                      {cls.name} - {cls.section}
                    </h3>

                    <p className="text-sm dashboard-text-muted mb-3">
                      {cls.teacher || 'No teacher assigned'}
                    </p>

                    <div className="flex items-center text-sm dashboard-text-muted mb-4">
                      <Users size={14} className="mr-1" />
                      {cls.studentCount} students
                    </div>

                    <div className="mt-auto flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(cls)}
                        className="flex-1 dashboard-text hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Edit size={14} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(cls.id)}
                        className="text-red-500 flex-1 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <div className="dashboard-card border rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold dashboard-text mb-4">Edit Class</h3>

              <select
                name="className"
                value={formData.className}
                onChange={handleSelectChange}
                className="w-full dashboard-card border dashboard-card-border p-2 mb-3 rounded dashboard-text"
              >
                {
                  [
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
                  ].map(cls => (
                    <option key={cls.value} value={cls.value}>
                      {cls.label}
                    </option>
                  ))
                }
              </select>

              <select
                name="section"
                value={formData.section}
                onChange={handleSelectChange}
                className="w-full dashboard-card border dashboard-card-border p-2 mb-4 rounded dashboard-text"
              >
                {['A', 'B', 'C', 'D'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 dashboard-card border dashboard-card-border dashboard-text"
                >
                  Cancel
                </Button>
                <button 
                  onClick={handleEditSubmit}
                  className="flex-1 accent-blue text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Update
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}