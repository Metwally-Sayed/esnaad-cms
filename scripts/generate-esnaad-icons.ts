/**
 * Generate PWA icons and OG images from Esnaad logos
 *
 * Usage: npx tsx scripts/generate-esnaad-icons.ts
 */

import * as path from 'path';

async function generateEsnaadIcons() {
  let sharp: typeof import('sharp');
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Error: sharp package not found.');
    process.exit(1);
  }

  const publicDir = path.resolve(process.cwd(), 'public');
  const logoEnPath = path.join(publicDir, 'logo-en.webp');
  const logoArPath = path.join(publicDir, 'logo-ar.svg');

  console.log('Generating Esnaad icons...\n');

  // Brand colors
  const bgColor = { r: 10, g: 10, b: 10, alpha: 1 }; // Near black
  const goldColor = '#c9a227';

  try {
    // Get logo dimensions for proper scaling
    const logoEnMeta = await sharp(logoEnPath).metadata();
    console.log(`English logo: ${logoEnMeta.width}x${logoEnMeta.height}`);

    // For PWA icons, we'll use the English logo on dark background
    const icons = [
      { name: 'icon-192.png', size: 192, padding: 24 },
      { name: 'icon-512.png', size: 512, padding: 64 },
      { name: 'apple-touch-icon.png', size: 180, padding: 22 },
    ];

    for (const icon of icons) {
      const logoSize = icon.size - (icon.padding * 2);

      // Resize logo to fit with padding
      const resizedLogo = await sharp(logoEnPath)
        .resize(logoSize, Math.round(logoSize * 0.4), { // Maintain aspect ratio roughly
          fit: 'inside',
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .toBuffer();

      const resizedMeta = await sharp(resizedLogo).metadata();

      // Create icon with dark background
      await sharp({
        create: {
          width: icon.size,
          height: icon.size,
          channels: 4,
          background: bgColor,
        },
      })
        .composite([
          {
            input: resizedLogo,
            left: Math.round((icon.size - (resizedMeta.width || logoSize)) / 2),
            top: Math.round((icon.size - (resizedMeta.height || logoSize)) / 2),
          },
        ])
        .png()
        .toFile(path.join(publicDir, icon.name));

      console.log(`Created: ${icon.name} (${icon.size}x${icon.size})`);
    }

    // Generate OG image for English (1200x630)
    const ogWidth = 1200;
    const ogHeight = 630;

    const ogLogoEn = await sharp(logoEnPath)
      .resize(400, 120, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    const ogLogoEnMeta = await sharp(ogLogoEn).metadata();

    await sharp({
      create: {
        width: ogWidth,
        height: ogHeight,
        channels: 4,
        background: bgColor,
      },
    })
      .composite([
        {
          input: ogLogoEn,
          left: Math.round((ogWidth - (ogLogoEnMeta.width || 400)) / 2),
          top: Math.round((ogHeight - (ogLogoEnMeta.height || 120)) / 2) - 30,
        },
      ])
      .png()
      .toFile(path.join(publicDir, 'og-image.png'));

    console.log(`Created: og-image.png (${ogWidth}x${ogHeight}) - English`);

    // Generate OG image for Arabic
    const ogLogoAr = await sharp(logoArPath, { density: 300 })
      .resize(500, 200, { fit: 'inside', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .toBuffer();
    const ogLogoArMeta = await sharp(ogLogoAr).metadata();

    await sharp({
      create: {
        width: ogWidth,
        height: ogHeight,
        channels: 4,
        background: bgColor,
      },
    })
      .composite([
        {
          input: ogLogoAr,
          left: Math.round((ogWidth - (ogLogoArMeta.width || 500)) / 2),
          top: Math.round((ogHeight - (ogLogoArMeta.height || 200)) / 2),
        },
      ])
      .png()
      .toFile(path.join(publicDir, 'og-image-ar.png'));

    console.log(`Created: og-image-ar.png (${ogWidth}x${ogHeight}) - Arabic`);

    console.log('\nAll icons generated successfully!');
    console.log('\nFiles created:');
    console.log('  - icon-192.png (PWA icon)');
    console.log('  - icon-512.png (PWA icon high-res)');
    console.log('  - apple-touch-icon.png (iOS)');
    console.log('  - og-image.png (English OG image)');
    console.log('  - og-image-ar.png (Arabic OG image)');

  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generateEsnaadIcons();
