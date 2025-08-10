import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Adicionar headers de segurança
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Se a URL contém parâmetros sensíveis do OAuth, redireciona para a mesma página sem parâmetros
  const url = request.nextUrl.clone();
  const sensitiveParams = [
    'access_token',
    'refresh_token',
    'expires_in',
    'token_type',
    'type',
    'code',
    'state'
  ];

  let hasParams = false;
  sensitiveParams.forEach(param => {
    if (url.searchParams.has(param)) {
      hasParams = true;
      url.searchParams.delete(param);
    }
  });

  // Remove hash fragments no lado do servidor (se possível)
  if (url.hash) {
    url.hash = '';
    hasParams = true;
  }

  // Se removemos parâmetros, redireciona para URL limpa
  if (hasParams) {
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
