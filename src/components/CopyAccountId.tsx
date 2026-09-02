'use client';

import { useState } from 'react';

export function CopyAccountId({ accountId }: { accountId: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(accountId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be unavailable in older browsers or non-secure previews.
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 font-mono text-gray-200 transition-colors hover:bg-ink-800 hover:text-white"
      aria-label={`Copy account ID ${accountId}`}
      title="Copy account ID"
    >
      <span>{accountId}</span>
      {copied ? (
        <span className="font-sans text-[11px] font-semibold text-emerald-300">Copied</span>
      ) : (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-muted" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
    </button>
  );
}
