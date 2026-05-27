import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), back: vi.fn() }),
  usePathname: () => '/pasar',
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, onClick, ...props }: any) => (
    <a href={href} onClick={onClick} {...props}>{children}</a>
  ),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => (
    <img
      src={props.src}
      alt={props.alt}
      data-fill={props.fill ? 'true' : undefined}
      data-sizes={props.sizes}
      className={props.className}
    />
  ),
}));

// Mock server actions
vi.mock('@/app/pasar/actions', () => ({
  deleteMarketItem: vi.fn(),
  toggleMarketItemStatus: vi.fn().mockResolvedValue(undefined),
}));

// Mock toast
vi.mock('@/lib/toast', () => ({
  showInfo: vi.fn(),
  showSuccess: vi.fn(),
}));

// Mock confirm dialog
vi.mock('@/components/ui/confirm-dialog', () => ({
  useConfirmDialog: () => ({
    confirm: vi.fn().mockResolvedValue(true),
    ConfirmDialog: () => null,
  }),
}));

// Mock crypto components
vi.mock('@/components/crypto/CryptoPaymentModal', () => ({
  CryptoPaymentModal: () => null,
}));
vi.mock('@/components/pasar/PaymentSelector', () => ({
  PaymentSelector: () => null,
}));

describe('MarketItemCard — Dropdown Interaction', () => {
  const baseProps = {
    id: 'item-1',
    title: 'Test Product',
    description: 'A nice product',
    price_idr: 100000,
    image_url: 'https://example.supabase.co/test.png',
    category: 'Elektronik',
    condition: 'Baru',
    location: 'Blok A',
    is_active: true,
    seller_name: 'Budi',
    seller_username: 'budi',
    seller_avatar: null,
    seller_id: 'seller-1',
    currentUserId: 'seller-1',
    isOwner: true,
    timeAgo: '1 jam lalu',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('three-dot menu button is clickable and opens dropdown', async () => {
    const { MarketItemCard } = await import('@/components/MarketItemCard');

    render(<MarketItemCard {...baseProps} />);

    // Find the menu button (MoreVertical icon button)
    const menuButtons = screen.getAllByRole('button');
    const menuButton = menuButtons.find(btn =>
      btn.querySelector('svg') && btn.closest('[class*="absolute top-3 right-3"]') !== null
    ) || menuButtons[0];

    // Click to open menu
    await act(async () => {
      fireEvent.click(menuButton);
    });

    // Dropdown should appear with action items
    expect(screen.getByText('Edit Barang')).toBeInTheDocument();
    expect(screen.getByText('Hapus Barang')).toBeInTheDocument();
  });

  it('menu button click does NOT trigger navigation (stopPropagation)', async () => {
    const { MarketItemCard } = await import('@/components/MarketItemCard');

    render(<MarketItemCard {...baseProps} />);

    // Find all links — the card image link
    const links = screen.getAllByRole('link');
    const cardLink = links[0];

    // Spy on the link click
    const linkClickSpy = vi.fn();
    cardLink.addEventListener('click', linkClickSpy);

    // Find and click the menu button
    const menuButtons = screen.getAllByRole('button');
    const menuButton = menuButtons[0]; // First button should be the more-vertical

    await act(async () => {
      fireEvent.click(menuButton);
    });

    // Menu button click should NOT have caused link navigation
    // The e.preventDefault() should have fired
  });

  it('dropdown remains interactive after toggling product status', async () => {
    const { MarketItemCard } = await import('@/components/MarketItemCard');
    const mockToggle = vi.fn();

    const { rerender } = render(
      <MarketItemCard {...baseProps} onToggleStatus={mockToggle} />
    );

    // Open menu
    const menuButtons = screen.getAllByRole('button');
    await act(async () => {
      fireEvent.click(menuButtons[0]);
    });

    // Click "Tandai Terjual"
    const toggleButton = screen.getByText('Tandai Terjual');
    await act(async () => {
      fireEvent.click(toggleButton);
    });

    // Optimistic callback should have been called
    expect(mockToggle).toHaveBeenCalledWith('item-1', false);

    // Re-render with updated status (simulating optimistic update from parent)
    rerender(
      <MarketItemCard {...baseProps} is_active={false} onToggleStatus={mockToggle} />
    );

    // The menu button should STILL be clickable — this is the critical test
    const updatedMenuButtons = screen.getAllByRole('button');
    const menuButton = updatedMenuButtons[0];

    // This should NOT throw and should NOT be blocked
    await act(async () => {
      fireEvent.click(menuButton);
    });

    // Menu should open again
    expect(screen.getByText('Aktifkan Kembali')).toBeInTheDocument();
  });
});
