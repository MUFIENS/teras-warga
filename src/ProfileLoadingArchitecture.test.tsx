import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ProfilLoading from "./app/profil/[username]/loading";

describe("Profile Loading Architecture", () => {
  it("renders an accurate structural skeleton without nesting generic bars", () => {
    render(<ProfilLoading />);
    
    // Harus ada cover & avatar skeleton spesifik (menggantikan struktur profil)
    expect(screen.getByTestId("profile-cover-skeleton")).toBeInTheDocument();
    expect(screen.getByTestId("profile-avatar-skeleton")).toBeInTheDocument();
    
    // Header actions (Edit / Message)
    expect(screen.getByTestId("profile-actions-skeleton")).toBeInTheDocument();
    
    // Bio & Name
    expect(screen.getByTestId("profile-info-skeleton")).toBeInTheDocument();
    
    // Stats (Posts, Friends, Market)
    expect(screen.getByTestId("profile-stats-skeleton")).toBeInTheDocument();
    
    // Tabs
    expect(screen.getByTestId("profile-tabs-skeleton")).toBeInTheDocument();
    
    // Content Feed Skeleton (minimal 1 post skeleton)
    expect(screen.getByTestId("profile-feed-skeleton")).toBeInTheDocument();
  });
});
