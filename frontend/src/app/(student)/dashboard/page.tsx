'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function StudentDashboardRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/student-dashboard');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      <p className="ml-4 text-gray-600">Redirecting to student dashboard...</p>
    </div>
  );
} 