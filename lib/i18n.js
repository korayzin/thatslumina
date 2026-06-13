/**
 * Vanilla i18n module — useLanguage API for static HTML site.
 * Provides t(), getLanguage(), setLanguage(), subscribe() without React.
 */
(function () {
    const STORAGE_KEY = 'lumina-lang';
    const SUPPORTED = ['tr', 'en'];

    let currentLang = 'tr';
    let translations = { tr: {}, en: {} };
    const listeners = new Set();
    const warnedKeys = new Set();

    function detectBrowserLang() {
        const nav = (navigator.language || navigator.userLanguage || 'tr').toLowerCase();
        return nav.startsWith('en') ? 'en' : 'tr';
    }

    function getSavedLang() {
        const saved = localStorage.getItem(STORAGE_KEY);
        return SUPPORTED.includes(saved) ? saved : null;
    }

    function getNested(obj, key) {
        return key.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
    }

    function t(key) {
        let value = getNested(translations[currentLang], key);
        if (value !== undefined) return value;

        if (!warnedKeys.has(key)) {
            console.warn(`[i18n] Missing key "${key}" for locale "${currentLang}"`);
            warnedKeys.add(key);
        }

        const fallback = getNested(translations.tr, key);
        return fallback !== undefined ? fallback : key;
    }

    function getLanguage() {
        return currentLang;
    }

    function updateMeta() {
        const page = document.body.dataset.page;
        if (!page) return;

        const titleKey = `meta.${page}.title`;
        const descKey = `meta.${page}.description`;
        const title = t(titleKey);
        const description = t(descKey);

        if (title && title !== titleKey) document.title = title;

        const descMeta = document.querySelector('meta[name="description"]');
        if (descMeta && description && description !== descKey) {
            descMeta.setAttribute('content', description);
        }

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', description);

        const ogLocale = document.querySelector('meta[property="og:locale"]');
        if (ogLocale) ogLocale.setAttribute('content', t('meta.ogLocale'));

        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) twitterTitle.setAttribute('content', title);

        const twitterDesc = document.querySelector('meta[name="twitter:description"]');
        if (twitterDesc) twitterDesc.setAttribute('content', description);

        const ldJson = document.getElementById('ldJson');
        if (ldJson) {
            ldJson.textContent = JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: title,
                description: description,
                url: 'https://www.thatslumina.com/',
            }, null, 4);
        }
    }

    function applyTranslations() {
        document.documentElement.lang = currentLang;

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            el.textContent = t(el.dataset.i18n);
        });

        document.querySelectorAll('[data-i18n-html]').forEach((el) => {
            el.innerHTML = t(el.dataset.i18nHtml);
        });

        document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
            el.dataset.i18nAttr.split(';').forEach((spec) => {
                const [attr, key] = spec.split(':').map((s) => s.trim());
                if (attr && key) el.setAttribute(attr, t(key));
            });
        });

        document.querySelectorAll('[data-i18n-note]').forEach((el) => {
            const note = t(el.dataset.i18nNote);
            if (note) {
                el.textContent = note;
                el.hidden = false;
            } else {
                el.textContent = '';
                el.hidden = true;
            }
        });

        updateMeta();
        updateLangSwitcher();
        document.dispatchEvent(new CustomEvent('languagechange', { detail: { lang: currentLang } }));
    }

    function updateLangSwitcher() {
        const switcher = document.getElementById('langSwitch');
        if (!switcher) return;
        switcher.querySelectorAll('[data-lang]').forEach((btn) => {
            const active = btn.dataset.lang === currentLang;
            btn.classList.toggle('active', active);
            btn.setAttribute('aria-pressed', String(active));
        });
    }

    function initLangSwitcher() {
        const switcher = document.getElementById('langSwitch');
        if (!switcher) return;
        switcher.querySelectorAll('[data-lang]').forEach((btn) => {
            btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
        });
        updateLangSwitcher();
    }

    function setLanguage(lang) {
        if (!SUPPORTED.includes(lang) || lang === currentLang) return;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        applyTranslations();
        listeners.forEach((fn) => fn(currentLang));
    }

    function subscribe(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
    }

    async function loadLocales() {
        const base = document.querySelector('script[data-i18n-base]')?.dataset.i18nBase || '';
        const [trRes, enRes] = await Promise.all([
            fetch(`${base}locales/tr.json`),
            fetch(`${base}locales/en.json`),
        ]);
        if (!trRes.ok || !enRes.ok) throw new Error('[i18n] Failed to load locale files');
        translations.tr = await trRes.json();
        translations.en = await enRes.json();
    }

    async function initI18n() {
        currentLang = getSavedLang() || detectBrowserLang();
        try {
            await loadLocales();
        } catch (err) {
            console.error(err);
            return;
        }
        applyTranslations();
        initLangSwitcher();
        document.dispatchEvent(new CustomEvent('i18n:ready', { detail: { lang: currentLang } }));
    }

    window.useLanguage = { t, getLanguage, setLanguage, subscribe, initI18n };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initI18n);
    } else {
        initI18n();
    }
})();
