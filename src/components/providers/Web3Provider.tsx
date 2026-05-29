"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider, useAccount, useDisconnect } from "wagmi";
import { polygon, bsc, mainnet } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useState, useMemo } from "react";

import { createStorage } from "wagmi";

const queryClient = new QueryClient();

function WalletGuard({ expectedWallet, userId }: { expectedWallet: string | null, userId?: string }) {
  const { address, status } = useAccount();
  const { disconnectAsync, connectors } = useDisconnect();
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  useEffect(() => {
    // Memberikan waktu bagi Wagmi untuk membaca sesi dari cache (mencegah false 'disconnected' saat hydration)
    const timer = setTimeout(() => {
      if (status === 'connecting' || status === 'reconnecting') return;
      if (!userId) return;

      if (status === 'connected' && address) {
        if (expectedWallet) {
          if (address.toLowerCase() !== expectedWallet.toLowerCase()) {
            console.log("WalletGuard: Mismatched wallet! Disconnecting...", { address, expectedWallet });
            setIsDisconnecting(true);
          } else {
            console.log("WalletGuard: Wallet matches expected!", { address, expectedWallet });
          }
        } else {
          // Akun tidak memiliki dompet. Biarkan tersambung (mungkin user baru saja menghubungkannya).
          // Kebocoran sudah dicegah oleh Profile Switcher!
          console.log("WalletGuard: No expected wallet, but allowing connection for new wallet.", { address });
        }
      } else {
        console.log("WalletGuard: Not connected yet or no address.", { status, address });
      }
    }, 1500); // 1.5 detik delay

    return () => clearTimeout(timer);
  }, [status, address, expectedWallet, userId]);

  useEffect(() => {
    if (isDisconnecting) {
      const doDisconnect = async () => {
        for (const connector of connectors) {
          try { await disconnectAsync({ connector }); } catch(e) {}
        }
        try { if (disconnectAsync) await disconnectAsync(); } catch(e) {}
        
        setIsDisconnecting(false);
      };
      doDisconnect();
    }
  }, [isDisconnecting, connectors, disconnectAsync]);

  if (isDisconnecting) {
    return (
      <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-5 max-w-sm mx-4 text-center border border-gray-100 dark:border-neutral-800">
          <div className="w-10 h-10 border-4 border-[#1D9BF0] border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Keamanan Teras Warga</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Membersihkan sesi dompet dari akun sebelumnya...</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function Web3Provider({ children, cryptoWallet, userId }: { children: React.ReactNode, cryptoWallet?: string | null, userId?: string }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Mencegah kebocoran cache RainbowKit secara sinkron (sebelum render Wagmi) sekaligus mempertahankan memori per akun
  useMemo(() => {
    if (typeof window !== 'undefined' && userId) {
      const lastUserId = window.localStorage.getItem('last_user_id');
      if (lastUserId !== userId) {
        
        // 1. BACKUP memori global (RainbowKit/WC) milik user sebelumnya
        if (lastUserId) {
          const keysToBackup: string[] = [];
          for (let i = 0; i < window.localStorage.length; i++) {
            const key = window.localStorage.key(i);
            if (key && (
              key.startsWith('rainbowkit') || 
              key.startsWith('wagmi') || 
              key.startsWith('wc@2:') ||
              key.startsWith('-walletlink') ||
              key.includes('metamask') ||
              key.includes('MetaMask')
            )) {
              keysToBackup.push(key);
            }
          }
          
          // Pindahkan memori yang sedang aktif ke brankas backup milik user lama
          keysToBackup.forEach(key => {
            const val = window.localStorage.getItem(key);
            if (val) window.localStorage.setItem(`backup_${lastUserId}_${key}`, val);
            window.localStorage.removeItem(key); // Kosongkan memori utama
          });
        }

        // 2. RESTORE memori global (RainbowKit/WC) milik user baru (jika punya)
        const prefix = `backup_${userId}_`;
        const keysToRestore: string[] = [];
        for (let i = 0; i < window.localStorage.length; i++) {
          const key = window.localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keysToRestore.push(key);
          }
        }

        // Kembalikan memori dari brankas backup ke memori utama
        keysToRestore.forEach(key => {
          const originalKey = key.substring(prefix.length);
          const val = window.localStorage.getItem(key);
          if (val) window.localStorage.setItem(originalKey, val);
        });

        // 3. Catat pergantian shift user
        window.localStorage.setItem('last_user_id', userId);
      }
    }
  }, [userId]);

  // Buat konfigurasi wagmi secara default
  const config = useMemo(() => {
    return getDefaultConfig({
      appName: "Teras Warga",
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "61cc7386d34b46c6eb0d0bb56d2b5689", 
      chains: [polygon, bsc, mainnet],
      ssr: true
    });
  }, [userId]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider key={userId || "guest"} config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={
            mounted && resolvedTheme === "dark"
              ? darkTheme({
                  accentColor: "#1D9BF0",
                  accentColorForeground: "white",
                  borderRadius: "large",
                  fontStack: "system",
                  overlayBlur: "small",
                })
              : lightTheme({
                  accentColor: "#1D9BF0",
                  accentColorForeground: "white",
                  borderRadius: "large",
                  fontStack: "system",
                  overlayBlur: "small",
                })
          }
        >
          <WalletGuard expectedWallet={cryptoWallet || null} userId={userId} />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
