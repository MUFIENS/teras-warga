"use client";

import { useState } from "react";

import { useAccount } from "wagmi";
import { CheckCircle2, Lock, Vote } from "lucide-react";

export interface Proposal {
  id: string;
  title: string;
  description: string;
  options: string[];
  status: "active" | "closed";
  votes: Record<string, number>;
}

export function VotingClient({ proposals }: { proposals: Proposal[] }) {
  const { isConnected } = useAccount();
  const [hasVoted, setHasVoted] = useState<Record<string, boolean>>({});

  const handleVote = (proposalId: string, option: string) => {
    // Simulasi vote
    setHasVoted(prev => ({ ...prev, [proposalId]: true }));
    // Di aplikasi nyata, ini akan berinteraksi dengan smart contract.
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sistem Tata Kelola Warga</h1>
          <p className="text-gray-500 mt-1">Voting transparan berbasis desentralisasi (DAO).</p>
        </div>
      </header>

      <div className="grid gap-6">
        {proposals.map(proposal => {
          const totalVotes = Object.values(proposal.votes).reduce((a, b) => a + b, 0);

          return (
            <div key={proposal.id} className="bg-white dark:bg-[#050505] border border-gray-200 dark:border-white/5 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{proposal.title}</h2>
                  <p className="text-gray-500 mt-1 text-sm">{proposal.description}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Aktif
                </span>
              </div>

              <div className="space-y-3 mt-6">
                {proposal.options.map(option => {
                  const voteCount = proposal.votes[option] || 0;
                  const percentage = totalVotes === 0 ? 0 : Math.round((voteCount / totalVotes) * 100);
                  
                  return (
                    <div key={option} className="relative group">
                      <div className="absolute inset-0 bg-gray-100 dark:bg-neutral-800 rounded-xl overflow-hidden">
                        <div 
                          className="h-full bg-[#1D9BF0]/10 dark:bg-[#1D9BF0]/20 transition-all duration-1000 ease-out" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      
                      <div className="relative flex items-center justify-between p-4 rounded-xl border border-transparent group-hover:border-[#1D9BF0]/30 transition-colors">
                        <span className="font-medium z-10">{option}</span>
                        
                        <div className="flex items-center gap-4 z-10">
                          <span className="text-sm font-semibold text-gray-500">{percentage}%</span>
                          
                          <button
                            onClick={() => handleVote(proposal.id, option)}
                            disabled={!isConnected || hasVoted[proposal.id]}
                            aria-label={`Vote ${option}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {hasVoted[proposal.id] ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : !isConnected ? (
                              <Lock className="w-4 h-4 text-gray-400" />
                            ) : (
                              <Vote className="w-4 h-4" />
                            )}
                            <span className="hidden sm:inline">
                               {hasVoted[proposal.id] ? "Voted" : !isConnected ? "Kunci" : "Vote"}
                            </span>
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
