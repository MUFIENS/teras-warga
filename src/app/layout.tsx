import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { Sidebar } from "@/components/Sidebar";
import { BottomNav } from "@/components/navigation/BottomNav";
import { MobileHeader } from "@/components/navigation/MobileHeader";
import { PresenceProvider } from "@/components/providers/PresenceProvider";
import { Web3Provider } from "@/components/providers/Web3Provider";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/lib/data/user";
import { Toaster } from "sonner";
import { headers } from "next/headers";
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
  metadataBase: new URL("https://teraswarga.com"),
  title: {
    default: "Teras Warga - Digitalisasi Komunitas Lingkungan",
    template: "%s | Teras Warga",
  },
  description:
    "Teras Warga adalah platform komunitas modern untuk RT/RW yang mengintegrasikan komunikasi real-time, pasar warga (Web3), dan administrasi lingkungan cerdas.",
  keywords: [
    "RT",
    "RW",
    "Komunitas",
    "Smart Neighborhood",
    "Warga",
    "Perumahan",
    "Sosial",
    "Pasar Warga",
  ],
  authors: [{ name: "Teras Warga Team", url: "https://teraswarga.com" }],
  creator: "Teras Warga",
  publisher: "Teras Warga",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://teraswarga.com",
    siteName: "Teras Warga",
    title: "Teras Warga - Digitalisasi Komunitas Lingkungan",
    description:
      "Teras Warga adalah platform komunitas modern untuk RT/RW yang mengintegrasikan komunikasi real-time, pasar warga (Web3), dan administrasi lingkungan cerdas.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Teras Warga Open Graph Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teras Warga - Digitalisasi Komunitas Lingkungan",
    description:
      "Teras Warga adalah platform komunitas modern untuk RT/RW yang mengintegrasikan komunikasi real-time, pasar warga (Web3), dan administrasi lingkungan cerdas.",
    images: ["/og-image.jpg"],
    creator: "@teraswarga",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
      getUserProfile(user.id),
    ]);

    unreadNotifications = notiResult.count || 0;
    unreadMessages = msgResult.count || 0;
    profileData = profileResult ? { ...profileResult, id: user.id, is_seller: profileResult.is_seller ?? false } : null;
  }

  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isPublicRoute = pathname.startsWith('/welcome') || pathname.startsWith('/login') || pathname.startsWith('/register');

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="bg-white dark:bg-black text-gray-900 dark:text-white antialiased">
        <ThemeProvider>
          <Web3Provider>
            <PresenceProvider currentUserId={user?.id}>
              {isPublicRoute ? (
                <main className="min-h-screen w-full flex flex-col relative bg-white dark:bg-black">
                  {children}
                </main>
              ) : (
                <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row min-h-screen">
                  <MobileHeader profile={profileData && user?.id ? { ...profileData, id: user.id } : undefined} />
                  <Sidebar unreadNotifications={unreadNotifications} unreadMessages={unreadMessages} profile={profileData && user?.id ? { ...profileData, id: user.id } : undefined} />
                  <main className="flex-1 flex flex-col relative pb-[calc(80px+env(safe-area-inset-bottom))] md:pb-0">
                    <div className="max-w-4xl mx-auto w-full flex-1">
                      {children}
                    </div>
                  </main>
                  <BottomNav unreadNotifications={unreadNotifications} unreadMessages={unreadMessages} profile={profileData && user?.id ? { ...profileData, id: user.id } : undefined} />
                </div>
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
