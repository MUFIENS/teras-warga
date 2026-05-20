"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createBorrowRequestSchema, updateBorrowStatusSchema } from '@/lib/validators'

export async function createBorrowRequest(formData: FormData) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) throw new Error('Not authenticated')

  const itemId = formData.get('itemId') as string
  const purpose = formData.get('purpose') as string
  const startDate = formData.get('startDate') as string
  const endDate = formData.get('endDate') as string

  const validation = createBorrowRequestSchema.safeParse({ itemId, purpose, startDate, endDate })
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message)
  }

  // Periksa apakah barang tersedia
  const { data: item } = await supabase
    .from('inventory')
    .select('is_available')
    .eq('id', itemId)
    .single()

  if (!item) throw new Error('Barang tidak ditemukan')
  if (!item.is_available) throw new Error('Barang sedang tidak tersedia')

  const { error } = await supabase
    .from('borrow_requests')
    .insert({
      user_id: user.id,
      item_id: validation.data.itemId,
      purpose: validation.data.purpose,
      start_date: validation.data.startDate,
      end_date: validation.data.endDate,
      status: 'pending'
    })

  if (error) {
    console.error('Error creating borrow request:', error)
    throw new Error('Gagal mengajukan peminjaman')
  }

  revalidatePath('/peminjaman')
  return { success: true }
}

export async function updateBorrowStatus(requestId: string, status: string, adminNotes?: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Verifikasi admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  const validation = updateBorrowStatusSchema.safeParse({ requestId, status, adminNotes })
  if (!validation.success) {
    throw new Error(validation.error.issues[0].message)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('borrow_requests')
    .update({
      status: validation.data.status,
      admin_notes: validation.data.adminNotes || null
    })
    .eq('id', validation.data.requestId)

  if (error) {
    console.error('Error updating status:', error)
    throw new Error('Gagal memperbarui status')
  }

  // Jika status dikembalikan atau ditolak, apakah kita ingin membuat barang tersedia kembali?
  // Tunggu, jika barang disetujui atau dipinjam, mungkin tidak boleh tersedia untuk yang lain.
  // Kita bisa mengaturnya secara dinamis atau ketat. Untuk saat ini kita hanya memperbarui statusnya.

  revalidatePath('/peminjaman')
  return { success: true }
}

export async function deleteBorrowRequest(requestId: string) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data: request } = await supabase
    .from('borrow_requests')
    .select('user_id')
    .eq('id', requestId)
    .single()

  if (!request) throw new Error('Request tidak ditemukan')

  // Hanya admin atau pemilik yang dapat menghapus, dan mungkin hanya jika tertunda
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'
  if (request.user_id !== user.id && !isAdmin) {
    throw new Error('Unauthorized')
  }

  const { error } = await supabase
    .from('borrow_requests')
    .delete()
    .eq('id', requestId)

  if (error) throw new Error('Gagal menghapus permintaan')

  revalidatePath('/peminjaman')
  return { success: true }
}
