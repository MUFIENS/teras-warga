import { createClient } from "@/lib/supabase/server";
import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { RealtimeListener } from "@/components/RealtimeListener";
import { KasClient } from "@/components/KasClient";

export default async function Kas() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">
        <header className="sticky top-0 z-10 flex items-center px-4 h-14 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-neutral-800">
          <h1 className="text-xl font-bold">Iuran Kas</h1>
        </header>
        <div className="flex flex-1 items-center justify-center p-4">
          <p className="text-gray-500">Silakan login untuk melihat iuran kas.</p>
        </div>
      </div>
    );
  }

  const { data: transactions } = await supabase
    .from("kas_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const formattedTransactions = (transactions || []).map((tx: any) => ({
    ...tx,
    timeAgo: tx.created_at
      ? formatDistanceToNow(new Date(tx.created_at), { addSuffix: true, locale: localeId })
      : "Baru saja",
  }));

  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen border-r border-gray-200 dark:border-neutral-800">
      <RealtimeListener />
      <KasClient
        transactions={formattedTransactions}
        currentYear={currentYear}
      />
    </div>
  );
}
