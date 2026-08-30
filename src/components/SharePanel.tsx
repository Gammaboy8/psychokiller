'use client';

import { useState } from 'react';

export function SharePanel({
  url,
  shareText,
}: {
  url: string;
  shareText: string;
}) {
  const [copied, setCopied] = useState(false);

  const full = `${shareText}\n\nView details:\n${url}`;
  const enc = encodeURIComponent(full);
  const encUrl = encodeURIComponent(url);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const native = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: 'PSYCHOKILLER', text: shareText, url });
      } catch {
        /* cancelled */
      }
    } else {
      copy();
    }
  };

  return (
    <div className="card p-4">
      <h3 className="mb-3 text-sm font-semibold text-white">Share this listing</h3>
      <div className="flex flex-wrap gap-2">
        <button onClick={copy} className="btn-ghost btn-sm">
          {copied ? '✓ Copied' : 'Copy Link'}
        </button>
        <a className="btn-ghost btn-sm" target="_blank" rel="noopener noreferrer"
           href={`https://t.me/share/url?url=${encUrl}&text=${enc}`}>
          Telegram
        </a>
        <a className="btn-ghost btn-sm" target="_blank" rel="noopener noreferrer"
           href={`https://twitter.com/intent/tweet?text=${enc}`}>
          X / Twitter
        </a>
        <button onClick={native} className="btn-ghost btn-sm md:hidden">
          Share…
        </button>
      </div>
    </div>
  );
}
