'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-colombia-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-secondary">Redirigiendo al panel...</p>
      </div>
    </div>
  );
}
