import { type NextRequest, NextResponse } from 'next/server';

// just checks if access_token cookie exists, redirects to /login if not

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/forget_password',
  '/reset_password',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/forgot_pw',
  '/api/auth/reset_pw',
  '/helpline',
];

export async function middleware(request: NextRequest) {
  const access = request.cookies.get('cm_access_token')?.value;
  const refresh = request.cookies.get('cm_refresh_token')?.value;

  const { pathname } = request.nextUrl;

  // Allow public paths and static assets through
  const isPublic =
    PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/api/auth/');
  if (isPublic) {
    return NextResponse.next();
  }

  // Check for access token cookie
  const token = request.cookies.get('cm_refresh_token')?.value;
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
