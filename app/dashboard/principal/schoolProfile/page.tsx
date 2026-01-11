



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
  // const { toast } = toast();
  const [isEditSchoolOpen, setIsEditSchoolOpen] = useState(false);
  const [isEditPrincipalOpen, setIsEditPrincipalOpen] = useState(false);

  // Fetch school data from API
  const { data: schoolResponse, isLoading, error, refetch } = useMySchool();
  const updateSchoolMutation = useUpdateSchool();

  // School Data - populated from API
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

  // Principal Data - populated from API
  const [principalData, setPrincipalData] = useState<PrincipalFormData>({
    name: '',
    email: '',
    phone: '',
    qualification: '',
    experience: '',
    joinedDate: ''
  });

  // Subscription Data - populated from API
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    planId: '1Y',
    billableStudents: 0,
    paidAmount: 0,
    startDate: '',
    endDate: '',
    status: 'active'
  });


  // Form state
  const [schoolForm, setSchoolForm] = useState<SchoolFormData>(schoolData);
  const [principalForm, setPrincipalForm] = useState<PrincipalFormData>(principalData);

  // Validation errors
  const [schoolErrors, setSchoolErrors] = useState<Partial<SchoolFormData>>({});
  const [principalErrors, setPrincipalErrors] = useState<Partial<PrincipalFormData>>({});

  // Update local state when API data is loaded
  useEffect(() => {
    if (schoolResponse?.school) {
      const school = schoolResponse.school;

      // Parse address if it contains city/state information
      const addressParts = school.address ? school.address.split(',').map(s => s.trim()) : [];
      const city = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';
      const state = addressParts.length > 2 ? addressParts[addressParts.length - 1] : '';
      const streetAddress = addressParts.length > 2 ? addressParts.slice(0, -2).join(', ') : school.address || '';

      // Update school data
      const newSchoolData: SchoolFormData = {
        name: school.name || '',
        email: school.email || '',
        phone: school.phone || '',
        address: streetAddress,
        city: city,
        state: state,
        pincode: school.pincode || '',
        board: 'CBSE', // Default or fetch from additional field if available
        code: school.id || '',
        established: school.createdAt ? new Date(school.createdAt).getFullYear().toString() : ''
      };
      setSchoolData(newSchoolData);
      setSchoolForm(newSchoolData);

      // Update principal data
      if (school.principal) {
        const newPrincipalData: PrincipalFormData = {
          name: school.principal.name || '',
          email: school.principal.email || '',
          phone: school.principal.phone || '',
          qualification: '', // Default - should come from API
          experience: '', // Default - should come from API
          joinedDate: school.createdAt ? new Date(school.createdAt).toISOString().split('T')[0] : ''
        };
        setPrincipalData(newPrincipalData);
        setPrincipalForm(newPrincipalData);
      }

      // Update subscription data
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

  // Validation functions
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

    if (!schoolForm.name.trim()) {
      errors.name = 'School name is required';
    }

    if (!schoolForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(schoolForm.email)) {
      errors.email = 'Invalid email format';
    }

    if (schoolForm.phone && !validatePhone(schoolForm.phone)) {
      errors.phone = 'Invalid phone number';
    }

    if (schoolForm.pincode && !validatePincode(schoolForm.pincode)) {
      errors.pincode = 'Pincode must be 6 digits';
    }

    if (!schoolForm.address.trim()) {
      errors.address = 'Address is required';
    }

    setSchoolErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePrincipalForm = (): boolean => {
    const errors: Partial<PrincipalFormData> = {};

    if (!principalForm.name.trim()) {
      errors.name = 'Principal name is required';
    }

    if (!principalForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(principalForm.email)) {
      errors.email = 'Invalid email format';
    }

    if (principalForm.phone && !validatePhone(principalForm.phone)) {
      errors.phone = 'Invalid phone number';
    }

    setPrincipalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Event handlers
  const handleSchoolChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSchoolForm({ ...schoolForm, [name]: value });
    // Clear error for this field
    if (schoolErrors[name as keyof SchoolFormData]) {
      setSchoolErrors({ ...schoolErrors, [name]: undefined });
    }
  };

  const handlePrincipalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPrincipalForm({ ...principalForm, [name]: value });
    // Clear error for this field
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
      // Combine address parts for API
      const fullAddress = [
        schoolForm.address,
        schoolForm.city,
        schoolForm.state
      ].filter(Boolean).join(', ');

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

      toast.error(
        error?.message || 'Failed to update school details. Please try again.'
      );

    }
  };

  const handlePrincipalSubmit = () => {
    if (!validatePrincipalForm()) {
      toast.error('Please fix the errors in the form');

      return;
    }

    // TODO: Implement API call when endpoint is available
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

  // Loading State
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold dashboard-text mb-2">School Profile</h1>
          <p className="dashboard-text-muted">View and manage your school's information</p>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="dashboard-text-muted text-lg">Loading school profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold dashboard-text mb-2">School Profile</h1>
          <p className="dashboard-text-muted">View and manage your school's information</p>
        </div>
        <div className="dashboard-card border border-red-200 rounded-xl p-8 bg-red-50 dark:bg-red-900/20">
          <div className="flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-2">
              Failed to Load School Profile
            </h3>
            <p className="text-red-600/80 dark:text-red-400/80 mb-6 max-w-md">
              {error?.message || 'An error occurred while loading your school profile. Please try again.'}
            </p>
            <Button
              onClick={handleRetry}
              className="accent-blue text-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!schoolResponse?.school) {
    return (
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl lg:text-3xl font-bold dashboard-text mb-2">School Profile</h1>
          <p className="dashboard-text-muted">View and manage your school's information</p>
        </div>
        <div className="dashboard-card border rounded-xl p-8">
          <div className="flex flex-col items-center justify-center text-center py-12">
            <Building2 className="w-16 h-16 dashboard-text-muted mb-4" />
            <h3 className="text-xl font-semibold dashboard-text mb-2">
              No School Profile Found
            </h3>
            <p className="dashboard-text-muted max-w-md">
              Your school profile could not be found. Please contact support for assistance.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold dashboard-text mb-2">School Profile</h1>
        <p className="dashboard-text-muted">View and manage your school's information</p>
      </div>

      {/* School & Principal Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* School Information Card */}
        <div className="lg:col-span-2 dashboard-card border rounded-xl p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="accent-blue p-4 rounded-xl">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold dashboard-text">{schoolData.name || 'School Name'}</h2>
                <p className="text-sm dashboard-text-muted">
                  {schoolData.board} • Est. {schoolData.established || 'N/A'}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditSchool}
              className="dashboard-text hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Edit school details"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 accent-blue rounded-lg mt-1">
                  <Mail className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs dashboard-text-muted mb-1">Email</p>
                  <p className="text-sm dashboard-text font-medium break-all">
                    {schoolData.email || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 accent-blue rounded-lg mt-1">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs dashboard-text-muted mb-1">Phone</p>
                  <p className="text-sm dashboard-text font-medium">
                    {schoolData.phone || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 accent-blue rounded-lg mt-1">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs dashboard-text-muted mb-1">Address</p>
                  <p className="text-sm dashboard-text font-medium">
                    {schoolData.address || 'N/A'}
                  </p>
                  {(schoolData.city || schoolData.state || schoolData.pincode) && (
                    <p className="text-sm dashboard-text-muted">
                      {[schoolData.city, schoolData.state, schoolData.pincode]
                        .filter(Boolean)
                        .join(', ')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="dashboard-card border rounded-lg p-4">
                <p className="text-xs dashboard-text-muted mb-1">School Code</p>
                <p className="text-lg dashboard-text font-bold">
                  {schoolData.code || 'N/A'}
                </p>
              </div>

              <div className="dashboard-card border rounded-lg p-4">
                <p className="text-xs dashboard-text-muted mb-1">Board</p>
                <p className="text-lg dashboard-text font-bold">
                  {schoolData.board || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Principal Card */}
        <div className="dashboard-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 accent-teal rounded-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold dashboard-text">Principal</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditPrincipal}
              className="dashboard-text hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Edit principal details"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 accent-blue rounded-full flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h4 className="text-lg font-bold dashboard-text mb-1">
              {principalData.name || 'N/A'}
            </h4>
            {/* <p className="text-sm dashboard-text-muted mb-4">
              {principalData.qualification || 'N/A'}
            </p> */}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 dashboard-text-muted flex-shrink-0" />
              <span className="dashboard-text break-all">
                {principalData.email || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 dashboard-text-muted flex-shrink-0" />
              <span className="dashboard-text">
                {principalData.phone || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap className="w-4 h-4 dashboard-text-muted flex-shrink-0" />
              <span className="dashboard-text">
                {principalData.experience || 'N/A'}
              </span>
            </div>
            {principalData.joinedDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 dashboard-text-muted flex-shrink-0" />
                <span className="dashboard-text">
                  Joined {new Date(principalData.joinedDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Details */}
      <div className="dashboard-card border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 accent-green rounded-xl">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold dashboard-text">Subscription Details</h3>
              <p className="text-sm dashboard-text-muted">Manage your subscription plan</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 accent-green rounded-full">
            <Check className="w-4 h-4 text-white" />
            <span className="text-sm font-semibold text-white">
              {subscriptionData.status || 'Active'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="dashboard-card border rounded-lg p-4">
            <p className="text-xs dashboard-text-muted mb-2">Current Plan</p>
            <p className="text-xl font-bold dashboard-text">
              {subscriptionData.planId}
            </p>
            <p className="text-xs dashboard-text-muted mt-1">Premium Features</p>
          </div>

          <div className="dashboard-card border rounded-lg p-4">
            <p className="text-xs dashboard-text-muted mb-2">Students</p>
            <p className="text-xl font-bold dashboard-text">
              {subscriptionData.billableStudents}
            </p>
            {/* <p className="text-xs dashboard-text-muted mt-1">
              of {subscriptionData.maxStudents || 0} allowed
            </p> */}
          </div>

          <div className="dashboard-card border rounded-lg p-4">
            <p className="text-xs dashboard-text-muted mb-2">Amount Paid</p>
            <p className="text-xl font-bold dashboard-text">
              ₹{subscriptionData.paidAmount}
            </p>
            <p className="text-xs dashboard-text-muted mt-1">Credit Card</p>
          </div>

          <div className="dashboard-card border rounded-lg p-4">
            <p className="text-xs dashboard-text-muted mb-2">Valid Until</p>
            <p className="text-xl font-bold dashboard-text">
              {subscriptionData.endDate
                ? new Date(subscriptionData.endDate).toLocaleDateString()
                : 'N/A'}
            </p>
            {/* <p className="text-xs dashboard-text-muted mt-1">
              {subscriptionData.autoRenew ? '🔄 Auto-renew on' : 'Manual renewal'}
            </p> */}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            className="accent-blue text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity"
            onClick={() => toast('Invoice history feature coming soon')}

          >
            View Invoice History
          </button>
          <button
            className="dashboard-card border dashboard-card-border dashboard-text font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => toast('Upgrade plan feature coming soon')}

          >
            Upgrade Plan
          </button>
          <button
            className="dashboard-card border dashboard-card-border dashboard-text font-semibold py-2.5 px-6 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => toast('Billing management feature coming soon')}

          >
            Manage Billing
          </button>
        </div>
      </div>

      {/* Edit School Modal */}
      <AnimatePresence>
        {isEditSchoolOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={handleCancelSchoolEdit}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="dashboard-card border rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold dashboard-text">Edit School Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelSchoolEdit}
                  className="dashboard-text"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm dashboard-text-muted mb-2 block">
                      School Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="name"
                      value={schoolForm.name}
                      onChange={handleSchoolChange}
                      className={`dashboard-card border dashboard-card-border dashboard-text ${schoolErrors.name ? 'border-red-500' : ''
                        }`}
                      placeholder="Enter school name"
                    />
                    {schoolErrors.name && (
                      <p className="text-xs text-red-500 mt-1">{schoolErrors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm dashboard-text-muted mb-2 block">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={schoolForm.email}
                      onChange={handleSchoolChange}
                      className={`dashboard-card border dashboard-card-border dashboard-text ${schoolErrors.email ? 'border-red-500' : ''
                        }`}
                      placeholder="school@example.com"
                    />
                    {schoolErrors.email && (
                      <p className="text-xs text-red-500 mt-1">{schoolErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm dashboard-text-muted mb-2 block">Phone</label>
                    <Input
                      name="phone"
                      value={schoolForm.phone}
                      onChange={handleSchoolChange}
                      className={`dashboard-card border dashboard-card-border dashboard-text ${schoolErrors.phone ? 'border-red-500' : ''
                        }`}
                      placeholder="+91 98765 43210"
                    />
                    {schoolErrors.phone && (
                      <p className="text-xs text-red-500 mt-1">{schoolErrors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm dashboard-text-muted mb-2 block">Board</label>
                    <Input
                      name="board"
                      value={schoolForm.board}
                      onChange={handleSchoolChange}
                      className="dashboard-card border dashboard-card-border dashboard-text"
                      placeholder="CBSE"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm dashboard-text-muted mb-2 block">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="address"
                    value={schoolForm.address}
                    onChange={handleSchoolChange}
                    className={`dashboard-card border dashboard-card-border dashboard-text ${schoolErrors.address ? 'border-red-500' : ''
                      }`}
                    placeholder="123 Education Street"
                  />
                  {schoolErrors.address && (
                    <p className="text-xs text-red-500 mt-1">{schoolErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm dashboard-text-muted mb-2 block">City</label>
                    <Input
                      name="city"
                      value={schoolForm.city}
                      onChange={handleSchoolChange}
                      className="dashboard-card border dashboard-card-border dashboard-text"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="text-sm dashboard-text-muted mb-2 block">State</label>
                    <Input
                      name="state"
                      value={schoolForm.state}
                      onChange={handleSchoolChange}
                      className="dashboard-card border dashboard-card-border dashboard-text"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="text-sm dashboard-text-muted mb-2 block">Pincode</label>
                    <Input
                      name="pincode"
                      value={schoolForm.pincode}
                      onChange={handleSchoolChange}
                      className={`dashboard-card border dashboard-card-border dashboard-text ${schoolErrors.pincode ? 'border-red-500' : ''
                        }`}
                      placeholder="400001"
                    />
                    {schoolErrors.pincode && (
                      <p className="text-xs text-red-500 mt-1">{schoolErrors.pincode}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm dashboard-text-muted mb-2 block">Established Year</label>
                    <Input
                      name="established"
                      value={schoolForm.established}
                      onChange={handleSchoolChange}
                      className="dashboard-card border dashboard-card-border dashboard-text"
                      placeholder="1985"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancelSchoolEdit}
                  className="flex-1 dashboard-card border dashboard-card-border dashboard-text"
                  disabled={updateSchoolMutation.isPending}
                >
                  Cancel
                </Button>
                <button
                  onClick={handleSchoolSubmit}
                  disabled={updateSchoolMutation.isPending}
                  className="flex-1 accent-blue text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

      {/* Edit Principal Modal */}
      <AnimatePresence>
        {isEditPrincipalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={handleCancelPrincipalEdit}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="dashboard-card border rounded-xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold dashboard-text">Edit Principal Details</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelPrincipalEdit}
                  className="dashboard-text"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm dashboard-text-muted mb-2 block">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="name"
                    value={principalForm.name}
                    onChange={handlePrincipalChange}
                    className={`dashboard-card border dashboard-card-border dashboard-text ${principalErrors.name ? 'border-red-500' : ''
                      }`}
                    placeholder="Dr. John Smith"
                  />
                  {principalErrors.name && (
                    <p className="text-xs text-red-500 mt-1">{principalErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm dashboard-text-muted mb-2 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={principalForm.email}
                    onChange={handlePrincipalChange}
                    className={`dashboard-card border dashboard-card-border dashboard-text ${principalErrors.email ? 'border-red-500' : ''
                      }`}
                    placeholder="principal@school.edu"
                  />
                  {principalErrors.email && (
                    <p className="text-xs text-red-500 mt-1">{principalErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm dashboard-text-muted mb-2 block">Phone</label>
                  <Input
                    name="phone"
                    value={principalForm.phone}
                    onChange={handlePrincipalChange}
                    className={`dashboard-card border dashboard-card-border dashboard-text ${principalErrors.phone ? 'border-red-500' : ''
                      }`}
                    placeholder="+91 98765 43211"
                  />
                  {principalErrors.phone && (
                    <p className="text-xs text-red-500 mt-1">{principalErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm dashboard-text-muted mb-2 block">Qualification</label>
                  <Input
                    name="qualification"
                    value={principalForm.qualification}
                    onChange={handlePrincipalChange}
                    className="dashboard-card border dashboard-card-border dashboard-text"
                    placeholder="Ph.D. in Education"
                  />
                </div>

                <div>
                  <label className="text-sm dashboard-text-muted mb-2 block">Experience</label>
                  <Input
                    name="experience"
                    value={principalForm.experience}
                    onChange={handlePrincipalChange}
                    className="dashboard-card border dashboard-card-border dashboard-text"
                    placeholder="25 years"
                  />
                </div>

                <div>
                  <label className="text-sm dashboard-text-muted mb-2 block">Joined Date</label>
                  <Input
                    name="joinedDate"
                    type="date"
                    value={principalForm.joinedDate}
                    onChange={handlePrincipalChange}
                    className="dashboard-card border dashboard-card-border dashboard-text"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  onClick={handleCancelPrincipalEdit}
                  className="flex-1 dashboard-card border dashboard-card-border dashboard-text"
                >
                  Cancel
                </Button>
                <button
                  onClick={handlePrincipalSubmit}
                  className="flex-1 accent-blue text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
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