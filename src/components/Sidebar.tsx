"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
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
  LucideIcon,
  Vote
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { usePresence } from "@/components/providers/PresenceProvider";
import { Avatar } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisconnect } from "wagmi";

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
  crypto_wallet?: string | null;
}

export function Sidebar({ unreadNotifications = 0, unreadMessages = 0, profile }: { unreadNotifications?: number; unreadMessages?: number; profile?: ProfileData }) {
  const pathname = usePathname();
  const router = useRouter();
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
    { label: "Profil", href: `/profil/${profile.username}`, icon: User },
  ] : [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Pasar", href: "/pasar", icon: Store },
  ];

  const { confirm, ConfirmDialog } = useConfirmDialog();

  const handleLogout = async () => {
    const ok = await confirm({
      title: "Keluar dari Akun?",
      description: "Anda harus masuk kembali untuk mengakses fitur komunitas warga.",
      confirmText: "Keluar",
      cancelText: "Batal",
      variant: "danger",
    });

    if (ok) {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    }
  };

  const { isOnline } = usePresence(profile?.id, profile?.last_active || null);

  return (
    <>
      <ConfirmDialog />
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden md:flex w-[275px] h-screen sticky top-0 flex-col px-4 py-6 border-r border-gray-200 dark:border-neutral-800 bg-white dark:bg-black flex-shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity duration-200">
            <div className="relative h-8 flex items-center justify-center">
              <Image 
                src="/logo-ai.png" 
                alt="Logo Teras Warga" 
                width={100} 
                height={32} 
                className="h-8 w-auto object-contain rounded-lg block dark:hidden shadow-sm"
              />
              <Image 
                src="/logo-ai-dark.png" 
                alt="Logo Teras Warga Dark" 
                width={100} 
                height={32} 
                className="h-8 w-auto object-contain rounded-lg hidden dark:block shadow-sm shadow-white/5"
              />
            </div>
          </Link>
          <ThemeToggle />
        </div>

        {/* Profile */}
        {profile && (
          <Link href={`/profil/${profile.username}`} className="group flex items-center gap-3 p-3 mb-6 rounded-2xl hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors duration-200 border border-transparent hover:border-gray-200 dark:hover:border-neutral-800">
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
        <div className="mt-4 flex flex-col gap-3">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && profile?.crypto_wallet ? {
                    'aria-hidden': true,
                    style: {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  } : {})}
                >
                  {(() => {
                    const isMismatchedWallet = connected && account && (
                      !profile?.crypto_wallet || 
                      account.address.toLowerCase() !== profile.crypto_wallet.toLowerCase()
                    );

                    if (!connected || isMismatchedWallet) {
                      return (
                        <button
                          onClick={openConnectModal}
                          className="w-full flex items-center gap-4 rounded-full px-4 py-3 font-medium text-gray-500 hover:text-[#1D9BF0] hover:bg-gray-100 dark:hover:bg-neutral-800/50 transition-colors duration-200 group"
                        >
                          <Wallet className="h-6 w-6 group-hover:text-[#1D9BF0] transition-colors duration-200" />
                          <span className="text-lg">Dompet Kripto</span>
                        </button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <button
                          onClick={openChainModal}
                          className="w-full flex items-center gap-4 rounded-full px-4 py-3 font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200 group"
                        >
                          <ShieldAlert className="h-6 w-6" />
                          <span className="text-lg">Salah Jaringan</span>
                        </button>
                      );
                    }

                    return (
                      <button
                        onClick={openAccountModal}
                        className="w-full flex items-center gap-4 rounded-full px-4 py-3 font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-neutral-800/50 transition-colors duration-200 group"
                      >
                        <div className="relative">
                          <Wallet className="h-6 w-6 group-hover:text-[#1D9BF0] transition-colors duration-200" />
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-black rounded-full" />
                        </div>
                        <span className="text-lg truncate max-w-[140px] text-left">
                          {account.displayName}
                        </span>
                      </button>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>

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
    </>
  );
}
