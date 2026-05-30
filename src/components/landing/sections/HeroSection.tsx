"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ArrowRight, LayoutDashboard, Search, Bell, MessageCircle, ShoppingBag, ShieldCheck } from "lucide-react";
import dynamic from 'next/dynamic';
import ShinyText from "@/components/ui/react-bits/ShinyText";
import TiltedCard from "@/components/ui/react-bits/TiltedCard";
import { useIsMobile } from "@/hooks/useIsMobile";

const FaultyTerminal = dynamic(() => import('@/components/ui/react-bits/FaultyTerminal'), { ssr: false });

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    setMounted(true);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Multilayered Parallax
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const mockupY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);

  return (
    <section ref={containerRef} className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-transparent selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Ambient Gradient Orbs (Original Subtle Version) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#3066be]/10 to-indigo-500/5 blur-3xl dark:opacity-20 hidden md:block" />
        <div className="absolute top-[40%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tr from-sky-400/10 to-[#3066be]/5 blur-3xl dark:opacity-20 hidden md:block" />
      </div>

      {/* Mobile Premium SaaS Background (Not AI-looking) */}
      <div className="absolute inset-0 md:hidden z-0 pointer-events-none overflow-hidden">
        {/* Soft organic top light mimicking physical studio lighting */}
        <div className="absolute -top-[10%] inset-x-0 h-[50%] bg-gradient-to-b from-[#3066be]/15 dark:from-[#3066be]/20 to-transparent blur-[80px]" />
        
        {/* Barely visible, elegant architectural grid (like Linear/Vercel) */}
        <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
             style={{ backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px), linear-gradient(to bottom, #888 1px, transparent 1px)`, backgroundSize: '48px 48px' }} />
      </div>

      {/* Faulty Terminal Background */}
      {!isMobile && (
        <motion.div 
          style={{ y: backgroundY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted && resolvedTheme === 'dark' ? 0.2 : 0.35 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 pointer-events-none"
        >
          <FaultyTerminal tint={mounted && resolvedTheme === 'dark' ? '#ffffff' : '#3066be'} />
        </motion.div>
      )}
      
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative flex flex-col lg:flex-row items-start justify-between gap-12 lg:gap-8 z-10 pt-10 md:pt-20">
        
        {/* Asymmetrical Left Content */}
        <motion.div 
          style={isMobile ? {} : { y: textY }}
          className="w-full lg:w-[45%] flex flex-col items-start z-20 relative"
        >
          {/* Subtle radial glow behind text to guarantee legibility against the noisy terminal */}
          <div className="absolute -inset-10 bg-white/70 dark:bg-black/70 blur-3xl pointer-events-none rounded-full -z-10" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 mb-8"
          >
            <span className="whitespace-nowrap flex-shrink-0 px-3 py-1 rounded-full border border-[#3066be]/20 dark:border-neutral-800 bg-[#3066be]/5 dark:bg-neutral-900/50 backdrop-blur-sm text-[10px] font-bold tracking-widest uppercase shadow-sm">
              <ShinyText text="Teras Warga" speed={3} className="text-[#3066be] dark:text-white" />
            </span>
            <span className="text-xs font-medium text-gray-600 dark:text-neutral-400 tracking-tight backdrop-blur-sm">Platform Manajemen Residensial</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter text-slate-950 dark:text-white leading-[1.05]"
          >
            Tata Kelola Lingkungan <br className="hidden md:block" />
            <span className="text-[#3066be] dark:text-blue-400">
              Modern & Transparan.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-lg text-slate-900 dark:text-neutral-300 max-w-md tracking-tight leading-relaxed font-medium"
          >
            Solusi terpadu untuk digitalisasi perumahan. Kelola administrasi kas, tingkatkan keamanan, dan bangun ekosistem ekonomi warga dalam satu platform yang andal.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 bg-[#3066be] text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-[#3066be]/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              Mulai Transformasi Digital
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="flex items-center justify-center gap-2 bg-white dark:bg-black text-gray-900 dark:text-white px-7 py-3.5 rounded-full font-medium text-sm border border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Pelajari Lebih Lanjut
            </Link>
          </motion.div>
        </motion.div>

        {/* Asymmetrical Right Mockup */}
        <motion.div
          style={isMobile ? {} : { y: mockupY }}
          initial={{ opacity: 0, y: 60, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-full lg:w-[55%] z-30 mt-10 lg:mt-0 relative"
        >
          {/* Grounded Shadow & Border wrapping TiltedCard */}
          <div className="relative">
            <TiltedCard
              containerHeight="100%"
              containerWidth="100%"
              imageHeight="100%"
              imageWidth="100%"
              scaleOnHover={1.05}
              rotateAmplitude={12}
              showMobileWarning={false}
              showTooltip={false}
              displayOverlayContent={false}
            >
              <div className="relative rounded-[24px] bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden w-full h-[600px]">
            
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
            </TiltedCard>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
