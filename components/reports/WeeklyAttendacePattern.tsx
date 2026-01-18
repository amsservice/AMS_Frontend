


'use client';

import { Calendar } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';
import type { WeeklyData } from './types';
import { useReports } from '@/components/reports/context/ReportContext';

export default function WeeklyAttendancePattern() {
  const { reportData } = useReports();

  const data: WeeklyData[] = reportData.weekly;

  return (
    <ChartCard
      title="Weekly Attendance Pattern"
      description="This week's overview"
      icon={Calendar}
      iconGradient="from-orange-600 to-amber-600"
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="day" stroke="#6b7280" />
          <YAxis stroke="#6b7280" domain={[80, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Line
            type="monotone"
            dataKey="attendance"
            stroke="#f97316"
            strokeWidth={3}
            dot={{ fill: '#f97316', r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
