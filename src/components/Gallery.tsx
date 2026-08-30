'use client';

import Image from 'next/image';
import { useState, useRef } from 'react';

export function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const touchX = useRef<number | null>(null);

  if (!images.length) {
    return (
      <div className="card flex aspect-[4/3] items-center justify-center text-muted">
        No images
      </div>
    );
  }

  const go = (dir: number) =>
    setActive((a) => (a + dir + images.length) % images.length);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        className="card relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={() => setLightbox(true)}
      >
        <Image
          src={images[active]}
          alt={`${title} — image ${active + 1}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-contain"
        />
        {images.length > 1 && (
          <>
            <NavBtn side="left" onClick={(e) => { e.stopPropagation(); go(-1); }} />
            <NavBtn side="right" onClick={(e) => { e.stopPropagation(); go(1); }} />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-1 text-xs text-white">
              {active + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              onClick={() => setActive(i)}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                i === active ? 'border-crimson-500' : 'border-transparent opacity-60'
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <button
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            ✕
          </button>
          <div className="relative h-[85vh] w-full max-w-5xl">
            <Image src={images[active]} alt={title} fill className="object-contain" />
          </div>
          {images.length > 1 && (
            <>
              <NavBtn side="left" onClick={(e) => { e.stopPropagation(); go(-1); }} />
              <NavBtn side="right" onClick={(e) => { e.stopPropagation(); go(1); }} />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function NavBtn({
  side,
  onClick,
}: {
  side: 'left' | 'right';
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={side === 'left' ? 'Previous' : 'Next'}
      className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 ${
        side === 'left' ? 'left-2' : 'right-2'
      }`}
    >
      {side === 'left' ? '‹' : '›'}
    </button>
  );
}
