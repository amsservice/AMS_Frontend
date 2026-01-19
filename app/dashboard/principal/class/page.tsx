


// 'use client';

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { BookOpen, Plus, X, Users, Edit, Trash2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';

// import {
//   useClasses,
//   useCreateClass,
//   useUpdateClass,
//   useDeleteClass
// } from '@/app/querry/useClasses';

// interface Class {
//   id: string;
//   name: string;
//   section: string;
//   teacher?: string;
//   studentCount: number;
//   color?: string;
// }

// export default function ClassesPage() {
//   const [isAddClassOpen, setIsAddClassOpen] = useState(false);
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [editingClass, setEditingClass] = useState<Class | null>(null);
//   const [formData, setFormData] = useState({
//     className: '',
//     section: ''
//   });

//   const { data: classes = [], isLoading } = useClasses();
//   const { mutate: createClass, isPending: isCreating } = useCreateClass();
//   const { mutate: updateClass, isPending: isUpdating } = useUpdateClass();
//   const { mutate: deleteClass } = useDeleteClass();

//   const stats = {
//     total: classes.length,
//     withTeacher: classes.filter((c: Class) => c.teacher).length,
//     totalStudents: classes.reduce(
//       (sum: number, c: Class) => sum + c.studentCount,
//       0
//     ),
//     needTeacher: classes.filter((c: Class) => !c.teacher).length
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     if (!formData.className || !formData.section) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     const toastId = toast.loading('Creating class...');

//     createClass(
//       {
//         name: formData.className,
//         section: formData.section
//       },
//       {
//         onSuccess: () => {
//           toast.dismiss(toastId);
//           toast.success('Class created successfully!');
//           setFormData({ className: '', section: '' });
//           setIsAddClassOpen(false);
//         },
//         onError: (error: any) => {
//           toast.dismiss(toastId);
          
//           // Handle different error scenarios
//           const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create class';
          
//           // Check for specific error messages
//           if (errorMessage.includes('No active academic session')) {
//             toast.error('No active session found. Please create or activate a session first.');
//           } else if (errorMessage.includes('already exists')) {
//             toast.error('This class already exists for the current session');
//           } else {
//             toast.error(errorMessage);
//           }
//         }
//       }
//     );
//   };

//   const handleEditClick = (cls: Class) => {
//     setEditingClass(cls);
//     setFormData({
//       className: cls.name,
//       section: cls.section
//     });
//     setIsEditOpen(true);
//   };

//   const handleEditSubmit = () => {
//     if (!editingClass) return;

//     if (!formData.className || !formData.section) {
//       toast.error('Please fill in all required fields');
//       return;
//     }

//     const toastId = toast.loading('Updating class...');

//     updateClass(
//       {
//         id: editingClass.id,
//         data: {
//           name: formData.className,
//           section: formData.section
//         }
//       },
//       {
//         onSuccess: () => {
//           toast.dismiss(toastId);
//           toast.success('Class updated successfully!');
//           setIsEditOpen(false);
//           setEditingClass(null);
//         },
//         onError: (error: any) => {
//           toast.dismiss(toastId);
          
//           const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update class';
          
//           if (errorMessage.includes('No active session')) {
//             toast.error('No active session found. Please activate a session first.');
//           } else {
//             toast.error(errorMessage);
//           }
//         }
//       }
//     );
//   };

//   const handleDelete = (id: string, className: string, section: string) => {
//     toast.custom(
//       (t) => (
//         <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 max-w-md w-full">
//           <div className="flex items-start gap-4">
//             <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
//               <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
//             </div>
//             <div className="flex-1">
//               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
//                 Delete Class
//               </h3>
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//                 Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">{className} - {section}</span>? This action cannot be undone.
//               </p>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => {
//                     toast.dismiss(t);
//                   }}
//                   className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => {
//                     toast.dismiss(t);
//                     const loadingId = toast.loading('Deleting class...');
                    
//                     deleteClass(id, {
//                       onSuccess: () => {
//                         toast.dismiss(loadingId);
//                         toast.success('Class deleted successfully!');
//                       },
//                       onError: (error: any) => {
//                         toast.dismiss(loadingId);
                        
//                         const errorMessage = error?.response?.data?.message || error?.message || 'Failed to delete class';
                        
//                         if (errorMessage.includes('No active session')) {
//                           toast.error('No active session found. Please activate a session first.');
//                         } else {
//                           toast.error(errorMessage);
//                         }
//                       }
//                     });
//                   }}
//                   className="flex-1 px-4 py-2.5 bg-gradient-to-br from-red-600 to-red-700 text-white rounded-xl font-medium hover:opacity-90 transition-all shadow-lg"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       ),
//       {
//         duration: Infinity,
//         position: 'top-center',
//       }
//     );
//   };

//   const statsData = [
//     { label: 'Total Classes', value: stats.total, bgGradient: 'from-blue-500 to-indigo-600', icon: BookOpen },
//     { label: 'Total Students', value: stats.totalStudents, bgGradient: 'from-green-500 to-emerald-600', icon: Users },
//     { label: 'With Teachers', value: stats.withTeacher, bgGradient: 'from-teal-500 to-cyan-600', icon: Users },
//     { label: 'Need Teachers', value: stats.needTeacher, bgGradient: 'from-orange-500 to-amber-600', icon: Users }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//       {/* Modern Header with Gradient */}
//       <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
//         <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
//             <div className="flex-1">
//               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
//                 School's Classes
//               </h1>
//               <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
//                 View and manage your school's classes
//               </p>
//             </div>
//             <button
//               onClick={() => setIsAddClassOpen(!isAddClassOpen)}
//               className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
//             >
//               {isAddClassOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> : <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />}
//               <span>{isAddClassOpen ? 'Cancel' : 'Add Class'}</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
//         <div className="space-y-6 sm:space-y-8">
//           {/* Modern Stats Cards Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//             {statsData.map((stat, i) => (
//               <div
//                 key={i}
//                 className={`group bg-gradient-to-br ${
//                   i === 0 ? 'from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200/50 dark:border-blue-700/50' :
//                   i === 1 ? 'from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200/50 dark:border-green-700/50' :
//                   i === 2 ? 'from-teal-50 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 border-teal-200/50 dark:border-teal-700/50' :
//                   'from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200/50 dark:border-orange-700/50'
//                 } border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
//               >
//                 <div className="p-4 sm:p-6">
//                   <div className="flex items-center mb-3">
//                     <div className={`p-2 bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-lg`}>
//                       <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
//                     </div>
//                     <div className="ml-3">
//                       <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
//                         {stat.label}
//                       </p>
//                     </div>
//                   </div>
//                   <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Add Class Form */}
//           <AnimatePresence>
//             {isAddClassOpen && (
//               <motion.div
//                 initial={{ height: 0, opacity: 0 }}
//                 animate={{ height: 'auto', opacity: 1 }}
//                 exit={{ height: 0, opacity: 0 }}
//                 className="overflow-hidden"
//               >
//                 <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
//                   <div className="flex items-center gap-3 mb-4 sm:mb-6">
//                     <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
//                       <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
//                     </div>
//                     <div>
//                       <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">Add New Class</h3>
//                       <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Create a new class for your school</p>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
//                     <div className="space-y-2">
//                       <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Class Name</Label>
//                       <Input
//                         name="className"
//                         placeholder="Class Name"
//                         value={formData.className}
//                         onChange={handleInputChange}
//                         className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Section</Label>
//                       <Input
//                         name="section"
//                         placeholder="Section"
//                         value={formData.section}
//                         onChange={handleInputChange}
//                         className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
//                       />
//                     </div>
//                   </div>

//                   <button
//                     onClick={handleSubmit}
//                     disabled={isCreating}
//                     className="mt-6 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     {isCreating ? 'Creating...' : 'Create Class'}
//                   </button>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           {/* Class Grid */}
//           {isLoading ? (
//             <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
//               <p className="text-gray-600 dark:text-gray-400">Loading classes...</p>
//             </div>
//           ) : classes.length === 0 ? (
//             <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
//               <BookOpen className="w-12 h-12 mx-auto text-gray-400 mb-3" />
//               <p className="text-gray-600 dark:text-gray-400">No classes found. Create your first class to get started!</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
//               {classes.map((cls: Class, index: number) => (
//                 <motion.div
//                   key={`${cls.id}-${index}`}
//                   className="group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 flex flex-col transition-all duration-300 transform hover:-translate-y-1"
//                 >
//                   <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl w-fit mb-4 shadow-lg group-hover:scale-110 transition-transform">
//                     <BookOpen className="w-6 h-6 text-white" />
//                   </div>

//                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
//                     {cls.name} - {cls.section}
//                   </h3>

//                   <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
//                     {cls.teacher || 'No teacher assigned'}
//                   </p>

//                   <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
//                     <Users size={14} className="mr-1" />
//                     {cls.studentCount} students
//                   </div>

//                   <div className="mt-auto flex gap-2">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleEditClick(cls)}
//                       className="flex-1 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl"
//                     >
//                       <Edit size={14} />
//                     </Button>

//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleDelete(cls.id, cls.name, cls.section)}
//                       className="text-red-500 flex-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
//                     >
//                       <Trash2 size={14} />
//                     </Button>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>

//       {/* Edit Modal */}
//       <AnimatePresence>
//         {isEditOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
//             onClick={() => setIsEditOpen(false)}
//           >
//             <motion.div
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               onClick={(e) => e.stopPropagation()}
//               className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-md"
//             >
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
//                   <Edit className="w-5 h-5 text-white" />
//                 </div>
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Class</h3>
//               </div>

//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Class Name</Label>
//                   <select
//                     name="className"
//                     value={formData.className}
//                     onChange={handleSelectChange}
//                     className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                   >
//                     {[
//                       { label: 'Class 1', value: '1' },
//                       { label: 'Class 2', value: '2' },
//                       { label: 'Class 3', value: '3' },
//                       { label: 'Class 4', value: '4' },
//                       { label: 'Class 5', value: '5' },
//                       { label: 'Class 6', value: '6' },
//                       { label: 'Class 7', value: '7' },
//                       { label: 'Class 8', value: '8' },
//                       { label: 'Class 9', value: '9' },
//                       { label: 'Class 10', value: '10' },
//                       { label: 'Class 11', value: '11' },
//                       { label: 'Class 12', value: '12' }
//                     ].map(cls => (
//                       <option key={cls.value} value={cls.value}>
//                         {cls.label}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Section</Label>
//                   <select
//                     name="section"
//                     value={formData.section}
//                     onChange={handleSelectChange}
//                     className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
//                   >
//                     {['A', 'B', 'C', 'D'].map(s => (
//                       <option key={s} value={s}>{s}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="flex gap-3 mt-6">
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsEditOpen(false)}
//                   className="flex-1 rounded-xl"
//                 >
//                   Cancel
//                 </Button>
//                 <button
//                   onClick={handleEditSubmit}
//                   disabled={isUpdating}
//                   className="flex-1 px-6 py-2.5 bg-gradient-to-br from-purple-600 to-violet-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isUpdating ? 'Updating...' : 'Update'}
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }


'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, X, Users, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

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

  const { data: classes = [], isLoading } = useClasses();
  const { mutate: createClass, isPending: isCreating } = useCreateClass();
  const { mutate: updateClass, isPending: isUpdating } = useUpdateClass();
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
          
          // Handle different error scenarios
          const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create class';
          
          // Check for specific error messages
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

  const statsData = [
    { label: 'Total Classes', value: stats.total, bgGradient: 'from-purple-500 to-blue-500', icon: BookOpen },
    { label: 'Total Students', value: stats.totalStudents, bgGradient: 'from-blue-500 to-indigo-500', icon: Users },
    { label: 'With Teachers', value: stats.withTeacher, bgGradient: 'from-indigo-500 to-purple-500', icon: Users },
    { label: 'Need Teachers', value: stats.needTeacher, bgGradient: 'from-purple-400 to-blue-400', icon: Users }
  ];

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 overflow-hidden min-h-screen">
      {/* Modern Header with Gradient */}
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
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white/95 backdrop-blur-sm text-purple-600 rounded-xl text-sm font-semibold hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center border border-purple-200/50"
            >
              {isAddClassOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> : <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />}
              <span>{isAddClassOpen ? 'Cancel' : 'Add Class'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* Modern Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-200/50 dark:border-purple-700/30 overflow-hidden"
              >
                {/* Gradient accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.bgGradient}`}></div>
                
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-lg`}>
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
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

          {/* Add Class Form */}
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

          {/* Class Grid */}
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
              {classes.map((cls: Class, index: number) => (
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
                    {cls.studentCount} students
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

      {/* Edit Modal */}
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
                    ].map(cls => (
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
                    {['A', 'B', 'C', 'D'].map(s => (
                      <option key={s} value={s}>{s}</option>
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
    </div>
  );
}