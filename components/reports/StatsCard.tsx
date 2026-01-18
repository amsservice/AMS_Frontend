
'use client';

import type { StatCard } from './types';

interface StatsCardsProps {
  stats: StatCard[];
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const getCardGradient = (index: number): string => {
    const gradients = [
      'from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200/50 dark:border-blue-700/50',
      'from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200/50 dark:border-green-700/50',
      'from-purple-50 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 border-purple-200/50 dark:border-purple-700/50',
      'from-orange-50 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-200/50 dark:border-orange-700/50'
    ];
    return gradients[index % gradients.length];
  };

  const getChangeColor = (changeType: string): string => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600 dark:text-green-400';
      case 'decrease':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className={`group bg-gradient-to-br ${getCardGradient(
            index
          )} border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
        >
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3">
              <div
                className={`p-2 bg-gradient-to-br ${stat.bgGradient} rounded-xl shadow-lg`}
              >
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </p>
            <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {stat.label}
            </p>
            <p className={`text-xs ${getChangeColor(stat.changeType)}`}>
              {stat.change}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
