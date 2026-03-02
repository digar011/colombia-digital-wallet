/**
 * Generate production PNG PWA icons from SVG source.
 *
 * Usage: node scripts/generate-pwa-icons.mjs
 *
 * Converts the 512x512 SVG shield icon to PNG at all required PWA sizes.
 * Also generates apple-touch-icon and favicons.
 */

import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const ICONS_DIR = join(ROOT, 'public', 'icons');
const SVG_SOURCE = join(ICONS_DIR, 'icon-512x512.svg');

// Standard PWA sizes
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

// Special sizes
const APPLE_TOUCH = 180;
const FAVICON_SIZES = [16, 32];
const MASKABLE_SIZE = 512;

async function generate() {
  const svgBuffer = readFileSync(SVG_SOURCE);

  console.log('Generating PWA icons from SVG source...\n');

  // Standard PWA icons
  for (const size of SIZES) {
    const output = join(ICONS_DIR, `icon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(output);
    console.log(`  ✓ icon-${size}x${size}.png`);
  }

  // Apple touch icon (180x180)
  const appleTouchOutput = join(ICONS_DIR, 'apple-touch-icon.png');
  await sharp(svgBuffer)
    .resize(APPLE_TOUCH, APPLE_TOUCH)
    .png({ quality: 90 })
    .toFile(appleTouchOutput);
  console.log(`  ✓ apple-touch-icon.png (${APPLE_TOUCH}x${APPLE_TOUCH})`);

  // Favicons (16x16, 32x32)
  for (const size of FAVICON_SIZES) {
    const output = join(ICONS_DIR, `favicon-${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png({ quality: 90 })
      .toFile(output);
    console.log(`  ✓ favicon-${size}x${size}.png`);
  }

  // Maskable icon (512x512 with safe-area padding — 10% padding on each side)
  const maskableOutput = join(ICONS_DIR, 'icon-maskable-512x512.png');
  const innerSize = Math.round(MASKABLE_SIZE * 0.8);
  const padding = Math.round(MASKABLE_SIZE * 0.1);

  const resizedIcon = await sharp(svgBuffer)
    .resize(innerSize, innerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: MASKABLE_SIZE,
      height: MASKABLE_SIZE,
      channels: 4,
      background: { r: 0, g: 56, b: 147, alpha: 1 }, // Colombia blue #003893
    },
  })
    .composite([{ input: resizedIcon, left: padding, top: padding }])
    .png({ quality: 90 })
    .toFile(maskableOutput);
  console.log(`  ✓ icon-maskable-512x512.png (with safe-area padding)`);

  console.log('\nDone! All PWA icons generated.');
}

generate().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
