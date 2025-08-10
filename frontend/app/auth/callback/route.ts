// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const next = url.searchParams.get('next') || '/' // default: home
  const supabase = createRouteHandlerClient({ cookies })

  const code = url.searchParams.get('code')
  if (code) {
    // use a assinatura que sua versão aceitar (string ou searchParams)
    await supabase.auth.exchangeCodeForSession(code)
    // ou, se o TS reclamar nessa versão:
    // await supabase.auth.exchangeCodeForSession(url.searchParams)
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
