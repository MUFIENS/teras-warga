"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Server } from "lucide-react";

export function TrustSection() {
  return (
    <section id="trust" className="py-32 bg-[#050505] relative overflow-hidden text-white">
      {/* Security Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-900/30 border border-blue-500/30 text-blue-400 font-medium text-sm mb-6 tracking-tight"
          >
            <Lock className="w-4 h-4" />
            Enterprise-Grade Security
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black tracking-tighter mb-6"
          >
            Privasi Tingkat Tinggi.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-neutral-400 tracking-tight"
          >
            Infrastruktur modern yang dibangun dengan standar industri untuk melindungi data pribadi, percakapan, dan transaksi aktivitas warga perumahan Anda.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Lock,
              title: "Enkripsi End-to-End",
              desc: "Data profil dan pesan dilindungi dengan standar enkripsi modern di level basis data."
            },
            {
              icon: Server,
              title: "Infrastruktur Real-time",
              desc: "Didukung oleh arsitektur Edge Computing & Supabase untuk sinkronisasi tanpa henti."
            },
            {
              icon: ShieldCheck,
              title: "Verifikasi Identitas",
              desc: "Mencegah akun palsu (anonim) agar ekosistem warga tetap aman dan terpercaya."
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col p-8 rounded-[2rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="h-16 w-16 bg-blue-950/50 rounded-2xl flex items-center justify-center mb-8 border border-blue-900/50 shadow-inner group-hover:scale-110 transition-transform duration-500">
                <item.icon className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">{item.title}</h3>
              <p className="text-neutral-400 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
