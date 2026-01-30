"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  Calendar,
  Edit,
  X,
  User,
  GraduationCap,
  Check,
  Loader2,
  AlertCircle,
  Save,
  BookOpen,
  Award,
  Clock,
  MapPin,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useMyTeacherFullProfile,
  useUpdateMyTeacherProfile,
} from "@/app/querry/useTeachers";
import { toast } from "sonner";

interface PersonalFormData {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: "male" | "female" | "other";
}

interface ProfessionalFormData {
  highestQualification: string;
  experienceYears: string;
  address: string;
}

export default function TeacherProfilePage() {
  const [isEditPersonalOpen, setIsEditPersonalOpen] = useState(false);
  const [isEditProfessionalOpen, setIsEditProfessionalOpen] = useState(false);

  const { data: profileResponse, isLoading, error, refetch } = useMyTeacherFullProfile();
  const updateProfileMutation = useUpdateMyTeacherProfile();

  const [personalData, setPersonalData] = useState<PersonalFormData>({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "male",
  });

  const [professionalData, setProfessionalData] = useState<ProfessionalFormData>({
    highestQualification: "",
    experienceYears: "",
    address: "",
  });

  const [currentAssignment, setCurrentAssignment] = useState<{
    className: string;
    section: string;
  } | null>(null);

  const [schoolInfo, setSchoolInfo] = useState({
    name: "",
    address: "",
    board: "",
    principal: "",
  });

  const [personalForm, setPersonalForm] = useState<PersonalFormData>(personalData);
  const [professionalForm, setProfessionalForm] = useState<ProfessionalFormData>(professionalData);
  const [personalErrors, setPersonalErrors] = useState<Partial<PersonalFormData>>({});
  const [professionalErrors, setProfessionalErrors] = useState<Partial<ProfessionalFormData>>({});

  useEffect(() => {
    if (profileResponse?.data) {
      const teacher = profileResponse.data;

      const newPersonalData: PersonalFormData = {
        name: teacher.name || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        dob: teacher.dob ? new Date(teacher.dob).toISOString().split("T")[0] : "",
        gender: teacher.gender || "male",
      };
      setPersonalData(newPersonalData);
      setPersonalForm(newPersonalData);

      const newProfessionalData: ProfessionalFormData = {
        highestQualification: teacher.highestQualification || "",
        experienceYears: typeof teacher.experienceYears === "number" 
          ? String(teacher.experienceYears) 
          : "",
        address: teacher.address || "",
      };
      setProfessionalData(newProfessionalData);
      setProfessionalForm(newProfessionalData);

      // Get current active assignment
      const activeHistory = teacher.history?.find((h) => h.isActive);
      if (activeHistory) {
        setCurrentAssignment({
          className: activeHistory.className,
          section: activeHistory.section,
        });
      }

      // School info
      if (teacher.schoolId) {
        setSchoolInfo({
          name: teacher.schoolId.name || "",
          address: "",
          board: "",
          principal: "",
        });
      }
    }
  }, [profileResponse]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s-()]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
  };

  const validatePersonalForm = (): boolean => {
    const errors: Partial<PersonalFormData> = {};
    
    if (!personalForm.name.trim()) {
      errors.name = "Name is required";
    }
    
    if (!personalForm.email.trim()) {
      errors.email = "Email is required";
    } else if (!validateEmail(personalForm.email)) {
      errors.email = "Invalid email format";
    }
    
    if (personalForm.phone && !validatePhone(personalForm.phone)) {
      errors.phone = "Invalid phone number (min 10 digits)";
    }

    setPersonalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateProfessionalForm = (): boolean => {
    const errors: Partial<ProfessionalFormData> = {};
    
    if (professionalForm.experienceYears) {
      const years = Number.parseInt(professionalForm.experienceYears, 10);
      if (!Number.isFinite(years) || years < 0 || years > 100) {
        errors.experienceYears = "Experience must be between 0 and 100 years";
      }
    }

    setProfessionalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalForm({ ...personalForm, [name]: value });
    if (personalErrors[name as keyof PersonalFormData]) {
      setPersonalErrors({ ...personalErrors, [name]: undefined });
    }
  };

  const handleProfessionalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfessionalForm({ ...professionalForm, [name]: value });
    if (professionalErrors[name as keyof ProfessionalFormData]) {
      setProfessionalErrors({ ...professionalErrors, [name]: undefined });
    }
  };

  const handlePersonalSubmit = async () => {
    if (!validatePersonalForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      await updateProfileMutation.mutateAsync({
        name: personalForm.name.trim(),
        phone: personalForm.phone.trim() || undefined,
      });

      setPersonalData(personalForm);
      setIsEditPersonalOpen(false);
      toast.success("Personal information updated successfully");
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      toast.error(error?.message || "Failed to update profile. Please try again.");
    }
  };

  const handleProfessionalSubmit = async () => {
    if (!validateProfessionalForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Note: The current API doesn't support updating professional details for teachers
    // This would need to be updated through the principal's interface
    toast.info("Professional details can only be updated by the principal");
    setIsEditProfessionalOpen(false);
  };

  const handleEditPersonal = () => {
    setPersonalForm(personalData);
    setPersonalErrors({});
    setIsEditPersonalOpen(true);
  };

  const handleEditProfessional = () => {
    setProfessionalForm(professionalData);
    setProfessionalErrors({});
    setIsEditProfessionalOpen(true);
  };

  const handleCancelPersonalEdit = () => {
    setPersonalForm(personalData);
    setPersonalErrors({});
    setIsEditPersonalOpen(false);
  };

  const handleCancelProfessionalEdit = () => {
    setProfessionalForm(professionalData);
    setProfessionalErrors({});
    setIsEditProfessionalOpen(false);
  };

  const handleRetry = () => {
    refetch();
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-red-200/50 dark:border-red-800/50 p-8">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
                Failed to Load Profile
              </h3>
              <p className="text-red-600/80 dark:text-red-400/80 mb-6 max-w-md">
                {error?.message ||
                  "An error occurred while loading your profile. Please try again."}
              </p>
              <Button
                onClick={handleRetry}
                className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profileResponse?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="flex flex-col items-center justify-center text-center py-12">
              <User className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Profile Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Your profile could not be found. Please contact your administrator
                for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const teacher = profileResponse.data;
  const joinedDate = teacher.createdAt ? formatDate(teacher.createdAt) : "-";

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 overflow-hidden min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
                My Profile
              </h1>
              <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
                View and manage your profile information
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{personalData.name}</p>
                <p className="text-xs text-blue-100">{personalData.email}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/10 rounded-full flex items-center justify-center border-2 border-white/30">
                <span className="text-white font-bold text-lg">
                  {getInitials(personalData.name)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Header Card */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-4xl sm:text-5xl">
                  {getInitials(personalData.name)}
                </span>
              </div>
              {teacher.isActive && (
                <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full shadow-lg flex items-center gap-1">
                  <Check className="w-3 h-3 text-white" />
                  <span className="text-xs font-semibold text-white">Active</span>
                </div>
              )}
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {personalData.name}
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-2">
                {teacher.roles?.includes("teacher") && "Teacher"}
                {teacher.roles?.includes("coordinator") && " • Coordinator"}
              </p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span>{personalData.email}</span>
                </div>
                {personalData.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    <span>{personalData.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Personal Information
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your contact and identification details
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditPersonal}
                  className="rounded-xl"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Full Name
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {personalData.name || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg mt-1">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Email Address
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium break-all">
                      {personalData.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-lg mt-1">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Phone Number
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {personalData.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="p-2 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg shadow-lg mt-1">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Date of Birth
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {personalData.dob ? formatDate(personalData.dob) : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="p-2 bg-gradient-to-br from-pink-600 to-rose-600 rounded-lg shadow-lg mt-1">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Employee ID
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium font-mono">
                      {teacher._id ? `EMP-${teacher._id.slice(-8).toUpperCase()}` : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="p-2 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg shadow-lg mt-1">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Joined On
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {joinedDate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      Professional Details
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your qualifications and experience
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditProfessional}
                  className="rounded-xl"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg mt-1">
                    <Award className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Qualification
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {professionalData.highestQualification || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg mt-1">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Teaching Experience
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {professionalData.experienceYears 
                        ? `${professionalData.experienceYears} Years` 
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {professionalData.address && (
                  <div className="md:col-span-2 flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-lg mt-1">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Address
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {professionalData.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Current Assignment */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Current Assignment
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your assigned class and subject
                  </p>
                </div>
              </div>

              {currentAssignment ? (
                <div className="space-y-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Assigned Class
                      </p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      Class {currentAssignment.className} - {currentAssignment.section}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200/50 dark:border-green-700/50 rounded-xl shadow-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <GraduationCap className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Subject
                      </p>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {currentAssignment.className.includes("Mathematics") 
                        ? "Mathematics" 
                        : "Primary Education"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No class assigned yet
                  </p>
                </div>
              )}
            </div>

            {/* School Information */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-orange-600 to-amber-600 rounded-xl shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    School Information
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Details about your school
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg mt-1">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      School Name
                    </p>
                    <p className="text-sm text-gray-900 dark:text-white font-medium">
                      {schoolInfo.name || "N/A"}
                    </p>
                  </div>
                </div>

                {schoolInfo.board && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg mt-1">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Board
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {schoolInfo.board}
                      </p>
                    </div>
                  </div>
                )}

                {schoolInfo.principal && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-lg mt-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Principal
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {schoolInfo.principal}
                      </p>
                    </div>
                  </div>
                )}

                {schoolInfo.address && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-2 bg-gradient-to-br from-orange-600 to-amber-600 rounded-lg shadow-lg mt-1">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Address
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {schoolInfo.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Edit Personal Information Modal */}
      <AnimatePresence>
        {isEditPersonalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCancelPersonalEdit}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Edit Personal Information
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelPersonalEdit}
                  className="rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="name"
                      value={personalForm.name}
                      onChange={handlePersonalChange}
                      className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${
                        personalErrors.name ? "border-red-500" : ""
                      }`}
                      placeholder="John Doe"
                    />
                    {personalErrors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {personalErrors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={personalForm.email}
                      disabled
                      readOnly
                      className="bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-xl cursor-not-allowed"
                      placeholder="teacher@school.com"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Email cannot be changed
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                      Phone Number
                    </label>
                    <Input
                      name="phone"
                      value={personalForm.phone}
                      onChange={handlePersonalChange}
                      className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${
                        personalErrors.phone ? "border-red-500" : ""
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {personalErrors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {personalErrors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                      Date of Birth
                    </label>
                    <Input
                      name="dob"
                      type="date"
                      value={personalForm.dob}
                      disabled
                      readOnly
                      className="bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-xl cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Date of birth cannot be changed
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={personalForm.gender}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-xl cursor-not-allowed"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Gender cannot be changed
                  </p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancelPersonalEdit}
                  className="flex-1 rounded-xl"
                  disabled={updateProfileMutation.isPending}
                >
                  Cancel
                </Button>
                <button
                  onClick={handlePersonalSubmit}
                  disabled={updateProfileMutation.isPending}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {updateProfileMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Professional Details Modal */}
      <AnimatePresence>
        {isEditProfessionalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCancelProfessionalEdit}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Edit Professional Details
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelProfessionalEdit}
                  className="rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-900 dark:text-blue-200 font-medium mb-1">
                      Limited Access
                    </p>
                    <p className="text-xs text-blue-700 dark:text-blue-300">
                      Professional details can only be updated by your principal or
                      administrator. Please contact them to request changes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 opacity-50 pointer-events-none">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                    Highest Qualification
                  </label>
                  <Input
                    name="highestQualification"
                    value={professionalForm.highestQualification}
                    disabled
                    className="bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-xl"
                    placeholder="M.Sc. Mathematics, B.Ed."
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                    Teaching Experience (Years)
                  </label>
                  <Input
                    name="experienceYears"
                    type="number"
                    value={professionalForm.experienceYears}
                    disabled
                    className="bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-xl"
                    placeholder="8"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                    Address
                  </label>
                  <Input
                    name="address"
                    value={professionalForm.address}
                    disabled
                    className="bg-gray-100 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-xl"
                    placeholder="123 Main Street, City"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancelProfessionalEdit}
                  className="flex-1 rounded-xl"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}