'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Plus,
  X,
  Upload,
  Download,
  Mail,
  BookOpen,
  Trash2,
  Edit,
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
  useReactivateTeacher,
  useAssignClassToTeacher,
  useBulkUploadTeachers,
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
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [assigningTeacherId, setAssigningTeacherId] = useState<string | null>(null);
  const [swappingTeacherId, setSwappingTeacherId] = useState<string | null>(null);
  const [viewingTeacherId, setViewingTeacherId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState('');

  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(
    null
  );

  const [showReassignOnDelete, setShowReassignOnDelete] = useState(false);
  const [reassignToTeacherId, setReassignToTeacherId] = useState('');
  const [isReassigningAndDeleting, setIsReassigningAndDeleting] = useState(false);

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

  const [bulkTeacherFile, setBulkTeacherFile] = useState<File | null>(null);
  const [bulkTeacherClientErrors, setBulkTeacherClientErrors] = useState<string[]>([]);

  const { mutate: createTeacher } = useCreateTeacher();
  const { mutate: deleteTeacher } = useDeleteTeacher();
  const { mutate: reactivateTeacher, isPending: isReactivatingTeacher } = useReactivateTeacher();
  const bulkUploadTeachersMutation = useBulkUploadTeachers();
  const assignClassMutation = useAssignClassToTeacher();
  const swapClassMutation = useSwapTeacherClasses();

  const [confirmReactivate, setConfirmReactivate] = useState<
    { id: string; email: string } | null
  >(null);

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
    if (data.name !== undefined) {
      const trimmed = data.name.trim();
      const lettersCount = (trimmed.match(/[A-Za-z]/g) || []).length;
      if (lettersCount < 3) {
        return 'Name must contain at least 3 letters';
      }
    }

    if (data.email !== undefined && data.email.trim().length > 0) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      if (!emailOk) return 'Please enter a valid email';
    }

    if (data.phone === undefined || data.phone.trim().length === 0) {
      return 'Phone is required';
    }

    const phoneOk = /^[0-9]{10}$/.test(data.phone);
    if (!phoneOk) return 'Phone must be exactly 10 digits (numbers only)';

    if (data.dob === undefined || data.dob.trim().length === 0) {
      return 'DOB is required';
    }

    const d = new Date(data.dob);
    if (isNaN(d.getTime())) return 'Invalid date of birth';
    const today = new Date();
    if (d.getTime() > today.getTime()) return 'DOB cannot be in the future';

    const age =
      today.getFullYear() -
      d.getFullYear() -
      (today.getMonth() < d.getMonth() ||
      (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())
        ? 1
        : 0);

    if (age < 18) return 'DOB must be at least 18 years ago';

    if (data.gender === undefined || data.gender.trim().length === 0) {
      return 'Gender is required';
    }

    if (!['male', 'female', 'other'].includes(data.gender)) {
      return 'Invalid gender';
    }

    if (
      data.highestQualification !== undefined &&
      data.highestQualification.trim().length > 0
    ) {
      const trimmed = data.highestQualification.trim();
      const lettersCount = (trimmed.match(/[A-Za-z]/g) || []).length;
      if (lettersCount < 2)
        return 'Highest qualification must contain at least 2 letters';
      if (trimmed.length > 100)
        return 'Highest qualification cannot exceed 100 characters';
    }

    if (
      data.experienceYears !== undefined &&
      data.experienceYears.trim().length > 0
    ) {
      const n = Number(data.experienceYears);
      if (!Number.isFinite(n) || !Number.isInteger(n)) {
        return 'Experience years must be a whole number';
      }
      if (n < 0) return 'Experience cannot be negative';
      if (n > 42) return 'Experience cannot be greater than 42 years';

      if (n > age) return 'Experience years cannot be greater than age';
      if (age - n < 14)
        return 'DOB and experience years difference must be at least 14 years';
    }

    if (data.address !== undefined && data.address.trim().length > 0) {
      const trimmed = data.address.trim();
      const lettersCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
      if (lettersCount < 5) return 'Address must contain at least 5 letters';
      if (trimmed.length > 250) return 'Address cannot exceed 250 characters';
    }

    return null;
  };

  const maxDob = (() => {
    const d = new Date();
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().slice(0, 10);
  })();

  const getErrorMessage = (error: any) => {
    const data = error?.data;

    const issues = Array.isArray(data?.errors) ? data.errors : null;
    if (issues && issues.length > 0) {
      const first = issues[0];
      const msg = typeof first?.message === 'string' ? first.message : '';
      const path = Array.isArray(first?.path) ? first.path.join('.') : '';
      if (path && msg) return `${path}: ${msg}`;
      if (msg) return msg;
    }

    if (typeof error?.message === 'string' && error.message.trim().length > 0) {
      return error.message;
    }

    return 'Request failed';
  };

  const resetBulkTeachersUpload = () => {
    setBulkTeacherFile(null);
    setBulkTeacherClientErrors([]);
  };

  const parseCsvLine = (line: string) => {
    const out: string[] = [];
    let cur = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }
      if (ch === ',' && !inQuotes) {
        out.push(cur);
        cur = '';
        continue;
      }
      cur += ch;
    }
    out.push(cur);
    return out.map((v) => v.trim());
  };

  const validateTeacherCsvFile = async (csvFile: File) => {
    const text = await csvFile.text();
    const lines = text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (!lines.length) {
      return { ok: false, errors: ['CSV file is empty'] };
    }

    const headers = parseCsvLine(lines[0]).map((h) => h.trim());
    const requiredHeaders = ['name', 'email', 'password', 'phone', 'dob', 'gender'];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length) {
      return {
        ok: false,
        errors: [
          `Missing required columns: ${missingHeaders.join(', ')}`,
          'Please download the sample CSV and follow the same header names.'
        ]
      };
    }

    const idx = (name: string) => headers.indexOf(name);
    const errors: string[] = [];

    const parseDobToDate = (raw: string) => {
      const v = String(raw || '').trim();
      if (!v) return null;

      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        const d = new Date(v);
        return isNaN(d.getTime()) ? null : d;
      }

      const m = v.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (m) {
        const dd = Number(m[1]);
        const mm = Number(m[2]);
        const yyyy = Number(m[3]);
        if (dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12) {
          const d = new Date(yyyy, mm - 1, dd);
          if (d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd) {
            return d;
          }
        }
        return null;
      }

      const fallback = new Date(v);
      return isNaN(fallback.getTime()) ? null : fallback;
    };

    for (let r = 1; r < lines.length; r++) {
      const rowNo = r + 1;
      const cells = parseCsvLine(lines[r]);
      const get = (h: string) => (cells[idx(h)] ?? '').trim();

      const name = get('name');
      const email = get('email');
      const password = get('password');
      const phone = get('phone');
      const dob = get('dob');
      const genderRaw = get('gender');
      const gender = genderRaw.toLowerCase();

      const highestQualification = headers.includes('highestQualification')
        ? get('highestQualification')
        : '';
      const experienceYears = headers.includes('experienceYears') ? get('experienceYears') : '';
      const address = headers.includes('address') ? get('address') : '';

      let ageYears: number | null = null;

      const nameLetters = (name.match(/[A-Za-z]/g) || []).length;
      if (!name || nameLetters < 3) errors.push(`Row ${rowNo}: name must contain at least 3 letters`);

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!email) errors.push(`Row ${rowNo}: email is required`);
      else if (!emailOk) errors.push(`Row ${rowNo}: email is invalid`);

      if (!password) errors.push(`Row ${rowNo}: password is required`);
      else if (password.length < 6) errors.push(`Row ${rowNo}: password must be at least 6 characters`);

      const phoneOk = /^\d{10}$/.test(phone);
      if (!phone) errors.push(`Row ${rowNo}: phone is required`);
      else if (!phoneOk) errors.push(`Row ${rowNo}: phone must be exactly 10 digits (numbers only)`);

      if (!dob) errors.push(`Row ${rowNo}: dob is required`);
      else {
        const d = parseDobToDate(dob);
        if (!d) errors.push(`Row ${rowNo}: dob is invalid`);
        else {
          const today = new Date();
          if (d.getTime() > today.getTime()) errors.push(`Row ${rowNo}: dob cannot be in the future`);
          else {
            const age =
              today.getFullYear() -
              d.getFullYear() -
              (today.getMonth() < d.getMonth() ||
              (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())
                ? 1
                : 0);
            ageYears = age;
            if (age < 18) errors.push(`Row ${rowNo}: dob must be at least 18 years ago`);
          }
        }
      }

      if (!genderRaw) errors.push(`Row ${rowNo}: gender is required`);
      else if (!['male', 'female', 'other'].includes(gender))
        errors.push(`Row ${rowNo}: gender must be male, female, or other`);

      if (highestQualification) {
        const letters = (highestQualification.match(/[A-Za-z]/g) || []).length;
        if (letters < 2)
          errors.push(`Row ${rowNo}: highestQualification must contain at least 2 letters`);
        if (highestQualification.length > 100)
          errors.push(`Row ${rowNo}: highestQualification cannot exceed 100 characters`);
      }

      if (experienceYears) {
        const n = Number(experienceYears);
        if (!Number.isFinite(n) || !Number.isInteger(n)) {
          errors.push(`Row ${rowNo}: experienceYears must be a whole number`);
        } else {
          if (n < 0) errors.push(`Row ${rowNo}: experienceYears cannot be negative`);
          if (n > 42) errors.push(`Row ${rowNo}: experienceYears cannot be greater than 42`);

          if (ageYears !== null) {
            if (n > ageYears)
              errors.push(`Row ${rowNo}: experienceYears cannot be greater than age`);
            else if (ageYears - n < 14)
              errors.push(
                `Row ${rowNo}: dob and experienceYears difference must be at least 14 years`
              );
          }
        }
      }

      if (address) {
        const letters = (address.match(/[A-Za-z]/g) || []).length;
        if (letters < 5) errors.push(`Row ${rowNo}: address must contain at least 5 letters`);
        if (address.length > 250) errors.push(`Row ${rowNo}: address cannot exceed 250 characters`);
      }
    }

    if (errors.length) {
      return { ok: false, errors };
    }

    return { ok: true, errors: [] as string[] };
  };

  const downloadTeacherSampleCsv = () => {
    const csvContent =
      'name,email,password,phone,dob,gender,highestQualification,experienceYears,address\nJohn Doe,john@example.com,pass1234,9876543210,2000-01-15,male,B.Ed,5,Some street address';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teachers_sample.csv';
    a.click();
  };

  const handleBulkTeacherUpload = async () => {
    if (!bulkTeacherFile) {
      toast.error('Please select a CSV file');
      return;
    }

    const validation = await validateTeacherCsvFile(bulkTeacherFile);
    if (!validation.ok) {
      setBulkTeacherClientErrors(validation.errors);
      toast.error(validation.errors[0] || 'CSV validation failed');
      return;
    }

    setBulkTeacherClientErrors([]);
    bulkUploadTeachersMutation.mutate(
      { file: bulkTeacherFile },
      {
        onSuccess: (resp: any) => {
          if (resp && resp.success === false) {
            toast.error(resp?.message || 'CSV validation failed');
            return;
          }
          toast.success(resp?.message || 'Teachers uploaded successfully');
          resetBulkTeachersUpload();
          setIsBulkUploadOpen(false);
        },
        onError: (err: any) => {
          const msg = err?.data?.validationErrors?.length
            ? `CSV validation failed. Row ${err.data.validationErrors[0].row}: ${err.data.validationErrors[0].message}`
            : getErrorMessage(err);
          toast.error(msg);
        }
      }
    );
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
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender as any,
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
          const code = error?.data?.code;
          if (code === 'TEACHER_INACTIVE_EMAIL_EXISTS') {
            const teacherId = String(error?.data?.teacherId || '');
            const email = String(error?.data?.email || formData.email || '').trim();
            if (teacherId) {
              setConfirmReactivate({ id: teacherId, email });
              return;
            }
          }

          toast.error(getErrorMessage(error));
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
      phone: string;
      email?: string;
      dob: string;
      gender: 'male' | 'female' | 'other';
      highestQualification?: string;
      experienceYears?: number;
      address?: string;
    } = {
      phone: editFormData.phone,
      dob: editFormData.dob,
      gender: editFormData.gender as 'male' | 'female' | 'other'
    };

    if (editFormData.name) updateData.name = editFormData.name;
    if (editFormData.email) updateData.email = editFormData.email;
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
        toast.error(getErrorMessage(error));
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
      label: 'Assigned',
      value: teachers.filter((t: Teacher) => t.currentClass).length,
      bgGradient: 'from-purple-500 to-violet-600'
    }
  ];

  const swappingTeacherCurrentClassId =
    swappingTeacherId && teachers?.length
      ? (teachers.find((t: Teacher) => t.id === swappingTeacherId)?.currentClass
          ?.classId ?? null)
      : null;

  const teacherToDelete = confirmDelete
    ? (teachers as Teacher[]).find((t) => t.id === confirmDelete.id)
    : undefined;

  const unassignedTeachers = (teachers as Teacher[]).filter(
    (t) => !t.currentClass && t.id !== confirmDelete?.id
  );

  const handleReassignAndDelete = async () => {
    if (!confirmDelete) return;
    if (!teacherToDelete?.currentClass) return;

    if (!reassignToTeacherId) {
      toast.error('Please select a teacher to reassign this class to');
      return;
    }

    const classToReassign = (classes as Class[]).find(
      (c) => c.id === teacherToDelete.currentClass!.classId
    );

    if (!classToReassign) {
      toast.error('Unable to find class details required for reassignment');
      return;
    }

    setIsReassigningAndDeleting(true);
    assignClassMutation.mutate(
      {
        teacherId: reassignToTeacherId,
        sessionId: classToReassign.sessionId,
        classId: classToReassign.id,
        className: classToReassign.name,
        section: classToReassign.section
      },
      {
        onSuccess: () => {
          deleteTeacher(confirmDelete.id);
          setConfirmDelete(null);
          setShowReassignOnDelete(false);
          setReassignToTeacherId('');
          setIsReassigningAndDeleting(false);
        },
        onError: (err: any) => {
          const msg = err?.message || 'Failed to reassign class';
          toast.error(msg);
          setIsReassigningAndDeleting(false);
        }
      }
    );
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 overflow-hidden min-h-screen">
      <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-900 shadow-2xl border-b border-purple-500/20">
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
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsBulkUploadOpen(true)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
              >
                <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span>Bulk Upload</span>
              </button>
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className={`group bg-gradient-to-br border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                  i === 0
                    ? 'from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200/50 dark:border-blue-700/50'
                    : i === 1
                      ? 'from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200/50 dark:border-green-700/50'
                      : 'from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200/50 dark:border-orange-700/50'
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
                        Name <span className="text-red-500">*</span>
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
                        Email <span className="text-red-500">*</span>
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
                        Password <span className="text-red-500">*</span>
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
                        Phone <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => {
                          const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                          setFormData({ ...formData, phone: v });
                        }}
                        required
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                        placeholder="10 digits"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        DOB <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={formData.dob}
                        onChange={(e) =>
                          setFormData({ ...formData, dob: e.target.value })
                        }
                        max={maxDob}
                        required
                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          setFormData({ ...formData, gender: e.target.value })
                        }
                        required
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

          <AnimatePresence>
            {isBulkUploadOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => {
                  resetBulkTeachersUpload();
                  setIsBulkUploadOpen(false);
                }}
              >
                <motion.div
                  initial={{ scale: 0.92, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.92, y: 10 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-2xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                        <Upload className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          Bulk Upload Teachers
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Upload a CSV to create teachers
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        resetBulkTeachersUpload();
                        setIsBulkUploadOpen(false);
                      }}
                      className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Required columns: Name, Email, Password, Phone, Dob, Gender <br/>
                      Optional: Highest Qualification, Experience Years, Address
                    </p>
                    <button
                      onClick={downloadTeacherSampleCsv}
                      className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center gap-2 shadow-sm"
                    >
                      <Download className="w-4 h-4" /> Sample CSV
                    </button>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => {
                        setBulkTeacherClientErrors([]);
                        setBulkTeacherFile(e.target.files?.[0] || null);
                      }}
                      className="w-full text-sm text-gray-700 dark:text-gray-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 dark:file:bg-blue-500 dark:hover:file:bg-blue-600 file:shadow-sm file:cursor-pointer cursor-pointer"
                    />

                    {bulkTeacherClientErrors.length > 0 && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <p className="text-red-600 dark:text-red-400 text-sm font-semibold mb-2">
                          Please fix the following issues in your CSV:
                        </p>
                        <div className="space-y-1">
                          {bulkTeacherClientErrors.slice(0, 12).map((msg) => (
                            <p key={msg} className="text-red-600 dark:text-red-400 text-xs">
                              {msg}
                            </p>
                          ))}
                          {bulkTeacherClientErrors.length > 12 && (
                            <p className="text-red-600 dark:text-red-400 text-xs">
                              And {bulkTeacherClientErrors.length - 12} more...
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={handleBulkTeacherUpload}
                      disabled={bulkUploadTeachersMutation.isPending || !bulkTeacherFile}
                      className="px-6 py-2.5 bg-gradient-to-br from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 shadow-lg"
                    >
                      {bulkUploadTeachersMutation.isPending ? 'Uploading...' : 'Upload CSV'}
                    </button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        resetBulkTeachersUpload();
                        setIsBulkUploadOpen(false);
                      }}
                      className="rounded-xl"
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
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

            <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center px-6 py-3">
              <div className="col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Name
              </div>
              <div className="col-span-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Email
              </div>
              <div className="col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                Assigned Class
              </div>
              <div className="col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide text-right mr-24">
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
                teachers.map((teacher: Teacher) => (
                  <div
                    key={teacher.id}
                    className="p-4 sm:p-5 lg:px-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="lg:hidden space-y-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="bg-gradient-to-br from-teal-500 to-cyan-600 w-12 h-12">
                          <AvatarFallback className="text-white font-bold text-2xl bg-white">
                            {teacher.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                              {teacher.name}
                            </h3>
                            <Badge
                              className={`mt-1 ${
                                teacher.isActive
                                  ? 'bg-green-100 text-green-700 border-green-200'
                                  : 'bg-gray-100 text-gray-700 border-gray-200'
                              } border`}
                            >
                              {teacher.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {teacher.email}
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
                          <Eye className="w-4 h-4" /> View
                        </button>

                        {teacher.currentClass && (
                          <button
                            onClick={() => setSwappingTeacherId(teacher.id)}
                            className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center justify-center gap-2 shadow-sm min-w-[96px]"
                          >
                            <Edit className="w-4 h-4" /> Swap
                          </button>
                        )}

                        {!teacher.currentClass && (
                          <button
                            onClick={() => setAssigningTeacherId(teacher.id)}
                            className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center justify-center gap-2 shadow-sm min-w-[96px]"
                          >
                            Assign
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setConfirmDelete({ id: teacher.id, name: teacher.name });
                            setShowReassignOnDelete(false);
                            setReassignToTeacherId('');
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm flex items-center gap-2 shadow-sm"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                      <div className="col-span-3 flex items-center gap-3">
                        <Avatar className="bg-gradient-to-br from-teal-500 to-cyan-600">
                          <AvatarFallback className="text-white font-bold text-2xl bg-white">
                            {teacher.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {teacher.name}
                        </span>
                      </div>

                      <div className="col-span-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                        <Mail className="w-4 h-4" /> {teacher.email}
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

                      <div className="col-span-3 flex gap-2 justify-end">
                        <button
                          onClick={() => handleViewTeacher(teacher.id)}
                          className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-xl hover:opacity-90 transition-all text-sm flex items-center gap-2 shadow-sm"
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>

                        {teacher.currentClass && (
                          <button
                            onClick={() => setSwappingTeacherId(teacher.id)}
                            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center justify-center gap-2 shadow-sm min-w-[96px]"
                          >
                            <Edit className="w-4 h-4" /> Swap
                          </button>
                        )}

                        {!teacher.currentClass && (
                          <button
                            onClick={() => setAssigningTeacherId(teacher.id)}
                            className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center justify-center gap-2 shadow-sm min-w-[96px]"
                          >
                            Assign
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setConfirmDelete({ id: teacher.id, name: teacher.name });
                            setShowReassignOnDelete(false);
                            setReassignToTeacherId('');
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm flex items-center gap-2 shadow-sm"
                          title="Delete"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Confirm Delete (Deactivate Teacher) */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => {
              setConfirmDelete(null);
              setShowReassignOnDelete(false);
              setReassignToTeacherId('');
              setIsReassigningAndDeleting(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.92, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Delete Teacher
                </h3>
                <button
                  onClick={() => {
                    setConfirmDelete(null);
                    setShowReassignOnDelete(false);
                    setReassignToTeacherId('');
                    setIsReassigningAndDeleting(false);
                  }}
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                Are you sure you want to remove this teacher? This will mark the teacher as inactive.
                <span className="font-semibold text-gray-900 dark:text-white">
                  {' '}
                  {confirmDelete.name}
                </span>
              </p>

              {teacherToDelete?.currentClass && (
                <div className="mb-5">
                  {!showReassignOnDelete ? (
                    <button
                      onClick={() => setShowReassignOnDelete(true)}
                      className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm shadow-sm"
                    >
                      Reassign class to another teacher
                    </button>
                  ) : (
                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Reassign Class {teacherToDelete.currentClass.className} -{' '}
                        {teacherToDelete.currentClass.section}
                      </p>

                      <select
                        value={reassignToTeacherId}
                        onChange={(e) => setReassignToTeacherId(e.target.value)}
                        className="h-10 w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl px-3 text-sm"
                      >
                        <option value="">Select unassigned teacher</option>
                        {unassignedTeachers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>

                      {unassignedTeachers.length === 0 && (
                        <p className="text-xs text-orange-700 dark:text-orange-400 mt-2">
                          No unassigned teachers available.
                        </p>
                      )}

                      <div className="flex gap-3 justify-end mt-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowReassignOnDelete(false);
                            setReassignToTeacherId('');
                          }}
                          className="rounded-xl"
                        >
                          Back
                        </Button>
                        <button
                          onClick={handleReassignAndDelete}
                          disabled={
                            isReassigningAndDeleting ||
                            !reassignToTeacherId ||
                            unassignedTeachers.length === 0
                          }
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50"
                        >
                          {isReassigningAndDeleting ? 'Reassigning...' : 'Reassign & Delete'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setConfirmDelete(null);
                    setShowReassignOnDelete(false);
                    setReassignToTeacherId('');
                    setIsReassigningAndDeleting(false);
                  }}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
                {!showReassignOnDelete && (
                  <button
                    onClick={() => {
                      if (showReassignOnDelete || isReassigningAndDeleting) return;

                      const id = confirmDelete.id;
                      setConfirmDelete(null);
                      setShowReassignOnDelete(false);
                      setReassignToTeacherId('');
                      setIsReassigningAndDeleting(false);
                      deleteTeacher(id);
                    }}
                    disabled={isReassigningAndDeleting}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50"
                  >
                    Yes, Delete
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reactivate Teacher */}
      <AnimatePresence>
        {confirmReactivate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setConfirmReactivate(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Reactivate Teacher
                </h3>
                <button
                  onClick={() => setConfirmReactivate(null)}
                  className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                This email already exists with inactive status.
                <span className="font-semibold text-gray-900 dark:text-white"> {confirmReactivate.email}</span>
                . Would you like to make this teacher active?
              </p>

              <div className="flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setConfirmReactivate(null)}
                  className="rounded-xl"
                >
                  No
                </Button>
                <button
                  onClick={() => {
                    const id = confirmReactivate.id;
                    reactivateTeacher(id, {
                      onSuccess: (resp: any) => {
                        toast.success(resp?.message || 'Teacher activated successfully');
                        setConfirmReactivate(null);
                        setIsAddTeacherOpen(false);
                      },
                      onError: (err: any) => {
                        toast.error(getErrorMessage(err));
                      }
                    });
                  }}
                  disabled={isReactivatingTeacher}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg disabled:opacity-50"
                >
                  {isReactivatingTeacher ? 'Activating...' : 'Yes, Activate'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                          {/* <Badge
                            className={`mt-1 ${
                              teacherFullData.data.isActive
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-gray-100 text-gray-700 border-gray-200'
                            } border`}
                          >
                            {teacherFullData.data.isActive ? 'Active' : 'Inactive'}
                          </Badge> */}
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
                              type="tel"
                              inputMode="numeric"
                              maxLength={10}
                              value={editFormData.phone}
                              onChange={(e) => {
                                const v = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setEditFormData({ ...editFormData, phone: v });
                              }}
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
                              max={maxDob}
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
                                    {/* <Badge
                                      className={`${
                                        hist.isActive
                                          ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                                          : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700'
                                      } border`}
                                    >
                                      {hist.isActive ? 'Current' : 'Past'}
                                    </Badge> */}
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
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Assign Class
                </h3>
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
                <Button
                  variant="outline"
                  onClick={() => setAssigningTeacherId(null)}
                  className="rounded-xl"
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
                Select an available class for this teacher.
              </p>
              <select
                className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-xl text-gray-900 dark:text-white mb-4"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
              >
                <option value="">Select class</option>
                {classes.map((cls: Class) => (
                  <option
                    key={`${cls.id}-${cls.sessionId}`}
                    value={cls.id}
                    disabled={
                      !!cls.teacherId ||
                      (swappingTeacherCurrentClassId
                        ? cls.id === swappingTeacherCurrentClassId
                        : false)
                    }
                  >
                    {cls.name} - {cls.section}
                    {swappingTeacherCurrentClassId && cls.id === swappingTeacherCurrentClassId
                      ? ' (Current)'
                      : cls.teacherId
                        ? ' (Occupied)'
                        : ' (Available)'}
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