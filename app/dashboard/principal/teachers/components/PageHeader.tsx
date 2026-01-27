"use client";

import { Plus, X, Upload } from "lucide-react";

interface PageHeaderProps {
  isAddTeacherOpen: boolean;
  setIsAddTeacherOpen: (v: boolean) => void;
  setIsBulkUploadOpen: (v: boolean) => void;
}

export default function PageHeader({
  isAddTeacherOpen,
  setIsAddTeacherOpen,
  setIsBulkUploadOpen,
}: PageHeaderProps) {
  return (
    <header className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-800 dark:via-blue-800 dark:to-indigo-900 shadow-2xl border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight">
              Staff Management
            </h1>
            <p className="mt-2 text-sm sm:text-base text-blue-100 font-medium">
              Manage staff members and class assignments
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsBulkUploadOpen(true)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Upload className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span>Bulk Upload</span>
            </button>
            <button
              onClick={() => setIsAddTeacherOpen(!isAddTeacherOpen)}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-blue-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              {isAddTeacherOpen ? (
                <X className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              ) : (
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              )}
              <span>{isAddTeacherOpen ? "Cancel" : "Add Staff"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
