/**
 * Central page metadata registry and HTML head tag builder.
 * Single source of truth for titles, descriptions, canonical URLs, and OG tags.
 *
 * @example
 * const { getPageMeta, buildHeadTags } = require('./metadata');
 * const meta = getPageMeta('home');
 * // Inject buildHeadTags(meta) output into <head> during build or SSR.
 */

const { SITE_URL } = require('./site-config');

/** @typedef {'page' | 'article' | 'website'} OgType */

/**
 * @typedef {Object} PageMeta
 * @property {string} id
 * @property {string} path
 * @property {string} title
 * @property {string} description
 * @property {number} priority
 * @property {string} changefreq
 * @property {OgType} [ogType]
 * @property {boolean} [noindex]
 */

/** @type {Record<string, PageMeta>} */
const PAGE_REGISTRY = {
  home: {
    id: 'home',
    path: '/',
    title: 'Lumina - Yeni Nesil Dijital Ortaklık',
    description:
      'Lumina — yeni nesil dijital ortaklık. Markalar için kreatif üretim, AI destekli kampanya görselleri ve işletmenize özel otomasyon çözümleri.',
    priority: 1.0,
    changefreq: 'weekly',
    ogType: 'website',
  },
  icerik: {
    id: 'icerik',
    path: '/icerik.html',
    title: "That's Lumina · İçerik Üretimi",
    description: "Lumina'nın hazırladığı kampanya ve içerik üretim galerisi.",
    priority: 0.6,
    changefreq: 'monthly',
    ogType: 'website',
  },
  otomasyon: {
    id: 'otomasyon',
    path: '/otomasyon.html',
    title: "That's Lumina · Otomasyonlar",
    description:
      'İşletmenizde zaman kaybettiren operasyonel adımları düzenli ve görünür sistemlere dönüştürüyoruz.',
    priority: 0.6,
    changefreq: 'monthly',
    ogType: 'website',
  },
  hikayelerimiz: {
    id: 'hikayelerimiz',
    path: '/hikayelerimiz.html',
    title: "That's Lumina · Hikayelerimiz",
    description:
      'İş birliklerimiz, müşteri yorumları ve Lumina ile gerçekleştirilen başarılı projelerin hikayeleri.',
    priority: 0.9,
    changefreq: 'daily',
    ogType: 'website',
  },
  randevu: {
    id: 'randevu',
    path: '/randevu.html',
    title: "That's Lumina · Randevu Oluştur",
    description: 'Lumina ekibiyle randevu planlayın, tarih ve saat isteğinizi iletin.',
    priority: 0.6,
    changefreq: 'monthly',
    ogType: 'website',
  },
  makaleler: {
    id: 'makaleler',
    path: '/makaleler.html',
    title: "That's Lumina · Makaleler",
    description:
      'AI destekli kampanya görselleri, otomasyon ve dijital ortaklık üzerine Lumina makaleleri.',
    priority: 0.9,
    changefreq: 'daily',
    ogType: 'website',
  },
  'ai-kampanya-gorselleri': {
    id: 'ai-kampanya-gorselleri',
    path: '/makaleler/ai-kampanya-gorselleri.html',
    title: 'AI Destekli Kampanya Görselleri Nasıl Üretilir? · Lumina',
    description:
      'Markalar için AI destekli kampanya görselleri üretim sürecini, moodboard aşamasından final teslimata kadar adım adım anlatıyoruz.',
    priority: 0.8,
    changefreq: 'weekly',
    ogType: 'article',
  },
};

/**
 * @param {string} pageId
 * @returns {PageMeta}
 */
function getPageMeta(pageId) {
  const meta = PAGE_REGISTRY[pageId];
  if (!meta) {
    throw new Error(`Unknown page id: ${pageId}`);
  }
  return meta;
}

/**
 * @param {PageMeta} meta
 * @returns {string}
 */
function getCanonicalUrl(meta) {
  if (meta.path === '/') {
    return `${SITE_URL}/`;
  }
  return `${SITE_URL}${meta.path}`;
}

/**
 * @param {string} value
 * @param {number} [max=120]
 * @returns {string}
 */
function truncateForOg(value, max = 120) {
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1).trim()}…`;
}

/**
 * @param {PageMeta} meta
 * @returns {string}
 */
function buildOgImageUrl(meta) {
  const params = new URLSearchParams({
    title: truncateForOg(meta.title, 80),
    description: truncateForOg(meta.description, 120),
    type: meta.ogType === 'article' ? 'article' : 'page',
  });
  return `${SITE_URL}/api/og?${params.toString()}`;
}

/**
 * Builds invisible SEO head tags (title is omitted — set separately in HTML).
 * @param {PageMeta} meta
 * @returns {string}
 */
function buildHeadTags(meta) {
  const canonical = getCanonicalUrl(meta);
  const ogImage = buildOgImageUrl(meta);
  const ogType = meta.ogType === 'article' ? 'article' : 'website';
  const robots = meta.noindex ? 'noindex, follow' : 'index, follow';

  return [
    `<meta name="description" content="${escapeAttr(meta.description)}">`,
    `<link rel="canonical" href="${escapeAttr(canonical)}">`,
    `<meta name="robots" content="${robots}">`,
    `<meta property="og:type" content="${ogType}">`,
    `<meta property="og:locale" content="tr_TR">`,
    `<meta property="og:url" content="${escapeAttr(canonical)}">`,
    `<meta property="og:title" content="${escapeAttr(meta.title)}">`,
    `<meta property="og:description" content="${escapeAttr(meta.description)}">`,
    `<meta property="og:image" content="${escapeAttr(ogImage)}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escapeAttr(meta.title)}">`,
    `<meta name="twitter:description" content="${escapeAttr(meta.description)}">`,
    `<meta name="twitter:image" content="${escapeAttr(ogImage)}">`,
  ].join('\n    ');
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeAttr(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * @returns {PageMeta[]}
 */
function getAllPagesForSitemap() {
  return Object.values(PAGE_REGISTRY);
}

module.exports = {
  PAGE_REGISTRY,
  getPageMeta,
  getCanonicalUrl,
  buildOgImageUrl,
  buildHeadTags,
  getAllPagesForSitemap,
  truncateForOg,
};
