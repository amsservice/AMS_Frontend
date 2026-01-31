'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { FileText, RefreshCcw } from 'lucide-react';

import { useInfiniteAuditLogs, type AuditAction } from '@/app/querry/useAuditLogs';

export default function AuditLogsPage() {
  const [limit] = useState(25);

  const [action, setAction] = useState<AuditAction | ''>('');
  const [entityType, setEntityType] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const queryParams = useMemo(() => {
    return {
      limit,
      action: action || undefined,
      entityType: entityType.trim() || undefined,
      from: from || undefined,
      to: to || undefined
    };
  }, [limit, action, entityType, from, to]);

  const {
    data,
    isLoading,
    isFetching,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteAuditLogs(queryParams);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = bottomRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        if (isFetchingNextPage) return;
        if (!hasNextPage) return;
        fetchNextPage();
      },
      { root: null, rootMargin: '250px', threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const rows = useMemo(() => {
    const pages = data?.pages || [];
    return pages.flatMap((p) => p.items || []);
  }, [data]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Audit Logs</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Track updates and deletions across the system
            </p>
          </div>
        </div>

        <button
          onClick={() => refetch()}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
        >
          <RefreshCcw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <select
          value={action}
          onChange={(e) => {
            setAction(e.target.value as any);
          }}
          className="w-full rounded-xl bg-white dark:bg-[#131926] border border-gray-200 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
        >
          <option value="">All actions</option>
          <option value="CREATE">CREATE</option>
          <option value="UPDATE">UPDATE</option>
          <option value="DELETE">DELETE</option>
        </select>

        <input
          value={entityType}
          onChange={(e) => {
            setEntityType(e.target.value);
          }}
          placeholder="Entity type (e.g. Student)"
          className="w-full rounded-xl bg-white dark:bg-[#131926] border border-gray-200 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
        />

        <input
          type="date"
          value={from}
          onChange={(e) => {
            setFrom(e.target.value);
          }}
          className="w-full rounded-xl bg-white dark:bg-[#131926] border border-gray-200 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
        />

        <input
          type="date"
          value={to}
          onChange={(e) => {
            setTo(e.target.value);
          }}
          className="w-full rounded-xl bg-white dark:bg-[#131926] border border-gray-200 dark:border-white/10 px-3 py-2 text-sm text-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white/80 dark:bg-[#0B0F1A]/60 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50/70 dark:bg-white/5">
              <tr className="text-left">
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">Time</th>
                <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-200">What happened</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500 dark:text-gray-400" colSpan={2}>
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td className="px-4 py-6 text-red-600" colSpan={2}>
                    Failed to load audit logs
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-gray-500 dark:text-gray-400" colSpan={2}>
                    No audit logs found
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr
                    key={row._id}
                    className="border-t border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5"
                  >
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 whitespace-nowrap">
                      {new Date(row.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {row.message || `${row.actorDisplay || row.actorId} ${row.action} ${row.entityType} ${row.entityDisplay || row.entityId || ''}`}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {(row.actorRoles || []).join(', ')}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 dark:border-white/5">
          <div ref={bottomRef} />

          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isFetchingNextPage
              ? 'Loading more...'
              : hasNextPage
                ? 'Scroll to load more'
                : rows.length
                  ? 'End of results'
                  : ''}
          </div>
        </div>
      </div>
    </div>
  );
}
