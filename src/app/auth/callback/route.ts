import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && authData?.user) {
      const user = authData.user;
      
      // Amankan pembuatan profil jika menggunakan Google OAuth (berjaga-jaga jika trigger DB tidak mencakup SSO)
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!profile) {
        // Buat username unik dan aman dari email atau nama Google
        const baseName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'warga'
        const safeUsername = baseName.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.floor(Math.random() * 1000)
        
        await supabase.from('profiles').insert({
          id: user.id,
          full_name: user.user_metadata?.full_name || 'Warga Baru',
          username: safeUsername,
          avatar_url: user.user_metadata?.avatar_url || null,
        })
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=Invalid%20Auth%20Callback`)
}
