import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
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
  openGraph: {
    type: 'website',
    siteName: 'PSYCHOKILLER',
    url: SITE_URL,
    title: 'PSYCHOKILLER | Pokémon GO Marketplace',
    description: 'Premium Pokémon GO account marketplace and catalog.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PSYCHOKILLER | Pokémon GO Marketplace',
    description: 'Premium Pokémon GO account marketplace and catalog.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        {!SUPABASE_CONFIGURED && (
          <div className="bg-amber-500/90 px-4 py-1.5 text-center text-xs font-medium text-black">
            Setup incomplete: add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local
          </div>
        )}
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
