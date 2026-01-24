'use client';

import { useState } from 'react';
import { Calendar, Pencil, Trash2 } from 'lucide-react';

import { Toaster } from '@/components/ui/sonner';

import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api';
import { useHolidays, useDeleteHoliday } from '@/app/querry/useHolidays'; // PGhosal 13th
import { useSessions } from '@/app/querry/useSessions';
import AddHolidayForm from '@/components/holidays/AddHolidayForm';
import EditHolidayModal from '@/components/holidays/EditHolidaModal';
import SchoolCalendar from "@/components/holidays/SchoolCalendar";

import ConfirmDialog from '@/components/holidays/ConfirmDialog'; // PGhosal 13th
import { motion, AnimatePresence } from 'framer-motion';
import {
  CATEGORY_COLORS,
  HOLIDAY_CATEGORIES,
  HolidayCategory
} from '@/lib/holiday.constants';

export default function HolidayPage() {
  const queryClient = useQueryClient();
  const { data: holidays = [] } = useHolidays();
  const { data: sessions = [] } = useSessions();
  // PGhosal 13th
  const { mutate: deleteHoliday } = useDeleteHoliday();

  const [editing, setEditing] = useState<any>(null);
  const [deleting, setDeleting] = useState<any>(null); // PGhosal 13th
  const [filter, setFilter] = useState<'ALL' | HolidayCategory>('ALL');

  const filtered =
    filter === 'ALL'
      ? holidays
      : holidays.filter((h) => h.category === filter);

  const normalizeDateKey = (iso: string) => {
    const d = new Date(iso);
    d.setHours(0, 0, 0, 0);
    return d.toISOString().slice(0, 10);
  };

  const handleMarkAllSundays = async () => {
    const activeSession = (sessions as any[]).find((s) => s?.isActive);
    if (!activeSession) {
      toast.error('No active session found. Please create or activate a session first.');
      return;
    }

    const sessionStart = new Date(activeSession.startDate);
    const sessionEnd = new Date(activeSession.endDate);
    if (!Number.isFinite(sessionStart.getTime()) || !Number.isFinite(sessionEnd.getTime())) {
      toast.error('Active session dates are invalid.');
      return;
    }

    sessionStart.setHours(0, 0, 0, 0);
    sessionEnd.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const from = new Date(Math.max(today.getTime() + 24 * 60 * 60 * 1000, sessionStart.getTime()));
    from.setHours(0, 0, 0, 0);

    if (from.getTime() > sessionEnd.getTime()) {
      toast.error('No upcoming dates available in the active session.');
      return;
    }

    const existingDateKeys = new Set((holidays as any[]).map((h) => normalizeDateKey(h.startDate)));

    const sundays: string[] = [];
    const cursor = new Date(from);
    while (cursor.getTime() <= sessionEnd.getTime()) {
      if (cursor.getDay() === 0) {
        const key = cursor.toISOString().slice(0, 10);
        if (!existingDateKeys.has(key)) sundays.push(key);
      }
      cursor.setDate(cursor.getDate() + 1);
    }

    if (sundays.length === 0) {
      toast.error('All upcoming Sundays are already marked as holidays.');
      return;
    }

    const toastId = toast.loading('Marking all Sundays...');
    try {
      const requests = sundays.map((date) =>
        apiFetch('/api/holidays', {
          method: 'POST',
          body: JSON.stringify({
            name: 'Sunday',
            startDate: date,
            category: 'SCHOOL',
            description: 'Weekly holiday'
          })
        })
      );

      const results = await Promise.allSettled(requests);
      const successCount = results.filter((r) => r.status === 'fulfilled').length;
      const failedCount = results.length - successCount;

      await queryClient.invalidateQueries({ queryKey: ['holidays'] });
      await queryClient.refetchQueries({ queryKey: ['holidays'] });

      toast.dismiss(toastId);
      if (failedCount === 0) {
        toast.success(`Marked ${successCount} Sunday(s) successfully!`);
      } else {
        toast.error(`Marked ${successCount} Sunday(s). Failed: ${failedCount}.`);
      }
    } catch (error: any) {
      toast.dismiss(toastId);
      const msg = error?.response?.data?.message || error?.message || 'Failed to mark Sundays';
      toast.error(msg);
    }
  };

  // PGhosal 13th
  const handleConfirmDelete = () => {
    if (deleting) {
      deleteHoliday(deleting._id);
      setDeleting(null);
    }
  };
  const formatHolidayDate = (h: any) => {
    if (!h.endDate || h.startDate === h.endDate) {
      return new Date(h.startDate).toDateString();
    }

    return `${new Date(h.startDate).toDateString()} → ${new Date(
      h.endDate
    ).toDateString()}`;
  };


  return (
    <div className="relative bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-900 dark:via-gray-900 dark:to-blue-950 overflow-hidden min-h-screen">
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Holiday Management
            </h1>
            <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
              Manage school holidays and events
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          <AddHolidayForm />

          {/* FILTER */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
            {/* ... existing filter code ... */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
                    Filter Holidays
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Filter by category to view specific types
                  </p>
                </div>
              </div>

              <button
                onClick={handleMarkAllSundays}
                className="px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm bg-gradient-to-br from-indigo-600 to-blue-600 text-white hover:opacity-90"
              >
                Mark All Sundays
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-sm ${filter === 'ALL'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg'
                  : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                  }`}
              >
                All
              </button>
              {Object.entries(HOLIDAY_CATEGORIES).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setFilter(k as HolidayCategory)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-sm ${filter === k
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600'
                    }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* LIST */}
          {filtered.length === 0 ? (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600 opacity-50" />
              <p className="text-gray-600 dark:text-gray-400">No holidays found</p>
            </div>
          ) : (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[520px] overflow-y-auto">
                {filtered.map((h) => (
                  <div key={h._id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-gray-900 dark:text-white truncate">{h.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${CATEGORY_COLORS[h.category]}`}>
                          {HOLIDAY_CATEGORIES[h.category]}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatHolidayDate(h)}</span>
                      </div>
                      {h.description && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {h.description}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditing(h)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 shadow-sm"
                      >
                        <Pencil className="w-4 h-4 text-gray-900 dark:text-white" />
                      </button>
                      <button
                        onClick={() => setDeleting(h)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 shadow-sm"
                      >
                        <Trash2 className="w-4 h-4 text-gray-900 dark:text-white" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative">
            <SchoolCalendar />
          </div>
        </div>
      </main>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {editing && (
          <EditHolidayModal
            holiday={editing}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>

      {/* DELETE CONFIGURATION */}
      {deleting && (
        <ConfirmDialog
          title="Delete Holiday"
          message={`Are you sure you want to delete "${deleting.name}"? This action cannot be undone.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}


