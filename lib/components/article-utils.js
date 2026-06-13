/**
 * Article utilities: reading time, TL;DR box, and Article JSON-LD injection.
 *
 * @example
 * renderArticleMeta('#articleMeta', { publishDate: '2025-06-01', modifiedDate: '2025-06-10', wordCount: 850 });
 */

/**
 * @param {number} wordCount
 * @param {number} [wordsPerMinute=200]
 * @returns {number}
 */
function estimateReadingMinutes(wordCount, wordsPerMinute = 200) {
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * @param {string} isoDate
 * @param {string} [locale='tr-TR']
 * @returns {string}
 */
function formatTurkishDate(isoDate, locale = 'tr-TR') {
  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(isoDate));
}

/**
 * @param {string | HTMLElement} target
 * @param {Object} params
 * @param {string} params.publishDate
 * @param {string} params.modifiedDate
 * @param {number} params.wordCount
 */
function renderArticleMeta(target, { publishDate, modifiedDate, wordCount }) {
  const root = typeof target === 'string' ? document.querySelector(target) : target;
  if (!root) return;

  const minutes = estimateReadingMinutes(wordCount);
  root.innerHTML = `
<p class="article-meta">
  <span class="article-meta__item">Tahmini okuma süresi: <strong>${minutes} dk</strong></span>
  <span class="article-meta__sep" aria-hidden="true">·</span>
  <span class="article-meta__item">Yayın: ${formatTurkishDate(publishDate)}</span>
  <span class="article-meta__sep" aria-hidden="true">·</span>
  <span class="article-meta__item">Son güncelleme: <time datetime="${modifiedDate}">${formatTurkishDate(modifiedDate)}</time></span>
</p>`;
}

/**
 * @param {string | HTMLElement} target
 * @param {string[]} bullets
 */
function renderTldrBox(target, bullets) {
  const root = typeof target === 'string' ? document.querySelector(target) : target;
  if (!root || !bullets.length) return;

  const items = bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  root.innerHTML = `
<div class="tldr-box" role="note" aria-label="Özet">
  <strong>Özet</strong>
  <ul>${items}</ul>
</div>`;
}

/**
 * @param {Record<string, unknown>} schema
 * @param {string} [scriptId='articleSchema']
 */
function injectArticleSchema(schema, scriptId = 'articleSchema') {
  if (typeof document === 'undefined') return;
  if (document.getElementById(scriptId)) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = scriptId;
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * @param {string} text
 * @returns {number}
 */
function countWords(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    estimateReadingMinutes,
    formatTurkishDate,
    renderArticleMeta,
    renderTldrBox,
    injectArticleSchema,
    countWords,
  };
}

if (typeof window !== 'undefined') {
  window.ArticleUtils = {
    estimateReadingMinutes,
    formatTurkishDate,
    renderArticleMeta,
    renderTldrBox,
    injectArticleSchema,
    countWords,
  };
}
