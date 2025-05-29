import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define paths by role (consistent path patterns)
const roleBasedPaths = {
  student: ['/student'],
  teacher: ['/teacher'],
  principal: ['/principal'],
  'school-admin': ['/school-admin'],
  'super-admin': ['/super-admin']
};

// Define public paths that should be accessible without authentication
const publicPaths = [
  '/',
  '/api/auth',
  '/_next',
  '/static',
  '/images',
  '/favicon.ico',
];

// Define auth paths that should redirect to dashboard if already authenticated
const authPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Get tokens from cookies
  const accessToken = request.cookies.get('accessToken')?.value;
  
  // For mock/demo mode, check localStorage (which isn't accessible in middleware)
  // Instead we'll set a cookie when logging in with mock data
  const mockUserCookie = request.cookies.get('mockUser')?.value;
  
  // Check if the path is an auth path
  const isAuthPath = authPaths.some(path => pathname.startsWith(path));

  // If accessing auth pages while logged in, redirect to appropriate dashboard based on role
  if (isAuthPath && (accessToken || mockUserCookie)) {
    try {
      let userRole = null;
      
      // First check for mock user cookie
      if (mockUserCookie) {
        const mockUser = JSON.parse(mockUserCookie);
        userRole = mockUser.role;
      } 
      // Then try to parse JWT if available (for real implementation)
      else if (accessToken) {
        const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
        userRole = tokenData.role;
      }
      
      // Redirect to appropriate dashboard
      if (userRole) {
        let dashboardPath = '/';
        const normalizedRole = userRole.toLowerCase();
        if (normalizedRole === 'student') dashboardPath = '/student/dashboard';
        else if (normalizedRole === 'teacher') dashboardPath = '/teacher/dashboard';
        else if (normalizedRole === 'principal') dashboardPath = '/principal/dashboard';
        else if (normalizedRole === 'schooladmin' || normalizedRole === 'school-admin') dashboardPath = '/school-admin/dashboard';
        else if (normalizedRole === 'superadmin' || normalizedRole === 'super-admin') dashboardPath = '/super-admin/dashboard';
        
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      }
    } catch (error) {
      // If token parsing fails, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Check if accessing role-based protected paths
  const isRoleBasedPath = Object.values(roleBasedPaths).flat().some(path => 
    pathname.startsWith(path)
  );

  // If accessing protected routes without token, redirect to login
  if (isRoleBasedPath && !accessToken && !mockUserCookie) {
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.set({
      name: 'redirectTo',
      value: pathname,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return response;
  }

  // For role-based paths, verify correct role access
  if (isRoleBasedPath && (accessToken || mockUserCookie)) {
    try {
      let userRole = null;
      
      // First check for mock user cookie
      if (mockUserCookie) {
        const mockUser = JSON.parse(mockUserCookie);
        userRole = mockUser.role;
      } 
      // Then try to parse JWT if available (for real implementation)
      else if (accessToken) {
        const tokenData = JSON.parse(atob(accessToken.split('.')[1]));
        userRole = tokenData.role;
      }
      
      if (!userRole) {
        throw new Error('No role found');
      }
      
      // Check if user has access to this path
      let hasAccess = false;
      
      // Normalize role for comparison (handle both camelCase and kebab-case)
      const normalizedRole = userRole.toLowerCase();
      
      // Check if the current path starts with any of the paths allowed for the user's role
      if (normalizedRole === 'student' && pathname.startsWith('/student')) {
        hasAccess = true;
      } else if (normalizedRole === 'teacher' && pathname.startsWith('/teacher')) {
        hasAccess = true;
      } else if (normalizedRole === 'principal' && pathname.startsWith('/principal')) {
        hasAccess = true;
      } else if ((normalizedRole === 'schooladmin' || normalizedRole === 'school-admin') && 
                pathname.startsWith('/school-admin')) {
        hasAccess = true;
      } else if ((normalizedRole === 'superadmin' || normalizedRole === 'super-admin') && 
                pathname.startsWith('/super-admin')) {
        hasAccess = true;
      }
      
      // If no access, redirect to appropriate dashboard
      if (!hasAccess) {
        let dashboardPath = '/';
        const normalizedRole = userRole.toLowerCase();
        if (normalizedRole === 'student') dashboardPath = '/student/dashboard';
        else if (normalizedRole === 'teacher') dashboardPath = '/teacher/dashboard';
        else if (normalizedRole === 'principal') dashboardPath = '/principal/dashboard';
        else if (normalizedRole === 'schooladmin' || normalizedRole === 'school-admin') dashboardPath = '/school-admin/dashboard';
        else if (normalizedRole === 'superadmin' || normalizedRole === 'super-admin') dashboardPath = '/super-admin/dashboard';
        
        return NextResponse.redirect(new URL(dashboardPath, request.url));
      }
    } catch (error) {
      // If token parsing fails, redirect to login
      const response = NextResponse.redirect(new URL('/auth/login', request.url));
      response.cookies.set({
        name: 'redirectTo',
        value: pathname,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
      });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 