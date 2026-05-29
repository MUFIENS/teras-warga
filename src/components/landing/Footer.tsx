import Link from "next/link";
import Image from "next/image";

const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.975H5.036z" />
  </svg>
);

const GithubIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-neutral-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-2">
            <Link href="/welcome" className="flex items-center gap-2 mb-4">
              <div className="relative h-10 flex items-center justify-center">
                <Image 
                  src="/logo-ai.png" 
                  alt="Logo Teras Warga" 
                  width={150} 
                  height={50} 
                  className="h-10 w-auto object-contain rounded-xl block dark:hidden grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
                <Image 
                  src="/logo-ai-dark.png" 
                  alt="Logo Teras Warga Dark" 
                  width={150} 
                  height={50} 
                  className="h-10 w-auto object-contain rounded-xl hidden dark:block grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                />
              </div>
            </Link>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6 max-w-sm">
              Membangun ekosistem warga digital yang modern, aman, dan terintegrasi untuk masa depan lingkungan perumahan yang lebih cerdas.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#1D9BF0] transition-colors"><XIcon className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#1D9BF0] transition-colors"><GithubIcon className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#1D9BF0] transition-colors"><LinkedinIcon className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Produk</h4>
            <ul className="space-y-3">
              <li><Link href="/welcome#features" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Marketplace Web3</Link></li>
              <li><Link href="/welcome#features" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Real-time Chat</Link></li>
              <li><Link href="/welcome#features" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Laporan RT/RW</Link></li>
              <li><Link href="/welcome#features" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Sistem Kas Warga</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link href="/syarat-ketentuan" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/kebijakan-privasi" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/keamanan-data" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Keamanan Data</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-neutral-500">
            &copy; {new Date().getFullYear()} Teras Warga. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4">
            <span className="text-sm text-gray-500 dark:text-neutral-500">Dibuat oleh MUFIEN</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
