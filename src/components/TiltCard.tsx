'use client';

import { useRef } from 'react';

// Wraps a card with 3D tilt + holographic shine on pointer (desktop / fine pointer only).
// Disabled on touch devices to keep mobile flat and performant.
export function TiltCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const isTouch =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(hover: none)').matches;

  function onMove(e: React.MouseEvent) {
    if (isTouch) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const rx = (0.5 - py) * 8;
    const ry = (px - 0.5) * 10;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  }

  function onLeave() {
    const el = ref.current;
    if (el) el.style.transform = '';
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`tilt-card relative ${className}`}
    >
      <span className="holo-shine rounded-xl" />
      {children}
    </div>
  );
}
