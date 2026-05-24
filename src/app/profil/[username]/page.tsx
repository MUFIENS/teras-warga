import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProfilClient } from "@/components/ProfilClient";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilUserPage({ params }: PageProps) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // Ambil profil target
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("id, username, full_name, bio, avatar_url, cover_url, role, account_status, points, is_seller, crypto_wallet, last_active, created_at")
    .eq("username", username)
    .single();

  if (!profile) return notFound();

  // Statistik: jumlah postingan
  const { count: postCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id);

  // Statistik: jumlah teman
  const { count: friendCount } = await supabase
    .from("friends")
    .select("*", { count: "exact", head: true })
    .eq("status", "accepted")
    .or(`user_id.eq.${profile.id},friend_id.eq.${profile.id}`);

  // Statistik: barang di pasar
  const { count: marketCount } = await supabase
    .from("market_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .eq("is_active", true);

  // Ambil postingan for profile
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id, content, image_url, created_at,
      profiles:user_id(id, username, full_name, avatar_url),
      post_likes(user_id),
      post_reposts(user_id)
    `)
    .eq("user_id", profile.id)
    .is("parent_id", null)
    .order("created_at", { ascending: false })
    .limit(20);

  // Ambil barang pasar
  const { data: marketItems } = await supabase
    .from("market_items")
    .select("id, title, price_idr, image_url, category, condition, created_at")
    .eq("user_id", profile.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(12);

  // Ambil teman – gunakan cast karena tipe Supabase tidak bisa menyimpulkan penggabungan FK yang dialiaskan
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: friendships } = await (supabase as any)
    .from("friends")
    .select(`
      id, status,
      sender:user_id(id, username, full_name, avatar_url, role, is_seller, last_active),
      receiver:friend_id(id, username, full_name, avatar_url, role, is_seller, last_active)
    `)
    .eq("status", "accepted")
    .or(`user_id.eq.${profile.id},friend_id.eq.${profile.id}`)
    .limit(12);

  // Hubungan pengunjung saat ini dengan profil ini
  let relationship: { id: string; status: string; direction: "sent" | "received" } | null = null;
  if (user && user.id !== profile.id) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rel } = await (supabase as any)
      .from("friends")
      .select("id, status, user_id, friend_id")
      .or(`and(user_id.eq.${user.id},friend_id.eq.${profile.id}),and(user_id.eq.${profile.id},friend_id.eq.${user.id})`)
      .maybeSingle();

    if (rel) {
      relationship = {
        id: rel.id,
        status: rel.status ?? "pending",
        direction: rel.user_id === user.id ? "sent" : "received",
      };
    }
  }

  const isOwnProfile = user?.id === profile.id;

  return (
    <ProfilClient
      profile={profile as any}
      isOwnProfile={isOwnProfile}
      currentUserId={user?.id || null}
      relationship={relationship}
      stats={{ posts: postCount || 0, friends: friendCount || 0, market: marketCount || 0 }}
      posts={(posts || []) as any}
      marketItems={(marketItems || []) as any}
      friendships={(friendships || []) as any}
    />
  );
}
