/**
 * SEO Testing Script
 *
 * Tests all SEO elements including:
 * - Meta tags (title, description, keywords)
 * - Open Graph tags
 * - Twitter Card tags
 * - Favicon and icons
 * - Sitemap
 * - Robots.txt
 * - Structured data (JSON-LD)
 *
 * Usage: npx tsx scripts/test-seo.ts [url]
 * Default URL: http://localhost:3000
 */

const BASE_URL = process.argv[2] || 'http://localhost:3000';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  value?: string;
}

const results: TestResult[] = [];

function log(result: TestResult) {
  const icon = result.status === 'pass' ? '✅' : result.status === 'fail' ? '❌' : '⚠️';
  console.log(`${icon} ${result.name}: ${result.message}`);
  if (result.value) {
    console.log(`   → ${result.value.substring(0, 100)}${result.value.length > 100 ? '...' : ''}`);
  }
  results.push(result);
}

async function fetchHTML(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.text();
}

function extractMetaContent(html: string, name: string, attribute = 'name'): string | null {
  const regex = new RegExp(`<meta\\s+${attribute}=["']${name}["']\\s+content=["']([^"']*)["']`, 'i');
  const altRegex = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+${attribute}=["']${name}["']`, 'i');
  const match = html.match(regex) || html.match(altRegex);
  return match ? match[1] : null;
}

function extractTitle(html: string): string | null {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match ? match[1] : null;
}

function extractLinkHref(html: string, rel: string): string | null {
  const regex = new RegExp(`<link\\s+[^>]*rel=["']${rel}["'][^>]*href=["']([^"']*)["']`, 'i');
  const altRegex = new RegExp(`<link\\s+[^>]*href=["']([^"']*)["'][^>]*rel=["']${rel}["']`, 'i');
  const match = html.match(regex) || html.match(altRegex);
  return match ? match[1] : null;
}

async function testPage(path: string, locale: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${BASE_URL}${path} (${locale.toUpperCase()})`);
  console.log('='.repeat(60));

  try {
    const html = await fetchHTML(`${BASE_URL}${path}`);

    // Title
    const title = extractTitle(html);
    if (title && title.length > 0) {
      log({ name: 'Title', status: title.length <= 60 ? 'pass' : 'warn', message: `Found (${title.length} chars)`, value: title });
    } else {
      log({ name: 'Title', status: 'fail', message: 'Missing' });
    }

    // Description
    const description = extractMetaContent(html, 'description');
    if (description && description.length > 0) {
      log({ name: 'Meta Description', status: description.length <= 160 ? 'pass' : 'warn', message: `Found (${description.length} chars)`, value: description });
    } else {
      log({ name: 'Meta Description', status: 'fail', message: 'Missing' });
    }

    // Keywords
    const keywords = extractMetaContent(html, 'keywords');
    log({ name: 'Meta Keywords', status: keywords ? 'pass' : 'warn', message: keywords ? 'Found' : 'Missing (optional)', value: keywords || undefined });

    // Open Graph
    console.log('\n📱 Open Graph Tags:');
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url', 'og:type', 'og:site_name', 'og:locale'];
    for (const tag of ogTags) {
      const value = extractMetaContent(html, tag, 'property');
      log({ name: `  ${tag}`, status: value ? 'pass' : 'fail', message: value ? 'Found' : 'Missing', value: value || undefined });
    }

    // Twitter Cards
    console.log('\n🐦 Twitter Card Tags:');
    const twitterTags = ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'];
    for (const tag of twitterTags) {
      const value = extractMetaContent(html, tag);
      log({ name: `  ${tag}`, status: value ? 'pass' : 'fail', message: value ? 'Found' : 'Missing', value: value || undefined });
    }

    // Favicon & Icons
    console.log('\n🎨 Icons:');
    const favicon = extractLinkHref(html, 'icon') || extractLinkHref(html, 'shortcut icon');
    log({ name: '  Favicon', status: favicon ? 'pass' : 'fail', message: favicon ? 'Found' : 'Missing', value: favicon || undefined });

    const appleIcon = extractLinkHref(html, 'apple-touch-icon');
    log({ name: '  Apple Touch Icon', status: appleIcon ? 'pass' : 'fail', message: appleIcon ? 'Found' : 'Missing', value: appleIcon || undefined });

    const manifest = extractLinkHref(html, 'manifest');
    log({ name: '  Web Manifest', status: manifest ? 'pass' : 'fail', message: manifest ? 'Found' : 'Missing', value: manifest || undefined });

    // Canonical URL
    const canonical = extractLinkHref(html, 'canonical');
    log({ name: 'Canonical URL', status: canonical ? 'pass' : 'warn', message: canonical ? 'Found' : 'Not set (optional)', value: canonical || undefined });

    // Robots
    const robots = extractMetaContent(html, 'robots');
    log({ name: 'Robots Meta', status: 'pass', message: robots || 'Using defaults', value: robots || undefined });

    // Structured Data (JSON-LD)
    const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
    log({ name: 'Structured Data (JSON-LD)', status: jsonLdMatch ? 'pass' : 'warn', message: jsonLdMatch ? 'Found' : 'Not found (optional)' });

    // Viewport
    const viewport = extractMetaContent(html, 'viewport');
    log({ name: 'Viewport', status: viewport ? 'pass' : 'fail', message: viewport ? 'Found' : 'Missing', value: viewport || undefined });

    // Language
    const langMatch = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
    const lang = langMatch ? langMatch[1] : null;
    log({ name: 'HTML Lang', status: lang ? 'pass' : 'fail', message: lang ? `Set to "${lang}"` : 'Missing' });

    // Dir attribute for RTL
    const dirMatch = html.match(/<html[^>]*dir=["']([^"']*)["']/i);
    const dir = dirMatch ? dirMatch[1] : null;
    const expectedDir = locale === 'ar' ? 'rtl' : 'ltr';
    log({ name: 'HTML Dir', status: dir === expectedDir ? 'pass' : 'fail', message: dir ? `Set to "${dir}"` : 'Missing', value: `Expected: ${expectedDir}` });

  } catch (error) {
    console.error(`Error testing ${path}:`, error);
  }
}

async function testStaticFiles() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('Testing Static SEO Files');
  console.log('='.repeat(60));

  // Sitemap
  try {
    const sitemap = await fetchHTML(`${BASE_URL}/sitemap.xml`);
    const urlCount = (sitemap.match(/<url>/g) || []).length;
    log({ name: 'Sitemap', status: 'pass', message: `Found with ${urlCount} URLs` });
  } catch {
    log({ name: 'Sitemap', status: 'fail', message: 'Not accessible' });
  }

  // Robots.txt
  try {
    const robots = await fetchHTML(`${BASE_URL}/robots.txt`);
    const hasSitemap = robots.includes('Sitemap:');
    const hasUserAgent = robots.includes('User-agent:');
    log({ name: 'Robots.txt', status: hasUserAgent ? 'pass' : 'fail', message: hasUserAgent ? 'Valid format' : 'Invalid format' });
    log({ name: '  Sitemap Reference', status: hasSitemap ? 'pass' : 'warn', message: hasSitemap ? 'Found' : 'Missing' });
  } catch {
    log({ name: 'Robots.txt', status: 'fail', message: 'Not accessible' });
  }

  // Manifest
  try {
    const manifest = await fetchHTML(`${BASE_URL}/manifest.json`);
    const parsed = JSON.parse(manifest);
    log({ name: 'Web Manifest', status: 'pass', message: `Valid JSON - App: "${parsed.name}"` });
    log({ name: '  Icons', status: parsed.icons?.length > 0 ? 'pass' : 'fail', message: `${parsed.icons?.length || 0} icons defined` });
  } catch {
    log({ name: 'Web Manifest', status: 'fail', message: 'Not accessible or invalid' });
  }

  // Test icon files
  console.log('\n🖼️ Icon Files:');
  const iconFiles = ['/favicon.ico', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png', '/og-image.png', '/og-image-ar.png'];
  for (const icon of iconFiles) {
    try {
      const response = await fetch(`${BASE_URL}${icon}`);
      log({ name: `  ${icon}`, status: response.ok ? 'pass' : 'fail', message: response.ok ? `OK (${response.headers.get('content-type')})` : `HTTP ${response.status}` });
    } catch {
      log({ name: `  ${icon}`, status: 'fail', message: 'Not accessible' });
    }
  }
}

async function printSummary() {
  console.log(`\n${'='.repeat(60)}`);
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));

  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warned = results.filter(r => r.status === 'warn').length;

  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`⚠️ Warnings: ${warned}`);
  console.log(`📈 Score: ${Math.round((passed / results.length) * 100)}%`);

  if (failed > 0) {
    console.log('\n❌ Failed Items:');
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`   - ${r.name}: ${r.message}`);
    });
  }

  console.log('\n📋 Next Steps:');
  console.log('1. Run Lighthouse in Chrome DevTools (F12 → Lighthouse tab)');
  console.log('2. Test social sharing: https://developers.facebook.com/tools/debug/');
  console.log('3. Test Twitter cards: https://cards-dev.twitter.com/validator');
  console.log('4. Validate structured data: https://search.google.com/test/rich-results');
  console.log('5. Check mobile-friendliness: https://search.google.com/test/mobile-friendly');
}

async function main() {
  console.log('🔍 SEO Test Suite for Esnaad CMS');
  console.log(`Testing against: ${BASE_URL}`);

  // Test English homepage
  await testPage('/en', 'en');

  // Test Arabic homepage
  await testPage('/ar', 'ar');

  // Test static files
  await testStaticFiles();

  // Print summary
  await printSummary();
}

main().catch(console.error);
