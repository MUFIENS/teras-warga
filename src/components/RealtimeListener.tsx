"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function RealtimeListener() {
  const router = useRouter();
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounce router.refresh() agar tidak dipanggil berulang kali dalam waktu singkat
  const debouncedRefresh = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      router.refresh();
    }, 500);
  }, [router]);

  useEffect(() => {
    const supabase = createClient();
    
    const tables = [
      'posts', 'post_likes', 'post_reposts', 'notifications',
      'market_items', 'kas_transactions', 'reports'
    ] as const;

    const channel = supabase.channel('schema-db-changes');

    for (const table of tables) {
      channel.on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => { debouncedRefresh(); }
      );
    }

    channel.subscribe();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      supabase.removeChannel(channel);
    };
  }, [debouncedRefresh]);

  return null;
}
