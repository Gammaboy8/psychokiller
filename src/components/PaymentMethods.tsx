// Payment methods strip — clean pill cards with icons (original SVG, no brand assets).
const METHODS = [
  {
    name: 'UPI',
    hint: 'Instant bank transfer (India)',
    accent: 'from-emerald-500/15 to-emerald-500/5 text-emerald-300 ring-emerald-500/30',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M13 3L5 13h5l-1 8 8-10h-5l1-8z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Digital Rupee (e₹)',
    hint: 'RBI CBDC — bank-grade security',
    accent: 'from-sky-500/15 to-sky-500/5 text-sky-300 ring-sky-500/30',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M6 4h12M6 8h12M6 8c4 0 6 1.5 6 4s-2 4-6 4l7 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Binance USDT',
    hint: 'Crypto — global, fast settlement',
    accent: 'from-amber-500/15 to-amber-500/5 text-amber-300 ring-amber-500/30',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d="M12 2l2.6 2.6L9.2 10 6.6 7.4 12 2zm5.4 5.4L20 10l-8 8-8-8 2.6-2.6L12 12.8l5.4-5.4zM12 9.2L14.8 12 12 14.8 9.2 12 12 9.2z" />
      </svg>
    ),
  },
];

export function PaymentMethods({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        {METHODS.map((m) => (
          <span
            key={m.name}
            className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-br px-3 py-1.5 text-xs font-semibold ring-1 ${m.accent}`}
          >
            {m.icon}
            {m.name}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {METHODS.map((m) => (
        <div
          key={m.name}
          className={`flex items-center gap-3 rounded-xl bg-gradient-to-br p-4 ring-1 ${m.accent}`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-900/70">
            {m.icon}
          </span>
          <div>
            <div className="text-sm font-bold text-white">{m.name}</div>
            <div className="text-xs text-muted">{m.hint}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
