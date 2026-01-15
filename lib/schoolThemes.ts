export const SCHOOL_THEMES = [
  "from-blue-600 to-indigo-600",
  "from-purple-600 to-pink-600",
  "from-green-600 to-emerald-600",
  "from-orange-500 to-red-500",
  "from-cyan-500 to-blue-500",
  "from-teal-500 to-green-600",
  "from-indigo-500 to-violet-600",
  "from-rose-500 to-fuchsia-600",
  "from-yellow-500 to-orange-500",
  "from-sky-500 to-indigo-500"
];

export function getRandomTheme() {
  return SCHOOL_THEMES[Math.floor(Math.random() * SCHOOL_THEMES.length)];
}
