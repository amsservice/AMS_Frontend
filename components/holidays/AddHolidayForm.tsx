'use client';

import { useState } from 'react';
import { Plus, Calendar, CalendarRange } from 'lucide-react';
import {
  useHolidays,
  useCreateHoliday
} from '@/app/querry/useHolidays';
import { useSessions } from '@/app/querry/useSessions';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  HOLIDAY_CATEGORIES,
  HolidayCategory
} from '@/lib/holiday.constants';

/* ================= ADD HOLIDAY FORM ================= */
interface AddHolidayFormState {
  name: string;
  startDate: string;
  endDate?: string;
  mode: 'single' | 'range';
  category: HolidayCategory;
  description?: string;
}

export default function AddHolidayForm() {
  const [form, setForm] = useState<AddHolidayFormState>({
    name: '',
    startDate: '',
    endDate: '',
    mode: 'single',
    category: 'SCHOOL',
    description: ''
  });

  const { data: holidays = [] } = useHolidays();
  const { data: sessions = [] } = useSessions();
  const { mutate: createHoliday, isPending } = useCreateHoliday();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleSubmit = () => {
    /* ---------- ACTIVE SESSION CHECK ---------- */
    const hasActive = sessions.some((s: any) => s.isActive);
    if (!hasActive) {
      toast.error(
        'No active session found. Please create or activate a session first.'
      );
      return;
    }

    /* ---------- BASIC VALIDATION ---------- */
    const trimmedName = form.name.trim();
    if (!/^[A-Za-z0-9\s]+$/.test(trimmedName)) {
      toast.error('Holiday name can contain only letters, numbers, and spaces');
      return;
    }

    const lettersCount = (trimmedName.match(/[A-Za-z]/g) || []).length;
    if (lettersCount < 3) {
      toast.error('Holiday name must contain at least 3 letters');
      return;
    }

    if (!form.startDate) {
      toast.error(
        form.mode === 'single'
          ? 'Please select a date for the holiday'
          : 'Please select start and end dates for the range'
      );
      return;
    }

    const start = new Date(form.startDate);
    start.setHours(0, 0, 0, 0);
    if (start.getTime() <= today.getTime()) {
      toast.error('Holiday can be marked only on future dates');
      return;
    }

    if (form.mode === 'range' && !form.endDate) {
      toast.error('Please select both start and end dates for the range');
      return;
    }

    if (
      form.mode === 'range' &&
      new Date(form.startDate) > new Date(form.endDate!)
    ) {
      toast.error('Start date must be before or equal to end date');
      return;
    }

    if (form.mode === 'range' && form.endDate) {
      const end = new Date(form.endDate);
      end.setHours(0, 0, 0, 0);
      if (end.getTime() <= today.getTime()) {
        toast.error('Holiday can be marked only on future dates');
        return;
      }
    }

    /* ---------- API CALL ---------- */
    const toastId = toast.loading(
      form.mode === 'single'
        ? 'Adding holiday...'
        : 'Adding holiday range...'
    );

    createHoliday(
      {
        name: trimmedName,
        startDate: form.startDate,
        endDate: form.mode === 'range' ? form.endDate : undefined,
        category: form.category,
        description: form.description
      },
      {
        onSuccess: () => {
          toast.dismiss(toastId);
          toast.success(
            form.mode === 'single'
              ? 'Holiday added successfully!'
              : 'Holiday range added successfully!'
          );

          setForm({
            name: '',
            startDate: '',
            endDate: '',
            mode: 'single',
            category: 'SCHOOL',
            description: ''
          });
        },
        onError: (error: any) => {
          toast.dismiss(toastId);

          const errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Failed to add holiday';

          if (
            errorMessage.includes('No active session') ||
            errorMessage.includes('session')
          ) {
            toast.error(
              'No active session found. Please create or activate a session first.'
            );
          } else if (errorMessage.includes('overlap')) {
            toast.error('Holiday dates overlap with an existing holiday');
          } else {
            toast.error(errorMessage);
          }
        }
      }
    );
  };

  // Shared input className for consistency
  const inputClassName = "h-12 w-full bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 px-4 py-2.5 rounded-xl text-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 outline-none transition-all";

  const labelClassName = "block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2";

  return (
    <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 px-6 py-5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
        <div className="relative flex items-center gap-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm shadow-lg">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Add New Holiday
            </h3>
            <p className="text-sm text-blue-100">
              Create a new holiday entry for the school calendar
            </p>
          </div>
        </div>
      </div>

      {/* Mode Selection Tabs */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex gap-3">
          <button
            onClick={() => setForm({ ...form, mode: 'single', endDate: '' })}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              form.mode === 'single'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Single Day Holiday
          </button>
          <button
            onClick={() => setForm({ ...form, mode: 'range' })}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
              form.mode === 'range'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <CalendarRange className="w-4 h-4" />
            Holiday Range
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        {form.mode === 'single' ? (
          /* SINGLE DAY FORM */
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Holiday Name */}
              <div>
                <label className={labelClassName}>
                  Holiday Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g., Independence Day"
                  className={inputClassName}
                />
              </div>

              {/* Date */}
              <div>
                <label className={labelClassName}>
                  Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  min={minDate}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category */}
              <div>
                <label className={labelClassName}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  className={inputClassName}
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as HolidayCategory
                    })
                  }
                >
                  {Object.entries(HOLIDAY_CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className={labelClassName}>
                  Description (Optional)
                </label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value
                    })
                  }
                  placeholder="Add details about this holiday"
                  className={inputClassName}
                />
              </div>
            </div>
          </div>
        ) : (
          /* RANGE FORM */
          <div className="space-y-5">
            <div>
              <label className={labelClassName}>
                Holiday Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g., Winter Break"
                className={inputClassName}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Start Date */}
              <div>
                <label className={labelClassName}>
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  min={minDate}
                  className={inputClassName}
                />
              </div>

              {/* End Date */}
              <div>
                <label className={labelClassName}>
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  min={minDate}
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Category */}
              <div>
                <label className={labelClassName}>
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  className={inputClassName}
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value as HolidayCategory
                    })
                  }
                >
                  {Object.entries(HOLIDAY_CATEGORIES).map(([key, label]) => (
                    <option key={key} value={key} className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className={labelClassName}>
                  Description (Optional)
                </label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value
                    })
                  }
                  placeholder="Add details about this holiday range"
                  className={inputClassName}
                />
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl min-w-[160px]"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add Holiday
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}