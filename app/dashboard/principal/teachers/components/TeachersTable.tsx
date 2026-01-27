"use client";

import { Users, Mail, BookOpen, Eye, Edit, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface TeacherRowType {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  currentClass?: {
    classId: string;
    className: string;
    section: string;
  };
}

interface TeachersTableProps {
  teachers: TeacherRowType[];
  isLoading: boolean;
  onView: (id: string) => void;
  onAssign: (id: string) => void;
  onSwap: (id: string) => void;
  onDelete: (teacher: { id: string; name: string }) => void;
}

export default function TeachersTable({
  teachers,
  isLoading,
  onView,
  onAssign,
  onSwap,
  onDelete,
}: TeachersTableProps) {
  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl shadow-lg">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-xl font-bold text-gray-900 dark:text-white">
              All Teachers
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              {teachers.length} teachers registered
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center px-6 py-3">
        <div className="col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Name
        </div>
        <div className="col-span-4 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Email
        </div>
        <div className="col-span-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
          Assigned Class
        </div>
        <div className="col-span-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide text-right mr-24">
          Actions
        </div>
      </div>

      <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
        {isLoading ? (
          <div className="p-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">Loading teachers...</p>
          </div>
        ) : teachers.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600 opacity-50" />
            <p className="text-gray-600 dark:text-gray-400">No teachers found</p>
          </div>
        ) : (
          teachers.map((teacher) => (
            <div
              key={teacher.id}
              className="p-4 sm:p-5 lg:px-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
            >
              {/* Mobile layout */}
              <div className="lg:hidden space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="bg-gradient-to-br from-teal-500 to-cyan-600 w-12 h-12">
                    <AvatarFallback className="text-white font-bold text-2xl bg-white">
                      {teacher.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {teacher.name}
                      </h3>
                      <Badge
                        className={`mt-1 ${
                          teacher.isActive
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        } border`}
                      >
                        {teacher.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {teacher.email}
                    </p>
                  </div>
                </div>

                {teacher.currentClass ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      Class {teacher.currentClass.className} - {teacher.currentClass.section}
                    </span>
                  </div>
                ) : (
                  <p className="text-sm font-medium text-orange-600 dark:text-orange-400 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    No class assigned
                  </p>
                )}

                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onView(teacher.id)}
                    className="flex-1 bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-xl hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>

                  {teacher.currentClass && (
                    <button
                      onClick={() => onSwap(teacher.id)}
                      className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center justify-center gap-2 shadow-sm min-w-[96px]"
                    >
                      <Edit className="w-4 h-4" /> Swap
                    </button>
                  )}

                  {!teacher.currentClass && (
                    <button
                      onClick={() => onAssign(teacher.id)}
                      className="flex-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center justify-center gap-2 shadow-sm min-w-[96px]"
                    >
                      Assign
                    </button>
                  )}

                  <button
                    onClick={() => onDelete({ id: teacher.id, name: teacher.name })}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm flex items-center gap-2 shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden lg:grid lg:grid-cols-12 gap-4 items-center">
                <div className="col-span-3 flex items-center gap-3">
                  <Avatar className="bg-gradient-to-br from-teal-500 to-cyan-600">
                    <AvatarFallback className="text-white font-bold text-2xl bg-white">
                      {teacher.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-bold text-gray-900 dark:text-white">
                    {teacher.name}
                  </span>
                </div>

                <div className="col-span-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <Mail className="w-4 h-4" /> {teacher.email}
                </div>

                <div className="col-span-2">
                  {teacher.currentClass ? (
                    <div className="flex items-center gap-2 text-sm text-gray-900 dark:text-white">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="font-medium">
                        {teacher.currentClass.className} - {teacher.currentClass.section}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      Not assigned
                    </span>
                  )}
                </div>

                <div className="col-span-3 flex gap-2 justify-end">
                  <button
                    onClick={() => onView(teacher.id)}
                    className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold py-2 px-4 rounded-xl hover:opacity-90 transition-all text-sm flex items-center gap-2 shadow-sm"
                  >
                    <Eye className="w-4 h-4" /> View
                  </button>

                  {teacher.currentClass && (
                    <button
                      onClick={() => onSwap(teacher.id)}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center justify-center gap-2 shadow-sm min-w-[96px]"
                    >
                      <Edit className="w-4 h-4" /> Swap
                    </button>
                  )}

                  {!teacher.currentClass && (
                    <button
                      onClick={() => onAssign(teacher.id)}
                      className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all text-sm flex items-center justify-center gap-2 shadow-sm min-w-[96px]"
                    >
                      Assign
                    </button>
                  )}

                  <button
                    onClick={() => onDelete({ id: teacher.id, name: teacher.name })}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-xl transition-all text-sm flex items-center gap-2 shadow-sm"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
