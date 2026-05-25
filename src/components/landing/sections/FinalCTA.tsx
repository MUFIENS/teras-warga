"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section className="py-32 relative overflow-hidden bg-black">
      {/* Background Gradients */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(29,155,240,0.15),rgba(0,0,0,1))] pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black to-transparent pointer-events-none" />
        {/* Animated Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[150px] pointer-events-none"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[3rem] p-12 md:p-20 shadow-2xl relative overflow-hidden group"
        >
          {/* Shimmer inside CTA Box */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />
          
          <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-tight">
            Mulai <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D9BF0] to-indigo-400">Digitalisasi</span> <br/> Lingkungan Anda.
          </h2>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto tracking-tight leading-relaxed">
            Bergabung dengan ratusan RT/RW yang telah bertransformasi menjadi lingkungan pintar yang terkoneksi, aman, dan modern.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/auth/login" className="group relative w-full sm:w-auto">
              {/* Button background & glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1D9BF0] to-indigo-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-500"></div>
              {/* Actual Button */}
              <div className="relative flex items-center justify-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:scale-[1.02] transition-transform duration-300 overflow-hidden">
                <span className="relative z-10 tracking-tight">Daftar Sekarang</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-black/10 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
              </div>
            </Link>
            
            <Link 
              href="#features" 
              className="text-white hover:text-white/80 font-medium px-8 py-4 tracking-tight transition-colors"
            >
              Pelajari Lebih Lanjut
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
