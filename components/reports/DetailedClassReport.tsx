'use client';

import { BookOpen } from 'lucide-react';
import { useReports } from '@/components/reports/context/ReportContext';

export default function DetailedClassReport() {
  const { reportData } = useReports();

  // When All Classes → show table
  const rows =
    reportData.allClasses ??
    [
      {
        class: reportData.class ?? 'Class',
        male: reportData.students.male,
        female: reportData.students.female,
        total: reportData.students.total,
        attendance: reportData.attendance.overall
      }
    ];

  const getStatus = (attendance: number) => {
    if (attendance >= 90) {
      return {
        label: 'Excellent',
        text: 'text-green-700 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900/40'
      };
    }
    if (attendance >= 85) {
      return {
        label: 'Good',
        text: 'text-orange-700 dark:text-orange-400',
        bg: 'bg-orange-100 dark:bg-orange-900/40'
      };
    }
    return {
      label: 'Needs Improvement',
      text: 'text-red-700 dark:text-red-400',
      bg: 'bg-red-100 dark:bg-red-900/40'
    };
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
          <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Detailed Class Report
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="py-3">Class</th>
              <th className="py-3 text-center">Male</th>
              <th className="py-3 text-center">Female</th>
              <th className="py-3 text-center">Total</th>
              <th className="py-3 text-center">Attendance</th>
              <th className="py-3 text-center">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {rows.map((row: any, index: number) => {
              const status = getStatus(row.attendance);

              return (
                <tr
                  key={index}
                  className="text-sm text-gray-900 dark:text-gray-200"
                >
                  <td className="py-4 font-medium">
                    {row.class}
                  </td>

                  <td className="py-4 text-center">
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                      {row.male}
                    </span>
                  </td>

                  <td className="py-4 text-center">
                    <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700">
                      {row.female}
                    </span>
                  </td>

                  <td className="py-4 text-center font-semibold">
                    {row.total ?? row.students}
                  </td>

                  <td className="py-4 text-center font-semibold">
                    <span
                      className={
                        row.attendance >= 90
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-orange-600 dark:text-orange-400'
                      }
                    >
                      {row.attendance}%
                    </span>
                  </td>

                  <td className="py-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}
                    >
                      {status.label}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
