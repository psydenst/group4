// middleware.ts (na raiz do projeto, mesmo nível do app/)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Lista de emails admin
const ADMIN_EMAILS = [
  'psydenst.dev@gmail.com',
];

export async function middleware(request: NextRequest) {
  // Só verifica rotas que começam com /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    try {
      // Pega o token dos cookies do Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
      
		 	const supabase = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: {
            getItem: (key: string) => {
              return request.cookies.get(key)?.value || null;
            },
            setItem: () => {},
            removeItem: () => {},
          }
        }
      });

      const { data: { user } } = await supabase.auth.getUser();

      // Se não está logado OU não é admin, redireciona para home
      if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // Se chegou até aqui, é admin - permite acesso
      return NextResponse.next();

    } catch (error) {
      // Em caso de erro, redireciona para login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Para outras rotas, continua normalmente
  return NextResponse.next();
}

// Configura quais rotas o middleware deve interceptar
export const config = {
  matcher: ['/admin/:path*'] // Intercepta /admin e todas as subrotas
};
