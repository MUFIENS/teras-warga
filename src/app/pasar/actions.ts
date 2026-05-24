'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createMarketItem(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Anda harus login untuk menjual barang')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price_idr = parseFloat(formData.get('price_idr') as string) || 0
  const category = formData.get('category') as string || 'Lainnya'
  const condition = formData.get('condition') as string || 'Bekas'
  const location = formData.get('location') as string || ''
  const image = formData.get('image') as File | null

  if (!title.trim()) {
    throw new Error('Judul barang harus diisi')
  }

  if (price_idr <= 0) {
    throw new Error('Harga harus lebih dari 0')
  }

  let image_url = null

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('market_images')
      .upload(filePath, image)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('market_images')
      .getPublicUrl(filePath)
      
    image_url = publicUrl
  }

  const { error } = await supabase
    .from('market_items')
    .insert({
      user_id: user.id,
      title,
      description,
      price_idr,
      category,
      condition,
      location,
      image_url,
      is_active: true
    } as any)

  if (error) {
    throw error
  }

  revalidatePath('/pasar', 'layout')
}

export async function updateMarketItem(itemId: string, formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Anda harus login')
  }

  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const price_idr = parseFloat(formData.get('price_idr') as string) || 0
  const category = formData.get('category') as string || 'Lainnya'
  const condition = formData.get('condition') as string || 'Bekas'
  const location = formData.get('location') as string || ''
  const image = formData.get('image') as File | null

  const updateData: any = {
    title,
    description,
    price_idr,
    category,
    condition,
    location,
  }

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('market_images')
      .upload(filePath, image)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('market_images')
      .getPublicUrl(filePath)
      
    updateData.image_url = publicUrl
  }

  const { error } = await supabase
    .from('market_items')
    .update(updateData)
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  revalidatePath('/pasar', 'layout')
}

export async function deleteMarketItem(itemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Anda harus login')
  }

  const { error } = await supabase
    .from('market_items')
    .delete()
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  revalidatePath('/pasar', 'layout')
}

export async function toggleMarketItemStatus(itemId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Anda harus login')
  }

  const { data: item } = await supabase
    .from('market_items')
    .select('is_active')
    .eq('id', itemId)
    .eq('user_id', user.id)
    .single()

  if (!item) {
    throw new Error('Barang tidak ditemukan')
  }

  const { error } = await supabase
    .from('market_items')
    .update({ is_active: !item.is_active })
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  revalidatePath('/pasar', 'layout')
}

export async function fetchMoreMarketItems(page: number) {
  const supabase = await createClient()
  const limit = 10
  const from = page * limit
  const to = from + limit - 1

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
    .range(from, to)

  if (error) {
    console.error('Error fetching more market items:', error)
    return []
  }

  return data
}
