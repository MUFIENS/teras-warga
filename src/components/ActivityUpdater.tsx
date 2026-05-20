"use client";
import { useEffect } from "react";
import { updateLastActive } from "@/app/profil/actions";

export function ActivityUpdater() {
  useEffect(() => {
    // Ping segera saat aplikasi dimuat/pengguna masuk
    updateLastActive().catch(console.error);

    // Ping setiap 3 menit untuk menjaga status tetap online
    const interval = setInterval(() => {
      updateLastActive().catch(console.error);
    }, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
