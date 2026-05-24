"use client";

import Link from "next/link";
import { BadgeCheck, Star, ShoppingBag, Clock } from "lucide-react";
import { SellerProfile } from "@/types/marketplace";

interface SellerCardProps {
  seller: SellerProfile;
}

function getOnlineStatus(lastActive: string | null): {
  label: string;
  color: string;
  dotClass: string;
} {
  if (!lastActive) return { label: "Offline", color: "text-gray-400", dotClass: "bg-gray-400" };
  const diff = Date.now() - new Date(lastActive).getTime();
  const minutes = diff / 60000;
  if (minutes < 5)
    return { label: "Online", color: "text-emerald-500", dotClass: "bg-emerald-500" };
  if (minutes < 60)
    return { label: `${Math.floor(minutes)}m lalu`, color: "text-amber-500", dotClass: "bg-amber-500" };
  return { label: "Offline", color: "text-gray-400", dotClass: "bg-gray-400" };
}

export function SellerCard({ seller }: SellerCardProps) {
  const status = getOnlineStatus(seller.last_active);

  return (
    <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5">
      <p className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-4">
        Penjual
      </p>

      <Link
        href={`/profil/${seller.username}`}
        className="flex items-center gap-3.5 group"
      >
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          {seller.avatar_url ? (
            <img loading="lazy" src={seller.avatar_url}
              alt={seller.full_name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 dark:ring-neutral-800 group-hover:ring-blue-500 dark:group-hover:ring-blue-400 transition-all duration-200"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg">
              {seller.full_name.charAt(0)}
            </div>
          )}
          {/* Online dot */}
          <span
            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-neutral-900 ${status.dotClass}`}
          />
        </div>

        {/* Name + Username */}
        <div className="min-w-0">
          <p className="font-bold text-[15px] truncate group-hover:text-blue-500 transition-colors flex items-center gap-1.5">
            {seller.full_name}
            {seller.is_seller && (
              <BadgeCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
            )}
          </p>
          <p className="text-sm text-gray-500 dark:text-neutral-500 truncate">
            @{seller.username}
          </p>
        </div>
      </Link>

      {/* Trust Metrics */}
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 grid grid-cols-3 gap-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 dark:text-neutral-500 mb-0.5">
            <Star className="w-3.5 h-3.5" />
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {seller.rating?.toFixed(1) || "—"}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
            Rating
          </p>
        </div>
        <div className="text-center border-x border-gray-100 dark:border-neutral-800">
          <div className="flex items-center justify-center gap-1 text-gray-400 dark:text-neutral-500 mb-0.5">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white">
            {seller.total_sales ?? 0}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
            Terjual
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-gray-400 dark:text-neutral-500 mb-0.5">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <p className={`text-sm font-bold ${status.color}`}>
            {status.label}
          </p>
          <p className="text-[10px] text-gray-400 dark:text-neutral-500 uppercase tracking-wider">
            Status
          </p>
        </div>
      </div>
    </div>
  );
}
