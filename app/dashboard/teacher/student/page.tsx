'use client';

import { useState, DragEvent, useEffect, useRef, type ChangeEvent } from 'react';
import { Upload, UserPlus, Download, FileSpreadsheet, UploadCloud, X, CheckCircle, Users, Mail, Phone, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

/* =====================================================
  IMPORT YOUR ACTUAL API HOOKS
===================================================== */
import { useBulkUploadStudents, useCreateStudent, useStudents, type Student } from '@/app/querry/useStudent';
import StudentDetailsModal from '@/components/reports/StudentDetailsModal';

/* =====================================================
  DRAG DROP CSV COMPONENT
===================================================== */
interface DragDropCSVProps {
  onFileSelect: (file: File) => void;
  onClear?: () => void;
  selectedFile?: File | null;
}

function DragDropCSV({ onFileSelect, onClear, selectedFile }: DragDropCSVProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(selectedFile?.name || null);

  useEffect(() => {
    setFileName(selectedFile?.name || null);
  }, [selectedFile]);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Only CSV files are allowed');
      return;
    }

    setFileName(file.name);
    onFileSelect(file);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast.error('Only CSV files are allowed');
      return;
    }

    setFileName(file.name);
    onFileSelect(file);
  };

  const handleRemoveFile = () => {
    setFileName(null);
    const input = document.getElementById('csv-upload-input') as HTMLInputElement;
    if (input) input.value = '';
    onClear?.();
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 transform
          ${isDragging
            ? 'border-accent-blue bg-blue-50 dark:bg-blue-900/30 scale-[1.02] shadow-lg'
            : fileName
              ? 'dashboard-card-border bg-green-50 dark:bg-green-900/20 hover:border-accent-green'
              : 'dashboard-card-border hover:border-accent-blue hover:shadow-dashboard'
          }`}
      >
        <input
          type="file"
          accept=".csv"
          className="hidden"
          id="csv-upload-input"
          onChange={handleFileInputChange}
        />

        <label htmlFor="csv-upload-input" className="cursor-pointer">
          <div className="flex flex-col items-center gap-4">
            {fileName ? (
              <>
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                    <FileSpreadsheet className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 p-1 bg-white dark:bg-slate-900 rounded-full">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-base sm:text-lg font-bold dashboard-text">
                    {fileName}
                  </p>
                  <p className="text-sm dashboard-text-muted">
                    File ready to upload
                  </p>
                  <p className="text-xs dashboard-text-muted">
                    Click or drop another file to replace
                  </p>
                </div>

                <div className="px-4 py-2 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl">
                  <p className="text-xs font-medium text-green-700 dark:text-green-400">
                    ✓ CSV file selected
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${isDragging
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 scale-110'
                  : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                  }`}>
                  <UploadCloud className={`w-10 h-10 sm:w-12 sm:h-12 text-white transition-transform duration-300 ${isDragging ? 'animate-bounce' : ''
                    }`} />
                </div>

                <div className="space-y-2">
                  <p className="text-base sm:text-lg font-bold dashboard-text">
                    {isDragging ? 'Drop your CSV file here' : 'Drag & drop CSV file here'}
                  </p>
                  <p className="text-sm dashboard-text-muted">
                    or click to browse from your computer
                  </p>
                </div>

                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
                    Supported format: .csv
                  </p>
                </div>
              </>
            )}
          </div>
        </label>

        {fileName && (
          <button
            onClick={(e) => {
              e.preventDefault();
              handleRemoveFile();
            }}
            className="absolute top-3 right-3 p-2 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-xl transition-all hover:scale-110"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 border dashboard-card-border rounded-xl">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileSpreadsheet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-semibold dashboard-text">CSV Only</p>
            <p className="text-xs dashboard-text-muted">Upload .csv files</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 border dashboard-card-border rounded-xl">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <UploadCloud className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-semibold dashboard-text">Easy Upload</p>
            <p className="text-xs dashboard-text-muted">Drag or click</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 border dashboard-card-border rounded-xl">
          <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-xs font-semibold dashboard-text">Validated</p>
            <p className="text-xs dashboard-text-muted">Auto-checked</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
  TYPES
===================================================== */

interface SingleStudentForm {
  name: string;
  email: string;
  password: string;
  admissionNo: string;
  fatherName: string;
  motherName: string;
  parentsPhone: string;
  rollNo: string;
}

const strictEmailRegex =
  /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|in)$/;

/* =====================================================
  MAIN PAGE COMPONENT
===================================================== */

export default function TeacherStudentsPage() {
  const {
    mutate: createStudent,
    isPending: creatingStudent,
    error: singleError
  } = useCreateStudent();

  const {
    mutate: uploadStudents,
    isPending: uploading,
    isSuccess,
    data,
    error: bulkError
  } = useBulkUploadStudents();

  const { data: students = [], isLoading: studentsLoading, error: studentsError } = useStudents();

  const [searchTerm, setSearchTerm] = useState('');
  const [openSingle, setOpenSingle] = useState(false);
  const [openBulk, setOpenBulk] = useState(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [isBulkUiLocked, setIsBulkUiLocked] = useState(false);

  /* ---------------- SINGLE STUDENT ---------------- */
  const initialStudent: SingleStudentForm = {
    name: '',
    email: '',
    password: '',
    admissionNo: '',
    fatherName: '',
    motherName: '',
    parentsPhone: '',
    rollNo: ''
  };

  const [student, setStudent] = useState<SingleStudentForm>(initialStudent);
  const [singleErrors, setSingleErrors] = useState<
    Partial<Record<keyof SingleStudentForm, string>>
  >({});

  /* ---------------- BULK UPLOAD ---------------- */
  const [file, setFile] = useState<File | null>(null);
  const [bulkClientErrors, setBulkClientErrors] = useState<string[]>([]);

  const handleClearBulk = () => {
    setFile(null);
    setBulkClientErrors([]);
  };

  useEffect(() => {
    if (!openBulk) {
      handleClearBulk();
    }
  }, [openBulk]);

  const handleSingleSubmit = () => {
    const errors: Partial<Record<keyof SingleStudentForm, string>> = {};

    const trimmedName = student.name.trim();
    const trimmedEmail = student.email.trim();
    const trimmedPassword = student.password;
    const trimmedAdmissionNo = student.admissionNo.trim();
    const trimmedFatherName = student.fatherName.trim();
    const trimmedMotherName = student.motherName.trim();
    const trimmedParentsPhone = student.parentsPhone.trim();
    const trimmedRollNo = student.rollNo.trim();

    if (trimmedName.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }

    if (trimmedFatherName.length < 3) {
      errors.fatherName = "Father's name must be at least 3 characters";
    }

    if (trimmedMotherName.length < 3) {
      errors.motherName = "Mother's name must be at least 3 characters";
    }

    if (trimmedPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!trimmedAdmissionNo) {
      errors.admissionNo = 'Admission number is required';
    }

    const phoneDigits = trimmedParentsPhone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      errors.parentsPhone = 'Phone number must be exactly 10 digits';
    }

    const rollNoNum = Number(trimmedRollNo);
    if (
      !trimmedRollNo ||
      Number.isNaN(rollNoNum) ||
      rollNoNum <= 0 ||
      !Number.isInteger(rollNoNum)
    ) {
      errors.rollNo = 'Roll number must be a positive integer';
    } else if (rollNoNum > 200) {
      errors.rollNo = 'Roll number cannot be greater than 200';
    }

    if (trimmedEmail) {
      if (!strictEmailRegex.test(trimmedEmail)) {
        errors.email = 'Please enter a valid email address';
      }
    }

    setSingleErrors(errors);

    if (Object.keys(errors).length) {
      toast.error(Object.values(errors)[0] || 'Please fix form errors');
      return;
    }

    createStudent(
      {
        name: trimmedName,
        email: trimmedEmail ? trimmedEmail.toLowerCase() : undefined,
        password: trimmedPassword,
        admissionNo: trimmedAdmissionNo,
        fatherName: trimmedFatherName,
        motherName: trimmedMotherName,
        parentsPhone: trimmedParentsPhone,
        rollNo: rollNoNum
      },
      {
        onSuccess: () => {
          toast.success('Student added successfully');
          setStudent(initialStudent);
          setSingleErrors({});
          setOpenSingle(false);
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Failed to add student');
        }
      }
    );
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
    return out.map(v => v.trim());
  };

  const validateCsvFile = async (csvFile: File) => {
    const text = await csvFile.text();
    const lines = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    if (!lines.length) {
      return { ok: false, errors: ['CSV file is empty'] };
    }

    const headers = parseCsvLine(lines[0]).map(h => h.trim());

    const requiredHeaders = [
      'name',
      'password',
      'admissionNo',
      'fatherName',
      'motherName',
      'parentsPhone',
      'rollNo'
    ];

    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
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
    const seenAdmission = new Set<string>();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    for (let r = 1; r < lines.length; r++) {
      const rowNo = r + 1;
      const cells = parseCsvLine(lines[r]);

      const get = (h: string) => (cells[idx(h)] ?? '').trim();

      const name = get('name');
      const password = get('password');
      const admissionNo = get('admissionNo');
      const fatherName = get('fatherName');
      const motherName = get('motherName');
      const parentsPhone = get('parentsPhone');
      const rollNoRaw = get('rollNo');
      const email = headers.includes('email') ? get('email') : '';

      if (!name || name.length < 3) errors.push(`Row ${rowNo}: name must be at least 3 characters`);
      if (!password || password.length < 6) errors.push(`Row ${rowNo}: password must be at least 6 characters`);
      if (!admissionNo) errors.push(`Row ${rowNo}: admissionNo is required`);
      if (!fatherName) errors.push(`Row ${rowNo}: fatherName is required`);
      if (!motherName) errors.push(`Row ${rowNo}: motherName is required`);

      const phoneDigits = parentsPhone.replace(/\D/g, '');
      if (!parentsPhone || phoneDigits.length < 10) {
        errors.push(`Row ${rowNo}: parentsPhone must be at least 10 digits`);
      }

      const rollNoNum = Number(rollNoRaw);
      if (!rollNoRaw || Number.isNaN(rollNoNum) || rollNoNum <= 0 || !Number.isInteger(rollNoNum)) {
        errors.push(`Row ${rowNo}: rollNo must be a positive integer`);
      }

      if (email && !emailRegex.test(email)) {
        errors.push(`Row ${rowNo}: email is invalid`);
      }

      if (admissionNo) {
        const key = admissionNo.toLowerCase();
        if (seenAdmission.has(key)) {
          errors.push(`Row ${rowNo}: duplicate admissionNo '${admissionNo}' in CSV`);
        }
        seenAdmission.add(key);
      }
    }

    if (errors.length) {
      return { ok: false, errors };
    }

    return { ok: true, errors: [] as string[] };
  };

  const getApiErrorMessage = (err: unknown) => {
    const e = err as any;
    const msg = e?.message ? String(e.message) : 'Upload failed';
    const invalidRows = e?.data?.invalidRows;
    if (Array.isArray(invalidRows) && invalidRows.length) {
      const firstFew = invalidRows
        .slice(0, 5)
        .map((r: any) => `Row ${r.row}: ${r.reason}`)
        .join(' | ');
      return `${msg}. ${firstFew}${invalidRows.length > 5 ? ' ...' : ''}`;
    }
    return msg;
  };

  const handleBulkUpload = async () => {
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    const validation = await validateCsvFile(file);
    if (!validation.ok) {
      setBulkClientErrors(validation.errors);
      toast.error(validation.errors[0] || 'CSV validation failed');
      return;
    }
    setBulkClientErrors([]);

    setIsBulkUiLocked(true);
    setSearchTerm('');

    uploadStudents(
      { file },
      {
        onSuccess: (resp: any) => {
          toast.success(resp?.message || 'Students uploaded successfully');
          handleClearBulk();
          setIsBulkUiLocked(false);
        },
        onError: (err: any) => {
          toast.error(getApiErrorMessage(err));
          setIsBulkUiLocked(false);
        }
      }
    );
  };

  const downloadSample = () => {
    const csvContent =
      'name,email,password,admissionNo,fatherName,motherName,parentsPhone,rollNo\nRahul Sharma,rahul@example.com,pass123,ADM001,Mr. Sharma,Mrs. Sharma,+91 98765 43210,1\nPriya Patel,priya@example.com,pass456,ADM002,Mr. Patel,Mrs. Patel,+91 98765 43211,2';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_sample.csv';
    a.click();
  };

  const filteredStudents = students.filter((s: Student) => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return true;
    return (
      s.name?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.admissionNo?.toLowerCase().includes(q)
    );
  });

  useEffect(() => {
    setVisibleCount(10);
  }, [searchTerm]);

  useEffect(() => {
    if (visibleCount >= filteredStudents.length) return;

    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => Math.min(prev + 10, filteredStudents.length));
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [filteredStudents.length, visibleCount]);

  const visibleStudents = filteredStudents.slice(0, visibleCount);

  const fieldLabels: Record<keyof SingleStudentForm, string> = {
    name: 'Student Name',
    email: 'Email Address',
    password: 'Password',
    admissionNo: 'Admission Number',
    fatherName: "Father's Name",
    motherName: "Mother's Name",
    parentsPhone: "Parent's Phone",
    rollNo: 'Roll Number'
  };

  return (
    <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-slate-900 dark:to-purple-950 overflow-hidden min-h-screen">
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 dark:from-indigo-900 dark:via-purple-900 dark:to-indigo-950 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                My Students
              </h1>
              <p className="mt-2 text-sm sm:text-base text-indigo-100 font-medium">
                Manage your class students ({students.length} total)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setOpenSingle(true)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Add Student
              </button>
              <button
                onClick={() => setOpenBulk(true)}
                className="px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl font-semibold transition-all flex items-center gap-2"
              >
                <Upload className="w-4 h-4" /> Bulk Upload
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {isBulkUiLocked && (
            <div className="dashboard-card border dashboard-card-border rounded-2xl shadow-dashboard-lg p-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <p className="dashboard-text font-semibold">
                  Bulk upload in progress. Student list will refresh once it completes.
                </p>
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm dashboard-text-muted">Uploading...</span>
                </div>
              </div>
            </div>
          )}

          <div className="dashboard-card border dashboard-card-border rounded-2xl shadow-dashboard-lg p-4">
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students by name, email or admission no..."
              disabled={isBulkUiLocked}
              className="w-full px-4 py-3 dashboard-card border dashboard-card-border rounded-xl dashboard-text focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all"
            />
          </div>

          <div className="dashboard-card border dashboard-card-border rounded-2xl shadow-dashboard-lg overflow-hidden">
            <div className="px-6 py-5 border-b dashboard-card-border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold dashboard-text">Students ({students.length})</h3>
                  <p className="text-sm dashboard-text-muted">Your class students</p>
                </div>
              </div>
            </div>

            <div className="p-0">
              {studentsLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 dashboard-text-muted">Loading students...</p>
                </div>
              ) : studentsError ? (
                <div className="p-8 text-center">
                  <p className="text-red-600 dark:text-red-400">Error loading students.</p>
                </div>
              ) : filteredStudents.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                  <p className="dashboard-text-muted">
                    {searchTerm ? 'No students found matching your search.' : 'No students added yet.'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-slate-800/40 border-b dashboard-card-border">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Admission No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Roll No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Parent Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y dashboard-card-border">
                      {visibleStudents.map((s: Student) => {
                        const active = s.history?.find(h => h.isActive) || s.history?.[0];

                        return (
                          <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/30">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium dashboard-text">{s.name}</div>
                                <div className="text-sm dashboard-text-muted flex items-center gap-1">
                                  <Mail className="w-3 h-3" />
                                  {s.email}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm dashboard-text">
                              {s.admissionNo}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm dashboard-text">
                              {active?.rollNo ?? ''}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm dashboard-text">
                                <div>Father: {s.fatherName}</div>
                                <div>Mother: {s.motherName}</div>
                                <div className="flex items-center gap-1 dashboard-text-muted">
                                  <Phone className="w-3 h-3" />
                                  {s.parentsPhone}
                                </div>
                              </div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setSelectedStudentId(s._id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                >
                                  <Edit2 className="w-4 h-4" />
                                  View
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

              {selectedStudentId && (
                <StudentDetailsModal
                  studentId={selectedStudentId}
                  onClose={() => setSelectedStudentId(null)}
                />
              )}
            </div>
          </div>

          {visibleCount < filteredStudents.length && (
            <div ref={loadMoreRef} className="p-4 text-center">
              <p className="text-sm dashboard-text-muted">Loading more...</p>
            </div>
          )}

          {/* ADD STUDENT MODAL */}
          <AnimatePresence>
            {openSingle && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              >
                <div className="w-full max-w-3xl dashboard-card border dashboard-card-border rounded-2xl shadow-dashboard-lg overflow-hidden max-h-[85vh]">
                  <div className="px-6 py-5 border-b dashboard-card-border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                        <UserPlus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold dashboard-text">Add Student</h3>
                        <p className="text-sm dashboard-text-muted">Create a new student in your class</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setOpenSingle(false)}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-5 overflow-y-auto max-h-[calc(85vh-96px)]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {Object.entries(student).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-sm font-semibold dashboard-text mb-2">
                            {fieldLabels[key as keyof SingleStudentForm]}
                          </label>
                          <input
                            type={
                              key === 'password'
                                ? 'password'
                                : key === 'email'
                                  ? 'email'
                                  : 'text'
                            }
                            placeholder={`Enter ${fieldLabels[key as keyof SingleStudentForm].toLowerCase()}`}
                            value={value}
                            onChange={(e) => {
                              setStudent({ ...student, [key]: e.target.value });
                              setSingleErrors(prev => ({ ...prev, [key]: undefined }));
                            }}
                            className="w-full px-4 py-3 dashboard-card border dashboard-card-border rounded-xl dashboard-text focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all"
                          />

                          {singleErrors[key as keyof SingleStudentForm] && (
                            <p className="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
                              {singleErrors[key as keyof SingleStudentForm]}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setOpenSingle(false)}
                        className="flex-1 px-6 py-3 dashboard-card border dashboard-card-border rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSingleSubmit}
                        disabled={creatingStudent}
                        className="flex-1 px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {creatingStudent ? 'Adding...' : 'Add Student'}
                      </button>
                    </div>

                    {singleError && (
                      <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                        <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                          {(singleError as any)?.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* BULK UPLOAD MODAL */}
          <AnimatePresence>
            {openBulk && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              >
                <div className="w-full max-w-3xl dashboard-card border dashboard-card-border rounded-2xl shadow-dashboard-lg overflow-hidden max-h-[85vh]">
                  <div className="px-6 py-5 border-b dashboard-card-border bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold dashboard-text">Bulk Upload Students</h3>
                        <p className="text-sm dashboard-text-muted">Upload multiple students to your class</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setOpenBulk(false)}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-96px)]">
                    <div className="space-y-5">
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="dashboard-text font-semibold">Upload CSV for your class</div>
                        <button
                          onClick={downloadSample}
                          className="px-4 py-2 dashboard-card border dashboard-card-border rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
                        >
                          <Download className="w-4 h-4 text-accent-teal" />
                          <span className="dashboard-text text-sm font-medium">Sample CSV</span>
                        </button>
                      </div>

                      <DragDropCSV
                        onFileSelect={setFile}
                        selectedFile={file}
                        onClear={handleClearBulk}
                      />

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                        <p className="text-sm dashboard-text font-medium mb-2">
                          <strong>Required CSV columns:</strong>
                        </p>
                        <code className="block text-xs dashboard-text-muted font-mono bg-white dark:bg-slate-900 p-3 rounded-lg border dashboard-card-border">
                          name, email, password, admissionNo, fatherName, motherName, parentsPhone, rollNo
                        </code>
                      </div>

                      {bulkClientErrors.length > 0 && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                          <p className="text-red-600 dark:text-red-400 text-sm font-semibold mb-2">
                            Please fix the following issues in your CSV:
                          </p>
                          <div className="space-y-1">
                            {bulkClientErrors.slice(0, 12).map((msg) => (
                              <p key={msg} className="text-red-600 dark:text-red-400 text-xs">
                                {msg}
                              </p>
                            ))}
                            {bulkClientErrors.length > 12 && (
                              <p className="text-red-600 dark:text-red-400 text-xs">
                                And {bulkClientErrors.length - 12} more...
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleBulkUpload}
                        disabled={uploading || !file}
                        className="w-full px-6 py-3 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {uploading ? 'Uploading...' : 'Upload CSV'}
                      </button>

                      {isSuccess && data && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                          <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                            {(data as any).message} (Uploaded: {(data as any).successCount})
                          </p>
                        </div>
                      )}

                      {bulkError && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                          <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                            {(bulkError as any)?.message}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}