'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { AdminRoleProvider, useAdminRole } from '@/lib/contexts/AdminRoleContext';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AdminLayoutProps {
  children: React.ReactNode;
}

// ─── Inner Layout (consumes AdminRoleContext) ───────────────────────────────

function AdminLayoutInner({ children }: AdminLayoutProps) {
  const { adminRole } = useAdminRole();

  // TODO: Replace with real data from auth context
  const userName = 'Administrador';
  const userEmail = 'admin@colombia.gov.co';
  const avatarUrl: string | undefined = undefined;
  const notificationCount = 5;

  return (
    <div className="flex h-screen overflow-hidden bg-surface dark:bg-gray-950">
      {/* Sidebar navigation */}
      <Sidebar role={adminRole === 'super_admin' ? 'super admin' : 'admin'} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin top bar */}
        <AdminHeader
          userName={userName}
          userEmail={userEmail}
          avatarUrl={avatarUrl}
          notificationCount={notificationCount}
        />

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto"
          role="main"
        >
          <div className="p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Admin Layout ───────────────────────────────────────────────────────────

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <AdminRoleProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminRoleProvider>
  );
}
