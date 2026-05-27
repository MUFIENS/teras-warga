"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapPin, Tag, Package, MoreVertical, Trash2, Edit, Eye, EyeOff, MessageCircle, X } from "lucide-react";
import { deleteMarketItem, toggleMarketItemStatus } from "@/app/pasar/actions";
import { showInfo } from "@/lib/toast";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import Link from "next/link";
import Image from "next/image";
import { CryptoPaymentModal } from "./crypto/CryptoPaymentModal";
import { PaymentSelector } from "./pasar/PaymentSelector";
import { useRef } from "react";

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
  seller_crypto_wallet?: string | null;
  seller_id: string;
  currentUserId: string | null;
  isOwner: boolean;
  timeAgo: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, newStatus: boolean) => void;
  priority?: boolean;
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
  seller_crypto_wallet,
  seller_id,
  currentUserId,
  isOwner,
  timeAgo,
  onEdit,
  onDelete,
  onToggleStatus,
  priority = false,
}: MarketItemCardProps) {
  const [isPending, startTransition] = useTransition();
  const [showMenu, setShowMenu] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const menuRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = async () => {
    setShowMenu(false);
    const ok = await confirm({
      title: "Hapus Barang?",
      description: "Barang ini akan dihapus permanen dari pasar.",
      confirmText: "Ya, hapus!",
      cancelText: "Batal",
      variant: "danger",
    });
    if (ok) {
      onDelete?.(id);
      startTransition(async () => {
        await deleteMarketItem(id);
      });
    }
  };

  const handleToggleStatus = () => {
    setShowMenu(false);
    onToggleStatus?.(id, !is_active);
    startTransition(async () => {
      await toggleMarketItemStatus(id);
    });
  };

  const handleContact = () => {
    showInfo("Hubungi Penjual", `Chat @${seller_username} melalui halaman pesan.`);
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
    <>
    <ConfirmDialog />
    <div
      className={`group relative flex flex-col h-full bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20 hover:-translate-y-0.5 ${
        isPending ? "opacity-50" : ""
      } ${!is_active ? "opacity-70" : ""}`}
    >
      {/* Image Block */}
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-neutral-800 overflow-hidden block">
        <Link href={`/pasar/${id}`} className={`absolute inset-0 z-0 ${isPending ? 'pointer-events-none' : ''}`}>
          {image_url ? (
            <Image 
              src={image_url}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              priority={priority}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
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
        </Link>

        {/* Category Badge */}
        <div className="absolute top-3 left-3 pointer-events-none z-10">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColor[category] || categoryColor["Lainnya"]}`}>
            {category}
          </span>
        </div>

        {/* Owner Menu */}
        {isOwner && (
          <div className="absolute top-3 right-3 z-30" ref={menuRef}>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors relative"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showMenu && (
              <div className="absolute right-0 top-9 w-44 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700 overflow-hidden z-20 py-1">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(false); onEdit?.(id); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2.5"
                >
                  <Edit className="w-4 h-4" /> Edit Barang
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleStatus(); }}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2.5"
                >
                  {is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {is_active ? "Tandai Terjual" : "Aktifkan Kembali"}
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(); }}
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
      <div className="p-4 flex flex-col flex-1">
        {/* Price */}
        <p className="text-lg font-bold text-[#1D9BF0]">
          {formatPrice(price_idr)}
        </p>

        {/* Title */}
        <Link href={`/pasar/${id}`}>
          <h3 className="font-semibold text-[15px] mt-1 line-clamp-2 leading-snug hover:text-[#1D9BF0] transition-colors cursor-pointer">
            {title}
          </h3>
        </Link>

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
        <div className="border-t border-gray-100 dark:border-neutral-800 mt-auto pt-3">
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
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowPayment(true)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold bg-[#1D9BF0] text-white px-2.5 py-1.5 rounded-full hover:bg-[#1A8CD8] transition-colors"
                >
                  <Package className="w-3.5 h-3.5" />
                  Beli
                </button>
                <button
                  onClick={handleContact}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1D9BF0] hover:bg-[#1D9BF0]/10 px-2.5 py-1.5 rounded-full transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* Payment Selector Modal */}
      {mounted && showPayment && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowPayment(false)}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-sm relative shadow-2xl border border-gray-100 dark:border-neutral-800 animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
             <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-neutral-800">
                <h3 className="text-lg font-bold">Pilih Pembayaran</h3>
                <button onClick={() => setShowPayment(false)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                   <X className="w-5 h-5" />
                </button>
             </div>
             <div className="p-4">
               <PaymentSelector 
                  itemId={id}
                  sellerId={seller_id}
                  priceIdr={price_idr}
                  sellerHasWallet={!!seller_crypto_wallet}
                  currentUserId={currentUserId}
                  onOpenCryptoModal={() => {
                    setShowPayment(false);
                    setShowCryptoModal(true);
                  }}
               />
             </div>
          </div>
        </div>,
        document.body
      )}

      {/* Crypto Payment Modal */}
      {mounted && showCryptoModal && createPortal(
        <CryptoPaymentModal
          isOpen={showCryptoModal}
          onClose={() => setShowCryptoModal(false)}
          item={{
            id,
            title,
            price_idr,
            seller_crypto_wallet: seller_crypto_wallet || null,
          }}
          onSuccess={(hash) => {
            // Optional: send success event
            setShowCryptoModal(false);
          }}
        />,
        document.body
      )}
    </>
  );
}
