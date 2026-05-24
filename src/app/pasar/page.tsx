import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { MarketplaceClient } from "@/components/MarketplaceClient";
import { getCachedMarketItems } from "@/lib/data/market";

export default async function Pasar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch directly using the authenticated client to avoid RLS/cache issues
  const { data: rawItems } = await supabase
    .from('market_items')
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
      profiles:user_id (full_name, username, avatar_url, crypto_wallet)
    `)
    .order('created_at', { ascending: false })
    .range(0, 9);

  const formattedItems = (rawItems || []).map((item: any) => ({
    ...item,
    timeAgo: item.created_at
      ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: localeId })
      : "Baru saja",
  }));

  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">      <MarketplaceClient
        items={formattedItems}
        currentUserId={user?.id || null}
      />
    </div>
  );
}
