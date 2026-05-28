import { login, loginWithGoogle } from './actions'
import Link from 'next/link'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradients similar to landing page to maintain feel */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#1D9BF0]/10 to-transparent pointer-events-none" />
      
      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-neutral-800/50 relative z-10">
        <div className="text-center">
          <Link href="/welcome" className="inline-block hover:opacity-80 transition-opacity">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#1D9BF0] to-[#0d7ac5] mx-auto flex items-center justify-center text-white font-black text-2xl mb-6 shadow-lg shadow-blue-500/30">
              TW
            </div>
          </Link>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Masuk ke Akun
          </h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">
            Selamat datang kembali di Teras Warga
          </p>
        </div>

        {searchParams?.error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {searchParams.error}
          </div>
        )}

        <form className="mt-8 space-y-6" action={login}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Alamat Email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3.5 border border-gray-300 dark:border-neutral-700 placeholder-gray-400 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-white/50 dark:bg-black/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent sm:text-sm transition-all"
                placeholder="nama@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kata Sandi</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3.5 border border-gray-300 dark:border-neutral-700 placeholder-gray-400 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-white/50 dark:bg-black/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent sm:text-sm transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-[15px] font-semibold rounded-xl text-white bg-[#1D9BF0] hover:bg-[#1A8CD8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D9BF0] transition-all shadow-md hover:shadow-lg shadow-blue-500/20"
            >
              Masuk Sekarang
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-neutral-900 text-gray-500">Atau lanjutkan dengan</span>
            </div>
          </div>

          <div className="mt-6">
            <form action={loginWithGoogle}>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors font-medium shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-6 text-center text-sm">
          <p className="text-gray-600 dark:text-neutral-400">
            Belum punya akun warga?{' '}
            <Link href="/register" className="font-semibold text-[#1D9BF0] hover:text-[#1A8CD8] transition-colors">
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
