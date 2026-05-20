import type { SupabaseClient } from '@supabase/supabase-js'

export async function createNotification(
  supabase: SupabaseClient,
  userId: string,
  title: string,
  message: string
) {
  await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title,
      message,
      is_read: false,
    })
}
