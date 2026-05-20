import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PeminjamanClient } from "@/components/PeminjamanClient";

export default async function PeminjamanPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/auth");
  }

  // Dapatkan profil pengguna (untuk peran)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role || "warga";

  // Ambil barang yang tersedia
  const { data: items } = await supabase
    .from("inventory")
    .select("*")
    .order("created_at", { ascending: false });

  // Ambil permintaan peminjaman (hanya milik sendiri jika warga, semua jika admin)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let requestQuery = (supabase as any)
    .from("borrow_requests")
    .select(`
      id, item_id, start_date, end_date, status, purpose, admin_notes, created_at, user_id,
      inventory:item_id (name, image_url, category),
      profiles:user_id (full_name, username, avatar_url)
    `)
    .order("created_at", { ascending: false });

  if (userRole !== "admin") {
    requestQuery = requestQuery.eq("user_id", user.id);
  }

  const { data: requests } = await requestQuery;

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-20 md:pb-0">
      <PeminjamanClient
        items={(items || []) as any}
        requests={(requests || []) as any}
        currentUserId={user.id}
        userRole={userRole}
      />
    </main>
  );
}
