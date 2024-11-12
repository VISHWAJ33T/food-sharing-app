import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // console.log('token', token);

  const publicPaths = ['/login', '/register', '/about'];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  const isRootPath = request.nextUrl.pathname === '/';

  if (!token && !isPublicPath && !isRootPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  if (token && !token?.userType) {
    return NextResponse.redirect(new URL('/user-type', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
