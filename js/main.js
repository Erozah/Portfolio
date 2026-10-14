document.addEventListener('DOMContentLoaded', () => {
    // Mobile navigation toggle
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('navLinks');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('open');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
            });
        });
    }

    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            cards.forEach(card => {
                const category = card.dataset.category;
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // Internationalization (i18n)
    function getNestedTranslation(obj, path) {
        return path.split('.').reduce((prev, curr) => (prev ? prev[curr] : null), obj);
    }

    function setLanguage(lang) {
        if (!window.translations || !window.translations[lang]) {
            return;
        }

        const dict = window.translations[lang];
        document.documentElement.lang = lang;

        if (dict.pageTitle) {
            document.title = dict.pageTitle;
        }

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = getNestedTranslation(dict, key);
            if (translation !== null && translation !== undefined) {
                if (translation.includes('<') && translation.includes('>')) {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        });

        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        try {
            localStorage.setItem('portfolio_lang', lang);
        } catch (e) {
            // LocalStorage might be disabled in private mode
        }
    }

    // Language buttons click events
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            if (lang) {
                setLanguage(lang);
            }
        });
    });

    // Determine initial language
    let initialLang = 'fr';
    try {
        const savedLang = localStorage.getItem('portfolio_lang');
        if (savedLang && window.translations && window.translations[savedLang]) {
            initialLang = savedLang;
        } else {
            const browserLang = (navigator.language || navigator.userLanguage || '').toLowerCase();
            if (browserLang.startsWith('en')) {
                initialLang = 'en';
            }
        }
    } catch (e) {
        initialLang = 'fr';
    }

    setLanguage(initialLang);
});
