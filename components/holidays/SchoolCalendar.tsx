



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
    <div className="w-full  min-h-screen p-4 lg:p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* ================= HEADER ================= */}
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold dashboard-text flex items-center gap-3 mb-2">
            <div className="p-2 accent-blue rounded-xl">
              <CalendarIcon className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            School Calendar
          </h2>
          <p className="text-sm lg:text-base dashboard-text-muted ml-0 lg:ml-[52px]">
            View school events, holidays, and important dates
          </p>
        </div>

        {/* ================= MAIN GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 lg:gap-8">
          
          {/* ================= LEFT CALENDAR ================= */}
          <div className="dashboard-card border rounded-2xl p-5 lg:p-6 h-fit">
            {/* Month Nav */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dashboard-text"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="font-semibold text-lg dashboard-text">
                {new Date(year, month).toLocaleString("default", {
                  month: "long",
                  year: "numeric"
                })}
              </span>

              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors dashboard-text"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-2 mb-3">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-xs font-medium dashboard-text-muted py-2">
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
                      h-10 w-full rounded-lg text-sm font-medium flex items-center justify-center
                      transition-all duration-200
                      ${
                        cell.dateKey === selectedDate
                          ? "accent-teal text-white shadow-md"
                          : cell.holiday
                          ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                          : "dashboard-text hover:bg-gray-100 dark:hover:bg-gray-800"
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
          <div className="space-y-6">
            {/* Selected Day */}
            <div className="dashboard-card border rounded-2xl p-5 lg:p-6">
              <h3 className="text-lg lg:text-xl font-bold dashboard-text mb-4">
                {new Date(selectedDate).toLocaleDateString("default", {
                  weekday: "long",
                  month: "long",
                  day: "numeric"
                })}
              </h3>

              {selectedHoliday ? (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="p-2 accent-blue rounded-lg mt-0.5">
                    <CalendarCheck className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-blue-700 dark:text-blue-300 mb-1">
                      {selectedHoliday.name}
                    </div>
                    <div className="text-sm dashboard-text-muted">
                      {HOLIDAY_CATEGORIES[selectedHoliday.category]}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm dashboard-text-muted py-4">
                  No events scheduled for this day
                </p>
              )}
            </div>

            {/* Upcoming Events */}
            <div className="dashboard-card border rounded-2xl p-5 lg:p-6">
              <h4 className="text-lg font-bold dashboard-text mb-4">
                Upcoming Events
              </h4>

              {monthHolidays.length > 0 ? (
                <div className="space-y-3">
                  {monthHolidays.map((h) => (
                    <div
                      key={h._id}
                      className="flex items-center justify-between p-4 border dashboard-card-border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 accent-blue rounded-lg">
                          <CalendarIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium dashboard-text">
                          {h.name}
                        </span>
                      </div>
                      <span className="text-xs font-medium px-3 py-1.5 rounded-full dashboard-card border dashboard-card-border dashboard-text-muted">
                        {new Date(h.date).toLocaleDateString("default", {
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm dashboard-text-muted py-4">
                  No upcoming events this month
                </p>
              )}
            </div>

            {/* Legend */}
            <div className="dashboard-card border rounded-2xl p-5 lg:p-6">
              <div className="flex flex-wrap gap-4 lg:gap-6 text-sm">
                <span className="flex items-center gap-2 dashboard-text">
                  <span className="w-3 h-3 rounded-full bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800" />
                  Event
                </span>
                <span className="flex items-center gap-2 dashboard-text">
                  <span className="w-3 h-3 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800" />
                  Holiday
                </span>
                <span className="flex items-center gap-2 dashboard-text">
                  <span className="w-3 h-3 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800" />
                  Alert
                </span>
                <span className="flex items-center gap-2 dashboard-text">
                  <span className="w-3 h-3 rounded-full accent-teal" />
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
