import Link from 'next/link';
import { Logo } from './Brand';
import { DISCORD_URL, TELEGRAM_URL, TWITTER_URL, WHATSAPP_URL, CONTACT_EMAIL } from '@/lib/env';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-ink-700/60 bg-ink-950">
      <div className="container-px grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">
            Premium Pokémon GO account marketplace &amp; catalog. Browse verified
            listings, then complete your purchase safely on an authorized marketplace.
          </p>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link href="/accounts" className="hover:text-white">Browse Accounts</Link></li>
            <li><Link href="/sold" className="hover:text-white">Sold Archive</Link></li>
            <li><Link href="/reviews" className="hover:text-white">Reviews &amp; Vouches</Link></li>
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-white">Community</h4>
          <ul className="space-y-2 text-sm text-muted">
            {DISCORD_URL && <li><a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">Discord</a></li>}
            {TELEGRAM_URL && <li><a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">Telegram</a></li>}
            {WHATSAPP_URL && <li><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></li>}
            {TWITTER_URL && <li><a href={TWITTER_URL} target="_blank" rel="noopener noreferrer" className="hover:text-white">X / Twitter</a></li>}
            {CONTACT_EMAIL && <li><a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">Email</a></li>}
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800">
        <div className="container-px flex flex-col gap-2 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>© {year} PSYCHOKILLER. All rights reserved.</p>
          <p className="max-w-xl md:text-right">
            Independent marketplace/catalog. Not affiliated with, endorsed by, or
            sponsored by Niantic, Inc. or The Pokémon Company. All trademarks belong
            to their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
