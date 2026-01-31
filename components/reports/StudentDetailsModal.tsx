



// 'use client';

// import { useState } from 'react';
// import { X, Edit } from 'lucide-react';

// interface Student {
//   rollNo: number;
//   name: string;
//   class: string;
//   section: string;
//   gender: string;
//   dob: string;
//   address: string;
//   bloodGroup: string;
//   attendance: number;
//   email: string;
//   phone: string;
//   parentName: string;
//   parentPhone: string;
//   admissionNo: string;
// }

// interface Props {
//   student: Student;
//   onClose: () => void;
// }

// export default function StudentDetailsModal({ student, onClose }: Props) {
//   const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'contact'>('personal');
//   const [isEditing, setIsEditing] = useState(false);

//   const renderTabButton = (id: typeof activeTab, label: string) => (
//     <button
//       onClick={() => setActiveTab(id)}
//       className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
//         activeTab === id
//           ? 'border-blue-500 text-blue-500'
//           : 'border-transparent text-gray-400 hover:text-gray-300'
//       }`}
//     >
//       {label}
//     </button>
//   );

//   return (
//     <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
//       <div className="bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden">
//         {/* Header with gradient */}
//         <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 p-8 relative">
//           <button 
//             onClick={onClose}
//             className="absolute top-4 right-4 text-white/80 hover:text-white"
//           >
//             <X className="w-6 h-6" />
//           </button>
          
//           <div className="flex items-center gap-4">
//             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
//               <span className="text-2xl font-bold text-blue-600">
//                 {student.name.charAt(0).toLowerCase()}
//               </span>
//             </div>
//             <div>
//               <h3 className="text-2xl font-semibold text-white">
//                 {student.name}
//               </h3>
//               <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-green-400 text-gray-900">
//                 Active
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-6 px-6 pt-6 border-b border-gray-700">
//           {renderTabButton('personal', 'Personal Info')}
//           {renderTabButton('academic', 'Academic Info')}
//           {renderTabButton('contact', 'Contact Info')}
//         </div>

//         {/* Content */}
//         <div className="px-6 pb-6 pt-6 space-y-6">
//           {/* PERSONAL INFO */}
//           {activeTab === 'personal' && (
//             <div className="grid grid-cols-2 gap-6">
//               <InfoRow label="FULL NAME" value={student.name} icon="👤" editable={isEditing} />
//               <InfoRow label="EMAIL ADDRESS" value={student.email} icon="✉️" editable={isEditing} />
//               <InfoRow label="PHONE NUMBER" value={student.phone} icon="📞" editable={isEditing} />
//               <InfoRow label="DATE OF BIRTH" value={student.dob} icon="📅" editable={isEditing} />
//               <InfoRow label="GENDER" value={student.gender} icon="⚧" editable={isEditing} />
//               <InfoRow label="BLOOD GROUP" value={student.bloodGroup} icon="🩸" editable={isEditing} />
//               <div className="col-span-2">
//                 <InfoRow label="ADDRESS" value={student.address} icon="📍" editable={isEditing} />
//               </div>
//             </div>
//           )}

//           {/* ACADEMIC INFO (READ ONLY) */}
//           {activeTab === 'academic' && (
//             <>
//               <div className="bg-gray-700/50 rounded-xl p-6 space-y-4">
//                 <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
//                   <span>📚</span> Assignment History
//                 </h4>
//                 <div className="bg-gray-900/50 rounded-lg p-4 flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
//                       <span className="text-blue-400">📖</span>
//                     </div>
//                     <div>
//                       <div className="text-white font-medium">{student.class} - {student.section}</div>
//                       <div className="text-gray-400 text-sm">2025-2026</div>
//                     </div>
//                   </div>
//                   <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
//                     Current
//                   </span>
//                 </div>
//               </div>
              
//               <div className="grid grid-cols-2 gap-6 mt-6">
//                 <InfoRow label="ROLL NUMBER" value={student.rollNo.toString()} icon="🎓" />
//                 <InfoRow label="ADMISSION NO" value={student.admissionNo} icon="🆔" />
//                 <InfoRow label="CLASS" value={student.class} icon="🏫" />
//                 <InfoRow label="SECTION" value={student.section} icon="📋" />
//                 <InfoRow label="ATTENDANCE RATE" value={`${student.attendance}%`} icon="✓" />
//               </div>
//             </>
//           )}

//           {/* CONTACT INFO */}
//           {activeTab === 'contact' && (
//             <div className="grid grid-cols-2 gap-6">
//               <InfoRow label="EMAIL" value={student.email} icon="✉️" editable={isEditing} />
//               <InfoRow label="PHONE" value={student.phone} icon="📞" editable={isEditing} />
//               <InfoRow label="PARENT NAME" value={student.parentName} icon="👨‍👩‍👧" editable={isEditing} />
//               <InfoRow label="PARENT PHONE" value={student.parentPhone} icon="📱" editable={isEditing} />
//             </div>
//           )}
//         </div>

//         {/* Footer */}
//         <div className="flex justify-end gap-3 px-6 pb-6">
//           {activeTab !== 'academic' && (
//             <button
//               onClick={() => setIsEditing(!isEditing)}
//               className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
//             >
//               <Edit className="w-4 h-4" />
//               {isEditing ? 'Save Changes' : 'Edit Details'}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// /* Small reusable row */
// function InfoRow({
//   label,
//   value,
//   icon,
//   editable
// }: {
//   label: string;
//   value: string;
//   icon?: string;
//   editable?: boolean;
// }) {
//   return (
//     <div className="space-y-2">
//       <label className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-2">
//         {icon && <span>{icon}</span>}
//         {label}
//       </label>
//       {editable ? (
//         <input
//           defaultValue={value}
//           className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       ) : (
//         <div className="text-white font-medium text-sm">
//           {value}
//         </div>
//       )}
//     </div>
//   );
// }

// // Demo component to show the modal
// function Demo() {
//   const [isOpen, setIsOpen] = useState(true);

//   const sampleStudent: Student = {
//     rollNo: 101,
//     name: 'Rohit Kumar',
//     class: '10',
//     section: 'A',
//     gender: 'Male',
//     dob: 'January 15, 2010',
//     address: '123 Main Street, Patna, Bihar',
//     bloodGroup: 'O+',
//     attendance: 95,
//     email: 'rohit@gmail.com',
//     phone: '9943567866',
//     parentName: 'Rajesh Kumar',
//     parentPhone: '9876543210',
//     admissionNo: 'ADM2024001'
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//         >
//           Open Student Details
//         </button>
//       )}
//       {isOpen && (
//         <StudentDetailsModal
//           student={sampleStudent}
//           onClose={() => setIsOpen(false)}
//         />
//       )}
//     </div>
//   );
// }




'use client';

import { useEffect, useState } from 'react';
import { X, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { useStudentById, useUpdateStudent } from '@/app/querry/useStudent';

interface Props {
  studentId: string;
  onClose: () => void;
}

export default function StudentDetailsModal({ studentId, onClose }: Props) {
  const { data: student, isLoading } = useStudentById(studentId);
  const { mutate: updateStudent, isPending: isUpdating } = useUpdateStudent();
  const [activeTab, setActiveTab] = useState<'personal' | 'academic' | 'contact'>('personal');
  const [isEditing, setIsEditing] = useState(false);

  type EditForm = {
    name: string;
    fatherName: string;
    motherName: string;
    parentsPhone: string;
    rollNo: string;
    dob: string;
    gender: '' | 'male' | 'female' | 'other';
    bloodGroup: '' | 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  };

  const [form, setForm] = useState<EditForm>({
    name: '',
    fatherName: '',
    motherName: '',
    parentsPhone: '',
    rollNo: '',
    dob: '',
    gender: '',
    bloodGroup: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof EditForm, string>>>({});

  useEffect(() => {
    if (!student) return;
    const activeHistory = student.history?.find(h => h.isActive) || student.history?.[0];

    const normalizeDateInputValue = (raw: unknown) => {
      if (!raw) return '';
      const d = new Date(String(raw));
      if (Number.isNaN(d.getTime())) return '';
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    setForm({
      name: student.name || '',
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      parentsPhone: student.parentsPhone || '',
      rollNo: String(activeHistory?.rollNo ?? ''),
      dob: normalizeDateInputValue((student as any).dob),
      gender: ((student as any).gender as EditForm['gender']) || '',
      bloodGroup: ((student as any).bloodGroup as EditForm['bloodGroup']) || ''
    });
    setFormErrors({});
    setIsEditing(false);
  }, [studentId, student]);

  const isValidDateInputValue = (value: string) => {
    if (!value) return true;
    const d = new Date(value);
    return !Number.isNaN(d.getTime());
  };

  const calcAgeYears = (dob: Date) => {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age -= 1;
    }
    return age;
  };

  if (isLoading || !student) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <div className="text-white">Loading student details...</div>
      </div>
    );
  }

  const activeHistory = student.history?.find(h => h.isActive) || student.history?.[0];

  const normalizePhoneTo10Digits = (raw: string) => {
    const digits = raw.replace(/\D/g, '');

    if (digits.length === 10) {
      return { ok: true as const, digits10: digits, hasCountryCode: false };
    }

    if (digits.length === 12 && digits.startsWith('91')) {
      return { ok: true as const, digits10: digits.slice(2), hasCountryCode: true };
    }

    return { ok: false as const, digits10: '', hasCountryCode: false };
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof EditForm, string>> = {};

    if (form.name.trim().length < 3) {
      nextErrors.name = 'Name must be at least 3 characters';
    }

    if (form.fatherName.trim().length < 3) {
      nextErrors.fatherName = "Father's name must be at least 3 characters";
    }

    if (form.motherName.trim().length < 3) {
      nextErrors.motherName = "Mother's name must be at least 3 characters";
    }

    const phoneCheck = normalizePhoneTo10Digits(form.parentsPhone);
    if (!phoneCheck.ok) {
      nextErrors.parentsPhone = 'Phone number must be 10 digits (or +91 followed by 10 digits)';
    }

    const rollNoNum = Number(form.rollNo);
    if (!form.rollNo || Number.isNaN(rollNoNum) || rollNoNum <= 0 || !Number.isInteger(rollNoNum)) {
      nextErrors.rollNo = 'Roll number must be a positive integer';
    } else if (rollNoNum > 200) {
      nextErrors.rollNo = 'Roll number cannot be greater than 200';
    }

    if (!isValidDateInputValue(form.dob)) {
      nextErrors.dob = 'DOB is invalid';
    } else if (form.dob) {
      const d = new Date(form.dob);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (d > today) {
        nextErrors.dob = 'DOB cannot be in the future';
      } else if (calcAgeYears(d) < 2) {
        nextErrors.dob = 'DOB must be at least 2 years ago';
      }
    }

    if (form.gender && !['male', 'female', 'other'].includes(form.gender)) {
      nextErrors.gender = 'Gender is invalid';
    }

    if (
      form.bloodGroup &&
      !['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(form.bloodGroup)
    ) {
      nextErrors.bloodGroup = 'Blood group is invalid';
    }

    setFormErrors(nextErrors);
    return nextErrors;
  };

  const handleCancelEdit = () => {
    const normalizeDateInputValue = (raw: unknown) => {
      if (!raw) return '';
      const d = new Date(String(raw));
      if (Number.isNaN(d.getTime())) return '';
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    setForm({
      name: student.name || '',
      fatherName: student.fatherName || '',
      motherName: student.motherName || '',
      parentsPhone: student.parentsPhone || '',
      rollNo: String(activeHistory?.rollNo ?? ''),
      dob: normalizeDateInputValue((student as any).dob),
      gender: ((student as any).gender as EditForm['gender']) || '',
      bloodGroup: ((student as any).bloodGroup as EditForm['bloodGroup']) || ''
    });
    setFormErrors({});
    setIsEditing(false);
  };

  const handleSave = () => {
    const errors = validateForm();
    if (Object.keys(errors).length) {
      toast.error(Object.values(errors)[0] || 'Please fix the form errors');
      return;
    }

    const phoneCheck = normalizePhoneTo10Digits(form.parentsPhone);
    const phoneToStore = phoneCheck.ok
      ? phoneCheck.hasCountryCode
        ? `+91 ${phoneCheck.digits10}`
        : form.parentsPhone.trim()
      : form.parentsPhone.trim();

    updateStudent(
      {
        id: studentId,
        data: {
          name: form.name.trim(),
          dob: form.dob ? new Date(form.dob).toISOString() : undefined,
          gender: form.gender || undefined,
          bloodGroup: form.bloodGroup || undefined,
          fatherName: form.fatherName.trim(),
          motherName: form.motherName.trim(),
          parentsPhone: phoneToStore,
          rollNo: Number(form.rollNo)
        }
      },
      {
        onSuccess: () => {
          toast.success('Student updated successfully');
          setIsEditing(false);
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Failed to update student');
        }
      }
    );
  };

  const modalStudent = {
    rollNo: activeHistory?.rollNo || 0,
    name: student.name,
    class: activeHistory?.className || '',
    section: activeHistory?.section || '',
    gender: (student as any).gender || '',
    dob: (student as any).dob || '',
   
    bloodGroup: (student as any).bloodGroup || '',
    attendance: (student as any).attendance || 0,
    email: student.email || '',
    motherName: student.motherName,
    fatherName: student.fatherName,
    parentPhone: student.parentsPhone,
    admissionNo: student.admissionNo
  };

  const renderTabButton = (id: typeof activeTab, label: string) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
        activeTab === id
          ? 'border-blue-500 text-blue-500'
          : 'border-transparent text-gray-400 hover:text-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="dashboard-card border dashboard-card-border rounded-2xl w-full max-w-2xl shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-purple-700 p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">
                {modalStudent.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white">
                {modalStudent.name}
              </h3>
              <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium bg-green-400 text-gray-900">
                Active
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 px-6 pt-6 border-b dashboard-card-border">
          {renderTabButton('personal', 'Personal Info')}
          {renderTabButton('academic', 'Academic Info')}
          {renderTabButton('contact', 'Contact Info')}
        </div>

        {/* Content */}
        <div className="px-6 pb-6 pt-6 space-y-6">
          {/* PERSONAL INFO */}
          {activeTab === 'personal' && (
            <div className="grid grid-cols-2 gap-6">
              <InfoRow
                label="FULL NAME"
                value={form.name}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, name: v }))}
                error={formErrors.name}
              />
              <InfoRow label="EMAIL ADDRESS" value={modalStudent.email} />
              
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  DATE OF BIRTH
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={form.dob}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, dob: e.target.value }));
                      setFormErrors((prev) => ({ ...prev, dob: undefined }));
                    }}
                    className="w-full px-3 py-2 text-sm dashboard-card border dashboard-card-border rounded-lg dashboard-text focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="dashboard-text font-medium text-sm">
                    {form.dob || '-'}
                  </div>
                )}
                {formErrors.dob && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {formErrors.dob}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  GENDER
                </label>
                {isEditing ? (
                  <select
                    value={form.gender}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, gender: e.target.value as EditForm['gender'] }));
                      setFormErrors((prev) => ({ ...prev, gender: undefined }));
                    }}
                    className="w-full px-3 py-2 text-sm dashboard-card border dashboard-card-border rounded-lg dashboard-text focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <div className="dashboard-text font-medium text-sm">
                    {form.gender || '-'}
                  </div>
                )}
                {formErrors.gender && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {formErrors.gender}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  BLOOD GROUP
                </label>
                {isEditing ? (
                  <select
                    value={form.bloodGroup}
                    onChange={(e) => {
                      setForm((p) => ({ ...p, bloodGroup: e.target.value as EditForm['bloodGroup'] }));
                      setFormErrors((prev) => ({ ...prev, bloodGroup: undefined }));
                    }}
                    className="w-full px-3 py-2 text-sm dashboard-card border dashboard-card-border rounded-lg dashboard-text focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <div className="dashboard-text font-medium text-sm">
                    {form.bloodGroup || '-'}
                  </div>
                )}
                {formErrors.bloodGroup && (
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                    {formErrors.bloodGroup}
                  </p>
                )}
              </div>
             
            </div>
          )}

          {/* ACADEMIC INFO */}
          {activeTab === 'academic' && (
            <>
              <div className="grid grid-cols-2 gap-6">
                <InfoRow
                  label="ROLL NUMBER"
                  value={form.rollNo}
                  editable={isEditing}
                  onChange={(v) => setForm((p) => ({ ...p, rollNo: v }))}
                  error={formErrors.rollNo}
                />
                <InfoRow label="ADMISSION NO" value={modalStudent.admissionNo} />
                <InfoRow label="CLASS" value={modalStudent.class} />
                <InfoRow label="SECTION" value={modalStudent.section} />
                <InfoRow label="ATTENDANCE RATE" value={`${modalStudent.attendance}%`} />
              </div>
            </>
          )}

          {/* CONTACT INFO */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-2 gap-6">
              <InfoRow label="EMAIL" value={modalStudent.email} editable={isEditing} />
           
              <InfoRow
                label="FATHER NAME"
                value={form.fatherName}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, fatherName: v }))}
                error={formErrors.fatherName}
              />
              <InfoRow
                label="MOTHER NAME"
                value={form.motherName}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, motherName: v }))}
                error={formErrors.motherName}
              />
              <InfoRow
                label="PARENT PHONE"
                value={form.parentsPhone}
                editable={isEditing}
                onChange={(v) => setForm((p) => ({ ...p, parentsPhone: v }))}
                error={formErrors.parentsPhone}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Details
            </button>
          ) : (
            <>
              <button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                className="px-6 py-2.5 rounded-lg dashboard-card border dashboard-card-border text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Edit className="w-4 h-4" />
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =============================
   Reusable Info Row
============================= */
function InfoRow({
  label,
  value,
  editable,
  onChange,
  error
}: {
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {label}
      </label>
      {editable ? (
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full px-3 py-2 text-sm dashboard-card border dashboard-card-border rounded-lg dashboard-text focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <div className="dashboard-text font-medium text-sm">
          {value}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
