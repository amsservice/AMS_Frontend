



// "use client";

// import { useMemo, useState } from "react";
// import {
//   Calendar as CalendarIcon,
//   ChevronLeft,
//   ChevronRight,
//   CalendarCheck,
//   AlertCircle,
//   Clock
// } from "lucide-react";
// import { useHolidays, Holiday } from "@/app/querry/useHolidays";
// import { HOLIDAY_CATEGORIES } from "@/lib/holiday.constants";

// /* ===============================
//    HELPERS
// ================================ */
// const normalizeDate = (date: string | Date) => {
//   const d = new Date(date);
//   return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
//     d.getDate()
//   ).padStart(2, "0")}`;
// };

// /* Expand holiday ranges into individual days */
// const expandHolidayDates = (h: Holiday): string[] => {
//   const start = new Date(h.startDate);
//   const end = h.endDate ? new Date(h.endDate) : start;

//   const days: string[] = [];
//   for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
//     days.push(normalizeDate(new Date(d)));
//   }
//   return days;
// };

// export default function SchoolCalendar() {
//   const { data: holidays = [] } = useHolidays();

//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const [month, setMonth] = useState(today.getMonth());
//   const [year, setYear] = useState(today.getFullYear());
//   const [selectedDate, setSelectedDate] = useState(normalizeDate(today));

//   const isPastHoliday = (h: Holiday) => {
//     const end = h.endDate ? new Date(h.endDate) : new Date(h.startDate);
//     end.setHours(0, 0, 0, 0);
//     return end.getTime() < today.getTime();
//   };

//   /* ===============================
//      MONTH NAVIGATION
//   =============================== */
//   const prevMonth = () =>
//     setMonth((m) => (m === 0 ? (setYear((y) => y - 1), 11) : m - 1));

//   const nextMonth = () =>
//     setMonth((m) => (m === 11 ? (setYear((y) => y + 1), 0) : m + 1));

//   /* ===============================
//      BUILD HOLIDAY DATE MAP
//   =============================== */
//   const holidayDateMap = useMemo(() => {
//     const map = new Map<string, Holiday[]>();

//     holidays.forEach((h) => {
//       expandHolidayDates(h).forEach((date) => {
//         const existing = map.get(date);
//         if (existing) {
//           existing.push(h);
//         } else {
//           map.set(date, [h]);
//         }
//       });
//     });

//     return map;
//   }, [holidays]);

//   const selectedHolidays = holidayDateMap.get(selectedDate) ?? [];

//   /* ===============================
//      CALENDAR GRID
//   =============================== */
//   const daysInMonth = new Date(year, month + 1, 0).getDate();
//   const startDay = new Date(year, month, 1).getDay();

//   const calendarCells = Array.from({ length: 42 }, (_, i) => {
//     const day = i - startDay + 1;
//     if (day < 1 || day > daysInMonth) return null;

//     const dateKey = normalizeDate(new Date(year, month, day));
//     const cellHolidays = holidayDateMap.get(dateKey) ?? [];
//     return {
//       day,
//       dateKey,
//       holidays: cellHolidays,
//       isPastHoliday: cellHolidays.length > 0 ? cellHolidays.every(isPastHoliday) : false
//     };
//   });

//   /* ===============================
//      MONTH HOLIDAYS (LIST)
//   =============================== */
//   const monthHolidays = useMemo(() => {
//     return holidays.filter((h) => {
//       const start = new Date(h.startDate);
//       const end = h.endDate ? new Date(h.endDate) : start;

//       return (
//         (start.getFullYear() === year && start.getMonth() === month) ||
//         (end.getFullYear() === year && end.getMonth() === month)
//       );
//     });
//   }, [holidays, year, month]);

//   return (
//     <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">

//         {/* ================= HEADER ================= */}
//         <div className="mb-6 sm:mb-8">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="p-2 bg-gradient-to-br from-purple-600 to-violet-600 rounded-xl shadow-lg">
//               <CalendarIcon className="w-6 h-6 text-white" />
//             </div>
//             <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
//               School Calendar
//             </h2>
//           </div>
//           <p className="text-sm text-gray-600 dark:text-gray-400 ml-[52px]">
//             View school holidays and important dates
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6">

//           {/* ================= CALENDAR ================= */}
//           <div className="bg-white/80 dark:bg-gray-800/80 shadow-xl rounded-2xl p-6">
//             <div className="flex justify-between items-center mb-6">
//               <button onClick={prevMonth}><ChevronLeft /></button>
//               <span className="font-bold">
//                 {new Date(year, month).toLocaleString("default", {
//                   month: "long",
//                   year: "numeric"
//                 })}
//               </span>
//               <button onClick={nextMonth}><ChevronRight /></button>
//             </div>

//             <div className="grid grid-cols-7 gap-2 mb-3">
//               {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
//                 <div key={d} className="text-center text-xs font-semibold text-gray-500">
//                   {d}
//                 </div>
//               ))}
//             </div>

//             <div className="grid grid-cols-7 gap-2">
//               {calendarCells.map((cell, i) =>
//                 cell ? (
//                   // <button
//                   //   key={i}
//                   //   onClick={() => setSelectedDate(cell.dateKey)}
//                   //   className={`
//                   //     h-10 rounded-xl flex items-center justify-center text-sm font-medium
//                   //     transition-all
//                   //     ${
//                   //       cell.dateKey === selectedDate
//                   //         ? "bg-teal-600 text-white"
//                   //         : cell.holiday
//                   //         ? "border-2 border-red-500 bg-red-100/60 dark:bg-red-900/30 text-red-700"
//                   //         : "hover:bg-gray-100 dark:hover:bg-gray-700"
//                   //     }
//                   //   `}
//                   // >
//                   //   {cell.day}
//                   // </button>
//                   <button
//                     key={i}
//                     onClick={() => setSelectedDate(cell.dateKey)}
//                     className={`
//     h-10 w-10 flex items-center justify-center text-sm font-semibold
//     transition-all duration-200
//     ${cell.dateKey === selectedDate
//                         ? "bg-teal-600 text-white shadow-lg"
//                         : cell.holidays.length > 0
//                           ? `rounded-lg border border-red-400 bg-red-100/70 dark:bg-red-900/30 text-red-700 dark:text-red-300 ${cell.isPastHoliday ? 'opacity-55' : ''}`
//                           : "rounded-xl text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
//                       }
//   `}
//                   >
//                     {cell.day}
//                   </button>

//                 ) : (
//                   <div key={i} />
//                 )
//               )}
//             </div>
//           </div>

//           {/* ================= RIGHT PANEL ================= */}
//           <div className="space-y-6">

//             {/* Selected Day */}
//             <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl">
//               <h3 className="font-bold mb-4">
//                 {new Date(selectedDate).toDateString()}
//               </h3>

//               {selectedHolidays.length > 0 ? (
//                 <div className="space-y-3">
//                   {selectedHolidays.map((h) => (
//                     <div
//                       key={h._id}
//                       className={`p-4 rounded-xl bg-red-100/60 dark:bg-red-900/30 border border-red-300 ${isPastHoliday(h) ? 'opacity-55' : ''}`}
//                     >
//                       <div className="font-bold text-red-700">
//                         {h.name}
//                       </div>
//                       <div className="text-sm">
//                         {HOLIDAY_CATEGORIES[h.category]}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 text-gray-500">
//                   <AlertCircle className="w-4 h-4" />
//                   No holiday on this date
//                 </div>
//               )}
//             </div>

//             {/* Upcoming Holidays */}
//             <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl">
//               <h4 className="font-bold mb-4 flex items-center gap-2">
//                 <Clock className="w-4 h-4" />
//                 Upcoming Holidays
//               </h4>

//               {monthHolidays.length ? (
//                 <div className="space-y-3">
//                   {monthHolidays.map((h) => (
//                     <div key={h._id} className={`p-3 rounded-xl bg-gray-100 dark:bg-gray-700 ${isPastHoliday(h) ? 'opacity-55' : ''}`}>
//                       <div className="font-semibold">{h.name}</div>
//                       <div className="text-xs text-gray-00">
//                         {new Date(h.startDate).toDateString()}
//                         {h.endDate &&
//                           ` → ${new Date(h.endDate).toDateString()}`}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-gray-500">No holidays this month</div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }








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
    <div className="relative">
      {/* Header with gradient */}
      <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-900 shadow-2xl border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg">
              <CalendarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-lg">
                School Calendar 📅
              </h1>
              <p className="text-sm sm:text-base text-purple-100 font-medium mt-1">
                View school holidays and important dates
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">

          {/* ================= CALENDAR ================= */}
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-2xl border border-purple-200/50 dark:border-purple-700/30 p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 dark:from-purple-500/5 dark:to-blue-500/5 rounded-full blur-3xl"></div>
            
            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={prevMonth}
                  className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all duration-200 transform hover:scale-110"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
                <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {new Date(year, month).toLocaleString("default", {
                    month: "long",
                    year: "numeric"
                  })}
                </span>
                <button 
                  onClick={nextMonth}
                  className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-all duration-200 transform hover:scale-110"
                >
                  <ChevronRight className="w-5 h-5 text-gray-900 dark:text-white" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-3">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div 
                    key={d} 
                    className="text-center text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
                  >
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-2">
                {calendarCells.map((cell, i) =>
                  cell ? (
                    <button
                      key={i}
                      onClick={() => setSelectedDate(cell.dateKey)}
                      className={`
                        h-10 sm:h-12 flex items-center justify-center text-sm font-semibold
                        transition-all duration-200 rounded-lg
                        ${cell.dateKey === selectedDate
                          ? "bg-gradient-to-br from-purple-500 to-blue-500 text-white shadow-lg transform scale-105"
                          : cell.holidays.length > 0
                            ? `border border-red-400 bg-red-100/70 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 ${cell.isPastHoliday ? 'opacity-50' : ''}`
                            : "text-gray-900 dark:text-white hover:bg-purple-100 dark:hover:bg-purple-900/30"
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

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-purple-200/50 dark:border-purple-700/30">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-red-100 dark:bg-red-900/30 border border-red-400"></div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">Holiday</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT PANEL ================= */}
          <div className="space-y-6">

            {/* Selected Day */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-2xl border border-purple-200/50 dark:border-purple-700/30 p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <div className="flex items-center mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                    <CalendarCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                      {new Date(selectedDate).toDateString()}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Selected date details
                    </p>
                  </div>
                </div>

                {selectedHolidays.length > 0 ? (
                  <div className="space-y-3">
                    {selectedHolidays.map((h) => (
                      <div
                        key={h._id}
                        className={`p-4 rounded-xl bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-300 dark:border-red-700/30 hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 transition-all duration-200 ${isPastHoliday(h) ? 'opacity-50' : ''}`}
                      >
                        <div className="font-bold text-red-700 dark:text-red-300 text-sm sm:text-base">
                          {h.name}
                        </div>
                        <div className="text-xs sm:text-sm text-red-600 dark:text-red-400 mt-1">
                          {HOLIDAY_CATEGORIES[h.category]}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 p-4 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200/30 dark:border-purple-700/20">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm">No holiday on this date</span>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Holidays */}
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-xl rounded-2xl border border-purple-200/50 dark:border-purple-700/30 p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-500/10 to-blue-500/10 dark:from-purple-500/5 dark:to-blue-500/5 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <div className="flex items-center mb-5">
                  <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-base sm:text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                      Holidays This Month
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {monthHolidays.length} holiday{monthHolidays.length !== 1 ? 's' : ''} scheduled
                    </p>
                  </div>
                </div>

                {monthHolidays.length ? (
                  <div className="space-y-3">
                    {monthHolidays.map((h) => (
                      <div 
                        key={h._id} 
                        className={`p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30 transition-all duration-200 border border-purple-200/30 dark:border-purple-700/20 ${isPastHoliday(h) ? 'opacity-50' : ''}`}
                      >
                        <div className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          {h.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {new Date(h.startDate).toDateString()}
                          {h.endDate &&
                            ` → ${new Date(h.endDate).toDateString()}`}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 dark:text-gray-400 text-sm p-4 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200/30 dark:border-purple-700/20">
                    No holidays this month
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
