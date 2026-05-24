"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
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
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-neutral-800/50 shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/welcome" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#1D9BF0] to-[#0d7ac5] flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <Home className="h-5 w-5" />
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
                className="text-[15px] font-medium text-gray-600 dark:text-neutral-300 hover:text-[#1D9BF0] dark:hover:text-[#1D9BF0] transition-colors"
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
              className="text-[15px] font-semibold text-gray-700 dark:text-white hover:text-[#1D9BF0] dark:hover:text-[#1D9BF0] transition-colors px-2"
            >
              Masuk
            </Link>
            <Link 
              href="/register"
              className="flex items-center gap-2 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white px-5 py-2.5 rounded-full font-semibold text-[15px] transition-all hover:shadow-lg hover:shadow-blue-500/25 hover:-translate-y-0.5"
            >
              Daftar Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={mobileMenuOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-white dark:bg-neutral-900 border-b border-gray-100 dark:border-neutral-800"
      >
        <div className="px-4 pt-2 pb-6 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-lg font-medium text-gray-900 dark:text-white py-2"
            >
              {link.name}
            </a>
          ))}
          <div className="h-px bg-gray-100 dark:bg-neutral-800 my-2" />
          <Link 
            href="/login"
            className="text-lg font-medium text-gray-900 dark:text-white py-2"
          >
            Masuk
          </Link>
          <Link 
            href="/register"
            className="flex items-center justify-center gap-2 bg-[#1D9BF0] text-white px-5 py-3 rounded-xl font-semibold text-lg mt-2"
          >
            Daftar Sekarang
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
}
