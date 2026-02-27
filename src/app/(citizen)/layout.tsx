'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';

// ─── Types ──────────────────────────────────────────────────────────────────

interface CitizenLayoutProps {
  children: React.ReactNode;
}

// ─── Citizen Layout ─────────────────────────────────────────────────────────

export default function CitizenLayout({ children }: CitizenLayoutProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulated refresh - in production, this would trigger data refetch
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulated refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  }, []);

  // TODO: Replace with real data from auth context / notifications query
  const notificationCount = 3;
  const userName = 'Usuario';
  const avatarUrl: string | undefined = undefined;

  // Badge counts for bottom nav tabs
  const badges: Record<string, number> = {
    '/documents': 2, // e.g., 2 documents pending verification
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface dark:bg-gray-950">
      {/* Top header */}
      <Header
        notificationCount={notificationCount}
        userName={userName}
        avatarUrl={avatarUrl}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      {/* Main content area */}
      <main
        id="main-content"
        className="flex-1 overflow-y-auto pb-20"
        role="main"
      >
        <div className="max-w-lg mx-auto px-4 py-4">
          {children}
        </div>
      </main>

      {/* Bottom tab navigation */}
      <BottomNav badges={badges} />
    </div>
  );
}
