"use client";

import { useState, useEffect } from "react";
import { PostCard } from "@/components/PostCard";
import { fetchMorePosts } from "@/app/actions";
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

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

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "400px", // Fetch before it reaches the exact bottom
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
          // Remove duplicates if any
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
      {posts.map((post: any) => (
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
