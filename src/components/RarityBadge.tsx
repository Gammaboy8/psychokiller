export function RarityBadges({
  shundo = 0,
  hundo = 0,
  className = '',
}: {
  shundo?: number;
  hundo?: number;
  className?: string;
}) {
  if (shundo <= 0 && hundo <= 0) return null;
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {shundo > 0 && <span className="rarity-shundo">✦ Shundo</span>}
      {hundo > 0 && <span className="rarity-hundo">★ Hundo</span>}
    </div>
  );
}
