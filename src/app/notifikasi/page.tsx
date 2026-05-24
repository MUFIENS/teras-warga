import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { NotificationList } from "@/components/NotificationList";

export default async function Notifikasi() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">
        <header className="sticky top-14 md:top-0 z-10 flex items-center px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
          <h1 className="text-xl font-bold">Notifikasi</h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-gray-500">Silakan login untuk melihat notifikasi.</p>
        </div>
      </div>
    );
  }

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const formattedNotifications = (notifications || []).map((n: any) => ({
    ...n,
    timeAgo: n.created_at
      ? formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: localeId })
      : 'Baru saja',
  }));

  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">      <NotificationList notifications={formattedNotifications} />
    </div>
  );
}
