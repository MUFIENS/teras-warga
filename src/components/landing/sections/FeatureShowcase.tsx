"use client";

import { motion } from "framer-motion";
import { MessageCircle, Store, Wallet, ShieldAlert, ShoppingBag, ChevronRight, Bell } from "lucide-react";
import SpotlightCard from "@/components/ui/react-bits/SpotlightCard";

export function FeatureShowcase() {
  return (
    <section id="features" className="py-32 relative bg-white dark:bg-black overflow-hidden border-t border-gray-100 dark:border-neutral-900">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-neutral-900 text-gray-900 dark:text-white font-medium text-xs mb-6"
          >
            Infrastruktur Lengkap
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl font-medium tracking-tight mb-6 text-gray-900 dark:text-white"
          >
            Modul Inti Teras Warga.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-gray-500 dark:text-neutral-400 tracking-tight font-light max-w-2xl leading-relaxed"
          >
            Sistem perumahan yang cerdas dibangun dalam satu ekosistem yang terintegrasi. Mulai dari komunikasi hingga ekonomi sirkular.
          </motion.p>
        </div>

        {/* Premium Bento Grid - Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Bento Item 1: Marketplace (Large: 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 group"
          >
            <SpotlightCard className="h-full bg-[#FAFAFA] dark:bg-[#050505] rounded-3xl p-8 border border-gray-200/60 dark:border-white/5 relative flex flex-col justify-between min-h-[420px]">
            <div className="relative z-10 max-w-sm">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center mb-5 shadow-sm border border-gray-200/50 dark:border-white/5">
                <Store className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2 tracking-tight">Marketplace Internal</h3>
              <p className="text-gray-500 dark:text-neutral-400 text-sm leading-relaxed font-light">Jual beli barang dengan warga sekitar tanpa biaya admin. Bangun sirkulasi ekonomi lingkungan yang transparan.</p>
            </div>
            
            {/* Architectural UI Miniature */}
            <div className="absolute right-0 bottom-0 w-[90%] max-w-[400px] h-[240px] bg-white dark:bg-[#0a0a0a] rounded-tl-3xl border-t border-l border-gray-200/80 dark:border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-[1.02] origin-bottom-right flex flex-col">
               <div className="p-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
                 <span className="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Produk Warga Terbaru</span>
                 <ChevronRight className="w-4 h-4 text-gray-400" />
               </div>
               <div className="p-5 flex flex-col gap-4">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center border border-orange-100 dark:border-orange-500/20">
                     <ShoppingBag className="w-5 h-5 text-orange-500" />
                   </div>
                   <div className="flex-1">
                     <div className="text-sm font-medium text-gray-900 dark:text-white">Kue Kering Nastar (Wysman)</div>
                     <div className="text-[11px] text-gray-500 mt-0.5">Ibu Sari • Blok A1</div>
                   </div>
                   <div className="text-sm font-semibold text-gray-900 dark:text-white">Rp 120.000</div>
                 </div>
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                     <Store className="w-5 h-5 text-blue-500" />
                   </div>
                   <div className="flex-1">
                     <div className="text-sm font-medium text-gray-900 dark:text-white">Jasa Cuci AC & Perbaikan</div>
                     <div className="text-[11px] text-gray-500 mt-0.5">Pak Budi • Blok C3</div>
                   </div>
                   <div className="text-sm font-semibold text-gray-900 dark:text-white">Rp 75.000</div>
                 </div>
               </div>
            </div>
            </SpotlightCard>
          </motion.div>

          {/* Bento Item 2: Web3 (Small: 1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 group"
          >
            <SpotlightCard className="h-full bg-[#FAFAFA] dark:bg-[#050505] rounded-3xl p-8 border border-gray-200/60 dark:border-white/5 relative flex flex-col min-h-[420px]">
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center mb-5 shadow-sm border border-gray-200/50 dark:border-white/5">
                <Wallet className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2 tracking-tight">Pembayaran Web3</h3>
              <p className="text-gray-500 dark:text-neutral-400 text-sm leading-relaxed font-light">Mendukung transaksi crypto terdesentralisasi yang aman dan cepat.</p>
            </div>
            
            <div className="absolute inset-x-8 bottom-12 flex justify-center transition-transform duration-500 group-hover:scale-[1.03]">
              <div className="w-full bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-xl p-6 flex flex-col items-center">
                 <div className="flex -space-x-3 mb-5">
                   <div className="w-12 h-12 rounded-full bg-[#627EEA] border-2 border-white dark:border-[#0a0a0a] flex items-center justify-center z-30 shadow-sm">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15.925 23.969L15.875 24v7.5l.05.147 7.15-10.082z" fill="#fff" fillOpacity=".6"/>
                        <path d="M15.925 23.969L8.75 14.065l7.125 10.051z" fill="#fff"/>
                        <path d="M15.925 1.5l-.05.17v16.14l.05.05 7.15-3.19z" fill="#fff" fillOpacity=".6"/>
                        <path d="M15.925 1.5L8.75 14.67l7.175 3.19z" fill="#fff"/>
                        <path d="M15.925 17.86l7.15-3.19-7.15-3.216z" fill="#fff" fillOpacity=".2"/>
                        <path d="M8.75 14.67l7.175 3.19v-6.406z" fill="#fff" fillOpacity=".6"/>
                      </svg>
                   </div>
                   <div className="w-12 h-12 rounded-full bg-[#2775CA] border-2 border-white dark:border-[#0a0a0a] flex items-center justify-center z-20 shadow-sm">
                      <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm-1.89-16.71c2.19-.54 4.79-.16 6.35 1.57.94.99 1.45 2.37 1.45 3.84 0 1.95-.91 3.75-2.48 4.77-2.09 1.34-4.73 1.53-7.14 1.13-1.04-.17-1.87-1.01-2-2.06-.11-1.05.62-2.01 1.63-2.14 1.15-.14 2.31-.05 3.39.31 1.25.4 2.22-.38 2.22-1.39 0-1.12-1.01-1.57-2.31-1.85-.75-.16-1.55-.22-2.32-.42-1.29-.35-2.3-1.15-2.61-2.52-.3-1.31.25-2.65 1.35-3.32 1.05-.62 2.34-.82 3.48-.96l-1.01 2.04z"/>
                      </svg>
                   </div>
                 </div>
                 <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">Total Balance</div>
                 <div className="text-2xl font-mono font-medium text-gray-900 dark:text-white">$1,240.50</div>
              </div>
            </div>
            </SpotlightCard>
          </motion.div>
        </div>

        {/* Premium Bento Grid - Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bento Item 3: Chat (Small: 1 col) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 group"
          >
            <SpotlightCard className="h-full bg-[#FAFAFA] dark:bg-[#050505] rounded-3xl p-8 border border-gray-200/60 dark:border-white/5 relative flex flex-col min-h-[400px]">
            <div className="relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center mb-5 shadow-sm border border-gray-200/50 dark:border-white/5">
                <MessageCircle className="w-5 h-5 text-gray-900 dark:text-white" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2 tracking-tight">Real-time Chat</h3>
              <p className="text-gray-500 dark:text-neutral-400 text-sm leading-relaxed font-light">Pesan instan antar warga tanpa delay.</p>
            </div>
            
            <div className="absolute inset-x-8 bottom-0 h-[180px] bg-white dark:bg-[#0a0a0a] rounded-t-3xl border-t border-x border-gray-200/80 dark:border-white/10 shadow-2xl p-5 flex flex-col gap-3 justify-end transition-transform duration-500 group-hover:translate-y-[-8px]">
               <div className="bg-gray-100 dark:bg-white/5 rounded-2xl rounded-bl-sm p-3 w-[85%] self-start">
                 <div className="text-xs text-gray-600 dark:text-gray-300 leading-snug">Jadwal siskamling malam ini kumpul jam berapa pak?</div>
               </div>
               <div className="bg-black dark:bg-white rounded-2xl rounded-br-sm p-3 w-[75%] self-end">
                 <div className="text-xs text-white dark:text-black leading-snug">Sesuai jadwal jam 21:00 ya.</div>
               </div>
            </div>
            </SpotlightCard>
          </motion.div>

          {/* Bento Item 4: Security (Large: 2 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 group"
          >
            <SpotlightCard className="h-full bg-[#FAFAFA] dark:bg-[#050505] rounded-3xl p-8 border border-gray-200/60 dark:border-white/5 relative flex flex-col justify-between min-h-[400px]">
            <div className="relative z-10 max-w-sm">
               <div className="w-10 h-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center mb-5 shadow-sm border border-gray-200/50 dark:border-white/5">
                 <ShieldAlert className="w-5 h-5 text-gray-900 dark:text-white" />
               </div>
               <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2 tracking-tight">Keamanan Terpusat</h3>
               <p className="text-gray-500 dark:text-neutral-400 text-sm leading-relaxed font-light">Laporkan kejadian darurat atau fasilitas rusak langsung ke pengurus. Notifikasi tersebar seketika ke seluruh warga yang berkepentingan.</p>
            </div>
            
            <div className="absolute right-8 bottom-8 left-8 lg:left-auto lg:w-[420px] bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200/80 dark:border-white/10 shadow-2xl p-6 transition-transform duration-500 group-hover:scale-[1.02]">
               <div className="flex items-center justify-between mb-5">
                 <div className="flex items-center gap-2">
                   <div className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 dark:text-red-500">Emergency Alert</span>
                 </div>
                 <span className="text-xs text-gray-400 font-mono">Baru saja</span>
               </div>
               <div className="flex items-start gap-4">
                 <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center flex-shrink-0 border border-red-100 dark:border-red-500/20">
                    <Bell className="w-5 h-5 text-red-600 dark:text-red-500" />
                 </div>
                 <div>
                   <div className="text-base font-semibold text-gray-900 dark:text-white mb-1.5 leading-tight">Laporan PJU Mati</div>
                   <div className="text-xs text-gray-500 leading-relaxed">Blok A2 - Depan Taman. Kondisi jalan sangat gelap dan berpotensi membahayakan keamanan.</div>
                 </div>
               </div>
            </div>
            </SpotlightCard>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
