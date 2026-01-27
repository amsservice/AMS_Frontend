
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  useInfiniteTeachers,
  useCreateTeacher,
  useDeleteTeacher,
  useBulkDeactivateTeachers,
  useReactivateTeacher,
  useAssignClassToTeacher,
  useBulkUploadTeachers,
  useSwapTeacherClasses,
  useTeacherFullProfile,
  useUpdateTeacherProfileByPrincipal,
} from "@/app/querry/useTeachers";

import { useClasses } from "@/app/querry/useClasses";
import { useSessions } from "@/app/querry/useSessions";

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
  const [autoEnableEditOnLoad, setAutoEnableEditOnLoad] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState("");

  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);
  const [showReassignOnDelete, setShowReassignOnDelete] = useState(false);
  const [reassignToTeacherId, setReassignToTeacherId] = useState("");
  const [isReassigningAndDeleting, setIsReassigningAndDeleting] = useState(false);

  const [bulkTeacherFile, setBulkTeacherFile] = useState<File | null>(null);
  const [bulkTeacherClientErrors, setBulkTeacherClientErrors] = useState<string[]>([]);

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
    sessionId: "",
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
    roles: ["teacher"] as ("teacher" | "coordinator")[],
  });

  const staffListQuery = useInfiniteTeachers({ limit: 50 });
  const teachers = useMemo(() => {
    const pages = staffListQuery.data?.pages || [];
    const all = pages.flatMap((p: any) => (Array.isArray(p?.items) ? p.items : []));
    const byId = new Map<string, any>();
    all.forEach((t: any) => {
      const id = String(t?.id || '');
      if (!id) return;
      if (!byId.has(id)) byId.set(id, t);
    });
    return Array.from(byId.values());
  }, [staffListQuery.data]);

  const [selectedTeacherIds, setSelectedTeacherIds] = useState<Set<string>>(new Set());

  const selectableTeachers = useMemo(
    () => (teachers || []).filter((t: any) => t?.isActive),
    [teachers]
  );

  const allSelected =
    selectableTeachers.length > 0 &&
    selectableTeachers.every((t: any) => selectedTeacherIds.has(String(t.id)));
  const someSelected =
    selectableTeachers.some((t: any) => selectedTeacherIds.has(String(t.id))) && !allSelected;

  const toggleTeacherSelected = (id: string) => {
    setSelectedTeacherIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAllTeachers = () => {
    setSelectedTeacherIds((prev) => {
      const next = new Set(prev);
      const allAreSelected =
        selectableTeachers.length > 0 &&
        selectableTeachers.every((t: any) => next.has(String(t.id)));
      if (allAreSelected) {
        selectableTeachers.forEach((t: any) => next.delete(String(t.id)));
      } else {
        selectableTeachers.forEach((t: any) => next.add(String(t.id)));
      }
      return next;
    });
  };

  const handleBulkDeleteSelectedTeachers = () => {
    const ids = Array.from(selectedTeacherIds);
    if (!ids.length) {
      toast.error('Please select at least one staff member');
      return;
    }

    bulkDeactivateTeachersMutation.mutate(ids, {
      onSuccess: (resp: any) => {
        const results = Array.isArray(resp?.results) ? resp.results : [];
        const failed = results.filter((r: any) => !r?.ok);
        const successCount = results.filter((r: any) => r?.ok).length;

        if (failed.length > 0) {
          const firstMsg = failed[0]?.message || 'Some staff could not be deleted';
          toast.error(`Deleted ${successCount}. Failed ${failed.length}. ${firstMsg}`);
        } else {
          toast.success(`Deleted ${successCount} staff successfully`);
        }

        setSelectedTeacherIds(new Set());
      },
      onError: (err: any) => toast.error(getErrorMessage(err))
    });
  };

  const handleBulkDeleteAllTeachers = () => {
    if (!selectableTeachers.length) {
      toast.error('No active staff to delete');
      return;
    }

    const ids = selectableTeachers.map((t: any) => String(t.id));
    bulkDeactivateTeachersMutation.mutate(ids, {
      onSuccess: (resp: any) => {
        const results = Array.isArray(resp?.results) ? resp.results : [];
        const failed = results.filter((r: any) => !r?.ok);
        const successCount = results.filter((r: any) => r?.ok).length;

        if (failed.length > 0) {
          const firstMsg = failed[0]?.message || 'Some staff could not be deleted';
          toast.error(`Deleted ${successCount}. Failed ${failed.length}. ${firstMsg}`);
        } else {
          toast.success(`Deleted ${successCount} staff successfully`);
        }

        setSelectedTeacherIds(new Set());
      },
      onError: (err: any) => toast.error(getErrorMessage(err))
    });
  };
  const totalStaff = staffListQuery.data?.pages?.[0]?.total;
  const isLoading = staffListQuery.isLoading;
  const { data: classes = [] } = useClasses();
  const { data: sessions = [] } = useSessions();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    if (!staffListQuery.hasNextPage) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (staffListQuery.isFetchingNextPage) return;
        staffListQuery.fetchNextPage();
      },
      { root: null, rootMargin: "200px", threshold: 0 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [staffListQuery.hasNextPage, staffListQuery.isFetchingNextPage, staffListQuery.fetchNextPage]);

  const activeSessionId = useMemo(() => {
    const active = (sessions as any[]).find((s) => s?.isActive);
    return active?._id || active?.id || "";
  }, [sessions]);

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

  const { mutate: createTeacher } = useCreateTeacher();
  const { mutate: deleteTeacher } = useDeleteTeacher();
  const bulkDeactivateTeachersMutation = useBulkDeactivateTeachers();
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
    roles?: ("teacher" | "coordinator")[];
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

    if (Array.isArray(data.roles) && data.roles.length === 0) return "Please select at least one role";

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

  const handleBulkTeacherUpload = async () => {
    if (!bulkTeacherFile) {
      toast.error("Please select a CSV file");
      return;
    }

    const sessionIdToUse = activeSessionId;
    if (!sessionIdToUse) {
      toast.error("Please create/activate a session first");
      return;
    }

    setBulkTeacherClientErrors([]);

    bulkUploadTeachersMutation.mutate(
      { file: bulkTeacherFile, sessionId: sessionIdToUse },
      {
        onSuccess: (resp: any) => {
          if (resp && resp.success === false) {
            const first = resp?.validationErrors?.[0];
            const msg = first?.message
              ? `CSV validation failed. Row ${first.row}: ${first.message}`
              : resp?.message || "CSV validation failed";
            toast.error(msg);
            return;
          }
          toast.success(resp?.message || "Staff uploaded successfully");
          resetBulkTeachersUpload();
          setIsBulkUploadOpen(false);
        },
        onError: (err: any) => {
          const first = err?.data?.validationErrors?.[0];
          const msg = first?.message
            ? `CSV validation failed. Row ${first.row}: ${first.message}`
            : getErrorMessage(err);
          toast.error(msg);
        }
      }
    );
  };

  const downloadTeacherSampleCsv = () => {
    const csvContent =
      "name,email,password,phone,dob,gender,role,highestQualification,experienceYears,address\nJohn Doe,john@example.com,pass1234,9876543210,2000-01-15,male,teacher,B.Ed,5,Some street address";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "staff_sample.csv";
    a.click();
  };

  const handleAddTeacher = (e: React.SyntheticEvent) => {
    e.preventDefault();

    const sessionIdToUse = formData.sessionId || activeSessionId;
    if (!sessionIdToUse) {
      toast.error("Please create/activate a session first");
      return;
    }

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
        sessionId: sessionIdToUse,
      },
      {
        onSuccess: () => {
          toast.success("Staff created successfully");
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
            sessionId: "",
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
        staffAId: swappingTeacher.id,
        classAId: swappingTeacher.currentClass.classId,
        classAName: swappingTeacher.currentClass.className,
        sectionA: swappingTeacher.currentClass.section,
        staffBId: targetTeacher.id,
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

  const handleEditTeacher = (teacherId: string) => {
    setViewingTeacherId(teacherId);
    setIsEditing(true);
    setAutoEnableEditOnLoad(true);
  };

  useEffect(() => {
    if (!autoEnableEditOnLoad) return;
    if (!isEditing) return;
    if (!teacherFullData?.data) return;

    setEditFormData({
      name: teacherFullData.data.name || "",
      email: teacherFullData.data.email || "",
      phone: teacherFullData.data.phone || "",
      dob: teacherFullData.data.dob ? teacherFullData.data.dob.slice(0, 10) : "",
      gender: teacherFullData.data.gender || "",
      highestQualification: teacherFullData.data.highestQualification || "",
      experienceYears: typeof teacherFullData.data.experienceYears === "number" ? String(teacherFullData.data.experienceYears) : "",
      address: teacherFullData.data.address || "",
      roles:
        Array.isArray((teacherFullData as any)?.data?.roles) && (teacherFullData as any).data.roles.length
          ? (teacherFullData as any).data.roles
          : (["teacher"] as ("teacher" | "coordinator")[]),
    });

    setAutoEnableEditOnLoad(false);
  }, [autoEnableEditOnLoad, isEditing, teacherFullData]);

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
        roles: Array.isArray((teacherFullData as any)?.data?.roles) && (teacherFullData as any).data.roles.length
          ? (teacherFullData as any).data.roles
          : (["teacher"] as ("teacher" | "coordinator")[]),
      });
      setIsEditing(true);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditFormData({ name: "", email: "", phone: "", dob: "", gender: "", highestQualification: "", experienceYears: "", address: "", roles: ["teacher"] });
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
      roles?: ("teacher" | "coordinator")[];
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
    if (Array.isArray(editFormData.roles)) updateData.roles = editFormData.roles;

    updateTeacherMutation.mutate(updateData, {
      onSuccess: () => {
        setIsEditing(false);
        toast.success("Staff updated successfully");
      },
      onError: (error: any) => toast.error(getErrorMessage(error)),
    });
  };

  const stats = [
    { label: "Total Staff", value: typeof totalStaff === 'number' ? totalStaff : teachers.length, bgGradient: "from-blue-500 to-indigo-600" },
    { label: "Assigned", value: teachers.filter((t: Teacher) => t.currentClass).length, bgGradient: "from-purple-500 to-violet-600" },
  ];

  const swappingTeacherCurrentClassId = swappingTeacherId && teachers?.length ? teachers.find((t: Teacher) => t.id === swappingTeacherId)?.currentClass?.classId ?? null : null;

  const teacherToDelete = confirmDelete ? (teachers as Teacher[]).find((t) => t.id === confirmDelete.id) : undefined;

  const unassignedTeachers = (teachers as Teacher[]).filter((t) => !t.currentClass && t.id !== confirmDelete?.id);

  const handleReassignAndDelete = async () => {
    if (!confirmDelete) return;
    if (!teacherToDelete?.currentClass) return;

    if (!reassignToTeacherId) {
      toast.error("Please select a staff member to reassign this class to");
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

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Selected: {selectedTeacherIds.size}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleBulkDeleteSelectedTeachers}
                disabled={bulkDeactivateTeachersMutation.isPending}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm"
              >
                Delete selected
              </button>
              <button
                onClick={handleBulkDeleteAllTeachers}
                disabled={bulkDeactivateTeachersMutation.isPending}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm"
              >
                Delete all
              </button>
            </div>
          </div>

          <TeachersTable
            teachers={teachers}
            isLoading={isLoading}
            onView={handleViewTeacher}
            onEdit={handleEditTeacher}
            onAssign={(id) => {
              setAssigningTeacherId(id);
              setSelectedClassId("");
            }}
            onSwap={(id) => {
              setSwappingTeacherId(id);
              setSelectedClassId("");
            }}
            onDelete={(teacher) => {
              setConfirmDelete(teacher);
              setShowReassignOnDelete(false);
              setReassignToTeacherId("");
            }}
            selectedIds={selectedTeacherIds}
            onToggleSelected={toggleTeacherSelected}
            onToggleSelectAll={toggleSelectAllTeachers}
            allSelected={allSelected}
            someSelected={someSelected}
          />

          <div ref={loadMoreRef} />
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
              toast.success(resp?.message || "Staff activated successfully");
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
