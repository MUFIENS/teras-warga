import { signup } from '@/app/login/actions'
import { GoogleLoginButton } from '@/components/auth/GoogleLoginButton'
import Link from 'next/link'
import Image from 'next/image'

export default async function RegisterPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#1D9BF0]/10 to-transparent pointer-events-none" />
      
      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-neutral-800/50 relative z-10">
        <div className="text-center">
          <Link href="/welcome" className="inline-block hover:opacity-80 transition-opacity mb-6">
            <div className="relative h-16 flex items-center justify-center">
              <Image 
                src="/logo-ai.png" 
                alt="Logo Teras Warga" 
                width={200} 
                height={64} 
                className="h-16 w-auto object-contain rounded-2xl block dark:hidden shadow-sm mx-auto"
              />
              <Image 
                src="/logo-ai-dark.png" 
                alt="Logo Teras Warga Dark" 
                width={200} 
                height={64} 
                className="h-16 w-auto object-contain rounded-2xl hidden dark:block shadow-sm shadow-white/5 mx-auto"
              />
            </div>
          </Link>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Daftar Akun Baru
          </h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">
            Bergabunglah dengan ekosistem warga digital modern
          </p>
        </div>

        {searchParams?.error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-900/50 flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {searchParams.error}
          </div>
        )}

        <form className="mt-8 space-y-5" action={signup}>
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
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nama Lengkap</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              className="appearance-none relative block w-full px-4 py-3.5 border border-gray-300 dark:border-neutral-700 placeholder-gray-400 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-white/50 dark:bg-black/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent sm:text-sm transition-all"
              placeholder="Joko Widodo"
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username Unik</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="appearance-none relative block w-full px-4 py-3.5 border border-gray-300 dark:border-neutral-700 placeholder-gray-400 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-white/50 dark:bg-black/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent sm:text-sm transition-all"
              placeholder="jokowidodo (tanpa spasi)"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Kata Sandi</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="appearance-none relative block w-full px-4 py-3.5 border border-gray-300 dark:border-neutral-700 placeholder-gray-400 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-white/50 dark:bg-black/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent sm:text-sm transition-all"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-[15px] font-semibold rounded-xl text-white bg-[#1D9BF0] hover:bg-[#1A8CD8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D9BF0] transition-all shadow-md hover:shadow-lg shadow-blue-500/20"
            >
              Daftar Sekarang
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-neutral-800" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-neutral-900 text-gray-500">Atau daftar dengan</span>
            </div>
          </div>

          <div className="mt-6">
            <GoogleLoginButton />
          </div>
        </div>

        <div className="mt-8 pt-6 text-center text-sm border-t border-gray-200 dark:border-neutral-800">
          <p className="text-gray-600 dark:text-neutral-400">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="font-semibold text-[#1D9BF0] hover:text-[#1A8CD8] transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
