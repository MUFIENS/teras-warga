"use client";

import { Wallet, Landmark, ShieldCheck, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentSelectorProps {
  itemId: string;
  sellerId: string | null;
  priceIdr: number;
  sellerHasWallet: boolean;
  currentUserId: string | null;
  onOpenCryptoModal: () => void;
}

export function PaymentSelector({
  itemId,
  sellerId,
  priceIdr,
  sellerHasWallet,
  currentUserId,
  onOpenCryptoModal,
}: PaymentSelectorProps) {
  const router = useRouter();

  const handleFiatClick = () => {
    if (!currentUserId || !sellerId) {
      // Could use a toast or just redirect to login
      router.push("/login");
      return;
    }
    router.push(`/pesan?user=${sellerId}&product=${itemId}`);
  };

  return (
    <div data-payment-selector className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-5 space-y-3">
      <p className="text-[11px] font-bold text-gray-400 dark:text-neutral-500 uppercase tracking-widest mb-1">
        Metode Pembayaran
      </p>

      {/* Bank Transfer */}
      <button
        onClick={handleFiatClick}
        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50 hover:border-gray-300 dark:hover:border-neutral-700 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Landmark className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm">Beli via Rupiah</p>
            <p className="text-xs text-gray-400 dark:text-neutral-500">
              Lanjut ke obrolan dengan penjual
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-neutral-600 group-hover:text-gray-500 transition-colors" />
      </button>

      {/* Crypto */}
      <button
        onClick={onOpenCryptoModal}
        className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-800/50 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Wallet className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm flex items-center gap-1.5">
              Crypto
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            </p>
            <p className="text-xs text-gray-400 dark:text-neutral-500">
              Otomatis terverifikasi on-chain
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 dark:text-neutral-600 group-hover:text-blue-500 transition-colors" />
      </button>

      {!sellerHasWallet && (
        <p className="text-xs text-gray-400 dark:text-neutral-500 text-center pt-1">
          Penjual belum menyimpan wallet crypto.
        </p>
      )}
    </div>
  );
}
