"use client";

import { motion } from "framer-motion";
import { Users, Wifi, Send, CheckCheck, Smile } from "lucide-react";

export function RealtimeCommunity() {
  return (
    <section id="community" className="py-32 relative bg-white dark:bg-black overflow-hidden">
      {/* Premium Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_100%_0%,rgba(16,185,129,0.05),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_60%_60%_at_100%_0%,rgba(16,185,129,0.05),rgba(0,0,0,0))]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-20">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 font-medium text-sm mb-8 tracking-tight">
                <Wifi className="w-4 h-4" />
                Sistem Real-time Supabase
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter mb-6 leading-tight">
                Terhubung Detik Ini Juga.
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl mx-auto lg:mx-0 tracking-tight leading-relaxed">
                Teknologi WebSockets memastikan Anda tidak akan tertinggal. Lihat siapa yang sedang online, terima pesan instan, dan pantau notifikasi tanpa perlu memuat ulang halaman.
              </p>
              
              <ul className="space-y-5 text-left max-w-md mx-auto lg:mx-0">
                {[
                  { title: "Indikator Presensi Warga", desc: "Ketahui siapa yang sedang aktif di platform." },
                  { title: "Notifikasi Instan & Badge", desc: "Pembaruan langsung tanpa delay." },
                  { title: "Sinkronisasi Antar Perangkat", desc: "Pesan tersinkronisasi mulus di semua device Anda." },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4 text-gray-700 dark:text-gray-300">
                    <div className="h-8 w-8 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold tracking-tight text-gray-900 dark:text-white">{item.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right Visuals - High Fidelity Chat Mockup */}
          <div className="flex-1 relative w-full max-w-lg mx-auto lg:max-w-none perspective-1000">
            <motion.div
              initial={{ opacity: 0, rotateY: 15, x: 50 }}
              whileInView={{ opacity: 1, rotateY: -5, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-[2rem] bg-gray-50/50 dark:bg-[#0c0c0c] border border-gray-200/60 dark:border-white/10 shadow-2xl p-2 md:p-3 overflow-hidden backdrop-blur-3xl"
            >
              {/* Inner App Container */}
              <div className="bg-white dark:bg-black rounded-2xl md:rounded-[1.5rem] border border-gray-100 dark:border-white/5 overflow-hidden flex flex-col h-[500px] shadow-inner relative">
                
                {/* Chat Header */}
                <div className="h-16 border-b border-gray-100 dark:border-white/5 flex items-center px-4 md:px-6 bg-white/80 dark:bg-black/80 backdrop-blur-md z-10 sticky top-0 justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-indigo-300 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center text-white font-bold text-sm">
                        RT
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900 dark:text-white leading-tight">Grup RT 01 Asri</div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-500 font-medium mt-0.5">3 Warga Online</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-neutral-900 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col gap-6 relative">
                  {/* Date separator */}
                  <div className="flex justify-center">
                    <span className="bg-gray-100 dark:bg-neutral-900 text-gray-500 dark:text-gray-400 text-[10px] font-bold px-3 py-1 rounded-full tracking-wider uppercase">Hari Ini</span>
                  </div>

                  {/* Message 1 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-200 to-teal-300 dark:from-neutral-800 dark:to-neutral-700 flex-shrink-0" />
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-xs text-gray-500 ml-1 font-medium">Pak Budi <span className="font-normal opacity-50">• 08:14</span></span>
                      <div className="bg-gray-100 dark:bg-neutral-900/80 text-gray-900 dark:text-white px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm border border-transparent dark:border-white/5 shadow-sm max-w-[85%] leading-relaxed">
                        Pagi warga, apakah ada yang melihat kucing oren saya? Tadi pagi keluar rumah belum kembali.
                      </div>
                    </div>
                  </motion.div>

                  {/* Message 2 (Self) */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.5 }}
                    className="flex gap-3 flex-row-reverse"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1D9BF0] to-indigo-600 flex-shrink-0" />
                    <div className="flex flex-col gap-1 items-end">
                      <span className="text-xs text-gray-500 mr-1 font-medium"><span className="font-normal opacity-50">08:16 •</span> Anda</span>
                      <div className="bg-[#1D9BF0] text-white px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm shadow-md max-w-[85%] leading-relaxed">
                        Iya pak, tadi saya lihat di sekitar taman bermain blok B.
                      </div>
                    </div>
                  </motion.div>

                  {/* Typing Indicator */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 1 }}
                    className="flex gap-3 mt-auto"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-200 to-teal-300 dark:from-neutral-800 dark:to-neutral-700 flex-shrink-0" />
                    <div className="bg-gray-100 dark:bg-neutral-900/80 px-4 py-3 rounded-2xl rounded-tl-sm border border-transparent dark:border-white/5 shadow-sm flex items-center gap-1.5 w-[68px]">
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                    </div>
                  </motion.div>

                  {/* Overlay Gradient at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none" />
                </div>

                {/* Chat Input */}
                <div className="h-16 border-t border-gray-100 dark:border-white/5 px-4 flex items-center gap-3 bg-white dark:bg-[#0a0a0a]">
                  <div className="w-8 h-8 rounded-full text-gray-400 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors">
                    <Smile className="w-5 h-5" />
                  </div>
                  <div className="flex-1 h-10 bg-gray-100 dark:bg-neutral-900 rounded-full flex items-center px-4 border border-transparent dark:border-white/5">
                    <span className="text-gray-400 text-sm">Ketik pesan...</span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-[#1D9BF0] text-white flex items-center justify-center hover:bg-[#1A8CD8] transition-colors shadow-sm cursor-pointer hover:scale-105">
                    <Send className="w-4 h-4 ml-1" />
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
