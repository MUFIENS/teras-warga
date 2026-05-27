import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { VotingClient } from '@/components/VotingClient';
import { useAccount } from 'wagmi';

// Mock wagmi
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

// Mock ConnectButton
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <button data-testid="connect-btn">Connect Wallet</button>
}));

describe('VotingClient — Permission System', () => {
  const mockProposals = [
    {
      id: '1',
      title: 'Perbaikan Jalan Blok A',
      description: 'Proposal untuk mengaspal ulang jalan di Blok A.',
      options: ['Setuju', 'Tidak Setuju'],
      status: 'active' as const,
      votes: { 'Setuju': 45, 'Tidak Setuju': 12 }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders proposals correctly', () => {
    vi.mocked(useAccount).mockReturnValue({ isConnected: false } as any);

    render(<VotingClient proposals={mockProposals} />);
    
    expect(screen.getByText('Perbaikan Jalan Blok A')).toBeInTheDocument();
    expect(screen.getByText('Setuju')).toBeInTheDocument();
  });

  // ━━━ CRITICAL PERMISSION TEST ━━━
  // Voting should be available to ALL authenticated users,
  // NOT gated behind wallet connection.
  it('enables voting for authenticated users WITHOUT wallet connection', () => {
    vi.mocked(useAccount).mockReturnValue({ isConnected: false } as any);

    render(<VotingClient proposals={mockProposals} />);
    
    // Vote buttons should be ENABLED even without wallet
    // because auth is handled at page level (redirect in page.tsx)
    const voteButtons = screen.getAllByRole('button', { name: /Vote/i });
    voteButtons.forEach(btn => {
      expect(btn).not.toBeDisabled();
    });
  });

  it('does NOT show Lock icon when wallet is disconnected', () => {
    vi.mocked(useAccount).mockReturnValue({ isConnected: false } as any);

    render(<VotingClient proposals={mockProposals} />);
    
    // Should NOT show "Kunci" (Lock) text
    expect(screen.queryByText('Kunci')).not.toBeInTheDocument();
  });

  it('allows voting and marks as voted', () => {
    vi.mocked(useAccount).mockReturnValue({ isConnected: false } as any);

    render(<VotingClient proposals={mockProposals} />);
    
    const voteButtons = screen.getAllByRole('button', { name: /Vote/i });
    
    // Click the first vote button
    fireEvent.click(voteButtons[0]);
    
    // After voting, should show "Voted" text
    expect(screen.getAllByText('Voted').length).toBeGreaterThan(0);
  });

  it('disables buttons after user has voted on a proposal', () => {
    vi.mocked(useAccount).mockReturnValue({ isConnected: false } as any);

    render(<VotingClient proposals={mockProposals} />);
    
    const voteButtons = screen.getAllByRole('button', { name: /Vote/i });
    
    // Vote
    fireEvent.click(voteButtons[0]);
    
    // ALL buttons for this proposal should now be disabled
    const allButtons = screen.getAllByRole('button', { name: /Voted/i });
    allButtons.forEach(btn => {
      expect(btn).toBeDisabled();
    });
  });

  it('still enables voting when wallet IS connected', () => {
    vi.mocked(useAccount).mockReturnValue({ isConnected: true, address: '0x123' } as any);

    render(<VotingClient proposals={mockProposals} />);
    
    const voteButtons = screen.getAllByRole('button', { name: /Vote/i });
    voteButtons.forEach(btn => {
      expect(btn).not.toBeDisabled();
    });
  });
});
