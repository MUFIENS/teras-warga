"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Home } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar } from "@/components/ui/avatar";
import { usePresence } from "@/components/providers/PresenceProvider";

interface MobileHeaderProps {
  profile?: {
    id: string;
    username: string;
    full_name: string;
    avatar_url: string | null;
    is_seller?: boolean;
    last_active?: string | null;
  };
}

export function MobileHeader({ profile }: MobileHeaderProps) {
  const { isOnline } = usePresence(profile?.id, profile?.last_active || null);

  return (
    <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800 w-full">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="relative h-7 flex items-center justify-center">
            <Image 
              src="/logo-ai.png" 
              alt="Logo Teras Warga" 
              width={85} 
              height={28} 
              className="h-7 w-auto object-contain rounded-md block dark:hidden"
            />
            <Image 
              src="/logo-ai-dark.png" 
              alt="Logo Teras Warga Dark" 
              width={85} 
              height={28} 
              className="h-7 w-auto object-contain rounded-md hidden dark:block"
            />
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {profile && (
          <Link href={`/profil/${profile.username}`} className="relative flex-shrink-0">
            <Avatar src={profile.avatar_url} alt={profile.full_name} className="h-8 w-8 hover:opacity-85 transition-opacity" />
            <span className={`absolute bottom-[0px] right-[0px] w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-black ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
          </Link>
        )}
      </div>
    </header>
  );
}
