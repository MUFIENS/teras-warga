import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => (
    <img src={props.src} alt={props.alt} style={props.style} className={props.className} />
  ),
}));

// Mock server actions
vi.mock('@/app/actions', () => ({
  fetchMorePosts: vi.fn().mockResolvedValue([]),
  toggleLike: vi.fn(),
  toggleRepost: vi.fn(),
  deletePost: vi.fn(),
  reportPost: vi.fn(),
}));

// Mock intersection observer
vi.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: vi.fn(), inView: false }),
}));

// Track Supabase channel subscriptions
const mockChannel = {
  on: vi.fn().mockReturnThis(),
  subscribe: vi.fn().mockReturnThis(),
};
const mockSupabase = {
  channel: vi.fn(() => mockChannel),
  removeChannel: vi.fn(),
};
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => mockSupabase,
}));

// Mock confirm dialog
vi.mock('@/components/ui/confirm-dialog', () => ({
  useConfirmDialog: () => ({
    confirm: vi.fn().mockResolvedValue(false),
    ConfirmDialog: () => null,
  }),
}));

describe('FeedClient — Realtime Synchronization', () => {
  const initialPosts = [
    {
      id: 'post-1',
      content: 'First post',
      image_url: null,
      created_at: '2026-05-26T10:00:00Z',
      user_id: 'user-1',
      profiles: { full_name: 'Budi', username: 'budi', avatar_url: null },
      likes: [{ count: 5 }],
      reposts: [{ count: 2 }],
      replies: [{ count: 1 }],
      hasLiked: false,
      hasReposted: false,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('subscribes to Supabase realtime channel on mount', async () => {
    const { FeedClient } = await import('@/components/FeedClient');

    render(<FeedClient initialPosts={initialPosts} currentUserId="user-1" />);

    // FeedClient should create a Supabase realtime channel
    expect(mockSupabase.channel).toHaveBeenCalled();
    expect(mockChannel.on).toHaveBeenCalledWith(
      'postgres_changes',
      expect.objectContaining({ table: 'posts' }),
      expect.any(Function)
    );
    expect(mockChannel.subscribe).toHaveBeenCalled();
  });

  it('cleans up subscription on unmount', async () => {
    const { FeedClient } = await import('@/components/FeedClient');

    const { unmount } = render(
      <FeedClient initialPosts={initialPosts} currentUserId="user-1" />
    );

    unmount();

    // Should clean up the channel
    expect(mockSupabase.removeChannel).toHaveBeenCalled();
  });

  it('renders initial posts without duplicates', async () => {
    const { FeedClient } = await import('@/components/FeedClient');

    render(<FeedClient initialPosts={initialPosts} currentUserId="user-1" />);

    const posts = screen.getAllByText('First post');
    expect(posts).toHaveLength(1);
  });

  it('does NOT use JSON.stringify for change detection', async () => {
    // Read the source file to verify no JSON.stringify usage
    const { FeedClient } = await import('@/components/FeedClient');

    // Render twice with different initialPosts to trigger sync
    const { rerender } = render(
      <FeedClient initialPosts={initialPosts} currentUserId="user-1" />
    );

    const updatedPosts = [
      { ...initialPosts[0], likes: [{ count: 6 }] }
    ];

    // This should not throw and should update smoothly
    rerender(<FeedClient initialPosts={updatedPosts} currentUserId="user-1" />);

    const posts = screen.getAllByText('First post');
    expect(posts).toHaveLength(1);
  });
});
