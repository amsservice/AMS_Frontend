


'use client';

import { Users } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import ChartCard from './ChartCard';
import type { StatusData } from './types';
import { useReports } from '@/components/reports/context/ReportContext';

export default function AttendanceStatusDistribution() {
  const { reportData } = useReports();

  const data: StatusData[] = [
    {
      name: 'Present',
      value: reportData.attendance.present,
      color: '#22c55e'
    },
    {
      name: 'Absent',
      value: reportData.attendance.absent,
      color: '#ef4444'
    },
    {
      name: 'Late',
      value: reportData.attendance.late,
      color: '#f59e0b'
    }
  ];

  return (
    <ChartCard
      title="Today's Attendance Status"
      description="Current day breakdown"
      icon={Users}
      iconGradient="from-blue-600 to-indigo-600"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={110}
            dataKey="value"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: 'none',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
