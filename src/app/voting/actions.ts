"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createProposal(title: string, description: string, options: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("proposals").insert({
    title,
    description,
    options,
    creator_id: user.id,
    status: "active"
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/voting");
}

export async function castVote(proposalId: string, option: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Upsert vote or insert
  const { error } = await supabase.from("votes").upsert({
    proposal_id: proposalId,
    user_id: user.id,
    option
  }, { onConflict: "proposal_id,user_id" });

  if (error) {
    throw new Error(error.message);
  }

  // Not revalidating here because we rely on realtime optimistic UI on client
  // but revalidating could ensure consistency on hard reload
  revalidatePath("/voting");
}
