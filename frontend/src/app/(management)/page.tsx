'use client';

// This is the management home redirect page
// We will move the content to a different file path to avoid conflicts
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ManagementRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to a specific dashboard by role instead of generic dashboard
    router.replace('/management/superadmin/dashboard');
  }, [router]);
  
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      <p className="ml-4 text-gray-600">Redirecting to dashboard...</p>
    </div>
  );
} 