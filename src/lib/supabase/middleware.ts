import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // Inject custom header for layout to determine public vs private layouts
  supabaseResponse.headers.set('x-pathname', request.nextUrl.pathname)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          
          // Re-inject header if we recreate the response
          supabaseResponse.headers.set('x-pathname', request.nextUrl.pathname)

          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isPublicPath = pathname.startsWith('/welcome') || pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/auth')

  // Unauthenticated user trying to access protected routes
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone()
    url.pathname = '/welcome'
    return NextResponse.redirect(url)
  }

  // Authenticated user trying to access public marketing/auth pages
  if (user && isPublicPath && !pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
