import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');

  const signInURL = new URL('/', request.url);
  const dashboardURL = new URL('/dashboard', request.url);

  let verificacaoADM = false;
  let verificacaoTransferencia = false;

  if (!token) {
    if (request.nextUrl.pathname === '/') {
      return NextResponse.next();
    }

    return NextResponse.redirect(signInURL);
  }

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(dashboardURL);
  }

  if (request.nextUrl.pathname === '/dashboard/admin') {
    const cookieKeys = Object.keys(request.cookies);

    for (let i = 0; i < cookieKeys.length; i++) {
      if (request.cookies.get(`role_user${i}`)?.value === 'ADMINISTRADOR') {
        verificacaoADM = true;
      }
    }
    if (!verificacaoADM) {
      return NextResponse.redirect(signInURL);
    }
  }

  if (request.nextUrl.pathname === '/dashboard/transferencia') {
    const cookieKeys = Object.keys(request.cookies);

    for (let i = 0; i <= cookieKeys.length; i++) {
      if (request.cookies.get(`role_user${i}`)?.value === 'TRANSFERENCIA') {
        verificacaoTransferencia = true;
      }
    }
    if (!verificacaoTransferencia) {
      return NextResponse.redirect(signInURL);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
