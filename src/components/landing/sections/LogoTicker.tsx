"use client";

import { motion } from "framer-motion";

export function LogoTicker() {
  const communities = [
    "Cluster Anggrek",
    "Perumahan Asri",
    "Townhouse Bintaro",
    "Puri Indah Lestari",
    "Green Ville",
    "Graha Raya",
    "Bukit Golf Cibubur",
    "Taman Galaxy",
    "Kemang Pratama",
  ];

  const duplicatedList = Array(4).fill(communities).flat();

  return (
    <section className="py-16 border-t border-b border-gray-100 dark:border-neutral-900 bg-transparent dark:bg-[#030303] overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 mb-8 text-center md:text-left flex items-center justify-center md:justify-start gap-4">
        <div className="w-12 h-px bg-gray-300 dark:bg-neutral-800 hidden md:block" />
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-gray-500 dark:text-neutral-500 uppercase">
          Telah Dipercaya Ratusan RT/RW
        </p>
      </div>
      
      <div className="relative flex overflow-hidden group">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 z-10 bg-gradient-to-r from-[#F8F9FA] dark:from-[#030303] to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 z-10 bg-gradient-to-l from-[#F8F9FA] dark:from-[#030303] to-transparent pointer-events-none" />
        
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
          className="flex whitespace-nowrap items-center gap-12 md:gap-20 px-6 w-max"
        >
          {duplicatedList.map((name, i) => (
            <div key={i} className="flex items-center gap-3 md:gap-4 opacity-50 hover:opacity-100 transition-opacity duration-300">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white dark:bg-black border border-gray-200 dark:border-neutral-800 shadow-sm flex items-center justify-center">
                <span className="text-xs md:text-sm font-bold text-gray-400 dark:text-neutral-600">{name.charAt(0)}</span>
              </div>
              <span className="text-xl md:text-2xl font-semibold text-gray-500 dark:text-neutral-500 tracking-tight">{name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
