"use server"

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Nama minimal 2 karakter').max(80),
  username: z.string().min(3, 'Username minimal 3 karakter').max(30).regex(/^[a-z0-9_]+$/, 'Username hanya huruf kecil, angka, dan underscore'),
  bio: z.string().max(200, 'Bio maksimal 200 karakter').optional(),
  is_seller: z.boolean().optional(),
})

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4MB

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const file = formData.get('file') as File
  if (!file || file.size === 0) throw new Error('File tidak ditemukan')
  if (file.size > MAX_FILE_SIZE) throw new Error('Ukuran file melebihi 4 MB')
  if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar')

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filePath = `${user.id}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('avatar')
    .upload(filePath, file, { upsert: true, contentType: file.type })

  if (uploadError) {
    console.error('Avatar upload error:', uploadError)
    throw new Error('Gagal mengunggah foto profil')
  }

  const { data: urlData } = supabase.storage.from('avatar').getPublicUrl(filePath)
  const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('profiles').update({ avatar_url: avatarUrl }).eq('id', user.id)

  revalidatePath('/profil')
  return { url: avatarUrl }
}

export async function uploadCover(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const file = formData.get('file') as File
  if (!file || file.size === 0) throw new Error('File tidak ditemukan')
  if (file.size > MAX_FILE_SIZE) throw new Error('Ukuran file melebihi 4 MB')
  if (!file.type.startsWith('image/')) throw new Error('File harus berupa gambar')

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filePath = `${user.id}/cover.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('covers')
    .upload(filePath, file, { upsert: true, contentType: file.type })

  if (uploadError) {
    console.error('Cover upload error:', uploadError)
    throw new Error('Gagal mengunggah banner')
  }

  const { data: urlData } = supabase.storage.from('covers').getPublicUrl(filePath)
  const coverUrl = `${urlData.publicUrl}?t=${Date.now()}`

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase as any).from('profiles').update({ cover_url: coverUrl }).eq('id', user.id)

  revalidatePath('/profil')
  return { url: coverUrl }
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const raw = {
    full_name: formData.get('full_name') as string,
    username: (formData.get('username') as string).toLowerCase().trim(),
    bio: formData.get('bio') as string || '',
    is_seller: formData.get('is_seller') === 'true',
  }

  const parsed = updateProfileSchema.safeParse(raw)
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message)
  }

  // Periksa keunikan nama pengguna (kecualikan diri sendiri)
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', parsed.data.username)
    .neq('id', user.id)
    .single()

  if (existingUser) throw new Error('Username sudah digunakan orang lain')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {
    full_name: parsed.data.full_name,
    username: parsed.data.username,
    bio: parsed.data.bio || null,
    is_seller: parsed.data.is_seller ?? false,
  }

  const { error } = await supabase
    .from('profiles')
    .update(updateData)
    .eq('id', user.id)

  if (error) {
    console.error('updateProfile error:', error)
    throw new Error('Gagal memperbarui profil')
  }

  revalidatePath('/profil')
  revalidatePath(`/profil/${parsed.data.username}`)
  return { success: true }
}

export async function updateLastActive() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.from('profiles') as any)
    .update({ last_active: new Date().toISOString() })
    .eq('id', user.id)
}

export async function updateCryptoWallet(walletAddress: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from('profiles')
    .update({ crypto_wallet: walletAddress || null })
    .eq('id', user.id)

  if (error) throw error

  revalidatePath('/profil')
}
