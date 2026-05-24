import { unstable_cache } from 'next/cache';
import { createPublicClient } from '../supabase/public';

/**
 * Fetches all top-level public posts.
 * This query is cached globally across all users for 60 seconds
 * to reduce database load and improve time-to-first-byte (TTFB).
 */
export const getCachedPosts = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        image_url,
        created_at,
        user_id,
        profiles:user_id (full_name, username, avatar_url),
        likes:post_likes(count),
        reposts:post_reposts(count),
        replies:posts!parent_id(count)
      `)
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .range(0, 9);

    if (error) {
      console.error('Error fetching cached posts:', error);
      return [];
    }

    return data;
  },
  ['public_posts_feed'],
  {
    revalidate: 60,
    tags: ['posts'],
  }
);
