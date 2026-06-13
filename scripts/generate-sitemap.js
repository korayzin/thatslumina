/**
 * Generates sitemap.xml from lib/metadata.js page registry.
 * Run: node scripts/generate-sitemap.js
 */

const fs = require('fs');
const path = require('path');
const { getAllPagesForSitemap, getCanonicalUrl } = require('../lib/metadata');

const OUTPUT = path.join(__dirname, '..', 'sitemap.xml');
const lastmod = new Date().toISOString().split('T')[0];

const urls = getAllPagesForSitemap()
  .map((page) => {
    const loc = getCanonicalUrl(page);
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

fs.writeFileSync(OUTPUT, xml, 'utf8');
console.log(`Wrote ${OUTPUT} (${getAllPagesForSitemap().length} URLs)`);
