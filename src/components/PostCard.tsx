"use client";

import * as React from "react";
import Link from "next/link";
import { MessageCircle, Repeat2, Heart, Share, MoreHorizontal, Image as ImageIcon } from "lucide-react";
import { toggleLike, toggleRepost, deletePost, reportPost } from "@/app/actions";
import { useTransition, useState, useRef, useEffect } from "react";
import Swal from 'sweetalert2';
import { useRouter } from "next/navigation";

interface PostCardProps {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  content: string;
  image_url?: string | null;
  timestamp: string;
  likes?: number;
  replies?: number;
  reposts?: number;
  hasLiked?: boolean;
  hasReposted?: boolean;
  isOwnPost?: boolean;
}

export function PostCard({
  id,
  name,
  username,
  avatar,
  content,
  image_url,
  timestamp,
  likes = 0,
  replies = 0,
  reposts = 0,
  hasLiked = false,
  hasReposted = false,
  isOwnPost = false,
}: PostCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticLikes, setOptimisticLikes] = useState({ count: likes, liked: hasLiked });
  const [optimisticReposts, setOptimisticReposts] = useState({ count: reposts, reposted: hasReposted });
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Sinkronkan state optimistik ketika props berubah dari server refresh
  useEffect(() => {
    setOptimisticLikes({ count: likes, liked: hasLiked });
  }, [likes, hasLiked]);

  useEffect(() => {
    setOptimisticReposts({ count: reposts, reposted: hasReposted });
  }, [reposts, hasReposted]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    Swal.fire({
      title: 'Hapus Postingan?',
      text: "Postingan ini tidak dapat dikembalikan setelah dihapus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      background: document.documentElement.classList.contains('dark') ? '#171717' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          await deletePost(id);
        });
      }
    });
  };

  const handleReport = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    Swal.fire({
      title: 'Laporkan Postingan?',
      text: "Admin akan meninjau laporan Anda.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#1D9BF0',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya, laporkan!',
      cancelButtonText: 'Batal',
      background: document.documentElement.classList.contains('dark') ? '#171717' : '#ffffff',
      color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          await reportPost(id);
          Swal.fire({
            title: 'Dilaporkan!',
            text: 'Terima kasih atas laporannya.',
            icon: 'success',
            confirmButtonColor: '#1D9BF0',
            background: document.documentElement.classList.contains('dark') ? '#171717' : '#ffffff',
            color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
          });
        });
      }
    });
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      setOptimisticLikes(prev => ({
        count: prev.liked ? prev.count - 1 : prev.count + 1,
        liked: !prev.liked
      }));
      await toggleLike(id);
    });
  };

  const handleRepost = (e: React.MouseEvent) => {
    e.stopPropagation();
    startTransition(async () => {
      setOptimisticReposts(prev => ({
        count: prev.reposted ? prev.count - 1 : prev.count + 1,
        reposted: !prev.reposted
      }));
      await toggleRepost(id);
    });
  };

  const navigateToPost = () => {
    router.push(`/post/${id}`);
  };

  return (
    <article 
      onClick={navigateToPost}
      className={`flex gap-4 px-4 py-4 border-b border-gray-200 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors duration-200 cursor-pointer ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <div className="flex-shrink-0">
        <Link href={`/profil/${username}`} onClick={e => e.stopPropagation()} className="block">
          {avatar ? (
            <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity" />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center font-bold text-gray-500 uppercase hover:opacity-80 transition-opacity">
              {name.charAt(0)}
            </div>
          )}
        </Link>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between relative" ref={menuRef}>
          <div className="flex items-center gap-1.5 truncate">
            <Link href={`/profil/${username}`} onClick={e => e.stopPropagation()} className="font-bold truncate text-[15px] hover:underline">{name}</Link>
            <Link href={`/profil/${username}`} onClick={e => e.stopPropagation()} className="text-gray-500 dark:text-neutral-500 text-[15px] truncate hover:underline">@{username}</Link>
            <span className="text-gray-500 dark:text-neutral-500">·</span>
            <span className="text-gray-500 dark:text-neutral-500 text-[15px] whitespace-nowrap">{timestamp}</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="text-gray-500 hover:text-[#1D9BF0] hover:bg-[#1D9BF0]/10 p-1.5 rounded-full transition-colors duration-200"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 overflow-hidden z-20 py-2">
              {isOwnPost ? (
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors font-medium"
                >
                  Hapus Postingan
                </button>
              ) : (
                <button
                  onClick={handleReport}
                  className="w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors font-medium"
                >
                  Laporkan Postingan
                </button>
              )}
            </div>
          )}
        </div>
        
        <p className="mt-1 text-[15px] leading-normal whitespace-pre-wrap">
          {content}
        </p>

        {image_url && (
          <div className="mt-3 relative rounded-2xl overflow-hidden border border-gray-200 dark:border-neutral-800">
            <img src={image_url} alt="Post attachment" className="w-full object-cover max-h-[500px]" />
          </div>
        )}
        
        <div className="flex items-center justify-between mt-3 text-gray-500 dark:text-neutral-500 max-w-md">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/post/${id}`);
            }}
            className="flex items-center gap-2 group"
          >
            <div className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] transition-colors duration-200">
              <MessageCircle className="w-[18px] h-[18px]" />
            </div>
            {replies > 0 && <span className="text-sm group-hover:text-[#1D9BF0]">{replies}</span>}
          </button>
          
          <button onClick={handleRepost} className="flex items-center gap-2 group">
            <div className={`p-2 rounded-full transition-colors duration-200 ${optimisticReposts.reposted ? 'text-green-500 bg-green-500/10' : 'group-hover:bg-green-500/10 group-hover:text-green-500'}`}>
              <Repeat2 className="w-[18px] h-[18px]" />
            </div>
            {optimisticReposts.count > 0 && (
              <span className={`text-sm ${optimisticReposts.reposted ? 'text-green-500' : 'group-hover:text-green-500'}`}>
                {optimisticReposts.count}
              </span>
            )}
          </button>
          
          <button onClick={handleLike} className="flex items-center gap-2 group">
            <div className={`p-2 rounded-full transition-colors duration-200 ${optimisticLikes.liked ? 'text-pink-500 bg-pink-500/10' : 'group-hover:bg-pink-500/10 group-hover:text-pink-500'}`}>
              <Heart className={`w-[18px] h-[18px] ${optimisticLikes.liked ? 'fill-current' : ''}`} />
            </div>
            {optimisticLikes.count > 0 && (
              <span className={`text-sm ${optimisticLikes.liked ? 'text-pink-500' : 'group-hover:text-pink-500'}`}>
                {optimisticLikes.count}
              </span>
            )}
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              const postUrl = `${window.location.origin}/post/${id}`;
              
              if (navigator.share) {
                navigator.share({
                  title: `Postingan @${username}`,
                  text: content?.slice(0, 100) || 'Lihat postingan ini di Teras Warga',
                  url: postUrl,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(postUrl).then(() => {
                  Swal.fire({
                    title: 'Link Disalin!',
                    text: 'Link postingan telah disalin ke clipboard.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'bottom-end',
                    background: document.documentElement.classList.contains('dark') ? '#171717' : '#ffffff',
                    color: document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000',
                  });
                });
              }
            }}
            className="flex items-center gap-2 group"
          >
            <div className="p-2 rounded-full group-hover:bg-[#1D9BF0]/10 group-hover:text-[#1D9BF0] transition-colors duration-200">
              <Share className="w-[18px] h-[18px]" />
            </div>
          </button>
        </div>
      </div>
    </article>
  );
}
