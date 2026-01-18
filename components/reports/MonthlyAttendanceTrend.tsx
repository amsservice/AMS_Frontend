

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
import type { MonthlyData } from './types';
import { useReports } from '@/components/reports/context/ReportContext';

export default function MonthlyAttendanceTrend() {
  const { reportData } = useReports();

  const data: MonthlyData[] = reportData.monthly;

  return (
    <ChartCard
      title="Monthly Attendance Trend"
      description="Year-over-year comparison"
      icon={TrendingUp}
      iconGradient="from-blue-600 to-indigo-600"
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#6b7280" />
          <YAxis stroke="#6b7280" domain={[80, 100]} />
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
            dataKey="attendance"
            stroke="#2563eb"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorAttendance)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
