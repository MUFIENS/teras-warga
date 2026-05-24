"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Lock, Server } from "lucide-react";

export function TrustSection() {
  return (
    <section id="trust" className="py-24 bg-white dark:bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            Keamanan & Privasi Tingkat Tinggi
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-neutral-400"
          >
            Infrastruktur modern yang dibangun dengan standar industri untuk melindungi data pribadi dan aktivitas warga.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Lock,
              title: "Enkripsi End-to-End",
              desc: "Data profil dan pesan dilindungi dengan enkripsi modern di level basis data."
            },
            {
              icon: Server,
              title: "Infrastruktur Real-time",
              desc: "Didukung oleh Edge Computing & Supabase Realtime untuk sinkronisasi tanpa henti."
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
              transition={{ duration: 0.5, delay: idx * 0.2 }}
              className="flex flex-col items-center text-center p-6"
            >
              <div className="h-16 w-16 bg-gray-50 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 dark:border-neutral-800">
                <item.icon className="h-8 w-8 text-[#1D9BF0]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-gray-500 dark:text-neutral-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
