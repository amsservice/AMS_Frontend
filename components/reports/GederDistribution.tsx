

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
import type { GenderData } from './types';
import { useReports } from '@/components/reports/context/ReportContext';

export default function GenderDistribution() {
  const { reportData } = useReports();

  const data: GenderData[] = [
    {
      name: 'Male',
      value: reportData.students.male,
      color: '#2563eb'
    },
    {
      name: 'Female',
      value: reportData.students.female,
      color: '#a855f7'
    }
  ];

  return (
    <ChartCard
      title="Gender Distribution"
      description="Student demographics"
      icon={Users}
      iconGradient="from-purple-600 to-violet-600"
    >
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
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
