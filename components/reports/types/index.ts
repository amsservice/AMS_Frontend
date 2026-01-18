import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface StatCard {
  icon: LucideIcon;
  value: string;
  label: string;
  change: string;
  changeType: 'increase' | 'decrease' | 'neutral';
  bgGradient: string;
}

export interface MonthlyData {
  month: string;
  attendance: number;
}

export interface ClassData {
  class: string;
  attendance: number;
  students: number;
}

export interface GenderData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface WeeklyData {
  day: string;
  attendance: number;
}

export interface EnrollmentData {
  year: string;
  students: number;
}

export interface StatusData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

export interface ChartCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconGradient: string;
  children: ReactNode;
}
