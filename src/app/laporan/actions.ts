'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { createNotification } from '@/lib/notifications'
import {
  createReportSchema,
  addCommentSchema,
  updateStatusSchema,
} from '@/lib/validators'

// ─── PEMBANTU OTENTIKASI ─────────────────────────────────────────
async function getAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Anda harus login')
  return { supabase, user }
}

// ─── BUAT LAPORAN ───────────────────────────────────────────────
export async function createReport(formData: FormData) {
  const { supabase, user } = await getAuthenticatedUser()

  const parsed = createReportSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category') || 'Infrastruktur',
    location: formData.get('location') || '',
    priority: formData.get('priority') || 'normal',
  })

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message || 'Data tidak valid'
    throw new Error(firstError)
  }


  const { title, description, category, location, priority } = parsed.data
  const image = formData.get('image') as File | null

  let image_url: string | null = null
  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('report_images')
      .upload(filePath, image)
    if (uploadError) throw new Error('Gagal mengunggah gambar: ' + uploadError.message)

    const {
      data: { publicUrl },
    } = supabase.storage.from('report_images').getPublicUrl(filePath)
    image_url = publicUrl
  }

  const { error } = await supabase.from('reports').insert({
    user_id: user.id,
    title,
    description,
    category,
    location,
    image_url,
    priority,
    status: 'pending',
    upvotes_count: 0,
  })

  if (error) throw new Error('Gagal membuat laporan: ' + error.message)
  revalidatePath('/laporan', 'layout')
}

// ─── HAPUS LAPORAN ──────────────────────────────────────────────
export async function deleteReport(reportId: string) {
  const { supabase, user } = await getAuthenticatedUser()

  // Periksa peran admin untuk menghapus paksa
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  let query = supabase.from('reports').delete().eq('id', reportId)
  
  if (!isAdmin) {
  
    query = query.eq('user_id', user.id)
  }

  const { error } = await query
  if (error) throw new Error('Gagal menghapus laporan')

  revalidatePath('/laporan', 'layout')
}

// ─── AKTIFKAN DUKUNGAN ──────────────────────────────────────────
export async function toggleUpvote(reportId: string) {
  const { supabase, user } = await getAuthenticatedUser()

  const { data: existing } = await supabase
    .from('report_upvotes')
    .select('id')
    .eq('report_id', reportId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    await supabase.from('report_upvotes').delete().eq('id', existing.id)
    // Kurangi jumlah
    const { error: rpcError } = await supabase.rpc('decrement_upvote' as any, { rid: reportId })
    if (rpcError) {
      // Cadangan: pembaruan manual
      const { data } = await supabase
        .from('reports')
        .select('upvotes_count')
        .eq('id', reportId)
        .single()
      if (data) {
        await supabase
          .from('reports')
          .update({ upvotes_count: Math.max(0, (data.upvotes_count || 1) - 1) })
          .eq('id', reportId)
      }
    }
  } else {
    const { error } = await supabase
      .from('report_upvotes')
      .insert({ report_id: reportId, user_id: user.id })
    if (error) throw new Error('Gagal mendukung laporan')

    // Tambahkan jumlah
    const { error: rpcError } = await supabase.rpc('increment_upvote' as any, { rid: reportId })
    if (rpcError) {
      const { data } = await supabase
        .from('reports')
        .select('upvotes_count')
        .eq('id', reportId)
        .single()
      if (data) {
        await supabase
          .from('reports')
          .update({ upvotes_count: (data.upvotes_count || 0) + 1 })
          .eq('id', reportId)
      }
    }

    // Beri tahu pemilik laporan
    const { data: report } = await supabase
      .from('reports')
      .select('user_id')
      .eq('id', reportId)
      .single()

    if (report && report.user_id && report.user_id !== user.id) {
      const { data: senderProfile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      await createNotification(
        supabase,
        report.user_id,
        'Dukungan Laporan',
        `${senderProfile?.full_name || 'Seseorang'} mendukung laporan Anda.`
      )
    }
  }

  revalidatePath('/laporan', 'layout')
}

// ─── TAMBAH KOMENTAR ────────────────────────────────────────────
export async function addComment(reportId: string, content: string) {
  const { supabase, user } = await getAuthenticatedUser()

  const parsed = addCommentSchema.safeParse({ content, reportId })
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Data tidak valid')
  }

  const { error } = await supabase.from('report_comments').insert({
    report_id: parsed.data.reportId,
    user_id: user.id,
    content: parsed.data.content,
  })

  if (error) throw new Error('Gagal menambahkan komentar')

  // Beri tahu pemilik laporan
  const { data: report } = await supabase
    .from('reports')
    .select('user_id')
    .eq('id', reportId)
    .single()

  if (report && report.user_id && report.user_id !== user.id) {
    const { data: senderProfile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()

    await createNotification(
      supabase,
      report.user_id,
      'Komentar Laporan',
      `${senderProfile?.full_name || 'Seseorang'} mengomentari laporan Anda.`
    )
  }

  revalidatePath('/laporan', 'layout')
}

// ─── HAPUS KOMENTAR ─────────────────────────────────────────────
export async function deleteComment(commentId: string) {
  const { supabase, user } = await getAuthenticatedUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  let query = supabase.from('report_comments').delete().eq('id', commentId)
  if (!isAdmin) {
    query = query.eq('user_id', user.id)
  }

  const { error } = await query
  if (error) throw new Error('Gagal menghapus komentar')

  revalidatePath('/laporan', 'layout')
}

// ─── PERBARUI STATUS (Admin) ────────────────────────────────────
export async function updateReportStatus(
  reportId: string,
  status: 'pending' | 'reviewed' | 'in_progress' | 'resolved' | 'rejected',
  adminNotes?: string
) {
  const { supabase, user } = await getAuthenticatedUser()

  const parsed = updateStatusSchema.safeParse({ reportId, status, adminNotes })
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message || 'Data tidak valid')
  }

  // Verifikasi peran admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw new Error('Hanya admin yang dapat mengubah status laporan')
  }

  const updateData: any = { status: parsed.data.status }
  if (parsed.data.adminNotes !== undefined) {
    updateData.admin_notes = parsed.data.adminNotes
  }

  const { error } = await supabase
    .from('reports')
    .update(updateData)
    .eq('id', reportId)

  if (error) throw new Error('Gagal mengubah status')

  // Beri tahu pemilik laporan
  const { data: report } = await supabase
    .from('reports')
    .select('user_id, title')
    .eq('id', reportId)
    .single()

  if (report && report.user_id) {
    const statusLabel: Record<string, string> = {
      pending: 'Menunggu',
      reviewed: 'Ditinjau',
      in_progress: 'Sedang Diproses',
      resolved: 'Selesai',
      rejected: 'Ditolak'
    }
    await createNotification(
      supabase,
      report.user_id,
      'Update Status Laporan',
      `Laporan "${report.title}" diperbarui ke status: ${statusLabel[status]}.`
    )
  }

  revalidatePath('/laporan', 'layout')
}

// ─── DAPATKAN DETAIL LAPORAN ────────────────────────────────────
export async function getReportDetail(reportId: string) {
  const { supabase, user } = await getAuthenticatedUser()

  const { data: report, error } = await supabase
    .from('reports')
    .select(
      `
      id, title, description, image_url, category, location, status,
      priority, admin_notes, upvotes_count, created_at, user_id,
      profiles:user_id (full_name, username, avatar_url)
    `
    )
    .eq('id', reportId)
    .single()

  if (error || !report) throw new Error('Laporan tidak ditemukan')

  // Dapatkan komentar beserta profil
  const { data: comments } = await supabase
    .from('report_comments')
    .select(
      `
      id, content, created_at, user_id,
      profiles:user_id (full_name, username, avatar_url)
    `
    )
    .eq('report_id', reportId)
    .order('created_at', { ascending: true })

  // Periksa apakah pengguna telah mendukung
  const { data: upvote } = await supabase
    .from('report_upvotes')
    .select('id')
    .eq('report_id', reportId)
    .eq('user_id', user.id)
    .single()

  // Dapatkan peran pengguna
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  return {
    report,
    comments: comments || [],
    hasUpvoted: !!upvote,
    currentUserId: user.id,
    userRole: profile?.role || 'warga',
  }
}
