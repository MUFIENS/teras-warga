import { VotingClient, Proposal } from "@/components/VotingClient";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function VotingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/welcome");
  }

  // Simulasi data DAO (Di masa depan akan diambil dari blockchain atau Supabase)
  const mockProposals: Proposal[] = [
    {
      id: "prop_1",
      title: "Perbaikan Jalan Blok A & B",
      description: "Anggaran Rp 5.000.000 untuk menambal jalan yang berlubang di sepanjang blok A dan B yang berbahaya saat musim hujan.",
      options: ["Setuju", "Tidak Setuju", "Tunda Bulan Depan"],
      status: "active" as const,
      votes: {
        "Setuju": 34,
        "Tidak Setuju": 5,
        "Tunda Bulan Depan": 12,
      },
    },
    {
      id: "prop_2",
      title: "Kenaikan Iuran Keamanan Bulanan",
      description: "Menaikkan iuran dari Rp 50.000 menjadi Rp 75.000 untuk menambah satu personel keamanan di gerbang utama.",
      options: ["Setuju", "Tidak Setuju"],
      status: "active" as const,
      votes: {
        "Setuju": 15,
        "Tidak Setuju": 42,
      },
    },
    {
      id: "prop_3",
      title: "Pemilihan Vendor Sampah Baru",
      description: "Memilih vendor pengangkutan sampah untuk periode 2026-2027.",
      options: ["Vendor A (CV Bersih)", "Vendor B (PT Hijau)", "Vendor C (BUMDes)"],
      status: "active" as const,
      votes: {
        "Vendor A (CV Bersih)": 20,
        "Vendor B (PT Hijau)": 45,
        "Vendor C (BUMDes)": 10,
      },
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <VotingClient proposals={mockProposals} />
    </div>
  );
}
