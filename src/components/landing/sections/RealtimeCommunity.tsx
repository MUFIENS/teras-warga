"use client";

import { motion } from "framer-motion";

export function RealtimeCommunity() {
  return (
    <section id="community" className="py-24 relative bg-white dark:bg-black overflow-hidden border-t border-gray-100 dark:border-neutral-900">
      {/* Abstract Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Sistem Real-time
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-6">
                Terhubung Detik Ini Juga
              </h2>
              <p className="text-lg text-gray-600 dark:text-neutral-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Teknologi WebSockets modern memastikan Anda tidak akan tertinggal informasi. Lihat siapa yang sedang online, terima pesan instan, dan pantau notifikasi tanpa perlu memuat ulang halaman.
              </p>
              
              <ul className="space-y-4 text-left max-w-md mx-auto lg:mx-0">
                {[
                  "Indikator Online/Offline Warga",
                  "Notifikasi Instan & Badge",
                  "Pembaruan Postingan Otomatis",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right Visuals - Abstract UI Mockup */}
          <div className="flex-1 relative w-full max-w-lg mx-auto lg:max-w-none perspective-1000">
            <motion.div
              initial={{ opacity: 0, rotateY: 20, x: 50 }}
              whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative rounded-3xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-2xl p-6"
            >
              {/* Fake UI Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100 dark:border-neutral-800">
                <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded-full" />
                <div className="flex gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-neutral-800 relative">
                    <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-neutral-900 rounded-full" />
                  </div>
                </div>
              </div>
              
              {/* Fake Chat List */}
              <div className="space-y-4">
                {[
                  { name: "Pak Budi (RT 01)", msg: "Kerja bakti besok jam 8 pagi ya warga.", online: true },
                  { name: "Bu Siti", msg: "Ada yang jual gas melon?", online: false },
                  { name: "Pos Satpam", msg: "Gerbang utama sudah ditutup.", online: true },
                ].map((chat, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="relative">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-neutral-700 dark:to-neutral-800" />
                      {chat.online && (
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-neutral-900 rounded-full" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-700 rounded-full mb-2" />
                      <div className="h-3 w-48 bg-gray-100 dark:bg-neutral-800 rounded-full" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
