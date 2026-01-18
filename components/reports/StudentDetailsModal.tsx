'use client';

import { useState } from 'react';
import { X, Edit, CheckCircle } from 'lucide-react';

interface Student {
  rollNo: number;
  name: string;
  class: string;
  section: string;
  gender: string;
  dob: string;
  address: string;
  bloodGroup: string;
  attendance: number;
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  admissionNo: string;
}

interface Props {
  student: Student;
  onClose: () => void;
}

export default function StudentDetailsModal({ student, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'contact'>('personal');
  const [isEditing, setIsEditing] = useState(false);

  const renderTabButton = (id: typeof activeTab, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 text-sm font-medium rounded-lg ${
        activeTab === id
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-xl relative">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {student.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Roll No: {student.rollNo} · {student.class} {student.section}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              {student.attendance}%
            </span>

            <button onClick={onClose}>
              <X className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4">
          {renderTabButton('personal', 'Personal Info')}
          {renderTabButton('academic', 'Academic Info')}
          {renderTabButton('contact', 'Contact Info')}
        </div>

        {/* Content */}
        <div className="px-5 pb-5 space-y-4 text-sm">
          {/* PERSONAL INFO */}
          {activeTab === 'personal' && (
            <>
              <InfoRow label="Full Name" value={student.name} editable={isEditing} />
              <InfoRow label="Gender" value={student.gender} editable={isEditing} />
              <InfoRow label="Date of Birth" value={student.dob} editable={isEditing} />
              <InfoRow label="Blood Group" value={student.bloodGroup} editable={isEditing} />
              <InfoRow label="Address" value={student.address} editable={isEditing} />
            </>
          )}

          {/* ACADEMIC INFO (READ ONLY) */}
          {activeTab === 'academic' && (
            <>
              <InfoRow label="Roll Number" value={student.rollNo.toString()} />
              <InfoRow label="Admission No" value={student.admissionNo} />
              <InfoRow label="Class" value={student.class} />
              <InfoRow label="Section" value={student.section} />
              <InfoRow label="Attendance Rate" value={`${student.attendance}%`} />
            </>
          )}

          {/* CONTACT INFO */}
          {activeTab === 'contact' && (
            <>
              <InfoRow label="Email" value={student.email} editable={isEditing} />
              <InfoRow label="Phone" value={student.phone} editable={isEditing} />
              <InfoRow label="Parent Name" value={student.parentName} editable={isEditing} />
              <InfoRow label="Parent Phone" value={student.parentPhone} editable={isEditing} />
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-5 pb-5">
          {activeTab !== 'academic' && (
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm flex items-center gap-2 hover:bg-blue-700"
            >
              <Edit className="w-4 h-4" />
              {isEditing ? 'Save Changes' : 'Edit Details'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* Small reusable row */
function InfoRow({
  label,
  value,
  editable
}: {
  label: string;
  value: string;
  editable?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      {editable ? (
        <input
          defaultValue={value}
          className="border rounded-md px-2 py-1 text-sm w-48 dark:bg-gray-900 dark:border-gray-700"
        />
      ) : (
        <span className="text-gray-900 dark:text-white font-medium">
          {value}
        </span>
      )}
    </div>
  );
}
