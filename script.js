const body = document.body;
const navToggle = document.getElementById('navToggle');
const navPanel = document.getElementById('navPanel');
const navClose = document.getElementById('navClose');
const navOverlay = document.getElementById('navOverlay');
const themeSwitch = document.getElementById('themeSwitch');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
const savedTheme = localStorage.getItem('lumina-theme');

const applyTheme = (mode) => {
    body.classList.toggle('theme-dark', mode === 'dark');
    body.classList.toggle('theme-light', mode === 'light');
    const label = themeSwitch.querySelector('.theme-label');
    if (label) {
        label.textContent = mode === 'dark' ? 'Light' : 'Dark';
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
    themeSwitch.addEventListener('click', (event) => {
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
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: Gönderim başarısız`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API çağrısı hatası:', error);
    throw error;
  }
};



const contactForm = document.querySelector('.contact-form');

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
if (calendarRoot) {
    const selectedDateInput = document.getElementById('selectedDate');
    const dayNames = ['Paz', 'Pts', 'Sal', 'Çar', 'Per', 'Cum', 'Cts'];
    const monthNames = ['OCA', 'ŞUB', 'MAR', 'NİS', 'MAY', 'HAZ', 'TEM', 'AĞU', 'EYL', 'EKİ', 'KAS', 'ARA'];
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
            <span class=\"day-name\">${dayNames[date.getDay()]}</span>
            <span class=\"day-number\">${date.getDate()}</span>
            <span class=\"day-month\">${monthNames[date.getMonth()]}</span>
        `;
        button.addEventListener('click', () => {
            calendarRoot.querySelectorAll('.calendar-day').forEach((day) => day.classList.remove('active'));
            button.classList.add('active');
            if (selectedDateInput) {
                selectedDateInput.value = iso;
            }
        });
        calendarRoot.appendChild(button);
        if (i === 0) {
            button.classList.add('active');
            if (selectedDateInput) {
                selectedDateInput.value = iso;
            }
        }
    }
}

const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
    appointmentForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = appointmentForm.querySelector('button[type=\"submit\"]');
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
            button.textContent = 'Tarih seçin';
            setTimeout(() => (button.textContent = 'Randevu iste'), 1500);
            return;
        }
        const original = button.textContent;
        button.textContent = 'İletiliyor...';
        button.disabled = true;
        
        try {
            const result = await sendContactMessage(payload, '/api/appointments');
            if (result && result.ok) {
                button.textContent = 'Talep gönderildi ✓';
                setTimeout(() => {
                    button.textContent = original;
                    button.disabled = false;
                    appointmentForm.reset();
                    const firstDay = calendarRoot?.querySelector('.calendar-day');
                    if (firstDay) firstDay.click();
                }, 2000);
            } else {
                throw new Error('Gönderim başarısız');
            }
        } catch (error) {
            console.error('Randevu formu hatası:', error);
            button.textContent = 'Hata! Tekrar deneyin';
            button.disabled = false;
            setTimeout(() => {
                button.textContent = original;
            }, 3000);
        }
    });
}
