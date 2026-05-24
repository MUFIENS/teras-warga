"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface PresenceContextType {
  onlineUsers: Record<string, string>; // userId -> last_active ISO string
  currentUserId?: string;
}

const PresenceContext = createContext<PresenceContextType | null>(null);

export function PresenceProvider({ children, currentUserId }: { children: React.ReactNode; currentUserId?: string }) {
  const [onlineUsers, setOnlineUsers] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!currentUserId) return;

    const supabase = createClient();
    const room = supabase.channel('online-users');

    room
      .on('presence', { event: 'sync' }, () => {
        const newState = room.presenceState();
        const users: Record<string, string> = {};
        
        for (const id in newState) {
          const presence = newState[id][0] as any;
          if (presence?.user_id) {
            users[presence.user_id] = presence.online_at;
          }
        }
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await room.track({
            user_id: currentUserId,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      supabase.removeChannel(room);
    };
  }, [currentUserId]);

  return (
    <PresenceContext.Provider value={{ onlineUsers, currentUserId }}>
      {children}
    </PresenceContext.Provider>
  );
}

export function usePresence(userId: string | undefined, initialLastActive: string | null) {
  const context = useContext(PresenceContext);
  
  const [isOnline, setIsOnline] = useState(false);
  const [activeTime, setActiveTime] = useState(initialLastActive);

  useEffect(() => {
    if (userId && context?.currentUserId && userId === context.currentUserId) {
      setIsOnline(true);
      setActiveTime(new Date().toISOString());
      return;
    }

    if (userId && context?.onlineUsers[userId]) {
      setIsOnline(true);
      setActiveTime(context.onlineUsers[userId]);
    } else {
      const checkOnline = () => {
        if (!initialLastActive) {
          setIsOnline(false);
          return;
        }
        const diff = (Date.now() - new Date(initialLastActive).getTime()) / 60000;
        setIsOnline(diff < 5); 
      };
      
      checkOnline();
      const interval = setInterval(checkOnline, 60000);
      return () => clearInterval(interval);
    }
  }, [userId, context?.onlineUsers, context?.currentUserId, initialLastActive]);

  return { isOnline, lastActive: activeTime };
}
