"use client";

import { useEffect } from "react";
import { X, ExternalLink, Loader2, CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";
import { WalletConnectButton } from "./WalletConnectButton";
import { useCryptoPayment } from "@/hooks/useCryptoPayment";
import { MetaMaskErrorModal } from "./MetaMaskErrorModal";
import { Web3PaymentStatus } from "@/types/marketplace";

interface CryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    price_idr: number;
    seller_crypto_wallet: string | null;
  };
  onSuccess?: (hash: string) => void;
}

export function CryptoPaymentModal({ isOpen, onClose, item, onSuccess }: CryptoPaymentModalProps) {
  const {
    status,
    errorMessage,
    cryptoAmount,
    chainSymbol,
    isRatesLoading,
    hash,
    triggerPayment,
    resetState,
    hasMetaMask
  } = useCryptoPayment(item.price_idr, item.seller_crypto_wallet);

  useEffect(() => {
    if (status === Web3PaymentStatus.SUCCESS && hash && onSuccess) {
      onSuccess(hash);
    }
  }, [status, hash, onSuccess]);

  if (!isOpen) return null;

  // Render Metamask Download UI gracefully if missing
  if (!hasMetaMask) {
    return <MetaMaskErrorModal isOpen={isOpen} onClose={onClose} />;
  }

  const isProcessing = status === Web3PaymentStatus.PREPARING || 
                       status === Web3PaymentStatus.WAITING_CONFIRMATION || 
                       status === Web3PaymentStatus.MINING;

  const isConfirmed = status === Web3PaymentStatus.SUCCESS;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-neutral-800">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#1D9BF0]" />
            Crypto Checkout
          </h2>
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!item.seller_crypto_wallet ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
              <p className="text-lg font-semibold">Penjual Belum Siap</p>
              <p className="text-gray-500 text-sm mt-1">Penjual ini belum menyimpan alamat wallet crypto mereka.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Product Info */}
              <div className="bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800">
                <p className="text-sm text-gray-500 mb-1">Membayar untuk:</p>
                <p className="font-semibold text-lg line-clamp-1">{item.title}</p>
                
                <div className="flex items-end justify-between mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Total Pembayaran</p>
                    <p className="text-xs text-gray-400">Rp {item.price_idr.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    {isRatesLoading ? (
                      <div className="w-24 h-6 bg-gray-200 dark:bg-neutral-700 animate-pulse rounded" />
                    ) : (
                      <p className="font-bold text-2xl text-[#1D9BF0]">
                        ~{cryptoAmount} <span className="text-sm text-gray-900 dark:text-white">{chainSymbol}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Banner */}
              {errorMessage && status === Web3PaymentStatus.ERROR && (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm border border-red-100 dark:border-red-900/30 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Transaksi Gagal</p>
                    <p>{errorMessage}</p>
                    <button onClick={resetState} className="text-xs underline mt-1 opacity-80 hover:opacity-100">Coba Lagi</button>
                  </div>
                </div>
              )}

              {/* Wallet Connect Status */}
              {!isConfirmed && (
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold">Wallet Anda:</p>
                  <WalletConnectButton />
                </div>
              )}

              {/* Action Area */}
              {!isConfirmed && (
                <div className="pt-4 border-t border-gray-100 dark:border-neutral-800">
                  <button
                    onClick={triggerPayment}
                    disabled={isProcessing || isRatesLoading || status === Web3PaymentStatus.ERROR}
                    className="w-full bg-[#1D9BF0] text-white font-bold py-3.5 px-4 rounded-full hover:bg-[#1A8CD8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === Web3PaymentStatus.PREPARING ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Mempersiapkan...
                      </>
                    ) : status === Web3PaymentStatus.WAITING_CONFIRMATION ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Konfirmasi di Wallet...
                      </>
                    ) : status === Web3PaymentStatus.MINING ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Memproses Transaksi...
                      </>
                    ) : (
                      `Bayar ${cryptoAmount} ${chainSymbol}`
                    )}
                  </button>
                </div>
              )}

              {/* Success State */}
              {isConfirmed && (
                <div className="pt-4 border-t border-gray-100 dark:border-neutral-800 text-center animate-in fade-in slide-in-from-bottom-2">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="font-bold text-lg text-green-600 dark:text-green-400">Pembayaran Berhasil!</p>
                  <p className="text-sm text-gray-500 mt-1 mb-3">Dana telah dikirim ke wallet penjual.</p>
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-gray-900 dark:text-white font-bold py-3.5 px-4 rounded-full transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
