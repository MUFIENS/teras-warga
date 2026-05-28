import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { LaporanDetailClient } from "@/components/LaporanDetailClient";

export const dynamic = 'force-dynamic';

export default async function LaporanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">
        <header className="sticky top-14 md:top-0 z-10 flex items-center px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
          <h1 className="text-xl font-bold">Laporan</h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-gray-500">Silakan login untuk melihat laporan.</p>
        </div>
      </div>
    );
  }

  // Ambil laporan
  const { data: report } = await supabase
    .from("reports")
    .select(
      `
      id, title, description, image_url, category, location, status,
      priority, admin_notes, upvotes_count, created_at, user_id,
      profiles:user_id (full_name, username, avatar_url)
    `
    )
    .eq("id", id)
    .single();

  if (!report) notFound();

  // Ambil komentar beserta profil
  const { data: comments } = await supabase
    .from("report_comments")
    .select(
      `
      id, content, created_at, user_id,
      profiles:user_id (full_name, username, avatar_url)
    `
    )
    .eq("report_id", id)
    .order("created_at", { ascending: true });

  // Periksa status dukungan
  const { data: upvote } = await supabase
    .from("report_upvotes")
    .select("id")
    .eq("report_id", id)
    .eq("user_id", user.id)
    .single();

  // Dapatkan peran pengguna
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const formattedComments = (comments || []).map((c: any) => ({
    ...c,
    timeAgo: c.created_at
      ? formatDistanceToNow(new Date(c.created_at), {
          addSuffix: true,
          locale: localeId,
        })
      : "Baru saja",
  }));

  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">
      <LaporanDetailClient
        report={{
          ...report,
          status: (report.status || "pending") as "pending" | "reviewed" | "in_progress" | "resolved" | "rejected",
          user_id: report.user_id || "",
          created_at: report.created_at || new Date().toISOString(),
          category: report.category || "Lainnya",
          priority: report.priority || "normal",
          upvotes_count: report.upvotes_count || 0,
          timeAgo: report.created_at
            ? formatDistanceToNow(new Date(report.created_at), {
                addSuffix: true,
                locale: localeId,
              })
            : "Baru saja",
        }}
        comments={formattedComments}
        hasUpvoted={!!upvote}
        currentUserId={user.id}
        userRole={(profile?.role as "warga" | "admin") || "warga"}
      />
    </div>
  );
}
