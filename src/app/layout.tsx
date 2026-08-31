import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ContactFab } from '@/components/ContactFab';
import { SITE_URL, SUPABASE_CONFIGURED } from '@/lib/env';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'PSYCHOKILLER | Pokémon GO Marketplace',
    template: '%s | PSYCHOKILLER',
  },
  description:
    'PSYCHOKILLER — premium Pokémon GO account marketplace and catalog. Browse verified accounts by level, shiny, shundo and hundo counts.',
  keywords: ['Pokémon GO accounts', 'PSYCHOKILLER', 'shiny', 'shundo', 'hundo', 'marketplace'],
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    siteName: 'PSYCHOKILLER',
    url: SITE_URL,
    title: 'PSYCHOKILLER | Pokémon GO Marketplace',
    description: 'Premium Pokémon GO account marketplace and catalog.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'PSYCHOKILLER' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSYCHOKILLER | Pokémon GO Marketplace',
    description: 'Premium Pokémon GO account marketplace and catalog.',
    images: ['/og.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <AnimatedBackground />
        {!SUPABASE_CONFIGURED && (
          <div className="bg-amber-500/90 px-4 py-1.5 text-center text-xs font-medium text-black">
            Setup incomplete: add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local
          </div>
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ContactFab />
      </body>
    </html>
  );
}
