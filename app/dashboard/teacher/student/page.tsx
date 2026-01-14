// 'use client';

// import { useState } from 'react';
// import { Plus, X, Users, Mail, Phone } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useCreateStudent, useStudents, type Student } from '@/app/querry/useStudent';

// /* =====================================================
//    ADD STUDENT PAGE (TEACHER)
// ===================================================== */

// export default function TeacherStudentsPage() {
//   const [open, setOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');

//   const { mutate: addStudent, isPending } = useCreateStudent();
//   const { data: students = [], isLoading, error } = useStudents();

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     admissionNo: '',
//     fatherName: '',
//     motherName: '',
//     parentsPhone: '',
//     rollNo: ''
//   });

//   // Filter students based on search
//   const filteredStudents = students.filter((student: Student) =>
//     student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   /* ---------------- handlers ---------------- */

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     addStudent(
//       {
//         ...formData,
//         rollNo: Number(formData.rollNo)
//       },
//       {
//         onSuccess: () => {
//           setFormData({
//             name: '',
//             email: '',
//             password: '',
//             admissionNo: '',
//             fatherName: '',
//             motherName: '',
//             parentsPhone: '',
//             rollNo: ''
//           });
//           setOpen(false);
//         }
//       }
//     );
//   };

//   /* ---------------- UI ---------------- */

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold flex items-center gap-2">
//             <Users className="w-6 h-6" />
//             My Students ({students.length})
//           </h1>
//           <p className="text-gray-600 mt-1">Manage your class students</p>
//         </div>

//         <Button
//           onClick={() => setOpen(!open)}
//           className="bg-blue-600 text-white gap-2"
//         >
//           {open ? <X size={16} /> : <Plus size={16} />}
//           {open ? 'Cancel' : 'Add Student'}
//         </Button>
//       </div>

//       {/* Search Bar */}
//       <div className="mb-6">
//         <Input
//           placeholder="Search students by name, email, or admission number..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="max-w-md"
//         />
//       </div>

//       {/* Add Student Form */}
//       {open && (
//         <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
//           <h2 className="text-lg font-semibold mb-4">
//             Add New Student
//           </h2>

//           <form
//             onSubmit={handleSubmit}
//             className="grid grid-cols-1 md:grid-cols-2 gap-4"
//           >
//             {/* Student Name */}
//             <div>
//               <Label>Student Name *</Label>
//               <Input
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Email */}
//             <div>
//               <Label>Email *</Label>
//               <Input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <Label>Temporary Password *</Label>
//               <Input
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Admission No */}
//             <div>
//               <Label>Admission No *</Label>
//               <Input
//                 name="admissionNo"
//                 value={formData.admissionNo}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Roll No */}
//             <div>
//               <Label>Roll No *</Label>
//               <Input
//                 type="number"
//                 name="rollNo"
//                 value={formData.rollNo}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Father Name */}
//             <div>
//               <Label>Father Name *</Label>
//               <Input
//                 name="fatherName"
//                 value={formData.fatherName}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Mother Name */}
//             <div>
//               <Label>Mother Name *</Label>
//               <Input
//                 name="motherName"
//                 value={formData.motherName}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Parent Phone */}
//             <div>
//               <Label>Parent Phone *</Label>
//               <Input
//                 name="parentsPhone"
//                 value={formData.parentsPhone}
//                 onChange={handleChange}
//                 required
//               />
//             </div>

//             {/* Submit */}
//             <div className="md:col-span-2 flex justify-end gap-3 mt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => setOpen(false)}
//               >
//                 Cancel
//               </Button>

//               <Button
//                 type="submit"
//                 disabled={isPending}
//                 className="bg-green-600 text-white"
//               >
//                 {isPending ? 'Saving...' : 'Add Student'}
//               </Button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* Students List */}
//       <div className="bg-white rounded-xl border shadow-sm">
//         {isLoading ? (
//           <div className="p-8 text-center">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-2 text-gray-600">Loading students...</p>
//           </div>
//         ) : error ? (
//           <div className="p-8 text-center">
//             <p className="text-red-600">Error loading students. Please try again.</p>
//           </div>
//         ) : filteredStudents.length === 0 ? (
//           <div className="p-8 text-center">
//             <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-600">
//               {searchTerm ? 'No students found matching your search.' : 'No students added yet.'}
//             </p>
//           </div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50 border-b">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Student
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Admission No
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Roll No
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Parent Contact
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Status
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredStudents.map((student: Student) => (
//                   <tr key={student._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">
//                           {student.name}
//                         </div>
//                         <div className="text-sm text-gray-500 flex items-center gap-1">
//                           <Mail className="w-3 h-3" />
//                           {student.email}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {student.admissionNo}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {student.history?.[0]?.rollNo || '-'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">
//                         <div>Father: {student.fatherName}</div>
//                         <div className="flex items-center gap-1 text-gray-500">
//                           <Phone className="w-3 h-3" />
//                           {student.parentsPhone}
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                         student.status === 'active' 
//                           ? 'bg-green-100 text-green-800'
//                           : student.status === 'inactive'
//                           ? 'bg-yellow-100 text-yellow-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                         {student.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { Plus, X, Users, Mail, Phone, Upload, Download, Search, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateStudent, useUpdateStudent, useStudents, type Student } from '@/app/querry/useStudent';

export default function TeacherStudentsPage() {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { mutate: addStudent, isPending: isAdding } = useCreateStudent();
  const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent();
  const { data: students = [], isLoading, error } = useStudents();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    admissionNo: '',
    fatherName: '',
    motherName: '',
    parentsPhone: '',
    rollNo: ''
  });

  // Calculate statistics
  const totalStudents = students.length;
  const highAttendance = students.filter((s: Student) => {
    const attendance = 85;
    return attendance >= 90;
  }).length;
  const mediumAttendance = students.filter((s: Student) => {
    const attendance = 80;
    return attendance >= 75 && attendance < 90;
  }).length;
  const lowAttendance = students.filter((s: Student) => {
    const attendance = 70;
    return attendance < 75;
  }).length;

  // Filter students
  const filteredStudents = students.filter((student: Student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.history?.[0]?.rollNo?.toString().includes(searchTerm)
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = () => {
    addStudent(
      {
        ...formData,
        rollNo: Number(formData.rollNo)
      },
      {
        onSuccess: () => {
          setFormData({
            name: '',
            email: '',
            password: '',
            admissionNo: '',
            fatherName: '',
            motherName: '',
            parentsPhone: '',
            rollNo: ''
          });
          setAddModalOpen(false);
        }
      }
    );
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      password: '',
      admissionNo: student.admissionNo,
      fatherName: student.fatherName,
      motherName: student.motherName,
      parentsPhone: student.parentsPhone,
      rollNo: student.history?.[0]?.rollNo?.toString() || ''
    });
    setEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (!editingStudent) return;

    updateStudent(
      {
        id: editingStudent._id,
        data: {
          ...formData,
          rollNo: Number(formData.rollNo)
        }
      },
      {
        onSuccess: () => {
          setEditModalOpen(false);
          setEditingStudent(null);
          setFormData({
            name: '',
            email: '',
            password: '',
            admissionNo: '',
            fatherName: '',
            motherName: '',
            parentsPhone: '',
            rollNo: ''
          });
        }
      }
    );
  };

  // Mock attendance data
  const getAttendance = (student: Student) => {
    const mock = [95, 88, 92, 78, 96, 85];
    return mock[Math.floor(Math.random() * mock.length)];
  };

  return (
    <div className="dashboard-bg min-h-screen p-3">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold dashboard-text mb-2">Students</h1>
          <p className="text-sm lg:text-base dashboard-text-muted">Class 10 - A | {totalStudents} students</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="dashboard-card border rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-3">
              <div className="accent-blue p-3 rounded-xl w-fit">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <div className="text-xs dashboard-text-muted mb-1">Total Students</div>
                <div className="text-2xl lg:text-3xl font-bold dashboard-text">{totalStudents}</div>
              </div>
            </div>
          </div>

          <div className="dashboard-card border rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-3">
              <div className="accent-green p-3 rounded-xl w-fit">
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-green-500 mb-1">≥90% Attendance</div>
                <div className="text-2xl lg:text-3xl font-bold text-green-500">{highAttendance}</div>
              </div>
            </div>
          </div>

          <div className="dashboard-card border rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-3">
              <div className="accent-orange p-3 rounded-xl w-fit">
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-orange-500 mb-1">75-90% Attendance</div>
                <div className="text-2xl lg:text-3xl font-bold text-orange-500">{mediumAttendance}</div>
              </div>
            </div>
          </div>

          <div className="dashboard-card border rounded-xl p-4 lg:p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col gap-3">
              <div className="bg-red-500 p-3 rounded-xl w-fit">
                <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div>
                <div className="text-xs text-red-500 mb-1">&lt;75% Attendance</div>
                <div className="text-2xl lg:text-3xl font-bold text-red-500">{lowAttendance}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Upload Section */}
        <div className="dashboard-card border rounded-xl p-4 lg:p-6 mb-6">
          <div className="flex flex-col lg:flex-row items-start gap-3">
            <Upload className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
            <div className="flex-1 w-full">
              <h3 className="font-semibold dashboard-text text-base lg:text-lg mb-1">Bulk Upload Students</h3>
              <p className="text-xs lg:text-sm dashboard-text-muted mb-4">Upload a CSV file to add multiple students at once</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="gap-2 text-sm">
                  <Upload className="w-4 h-4" />
                  Select CSV File
                </Button>
                <Button variant="outline" className="gap-2 text-sm">
                  <Download className="w-4 h-4" />
                  Download Sample
                </Button>
              </div>
              <p className="text-xs dashboard-text-muted mt-2">Required columns: rollno, name, phone</p>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="dashboard-card border rounded-xl">
          {/* Header */}
          <div className="p-4 lg:p-6 border-b dashboard-card-border flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <h2 className="text-lg lg:text-xl font-semibold dashboard-text">Student List</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-initial">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 dashboard-text-muted" />
                <Input
                  placeholder="Search by name or roll no..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64 dashboard-input"
                />
              </div>
              <Button 
                onClick={() => setAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white gap-2 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Student</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-3"></div>
              <p className="dashboard-text-muted">Loading students...</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <p className="text-red-600">Error loading students. Please try again.</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-16 h-16 dashboard-text-muted mx-auto mb-4 opacity-50" />
              <p className="dashboard-text-muted text-lg">
                {searchTerm ? 'No students found matching your search.' : 'No students added yet.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50 dark:bg-gray-800/50">
                  <tr>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold dashboard-text-muted uppercase tracking-wider">
                      Roll No
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold dashboard-text-muted uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold dashboard-text-muted uppercase tracking-wider hidden md:table-cell">
                      Email
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold dashboard-text-muted uppercase tracking-wider hidden sm:table-cell">
                      Phone
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold dashboard-text-muted uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold dashboard-text-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y dashboard-card-border">
                  {filteredStudents.map((student: Student) => {
                    const attendance = getAttendance(student);
                    const initial = student.name.charAt(0).toUpperCase();
                    const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-orange-500', 'bg-pink-500'];
                    const bgColor = colors[Math.floor(Math.random() * colors.length)];

                    return (
                      <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors">
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <span className="dashboard-text font-medium text-sm lg:text-base">
                            {String(student.history?.[0]?.rollNo || '-').padStart(3, '0')}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 lg:gap-3">
                            <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full ${bgColor} flex items-center justify-center text-white font-semibold text-sm lg:text-base flex-shrink-0`}>
                              {initial}
                            </div>
                            <span className="dashboard-text font-medium text-sm lg:text-base truncate max-w-[120px] sm:max-w-none">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap hidden md:table-cell">
                          <span className="dashboard-text-muted text-xs lg:text-sm">{student.email}</span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap hidden sm:table-cell">
                          <span className="dashboard-text-muted text-xs lg:text-sm">{student.parentsPhone}</span>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {attendance >= 90 && (
                              <>
                                <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 text-green-500 hidden sm:block" />
                                <span className="px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold bg-blue-600 text-white">
                                  {attendance}%
                                </span>
                              </>
                            )}
                            {attendance >= 75 && attendance < 90 && (
                              <span className="px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold bg-gray-600 text-white">
                                {attendance}%
                              </span>
                            )}
                            {attendance < 75 && (
                              <span className="px-2 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold bg-gray-600 text-white">
                                {attendance}%
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                          <div className="flex items-center gap-1 lg:gap-2">
                            <button
                              onClick={() => handleEdit(student)}
                              className="p-1.5 lg:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 dashboard-text-muted" />
                            </button>
                            <button className="p-1.5 lg:p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                              <Trash2 className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="dashboard-card border rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b dashboard-card-border flex items-center justify-between sticky top-0 dashboard-card z-10">
              <div>
                <h2 className="text-xl font-semibold dashboard-text">Add New Student</h2>
                <p className="text-sm dashboard-text-muted mt-1">Enter student details to add them to your class</p>
              </div>
              <button 
                onClick={() => setAddModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5 dashboard-text-muted" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <Label className="dashboard-text mb-2 block">Roll Number</Label>
                <Input
                  type="number"
                  name="rollNo"
                  placeholder="e.g., 007"
                  value={formData.rollNo}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Student Name</Label>
                <Input
                  name="name"
                  placeholder="Enter student's name"
                  value={formData.name}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Email (Optional)</Label>
                <Input
                  type="email"
                  name="email"
                  placeholder="student@school.edu"
                  value={formData.email}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Parent's Phone</Label>
                <Input
                  name="parentsPhone"
                  placeholder="+91 98765 43210"
                  value={formData.parentsPhone}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Admission No</Label>
                <Input
                  name="admissionNo"
                  value={formData.admissionNo}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Temporary Password</Label>
                <Input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Father Name</Label>
                <Input
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Mother Name</Label>
                <Input
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => setAddModalOpen(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isAdding}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isAdding ? 'Adding...' : 'Add Student'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editModalOpen && editingStudent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="dashboard-card border rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b dashboard-card-border flex items-center justify-between sticky top-0 dashboard-card z-10">
              <div>
                <h2 className="text-xl font-semibold dashboard-text">Edit Student</h2>
                <p className="text-sm dashboard-text-muted mt-1">Update student information</p>
              </div>
              <button 
                onClick={() => {
                  setEditModalOpen(false);
                  setEditingStudent(null);
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                <X className="w-5 h-5 dashboard-text-muted" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <Label className="dashboard-text mb-2 block">Roll Number</Label>
                <Input
                  type="number"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Student Name</Label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Parent's Phone</Label>
                <Input
                  name="parentsPhone"
                  value={formData.parentsPhone}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Admission No</Label>
                <Input
                  name="admissionNo"
                  value={formData.admissionNo}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Father Name</Label>
                <Input
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div>
                <Label className="dashboard-text mb-2 block">Mother Name</Label>
                <Input
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  className="dashboard-input"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    setEditModalOpen(false);
                    setEditingStudent(null);
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdating}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUpdating ? 'Updating...' : 'Update Student'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}