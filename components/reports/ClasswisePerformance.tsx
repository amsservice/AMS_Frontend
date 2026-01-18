


'use client';

import { BookOpen } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';
import type { ClassData } from './types';
import { useReports } from '@/components/reports/context/ReportContext';

export default function ClasswisePerformance() {
  const { selectedClass, reportData } = useReports();

  const data: ClassData[] =
    selectedClass === 'All Classes'
      ? reportData.allClasses
      : [
          {
            class: selectedClass,
            attendance: reportData.attendance.overall,
            students: reportData.students.total
          }
        ];

  return (
    <ChartCard
      title="Class-wise Performance"
      description="Attendance by class"
      icon={BookOpen}
      iconGradient="from-green-600 to-emerald-600"
    >
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="class" stroke="#6b7280" />
          <YAxis stroke="#6b7280" domain={[0, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Bar dataKey="attendance" fill="#22c55e" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
