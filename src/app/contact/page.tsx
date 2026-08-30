import type { Metadata } from 'next';
import { DISCORD_URL, TELEGRAM_URL, TWITTER_URL, CONTACT_EMAIL } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with PSYCHOKILLER via Discord, Telegram, X or email.',
};

export default function ContactPage() {
  const channels = [
    { label: 'Discord', href: DISCORD_URL, hint: 'Fastest response — join the server' },
    { label: 'Telegram', href: TELEGRAM_URL, hint: 'Direct message' },
    { label: 'X / Twitter', href: TWITTER_URL, hint: 'DMs open' },
    { label: 'Email', href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : '', hint: CONTACT_EMAIL },
  ].filter((c) => c.href);

  return (
    <div className="container-px max-w-2xl py-12">
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-white">
        Contact
      </h1>
      <p className="mt-3 text-sm text-muted">
        Questions about a listing, a custom request, or availability? Reach out on any
        channel below.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {channels.length ? (
          channels.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              className="card p-5 transition-colors hover:border-crimson-500/60"
            >
              <div className="text-lg font-semibold text-white">{c.label}</div>
              <div className="mt-1 text-sm text-muted">{c.hint}</div>
            </a>
          ))
        ) : (
          <p className="text-sm text-muted">
            Contact channels will appear here once configured.
          </p>
        )}
      </div>
    </div>
  );
}
