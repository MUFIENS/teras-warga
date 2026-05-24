import { FeedClient } from "@/components/FeedClient";
import { FeedInput } from "@/components/FeedInput";
import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { getCachedPosts } from "@/lib/data/posts";
import { getUserProfile } from "@/lib/data/user";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let currentUserProfile = null;
  if (user) {
    currentUserProfile = await getUserProfile(user.id);
  }

  // Ambil postingan dengan cache
  const postsData = await getCachedPosts();

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
        <div className="px-4 py-8 border-b border-gray-200 dark:border-neutral-800 text-center text-gray-500">
          Silakan login untuk memposting
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
