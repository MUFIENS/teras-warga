import { PostCard } from "@/components/PostCard";
import { FeedInput } from "@/components/FeedInput";
import { RealtimeListener } from "@/components/RealtimeListener";
import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

export default async function Home() {
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

  // Ambil postingan
  const { data: postsData } = await supabase
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
    .order('created_at', { ascending: false });

  // Ambil interaksi pengguna saat ini
  const { data: userLikesData } = user 
    ? await supabase.from('post_likes').select('post_id').eq('user_id', user.id) 
    : { data: [] };
    
  const { data: userRepostsData } = user 
    ? await supabase.from('post_reposts').select('post_id').eq('user_id', user.id) 
    : { data: [] };

  const likedPostIds = new Set((userLikesData || []).map(l => l.post_id));
  const repostedPostIds = new Set((userRepostsData || []).map(r => r.post_id));

  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">
      <RealtimeListener />
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 flex items-center px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold">Beranda</h1>
      </header>

      {/* Compose Area */}
      {user && currentUserProfile ? (
        <FeedInput 
          avatar={currentUserProfile.avatar_url || undefined} 
          username={currentUserProfile.username} 
        />
      ) : (
        <div className="px-4 py-8 border-b border-gray-200 dark:border-neutral-800 text-center text-gray-500">
          Silakan login untuk memposting
        </div>
      )}

      {/* Feed */}
      <div className="flex flex-col">
        {postsData?.map((post: any) => (
          <PostCard 
            key={post.id} 
            id={post.id}
            name={post.profiles?.full_name || 'Anonymous'}
            username={post.profiles?.username || 'anonymous'}
            avatar={post.profiles?.avatar_url || undefined}
            content={post.content}
            image_url={post.image_url}
            timestamp={post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: id }) : 'Baru saja'}
            likes={post.likes?.[0]?.count || 0}
            replies={post.replies?.[0]?.count || 0}
            reposts={post.reposts?.[0]?.count || 0}
            hasLiked={likedPostIds.has(post.id)}
            hasReposted={repostedPostIds.has(post.id)}
            isOwnPost={user ? post.user_id === user.id : false}
          />
        ))}
      </div>
    </div>
  );
}
