import { Metadata } from 'next';
import { LandingClient } from '@/components/landing/LandingClient';

export const metadata: Metadata = {
  title: 'Ekosistem Warga Digital Modern',
  description: 'Platform komunitas cerdas untuk lingkungan perumahan modern. Terhubung dengan tetangga, bertransaksi di pasar warga, dan pantau keamanan secara real-time.',
  openGraph: {
    title: 'Ekosistem Warga Digital Modern',
    description: 'Platform komunitas cerdas untuk lingkungan perumahan modern. Terhubung dengan tetangga, bertransaksi di pasar warga, dan pantau keamanan secara real-time.',
    url: '/welcome',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Preview Teras Warga',
      },
    ],
  },
  twitter: {
    title: 'Ekosistem Warga Digital Modern',
    description: 'Platform komunitas cerdas untuk lingkungan perumahan modern. Terhubung dengan tetangga, bertransaksi di pasar warga, dan pantau keamanan secara real-time.',
    images: ['/og-image.jpg'],
  },
};

export default function WelcomePage() {
  return (
    <>
      <LandingClient />
    </>
  );
}
