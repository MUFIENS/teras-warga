import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { LaporanClient } from "@/components/LaporanClient";
import { REPORT_CATEGORIES } from "@/lib/validators";

export const dynamic = 'force-dynamic';

export default async function Laporan() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">
        <header className="sticky top-14 md:top-0 z-10 flex items-center px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
          <h1 className="text-xl font-bold">Laporan Warga</h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-gray-500">Silakan login untuk melihat laporan.</p>
        </div>
      </div>
    );
  }

  // Dapatkan peran pengguna
  const { data: userProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const userRole = (userProfile?.role as "warga" | "admin") || "warga";

  // Ambil semua laporan beserta profil
  const { data: reports } = await supabase
    .from("reports")
    .select(
      `
      id, title, description, image_url, category, location, status,
      priority, admin_notes, upvotes_count, created_at, user_id,
      profiles:user_id (full_name, username, avatar_url)
    `
    )
    .in("category", REPORT_CATEGORIES)
    .order("created_at", { ascending: false });

  // Ambil dukungan pengguna saat ini
  const { data: upvotes } = await supabase
    .from("report_upvotes")
    .select("report_id")
    .eq("user_id", user.id);
  const userUpvoteIds = new Set((upvotes || []).map((u: { report_id: string }) => u.report_id));

  // Ambil jumlah komentar per laporan
  const reportIds = (reports || []).map((r: { id: string }) => r.id);
  const commentCounts: Record<string, number> = {};
  if (reportIds.length > 0) {
    const { data: comments } = await supabase
      .from("report_comments")
      .select("report_id")
      .in("report_id", reportIds);
    (comments || []).forEach((c: { report_id: string }) => {
      commentCounts[c.report_id] = (commentCounts[c.report_id] || 0) + 1;
    });
  }

  const formatted = (reports || []).map((r: any) => ({
    ...r,
    status: (r.status || "pending") as "pending" | "reviewed" | "in_progress" | "resolved" | "rejected",
    user_id: r.user_id || "",
    category: r.category || "Infrastruktur",
    priority: r.priority || "normal",
    upvotes_count: r.upvotes_count || 0,
    comment_count: commentCounts[r.id] || 0,
    hasUpvoted: userUpvoteIds.has(r.id),
    timeAgo: r.created_at
      ? formatDistanceToNow(new Date(r.created_at), {
          addSuffix: true,
          locale: localeId,
        })
      : "Baru saja",
  }));

  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">      <LaporanClient
        reports={formatted}
        currentUserId={user.id}
        userRole={userRole}
      />
    </div>
  );
}
