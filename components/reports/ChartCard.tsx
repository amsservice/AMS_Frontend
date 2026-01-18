
// ============================================
// FILE: app/reports/components/ChartCard.tsx
// ============================================

'use client';

import type { ChartCardProps } from './types';

export default function ChartCard({ title, description, icon: Icon, iconGradient, children }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 bg-gradient-to-br ${iconGradient} rounded-xl`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}