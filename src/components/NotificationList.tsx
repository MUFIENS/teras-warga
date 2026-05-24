"use client";

import { Heart, MessageCircle, Repeat2, Bell, CheckCheck } from "lucide-react";
import { markNotificationRead, markAllNotificationsRead } from "@/app/actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

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
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkRead = (id: string) => {
    startTransition(async () => {
      await markNotificationRead(id);
      router.refresh();
    });
  };

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllNotificationsRead();
      router.refresh();
    });
  };

  return (
    <>
      <header className="sticky top-14 md:top-0 z-10 flex items-center justify-between px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
        <h1 className="text-xl font-bold">Notifikasi</h1>
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
      </header>

      {notifications.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">Belum ada notifikasi</p>
          <p className="text-gray-400 text-sm mt-1">Notifikasi akan muncul saat ada aktivitas pada postingan Anda.</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {notifications.map((notification) => (
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
                <span className="text-xs text-gray-400 mt-1 block">
                  {notification.timeAgo}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
