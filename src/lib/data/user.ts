import { cache } from 'react';
import { createClient } from '../supabase/server';

/**
 * Fetches the current user's profile and memoizes it for the duration
 * of the current request. This prevents multiple identical DB queries
 * from layout.tsx, page.tsx, and other server components.
 */
export const getUserProfile = cache(async (userId: string) => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('username, full_name, avatar_url, is_seller, last_active')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
});
