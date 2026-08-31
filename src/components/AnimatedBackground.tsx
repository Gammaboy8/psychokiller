// Server component — pure CSS/SVG, no JS. Layered ambient background:
//   1. drifting aurora blobs (crimson/purple, heavily blurred)
//   2. faint dot-grid for depth
//   3. floating pokéball outlines (original generic SVG) with soft glow
//   4. rising ember sparks + twinkling stardust
// Everything is low-opacity, GPU-friendly (transform/opacity only) and
// freezes under prefers-reduced-motion via the global media query.

const BALLS = [
  { top: '10%', left: '6%', size: 110, delay: '0s', dur: '22s', op: 0.13 },
  { top: '64%', left: '80%', size: 150, delay: '3s', dur: '28s', op: 0.11 },
  { top: '38%', left: '55%', size: 75, delay: '6s', dur: '24s', op: 0.09 },
  { top: '80%', left: '14%', size: 105, delay: '2s', dur: '26s', op: 0.11 },
  { top: '18%', left: '84%', size: 65, delay: '5s', dur: '20s', op: 0.12 },
  { top: '52%', left: '30%', size: 55, delay: '8s', dur: '23s', op: 0.08 },
];

// deterministic positions (avoid hydration mismatch)
const DUST = Array.from({ length: 30 }, (_, i) => {
  const x = (i * 37) % 100;
  const y = (i * 61) % 100;
  const s = 1 + ((i * 13) % 3);
  const d = (i % 6) + 2;
  const delay = (i % 5) * 0.9;
  return { x, y, s, d, delay };
});

const EMBERS = Array.from({ length: 12 }, (_, i) => {
  const x = (i * 83 + 7) % 100;
  const dur = 14 + (i % 5) * 3;
  const delay = (i * 1.7) % 14;
  const s = 2 + (i % 3);
  return { x, dur, delay, s };
});

function PokeballOutline({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden>
      <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="1.6" />
      <line x1="4" y1="50" x2="35" y2="50" stroke="currentColor" strokeWidth="1.6" />
      <line x1="65" y1="50" x2="96" y2="50" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="50" cy="50" r="6" fill="currentColor" fillOpacity="0.35" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 1 — aurora blobs */}
      <div className="bg-aurora bg-aurora-a" />
      <div className="bg-aurora bg-aurora-b" />
      <div className="bg-aurora bg-aurora-c" />

      {/* 2 — faint dot grid */}
      <div className="bg-dotgrid absolute inset-0" />

      {/* 3 — pokéball outlines with glow */}
      {BALLS.map((b, i) => (
        <div
          key={i}
          className={`absolute text-crimson-500 ${i % 2 ? 'animate-drift-alt' : 'animate-drift'}`}
          style={{
            top: b.top,
            left: b.left,
            opacity: b.op,
            animationDelay: b.delay,
            animationDuration: b.dur,
            filter: 'drop-shadow(0 0 12px rgba(224,58,58,0.55))',
          }}
        >
          <PokeballOutline size={b.size} />
        </div>
      ))}

      {/* 4a — twinkling stardust */}
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
            boxShadow: '0 0 6px 1px rgba(255,128,128,0.4)',
          }}
        />
      ))}

      {/* 4b — rising embers */}
      {EMBERS.map((e, i) => (
        <span
          key={`e${i}`}
          className="ember"
          style={{
            left: `${e.x}%`,
            width: e.s,
            height: e.s,
            animationDuration: `${e.dur}s`,
            animationDelay: `${e.delay}s`,
          }}
        />
      ))}

      {/* subtle vignette to keep content readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(10,11,13,0.55)_100%)]" />
    </div>
  );
}
