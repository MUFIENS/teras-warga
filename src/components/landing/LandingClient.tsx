"use client";

import { useEffect, useState } from "react";
import { FloatingNavbar } from "./FloatingNavbar";
import { HeroSection } from "./sections/HeroSection";
import { FeatureShowcase } from "./sections/FeatureShowcase";
import { RealtimeCommunity } from "./sections/RealtimeCommunity";
import { MarketplacePreview } from "./sections/MarketplacePreview";
import { TrustSection } from "./sections/TrustSection";
import { FinalCTA } from "./sections/FinalCTA";
import { Footer } from "./Footer";
import { ReactLenis } from "lenis/react";
import Ribbons from "../ui/react-bits/Ribbons";
import { useTheme } from "next-themes";
import { useRef } from "react";

export function LandingClient() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    // Smooth scroll behavior global (fallback for non-lenis elements)
    document.documentElement.style.scrollBehavior = "auto"; // Lenis prefers auto, not smooth
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on initial render

  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true }}>
      <div ref={containerRef} className="min-h-screen bg-white dark:bg-black selection:bg-[#1D9BF0] selection:text-white relative">
        {/* Global Ribbons Background */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
          <Ribbons
            colors={mounted && resolvedTheme === 'dark' ? ['#222222', '#333333', '#111111'] : ['#3066be', '#4da3ff', '#1a3a6e']}
            baseThickness={10}
            pointCount={35}
            speedMultiplier={0.5}
          />
        </div>

        <FloatingNavbar />
        <main className="relative z-10">
          <HeroSection />
          <FeatureShowcase />
          <RealtimeCommunity />
          <MarketplacePreview />
          <TrustSection />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
}
