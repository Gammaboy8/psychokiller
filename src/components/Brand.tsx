import Link from 'next/link';
import Image from 'next/image';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-2.5 ${className}`}>
      <span className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full ring-1 ring-crimson-500/40 shadow-glow transition-transform group-hover:scale-105">
        <Image
          src="/logo.webp"
          alt="PSYCHOKILLER logo"
          width={36}
          height={36}
          className="h-full w-full object-cover"
          priority
        />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-white">
        PSYCHO<span className="text-crimson-500">KILLER</span>
      </span>
    </Link>
  );
}
