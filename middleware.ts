import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJwt } from './lib/auth';

// Middleware protects routes

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return NextResponse.redirect(new URL('/login', request.url));

  try {
    verifyJwt(token);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};