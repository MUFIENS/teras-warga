"use client";

import { motion } from "framer-motion";
import { Store, ShoppingBag, ArrowRight } from "lucide-react";

export function MarketplacePreview() {
  return (
    <section className="py-32 relative bg-gray-50 dark:bg-black overflow-hidden border-t border-gray-100 dark:border-neutral-900">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full" />
                <span className="text-sm font-semibold tracking-wide uppercase text-neutral-900 dark:text-white">Ekonomi Warga</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
                Pasar Warga & <br className="hidden lg:block"/> Integrasi Kripto.
              </h2>
              <p className="text-lg text-gray-500 dark:text-neutral-400 mb-10 max-w-xl mx-auto lg:mx-0 tracking-tight leading-relaxed font-light">
                Punya barang tidak terpakai? Atau sedang merintis usaha kecil rumahan? Teras Warga menyediakan etalase digital tanpa biaya layanan. Bangun ekonomi sirkular langsung di lingkungan Anda.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <motion.div 
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex items-center gap-3 bg-white dark:bg-[#0a0a0a] px-5 py-3.5 rounded-full border border-gray-200 dark:border-neutral-800 shadow-sm cursor-default"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white font-medium text-[10px]">Rp</div>
                  <span className="font-medium text-sm tracking-tight text-gray-900 dark:text-white">IDR Transfer</span>
                </motion.div>
                <motion.div 
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex items-center gap-3 bg-white dark:bg-[#0a0a0a] px-5 py-3.5 rounded-full border border-gray-200 dark:border-neutral-800 shadow-sm cursor-default"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#2775CA]/10">
                    <svg className="w-3.5 h-3.5 text-[#2775CA]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm-1.89-16.71c2.19-.54 4.79-.16 6.35 1.57.94.99 1.45 2.37 1.45 3.84 0 1.95-.91 3.75-2.48 4.77-2.09 1.34-4.73 1.53-7.14 1.13-1.04-.17-1.87-1.01-2-2.06-.11-1.05.62-2.01 1.63-2.14 1.15-.14 2.31-.05 3.39.31 1.25.4 2.22-.38 2.22-1.39 0-1.12-1.01-1.57-2.31-1.85-.75-.16-1.55-.22-2.32-.42-1.29-.35-2.3-1.15-2.61-2.52-.3-1.31.25-2.65 1.35-3.32 1.05-.62 2.34-.82 3.48-.96l-1.01 2.04z"/>
                    </svg>
                  </div>
                  <span className="font-medium text-sm tracking-tight text-gray-900 dark:text-white">USDC Supported</span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Visuals - Structured Marketplace Cascade */}
          <div className="flex-1 relative w-full h-[600px] perspective-1000">

            {/* Back Card */}
            <motion.div
              initial={{ opacity: 0, y: 100, x: -30, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 40, x: 0, scale: 0.95 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-10 left-0 md:left-10 w-72 bg-gray-100 dark:bg-[#0a0a0a] rounded-2xl p-4 border border-gray-200 dark:border-neutral-800 z-10"
            >
              <div className="h-40 bg-gray-200 dark:bg-neutral-900 rounded-xl mb-4" />
              <div className="h-4 w-3/4 bg-gray-200 dark:bg-neutral-900 rounded mb-2" />
              <div className="h-3 w-1/2 bg-gray-200 dark:bg-neutral-900 rounded mb-4" />
              <div className="flex items-center justify-between mt-6">
                <div className="h-4 w-1/3 bg-gray-200 dark:bg-neutral-800 rounded" />
              </div>
            </motion.div>

            {/* Middle Card */}
            <motion.div
              initial={{ opacity: 0, y: 120, x: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 80, x: 50, scale: 0.98 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-20 right-0 md:right-10 w-72 bg-white dark:bg-[#050505] rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.4)] border border-gray-200 dark:border-neutral-800 z-20"
            >
              <div className="h-36 bg-gray-100 dark:bg-neutral-900 rounded-xl mb-4 flex items-center justify-center border border-gray-200 dark:border-neutral-800">
                <Store className="w-8 h-8 text-gray-300 dark:text-neutral-700" />
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[9px] font-bold uppercase tracking-wider rounded">Jasa</span>
                <span className="text-[10px] text-gray-400">Blok D2 / 14</span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm tracking-tight">Jasa Servis AC Panggilan</h4>
              <p className="text-[11px] text-gray-500 font-light mb-4 line-clamp-1">Teknisi berpengalaman, garansi 1 bulan.</p>
              <div className="flex items-center justify-between border-t border-gray-100 dark:border-neutral-900 pt-3">
                <span className="font-semibold text-gray-900 dark:text-white text-sm">Rp 150.000<span className="text-gray-400 font-light text-xs">/unit</span></span>
                <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center overflow-hidden">
                   <span className="text-[8px] font-bold text-gray-500">PA</span>
                </div>
              </div>
            </motion.div>

            {/* Front Featured Card */}
            <motion.div
              initial={{ opacity: 0, y: 140 }}
              whileInView={{ opacity: 1, y: 140 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-32 left-1/2 -translate-x-1/2 w-[340px] bg-white dark:bg-[#0c0c0c] rounded-2xl p-5 shadow-[0_30px_60px_rgba(0,0,0,0.1)] dark:shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-neutral-800 z-30 transform-gpu"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">BU</span>
                  </div>
                  <div>
                    <div className="text-[11px] font-semibold text-gray-900 dark:text-white leading-none">Ibu Sari</div>
                    <div className="text-[9px] text-gray-500 mt-0.5">Blok A1 / No. 12</div>
                  </div>
                </div>
                <div className="text-[9px] font-medium text-gray-400 bg-gray-100 dark:bg-neutral-900 px-2 py-0.5 rounded-full border border-gray-200 dark:border-neutral-800">Makanan</div>
              </div>

              <div className="relative h-44 bg-gray-50 dark:bg-neutral-900 rounded-xl mb-4 flex items-center justify-center border border-gray-100 dark:border-neutral-800 overflow-hidden group">
                <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/90 backdrop-blur text-gray-900 dark:text-white text-[9px] font-bold px-2.5 py-1 rounded-sm border border-gray-200 dark:border-neutral-800 flex items-center gap-1.5 shadow-sm">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  Stok: 5 Tersedia
                </div>
                <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-neutral-700 transition-transform group-hover:scale-105 duration-700 ease-out" />
              </div>

              <h4 className="font-semibold text-gray-900 dark:text-white mb-1.5 text-base tracking-tight leading-snug">Kue Kering Nastar (Wysman Asli)</h4>
              <p className="text-[11px] text-gray-500 mb-5 leading-relaxed font-light">Dibuat fresh setiap hari. 100% Mentega Wysman asli, isi selai nanas penuh buatan sendiri.</p>
              
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider mb-0.5">Harga Rupiah</span>
                    <span className="font-semibold text-lg text-gray-900 dark:text-white leading-none">Rp 120.000</span>
                  </div>
                  <div className="w-px h-8 bg-gray-200 dark:bg-neutral-800" />
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider mb-0.5 flex items-center gap-1">
                      <svg className="w-2.5 h-2.5 text-[#2775CA]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm-1.89-16.71c2.19-.54 4.79-.16 6.35 1.57.94.99 1.45 2.37 1.45 3.84 0 1.95-.91 3.75-2.48 4.77-2.09 1.34-4.73 1.53-7.14 1.13-1.04-.17-1.87-1.01-2-2.06-.11-1.05.62-2.01 1.63-2.14 1.15-.14 2.31-.05 3.39.31 1.25.4 2.22-.38 2.22-1.39 0-1.12-1.01-1.57-2.31-1.85-.75-.16-1.55-.22-2.32-.42-1.29-.35-2.3-1.15-2.61-2.52-.3-1.31.25-2.65 1.35-3.32 1.05-.62 2.34-.82 3.48-.96l-1.01 2.04z"/></svg>
                      USDC
                    </span>
                    <span className="font-mono text-sm font-medium text-gray-600 dark:text-gray-300 leading-none">7.84 USDC</span>
                  </div>
                </div>
                
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="w-full mt-2 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  Beli Sekarang
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
