import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ProfilClient } from "./components/ProfilClient";
import React from "react";

// Mock router
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe("Profile Privacy & Wallet Exposure", () => {
  it("does not render crypto_wallet on public profile view", () => {
    const mockProfile = {
      id: "user-2",
      username: "budi",
      full_name: "Budi Santoso",
      bio: "Halo dunia",
      avatar_url: null,
      cover_url: null,
      role: "user",
      account_status: "verified",
      points: 100,
      is_seller: true,
      crypto_wallet: "0x1234567890abcdef1234567890abcdef12345678",
      last_active: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    render(
      <ProfilClient
        profile={mockProfile}
        isOwnProfile={false}
        currentUserId="user-1"
        relationship={null}
        stats={{ posts: 0, friends: 0, market: 0 }}
        posts={[]}
        marketItems={[]}
        friendships={[]}
      />
    );

    // Buka tab "Tentang"
    const aboutTab = screen.getByText("Tentang");
    aboutTab.click();

    // DOM seharusnya tidak menampilkan teks Crypto Wallet atau alamat dompetnya
    const walletLabel = screen.queryByText("Crypto Wallet");
    const walletAddress = screen.queryByText("0x1234567890abcdef1234567890abcdef12345678");

    expect(walletLabel).not.toBeInTheDocument();
    expect(walletAddress).not.toBeInTheDocument();
  });
});
