'use client';

import { useState } from 'react';
import { Plus, X, Users, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateStudent, useStudents, type Student } from '@/app/querry/useStudent';

/* =====================================================
   ADD STUDENT PAGE (TEACHER)
===================================================== */

export default function TeacherStudentsPage() {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { mutate: addStudent, isPending } = useCreateStudent();
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

  // Filter students based on search
  const filteredStudents = students.filter((student: Student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ---------------- handlers ---------------- */

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addStudent(
      {
        ...formData,
        email: formData.email.trim() === '' ? undefined : formData.email,
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
          setOpen(false);
        }
      }
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            My Students ({students.length})
          </h1>
          <p className="text-gray-600 mt-1">Manage your class students</p>
        </div>

        <Button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 text-white gap-2"
        >
          {open ? <X size={16} /> : <Plus size={16} />}
          {open ? 'Cancel' : 'Add Student'}
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <Input
          placeholder="Search students by name, email, or admission number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Add Student Form */}
      {open && (
        <div className="bg-white border rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">
            Add New Student
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Student Name */}
            <div>
              <Label>Student Name *</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Password */}
            <div>
              <Label>Temporary Password *</Label>
              <Input
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Admission No */}
            <div>
              <Label>Admission No *</Label>
              <Input
                name="admissionNo"
                value={formData.admissionNo}
                onChange={handleChange}
                required
              />
            </div>

            {/* Roll No */}
            <div>
              <Label>Roll No *</Label>
              <Input
                type="number"
                name="rollNo"
                value={formData.rollNo}
                onChange={handleChange}
                required
              />
            </div>

            {/* Father Name */}
            <div>
              <Label>Father Name *</Label>
              <Input
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Mother Name */}
            <div>
              <Label>Mother Name *</Label>
              <Input
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Parent Phone */}
            <div>
              <Label>Parent Phone *</Label>
              <Input
                name="parentsPhone"
                value={formData.parentsPhone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isPending}
                className="bg-green-600 text-white"
              >
                {isPending ? 'Saving...' : 'Add Student'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Students List */}
      <div className="bg-white rounded-xl border shadow-sm">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading students...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error loading students. Please try again.</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              {searchTerm ? 'No students found matching your search.' : 'No students added yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Admission No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Roll No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Parent Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStudents.map((student: Student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {student.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.admissionNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.history?.[0]?.rollNo || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Father: {student.fatherName}</div>
                        <div className="flex items-center gap-1 text-gray-500">
                          <Phone className="w-3 h-3" />
                          {student.parentsPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        student.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : student.status === 'inactive'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
