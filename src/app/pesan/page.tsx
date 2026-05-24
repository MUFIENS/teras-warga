import { createClient } from "@/lib/supabase/server";
import { MessagesClient } from "@/components/MessagesClient";

export default async function Pesan(props: { searchParams?: Promise<any> | any }) {
  const supabase = await createClient();
  const searchParams = await props.searchParams;
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">
        <header className="sticky top-0 z-10 flex items-center px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
          <h1 className="text-xl font-bold">Pesan</h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-gray-500">Silakan login untuk melihat pesan.</p>
        </div>
      </div>
    );
  }

  // Ambil semua pesan yang melibatkan pengguna saat ini
  const { data: messages } = await supabase
    .from("messages")
    .select("*")
    .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  const allMessages = (messages || []).filter((msg: any) => {
    if (!msg.deleted_for) return true;
    return !msg.deleted_for.includes(user.id);
  });

  // Buat percakapan dari pesan
  const conversationMap = new Map<string, { messages: any[]; otherUserId: string }>();

  for (const msg of allMessages) {
    const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
    if (otherUserId) {
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, { messages: [], otherUserId });
      }
      conversationMap.get(otherUserId)!.messages.push(msg);
    }
  }

  // Ambil profil untuk semua rekan percakapan
  const otherUserIds = Array.from(conversationMap.keys());
  let profilesMap = new Map<string, any>();

  if (otherUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, last_active")
      .in("id", otherUserIds);

    for (const p of profiles || []) {
      profilesMap.set(p.id, p);
    }
  }

  // Buat daftar percakapan diurutkan dari pesan terbaru
  const conversations = Array.from(conversationMap.entries())
    .map(([otherId, data]) => {
      const profile = profilesMap.get(otherId);
      if (!profile) return null;

      const sortedMsgs = data.messages.sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      const unreadCount = sortedMsgs.filter(
        (m: any) => m.sender_id === otherId && m.receiver_id === user.id && !m.is_read
      ).length;

      return {
        user: profile,
        lastMessage: sortedMsgs[0],
        unreadCount,
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime());

  // Tangani pengguna awal dari URL
  const userParam = searchParams?.user;
  const productParam = searchParams?.product;
  let initialChatUser = null;
  let initialProduct = null;

  if (userParam) {
    if (profilesMap.has(userParam)) {
      initialChatUser = profilesMap.get(userParam);
    } else {
      const { data: p } = await supabase
        .from("profiles")
        .select("id, username, full_name, avatar_url, last_active")
        .eq("id", userParam)
        .single();
      if (p) {
        initialChatUser = p;
      }
    }
  }

  if (productParam) {
    const { data: prod } = await supabase
      .from("market_items")
      .select("id, title, price_idr, price_crypto, image_url")
      .eq("id", productParam)
      .single();
    if (prod) {
      initialProduct = prod;
    }
  }

  return (
    <MessagesClient
      conversations={conversations as any}
      currentUserId={user.id}
      allMessages={allMessages as any}
      initialChatUser={initialChatUser}
      initialProduct={initialProduct}
    />
  );
}
