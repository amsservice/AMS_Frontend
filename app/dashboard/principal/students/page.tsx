
'use client';

import { useState, DragEvent } from 'react';
import { Upload, UserPlus, Download, FileSpreadsheet, UploadCloud, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* =====================================================
   IMPORT YOUR ACTUAL API HOOKS
===================================================== */
import { useBulkUploadStudents, useCreateStudent } from '@/app/querry/useStudent';
import { useClasses } from '@/app/querry/useClasses';
import { useAuth } from '@/app/context/AuthContext';

/* =====================================================
   DRAG DROP CSV COMPONENT
===================================================== */
interface DragDropCSVProps {
  onFileSelect: (file: File) => void;
  selectedFile?: File | null;
}

function DragDropCSV({ onFileSelect, selectedFile }: DragDropCSVProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(
    selectedFile?.name || null
  );

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Only CSV files are allowed');
      return;
    }

    setFileName(file.name);
    onFileSelect(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      alert('Only CSV files are allowed');
      return;
    }

    setFileName(file.name);
    onFileSelect(file);
  };

  const handleRemoveFile = () => {
    setFileName(null);
    const input = document.getElementById('csv-upload-input') as HTMLInputElement;
    if (input) input.value = '';
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
          ${
            isDragging
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
                <div className={`p-4 rounded-2xl shadow-lg transition-all duration-300 ${
                  isDragging 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 scale-110' 
                    : 'bg-gradient-to-br from-blue-500 to-indigo-500'
                }`}>
                  <UploadCloud className={`w-10 h-10 sm:w-12 sm:h-12 text-white transition-transform duration-300 ${
                    isDragging ? 'animate-bounce' : ''
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
  
  const { data: classes = [], isLoading: classesLoading } = useClasses();

  // TEMPORARY MOCK DATA - REMOVE WHEN USING REAL HOOKS
  // const user = { role: 'principal' };
  // const role = user?.role;
  // const createStudent = (data: any) => console.log('Creating:', data);
  // const creatingStudent = false;
  // const singleError = null;
  // const uploadStudents = (data: any) => console.log('Uploading:', data);
  // const uploading = false;
  // const isSuccess = false;
  // const data = null;
  // const bulkError = null;
  // const classes = [
  //   { id: '1', name: '10', section: 'A', sessionId: '2024' },
  //   { id: '2', name: '10', section: 'B', sessionId: '2024' },
  // ];
  // const classesLoading = false;

  const [mode, setMode] = useState<'single' | 'bulk'>('bulk');

  /* ---------------- SINGLE STUDENT ---------------- */
  const [student, setStudent] = useState<SingleStudentForm>({
    name: '',
    email: '',
    password: '',
    admissionNo: '',
    fatherName: '',
    motherName: '',
    parentsPhone: '',
    rollNo: ''
  });

  const [singleClassId, setSingleClassId] = useState('');
  const [singleClassName, setSingleClassName] = useState('');
  const [singleSection, setSingleSection] = useState('');

  /* ---------------- BULK UPLOAD ---------------- */
  const [file, setFile] = useState<File | null>(null);

  const [bulkClassId, setBulkClassId] = useState('');
  const [bulkClassName, setBulkClassName] = useState('');
  const [bulkSection, setBulkSection] = useState('');

  /* =====================================================
     HANDLERS
  ===================================================== */

  const handleSingleSubmit = () => {
    const {
      name,
      password,
      admissionNo,
      fatherName,
      motherName,
      parentsPhone,
      rollNo
    } = student;

    if (
      !name ||
      !password ||
      !admissionNo ||
      !fatherName ||
      !motherName ||
      !parentsPhone ||
      !rollNo
    ) {
      alert('Please fill all required fields');
      return;
    }

    if (
      role === 'principal' &&
      (!singleClassId || !singleClassName || !singleSection)
    ) {
      alert('Please select class and section');
      return;
    }

    createStudent({
      ...student,
      rollNo: Number(rollNo),
      classId: role === 'principal' ? singleClassId : undefined,
      className: role === 'principal' ? singleClassName : undefined,
      section: role === 'principal' ? singleSection : undefined
    });
  };

  const handleBulkUpload = () => {
    if (!file) {
      alert('Please select a CSV file');
      return;
    }

    if (
      role === 'principal' &&
      (!bulkClassId || !bulkClassName || !bulkSection)
    ) {
      alert('Please select class and section');
      return;
    }

    uploadStudents({
      file,
      classId: role === 'principal' ? bulkClassId : undefined,
      className: role === 'principal' ? bulkClassName : undefined,
      section: role === 'principal' ? bulkSection : undefined
    });
  };

  const downloadSample = () => {
    const csvContent = 'name,email,password,admissionNo,fatherName,motherName,parentsPhone,rollNo\nRahul Sharma,rahul@example.com,pass123,ADM001,Mr. Sharma,Mrs. Sharma,+91 98765 43210,1\nPriya Patel,priya@example.com,pass456,ADM002,Mr. Patel,Mrs. Patel,+91 98765 43211,2';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students_sample.csv';
    a.click();
  };

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

  return (
    <div className="min-h-screen dashboard-bg">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                Student Upload 📚
              </h1>
              <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
                Add single or multiple students to your system
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* MODE SWITCH CARD */}
          <div className="dashboard-card border dashboard-card-border rounded-2xl shadow-dashboard-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold dashboard-text">Upload Method</h2>
                <p className="text-sm dashboard-text-muted">Choose how you want to add students</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setMode('single')}
                className={`flex-1 min-w-[200px] px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  mode === 'single'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                    : 'dashboard-card border dashboard-card-border dashboard-text hover:border-accent-blue'
                }`}
              >
                <UserPlus className="w-5 h-5" /> Single Student
              </button>

              <button
                onClick={() => setMode('bulk')}
                className={`flex-1 min-w-[200px] px-6 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                  mode === 'bulk'
                    ? 'bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg transform scale-105'
                    : 'dashboard-card border dashboard-card-border dashboard-text hover:border-accent-teal'
                }`}
              >
                <Upload className="w-5 h-5" /> Bulk Upload
              </button>
            </div>
          </div>

          {/* ================= SINGLE STUDENT ================= */}
          <AnimatePresence mode="wait">
            {mode === 'single' && (
              <motion.div
                key="single"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="dashboard-card border dashboard-card-border rounded-2xl shadow-dashboard-lg overflow-hidden"
              >
                <div className="px-6 py-5 border-b dashboard-card-border bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                      <UserPlus className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold dashboard-text">Add Single Student</h3>
                      <p className="text-sm dashboard-text-muted">Fill in the student details below</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {Object.entries(student).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-sm font-semibold dashboard-text mb-2">
                          {fieldLabels[key as keyof SingleStudentForm]}
                        </label>
                        <input
                          type={key === 'password' ? 'password' : key === 'email' ? 'email' : 'text'}
                          placeholder={`Enter ${fieldLabels[key as keyof SingleStudentForm].toLowerCase()}`}
                          value={value}
                          onChange={(e) =>
                            setStudent({ ...student, [key]: e.target.value })
                          }
                          className="w-full px-4 py-3 dashboard-card border dashboard-card-border rounded-xl dashboard-text focus:outline-none focus:ring-2 focus:ring-accent-blue transition-all"
                        />
                      </div>
                    ))}
                  </div>

                  {/* CLASS (PRINCIPAL ONLY) */}
                  {role === 'principal' && (
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
                        }}
                      >
                        <option value="">Select class</option>
                        {classes.map((cls: Class) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} - {cls.section}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
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
              </motion.div>
            )}

            {/* ================= BULK UPLOAD ================= */}
            {mode === 'bulk' && (
              <motion.div
                key="bulk"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="dashboard-card border dashboard-card-border rounded-2xl shadow-dashboard-lg overflow-hidden"
              >
                <div className="px-6 py-5 border-b dashboard-card-border bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl shadow-lg">
                        <Upload className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold dashboard-text">Bulk Upload Students</h3>
                        <p className="text-sm dashboard-text-muted">Upload a CSV file to add multiple students</p>
                      </div>
                    </div>
                    <button
                      onClick={downloadSample}
                      className="px-4 py-2 dashboard-card border dashboard-card-border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
                    >
                      <Download className="w-4 h-4 text-accent-teal" />
                      <span className="dashboard-text text-sm font-medium">Sample CSV</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  <DragDropCSV onFileSelect={setFile} selectedFile={file} />

                  {role === 'principal' && (
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
                        {classes.map((cls: Class) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name} - {cls.section}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                    <p className="text-sm dashboard-text font-medium mb-2">
                      <strong>Required CSV columns:</strong>
                    </p>
                    <code className="block text-xs dashboard-text-muted font-mono bg-white dark:bg-gray-800 p-3 rounded-lg border dashboard-card-border">
                      name, email, password, admissionNo, fatherName, motherName, parentsPhone, rollNo
                    </code>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      onClick={handleBulkUpload}
                      disabled={uploading || !file}
                      className="flex-1 px-6 py-3 bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? 'Uploading...' : 'Upload CSV'}
                    </button>
                  </div>

                  {isSuccess && data && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                      <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                        ✅ {(data as any).message} (Uploaded: {(data as any).successCount})
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}