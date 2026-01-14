'use client';

import { useState } from 'react';
import { Calendar, Pencil, Plus, X } from 'lucide-react';
import { useHolidays, useCreateHoliday, useUpdateHoliday, useDeleteHoliday, Holiday } from '@/app/querry/useHolidays';
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
  date: string;
  category: HolidayCategory;
  description?: string;
}

export default function AddHolidayForm() {
  const [form, setForm] = useState<AddHolidayFormState>({
    name: '',
    date: '',
    category: 'SCHOOL',
    description: ''
  });

  const { mutate: createHoliday, isPending } = useCreateHoliday();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createHoliday(form);
    setForm({
      name: '',
      date: '',
      category: 'SCHOOL',
      description: ''
    });
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
            required
            placeholder="Holiday name"
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </Label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            Category
          </Label>
          <select
            className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
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
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-6 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-br from-teal-600 to-cyan-600 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Add Holiday
      </button>
    </div>
  );
}