"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, LayoutDashboard, Search, Bell, Settings, MessageCircle, ShoppingBag, ShieldCheck, ChevronRight } from "lucide-react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Multilayered Parallax
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const mockupY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section ref={containerRef} className="relative min-h-[140vh] pt-32 pb-24 overflow-hidden bg-white dark:bg-black selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Structural Background Lines */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-40"
      >
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-neutral-800 to-transparent" />
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-neutral-800 to-transparent" />
        <div className="absolute right-1/4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-neutral-800 to-transparent" />
      </motion.div>
      
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-8 z-10 pt-10 md:pt-20">
        
        {/* Asymmetrical Left Content */}
        <motion.div 
          style={{ y: textY, opacity }} 
          className="w-full lg:w-[45%] flex flex-col items-start z-20 sticky top-40"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <span className="px-2.5 py-1 rounded-full border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-[10px] font-bold tracking-widest uppercase text-gray-900 dark:text-white shadow-sm">
              Teras Warga
            </span>
            <span className="text-xs font-medium text-gray-500 dark:text-neutral-400 tracking-tight">Platform Manajemen Ekosistem Warga</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-medium tracking-tight text-gray-900 dark:text-white leading-[1.05]"
          >
            Sistem Operasi <br className="hidden md:block" />
            <span className="text-neutral-400 dark:text-neutral-500">
              Perumahan.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-lg text-gray-500 dark:text-neutral-400 max-w-md tracking-tight leading-relaxed font-light"
          >
            Dari laporan keamanan, pasar komunitas dengan pembayaran Web3, hingga obrolan warga secara real-time. Infrastruktur lengkap untuk lingkungan modern.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-7 py-3.5 rounded-full font-medium text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Mulai Ekosistem Anda
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="flex items-center justify-center gap-2 bg-transparent text-gray-900 dark:text-white px-7 py-3.5 rounded-full font-medium text-sm border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
            >
              Pelajari Lebih Lanjut
            </Link>
          </motion.div>
        </motion.div>

        {/* Asymmetrical Right Mockup */}
        <motion.div
          style={{ y: mockupY }}
          initial={{ opacity: 0, y: 60, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[55%] z-30 mt-10 lg:mt-0 relative"
        >
          {/* Grounded Shadow & Border */}
          <div className="relative rounded-[24px] bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden">
            
            {/* App Header (Realistic) */}
            <div className="h-14 border-b border-gray-100 dark:border-neutral-900 flex items-center justify-between px-4 bg-gray-50 dark:bg-[#050505]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-neutral-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-neutral-700" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-neutral-700" />
              </div>
              <div className="flex-1 max-w-md mx-4">
                <div className="h-7 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded flex items-center px-3">
                  <Search className="w-3.5 h-3.5 text-gray-400" />
                  <div className="w-px h-3 bg-gray-200 dark:bg-neutral-800 mx-2" />
                  <span className="text-[11px] text-gray-400 font-medium font-mono">teraswarga.com/dashboard</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Bell className="w-4 h-4 text-gray-400" />
              </div>
            </div>

            {/* App Body (Realistic) */}
            <div className="flex h-[550px] bg-white dark:bg-[#0a0a0a]">
              {/* Sidebar */}
              <div className="w-56 border-r border-gray-100 dark:border-neutral-900 p-4 hidden md:flex flex-col gap-6">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-7 h-7 rounded bg-black dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-[10px]">TW</div>
                  <span className="font-semibold text-sm tracking-tight text-gray-900 dark:text-white">Teras Warga - Blok A</span>
                </div>
                <div className="space-y-0.5">
                  {[
                    { icon: LayoutDashboard, label: "Feed Beranda", active: true },
                    { icon: MessageCircle, label: "Pesan Warga", badge: "2" },
                    { icon: ShoppingBag, label: "Marketplace" },
                    { icon: ShieldCheck, label: "Laporan Keamanan" },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium ${item.active ? 'bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-neutral-900'}`}>
                      <div className="flex items-center gap-3">
                        <item.icon className="w-3.5 h-3.5 opacity-70" />
                        {item.label}
                      </div>
                      {item.badge && (
                        <span className="bg-black dark:bg-white text-white dark:text-black text-[9px] px-1.5 py-0.5 rounded font-bold">{item.badge}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-6 overflow-hidden relative">
                 <div className="max-w-xl mx-auto space-y-5">
                    {/* New Post Input Mockup */}
                    <div className="bg-white dark:bg-black p-4 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-800 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-400 mt-2">Bagikan informasi atau laporan ke warga...</div>
                      </div>
                    </div>

                    {/* Post Card Mockup */}
                    <div className="bg-white dark:bg-black p-5 rounded-xl border border-gray-200 dark:border-neutral-800 shadow-sm">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex-shrink-0" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">Budi Santoso</span>
                            <span className="text-[11px] text-gray-500">2 jam yang lalu</span>
                          </div>
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                            Kerja bakti pembersihan saluran air akan dilaksanakan hari Minggu jam 08:00 pagi. Mohon partisipasi bapak-bapak sekalian di Blok A.
                          </p>
                          <div className="mt-3 w-full h-32 rounded-lg bg-gray-100 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 flex items-center justify-center">
                            <span className="text-[10px] text-gray-400 font-mono">Attachment: surat_edaran.pdf</span>
                          </div>
                        </div>
                      </div>
                    </div>
                 </div>

                 {/* Fade Out Gradient at bottom of mockup */}
                 <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
