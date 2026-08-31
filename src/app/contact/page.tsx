import type { Metadata } from 'next';
import { DISCORD_URL, TELEGRAM_URL, TWITTER_URL, WHATSAPP_URL, INSTAGRAM_URL, REDDIT_URL, CONTACT_EMAIL } from '@/lib/env';
import { PaymentMethods } from '@/components/PaymentMethods';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with PSYCHOKILLER via Telegram, WhatsApp, Discord, X or email.',
};

export default function ContactPage() {
  const channels = [
    { label: 'Telegram', href: TELEGRAM_URL, hint: 'Fastest response — direct message' },
    { label: 'WhatsApp', href: WHATSAPP_URL, hint: 'Chat directly' },
    { label: 'Instagram', href: INSTAGRAM_URL, hint: '@psychokiller_xx' },
    { label: 'Reddit', href: REDDIT_URL, hint: 'u/psychokiller_xx' },
    { label: 'Discord', href: DISCORD_URL, hint: 'Join the server' },
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

      <div className="mt-12">
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-white">
          Payment Methods
        </h2>
        <p className="mt-2 text-sm text-muted">
          We accept the following payment options — fast, secure and verified before every handover.
        </p>
        <div className="mt-5">
          <PaymentMethods />
        </div>
        <p className="mt-4 rounded-lg border border-ink-700/60 bg-ink-900/60 px-4 py-3 text-xs leading-relaxed text-muted">
          💡 Payment details are shared personally on Telegram or WhatsApp after you pick an
          account — never pay anyone who contacts you first claiming to be us.
        </p>
      </div>
    </div>
  );
}
