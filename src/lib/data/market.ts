import { unstable_cache } from 'next/cache';
import { createPublicClient } from '../supabase/public';

/**
 * Fetches all market items.
 * This query is cached globally across all users for 60 seconds
 * to reduce database load and improve time-to-first-byte (TTFB).
 */
export const getCachedMarketItems = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    
    const { data, error } = await supabase
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

    if (error) {
      console.error('Error fetching cached market items:', error);
      return [];
    }

    return data;
  },
  ['public_market_items'],
  {
    revalidate: 60,
    tags: ['market'],
  }
);
