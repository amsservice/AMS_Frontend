'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMySchool, useUpdateSchool } from '@/app/querry/useSchool';
import { toast } from "sonner";

interface SchoolFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  board: string;
  code: string;
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
  planId: '1Y' | '2Y' | '3Y';
  billableStudents: number;
  paidAmount: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'grace' | 'expired';
}

export default function PrincipalProfilePage() {
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);
  const [isEditPrincipalOpen, setIsEditPrincipalOpen] = useState(false);

  const { data: schoolResponse, isLoading, error, refetch } = useMySchool();
  const updateSchoolMutation = useUpdateSchool();

  const [schoolData, setSchoolData] = useState<SchoolFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    board: '',
    code: '',
    established: ''
  });

  const [principalData, setPrincipalData] = useState<PrincipalFormData>({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    joinedDate: ''
  });

  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    planId: '1Y',
    billableStudents: 0,
    paidAmount: 0,
    startDate: '',
    endDate: '',
    status: 'active'
  });

  const [schoolForm, setSchoolForm] = useState<SchoolFormData>(schoolData);
  const [principalForm, setPrincipalForm] = useState<PrincipalFormData>(principalData);
  const [schoolErrors, setSchoolErrors] = useState<Partial<SchoolFormData>>({});
  const [principalErrors, setPrincipalErrors] = useState<Partial<PrincipalFormData>>({});

  useEffect(() => {
    if (schoolResponse?.school) {
      const school = schoolResponse.school;
      const addressParts = school.address ? school.address.split(',').map(s => s.trim()) : [];
      const city = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';
      const state = addressParts.length > 2 ? addressParts[addressParts.length - 1] : '';
      const streetAddress = addressParts.length > 2 ? addressParts.slice(0, -2).join(', ') : school.address || '';

      const newSchoolData: SchoolFormData = {
        name: school.name || '',
        email: school.email || '',
        phone: school.phone || '',
        address: streetAddress,
        city: city,
        state: state,
        pincode: school.pincode || '',
        board: 'CBSE',
        code: school.id || '',
        established: school.createdAt ? new Date(school.createdAt).getFullYear().toString() : ''
      };
      setSchoolData(newSchoolData);
      setSchoolForm(newSchoolData);

      if (school.principal) {
        const newPrincipalData: PrincipalFormData = {
          name: school.principal.name || '',
          email: school.principal.email || '',
          phone: school.principal.phone || '',
          qualification: '',
          experience: '',
          joinedDate: school.createdAt ? new Date(school.createdAt).toISOString().split('T')[0] : ''
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
          status: school.subscription.status
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
    if (!schoolForm.name.trim()) errors.name = 'School name is required';
    if (!schoolForm.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(schoolForm.email)) errors.email = 'Invalid email format';
    if (schoolForm.phone && !validatePhone(schoolForm.phone)) errors.phone = 'Invalid phone number';
    if (schoolForm.pincode && !validatePincode(schoolForm.pincode)) errors.pincode = 'Pincode must be 6 digits';
    if (!schoolForm.address.trim()) errors.address = 'Address is required';
    setSchoolErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePrincipalForm = (): boolean => {
    const errors: Partial<PrincipalFormData> = {};
    if (!principalForm.name.trim()) errors.name = 'Principal name is required';
    if (!principalForm.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(principalForm.email)) errors.email = 'Invalid email format';
    if (principalForm.phone && !validatePhone(principalForm.phone)) errors.phone = 'Invalid phone number';
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
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const fullAddress = [schoolForm.address, schoolForm.city, schoolForm.state].filter(Boolean).join(', ');
      await updateSchoolMutation.mutateAsync({
        name: schoolForm.name.trim(),
        phone: schoolForm.phone.trim() || undefined,
        address: fullAddress || undefined,
        pincode: schoolForm.pincode.trim() || undefined
      });
      setSchoolData(schoolForm);
      setIsEditSchoolOpen(false);
      toast.success('School details updated successfully');
    } catch (error: any) {
      console.error('Failed to update school:', error);
      toast.error(error?.message || 'Failed to update school details. Please try again.');
    }
  };

  const handlePrincipalSubmit = () => {
    if (!validatePrincipalForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    setPrincipalData(principalForm);
    setIsEditPrincipalOpen(false);
    toast.success('principal details updated successfully');
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
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading school profile...</p>
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
                {error?.message || 'An error occurred while loading your school profile. Please try again.'}
              </p>
              <Button onClick={handleRetry} className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
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
                Your school profile could not be found. Please contact support for assistance.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{schoolData.name || 'School Name'}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {schoolData.board} • Est. {schoolData.established || 'N/A'}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleEditSchool} className="rounded-xl">
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
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Email</p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium break-all">
                        {schoolData.email || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg shadow-lg mt-1">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Phone</p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {schoolData.phone || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-lg shadow-lg mt-1">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Address</p>
                      <p className="text-sm text-gray-900 dark:text-white font-medium">
                        {schoolData.address || 'N/A'}
                      </p>
                      {(schoolData.city || schoolData.state || schoolData.pincode) && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {[schoolData.city, schoolData.state, schoolData.pincode].filter(Boolean).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50 rounded-xl p-4 shadow-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">School Code</p>
                    <p className="text-lg text-gray-900 dark:text-white font-bold">
                      {schoolData.code || 'N/A'}
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200/50 dark:border-green-700/50 rounded-xl p-4 shadow-lg">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Board</p>
                    <p className="text-lg text-gray-900 dark:text-white font-bold">
                      {schoolData.board || 'N/A'}
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
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Principal</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={handleEditPrincipal} className="rounded-xl">
                  <Edit className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                  {principalData.name || 'N/A'}
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white break-all">
                    {principalData.email || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white">
                    {principalData.phone || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <GraduationCap className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <span className="text-gray-900 dark:text-white">
                    {principalData.experience || 'N/A'}
                  </span>
                </div>
                {principalData.joinedDate && (
                  <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                    <span className="text-gray-900 dark:text-white">
                      Joined {new Date(principalData.joinedDate).toLocaleDateString()}
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
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Subscription Details</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Manage your subscription plan</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full shadow-lg">
                <Check className="w-4 h-4 text-white" />
                <span className="text-sm font-semibold text-white">
                  {subscriptionData.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-700/50 rounded-xl p-4 shadow-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Current Plan</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{subscriptionData.planId}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Premium Features</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border border-green-200/50 dark:border-green-700/50 rounded-xl p-4 shadow-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Students</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{subscriptionData.billableStudents}</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border border-purple-200/50 dark:border-purple-700/50 rounded-xl p-4 shadow-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Amount Paid</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">₹{subscriptionData.paidAmount}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Credit Card</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border border-orange-200/50 dark:border-orange-700/50 rounded-xl p-4 shadow-lg">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Valid Until</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {subscriptionData.endDate ? new Date(subscriptionData.endDate).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                className="px-4 sm:px-6 py-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all shadow-lg"
                onClick={() => toast('Invoice history feature coming soon')}
              >
                View Invoice History
              </button>
              <button
                className="px-4 sm:px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm"
                onClick={() => toast('Upgrade plan feature coming soon')}
              >
                Upgrade Plan
              </button>
              <button
                className="px-4 sm:px-6 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all shadow-sm"
                onClick={() => toast('Billing management feature coming soon')}
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
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit School Details</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCancelSchoolEdit} className="rounded-xl">
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
                      className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${schoolErrors.name ? 'border-red-500' : ''}`}
                      placeholder="Enter school name"
                    />
                    {schoolErrors.name && (
                      <p className="text-xs text-red-500 mt-1">{schoolErrors.name}</p>
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
                      className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${schoolErrors.email ? 'border-red-500' : ''}`}
                      placeholder="school@example.com"
                    />
                    {schoolErrors.email && (
                      <p className="text-xs text-red-500 mt-1">{schoolErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">Phone</label>
                    <Input
                      name="phone"
                      value={schoolForm.phone}
                      onChange={handleSchoolChange}
                      className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${schoolErrors.phone ? 'border-red-500' : ''}`}
                      placeholder="+91 98765 43210"
                    />
                    {schoolErrors.phone && (
                      <p className="text-xs text-red-500 mt-1">{schoolErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">Board</label>
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
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${schoolErrors.address ? 'border-red-500' : ''}`}
                    placeholder="123 Education Street"
                  />
                  {schoolErrors.address && (
                    <p className="text-xs text-red-500 mt-1">{schoolErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">City</label>
                    <Input
                      name="city"
                      value={schoolForm.city}
                      onChange={handleSchoolChange}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">State</label>
                    <Input
                      name="state"
                      value={schoolForm.state}
                      onChange={handleSchoolChange}
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">Pincode</label>
                    <Input
                      name="pincode"
                      value={schoolForm.pincode}
                      onChange={handleSchoolChange}
                      className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${schoolErrors.pincode ? 'border-red-500' : ''}`}
                      placeholder="400001"
                    />
                    {schoolErrors.pincode && (
                      <p className="text-xs text-red-500 mt-1">{schoolErrors.pincode}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">Established Year</label>
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
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Principal Details</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={handleCancelPrincipalEdit} className="rounded-xl">
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
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${principalErrors.name ? 'border-red-500' : ''}`}
                    placeholder="Dr. John Smith"
                  />
                  {principalErrors.name && (
                    <p className="text-xs text-red-500 mt-1">{principalErrors.name}</p>
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
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${principalErrors.email ? 'border-red-500' : ''}`}
                    placeholder="principal@school.edu"
                  />
                  {principalErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{principalErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">Phone</label>
                  <Input
                    name="phone"
                    value={principalForm.phone}
                    onChange={handlePrincipalChange}
                    className={`bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl ${principalErrors.phone ? 'border-red-500' : ''}`}
                    placeholder="+91 98765 43211"
                  />
                  {principalErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">{principalErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">Qualification</label>
                  <Input
                    name="qualification"
                    value={principalForm.qualification}
                    onChange={handlePrincipalChange}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                    placeholder="Ph.D. in Education"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">Experience</label>
                  <Input
                    name="experience"
                    value={principalForm.experience}
                    onChange={handlePrincipalChange}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
                    placeholder="25 years"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block font-medium">Joined Date</label>
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
    </div>
  );
}