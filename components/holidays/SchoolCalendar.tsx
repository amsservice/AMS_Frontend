"use client";

import { useMemo, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CalendarCheck,
  AlertCircle,
  Clock
} from "lucide-react";
import { useHolidays, Holiday } from "@/app/querry/useHolidays";
import {
  HOLIDAY_CATEGORIES
} from "@/lib/holiday.constants";

/* ===============================
   HELPERS
================================ */
const normalizeDate = (date: string | Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

export default function SchoolCalendar() {
  const { data: holidays = [] } = useHolidays();

  const today = new Date();
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(normalizeDate(today));

  /* ===============================
     MONTH NAVIGATION
  =============================== */
  const prevMonth = () =>
    setMonth((m) => (m === 0 ? (setYear(y => y - 1), 11) : m - 1));

  const nextMonth = () =>
    setMonth((m) => (m === 11 ? (setYear(y => y + 1), 0) : m + 1));

  /* ===============================
     FILTER MONTH HOLIDAYS
  =============================== */
  const monthHolidays = useMemo(() => {
    return holidays.filter((h) => {
      const [y, m] = normalizeDate(h.date).split("-").map(Number);
      return y === year && m === month + 1;
    });
  }, [holidays, year, month]);

  const holidayMap = useMemo(() => {
    const map = new Map<string, Holiday>();
    monthHolidays.forEach((h) =>
      map.set(normalizeDate(h.date), h)
    );
    return map;
  }, [monthHolidays]);

  /* ===============================
     CALENDAR GRID
  =============================== */
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const calendarCells = Array.from({ length: 42 }, (_, i) => {
    const day = i - startDay + 1;
    if (day < 1 || day > daysInMonth) return null;

    const dateKey = normalizeDate(new Date(year, month, day));
    return {
      day,
      dateKey,
      holiday: holidayMap.get(dateKey)
    };
  });

  const selectedHoliday = holidayMap.get(selectedDate);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
              <CalendarIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                School Calendar
              </h2>
            </div>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 ml-0 sm:ml-[52px]">
            View school events, holidays, and important dates
          </p>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4 sm:gap-6 lg:gap-8">
          
          {/* ================= LEFT CALENDAR ================= */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 sm:p-6 h-fit">
            {/* Month Nav */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={prevMonth}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-900 dark:text-white transform hover:scale-110"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-bold text-lg text-gray-900 dark:text-white">
                {new Date(year, month).toLocaleString("default", {
                  month: "long",
                  year: "numeric"
                })}
              </span>

              <button
                onClick={nextMonth}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 text-gray-900 dark:text-white transform hover:scale-110"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((cell, i) =>
                cell ? (
                  <button
                    key={i}
                    onClick={() => setSelectedDate(cell.dateKey)}
                    className={`
                      h-10 w-full rounded-xl text-sm font-medium flex items-center justify-center
                      transition-all duration-200 transform hover:scale-105
                      ${
                        cell.dateKey === selectedDate
                          ? "bg-gradient-to-br from-teal-500 to-cyan-600 text-white shadow-lg"
                          : cell.holiday
                          ? "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50"
                          : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                      }
                    `}
                  >
                    {cell.day}
                  </button>
                ) : (
                  <div key={i} />
                )
              )}
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="space-y-4 sm:space-y-6">
            {/* Selected Day */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                  <CalendarCheck className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  {new Date(selectedDate).toLocaleDateString("default", {
                    weekday: "long",
                    month: "long",
                    day: "numeric"
                  })}
                </h3>
              </div>

              {selectedHoliday ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/50 dark:border-blue-800/50 shadow-md">
                  <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg mt-0.5">
                    <CalendarCheck className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-blue-700 dark:text-blue-300 mb-1 text-base">
                      {selectedHoliday.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {HOLIDAY_CATEGORIES[selectedHoliday.category]}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50">
                  <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No events scheduled for this day
                  </p>
                </div>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  Upcoming Holidays
                </h4>
              </div>

              {monthHolidays.length > 0 ? (
                <div className="space-y-3">
                  {monthHolidays.map((h) => (
                    <div
                      key={h._id}
                      className="group flex items-center justify-between p-4 border border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-lg group-hover:scale-110 transition-transform">
                          <CalendarIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {h.name}
                        </span>
                      </div>
                      <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 shadow-sm">
                        {new Date(h.date).toLocaleDateString("default", {
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50">
                  <AlertCircle className="w-5 h-5 text-gray-400 dark:text-gray-500 mt-0.5" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    No upcoming events this month
                  </p>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                  Legend
                </h4>
              </div>
              <div className="flex flex-wrap gap-4 lg:gap-6 text-sm">
                <span className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-800 shadow-sm" />
                  Event
                </span>
                <span className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/30 dark:to-rose-900/30 border-2 border-red-200 dark:border-red-800 shadow-sm" />
                  Holiday
                </span>
                <span className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-2 border-amber-200 dark:border-amber-800 shadow-sm" />
                  Alert
                </span>
                <span className="flex items-center gap-2 text-gray-900 dark:text-white font-medium">
                  <span className="w-3 h-3 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 shadow-sm" />
                  Present
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}