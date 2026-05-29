"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function FloatingNavbar() {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (latest) => {
    // Change background when scrolled
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  });

  const navLinks = [
    { name: "Fitur", href: "#features" },
    { name: "Komunitas", href: "#community" },
    { name: "Keamanan", href: "#trust" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-4 inset-x-0 z-50 transition-colors duration-500 mx-auto w-[92%] max-w-5xl rounded-full ${
        isScrolled 
          ? "bg-white/70 dark:bg-black/60 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)]" 
          : "bg-transparent border border-transparent shadow-none"
      }`}
    >
      <div className="px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/welcome" className="flex items-center gap-3 group">
            <div className="relative h-10 flex items-center justify-center">
              <Image 
                src="/logo-ai.png" 
                alt="Logo Teras Warga" 
                width={120} 
                height={40} 
                className="h-9 w-auto object-contain rounded-xl block dark:hidden group-hover:scale-[1.02] transition-transform duration-300 shadow-sm"
              />
              <Image 
                src="/logo-ai-dark.png" 
                alt="Logo Teras Warga Dark" 
                width={120} 
                height={40} 
                className="h-9 w-auto object-contain rounded-xl hidden dark:block group-hover:scale-[1.02] transition-transform duration-300 shadow-sm shadow-white/5"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.name)}
                onMouseLeave={() => setHoveredLink(null)}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative px-4 py-2 text-[14px] font-medium text-gray-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors tracking-tight rounded-full"
              >
                {hoveredLink === link.name && (
                  <motion.div
                    layoutId="nav-hover"
                    className="absolute inset-0 bg-gray-100 dark:bg-white/10 rounded-full -z-10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.name}</span>
              </a>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link 
              href="/login"
              className="text-[14px] font-semibold text-gray-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors px-2 tracking-tight"
            >
              Masuk
            </Link>
            <Link 
              href="/register"
              className="group relative flex items-center gap-2 bg-[#1D9BF0] text-white px-5 py-2.5 rounded-full font-semibold text-[14px] tracking-tight overflow-hidden transition-all hover:scale-[1.02]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative">Daftar Sekarang</span>
              <ArrowRight className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -10 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden absolute top-full left-0 right-0 mt-3 overflow-hidden bg-white/90 dark:bg-black/90 backdrop-blur-xl border border-gray-200/60 dark:border-white/10 rounded-3xl shadow-xl"
          >
            <div className="px-6 pt-4 pb-8 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-lg font-medium text-gray-900 dark:text-white py-2 tracking-tight"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-gray-100 dark:bg-neutral-800/50 my-2" />
              <Link 
                href="/login"
                className="text-lg font-medium text-gray-900 dark:text-white py-2 tracking-tight"
              >
                Masuk
              </Link>
              <Link 
                href="/register"
                className="flex items-center justify-center gap-2 bg-[#1D9BF0] text-white px-5 py-3 rounded-xl font-semibold text-lg mt-2 tracking-tight"
              >
                Daftar Sekarang
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
