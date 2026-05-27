import { VotingClient, type Proposal } from "@/components/VotingClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function VotingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/welcome");
  }

  // Fetch proposals
  const { data: proposalsData } = await supabase
    .from('proposals')
    .select('*')
    .order('created_at', { ascending: false });

  // Fetch all votes
  const { data: votesData } = await supabase
    .from('votes')
    .select('proposal_id, option, user_id');

  // Compile votes and check if current user has voted
  const userVotes: Record<string, string> = {}; // proposalId -> votedOption
  const proposals: Proposal[] = (proposalsData || []).map((p: any) => {
    const pVotes = (votesData || []).filter((v: any) => v.proposal_id === p.id);
    const voteCounts: Record<string, number> = {};
    
    pVotes.forEach((v: any) => {
      voteCounts[v.option] = (voteCounts[v.option] || 0) + 1;
      if (v.user_id === user.id) {
        userVotes[p.id] = v.option;
      }
    });

    return {
      id: p.id,
      title: p.title,
      description: p.description,
      options: p.options,
      status: p.status,
      votes: voteCounts
    };
  });

  return (
    <div className="flex flex-col min-h-screen">
      <VotingClient initialProposals={proposals} initialUserVotes={userVotes} currentUserId={user.id} />
    </div>
  );
}
