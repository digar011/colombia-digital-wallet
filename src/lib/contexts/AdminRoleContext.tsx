'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

// ─── Types ──────────────────────────────────────────────────────────────────

type AdminRole = 'admin' | 'super_admin';

interface AdminRoleContextValue {
  adminRole: AdminRole;
  isSuperAdmin: boolean;
  toggleRole: () => void;
}

// ─── Context ────────────────────────────────────────────────────────────────

const AdminRoleContext = createContext<AdminRoleContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function AdminRoleProvider({ children }: { children: React.ReactNode }) {
  const [adminRole, setAdminRole] = useState<AdminRole>('admin');

  const toggleRole = useCallback(() => {
    setAdminRole((prev) => (prev === 'admin' ? 'super_admin' : 'admin'));
  }, []);

  return (
    <AdminRoleContext.Provider
      value={{
        adminRole,
        isSuperAdmin: adminRole === 'super_admin',
        toggleRole,
      }}
    >
      {children}
    </AdminRoleContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAdminRole(): AdminRoleContextValue {
  const context = useContext(AdminRoleContext);
  if (!context) {
    throw new Error('useAdminRole must be used within an AdminRoleProvider');
  }
  return context;
}
