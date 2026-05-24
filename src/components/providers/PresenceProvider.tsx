"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { updateLastActive } from "@/app/profil/actions";

// Utility to ensure Supabase timestamps (which are UTC) are correctly parsed as UTC in JS
const ensureUTC = (dateStr: string | null) => {
  if (!dateStr) return null;
  let normalized = dateStr.replace(' ', 'T');
  if (!normalized.endsWith('Z') && !normalized.match(/[+-]\d{2}:?\d{2}$/)) {
    normalized += 'Z';
  }
  return normalized;
};

interface PresenceContextType {
  onlineUsers: Record<string, string>; // userId -> last_active ISO string
  setOnline: (userId: string, lastActive: string) => void;
}

const PresenceContext = createContext<PresenceContextType | null>(null);

export function PresenceProvider({ children, currentUserId }: { children: React.ReactNode; currentUserId?: string }) {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, string>>({});

  const setOnline = useCallback((userId: string, lastActive: string) => {
    const utcDate = ensureUTC(lastActive);
    if (!utcDate) return;
    
    setOnlineUsers((prev) => {
      if (prev[userId] === utcDate) return prev;
      return { ...prev, [userId]: utcDate };
    });
  }, []);

  // 1. Ping server to maintain own online status
  useEffect(() => {
    if (currentUserId) {
      updateLastActive().catch(console.error);
      const interval = setInterval(() => {
        updateLastActive().catch(console.error);
      }, 3 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [currentUserId]);

  // 2. Listen globally to profile updates for real-time presence
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel('presence-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'profiles' }, (payload) => {
        const newRecord = payload.new;
        if (newRecord.id && newRecord.last_active) {
          setOnline(newRecord.id, newRecord.last_active);
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [setOnline]);

  return (
    <PresenceContext.Provider value={{ onlineUsers, setOnline }}>
      {children}
    </PresenceContext.Provider>
  );
}

/**
 * Custom hook to subscribe to a specific user's real-time online status.
 */
export function usePresence(userId: string | undefined, initialLastActive: string | null) {
  const context = useContext(PresenceContext);
  
  // Use real-time state if available, fallback to initial server-provided state
  const rawActiveTime = (userId && context?.onlineUsers[userId]) || initialLastActive;
  const activeTime = ensureUTC(rawActiveTime);
  
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!activeTime) {
      setIsOnline(false);
      return;
    }
    
    const checkOnline = () => {
      const diff = (Date.now() - new Date(activeTime).getTime()) / 60000;
      setIsOnline(diff < 5);
    };
    
    // Check immediately
    checkOnline();
    
    // Check every minute to downgrade to offline if 5 minutes pass without update
    const interval = setInterval(checkOnline, 60000); 
    
    return () => clearInterval(interval);
  }, [activeTime]);

  return { isOnline, lastActive: activeTime };
}
