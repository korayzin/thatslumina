/**
 * Site-wide constants: base URL, organization info, and default SEO values.
 * Used by metadata, schema, sitemap, and OG image helpers.
 */

/** @type {string} */
const SITE_URL = (
  typeof process !== 'undefined' &&
  (process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL)
) || 'https://www.thatslumina.com';

/** @type {Readonly<{ name: string; legalName: string; url: string; logo: string; email: string; sameAs: string[] }>} */
const ORGANIZATION = Object.freeze({
  name: "That's Lumina",
  legalName: "That's Lumina",
  url: SITE_URL,
  logo: `${SITE_URL}/images/Lumina%20Logo%404x%20dark.png`,
  email: 'hello@thatslumina.com',
  sameAs: [
    'https://www.instagram.com/thatslumina',
  ],
});

/** @type {Readonly<{ name: string; title: string; bio: string; avatar: string; linkedin?: string; twitter?: string; website?: string }>} */
const DEFAULT_AUTHOR = Object.freeze({
  name: 'Koray',
  title: 'Kurucu Ortak · Lumina',
  bio:
    'Lumina kurucu ekibinden. AI destekli kampanya görselleri ve işletme otomasyonları üzerine çalışıyor; markaların estetik ve operasyon tarafını birlikte tasarlıyor.',
  avatar: `${SITE_URL}/images/Lumina%20Logo%404x%20dark.png`,
  website: SITE_URL,
});

module.exports = {
  SITE_URL,
  ORGANIZATION,
  DEFAULT_AUTHOR,
};
