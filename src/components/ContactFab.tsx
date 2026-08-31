'use client';

import { useState } from 'react';
import { TELEGRAM_URL, WHATSAPP_URL } from '@/lib/env';

export function ContactFab() {
  const [open, setOpen] = useState(false);
  if (!TELEGRAM_URL && !WHATSAPP_URL) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col items-end gap-2 animate-fade-up">
          {WHATSAPP_URL && (
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-black shadow-lg transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.05 1.6 5.79L2 22l4.44-1.7a9.86 9.86 0 0 0 5.6 1.7h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.8 14.09c-.25.7-1.44 1.33-1.98 1.37-.53.04-.53.42-3.34-.7-2.81-1.12-4.56-3.97-4.7-4.16-.14-.19-1.12-1.49-1.12-2.84 0-1.35.71-2.01.96-2.29.25-.28.55-.35.73-.35.18 0 .37 0 .53.01.17.01.4-.06.62.48.25.6.84 2.07.91 2.22.07.14.11.31.02.5-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.56.16.28.72 1.18 1.55 1.91 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.18-.21.7-.81.88-1.09.19-.28.37-.23.62-.14.25.09 1.6.75 1.87.89.28.14.46.21.53.32.07.12.07.65-.18 1.34Z" />
              </svg>
              WhatsApp
            </a>
          )}
          {TELEGRAM_URL && (
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-[#229ED9] px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M21.94 4.6 18.9 19.02c-.23 1.02-.83 1.27-1.68.79l-4.64-3.42-2.24 2.16c-.25.25-.46.46-.94.46l.33-4.73 8.6-7.77c.37-.33-.08-.52-.58-.19L6.42 13.2l-4.57-1.43c-.99-.31-1.01-.99.21-1.47l17.85-6.88c.83-.31 1.55.19 1.28 1.18Z" />
              </svg>
              Telegram
            </a>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close contact options' : 'Contact us'}
        aria-expanded={open}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-crimson-600 text-white shadow-glow ring-1 ring-crimson-400/50 transition-transform hover:scale-105 hover:bg-crimson-500"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.94 14.47L2 22l5.66-1.48A10 10 0 1 0 12 2Zm0 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm2 12h-4v-1h1v-4h-1v-1h3v5h1v1Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
