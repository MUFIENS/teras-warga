import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { RealtimeListener } from "@/components/RealtimeListener";
import { MarketplaceClient } from "@/components/MarketplaceClient";

export default async function Pasar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: items } = await supabase
    .from("market_items")
    .select(`
      id,
      title,
      description,
      price_idr,
      image_url,
      category,
      condition,
      location,
      is_active,
      created_at,
      user_id,
      profiles:user_id (full_name, username, avatar_url)
    `)
    .order("created_at", { ascending: false });

  const formattedItems = (items || []).map((item: any) => ({
    ...item,
    timeAgo: item.created_at
      ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: localeId })
      : "Baru saja",
  }));

  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">
      <RealtimeListener />
      <MarketplaceClient
        items={formattedItems}
        currentUserId={user?.id || null}
      />
    </div>
  );
}
