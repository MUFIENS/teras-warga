"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import {
  Search, Plus, X, Calendar, Clock, CheckCircle2, Loader2,
  AlertTriangle, Trash2, MoreVertical, Filter, Tag,
  Box, ArrowRightLeft, User, ShieldCheck, ChevronRight
} from "lucide-react";
import { createBorrowRequest, updateBorrowStatus, deleteBorrowRequest } from "@/app/peminjaman/actions";
import { useRouter } from "next/navigation";
import { CustomSwal as Swal } from "@/lib/swal";
import Link from "next/link";
import { BORROW_CATEGORIES } from "@/lib/validators";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";

const CATEGORY_META: Record<string, { icon: any; color: string }> = {
  Semua: { icon: Filter, color: "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400" },
  "Alat Kebersihan": { icon: Box, color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  "Peralatan Acara": { icon: Box, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  "Peralatan Olahraga": { icon: Box, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  "Peralatan Kerja": { icon: Box, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  "Barang Umum": { icon: Box, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400" },
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending: { label: "Menunggu", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-100 dark:bg-amber-900/30", dot: "bg-amber-500" },
  approved: { label: "Disetujui", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-100 dark:bg-blue-900/30", dot: "bg-blue-500" },
  borrowed: { label: "Dipinjam", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-100 dark:bg-indigo-900/30", dot: "bg-indigo-500" },
  returned: { label: "Dikembalikan", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30", dot: "bg-emerald-500" },
  rejected: { label: "Ditolak", color: "text-red-600 dark:text-red-400", bg: "bg-red-100 dark:bg-red-900/30", dot: "bg-red-500" },
};

interface InventoryItem {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string;
  is_available: boolean;
}

interface BorrowRequest {
  id: string;
  item_id: string;
  start_date: string;
  end_date: string;
  status: "pending" | "approved" | "borrowed" | "returned" | "rejected";
  purpose: string | null;
  admin_notes: string | null;
  created_at: string;
  user_id: string;
  inventory: { name: string; image_url: string | null; category: string } | null;
  profiles: { full_name: string; username: string; avatar_url: string | null } | null;
}

interface PeminjamanClientProps {
  items: InventoryItem[];
  requests: BorrowRequest[];
  currentUserId: string;
  userRole: "warga" | "admin";
}

export function PeminjamanClient({ items, requests, currentUserId, userRole }: PeminjamanClientProps) {
  const [viewTab, setViewTab] = useState<"barang" | "riwayat">("barang");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Status Formulir
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [purpose, setPurpose] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal Admin
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminRequest, setAdminRequest] = useState<BorrowRequest | null>(null);
  const [adminStatus, setAdminStatus] = useState<string>("pending");
  const [adminNotes, setAdminNotes] = useState("");

  

  const filteredItems = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === "Semua" || item.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const filteredRequests = requests.filter((req) => {
    const matchSearch = (req.inventory?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || (req.purpose || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === "Semua" || req.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  const handleBorrowSubmit = () => {
    if (!selectedItem || !purpose.trim() || !startDate || !endDate) return;
    
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("itemId", selectedItem.id);
        fd.append("purpose", purpose);
        fd.append("startDate", startDate);
        fd.append("endDate", endDate);
        await createBorrowRequest(fd);
        setShowBorrowForm(false);
        setSelectedItem(null);
        setPurpose(""); setStartDate(""); setEndDate("");
        setViewTab("riwayat");
        Swal.fire({ title: "Berhasil!", text: "Permintaan peminjaman berhasil diajukan.", icon: "success", confirmButtonColor: "#1D9BF0" });
      } catch (err: any) {
        Swal.fire({ title: "Gagal!", text: err.message, icon: "error", confirmButtonColor: "#d33" });
      }
    });
  };

  const handleDeleteRequest = (id: string) => {
    Swal.fire({
      title: "Batalkan Permintaan?", text: "Permintaan peminjaman akan dibatalkan.", icon: "warning",
      showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, batalkan!", cancelButtonText: "Tidak",
    }).then((res) => {
      if (res.isConfirmed) startTransition(async () => { await deleteBorrowRequest(id); router.refresh(); });
    });
  };

  const handleAdminUpdate = () => {
    if (!adminRequest) return;
    startTransition(async () => {
      try {
        await updateBorrowStatus(adminRequest.id, adminStatus, adminNotes);
        setShowAdminModal(false);
        setAdminRequest(null);
        Swal.fire({ title: "Berhasil!", text: "Status diperbarui.", icon: "success", confirmButtonColor: "#1D9BF0" });
      } catch (err: any) {
        Swal.fire({ title: "Gagal!", text: err.message, icon: "error", confirmButtonColor: "#d33" });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold">Peminjaman</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-gray-100 dark:border-neutral-800 px-4">
          <button onClick={() => setViewTab("barang")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${viewTab === "barang" ? "border-[#1D9BF0] text-[#1D9BF0]" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            Barang Tersedia
          </button>
          <button onClick={() => setViewTab("riwayat")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${viewTab === "riwayat" ? "border-[#1D9BF0] text-[#1D9BF0]" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {userRole === "admin" ? "Semua Permintaan" : "Riwayat Saya"}
          </button>
        </div>

        {/* Filter */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-neutral-900/50">
          <div className="relative mb-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={`Cari ${viewTab === "barang" ? "barang" : "riwayat"}...`} className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-sm transition-all" />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full"><X className="w-4 h-4 text-gray-400" /></button>}
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {viewTab === "barang" ? (
              ["Semua", ...BORROW_CATEGORIES].map((c) => {
                const isActive = selectedCategory === c;
                return (
                  <button key={c} onClick={() => setSelectedCategory(c)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${isActive ? "bg-[#1D9BF0] text-white" : "bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-neutral-400"}`}>
                    {c}
                  </button>
                );
              })
            ) : (
              ["Semua", "pending", "approved", "borrowed", "returned", "rejected"].map((s) => {
                const isActive = selectedStatus === s;
                const label = s === "Semua" ? "Semua" : STATUS_CFG[s].label;
                return (
                  <button key={s} onClick={() => setSelectedStatus(s)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${isActive ? "bg-[#1D9BF0] text-white" : "bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-600 dark:text-neutral-400"}`}>
                    {label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </header>

      {/* ─── CONTENT ─── */}
      <div className="flex-1 p-4">
        {viewTab === "barang" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col hover:border-[#1D9BF0] transition-colors">
                <div className="relative aspect-[4/3] bg-gray-100 dark:bg-neutral-800">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400"><Box className="w-8 h-8 opacity-50" /></div>
                  )}
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-medium text-sm px-3 py-1 bg-red-500/80 rounded-full backdrop-blur-md">Tidak Tersedia</span>
                    </div>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">{item.category}</span>
                  <h3 className="font-semibold text-sm leading-tight mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 line-clamp-2 mb-3 flex-1">{item.description}</p>
                  <button onClick={() => { setSelectedItem(item); setShowBorrowForm(true); }} disabled={!item.is_available} className="w-full py-2 bg-gray-100 dark:bg-neutral-800 hover:bg-[#1D9BF0] hover:text-white dark:hover:bg-[#1D9BF0] text-sm font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    Pinjam
                  </button>
                </div>
              </div>
            ))}
            {filteredItems.length === 0 && (
              <div className="col-span-full py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4"><Box className="w-8 h-8 text-gray-400" /></div>
                <p className="text-gray-500 font-medium">Tidak ada barang yang ditemukan.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((req) => {
              const sCfg = STATUS_CFG[req.status];
              return (
                <div key={req.id} className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-4 relative group hover:border-gray-300 dark:hover:border-neutral-700 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl bg-gray-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                      {req.inventory?.image_url ? (
                        <img src={req.inventory.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Box className="w-6 h-6 text-gray-400" /></div>
                      )}
                    </div>
                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${sCfg.bg} ${sCfg.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />{sCfg.label}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">{format(new Date(req.created_at), "dd MMM yyyy", { locale: localeId })}</span>
                      </div>
                      <h3 className="font-semibold text-[15px] truncate">{req.inventory?.name || "Barang Dihapus"}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">{req.purpose}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 font-medium">
                        <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{format(new Date(req.start_date), "dd MMM", { locale: localeId })} - {format(new Date(req.end_date), "dd MMM", { locale: localeId })}</div>
                        {userRole === "admin" && (
                          <div className="flex items-center gap-1.5 ml-2 border-l border-gray-200 dark:border-neutral-700 pl-3">
                            <User className="w-3.5 h-3.5" />
                            <Link href={`/profil/${req.profiles?.username}`} className="hover:underline hover:text-[#1D9BF0] transition-colors">
                              {req.profiles?.full_name || "Anonim"}
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {req.admin_notes && (
                    <div className="mt-3 p-3 bg-gray-50 dark:bg-neutral-800/50 rounded-xl border border-gray-100 dark:border-neutral-800">
                      <p className="text-[11px] font-semibold text-gray-500 mb-1 flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Catatan Admin</p>
                      <p className="text-xs text-gray-600 dark:text-neutral-300">{req.admin_notes}</p>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-800 flex items-center justify-end gap-2">
                    {userRole === "admin" && (
                      <button onClick={() => { setAdminRequest(req); setAdminStatus(req.status); setAdminNotes(req.admin_notes || ""); setShowAdminModal(true); }} className="px-3 py-1.5 text-xs font-semibold bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg hover:bg-violet-200 dark:hover:bg-violet-900/50 transition-colors">
                        Kelola Status
                      </button>
                    )}
                    {(req.status === "pending" || userRole === "admin") && (
                      <button onClick={() => handleDeleteRequest(req.id)} className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                        {userRole === "admin" ? "Hapus" : "Batalkan"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {filteredRequests.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4"><ArrowRightLeft className="w-8 h-8 text-gray-400" /></div>
                <p className="text-gray-500 font-medium">Tidak ada riwayat peminjaman.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── BORROW FORM MODAL ─── */}
      {showBorrowForm && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBorrowForm(false)} />
          <div className="relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between bg-gray-50/50 dark:bg-neutral-900">
              <h2 className="font-bold">Ajukan Peminjaman</h2>
              <button onClick={() => setShowBorrowForm(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex gap-3 items-center p-3 rounded-xl bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800">
                <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
                  {selectedItem.image_url ? <img src={selectedItem.image_url} alt="" className="w-full h-full object-cover" /> : <Box className="w-6 h-6 m-auto mt-3 text-gray-400" />}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{selectedItem.name}</h3>
                  <p className="text-xs text-gray-500">{selectedItem.category}</p>
                </div>
              </div>
              
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Tujuan Peminjaman <span className="text-red-500">*</span></label>
                <textarea value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="Untuk kegiatan kerja bakti RT 01..." rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-sm resize-none" maxLength={500} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Tanggal Pinjam <span className="text-red-500">*</span></label>
                  <input type="date" value={startDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Tanggal Kembali <span className="text-red-500">*</span></label>
                  <input type="date" value={endDate} min={startDate || new Date().toISOString().split("T")[0]} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-sm" />
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900">
              <button onClick={handleBorrowSubmit} disabled={isPending || !purpose.trim() || !startDate || !endDate} className="w-full bg-[#1D9BF0] text-white font-semibold py-2.5 rounded-xl hover:bg-[#1A8CD8] disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kirim Permintaan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ADMIN MANAGE MODAL ─── */}
      {showAdminModal && adminRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAdminModal(false)} />
          <div className="relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden">
            <div className="p-4 border-b border-gray-100 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="font-bold flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-violet-500" />Kelola Peminjaman</h2>
              <button onClick={() => setShowAdminModal(false)} className="p-1 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Status</label>
                <select value={adminStatus} onChange={(e) => setAdminStatus(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm">
                  <option value="pending">Menunggu</option>
                  <option value="approved">Disetujui</option>
                  <option value="borrowed">Sedang Dipinjam</option>
                  <option value="returned">Sudang Dikembalikan</option>
                  <option value="rejected">Ditolak</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">Catatan Admin</label>
                <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Boleh diambil di pos satpam..." rows={3} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none" maxLength={500} />
              </div>
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-neutral-800">
              <button onClick={handleAdminUpdate} disabled={isPending} className="w-full bg-violet-600 text-white font-semibold py-2.5 rounded-xl hover:bg-violet-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors">
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
