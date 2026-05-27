"use client";

import { Heart, MessageCircle, Repeat2, Bell, CheckCheck, Trash2 } from "lucide-react";
import { markNotificationRead, markAllNotificationsRead, deleteNotification, deleteAllNotifications } from "@/app/actions";
import { useTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";

interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  timeAgo: string;
  created_at: string;
}

function getNotificationIcon(title: string) {
  if (title.includes('Suka')) return <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />;
  if (title.includes('Repost')) return <Repeat2 className="w-5 h-5 text-green-500" />;
  if (title.includes('Komentar')) return <MessageCircle className="w-5 h-5 text-[#1D9BF0]" />;
  return <Bell className="w-5 h-5 text-[#1D9BF0]" />;
}

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  const [localNotifs, setLocalNotifs] = useState(notifications);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  useEffect(() => {
    setLocalNotifs(notifications);
  }, [notifications]);

  const unreadCount = localNotifs.filter(n => !n.is_read).length;

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      await markNotificationRead(id);
      router.refresh();
    });
  };

  const handleMarkAllRead = () => {
    // Optimistic UI
    setLocalNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    startTransition(async () => {
      await markAllNotificationsRead();
      router.refresh();
    });
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = await confirm({
      title: "Hapus Notifikasi?",
      description: "Notifikasi ini akan dihapus permanen.",
      confirmText: "Hapus",
      variant: "danger",
    });
    if (!ok) return;

    setLocalNotifs(prev => prev.filter(n => n.id !== id));
    startTransition(async () => {
      try {
        await deleteNotification(id);
        toast.success("Notifikasi dihapus");
      } catch (err) {
        toast.error("Gagal menghapus notifikasi");
      }
      router.refresh();
    });
  };

  const handleDeleteAll = async () => {
    const ok = await confirm({
      title: "Hapus Semua Notifikasi?",
      description: "Seluruh notifikasi Anda akan dihapus secara permanen.",
      confirmText: "Hapus Semua",
      variant: "danger",
    });
    if (!ok) return;

    setLocalNotifs([]);
    startTransition(async () => {
      try {
        await deleteAllNotifications();
        toast.success("Semua notifikasi dihapus");
      } catch (err) {
        toast.error("Gagal menghapus semua notifikasi");
      }
      router.refresh();
    });
  };

  return (
    <>
      <ConfirmDialog />
      <header className="sticky top-14 md:top-0 z-10 flex items-center justify-between px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold">Notifikasi</h1>
        <div className="flex items-center gap-4">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={isPending}
              className="flex items-center gap-1.5 text-sm text-[#1D9BF0] hover:text-[#1A8CD8] font-medium transition-colors disabled:opacity-50"
            >
              <CheckCheck className="w-4 h-4" />
              Tandai semua dibaca
            </button>
          )}
          {localNotifs.length > 0 && (
            <button
              onClick={handleDeleteAll}
              disabled={isPending}
              className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" />
              Hapus Semua
            </button>
          )}
        </div>
      </header>

      {localNotifs.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">Belum ada notifikasi</p>
          <p className="text-gray-400 text-sm mt-1">Notifikasi akan muncul saat ada aktivitas pada postingan Anda.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {localNotifs.map((notification) => (
            <div
              key={notification.id}
              onClick={() => !notification.is_read && handleMarkRead(notification.id)}
              className={`flex items-start gap-4 px-4 py-4 border-b border-gray-200 dark:border-neutral-800 transition-colors duration-200 ${
                notification.is_read
                  ? 'bg-transparent'
                  : 'bg-[#1D9BF0]/5 hover:bg-[#1D9BF0]/10 cursor-pointer'
              } ${isPending ? 'opacity-50' : ''}`}
            >
              <div className="flex-shrink-0 mt-0.5 w-10 h-10 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center">
                {getNotificationIcon(notification.title)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[15px] ${notification.is_read ? 'text-gray-600 dark:text-gray-400' : 'font-semibold'}`}>
                    {notification.title}
                  </span>
                  {!notification.is_read && (
                    <span className="w-2 h-2 rounded-full bg-[#1D9BF0] flex-shrink-0" />
                  )}
                </div>
                <p className={`text-[14px] mt-0.5 ${notification.is_read ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'}`}>
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">
                    {notification.timeAgo}
                  </span>
                  <button
                    onClick={(e) => handleDelete(notification.id, e)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Hapus Notifikasi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
