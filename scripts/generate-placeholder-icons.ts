/**
 * Generate placeholder PWA icons with "E" logo for Esnaad
 *
 * Usage: npx tsx scripts/generate-placeholder-icons.ts
 */

import * as fs from 'fs';
import * as path from 'path';

async function generatePlaceholderIcons() {
  let sharp: typeof import('sharp');
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.error('Error: sharp package not found.');
    process.exit(1);
  }

  const publicDir = path.resolve(process.cwd(), 'public');

  // Create SVG logo with "E" letter - elegant design
  const createLogoSvg = (size: number) => {
    const fontSize = Math.round(size * 0.6);
    return Buffer.from(`
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#c9a227"/>
            <stop offset="100%" style="stop-color:#9a7b1a"/>
          </linearGradient>
        </defs>
        <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#bg)"/>
        <text
          x="50%"
          y="55%"
          font-family="Georgia, serif"
          font-size="${fontSize}"
          font-weight="bold"
          fill="white"
          text-anchor="middle"
          dominant-baseline="middle"
        >E</text>
      </svg>
    `);
  };

  console.log('Generating placeholder icons for Esnaad...\n');

  const icons = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'apple-touch-icon.png', size: 180 },
  ];

  try {
    // Generate square icons
    for (const icon of icons) {
      const outputPath = path.join(publicDir, icon.name);
      const svgBuffer = createLogoSvg(icon.size);

      await sharp(svgBuffer)
        .png()
        .toFile(outputPath);

      console.log(`Created: ${icon.name} (${icon.size}x${icon.size})`);
    }

    // Generate OG image (1200x630)
    const ogWidth = 1200;
    const ogHeight = 630;
    const logoSize = 200;

    const ogSvg = Buffer.from(`
      <svg width="${ogWidth}" height="${ogHeight}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ogBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1a1a1a"/>
            <stop offset="100%" style="stop-color:#0a0a0a"/>
          </linearGradient>
          <linearGradient id="logoBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#c9a227"/>
            <stop offset="100%" style="stop-color:#9a7b1a"/>
          </linearGradient>
        </defs>
        <rect width="${ogWidth}" height="${ogHeight}" fill="url(#ogBg)"/>

        <!-- Logo icon -->
        <rect
          x="${(ogWidth - logoSize) / 2}"
          y="${(ogHeight - logoSize) / 2 - 40}"
          width="${logoSize}"
          height="${logoSize}"
          rx="${logoSize * 0.15}"
          fill="url(#logoBg)"
        />
        <text
          x="50%"
          y="${ogHeight / 2 - 40 + logoSize * 0.05}"
          font-family="Georgia, serif"
          font-size="${logoSize * 0.6}"
          font-weight="bold"
          fill="white"
          text-anchor="middle"
          dominant-baseline="middle"
        >E</text>

        <!-- Brand name -->
        <text
          x="50%"
          y="${ogHeight / 2 + logoSize / 2 + 30}"
          font-family="Georgia, serif"
          font-size="48"
          font-weight="normal"
          fill="#c9a227"
          text-anchor="middle"
        >ESNAAD</text>

        <!-- Tagline -->
        <text
          x="50%"
          y="${ogHeight / 2 + logoSize / 2 + 80}"
          font-family="Arial, sans-serif"
          font-size="20"
          fill="#888888"
          text-anchor="middle"
        >Real Estate Development</text>
      </svg>
    `);

    const ogOutputPath = path.join(publicDir, 'og-image.png');
    await sharp(ogSvg)
      .png()
      .toFile(ogOutputPath);

    console.log(`Created: og-image.png (${ogWidth}x${ogHeight})`);

    console.log('\nAll placeholder icons generated successfully!');
    console.log('\nNote: These are placeholder icons. Replace them with your actual brand logo when available.');
    console.log('Run: npx tsx scripts/generate-icons.ts public/your-logo.png');

  } catch (error) {
    console.error('Error generating icons:', error);
    process.exit(1);
  }
}

generatePlaceholderIcons();
