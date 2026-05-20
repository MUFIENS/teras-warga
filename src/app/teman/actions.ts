"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function sendFriendRequest(targetUserId: string) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')

  if (user.id === targetUserId) {
    throw new Error('Tidak bisa menambahkan diri sendiri')
  }

  // Periksa apakah permintaan sudah ada di kedua arah
  const { data: existing } = await supabase
    .from('friends')
    .select('id, status')
    .or(`and(user_id.eq.${user.id},friend_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},friend_id.eq.${user.id})`)
    .single()

  if (existing) {
    throw new Error('Permintaan pertemanan atau pertemanan sudah ada')
  }

  const { error } = await supabase
    .from('friends')
    .insert({
      user_id: user.id,
      friend_id: targetUserId,
      status: 'pending'
    })

  if (error) {
    console.error('Error sending friend request:', error)
    throw new Error('Gagal mengirim permintaan pertemanan')
  }

  // Buat notifikasi
  const { data: senderProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  await supabase.from('notifications').insert({
    user_id: targetUserId,
    title: 'Permintaan Pertemanan Baru',
    message: `${senderProfile?.full_name || 'Seseorang'} mengirimkan permintaan pertemanan.`,
  })

  revalidatePath('/teman')
  return { success: true }
}

export async function acceptFriendRequest(requestId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Verifikasi kepemilikan (pengguna harus friend_id)
  const { data: request } = await supabase
    .from('friends')
    .select('friend_id, user_id')
    .eq('id', requestId)
    .single()

  if (!request || request.friend_id !== user.id) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('friends')
    .update({ status: 'accepted' })
    .eq('id', requestId)

  if (error) {
    console.error('Error accepting friend request:', error)
    throw new Error('Gagal menerima permintaan pertemanan')
  }

  // Notifikasi kepada pengirim
  const { data: myProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  await supabase.from('notifications').insert({
    user_id: request.user_id,
    title: 'Permintaan Pertemanan Diterima',
    message: `${myProfile?.full_name || 'Seseorang'} menerima permintaan pertemanan Anda.`,
  })

  revalidatePath('/teman')
  return { success: true }
}

export async function rejectFriendRequest(requestId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Kita bisa menghapus permintaan atau mengubahnya menjadi ditolak.
  // Seringkali lebih baik dihapus saja agar mereka bisa meminta lagi nanti, 
  // atau jadikan ditolak jika kita ingin memblokirnya sementara.
  // Untuk alur standar, menghapus lebih bersih untuk permintaan yang tertunda.
  
  const { data: request } = await supabase
    .from('friends')
    .select('friend_id')
    .eq('id', requestId)
    .single()

  if (!request || request.friend_id !== user.id) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', requestId)

  if (error) throw new Error('Gagal menolak permintaan pertemanan')

  revalidatePath('/teman')
  return { success: true }
}

export async function cancelFriendRequest(requestId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: request } = await supabase
    .from('friends')
    .select('user_id')
    .eq('id', requestId)
    .single()

  if (!request || request.user_id !== user.id) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', requestId)

  if (error) throw new Error('Gagal membatalkan permintaan')

  revalidatePath('/teman')
  return { success: true }
}

export async function removeFriend(friendshipId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: request } = await supabase
    .from('friends')
    .select('user_id, friend_id')
    .eq('id', friendshipId)
    .single()

  if (!request || (request.user_id !== user.id && request.friend_id !== user.id)) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('friends')
    .delete()
    .eq('id', friendshipId)

  if (error) throw new Error('Gagal menghapus teman')

  revalidatePath('/teman')
  return { success: true }
}
