import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TemanClient } from "@/components/TemanClient";

export default async function TemanPage() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    redirect("/auth");
  }

  // Ambil semua pertemanan – gunakan cast karena tipe Supabase tidak bisa menyelesaikan penggabungan FK yang dialiaskan
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: friendships } = await (supabase as any)
    .from("friends")
    .select(`
      id,
      user_id,
      friend_id,
      status,
      created_at,
      sender:user_id(id, full_name, username, avatar_url),
      receiver:friend_id(id, full_name, username, avatar_url)
    `)
    .or(`user_id.eq.${user!.id},friend_id.eq.${user!.id}`)
    .order("created_at", { ascending: false });

  // Ambil semua pengguna lain untuk fitur pencarian (dibatasi 500 untuk skalabilitas dalam cakupan ini)
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, username, avatar_url")
    .neq("id", user.id)
    .limit(500);

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white pb-20 md:pb-0">
      <TemanClient
        currentUserId={user.id}
        friendships={friendships || []}
        allProfiles={profiles || []}
      />
    </main>
  );
}
