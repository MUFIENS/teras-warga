import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
}));

// Mock next/image to inspect props
vi.mock('next/image', () => ({
  default: (props: any) => {
    // Render as img with all relevant props for inspection
    return (
      <img
        data-testid={props['data-testid'] || 'next-image'}
        src={props.src}
        alt={props.alt}
        data-fill={props.fill ? 'true' : undefined}
        data-sizes={props.sizes}
        data-priority={props.priority ? 'true' : undefined}
        data-unoptimized={props.unoptimized ? 'true' : undefined}
        style={props.style}
        className={props.className}
        fetchPriority={props.priority ? 'high' : undefined}
        width={props.width}
        height={props.height}
      />
    );
  },
}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// IMAGE OPTIMIZATION TESTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe('Image Optimization — MarketItemCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('includes sizes prop when using fill layout', async () => {
    const { MarketItemCard } = await import('@/components/MarketItemCard');

    render(
      <MarketItemCard
        id="item-1"
        title="Test Item"
        description="A test item"
        price_idr={100000}
        image_url="https://example.supabase.co/storage/v1/object/public/test.png"
        category="Elektronik"
        condition="Baru"
        location="Blok A"
        is_active={true}
        seller_name="Budi"
        seller_username="budi"
        seller_avatar={null}
        seller_id="seller-1"
        currentUserId="user-1"
        isOwner={false}
        timeAgo="1 jam lalu"
        priority={true}
      />
    );

    const images = screen.getAllByTestId('next-image');
    const fillImages = images.filter(img => img.getAttribute('data-fill') === 'true');

    // Every fill image MUST have a sizes prop
    fillImages.forEach(img => {
      expect(img.getAttribute('data-sizes')).toBeTruthy();
    });
  });

  it('does NOT use loading="lazy" on seller avatar', async () => {
    const { MarketItemCard } = await import('@/components/MarketItemCard');

    render(
      <MarketItemCard
        id="item-2"
        title="Test Item 2"
        description="Another test"
        price_idr={50000}
        image_url={null}
        category="Pakaian"
        condition="Bekas"
        location={null}
        is_active={true}
        seller_name="Rina"
        seller_username="rina"
        seller_avatar="https://example.supabase.co/avatar.png"
        seller_id="seller-2"
        currentUserId="user-1"
        isOwner={false}
        timeAgo="2 jam lalu"
      />
    );

    // Find the seller avatar <img> (not next/image, it's a raw <img>)
    const sellerAvatar = screen.getByAltText('Rina');
    // It should NOT have loading="lazy"
    expect(sellerAvatar.getAttribute('loading')).not.toBe('lazy');
  });
});

describe('Image Optimization — Avatar Component', () => {
  it('does NOT use loading="lazy" on avatar images', async () => {
    const { Avatar } = await import('@/components/ui/avatar');

    render(<Avatar src="https://example.supabase.co/avatar.png" alt="Test User" />);

    const img = screen.getByAltText('Test User');
    // Avatar images should NOT be lazy loaded
    expect(img.getAttribute('loading')).not.toBe('lazy');
  });
});

describe('Image Optimization — PostCard', () => {
  it('renders images with proper style attributes for aspect ratio', async () => {
    const { PostCard } = await import('@/components/PostCard');

    render(
      <PostCard
        id="post-1"
        name="Budi"
        username="budi"
        content="Hello world"
        image_url="https://example.supabase.co/storage/v1/object/public/test.png"
        timestamp="1 jam lalu"
        priority={true}
      />
    );

    const img = screen.getByAltText('Post attachment');
    // Should have inline style for width/height to prevent aspect ratio warning
    expect(img.style.width).toBe('100%');
    expect(img.style.height).toBe('auto');
  });

  it('uses priority for above-the-fold posts', async () => {
    const { PostCard } = await import('@/components/PostCard');

    render(
      <PostCard
        id="post-2"
        name="Andi"
        username="andi"
        content="Priority post"
        image_url="https://example.supabase.co/storage/v1/object/public/test2.png"
        timestamp="2 jam lalu"
        priority={true}
      />
    );

    const img = screen.getByAltText('Post attachment');
    expect(img.getAttribute('fetchpriority')).toBe('high');
  });
});
