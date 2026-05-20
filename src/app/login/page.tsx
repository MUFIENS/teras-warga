import { login, signup } from './actions'

export default async function LoginPage(props: { searchParams: Promise<{ error?: string }> }) {
  const searchParams = await props.searchParams;
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-neutral-800">
        <div className="text-center">
          <div className="h-12 w-12 rounded-full bg-[#1D9BF0] mx-auto flex items-center justify-center text-white font-bold text-xl mb-4">
            TW
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white">
            Masuk ke Teras Warga
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400">
            Akses informasi dan terhubung dengan warga lainnya.
          </p>
        </div>

        {searchParams?.error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm border border-red-100">
            {searchParams.error}
          </div>
        )}

        <form className="mt-8 space-y-6" action={login}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent sm:text-sm"
                placeholder="Alamat Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent sm:text-sm"
                placeholder="Kata Sandi"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-full text-white bg-[#1D9BF0] hover:bg-[#1A8CD8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D9BF0] transition-colors duration-200"
            >
              Masuk
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-gray-200 dark:border-neutral-800 pt-6">
          <p className="text-center text-sm font-medium text-gray-700 dark:text-neutral-300 mb-4">
            Belum punya akun warga?
          </p>
          <form action={signup} className="space-y-4">
            <input
              name="email"
              type="email"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent sm:text-sm"
              placeholder="Email Baru"
            />
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent sm:text-sm"
              placeholder="Kata Sandi Baru"
            />
            <input
              name="full_name"
              type="text"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent sm:text-sm"
              placeholder="Nama Lengkap"
            />
            <input
              name="username"
              type="text"
              required
              className="appearance-none relative block w-full px-4 py-3 border border-gray-300 dark:border-neutral-700 placeholder-gray-500 dark:placeholder-neutral-500 text-gray-900 dark:text-white bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent sm:text-sm"
              placeholder="Username Unik (tanpa spasi)"
            />
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 dark:border-neutral-700 text-sm font-semibold rounded-full text-gray-700 dark:text-white bg-transparent hover:bg-gray-50 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D9BF0] transition-colors duration-200"
            >
              Daftar Sekarang
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
