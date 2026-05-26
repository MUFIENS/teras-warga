import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { PostCard } from "./components/PostCard";
import React from "react";

// Mock router
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));

describe("Smooth Lazy Loading (Images)", () => {
  it("renders the image with priority (eager loading) if priority prop is true", () => {
    render(
      <PostCard
        id="post-1"
        name="Budi"
        username="budi"
        content="Halo"
        image_url="https://example.com/image.jpg"
        timestamp="1 jam yang lalu"
        priority={true}
      />
    );

    const image = screen.getByAltText("Post attachment");
    
    // next/image dengan priority akan memiliki fetchpriority="high"
    expect(image).toHaveAttribute("fetchpriority", "high");
  });
});
