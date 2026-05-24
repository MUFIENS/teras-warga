"use client";

import { motion } from "framer-motion";
import { MessageCircle, Store, Wallet, ShieldAlert, Bell, Users } from "lucide-react";

const features = [
  {
    icon: Store,
    title: "Marketplace Warga",
    desc: "Jual beli barang bekas atau baru dengan warga sekitar tanpa biaya admin.",
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-600 dark:text-orange-400"
  },
  {
    icon: Wallet,
    title: "Pembayaran Web3",
    desc: "Dukung transaksi aman menggunakan Cryptocurrency di dalam pasar warga.",
    color: "from-blue-500 to-indigo-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: MessageCircle,
    title: "Real-time Chat",
    desc: "Kirim pesan instan secara aman ke sesama warga. Dilengkapi fitur Voice Note & Media.",
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-600 dark:text-emerald-400"
  },
  {
    icon: ShieldAlert,
    title: "Laporan Keamanan",
    desc: "Laporkan kejadian darurat atau fasilitas rusak langsung ke pengurus RT/RW.",
    color: "from-red-500 to-rose-500",
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-600 dark:text-red-400"
  },
  {
    icon: Users,
    title: "Sistem Pertemanan",
    desc: "Bangun jaringan koneksi dengan tetangga terdekat Anda.",
    color: "from-purple-500 to-fuchsia-500",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-600 dark:text-purple-400"
  },
  {
    icon: Bell,
    title: "Notifikasi Cerdas",
    desc: "Jangan lewatkan informasi penting, aktivitas pasar, maupun obrolan terbaru.",
    color: "from-yellow-400 to-orange-400",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
    text: "text-yellow-600 dark:text-yellow-400"
  }
];

export function FeatureShowcase() {
  return (
    <section id="features" className="py-24 relative bg-gray-50 dark:bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight mb-4"
          >
            Satu Platform, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1D9BF0] to-indigo-500">Berjuta Solusi</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-gray-600 dark:text-neutral-400"
          >
            Nikmati berbagai kemudahan digitalisasi lingkungan. Mulai dari interaksi sosial, ekonomi warga, hingga keamanan terpusat.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-lg shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-neutral-800 relative group overflow-hidden"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 dark:opacity-10 rounded-bl-full group-hover:scale-110 transition-transform duration-500`} />
              
              <div className={`h-14 w-14 rounded-2xl ${feature.bg} ${feature.text} flex items-center justify-center mb-6`}>
                <feature.icon className="h-7 w-7" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-500 dark:text-neutral-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
