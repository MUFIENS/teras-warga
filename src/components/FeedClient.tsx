"use client";

import { useState, useEffect } from "react";
import { PostCard } from "@/components/PostCard";
import { fetchMorePosts } from "@/app/actions";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

import { formatDistanceToNow } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface FeedClientProps {
  initialPosts: any[];
  currentUserId: string | null;
}

export function FeedClient({ initialPosts, currentUserId }: FeedClientProps) {
  const [posts, setPosts] = useState(initialPosts || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState((initialPosts?.length || 0) >= 10);
  const [loading, setLoading] = useState(false);

  // Sync with incoming server data
  useEffect(() => {
    if (!initialPosts || initialPosts.length === 0) return;

    setPosts((prev) => {
      const prevMap = new Map(prev.map(p => [p.id, p]));
      let hasChanges = false;

      initialPosts.forEach(serverPost => {
        const existing = prevMap.get(serverPost.id);
        if (!existing) {
          prevMap.set(serverPost.id, serverPost);
          hasChanges = true;
        } else {
          // Compare relevant fields to prevent unnecessary updates
          const existingLikes = existing.likes?.[0]?.count || 0;
          const serverLikes = serverPost.likes?.[0]?.count || 0;
          const existingReplies = existing.replies?.[0]?.count || 0;
          const serverReplies = serverPost.replies?.[0]?.count || 0;
          const existingReposts = existing.reposts?.[0]?.count || 0;
          const serverReposts = serverPost.reposts?.[0]?.count || 0;
          
          if (
            existingLikes !== serverLikes ||
            existingReplies !== serverReplies ||
            existingReposts !== serverReposts ||
            existing.hasLiked !== serverPost.hasLiked ||
            existing.hasReposted !== serverPost.hasReposted
          ) {
            prevMap.set(serverPost.id, serverPost);
            hasChanges = true;
          }
        }
      });

      if (!hasChanges && initialPosts.length <= prev.length) {
        return prev;
      }

      return Array.from(prevMap.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    });
  }, [initialPosts]);

  // Supabase Realtime Subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel('feed_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'posts' }, async (payload) => {
        const newPostId = payload.new.id;
        if (payload.new.parent_id !== null) return;
        
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
          .eq('id', newPostId)
          .single();

        if (data && !error) {
          const enrichedData = {
            ...data,
            hasLiked: false,
            hasReposted: false,
            isOwnPost: currentUserId ? data.user_id === currentUserId : false
          };
          
          setPosts(prev => {
            if (prev.some(p => p.id === enrichedData.id)) return prev;
            return [enrichedData, ...prev];
          });
        }
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'posts' }, (payload) => {
        setPosts(prev => prev.filter(p => p.id !== payload.old.id));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId]);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px",
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMorePosts();
    }
  }, [inView, hasMore, loading]);

  const loadMorePosts = async () => {
    setLoading(true);
    try {
      const nextPosts = await fetchMorePosts(page);
      if (nextPosts && nextPosts.length > 0) {
        setPosts((prev) => {
          const newPosts = nextPosts.filter(
            (np) => !prev.some((p) => p.id === np.id)
          );
          return [...prev, ...newPosts];
        });
        setPage((p) => p + 1);
        if (nextPosts.length < 10) {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <p className="text-gray-500 font-medium">Belum ada postingan</p>
        <p className="text-gray-400 text-sm mt-1">Jadilah yang pertama memulai percakapan!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {posts.map((post: any, index: number) => (
        <PostCard
          key={post.id}
          id={post.id}
          name={post.profiles?.full_name || 'Anonymous'}
          username={post.profiles?.username || 'anonymous'}
          avatar={post.profiles?.avatar_url || undefined}
          content={post.content}
          image_url={post.image_url}
          timestamp={post.created_at ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: idLocale }) : 'Baru saja'}
          likes={post.likes?.[0]?.count || 0}
          replies={post.replies?.[0]?.count || 0}
          reposts={post.reposts?.[0]?.count || 0}
          hasLiked={post.hasLiked}
          hasReposted={post.hasReposted}
          isOwnPost={currentUserId ? post.user_id === currentUserId : false}
          priority={index < 3}
        />
      ))}
      
      {/* Intersection Observer Target */}
      <div ref={ref} className="h-20 w-full flex items-center justify-center py-6">
        {loading && <Loader2 className="w-6 h-6 text-[#1D9BF0] animate-spin" />}
        {!hasMore && posts.length > 0 && (
          <p className="text-gray-500 text-sm mt-4">Anda sudah melihat semua postingan.</p>
        )}
      </div>
    </div>
  );
}
