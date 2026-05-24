"use client";

import { useState, useTransition } from "react";
import { Wallet, Save, Loader2 } from "lucide-react";
import { updateCryptoWallet } from "@/app/profil/actions";
import { CustomSwal as Swal } from "@/lib/swal";

export function WalletProfileCard({ initialWallet }: { initialWallet: string | null }) {
  const [wallet, setWallet] = useState(initialWallet || "");
  const [isPending, startTransition] = useTransition();

  const handleSave = () => {
    if (wallet && !/^0x[a-fA-F0-9]{40}$/.test(wallet)) {
      Swal.fire({
        icon: "error",
        title: "Format Salah",
        text: "Pastikan alamat wallet EVM dimulai dengan 0x dan berjumlah 42 karakter.",
      });
      return;
    }

    startTransition(async () => {
      try {
        await updateCryptoWallet(wallet);
        Swal.fire({
          icon: "success",
          title: "Tersimpan!",
          text: "Alamat wallet crypto berhasil diperbarui.",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (e: any) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: e.message || "Gagal menyimpan wallet.",
        });
      }
    });
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden mb-6">
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#1D9BF0]/10 text-[#1D9BF0] rounded-xl">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-[17px]">Wallet Crypto</h2>
            <p className="text-sm text-gray-500">Terima pembayaran crypto dari Pasar Warga</p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 bg-gray-50 dark:bg-neutral-800/30">
        <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
          EVM Wallet Address (Polygon / BNB / ETH)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            placeholder="0x..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] transition-all text-sm font-mono"
          />
          <button
            onClick={handleSave}
            disabled={isPending || wallet === initialWallet}
            className="bg-[#1D9BF0] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#1A8CD8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span className="hidden sm:inline">Simpan</span>
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Gunakan alamat dari wallet seperti MetaMask, Trust Wallet, atau Rainbow. Jangan gunakan alamat exchange (Binance, Indodax, dll).
        </p>
      </div>
    </div>
  );
}
