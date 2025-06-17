'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ManagementProfileRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace('/management/superadmin/profile');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      <p className="ml-4 text-gray-600">Redirecting to profile page...</p>
    </div>
  );
} 