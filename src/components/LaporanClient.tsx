"use client";

import { useState, useRef, useTransition } from "react";
import {
  Search, Plus, X, MapPin, Clock, CheckCircle2, Loader2,
  AlertTriangle, ImagePlus, Trash2, MoreVertical, Filter,
  Construction, Droplets, Zap, TreePine, ShieldAlert, HelpCircle,
  ThumbsUp, MessageCircle, ChevronDown, ArrowUpRight,
} from "lucide-react";
import { createReport, deleteReport, toggleUpvote } from "@/app/laporan/actions";
import { useRouter } from "next/navigation";
import { showSuccess, showError } from "@/lib/toast";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import Link from "next/link";
import { REPORT_CATEGORIES } from "@/lib/validators";

const CATEGORY_META: Record<string, { icon: typeof Filter; color: string }> = {
  Semua: { icon: Filter, color: "bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-neutral-400" },
  Infrastruktur: { icon: Construction, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  Kebersihan: { icon: Droplets, color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  Keamanan: { icon: ShieldAlert, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  "Listrik dan Air": { icon: Zap, color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  Lingkungan: { icon: TreePine, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  Lainnya: { icon: HelpCircle, color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
};

const STATUS_CFG: Record<string, { label: string; icon: typeof Filter; color: string; bg: string; border: string; dot: string }> = {
  pending: { label: "Menunggu", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-500" },
  reviewed: { label: "Ditinjau", icon: CheckCircle2, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", dot: "bg-indigo-500" },
  in_progress: { label: "Diproses", icon: Loader2, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-500" },
  resolved: { label: "Selesai", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  rejected: { label: "Ditolak", icon: AlertTriangle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-500" },
};

const PRIORITY_CFG: Record<string, { label: string; color: string }> = {
  rendah: { label: "Rendah", color: "text-gray-400" },
  normal: { label: "Normal", color: "text-blue-400" },
  tinggi: { label: "Tinggi", color: "text-orange-500" },
  mendesak: { label: "Mendesak", color: "text-red-500" },
};

interface Report {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  category: string;
  location: string | null;
  status: "pending" | "reviewed" | "in_progress" | "resolved" | "rejected";
  priority: string;
  admin_notes: string | null;
  upvotes_count: number;
  comment_count: number;
  hasUpvoted: boolean;
  created_at: string;
  user_id: string;
  profiles: { full_name: string; username: string; avatar_url: string | null } | null;
  timeAgo: string;
}

interface LaporanClientProps {
  reports: Report[];
  currentUserId: string;
  userRole: "warga" | "admin";
}

export function LaporanClient({ reports, currentUserId, userRole }: LaporanClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [selectedStatus, setSelectedStatus] = useState<string>("Semua");
  const [viewTab, setViewTab] = useState<"semua" | "saya">("semua");
  const [showForm, setShowForm] = useState(false);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  // Status formulir
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Infrastruktur");
  const [priority, setPriority] = useState("normal");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Filter
  const filtered = reports.filter((r) => {
    if (viewTab === "saya" && r.user_id !== currentUserId) return false;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q);
    const matchCat = selectedCategory === "Semua" || r.category === selectedCategory;
    const matchStatus = selectedStatus === "Semua" || r.status === selectedStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const stats: Record<string, number> = {
    pending: reports.filter((r) => r.status === "pending").length,
    reviewed: reports.filter((r) => r.status === "reviewed").length,
    in_progress: reports.filter((r) => r.status === "in_progress").length,
    resolved: reports.filter((r) => r.status === "resolved").length,
    rejected: reports.filter((r) => r.status === "rejected").length,
  };

  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setImage(f);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(f);
    }
  };

  const resetForm = () => {
    setTitle(""); setDescription(""); setCategory("Infrastruktur");
    setPriority("normal"); setLocation(""); setImage(null); setImagePreview(null);
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) return;
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("title", title.trim());
        fd.append("description", description.trim());
        fd.append("category", category);
        fd.append("priority", priority);
        fd.append("location", location.trim());
        if (image) fd.append("image", image);
        await createReport(fd);
        resetForm(); setShowForm(false); router.refresh();
        showSuccess("Laporan Terkirim!", "Laporan Anda akan ditinjau oleh admin.");
      } catch (err: unknown) {
        showError("Gagal!", err instanceof Error ? err.message : 'Terjadi kesalahan');
      }
    });
  };

  const handleDelete = async (id: string) => {
    setMenuOpen(null);
    const ok = await confirm({
      title: "Hapus Laporan?",
      description: "Laporan akan dihapus permanen.",
      confirmText: "Ya, hapus!",
      cancelText: "Batal",
      variant: "danger",
    });
    if (ok) startTransition(async () => { await deleteReport(id); router.refresh(); });
  };

  const handleUpvote = (e: React.MouseEvent, reportId: string) => {
    e.preventDefault(); e.stopPropagation();
    startTransition(async () => { await toggleUpvote(reportId); router.refresh(); });
  };

  return (
    <>
      <ConfirmDialog />
      {/* ─── HEADER ─── */}
      <header className="sticky top-14 md:top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold">Laporan Warga</h1>
            <span className="text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold tabular-nums">{reports.length}</span>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="flex items-center gap-1.5 bg-[#1D9BF0] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#1A8CD8] active:scale-[0.97] transition-all">
            <Plus className="w-4 h-4" />Lapor
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Cari laporan..." className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent text-sm transition-all" />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-full"><X className="w-4 h-4 text-gray-400" /></button>}
          </div>
        </div>

        {/* Categories */}
        <div className="px-4 pb-3 flex gap-2 overflow-x-auto no-scrollbar">
          {["Semua", ...REPORT_CATEGORIES].map((c) => {
            const meta = CATEGORY_META[c] || CATEGORY_META.Lainnya;
            const Icon = meta.icon;
            const isActive = selectedCategory === c;
            return (
              <button key={c} onClick={() => setSelectedCategory(c)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${isActive ? "bg-[#1D9BF0] text-white shadow-sm" : "bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-neutral-700"}`}>
                <Icon className="w-3.5 h-3.5" />{c}
              </button>
            );
          })}
        </div>
      </header>

      <div className="grid grid-cols-5 gap-3 p-4 overflow-x-auto">
        {(["pending", "reviewed", "in_progress", "resolved", "rejected"] as const).map((s) => {
          const cfg = STATUS_CFG[s];
          const isActive = selectedStatus === s;
          return (
            <button key={s} onClick={() => setSelectedStatus(isActive ? "Semua" : s)} className={`min-w-[120px] rounded-xl p-3.5 border transition-all text-left ${isActive ? `${cfg.bg} ${cfg.border} border-2` : "border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700"}`}>
              <div className={`flex items-center gap-1.5 ${cfg.color}`}>
                <cfg.icon className={`w-4 h-4 ${s === "in_progress" && isActive ? "animate-spin" : ""}`} />
                <span className="text-xs font-medium">{cfg.label}</span>
              </div>
              <p className="text-2xl font-bold mt-1.5">{stats[s]}</p>
            </button>
          );
        })}
      </div>

      {/* ─── TABS ─── */}
      <div className="flex border-b border-gray-200 dark:border-neutral-800 px-4">
        {([["semua", "Semua Laporan"], ["saya", "Laporan Saya"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setViewTab(key as "semua" | "saya")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${viewTab === key ? "border-[#1D9BF0] text-[#1D9BF0]" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>{label}</button>
        ))}
      </div>

      {/* ─── REPORT LIST ─── */}
      {filtered.length > 0 ? (
        <div className="px-4 py-4 space-y-3">
          {filtered.map((r) => {
            const sCfg = STATUS_CFG[r.status];
            const pCfg = PRIORITY_CFG[r.priority] || PRIORITY_CFG.normal;
            const catMeta = CATEGORY_META[r.category] || CATEGORY_META.Lainnya;
            const isOwner = currentUserId === r.user_id;

            return (
              <div onClick={() => router.push(`/laporan/${r.id}`)} key={r.id} className="block group cursor-pointer">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 hover:border-gray-300 dark:hover:border-neutral-700 transition-all">
                  {/* Image */}
                  {r.image_url && (
                    <div className="relative h-44 overflow-hidden rounded-t-2xl">
                      <img loading="lazy" src={r.image_url} alt={r.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    </div>
                  )}

                  <div className="p-4">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-2.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${catMeta.color}`}>{r.category}</span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${sCfg.bg} ${sCfg.color}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sCfg.dot}`} />{sCfg.label}
                      </span>
                      {r.priority !== "normal" && (
                        <span className={`text-[11px] font-medium ${pCfg.color}`}>• {pCfg.label}</span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-semibold text-[15px] leading-snug group-hover:text-[#1D9BF0] transition-colors">{r.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">{r.description}</p>

                    {/* Location */}
                    {r.location && (
                      <p className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                        <MapPin className="w-3 h-3" />{r.location}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800">
                      <div className="flex items-center gap-3">
                        {/* Author */}
                        <Link href={`/profil/${r.profiles?.username}`} onClick={e => e.stopPropagation()} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                          {r.profiles?.avatar_url ? (
                            <img loading="lazy" src={r.profiles.avatar_url} alt="" className="w-5 h-5 rounded-full object-cover" />
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-[9px] font-bold uppercase">{r.profiles?.full_name?.charAt(0) || "?"}</div>
                          )}
                          <span className="text-xs text-gray-500 dark:text-neutral-400 hover:underline">{r.profiles?.full_name || "Anonim"}</span>
                        </Link>
                        <span className="text-[11px] text-gray-400">{r.timeAgo}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Upvote */}
                        <button onClick={(e) => handleUpvote(e, r.id)} className={`flex items-center gap-1 text-xs transition-colors ${r.hasUpvoted ? "text-[#1D9BF0] font-semibold" : "text-gray-400 hover:text-[#1D9BF0]"}`}>
                          <ThumbsUp className={`w-3.5 h-3.5 ${r.hasUpvoted ? "fill-current" : ""}`} />
                          {r.upvotes_count > 0 && <span>{r.upvotes_count}</span>}
                        </button>
                        {/* Comments */}
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <MessageCircle className="w-3.5 h-3.5" />
                          {r.comment_count > 0 && <span>{r.comment_count}</span>}
                        </span>
                        {/* Owner menu */}
                        {(isOwner || userRole === "admin") && (
                          <div className="relative">
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMenuOpen(menuOpen === r.id ? null : r.id); }} className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                            {menuOpen === r.id && (
                              <div className="absolute right-0 top-8 w-40 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700 py-1 z-20" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id); }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                  <Trash2 className="w-4 h-4" />Hapus
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-300 dark:text-neutral-600" />
          </div>
          <p className="text-gray-500 font-medium">{searchQuery || selectedCategory !== "Semua" || selectedStatus !== "Semua" ? "Tidak ada laporan ditemukan" : "Belum ada laporan"}</p>
          <p className="text-gray-400 text-sm mt-1">{searchQuery || selectedCategory !== "Semua" ? "Coba ubah filter pencarian." : "Laporkan masalah di lingkungan Anda."}</p>
          {!searchQuery && selectedCategory === "Semua" && (
            <button onClick={() => { resetForm(); setShowForm(true); }} className="mt-4 flex items-center gap-1.5 bg-[#1D9BF0] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1A8CD8] transition-colors">
              <Plus className="w-4 h-4" />Buat Laporan
            </button>
          )}
        </div>
      )}

      {/* ─── CREATE FORM MODAL ─── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-neutral-800">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-neutral-800 z-10">
              <h2 className="text-lg font-bold">Buat Laporan</h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-5 space-y-5">
              {/* Image Unggah */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Foto Bukti</label>
                <input type="file" accept="image/*" className="hidden" ref={fileRef} onChange={handleImageChange} />
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-neutral-700 aspect-video">
                    <img loading="lazy" src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button onClick={() => { setImage(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }} className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()} className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 dark:border-neutral-700 hover:border-[#1D9BF0] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#1D9BF0] transition-colors">
                    <ImagePlus className="w-8 h-8" /><span className="text-sm font-medium">Tambahkan Foto</span>
                  </button>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Judul <span className="text-red-500">*</span></label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Contoh: Jalan berlubang di Blok C" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent text-[15px] transition-all" maxLength={100} />
                <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
              </div>

              {/* Category & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Kategori</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[15px] appearance-none">
                    {REPORT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Prioritas</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[15px] appearance-none">
                    <option value="rendah">Rendah</option>
                    <option value="normal">Normal</option>
                    <option value="tinggi">Tinggi</option>
                    <option value="mendesak">Mendesak</option>
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Lokasi</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Blok / RT / RW" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[15px] transition-all" />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">Deskripsi <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Jelaskan masalah secara detail..." rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] text-[15px] resize-none transition-all" maxLength={2000} />
                <p className="text-xs text-gray-400 mt-1 text-right">{description.length}/2000</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm px-5 py-4 border-t border-gray-200 dark:border-neutral-800">
              <button onClick={handleSubmit} disabled={isPending || !title.trim() || !description.trim() || description.trim().length < 10} className="w-full bg-[#1D9BF0] text-white font-bold py-3 rounded-xl hover:bg-[#1A8CD8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                {isPending ? <><Loader2 className="w-5 h-5 animate-spin" />Mengirim...</> : "Kirim Laporan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
