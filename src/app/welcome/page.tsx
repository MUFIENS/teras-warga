import { Metadata } from 'next';
import { LandingClient } from '@/components/landing/LandingClient';

export const metadata: Metadata = {
  title: 'Teras Warga - Ekosistem Warga Digital Modern',
  description: 'Platform komunitas cerdas untuk lingkungan perumahan modern. Terhubung dengan tetangga, bertransaksi di pasar warga, dan pantau keamanan secara real-time.',
  openGraph: {
    title: 'Teras Warga - Ekosistem Warga Digital Modern',
    description: 'Platform komunitas cerdas untuk lingkungan perumahan modern. Terhubung dengan tetangga, bertransaksi di pasar warga, dan pantau keamanan secara real-time.',
    url: 'https://teraswarga.com',
    siteName: 'Teras Warga',
    images: [
      {
        url: 'https://teraswarga.com/og-image.jpg', // Placeholder for actual OG image
        width: 1200,
        height: 630,
        alt: 'Preview Teras Warga',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teras Warga - Ekosistem Warga Digital Modern',
    description: 'Platform komunitas cerdas untuk lingkungan perumahan modern. Terhubung dengan tetangga, bertransaksi di pasar warga, dan pantau keamanan secara real-time.',
    images: ['https://teraswarga.com/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function WelcomePage() {
  return (
    <>
      <LandingClient />
    </>
  );
}
