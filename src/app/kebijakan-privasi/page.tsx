import { FloatingNavbar } from "@/components/landing/FloatingNavbar";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-[#1D9BF0] selection:text-white">
      <FloatingNavbar />
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Kebijakan Privasi</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-neutral-300">
          <p className="mb-6">Terakhir diperbarui: 24 Mei 2026</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Informasi yang Kami Kumpulkan</h2>
          <p className="mb-4">Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk namun tidak terbatas pada:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Nama lengkap, nama pengguna (username), dan alamat email.</li>
            <li>Data profil, termasuk alamat blok/rumah (jika diisi) dan foto profil.</li>
            <li>Konten komunikasi dalam fitur Chat dan Postingan (diamankan dengan standar modern).</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Penggunaan Informasi</h2>
          <p className="mb-4">Informasi yang dikumpulkan digunakan untuk:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Memverifikasi identitas Anda sebagai warga yang sah.</li>
            <li>Memfasilitasi interaksi sosial dan transaksi jual-beli antar tetangga.</li>
            <li>Meningkatkan layanan dan stabilitas sistem aplikasi.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Pembagian Informasi</h2>
          <p className="mb-4">Kami tidak pernah menjual data pribadi Anda kepada pihak ketiga. Informasi identitas Anda (Nama, Blok, Foto) hanya dapat dilihat oleh pengguna lain yang telah login ke dalam sistem Teras Warga.</p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Hak Anda</h2>
          <p className="mb-4">Anda memiliki hak penuh untuk meminta penghapusan akun beserta seluruh data pribadi Anda dari server kami dengan menghubungi administrator lingkungan Anda.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
