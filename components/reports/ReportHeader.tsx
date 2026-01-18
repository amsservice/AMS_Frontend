
'use client';

import { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';
import { useReports } from '@/components/reports/context/ReportContext';

export default function ReportHeader() {
  const { selectedClass, setSelectedClass } = useReports();
  const [dateRange, setDateRange] = useState<string>('This Month');

  const handleExport = () => {
    console.log('Exporting report...', {
      class: selectedClass,
      range: dateRange
    });
    // TODO: Implement export functionality
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 dark:from-blue-800 dark:via-purple-800 dark:to-indigo-900 shadow-xl">
      <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Reports & Analytics
            </h1>
            <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
              Comprehensive insights into your school's performance
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* ===== CLASS SELECT ===== */}
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm font-medium appearance-none pr-10 cursor-pointer border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>All Classes</option>
                <option>Class 1</option>
                <option>Class 2</option>
                <option>Class 3</option>
                <option>Class 4</option>
                <option>Class 5</option>
                <option>Class 6</option>
                <option>Class 7</option>
                <option>Class 8</option>
                <option>Class 9</option>
                <option>Class 10</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            {/* ===== DATE RANGE ===== */}
            <div className="relative">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2.5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl text-sm font-medium appearance-none pr-10 cursor-pointer border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>

            {/* ===== EXPORT ===== */}
            <button
              onClick={handleExport}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
