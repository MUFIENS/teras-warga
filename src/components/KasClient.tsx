"use client";

import { useState, useRef, useTransition } from "react";
import {
  Wallet, Calendar, CheckCircle2, Clock, XCircle,
  ChevronLeft, ChevronRight, ImagePlus, X, Loader2,
  TrendingUp, AlertCircle
} from "lucide-react";
import { submitKasPayment } from "@/app/kas/actions";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast";

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const MONTHLY_AMOUNT = 50000;

interface Transaction {
  id: string;
  month_paid: string;
  year_paid: number;
  amount: number;
  proof_url: string;
  status: "pending" | "verified" | "rejected";
  created_at: string;
  timeAgo: string;
}

interface KasClientProps {
  transactions: Transaction[];
  currentYear: number;
}

export function KasClient({ transactions, currentYear }: KasClientProps) {
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [showPayForm, setShowPayForm] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [proof, setProof] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const yearTransactions = transactions.filter(t => t.year_paid === selectedYear);

  const getMonthStatus = (month: string): Transaction | undefined => {
    return yearTransactions.find(t => t.month_paid === month);
  };

  const paidCount = yearTransactions.filter(t => t.status === "verified").length;
  const pendingCount = yearTransactions.filter(t => t.status === "pending").length;
  const totalPaid = yearTransactions
    .filter(t => t.status === "verified")
    .reduce((sum, t) => sum + t.amount, 0);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency", currency: "IDR",
      minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(price);

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProof(file);
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const openPayForm = (month: string) => {
    const existing = getMonthStatus(month);
    if (existing && existing.status !== "rejected") return;
    setSelectedMonth(month);
    setShowPayForm(true);
    setProof(null);
    setProofPreview(null);
  };

  const handleSubmit = () => {
    if (!selectedMonth || !proof) return;

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("month", selectedMonth);
        formData.append("year", selectedYear.toString());
        formData.append("amount", MONTHLY_AMOUNT.toString());
        formData.append("proof", proof);

        await submitKasPayment(formData);
        setShowPayForm(false);
        setSelectedMonth(null);
        router.refresh();

        showSuccess("Pembayaran Dikirim!", "Bukti pembayaran Anda sedang ditinjau admin.");
      } catch (err: any) {
        showError("Gagal!", err.message || "Terjadi kesalahan.");
      }
    });
  };

  const statusConfig = {
    verified: {
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/30",
      label: "Lunas",
    },
    pending: {
      icon: <Clock className="w-5 h-5" />,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      label: "Menunggu",
    },
    rejected: {
      icon: <XCircle className="w-5 h-5" />,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      label: "Ditolak",
    },
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-14 md:top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-bold">Iuran Kas</h1>
          <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full font-semibold">
            {formatPrice(MONTHLY_AMOUNT)}/bulan
          </span>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3 p-4">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-medium">Lunas</span>
          </div>
          <p className="text-2xl font-bold">{paidCount}</p>
          <p className="text-xs opacity-70 mt-0.5">dari 12 bulan</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Pending</span>
          </div>
          <p className="text-2xl font-bold">{pendingCount}</p>
          <p className="text-xs opacity-70 mt-0.5">menunggu verifikasi</p>
        </div>
        <div className="bg-gradient-to-br from-[#1D9BF0] to-blue-600 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Total</span>
          </div>
          <p className="text-lg font-bold">{formatPrice(totalPaid)}</p>
          <p className="text-xs opacity-70 mt-0.5">terbayar {selectedYear}</p>
        </div>
      </div>

      {/* Year Selector */}
      <div className="flex items-center justify-center gap-4 px-4 py-3">
        <button
          onClick={() => setSelectedYear(y => y - 1)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1D9BF0]" />
          <span className="text-lg font-bold">{selectedYear}</span>
        </div>
        <button
          onClick={() => setSelectedYear(y => y + 1)}
          disabled={selectedYear >= currentYear}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Monthly Grid */}
      <div className="grid grid-cols-3 gap-3 px-4 pb-6">
        {MONTHS.map((month) => {
          const tx = getMonthStatus(month);
          const status = tx ? statusConfig[tx.status] : null;
          const canPay = !tx || tx.status === "rejected";

          return (
            <button
              key={month}
              onClick={() => canPay && openPayForm(month)}
              disabled={!canPay}
              className={`relative rounded-2xl border-2 p-4 transition-all duration-200 text-left ${
                status
                  ? `${status.bg} ${status.border} ${status.color}`
                  : "border-gray-200 dark:border-neutral-700 hover:border-[#1D9BF0] hover:bg-[#1D9BF0]/5 cursor-pointer"
              } ${canPay ? "cursor-pointer active:scale-95" : "cursor-default"}`}
            >
              <p className={`text-sm font-semibold ${status ? "" : "text-gray-700 dark:text-gray-300"}`}>
                {month}
              </p>
              {status ? (
                <div className="flex items-center gap-1.5 mt-2">
                  {status.icon}
                  <span className="text-xs font-medium">{status.label}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-2 text-gray-400">
                  <Wallet className="w-4 h-4" />
                  <span className="text-xs">Belum bayar</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Recent Transactions */}
      {transactions.length > 0 && (
        <div className="px-4 pb-6">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-3 px-1">
            Riwayat Pembayaran
          </h2>
          <div className="space-y-2">
            {transactions.slice(0, 10).map((tx) => {
              const status = statusConfig[tx.status];
              return (
                <div
                  key={tx.id}
                  className="flex items-center gap-4 p-3.5 rounded-xl bg-gray-50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800"
                >
                  <div className={`w-10 h-10 rounded-full ${status.bg} flex items-center justify-center flex-shrink-0`}>
                    <span className={status.color}>{status.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">
                      {tx.month_paid} {tx.year_paid}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5">
                      {tx.timeAgo}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-sm">{formatPrice(tx.amount)}</p>
                    <span className={`text-xs font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Form Modal */}
      {showPayForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPayForm(false)} />
          <div className="relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-neutral-800">
              <h2 className="text-lg font-bold">Bayar Iuran Kas</h2>
              <button onClick={() => setShowPayForm(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Payment Info */}
              <div className="bg-[#1D9BF0]/5 border border-[#1D9BF0]/20 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Periode</span>
                  <span className="font-bold text-[#1D9BF0]">{selectedMonth} {selectedYear}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Jumlah</span>
                  <span className="font-bold text-lg">{formatPrice(MONTHLY_AMOUNT)}</span>
                </div>
              </div>

              {/* Info Alert */}
              <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                  Transfer ke rekening kas RT/RW, lalu unggah bukti transfer di bawah ini. Admin akan memverifikasi pembayaran Anda.
                </p>
              </div>

              {/* Proof Unggah */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Bukti Pembayaran <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleProofChange}
                />
                {proofPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700">
                    <img loading="lazy" src={proofPreview} alt="Bukti" className="w-full max-h-[300px] object-contain bg-gray-50 dark:bg-neutral-800" />
                    <button
                      onClick={() => {
                        setProof(null);
                        setProofPreview(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-10 rounded-xl border-2 border-dashed border-gray-300 dark:border-neutral-700 hover:border-[#1D9BF0] dark:hover:border-[#1D9BF0] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#1D9BF0] transition-colors"
                  >
                    <ImagePlus className="w-8 h-8" />
                    <span className="text-sm font-medium">Unggah Bukti Transfer</span>
                  </button>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-gray-200 dark:border-neutral-800">
              <button
                onClick={handleSubmit}
                disabled={isPending || !proof}
                className="w-full bg-emerald-500 text-white font-bold py-3 rounded-xl hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    Kirim Pembayaran
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
