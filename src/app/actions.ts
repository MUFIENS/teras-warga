'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createNotification } from '@/lib/notifications'

export async function createPost(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to post')
  }

  const content = (formData.get('content') as string) || ''
  const image = formData.get('image') as File | null
  const parentId = formData.get('parent_id') as string | null

  if (!content.trim() && !image) {
    throw new Error('Post must have content or an image')
  }

  let image_url = null

  if (image && image.size > 0) {
    const fileExt = image.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('feed_images')
      .upload(filePath, image)

    if (uploadError) {
      throw uploadError
    }

    const { data: { publicUrl } } = supabase.storage
      .from('feed_images')
      .getPublicUrl(filePath)
      
    image_url = publicUrl
  }

  const { error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      content,
      image_url,
      parent_id: parentId || null
    })

  if (error) {
    throw error
  }

  // Jika ini adalah balasan, beri tahu penulis postingan utama
  if (parentId) {
    const { data: parentPost } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', parentId)
      .single()

    if (parentPost && parentPost.user_id && parentPost.user_id !== user.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()
      
      const senderName = profile?.full_name || 'Seseorang'
      await createNotification(
        supabase,
        parentPost.user_id,
        'Komentar Baru',
        `${senderName} membalas postingan Anda.`
      )
    }
  }

  revalidatePath('/', 'layout')
}

export async function toggleLike(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to like a post')
  }

  // Periksa apakah sudah disukai
  const { data: existingLike } = await supabase
    .from('post_likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existingLike) {
    await supabase
      .from('post_likes')
      .delete()
      .eq('id', existingLike.id)
  } else {
    await supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        user_id: user.id
      })

    // Beri tahu penulis postingan
    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()

    if (post && post.user_id && post.user_id !== user.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const senderName = profile?.full_name || 'Seseorang'
      await createNotification(
        supabase,
        post.user_id,
        'Suka Baru',
        `${senderName} menyukai postingan Anda.`
      )
    }
  }

  revalidatePath('/', 'layout')
}

export async function toggleRepost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to repost')
  }

  // Periksa apakah sudah diposting ulang
  const { data: existingRepost } = await supabase
    .from('post_reposts')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existingRepost) {
    await supabase
      .from('post_reposts')
      .delete()
      .eq('id', existingRepost.id)
  } else {
    await supabase
      .from('post_reposts')
      .insert({
        post_id: postId,
        user_id: user.id
      })

    // Beri tahu penulis postingan
    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()

    if (post && post.user_id && post.user_id !== user.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      const senderName = profile?.full_name || 'Seseorang'
      await createNotification(
        supabase,
        post.user_id,
        'Repost Baru',
        `${senderName} me-repost postingan Anda.`
      )
    }
  }

  revalidatePath('/', 'layout')
}

export async function deletePost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to delete a post')
  }

  // Hapus postingan (RLS memastikan pengguna hanya dapat menghapus postingan mereka sendiri)
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  revalidatePath('/', 'layout')
}

export async function reportPost(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in to report a post')
  }

  // Masukkan laporan ke tabel laporan
  const { error } = await supabase
    .from('reports')
    .insert({
      user_id: user.id,
      title: 'Laporan Postingan',
      description: `User melaporkan postingan dengan ID: ${postId}`,
      category: 'Moderasi Konten',
      status: 'pending'
    })

  if (error) {
    throw error
  }
}

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in')
  }

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .eq('user_id', user.id)
}

export async function markAllNotificationsRead() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('You must be logged in')
  }

  await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  revalidatePath('/notifikasi', 'layout')
}

export async function fetchMorePosts(page: number) {
  const supabase = await createClient()
  const limit = 10
  const from = page * limit
  const to = from + limit - 1

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
    .range(from, to)

  if (error) {
    console.error('Error fetching more posts:', error)
    return []
  }

  const { data: { user } } = await supabase.auth.getUser()

  if (user && data && data.length > 0) {
    const postIds = data.map(p => p.id)
    
    const [{ data: likes }, { data: reposts }] = await Promise.all([
      supabase.from('post_likes').select('post_id').eq('user_id', user.id).in('post_id', postIds),
      supabase.from('post_reposts').select('post_id').eq('user_id', user.id).in('post_id', postIds)
    ])

    const likedIds = new Set(likes?.map(l => l.post_id))
    const repostIds = new Set(reposts?.map(r => r.post_id))

    return data.map(post => ({
      ...post,
      hasLiked: likedIds.has(post.id),
      hasReposted: repostIds.has(post.id),
      isOwnPost: post.user_id === user.id
    }))
  }

  return data?.map(post => ({
    ...post,
    hasLiked: false,
    hasReposted: false,
    isOwnPost: false
  })) || []
}
