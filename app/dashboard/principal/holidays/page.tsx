'use client';

import { useState } from 'react';
import { Calendar, Pencil } from 'lucide-react';
import { useHolidays } from '@/app/querry/useHolidays';
import AddHolidayForm from '@/components/holidays/AddHolidayForm';
import EditHolidayModal from '@/components/holidays/EditHolidaModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CATEGORY_COLORS,
  HOLIDAY_CATEGORIES,
  HolidayCategory
} from '@/lib/holiday.constants';

export default function HolidayPage() {
  const { data: holidays = [] } = useHolidays();
  const [editing, setEditing] = useState<any>(null);
  const [filter, setFilter] = useState<'ALL' | HolidayCategory>('ALL');

  const filtered =
    filter === 'ALL'
      ? holidays
      : holidays.filter((h) => h.category === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Modern Header with Gradient */}
      <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Holiday Management 📅
            </h1>
            <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
              Manage school holidays and events
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8">
          {/* ADD FORM */}
          <AddHolidayForm />

          {/* FILTER */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
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
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-sm ${
                  filter === 'ALL'
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
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-sm ${
                    filter === k
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filtered.length === 0 ? (
              <div className="col-span-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600 opacity-50" />
                <p className="text-gray-600 dark:text-gray-400">No holidays found</p>
              </div>
            ) : (
              filtered.map((h) => (
                <motion.div
                  key={h._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-5 transition-all duration-300 transform hover:-translate-y-1 ${CATEGORY_COLORS[h.category]}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white text-base lg:text-lg mb-1">
                        {h.name}
                      </h3>
                      <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {new Date(h.date).toDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setEditing(h)}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 transform hover:scale-110 shadow-sm"
                    >
                      <Pencil className="w-4 h-4 text-gray-900 dark:text-white" />
                    </button>
                  </div>

                  {h.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50">
                      {h.description}
                    </p>
                  )}

                  <div className="mt-3 inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white shadow-sm">
                    {HOLIDAY_CATEGORIES[h.category]}
                  </div>
                </motion.div>
              ))
            )}
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
    </div>
  );
}