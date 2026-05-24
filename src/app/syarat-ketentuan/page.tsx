import { FloatingNavbar } from "@/components/landing/FloatingNavbar";
import { Footer } from "@/components/landing/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-[#1D9BF0] selection:text-white">
      <FloatingNavbar />
      <main className="pt-32 pb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Syarat & Ketentuan Layanan</h1>
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-neutral-300">
          <p className="mb-6">Terakhir diperbarui: 24 Mei 2026</p>
          
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Penerimaan Syarat</h2>
          <p className="mb-4">Dengan mendaftar dan menggunakan aplikasi Teras Warga, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, Anda tidak diperkenankan menggunakan platform kami.</p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. Penggunaan Platform</h2>
          <p className="mb-4">Teras Warga adalah platform komunikasi dan ekonomi untuk warga perumahan. Anda setuju untuk menggunakan platform ini hanya untuk tujuan yang sah dan sesuai dengan norma sosial kemasyarakatan.</p>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Dilarang menyebarkan ujaran kebencian, hoax, atau konten provokatif.</li>
            <li>Dilarang melakukan penipuan dalam transaksi di Marketplace Warga.</li>
            <li>Dilarang membuat akun palsu dengan identitas orang lain.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Transaksi Web3 & Marketplace</h2>
          <p className="mb-4">Teras Warga tidak bertanggung jawab atas kerugian finansial yang terjadi akibat transaksi antar warga, baik menggunakan mata uang Fiat (Rupiah) maupun Cryptocurrency. Fitur pembayaran Web3 disediakan "sebagaimana adanya" (as-is).</p>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Penghentian Akses</h2>
          <p className="mb-4">Pengurus lingkungan (RT/RW) atau administrator Teras Warga berhak untuk membekukan atau menghapus akun yang terbukti melanggar Syarat dan Ketentuan ini tanpa pemberitahuan sebelumnya.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
