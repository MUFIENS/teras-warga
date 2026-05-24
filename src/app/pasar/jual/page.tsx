import { createClient } from "@/lib/supabase/server";
import { SellFormClient } from "@/components/pasar/SellFormClient";
import { redirect } from "next/navigation";

export default async function SellPage(props: { searchParams: Promise<{ edit?: string }> }) {
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/pasar/jual");
  }

  // Fetch the user's profile to prepopulate their crypto wallet if it exists
  const { data: profile } = await supabase
    .from("profiles")
    .select("crypto_wallet")
    .eq("id", user.id)
    .single();

  let initialProduct = null;
  if (searchParams?.edit) {
    const { data: prod } = await supabase
      .from("market_items")
      .select("*")
      .eq("id", searchParams.edit)
      .single();
    
    // Only allow editing if the user is the owner
    if (prod && prod.user_id === user.id) {
      initialProduct = prod;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 pb-20 lg:pb-10">
      <div className="max-w-3xl mx-auto">
        <SellFormClient 
          initialWallet={profile?.crypto_wallet || ""} 
          userId={user.id}
          initialData={initialProduct}
        />
      </div>
    </div>
  );
}
