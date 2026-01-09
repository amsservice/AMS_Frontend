'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Holiday,
  useUpdateHoliday,
  useDeleteHoliday
} from '@/app/querry/useHolidays';

import {
  HolidayCategory,
  HOLIDAY_CATEGORIES
} from '@/lib/holiday.constants';

import ConfirmDialog from '@/components/holidays/ConfirmDialog';




interface EditHolidayFormState {
  name: string;
  date: string;
  category: HolidayCategory;
  description?: string;
}

export default function EditHolidayModal({
  holiday,
  onClose
}: {
  holiday: Holiday;
  onClose: () => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isPastHoliday = new Date(holiday.date).getTime() < today.getTime();

  const [form, setForm] = useState<EditHolidayFormState>({
    name: holiday.name,
    date: holiday.date.split('T')[0],
    category: holiday.category,
    description: holiday.description || ''
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { mutate: updateHoliday } = useUpdateHoliday();
  const { mutate: deleteHoliday } = useDeleteHoliday();

  const handleSave = () => {
    if (isPastHoliday) return;
    updateHoliday({ id: holiday._id, data: form }, { onSuccess: onClose });
  };

  const handleDelete = () => {
    deleteHoliday(holiday._id, { onSuccess: onClose });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="dashboard-card border rounded-xl w-full max-w-lg p-6 relative"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 dashboard-text" />
          </button>

          <h2 className="text-xl font-bold dashboard-text mb-4">
            Edit Holiday
          </h2>

          {isPastHoliday && (
            <p className="text-sm text-red-600 dark:text-red-400 mb-4">
              Past holidays cannot be edited.
            </p>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="dashboard-text-muted">Name</Label>
              <Input
                value={form.name}
                disabled={isPastHoliday}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="dashboard-card border dashboard-card-border dashboard-text"
              />
            </div>

            <div className="space-y-2">
              <Label className="dashboard-text-muted">Date</Label>
              <Input
                type="date"
                value={form.date}
                disabled={isPastHoliday}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="dashboard-card border dashboard-card-border dashboard-text"
              />
            </div>

            <div className="space-y-2">
              <Label className="dashboard-text-muted">Category</Label>
              <select
                className="w-full dashboard-card border dashboard-card-border p-2 rounded-lg dashboard-text"
                disabled={isPastHoliday}
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
              <Label className="dashboard-text-muted">Description</Label>
              <Input
                value={form.description}
                disabled={isPastHoliday}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value
                  })
                }
                className="dashboard-card border dashboard-card-border dashboard-text"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                className="accent-teal text-white font-semibold py-2.5 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                disabled={isPastHoliday}
                onClick={handleSave}
              >
                Save
              </button>

              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete
              </Button>

              <Button
                variant="outline"
                onClick={onClose}
                className="dashboard-card border dashboard-card-border dashboard-text"
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="dashboard-card border rounded-xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold dashboard-text mb-2">Delete Holiday</h2>
            <p className="text-sm dashboard-text-muted mb-6">
              Are you sure you want to delete this holiday? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                className="dashboard-card border dashboard-card-border dashboard-text"
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}