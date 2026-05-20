"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
  Search, Send, ArrowLeft, Plus, X, MessageCircle, Check, CheckCheck
} from "lucide-react";
import { sendMessage, markMessagesAsRead, searchUsers } from "@/app/pesan/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

interface UserProfile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string | null;
}

interface Conversation {
  user: UserProfile;
  lastMessage: Message;
  unreadCount: number;
}

interface MessagesClientProps {
  conversations: Conversation[];
  currentUserId: string;
  allMessages: Message[];
  initialChatUser?: UserProfile | null;
}

export function MessagesClient({ conversations, currentUserId, allMessages, initialChatUser }: MessagesClientProps) {
  const [activeChat, setActiveChat] = useState<UserProfile | null>(initialChatUser || null);
  const [messageText, setMessageText] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Dapatkan pesan untuk obrolan aktif
  const chatMessages = activeChat
    ? allMessages
        .filter(
          (m) =>
            (m.sender_id === currentUserId && m.receiver_id === activeChat.id) ||
            (m.sender_id === activeChat.id && m.receiver_id === currentUserId)
        )
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    : [];

  // Gulir ke bawah pada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  // Tandai pesan sudah dibaca saat membuka obrolan
  useEffect(() => {
    if (activeChat) {
      const hasUnread = chatMessages.some(
        (m) => m.sender_id === activeChat.id && !m.is_read
      );
      if (hasUnread) {
        startTransition(async () => {
          await markMessagesAsRead(activeChat.id);
          router.refresh();
        });
      }
      inputRef.current?.focus();
    }
  }, [activeChat?.id]);

  // Langganan waktu-nyata untuk pesan
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('dm-messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        () => { router.refresh(); }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [router]);

  // Pencarian pengguna dengan jeda
  useEffect(() => {
    if (!searchQuery.trim()) {
      // eslint-disable-next-line
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timeout = setTimeout(async () => {
      const results = await searchUsers(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleSend = () => {
    if (!activeChat || !messageText.trim()) return;
    const text = messageText;
    setMessageText("");
    startTransition(async () => {
      await sendMessage(activeChat.id, text);
      router.refresh();
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openChat = (user: UserProfile) => {
    setActiveChat(user);
    setShowNewChat(false);
    setSearchQuery("");
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Kemarin";
    if (diffDays < 7) return d.toLocaleDateString("id-ID", { weekday: "short" });
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  };

  // ============= TAMPILAN DAFTAR PERCAKAPAN =============
  const renderConversationList = () => (
    <>
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-bold">Pesan</h1>
          <button
            onClick={() => setShowNewChat(true)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-[#1D9BF0]"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </header>

      {conversations.length === 0 ? (
        <div className="flex flex-col flex-1 items-center justify-center p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-[#1D9BF0]/10 flex items-center justify-center mb-5">
            <MessageCircle className="w-10 h-10 text-[#1D9BF0]" />
          </div>
          <p className="text-lg font-semibold">Belum ada percakapan</p>
          <p className="text-gray-500 text-sm mt-1 max-w-xs">
            Mulai percakapan baru dengan warga sekitar dengan menekan tombol + di atas.
          </p>
          <button
            onClick={() => setShowNewChat(true)}
            className="mt-5 flex items-center gap-2 bg-[#1D9BF0] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1A8CD8] transition-colors"
          >
            <Plus className="w-4 h-4" />
            Pesan Baru
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          {conversations.map((conv) => (
            <button
              key={conv.user.id}
              onClick={() => openChat(conv.user)}
              className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors text-left border-b border-gray-100 dark:border-neutral-800/50"
            >
              {conv.user.avatar_url ? (
                <img src={conv.user.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1D9BF0] to-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {conv.user.full_name.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-[15px] truncate ${conv.unreadCount > 0 ? "" : "font-medium"}`}>
                    {conv.user.full_name}
                  </span>
                  <span className={`text-xs flex-shrink-0 ml-2 ${conv.unreadCount > 0 ? "text-[#1D9BF0] font-semibold" : "text-gray-400"}`}>
                    {formatTime(conv.lastMessage.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className={`text-sm truncate ${conv.unreadCount > 0 ? "text-gray-800 dark:text-gray-200 font-medium" : "text-gray-500 dark:text-neutral-400"}`}>
                    {conv.lastMessage.sender_id === currentUserId && (
                      <span className="text-gray-400 mr-1">
                        {conv.lastMessage.is_read ? <CheckCheck className="w-3.5 h-3.5 text-[#1D9BF0] inline" /> : <Check className="w-3.5 h-3.5 inline" />}
                      </span>
                    )}
                    {conv.lastMessage.content}
                  </p>
                  {conv.unreadCount > 0 && (
                    <span className="ml-2 min-w-[20px] h-5 bg-[#1D9BF0] text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1.5 flex-shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );

  // ============= TAMPILAN OBROLAN =============
  const renderChatView = () => (
    <>
      {/* Chat Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 px-3 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveChat(null)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Link href={`/profil/${activeChat!.username}`} className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
          {activeChat!.avatar_url ? (
            <img src={activeChat!.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1D9BF0] to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {activeChat!.full_name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-bold text-[15px] truncate">{activeChat!.full_name}</p>
            <p className="text-xs text-gray-500 truncate">@{activeChat!.username}</p>
          </div>
        </Link>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1D9BF0]/10 flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-[#1D9BF0]" />
            </div>
            <p className="text-gray-500 text-sm">Mulai percakapan dengan {activeChat!.full_name}</p>
          </div>
        )}
        {chatMessages.map((msg, i) => {
          const isMine = msg.sender_id === currentUserId;
          const showAvatar =
            !isMine &&
            (i === 0 || chatMessages[i - 1].sender_id !== msg.sender_id);

          return (
            <div key={msg.id} className={`flex ${isMine ? "justify-end" : "justify-start"} ${showAvatar && !isMine ? "mt-3" : "mt-0.5"}`}>
              {!isMine && showAvatar ? (
                activeChat!.avatar_url ? (
                  <img src={activeChat!.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover mr-2 mt-1 flex-shrink-0" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#1D9BF0] to-blue-600 flex items-center justify-center text-white font-bold text-[10px] mr-2 mt-1 flex-shrink-0">
                    {activeChat!.full_name.charAt(0)}
                  </div>
                )
              ) : !isMine ? (
                <div className="w-7 mr-2 flex-shrink-0" />
              ) : null}
              <div
                className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-[15px] leading-relaxed ${
                  isMine
                    ? "bg-[#1D9BF0] text-white rounded-br-md"
                    : "bg-gray-100 dark:bg-neutral-800 rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                <div className={`flex items-center justify-end gap-1 mt-0.5 ${isMine ? "text-white/60" : "text-gray-400"}`}>
                  <span className="text-[10px]">{formatTime(msg.created_at)}</span>
                  {isMine && (
                    msg.is_read
                      ? <CheckCheck className="w-3.5 h-3.5 text-white/80" />
                      : <Check className="w-3.5 h-3.5" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white dark:bg-black border-t border-gray-200 dark:border-neutral-800 px-3 py-3">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tulis pesan..."
            className="flex-1 px-4 py-2.5 rounded-full border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent focus:bg-white dark:focus:bg-neutral-800 transition-all text-[15px]"
          />
          <button
            onClick={handleSend}
            disabled={isPending || !messageText.trim()}
            className="p-2.5 bg-[#1D9BF0] text-white rounded-full hover:bg-[#1A8CD8] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </>
  );

  // ============= MODAL OBROLAN BARU =============
  const renderNewChatModal = () => (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewChat(false)} />
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 dark:border-neutral-800">
          <button onClick={() => setShowNewChat(false)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-lg">Pesan Baru</h2>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau username..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {isSearching && (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-[#1D9BF0] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!isSearching && searchQuery && searchResults.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <p className="text-gray-500 text-sm">Tidak ada pengguna ditemukan</p>
            </div>
          )}

          {searchResults.map((user) => (
            <button
              key={user.id}
              onClick={() => openChat(user)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors text-left"
            >
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
              ) : (
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#1D9BF0] to-blue-600 flex items-center justify-center text-white font-bold">
                  {user.full_name.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-[15px]">{user.full_name}</p>
                <p className="text-sm text-gray-500">@{user.username}</p>
              </div>
            </button>
          ))}

          {!searchQuery && (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <Search className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-gray-400 text-sm">Ketik nama atau username untuk memulai percakapan baru.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">
      {activeChat ? renderChatView() : renderConversationList()}
      {showNewChat && renderNewChatModal()}
    </div>
  );
}
