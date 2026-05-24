"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import {
  Search, Send, ArrowLeft, Plus, X, MessageCircle, Check, CheckCheck, Package, User, ChevronLeft, ChevronDown,
  Paperclip, Camera, Mic, MapPin, Image as ImageIcon, FileText, Square, Play, Pause, Download, Map
} from "lucide-react";
import { sendMessage, markMessagesAsRead, searchUsers, deleteMessageForMe, deleteMessageForEveryone } from "@/app/pesan/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { usePresence } from "./providers/PresenceProvider";
import { CustomSwal as Swal } from "@/lib/swal";

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
  last_active?: string | null;
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
  initialProduct?: any | null;
}

function AvatarWithPresence({ user, className = "w-12 h-12" }: { user: UserProfile, className?: string }) {
  const { isOnline, lastActive } = usePresence(user.id, user.last_active || null);
  const isActuallyOnline = isOnline;
  let color = "bg-gray-300 dark:bg-neutral-600";
  if (isActuallyOnline) color = "bg-[#1D9BF0]";

  return (
    <div className="relative flex-shrink-0">
      {user.avatar_url ? (
        <img src={user.avatar_url} alt="" className={`${className} rounded-full object-cover`} />
      ) : (
        <div className={`${className} rounded-full bg-gradient-to-br from-[#1D9BF0] to-blue-600 flex items-center justify-center text-white font-bold text-lg`}>
          {user.full_name.charAt(0)}
        </div>
      )}
      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ${color} border-2 border-white dark:border-black`} />
    </div>
  );
}

export function MessagesClient({ conversations, currentUserId, allMessages, initialChatUser, initialProduct }: MessagesClientProps) {
  const [activeChat, setActiveChat] = useState<UserProfile | null>(initialChatUser || null);
  const [selectedProduct, setSelectedProduct] = useState<any>(initialProduct || null);
  const [messageText, setMessageText] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Attachment & Media State
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Voice Note State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reply & Delete State
  const [replyingTo, setReplyingTo] = useState<any | null>(null);
  const [messageMenuOpenId, setMessageMenuOpenId] = useState<string | null>(null);

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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length, isUploading]);

  useEffect(() => {
    if (activeChat) {
      const hasUnread = chatMessages.some(m => m.sender_id === activeChat.id && !m.is_read);
      if (hasUnread) {
        startTransition(async () => {
          await markMessagesAsRead(activeChat.id);
          router.refresh();
        });
      }
      inputRef.current?.focus();
    }
  }, [activeChat?.id]);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel('dm-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => { router.refresh(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [router]);

  useEffect(() => {
    if (!searchQuery.trim()) {
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

  // Clean up media recorder interval
  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, []);

  // --- Handlers ---

  const handleSend = () => {
    if (!activeChat || (!messageText.trim() && !selectedProduct)) return;
    let textToSend = messageText;
    
    if (selectedProduct) {
      textToSend = JSON.stringify({
        type: "product_card",
        id: selectedProduct.id,
        title: selectedProduct.title,
        price_idr: selectedProduct.price_idr,
        price_crypto: selectedProduct.price_crypto,
        image_url: selectedProduct.image_url,
        message: messageText.trim()
      });
      setSelectedProduct(null);
    } else if (replyingTo) {
      textToSend = JSON.stringify({
        type: "text",
        text: messageText.trim(),
        reply_to: { id: replyingTo.id, content: replyingTo.content, sender_id: replyingTo.sender_id }
      });
    }
    setMessageText("");
    setReplyingTo(null);

    startTransition(async () => {
      await sendMessage(activeChat.id, textToSend);
      router.refresh();
    });
  };

  const handleDeleteForMe = (id: string) => {
    setMessageMenuOpenId(null);
    startTransition(async () => {
      await deleteMessageForMe(id);
      router.refresh();
    });
  };

  const handleDeleteForEveryone = (id: string, createdAt: string) => {
    setMessageMenuOpenId(null);
    const timeDiff = Date.now() - new Date(createdAt).getTime();
    if (timeDiff > 2 * 60 * 60 * 1000) {
      Swal.fire("Gagal", "Pesan ini tidak bisa dihapus karena sudah lebih dari 2 jam", "error");
      return;
    }
    Swal.fire({
      title: "Hapus untuk semua orang?",
      text: "Pesan ini akan dihapus untuk Anda dan lawan bicara Anda.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal"
    }).then((result) => {
      if (result.isConfirmed) {
        startTransition(async () => {
          try {
            await deleteMessageForEveryone(id);
            router.refresh();
          } catch (e: any) {
            Swal.fire("Gagal", e.message, "error");
          }
        });
      }
    });
  };

  const uploadToStorage = async (file: File | Blob, ext: string): Promise<string | null> => {
    try {
      const supabase = createClient();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
      const contentType = file.type || 'application/octet-stream';
      
      const { data, error } = await supabase.storage
        .from('chat_attachments')
        .upload(fileName, file, { cacheControl: '3600', upsert: false, contentType });

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('chat_attachments')
        .getPublicUrl(data.path);
        
      return publicUrl;
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire("Gagal", "Gagal mengunggah file", "error");
      return null;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeChat) return;
    setShowAttachmentMenu(false);
    setIsUploading(true);

    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const ext = file.name.split('.').pop() || (isImage ? 'jpg' : isVideo ? 'mp4' : 'bin');

    const url = await uploadToStorage(file, ext);
    if (url) {
      const msgObj: any = {
        type: "attachment",
        mime_type: file.type,
        url: url,
        filename: file.name,
        size: file.size
      };
      if (replyingTo) {
        msgObj.reply_to = { id: replyingTo.id, content: replyingTo.content, sender_id: replyingTo.sender_id };
        setReplyingTo(null);
      }
      await sendMessage(activeChat.id, JSON.stringify(msgObj));
      router.refresh();
    }
    setIsUploading(false);
    if (e.target) e.target.value = '';
  };

  const handleLocation = () => {
    setShowAttachmentMenu(false);
    if (!navigator.geolocation) {
      Swal.fire("Error", "Browser Anda tidak mendukung lokasi", "error");
      return;
    }
    
    setIsUploading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const msgObj: any = {
          type: "location",
          lat: latitude,
          lng: longitude
        };
        if (replyingTo) {
          msgObj.reply_to = { id: replyingTo.id, content: replyingTo.content, sender_id: replyingTo.sender_id };
          setReplyingTo(null);
        }
        await sendMessage(activeChat!.id, JSON.stringify(msgObj));
        router.refresh();
        setIsUploading(false);
      },
      (err) => {
        setIsUploading(false);
        Swal.fire("Gagal", "Gagal mendapatkan lokasi", "error");
      }
    );
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.addEventListener('dataavailable', (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      });

      mediaRecorder.start(1000); // 1 detik timeslice
      setIsRecording(true);
      setRecordingDuration(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      Swal.fire("Error", "Izin mikrofon ditolak", "error");
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setIsRecording(false);
    setRecordingDuration(0);
    audioChunksRef.current = [];
  };

  const stopAndSendRecording = () => {
    if (!mediaRecorderRef.current || !activeChat) return;
    const mr = mediaRecorderRef.current;

    mr.addEventListener('stop', async () => {
      // Safely stop tracks after the recorder has finished flushing data
      mr.stream.getTracks().forEach(track => track.stop());
      
      setIsUploading(true);
      const mimeType = mr.mimeType || 'audio/webm';
      const ext = mimeType.includes('mp4') ? 'mp4' : mimeType.includes('ogg') ? 'ogg' : 'webm';
      
      const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
      const url = await uploadToStorage(audioBlob, ext);
      
      if (url) {
        const msgObj: any = {
          type: "voice_note",
          url: url,
          duration: recordingDuration
        };
        if (replyingTo) {
          msgObj.reply_to = { id: replyingTo.id, content: replyingTo.content, sender_id: replyingTo.sender_id };
          setReplyingTo(null);
        }
        await sendMessage(activeChat.id, JSON.stringify(msgObj));
        router.refresh();
      }
      setIsUploading(false);
      setRecordingDuration(0);
      audioChunksRef.current = [];
    });

    mr.stop();
    if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    setIsRecording(false);
  };

  const formatRecordingTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
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

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024, dm = 2, sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // ============= PREVIEW & LIST =============
  const renderPreview = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      if (parsed) {
        switch (parsed.type) {
          case "deleted": return `🚫 Pesan telah dihapus`;
          case "product_card": return `📦 ${parsed.title}`;
          case "voice_note": return `🎤 Pesan Suara (${formatRecordingTime(parsed.duration)})`;
          case "location": return `📍 Lokasi Dibagikan`;
          case "text": return parsed.text;
          case "attachment": 
            if (parsed.mime_type?.startsWith('image/')) return `📷 Foto`;
            if (parsed.mime_type?.startsWith('video/')) return `🎥 Video`;
            return `📄 ${parsed.filename || 'Dokumen'}`;
        }
      }
    } catch {
      // Normal text
    }
    return content;
  };

  const renderConversationList = () => (
    <>
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <div className="flex items-center justify-between px-4 h-14">
          <h1 className="text-xl font-bold">Pesan</h1>
          <button onClick={() => setShowNewChat(true)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-[#1D9BF0]">
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
          <p className="text-gray-500 text-sm mt-1 max-w-xs">Mulai percakapan baru dengan warga sekitar dengan menekan tombol + di atas.</p>
          <button onClick={() => setShowNewChat(true)} className="mt-5 flex items-center gap-2 bg-[#1D9BF0] text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-[#1A8CD8] transition-colors">
            <Plus className="w-4 h-4" /> Pesan Baru
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          {conversations.map((conv) => (
            <button key={conv.user.id} onClick={() => openChat(conv.user)} className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-neutral-900/50 transition-colors text-left border-b border-gray-100 dark:border-neutral-800/50">
              <AvatarWithPresence user={conv.user} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`font-semibold text-[15px] truncate ${conv.unreadCount > 0 ? "" : "font-medium"}`}>{conv.user.full_name}</span>
                  <span className={`text-xs flex-shrink-0 ml-2 ${conv.unreadCount > 0 ? "text-[#1D9BF0] font-semibold" : "text-gray-400"}`}>{formatTime(conv.lastMessage.created_at)}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className={`text-sm truncate ${conv.unreadCount > 0 ? "text-gray-800 dark:text-gray-200 font-medium" : "text-gray-500 dark:text-neutral-400"}`}>
                    {conv.lastMessage.sender_id === currentUserId && (
                      <span className="text-gray-400 mr-1">
                        {conv.lastMessage.is_read ? <CheckCheck className="w-3.5 h-3.5 text-[#1D9BF0] inline" /> : <Check className="w-3.5 h-3.5 inline" />}
                      </span>
                    )}
                    {renderPreview(conv.lastMessage.content)}
                  </p>
                  {conv.unreadCount > 0 && <span className="ml-2 min-w-[20px] h-5 bg-[#1D9BF0] text-white text-[11px] font-bold rounded-full flex items-center justify-center px-1.5 flex-shrink-0">{conv.unreadCount}</span>}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </>
  );

  // ============= TAMPILAN OBROLAN =============
  const renderMessageContent = (msg: Message, isMine: boolean) => {
    let parsed: any = null;
    try {
      parsed = JSON.parse(msg.content);
    } catch {}

    if (parsed?.type === "deleted") {
      return <p className={`italic text-[13px] flex items-center gap-1.5 ${isMine ? 'text-white/70' : 'text-gray-500'}`}>🚫 Pesan ini telah dihapus</p>;
    }

    const replyBox = parsed?.reply_to ? (
      <div onClick={() => document.getElementById(`msg-${parsed.reply_to.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
           className={`p-2 mb-1.5 rounded-lg border-l-4 cursor-pointer hover:opacity-80 transition-opacity ${isMine ? 'bg-black/10 border-white/50 text-white' : 'bg-[#1D9BF0]/10 border-[#1D9BF0] text-gray-800 dark:text-gray-200'}`}>
        <p className="font-bold text-[11px] mb-0.5 opacity-80">{parsed.reply_to.sender_id === currentUserId ? 'Anda' : activeChat?.full_name}</p>
        <p className="text-xs line-clamp-1 opacity-90">{renderPreview(parsed.reply_to.content)}</p>
      </div>
    ) : null;

    let contentEl = <p className="whitespace-pre-wrap break-words">{msg.content}</p>;

    if (parsed) {
      if (parsed.type === "text") {
        contentEl = <p className="whitespace-pre-wrap break-words">{parsed.text}</p>;
      } else if (parsed.type === "product_card") {
        contentEl = (
          <div className="flex flex-col gap-2">
            {parsed.message && <p className="whitespace-pre-wrap break-words">{parsed.message}</p>}
            <Link href={`/pasar/${parsed.id}`} className={`block rounded-xl overflow-hidden border ${isMine ? 'border-white/20 bg-white/10' : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900'} hover:opacity-90 transition-opacity`}>
              <div className="flex items-center gap-3 p-2">
                {parsed.image_url ? (
                  <img src={parsed.image_url} alt={parsed.title} className="w-16 h-16 object-cover rounded-lg" />
                ) : (
                  <div className="w-16 h-16 bg-black/5 rounded-lg flex items-center justify-center">
                    <Package className="w-6 h-6 opacity-50" />
                  </div>
                )}
                <div className="flex-1 min-w-0 pr-2">
                  <p className={`text-sm font-semibold truncate ${isMine ? 'text-white' : ''}`}>{parsed.title}</p>
                  <p className={`text-xs font-bold mt-1 ${isMine ? 'text-white' : 'text-[#1D9BF0]'}`}>Rp {parsed.price_idr?.toLocaleString("id-ID")}</p>
                </div>
              </div>
            </Link>
          </div>
        );
      } else if (parsed.type === "attachment") {
        const isImg = parsed.mime_type?.startsWith('image/');
        const isVid = parsed.mime_type?.startsWith('video/');
        
        if (isImg) {
          contentEl = (
            <a href={parsed.url} target="_blank" rel="noreferrer" className="block w-[200px] h-[200px] sm:w-[240px] sm:h-[240px]">
              <img src={parsed.url} alt="Attachment" className="w-full h-full object-cover rounded-xl" />
            </a>
          );
        } else if (isVid) {
          contentEl = (
            <video src={parsed.url} controls className="w-[200px] sm:w-[240px] rounded-xl bg-black" />
          );
        } else {
          contentEl = (
            <a href={parsed.url} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-3 rounded-xl border ${isMine ? 'border-white/20 bg-white/10 text-white' : 'border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800'} transition-opacity hover:opacity-80`}>
              <div className={`p-2 rounded-lg ${isMine ? 'bg-white/20' : 'bg-[#1D9BF0]/10 text-[#1D9BF0]'}`}>
                <FileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{parsed.filename}</p>
                <p className={`text-[10px] mt-0.5 ${isMine ? 'text-white/70' : 'text-gray-500'}`}>{formatBytes(parsed.size || 0)}</p>
              </div>
              <Download className="w-4 h-4 flex-shrink-0" />
            </a>
          );
        }
      } else if (parsed.type === "location") {
        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${parsed.lat},${parsed.lng}`;
        contentEl = (
          <div className="flex flex-col gap-1.5">
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="block relative w-[200px] sm:w-[240px] h-[120px] rounded-xl overflow-hidden bg-gray-200">
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-neutral-800">
                <Map className="w-8 h-8 text-gray-400" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-500 text-white p-2 rounded-full shadow-lg shadow-black/20">
                  <MapPin className="w-6 h-6" />
                </div>
              </div>
            </a>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className={`text-sm underline underline-offset-2 ${isMine ? 'text-white' : 'text-[#1D9BF0]'}`}>
              Buka di Google Maps
            </a>
          </div>
        );
      } else if (parsed.type === "voice_note") {
        contentEl = (
          <div className="flex flex-col gap-1 w-[200px] sm:w-[240px]">
            <audio controls src={parsed.url} className={`w-full h-10 ${isMine ? 'opacity-90 invert-0' : ''}`} style={{ filter: isMine ? 'drop-shadow(0 0 2px rgba(255,255,255,0.5))' : '' }} />
            <p className={`text-[10px] ${isMine ? 'text-white/70' : 'text-gray-500'}`}>{formatRecordingTime(parsed.duration)}</p>
          </div>
        );
      }
    }

    return (
      <div className="flex flex-col">
        {replyBox}
        {contentEl}
      </div>
    );
  };

  const renderChatView = () => (
    <>
      {/* Hidden file inputs */}
      <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
      <input type="file" accept="image/*,video/*" capture="environment" className="hidden" ref={cameraInputRef} onChange={handleFileUpload} />

      {/* Chat Header */}
      <header className="sticky top-0 z-10 flex items-center gap-3 px-3 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <button onClick={() => setActiveChat(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Link href={`/profil/${activeChat!.username}`} className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
          <AvatarWithPresence user={activeChat!} className="w-9 h-9" />
          <div className="min-w-0">
            <p className="font-bold text-[15px] truncate">{activeChat!.full_name}</p>
            <p className="text-xs text-gray-500 truncate">@{activeChat!.username}</p>
          </div>
        </Link>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1" onClick={() => setShowAttachmentMenu(false)}>
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
          const showAvatar = !isMine && (i === 0 || chatMessages[i - 1].sender_id !== msg.sender_id);
          const isAudioOrImg = msg.content.includes('"type":"voice_note"') || msg.content.includes('"mime_type":"image/');

          return (
            <div key={msg.id} id={`msg-${msg.id}`} className={`flex group ${isMine ? "justify-end" : "justify-start"} ${showAvatar && !isMine ? "mt-3" : "mt-0.5"}`}>
              
              {!isMine && showAvatar ? (
                <AvatarWithPresence user={activeChat!} className="w-7 h-7 mr-2 mt-1" />
              ) : !isMine ? (
                <div className="w-7 mr-2 flex-shrink-0" />
              ) : null}

              {/* Message Context Menu for My Message (Left side of bubble) */}
              {isMine && !msg.content.includes('"type":"deleted"') && (
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity mr-1 relative">
                  <button onClick={(e) => { e.stopPropagation(); setMessageMenuOpenId(messageMenuOpenId === msg.id ? null : msg.id); }} className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {messageMenuOpenId === msg.id && (
                    <div className="absolute top-full right-0 z-20 mt-1 w-48 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-lg py-1 text-sm font-medium">
                      <button onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); setMessageMenuOpenId(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800">Balas</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteForMe(msg.id); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800 text-red-500">Hapus untuk saya</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteForEveryone(msg.id, msg.created_at); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800 text-red-500">Hapus untuk semua</button>
                    </div>
                  )}
                </div>
              )}

              <div className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-[15px] leading-relaxed ${isMine ? "bg-[#1D9BF0] text-white rounded-br-md" : "bg-gray-100 dark:bg-neutral-800 rounded-bl-md"} ${isAudioOrImg ? 'p-1.5' : ''}`}>
                {renderMessageContent(msg, isMine)}
                <div className={`flex items-center justify-end gap-1 mt-0.5 ${isMine ? "text-white/60" : "text-gray-400"} ${isAudioOrImg ? 'px-2 pb-1' : ''}`}>
                  <span className="text-[10px]">{formatTime(msg.created_at)}</span>
                  {isMine && (msg.is_read ? <CheckCheck className="w-3.5 h-3.5 text-white/80" /> : <Check className="w-3.5 h-3.5" />)}
                </div>
              </div>

              {/* Message Context Menu for Other Message (Right side of bubble) */}
              {!isMine && !msg.content.includes('"type":"deleted"') && (
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity ml-1 relative">
                  <button onClick={(e) => { e.stopPropagation(); setMessageMenuOpenId(messageMenuOpenId === msg.id ? null : msg.id); }} className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full text-gray-400">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {messageMenuOpenId === msg.id && (
                    <div className="absolute top-full left-0 z-20 mt-1 w-48 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-lg py-1 text-sm font-medium">
                      <button onClick={(e) => { e.stopPropagation(); setReplyingTo(msg); setMessageMenuOpenId(null); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800">Balas</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDeleteForMe(msg.id); }} className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-neutral-800 text-red-500">Hapus untuk saya</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {isUploading && (
          <div className="flex justify-end mt-2">
            <div className="bg-[#1D9BF0] text-white/80 rounded-2xl rounded-br-md px-4 py-2 text-sm flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Mengirim...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 bg-white dark:bg-black border-t border-gray-200 dark:border-neutral-800 px-3 py-3 relative">
        {selectedProduct && (
          <div className="mb-3 relative rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 p-2 pr-10 flex items-center gap-3">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-2 right-2 p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-full text-gray-500">
              <X className="w-4 h-4" />
            </button>
            {selectedProduct.image_url ? (
              <img src={selectedProduct.image_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
            ) : <Package className="w-8 h-8 text-gray-400" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{selectedProduct.title}</p>
              <p className="text-xs text-[#1D9BF0] font-bold">Rp {selectedProduct.price_idr?.toLocaleString("id-ID")}</p>
            </div>
          </div>
        )}

        {replyingTo && (
          <div className="mb-3 relative rounded-xl border-l-4 border-l-[#1D9BF0] border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 p-2.5 pr-10">
            <button onClick={() => setReplyingTo(null)} className="absolute top-2 right-2 p-1 text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-full">
              <X className="w-4 h-4" />
            </button>
            <p className="font-bold text-[11px] text-[#1D9BF0] mb-0.5">{replyingTo.sender_id === currentUserId ? 'Membalas diri sendiri' : `Membalas ${activeChat?.full_name}`}</p>
            <p className="text-xs line-clamp-1 text-gray-600 dark:text-gray-300">{renderPreview(replyingTo.content)}</p>
          </div>
        )}

        {/* Attachment Popover */}
        {showAttachmentMenu && (
          <div className="absolute bottom-16 left-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-xl shadow-black/10 overflow-hidden w-48 z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left text-sm font-medium">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-2 rounded-full"><ImageIcon className="w-4 h-4" /></div>
              Galeri & File
            </button>
            <button onClick={handleLocation} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left text-sm font-medium border-t border-gray-100 dark:border-neutral-800">
              <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-2 rounded-full"><MapPin className="w-4 h-4" /></div>
              Lokasi Saya
            </button>
          </div>
        )}

        {isRecording ? (
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="flex items-center gap-2 text-red-500 font-semibold flex-1 animate-pulse">
              <Mic className="w-5 h-5" />
              {formatRecordingTime(recordingDuration)}
            </div>
            <button onClick={cancelRecording} className="p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
            <button onClick={stopAndSendRecording} className="p-2.5 bg-[#1D9BF0] text-white rounded-full shadow-lg shadow-blue-500/30 transition-transform active:scale-90">
              <Send className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex items-end gap-2">
            <button onClick={() => setShowAttachmentMenu(!showAttachmentMenu)} className={`p-2.5 rounded-full transition-colors ${showAttachmentMenu ? 'bg-gray-200 dark:bg-neutral-800 text-gray-900 dark:text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800'}`}>
              <Paperclip className="w-5 h-5" />
            </button>
            <button onClick={() => cameraInputRef.current?.click()} className="p-2.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors flex-shrink-0">
              <Camera className="w-5 h-5" />
            </button>
            <textarea
              value={messageText}
              onChange={(e) => {
                setMessageText(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
              }}
              placeholder="Tulis pesan..."
              rows={1}
              className="flex-1 py-2.5 px-4 rounded-2xl border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 focus:outline-none focus:ring-2 focus:ring-[#1D9BF0] resize-none overflow-y-auto min-h-[44px] max-h-[120px] text-[15px]"
            />
            {messageText.trim() || selectedProduct ? (
              <button onClick={handleSend} disabled={isPending} className="p-2.5 bg-[#1D9BF0] text-white rounded-full hover:bg-[#1A8CD8] transition-colors mb-0.5 shadow-sm">
                <Send className="w-5 h-5 ml-0.5" />
              </button>
            ) : (
              <button onClick={startRecording} className="p-2.5 bg-gray-100 text-gray-600 dark:bg-neutral-800 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors mb-0.5">
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );

  const renderNewChatModal = () => (
    // Same as before
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNewChat(false)} />
      <div className="relative bg-white dark:bg-neutral-900 rounded-2xl w-full max-w-md mx-4 shadow-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden max-h-[70vh] flex flex-col">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-200 dark:border-neutral-800">
          <button onClick={() => setShowNewChat(false)} className="p-1.5 hover:bg-gray-100 rounded-full"><X className="w-5 h-5" /></button>
          <h2 className="font-bold text-lg">Pesan Baru</h2>
        </div>
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau username..." autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800/50 focus:ring-2 focus:ring-[#1D9BF0] outline-none text-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {isSearching && <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#1D9BF0] border-t-transparent rounded-full animate-spin" /></div>}
          {!isSearching && searchQuery && searchResults.length === 0 && <div className="text-center py-8 text-gray-500 text-sm">Tidak ada pengguna ditemukan</div>}
          {searchResults.map((user) => (
            <button key={user.id} onClick={() => openChat(user)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800/50 text-left">
              <AvatarWithPresence user={user} className="w-11 h-11" />
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
