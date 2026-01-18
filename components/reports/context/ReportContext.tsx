'use client';

import { createContext, useContext, useMemo, useState } from 'react';
import { generateClassData } from '../data/generateClassData';

interface ReportsContextType {
  selectedClass: string;
  setSelectedClass: (value: string) => void;
  reportData: any;
}

const ReportsContext = createContext<ReportsContextType | null>(null);

export const ReportsProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedClass, setSelectedClass] = useState('All Classes');

  const reportData = useMemo(() => {
    return generateClassData(selectedClass);
  }, [selectedClass]);

  return (
    <ReportsContext.Provider
      value={{ selectedClass, setSelectedClass, reportData }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const ctx = useContext(ReportsContext);
  if (!ctx) throw new Error('useReports must be used inside ReportsProvider');
  return ctx;
};
