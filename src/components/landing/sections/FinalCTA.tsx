"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden bg-white dark:bg-black border-t border-gray-100 dark:border-neutral-900">
      
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-gray-50 dark:bg-[#050505] border border-gray-200 dark:border-neutral-800 rounded-[2rem] md:rounded-[3rem] p-12 md:p-24 relative overflow-hidden"
        >
          {/* Subtle Grid Background Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium text-gray-900 dark:text-white tracking-tight mb-8 leading-tight max-w-3xl mx-auto">
              Mulai Digitalisasi Lingkungan Anda.
            </h2>
            <p className="text-lg md:text-xl text-gray-500 dark:text-neutral-400 mb-12 max-w-2xl mx-auto tracking-tight leading-relaxed font-light">
              Bergabung dengan ratusan RT/RW yang telah bertransformasi menjadi lingkungan pintar yang terkoneksi, aman, dan modern.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/login" className="w-full sm:w-auto">
                <button className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-medium text-sm hover:scale-[1.02] transition-transform duration-300">
                  Daftar Sekarang
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              
              <Link 
                href="#features" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white dark:bg-black text-gray-900 dark:text-white border border-gray-200 dark:border-neutral-800 px-8 py-4 rounded-full font-medium text-sm hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
              >
                Pelajari Lebih Lanjut
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
