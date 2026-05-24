'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendMessage(receiverId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Anda harus login')
  if (!content.trim()) throw new Error('Pesan tidak boleh kosong')
  if (receiverId === user.id) throw new Error('Tidak bisa mengirim pesan ke diri sendiri')

  const { error } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      content: content.trim(),
      is_read: false,
    })

  if (error) throw error

  revalidatePath('/pesan', 'layout')
}

export async function markMessagesAsRead(otherUserId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return

  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('sender_id', otherUserId)
    .eq('receiver_id', user.id)
    .eq('is_read', false)

  revalidatePath('/pesan', 'layout')
}

export async function searchUsers(query: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return []
  if (!query.trim()) return []

  const { data } = await supabase
    .from('profiles')
    .select('id, username, full_name, avatar_url, last_active')
    .neq('id', user.id)
    .or(`username.ilike.%${query}%,full_name.ilike.%${query}%`)
    .limit(10)

  return data || []
}

export async function deleteMessageForMe(messageId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: msg } = await supabase.from('messages').select('deleted_for').eq('id', messageId).single() as { data: { deleted_for: string[] | null } | null }
  if (!msg) return

  const currentDeletedFor = msg.deleted_for || []
  if (!currentDeletedFor.includes(user.id)) {
    await supabase.from('messages').update({ deleted_for: [...currentDeletedFor, user.id] } as any).eq('id', messageId)
  }
  revalidatePath('/pesan', 'layout')
}

export async function deleteMessageForEveryone(messageId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const { data: msg } = await supabase.from('messages').select('sender_id, created_at').eq('id', messageId).single()
  if (!msg) return
  if (msg.sender_id !== user.id) throw new Error('Hanya bisa menghapus pesan milik sendiri')
  
  const createdTime = new Date(msg.created_at!).getTime()
  const now = Date.now()
  if (now - createdTime > 2 * 60 * 60 * 1000) {
    throw new Error('Batas waktu 2 jam telah terlewati')
  }

  await supabase.from('messages').update({ content: '{"type":"deleted"}' }).eq('id', messageId)
  revalidatePath('/pesan', 'layout')
}
