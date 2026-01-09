


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
    <div className="dashboard-card border rounded-xl p-4 lg:p-6 mb-4 lg:mb-6">
      <h3 className="text-base lg:text-xl font-semibold dashboard-text mb-1">
        Add New Holiday
      </h3>
      <p className="text-xs lg:text-sm dashboard-text-muted mb-4 lg:mb-6">
        Create a new holiday entry
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label className="text-xs lg:text-sm dashboard-text-muted">Name</Label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="dashboard-card border dashboard-card-border dashboard-text"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs lg:text-sm dashboard-text-muted">Date</Label>
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            required
            className="dashboard-card border dashboard-card-border dashboard-text"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs lg:text-sm dashboard-text-muted">Category</Label>
          <select
            className="w-full dashboard-card border dashboard-card-border p-2 rounded-lg dashboard-text"
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
          <Label className="text-xs lg:text-sm dashboard-text-muted">Description</Label>
          <Input
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value
              })
            }
            className="dashboard-card border dashboard-card-border dashboard-text"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="mt-4 accent-teal text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Plus className="w-4 h-4 inline mr-2" />
        Add Holiday
      </button>
    </div>
  );
}