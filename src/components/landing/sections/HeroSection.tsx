"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Search, Bell, Settings, MessageCircle, ShoppingBag, ShieldCheck } from "lucide-react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  // The App Window flattens out as you scroll down
  const rotateX = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  return (
    <section ref={containerRef} className="relative min-h-[150vh] pt-32 pb-16 overflow-hidden bg-white dark:bg-black">
      {/* Cinematic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(29,155,240,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(29,155,240,0.15),rgba(0,0,0,0))]" />
      <div className="absolute top-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent dark:from-black/80 dark:to-transparent z-10 pointer-events-none" />
      
      <div className="sticky top-32 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        {/* Text Content */}
        <motion.div style={{ y, opacity }} className="text-center z-20 flex flex-col items-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 text-[#1D9BF0] font-medium text-xs md:text-sm shadow-sm backdrop-blur-md mb-8 tracking-tight"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D9BF0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1D9BF0]"></span>
            </span>
            Teras Warga 2.0 Kini Tersedia
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[5rem] font-black tracking-tighter text-gray-900 dark:text-white max-w-5xl leading-[1.1] md:leading-[1.05]"
          >
            Sistem Operasi untuk <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-gray-700 to-gray-500 dark:from-white dark:via-gray-200 dark:to-gray-500">
              Perumahan Modern.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl tracking-tight leading-relaxed"
          >
            Dari laporan keamanan, pasar komunitas dengan pembayaran Web3, hingga obrolan warga secara real-time. Semua dalam satu ekosistem terpadu.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link
              href="/register"
              className="group relative flex items-center justify-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-bold text-[15px] transition-all hover:scale-[1.02] overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative">Mulai Ekosistem Anda</span>
              <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#features"
              className="flex items-center justify-center gap-2 bg-transparent text-gray-900 dark:text-white px-8 py-4 rounded-full font-bold text-[15px] border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors tracking-tight"
            >
              Pelajari Lebih Lanjut
            </Link>
          </motion.div>
        </motion.div>

        {/* 3D App Mockup */}
        <motion.div
          style={{ rotateX, scale, perspective: 1000 }}
          initial={{ opacity: 0, y: 100, rotateX: 30 }}
          animate={{ opacity: 1, y: 0, rotateX: 15 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 w-full max-w-6xl z-30 transform-gpu origin-top"
        >
          <div className="relative rounded-2xl md:rounded-[2rem] bg-gray-100/50 dark:bg-neutral-900/50 p-2 md:p-4 backdrop-blur-2xl border border-gray-200/50 dark:border-white/10 shadow-2xl dark:shadow-[0_0_100px_rgba(29,155,240,0.15)] overflow-hidden">
            
            {/* Top Glow */}
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#1D9BF0] to-transparent opacity-50" />
            
            {/* Inner Mockup Container */}
            <div className="bg-white dark:bg-black rounded-xl md:rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden flex flex-col h-[400px] md:h-[600px] shadow-inner relative">
              
              {/* App Header */}
              <div className="h-14 border-b border-gray-100 dark:border-white/5 flex items-center justify-between px-4 md:px-6 bg-gray-50/80 dark:bg-[#0a0a0a]/80 backdrop-blur-md">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="hidden md:flex w-96 h-8 bg-gray-200/50 dark:bg-white/5 rounded-full items-center px-4">
                  <Search className="w-4 h-4 text-gray-400" />
                  <span className="ml-2 text-xs text-gray-400 font-medium">Cari warga, laporan, atau barang...</span>
                </div>
                <div className="flex gap-4">
                  <Bell className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  <Settings className="w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                </div>
              </div>

              {/* App Body */}
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 border-r border-gray-100 dark:border-white/5 hidden lg:flex flex-col p-4 bg-gray-50/30 dark:bg-neutral-950/30">
                  <div className="flex items-center gap-3 mb-8 px-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1D9BF0] to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">TW</div>
                    <div className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white">Cluster Asri</div>
                  </div>
                  <div className="space-y-1">
                    {[
                      { icon: LayoutDashboard, label: "Beranda", active: true },
                      { icon: MessageCircle, label: "Obrolan Warga", badge: "3" },
                      { icon: ShoppingBag, label: "Pasar Warga" },
                      { icon: ShieldCheck, label: "Laporan" },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${item.active ? 'bg-blue-50 dark:bg-blue-500/10 text-[#1D9BF0] dark:text-[#1D9BF0]' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}>
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </div>
                        {item.badge && (
                          <span className="bg-[#1D9BF0] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{item.badge}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Main Feed Content */}
                <div className="flex-1 p-4 md:p-8 overflow-hidden bg-gray-50/10 dark:bg-black/50 relative">
                   <div className="max-w-2xl mx-auto space-y-6">
                      {/* Post Mockup */}
                      <div className="bg-white dark:bg-[#0c0c0c] p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-200 to-blue-200 dark:from-neutral-800 dark:to-neutral-700 flex-shrink-0" />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-gray-900 dark:text-white">Budi Santoso</span>
                              <span className="text-xs text-gray-500">@budi_rt01 · 2j</span>
                            </div>
                            <p className="mt-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                              Kerja bakti pembersihan saluran air akan dilaksanakan hari Minggu jam 08:00 pagi. Mohon partisipasi bapak-bapak sekalian 🙏
                            </p>
                            <div className="mt-4 h-40 rounded-xl bg-gray-100 dark:bg-neutral-900/50 border border-gray-200/50 dark:border-white/5 overflow-hidden flex items-center justify-center">
                              <span className="text-gray-400 text-xs font-medium">Gambar Lampiran</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Marketplace Mockup inline */}
                      <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-5 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 rounded-xl bg-orange-200 dark:bg-orange-900/50 flex-shrink-0" />
                          <div>
                            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-1 block">Pasar Warga</span>
                            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Sepeda Lipat Anak (Preloved)</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Kondisi 90%, jarang dipakai. Dijual karena anak sudah besar.</p>
                            <div className="mt-2 font-bold text-orange-600 dark:text-orange-400 text-sm">Rp 450.000 <span className="text-[10px] font-normal text-orange-500/60 ml-1">~0.0001 BTC</span></div>
                          </div>
                        </div>
                      </div>
                   </div>

                   {/* Fade Out Bottom */}
                   <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
