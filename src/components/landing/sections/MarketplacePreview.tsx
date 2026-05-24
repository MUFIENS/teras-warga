"use client";

import { motion } from "framer-motion";
import { Store, Bitcoin, ShoppingBag, ArrowUpRight } from "lucide-react";

export function MarketplacePreview() {
  return (
    <section className="py-24 relative bg-gray-50 dark:bg-neutral-900/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
          
          {/* Right Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 font-medium text-sm mb-6">
                <Store className="w-4 h-4" />
                Ekonomi Warga
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
                Pasar Warga & Integrasi Web3
              </h2>
              <p className="text-lg text-gray-600 dark:text-neutral-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Punya barang tidak terpakai? Atau sedang merintis usaha kecil rumahan? Teras Warga menyediakan etalase digital tanpa biaya layanan. Anda bahkan bisa menerima pembayaran menggunakan aset Kripto!
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-2 bg-white dark:bg-black px-4 py-2.5 rounded-full shadow-sm border border-gray-100 dark:border-neutral-800">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">Rp</span>
                  <span className="font-semibold text-sm">Rupiah Cash/Transfer</span>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-black px-4 py-2.5 rounded-full shadow-sm border border-gray-100 dark:border-neutral-800">
                  <Bitcoin className="w-6 h-6 text-orange-500" />
                  <span className="font-semibold text-sm">Pembayaran Kripto (Web3)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Left Visuals - Marketplace Cards Parallax */}
          <div className="flex-1 relative w-full h-[500px]">
            {/* Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="absolute top-10 left-0 w-64 bg-white dark:bg-black rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-neutral-800 z-20"
            >
              <div className="h-40 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl mb-4 flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-indigo-300 dark:text-neutral-500" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Sepeda Lipat Bekas</h4>
              <p className="text-xs text-gray-500 mb-3">Kondisi 90%, jarang dipakai.</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1D9BF0]">Rp 1.250.000</span>
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                  <ArrowUpRight className="w-4 h-4 text-gray-500" />
                </div>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="absolute top-32 right-0 md:right-10 w-72 bg-white dark:bg-neutral-900 rounded-3xl p-4 shadow-2xl border border-gray-200 dark:border-neutral-700 z-30"
            >
              <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full">
                  Crypto Accepted
                </div>
                <ShoppingBag className="w-12 h-12 text-orange-300 dark:text-neutral-500" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">Kue Kering Lebaran (Pre-order)</h4>
              <p className="text-xs text-gray-500 mb-3">Dibuat oleh Bu RT 03. Halal & Enak!</p>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-[#1D9BF0]">Rp 85.000</span>
                  <span className="text-[10px] text-gray-500 font-medium">~0.0003 ETH</span>
                </div>
                <button className="bg-[#1D9BF0] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#1A8CD8] transition-colors">
                  Beli
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
