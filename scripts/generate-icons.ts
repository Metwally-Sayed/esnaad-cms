/**
 * PWA Icon Generator Script
 *
 * This script generates all required PWA icons from a source image.
 *
 * Usage:
 *   npx tsx scripts/generate-icons.ts <source-image>
 *
 * Example:
 *   npx tsx scripts/generate-icons.ts public/logo.png
 *
 * Requirements:
 *   npm install sharp (run once if not installed)
 *
 * Generated files:
 *   - public/icon-192.png  (192x192 - PWA manifest icon)
 *   - public/icon-512.png  (512x512 - PWA manifest icon)
 *   - public/apple-touch-icon.png (180x180 - iOS home screen icon)
 *   - public/og-image.png  (1200x630 - Open Graph social sharing image)
 */

import * as fs from 'fs';
import * as path from 'path';

async function generateIcons() {
  // Dynamic import of sharp
  let sharp: typeof import('sharp');
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Error: sharp package not found. Install it with:');
    console.error('  npm install sharp');
    process.exit(1);
  }

  const sourceImage = process.argv[2];

  if (!sourceImage) {
    console.error('Usage: npx tsx scripts/generate-icons.ts <source-image>');
    console.error('Example: npx tsx scripts/generate-icons.ts public/logo.png');
    process.exit(1);
  }

  const sourcePath = path.resolve(process.cwd(), sourceImage);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Error: Source image not found: ${sourcePath}`);
    process.exit(1);
  }

  const publicDir = path.resolve(process.cwd(), 'public');

  console.log(`Generating icons from: ${sourcePath}`);
  console.log(`Output directory: ${publicDir}\n`);

  const icons = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
  ];

  try {
    // Generate square icons
    for (const icon of icons) {
      const outputPath = path.join(publicDir, icon.name);
      await sharp(sourcePath)
        .resize(icon.size, icon.size, {
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 0 },
        })
        .png()
        .toFile(outputPath);
      console.log(`Created: ${icon.name} (${icon.size}x${icon.size})`);
    }

    // Generate OG image (1200x630 with centered logo)
    const ogOutputPath = path.join(publicDir, 'og-image.png');
    const ogWidth = 1200;
    const ogHeight = 630;
    const logoSize = 300;

    // Create background and composite the logo
    const logoBuffer = await sharp(sourcePath)
      .resize(logoSize, logoSize, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .png()
      .toBuffer();

    await sharp({
      create: {
        width: ogWidth,
        height: ogHeight,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 1 }, // Black background
      },
    })
      .composite([
        {
          input: logoBuffer,
          left: Math.round((ogWidth - logoSize) / 2),
          top: Math.round((ogHeight - logoSize) / 2),
        },
      ])
      .png()
      .toFile(ogOutputPath);

    console.log(`Created: og-image.png (${ogWidth}x${ogHeight})`);

    console.log('\nAll icons generated successfully!');
    console.log('\nNext steps:');
    console.log('1. Verify the generated icons in the public/ directory');
    console.log('2. Customize og-image.png if you want a different background or layout');
    console.log('3. Update favicon.ico if needed (can use an online favicon generator)');
  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateIcons();
