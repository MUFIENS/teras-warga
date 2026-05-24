"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#1D9BF0] dark:bg-[#0c4c78]" />
      
      {/* Abstract Background Patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/20 rounded-full blur-[80px]" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-900/30 rounded-full blur-[80px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-black text-white tracking-tight mb-6"
        >
          Siap Membangun Warga Digital?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto"
        >
          Bergabunglah dengan ribuan warga lainnya yang telah mengubah cara mereka bersosialisasi dan bertransaksi di lingkungan perumahan.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#1D9BF0] px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            Mulai Sekarang - Gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
