import Link from 'next/link';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2 ${className}`}>
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-crimson-600 text-white shadow-glow">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5L12 2z" />
        </svg>
      </span>
      <span className="text-lg font-extrabold tracking-tight text-white">
        PSYCHO<span className="text-crimson-500">KILLER</span>
      </span>
    </Link>
  );
}
