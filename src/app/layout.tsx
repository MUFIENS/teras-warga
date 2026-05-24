import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { PresenceProvider } from "@/components/providers/PresenceProvider";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Teras Warga",
  description: "Modern community platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let unreadNotifications = 0;
  let unreadMessages = 0;
  let profileData: { id: string; username: string; full_name: string; avatar_url: string | null; is_seller: boolean; last_active: string | null } | null = null;

  if (user) {
    // Paralelisasi query agar tidak sequential (waterfall)
    const [notiResult, msgResult, profileResult] = await Promise.all([
      supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false),
      supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('receiver_id', user.id)
        .eq('is_read', false),
      supabase
        .from('profiles')
        .select('username, full_name, avatar_url, is_seller, last_active')
        .eq('id', user.id)
        .single(),
    ]);

    unreadNotifications = notiResult.count || 0;
    unreadMessages = msgResult.count || 0;
    profileData = profileResult.data ? { ...profileResult.data, id: user.id, is_seller: profileResult.data.is_seller ?? false } : null;
  }

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        <ThemeProvider>
          <Web3Provider>
            <PresenceProvider currentUserId={user?.id}>
              {user ? (
                <div className="max-w-[1440px] mx-auto flex min-h-screen">
                  <Sidebar unreadNotifications={unreadNotifications} unreadMessages={unreadMessages} profile={profileData ? { ...profileData, id: user.id } : undefined} />
                  <main className="flex-1 flex flex-col relative">
                    <div className="max-w-4xl mx-auto w-full flex-1">
                      {children}
                    </div>
                  </main>
                </div>
              ) : (
                children
              )}
            </PresenceProvider>
          </Web3Provider>
          <Toaster
            position="top-center"
            richColors
            toastOptions={{
              className: "!rounded-xl !font-[family-name:var(--font-geist-sans)] !shadow-lg",
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
