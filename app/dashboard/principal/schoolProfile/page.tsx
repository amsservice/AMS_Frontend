"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit,
  X,
  User,
  CreditCard,
  GraduationCap,
  Check,
  Loader2,
  AlertCircle,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMySchool, useUpdateSchool } from "@/app/querry/useSchool";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface SchoolFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  board: string;
  code: number | null;
  established: string;
}

interface PrincipalFormData {
  name: string;
  email: string;
  phone: string;
  qualification: string;
  experience: string;
  joinedDate: string;
}

interface SubscriptionData {
  planId: "1Y" | "2Y" | "3Y";
  billableStudents: number;
  paidAmount: number;
  startDate: string;
  endDate: string;
  status: "active" | "grace" | "queued" | "expired";
}

type InvoiceItem = {
  id: string;
  planId: "1Y" | "2Y" | "3Y";
  orderId: string;
  paymentId: string;
  enteredStudents: number;
  futureStudents: number;
  billableStudents: number;
  pricePerStudentPerMonth: number;
  totalMonths: number;
  monthlyCost: number;
  originalAmount: number;
  discountAmount: number;
  paidAmount: number;
  couponCode?: "FREE_3M" | "FREE_6M";
  startDate: string;
  endDate: string;
  status: "active" | "grace" | "queued" | "expired";
  createdAt: string;
};

export default function PrincipalProfilePage() {
  const router = useRouter();
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);
  const [isEditPrincipalOpen, setIsEditPrincipalOpen] = useState(false);
  const [isInvoiceHistoryOpen, setIsInvoiceHistoryOpen] = useState(false);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [upcomingPlans, setUpcomingPlans] = useState<InvoiceItem[]>([]);

  const { data: schoolResponse, isLoading, error, refetch } = useMySchool();
  const updateSchoolMutation = useUpdateSchool();
  const queryClient = useQueryClient();

  const updatePrincipalMutation = useMutation({
    mutationFn: (data: {
      name?: string;
      phone?: string;
      qualification?: string;
      yearsOfExperience?: number;
    }) =>
      apiFetch("/api/auth/principal/profile", {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["school", "me"] });
    },
  });

  const [schoolData, setSchoolData] = useState<SchoolFormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    board: "",
    code: null,
    established: "",
  });

  const [principalData, setPrincipalData] = useState<PrincipalFormData>({
    name: "",
    email: "",
    phone: "",
    qualification: "",
    experience: "",
    joinedDate: "",
  });

  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    planId: "1Y",
    billableStudents: 0,
    paidAmount: 0,
    startDate: "",
    endDate: "",
    status: "active",
  });

  const selectedInvoice = selectedInvoiceId
    ? invoices.find((i) => i.id === selectedInvoiceId) ?? null
    : null;

  const formatSubStatus = (s: InvoiceItem["status"] | SubscriptionData["status"]) => {
    if (s === "queued") return "Upcoming";
    if (s === "grace") return "Grace";
    if (s === "expired") return "Expired";
    return "Active";
  };

  const formatDDMMYYYY = (date: string) => {
    return date ? new Date(date).toLocaleDateString("en-GB") : "-";
  };

  useEffect(() => {
    // Used for showing upcoming queued plans in the subscription section.
    // (Invoice modal still refetches when opened.)
    (async () => {
      try {
        const res = await apiFetch("/api/subscription/invoices");
        const list =
          res && typeof res === "object" && "invoices" in res && Array.isArray((res as any).invoices)
            ? ((res as any).invoices as InvoiceItem[])
            : [];

        const queued = list
          .filter((inv) => inv.status === "queued")
          .sort(
            (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );

        setUpcomingPlans(queued);
      } catch {
        setUpcomingPlans([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (!isInvoiceHistoryOpen) return;

    const fetchInvoices = async () => {
      setInvoiceLoading(true);
      try {
        const res = await apiFetch("/api/subscription/invoices");
        const list =
          res && typeof res === "object" && "invoices" in res && Array.isArray((res as any).invoices)
            ? ((res as any).invoices as InvoiceItem[])
            : [];
        setInvoices(list);
      } catch (err: any) {
        toast.error(err?.message || "Failed to load invoices");
      } finally {
        setInvoiceLoading(false);
      }
    };

    fetchInvoices();
  }, [isInvoiceHistoryOpen]);

  const downloadInvoicePdf = async (invoiceId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/invoices/${encodeURIComponent(
          invoiceId
        )}/pdf`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok) {
        const msg = await res.json().catch(() => ({}));
        const message =
          msg && typeof msg === "object" && "message" in msg
            ? String((msg as any).message)
            : "Failed to download invoice";
        throw new Error(message);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice_${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e: any) {
      toast.error(e?.message || "Failed to download invoice");
    }
  };

  const [schoolForm, setSchoolForm] = useState<SchoolFormData>(schoolData);
  const [principalForm, setPrincipalForm] =
    useState<PrincipalFormData>(principalData);
  const [schoolErrors, setSchoolErrors] = useState<Partial<SchoolFormData>>({});
  const [principalErrors, setPrincipalErrors] = useState<
    Partial<PrincipalFormData>
  >({});

  useEffect(() => {
    if (schoolResponse?.school) {
      const school = schoolResponse.school;
      const addressParts = school.address
        ? school.address.split(",").map((s) => s.trim())
        : [];
      const city =
        addressParts.length > 1 ? addressParts[addressParts.length - 2] : "";
      const state =
        addressParts.length > 2 ? addressParts[addressParts.length - 1] : "";
      const streetAddress =
        addressParts.length > 2
          ? addressParts.slice(0, -2).join(", ")
          : school.address || "";

      const newSchoolData: SchoolFormData = {
        name: school.name || "",
        email: school.email || "",
        phone: school.phone || "",
        address: streetAddress,
        city: city,
        state: state,
        pincode: school.pincode || "",
        board: school.board,
        code: typeof school.schoolCode === "number" ? school.schoolCode : null,
        established:
          typeof (school as any).establishedYear === "number"
            ? String((school as any).establishedYear)
            : "",
      };
      setSchoolData(newSchoolData);
      setSchoolForm(newSchoolData);

      if (school.principal) {
        const yearsOfExp =
          typeof school.principal.yearsOfExperience === "number"
            ? String(school.principal.yearsOfExperience)
            : "";
        const newPrincipalData: PrincipalFormData = {
          name: school.principal.name || "",
          email: school.principal.email || "",
          phone: school.principal.phone || "",
          qualification: (school.principal as any).qualification || "",
          experience: yearsOfExp,
          joinedDate: school.createdAt
            ? new Date(school.createdAt).toISOString().split("T")[0]
            : "",
        };
        setPrincipalData(newPrincipalData);
        setPrincipalForm(newPrincipalData);
      }

      if (school.subscription) {
        setSubscriptionData({
          planId: school.subscription.planId,
          billableStudents: school.subscription.billableStudents,
          paidAmount: school.subscription.paidAmount,
          startDate: school.subscription.startDate,
          endDate: school.subscription.endDate,
          status: school.subscription.status,
        });
      }
    }
  }, [schoolResponse]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s-()]+$/;
    return phone.length >= 10 && phoneRegex.test(phone);
  };

  const validatePincode = (pincode: string): boolean => {
    return /^\d{6}$/.test(pincode);
  };

  const validateSchoolForm = (): boolean => {
    const errors: Partial<SchoolFormData> = {};
    if (!schoolForm.name.trim()) errors.name = "School name is required";
    if (!schoolForm.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(schoolForm.email))
      errors.email = "Invalid email format";
    if (schoolForm.phone && !validatePhone(schoolForm.phone))
      errors.phone = "Invalid phone number";
    if (schoolForm.pincode && !validatePincode(schoolForm.pincode))
      errors.pincode = "Pincode must be 6 digits";
    if (!schoolForm.address.trim()) errors.address = "Address is required";
    if (!schoolForm.board?.trim()) (errors as any).board = "Board is required";
    if (!schoolForm.city?.trim()) (errors as any).city = "City is required";
    if (!schoolForm.state?.trim()) (errors as any).state = "State is required";
    const est = schoolForm.established?.trim();
    if (est) {
      const establishedYear = Number.parseInt(est, 10);
      const currentYear = new Date().getFullYear();
      if (!Number.isFinite(establishedYear)) {
        (errors as any).established = "Established year must be a valid year";
      } else if (establishedYear < 1900 || establishedYear > currentYear) {
        (errors as any).established =
          "Established year must be between 1900 and current year";
      }
    }
    setSchoolErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePrincipalForm = (): boolean => {
    const errors: Partial<PrincipalFormData> = {};
    if (!principalForm.name.trim()) errors.name = "Principal name is required";
    if (!principalForm.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(principalForm.email))
      errors.email = "Invalid email format";
    if (principalForm.phone && !validatePhone(principalForm.phone))
      errors.phone = "Invalid phone number";
    setPrincipalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchoolForm({ ...schoolForm, [name]: value });
    if (schoolErrors[name as keyof SchoolFormData]) {
      setSchoolErrors({ ...schoolErrors, [name]: undefined });
    }
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrincipalForm({ ...principalForm, [name]: value });
    if (principalErrors[name as keyof PrincipalFormData]) {
      setPrincipalErrors({ ...principalErrors, [name]: undefined });
    }
  };

  const handleSchoolSubmit = async () => {
    if (!validateSchoolForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const fullAddress = [
        schoolForm.address,
        schoolForm.city,
        schoolForm.state,
      ]
        .filter(Boolean)
        .join(", ");

      const est = schoolForm.established?.trim();
      const establishedYear = est ? Number.parseInt(est, 10) : undefined;

      await updateSchoolMutation.mutateAsync({
        name: schoolForm.name.trim(),
        establishedYear: Number.isFinite(establishedYear as number)
          ? (establishedYear as number)
          : undefined,
        phone: schoolForm.phone.trim() || undefined,
        board: schoolForm.board.trim() || undefined,
        city: schoolForm.city.trim() || undefined,
        state: schoolForm.state.trim() || undefined,
        address: fullAddress || undefined,
        pincode: schoolForm.pincode.trim() || undefined,
      });
      setSchoolData(schoolForm);
      setIsEditSchoolOpen(false);
      toast.success("School details updated successfully");
    } catch (error: any) {
      console.error("Failed to update school:", error);
      toast.error(
        error?.message || "Failed to update school details. Please try again."
      );
    }
  };

  const handlePrincipalSubmit = async () => {
    if (!validatePrincipalForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      const exp = principalForm.experience?.trim();
      const yearsOfExperience = exp ? Number.parseInt(exp, 10) : undefined;

      await updatePrincipalMutation.mutateAsync({
        name: principalForm.name.trim(),
        phone: principalForm.phone.trim() || undefined,
        qualification: principalForm.qualification.trim() || undefined,
        yearsOfExperience: Number.isFinite(yearsOfExperience as number)
          ? (yearsOfExperience as number)
          : undefined,
      });

      setPrincipalData(principalForm);
      setIsEditPrincipalOpen(false);
      toast.success("Principal details updated successfully");
    } catch (error: any) {
      console.error("Failed to update principal:", error);
      toast.error(
        error?.message ||
          "Failed to update principal details. Please try again."
      );
    }
  };

  const handleEditSchool = () => {
    setSchoolForm(schoolData);
    setSchoolErrors({});
    setIsEditSchoolOpen(true);
  };

  const handleEditPrincipal = () => {
    setPrincipalForm(principalData);
    setPrincipalErrors({});
    setIsEditPrincipalOpen(true);
  };

  const handleCancelSchoolEdit = () => {
    setSchoolForm(schoolData);
    setSchoolErrors({});
    setIsEditSchoolOpen(false);
  };

  const handleCancelPrincipalEdit = () => {
    setPrincipalForm(principalData);
    setPrincipalErrors({});
    setIsEditPrincipalOpen(false);
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Loading school profile...
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
                Failed to Load School Profile
              </h3>
              <p className="text-red-600/80 dark:text-red-400/80 mb-6 max-w-md">
                {error?.message ||
                  "An error occurred while loading your school profile. Please try again."}
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

  if (!schoolResponse?.school) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="flex flex-col items-center justify-center text-center py-12">
              <Building2 className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No School Profile Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                Your school profile could not be found. Please contact support
                for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 overflow-hidden min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              School Profile
            </h1>
            <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
              View and manage your school's information
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {schoolData.name || "School Name"}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {schoolData.board} • Est.{" "}
                      {schoolData.established || "N/A"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditSchool}
                  className="rounded-xl"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg mt-1">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Email
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium break-all">
                        {schoolData.email || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-lg mt-1">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Phone
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {schoolData.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg mt-1">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Address
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {schoolData.address || "N/A"}
                      </p>
                      {(schoolData.city ||
                        schoolData.state ||
                        schoolData.pincode) && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {[
                            schoolData.city,
                            schoolData.state,
                            schoolData.pincode,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50 rounded-xl p-4 shadow-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      School Code
                    </p>
                    <p className="text-lg text-gray-900 dark:text-white font-bold">
                      {schoolData.code ?? "N/A"}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200/50 dark:border-green-700/50 rounded-xl p-4 shadow-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Board
                    </p>
                    <p className="text-lg text-gray-900 dark:text-white font-bold">
                      {schoolData.board || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-lg shadow-lg">
                    <GraduationCap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Principal
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditPrincipal}
                  className="rounded-xl"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {principalData.name || "N/A"}
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white break-all">
                    {principalData.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white">
                    {principalData.phone || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <GraduationCap className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white">
                    {principalData.experience || "N/A"}
                  </span>
                </div>
                {principalData.joinedDate && (
                  <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white">
                      Joined{" "}
                      {new Date(principalData.joinedDate).toLocaleDateString(
                        "en-GB"
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Subscription Details
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage your subscription plan
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full shadow-lg">
                <Check className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">
                  {formatSubStatus(subscriptionData.status)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50 rounded-xl p-4 shadow-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Current Plan
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {subscriptionData.planId}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Premium Features
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200/50 dark:border-green-700/50 rounded-xl p-4 shadow-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Students
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {subscriptionData.billableStudents}
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border border-purple-200/50 dark:border-purple-700/50 rounded-xl p-4 shadow-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Amount Paid
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ₹{subscriptionData.paidAmount}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Credit Card
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200/50 dark:border-orange-700/50 rounded-xl p-4 shadow-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                  Validity
                </p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {subscriptionData.startDate && subscriptionData.endDate
                    ? `${formatDDMMYYYY(subscriptionData.startDate)} - ${formatDDMMYYYY(subscriptionData.endDate)}`
                    : "N/A"}
                </p>
              </div>
            </div>

            {upcomingPlans.length > 0 && (
              <div className="mb-6">
                <div className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                  Upcoming Plans
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {upcomingPlans.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white/70 dark:bg-white/5 border border-gray-200/60 dark:border-white/10 rounded-xl p-4 shadow-lg"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                          Plan {p.planId}
                        </div>
                        <div className="text-xs px-3 py-1 rounded-full bg-indigo-600 text-white font-semibold">
                          {formatSubStatus(p.status)}
                        </div>
                      </div>
                      <div className="mt-3 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <div>
                          <span className="font-semibold">Validity:</span> {formatDDMMYYYY(p.startDate)} - {formatDDMMYYYY(p.endDate)}
                        </div>
                        <div>
                          <span className="font-semibold">Students:</span> {p.billableStudents}
                        </div>
                        <div>
                          <span className="font-semibold">Amount:</span> ₹{p.paidAmount}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 sm:px-6 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg"
                onClick={() => {
                  setSelectedInvoiceId(null);
                  setIsInvoiceHistoryOpen(true);
                }}
              >
                View Invoice History
              </button>
              <button
                className="px-4 sm:px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm"
                onClick={() => router.push("/dashboard/principal/upgrade-plan")}
              >
                Upgrade Plan
              </button>
              <button
                className="px-4 sm:px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm"
                onClick={() => toast("Billing management feature coming soon")}
              >
                Manage Billing
              </button>
            </div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isEditSchoolOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCancelSchoolEdit}
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
                    Edit School Details
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelSchoolEdit}
                  className="rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                      School Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="name"
                      value={schoolForm.name}
                      onChange={handleSchoolChange}
                      className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${
                        schoolErrors.name ? "border-red-500" : ""
                      }`}
                      placeholder="Enter school name"
                    />
                    {schoolErrors.name && (
                      <p className="text-xs text-red-500 mt-1">
                        {schoolErrors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={schoolForm.email}
                      onChange={handleSchoolChange}
                      disabled
                      readOnly
                      className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${
                        schoolErrors.email ? "border-red-500" : ""
                      }`}
                      placeholder="school@example.com"
                    />
                    {schoolErrors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {schoolErrors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                      Phone
                    </label>
                    <Input
                      name="phone"
                      value={schoolForm.phone}
                      onChange={handleSchoolChange}
                      className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${
                        schoolErrors.phone ? "border-red-500" : ""
                      }`}
                      placeholder="+91 98765 43210"
                    />
                    {schoolErrors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {schoolErrors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                      Board
                    </label>
                    <Input
                      name="board"
                      value={schoolForm.board}
                      onChange={handleSchoolChange}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      placeholder="CBSE"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="address"
                    value={schoolForm.address}
                    onChange={handleSchoolChange}
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${
                      schoolErrors.address ? "border-red-500" : ""
                    }`}
                    placeholder="123 Education Street"
                  />
                  {schoolErrors.address && (
                    <p className="text-xs text-red-500 mt-1">
                      {schoolErrors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                      City
                    </label>
                    <Input
                      name="city"
                      value={schoolForm.city}
                      onChange={handleSchoolChange}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                      State
                    </label>
                    <Input
                      name="state"
                      value={schoolForm.state}
                      onChange={handleSchoolChange}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                      Pincode
                    </label>
                    <Input
                      name="pincode"
                      value={schoolForm.pincode}
                      onChange={handleSchoolChange}
                      className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${
                        schoolErrors.pincode ? "border-red-500" : ""
                      }`}
                      placeholder="400001"
                    />
                    {schoolErrors.pincode && (
                      <p className="text-xs text-red-500 mt-1">
                        {schoolErrors.pincode}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                      Established Year
                    </label>
                    <Input
                      name="established"
                      value={schoolForm.established}
                      onChange={handleSchoolChange}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      placeholder="1985"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancelSchoolEdit}
                  className="flex-1 rounded-xl"
                  disabled={updateSchoolMutation.isPending}
                >
                  Cancel
                </Button>
                <button
                  onClick={handleSchoolSubmit}
                  disabled={updateSchoolMutation.isPending}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
                >
                  {updateSchoolMutation.isPending ? (
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

      <AnimatePresence>
        {isEditPrincipalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleCancelPrincipalEdit}
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
                  <div className="p-2 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-lg">
                    <Edit className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Edit Principal Details
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelPrincipalEdit}
                  className="rounded-xl"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={principalForm.name}
                    onChange={handlePrincipalChange}
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${
                      principalErrors.name ? "border-red-500" : ""
                    }`}
                    placeholder="Dr. John Smith"
                  />
                  {principalErrors.name && (
                    <p className="text-xs text-red-500 mt-1">
                      {principalErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={principalForm.email}
                    onChange={handlePrincipalChange}
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${
                      principalErrors.email ? "border-red-500" : ""
                    }`}
                    placeholder="principal@school.edu"
                  />
                  {principalErrors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {principalErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                    Phone
                  </label>
                  <Input
                    name="phone"
                    value={principalForm.phone}
                    onChange={handlePrincipalChange}
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${
                      principalErrors.phone ? "border-red-500" : ""
                    }`}
                    placeholder="+91 98765 43211"
                  />
                  {principalErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">
                      {principalErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                    Qualification
                  </label>
                  <Input
                    name="qualification"
                    value={principalForm.qualification}
                    onChange={handlePrincipalChange}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                    placeholder="Ph.D. in Education"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                    Experience
                  </label>
                  <Input
                    name="experience"
                    value={principalForm.experience}
                    onChange={handlePrincipalChange}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                    placeholder="25 years"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">
                    Joined Date
                  </label>
                  <Input
                    name="joinedDate"
                    type="date"
                    value={principalForm.joinedDate}
                    onChange={handlePrincipalChange}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancelPrincipalEdit}
                  className="flex-1 rounded-xl"
                >
                  Cancel
                </Button>
                <button
                  onClick={handlePrincipalSubmit}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-br from-teal-600 to-cyan-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isInvoiceHistoryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsInvoiceHistoryOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Invoice History
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {schoolData.name || "School"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedInvoice && (
                    <Button
                      variant="outline"
                      onClick={() => setSelectedInvoiceId(null)}
                      className="rounded-xl"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsInvoiceHistoryOpen(false)}
                    className="rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {invoiceLoading ? (
                <div className="py-12 flex items-center justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
                </div>
              ) : selectedInvoice ? (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Invoice Date
                      </p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {selectedInvoice.createdAt
                          ? new Date(selectedInvoice.createdAt).toLocaleDateString("en-GB")
                          : "-"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg"
                        onClick={() => {
                          if (!selectedInvoice) return;
                          downloadInvoicePdf(selectedInvoice.id);
                        }}
                      >
                        Download PDF
                      </button>
                    </div>
                  </div>

                  <div id="invoice-print-area">
                    <div className="card">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                        <div>
                          <div className="h">Upastithi Subscription Invoice</div>
                          <div className="muted">{schoolData.name || "School"}</div>
                        </div>
                        <div className="text-left sm:text-right">
                          <div className="muted">Order ID</div>
                          <div className="mono">{selectedInvoice.orderId}</div>
                          <div className="muted" style={{ marginTop: 8 }}>Payment ID</div>
                          <div className="mono">{selectedInvoice.paymentId}</div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="muted">Plan : <b>{selectedInvoice.planId}</b></div>
                        <div></div>
                      </div>
                      <div className="row">
                        <div className="muted">Entered Students : <b>{selectedInvoice.enteredStudents}</b></div>
                        <div></div>
                      </div>
                      <div className="row">
                        <div className="muted">Future Students : <b>{selectedInvoice.futureStudents}</b></div>
                        <div></div>
                      </div>
                      <div className="row">
                        <div className="muted">Billable Students : <b>{selectedInvoice.billableStudents}</b></div>
                        <div></div>
                      </div>
                      <div className="row">
                        <div className="muted">Price / Student / Month : <b>₹{selectedInvoice.pricePerStudentPerMonth}</b></div>
                        <div></div>
                      </div>
                      <div className="row">
                        <div className="muted">Total Months : <b>{selectedInvoice.totalMonths}</b></div>
                        <div></div>
                      </div>
                      <div className="row">
                        <div className="muted">Monthly Cost : <b>₹{selectedInvoice.monthlyCost}</b></div>
                        <div></div>
                      </div>
                      <div className="row">
                        <div className="muted">Original Amount : <b>₹{selectedInvoice.originalAmount}</b></div>
                        <div></div>
                      </div>
                      <div className="row">
                        <div className="muted">Discount : <b>- ₹{selectedInvoice.discountAmount}</b></div>
                        <div></div>
                      </div>
                      <div className="row">
                        <div className="muted">Amount Paid : <b>₹{selectedInvoice.paidAmount}</b></div>
                        <div></div>
                      </div>
                      <div className="row">
                        <div className="muted">Coupon : <b>{selectedInvoice.couponCode || "-"}</b></div>
                        <div></div>
                      </div>
                      <div className="row">
                        <div className="muted">Subscription Period : <b>
                            {selectedInvoice.startDate
                              ? new Date(selectedInvoice.startDate).toLocaleDateString("en-GB")
                              : "-"}
                            {" "}to{" "}
                            {selectedInvoice.endDate
                              ? new Date(selectedInvoice.endDate).toLocaleDateString("en-GB")
                              : "-"}
                          </b></div>
                        <div>
                          
                        </div>
                      </div>
                      <div className="row">
                        <div className="muted">Status : <b>{formatSubStatus(selectedInvoice.status)}</b></div>
                        <div></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {invoices.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-gray-600 dark:text-gray-400">
                        No invoices found.
                      </p>
                    </div>
                  ) : (
                    invoices.map((inv) => (
                      <div
                        key={inv.id}
                        className="p-4 rounded-2xl border border-gray-200/60 dark:border-white/10 bg-white/60 dark:bg-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {inv.createdAt
                              ? new Date(inv.createdAt).toLocaleDateString("en-GB")
                              : "-"}
                            {" "}• Plan {inv.planId}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            Paid: ₹{inv.paidAmount} • Students: {inv.billableStudents} • Status: {formatSubStatus(inv.status)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span className="font-semibold">Order:</span> {inv.orderId}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-lg"
                            onClick={() => setSelectedInvoiceId(inv.id)}
                          >
                            View
                          </button>
                          <button
                            className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm"
                            onClick={() => {
                              downloadInvoicePdf(inv.id);
                            }}
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
