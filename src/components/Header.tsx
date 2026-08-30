'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Logo } from './Brand';
import { DISCORD_URL, TELEGRAM_URL, WHATSAPP_URL } from '@/lib/env';

const NAV = [
  { href: '/accounts', label: 'Browse Accounts' },
  { href: '/sold', label: 'Sold' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-ink-700/60 bg-ink-950/80 backdrop-blur">
      <div className="container-px flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === n.href
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {n.label}
            </Link>
          ))}
          {DISCORD_URL && (
            <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm ml-2">
              Discord
            </a>
          )}
          {TELEGRAM_URL && (
            <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">
              Telegram
            </a>
          )}
          {WHATSAPP_URL && (
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm">
              WhatsApp
            </a>
          )}
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-lg border border-ink-600 p-2 text-gray-200 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-ink-700/60 bg-ink-900 md:hidden">
          <nav className="container-px flex flex-col py-2">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-gray-200 hover:bg-ink-800"
              >
                {n.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 px-1 pb-2">
              {DISCORD_URL && (
                <a href={DISCORD_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm flex-1">
                  Discord
                </a>
              )}
              {TELEGRAM_URL && (
                <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm flex-1">
                  Telegram
                </a>
              )}
              {WHATSAPP_URL && (
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost btn-sm flex-1">
                  WhatsApp
                </a>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
