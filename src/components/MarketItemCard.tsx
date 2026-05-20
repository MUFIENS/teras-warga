"use client";

import { useState, useTransition } from "react";
import { MapPin, Tag, Package, MoreVertical, Trash2, Edit, Eye, EyeOff, MessageCircle } from "lucide-react";
import { deleteMarketItem, toggleMarketItemStatus } from "@/app/pasar/actions";
import Swal from "sweetalert2";
import Link from "next/link";

interface MarketItemCardProps {
  id: string;
  title: string;
  description: string | null;
  price_idr: number;
  image_url: string | null;
  category: string;
  condition: string;
  location: string | null;
  is_active: boolean;
  seller_name: string;
  seller_username: string;
  seller_avatar: string | null;
  isOwner: boolean;
  timeAgo: string;
  onEdit?: (id: string) => void;
}

export function MarketItemCard({
  id,
  title,
  description,
  price_idr,
  image_url,
  category,
  condition,
  location,
  is_active,
  seller_name,
  seller_username,
  seller_avatar,
  isOwner,
  timeAgo,
  onEdit,
}: MarketItemCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showMenu, setShowMenu] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = () => {
    setShowMenu(false);
    Swal.fire({
      title: "Hapus Barang?",
      text: "Barang ini akan dihapus permanen dari pasar.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      background: document.documentElement.classList.contains("dark") ? "#171717" : "#ffffff",
      color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000",
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          await deleteMarketItem(id);
        });
      }
    });
  };

  const handleToggleStatus = () => {
    setShowMenu(false);
    startTransition(async () => {
      await toggleMarketItemStatus(id);
    });
  };

  const handleContact = () => {
    Swal.fire({
      title: "Hubungi Penjual",
      html: `
        <div style="text-align:left; padding: 8px 0;">
          <p style="margin-bottom: 8px;"><strong>Penjual:</strong> ${seller_name}</p>
          <p style="margin-bottom: 8px;"><strong>Username:</strong> @${seller_username}</p>
          <p style="font-size: 14px; color: #666;">Fitur chat langsung akan segera hadir. Untuk saat ini, Anda dapat menghubungi penjual melalui halaman profil.</p>
        </div>
      `,
      icon: "info",
      confirmButtonColor: "#1D9BF0",
      confirmButtonText: "OK",
      background: document.documentElement.classList.contains("dark") ? "#171717" : "#ffffff",
      color: document.documentElement.classList.contains("dark") ? "#ffffff" : "#000000",
    });
  };

  const categoryColor: Record<string, string> = {
    "Elektronik": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "Pakaian": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "Makanan": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    "Furnitur": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    "Kendaraan": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "Jasa": "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    "Lainnya": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  };

  return (
    <div
      className={`group relative bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5 ${
        isPending ? "opacity-50 pointer-events-none" : ""
      } ${!is_active ? "opacity-70" : ""}`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-neutral-800 overflow-hidden">
        {image_url ? (
          <img
            src={image_url}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-gray-300 dark:text-neutral-600" />
          </div>
        )}

        {/* Status Badge */}
        {!is_active && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-1.5 rounded-full font-semibold text-sm">
              Terjual
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColor[category] || categoryColor["Lainnya"]}`}>
            {category}
          </span>
        </div>

        {/* Owner Menu */}
        {isOwner && (
          <div className="absolute top-3 right-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-9 w-44 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700 overflow-hidden z-20 py-1">
                <button
                  onClick={() => { setShowMenu(false); onEdit?.(id); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2.5"
                >
                  <Edit className="w-4 h-4" /> Edit Barang
                </button>
                <button
                  onClick={handleToggleStatus}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2.5"
                >
                  {is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {is_active ? "Tandai Terjual" : "Aktifkan Kembali"}
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2.5"
                >
                  <Trash2 className="w-4 h-4" /> Hapus Barang
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Price */}
        <p className="text-lg font-bold text-[#1D9BF0]">
          {formatPrice(price_idr)}
        </p>

        {/* Title */}
        <h3 className="font-semibold text-[15px] mt-1 line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Condition & Location */}
        <div className="flex flex-wrap items-center gap-2 mt-2.5">
          <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
            <Tag className="w-3 h-3" />
            {condition}
          </span>
          {location && (
            <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full">
              <MapPin className="w-3 h-3" />
              {location}
            </span>
          )}
        </div>

        {/* Separator */}
        <div className="border-t border-gray-100 dark:border-neutral-800 mt-3 pt-3">
          <div className="flex items-center justify-between">
            {/* Seller Info */}
            <Link href={`/profil/${seller_username}`} className="flex items-center gap-2 min-w-0 hover:opacity-80 transition-opacity">
              {seller_avatar ? (
                <img src={seller_avatar} alt={seller_name} className="w-6 h-6 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-gray-500 uppercase flex-shrink-0">
                  {seller_name.charAt(0)}
                </div>
              )}
              <span className="text-xs text-gray-500 dark:text-neutral-400 truncate hover:underline">{seller_name}</span>
            </Link>

            {/* Contact Button */}
            {!isOwner && is_active && (
              <button
                onClick={handleContact}
                className="flex items-center gap-1.5 text-xs font-semibold text-[#1D9BF0] hover:bg-[#1D9BF0]/10 px-3 py-1.5 rounded-full transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Hubungi
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
