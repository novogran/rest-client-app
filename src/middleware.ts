import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const protectedRoutes = ['/rest-client', '/variables', '/history'];
const authRoutes = ['/auth/signIn', '/auth/signUp'];

const intlMiddleware = createIntlMiddleware(routing);

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (
    path.startsWith('/_next') ||
    path.startsWith('/api/') ||
    path.includes('.')
  ) {
    return NextResponse.next();
  }

  const pathWithoutLocale = path.replace(/^\/(ru|en)\//, '/');
  const locale = path.split('/')[1] || routing.defaultLocale;

  const sessionCookie = req.cookies.get('session')?.value;
  const isAuthenticated = !!sessionCookie;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );
  const isAuthRoute = authRoutes.includes(pathWithoutLocale);

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(`/${locale}`, req.url));
  }
  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL(`/${locale}/auth/signIn`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico)$).*)',
  ],
};
