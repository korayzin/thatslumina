/**
 * JSON-LD schema builders for Organization, WebSite, FAQ, Article, Breadcrumb, and Person.
 * All functions return typed plain objects — no `any`.
 */

const { SITE_URL, ORGANIZATION, DEFAULT_AUTHOR } = require('./site-config');
const { getCanonicalUrl } = require('./metadata');

/** @typedef {{ question: string; answer: string }} FaqItem */

/** @typedef {{ name: string; url: string }} BreadcrumbItem */

/** @typedef {{ name: string; title: string; bio: string; avatar: string; linkedin?: string; twitter?: string; website?: string }} AuthorInfo */

/**
 * @param {unknown} data
 * @returns {string}
 */
function toJsonLd(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * Organization schema for site-wide layout.
 * @returns {Record<string, unknown>}
 */
function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: ORGANIZATION.url,
    logo: ORGANIZATION.logo,
    email: ORGANIZATION.email,
    sameAs: ORGANIZATION.sameAs,
  };
}

/**
 * WebSite schema with search action placeholder.
 * @returns {Record<string, unknown>}
 */
function buildWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: ORGANIZATION.name,
    url: SITE_URL,
    description:
      'Lumina — yeni nesil dijital ortaklık. Markalar için kreatif üretim, AI destekli kampanya görselleri ve otomasyon çözümleri.',
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
    },
  };
}

/**
 * FAQPage schema from question/answer pairs.
 * @param {FaqItem[]} items
 * @returns {Record<string, unknown>}
 */
function buildFAQSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

/**
 * Article schema for blog/makale pages.
 * @param {Object} params
 * @param {string} params.headline
 * @param {string} params.description
 * @param {string} params.url
 * @param {string} params.publishDate ISO 8601
 * @param {string} params.modifiedDate ISO 8601
 * @param {AuthorInfo} [params.author]
 * @param {string} [params.image]
 * @returns {Record<string, unknown>}
 */
function buildArticleSchema({
  headline,
  description,
  url,
  publishDate,
  modifiedDate,
  author = DEFAULT_AUTHOR,
  image,
}) {
  const authorSchema = buildPersonSchema(author);
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    datePublished: publishDate,
    dateModified: modifiedDate,
    author: authorSchema,
    publisher: {
      '@type': 'Organization',
      name: ORGANIZATION.name,
      url: ORGANIZATION.url,
      logo: {
        '@type': 'ImageObject',
        url: ORGANIZATION.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(image ? { image: [image] } : {}),
  };
}

/**
 * Person schema for AuthorCard.
 * @param {AuthorInfo} author
 * @returns {Record<string, unknown>}
 */
function buildPersonSchema(author) {
  /** @type {Record<string, unknown>} */
  const person = {
    '@type': 'Person',
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    image: author.avatar,
  };

  const sameAs = [
    author.linkedin,
    author.twitter,
    author.website,
  ].filter(Boolean);

  if (sameAs.length) {
    person.sameAs = sameAs;
  }

  return person;
}

/**
 * BreadcrumbList schema for inner pages.
 * @param {BreadcrumbItem[]} items Ordered from root to current page
 * @returns {Record<string, unknown>}
 */
function buildBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Wraps schema object in a script tag for HTML injection.
 * @param {Record<string, unknown>} schema
 * @returns {string}
 */
function schemaScriptTag(schema) {
  return `<script type="application/ld+json">\n${toJsonLd(schema)}\n    </script>`;
}

/**
 * Builds breadcrumb items using page meta path segments.
 * @param {import('./metadata').PageMeta} meta
 * @param {BreadcrumbItem[]} [extra=[]] Intermediate crumbs between home and current
 * @returns {BreadcrumbItem[]}
 */
function breadcrumbsForPage(meta, extra = []) {
  /** @type {BreadcrumbItem[]} */
  const crumbs = [{ name: 'Ana Sayfa', url: `${SITE_URL}/` }, ...extra];
  if (meta.path !== '/') {
    crumbs.push({ name: meta.title, url: getCanonicalUrl(meta) });
  }
  return crumbs;
}

module.exports = {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildFAQSchema,
  buildArticleSchema,
  buildPersonSchema,
  buildBreadcrumbSchema,
  schemaScriptTag,
  breadcrumbsForPage,
  toJsonLd,
};
