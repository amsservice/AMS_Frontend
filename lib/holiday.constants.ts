export type HolidayCategory = 'NATIONAL' | 'FESTIVAL' | 'SCHOOL';

export const HOLIDAY_CATEGORIES: Record<HolidayCategory, string> = {
  NATIONAL: 'National',
  FESTIVAL: 'Festival',
  SCHOOL: 'School'
};

export const CATEGORY_COLORS: Record<HolidayCategory, string> = {
  NATIONAL: 'bg-blue-100 text-blue-700 border-blue-300',
  FESTIVAL: 'bg-purple-100 text-purple-700 border-purple-300',
  SCHOOL: 'bg-red-100 text-red-700 border-red-300'
};
