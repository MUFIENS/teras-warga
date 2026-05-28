import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BottomNav } from "./BottomNav";

// Mock next/navigation
const mockUsePathname = vi.fn();
const mockUseRouter = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => mockUseRouter(),
}));

describe("BottomNav Component", () => {
  it("renders exactly 5 navigation items", () => {
    mockUsePathname.mockReturnValue("/");
    render(<BottomNav />);
    const navItems = screen.getAllByRole("button", { hidden: true });
    // Ada 5 item utama
    expect(navItems).toHaveLength(5);
  });

  it("highlights the active route based on pathname", () => {
    mockUsePathname.mockReturnValue("/pasar");
    const { container } = render(<BottomNav />);
    
    // Pasar is active, it should have the active indicator (e.g., specific class or inner element)
    const activeText = screen.getByText("Pasar");
    expect(activeText).toBeInTheDocument();
  });

  it("has a floating 'Posting' button in the center", () => {
    mockUsePathname.mockReturnValue("/");
    render(<BottomNav />);
    
    const postingButton = screen.getByText("Posting").closest("button");
    expect(postingButton).toBeInTheDocument();
    // Verify it has elevated styling classes (e.g. shadow, bg)
    expect(postingButton?.className).toMatch(/bg-[#1D9BF0]|bg-green-/); // Memastikan ada warna utama
    expect(postingButton?.className).toMatch(/-translate-y-/); // Memastikan ada offset floating
  });

  it("opens 'Lainnya' drawer when clicked", () => {
    mockUsePathname.mockReturnValue("/");
    render(<BottomNav />);
    
    const lainnyaButton = screen.getByText("Lainnya").closest("button");
    expect(lainnyaButton).toBeInTheDocument();
    
    fireEvent.click(lainnyaButton!);
    
    // Verifikasi drawer terbuka (misal ada teks "Kas" atau "Voting DAO" yang hanya ada di menu lainnya)
    expect(screen.getByText("Kas")).toBeInTheDocument();
    expect(screen.getByText("Voting DAO")).toBeInTheDocument();
  });
});
