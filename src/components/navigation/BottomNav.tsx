"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Home, 
  Store, 
  Plus, 
  Mail, 
  Menu,
  Wallet,
  ShieldAlert,
  Wrench,
  Users,
  Bell,
  User,
  LogOut,
  Vote
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { createClient } from "@/lib/supabase/client";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface BottomNavProps {
  unreadNotifications?: number;
  unreadMessages?: number;
  profile?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    is_seller?: boolean;
    last_active?: string | null;
  };
}

export function BottomNav({ unreadNotifications = 0, unreadMessages = 0, profile }: BottomNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setDrawerOpen(false);
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { label: "Beranda", href: "/", icon: Home },
    { label: "Pasar", href: "/pasar", icon: Store },
    // Index 2 is reserved for Posting (floating button)
    { label: "Pesan", href: "/pesan", icon: Mail, badge: unreadMessages },
    { label: "Lainnya", action: () => setDrawerOpen(true), icon: Menu },
  ];

  const drawerItems = [
    { label: "Notifikasi", href: "/notifikasi", icon: Bell, badge: unreadNotifications },
    { label: "Kas", href: "/kas", icon: Wallet },
    { label: "Laporan", href: "/laporan", icon: ShieldAlert },
    { label: "Peminjaman", href: "/peminjaman", icon: Wrench },
    { label: "Voting DAO", href: "/voting", icon: Vote },
    { label: "Teman", href: "/teman", icon: Users },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/85 dark:bg-black/85 backdrop-blur-md border-t border-gray-200 dark:border-neutral-800 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16 px-2 relative">
          
          {/* Item 1 & 2 */}
          {navItems.slice(0, 2).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href!}
                className="relative flex flex-col items-center justify-center w-16 h-full flex-shrink-0"
              >
                <div className="relative z-10 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <Icon className={`w-6 h-6 transition-colors ${isActive ? "text-[#1D9BF0] dark:text-white" : ""}`} />
                  <span className={`text-[10px] mt-1 font-medium transition-colors ${isActive ? "text-[#1D9BF0] dark:text-white" : ""}`}>
                    {item.label}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-x-2 inset-y-1 bg-gray-100 dark:bg-neutral-800/60 rounded-xl -z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Center Floating Button (Posting) */}
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
            className="relative flex flex-col items-center justify-center w-16 h-full flex-shrink-0 group"
          >
            <div className="absolute -top-5 flex items-center justify-center w-14 h-14 rounded-full bg-[#1D9BF0] text-white shadow-lg shadow-[#1D9BF0]/30 transform transition-transform group-hover:scale-95 group-active:scale-90">
              <Plus className="w-7 h-7" />
            </div>
            <span className="text-[10px] mt-7 font-medium text-gray-500 dark:text-gray-400">
              Posting
            </span>
          </button>

          {/* Item 4 & 5 */}
          {navItems.slice(2).map((item) => {
            const isActive = item.href ? pathname === item.href : false;
            const Icon = item.icon;
            
            const content = (
              <>
                <div className="relative z-10 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                  <div className="relative">
                    <Icon className={`w-6 h-6 transition-colors ${isActive ? "text-[#1D9BF0] dark:text-white" : ""}`} />
                    {item.badge && item.badge > 0 ? (
                      <span className="absolute -top-1 -right-2 min-w-[16px] h-[16px] bg-[#1D9BF0] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    ) : null}
                  </div>
                  <span className={`text-[10px] mt-1 font-medium transition-colors ${isActive ? "text-[#1D9BF0] dark:text-white" : ""}`}>
                    {item.label}
                  </span>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-indicator"
                    className="absolute inset-x-2 inset-y-1 bg-gray-100 dark:bg-neutral-800/60 rounded-xl -z-0"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </>
            );

            if (item.action) {
              return (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="relative flex flex-col items-center justify-center w-16 h-full flex-shrink-0"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                href={item.href!}
                className="relative flex flex-col items-center justify-center w-16 h-full flex-shrink-0"
              >
                {content}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Drawer Lainnya */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent className="pb-8">
          <DrawerHeader className="text-left border-b border-gray-100 dark:border-neutral-800 pb-4">
            <DrawerTitle className="text-xl font-bold">Lainnya</DrawerTitle>
            <DrawerDescription className="sr-only">Menu navigasi tambahan aplikasi</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 flex flex-col gap-1">
            {profile ? (
              <Link 
                href={`/profil/${profile.username}`}
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors mb-2"
              >
                <div className="bg-[#1D9BF0]/10 p-2 rounded-full text-[#1D9BF0]">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-bold">{profile.full_name}</div>
                  <div className="text-sm text-gray-500">Lihat Profil</div>
                </div>
              </Link>
            ) : (
              <Link 
                href="/login"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors mb-2"
              >
                <div className="bg-[#1D9BF0]/10 p-2 rounded-full text-[#1D9BF0]">
                  <User className="w-6 h-6" />
                </div>
                <div className="font-bold text-[#1D9BF0]">Login / Daftar</div>
              </Link>
            )}

            <div className="grid grid-cols-4 gap-4 py-4 border-y border-gray-100 dark:border-neutral-800 my-2">
              {drawerItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="relative bg-gray-100 dark:bg-neutral-900 p-3 rounded-2xl text-gray-700 dark:text-gray-300">
                    <item.icon className="w-6 h-6" />
                    {item.badge && item.badge > 0 ? (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#1D9BF0] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-black">
                        {item.badge > 99 ? '99+' : item.badge}
                      </span>
                    ) : null}
                  </div>
                  <span className="text-[11px] font-medium text-center text-gray-600 dark:text-gray-400">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex flex-col gap-2 mt-2 px-1">
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
                      {...(!ready && {
                        'aria-hidden': true,
                        style: {
                          opacity: 0,
                          pointerEvents: 'none',
                          userSelect: 'none',
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <button
                              onClick={openConnectModal}
                              className="flex items-center justify-center gap-2 p-3 w-full rounded-xl text-gray-600 dark:text-gray-400 hover:text-[#1D9BF0] hover:bg-[#1D9BF0]/10 transition-colors font-medium"
                            >
                              <Wallet className="w-5 h-5" />
                              Hubungkan Dompet
                            </button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              className="flex items-center justify-center gap-2 p-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
                            >
                              <ShieldAlert className="w-5 h-5" />
                              Salah Jaringan
                            </button>
                          );
                        }

                        return (
                          <button
                            onClick={openAccountModal}
                            className="flex items-center justify-center gap-2 p-3 w-full rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-900 transition-colors font-medium"
                          >
                            <div className="relative">
                              <Wallet className="w-5 h-5 text-[#1D9BF0]" />
                              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-black rounded-full" />
                            </div>
                            <span>{account.displayName}</span>
                          </button>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>

            {profile && (
              <button 
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 mt-4 p-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors font-medium"
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
