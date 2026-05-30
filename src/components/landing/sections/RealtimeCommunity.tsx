"use client";

import { motion } from "framer-motion";
import { Users, Wifi, Send, CheckCheck, Smile, MoreHorizontal } from "lucide-react";

export function RealtimeCommunity() {
  return (
    <section id="community" className="py-32 relative bg-transparent overflow-hidden border-t border-gray-100 dark:border-neutral-900">
      
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 bg-neutral-900 dark:bg-white rounded-full" />
                <span className="text-sm font-semibold tracking-wide uppercase text-neutral-900 dark:text-white">Komunikasi Sinkron</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white tracking-tight mb-6 leading-tight">
                Aliran Informasi Real-Time Tanpa Hambatan.
              </h2>
              <p className="text-lg text-gray-500 dark:text-neutral-400 mb-10 max-w-xl mx-auto lg:mx-0 tracking-tight leading-relaxed font-light">
                Didukung oleh arsitektur WebSockets modern, memastikan seluruh pengurus dan warga menerima pembaruan informasi serta instruksi keamanan seketika tanpa perlu memuat ulang sistem.
              </p>
              
              <ul className="space-y-6 text-left max-w-md mx-auto lg:mx-0">
                {[
                  { title: "Pemantauan Presensi Pengguna", desc: "Deteksi status aktif pengurus dan warga secara akurat." },
                  { title: "Distribusi Notifikasi Instan", desc: "Pembaruan informasi dan peringatan didistribusikan secara push ke seluruh perangkat." },
                  { title: "Sinkronisasi Multi-Perangkat", desc: "Konsistensi dan keandalan akses data penuh dari berbagai ekosistem perangkat." },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <CheckCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="font-medium tracking-tight text-gray-900 dark:text-white">{item.title}</div>
                      <div className="text-sm text-gray-500 dark:text-neutral-400 mt-1 font-light leading-relaxed">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right Visuals - High Fidelity Chat Mockup */}
          <div className="flex-1 w-full max-w-lg mx-auto lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative rounded-2xl bg-white dark:bg-[#050505] border border-gray-200 dark:border-neutral-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              {/* Inner App Container */}
              <div className="flex flex-col h-[520px]">
                
                {/* Chat Header */}
                <div className="h-16 border-b border-gray-100 dark:border-neutral-900 flex items-center px-5 justify-between bg-gray-50 dark:bg-black">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 border border-gray-300 dark:border-neutral-700 flex items-center justify-center text-gray-900 dark:text-white font-medium text-xs">
                        TW
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-black rounded-full" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-gray-900 dark:text-white tracking-tight">Teras Warga - Blok A</div>
                      <div className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        3 Warga Online
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center text-gray-400">
                    <Users className="w-4 h-4 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                    <MoreHorizontal className="w-4 h-4 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
                  </div>
                </div>
                
                {/* Chat Messages */}
                <div className="flex-1 p-5 overflow-hidden flex flex-col gap-4 relative bg-white dark:bg-[#0a0a0a]">
                  {/* Date separator */}
                  <div className="flex justify-center mb-2">
                    <span className="text-gray-400 dark:text-neutral-500 text-[10px] font-medium tracking-widest uppercase">Hari Ini</span>
                  </div>

                  {/* Message 1 */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-900 dark:to-indigo-800 border border-indigo-200 dark:border-indigo-700 flex-shrink-0 flex items-center justify-center">
                      <span className="text-indigo-700 dark:text-indigo-300 text-[10px] font-bold">BS</span>
                    </div>
                    <div className="flex flex-col gap-1 items-start">
                      <div className="flex items-baseline gap-2 ml-1">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">Budi Santoso</span>
                        <span className="text-[10px] text-gray-400">08:14</span>
                      </div>
                      <div className="bg-gray-100 dark:bg-neutral-900 text-gray-800 dark:text-gray-200 px-4 py-2.5 rounded-2xl rounded-tl-none text-[13px] border border-gray-200 dark:border-neutral-800 max-w-[85%] leading-relaxed shadow-sm">
                        Pagi bapak/ibu, mengingatkan besok jam 07:00 ada jadwal fogging dari Puskesmas. Mohon area teras dikosongkan sementara ya. 🙏
                      </div>
                    </div>
                  </motion.div>

                  {/* Message 2 (Self) */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="flex gap-3 flex-row-reverse mt-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex-shrink-0 flex items-center justify-center shadow-sm">
                      <span className="text-white dark:text-black text-[10px] font-bold">A</span>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      <div className="flex items-baseline gap-2 mr-1">
                        <span className="text-[10px] text-gray-400">08:22</span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">Anda</span>
                      </div>
                      <div className="bg-black dark:bg-white text-white dark:text-black px-4 py-2.5 rounded-2xl rounded-tr-none text-[13px] max-w-[80%] leading-relaxed shadow-sm">
                        Siap pak RT, terima kasih infonya.
                      </div>
                      <div className="flex items-center gap-1 mr-1 mt-0.5">
                        <span className="text-[10px] text-gray-500 dark:text-neutral-500">Read</span>
                        <CheckCheck className="w-3 h-3 text-emerald-500" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Typing Indicator */}
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="flex gap-3 mt-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 border border-amber-200 dark:border-amber-700 flex-shrink-0 flex items-center justify-center">
                      <span className="text-amber-700 dark:text-amber-300 text-[10px] font-bold">SN</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-neutral-900 px-4 py-3 rounded-2xl rounded-tl-none border border-gray-200 dark:border-neutral-800 flex items-center gap-1.5 w-[60px] shadow-sm">
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0 }} className="w-1.5 h-1.5 bg-gray-400 dark:bg-neutral-500 rounded-full" />
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }} className="w-1.5 h-1.5 bg-gray-400 dark:bg-neutral-500 rounded-full" />
                      <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }} className="w-1.5 h-1.5 bg-gray-400 dark:bg-neutral-500 rounded-full" />
                    </div>
                  </motion.div>

                  {/* Fade mask at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-[#0a0a0a] to-transparent pointer-events-none" />
                </div>

                {/* Chat Input Area */}
                <div className="p-4 border-t border-gray-100 dark:border-neutral-900 bg-gray-50 dark:bg-black">
                  <div className="flex items-center gap-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-full p-1 pl-4 shadow-sm">
                    <Smile className="w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Ketik pesan..." 
                      className="flex-1 bg-transparent text-sm text-gray-900 dark:text-white outline-none placeholder:text-gray-400"
                      disabled
                    />
                    <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center cursor-not-allowed">
                      <Send className="w-3.5 h-3.5 text-white dark:text-black ml-0.5" />
                    </div>
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
