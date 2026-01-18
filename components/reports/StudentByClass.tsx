

'use client';

import { Users, BarChart3 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import ChartCard from './ChartCard';
import { useReports } from '@/components/reports/context/ReportContext';

/* ================= CUSTOM TOOLTIP ================= */
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 dark:bg-gray-800 text-white p-3 rounded-lg shadow-lg border border-gray-700">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

/* ================= ALL CLASSES ================= */
export function StudentsByClassAll() {
  const { reportData } = useReports();

  const data = reportData.allClasses.map((cls: any) => ({
    class: cls.class,
    male: cls.male,
    female: cls.female
  }));

  return (
    <ChartCard
      title="Students by Class"
      description="Gender distribution across all classes"
      icon={BarChart3}
      iconGradient="from-blue-600 to-indigo-600"
    >
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis
            dataKey="class"
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
            className="dark:fill-gray-400"
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
            className="dark:fill-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="rect" />
          <Bar dataKey="male" name="Male" fill="#4F46E5" radius={[8, 8, 0, 0]} />
          <Bar
            dataKey="female"
            name="Female"
            fill="#E5E7EB"
            radius={[8, 8, 0, 0]}
            className="dark:fill-gray-600"
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ================= SINGLE CLASS ================= */
export function StudentsByClassSingle() {
  const { selectedClass, reportData } = useReports();

  const data = [
    {
      class: selectedClass,
      male: reportData.students.male,
      female: reportData.students.female
    }
  ];

  const total = reportData.students.total;

  return (
    <ChartCard
      title="Students by Class"
      description={`Gender distribution in ${selectedClass}`}
      icon={Users}
      iconGradient="from-blue-600 to-indigo-600"
    >
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} barSize={120}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis
            dataKey="class"
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
            className="dark:fill-gray-400"
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#6b7280' }}
            className="dark:fill-gray-400"
            domain={[0, 40]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="rect" />
          <Bar dataKey="male" name="Male" fill="#4F46E5" radius={[8, 8, 0, 0]} />
          <Bar
            dataKey="female"
            name="Female"
            fill="#E5E7EB"
            radius={[8, 8, 0, 0]}
            className="dark:fill-gray-600"
          />
        </BarChart>
      </ResponsiveContainer>

      {/* ===== SUMMARY ===== */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {reportData.students.male}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Male</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
            {reportData.students.female}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Female</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {total}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
        </div>
      </div>
    </ChartCard>
  );
}

/* ================= DEFAULT ================= */
export default StudentsByClassAll;
