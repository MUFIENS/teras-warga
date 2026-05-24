"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import {
  ArrowLeft, MapPin, Clock, CheckCircle2, Loader2, ThumbsUp,
  MessageCircle, Send, Trash2, MoreVertical, ShieldCheck,
  Construction, Droplets, Zap, TreePine, ShieldAlert, HelpCircle, Filter,
  AlertCircle, X,
} from "lucide-react";
import { toggleUpvote, addComment, deleteComment, updateReportStatus } from "@/app/laporan/actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { showSuccess, showError } from "@/lib/toast";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import Link from "next/link";

const STATUS_CFG: Record<string, { label: string; icon: any; color: string; bg: string; border: string; dot: string }> = {
  pending: { label: "Menunggu", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20", dot: "bg-amber-500" },
  reviewed: { label: "Ditinjau", icon: CheckCircle2, color: "text-indigo-500", bg: "bg-indigo-500/10", border: "border-indigo-500/20", dot: "bg-indigo-500" },
  in_progress: { label: "Diproses", icon: Loader2, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", dot: "bg-blue-500" },
  resolved: { label: "Selesai", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", dot: "bg-emerald-500" },
  rejected: { label: "Ditolak", icon: AlertCircle, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", dot: "bg-red-500" },
};

const PRIORITY_CFG: Record<string, { label: string; color: string; bg: string }> = {
  rendah: { label: "Rendah", color: "text-gray-500", bg: "bg-gray-100 dark:bg-neutral-800" },
  normal: { label: "Normal", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  tinggi: { label: "Tinggi", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  mendesak: { label: "Mendesak", color: "text-red-500", bg: "bg-red-50 dark:bg-red-900/20" },
};

const CATEGORY_COLOR: Record<string, string> = {
  Infrastruktur: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Kebersihan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  Keamanan: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  "Listrik dan Air": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Lingkungan: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Lainnya: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles: { full_name: string; username: string; avatar_url: string | null } | null;
  timeAgo: string;
}

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
  created_at: string;
  user_id: string;
  profiles: { full_name: string; username: string; avatar_url: string | null } | null;
  timeAgo: string;
}

interface Props {
  report: Report;
  comments: Comment[];
  hasUpvoted: boolean;
  currentUserId: string;
  userRole: "warga" | "admin";
}

export function LaporanDetailClient({ report, comments, hasUpvoted, currentUserId, userRole }: Props) {
  const [isPending, startTransition] = useTransition();
  const [commentText, setCommentText] = useState("");
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminStatus, setAdminStatus] = useState(report.status);
  const [adminNotes, setAdminNotes] = useState(report.admin_notes || "");
  const [commentMenuId, setCommentMenuId] = useState<string | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  // Waktu-nyata untuk laporan ini
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`report-${report.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "report_comments", filter: `report_id=eq.${report.id}` }, () => router.refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "report_upvotes", filter: `report_id=eq.${report.id}` }, () => router.refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "reports", filter: `id=eq.${report.id}` }, () => router.refresh())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [report.id, router]);

  

  const handleUpvote = () => {
    startTransition(async () => {
      await toggleUpvote(report.id);
      router.refresh();
    });
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const text = commentText;
    setCommentText("");
    startTransition(async () => {
      try {
        await addComment(report.id, text);
        router.refresh();
      } catch (err: any) {
        showError("Gagal!", err.message);
      }
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    setCommentMenuId(null);
    const ok = await confirm({
      title: "Hapus Komentar?",
      confirmText: "Hapus",
      cancelText: "Batal",
      variant: "danger",
    });
    if (ok) startTransition(async () => { await deleteComment(commentId); router.refresh(); });
  };

  const handleStatusUpdate = () => {
    startTransition(async () => {
      try {
        await updateReportStatus(report.id, adminStatus, adminNotes || undefined);
        router.refresh();
        setShowAdminPanel(false);
        showSuccess("Status Diperbarui!");
      } catch (err: any) {
        showError("Gagal!", err.message);
      }
    });
  };

  const sCfg = STATUS_CFG[report.status];
  const pCfg = PRIORITY_CFG[report.priority] || PRIORITY_CFG.normal;

  return (
    <>
      <ConfirmDialog />
      {/* ─── HEADER ─── */}
      <header className="sticky top-14 md:top-0 z-10 flex items-center gap-3 px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <Link href="/laporan" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-lg font-bold truncate">Detail Laporan</h1>
      </header>

      {/* ─── IMAGE ─── */}
      {report.image_url && (
        <div className="relative w-full max-h-80 overflow-hidden bg-gray-100 dark:bg-neutral-800">
          <img loading="lazy" src={report.image_url} alt={report.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* ─── CONTENT ─── */}
      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${CATEGORY_COLOR[report.category] || CATEGORY_COLOR.Lainnya}`}>{report.category}</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${sCfg.bg} ${sCfg.color}`}>
            <sCfg.icon className={`w-3.5 h-3.5 ${report.status === "in_progress" ? "animate-spin" : ""}`} />
            {sCfg.label}
          </span>
          {report.priority !== "normal" && (
            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${pCfg.bg} ${pCfg.color}`}>{pCfg.label}</span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold leading-tight">{report.title}</h2>

        {/* Description */}
        <p className="text-[15px] text-gray-600 dark:text-neutral-300 mt-3 leading-relaxed whitespace-pre-wrap">{report.description}</p>

        {/* Location */}
        {report.location && (
          <div className="flex items-center gap-1.5 mt-3 text-sm text-gray-400">
            <MapPin className="w-4 h-4" />
            <span>{report.location}</span>
          </div>
        )}

        {/* Author & Time */}
        <Link href={`/profil/${report.profiles?.username}`} className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800 hover:opacity-80 transition-opacity">
          {report.profiles?.avatar_url ? (
            <img loading="lazy" src={report.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold uppercase">{report.profiles?.full_name?.charAt(0) || "?"}</div>
          )}
          <div>
            <p className="text-sm font-semibold hover:underline">{report.profiles?.full_name || "Anonim"}</p>
            <p className="text-xs text-gray-400">@{report.profiles?.username || "anonim"} · {report.timeAgo}</p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-neutral-800">
          <button onClick={handleUpvote} disabled={isPending} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${hasUpvoted ? "bg-[#1D9BF0]/10 text-[#1D9BF0] border border-[#1D9BF0]/30" : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-neutral-700 border border-transparent"}`}>
            <ThumbsUp className={`w-4 h-4 ${hasUpvoted ? "fill-current" : ""}`} />
            Dukung {report.upvotes_count > 0 && `(${report.upvotes_count})`}
          </button>

          <button onClick={() => commentInputRef.current?.focus()} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors border border-transparent">
            <MessageCircle className="w-4 h-4" />
            Komentar {comments.length > 0 && `(${comments.length})`}
          </button>

          {userRole === "admin" && (
            <button onClick={() => setShowAdminPanel(!showAdminPanel)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ml-auto ${showAdminPanel ? "bg-violet-500/10 text-violet-500 border border-violet-500/30" : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-200 dark:hover:bg-neutral-700 border border-transparent"}`}>
              <ShieldCheck className="w-4 h-4" />Admin
            </button>
          )}
        </div>

        {/* Admin Notes Display */}
        {report.admin_notes && (
          <div className="mt-4 p-4 rounded-xl bg-violet-50 dark:bg-violet-900/10 border border-violet-200 dark:border-violet-800/30">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">Catatan Admin</span>
            </div>
            <p className="text-sm text-violet-700 dark:text-violet-300 leading-relaxed">{report.admin_notes}</p>
          </div>
        )}
      </div>

      {/* ─── ADMIN PANEL ─── */}
      {showAdminPanel && userRole === "admin" && (
        <div className="mx-5 mb-4 p-4 rounded-xl border-2 border-violet-200 dark:border-violet-800/50 bg-violet-50/50 dark:bg-violet-900/10">
          <h3 className="text-sm font-bold text-violet-700 dark:text-violet-400 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />Kelola Laporan
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Status</label>
              <select value={adminStatus} onChange={(e) => setAdminStatus(e.target.value as "pending" | "reviewed" | "in_progress" | "resolved" | "rejected")} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm">
                <option value="pending">Menunggu</option>
                <option value="reviewed">Ditinjau</option>
                <option value="in_progress">Sedang Diproses</option>
                <option value="resolved">Selesai</option>
                <option value="rejected">Ditolak</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1 block">Catatan Admin</label>
              <textarea value={adminNotes} onChange={(e) => setAdminNotes(e.target.value)} placeholder="Tambahkan catatan untuk warga..." rows={3} className="w-full px-3 py-2.5 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm resize-none" maxLength={1000} />
            </div>
            <button onClick={handleStatusUpdate} disabled={isPending} className="w-full bg-violet-500 text-white font-semibold py-2.5 rounded-lg hover:bg-violet-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors text-sm">
              {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Menyimpan...</> : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      )}

      {/* ─── COMMENTS ─── */}
      <div className="border-t border-gray-200 dark:border-neutral-800">
        <div className="px-5 py-4">
          <h3 className="text-sm font-bold text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
            Komentar ({comments.length})
          </h3>
        </div>

        {/* Comment List */}
        {comments.length > 0 ? (
          <div className="px-5 pb-4 space-y-4">
            {comments.map((c) => {
              const isOwn = c.user_id === currentUserId;
              const canDelete = isOwn || userRole === "admin";
              return (
                <div key={c.id} className="flex gap-3 group">
                  <Link href={`/profil/${c.profiles?.username}`} className="flex-shrink-0 mt-0.5 hover:opacity-80 transition-opacity">
                    {c.profiles?.avatar_url ? (
                      <img loading="lazy" src={c.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold uppercase">{c.profiles?.full_name?.charAt(0) || "?"}</div>
                    )}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Link href={`/profil/${c.profiles?.username}`} className="text-sm font-semibold hover:underline">{c.profiles?.full_name || "Anonim"}</Link>
                      <Link href={`/profil/${c.profiles?.username}`} className="text-xs text-gray-400 hover:underline">@{c.profiles?.username || "anonim"}</Link>
                      <span className="text-xs text-gray-400">· {c.timeAgo}</span>
                      {canDelete && (
                        <div className="relative ml-auto">
                          <button onClick={() => setCommentMenuId(commentMenuId === c.id ? null : c.id)} className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-all">
                            <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                          {commentMenuId === c.id && (
                            <div className="absolute right-0 top-7 w-32 bg-white dark:bg-neutral-900 rounded-lg shadow-xl border border-gray-200 dark:border-neutral-700 py-1 z-20">
                              <button onClick={() => handleDeleteComment(c.id)} className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2">
                                <Trash2 className="w-3 h-3" />Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-neutral-300 mt-0.5 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-5 pb-6 text-center">
            <p className="text-sm text-gray-400">Belum ada komentar. Jadilah yang pertama berkomentar.</p>
          </div>
        )}

        {/* Comment Input */}
        <div className="sticky bottom-0 bg-white dark:bg-black border-t border-gray-200 dark:border-neutral-800 px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={commentInputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
              placeholder="Tulis komentar..."
              className="flex-1 px-4 py-2.5 rounded-full border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent text-sm transition-all"
              disabled={isPending}
            />
            <button onClick={handleAddComment} disabled={isPending || !commentText.trim()} className="p-2.5 bg-[#1D9BF0] text-white rounded-full hover:bg-[#1A8CD8] transition-colors disabled:opacity-40 flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
