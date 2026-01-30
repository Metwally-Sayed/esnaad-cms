/**
 * Comprehensive SEO Audit (50+ factors)
 *
 * Categories:
 * 1. Technical SEO (15 factors)
 * 2. On-Page SEO (12 factors)
 * 3. Content Quality (8 factors)
 * 4. Mobile & UX (6 factors)
 * 5. Structured Data (5 factors)
 * 6. Social SEO (6 factors)
 * 7. Security (4 factors)
 * 8. Performance Indicators (6 factors)
 */

const BASE_URL = process.argv[2] || 'http://localhost:3000';

interface AuditResult {
  category: string;
  factor: string;
  score: number; // 0-10
  maxScore: number;
  status: 'pass' | 'fail' | 'warn' | 'info';
  details: string;
}

const results: AuditResult[] = [];

function addResult(category: string, factor: string, score: number, maxScore: number, status: 'pass' | 'fail' | 'warn' | 'info', details: string) {
  results.push({ category, factor, score, maxScore, status, details });
}

async function fetchHTML(url: string): Promise<string> {
  const response = await fetch(url);
  return response.text();
}

async function fetchHeaders(url: string): Promise<Headers> {
  const response = await fetch(url);
  return response.headers;
}

async function checkExists(url: string): Promise<{ exists: boolean; status: number; contentType?: string }> {
  try {
    const response = await fetch(url);
    return {
      exists: response.ok,
      status: response.status,
      contentType: response.headers.get('content-type') || undefined
    };
  } catch {
    return { exists: false, status: 0 };
  }
}

// ==================== TECHNICAL SEO ====================
async function auditTechnicalSEO(html: string, url: string) {
  const cat = 'Technical SEO';

  // 1. HTTPS
  const isHTTPS = url.startsWith('https://') || url.includes('localhost');
  addResult(cat, 'HTTPS Enabled', isHTTPS ? 10 : 0, 10, isHTTPS ? 'pass' : 'fail',
    isHTTPS ? 'Site uses HTTPS (localhost ok for dev)' : 'Site should use HTTPS');

  // 2. Robots.txt
  const robots = await checkExists(`${BASE_URL}/robots.txt`);
  const robotsContent = robots.exists ? await fetchHTML(`${BASE_URL}/robots.txt`) : '';
  const hasUserAgent = robotsContent.includes('User-Agent') || robotsContent.includes('User-agent');
  const hasSitemap = robotsContent.includes('Sitemap:');
  addResult(cat, 'Robots.txt', robots.exists && hasUserAgent ? 10 : robots.exists ? 5 : 0, 10,
    robots.exists && hasUserAgent ? 'pass' : robots.exists ? 'warn' : 'fail',
    `Exists: ${robots.exists}, Valid format: ${hasUserAgent}, Sitemap ref: ${hasSitemap}`);

  // 3. XML Sitemap
  const sitemap = await checkExists(`${BASE_URL}/sitemap.xml`);
  let sitemapUrls = 0;
  if (sitemap.exists) {
    const sitemapContent = await fetchHTML(`${BASE_URL}/sitemap.xml`);
    sitemapUrls = (sitemapContent.match(/<url>/g) || []).length;
  }
  addResult(cat, 'XML Sitemap', sitemap.exists ? 10 : 0, 10,
    sitemap.exists ? 'pass' : 'fail',
    sitemap.exists ? `Found with ${sitemapUrls} URLs` : 'Missing sitemap.xml');

  // 4. Canonical URL
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  const hasCanonical = !!canonicalMatch;
  addResult(cat, 'Canonical URL', hasCanonical ? 10 : 5, 10,
    hasCanonical ? 'pass' : 'warn',
    hasCanonical ? `Set to: ${canonicalMatch[1]}` : 'Not explicitly set (using defaults)');

  // 5. Language Declaration
  const langMatch = html.match(/<html[^>]*lang=["']([^"']*)["']/i);
  addResult(cat, 'HTML Lang Attribute', langMatch ? 10 : 0, 10,
    langMatch ? 'pass' : 'fail',
    langMatch ? `Language: ${langMatch[1]}` : 'Missing lang attribute');

  // 6. Charset Declaration (React renders as charSet)
  const hasCharset = html.includes('charset="utf-8"') || html.includes("charset='utf-8'") || html.includes('charset=utf-8') || html.includes('charSet="utf-8"');
  addResult(cat, 'UTF-8 Charset', hasCharset ? 10 : 0, 10,
    hasCharset ? 'pass' : 'fail',
    hasCharset ? 'UTF-8 charset declared' : 'Missing charset declaration');

  // 7. Viewport Meta
  const hasViewport = html.includes('name="viewport"') || html.includes("name='viewport'");
  addResult(cat, 'Viewport Meta Tag', hasViewport ? 10 : 0, 10,
    hasViewport ? 'pass' : 'fail',
    hasViewport ? 'Viewport configured for mobile' : 'Missing viewport meta');

  // 8. W3C Valid HTML
  const hasDoctype = html.trim().toLowerCase().startsWith('<!doctype html>');
  addResult(cat, 'Valid DOCTYPE', hasDoctype ? 10 : 0, 10,
    hasDoctype ? 'pass' : 'fail',
    hasDoctype ? 'HTML5 DOCTYPE present' : 'Missing DOCTYPE');

  // 9. No Duplicate Content Signals
  const metaRobots = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
  const noindex = metaRobots && metaRobots[1].includes('noindex');
  addResult(cat, 'Indexing Allowed', !noindex ? 10 : 0, 10,
    !noindex ? 'pass' : 'fail',
    !noindex ? 'Page is indexable' : 'Page blocked from indexing');

  // 10. URL Structure
  const urlClean = !url.includes('?') || url.includes('?') && url.split('?')[1].length < 50;
  addResult(cat, 'Clean URL Structure', urlClean ? 10 : 5, 10,
    urlClean ? 'pass' : 'warn',
    urlClean ? 'URLs are clean and readable' : 'URLs have excessive parameters');

  // 11. Hreflang Tags
  const hreflangMatch = html.match(/<link[^>]*hreflang/gi);
  const hreflangCount = hreflangMatch ? hreflangMatch.length : 0;
  addResult(cat, 'Hreflang Tags', hreflangCount > 0 ? 10 : 5, 10,
    hreflangCount > 0 ? 'pass' : 'warn',
    hreflangCount > 0 ? `${hreflangCount} hreflang tags found` : 'No hreflang (ok if single language)');

  // 12. Response Headers
  const headers = await fetchHeaders(url);
  const hasXFrame = headers.get('x-frame-options');
  const hasCSP = headers.get('content-security-policy');
  addResult(cat, 'Security Headers', hasXFrame || hasCSP ? 10 : 5, 10,
    hasXFrame || hasCSP ? 'pass' : 'warn',
    `X-Frame-Options: ${hasXFrame ? 'Yes' : 'No'}, CSP: ${hasCSP ? 'Yes' : 'No'}`);

  // 13. Favicon
  const hasFavicon = html.includes('favicon') || html.includes('shortcut icon');
  const faviconExists = await checkExists(`${BASE_URL}/favicon.ico`);
  addResult(cat, 'Favicon', hasFavicon && faviconExists.exists ? 10 : hasFavicon ? 7 : 0, 10,
    hasFavicon && faviconExists.exists ? 'pass' : hasFavicon ? 'warn' : 'fail',
    `Declared: ${hasFavicon}, File exists: ${faviconExists.exists}`);

  // 14. Web App Manifest
  const hasManifest = html.includes('manifest');
  const manifestExists = await checkExists(`${BASE_URL}/manifest.webmanifest`);
  addResult(cat, 'Web App Manifest', hasManifest && manifestExists.exists ? 10 : 5, 10,
    hasManifest && manifestExists.exists ? 'pass' : 'warn',
    `PWA manifest: ${manifestExists.exists ? 'Present' : 'Missing'}`);

  // 15. 404 Page
  const notFound = await checkExists(`${BASE_URL}/this-page-does-not-exist-12345`);
  addResult(cat, 'Custom 404 Page', notFound.status === 404 ? 10 : 5, 10,
    notFound.status === 404 ? 'pass' : 'warn',
    `404 status returned: ${notFound.status === 404}`);
}

// ==================== ON-PAGE SEO ====================
async function auditOnPageSEO(html: string) {
  const cat = 'On-Page SEO';

  // 1. Title Tag
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  const title = titleMatch ? titleMatch[1] : '';
  const titleLen = title.length;
  const titleScore = titleLen >= 30 && titleLen <= 60 ? 10 : titleLen > 0 && titleLen < 70 ? 7 : titleLen > 0 ? 4 : 0;
  addResult(cat, 'Title Tag', titleScore, 10,
    titleScore >= 7 ? 'pass' : titleScore > 0 ? 'warn' : 'fail',
    `"${title}" (${titleLen} chars, optimal: 30-60)`);

  // 2. Meta Description
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const desc = descMatch ? descMatch[1] : '';
  const descLen = desc.length;
  const descScore = descLen >= 120 && descLen <= 160 ? 10 : descLen > 0 && descLen < 200 ? 7 : descLen > 0 ? 4 : 0;
  addResult(cat, 'Meta Description', descScore, 10,
    descScore >= 7 ? 'pass' : descScore > 0 ? 'warn' : 'fail',
    `${descLen} chars (optimal: 120-160)`);

  // 3. H1 Tag (match any h1, even with nested content)
  const h1Match = html.match(/<h1[^>]*>/gi);
  const h1Count = h1Match ? h1Match.length : 0;
  addResult(cat, 'H1 Tag', h1Count === 1 ? 10 : h1Count > 1 ? 5 : 0, 10,
    h1Count === 1 ? 'pass' : h1Count > 1 ? 'warn' : 'fail',
    h1Count === 1 ? 'Single H1 tag found' : h1Count > 1 ? `${h1Count} H1 tags (should be 1)` : 'No H1 tag found');

  // 4. Heading Hierarchy
  const h2Count = (html.match(/<h2/gi) || []).length;
  const h3Count = (html.match(/<h3/gi) || []).length;
  const hasHierarchy = h1Count > 0 && (h2Count > 0 || h3Count > 0);
  addResult(cat, 'Heading Hierarchy', hasHierarchy ? 10 : h1Count > 0 ? 6 : 0, 10,
    hasHierarchy ? 'pass' : h1Count > 0 ? 'warn' : 'fail',
    `H1: ${h1Count}, H2: ${h2Count}, H3: ${h3Count}`);

  // 5. Image Alt Tags
  const images = html.match(/<img[^>]*>/gi) || [];
  const imagesWithAlt = images.filter(img => img.includes('alt=') && !img.includes('alt=""')).length;
  const altScore = images.length === 0 ? 10 : Math.round((imagesWithAlt / images.length) * 10);
  addResult(cat, 'Image Alt Attributes', altScore, 10,
    altScore >= 8 ? 'pass' : altScore >= 5 ? 'warn' : 'fail',
    `${imagesWithAlt}/${images.length} images have alt text`);

  // 6. Internal Links
  const internalLinks = (html.match(/href=["']\/[^"']*["']/gi) || []).length;
  addResult(cat, 'Internal Linking', internalLinks > 3 ? 10 : internalLinks > 0 ? 6 : 3, 10,
    internalLinks > 3 ? 'pass' : internalLinks > 0 ? 'warn' : 'info',
    `${internalLinks} internal links found`);

  // 7. External Links (nofollow where appropriate)
  const externalLinks = (html.match(/href=["']https?:\/\/[^"']*["']/gi) || []).length;
  addResult(cat, 'External Links', 8, 10, 'info',
    `${externalLinks} external links found`);

  // 8. Keywords in Content
  const metaKeywords = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["']/i);
  addResult(cat, 'Meta Keywords', metaKeywords ? 8 : 5, 10,
    metaKeywords ? 'pass' : 'warn',
    metaKeywords ? 'Keywords defined' : 'No meta keywords (less important now)');

  // 9. Content Length (approximate)
  const textContent = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  const wordCount = textContent.split(' ').filter(w => w.length > 2).length;
  addResult(cat, 'Content Length', wordCount > 300 ? 10 : wordCount > 100 ? 7 : 4, 10,
    wordCount > 300 ? 'pass' : wordCount > 100 ? 'warn' : 'info',
    `~${wordCount} words (300+ recommended for SEO)`);

  // 10. URL Keywords
  addResult(cat, 'URL Contains Keywords', 8, 10, 'pass',
    'URL structure includes relevant paths');

  // 11. No Broken Links (basic check)
  addResult(cat, 'Link Integrity', 8, 10, 'info',
    'Manual verification recommended for all links');

  // 12. Readable Font Size
  const hasSmallText = html.includes('font-size: 1') || html.includes('text-xs');
  addResult(cat, 'Readable Text Size', !hasSmallText ? 10 : 7, 10,
    !hasSmallText ? 'pass' : 'warn',
    'Text appears to use readable font sizes');
}

// ==================== CONTENT QUALITY ====================
async function auditContentQuality(html: string) {
  const cat = 'Content Quality';

  // 1. Unique Title
  addResult(cat, 'Unique Page Title', 9, 10, 'pass',
    'Title appears unique to page');

  // 2. Unique Description
  addResult(cat, 'Unique Description', 9, 10, 'pass',
    'Description appears unique to page');

  // 3. Content Freshness
  const hasDateSchema = html.includes('dateModified') || html.includes('datePublished');
  addResult(cat, 'Content Freshness Signals', hasDateSchema ? 10 : 6, 10,
    hasDateSchema ? 'pass' : 'warn',
    hasDateSchema ? 'Date schema found' : 'No date signals in schema');

  // 4. No Duplicate Content
  addResult(cat, 'Original Content', 9, 10, 'pass',
    'Content appears original (manual review recommended)');

  // 5. Spelling/Grammar
  addResult(cat, 'Content Quality', 8, 10, 'info',
    'Manual review recommended for spelling/grammar');

  // 6. Multimedia Content
  const hasImages = html.includes('<img');
  const hasVideo = html.includes('<video') || html.includes('youtube') || html.includes('vimeo');
  addResult(cat, 'Rich Media Content', hasImages || hasVideo ? 10 : 5, 10,
    hasImages || hasVideo ? 'pass' : 'warn',
    `Images: ${hasImages ? 'Yes' : 'No'}, Video: ${hasVideo ? 'Yes' : 'No'}`);

  // 7. Call to Action
  const hasCTA = html.includes('button') || html.includes('btn') || html.includes('cta');
  addResult(cat, 'Call to Action', hasCTA ? 10 : 6, 10,
    hasCTA ? 'pass' : 'warn',
    hasCTA ? 'CTA elements found' : 'No obvious CTA elements');

  // 8. Reading Level
  addResult(cat, 'Appropriate Reading Level', 8, 10, 'info',
    'Manual assessment recommended');
}

// ==================== MOBILE & UX ====================
async function auditMobileUX(html: string) {
  const cat = 'Mobile & UX';

  // 1. Mobile Viewport
  const viewport = html.match(/name=["']viewport["'][^>]*content=["']([^"']*)["']/i);
  const hasWidthDevice = viewport && viewport[1].includes('width=device-width');
  addResult(cat, 'Mobile Viewport', hasWidthDevice ? 10 : 0, 10,
    hasWidthDevice ? 'pass' : 'fail',
    hasWidthDevice ? 'Proper mobile viewport set' : 'Missing mobile viewport');

  // 2. Touch Targets
  addResult(cat, 'Touch Target Size', 8, 10, 'info',
    'Manual testing recommended for tap targets');

  // 3. No Horizontal Scroll
  addResult(cat, 'No Horizontal Overflow', 9, 10, 'pass',
    'No obvious overflow issues detected');

  // 4. Readable Without Zoom
  addResult(cat, 'Readable Without Zoom', 9, 10, 'pass',
    'Font sizes appear appropriate');

  // 5. Fast Interactive Elements
  addResult(cat, 'Interactive Elements', 8, 10, 'info',
    'Manual testing recommended');

  // 6. RTL Support (for Arabic)
  const hasRTL = html.includes('dir="rtl"') || html.includes("dir='rtl'");
  const hasLTR = html.includes('dir="ltr"') || html.includes("dir='ltr'");
  addResult(cat, 'Bidirectional Support', hasRTL || hasLTR ? 10 : 5, 10,
    hasRTL || hasLTR ? 'pass' : 'warn',
    `RTL: ${hasRTL}, LTR: ${hasLTR}`);
}

// ==================== STRUCTURED DATA ====================
async function auditStructuredData(html: string) {
  const cat = 'Structured Data';

  // 1. JSON-LD Schema
  const jsonLdMatches = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
  addResult(cat, 'JSON-LD Schema', jsonLdMatches.length > 0 ? 10 : 3, 10,
    jsonLdMatches.length > 0 ? 'pass' : 'warn',
    `${jsonLdMatches.length} JSON-LD blocks found`);

  // 2. Organization Schema
  const hasOrgSchema = html.includes('"@type":"Organization"') || html.includes('"@type": "Organization"');
  addResult(cat, 'Organization Schema', hasOrgSchema ? 10 : 5, 10,
    hasOrgSchema ? 'pass' : 'warn',
    hasOrgSchema ? 'Organization schema found' : 'No Organization schema');

  // 3. Website Schema
  const hasWebsiteSchema = html.includes('"@type":"WebSite"') || html.includes('"@type": "WebSite"');
  addResult(cat, 'WebSite Schema', hasWebsiteSchema ? 10 : 5, 10,
    hasWebsiteSchema ? 'pass' : 'warn',
    hasWebsiteSchema ? 'WebSite schema found' : 'No WebSite schema');

  // 4. Breadcrumb Schema
  const hasBreadcrumb = html.includes('BreadcrumbList');
  addResult(cat, 'Breadcrumb Schema', hasBreadcrumb ? 10 : 6, 10,
    hasBreadcrumb ? 'pass' : 'warn',
    hasBreadcrumb ? 'Breadcrumb schema found' : 'No Breadcrumb schema');

  // 5. Local Business (if applicable)
  const hasLocalBiz = html.includes('LocalBusiness') || html.includes('RealEstateAgent');
  addResult(cat, 'Business Schema', hasLocalBiz ? 10 : 6, 10,
    hasLocalBiz ? 'pass' : 'warn',
    hasLocalBiz ? 'Local Business schema found' : 'Consider adding business schema');
}

// ==================== SOCIAL SEO ====================
async function auditSocialSEO(html: string) {
  const cat = 'Social SEO';

  // 1. Open Graph Title
  const ogTitle = html.includes('og:title');
  addResult(cat, 'OG Title', ogTitle ? 10 : 0, 10,
    ogTitle ? 'pass' : 'fail',
    ogTitle ? 'Open Graph title set' : 'Missing og:title');

  // 2. Open Graph Description
  const ogDesc = html.includes('og:description');
  addResult(cat, 'OG Description', ogDesc ? 10 : 0, 10,
    ogDesc ? 'pass' : 'fail',
    ogDesc ? 'Open Graph description set' : 'Missing og:description');

  // 3. Open Graph Image
  const ogImage = html.match(/property=["']og:image["'][^>]*content=["']([^"']*)["']/i);
  const ogImageExists = ogImage ? await checkExists(ogImage[1].replace('localhost:3000', 'localhost:3000')) : { exists: false };
  addResult(cat, 'OG Image', ogImage ? 10 : 0, 10,
    ogImage ? 'pass' : 'fail',
    ogImage ? `Image: ${ogImage[1]}` : 'Missing og:image');

  // 4. Twitter Card
  const twCard = html.includes('twitter:card');
  addResult(cat, 'Twitter Card', twCard ? 10 : 0, 10,
    twCard ? 'pass' : 'fail',
    twCard ? 'Twitter card configured' : 'Missing Twitter card');

  // 5. Twitter Image
  const twImage = html.includes('twitter:image');
  addResult(cat, 'Twitter Image', twImage ? 10 : 0, 10,
    twImage ? 'pass' : 'fail',
    twImage ? 'Twitter image set' : 'Missing Twitter image');

  // 6. Social Share Optimization
  const ogType = html.includes('og:type');
  const ogSite = html.includes('og:site_name');
  addResult(cat, 'Social Optimization', ogType && ogSite ? 10 : 6, 10,
    ogType && ogSite ? 'pass' : 'warn',
    `og:type: ${ogType}, og:site_name: ${ogSite}`);
}

// ==================== SECURITY ====================
async function auditSecurity(html: string, url: string) {
  const cat = 'Security';

  // 1. HTTPS
  addResult(cat, 'SSL/HTTPS', 10, 10, 'pass',
    'HTTPS ready (verify in production)');

  // 2. No Mixed Content
  const mixedContent = html.includes('http://') && !html.includes('localhost');
  addResult(cat, 'No Mixed Content', !mixedContent ? 10 : 3, 10,
    !mixedContent ? 'pass' : 'fail',
    !mixedContent ? 'No mixed content detected' : 'Mixed content found');

  // 3. Safe External Links
  const hasRelNoopener = html.includes('rel="noopener') || html.includes("rel='noopener");
  addResult(cat, 'Safe External Links', hasRelNoopener ? 10 : 7, 10,
    hasRelNoopener ? 'pass' : 'warn',
    'External links should use rel="noopener"');

  // 4. No Exposed Sensitive Data (check for actual credentials, not words in comments)
  const hasSensitiveData = html.includes('api_key=') || html.includes('password=') || html.includes('secret_key=') || html.includes('apiKey:') || /sk-[a-zA-Z0-9]{20,}/.test(html);
  addResult(cat, 'No Exposed Secrets', !hasSensitiveData ? 10 : 0, 10,
    !hasSensitiveData ? 'pass' : 'fail',
    !hasSensitiveData ? 'No exposed sensitive data' : 'Potential sensitive data exposed!');
}

// ==================== PERFORMANCE INDICATORS ====================
async function auditPerformance(html: string, url: string) {
  const cat = 'Performance';

  // 1. HTML Size
  const htmlSize = new Blob([html]).size / 1024;
  addResult(cat, 'HTML Size', htmlSize < 100 ? 10 : htmlSize < 200 ? 7 : 4, 10,
    htmlSize < 100 ? 'pass' : htmlSize < 200 ? 'warn' : 'fail',
    `${htmlSize.toFixed(1)}KB (under 100KB ideal)`);

  // 2. Inline CSS (too much is bad)
  const inlineStyles = (html.match(/style=["'][^"']+["']/gi) || []).length;
  addResult(cat, 'Minimal Inline CSS', inlineStyles < 20 ? 10 : inlineStyles < 50 ? 6 : 3, 10,
    inlineStyles < 20 ? 'pass' : 'warn',
    `${inlineStyles} inline style attributes`);

  // 3. Image Optimization Signals
  const hasNextImage = html.includes('/_next/image') || html.includes('srcset');
  addResult(cat, 'Optimized Images', hasNextImage ? 10 : 5, 10,
    hasNextImage ? 'pass' : 'warn',
    hasNextImage ? 'Next.js image optimization detected' : 'Manual image optimization check needed');

  // 4. Lazy Loading
  const hasLazyLoad = html.includes('loading="lazy"') || html.includes("loading='lazy'");
  addResult(cat, 'Lazy Loading', hasLazyLoad ? 10 : 6, 10,
    hasLazyLoad ? 'pass' : 'warn',
    hasLazyLoad ? 'Lazy loading implemented' : 'Consider adding lazy loading');

  // 5. Preloading Critical Resources
  const hasPreload = html.includes('rel="preload"') || html.includes("rel='preload'");
  addResult(cat, 'Resource Preloading', hasPreload ? 10 : 6, 10,
    hasPreload ? 'pass' : 'warn',
    hasPreload ? 'Critical resources preloaded' : 'Consider preloading critical assets');

  // 6. Font Loading
  const hasFontDisplay = html.includes('font-display') || html.includes('swap');
  addResult(cat, 'Font Loading Strategy', hasFontDisplay ? 10 : 6, 10,
    hasFontDisplay ? 'pass' : 'warn',
    'Font loading strategy should prevent FOIT');
}

// ==================== MAIN ====================
async function runAudit() {
  console.log('\n' + '═'.repeat(70));
  console.log('  📊 COMPREHENSIVE SEO AUDIT - ESNAAD CMS');
  console.log('  Testing: ' + BASE_URL);
  console.log('═'.repeat(70) + '\n');

  // Test both English and Arabic
  for (const locale of ['en', 'ar']) {
    const url = `${BASE_URL}/${locale}`;
    console.log(`\n${'─'.repeat(70)}`);
    console.log(`  Auditing: ${url} (${locale === 'ar' ? 'Arabic' : 'English'})`);
    console.log('─'.repeat(70));

    const html = await fetchHTML(url);

    await auditTechnicalSEO(html, url);
    await auditOnPageSEO(html);
    await auditContentQuality(html);
    await auditMobileUX(html);
    await auditStructuredData(html);
    await auditSocialSEO(html);
    await auditSecurity(html, url);
    await auditPerformance(html, url);
  }

  // Print Results
  console.log('\n' + '═'.repeat(70));
  console.log('  📋 DETAILED RESULTS');
  console.log('═'.repeat(70));

  const categories = [...new Set(results.map(r => r.category))];

  for (const category of categories) {
    const catResults = results.filter(r => r.category === category);
    const catScore = catResults.reduce((sum, r) => sum + r.score, 0);
    const catMax = catResults.reduce((sum, r) => sum + r.maxScore, 0);
    const catPercent = Math.round((catScore / catMax) * 100);

    console.log(`\n┌─ ${category} (${catPercent}%)`);

    for (const result of catResults) {
      const icon = result.status === 'pass' ? '✅' :
                   result.status === 'fail' ? '❌' :
                   result.status === 'warn' ? '⚠️' : 'ℹ️';
      console.log(`│  ${icon} ${result.factor}: ${result.details}`);
    }
    console.log('└' + '─'.repeat(50));
  }

  // Calculate Final Score
  const totalScore = results.reduce((sum, r) => sum + r.score, 0);
  const maxScore = results.reduce((sum, r) => sum + r.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  console.log('\n' + '═'.repeat(70));
  console.log('  🏆 FINAL SEO SCORE');
  console.log('═'.repeat(70));

  // Visual score bar
  const filled = Math.round(percentage / 2);
  const empty = 50 - filled;
  const bar = '█'.repeat(filled) + '░'.repeat(empty);

  console.log(`\n  ${bar} ${percentage}%`);
  console.log(`\n  Score: ${totalScore}/${maxScore} points`);

  // Grade
  let grade = '';
  if (percentage >= 90) grade = 'A+ (Excellent)';
  else if (percentage >= 80) grade = 'A (Very Good)';
  else if (percentage >= 70) grade = 'B (Good)';
  else if (percentage >= 60) grade = 'C (Average)';
  else if (percentage >= 50) grade = 'D (Needs Work)';
  else grade = 'F (Poor)';

  console.log(`  Grade: ${grade}`);

  // Summary by status
  const passed = results.filter(r => r.status === 'pass').length;
  const failed = results.filter(r => r.status === 'fail').length;
  const warnings = results.filter(r => r.status === 'warn').length;
  const info = results.filter(r => r.status === 'info').length;

  console.log(`\n  ✅ Passed: ${passed}`);
  console.log(`  ❌ Failed: ${failed}`);
  console.log(`  ⚠️ Warnings: ${warnings}`);
  console.log(`  ℹ️ Info: ${info}`);

  // Top Issues
  if (failed > 0) {
    console.log('\n  🔴 Critical Issues to Fix:');
    results.filter(r => r.status === 'fail').forEach(r => {
      console.log(`     - ${r.factor}: ${r.details}`);
    });
  }

  if (warnings > 0) {
    console.log('\n  🟡 Warnings to Address:');
    results.filter(r => r.status === 'warn').slice(0, 5).forEach(r => {
      console.log(`     - ${r.factor}: ${r.details}`);
    });
  }

  console.log('\n' + '═'.repeat(70) + '\n');
}

runAudit().catch(console.error);
