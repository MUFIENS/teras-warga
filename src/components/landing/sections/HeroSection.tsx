"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Users, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16">
      {/* Background Gradients & Glow */}
      <div className="absolute inset-0 bg-white dark:bg-black w-full h-full" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#1D9BF0]/20 dark:bg-[#1D9BF0]/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/20 dark:bg-indigo-500/10 blur-[120px]" />
      
      {/* Grid Overlay for futuristic look */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 flex flex-col items-center text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 text-[#1D9BF0] font-medium text-sm shadow-sm backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D9BF0] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1D9BF0]"></span>
            </span>
            Platform Ekosistem Warga Generasi Baru
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white max-w-4xl leading-tight"
        >
          Bangun Lingkungan <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D9BF0] to-indigo-500">Lebih Cerdas & Terhubung</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-6 text-xl md:text-2xl text-gray-600 dark:text-neutral-400 max-w-2xl font-medium"
        >
          Satu aplikasi untuk berdiskusi, bertransaksi di pasar warga, hingga pembayaran kripto. Ekosistem digital perumahan masa depan ada di tangan Anda.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link
            href="/register"
            className="flex items-center justify-center gap-2 bg-[#1D9BF0] text-white px-8 py-4 rounded-full font-semibold text-lg transition-all hover:bg-[#1A8CD8] hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
          >
            Gabung Sekarang
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="#features"
            className="flex items-center justify-center gap-2 bg-white dark:bg-neutral-900 text-gray-900 dark:text-white px-8 py-4 rounded-full font-semibold text-lg border border-gray-200 dark:border-neutral-800 transition-all hover:bg-gray-50 dark:hover:bg-neutral-800 hover:-translate-y-1 shadow-sm"
          >
            Pelajari Fitur
          </Link>
        </motion.div>

        {/* Floating Feature Cards */}
        <div className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl">
          {[
            { icon: Users, title: "Komunitas Real-time", desc: "Berinteraksi layaknya media sosial modern" },
            { icon: Zap, title: "Marketplace Terintegrasi", desc: "Jual beli antar warga dengan pembayaran Web3" },
            { icon: ShieldCheck, title: "Keamanan Terjamin", desc: "Infrastruktur aman & identitas terverifikasi" },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-gray-200/50 dark:border-neutral-800/50 p-6 rounded-3xl shadow-xl shadow-black/5 flex flex-col items-center text-center"
            >
              <div className="h-12 w-12 bg-blue-50 dark:bg-blue-900/20 text-[#1D9BF0] rounded-2xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-gray-500 dark:text-neutral-400 text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
