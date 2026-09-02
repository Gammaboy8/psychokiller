'use client';

import { TELEGRAM_URL, WHATSAPP_URL } from '@/lib/env';

type ListingContactActionsProps = {
  accountId: string;
  title: string;
  listingUrl: string;
};

function whatsappLink(message: string) {
  try {
    const url = new URL(WHATSAPP_URL);
    url.searchParams.set('text', message);
    return url.toString();
  } catch {
    return WHATSAPP_URL;
  }
}

export function ListingContactActions({
  accountId,
  title,
  listingUrl,
}: ListingContactActionsProps) {
  if (!TELEGRAM_URL && !WHATSAPP_URL) return null;

  const message = `Hi PSYCHOKILLER, I'm interested in account ${accountId} (${title}). Please share its availability and purchase details.`;
  const telegramLink = `https://t.me/share/url?url=${encodeURIComponent(listingUrl)}&text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-md gap-2 rounded-2xl border border-ink-600/80 bg-ink-950/90 p-2 shadow-2xl backdrop-blur md:inset-x-auto md:right-6 md:bottom-6 md:mx-0 md:max-w-none">
      {WHATSAPP_URL && (
        <a
          href={whatsappLink(message)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-3 py-2 text-sm font-bold text-[#07150c] transition-transform hover:-translate-y-0.5 hover:brightness-110"
        >
          <WhatsAppIcon />
          WhatsApp
        </a>
      )}
      {TELEGRAM_URL && (
        <a
          href={telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-3 py-2 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 hover:brightness-110"
        >
          <TelegramIcon />
          Telegram
        </a>
      )}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.05 1.6 5.79L2 22l4.44-1.7a9.86 9.86 0 0 0 5.6 1.7h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.09c-.25.7-1.44 1.33-1.98 1.37-.53.04-.53.42-3.34-.7-2.81-1.12-4.56-3.97-4.7-4.16-.14-.19-1.12-1.49-1.12-2.84 0-1.35.71-2.01.96-2.29.25-.28.55-.35.73-.35.18 0 .37 0 .53.01.17.01.4-.06.62.48.25.6.84 2.07.91 2.22.07.14.11.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.56.16.28.72 1.18 1.55 1.91 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.18-.21.7-.81.88-1.09.19-.28.37-.23.62-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.65-.18 1.34Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M21.94 4.6 18.9 19.02c-.23 1.02-.83 1.27-1.68.79l-4.64-3.42-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.73 8.6-7.77c.37-.33-.08-.52-.58-.19L6.42 13.2l-4.57-1.43c-.99-.31-1.01-.99.21-1.47l17.85-6.88c.83-.31 1.55.19 1.28 1.18Z" />
    </svg>
  );
}
