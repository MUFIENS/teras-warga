"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Store,
  Wallet,
  ShieldAlert,
  Wrench,
  Users,
  Bell,
  Mail,
  User,
  LogOut,
  X,
  LucideIcon,
  Vote,
  Menu
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { usePresence } from "@/components/providers/PresenceProvider";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface ProfileData {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
  is_seller: boolean;
  last_active: string | null;
}

export function Sidebar({ unreadNotifications = 0, unreadMessages = 0, profile }: { unreadNotifications?: number; unreadMessages?: number; profile?: ProfileData }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const showPostingButton = pathname === "/" || (profile && pathname === `/profil/${profile.username}`);

  const navItems: NavItem[] = profile ? [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Pasar", href: "/pasar", icon: Store },
    { label: "Kas", href: "/kas", icon: Wallet },
    { label: "Laporan", href: "/laporan", icon: ShieldAlert },
    { label: "Peminjaman", href: "/peminjaman", icon: Wrench },
    { label: "Voting DAO", href: "/voting", icon: Vote },
    { label: "Teman", href: "/teman", icon: Users },
    { label: "Notifikasi", href: "/notifikasi", icon: Bell, badge: unreadNotifications },
    { label: "Pesan", href: "/pesan", icon: Mail, badge: unreadMessages },
    { label: "Profil", href: "/profil", icon: User },
  ] : [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Pasar", href: "/pasar", icon: Store },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const { isOnline } = usePresence(profile?.id, profile?.last_active || null);

  // Close drawer when window resizes to desktop size
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden md:flex w-[275px] h-screen sticky top-0 flex-col px-4 py-6 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-black flex-shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity duration-200">
            <div className="h-8 w-8 rounded-full bg-[#1D9BF0] flex items-center justify-center text-white">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Teras Warga</span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Profile */}
        {profile && (
          <Link href="/profil" className="group flex items-center gap-3 p-3 mb-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors duration-200 border border-transparent hover:border-gray-200 dark:hover:border-neutral-800">
            <Tooltip content={isOnline ? "Online" : "Offline"} side="right">
              <div className="relative flex-shrink-0">
                <Avatar src={profile.avatar_url} alt={profile.full_name} className="h-12 w-12" />
                {/* Activity Indicator adjusted position */}
                <span className={`absolute bottom-[2px] right-[2px] w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-black ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
            </Tooltip>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[15px] leading-tight text-gray-900 dark:text-white truncate group-hover:underline">{profile.full_name}</span>
                {profile.is_seller && (
                  <Tooltip content="Seller">
                    <span className="flex-shrink-0 text-amber-600 dark:text-amber-400">
                      <Store className="w-3.5 h-3.5" />
                    </span>
                  </Tooltip>
                )}
              </div>
              <span className="text-gray-500 text-[13px] leading-tight truncate">@{profile.username}</span>
            </div>
          </Link>
        )}

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-full px-4 py-3 transition-colors duration-200 ${
                  isActive
                    ? "font-semibold bg-gray-100 dark:bg-neutral-800/50"
                    : "font-medium hover:bg-gray-100 dark:hover:bg-neutral-800/50"
                }`}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-[#1D9BF0] text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-lg">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-4 flex flex-col gap-4">
          {showPostingButton && (
            <button 
              onClick={() => {
                if (pathname !== "/") {
                  router.push("/");
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  const textarea = document.querySelector('textarea');
                  if (textarea) textarea.focus();
                }
              }}
              className="w-full rounded-full bg-[#1D9BF0] text-white py-3 px-4 text-lg font-semibold hover:bg-[#1A8CD8] transition-colors duration-200"
            >
              Posting
            </button>
          )}
          
          {profile ? (
            <button 
              onClick={handleLogout}
              className="flex items-center gap-4 rounded-full px-4 py-3 font-medium text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-800/50 transition-colors duration-200 group"
            >
              <LogOut className="h-6 w-6 group-hover:text-red-500 transition-colors duration-200" />
              <span className="text-lg">Logout</span>
            </button>
          ) : (
            <Link 
              href="/login"
              className="flex items-center gap-4 rounded-full px-4 py-3 font-medium text-[#1D9BF0] hover:bg-[#1D9BF0]/10 transition-colors duration-200 group"
            >
              <User className="h-6 w-6" />
              <span className="text-lg">Login / Daftar</span>
            </Link>
          )}
        </div>
      </aside>

      {/* ─── MOBILE TOP HEADER ─── */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-900 text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
            aria-label="Buka menu"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link href="/" className="flex items-center gap-1.5">
            <div className="h-6 w-6 rounded-full bg-[#1D9BF0] flex items-center justify-center text-white">
              <Home className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold text-md">Teras Warga</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {profile && (
            <Link href="/profil" className="relative flex-shrink-0 ml-1">
              <Avatar src={profile.avatar_url} alt={profile.full_name} className="h-7 w-7 hover:opacity-85 transition-opacity" />
            </Link>
          )}
        </div>
      </header>

      {/* ─── MOBILE DRAWER SHEET ─── */}
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden animate-fade-in-0 duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Panel */}
      <div 
        className={`fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-black z-50 p-4 border-r border-gray-200 dark:border-neutral-800 flex flex-col md:hidden transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between mb-6 px-2">
          <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-[#1D9BF0] flex items-center justify-center text-white">
              <Home className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">Teras Warga</span>
          </Link>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors text-gray-500 dark:text-neutral-400 cursor-pointer"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Profile (Drawer) */}
        {profile && (
          <Link href="/profil" onClick={() => setIsOpen(false)} className="group flex items-center gap-3 p-3 mb-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors duration-200 border border-transparent hover:border-gray-200 dark:hover:border-neutral-800">
            <Tooltip content={isOnline ? "Online" : "Offline"} side="right">
              <div className="relative flex-shrink-0">
                <Avatar src={profile.avatar_url} alt={profile.full_name} className="h-10 w-10" />
                <span className={`absolute bottom-[2px] right-[2px] w-3 h-3 rounded-full ring-2 ring-white dark:ring-black ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
            </Tooltip>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <span className="font-bold text-[14px] leading-tight text-gray-900 dark:text-white truncate">{profile.full_name}</span>
                {profile.is_seller && (
                  <Tooltip content="Seller">
                    <span className="flex-shrink-0 text-amber-600 dark:text-amber-400">
                      <Store className="w-3.5 h-3.5" />
                    </span>
                  </Tooltip>
                )}
              </div>
              <span className="text-gray-500 text-[12px] leading-tight truncate">@{profile.username}</span>
            </div>
          </Link>
        )}

        {/* Navigation (Drawer) */}
        <nav className="flex-1 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 rounded-full px-4 py-3 transition-colors duration-200 ${
                  isActive
                    ? "font-semibold bg-gray-100 dark:bg-neutral-800/50"
                    : "font-medium hover:bg-gray-100 dark:hover:bg-neutral-800/50"
                }`}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {item.badge && item.badge > 0 ? (
                    <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-[#1D9BF0] text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  ) : null}
                </div>
                <span className="text-[17px]">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer (Drawer) */}
        <div className="mt-4 flex flex-col gap-3">
          {showPostingButton && (
            <button 
              onClick={() => {
                setIsOpen(false);
                if (pathname !== "/") {
                  router.push("/");
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  const textarea = document.querySelector('textarea');
                  if (textarea) textarea.focus();
                }
              }}
              className="w-full rounded-full bg-[#1D9BF0] text-white py-2.5 px-4 text-[16px] font-semibold hover:bg-[#1A8CD8] transition-colors duration-200 cursor-pointer"
            >
              Posting
            </button>
          )}

          {profile ? (
            <button 
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-4 rounded-full px-4 py-2.5 font-medium text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-800/50 transition-colors duration-200 group cursor-pointer"
            >
              <LogOut className="h-6 w-6 group-hover:text-red-500 transition-colors duration-200" />
              <span className="text-[16px]">Logout</span>
            </button>
          ) : (
            <Link 
              href="/login"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-4 rounded-full px-4 py-2.5 font-medium text-[#1D9BF0] hover:bg-[#1D9BF0]/10 transition-colors duration-200 group cursor-pointer"
            >
              <User className="h-6 w-6" />
              <span className="text-[16px]">Login / Daftar</span>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
