import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api/client';
import type {
  MockCitizen,
  ActivityLogEntry,
  DailyAnalytics,
  DepartmentStats,
  IssuedDocument,
} from '@/lib/mock/adminData';
import type { IssueDocumentInput } from '@/lib/validations';

// ─── Query key factory ──────────────────────────────────────────────────────

export const adminKeys = {
  all: ['admin'] as const,
  citizens: (params?: { query?: string; page?: number; limit?: number }) =>
    [...adminKeys.all, 'citizens', params ?? {}] as const,
  citizen: (id: string) => [...adminKeys.all, 'citizens', id] as const,
  analytics: () => [...adminKeys.all, 'analytics'] as const,
  activity: () => [...adminKeys.all, 'activity'] as const,
};

// ─── Types ──────────────────────────────────────────────────────────────────

interface AdminCitizensParams {
  query?: string;
  page?: number;
  limit?: number;
}

interface AnalyticsData {
  daily: DailyAnalytics[];
  stats: Record<string, unknown>;
  departments: DepartmentStats[];
}

// ─── Citizens list (search + paginate) ──────────────────────────────────────

export function useAdminCitizens(params?: AdminCitizensParams) {
  return useQuery({
    queryKey: adminKeys.citizens(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.query) searchParams.set('query', params.query);
      if (params?.page) searchParams.set('page', String(params.page));
      if (params?.limit) searchParams.set('limit', String(params.limit));
      const qs = searchParams.toString();
      const url = `/api/admin/citizens${qs ? `?${qs}` : ''}`;
      const result = await fetchApi<MockCitizen[]>(url);
      return { citizens: result.data, meta: result.meta };
    },
  });
}

// ─── Single citizen detail ──────────────────────────────────────────────────

export function useAdminCitizen(id: string) {
  return useQuery({
    queryKey: adminKeys.citizen(id),
    queryFn: () =>
      fetchApi<MockCitizen>(`/api/admin/citizens/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

// ─── Update citizen status ──────────────────────────────────────────────────

export function useUpdateCitizenStatus(csrfToken?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      citizenId,
      status,
      reason,
    }: {
      citizenId: string;
      status: string;
      reason: string;
    }) =>
      fetchApi<{ citizenId: string; status: string }>(
        `/api/admin/citizens/${citizenId}/status`,
        {
          method: 'PUT',
          body: JSON.stringify({ status, reason }),
          headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
        }
      ).then((r) => r.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.citizens() });
      queryClient.invalidateQueries({
        queryKey: adminKeys.citizen(variables.citizenId),
      });
    },
  });
}

// ─── Analytics ──────────────────────────────────────────────────────────────

export function useAdminAnalytics() {
  return useQuery({
    queryKey: adminKeys.analytics(),
    queryFn: () =>
      fetchApi<AnalyticsData>('/api/admin/analytics').then((r) => r.data),
  });
}

// ─── Activity log ───────────────────────────────────────────────────────────

export function useAdminActivity() {
  return useQuery({
    queryKey: adminKeys.activity(),
    queryFn: () =>
      fetchApi<ActivityLogEntry[]>('/api/admin/activity').then((r) => r.data),
  });
}

// ─── Issue document ─────────────────────────────────────────────────────────

export function useIssueDocument(csrfToken?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IssueDocumentInput) =>
      fetchApi<IssuedDocument>('/api/admin/documents', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.citizens() });
    },
  });
}
