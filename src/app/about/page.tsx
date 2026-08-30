import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description: 'About PSYCHOKILLER — a premium Pokémon GO account marketplace and catalog.',
};

export default function AboutPage() {
  return (
    <div className="container-px max-w-3xl py-12">
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-white">
        About PSYCHO<span className="text-crimson-500">KILLER</span>
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-gray-300">
        <p>
          PSYCHOKILLER is a premium catalog and storefront for high-value Pokémon GO
          accounts. Every listing is documented with screenshots and full stats so you
          know exactly what you&apos;re getting — shinies, shundos, hundos, legendaries,
          rare backgrounds and costumes.
        </p>
        <p>
          This website is the central source of truth for current inventory. When
          you&apos;re ready to buy, you&apos;re sent to the authorized marketplace listing
          (PlayerAuctions, Eldorado, G2G, EpicNPC and others) where the transaction is
          handled securely with buyer protection.
        </p>
        <p>
          We never ask for or store account passwords, recovery codes, or 2FA secrets on
          this site. The catalog contains listing information and screenshots only.
        </p>
      </div>

      <div className="card mt-8 p-6">
        <h2 className="font-display text-xl font-bold uppercase text-white">Why buy through a marketplace?</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-gray-300">
          <li>Escrow &amp; buyer protection on supported platforms</li>
          <li>Verified seller reputation and order history</li>
          <li>Dispute resolution handled by the platform</li>
          <li>Secure payment processing</li>
        </ul>
      </div>
    </div>
  );
}
