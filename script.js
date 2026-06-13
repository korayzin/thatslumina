const body = document.body;
const navToggle = document.getElementById('navToggle');
const navPanel = document.getElementById('navPanel');
const navClose = document.getElementById('navClose');
const navOverlay = document.getElementById('navOverlay');
const themeSwitch = document.getElementById('themeSwitch');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('lumina-theme');

const t = (key) => (window.useLanguage ? window.useLanguage.t(key) : key);

const applyTheme = (mode) => {
    body.classList.toggle('theme-dark', mode === 'dark');
    body.classList.toggle('theme-light', mode === 'light');
    const label = themeSwitch?.querySelector('.theme-label');
    if (label) {
        label.textContent = mode === 'dark' ? t('theme.light') : t('theme.dark');
    }
};

const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');
applyTheme(initialTheme);

const setNavState = (open) => {
    const shouldOpen = Boolean(open);
    if (navToggle) {
        navToggle.setAttribute('aria-expanded', String(shouldOpen));
        navToggle.classList.toggle('active', shouldOpen);
    }
    if (navPanel) {
        navPanel.classList.toggle('open', shouldOpen);
    }
    body.classList.toggle('nav-open', shouldOpen);
};

const closeNavPanel = () => setNavState(false);

if (themeSwitch) {
    themeSwitch.addEventListener('click', () => {
        const nextTheme = body.classList.contains('theme-dark') ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem('lumina-theme', nextTheme);
    });
}

prefersDark.addEventListener('change', (event) => {
    if (!savedTheme) {
        applyTheme(event.matches ? 'dark' : 'light');
    }
});

if (navToggle && navPanel) {
    navToggle.addEventListener('click', () => {
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        setNavState(!expanded);
    });
}

navClose?.addEventListener('click', closeNavPanel);
navOverlay?.addEventListener('click', closeNavPanel);
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        closeNavPanel();
    }
});
window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
        closeNavPanel();
    }
});

const smoothScroll = (target) => {
    const el = document.querySelector(target);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const scrollTriggers = [
    ...document.querySelectorAll('.nav-links a'),
    ...document.querySelectorAll('.footer-links a'),
    ...document.querySelectorAll('[data-scroll]')
];

scrollTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
        const href = trigger.getAttribute('href') || trigger.dataset.scroll;
        if (!href) return;
        if (href.startsWith('#')) {
            event.preventDefault();
            smoothScroll(href);
            closeNavPanel();
        }
    });
});

const revealItems = document.querySelectorAll('[data-reveal]');
if (revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    revealItems.forEach((item) => observer.observe(item));
}

const sendContactMessage = async (payload, endpoint = '/api/contact') => {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(t('errors.sendFailed'));
  return response.json();
};

const faqCards = document.querySelectorAll('.faq-card');
if (faqCards.length) {
    faqCards.forEach((card) => {
        const toggle = card.querySelector('.faq-toggle');
        const content = card.querySelector('.faq-content');
        if (!toggle || !content) return;
        content.style.maxHeight = '0px';

        toggle.addEventListener('click', () => {
            const expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', String(!expanded));
            card.classList.toggle('open', !expanded);
            if (!expanded) {
                content.style.maxHeight = content.scrollHeight + 'px';
            } else {
                content.style.maxHeight = '0px';
            }
        });
    });
}

const calendarRoot = document.getElementById('appointmentCalendar');
let selectedDateInput = document.getElementById('selectedDate');

const buildCalendar = () => {
    if (!calendarRoot) return;
    const previous = calendarRoot.querySelector('.calendar-day.active')?.dataset.date;
    calendarRoot.innerHTML = '';
    const dayNames = t('calendar.days');
    const monthNames = t('calendar.months');
    const daysToShow = 10;

    for (let i = 0; i < daysToShow; i += 1) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        const iso = date.toISOString().split('T')[0];
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'calendar-day';
        button.dataset.date = iso;
        button.innerHTML = `
            <span class="day-name">${dayNames[date.getDay()]}</span>
            <span class="day-number">${date.getDate()}</span>
            <span class="day-month">${monthNames[date.getMonth()]}</span>
        `;
        button.addEventListener('click', () => {
            calendarRoot.querySelectorAll('.calendar-day').forEach((day) => day.classList.remove('active'));
            button.classList.add('active');
            if (selectedDateInput) {
                selectedDateInput.value = iso;
            }
        });
        calendarRoot.appendChild(button);
    }

    const activeIso = previous || calendarRoot.querySelector('.calendar-day')?.dataset.date;
    const activeBtn = [...calendarRoot.querySelectorAll('.calendar-day')].find((btn) => btn.dataset.date === activeIso)
        || calendarRoot.querySelector('.calendar-day');
    if (activeBtn) {
        activeBtn.classList.add('active');
        if (selectedDateInput) selectedDateInput.value = activeBtn.dataset.date;
    }
};

const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = appointmentForm.querySelector('button[type="submit"]');
        if (!button) return;
        const formData = new FormData(appointmentForm);
        const payload = {
            name: formData.get('name')?.trim() || '',
            email: formData.get('email')?.trim() || '',
            meetingType: formData.get('meetingType') || 'online',
            preferredDate: formData.get('preferredDate') || '',
            preferredTime: formData.get('preferredTime') || '',
            message: formData.get('message')?.trim() || '',
            source: 'appointment-page',
            requestedAt: new Date().toISOString()
        };
        if (!payload.preferredDate) {
            button.textContent = t('randevu.form.selectDate');
            setTimeout(() => { button.textContent = t('randevu.form.submit'); }, 1500);
            return;
        }
        const original = t('randevu.form.submit');
        button.textContent = t('randevu.form.sending');
        button.disabled = true;
        try {
            await sendContactMessage(payload, '/api/appointments');
            button.textContent = t('randevu.form.sent');
        } catch {
            button.textContent = t('errors.sendFailed');
        }
        setTimeout(() => {
            button.textContent = original;
            button.disabled = false;
            appointmentForm.reset();
            const firstDay = calendarRoot?.querySelector('.calendar-day');
            if (firstDay) firstDay.click();
        }, 1600);
    });
}

const onI18nReady = () => {
    applyTheme(body.classList.contains('theme-dark') ? 'dark' : 'light');
    buildCalendar();
};

document.addEventListener('i18n:ready', onI18nReady);
document.addEventListener('languagechange', () => {
    buildCalendar();
    applyTheme(body.classList.contains('theme-dark') ? 'dark' : 'light');
});
