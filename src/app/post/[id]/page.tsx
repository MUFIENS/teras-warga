import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/PostCard";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FeedInput } from "@/components/FeedInput";
import { RealtimeListener } from "@/components/RealtimeListener";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const postId = resolvedParams.id;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let currentUserProfile = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username, avatar_url')
      .eq('id', user.id)
      .single();
    currentUserProfile = data;
  }

  // Ambil postingan utama
  const { data: mainPost } = await supabase
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
    .eq('id', postId)
    .single();

  if (!mainPost) {
    notFound();
  }

  // Ambil balasan
  const { data: repliesData } = await supabase
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
    .eq('parent_id', postId)
    .order('created_at', { ascending: true });

  // Ambil interaksi pengguna untuk postingan utama dan balasan
  const allPostIds = [mainPost.id, ...(repliesData?.map(r => r.id) || [])];
  
  const { data: userLikesData } = user 
    ? await supabase.from('post_likes').select('post_id').in('post_id', allPostIds).eq('user_id', user.id) 
    : { data: [] };
    
  const { data: userRepostsData } = user 
    ? await supabase.from('post_reposts').select('post_id').in('post_id', allPostIds).eq('user_id', user.id) 
    : { data: [] };

  const likedPostIds = new Set((userLikesData || []).map(l => l.post_id));
  const repostedPostIds = new Set((userRepostsData || []).map(r => r.post_id));

  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800 pb-20">
      <RealtimeListener />
      <header className="sticky top-0 z-10 flex items-center gap-4 px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-xl font-bold">Postingan</h1>
      </header>

      <div className="flex flex-col border-b border-gray-200 dark:border-neutral-800">
        <PostCard 
          id={mainPost.id}
          name={mainPost.profiles?.full_name || 'Anonymous'}
          username={mainPost.profiles?.username || 'anonymous'}
          avatar={mainPost.profiles?.avatar_url || undefined}
          content={mainPost.content}
          image_url={mainPost.image_url}
          timestamp={mainPost.created_at ? formatDistanceToNow(new Date(mainPost.created_at), { addSuffix: true, locale: localeId }) : 'Baru saja'}
          likes={(mainPost.likes as any)?.[0]?.count || 0}
          replies={(mainPost.replies as any)?.[0]?.count || 0}
          reposts={(mainPost.reposts as any)?.[0]?.count || 0}
          hasLiked={likedPostIds.has(mainPost.id)}
          hasReposted={repostedPostIds.has(mainPost.id)}
          isOwnPost={user ? mainPost.user_id === user.id : false}
        />
      </div>

      {user && currentUserProfile ? (
        <FeedInput 
          avatar={currentUserProfile.avatar_url || undefined} 
          username={currentUserProfile.username}
          parentId={postId}
          placeholder="Balas postingan ini..."
        />
      ) : (
        <div className="px-4 py-8 border-b border-gray-200 dark:border-neutral-800 text-center text-gray-500">
          Silakan login untuk membalas
        </div>
      )}

      <div className="flex flex-col">
        {repliesData?.map((reply: any) => (
          <PostCard 
            key={reply.id} 
            id={reply.id}
            name={reply.profiles?.full_name || 'Anonymous'}
            username={reply.profiles?.username || 'anonymous'}
            avatar={reply.profiles?.avatar_url || undefined}
            content={reply.content}
            image_url={reply.image_url}
            timestamp={reply.created_at ? formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: localeId }) : 'Baru saja'}
            likes={reply.likes?.[0]?.count || 0}
            replies={reply.replies?.[0]?.count || 0}
            reposts={reply.reposts?.[0]?.count || 0}
            hasLiked={likedPostIds.has(reply.id)}
            hasReposted={repostedPostIds.has(reply.id)}
            isOwnPost={user ? reply.user_id === user.id : false}
          />
        ))}
      </div>
    </div>
  );
}
