'use client';

import { useMyTeacherFullProfile } from '@/app/querry/useTeachers';

export default function TeacherPage() {
  const { data, isLoading, error } = useMyTeacherFullProfile();

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading teacher profile...
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="p-6 text-center text-red-500">
        Failed to load teacher profile
      </div>
    );
  }

  const teacher = data.data;

  // ✅ FIND ACTIVE CLASS FROM HISTORY
  const activeClass = teacher.history.find(
    (h: any) => h.isActive === true
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold">{teacher.name}</h1>
            <p className="text-gray-600">{teacher.email}</p>
          </div>

          <span
            className={`px-4 py-1 rounded-full text-sm font-semibold ${
              teacher.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {teacher.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>

        {/* BASIC INFO */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p><b>Teacher ID:</b> {teacher._id}</p>
            <p><b>Phone:</b> {teacher.phone || 'N/A'}</p>
            <p><b>School:</b> {teacher.schoolId?.name}</p>
            <p><b>School ID:</b> {teacher.schoolId?._id}</p>
            <p><b>Joined On:</b> {new Date(teacher.createdAt).toLocaleDateString()}</p>
            <p><b>Last Updated:</b> {new Date(teacher.updatedAt).toLocaleDateString()}</p>
          </div>
        </section>

        {/* CURRENT CLASS (FROM HISTORY) */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Current Class</h2>

          {activeClass ? (
            <div className="p-4 border rounded-lg bg-green-50">
              <p><b>Session:</b> {activeClass.sessionId?.name}</p>
              <p><b>Class:</b> {activeClass.className}</p>
              <p><b>Section:</b> {activeClass.section}</p>
            </div>
          ) : (
            <p className="text-gray-500">No active class assigned</p>
          )}
        </section>

        {/* CLASS HISTORY */}
        <section>
          <h2 className="text-xl font-semibold mb-2">Class History</h2>

          {teacher.history.length === 0 ? (
            <p className="text-gray-500">No class history available</p>
          ) : (
            <div className="space-y-3">
              {teacher.history.map((h: any, index: number) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    h.isActive
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <p><b>Session:</b> {h.sessionId?.name}</p>
                  <p><b>Class:</b> {h.className}</p>
                  <p><b>Section:</b> {h.section}</p>

                  <span
                    className={`text-sm font-semibold ${
                      h.isActive
                        ? 'text-green-700'
                        : 'text-gray-500'
                    }`}
                  >
                    {h.isActive ? 'Active (Current)' : 'Inactive'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
