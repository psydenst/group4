// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const supabase = createRouteHandlerClient({ cookies })

  if (!code) {
    return NextResponse.redirect(new URL('/login', url.origin))
  }

  // <- aqui: string
  await supabase.auth.exchangeCodeForSession(code)

  return NextResponse.redirect(new URL('/', url.origin))
}



