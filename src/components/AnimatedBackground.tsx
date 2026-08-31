// Server component — pure CSS/SVG, no JS. Subtle drifting pokéball outlines + stardust.
// Sits behind all content (fixed, pointer-events-none, low opacity). Respects
// prefers-reduced-motion via the global media query (animations frozen).

const BALLS = [
  { top: '12%', left: '8%', size: 90, delay: '0s', dur: '20s', op: 0.06 },
  { top: '68%', left: '78%', size: 130, delay: '3s', dur: '26s', op: 0.05 },
  { top: '40%', left: '52%', size: 70, delay: '6s', dur: '22s', op: 0.045 },
  { top: '82%', left: '18%', size: 100, delay: '2s', dur: '24s', op: 0.05 },
  { top: '22%', left: '85%', size: 60, delay: '5s', dur: '19s', op: 0.055 },
];

// deterministic stardust positions (avoid hydration mismatch)
const DUST = Array.from({ length: 26 }, (_, i) => {
  const x = (i * 37) % 100;
  const y = (i * 61) % 100;
  const s = 1 + ((i * 13) % 3);
  const d = (i % 6) + 2;
  const delay = (i % 5) * 0.9;
  return { x, y, s, d, delay };
});

function PokeballOutline({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2" />
      <line x1="4" y1="50" x2="35" y2="50" stroke="currentColor" strokeWidth="2" />
      <line x1="65" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="50" r="6" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function AnimatedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {BALLS.map((b, i) => (
        <div
          key={i}
          className="absolute animate-drift text-crimson-500"
          style={{
            top: b.top,
            left: b.left,
            opacity: b.op,
            animationDelay: b.delay,
            animationDuration: b.dur,
          }}
        >
          <PokeballOutline size={b.size} />
        </div>
      ))}
      {DUST.map((d, i) => (
        <span
          key={`d${i}`}
          className="absolute rounded-full bg-crimson-300 animate-twinkle"
          style={{
            top: `${d.y}%`,
            left: `${d.x}%`,
            width: d.s,
            height: d.s,
            animationDuration: `${d.d}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
