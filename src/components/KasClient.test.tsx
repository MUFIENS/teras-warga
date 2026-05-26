import { render, screen, fireEvent } from '@testing-library/react';
import { KasClient } from '@/components/KasClient';
import { vi, describe, it, expect } from 'vitest';

// Mock router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  })
}));

// Mock wagmi
vi.mock('wagmi', () => ({
  useAccount: () => ({ isConnected: false, address: undefined }),
  useSendTransaction: () => ({
    data: null,
    sendTransaction: vi.fn(),
    isPending: false
  }),
  useWaitForTransactionReceipt: () => ({
    isLoading: false,
    isSuccess: false
  })
}));

// Mock action
vi.mock('@/app/kas/actions', () => ({
  submitKasPayment: vi.fn()
}));

const mockTransactions = [
  {
    id: "1",
    month_paid: "Januari",
    year_paid: 2026,
    amount: 50000,
    proof_url: "url",
    status: "verified" as const,
    created_at: new Date().toISOString(),
    timeAgo: "1 hari lalu"
  }
];

describe('KasClient Component', () => {
  it('renders kas summary correctly', () => {
    render(<KasClient transactions={mockTransactions} currentYear={2026} />);
    
    // Check if the verified transaction count is 1
    expect(screen.getByText('1')).toBeInTheDocument();
    // Check total paid (Rp 50.000)
    expect(screen.getByText('Rp 50.000')).toBeInTheDocument();
  });

  it('opens payment modal on unpaid month click', () => {
    render(<KasClient transactions={mockTransactions} currentYear={2026} />);
    
    // Februari is unpaid
    const febButton = screen.getByText('Februari').closest('button');
    expect(febButton).not.toBeDisabled();
    
    if (febButton) {
      fireEvent.click(febButton);
    }
    
    // Check if modal opens by searching for the "Bayar Iuran Kas" text
    expect(screen.getByText('Bayar Iuran Kas')).toBeInTheDocument();
    
    // Check if Web3 tab is present
    expect(screen.getByText(/Web3 Kripto/i)).toBeInTheDocument();
  });
});
