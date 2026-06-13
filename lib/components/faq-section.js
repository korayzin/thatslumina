/**
 * FAQ accordion section with embedded FAQPage JSON-LD schema.
 * Uses existing `.faq-panel` / `.faq-card` styles from the design system.
 *
 * @example
 * // HTML: <div data-faq-section id="otomasyonFaq"></div>
 * // JS:  mountFAQSection('#otomasyonFaq', OTOMasyon_FAQ_ITEMS);
 */

/**
 * @typedef {{ question: string; answer: string }} FaqItem
 */

/**
 * @param {FaqItem[]} items
 * @returns {string}
 */
function renderFAQSectionHTML(items) {
  const cards = items
    .map(
      (item) => `
    <div class="faq-card">
      <button class="faq-toggle" type="button" aria-expanded="false">
        <span class="faq-question">${escapeHtml(item.question)}</span>
        <span class="faq-icon" aria-hidden="true">+</span>
      </button>
      <div class="faq-content">
        <p>${escapeHtml(item.answer)}</p>
      </div>
    </div>`
    )
    .join('');

  return `<div class="faq-panel" data-reveal>${cards}\n  </div>`;
}

/**
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
 * Injects FAQPage schema into document head (once per page).
 * @param {FaqItem[]} items
 * @param {string} [scriptId='faqSchema']
 */
function injectFAQSchema(items, scriptId = 'faqSchema') {
  if (typeof document === 'undefined') return;
  if (document.getElementById(scriptId)) return;

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = scriptId;
  script.textContent = JSON.stringify(buildFAQSchema(items));
  document.head.appendChild(script);
}

/**
 * Mounts FAQ section into a container and wires accordion behaviour.
 * @param {string | HTMLElement} target
 * @param {FaqItem[]} items
 */
function mountFAQSection(target, items) {
  const root = typeof target === 'string' ? document.querySelector(target) : target;
  if (!root) return;

  root.innerHTML = renderFAQSectionHTML(items);
  injectFAQSchema(items);

  root.querySelectorAll('.faq-card').forEach((card) => {
    const toggle = card.querySelector('.faq-toggle');
    const content = card.querySelector('.faq-content');
    if (!toggle || !content) return;
    content.style.maxHeight = '0px';

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      card.classList.toggle('open', !expanded);
      content.style.maxHeight = !expanded ? `${content.scrollHeight}px` : '0px';
    });
  });
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
    renderFAQSectionHTML,
    buildFAQSchema,
    injectFAQSchema,
    mountFAQSection,
  };
}

if (typeof window !== 'undefined') {
  window.FAQSection = {
    renderFAQSectionHTML,
    buildFAQSchema,
    injectFAQSchema,
    mountFAQSection,
  };
}
