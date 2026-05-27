"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/lib/types";

export async function createProposal(title: string, description: string, options: string[]): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase.from("proposals").insert({
      title,
      description,
      options,
      creator_id: user.id,
      status: "active"
    });

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/voting");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to create proposal" };
  }
}

export async function castVote(proposalId: string, option: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    // Upsert vote or insert
    const { error } = await supabase.from("votes").upsert({
      proposal_id: proposalId,
      user_id: user.id,
      option
    }, { onConflict: "proposal_id,user_id" });

    if (error) {
      return { success: false, error: error.message };
    }

    // Not revalidating here because we rely on realtime optimistic UI on client
    // but revalidating could ensure consistency on hard reload
    revalidatePath("/voting");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to cast vote" };
  }
}

export async function deleteProposal(proposalId: string): Promise<ActionResponse> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, error: "Unauthorized" };

    const { data, error } = await supabase
      .from("proposals")
      .delete()
      .eq("id", proposalId)
      .eq("creator_id", user.id)
      .select(); // ensure only creator can delete

    if (error) {
      return { success: false, error: error.message };
    }
    
    if (!data || data.length === 0) {
      return { success: false, error: "Gagal menghapus (Mungkin Anda bukan pembuatnya atau akses ditolak oleh RLS)" };
    }

    revalidatePath("/voting");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete proposal" };
  }
}
