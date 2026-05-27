"use client";

import { useState, useEffect, useTransition } from "react";
import { CheckCircle2, Vote, Plus, Loader2, X, Trash2 } from "lucide-react";
import { castVote, createProposal, deleteProposal } from "@/app/voting/actions";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useConfirmDialog } from "@/components/ui/confirm-dialog";

export interface Proposal {
  id: string;
  title: string;
  description: string;
  options: string[];
  status: "active" | "closed";
  creator_id: string;
  votes: Record<string, number>;
}

export function VotingClient({ 
  initialProposals, 
  initialUserVotes,
  currentUserId 
}: { 
  initialProposals: Proposal[];
  initialUserVotes: Record<string, string>;
  currentUserId: string;
}) {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [userVotes, setUserVotes] = useState<Record<string, string>>(initialUserVotes);
  const [isPending, startTransition] = useTransition();
  const { confirm, ConfirmDialog } = useConfirmDialog();
  
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newOptions, setNewOptions] = useState(["", ""]);

  // Sync with incoming server data if it changes due to server actions/revalidation
  useEffect(() => {
    setProposals(initialProposals);
    setUserVotes(initialUserVotes);
  }, [initialProposals, initialUserVotes]);

  // Realtime updates
  useEffect(() => {
    const supabase = createClient();
    
    // Listen for new votes
    const votesChannel = supabase.channel('votes_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' }, (payload) => {
        const newVote = payload.new;
        setProposals(prev => prev.map(p => {
          if (p.id === newVote.proposal_id) {
            const updatedVotes = { ...p.votes };
            updatedVotes[newVote.option] = (updatedVotes[newVote.option] || 0) + 1;
            return { ...p, votes: updatedVotes };
          }
          return p;
        }));
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'votes' }, (payload) => {
        const oldVote = payload.old;
        const newVote = payload.new;
        setProposals(prev => prev.map(p => {
          if (p.id === newVote.proposal_id) {
            const updatedVotes = { ...p.votes };
            // decrease old option
            if (updatedVotes[oldVote.option]) {
              updatedVotes[oldVote.option] = Math.max(0, updatedVotes[oldVote.option] - 1);
            }
            // increase new option
            updatedVotes[newVote.option] = (updatedVotes[newVote.option] || 0) + 1;
            return { ...p, votes: updatedVotes };
          }
          return p;
        }));
      })
      .subscribe();

    // Listen for new proposals
    const proposalsChannel = supabase.channel('proposals_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'proposals' }, (payload) => {
        const newP = payload.new;
        setProposals(prev => {
          if (prev.some(p => p.id === newP.id)) return prev;
          return [{
            id: newP.id,
            title: newP.title,
            description: newP.description,
            options: newP.options,
            status: newP.status,
            creator_id: newP.creator_id,
            votes: {}
          }, ...prev];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(votesChannel);
      supabase.removeChannel(proposalsChannel);
    };
  }, []);

  const handleVote = (proposalId: string, option: string) => {
    // Optimistic UI update
    setUserVotes(prev => ({ ...prev, [proposalId]: option }));
    setProposals(prev => prev.map(p => {
      if (p.id === proposalId) {
        const updatedVotes = { ...p.votes };
        // If user already voted for something else, decrement it locally
        const previousVote = userVotes[proposalId];
        if (previousVote && updatedVotes[previousVote] > 0) {
          updatedVotes[previousVote] -= 1;
        }
        updatedVotes[option] = (updatedVotes[option] || 0) + 1;
        return { ...p, votes: updatedVotes };
      }
      return p;
    }));

    startTransition(async () => {
      try {
        const res = await castVote(proposalId, option);
        if (!res.success) {
          toast.error(res.error || "Gagal memberikan suara.");
          // Rollback
          setUserVotes(prev => ({ ...prev, [proposalId]: userVotes[proposalId] || "" }));
          setProposals(prev => prev.map(p => p.id === proposalId ? proposals.find(op => op.id === proposalId) || p : p));
        }
      } catch (e) {
        console.error(e);
        toast.error("Terjadi kesalahan.");
        // Rollback
        setUserVotes(prev => ({ ...prev, [proposalId]: userVotes[proposalId] || "" }));
        setProposals(prev => prev.map(p => p.id === proposalId ? proposals.find(op => op.id === proposalId) || p : p));
      }
    });
  };

  const handleDelete = async (proposalId: string) => {
    const ok = await confirm({
      title: "Hapus Proposal?",
      description: "Proposal ini akan dihapus secara permanen beserta semua suara di dalamnya.",
      confirmText: "Hapus",
      variant: "danger",
    });
    if (!ok) return;
    
    // Optimistic UI update
    setProposals(prev => prev.filter(p => p.id !== proposalId));

    startTransition(async () => {
      try {
        const res = await deleteProposal(proposalId);
        if (res.success) {
          toast.success("Proposal berhasil dihapus!");
        } else {
          toast.error(res.error || "Gagal menghapus proposal.");
          // Rollback
          setProposals(prev => [...prev, proposals.find(p => p.id === proposalId)!].filter(Boolean));
        }
      } catch (e) {
        toast.error("Terjadi kesalahan.");
        console.error("Failed to delete proposal:", e);
        // Rollback
        setProposals(prev => [...prev, proposals.find(p => p.id === proposalId)!].filter(Boolean));
      }
    });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const validOptions = newOptions.filter(o => o.trim() !== "");
    if (newTitle.trim() === "" || newDesc.trim() === "" || validOptions.length < 2) {
      toast.error("Harap isi semua kolom dan minimal 2 opsi.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await createProposal(newTitle, newDesc, validOptions);
        if (res.success) {
          setShowCreate(false);
          setNewTitle("");
          setNewDesc("");
          setNewOptions(["", ""]);
          toast.success("Proposal baru berhasil dibuat!");
        } else {
          toast.error(res.error || "Gagal membuat proposal.");
        }
      } catch (e) {
        toast.error("Terjadi kesalahan.");
        console.error(e);
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8 w-full">
      <ConfirmDialog />
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistem Tata Kelola Warga</h1>
          <p className="text-gray-500 mt-1">Voting transparan berbasis komunitas.</p>
        </div>
        <button 
          onClick={() => setShowCreate(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1D9BF0] text-white rounded-full font-bold hover:bg-[#1A8CD8] transition-colors"
        >
          <Plus className="w-5 h-5" />
          Buat Proposal
        </button>
      </header>

      {/* Create Proposal Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreate(false)} />
          <div className="relative bg-white dark:bg-neutral-900 w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-neutral-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Buat Proposal Baru</h2>
              <button onClick={() => setShowCreate(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Judul Proposal</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-xl bg-transparent focus:outline-none focus:border-[#1D9BF0]"
                  placeholder="Contoh: Perbaikan Jalan"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-xl bg-transparent focus:outline-none focus:border-[#1D9BF0]"
                  rows={3}
                  placeholder="Detail lengkap..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Opsi Voting</label>
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input 
                      type="text" 
                      value={opt}
                      onChange={(e) => {
                        const no = [...newOptions];
                        no[i] = e.target.value;
                        setNewOptions(no);
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-xl bg-transparent focus:outline-none focus:border-[#1D9BF0]"
                      placeholder={`Opsi ${i + 1}`}
                      required={i < 2}
                    />
                    {i >= 2 && (
                      <button 
                        type="button" 
                        onClick={() => setNewOptions(newOptions.filter((_, idx) => idx !== i))}
                        className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                {newOptions.length < 5 && (
                  <button 
                    type="button" 
                    onClick={() => setNewOptions([...newOptions, ""])}
                    className="text-sm font-semibold text-[#1D9BF0] hover:underline"
                  >
                    + Tambah Opsi
                  </button>
                )}
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full py-3 mt-4 bg-[#1D9BF0] text-white rounded-full font-bold hover:bg-[#1A8CD8] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Buat Proposal
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {proposals.length === 0 ? (
          <div className="text-center py-10 text-gray-500">Belum ada proposal saat ini.</div>
        ) : proposals.map(proposal => {
          const totalVotes = Object.values(proposal.votes).reduce((a, b) => a + b, 0);

          return (
            <div key={proposal.id} className="bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{proposal.title}</h2>
                  <p className="text-gray-500 mt-1 text-sm whitespace-pre-wrap">{proposal.description}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Aktif
                  </span>
                  {currentUserId === proposal.creator_id && (
                    <button
                      onClick={() => handleDelete(proposal.id)}
                      disabled={isPending}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      title="Hapus Proposal"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3 mt-6">
                {proposal.options.map((option, i) => {
                  const voteCount = proposal.votes[option] || 0;
                  const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
                  const isVotedByMe = userVotes[proposal.id] === option;
                  
                  return (
                    <div key={`${proposal.id}-${option}-${i}`} className="relative group">
                      <div className="absolute inset-0 bg-gray-100 dark:bg-neutral-800 rounded-xl overflow-hidden">
                        <div 
                          className="h-full bg-[#1D9BF0]/20 transition-all duration-1000 ease-out" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      
                      <div className={`relative flex items-center justify-between p-4 rounded-xl border transition-colors ${isVotedByMe ? 'border-[#1D9BF0] bg-[#1D9BF0]/5' : 'border-transparent group-hover:border-[#1D9BF0]/30'}`}>
                        <span className={`font-medium z-10 ${isVotedByMe ? 'text-[#1D9BF0]' : ''}`}>{option}</span>
                        
                        <div className="flex items-center gap-4 z-10">
                          <span className={`text-sm font-semibold ${isVotedByMe ? 'text-[#1D9BF0]' : 'text-gray-500'}`}>
                            {percentage}% ({voteCount} suara)
                          </span>
                          
                          <button
                            onClick={() => handleVote(proposal.id, option)}
                            disabled={isVotedByMe}
                            aria-label={`Vote ${option}`}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                              isVotedByMe 
                                ? 'bg-[#1D9BF0] text-white' 
                                : 'bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800'
                            }`}
                          >
                            {isVotedByMe ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-white" />
                                <span className="hidden sm:inline">Voted</span>
                              </>
                            ) : (
                              <>
                                <Vote className="w-4 h-4" />
                                <span className="hidden sm:inline">Vote</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
