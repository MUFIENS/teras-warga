"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Server, Fingerprint, Activity } from "lucide-react";

export function TrustSection() {
  return (
    <section id="trust" className="py-32 bg-transparent relative overflow-hidden border-t border-gray-100 dark:border-neutral-900">
      
      {/* Background Architectural Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
           style={{ backgroundImage: `linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 mb-6"
          >
            <div className="w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full" />
            <span className="text-sm font-semibold tracking-wide uppercase text-neutral-900 dark:text-white">Standar Keamanan & Privasi</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6 text-gray-900 dark:text-white leading-[1.1]"
          >
            Privasi Data Prioritas Utama.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg text-gray-500 dark:text-neutral-400 tracking-tight font-light max-w-2xl mx-auto leading-relaxed"
          >
            Infrastruktur keamanan tingkat enterprise. Kami menjamin kerahasiaan penuh atas data pribadi, arus komunikasi, dan rekam jejak finansial di lingkungan Anda.
          </motion.p>
        </div>

        {/* Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Card 1: Data Encryption (Large span) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-2 relative flex flex-col justify-between p-8 sm:p-10 rounded-[28px] bg-white shadow-sm hover:shadow-md transition-shadow duration-300 dark:bg-[#0a0a0a] border border-gray-200 dark:border-neutral-800 overflow-hidden group min-h-[380px]"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 dark:bg-blue-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="relative z-10 max-w-md">
              <div className="h-12 w-12 bg-white dark:bg-black rounded-xl flex items-center justify-center mb-8 border border-gray-200 dark:border-neutral-800 shadow-sm">
                <Lock className="h-5 w-5 text-gray-900 dark:text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 tracking-tight text-gray-900 dark:text-white">Enkripsi Data Berstandar Tinggi</h3>
              <p className="text-base text-gray-500 dark:text-neutral-400 leading-relaxed font-light">
                Seluruh data komunikasi dan profil warga dilindungi oleh enkripsi modern, menjamin bahwa privasi Anda tidak dapat diakses oleh pihak luar.
              </p>
            </div>
            
            {/* Architectural visual element */}
            <div className="absolute bottom-0 right-0 p-8 hidden sm:block opacity-40 group-hover:opacity-100 transition-opacity duration-700">
              <div className="flex gap-2 mb-2">
                <div className="w-16 h-2 bg-gray-300 dark:bg-neutral-800 rounded-full" />
                <div className="w-8 h-2 bg-gray-300 dark:bg-neutral-800 rounded-full" />
                <div className="w-12 h-2 bg-gray-300 dark:bg-neutral-800 rounded-full" />
              </div>
              <div className="flex gap-2 mb-2">
                <div className="w-8 h-2 bg-gray-300 dark:bg-neutral-800 rounded-full" />
                <div className="w-24 h-2 bg-gray-300 dark:bg-neutral-800 rounded-full" />
              </div>
              <div className="flex gap-2">
                <div className="w-20 h-2 bg-gray-300 dark:bg-neutral-800 rounded-full" />
                <div className="w-6 h-2 bg-gray-300 dark:bg-neutral-800 rounded-full" />
                <div className="w-10 h-2 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Verification (Square) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col justify-between p-8 sm:p-10 rounded-[28px] bg-white shadow-sm hover:shadow-md transition-shadow duration-300 dark:bg-[#0a0a0a] border border-gray-200 dark:border-neutral-800 overflow-hidden group min-h-[380px]"
          >
            <div className="relative z-10">
              <div className="h-12 w-12 bg-white dark:bg-black rounded-xl flex items-center justify-center mb-8 border border-gray-200 dark:border-neutral-800 shadow-sm relative group-hover:scale-105 transition-transform duration-500">
                <div className="absolute -inset-2 bg-emerald-500/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Fingerprint className="h-5 w-5 text-gray-900 dark:text-white relative z-10" />
              </div>
              <h3 className="text-xl font-semibold mb-3 tracking-tight text-gray-900 dark:text-white">Sistem Verifikasi Berlapis</h3>
              <p className="text-sm text-gray-500 dark:text-neutral-400 leading-relaxed font-light">
                Setiap pengguna wajib melalui proses verifikasi oleh otoritas pengurus lingkungan, memastikan ekosistem residensial yang aman dan akuntabel.
              </p>
            </div>
            
            <div className="mt-8 flex items-center justify-center h-28 border border-dashed border-gray-300 dark:border-neutral-800 rounded-xl bg-white/50 dark:bg-black/50 relative overflow-hidden group-hover:border-emerald-500/30 transition-colors duration-500">
               {/* Scanning Line Animation */}
               <motion.div 
                 animate={{ y: [-50, 50, -50] }}
                 transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                 className="absolute left-0 right-0 h-px bg-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.5)] z-20"
               />
               <ShieldCheck className="w-10 h-10 text-emerald-500 relative z-10 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
            </div>
          </motion.div>

          {/* Card 3: Scale & Infrastructure (Full width bottom) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3 relative flex flex-col md:flex-row items-center justify-between p-8 sm:p-10 rounded-[28px] bg-white shadow-sm hover:shadow-md transition-shadow duration-300 dark:bg-[#0a0a0a] border border-gray-200 dark:border-neutral-800 overflow-hidden group"
          >
            {/* Animated Background Nodes */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 dark:opacity-20">
               <motion.div animate={{ x: [0, 100, 0], opacity: [0, 1, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} className="absolute top-1/4 left-1/4 w-32 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
               <motion.div animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 1 }} className="absolute bottom-1/4 right-1/3 w-px h-32 bg-gradient-to-t from-transparent via-emerald-500 to-transparent" />
               <motion.div animate={{ x: [0, -100, 0], opacity: [0, 1, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 2 }} className="absolute top-1/2 right-1/4 w-32 h-px bg-gradient-to-l from-transparent via-purple-500 to-transparent" />
            </div>

            <div className="relative z-10 max-w-lg mb-8 md:mb-0 text-center md:text-left">
              <div className="h-12 w-12 bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 rounded-xl flex items-center justify-center mb-6 mx-auto md:mx-0 shadow-sm relative group-hover:scale-105 transition-transform duration-500">
                <div className="absolute -inset-2 bg-blue-500/10 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <Server className="h-5 w-5 text-gray-900 dark:text-white relative z-10" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 tracking-tight text-gray-900 dark:text-white">Arsitektur Cloud Berkinerja Tinggi</h3>
              <p className="text-base text-gray-500 dark:text-neutral-400 leading-relaxed font-light">
                Dioptimalkan untuk akses dengan latensi rendah. Sistem beroperasi secara efisien di berbagai perangkat dan kondisi jaringan yang fluktuatif.
              </p>
            </div>
            
            <div className="relative z-10 flex-shrink-0 perspective-1000">
               <motion.div 
                 whileHover={{ scale: 1.02, rotateY: -5, rotateX: 5 }}
                 transition={{ duration: 0.4, ease: "easeOut" }}
                 className="flex items-center gap-5 bg-white dark:bg-black p-5 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-xl"
               >
                 <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 flex items-center justify-center relative">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 animate-ping" />
                    <Activity className="w-6 h-6 text-emerald-500" />
                 </div>
                 <div className="flex flex-col pr-4">
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold mb-0.5">Ketersediaan Sistem</span>
                    <span className="text-2xl font-mono font-semibold text-gray-900 dark:text-white tracking-tighter leading-none">99.99%</span>
                 </div>
               </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
