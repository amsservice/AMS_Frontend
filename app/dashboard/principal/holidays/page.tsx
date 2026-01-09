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
    <div className="space-y-4 lg:space-y-6">
      {/* Welcome Section */}
      <div className="hidden lg:block">
        <h2 className="text-2xl font-bold dashboard-text mb-1">
          Holiday Management 📅
        </h2>
        <p className="text-sm dashboard-text-muted">
          Manage school holidays and events
        </p>
      </div>

      {/* Mobile Welcome Section */}
      <div className="lg:hidden">
        <h2 className="text-xl font-bold dashboard-text mb-1">
          Holiday Management 📅
        </h2>
        <p className="text-sm dashboard-text-muted">
          Manage school holidays and events
        </p>
      </div>

      {/* ADD FORM */}
      <AddHolidayForm />

      {/* FILTER */}
      <div className="dashboard-card border rounded-xl p-4 lg:p-6">
        <h3 className="text-base lg:text-xl font-semibold dashboard-text mb-4">
          Filter Holidays
        </h3>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'ALL'
                ? 'accent-blue text-white'
                : 'dashboard-card border dashboard-card-border dashboard-text hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All
          </button>
          {Object.entries(HOLIDAY_CATEGORIES).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setFilter(k as HolidayCategory)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === k
                  ? 'accent-blue text-white'
                  : 'dashboard-card border dashboard-card-border dashboard-text hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-full dashboard-card border rounded-xl p-8 text-center">
            <Calendar className="w-12 h-12 mx-auto mb-3 dashboard-text-muted opacity-50" />
            <p className="dashboard-text-muted">No holidays found</p>
          </div>
        ) : (
          filtered.map((h) => (
            <motion.div
              key={h._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`dashboard-card border rounded-xl p-4 lg:p-5 hover:shadow-lg transition-shadow ${CATEGORY_COLORS[h.category]}`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold dashboard-text text-base lg:text-lg mb-1">
                    {h.name}
                  </h3>
                  <p className="text-xs lg:text-sm dashboard-text-muted">
                    {new Date(h.date).toDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setEditing(h)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4 dashboard-text" />
                </button>
              </div>

              {h.description && (
                <p className="text-sm dashboard-text-muted mt-2 border-t dashboard-card-border pt-2">
                  {h.description}
                </p>
              )}

              <div className="mt-3 inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 dashboard-text">
                {HOLIDAY_CATEGORIES[h.category]}
              </div>
            </motion.div>
          ))
        )}
      </div>

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