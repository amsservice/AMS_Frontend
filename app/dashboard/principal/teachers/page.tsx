// 'use client';

// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Users, Plus, X, Mail, BookOpen, Trash2, Edit, UserX } from 'lucide-react';

// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';

// import {
//   useTeachers,
//   useCreateTeacher,
//   useDeleteTeacher,
//   useAssignClassToTeacher,
//   useDeactivateTeacher,
//   useSwapTeacherClasses
// } from '@/app/querry/useTeachers';

// import { useClasses } from '@/app/querry/useClasses';

// interface Class {
//   id: string;
//   name: string;
//   section: string;
//   sessionId: string;
//   teacherId?: string | null;
// }

// interface Teacher {
//   id: string;
//   name: string;
//   email: string;
//   status: 'active' | 'pending';
//   currentClass?: {
//     classId: string;
//     className: string;
//     section: string;
//   };
// }

// export default function TeachersPage() {
//   const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
//   const [assigningTeacherId, setAssigningTeacherId] = useState<string | null>(null);
//   const [swappingTeacherId, setSwappingTeacherId] = useState<string | null>(null);
//   const [selectedClassId, setSelectedClassId] = useState('');

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: ''
//   });

//   const { data: teachers = [], isLoading } = useTeachers();
//   const { data: classes = [] } = useClasses();

//   const { mutate: createTeacher } = useCreateTeacher();
//   const { mutate: deleteTeacher } = useDeleteTeacher();
//   const { mutate: deactivateTeacher } = useDeactivateTeacher();
//   const assignClassMutation = useAssignClassToTeacher();
//   const swapClassMutation = useSwapTeacherClasses();

//   const handleAddTeacher = (e: React.FormEvent) => {
//     e.preventDefault();
//     createTeacher(formData);
//     setFormData({ name: '', email: '', password: '' });
//     setIsAddTeacherOpen(false);
//   };

//   const handleAssignClass = () => {
//     if (!assigningTeacherId || !selectedClassId) return;
//     const selectedClass = classes.find((cls: Class) => cls.id === selectedClassId);
//     if (!selectedClass) return;

//     assignClassMutation.mutate({
//       teacherId: assigningTeacherId,
//       classId: selectedClass.id,
//       sessionId: selectedClass.sessionId,
//       className: selectedClass.name,
//       section: selectedClass.section
//     });

//     setAssigningTeacherId(null);
//     setSelectedClassId('');
//   };

//   const handleSwapClass = () => {
//     if (!swappingTeacherId || !selectedClassId) return;
//     const swappingTeacher = teachers.find((t: Teacher) => t.id === swappingTeacherId);
//     const targetClass = classes.find((cls: Class) => cls.id === selectedClassId);
//     if (!swappingTeacher || !targetClass || !swappingTeacher.currentClass) return;

//     if (targetClass.teacherId) {
//       const targetTeacher = teachers.find((t: Teacher) => t.id === targetClass.teacherId);
//       if (!targetTeacher || !targetTeacher.currentClass) return;

//       swapClassMutation.mutate({
//         sessionId: targetClass.sessionId,
//         teacherAId: swappingTeacher.id,
//         classAId: swappingTeacher.currentClass.classId,
//         classAName: swappingTeacher.currentClass.className,
//         sectionA: swappingTeacher.currentClass.section,
//         teacherBId: targetTeacher.id,
//         classBId: targetClass.id,
//         classBName: targetClass.name,
//         sectionB: targetClass.section
//       });
//     } else {
//       assignClassMutation.mutate({
//         teacherId: swappingTeacher.id,
//         classId: targetClass.id,
//         sessionId: targetClass.sessionId,
//         className: targetClass.name,
//         section: targetClass.section
//       });
//     }

//     setSwappingTeacherId(null);
//     setSelectedClassId('');
//   };

//   const stats = [
//     { label: 'Total Teachers', value: teachers.length, bgGradient: 'from-blue-500 to-indigo-600' },
//     { label: 'Active', value: teachers.filter((t: Teacher) => t.status === 'active').length, bgGradient: 'from-green-500 to-emerald-600' },
//     { label: 'Pending', value: teachers.filter((t: Teacher) => t.status === 'pending').length, bgGradient: 'from-orange-500 to-amber-600' },
//     { label: 'Assigned', value: teachers.filter((t: Teacher) => t.currentClass).length, bgGradient: 'from-purple-500 to-violet-600' }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
//       <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
//         <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
//             <div className="flex-1">
//               <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
//                 Teachers Management 👥
//               </h1>
//               <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
//                 Manage teachers and class assignments
//               </p>
//             </div>
//             <button
//               onClick={() => setIsAddTeacherOpen(!isAddTeacherOpen)}
//               className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
//             >
//               {isAddTeacherOpen ? <X className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> : <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />}
//               <span>{isAddTeacherOpen ? 'Cancel' : 'Add Teacher'}</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
//         <div className="space-y-6 sm:space-y-8">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
//             {stats.map((stat, i) => (
//               <div
//                 key={i}
//                 className={`group bg-gradient-to-br ${
//                   i === 0 ? 'from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200/50 dark:border-blue-700/50' :
//                   i === 1 ? 'from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200/50 dark:border-green-700/50' :
//                   i === 2 ? 'from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200/50 dark:border-orange-700/50' :
//                   'from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200/50 dark:border-purple-700/50'
//                 } border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
//               >
//                 <div className="p-4 sm:p-6">
//                   <div className="flex items-center mb-3">
//                     <div className={`p-2 bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-lg`}>
//                       <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
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

//           <AnimatePresence>
//             {isAddTeacherOpen && (
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
//                       <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">Add New Teacher</h3>
//                       <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Create a new teacher account</p>
//                     </div>
//                   </div>
                  
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
//                     <div className="space-y-2">
//                       <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Name</Label>
//                       <Input
//                         value={formData.name}
//                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                         required
//                         className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Email</Label>
//                       <Input
//                         type="email"
//                         value={formData.email}
//                         onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                         required
//                         className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">Password</Label>
//                       <Input
//                         value={formData.password}
//                         onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                         required
//                         className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex flex-col sm:flex-row gap-3 mt-6">
//                     <button
//                       onClick={handleAddTeacher}
//                       className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg"
//                     >
//                       Create Teacher
//                     </button>
//                     <Button variant="outline" onClick={() => setIsAddTeacherOpen(false)} className="rounded-xl">
//                       Cancel
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>

//           <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
//             <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200/50 dark:border-gray-700/50">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
//                   <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
//                 </div>
//                 <div>
//                   <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">All Teachers</h3>
//                   <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{teachers.length} teachers registered</p>
//                 </div>
//               </div>
//             </div>

//             <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50">
//               <div className="col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Name</div>
//               <div className="col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Email</div>
//               <div className="col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Assigned Class</div>
//               <div className="col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Status</div>
//               <div className="col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide text-right">Actions</div>
//             </div>

//             <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
//               {isLoading ? (
//                 <div className="p-6 text-center"><p className="text-gray-600 dark:text-gray-400">Loading teachers...</p></div>
//               ) : teachers.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <Users className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600 opacity-50" />
//                   <p className="text-gray-600 dark:text-gray-400">No teachers found</p>
//                 </div>
//               ) : (
//                 teachers.map((teacher: Teacher) => (
//                   <div key={teacher.id} className="p-4 sm:p-5 lg:px-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
//                     <div className="lg:hidden space-y-3">
//                       <div className="flex items-center gap-3">
//                         <Avatar className="bg-gradient-to-br from-teal-500 to-cyan-600 w-12 h-12">
//                           <AvatarFallback className="text-white font-semibold bg-transparent">{teacher.name[0]}</AvatarFallback>
//                         </Avatar>
//                         <div className="flex-1">
//                           <div className="flex items-center gap-2 mb-1 flex-wrap">
//                             <h3 className="font-semibold text-gray-900 dark:text-white">{teacher.name}</h3>
//                             <Badge className={`${teacher.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'} border`}>
//                               {teacher.status}
//                             </Badge>
//                           </div>
//                           <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
//                             <Mail className="w-3 h-3" />{teacher.email}
//                           </p>
//                         </div>
//                       </div>
//                       {teacher.currentClass ? (
//                         <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
//                           <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                           <span className="text-sm font-medium text-gray-900 dark:text-white">
//                             Class {teacher.currentClass.className} - {teacher.currentClass.section}
//                           </span>
//                         </div>
//                       ) : (
//                         <p className="text-sm font-medium text-orange-600 dark:text-orange-400 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
//                           No class assigned
//                         </p>
//                       )}
//                       <div className="flex gap-2">
//                         {teacher.currentClass && (
//                           <button onClick={() => setSwappingTeacherId(teacher.id)} className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center justify-center gap-2 shadow-sm">
//                             <Edit className="w-4 h-4" />Swap Class
//                           </button>
//                         )}
//                         {!teacher.currentClass && (
//                           <button onClick={() => setAssigningTeacherId(teacher.id)} className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm shadow-sm">
//                             Assign Class
//                           </button>
//                         )}
//                         {teacher.status === 'active' ? (
//                           <Button variant="ghost" className="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl" onClick={() => deactivateTeacher(teacher.id)}>
//                             <UserX className="w-4 h-4" />
//                           </Button>
//                         ) : (
//                           <Button variant="ghost" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl" onClick={() => deleteTeacher(teacher.id)}>
//                             <Trash2 className="w-4 h-4" />
//                           </Button>
//                         )}
//                       </div>
//                     </div>

//                     <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
//                       <div className="col-span-3 flex items-center gap-3">
//                         <Avatar className="bg-gradient-to-br from-teal-500 to-cyan-600">
//                           <AvatarFallback className="text-white font-semibold bg-transparent">{teacher.name[0]}</AvatarFallback>
//                         </Avatar>
//                         <span className="font-semibold text-gray-900 dark:text-white">{teacher.name}</span>
//                       </div>
//                       <div className="col-span-3 flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
//                         <Mail className="w-4 h-4" />{teacher.email}
//                       </div>
//                       <div className="col-span-2">
//                         {teacher.currentClass ? (
//                           <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
//                             <BookOpen className="w-4 h-4 text-blue-500" />
//                             <span className="font-medium">{teacher.currentClass.className} - {teacher.currentClass.section}</span>
//                           </div>
//                         ) : (
//                           <span className="text-sm font-medium text-orange-600 dark:text-orange-400">Not assigned</span>
//                         )}
//                       </div>
//                       <div className="col-span-2">
//                         <Badge className={`${teacher.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'} border`}>
//                           {teacher.status}
//                         </Badge>
//                       </div>
//                       <div className="col-span-2 flex gap-2 justify-end">
//                         {teacher.currentClass && (
//                           <button onClick={() => setSwappingTeacherId(teacher.id)} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center gap-2 shadow-sm">
//                             <Edit className="w-4 h-4" />Swap
//                           </button>
//                         )}
//                         {!teacher.currentClass && (
//                           <button onClick={() => setAssigningTeacherId(teacher.id)} className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm shadow-sm">
//                             Assign Class
//                           </button>
//                         )}
//                         {teacher.status === 'active' ? (
//                           <Button variant="ghost" size="icon" className="text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-xl" onClick={() => deactivateTeacher(teacher.id)} title="Deactivate">
//                             <UserX className="w-5 h-5" />
//                           </Button>
//                         ) : (
//                           <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl" onClick={() => deleteTeacher(teacher.id)} title="Delete">
//                             <Trash2 className="w-5 h-5" />
//                           </Button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               )}
//             </div>
//           </div>
//         </div>
//       </main>

//       <AnimatePresence>
//         {assigningTeacherId && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setAssigningTeacherId(null)}>
//             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-md">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
//                   <BookOpen className="w-5 h-5 text-white" />
//                 </div>
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Assign Class</h3>
//               </div>
//               <select className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-xl text-gray-900 dark:text-white mb-4" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
//                 <option value="">Select class</option>
//                 {classes.map((cls: Class) => (
//                   <option key={`${cls.id}-${cls.sessionId}`} value={cls.id} disabled={!!cls.teacherId}>
//                     {cls.name} - {cls.section}{cls.teacherId ? ' (Occupied)' : ''}
//                   </option>
//                 ))}
//               </select>
//               <div className="flex gap-3">
//                 <button className="px-6 py-2.5 bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg" disabled={!selectedClassId} onClick={handleAssignClass}>
//                   Assign
//                 </button>
//                 <Button variant="outline" onClick={() => setAssigningTeacherId(null)} className="rounded-xl">Cancel</Button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <AnimatePresence>
//         {swappingTeacherId && (
//           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSwappingTeacherId(null)}>
//             <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()} className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-md">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
//                   <Edit className="w-5 h-5 text-white" />
//                 </div>
//                 <h3 className="text-lg font-bold text-gray-900 dark:text-white">Change Class</h3>
//               </div>
//               <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
//                 Select a new class for this teacher. If occupied, teachers will be swapped.
//               </p>
//               <select className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-xl text-gray-900 dark:text-white mb-4" value={selectedClassId} onChange={(e) => setSelectedClassId(e.target.value)}>
//                 <option value="">Select class</option>
//                 {classes.map((cls: Class) => (
//                   <option key={`${cls.id}-${cls.sessionId}`} value={cls.id}>
//                     {cls.name} - {cls.section}{cls.teacherId ? ' (Occupied - will swap)' : ' (Available)'}
//                   </option>
//                 ))}
//               </select>
//               <div className="flex gap-3">
//                 <button className="px-6 py-2.5 bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg" disabled={!selectedClassId} onClick={handleSwapClass}>
//                   Confirm
//                 </button>
//                 <Button variant="outline" onClick={() => setSwappingTeacherId(null)} className="rounded-xl">Cancel</Button>
//       </AnimatePresence>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  X,
  Mail,
  BookOpen,
  Trash2,
  Edit,
  UserX,
  Eye,
  Phone,
  Calendar,
  MapPin,
  User
} from 'lucide-react';
import { toast } from 'sonner';

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
  useSwapTeacherClasses,
  useTeacherFullProfile,
  useUpdateTeacherProfileByPrincipal
} from '@/app/querry/useTeachers';

import { useClasses } from '@/app/querry/useClasses';

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
  isActive: boolean;
  currentClass?: {
    classId: string;
    className: string;
    section: string;
  };
}

export default function TeachersPage() {
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [assigningTeacherId, setAssigningTeacherId] = useState<string | null>(null);
  const [swappingTeacherId, setSwappingTeacherId] = useState<string | null>(null);
  const [viewingTeacherId, setViewingTeacherId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: '',
    highestQualification: '',
    experienceYears: '',
    address: ''
  });

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    highestQualification: '',
    experienceYears: '',
    address: ''
  });

  const { data: teachers = [], isLoading } = useTeachers();
  const { data: classes = [] } = useClasses();

  const { mutate: createTeacher } = useCreateTeacher();
  const { mutate: deleteTeacher } = useDeleteTeacher();
  const { mutate: deactivateTeacher } = useDeactivateTeacher();
  const assignClassMutation = useAssignClassToTeacher();
  const swapClassMutation = useSwapTeacherClasses();

  const { data: teacherFullData, isLoading: isLoadingFullProfile } =
    useTeacherFullProfile(viewingTeacherId || '');
  const updateTeacherMutation = useUpdateTeacherProfileByPrincipal(
    viewingTeacherId || ''
  );

  const validateTeacherProfile = (data: {
    name?: string;
    email?: string;
    phone?: string;
    dob?: string;
    gender?: string;
    highestQualification?: string;
    experienceYears?: string;
    address?: string;
  }) => {
    if (data.name !== undefined && data.name.trim().length < 3) {
      return 'Name must be at least 3 characters';
    }

    if (data.email !== undefined && data.email.trim().length > 0) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      if (!emailOk) return 'Please enter a valid email';
    }

    if (data.phone !== undefined && data.phone.trim().length > 0) {
      const phoneOk = /^[0-9]{10,13}$/.test(data.phone);
      if (!phoneOk) return 'Phone must be 10 to 13 digits';
    }

    if (data.dob !== undefined && data.dob.trim().length > 0) {
      const d = new Date(data.dob);
      if (isNaN(d.getTime())) return 'Invalid date of birth';
      const today = new Date();
      if (d.getTime() > today.getTime()) return 'DOB cannot be in the future';
    }

    if (data.gender !== undefined && data.gender.trim().length > 0) {
      if (!['male', 'female', 'other'].includes(data.gender)) {
        return 'Invalid gender';
      }
    }

    if (
      data.highestQualification !== undefined &&
      data.highestQualification.trim().length > 0
    ) {
      const len = data.highestQualification.trim().length;
      if (len < 2) return 'Highest qualification must be at least 2 characters';
      if (len > 100) return 'Highest qualification cannot exceed 100 characters';
    }

    if (
      data.experienceYears !== undefined &&
      data.experienceYears.trim().length > 0
    ) {
      const n = Number(data.experienceYears);
      if (!Number.isFinite(n) || !Number.isInteger(n)) {
        return 'Experience years must be a whole number';
      }
      if (n < 0 || n > 60) return 'Experience years must be between 0 and 60';
    }

    if (data.address !== undefined && data.address.trim().length > 0) {
      const len = data.address.trim().length;
      if (len < 5) return 'Address must be at least 5 characters';
      if (len > 250) return 'Address cannot exceed 250 characters';
    }

    return null;
  };

  const handleAddTeacher = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const err = validateTeacherProfile(formData);
    if (err) {
      toast.error(err);
      return;
    }

    createTeacher(
      {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
        dob: formData.dob || undefined,
        gender: (formData.gender as any) || undefined,
        highestQualification: formData.highestQualification || undefined,
        experienceYears: formData.experienceYears
          ? Number(formData.experienceYears)
          : undefined,
        address: formData.address || undefined
      },
      {
        onSuccess: () => {
          toast.success('Teacher created successfully');
          setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            dob: '',
            gender: '',
            highestQualification: '',
            experienceYears: '',
            address: ''
          });
          setIsAddTeacherOpen(false);
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to create teacher');
        }
      }
    );
  };

  const handleAssignClass = () => {
    if (!assigningTeacherId || !selectedClassId) return;
    const selectedClass = classes.find((cls: Class) => cls.id === selectedClassId);
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

  const handleViewTeacher = (teacherId: string) => {
    setViewingTeacherId(teacherId);
    setIsEditing(false);
  };

  const handleEnableEdit = () => {
    if (teacherFullData?.data) {
      setEditFormData({
        name: teacherFullData.data.name || '',
        email: teacherFullData.data.email || '',
        phone: teacherFullData.data.phone || '',
        dob: teacherFullData.data.dob ? teacherFullData.data.dob.slice(0, 10) : '',
        gender: teacherFullData.data.gender || '',
        highestQualification: teacherFullData.data.highestQualification || '',
        experienceYears:
          typeof teacherFullData.data.experienceYears === 'number'
            ? String(teacherFullData.data.experienceYears)
            : '',
        address: teacherFullData.data.address || ''
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({
      name: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      highestQualification: '',
      experienceYears: '',
      address: ''
    });
  };

  const handleSaveEdit = () => {
    if (!viewingTeacherId) return;

    const err = validateTeacherProfile(editFormData);
    if (err) {
      toast.error(err);
      return;
    }

    const updateData: {
      name?: string;
      phone?: string;
      email?: string;
      dob?: string;
      gender?: 'male' | 'female' | 'other';
      highestQualification?: string;
      experienceYears?: number;
      address?: string;
    } = {};

    if (editFormData.name) updateData.name = editFormData.name;
    if (editFormData.phone) updateData.phone = editFormData.phone;
    if (editFormData.email) updateData.email = editFormData.email;
    if (editFormData.dob) updateData.dob = editFormData.dob;
    if (editFormData.gender) updateData.gender = editFormData.gender as any;
    if (editFormData.highestQualification)
      updateData.highestQualification = editFormData.highestQualification;
    if (editFormData.experienceYears)
      updateData.experienceYears = Number(editFormData.experienceYears);
    if (editFormData.address) updateData.address = editFormData.address;

    updateTeacherMutation.mutate(updateData, {
      onSuccess: () => {
        setIsEditing(false);
        toast.success('Teacher updated successfully');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to update teacher');
      }
    });
  };

  const stats = [
    {
      label: 'Total Teachers',
      value: teachers.length,
      bgGradient: 'from-blue-500 to-indigo-600'
    },
    {
      label: 'Active',
      value: teachers.filter((t: Teacher) => t.isActive).length,
      bgGradient: 'from-green-500 to-emerald-600'
    },
    {
      label: 'Inactive',
      value: teachers.filter((t: Teacher) => !t.isActive).length,
      bgGradient: 'from-orange-500 to-amber-600'
    },
    {
      label: 'Assigned',
      value: teachers.filter((t: Teacher) => t.currentClass).length,
      bgGradient: 'from-purple-500 to-violet-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Teachers Management
              </h1>
              <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
                Manage teachers and class assignments
              </p>
            </div>
            <button
              onClick={() => setIsAddTeacherOpen(!isAddTeacherOpen)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              {isAddTeacherOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              ) : (
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              )}
              <span>{isAddTeacherOpen ? 'Cancel' : 'Add Teacher'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`group bg-gradient-to-br border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  i === 0
                    ? 'from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200/50 dark:border-blue-700/50'
                    : i === 1
                      ? 'from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200/50 dark:border-green-700/50'
                      : i === 2
                        ? 'from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200/50 dark:border-orange-700/50'
                        : 'from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200/50 dark:border-purple-700/50'
                }`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex items-center mb-3">
                    <div
                      className={`p-2 bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-lg`}
                    >
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {isAddTeacherOpen && (
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
                      <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                        Add New Teacher
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Create a new teacher account
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                      </Label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                      </Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Password
                      </Label>
                      <Input
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value
                          })
                        }
                        required
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </Label>
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                        placeholder="10 to 13 digits"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        DOB
                      </Label>
                      <Input
                        type="date"
                        value={formData.dob}
                        onChange={(e) =>
                          setFormData({ ...formData, dob: e.target.value })
                        }
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Gender
                      </Label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        className="h-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-3"
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Highest Qualification
                      </Label>
                      <Input
                        value={formData.highestQualification}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            highestQualification: e.target.value
                          })
                        }
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                        placeholder="e.g. B.Ed, M.Sc"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Experience (Years)
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        max={60}
                        value={formData.experienceYears}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experienceYears: e.target.value
                          })
                        }
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-3">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Address
                      </Label>
                      <Input
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                        placeholder="Address"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={handleAddTeacher}
                      className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg"
                    >
                      Create Teacher
                    </button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddTeacherOpen(false)}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                    All Teachers
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    {teachers.length} teachers registered
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50">
              <div className="col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Name
              </div>
              <div className="col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Email
              </div>
              <div className="col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Assigned Class
              </div>
              <div className="col-span-1 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Status
              </div>
              <div className="col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide text-right">
                Actions
              </div>
            </div>

            <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
              {isLoading ? (
                <div className="p-6 text-center">
                  <p className="text-gray-600 dark:text-gray-400">Loading teachers...</p>
                </div>
              ) : teachers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600 opacity-50" />
                  <p className="text-gray-600 dark:text-gray-400">No teachers found</p>
                </div>
              ) : (
                (teachers as any).map((teacher: Teacher) => (
                  <div
                    key={teacher.id}
                    className="p-4 sm:p-5 lg:px-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="lg:hidden space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="bg-gradient-to-br from-teal-500 to-cyan-600 w-12 h-12">
                          <AvatarFallback className="text-white font-semibold bg-transparent">
                            {teacher.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {teacher.name}
                            </h3>
                            <Badge
                              className={`${
                                teacher.isActive
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                              } border`}
                            >
                              {teacher.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />{teacher.email}
                          </p>
                        </div>
                      </div>

                      {teacher.currentClass ? (
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                          <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            Class {teacher.currentClass.className} - {teacher.currentClass.section}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-orange-600 dark:text-orange-400 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                          No class assigned
                        </p>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => handleViewTeacher(teacher.id)}
                          className="flex-1 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-xl hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Eye className="w-4 h-4" />View
                        </button>

                        {teacher.currentClass && (
                          <button
                            onClick={() => setSwappingTeacherId(teacher.id)}
                            className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
                          >
                            <Edit className="w-4 h-4" />Swap
                          </button>
                        )}

                        {!teacher.currentClass && (
                          <button
                            onClick={() => setAssigningTeacherId(teacher.id)}
                            className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm shadow-sm"
                          >
                            Assign
                          </button>
                        )}

                        {teacher.isActive ? (
                          <button
                            onClick={() => deactivateTeacher(teacher.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm flex items-center gap-2 shadow-sm"
                            title="Deactivate"
                          >
                            <UserX className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => deleteTeacher(teacher.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm flex items-center gap-2 shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                      <div className="col-span-3 flex items-center gap-3">
                        <Avatar className="bg-gradient-to-br from-teal-500 to-cyan-600">
                          <AvatarFallback className="text-white font-semibold bg-transparent">
                            {teacher.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {teacher.name}
                        </span>
                      </div>

                      <div className="col-span-3 flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <Mail className="w-4 h-4" />{teacher.email}
                      </div>

                      <div className="col-span-2">
                        {teacher.currentClass ? (
                          <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            <span className="font-medium">
                              {teacher.currentClass.className} - {teacher.currentClass.section}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                            Not assigned
                          </span>
                        )}
                      </div>

                      <div className="col-span-1">
                        <Badge
                          className={`${
                            teacher.isActive
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
                          } border`}
                        >
                          {teacher.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>

                      <div className="col-span-3 flex gap-2 justify-end">
                        <button
                          onClick={() => handleViewTeacher(teacher.id)}
                          className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-xl hover:opacity-90 transition-all text-sm flex items-center gap-2 shadow-sm"
                        >
                          <Eye className="w-4 h-4" />View
                        </button>

                        {teacher.currentClass && (
                          <button
                            onClick={() => setSwappingTeacherId(teacher.id)}
                            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center gap-2 shadow-sm"
                          >
                            <Edit className="w-4 h-4" />Swap
                          </button>
                        )}

                        {!teacher.currentClass && (
                          <button
                            onClick={() => setAssigningTeacherId(teacher.id)}
                            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm shadow-sm"
                          >
                            Assign
                          </button>
                        )}

                        {teacher.isActive ? (
                          <button
                            onClick={() => deactivateTeacher(teacher.id)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm flex items-center gap-2 shadow-sm"
                            title="Deactivate"
                          >
                            <UserX className="w-5 h-5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => deleteTeacher(teacher.id)}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm flex items-center gap-2 shadow-sm"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* View Teacher Modal */}
      <AnimatePresence>
        {viewingTeacherId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setViewingTeacherId(null);
              setIsEditing(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              {isLoadingFullProfile ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">Loading teacher details...</p>
                </div>
              ) : teacherFullData?.data ? (
                <>
                  {/* Header */}
                  <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 px-6 py-4 rounded-t-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="bg-white w-16 h-16">
                          <AvatarFallback className="text-blue-600 font-bold text-2xl bg-white">
                            {teacherFullData.data.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h2 className="text-xl font-bold text-white">
                            {teacherFullData.data.name}
                          </h2>
                          <Badge
                            className={`mt-1 ${
                              teacherFullData.data.isActive
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            } border`}
                          >
                            {teacherFullData.data.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setViewingTeacherId(null);
                          setIsEditing(false);
                        }}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200 dark:border-gray-700 px-6">
                    <div className="flex gap-4">
                      <button className="py-4 px-2 border-b-2 border-blue-600 text-blue-600 font-medium text-sm">
                        Personal Info
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {isEditing ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <User className="w-4 h-4" />Full Name
                            </Label>
                            <Input
                              value={editFormData.name}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, name: e.target.value })
                              }
                              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <Mail className="w-4 h-4" />Email Address
                            </Label>
                            <Input
                              type="email"
                              value={editFormData.email}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, email: e.target.value })
                              }
                              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <Phone className="w-4 h-4" />Phone Number
                            </Label>
                            <Input
                              value={editFormData.phone}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, phone: e.target.value })
                              }
                              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-xl"
                              placeholder="Not provided"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />DOB
                            </Label>
                            <Input
                              type="date"
                              value={editFormData.dob}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, dob: e.target.value })
                              }
                              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Gender
                            </Label>
                            <select
                              value={editFormData.gender}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, gender: e.target.value })
                              }
                              className="h-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-3"
                            >
                              <option value="">Select</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Highest Qualification
                            </Label>
                            <Input
                              value={editFormData.highestQualification}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  highestQualification: e.target.value
                                })
                              }
                              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-xl"
                              placeholder="Not provided"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Experience (Years)
                            </Label>
                            <Input
                              type="number"
                              value={editFormData.experienceYears}
                              onChange={(e) =>
                                setEditFormData({
                                  ...editFormData,
                                  experienceYears: e.target.value
                                })
                              }
                              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-xl"
                              min={0}
                              max={60}
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />Address
                            </Label>
                            <Input
                              value={editFormData.address}
                              onChange={(e) =>
                                setEditFormData({ ...editFormData, address: e.target.value })
                              }
                              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded-xl"
                              placeholder="Not provided"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={handleSaveEdit}
                            disabled={updateTeacherMutation.isPending}
                            className="px-6 py-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg flex items-center gap-2"
                          >
                            {updateTeacherMutation.isPending ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Saving...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </button>
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="rounded-xl"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                              <User className="w-3 h-3" />Full Name
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {teacherFullData.data.name}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                              <Mail className="w-3 h-3" />Email Address
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white break-all">
                              {teacherFullData.data.email}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                              <Phone className="w-3 h-3" />Phone Number
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {teacherFullData.data.phone || 'Not provided'}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                              <Calendar className="w-3 h-3" />DOB
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {teacherFullData.data.dob
                                ? new Date(teacherFullData.data.dob).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })
                                : 'Not provided'}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Gender
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {teacherFullData.data.gender || 'Not provided'}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Highest Qualification
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {teacherFullData.data.highestQualification || 'Not provided'}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Experience (Years)
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {typeof teacherFullData.data.experienceYears === 'number'
                                ? teacherFullData.data.experienceYears
                                : 'Not provided'}
                            </p>
                          </div>

                          <div className="space-y-1 md:col-span-2">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                              <MapPin className="w-3 h-3" />Address
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {teacherFullData.data.address || 'Not provided'}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide flex items-center gap-2">
                              <Calendar className="w-3 h-3" />Date Joined
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-white">
                              {new Date(teacherFullData.data.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>

                        {/* Assignment History */}
                        {teacherFullData.data.history && teacherFullData.data.history.length > 0 && (
                          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                              <BookOpen className="w-5 h-5 text-blue-600" />
                              Assignment History
                            </h3>
                            <div className="space-y-3">
                              {teacherFullData.data.history.map((hist, idx) => (
                                <div
                                  key={idx}
                                  className={`p-4 rounded-xl border ${
                                    hist.isActive
                                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                                      : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
                                  }`}
                                >
                                  <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`p-2 rounded-lg ${
                                          hist.isActive
                                            ? 'bg-blue-100 dark:bg-blue-900/30'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                        }`}
                                      >
                                        <BookOpen
                                          className={`w-4 h-4 ${
                                            hist.isActive
                                              ? 'text-blue-600 dark:text-blue-400'
                                              : 'text-gray-600 dark:text-gray-400'
                                          }`}
                                        />
                                      </div>
                                      <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">
                                          {hist.className} - {hist.section}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                          {typeof hist.sessionId === 'object' ? hist.sessionId.name : 'Session'}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge
                                      className={`${
                                        hist.isActive
                                          ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                          : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                      } border`}
                                    >
                                      {hist.isActive ? 'Current' : 'Past'}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <button
                            onClick={handleEnableEdit}
                            className="px-6 py-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
                          >
                            <Edit className="w-4 h-4" />
                            Edit Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-gray-600 dark:text-gray-400">Unable to load teacher details</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assign Class Modal */}
      <AnimatePresence>
        {assigningTeacherId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setAssigningTeacherId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Assign Class</h3>
              </div>
              <select
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-xl text-gray-900 dark:text-white mb-4"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="">Select class</option>
                {classes.map((cls: Class) => (
                  <option key={`${cls.id}-${cls.sessionId}`} value={cls.id} disabled={!!cls.teacherId}>
                    {cls.name} - {cls.section}{cls.teacherId ? ' (Occupied)' : ''}
                  </option>
                ))}
              </select>
              <div className="flex gap-3">
                <button
                  className="px-6 py-2.5 bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
                  disabled={!selectedClassId}
                  onClick={handleAssignClass}
                >
                  Assign
                </button>
                <Button variant="outline" onClick={() => setAssigningTeacherId(null)} className="rounded-xl">
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSwappingTeacherId(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
                  <Edit className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Swap/Change Class</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Select a new class for this teacher. If occupied, teachers will be swapped.
              </p>
              <select
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-xl text-gray-900 dark:text-white mb-4"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="">Select class</option>
                {classes.map((cls: Class) => (
                  <option key={`${cls.id}-${cls.sessionId}`} value={cls.id}>
                    {cls.name} - {cls.section}{cls.teacherId ? ' (Occupied - will swap)' : ' (Available)'}
                  </option>
                ))}
              </select>
              <div className="flex gap-3">
                <button
                  className="px-6 py-2.5 bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
                  disabled={!selectedClassId}
                  onClick={handleSwapClass}
                >
                  Confirm
                </button>
                <Button variant="outline" onClick={() => setSwappingTeacherId(null)} className="rounded-xl">
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