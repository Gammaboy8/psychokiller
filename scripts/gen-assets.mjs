import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const SRC = process.argv[2] || 'C:/Users/ayush/Downloads/photo_2026-08-05_12-44-27.jpg';
const ROOT = path.resolve(process.cwd());
const PUB = path.join(ROOT, 'public');
const APP = path.join(ROOT, 'src', 'app');
mkdirSync(PUB, { recursive: true });

const log = (...a) => console.log('•', ...a);

async function main() {
  // 1. Optimized logo (WebP + PNG), keep full square art
  await sharp(SRC).resize(512, 512).webp({ quality: 90 }).toFile(path.join(PUB, 'logo.webp'));
  await sharp(SRC).resize(512, 512).png({ compressionLevel: 9 }).toFile(path.join(PUB, 'logo.png'));
  log('logo.webp / logo.png');

  // 2. Favicons + app icons
  await sharp(SRC).resize(32, 32).png().toFile(path.join(PUB, 'favicon-32.png'));
  await sharp(SRC).resize(180, 180).png().toFile(path.join(APP, 'apple-icon.png'));
  await sharp(SRC).resize(192, 192).png().toFile(path.join(PUB, 'icon-192.png'));
  await sharp(SRC).resize(512, 512).png().toFile(path.join(PUB, 'icon-512.png'));
  // favicon.ico (32px) — App Router serves src/app/favicon.ico
  await sharp(SRC).resize(32, 32).toFormat('png').toFile(path.join(APP, 'favicon.ico'));
  log('favicons + app icons');

  // 3. OG share image 1200x630: dark bg + crimson glow + logo (left) + text (right)
  const W = 1200, H = 630;
  const bg = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="28%" cy="45%" r="60%">
          <stop offset="0%" stop-color="#e03a3a" stop-opacity="0.35"/>
          <stop offset="55%" stop-color="#c22626" stop-opacity="0.10"/>
          <stop offset="100%" stop-color="#0a0b0d" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${W}" height="${H}" fill="#0a0b0d"/>
      <rect width="${W}" height="${H}" fill="url(#glow)"/>
      <text x="470" y="300" font-family="Segoe UI, Arial, sans-serif" font-size="86" font-weight="800" letter-spacing="2">
        <tspan fill="#ffffff">PSYCHO</tspan><tspan fill="#e03a3a">KILLER</tspan>
      </text>
      <text x="472" y="360" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="600" fill="#c9d1d9" letter-spacing="1">Pok&#233;mon GO Account Marketplace</text>
      <text x="472" y="410" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="500" fill="#8b95a1">Shinies &#183; Shundos &#183; Hundos &#183; Legendaries</text>
      <circle cx="235" cy="315" r="182" fill="none" stroke="#e03a3a" stroke-opacity="0.25" stroke-width="3"/>
    </svg>`
  );
  const logoRound = await sharp(SRC)
    .resize(340, 340)
    .composite([{
      input: Buffer.from(`<svg width="340" height="340"><circle cx="170" cy="170" r="170" fill="#fff"/></svg>`),
      blend: 'dest-in',
    }])
    .png()
    .toBuffer();

  await sharp(bg)
    .composite([{ input: logoRound, left: 65, top: 145 }])
    .png()
    .toFile(path.join(PUB, 'og.png'));
  log('og.png (1200x630)');

  console.log('DONE');
}
main().catch((e) => { console.error(e); process.exit(1); });
