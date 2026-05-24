"use client";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { polygon, bsc, mainnet } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const config = getDefaultConfig({
  appName: "Teras Warga",
  projectId: "YOUR_PROJECT_ID", // TODO: Move to .env
  chains: [polygon, bsc, mainnet],
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const queryClient = new QueryClient();

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
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
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
