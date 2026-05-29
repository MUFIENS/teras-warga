import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateCryptoWallet } from "./actions";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Mock Supabase Server Client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("updateCryptoWallet Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should prevent a user from using a wallet that is already registered by another user", async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            neq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: "user-2" } }), // Simulate another user has this wallet
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    };
    (createClient as any).mockReturnValue(mockSupabase);

    await expect(updateCryptoWallet("0x123")).rejects.toThrowError("Wallet sudah digunakan oleh akun lain");
  });

  it("should allow a user to update their wallet if it is not used by others", async () => {
    const mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: "user-1" } } }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            neq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null }), // No other user has this wallet
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    };
    (createClient as any).mockReturnValue(mockSupabase);

    await expect(updateCryptoWallet("0xabc")).resolves.not.toThrow();
    expect(revalidatePath).toHaveBeenCalledWith("/profil");
  });
});
