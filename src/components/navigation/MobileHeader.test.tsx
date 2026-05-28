import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MobileHeader } from "./MobileHeader";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("MobileHeader Component", () => {
  it("renders correctly with logo and text", () => {
    render(<MobileHeader />);
    expect(screen.getByText("Teras Warga")).toBeInTheDocument();
  });

  it("is hidden on medium screens (md:hidden)", () => {
    const { container } = render(<MobileHeader />);
    const header = container.querySelector("header");
    expect(header?.className).toMatch(/md:hidden/);
  });
});
