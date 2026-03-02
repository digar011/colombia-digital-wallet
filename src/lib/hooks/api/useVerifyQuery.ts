import { useQuery } from '@tanstack/react-query';
import { fetchApi } from '@/lib/api/client';

// ─── Types ──────────────────────────────────────────────────────────────────

interface VerificationResult {
  verified: boolean;
  document: {
    id: string;
    type: string;
    citizenName: string;
    documentNumber: string;
    status: string;
    issuedAt: string;
    expiresAt: string;
    issuedBy: string;
  } | null;
}

// ─── Query key factory ──────────────────────────────────────────────────────

export const verifyKeys = {
  document: (id: string) => ['verify', id] as const,
};

// ─── Public document verification ───────────────────────────────────────────

export function useVerifyDocument(id: string) {
  return useQuery({
    queryKey: verifyKeys.document(id),
    queryFn: () =>
      fetchApi<VerificationResult>(`/api/verify/${id}`).then((r) => r.data),
    enabled: !!id,
    // Verification results should not be cached for long
    staleTime: 30_000, // 30 seconds
  });
}
