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
  LucideIcon
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

interface ProfileData {
  username: string;
  full_name: string;
  avatar_url: string | null;
  is_seller: boolean;
  last_active: string | null;
}

export function Sidebar({ unreadNotifications = 0, unreadMessages = 0, profile }: { unreadNotifications?: number; unreadMessages?: number; profile?: ProfileData }) {
  const pathname = usePathname();
  const router = useRouter();
  const showPostingButton = pathname === "/" || pathname === "/profil";

  const navItems: NavItem[] = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Pasar", href: "/pasar", icon: Store },
    { label: "Kas", href: "/kas", icon: Wallet },
    { label: "Laporan", href: "/laporan", icon: ShieldAlert },
    { label: "Peminjaman", href: "/peminjaman", icon: Wrench },
    { label: "Teman", href: "/teman", icon: Users },
    { label: "Notifikasi", href: "/notifikasi", icon: Bell, badge: unreadNotifications },
    { label: "Pesan", href: "/pesan", icon: Mail, badge: unreadMessages },
    { label: "Profil", href: "/profil", icon: User },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isOnline = profile?.last_active ? (Date.now() - new Date(profile.last_active).getTime()) / 60000 < 5 : false;

  return (
    <aside className="w-[275px] h-screen sticky top-0 flex flex-col px-4 py-6 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-black">
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
          <div className="relative flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-neutral-700">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="h-full w-full object-cover" />
              ) : (
                <User className="h-6 w-6 text-gray-400" />
              )}
            </div>
            {/* Activity Indicator */}
            <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-black ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} title={isOnline ? "Online" : "Offline"} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[15px] leading-tight text-gray-900 dark:text-white truncate group-hover:underline">{profile.full_name}</span>
              {profile.is_seller && (
                <span className="flex-shrink-0 text-amber-600 dark:text-amber-400" title="Seller">
                  <Store className="w-3.5 h-3.5" />
                </span>
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
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 rounded-full px-4 py-3 font-medium text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-800/50 transition-colors duration-200 group"
        >
          <LogOut className="h-6 w-6 group-hover:text-red-500 transition-colors duration-200" />
          <span className="text-lg">Logout</span>
        </button>
      </div>
    </aside>
  );
}
