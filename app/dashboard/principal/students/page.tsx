'use client';

import { useState, DragEvent, useEffect, useRef, type ChangeEvent } from 'react';
import { Upload, UserPlus, Download, FileSpreadsheet, UploadCloud, X, CheckCircle, Users, Mail, Phone, Edit2, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';

/* =====================================================
  IMPORT YOUR ACTUAL API HOOKS
===================================================== */
import { useBulkUploadStudents, useBulkUploadStudentsSchoolWide, useCreateStudent, useDeactivateStudent, useStudentsByClass, useStudentsClassWiseStats, type Student } from '@/app/querry/useStudent';
import { useClasses } from '@/app/querry/useClasses';
import { useAuth } from '@/app/context/AuthContext';
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
                  <div className="absolute -top-1 -right-1 p-1 bg-white dark:bg-gray-800 rounded-full">
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
        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 border dashboard-card-border rounded-xl">
          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileSpreadsheet className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-xs font-semibold dashboard-text">CSV Only</p>
            <p className="text-xs dashboard-text-muted">Upload .csv files</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 border dashboard-card-border rounded-xl">
          <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <UploadCloud className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-xs font-semibold dashboard-text">Easy Upload</p>
            <p className="text-xs dashboard-text-muted">Drag or click</p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 border dashboard-card-border rounded-xl">
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

interface Class {
  id: string;
  name: string;
  section: string;
  sessionId: string;
}

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
// const nameRegex = /^[A-Za-z ]+$/;
const strictEmailRegex =
  /^[a-zA-Z0-9._%+-]+@(gmail|yahoo|outlook|hotmail)\.(com|in)$/;


/* =====================================================
  MAIN PAGE COMPONENT
===================================================== */

export default function BulkStudentUploadPage() {

  // UNCOMMENT AND USE YOUR ACTUAL HOOKS:
  const { user } = useAuth();
  const role = user?.role;

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

  const {
    mutate: uploadStudentsSchoolWide,
    isPending: uploadingSchoolWide,
    isSuccess: isSchoolWideSuccess,
    data: schoolWideData,
    error: schoolWideError
  } = useBulkUploadStudentsSchoolWide();

  const { data: classesData, isLoading: classesLoading } = useClasses();
  const classes = (classesData as any)?.data || (classesData as any) || [];

  const sortedClasses = [...classes].sort((a: any, b: any) => {
    const nameA = String(a?.name ?? '');
    const nameB = String(b?.name ?? '');
    const nameCmp = nameA.localeCompare(nameB, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    if (nameCmp !== 0) return nameCmp;

    const sectionA = String(a?.section ?? '');
    const sectionB = String(b?.section ?? '');
    return sectionA.localeCompare(sectionB, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
  });

  const {
    data: classWiseStats = [],
    isLoading: classWiseLoading,
    error: classWiseError
  } = useStudentsClassWiseStats();

  const sortedClassWiseStats = [...classWiseStats].sort((a: any, b: any) => {
    const nameA = String(a?.className ?? '');
    const nameB = String(b?.className ?? '');
    const nameCmp = nameA.localeCompare(nameB, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
    if (nameCmp !== 0) return nameCmp;

    const sectionA = String(a?.section ?? '');
    const sectionB = String(b?.section ?? '');
    return sectionA.localeCompare(sectionB, undefined, {
      numeric: true,
      sensitivity: 'base'
    });
  });

  const [capacity, setCapacity] = useState<number>(0);
  const totalStudentsInSchool = classWiseStats.reduce(
    (sum: number, c: any) => sum + Number(c.totalStudents || 0),
    0
  );
  const remainingStudents = Math.max(0, capacity - totalStudentsInSchool);
  const isCapacityFull = capacity > 0 && totalStudentsInSchool >= capacity;

  useEffect(() => {
    if (!user) return;
    if (role !== 'principal') return;

    const fetchCapacity = async () => {
      try {
        const res = await apiFetch('/api/subscription/billable-students');
        setCapacity(Number(res?.billableStudents || 0));
      } catch (err) {
        console.error('Failed to fetch billable students', err);
      }
    };

    fetchCapacity();
  }, [user, role]);

  const [selectedClassId, setSelectedClassId] = useState<string | undefined>(undefined);

  const {
    data: classStudents = [],
    isLoading: studentsLoading,
    error: studentsError
  } = useStudentsByClass(selectedClassId);

  const { mutate: deactivateStudent } = useDeactivateStudent();
  const [confirmDeactivate, setConfirmDeactivate] = useState<{ id: string; name: string } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [openSingle, setOpenSingle] = useState(false);
  const [openBulk, setOpenBulk] = useState(false);
  const [bulkMode, setBulkMode] = useState<'classWise' | 'schoolWide'>('classWise');

  const studentsSectionRef = useRef<HTMLDivElement | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);

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
    Partial<Record<keyof SingleStudentForm | 'class', string>>
  >({});

  const [singleClassId, setSingleClassId] = useState('');
  const [singleClassName, setSingleClassName] = useState('');
  const [singleSection, setSingleSection] = useState('');

  /* ---------------- BULK UPLOAD ---------------- */
  const [file, setFile] = useState<File | null>(null);

  const [schoolWideFile, setSchoolWideFile] = useState<File | null>(null);

  const [bulkClassId, setBulkClassId] = useState('');
  const [bulkClassName, setBulkClassName] = useState('');
  const [bulkSection, setBulkSection] = useState('');

  const [bulkClientErrors, setBulkClientErrors] = useState<string[]>([]);
  const [schoolWideClientErrors, setSchoolWideClientErrors] = useState<string[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);//get full dtials of studnet


  const handleClearBulkClassWise = () => {
    setFile(null);
    setBulkClassId('');
    setBulkClassName('');
    setBulkSection('');
    setBulkClientErrors([]);
  };

  const handleClearBulkSchoolWide = () => {
    setSchoolWideFile(null);
    setSchoolWideClientErrors([]);
  };

  useEffect(() => {
    if (!openBulk) {
      handleClearBulkClassWise();
      handleClearBulkSchoolWide();
      setBulkMode('classWise');
    }
  }, [openBulk]);

  const handleSingleSubmit = () => {
    const errors: Partial<Record<keyof SingleStudentForm | 'class', string>> = {};

   

    const trimmedName = student.name.trim();
  const trimmedEmail = student.email.trim();
  const trimmedPassword = student.password;
  const trimmedAdmissionNo = student.admissionNo.trim();
  const trimmedFatherName = student.fatherName.trim();
  const trimmedMotherName = student.motherName.trim();
  const trimmedParentsPhone = student.parentsPhone.trim();
  const trimmedRollNo = student.rollNo.trim();

    // 🔒 Name validations (NO numbers allowed)
    if (trimmedName.length < 3) {
      errors.name = 'Name must be at least 3 characters';
    }
    // else if (!nameRegex.test(trimmedName)) {
    //   errors.name = 'Name must not contain numbers';
    // }

    if (trimmedFatherName.length < 3) {
      errors.fatherName = "Father's name must be at least 3 characters";
    }
    // else if (!nameRegex.test(trimmedFatherName)) {
    //   errors.fatherName = "Father's name must not contain numbers";
    // }

    if (trimmedMotherName.length < 3) {
      errors.motherName = "Mother's name must be at least 3 characters";
    }
    // else if (!nameRegex.test(trimmedMotherName)) {
    //   errors.motherName = "Mother's name must not contain numbers";
    // }

    // 🔒 Password
    if (trimmedPassword.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    // 🔒 Admission No
    if (!trimmedAdmissionNo) {
      errors.admissionNo = 'Admission number is required';
    }

    // 🔒 Phone validation (exact 10 digits)
    const phoneDigits = trimmedParentsPhone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      errors.parentsPhone = 'Phone number must be exactly 10 digits';
    }

    // 🔒 Roll number (limit size)
    const rollNoNum = Number(trimmedRollNo);
    if (
      !trimmedRollNo ||
      Number.isNaN(rollNoNum) ||
      rollNoNum <= 0 ||
      !Number.isInteger(rollNoNum)
    ) {
      errors.rollNo = 'Roll number must be a positive integer';
    } else if (rollNoNum > 200) {
      errors.rollNo = 'Roll number cannot be greater than 100';
    }

    // 🔒 Email validation (STRICT)
    if (trimmedEmail) {
      if (!strictEmailRegex.test(trimmedEmail)) {
        errors.email = 'Please enter a valid email address';
      }
    }

    // 🔒 Class validation
    if (!singleClassId || !singleClassName || !singleSection) {
      errors.class = 'Please select class and section';
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
        rollNo: rollNoNum,
        classId: singleClassId,
        className: singleClassName,
        section: singleSection
      },
      {
        onSuccess: () => {
          toast.success('Student added successfully');
          setStudent(initialStudent);
          setSingleErrors({});
          setSingleClassId('');
          setSingleClassName('');
          setSingleSection('');
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

  const validateCsvFile = async (
    csvFile: File,
    mode: 'classWise' | 'schoolWide'
  ) => {
    const text = await csvFile.text();
    const lines = text
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean);

    if (!lines.length) {
      return { ok: false, errors: ['CSV file is empty'] };
    }

    const headers = parseCsvLine(lines[0]).map(h => h.trim());

    const requiredHeadersClassWise = [
      'name',
      'password',
      'admissionNo',
      'fatherName',
      'motherName',
      'parentsPhone',
      'rollNo'
    ];

    const requiredHeadersSchoolWide = [
      ...requiredHeadersClassWise,
      'className',
      'section'
    ];

    const requiredHeaders =
      mode === 'schoolWide' ? requiredHeadersSchoolWide : requiredHeadersClassWise;

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

      if (mode === 'schoolWide') {
        const className = get('className');
        const section = get('section');
        if (!className) errors.push(`Row ${rowNo}: className is required`);
        if (!section) errors.push(`Row ${rowNo}: section is required`);
      }
    }

    if (errors.length) {
      return { ok: false, errors };
    }

    if (mode === 'schoolWide') {
      const classKeySet = new Set(
        sortedClasses.map(
          (c: Class) => `${String(c.name).trim().toLowerCase()}__${String(c.section).trim().toLowerCase()}`
        )
      );
      const missingClassKeys = new Set<string>();

      for (let r = 1; r < lines.length; r++) {
        const rowNo = r + 1;
        const cells = parseCsvLine(lines[r]);
        const get = (h: string) => (cells[idx(h)] ?? '').trim();
        const className = get('className');
        const section = get('section');

        if (!className || !section) continue;

        const key = `${className.trim().toLowerCase()}__${section.trim().toLowerCase()}`;
        if (!classKeySet.has(key)) {
          missingClassKeys.add(`${className} - ${section} (Row ${rowNo})`);
        }
      }

      if (missingClassKeys.size) {
        const list = Array.from(missingClassKeys);
        return {
          ok: false,
          errors: [
            'Some classes in CSV do not exist in the active session.',
            ...list.slice(0, 10),
            ...(list.length > 10 ? [`...and ${list.length - 10} more`] : [])
          ]
        };
      }
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

    if (
      role === 'principal' &&
      (!bulkClassId || !bulkClassName || !bulkSection)
    ) {
      toast.error('Please select class and section');
      return;
    }

    const validation = await validateCsvFile(file, 'classWise');
    if (!validation.ok) {
      setBulkClientErrors(validation.errors);
      toast.error(validation.errors[0] || 'CSV validation failed');
      return;
    }
    setBulkClientErrors([]);

    uploadStudents(
      {
        file,
        classId: role === 'principal' ? bulkClassId : undefined,
        className: role === 'principal' ? bulkClassName : undefined,
        section: role === 'principal' ? bulkSection : undefined
      },
      {
        onSuccess: (resp: any) => {
          toast.success(resp?.message || 'Students uploaded successfully');
          handleClearBulkClassWise();
        },
        onError: (err: any) => {
          toast.error(getApiErrorMessage(err));
        }
      }
    );
  };

  const handleSchoolWideBulkUpload = async () => {
    if (!schoolWideFile) {
      toast.error('Please select a CSV file');
      return;
    }

    const validation = await validateCsvFile(schoolWideFile, 'schoolWide');
    if (!validation.ok) {
      setSchoolWideClientErrors(validation.errors);
      toast.error(validation.errors[0] || 'CSV validation failed');
      return;
    }
    setSchoolWideClientErrors([]);

    uploadStudentsSchoolWide(
      {
        file: schoolWideFile
      },
      {
        onSuccess: (resp: any) => {
          if (resp && resp.success === false) {
            const msg = resp?.message || 'CSV validation failed';
            toast.error(msg);
            return;
          }
          toast.success(resp?.message || 'Students uploaded successfully');
          handleClearBulkSchoolWide();
        },
        onError: (err: any) => {
          toast.error(getApiErrorMessage(err));
        }
      }
    );
  };

  const downloadSampleClassWise = () => {
    const csvContent =
      'name,email,password,admissionNo,fatherName,motherName,parentsPhone,rollNo\nRahul Sharma,rahul@example.com,pass123,ADM001,Mr. Sharma,Mrs. Sharma,+91 98765 43210,1\nPriya Patel,priya@example.com,pass456,ADM002,Mr. Patel,Mrs. Patel,+91 98765 43211,2';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_classwise_sample.csv';
    a.click();
  };

  const downloadSampleSchoolWide = () => {
    const csvContent =
      'name,email,password,admissionNo,fatherName,motherName,parentsPhone,rollNo,className,section\nRahul Sharma,rahul@example.com,pass123,ADM001,Mr. Sharma,Mrs. Sharma,+91 98765 43210,1,10,A\nPriya Patel,priya@example.com,pass456,ADM002,Mr. Patel,Mrs. Patel,+91 98765 43211,2,10,B';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_schoolwide_sample.csv';
    a.click();
  };

  const filteredStudents = classStudents.filter((s: Student) => {
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
  }, [selectedClassId, searchTerm]);

  useEffect(() => {
    if (!selectedClassId) return;
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
  }, [selectedClassId, filteredStudents.length, visibleCount]);

  const visibleStudents = filteredStudents.slice(0, visibleCount);

  /* =====================================================
     FIELD LABELS
  ===================================================== */
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

  /* =====================================================
     RENDER
  ===================================================== */

  if (role !== 'principal') {
    return null;
  }

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 overflow-hidden min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Students
              </h1>
              <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
                Manage school students
              </p>
              {capacity > 0 && (
                <p className="mt-1 text-xs sm:text-sm text-blue-100/90 font-medium">
                  {totalStudentsInSchool}/{capacity} students ({remainingStudents} remaining)
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (isCapacityFull) {
                    toast.error('Student limit reached. Upgrade required.');
                    return;
                  }
                  setOpenSingle(true);
                }}
                disabled={isCapacityFull}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4" /> Add Student
              </button>
              <button
                onClick={() => {
                  if (isCapacityFull) {
                    toast.error('Student limit reached. Upgrade required.');
                    return;
                  }
                  setOpenBulk(true);
                }}
                disabled={isCapacityFull}
                className="px-4 py-2 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl font-semibold transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" /> Bulk Upload
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 ">
        <div className="space-y-6">
          <div className="dashboard-card border dashboard-card-border rounded-2xl shadow-dashboard-lg overflow-hidden">
            <div className="px-6 py-5 border-b dashboard-card-border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold dashboard-text">Classes</h3>
                  <p className="text-sm dashboard-text-muted">Select a class to view students</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {!classWiseLoading && !classWiseError && classWiseStats.length > 0 && (
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="dashboard-text font-semibold">
                    Total Students:{' '}
                    {classWiseStats.reduce(
                      (sum: number, c: any) => sum + Number(c.totalStudents || 0),
                      0
                    )}
                  </p>
                </div>
              )}

              {classWiseLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 dashboard-text-muted">Loading classes...</p>
                </div>
              ) : classWiseError ? (
                <div className="p-8 text-center">
                  <p className="text-red-600 dark:text-red-400">Error loading classes.</p>
                </div>
              ) : classWiseStats.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="dashboard-text-muted">No classes found for active session.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedClassWiseStats.map((c: any) => {
                    const id = String(c.classId);
                    const isSelected = selectedClassId === id;
                    return (
                      <button
                        key={id}
                        onClick={() => {
                          setSelectedClassId(id);
                          setSearchTerm('');
                          window.setTimeout(() => {
                            studentsSectionRef.current?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start'
                            });
                          }, 50);
                        }}
                        className={`text-left p-4 rounded-2xl border transition-all shadow-sm hover:shadow-dashboard-lg ${isSelected
                          ? 'border-accent-blue bg-blue-50 dark:bg-blue-900/20'
                          : 'dashboard-card-border dashboard-card'
                          }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-lg font-bold dashboard-text">{c.className} - {c.section}</p>
                            <p className="text-sm dashboard-text-muted">Active session</p>
                          </div>
                          <div className="px-3 py-1 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
                            <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">{c.totalStudents}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {selectedClassId && (
            <div className="dashboard-card border dashboard-card-border rounded-2xl shadow-dashboard-lg p-4 flex items-center justify-between gap-3">
              <p className="dashboard-text font-semibold">Selected class: {sortedClassWiseStats.find((c: any) => String(c.classId) === String(selectedClassId))?.className} - {sortedClassWiseStats.find((c: any) => String(c.classId) === String(selectedClassId))?.section}</p>

              <button
                onClick={() => {
                  setSelectedClassId(undefined);
                  setSearchTerm('');
                }}
                className="px-4 py-2 dashboard-card border dashboard-card-border rounded-xl dashboard-text hover:shadow-dashboard transition-all"
              >
                Back to classes
              </button>
            </div>
          )}

          {!selectedClassId ? null : (
            <div ref={studentsSectionRef}>
              <div className="dashboard-card border dashboard-card-border rounded-2xl shadow-dashboard-lg p-4">
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search students by name, email or admission no..."
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
                      <h3 className="text-xl font-bold dashboard-text">Students ({classStudents.length})</h3>
                      <p className="text-sm dashboard-text-muted">Active session students</p>
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
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="dashboard-text-muted">
                        {searchTerm ? 'No students found matching your search.' : 'No students added yet.'}
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800/40 border-b dashboard-card-border">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Admission No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Class
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Roll No
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Parent Contact
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                       

                        <tbody className="divide-y dashboard-card-border">
                          {visibleStudents.map((s: Student) => {
                            const active = s.history?.find(h => h.isActive) || s.history?.[0];

                            return (
                              <tr key={s._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30">
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
                                  {active ? `${active.className} - ${active.section}` : ''}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm dashboard-text">
                                  {active?.rollNo ?? ''}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm dashboard-text">
                                    <div>Father: {s.fatherName}</div>
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
                                    <button
                                      onClick={() => setConfirmDeactivate({ id: s._id, name: s.name })}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
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
                  {/* MODAL */}
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
            </div>
          )}

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
                        <p className="text-sm dashboard-text-muted">Create a student in a selected class</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setOpenSingle(false)}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
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
                            onChange={(e) =>
                            (setStudent({ ...student, [key]: e.target.value }),
                              setSingleErrors(prev => ({ ...prev, [key]: undefined })))
                            }
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

                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                      <label className="block text-sm font-semibold dashboard-text mb-2">
                        Select Class & Section
                      </label>
                      <select
                        className="w-full px-4 py-3 dashboard-card border dashboard-card-border rounded-xl dashboard-text focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all"
                        disabled={classesLoading}
                        value={singleClassId}
                        onChange={(e) => {
                          const cls = classes.find((c: Class) => c.id === e.target.value);
                          if (!cls) return;
                          setSingleClassId(cls.id);
                          setSingleClassName(cls.name);
                          setSingleSection(cls.section);
                          setSingleErrors(prev => ({ ...prev, class: undefined }));
                        }}
                      >
                        <option value="">Select class</option>
                        {sortedClasses.map((cls: Class) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} - {cls.section}
                          </option>
                        ))}
                      </select>

                      {singleErrors.class && (
                        <p className="mt-2 text-xs text-red-600 dark:text-red-400 font-medium">
                          {singleErrors.class}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => setOpenSingle(false)}
                        className="flex-1 px-6 py-3 dashboard-card border dashboard-card-border rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all"
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
                        <p className="text-sm dashboard-text-muted">Choose class-wise or whole-school upload</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setOpenBulk(false)}
                      className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(85vh-96px)]">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => setBulkMode('classWise')}
                        className={`flex-1 min-w-[220px] px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${bulkMode === 'classWise'
                          ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg transform scale-[1.02]'
                          : 'dashboard-card border dashboard-card-border dashboard-text hover:border-accent-teal'
                          }`}
                      >
                        <Upload className="w-5 h-5" /> Class-wise Upload
                      </button>

                      <button
                        onClick={() => setBulkMode('schoolWide')}
                        className={`flex-1 min-w-[220px] px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${bulkMode === 'schoolWide'
                          ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg transform scale-[1.02]'
                          : 'dashboard-card border dashboard-card-border dashboard-text hover:border-accent-blue'
                          }`}
                      >
                        <Upload className="w-5 h-5" /> Whole-school Upload
                      </button>
                    </div>

                    {bulkMode === 'classWise' && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="dashboard-text font-semibold">Upload CSV (selected class & section)</div>
                          <button
                            onClick={downloadSampleClassWise}
                            className="px-4 py-2 dashboard-card border dashboard-card-border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
                          >
                            <Download className="w-4 h-4 text-accent-teal" />
                            <span className="dashboard-text text-sm font-medium">Sample CSV</span>
                          </button>
                        </div>

                        <DragDropCSV
                          onFileSelect={setFile}
                          selectedFile={file}
                          onClear={handleClearBulkClassWise}
                        />

                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl">
                          <label className="block text-sm font-semibold dashboard-text mb-2">
                            Select Class & Section
                          </label>
                          <select
                            className="w-full px-4 py-3 dashboard-card border dashboard-card-border rounded-xl dashboard-text focus:outline-none focus:ring-2 focus:ring-accent-purple transition-all"
                            disabled={classesLoading}
                            value={bulkClassId}
                            onChange={(e) => {
                              const cls = classes.find((c: Class) => c.id === e.target.value);
                              if (!cls) return;
                              setBulkClassId(cls.id);
                              setBulkClassName(cls.name);
                              setBulkSection(cls.section);
                            }}
                          >
                            <option value="">Select class</option>
                            {sortedClasses.map((cls: Class) => (
                              <option key={cls.id} value={cls.id}>
                                {cls.name} - {cls.section}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                          <p className="text-sm dashboard-text font-medium mb-2">
                            <strong>Required CSV columns:</strong>
                          </p>
                          <code className="block text-xs dashboard-text-muted font-mono bg-white dark:bg-gray-800 p-3 rounded-lg border dashboard-card-border">
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
                    )}

                    {bulkMode === 'schoolWide' && (
                      <div className="space-y-5">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div className="dashboard-text font-semibold">Upload CSV (entire school)</div>
                          <button
                            onClick={downloadSampleSchoolWide}
                            className="px-4 py-2 dashboard-card border dashboard-card-border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
                          >
                            <Download className="w-4 h-4 text-accent-blue" />
                            <span className="dashboard-text text-sm font-medium">Sample CSV</span>
                          </button>
                        </div>

                        <DragDropCSV
                          onFileSelect={setSchoolWideFile}
                          selectedFile={schoolWideFile}
                          onClear={handleClearBulkSchoolWide}
                        />

                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                          <p className="text-sm dashboard-text font-medium mb-2">
                            <strong>Required CSV columns:</strong>
                          </p>
                          <code className="block text-xs dashboard-text-muted font-mono bg-white dark:bg-gray-800 p-3 rounded-lg border dashboard-card-border">
                            name, email, password, admissionNo, fatherName, motherName, parentsPhone, rollNo, className, section
                          </code>
                        </div>

                        {schoolWideClientErrors.length > 0 && (
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <p className="text-red-600 dark:text-red-400 text-sm font-semibold mb-2">
                              Please fix the following issues in your CSV:
                            </p>
                            <div className="space-y-1">
                              {schoolWideClientErrors.slice(0, 12).map((msg) => (
                                <p key={msg} className="text-red-600 dark:text-red-400 text-xs">
                                  {msg}
                                </p>
                              ))}
                              {schoolWideClientErrors.length > 12 && (
                                <p className="text-red-600 dark:text-red-400 text-xs">
                                  And {schoolWideClientErrors.length - 12} more...
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        <button
                          onClick={handleSchoolWideBulkUpload}
                          disabled={uploadingSchoolWide || !schoolWideFile}
                          className="w-full px-6 py-3 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {uploadingSchoolWide ? 'Uploading...' : 'Upload CSV'}
                        </button>

                        {isSchoolWideSuccess && schoolWideData && (
                          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                            <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                              {(schoolWideData as any).message} (Uploaded: {(schoolWideData as any).successCount})
                            </p>
                          </div>
                        )}

                        {schoolWideError && (
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                              {(schoolWideError as any)?.message}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {confirmDeactivate && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setConfirmDeactivate(null)}
              >
                <motion.div
                  initial={{ scale: 0.92, y: 10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.92, y: 10 }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-md"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Student</h3>
                    <button
                      onClick={() => setConfirmDeactivate(null)}
                      className="text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-5">
                    Are you sure you want to delete
                    <span className="font-semibold text-gray-900 dark:text-white"> {confirmDeactivate.name}</span>?
                    This will mark the student as inactive.
                  </p>

                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setConfirmDeactivate(null)}
                      className="px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm shadow-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const id = confirmDeactivate.id;
                        setConfirmDeactivate(null);
                        deactivateStudent(id, {
                          onSuccess: (resp: any) => {
                            toast.success(resp?.message || 'Student deactivated successfully');
                          },
                          onError: (err: any) => {
                            toast.error(err?.message || 'Failed to deactivate student');
                          }
                        });
                      }}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
