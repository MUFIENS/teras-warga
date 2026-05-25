"use client";

import { motion } from "framer-motion";
import { Store, ShoppingBag, ArrowUpRight } from "lucide-react";

export function MarketplacePreview() {
  return (
    <section className="py-32 relative bg-gray-50 dark:bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
          
          {/* Right Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800/50 text-orange-600 dark:text-orange-400 font-medium text-sm mb-8 tracking-tight">
                <Store className="w-4 h-4" />
                Ekonomi Warga
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-6 leading-tight">
                Pasar Warga & <br className="hidden lg:block"/> Integrasi Web3.
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 tracking-tight leading-relaxed">
                Punya barang tidak terpakai? Atau sedang merintis usaha kecil rumahan? Teras Warga menyediakan etalase digital tanpa biaya layanan. Anda bahkan bisa menerima pembayaran menggunakan aset Kripto!
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <div className="flex items-center gap-3 bg-white dark:bg-black px-5 py-3.5 rounded-2xl shadow-sm border border-gray-200/60 dark:border-white/5 hover:scale-[1.02] transition-transform">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 font-bold text-xs">Rp</div>
                  <span className="font-bold tracking-tight text-gray-900 dark:text-white">Rupiah Cash/Transfer</span>
                </div>
                <div className="flex items-center gap-3 bg-white dark:bg-[#0c0c0c] px-5 py-3.5 rounded-2xl shadow-lg border border-orange-200/60 dark:border-orange-900/30 hover:scale-[1.02] transition-transform relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 dark:via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 font-bold text-xs">₿</div>
                  <span className="font-bold tracking-tight text-gray-900 dark:text-white">Pembayaran Kripto</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Left Visuals - Marketplace Cards Cascade */}
          <div className="flex-1 relative w-full h-[550px] perspective-1000">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-orange-500/20 dark:bg-orange-500/10 blur-[100px] pointer-events-none" />

            {/* Card 1 - Back */}
            <motion.div
              initial={{ opacity: 0, y: 100, rotateZ: -10, scale: 0.9 }}
              whileInView={{ opacity: 0.5, y: 0, rotateZ: -5, scale: 0.95 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-10 left-10 md:left-20 w-72 bg-white dark:bg-[#111] rounded-[2rem] p-5 shadow-xl border border-gray-200/50 dark:border-white/5 z-10 origin-bottom"
            >
              <div className="h-40 bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-neutral-800 dark:to-neutral-700 rounded-2xl mb-5 flex items-center justify-center opacity-80">
                <ShoppingBag className="w-12 h-12 text-indigo-300 dark:text-neutral-500" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-1 tracking-tight">Sepeda Lipat Bekas</h4>
              <p className="text-xs text-gray-500 mb-4 line-clamp-1">Kondisi 90%, jarang dipakai.</p>
              <div className="flex items-center justify-between">
                <span className="font-black text-[#1D9BF0] tracking-tight">Rp 1.250.000</span>
              </div>
            </motion.div>

            {/* Card 2 - Front */}
            <motion.div
              initial={{ opacity: 0, y: 120, rotateZ: 10, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 40, rotateZ: 3, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-20 right-0 md:right-10 w-80 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-3xl rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-white/10 z-30 transform-gpu"
            >
              <div className="h-48 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-2xl mb-5 flex items-center justify-center relative overflow-hidden border border-orange-200/50 dark:border-orange-500/10">
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite]" />
                <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-white/10 shadow-xl">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Crypto Accepted
                </div>
                <ShoppingBag className="w-14 h-14 text-orange-400 dark:text-orange-500/50 drop-shadow-xl" />
              </div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2 tracking-tight text-lg">Kue Kering Lebaran</h4>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">Dibuat oleh Bu RT 03. Halal, Enak, & Renyah!</p>
              <div className="flex items-center justify-between bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-100 dark:border-white/5">
                <div className="flex flex-col">
                  <span className="font-black text-gray-900 dark:text-white tracking-tight">Rp 85.000</span>
                  <span className="text-[11px] text-orange-500 font-bold mt-0.5">~0.0003 ETH</span>
                </div>
                <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform cursor-pointer shadow-md">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
