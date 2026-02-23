'use client';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AuthLayoutProps {
  children: React.ReactNode;
}

// ─── Auth Layout ────────────────────────────────────────────────────────────
// Each auth page (login, register, verify) manages its own full-page layout
// including branding, top bars, and footers. This layout is a simple wrapper.

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <>{children}</>;
}
