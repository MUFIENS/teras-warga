import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { VotingClient } from '@/components/VotingClient';

// Mock wagmi
vi.mock('wagmi', () => ({
  useAccount: vi.fn(),
}));

// Mock ConnectButton
vi.mock('@rainbow-me/rainbowkit', () => ({
  ConnectButton: () => <button data-testid="connect-btn">Connect Wallet</button>
}));

describe('VotingClient Component', () => {
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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('wagmi').useAccount.mockReturnValue({ isConnected: false });

    render(<VotingClient proposals={mockProposals} />);
    
    expect(screen.getByText('Perbaikan Jalan Blok A')).toBeInTheDocument();
    expect(screen.getByText('Setuju')).toBeInTheDocument();
  });

  it('shows Connect Wallet button and disables voting when not connected', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('wagmi').useAccount.mockReturnValue({ isConnected: false });

    render(<VotingClient proposals={mockProposals} />);
    
    // Connect Wallet button should be visible
    expect(screen.getByTestId('connect-btn')).toBeInTheDocument();
    
    // Vote buttons should be disabled
    const voteButtons = screen.getAllByRole('button', { name: /Vote/i });
    voteButtons.forEach(btn => {
      expect(btn).toBeDisabled();
    });
  });

  it('enables voting buttons when wallet is connected', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('wagmi').useAccount.mockReturnValue({ isConnected: true, address: '0x123' });

    render(<VotingClient proposals={mockProposals} />);
    
    // Vote buttons should NOT be disabled
    const voteButtons = screen.getAllByRole('button', { name: /Vote/i });
    voteButtons.forEach(btn => {
      expect(btn).not.toBeDisabled();
    });
  });
});
