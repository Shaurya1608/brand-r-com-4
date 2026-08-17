import { NextResponse } from 'next/server';

/**
 * Next.js Edge Middleware — Route Protection for Admin Panel
 *
 * Protects all /dashboard routes by checking for the 'admin_token' cookie.
 * If not present, redirects the user to the login page (/).
 * If the user is already logged in and visits /, redirects to /dashboard.
 */
export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('admin_token')?.value;

  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isLoginRoute = pathname === '/';

  // Redirect unauthenticated users trying to access /dashboard/*
  if (isDashboardRoute && !token) {
    const loginUrl = new URL('/', request.url);
    // Preserve the originally requested path so we can redirect back after login
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect already-authenticated users away from the login page
  if (isLoginRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run on all routes except Next.js internals and static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo).*)'],
};
