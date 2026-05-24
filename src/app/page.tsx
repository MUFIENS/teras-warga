import { FeedClient } from "@/components/FeedClient";
import { FeedInput } from "@/components/FeedInput";
import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { getUserProfile } from "@/lib/data/user";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let currentUserProfile = null;
  if (user) {
    currentUserProfile = await getUserProfile(user.id);
  }

  // Fetch posts directly using authenticated client to prevent RLS hiding profile info
  const { data: postsData, error: postsError } = await supabase
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
    .range(0, 9);
    
  if (postsError) {
    console.error('Error fetching posts:', postsError);
  }

  // Ambil interaksi pengguna saat ini
  const { data: userLikesData } = user 
    ? await supabase.from('post_likes').select('post_id').eq('user_id', user.id) 
    : { data: [] };
    
  const { data: userRepostsData } = user 
    ? await supabase.from('post_reposts').select('post_id').eq('user_id', user.id) 
    : { data: [] };

  const likedPostIds = new Set((userLikesData || []).map(l => l.post_id));
  const repostedPostIds = new Set((userRepostsData || []).map(r => r.post_id));

  // Enrich initial posts with like/repost status
  const enrichedPosts = postsData?.map(post => ({
    ...post,
    hasLiked: likedPostIds.has(post.id),
    hasReposted: repostedPostIds.has(post.id)
  })) || [];

  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">
      {/* Sticky Header */}
      <header className="sticky top-14 md:top-0 z-10 flex items-center px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold">Beranda</h1>
      </header>

      {/* Compose Area */}
      {user && currentUserProfile ? (
        <FeedInput 
          avatar={currentUserProfile.avatar_url || undefined} 
          username={currentUserProfile.username} 
        />
      ) : (
        <div className="px-4 py-8 border-b border-gray-200 dark:border-neutral-800 flex flex-col items-center justify-center gap-4 text-center">
          <p className="text-gray-500">Silakan login untuk memposting dan berinteraksi</p>
          <a href="/login" className="px-6 py-2 bg-[#1D9BF0] text-white rounded-full font-bold hover:bg-[#1A8CD8] transition-colors">
            Login Sekarang
          </a>
        </div>
      )}

      {/* Feed */}
      <FeedClient 
        initialPosts={enrichedPosts} 
        currentUserId={user?.id || null} 
      />
    </div>
  );
}
