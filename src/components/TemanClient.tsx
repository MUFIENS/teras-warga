"use client";

import { useState, useTransition, useEffect } from "react";
import { Search, UserPlus, UserCheck, X, Users, UserMinus, Check, MessageCircle, Clock, ShieldAlert } from "lucide-react";
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, removeFriend } from "@/app/teman/actions";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Swal from "sweetalert2";
import Link from "next/link";

interface Profile {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
}

interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  sender: Profile;
  receiver: Profile;
}

interface TemanClientProps {
  currentUserId: string;
  friendships: Friendship[];
  allProfiles: Profile[];
}

export function TemanClient({ currentUserId, friendships: initialFriendships, allProfiles }: TemanClientProps) {
  const [viewTab, setViewTab] = useState<"semua" | "permintaan" | "cari">("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [friendships, setFriendships] = useState<Friendship[]>(initialFriendships);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Pembaruan waktu-nyata
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('friends_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'friends' }, () => {
        router.refresh(); // Bergantung pada penyegaran server untuk mendapatkan data gabungan penuh
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [router]);

  // Sinkronkan status jika properti berubah dari penyegaran server
  useEffect(() => {
    setFriendships(initialFriendships);
  }, [initialFriendships]);

  const swalTheme = () => ({
    background: document.documentElement.classList.contains("dark") ? "#171717" : "#fff",
    color: document.documentElement.classList.contains("dark") ? "#fff" : "#000",
  });

  // Kategorikan
  const acceptedFriends = friendships.filter(f => f.status === "accepted");
  const incomingRequests = friendships.filter(f => f.status === "pending" && f.friend_id === currentUserId);
  const outgoingRequests = friendships.filter(f => f.status === "pending" && f.user_id === currentUserId);

  // Daftar teman yang dipetakan untuk ditampilkan
  const friendsList = acceptedFriends.map(f => {
    const isSender = f.user_id === currentUserId;
    return {
      friendshipId: f.id,
      profile: isSender ? f.receiver : f.sender
    };
  }).filter(f => f.profile); // pastikan profil ada

  // Saring daftar berdasarkan pencarian
  const filteredFriends = friendsList.filter(f => 
    (f.profile.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (f.profile.username?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const filteredSearch = allProfiles.filter(p => 
    (p.full_name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
    (p.username?.toLowerCase() || "").includes(searchQuery.toLowerCase())
  );

  const handleSendRequest = (targetId: string) => {
    startTransition(async () => {
      try {
        await sendFriendRequest(targetId);
      } catch (err: any) {
        Swal.fire({ title: "Gagal!", text: err.message, icon: "error", ...swalTheme() });
      }
    });
  };

  const handleAcceptRequest = (requestId: string) => {
    startTransition(async () => {
      try { await acceptFriendRequest(requestId); } 
      catch (err: any) { Swal.fire({ title: "Gagal!", text: err.message, icon: "error", ...swalTheme() }); }
    });
  };

  const handleRejectRequest = (requestId: string) => {
    startTransition(async () => {
      try { await rejectFriendRequest(requestId); } 
      catch (err: any) { Swal.fire({ title: "Gagal!", text: err.message, icon: "error", ...swalTheme() }); }
    });
  };

  const handleCancelRequest = (requestId: string) => {
    startTransition(async () => {
      try { await cancelFriendRequest(requestId); } 
      catch (err: any) { Swal.fire({ title: "Gagal!", text: err.message, icon: "error", ...swalTheme() }); }
    });
  };

  const handleRemoveFriend = (friendshipId: string, name: string) => {
    Swal.fire({
      title: "Hapus Pertemanan?", text: `Anda akan menghapus ${name} dari daftar teman.`, icon: "warning",
      showCancelButton: true, confirmButtonColor: "#d33", cancelButtonColor: "#3085d6",
      confirmButtonText: "Hapus", cancelButtonText: "Batal", ...swalTheme(),
    }).then((res) => {
      if (res.isConfirmed) startTransition(async () => { await removeFriend(friendshipId); });
    });
  };

  // Pembantu untuk memeriksa status hubungan untuk tab Pencarian
  const getRelationshipStatus = (targetId: string) => {
    const rel = friendships.find(f => f.user_id === targetId || f.friend_id === targetId);
    if (!rel) return "none";
    if (rel.status === "accepted") return "friend";
    if (rel.status === "pending" && rel.user_id === currentUserId) return "outgoing";
    if (rel.status === "pending" && rel.friend_id === currentUserId) return "incoming";
    return "none";
  };

  const getRelationshipId = (targetId: string) => {
    const rel = friendships.find(f => f.user_id === targetId || f.friend_id === targetId);
    return rel?.id;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-10 bg-white/90 dark:bg-black/90 backdrop-blur-lg border-b border-gray-100 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Users className="w-5 h-5 text-[#1D9BF0]" /> Teman
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex px-2 pb-0 overflow-x-auto no-scrollbar">
          {[
            { id: "semua", label: "Semua Teman", badge: friendsList.length },
            { id: "permintaan", label: "Permintaan", badge: incomingRequests.length > 0 ? incomingRequests.length : null, badgeColor: "bg-red-500 text-white" },
            { id: "cari", label: "Cari Teman" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => { setViewTab(tab.id as any); setSearchQuery(""); }} className={`relative px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${viewTab === tab.id ? "text-[#1D9BF0]" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"}`}>
              {tab.label}
              {tab.badge !== undefined && tab.badge !== null && tab.badge > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${tab.badgeColor || "bg-gray-100 dark:bg-neutral-800 text-gray-500"}`}>{tab.badge}</span>
              )}
              {viewTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1D9BF0] rounded-t-full" />}
            </button>
          ))}
        </div>
      </header>

      {/* ─── CONTENT ─── */}
      <div className="flex-1 p-4 max-w-3xl mx-auto w-full">
        {/* Search Input */}
        {(viewTab === "semua" || viewTab === "cari") && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={viewTab === "cari" ? "Cari nama atau username..." : "Cari dalam daftar teman..."} className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0]/50 focus:border-[#1D9BF0] text-[15px] transition-all" />
            {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-full transition-colors"><X className="w-4 h-4 text-gray-400" /></button>}
          </div>
        )}

        {/* ─── TAB: SEMUA TEMAN ─── */}
        {viewTab === "semua" && (
          <div className="space-y-2">
            {filteredFriends.map((f) => (
              <div key={f.friendshipId} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors group">
                <Link href={`/profil/${f.profile.username}`} className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
                  {f.profile.avatar_url ? (
                    <img src={f.profile.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray-100 dark:border-neutral-800" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center text-sm font-bold uppercase flex-shrink-0 text-gray-500">{f.profile.full_name?.charAt(0) || "?"}</div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[15px] truncate">{f.profile.full_name}</h3>
                    <p className="text-[13px] text-gray-500 truncate">@{f.profile.username}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <Link href={`/pesan?user=${f.profile.id}`} className="p-2.5 bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-[#1D9BF0] hover:text-white dark:hover:bg-[#1D9BF0] transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleRemoveFriend(f.friendshipId, f.profile.full_name)} className="p-2.5 bg-gray-100 dark:bg-neutral-800 text-gray-400 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                    <UserMinus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {filteredFriends.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-4"><Users className="w-8 h-8 text-gray-300 dark:text-neutral-700" /></div>
                <p className="text-gray-500 font-medium text-[15px]">{searchQuery ? "Tidak ada teman yang cocok dengan pencarian." : "Anda belum memiliki teman."}</p>
                {!searchQuery && <button onClick={() => setViewTab("cari")} className="mt-4 px-5 py-2 bg-[#1D9BF0] text-white font-medium rounded-full text-sm hover:bg-[#1a8cd8] transition-colors">Cari Teman Baru</button>}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: PERMINTAAN ─── */}
        {viewTab === "permintaan" && (
          <div className="space-y-6">
            {/* Incoming Requests */}
            {incomingRequests.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Permintaan Masuk ({incomingRequests.length})</h2>
                <div className="space-y-2">
                  {incomingRequests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 shadow-sm">
                      <Link href={`/profil/${req.sender.username}`} className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
                        {req.sender.avatar_url ? (
                          <img src={req.sender.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center text-sm font-bold uppercase flex-shrink-0 text-gray-500">{req.sender.full_name?.charAt(0) || "?"}</div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-[15px] truncate">{req.sender.full_name}</h3>
                          <p className="text-[13px] text-gray-500 truncate">@{req.sender.username}</p>
                        </div>
                      </Link>
                      <div className="flex items-center gap-2">
                        <button disabled={isPending} onClick={() => handleAcceptRequest(req.id)} className="p-2.5 bg-[#1D9BF0] text-white rounded-full hover:bg-[#1a8cd8] transition-colors disabled:opacity-50"><Check className="w-4 h-4" /></button>
                        <button disabled={isPending} onClick={() => handleRejectRequest(req.id)} className="p-2.5 bg-gray-100 dark:bg-neutral-800 text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Outgoing Requests */}
            {outgoingRequests.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">Permintaan Terkirim ({outgoingRequests.length})</h2>
                <div className="space-y-2">
                  {outgoingRequests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50/50 dark:bg-neutral-900/30 border border-gray-100 dark:border-neutral-800/50">
                      <Link href={`/profil/${req.receiver.username}`} className="flex items-center gap-3 min-w-0 opacity-75 hover:opacity-100 transition-opacity">
                        {req.receiver.avatar_url ? (
                          <img src={req.receiver.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0 grayscale group-hover:grayscale-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-xs font-bold uppercase flex-shrink-0 text-gray-500">{req.receiver.full_name?.charAt(0) || "?"}</div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-[14px] truncate">{req.receiver.full_name}</h3>
                          <p className="text-[12px] text-gray-500 truncate">Menunggu Persetujuan</p>
                        </div>
                      </Link>
                      <button disabled={isPending} onClick={() => handleCancelRequest(req.id)} className="px-4 py-1.5 bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-gray-300 text-xs font-semibold rounded-full hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors disabled:opacity-50">Batal</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {incomingRequests.length === 0 && outgoingRequests.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-900 rounded-full flex items-center justify-center mb-4"><ShieldAlert className="w-8 h-8 text-gray-300 dark:text-neutral-700" /></div>
                <p className="text-gray-500 font-medium text-[15px]">Tidak ada permintaan pertemanan.</p>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: CARI TEMAN ─── */}
        {viewTab === "cari" && (
          <div className="space-y-2">
            {filteredSearch.map((p) => {
              const rel = getRelationshipStatus(p.id);
              const relId = getRelationshipId(p.id);
              return (
                <div key={p.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors group">
                  <Link href={`/profil/${p.username}`} className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
                    {p.avatar_url ? (
                      <img src={p.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-gray-100 dark:border-neutral-800" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-neutral-800 dark:to-neutral-700 flex items-center justify-center text-sm font-bold uppercase flex-shrink-0 text-gray-500">{p.full_name?.charAt(0) || "?"}</div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[15px] truncate">{p.full_name}</h3>
                      <p className="text-[13px] text-gray-500 truncate">@{p.username}</p>
                    </div>
                  </Link>
                  
                  {rel === "none" && (
                    <button disabled={isPending} onClick={() => handleSendRequest(p.id)} className="px-4 py-2 bg-[#1D9BF0]/10 text-[#1D9BF0] font-semibold text-sm rounded-full hover:bg-[#1D9BF0] hover:text-white transition-all disabled:opacity-50 flex items-center gap-1.5"><UserPlus className="w-4 h-4" />Tambah</button>
                  )}
                  {rel === "friend" && (
                    <span className="px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 text-gray-500 text-xs font-semibold rounded-full flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" />Teman</span>
                  )}
                  {rel === "outgoing" && (
                    <button disabled={isPending} onClick={() => relId && handleCancelRequest(relId)} className="px-3 py-1.5 bg-gray-100 dark:bg-neutral-800 text-gray-500 text-xs font-semibold rounded-full hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-colors disabled:opacity-50 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />Batal</button>
                  )}
                  {rel === "incoming" && (
                    <button disabled={isPending} onClick={() => relId && handleAcceptRequest(relId)} className="px-4 py-1.5 bg-[#1D9BF0] text-white font-semibold text-sm rounded-full hover:bg-[#1a8cd8] transition-colors disabled:opacity-50">Terima</button>
                  )}
                </div>
              );
            })}
            {filteredSearch.length === 0 && searchQuery && (
              <div className="py-20 text-center flex flex-col items-center">
                <p className="text-gray-500 font-medium text-[15px]">Tidak ada pengguna yang cocok dengan "{searchQuery}".</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
