





'use client';

import { useState } from 'react';
import { Calendar, Pencil, Plus, X } from 'lucide-react';
import { useHolidays, useCreateHoliday, useUpdateHoliday, useDeleteHoliday, Holiday } from '@/app/querry/useHolidays';
import { useSessions } from '@/app/querry/useSessions';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CATEGORY_COLORS,
  HOLIDAY_CATEGORIES,
  HolidayCategory
} from '@/lib/holiday.constants';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleSubmit = () => {
    // Check if there's an active session
    const hasActive = sessions.some((s: any) => s.isActive);
    if (!hasActive) {
      toast.error('No active session found. Please create or activate a session first.');
      return;
    }

    // Validate holiday name
    if (!form.name.trim()) {
      toast.error('Please enter a holiday name');
      return;
    }

    // Single mode
    if (form.mode === 'single') {
      if (!form.startDate) {
        toast.error('Please select a date for the holiday');
        return;
      }

      const formDate = new Date(form.startDate).toDateString();
      const exists = holidays.some((h: any) => new Date(h.date).toDateString() === formDate);
      if (exists) {
        toast.error('A holiday already exists on this date');
        return;
      }

      const toastId = toast.loading('Adding holiday...');

      createHoliday(
        {
          name: form.name,
          date: form.startDate,
          category: form.category,
          description: form.description
        } as any,
        {
          onSuccess: () => {
            toast.dismiss(toastId);
            toast.success('Holiday added successfully!');
            // Reset form
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
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to add holiday';
            
            if (errorMessage.includes('No active session') || errorMessage.includes('session')) {
              toast.error('No active session found. Please create or activate a session first.');
            } else if (errorMessage.includes('already exists')) {
              toast.error('A holiday already exists on this date');
            } else {
              toast.error(errorMessage);
            }
          }
        }
      );
      return;
    }

    // Range mode -> create a holiday for each date in range
    if (form.mode === 'range') {
      if (!form.startDate || !form.endDate) {
        toast.error('Please select both start and end dates for the range');
        return;
      }

      const start = new Date(form.startDate);
      const end = new Date(form.endDate!);
      if (start > end) {
        toast.error('Start date must be before or equal to end date');
        return;
      }

      // collect dates in range and check conflicts first
      const dates: string[] = [];
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d).toISOString().split('T')[0]);
      }

      const conflict = dates.find((dt) =>
        holidays.some((h: any) => new Date(h.date).toDateString() === new Date(dt).toDateString())
      );
      if (conflict) {
        toast.error(`A holiday already exists on ${new Date(conflict).toDateString()}`);
        return;
      }

      const toastId = toast.loading(`Adding ${dates.length} holidays...`);
      let successCount = 0;
      let errorCount = 0;

      // Create holidays for each date
      dates.forEach((dt, index) => {
        createHoliday(
          {
            name: form.name,
            date: dt,
            category: form.category,
            description: form.description
          } as any,
          {
            onSuccess: () => {
              successCount++;
              // If this is the last one
              if (index === dates.length - 1) {
                toast.dismiss(toastId);
                if (errorCount === 0) {
                  toast.success(`${successCount} holidays added successfully!`);
                } else {
                  toast.warning(`${successCount} holidays added, ${errorCount} failed`);
                }
                // Reset form
                setForm({
                  name: '',
                  startDate: '',
                  endDate: '',
                  mode: 'single',
                  category: 'SCHOOL',
                  description: ''
                });
              }
            },
            onError: (error: any) => {
              errorCount++;
              // If this is the last one
              if (index === dates.length - 1) {
                toast.dismiss(toastId);
                const errorMessage = error?.response?.data?.message || error?.message;
                
                if (errorMessage?.includes('No active session') || errorMessage?.includes('session')) {
                  toast.error('No active session found. Please create or activate a session first.');
                } else if (successCount > 0) {
                  toast.warning(`${successCount} holidays added, ${errorCount} failed`);
                } else {
                  toast.error(errorMessage || 'Failed to add holidays');
                }
              }
            }
          }
        );
      });
    }
  };

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="p-2 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl shadow-lg">
          <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
        </div>
        <div>
          <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
            Add New Holiday
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Create a new holiday entry
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Holiday name"
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </Label>

          {form.mode === 'single' ? (
            <Input
              type="date"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
            />
          ) : (
            <div className="flex gap-2">
              <Input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                placeholder="Start date"
                className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
              />
              <Input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                placeholder="End date"
                className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={form.mode === 'single'}
                onChange={() => setForm({ ...form, mode: 'single', endDate: '' })}
                className="text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Single</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="mode"
                checked={form.mode === 'range'}
                onChange={() => setForm({ ...form, mode: 'range' })}
                className="text-teal-600 focus:ring-teal-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Range</span>
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </Label>
          <select
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-2.5 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            value={form.category}
            onChange={(e) =>
              setForm({
                ...form,
                category: e.target.value as HolidayCategory
              })
            }
          >
            {Object.entries(HOLIDAY_CATEGORIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Description
          </Label>
          <Input
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value
              })
            }
            placeholder="Optional description"
            className="w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-6 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-teal-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
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
  );
}