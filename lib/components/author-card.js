/**
 * Author card for blog/makale footers with embedded Person JSON-LD schema.
 *
 * @example
 * mountAuthorCard('#articleAuthor', {
 *   name: 'Koray',
 *   title: 'Kurucu Ortak · Lumina',
 *   bio: '...',
 *   avatar: '/images/...',
 *   website: 'https://www.thatslumina.com',
 * });
 */

/**
 * @typedef {{ name: string; title: string; bio: string; avatar: string; linkedin?: string; twitter?: string; website?: string }} AuthorInfo
 */

/**
 * @param {AuthorInfo} author
 * @returns {string}
 */
function renderAuthorCardHTML(author) {
  const links = [
    author.linkedin
      ? `<a href="${escapeAttr(author.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`
      : '',
    author.twitter
      ? `<a href="${escapeAttr(author.twitter)}" target="_blank" rel="noopener noreferrer">Twitter</a>`
      : '',
    author.website
      ? `<a href="${escapeAttr(author.website)}" target="_blank" rel="noopener noreferrer">Web</a>`
      : '',
  ]
    .filter(Boolean)
    .join('');

  return `
<aside class="author-card" aria-label="Yazar">
  <img class="author-card__avatar" src="${escapeAttr(author.avatar)}" alt="${escapeAttr(author.name)}" width="72" height="72" loading="lazy">
  <div class="author-card__body">
    <p class="author-card__eyebrow">Yazar</p>
    <h3 class="author-card__name">${escapeHtml(author.name)}</h3>
    <p class="author-card__title">${escapeHtml(author.title)}</p>
    <p class="author-card__bio">${escapeHtml(author.bio)}</p>
    ${links ? `<div class="author-card__links">${links}</div>` : ''}
  </div>
</aside>`;
}

/**
 * @param {AuthorInfo} author
 * @returns {Record<string, unknown>}
 */
function buildPersonSchema(author) {
  /** @type {Record<string, unknown>} */
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: author.name,
    jobTitle: author.title,
    description: author.bio,
    image: author.avatar,
  };

  const sameAs = [author.linkedin, author.twitter, author.website].filter(Boolean);
  if (sameAs.length) {
    person.sameAs = sameAs;
  }

  return person;
}

/**
 * @param {AuthorInfo} author
 * @param {string} [scriptId='authorSchema']
 */
function injectAuthorSchema(author, scriptId = 'authorSchema') {
  if (typeof document === 'undefined') return;
  if (document.getElementById(scriptId)) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = scriptId;
  script.textContent = JSON.stringify(buildPersonSchema(author));
  document.head.appendChild(script);
}

/**
 * @param {string | HTMLElement} target
 * @param {AuthorInfo} author
 */
function mountAuthorCard(target, author) {
  const root = typeof target === 'string' ? document.querySelector(target) : target;
  if (!root) return;

  root.innerHTML = renderAuthorCardHTML(author);
  injectAuthorSchema(author);
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * @param {string} value
 * @returns {string}
 */
function escapeAttr(value) {
  return escapeHtml(value);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderAuthorCardHTML,
    buildPersonSchema,
    injectAuthorSchema,
    mountAuthorCard,
  };
}

if (typeof window !== 'undefined') {
  window.AuthorCard = {
    renderAuthorCardHTML,
    buildPersonSchema,
    injectAuthorSchema,
    mountAuthorCard,
  };
}
