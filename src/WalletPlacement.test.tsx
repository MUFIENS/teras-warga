import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MarketplaceClient } from "./components/MarketplaceClient";
import React from "react";

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver;

// Mock useRouter
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

// Mock wagmi & rainbowkit
vi.mock("wagmi", () => ({
  useAccount: () => ({ isConnected: false }),
}));

vi.mock("@rainbow-me/rainbowkit", () => ({
  ConnectButton: () => <button data-testid="connect-wallet-btn">Hubungkan Dompet</button>,
}));

describe("Wallet Button Placement", () => {
  it("renders Connect Wallet button in Marketplace header when not connected", () => {
    render(<MarketplaceClient items={[]} currentUserId="user-1" />);

    // Harus ada tombol Connect Wallet di header Pasar
    const connectBtn = screen.getByTestId("connect-wallet-btn");
    expect(connectBtn).toBeInTheDocument();
  });
});
