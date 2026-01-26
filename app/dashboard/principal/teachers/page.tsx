
"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import PageHeader from "./components/PageHeader";
import StatsCards from "./components/StatsCards";
import AddStaffForm from "./components/AddStaffForm";
import BulkUploadModal from "./components/BulkUploadModal";
import TeachersTable from "./components/TeachersTable";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import ReactivateModal from "./components/ReactivateModal";
import ViewStaffModal from "./components/ViewStaffModal";
import AssignClassModal from "./components/AssignClassModal";
import SwapClassModal from "./components/SwapClassModal";

import {
  useTeachers,
  useCreateTeacher,
  useDeleteTeacher,
  useReactivateTeacher,
  useAssignClassToTeacher,
  useBulkUploadTeachers,
  useSwapTeacherClasses,
  useTeacherFullProfile,
  useUpdateTeacherProfileByPrincipal,
} from "@/app/querry/useTeachers";

import { useClasses } from "@/app/querry/useClasses";

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
  const [selectedClassId, setSelectedClassId] = useState("");

  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [showReassignOnDelete, setShowReassignOnDelete] = useState(false);
  const [reassignToTeacherId, setReassignToTeacherId] = useState("");
  const [isReassigningAndDeleting, setIsReassigningAndDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    dob: "",
    gender: "",
    highestQualification: "",
    experienceYears: "",
    address: "",
    roles: ["teacher"] as ("teacher" | "coordinator")[],
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    highestQualification: "",
    experienceYears: "",
    address: "",
  });

  const { data: teachers = [], isLoading } = useTeachers();
  const { data: classes = [] } = useClasses();

  const sortedClasses = useMemo(() => {
    return [...classes].sort((a: Class, b: Class) => {
      const nameCmp = String(a.name).localeCompare(String(b.name), undefined, {
        numeric: true,
        sensitivity: "base",
      });
      if (nameCmp !== 0) return nameCmp;
      return String(a.section).localeCompare(String(b.section), undefined, {
        numeric: true,
        sensitivity: "base",
      });
    });
  }, [classes]);

  const [bulkTeacherFile, setBulkTeacherFile] = useState<File | null>(null);
  const [bulkTeacherClientErrors, setBulkTeacherClientErrors] = useState<string[]>([]);

  const { mutate: createTeacher } = useCreateTeacher();
  const { mutate: deleteTeacher } = useDeleteTeacher();
  const { mutate: reactivateTeacher, isPending: isReactivatingTeacher } = useReactivateTeacher();
  const bulkUploadTeachersMutation = useBulkUploadTeachers();
  const assignClassMutation = useAssignClassToTeacher();
  const swapClassMutation = useSwapTeacherClasses();

  const [confirmReactivate, setConfirmReactivate] = useState<{ id: string; email: string } | null>(null);

  const { data: teacherFullData, isLoading: isLoadingFullProfile } = useTeacherFullProfile(viewingTeacherId || "");
  const updateTeacherMutation = useUpdateTeacherProfileByPrincipal(viewingTeacherId || "");

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
      if (lettersCount < 3) return "Name must contain at least 3 letters";
    }

    if (data.email !== undefined && data.email.trim().length > 0) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
      if (!emailOk) return "Please enter a valid email";
    }

    if (data.phone === undefined || data.phone.trim().length === 0) return "Phone is required";

    const phoneOk = /^[0-9]{10}$/.test(data.phone);
    if (!phoneOk) return "Phone must be exactly 10 digits (numbers only)";

    if (data.dob === undefined || data.dob.trim().length === 0) return "DOB is required";

    const d = new Date(data.dob);
    if (isNaN(d.getTime())) return "Invalid date of birth";
    const today = new Date();
    if (d.getTime() > today.getTime()) return "DOB cannot be in the future";

    const age =
      today.getFullYear() -
      d.getFullYear() -
      (today.getMonth() < d.getMonth() || (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())
        ? 1
        : 0);

    if (age < 18) return "DOB must be at least 18 years ago";

    if (data.gender === undefined || data.gender.trim().length === 0) return "Gender is required";
    if (!["male", "female", "other"].includes(data.gender)) return "Invalid gender";

    if (data.highestQualification && data.highestQualification.trim().length > 0) {
      const trimmed = data.highestQualification.trim();
      const lettersCount = (trimmed.match(/[A-Za-z]/g) || []).length;
      if (lettersCount < 2) return "Highest qualification must contain at least 2 letters";
      if (trimmed.length > 100) return "Highest qualification cannot exceed 100 characters";
    }

    if (data.experienceYears && data.experienceYears.trim().length > 0) {
      const n = Number(data.experienceYears);
      if (!Number.isFinite(n) || !Number.isInteger(n)) return "Experience years must be a whole number";
      if (n < 0) return "Experience cannot be negative";
      if (n > 42) return "Experience cannot be greater than 42 years";
      if (n > age) return "Experience years cannot be greater than age";
      if (age - n < 14) return "DOB and experience years difference must be at least 14 years";
    }

    if (data.address && data.address.trim().length > 0) {
      const trimmed = data.address.trim();
      const lettersCount = (trimmed.match(/[a-zA-Z]/g) || []).length;
      if (lettersCount < 5) return "Address must contain at least 5 letters";
      if (trimmed.length > 250) return "Address cannot exceed 250 characters";
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
      const msg = typeof first?.message === "string" ? first.message : "";
      const path = Array.isArray(first?.path) ? first.path.join(".") : "";
      if (path && msg) return `${path}: ${msg}`;
      if (msg) return msg;
    }
    if (typeof error?.message === "string" && error.message.trim().length > 0) return error.message;
    return "Request failed";
  };

  const resetBulkTeachersUpload = () => {
    setBulkTeacherFile(null);
    setBulkTeacherClientErrors([]);
  };

  const parseCsvLine = (line: string) => {
    const out: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else inQuotes = !inQuotes;
        continue;
      }
      if (ch === "," && !inQuotes) {
        out.push(cur);
        cur = "";
        continue;
      }
      cur += ch;
    }
    out.push(cur);
    return out.map((v) => v.trim());
  };

  const validateTeacherCsvFile = async (csvFile: File) => {
    const text = await csvFile.text();
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    if (!lines.length) return { ok: false, errors: ["CSV file is empty"] };

    const headers = parseCsvLine(lines[0]).map((h) => h.trim());
    const requiredHeaders = ["name", "email", "password", "phone", "dob", "gender"];
    const missingHeaders = requiredHeaders.filter((h) => !headers.includes(h));
    if (missingHeaders.length) {
      return {
        ok: false,
        errors: [
          `Missing required columns: ${missingHeaders.join(", ")}`,
          "Please download the sample CSV and follow the same header names.",
        ],
      };
    }

    const idx = (name: string) => headers.indexOf(name);
    const errors: string[] = [];

    const parseDobToDate = (raw: string) => {
      const v = String(raw || "").trim();
      if (!v) return null;
      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        const d = new Date(v);
        return isNaN(d.getTime()) ? null : d;
      }
      const m = v.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
      if (m) {
        const dd = Number(m[1]);
        const mm = Number(m[2]);
        const yyyy = Number(m[3]);
        if (dd >= 1 && dd <= 31 && mm >= 1 && mm <= 12) {
          const d = new Date(yyyy, mm - 1, dd);
          if (d.getFullYear() === yyyy && d.getMonth() === mm - 1 && d.getDate() === dd) return d;
        }
        return null;
      }
      const fallback = new Date(v);
      return isNaN(fallback.getTime()) ? null : fallback;
    };

    for (let r = 1; r < lines.length; r++) {
      const rowNo = r + 1;
      const cells = parseCsvLine(lines[r]);
      const get = (h: string) => (cells[idx(h)] ?? "").trim();

      const name = get("name");
      const email = get("email");
      const password = get("password");
      const phone = get("phone");
      const dob = get("dob");
      const genderRaw = get("gender");
      const gender = genderRaw.toLowerCase();

      const highestQualification = headers.includes("highestQualification") ? get("highestQualification") : "";
      const experienceYears = headers.includes("experienceYears") ? get("experienceYears") : "";
      const address = headers.includes("address") ? get("address") : "";

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
              (today.getMonth() < d.getMonth() || (today.getMonth() === d.getMonth() && today.getDate() < d.getDate())
                ? 1
                : 0);
            ageYears = age;
            if (age < 18) errors.push(`Row ${rowNo}: dob must be at least 18 years ago`);
          }
        }
      }

      if (!genderRaw) errors.push(`Row ${rowNo}: gender is required`);
      else if (!["male", "female", "other"].includes(gender)) errors.push(`Row ${rowNo}: gender must be male, female, or other`);

      if (highestQualification) {
        const letters = (highestQualification.match(/[A-Za-z]/g) || []).length;
        if (letters < 2) errors.push(`Row ${rowNo}: highestQualification must contain at least 2 letters`);
        if (highestQualification.length > 100) errors.push(`Row ${rowNo}: highestQualification cannot exceed 100 characters`);
      }

      if (experienceYears) {
        const n = Number(experienceYears);
        if (!Number.isFinite(n) || !Number.isInteger(n)) errors.push(`Row ${rowNo}: experienceYears must be a whole number`);
        else {
          if (n < 0) errors.push(`Row ${rowNo}: experienceYears cannot be negative`);
          if (n > 42) errors.push(`Row ${rowNo}: experienceYears cannot be greater than 42`);
          if (ageYears !== null) {
            if (n > ageYears) errors.push(`Row ${rowNo}: experienceYears cannot be greater than age`);
            else if (ageYears - n < 14) errors.push(`Row ${rowNo}: dob and experienceYears difference must be at least 14 years`);
          }
        }
      }

      if (address) {
        const letters = (address.match(/[A-Za-z]/g) || []).length;
        if (letters < 5) errors.push(`Row ${rowNo}: address must contain at least 5 letters`);
        if (address.length > 250) errors.push(`Row ${rowNo}: address cannot exceed 250 characters`);
      }
    }

    if (errors.length) return { ok: false, errors };
    return { ok: true, errors: [] as string[] };
  };

  const downloadTeacherSampleCsv = () => {
    const csvContent =
      "name,email,password,phone,dob,gender,highestQualification,experienceYears,address\nJohn Doe,john@example.com,pass1234,9876543210,2000-01-15,male,B.Ed,5,Some street address";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teachers_sample.csv";
    a.click();
  };

  const handleBulkTeacherUpload = async () => {
    if (!bulkTeacherFile) {
      toast.error("Please select a CSV file");
      return;
    }

    const validation = await validateTeacherCsvFile(bulkTeacherFile);
    if (!validation.ok) {
      setBulkTeacherClientErrors(validation.errors);
      toast.error(validation.errors[0] || "CSV validation failed");
      return;
    }

    setBulkTeacherClientErrors([]);
    bulkUploadTeachersMutation.mutate(
      { file: bulkTeacherFile },
      {
        onSuccess: (resp: any) => {
          if (resp && resp.success === false) {
            toast.error(resp?.message || "CSV validation failed");
            return;
          }
          toast.success(resp?.message || "Teachers uploaded successfully");
          resetBulkTeachersUpload();
          setIsBulkUploadOpen(false);
        },
        onError: (err: any) => {
          const msg = err?.data?.validationErrors?.length
            ? `CSV validation failed. Row ${err.data.validationErrors[0].row}: ${err.data.validationErrors[0].message}`
            : getErrorMessage(err);
          toast.error(msg);
        },
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
        experienceYears: formData.experienceYears ? Number(formData.experienceYears) : undefined,
        address: formData.address || undefined,
        roles: formData.roles,
      },
      {
        onSuccess: () => {
          toast.success("Teacher created successfully");
          setFormData({
            name: "",
            email: "",
            password: "",
            phone: "",
            dob: "",
            gender: "",
            highestQualification: "",
            experienceYears: "",
            address: "",
            roles: ["teacher"],
          });
          setIsAddTeacherOpen(false);
        },
        onError: (error: any) => {
          const code = error?.data?.code;
          if (code === "TEACHER_INACTIVE_EMAIL_EXISTS") {
            const teacherId = String(error?.data?.teacherId || "");
            const email = String(error?.data?.email || formData.email || "").trim();
            if (teacherId) {
              setConfirmReactivate({ id: teacherId, email });
              return;
            }
          }
          toast.error(getErrorMessage(error));
        },
      }
    );
  };

  const handleAssignClass = () => {
    if (!assigningTeacherId || !selectedClassId) return;
    const selectedClass = sortedClasses.find((cls: Class) => cls.id === selectedClassId);
    if (!selectedClass) return;

    assignClassMutation.mutate({
      teacherId: assigningTeacherId,
      classId: selectedClass.id,
      sessionId: selectedClass.sessionId,
      className: selectedClass.name,
      section: selectedClass.section,
    });

    setAssigningTeacherId(null);
    setSelectedClassId("");
  };

  const handleSwapClass = () => {
    if (!swappingTeacherId || !selectedClassId) return;
    const swappingTeacher = teachers.find((t: Teacher) => t.id === swappingTeacherId);
    const targetClass = sortedClasses.find((cls: Class) => cls.id === selectedClassId);
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
        sectionB: targetClass.section,
      });
    } else {
      assignClassMutation.mutate({
        teacherId: swappingTeacher.id,
        classId: targetClass.id,
        sessionId: targetClass.sessionId,
        className: targetClass.name,
        section: targetClass.section,
      });
    }

    setSwappingTeacherId(null);
    setSelectedClassId("");
  };

  const handleViewTeacher = (teacherId: string) => {
    setViewingTeacherId(teacherId);
    setIsEditing(false);
  };

  const handleEnableEdit = () => {
    if (teacherFullData?.data) {
      setEditFormData({
        name: teacherFullData.data.name || "",
        email: teacherFullData.data.email || "",
        phone: teacherFullData.data.phone || "",
        dob: teacherFullData.data.dob ? teacherFullData.data.dob.slice(0, 10) : "",
        gender: teacherFullData.data.gender || "",
        highestQualification: teacherFullData.data.highestQualification || "",
        experienceYears: typeof teacherFullData.data.experienceYears === "number" ? String(teacherFullData.data.experienceYears) : "",
        address: teacherFullData.data.address || "",
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({ name: "", email: "", phone: "", dob: "", gender: "", highestQualification: "", experienceYears: "", address: "" });
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
      gender: "male" | "female" | "other";
      highestQualification?: string;
      experienceYears?: number;
      address?: string;
    } = {
      phone: editFormData.phone,
      dob: editFormData.dob,
      gender: editFormData.gender as any,
    };

    if (editFormData.name) updateData.name = editFormData.name;
    if (editFormData.email) updateData.email = editFormData.email;
    if (editFormData.highestQualification) updateData.highestQualification = editFormData.highestQualification;
    if (editFormData.experienceYears) updateData.experienceYears = Number(editFormData.experienceYears);
    if (editFormData.address) updateData.address = editFormData.address;

    updateTeacherMutation.mutate(updateData, {
      onSuccess: () => {
        setIsEditing(false);
        toast.success("Teacher updated successfully");
      },
      onError: (error: any) => toast.error(getErrorMessage(error)),
    });
  };

  const stats = [
    { label: "Total Teachers", value: teachers.length, bgGradient: "from-blue-500 to-indigo-600" },
    { label: "Assigned", value: teachers.filter((t: Teacher) => t.currentClass).length, bgGradient: "from-purple-500 to-violet-600" },
  ];

  const swappingTeacherCurrentClassId = swappingTeacherId && teachers?.length ? teachers.find((t: Teacher) => t.id === swappingTeacherId)?.currentClass?.classId ?? null : null;

  const teacherToDelete = confirmDelete ? (teachers as Teacher[]).find((t) => t.id === confirmDelete.id) : undefined;

  const unassignedTeachers = (teachers as Teacher[]).filter((t) => !t.currentClass && t.id !== confirmDelete?.id);

  const handleReassignAndDelete = async () => {
    if (!confirmDelete) return;
    if (!teacherToDelete?.currentClass) return;

    if (!reassignToTeacherId) {
      toast.error("Please select a teacher to reassign this class to");
      return;
    }

    const classToReassign = (sortedClasses as Class[]).find((c) => c.id === teacherToDelete.currentClass!.classId);

    if (!classToReassign) {
      toast.error("Unable to find class details required for reassignment");
      return;
    }

    setIsReassigningAndDeleting(true);
    assignClassMutation.mutate(
      {
        teacherId: reassignToTeacherId,
        sessionId: classToReassign.sessionId,
        classId: classToReassign.id,
        className: classToReassign.name,
        section: classToReassign.section,
      },
      {
        onSuccess: () => {
          deleteTeacher(confirmDelete.id);
          setConfirmDelete(null);
          setShowReassignOnDelete(false);
          setReassignToTeacherId("");
          setIsReassigningAndDeleting(false);
        },
        onError: (err: any) => {
          toast.error(err?.message || "Failed to reassign class");
          setIsReassigningAndDeleting(false);
        },
      }
    );
  };

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 overflow-hidden min-h-screen">
      <PageHeader
        isAddTeacherOpen={isAddTeacherOpen}
        setIsAddTeacherOpen={setIsAddTeacherOpen}
        setIsBulkUploadOpen={setIsBulkUploadOpen}
      />

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <StatsCards stats={stats} />

          <AddStaffForm
            open={isAddTeacherOpen}
            formData={formData}
            setFormData={setFormData}
            maxDob={maxDob}
            handleAddTeacher={handleAddTeacher}
            onClose={() => setIsAddTeacherOpen(false)}
          />

          <BulkUploadModal
            open={isBulkUploadOpen}
            bulkTeacherFile={bulkTeacherFile}
            setBulkTeacherFile={setBulkTeacherFile}
            bulkTeacherClientErrors={bulkTeacherClientErrors}
            resetBulkTeachersUpload={resetBulkTeachersUpload}
            handleBulkTeacherUpload={handleBulkTeacherUpload}
            isUploading={bulkUploadTeachersMutation.isPending}
            onClose={() => setIsBulkUploadOpen(false)}
            downloadSample={downloadTeacherSampleCsv}
          />

          <TeachersTable
            teachers={teachers}
            isLoading={isLoading}
            onView={handleViewTeacher}
            onAssign={(id) => setAssigningTeacherId(id)}
            onSwap={(id) => setSwappingTeacherId(id)}
            onDelete={(t) => {
              setConfirmDelete(t);
              setShowReassignOnDelete(false);
              setReassignToTeacherId("");
            }}
          />
        </div>
      </main>

      <DeleteConfirmModal
        confirmDelete={confirmDelete}
        teacherToDelete={teacherToDelete}
        unassignedTeachers={unassignedTeachers}
        showReassignOnDelete={showReassignOnDelete}
        setShowReassignOnDelete={setShowReassignOnDelete}
        reassignToTeacherId={reassignToTeacherId}
        setReassignToTeacherId={setReassignToTeacherId}
        isReassigning={isReassigningAndDeleting}
        onClose={() => {
          setConfirmDelete(null);
          setShowReassignOnDelete(false);
          setReassignToTeacherId("");
          setIsReassigningAndDeleting(false);
        }}
        onDeleteDirect={(id) => {
          setConfirmDelete(null);
          setShowReassignOnDelete(false);
          setReassignToTeacherId("");
          setIsReassigningAndDeleting(false);
          deleteTeacher(id);
        }}
        onReassignAndDelete={handleReassignAndDelete}
      />

      <ReactivateModal
        confirmReactivate={confirmReactivate}
        isReactivating={isReactivatingTeacher}
        onClose={() => setConfirmReactivate(null)}
        onConfirm={(id) => {
          reactivateTeacher(id, {
            onSuccess: (resp: any) => {
              toast.success(resp?.message || "Teacher activated successfully");
              setConfirmReactivate(null);
              setIsAddTeacherOpen(false);
            },
            onError: (err: any) => toast.error(getErrorMessage(err)),
          });
        }}
      />

      <ViewStaffModal
        viewingTeacherId={viewingTeacherId}
        teacherFullData={teacherFullData}
        isLoading={isLoadingFullProfile}
        isEditing={isEditing}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
        maxDob={maxDob}
        updatePending={updateTeacherMutation.isPending}
        onEnableEdit={handleEnableEdit}
        onSave={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onClose={() => {
          setViewingTeacherId(null);
          setIsEditing(false);
        }}
      />

      <AssignClassModal
        open={!!assigningTeacherId}
        classes={sortedClasses}
        selectedClassId={selectedClassId}
        setSelectedClassId={setSelectedClassId}
        onAssign={handleAssignClass}
        onClose={() => {
          setAssigningTeacherId(null);
          setSelectedClassId("");
        }}
      />

      <SwapClassModal
        open={!!swappingTeacherId}
        classes={sortedClasses}
        selectedClassId={selectedClassId}
        setSelectedClassId={setSelectedClassId}
        currentClassId={swappingTeacherCurrentClassId}
        onConfirm={handleSwapClass}
        onClose={() => {
          setSwappingTeacherId(null);
          setSelectedClassId("");
        }}
      />
    </div>
  );
}
