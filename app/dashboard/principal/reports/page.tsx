


'use client';

import { useState } from 'react';
import {
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  BarChart3,
  Activity,
  PieChart,
  Target
} from 'lucide-react';

// Components
import ReportHeader from '@/components/reports/ReportHeader';
import StatsCards from '@/components/reports/StatsCard';
import MonthlyAttendanceTrend from '@/components/reports/MonthlyAttendanceTrend';
import ClasswisePerformance from '@/components/reports/ClasswisePerformance';
import GenderDistribution from '@/components/reports/GederDistribution';
import WeeklyAttendancePattern from '@/components/reports/WeeklyAttendacePattern';
import EnrollmentTrend from '@/components/reports/EnrollmentTren';
import AttendanceStatusDistribution from '@/components/reports/AttendaceStatusDistribution';
import DetailedClassReport from '@/components/reports/DetailedClassReport'
import {
  StudentsByClassAll,
  StudentsByClassSingle
} from '@/components/reports/StudentByClass';
import type { StatCard } from '@/components/reports/types';

// ✅ REPORT CONTEXT
import { useReports } from '@/components/reports/context/ReportContext';
import ClassWiseStudentList from '@/components/reports/ClassWiseStudentsList';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const { selectedClass, reportData } = useReports();

  /* ================= STATS CARDS (FROM CONTEXT) ================= */
  const stats: StatCard[] = [
    {
      icon: Users,
      value: reportData.students.total.toString(),
      label:
        selectedClass === 'All Classes'
          ? 'Total Students'
          : `Students in ${selectedClass}`,
      change: '+12 from last month',
      changeType: 'increase',
      bgGradient: 'from-blue-500 to-indigo-600'
    },
    {
      icon: TrendingUp,
      value: `${reportData.attendance.overall}%`,
      label:
        selectedClass === 'All Classes'
          ? 'Overall Attendance'
          : `${selectedClass} Attendance`,
      change: '+2.5% from last month',
      changeType: 'increase',
      bgGradient: 'from-green-500 to-emerald-600'
    },
    {
      icon: BookOpen,
      value: selectedClass === 'All Classes' ? '10' : '1',
      label: 'Total Classes',
      change: 'Active this session',
      changeType: 'neutral',
      bgGradient: 'from-purple-500 to-violet-600'
    },
    {
      icon: Calendar,
      value:
        selectedClass === 'All Classes'
          ? Math.round(reportData.students.total / 10).toString()
          : reportData.students.total.toString(),
      label: 'Avg per Class',
      change: '+1.2% from last week',
      changeType: 'increase',
      bgGradient: 'from-orange-500 to-amber-600'
    }
  ];

  /* ================= TABS ================= */
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'attendance', label: 'Attendance', icon: Activity },
    { id: 'distribution', label: 'Distribution', icon: PieChart },
    { id: 'performance', label: 'Performance', icon: Target },
    { id: 'students', label: 'Students', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* ✅ HEADER USES CONTEXT INTERNALLY */}
      <ReportHeader />

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* ===== STATS ===== */}
          <StatsCards stats={stats} />

          {/* ===== TABS ===== */}
          <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex space-x-1 overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-gray-700'
                          : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-2" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* ===== TAB CONTENT ===== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MonthlyAttendanceTrend />
                <ClasswisePerformance />
              </div>
              {selectedClass === 'All Classes' ? (
                <StudentsByClassAll />
              ) : (
                <StudentsByClassSingle />
              )}

              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GenderDistribution />
                <WeeklyAttendancePattern />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EnrollmentTrend />
                <AttendanceStatusDistribution />
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MonthlyAttendanceTrend />
                <WeeklyAttendancePattern />
              </div>
              <AttendanceStatusDistribution />
            </div>
          )}

          {activeTab === 'distribution' && (
            <div className="space-y-6">
              {selectedClass === 'All Classes' ? (
                <StudentsByClassAll />
              ) : (
                <StudentsByClassSingle />
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GenderDistribution />
                <AttendanceStatusDistribution />
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              <ClasswisePerformance />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <MonthlyAttendanceTrend />
                <WeeklyAttendancePattern />
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
            
              <ClassWiseStudentList/>
            </div>
          )}
          <DetailedClassReport />
        </div>
      </main>
    </div>
  );
}
