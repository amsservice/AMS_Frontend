



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
import { HOLIDAY_CATEGORIES } from "@/lib/holiday.constants";

/* ===============================
   HELPERS
================================ */
const normalizeDate = (date: string | Date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};

/* Expand holiday ranges into individual days */
const expandHolidayDates = (h: Holiday): string[] => {
  const start = new Date(h.startDate);
  const end = h.endDate ? new Date(h.endDate) : start;

  const days: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(normalizeDate(new Date(d)));
  }
  return days;
};

export default function SchoolCalendar() {
  const { data: holidays = [] } = useHolidays();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(normalizeDate(today));

  const isPastHoliday = (h: Holiday) => {
    const end = h.endDate ? new Date(h.endDate) : new Date(h.startDate);
    end.setHours(0, 0, 0, 0);
    return end.getTime() < today.getTime();
  };

  /* ===============================
     MONTH NAVIGATION
  =============================== */
  const prevMonth = () =>
    setMonth((m) => (m === 0 ? (setYear((y) => y - 1), 11) : m - 1));

  const nextMonth = () =>
    setMonth((m) => (m === 11 ? (setYear((y) => y + 1), 0) : m + 1));

  /* ===============================
     BUILD HOLIDAY DATE MAP
  =============================== */
  const holidayDateMap = useMemo(() => {
    const map = new Map<string, Holiday[]>();

    holidays.forEach((h) => {
      expandHolidayDates(h).forEach((date) => {
        const existing = map.get(date);
        if (existing) {
          existing.push(h);
        } else {
          map.set(date, [h]);
        }
      });
    });

    return map;
  }, [holidays]);

  const selectedHolidays = holidayDateMap.get(selectedDate) ?? [];

  /* ===============================
     CALENDAR GRID
  =============================== */
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const calendarCells = Array.from({ length: 42 }, (_, i) => {
    const day = i - startDay + 1;
    if (day < 1 || day > daysInMonth) return null;

    const dateKey = normalizeDate(new Date(year, month, day));
    const cellHolidays = holidayDateMap.get(dateKey) ?? [];
    return {
      day,
      dateKey,
      holidays: cellHolidays,
      isPastHoliday: cellHolidays.length > 0 ? cellHolidays.every(isPastHoliday) : false
    };
  });

  /* ===============================
     MONTH HOLIDAYS (LIST)
  =============================== */
  const monthHolidays = useMemo(() => {
    return holidays.filter((h) => {
      const start = new Date(h.startDate);
      const end = h.endDate ? new Date(h.endDate) : start;

      return (
        (start.getFullYear() === year && start.getMonth() === month) ||
        (end.getFullYear() === year && end.getMonth() === month)
      );
    });
  }, [holidays, year, month]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        {/* ================= HEADER ================= */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
              <CalendarIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              School Calendar
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 ml-[52px]">
            View school holidays and important dates
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">

          {/* ================= CALENDAR ================= */}
          <div className="bg-white/80 dark:bg-gray-800/80 shadow-xl rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <button onClick={prevMonth}><ChevronLeft /></button>
              <span className="font-bold">
                {new Date(year, month).toLocaleString("default", {
                  month: "long",
                  year: "numeric"
                })}
              </span>
              <button onClick={nextMonth}><ChevronRight /></button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-3">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-gray-500">
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {calendarCells.map((cell, i) =>
                cell ? (
                  // <button
                  //   key={i}
                  //   onClick={() => setSelectedDate(cell.dateKey)}
                  //   className={`
                  //     h-10 rounded-xl flex items-center justify-center text-sm font-medium
                  //     transition-all
                  //     ${
                  //       cell.dateKey === selectedDate
                  //         ? "bg-teal-600 text-white"
                  //         : cell.holiday
                  //         ? "border-2 border-red-500 bg-red-100/60 dark:bg-red-900/30 text-red-700"
                  //         : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  //     }
                  //   `}
                  // >
                  //   {cell.day}
                  // </button>
                  <button
                    key={i}
                    onClick={() => setSelectedDate(cell.dateKey)}
                    className={`
    h-10 w-10 flex items-center justify-center text-sm font-semibold
    transition-all duration-200
    ${cell.dateKey === selectedDate
                        ? "bg-teal-600 text-white shadow-lg"
                        : cell.holidays.length > 0
                          ? `rounded-lg border border-red-400 bg-red-100/70 dark:bg-red-900/30 text-red-700 dark:text-red-300 ${cell.isPastHoliday ? 'opacity-55' : ''}`
                          : "rounded-xl text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
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
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl">
              <h3 className="font-bold mb-4">
                {new Date(selectedDate).toDateString()}
              </h3>

              {selectedHolidays.length > 0 ? (
                <div className="space-y-3">
                  {selectedHolidays.map((h) => (
                    <div
                      key={h._id}
                      className={`p-4 rounded-xl bg-red-100/60 dark:bg-red-900/30 border border-red-300 ${isPastHoliday(h) ? 'opacity-55' : ''}`}
                    >
                      <div className="font-bold text-red-700">
                        {h.name}
                      </div>
                      <div className="text-sm">
                        {HOLIDAY_CATEGORIES[h.category]}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  No holiday on this date
                </div>
              )}
            </div>

            {/* Upcoming Holidays */}
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Upcoming Holidays
              </h4>

              {monthHolidays.length ? (
                <div className="space-y-3">
                  {monthHolidays.map((h) => (
                    <div key={h._id} className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-700 ${isPastHoliday(h) ? 'opacity-55' : ''}`}>
                      <div className="font-semibold">{h.name}</div>
                      <div className="text-xs text-gray-00">
                        {new Date(h.startDate).toDateString()}
                        {h.endDate &&
                          ` → ${new Date(h.endDate).toDateString()}`}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No holidays this month</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
