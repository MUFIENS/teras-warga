"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Edit3, MessageCircle, UserPlus, UserMinus, X,
  Check, Camera, Store, Users, FileText, Info, Calendar,
  ShoppingBag, Shield
} from "lucide-react";
import { sendFriendRequest, acceptFriendRequest, cancelFriendRequest, removeFriend } from "@/app/teman/actions";
import { updateProfile, uploadAvatar, uploadCover } from "@/app/profil/actions";
import { useRouter } from "next/navigation";
import { showError, showWarning } from "@/lib/toast";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";
import { usePresence } from "@/components/providers/PresenceProvider";
import dynamic from "next/dynamic";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

import { Avatar } from "@/components/ui/avatar";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  bio: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  role: string;
  account_status: string;
  points: number;
  is_seller: boolean;
  crypto_wallet?: string | null;
  last_active: string | null;
  created_at: string;
}

interface Post {
  id: string;
  content: string;
  image_url: string | null;
  created_at: string;
  profiles: { id: string; username: string; full_name: string; avatar_url: string | null };
  post_likes: { user_id: string }[];
  post_reposts: { user_id: string }[];
}

interface MarketItem {
  id: string;
  title: string;
  price_idr: number | null;
  image_url: string | null;
  category: string;
  condition: string;
  created_at: string;
}

interface Friendship {
  id: string;
  status: string;
  sender: { id: string; username: string; full_name: string; avatar_url: string | null; role?: string; is_seller?: boolean; last_active?: string | null };
  receiver: { id: string; username: string; full_name: string; avatar_url: string | null; role?: string; is_seller?: boolean; last_active?: string | null };
}

interface Props {
  profile: Profile;
  isOwnProfile: boolean;
  currentUserId: string | null;
  relationship: { id: string; status: string; direction: "sent" | "received" } | null;
  stats: { posts: number; friends: number; market: number };
  posts: Post[];
  marketItems: MarketItem[];
  friendships: Friendship[];
}

function getActivityStatus(isOnline: boolean, lastActive: string | null): { label: string; color: string } {
  if (isOnline) return { label: "Online", color: "bg-green-500" };
  if (!lastActive) return { label: "Offline", color: "bg-gray-400" };
  
  const diff = Date.now() - new Date(lastActive).getTime();
  const mins = diff / 60000;
  if (mins < 60) return { label: "Baru Aktif", color: "bg-yellow-400" };
  return { label: "Offline", color: "bg-gray-400" };
}

function formatJoinDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

function formatPrice(price: number | null) {
  if (!price) return "Gratis";
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
}

export function ProfilClient({ profile, isOwnProfile, currentUserId, relationship, stats, posts, marketItems, friendships }: Props) {
  const [activeTab, setActiveTab] = useState<"postingan" | "teman" | "marketplace" | "tentang">("postingan");
  const [showEditModal, setShowEditModal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  const { isOnline, lastActive } = usePresence(profile.id, profile.last_active);
  const activity = getActivityStatus(isOnline, lastActive);

  // Sync with realtime changes
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`profile_changes_${profile.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts', filter: `user_id=eq.${profile.id}` }, () => {
        router.refresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'market_items', filter: `user_id=eq.${profile.id}` }, () => {
        router.refresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friends', filter: `user_id=eq.${profile.id}` }, () => {
        router.refresh();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friends', filter: `friend_id=eq.${profile.id}` }, () => {
        router.refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile.id, router]);



  const handleSendRequest = () => startTransition(async () => {
    try { await sendFriendRequest(profile.id); }
    catch (e: any) { showError("Gagal", e.message); }
  });
  const handleAccept = () => startTransition(async () => { if (relationship) await acceptFriendRequest(relationship.id); });
  const handleCancel = () => startTransition(async () => { if (relationship) await cancelFriendRequest(relationship.id); });
  const handleRemove = async () => {
    const ok = await confirm({
      title: "Hapus Pertemanan?",
      confirmText: "Hapus",
      cancelText: "Batal",
      variant: "danger",
    });
    if (ok && relationship) startTransition(async () => { await removeFriend(relationship.id); });
  };

  const tabs = [
    { id: "postingan", label: "Postingan", icon: FileText },
    { id: "teman", label: "Teman", icon: Users },
    { id: "marketplace", label: "Marketplace", icon: ShoppingBag },
    { id: "tentang", label: "Tentang", icon: Info },
  ] as const;

  return (
    <>
    <ConfirmDialog />
    <div className="flex flex-col min-h-screen">
      {/* Cover */}
      <div className="relative h-40 md:h-52 bg-gradient-to-br from-[#1D9BF0]/20 to-blue-600/10 overflow-hidden">
        {profile.cover_url ? (
          <Image src={profile.cover_url} alt="cover" fill priority={true} sizes="100vw" className="object-cover" unoptimized={true} />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1D9BF0]/30 via-blue-500/10 to-transparent" />
        )}
        {isOwnProfile && (
          <button onClick={() => setShowEditModal(true)} className="absolute bottom-3 right-3 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
            <Camera className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="border-b border-gray-100 dark:border-neutral-800">
        <div className="max-w-3xl mx-auto w-full px-4 md:px-6">
          <div className="flex items-end justify-between -mt-12 md:-mt-16 mb-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar src={profile.avatar_url} alt={profile.full_name} className="w-24 h-24 md:w-32 md:h-32 border-4 border-white dark:border-black" />
              {/* Activity dot */}
              <span className={`absolute bottom-2 right-2 md:bottom-3 md:right-3 w-4 h-4 rounded-full ${activity.color} border-[3px] border-white dark:border-black shadow-sm`} title={activity.label} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pb-2">
              {isOwnProfile ? (
                <button onClick={() => setShowEditModal(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-neutral-700 rounded-full text-sm font-bold hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors">
                  <Edit3 className="w-4 h-4" /> Edit Profil
                </button>
              ) : (
                <>
                  {currentUserId && (
                    <Link href={`/pesan?user=${profile.id}`} className="p-2 border border-gray-200 dark:border-neutral-700 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors text-gray-700 dark:text-gray-300">
                      <MessageCircle className="w-5 h-5" />
                    </Link>
                  )}
                  {!relationship && currentUserId && (
                    <button disabled={isPending} onClick={handleSendRequest} className="flex items-center gap-1.5 px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors disabled:opacity-50">
                      <UserPlus className="w-4 h-4" /> Tambah
                    </button>
                  )}
                  {relationship?.status === "pending" && relationship.direction === "sent" && (
                    <button disabled={isPending} onClick={handleCancel} className="flex items-center gap-1.5 px-5 py-2 border border-gray-200 dark:border-neutral-700 rounded-full text-sm font-bold hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors">
                      <X className="w-4 h-4" /> Batal
                    </button>
                  )}
                  {relationship?.status === "pending" && relationship.direction === "received" && (
                    <button disabled={isPending} onClick={handleAccept} className="flex items-center gap-1.5 px-5 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors">
                      <Check className="w-4 h-4" /> Terima
                    </button>
                  )}
                  {relationship?.status === "accepted" && (
                    <button disabled={isPending} onClick={handleRemove} className="flex items-center gap-1.5 px-5 py-2 border border-gray-200 dark:border-neutral-700 rounded-full text-sm font-bold hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-800 dark:hover:text-red-500 transition-colors">
                      <UserMinus className="w-4 h-4" /> Teman
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Name + badges */}
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">{profile.full_name}</h1>
              {profile.role === "admin" && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold rounded-full">
                  <Shield className="w-3 h-3" /> Admin
                </span>
              )}
              {profile.is_seller && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-bold rounded-full">
                  <Store className="w-3 h-3" /> Seller
                </span>
              )}
              <span className={`flex items-center gap-1 px-2 py-0.5 text-xs font-bold rounded-full ${
                activity.label === "Online" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" :
                activity.label === "Baru Aktif" ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400" :
                "bg-gray-100 dark:bg-neutral-800 text-gray-500"
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activity.color}`} /> {activity.label}
              </span>
            </div>
            <p className="text-gray-500 text-[15px] mt-0.5">@{profile.username}</p>
            {profile.bio && <p className="mt-3 text-[15px] leading-relaxed text-gray-900 dark:text-gray-200 max-w-2xl">{profile.bio}</p>}
            <div className="flex items-center gap-1.5 mt-3 text-[15px] text-gray-500">
              <Calendar className="w-[18px] h-[18px]" />
              <span>Bergabung {formatJoinDate(profile.created_at)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mb-4 text-[15px]">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 dark:text-white">{stats.posts}</span>
              <span className="text-gray-500">Postingan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-gray-900 dark:text-white">{stats.friends}</span>
              <span className="text-gray-500">Teman</span>
            </div>
            {profile.is_seller && (
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-gray-900 dark:text-white">{stats.market}</span>
                <span className="text-gray-500">Produk</span>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex overflow-x-auto no-scrollbar -mx-2 px-2">
            {tabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`relative flex items-center justify-center gap-2 px-4 py-4 min-w-[120px] font-bold transition-colors whitespace-nowrap ${activeTab === tab.id ? "text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-neutral-900/50 rounded-t-lg"}`}>
                <tab.icon className="w-4 h-4 hidden sm:block" />{tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1D9BF0] rounded-t-full" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 px-4 md:px-6 py-4 max-w-3xl mx-auto w-full">
        {/* POSTINGAN */}
        {activeTab === "postingan" && (
          <div className="space-y-0 border-x border-t border-gray-100 dark:border-neutral-800 rounded-2xl overflow-hidden">
            {posts.length === 0 ? (
              <EmptyState icon={<FileText className="w-8 h-8 text-gray-300 dark:text-neutral-600" />} message="Belum ada postingan." />
            ) : posts.map(post => (
              <Link key={post.id} href={`/post/${post.id}`} className="flex gap-3 p-4 border-b border-gray-100 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors">
                <div className="flex-shrink-0">
                  <Avatar src={post.profiles?.avatar_url} alt={post.profiles?.full_name} className="w-10 h-10 border border-gray-100 dark:border-neutral-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-semibold text-[15px] text-gray-900 dark:text-white truncate hover:underline">{post.profiles?.full_name}</span>
                    <span className="text-[14px] text-gray-500 truncate">@{post.profiles?.username}</span>
                    <span className="text-[14px] text-gray-500">·</span>
                    <span className="text-[14px] text-gray-500 whitespace-nowrap hover:underline">{new Date(post.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                  </div>
                  <p className="text-[15px] leading-relaxed text-gray-900 dark:text-white whitespace-pre-wrap">{post.content}</p>
                  {post.image_url && (
                    <div className="mt-3 overflow-hidden rounded-2xl border border-gray-100 dark:border-neutral-800 relative">
                      <Image src={post.image_url} alt="" width={800} height={400} className="w-full h-auto max-h-[400px] object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-6 mt-3 text-gray-500">
                    <div className="flex items-center gap-1.5 group">
                      <div className="p-1.5 rounded-full group-hover:bg-red-50 dark:group-hover:bg-red-900/20 group-hover:text-red-500 transition-colors">
                        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </div>
                      <span className="text-[13px] group-hover:text-red-500">{post.post_likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 group">
                      <div className="p-1.5 rounded-full group-hover:bg-green-50 dark:group-hover:bg-green-900/20 group-hover:text-green-500 transition-colors">
                        <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </div>
                      <span className="text-[13px] group-hover:text-green-500">{post.post_reposts?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* TEMAN */}
        {activeTab === "teman" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {friendships.length === 0 ? (
              <div className="col-span-full"><EmptyState icon={<Users className="w-8 h-8 text-gray-300 dark:text-neutral-600" />} message="Belum ada teman." /></div>
            ) : friendships.map(f => {
              const friend = f.sender?.id === profile.id ? f.receiver : f.sender;
              if (!friend) return null;
              return <FriendCard key={f.id} friend={friend} currentUserId={currentUserId} />;
            })}
          </div>
        )}

        {/* MARKETPLACE */}
        {activeTab === "marketplace" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {marketItems.length === 0 ? (
              <div className="col-span-full"><EmptyState icon={<ShoppingBag className="w-8 h-8 text-gray-300 dark:text-neutral-600" />} message="Belum ada produk." /></div>
            ) : marketItems.map(item => (
              <Link key={item.id} href={`/pasar/${item.id}`} className="flex flex-col group rounded-2xl overflow-hidden hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors p-2 -m-2">
                <div className="aspect-[4/5] bg-gray-100 dark:bg-neutral-800 rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800 relative">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.title} fill sizes="(max-width: 640px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized={true} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-gray-300 dark:text-neutral-600" /></div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2 py-1 rounded-full uppercase tracking-wider">
                    {item.condition}
                  </div>
                </div>
                <div className="mt-2.5 px-1">
                  <p className="font-semibold text-[15px] text-gray-900 dark:text-white line-clamp-1">{item.title}</p>
                  <p className="text-green-600 dark:text-green-400 font-bold text-[15px] mt-0.5 tracking-tight">{formatPrice(item.price_idr)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* TENTANG */}
        {activeTab === "tentang" && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-neutral-800 p-4 sm:p-6 space-y-4">
              <InfoRow label="Username" value={`@${profile.username}`} />
              <InfoRow label="Bio" value={profile.bio || "Belum ada bio."} />
              <InfoRow label="Bergabung" value={formatJoinDate(profile.created_at)} />
              {profile.is_seller && <InfoRow label="Status Seller" value="Aktif sebagai Penjual ✓" />}
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && <EditProfilModal profile={profile} onClose={() => setShowEditModal(false)} onSaved={() => { setShowEditModal(false); router.refresh(); }} />}
    </div>
    </>
  );
}

function EmptyState({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="py-16 flex flex-col items-center gap-3">
      <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-900/50 rounded-full flex items-center justify-center border border-gray-100 dark:border-neutral-800">{icon}</div>
      <p className="text-gray-500 dark:text-neutral-400 text-[15px]">{message}</p>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 py-3 border-b border-gray-100 dark:border-neutral-800 last:border-0">
      <span className="w-36 text-sm text-gray-500 dark:text-neutral-400 flex-shrink-0">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white flex-1">{value}</span>
    </div>
  );
}

const MAX_FILE_MB = 4;
const MAX_FILE_SIZE = MAX_FILE_MB * 1024 * 1024;

function ImageUnggah({ label, currentUrl, onUnggahed, uploadFn, shape = "square" }: {
  label: string;
  currentUrl: string | null;
  onUnggahed: (url: string) => void;
  uploadFn: (fd: FormData) => Promise<{ url: string }>;
  shape?: "circle" | "square";
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [uploading, setUnggahing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      showWarning("File Terlalu Besar", `Ukuran file melebihi ${MAX_FILE_MB} MB. Silakan pilih file yang lebih kecil.`);
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      showError("Format Salah", "File harus berupa gambar (JPG, PNG, WebP, dll).");
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    // Tampilkan pratinjau lokal segera
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    // Unggah
    setUnggahing(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadFn(fd);
      setPreview(result.url);
      onUnggahed(result.url);
    } catch (err: any) {
      showError("Gagal Unggah", err.message || "Terjadi kesalahan saat mengunggah.");
      setPreview(currentUrl);
    } finally {
      setUnggahing(false);
    }
  };

  const isCircle = shape === "circle";

  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer group overflow-hidden border-2 border-dashed border-gray-200 dark:border-neutral-700 hover:border-[#1D9BF0] dark:hover:border-[#1D9BF0] transition-colors ${
          isCircle ? "w-24 h-24 rounded-full mx-auto" : "w-full h-32 rounded-xl"
        }`}
      >
        {preview ? (
          <Image src={preview} alt="" fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover" unoptimized={true} />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Camera className="w-6 h-6 mb-1" />
            <span className="text-xs">Pilih Gambar</span>
          </div>
        )}
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isCircle ? "rounded-full" : "rounded-xl"}`}>
          <Camera className="w-6 h-6 text-white" />
        </div>
        {/* Unggahing spinner */}
        {uploading && (
          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center ${isCircle ? "rounded-full" : "rounded-xl"}`}>
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      <p className="text-xs text-gray-400 mt-1.5 text-center">Maks. {MAX_FILE_MB} MB &middot; JPG, PNG, WebP</p>
    </div>
  );
}

function EditProfilModal({ profile, onClose, onSaved }: { profile: Profile; onClose: () => void; onSaved: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError(null);
    startTransition(async () => {
      try {
        await updateProfile(formData);
        onSaved();
      } catch (err: any) {
        setError(err.message);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-neutral-800">
          <h2 className="font-bold text-lg">Edit Profil</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-5">
          {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">{error}</div>}

          {/* Cover Unggah */}
          <ImageUnggah
            label="Banner / Cover"
            currentUrl={profile.cover_url}
            onUnggahed={() => {}}
            uploadFn={uploadCover}
            shape="square"
          />

          {/* Avatar Unggah */}
          <ImageUnggah
            label="Foto Profil"
            currentUrl={profile.avatar_url}
            onUnggahed={() => {}}
            uploadFn={uploadAvatar}
            shape="circle"
          />

          <Field label="Nama Lengkap" name="full_name" defaultValue={profile.full_name} required />
          <Field label="Username" name="username" defaultValue={profile.username} required hint="Hanya huruf kecil, angka, dan underscore" />
          <Field label="Bio" name="bio" defaultValue={profile.bio || ""} as="textarea" />
          <div className="flex items-center gap-3">
            <input type="hidden" name="is_seller" value="false" />
            <input type="checkbox" id="is_seller" name="is_seller" value="true" defaultChecked={profile.is_seller} onChange={e => {
              const hidden = e.currentTarget.closest("form")?.querySelector('input[name="is_seller"]') as HTMLInputElement;
              if (hidden) hidden.value = e.currentTarget.checked ? "true" : "false";
            }} className="w-4 h-4 rounded accent-[#1D9BF0]" />
            <label htmlFor="is_seller" className="text-sm font-medium cursor-pointer">Tampilkan sebagai Penjual (Seller)</label>
          </div>
          <button type="submit" disabled={isPending} className="w-full py-3 bg-[#1D9BF0] text-white font-semibold rounded-full hover:bg-[#1a8cd8] transition-colors disabled:opacity-50">
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, name, defaultValue, required, hint, as }: {
  label: string; name: string; defaultValue: string; required?: boolean; hint?: string; as?: "textarea";
}) {
  const cls = "w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0]/50 focus:border-[#1D9BF0] text-sm transition-all";
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      {as === "textarea" ? (
        <textarea name={name} defaultValue={defaultValue} rows={3} className={cls} />
      ) : (
        <input type="text" name={name} defaultValue={defaultValue} required={required} className={cls} />
      )}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function FriendCard({ friend, currentUserId }: { friend: any, currentUserId: string | null }) {
  const { isOnline, lastActive } = usePresence(friend.id, friend.last_active || null);
  const friendActivity = getActivityStatus(isOnline, lastActive);
  
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-900/30 transition-all group">
      <Link href={`/profil/${friend.username}`} className="flex items-center gap-3 min-w-0 flex-1">
        <div className="relative">
          <Avatar src={friend.avatar_url} alt={friend.full_name} className="w-12 h-12 border border-gray-100 dark:border-neutral-800" />
          <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${friendActivity.color} border-2 border-white dark:border-black`} title={friendActivity.label} />
        </div>
        <div className="min-w-0 pr-2">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-[15px] text-gray-900 dark:text-white truncate group-hover:underline">{friend.full_name}</p>
            {friend.role === "admin" && (
              <span className="flex-shrink-0 text-purple-600 dark:text-purple-400" title="Admin">
                <Shield className="w-3.5 h-3.5" />
              </span>
            )}
            {friend.is_seller && (
              <span className="flex-shrink-0 text-amber-600 dark:text-amber-400" title="Seller">
                <Store className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <p className="text-[13px] text-gray-500 truncate">@{friend.username}</p>
        </div>
      </Link>
      {currentUserId && currentUserId !== friend.id && (
        <Link href={`/pesan?user=${friend.id}`} className="p-2 text-gray-400 hover:text-[#1D9BF0] hover:bg-[#1D9BF0]/10 rounded-full transition-colors flex-shrink-0">
          <MessageCircle className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
