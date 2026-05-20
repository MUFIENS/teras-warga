'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const MONTHLY_AMOUNT = 50000 // Rp 50.000 per bulan

export async function submitKasPayment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Anda harus login untuk membayar kas')
  }

  const month = formData.get('month') as string
  const year = parseInt(formData.get('year') as string)
  const amount = parseFloat(formData.get('amount') as string) || MONTHLY_AMOUNT
  const proof = formData.get('proof') as File | null

  if (!month || !year) {
    throw new Error('Bulan dan tahun harus diisi')
  }

  // Periksa apakah sudah dibayar untuk bulan ini
  const { data: existing } = await supabase
    .from('kas_transactions')
    .select('id, status')
    .eq('user_id', user.id)
    .eq('month_paid', month)
    .eq('year_paid', year)
    .single()

  if (existing && existing.status !== 'rejected') {
    throw new Error('Anda sudah membayar atau pembayaran sedang diverifikasi untuk bulan ini')
  }

  let proof_url = ''

  if (proof && proof.size > 0) {
    const fileExt = proof.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('kas_proofs')
      .upload(filePath, proof)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('kas_proofs')
      .getPublicUrl(filePath)
      
    proof_url = publicUrl
  }

  // Jika sebelumnya ditolak, hapus terlebih dahulu
  if (existing && existing.status === 'rejected') {
    await supabase
      .from('kas_transactions')
      .delete()
      .eq('id', existing.id)
  }

  const { error } = await supabase
    .from('kas_transactions')
    .insert({
      user_id: user.id,
      month_paid: month,
      year_paid: year,
      amount,
      proof_url,
      status: 'pending'
    })

  if (error) {
    throw error
  }

  revalidatePath('/kas', 'layout')
}
