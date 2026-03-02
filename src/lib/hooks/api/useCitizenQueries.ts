import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api/client';
import type {
  CitizenProfile,
  DocumentRecord,
  VehicleRecord,
  HealthRecord,
  FamilyMember,
  WorkRecord,
  AppointmentRecord,
  NotificationRecord,
} from '@/lib/mock/citizenData';
import type { UpdateProfileInput, AppointmentBookingInput } from '@/lib/validations';

// ─── Query key factory ──────────────────────────────────────────────────────

export const citizenKeys = {
  all: ['citizen'] as const,
  profile: () => [...citizenKeys.all, 'profile'] as const,
  documents: () => [...citizenKeys.all, 'documents'] as const,
  document: (id: string) => [...citizenKeys.all, 'documents', id] as const,
  vehicles: () => [...citizenKeys.all, 'vehicles'] as const,
  health: () => [...citizenKeys.all, 'health'] as const,
  family: () => [...citizenKeys.all, 'family'] as const,
  work: () => [...citizenKeys.all, 'work'] as const,
  appointments: () => [...citizenKeys.all, 'appointments'] as const,
  notifications: () => [...citizenKeys.all, 'notifications'] as const,
};

// ─── Profile ────────────────────────────────────────────────────────────────

export function useCitizenProfile() {
  return useQuery({
    queryKey: citizenKeys.profile(),
    queryFn: () =>
      fetchApi<CitizenProfile>('/api/citizens/profile').then((r) => r.data),
  });
}

export function useUpdateProfile(csrfToken?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateProfileInput) =>
      fetchApi<CitizenProfile>('/api/citizens/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: citizenKeys.profile() });
    },
  });
}

// ─── Documents ──────────────────────────────────────────────────────────────

export function useCitizenDocuments() {
  return useQuery({
    queryKey: citizenKeys.documents(),
    queryFn: () =>
      fetchApi<DocumentRecord[]>('/api/citizens/documents').then((r) => r.data),
  });
}

export function useCitizenDocument(id: string) {
  return useQuery({
    queryKey: citizenKeys.document(id),
    queryFn: () =>
      fetchApi<DocumentRecord>(`/api/citizens/documents/${id}`).then(
        (r) => r.data
      ),
    enabled: !!id,
  });
}

// ─── Vehicles ───────────────────────────────────────────────────────────────

export function useCitizenVehicles() {
  return useQuery({
    queryKey: citizenKeys.vehicles(),
    queryFn: () =>
      fetchApi<VehicleRecord[]>('/api/citizens/vehicles').then((r) => r.data),
  });
}

// ─── Health ─────────────────────────────────────────────────────────────────

export function useCitizenHealth() {
  return useQuery({
    queryKey: citizenKeys.health(),
    queryFn: () =>
      fetchApi<HealthRecord>('/api/citizens/health').then((r) => r.data),
  });
}

// ─── Family ─────────────────────────────────────────────────────────────────

export function useCitizenFamily() {
  return useQuery({
    queryKey: citizenKeys.family(),
    queryFn: () =>
      fetchApi<FamilyMember[]>('/api/citizens/family').then((r) => r.data),
  });
}

// ─── Work / Tax ─────────────────────────────────────────────────────────────

export function useCitizenWork() {
  return useQuery({
    queryKey: citizenKeys.work(),
    queryFn: () =>
      fetchApi<WorkRecord>('/api/citizens/work').then((r) => r.data),
  });
}

// ─── Appointments ───────────────────────────────────────────────────────────

export function useCitizenAppointments() {
  return useQuery({
    queryKey: citizenKeys.appointments(),
    queryFn: () =>
      fetchApi<AppointmentRecord[]>('/api/citizens/appointments').then(
        (r) => r.data
      ),
  });
}

export function useBookAppointment(csrfToken?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: AppointmentBookingInput) =>
      fetchApi<AppointmentRecord>('/api/citizens/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : undefined,
      }).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: citizenKeys.appointments() });
    },
  });
}

// ─── Notifications ──────────────────────────────────────────────────────────

export function useCitizenNotifications() {
  return useQuery({
    queryKey: citizenKeys.notifications(),
    queryFn: async () => {
      const result = await fetchApi<NotificationRecord[]>(
        '/api/citizens/notifications'
      );
      return { notifications: result.data, meta: result.meta };
    },
  });
}
