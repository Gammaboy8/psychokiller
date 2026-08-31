import type { Metadata } from 'next';
import { Faq } from '@/components/Faq';

export const metadata: Metadata = {
  title: 'About',
  description: 'About PSYCHOKILLER — a premium Pokémon GO account marketplace and catalog.',
};

const FAQS = [
  {
    q: 'Is buying through PSYCHOKILLER safe?',
    a: 'Yes. This website is a catalog only — every purchase is completed on an authorized third-party marketplace (PlayerAuctions, Eldorado, G2G, EpicNPC) that provides escrow, buyer protection and dispute resolution. You are never asked to pay directly through this site.',
  },
  {
    q: 'How does delivery work?',
    a: 'Once your order is confirmed on the marketplace, account access details are handed over securely through that platform, typically within a few hours. Delivery times and terms are shown on each marketplace listing before you pay.',
  },
  {
    q: 'What payment methods are accepted?',
    a: 'We accept UPI (instant bank transfer, India), Digital Rupee (e₹ — RBI\'s official CBDC) and Binance USDT (crypto, worldwide). Marketplace listings additionally support the payment options of that platform (cards, PayPal, etc.). Payment details are always shared personally on Telegram/WhatsApp — this website never collects payment information.',
  },
  {
    q: 'Do you store account passwords or personal data?',
    a: 'No. We never ask for or store account passwords, recovery codes, or 2FA secrets on this site. The catalog contains listing information and screenshots only.',
  },
  {
    q: 'Are the stats and screenshots accurate?',
    a: 'Every listing is documented with real screenshots and full stats — level, shinies, shundos, hundos, legendaries, rare backgrounds and costumes — so you know exactly what you are getting before you buy.',
  },
  {
    q: 'What if an account is marked as sold?',
    a: 'Sold listings are kept in the archive for reference. If you liked a sold account, reach out on Telegram or WhatsApp — we regularly add similar inventory and can notify you when something matching comes in.',
  },
];

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

      <div className="mt-12">
        <h2 className="mb-5 font-display text-2xl font-bold uppercase tracking-wide text-white">
          Frequently Asked Questions
        </h2>
        <Faq items={FAQS} />
      </div>
    </div>
  );
}
