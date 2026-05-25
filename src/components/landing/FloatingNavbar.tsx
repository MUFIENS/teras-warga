"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Home, Menu, X, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function FloatingNavbar() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    
    // Change background when scrolled
    if (latest > 50) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }

    // Hide navbar on scroll down, show on scroll up
    if (latest > previous && latest > 150) {
      setHidden(true);
      setMobileMenuOpen(false); // Auto close mobile menu on scroll down
    } else {
      setHidden(false);
    }
  });

  const navLinks = [
    { name: "Fitur", href: "#features" },
    { name: "Komunitas", href: "#community" },
    { name: "Keamanan", href: "#trust" },
  ];

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like ease
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-white/60 dark:bg-black/40 backdrop-blur-2xl border-b border-black/5 dark:border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.03)]" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/welcome" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1D9BF0] to-indigo-600 rounded-xl opacity-90 blur-sm group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-[#1D9BF0] to-indigo-600 flex items-center justify-center text-white border border-white/20 shadow-lg group-hover:scale-[1.02] transition-transform duration-300">
                <Home className="h-5 w-5" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">Teras Warga</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[14px] font-medium text-gray-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors tracking-tight"
              >
                {link.name}
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
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden bg-white/80 dark:bg-black/80 backdrop-blur-2xl border-b border-gray-100 dark:border-neutral-800/50"
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
