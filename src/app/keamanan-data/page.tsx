import { FloatingNavbar } from "@/components/landing/FloatingNavbar";
import { Footer } from "@/components/landing/Footer";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-[#1D9BF0] selection:text-white">
      <FloatingNavbar />
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Keamanan Data</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-neutral-300">
          <p className="mb-6">Terakhir diperbarui: 24 Mei 2026</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Standar Infrastruktur</h2>
          <p className="mb-4">Teras Warga dibangun di atas teknologi *Cloud* modern (Edge Computing dan Supabase) yang memastikan setiap bit data yang ditransmisikan antara perangkat Anda dan server kami dienkripsi menggunakan protokol standar industri (SSL/TLS).</p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Enkripsi Kata Sandi</h2>
          <p className="mb-4">Kata sandi Anda tidak pernah disimpan dalam bentuk teks biasa. Kami menggunakan algoritma *hashing* kriptografik tingkat tinggi untuk memastikan bahwa tidak ada siapapun, termasuk tim pengembang kami, yang dapat membaca kata sandi Anda.</p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Keamanan Transaksi Web3</h2>
          <p className="mb-4">Fitur Marketplace Web3 berinteraksi langsung dengan *Smart Contracts* di jaringan Blockchain yang terdesentralisasi. Teras Warga **tidak menyimpan** *Private Key* atau Frasa Pemulihan (*Seed Phrase*) dompet kripto Anda. Segala tanggung jawab penyimpanan *wallet* berada sepenuhnya di tangan pengguna.</p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Kebijakan Anti-Spam dan Bot</h2>
          <p className="mb-4">Kami memiliki sistem pemantauan yang melarang keras aktivitas bot (otomatisasi) untuk mencuri data warga atau mengirim pesan spam ke lingkungan Anda. Sistem secara otomatis akan memblokir alamat IP yang mencurigakan.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
