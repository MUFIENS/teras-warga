import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Sidebar } from "./Sidebar";
import { BottomNav } from "./navigation/BottomNav";
import React from "react";

// Mock hooks and components
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));

// Mock ConfirmDialog to auto-confirm
vi.mock("@/components/ui/confirm-dialog", () => ({
  useConfirmDialog: () => ({
    confirm: vi.fn().mockResolvedValue(true),
    ConfirmDialog: () => <div data-testid="confirm-dialog" />
  })
}));

// Mock Supabase
const mockSignOut = vi.fn();
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: { signOut: mockSignOut }
  })
}));

// Mock Wagmi
const mockDisconnectAsync = vi.fn();
vi.mock("wagmi", () => ({
  useDisconnect: () => ({
    disconnectAsync: mockDisconnectAsync
  })
}));

// Mock RainbowKit
vi.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: {
    Custom: ({ children }: any) => children({
      account: null, chain: null, mounted: true, authenticationStatus: "unauthenticated"
    })
  }
}));

describe("Logout Wallet Disconnect Logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call disconnectAsync from wagmi when logging out via Sidebar", async () => {
    const mockProfile = { id: "1", username: "test", full_name: "Test", avatar_url: null, is_seller: false, last_active: null };
    render(<Sidebar profile={mockProfile} />);

    const logoutBtn = screen.getByText("Logout");
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(mockDisconnectAsync).toHaveBeenCalled();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });

  it("should call disconnectAsync from wagmi when logging out via BottomNav", async () => {
    const mockProfile = { id: "1", username: "test", full_name: "Test", avatar_url: null, is_seller: false, last_active: null };
    render(<BottomNav profile={mockProfile} />);

    // In BottomNav, logout is inside Drawer
    // Mocking drawer open and then clicking logout
    const menuBtn = screen.getByText("Lainnya");
    fireEvent.click(menuBtn);

    await waitFor(() => {
      const logoutBtn = screen.getByText("Keluar");
      fireEvent.click(logoutBtn);
    });

    await waitFor(() => {
      expect(mockDisconnectAsync).toHaveBeenCalled();
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
