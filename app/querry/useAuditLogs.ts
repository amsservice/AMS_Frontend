'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE';

export type AuditDiffItem = {
  path: string;
  before?: unknown;
  after?: unknown;
};

export type AuditLog = {
  _id: string;
  schoolId: string;
  actorId: string;
  actorRoles: string[];
  actorDisplay?: string;
  action: AuditAction;
  entityType: string;
  entityId?: string;
  entityDisplay?: string;
  message?: string;
  route?: string;
  method?: string;
  ip?: string;
  userAgent?: string;
  before?: unknown;
  after?: unknown;
  diff?: AuditDiffItem[];
  createdAt: string;
};

export type AuditLogListResponse = {
  items: AuditLog[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function useInfiniteAuditLogs(params?: {
  limit?: number;
  action?: AuditAction;
  entityType?: string;
  actorId?: string;
  from?: string;
  to?: string;
}) {
  return useInfiniteQuery({
    queryKey: ['audit-logs-infinite', params],
    queryFn: async ({ pageParam }: { pageParam: number }): Promise<AuditLogListResponse> => {
      const qs = new URLSearchParams();
      qs.set('page', String(pageParam));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.action) qs.set('action', params.action);
      if (params?.entityType) qs.set('entityType', params.entityType);
      if (params?.actorId) qs.set('actorId', params.actorId);
      if (params?.from) qs.set('from', params.from);
      if (params?.to) qs.set('to', params.to);

      const endpoint = `/api/audit-logs?${qs.toString()}`;
      const res = await apiFetch(endpoint);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined;
    },
    staleTime: 10_000
  });
}

export function useAuditLogs(params?: {
  page?: number;
  limit?: number;
  action?: AuditAction;
  entityType?: string;
  actorId?: string;
  from?: string;
  to?: string;
}) {
  return useQuery({
    queryKey: ['audit-logs', params],
    queryFn: async (): Promise<AuditLogListResponse> => {
      const qs = new URLSearchParams();
      if (params?.page) qs.set('page', String(params.page));
      if (params?.limit) qs.set('limit', String(params.limit));
      if (params?.action) qs.set('action', params.action);
      if (params?.entityType) qs.set('entityType', params.entityType);
      if (params?.actorId) qs.set('actorId', params.actorId);
      if (params?.from) qs.set('from', params.from);
      if (params?.to) qs.set('to', params.to);

      const endpoint = `/api/audit-logs${qs.toString() ? `?${qs.toString()}` : ''}`;
      const res = await apiFetch(endpoint);
      return res.data;
    },
    staleTime: 10_000
  });
}
