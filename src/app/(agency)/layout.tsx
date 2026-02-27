'use client';

import { ReactNode } from 'react';
import { AgencySidebar } from '@/components/layout/AgencySidebar';
import { AgencyHeader } from '@/components/layout/AgencyHeader';
import { useCountry } from '@/lib/contexts/CountryContext';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AgencyLayoutProps {
  children: ReactNode;
}

// ─── Agency Layout ──────────────────────────────────────────────────────────

export default function AgencyLayout({ children }: AgencyLayoutProps) {
  const { country } = useCountry();

  // TODO: Replace with real data from auth context
  const userName = 'Funcionario';
  const userEmail = 'funcionario@agency.gov.co';
  const avatarUrl: string | undefined = undefined;
  const notificationCount = 3;

  return (
    <div className="flex h-screen overflow-hidden bg-surface dark:bg-gray-950">
      {/* Gradient top bar with country colors */}
      <div
        className="fixed top-0 left-0 right-0 h-1 z-50"
        style={{
          background: `linear-gradient(to right, ${country.colors.primary}, ${country.colors.secondary}, ${country.colors.accent})`,
        }}
      />

      {/* Sidebar navigation */}
      <AgencySidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Agency header bar */}
        <AgencyHeader
          userName={userName}
          userEmail={userEmail}
          avatarUrl={avatarUrl}
          notificationCount={notificationCount}
        />

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto pt-1"
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
