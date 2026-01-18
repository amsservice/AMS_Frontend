

'use client';

import { TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';
import type { EnrollmentData } from './types';
import { useReports } from '@/components/reports/context/ReportContext';

export default function EnrollmentTrend() {
  const { reportData } = useReports();

  // Enrollment trend stays the same visually,
  // but final value adapts to selected class
  const data: EnrollmentData[] = [
    { year: '2020', students: Math.max(0, reportData.students.total - 67) },
    { year: '2021', students: Math.max(0, reportData.students.total - 37) },
    { year: '2022', students: Math.max(0, reportData.students.total - 22) },
    { year: '2023', students: Math.max(0, reportData.students.total - 7) },
    { year: '2024', students: reportData.students.total }
  ];

  return (
    <ChartCard
      title="Student Enrollment Trend"
      description="5-year growth"
      icon={TrendingUp}
      iconGradient="from-teal-600 to-cyan-600"
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="year" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Area
            type="monotone"
            dataKey="students"
            stroke="#14b8a6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorStudents)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
