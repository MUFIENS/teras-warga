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

export function LandingClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Smooth scroll behavior global
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch on initial render

  return (
    <div className="min-h-screen bg-white dark:bg-black selection:bg-[#1D9BF0] selection:text-white">
      <FloatingNavbar />
      <main>
        <HeroSection />
        <FeatureShowcase />
        <RealtimeCommunity />
        <MarketplacePreview />
        <TrustSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
