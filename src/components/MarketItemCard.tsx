"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapPin, Tag, Package, MoreVertical, Trash2, Edit, Eye, EyeOff, MessageCircle, X, CheckCircle2 } from "lucide-react";
import { deleteMarketItem, toggleMarketItemStatus } from "@/app/pasar/actions";
import { showInfo } from "@/lib/toast";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import Link from "next/link";
import Image from "next/image";
import { CryptoPaymentModal } from "./crypto/CryptoPaymentModal";
import { PaymentSelector } from "./pasar/PaymentSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [showPayment, setShowPayment] = useState(false);
  const [showCryptoModal, setShowCryptoModal] = useState(false);
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = async () => {
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
        className={`group flex flex-col h-full bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-neutral-800 transition-all duration-300 md:hover:-translate-y-1 md:hover:border-gray-200 md:dark:hover:border-neutral-700 md:hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] md:dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] md:p-3 overflow-hidden md:overflow-visible ${
          isPending ? "opacity-50" : ""
        }`}
      >
        {/* 1. Seller Header */}
        <div className="flex items-center justify-between p-3 md:p-1 md:mb-2">
          <Link href={`/profil/${seller_username}`} className="flex items-center gap-2.5 min-w-0 hover:opacity-80 transition-opacity flex-1">
            {seller_avatar ? (
              <img src={seller_avatar} alt={seller_name} className="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover flex-shrink-0 border border-gray-100 dark:border-neutral-800" />
            ) : (
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold text-gray-500 uppercase flex-shrink-0">
                {seller_name.charAt(0)}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {seller_name}
                </span>
                {/* Simulated Verification/Seller Badge */}
                <CheckCircle2 className="w-3.5 h-3.5 text-[#1D9BF0] flex-shrink-0" />
              </div>
              <span className="text-[11px] text-gray-500 dark:text-gray-400">{timeAgo}</span>
            </div>
          </Link>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 -mr-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors focus:outline-none">
                  <MoreVertical className="w-4.5 h-4.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => onEdit?.(id)} className="gap-2 cursor-pointer">
                  <Edit className="w-4 h-4" /> Edit Barang
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleToggleStatus} className="gap-2 cursor-pointer">
                  {is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {is_active ? "Tandai Terjual" : "Aktifkan Kembali"}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600 dark:focus:text-red-500 gap-2 cursor-pointer">
                  <Trash2 className="w-4 h-4" /> Hapus Barang
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* 2. Product Media */}
        <Link href={`/pasar/${id}`} className="relative aspect-[4/3] md:aspect-[1/1] w-full bg-gray-50 dark:bg-neutral-900 overflow-hidden md:rounded-xl flex-shrink-0 group/image block">
          {image_url ? (
            <Image 
              src={image_url}
              alt={title}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              priority={priority}
              className={`object-cover transition-transform duration-500 md:group-hover/image:scale-105 ${!is_active ? "grayscale-[50%] brightness-75" : ""}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-300 dark:text-neutral-700" />
            </div>
          )}

          {/* Status Overlay */}
          {!is_active && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10 backdrop-blur-[2px]">
              <div className="bg-white/95 dark:bg-black/95 text-gray-900 dark:text-white px-5 py-2 rounded-full font-bold text-sm tracking-wide shadow-lg border border-black/5 dark:border-white/10">
                TERJUAL
              </div>
            </div>
          )}
        </Link>

        {/* 3. Product Information */}
        <div className="p-3 md:p-1 md:mt-3 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-[17px] font-bold text-[#1D9BF0] leading-tight">
              {formatPrice(price_idr)}
            </p>
          </div>

          <Link href={`/pasar/${id}`}>
            <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-[14px] line-clamp-2 leading-snug hover:text-[#1D9BF0] dark:hover:text-[#1D9BF0] transition-colors cursor-pointer mb-2">
              {title}
            </h3>
          </Link>

          <div className="flex flex-wrap items-center gap-1.5 mt-auto">
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${categoryColor[category] || categoryColor["Lainnya"]}`}>
              {category}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
              <Tag className="w-3 h-3" />
              {condition}
            </span>
          </div>
        </div>

        {/* 4. Action Footer */}
        {!isOwner && (
          <div className="px-3 pb-3 md:px-1 md:pb-1 mt-2">
            <div className="flex items-center gap-2 w-full">
              {is_active ? (
                <button
                  onClick={() => setShowPayment(true)}
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold bg-[#1D9BF0] text-white py-2 rounded-xl hover:bg-[#1A8CD8] active:scale-[0.98] transition-all"
                >
                  <Package className="w-4 h-4" />
                  Beli
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-gray-500 py-2 rounded-xl cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Terjual
                </button>
              )}
              
              <button
                onClick={handleContact}
                className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-[#1D9BF0] bg-[#1D9BF0]/10 hover:bg-[#1D9BF0]/20 py-2 rounded-xl active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>
            </div>
          </div>
        )}
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
