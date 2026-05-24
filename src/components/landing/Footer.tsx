import Link from "next/link";
import { Home, Twitter, Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t border-gray-200 dark:border-neutral-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="md:col-span-1">
            <Link href="/welcome" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-[#1D9BF0] flex items-center justify-center text-white">
                <Home className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Teras Warga</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">
              Membangun ekosistem warga digital yang modern, aman, dan terintegrasi untuk masa depan yang lebih baik.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[#1D9BF0] transition-colors"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#1D9BF0] transition-colors"><Github className="w-5 h-5" /></a>
              <a href="#" className="text-gray-400 hover:text-[#1D9BF0] transition-colors"><Linkedin className="w-5 h-5" /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Produk</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Marketplace Web3</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Real-time Chat</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Laporan RT/RW</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Sistem Kas Warga</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Perusahaan</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Tentang Kami</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Karir</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Kontak</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 dark:text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="text-sm text-gray-500 hover:text-[#1D9BF0] transition-colors">Keamanan Data</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-neutral-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500 dark:text-neutral-500">
            &copy; {new Date().getFullYear()} Teras Warga. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-4">
            <span className="text-sm text-gray-500 dark:text-neutral-500">Dibuat dengan ❤️ di Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
