"use client";

import { motion } from "framer-motion";
import { MessageCircle, Store, Wallet, ShieldAlert, Bell, Users, ArrowUpRight } from "lucide-react";

export function FeatureShowcase() {
  return (
    <section id="features" className="py-32 relative bg-gray-50 dark:bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-6"
          >
            Satu Ekosistem, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D9BF0] to-indigo-500">Beragam Solusi.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 tracking-tight"
          >
            Tinggalkan cara lama. Kelola interaksi sosial, ekonomi warga, hingga pelaporan keamanan melalui satu platform yang cerdas dan terintegrasi.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Bento Item 1: Large Marketplace */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="md:col-span-2 relative group bg-white dark:bg-[#0c0c0c] rounded-[2rem] p-8 md:p-10 border border-gray-200/60 dark:border-white/10 shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[80px] pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center mb-6 border border-orange-100 dark:border-orange-900/50 shadow-inner">
                  <Store className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Marketplace Internal</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed">Jual beli barang bekas atau baru dengan warga sekitar tanpa biaya admin. Bangun sirkulasi ekonomi lingkungan yang sehat.</p>
              </div>
              <div className="mt-10 relative h-48 bg-gray-50 dark:bg-neutral-900/50 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500 shadow-inner">
                {/* Visual mockup inside */}
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-orange-100 dark:bg-orange-900/20 rounded-full blur-[60px]" />
                <div className="bg-white dark:bg-black p-4 rounded-xl shadow-lg border border-gray-100 dark:border-white/10 flex items-center gap-4 z-10 -rotate-3 hover:rotate-0 transition-transform duration-500">
                   <div className="w-16 h-16 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                     <Store className="w-8 h-8 text-orange-500" />
                   </div>
                   <div>
                     <div className="font-bold text-sm text-gray-900 dark:text-white">Kue Kering Lebaran</div>
                     <div className="text-xs text-orange-500 font-bold mt-1">Rp 85.000</div>
                   </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 2: Small Web3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-1 relative group bg-white dark:bg-[#0c0c0c] rounded-[2rem] p-8 border border-gray-200/60 dark:border-white/10 shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[60px] pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mb-6 border border-blue-100 dark:border-blue-900/50 shadow-inner">
                <Wallet className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Pembayaran Web3</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">Mendukung transaksi aman menggunakan Cryptocurrency langsung dari dompet Anda.</p>
              
              <div className="mt-auto h-32 bg-gray-50 dark:bg-neutral-900/50 rounded-2xl border border-gray-100 dark:border-white/5 flex items-center justify-center overflow-hidden relative shadow-inner">
                <div className="flex -space-x-4 z-10 group-hover:scale-110 transition-transform duration-500">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white dark:border-black shadow-md"><span className="text-white text-[10px] font-bold">ETH</span></div>
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center border-2 border-white dark:border-black shadow-md"><span className="text-white text-[10px] font-bold">BTC</span></div>
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center border-2 border-white dark:border-black shadow-md"><span className="text-white text-[10px] font-bold">USDT</span></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 3: Small Chat */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-1 relative group bg-white dark:bg-[#0c0c0c] rounded-[2rem] p-8 border border-gray-200/60 dark:border-white/10 shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[60px] pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center mb-6 border border-emerald-100 dark:border-emerald-900/50 shadow-inner">
                <MessageCircle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Real-time Chat</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-8">Pesan instan tanpa delay. Diskusi lebih hidup dengan fitur modern layaknya aplikasi chat premium.</p>
              
              <div className="mt-auto h-32 bg-gray-50 dark:bg-neutral-900/50 rounded-2xl border border-gray-100 dark:border-white/5 flex flex-col justify-center px-4 gap-3 overflow-hidden shadow-inner relative group-hover:scale-[1.02] transition-transform duration-500">
                <div className="h-8 bg-white dark:bg-black border border-gray-100 dark:border-white/5 rounded-full w-3/4 self-end shadow-sm flex items-center px-3 justify-end"><div className="w-12 h-2 bg-gray-200 dark:bg-white/10 rounded-full" /></div>
                <div className="h-8 bg-emerald-500 rounded-full w-2/3 self-start shadow-sm flex items-center px-3"><div className="w-16 h-2 bg-emerald-300 rounded-full" /></div>
              </div>
            </div>
          </motion.div>

          {/* Bento Item 4: Large Security */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-2 relative group bg-white dark:bg-[#0c0c0c] rounded-[2rem] p-8 md:p-10 border border-gray-200/60 dark:border-white/10 shadow-xl overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[80px] pointer-events-none" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 flex items-center justify-center mb-6 border border-red-100 dark:border-red-900/50 shadow-inner">
                  <ShieldAlert className="w-7 h-7 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight">Keamanan Terpusat</h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md text-lg leading-relaxed">Laporkan kejadian darurat atau fasilitas rusak langsung ke pengurus. Notifikasi tersebar seketika.</p>
              </div>
              <div className="mt-10 relative h-48 bg-gray-50 dark:bg-neutral-900/50 rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500 shadow-inner">
                 <div className="bg-white dark:bg-black p-4 rounded-xl shadow-xl border border-red-100 dark:border-red-900/30 flex items-center gap-4 rotate-2 hover:rotate-0 transition-transform duration-500 z-10">
                   <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shadow-inner">
                     <ShieldAlert className="w-6 h-6 text-red-500" />
                   </div>
                   <div>
                     <div className="font-bold text-sm text-gray-900 dark:text-white tracking-tight">Laporan Baru: Lampu PJU Mati</div>
                     <div className="text-xs text-gray-500 mt-0.5">Blok A2 - Dilaporkan 2 menit yang lalu</div>
                   </div>
                 </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
