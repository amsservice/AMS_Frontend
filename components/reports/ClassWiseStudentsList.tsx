'use client';

import { useState } from 'react';
import { Users, Search, Eye } from 'lucide-react';
import StudentDetailsModal from '@/components/reports/StudentDetailsModal';
import { useReports } from '@/components/reports/context/ReportContext';

/* ================= TYPES ================= */
interface Student {
  rollNo: number;
  admissionNo: string;
  name: string;
  class: string;
  section: string;
  gender: 'Male' | 'Female';
  dob: string;
  address: string;
  bloodGroup: string;
  attendance: number;
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
}

/* ================= DEMO DATA ================= */
const studentsData: Student[] = [
  {
    rollNo: 101,
    admissionNo: 'ADM001',
    name: 'Aarav Sharma',
    class: 'Class 1',
    section: 'A',
    gender: 'Male',
    dob: '2010-05-15',
    address: '123 Main St, Delhi',
    bloodGroup: 'B+',
    attendance: 95,
    email: 'aarav@school.com',
    phone: '9876543210',
    parentName: 'Rajesh Sharma',
    parentPhone: '9876543211'
  },
  {
    rollNo: 102,
    admissionNo: 'ADM002',
    name: 'Priya Patel',
    class: 'Class 1',
    section: 'A',
    gender: 'Female',
    dob: '2010-08-22',
    address: '45 Patel Nagar, Ahmedabad',
    bloodGroup: 'O+',
    attendance: 88,
    email: 'priya@school.com',
    phone: '9876543220',
    parentName: 'Suresh Patel',
    parentPhone: '9876543221'
  },
  {
    rollNo: 103,
    admissionNo: 'ADM003',
    name: 'Arjun Kumar',
    class: 'Class 2',
    section: 'B',
    gender: 'Male',
    dob: '2009-11-10',
    address: 'MG Road, Bengaluru',
    bloodGroup: 'A+',
    attendance: 92,
    email: 'arjun@school.com',
    phone: '9876543230',
    parentName: 'Ramesh Kumar',
    parentPhone: '9876543231'
  },
  {
    rollNo: 104,
    admissionNo: 'ADM004',
    name: 'Ananya Singh',
    class: 'Class 2',
    section: 'A',
    gender: 'Female',
    dob: '2009-03-19',
    address: 'Civil Lines, Prayagraj',
    bloodGroup: 'AB+',
    attendance: 78,
    email: 'ananya@school.com',
    phone: '9876543240',
    parentName: 'Pankaj Singh',
    parentPhone: '9876543241'
  }
];

/* ================= COMPONENT ================= */
export default function ClassWiseStudentList() {
  const { selectedClass } = useReports();
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const filteredStudents = studentsData.filter((student) => {
    const matchesClass =
      selectedClass === 'All Classes' || student.class === selectedClass;

    const matchesSearch =
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNo.toString().includes(search);

    return matchesClass && matchesSearch;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Class-wise Student List
          </h2>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or roll no"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="py-3">Roll No</th>
              <th className="py-3">Name</th>
              <th className="py-3">Class</th>
              <th className="py-3">Section</th>
              <th className="py-3">Gender</th>
              <th className="py-3">Attendance</th>
              <th className="py-3 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {filteredStudents.map((student) => (
              <tr
                key={student.rollNo}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/40"
              >
                <td className="py-4 font-medium">{student.rollNo}</td>

                <td className="py-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {student.name.charAt(0)}
                  </div>
                  {student.name}
                </td>

                <td className="py-4">{student.class}</td>
                <td className="py-4">{student.section}</td>

                <td className="py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700">
                    {student.gender}
                  </span>
                </td>

                <td className="py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      student.attendance >= 90
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {student.attendance}%
                  </span>
                </td>

                <td className="py-4 text-right">
                  <button
                    onClick={() => setSelectedStudent(student)}
                    className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <p className="text-center py-6 text-gray-500 dark:text-gray-400">
            No students found
          </p>
        )}
      </div>

      {/* ===== MODAL ===== */}
      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
}
