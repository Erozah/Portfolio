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

    // ==============================================================================
    // 🎵 SIMULATEUR AUDIO FFT (Pour Spicetify Visualizer)
    // ==============================================================================
    const audioCanvas = document.getElementById('spicetifyCanvas');
    const toggleAudioBtn = document.getElementById('toggleAudioSim');
    const audioStatus = document.getElementById('audioSimStatus');

    if (audioCanvas && toggleAudioBtn) {
        const ctx = audioCanvas.getContext('2d');
        let isSimulating = false;
        let animationFrameId = null;
        let audioCtx = null;
        let oscillator = null;
        let gainNode = null;

        // Ajuster la résolution interne du canvas
        function resizeCanvas() {
            const rect = audioCanvas.getBoundingClientRect();
            audioCanvas.width = rect.width * window.devicePixelRatio;
            audioCanvas.height = rect.height * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Dessiner l'état inactif (ondes d'attente)
        function drawIdle() {
            const width = audioCanvas.clientWidth;
            const height = audioCanvas.clientHeight;
            ctx.clearRect(0, 0, width, height);

            ctx.strokeStyle = 'rgba(45, 212, 191, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, height / 2);
            for (let x = 0; x < width; x += 4) {
                const y = height / 2 + Math.sin(x * 0.04) * 3;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        drawIdle();

        let phase = 0;
        function animateVisualizer() {
            if (!isSimulating) return;

            const width = audioCanvas.clientWidth;
            const height = audioCanvas.clientHeight;
            ctx.clearRect(0, 0, width, height);

            phase += 0.08;
            const barCount = 36;
            const barWidth = (width / barCount) - 2;

            for (let i = 0; i < barCount; i++) {
                // Simulation fréquentielle réaliste avec harmoniques et battements
                const freqAmp = Math.sin(phase + i * 0.3) * 0.4 + Math.cos(phase * 1.5 + i * 0.15) * 0.4 + 0.5;
                const barHeight = Math.max(4, freqAmp * (height - 12));

                const x = i * (barWidth + 2);
                const y = height - barHeight;

                // Dégradé cyan / émeraude
                const gradient = ctx.createLinearGradient(0, height, 0, y);
                gradient.addColorStop(0, '#0e3d4f');
                gradient.addColorStop(0.5, '#2dd4bf');
                gradient.addColorStop(1, '#38bdf8');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animateVisualizer);
        }

        toggleAudioBtn.addEventListener('click', () => {
            isSimulating = !isSimulating;

            if (isSimulating) {
                toggleAudioBtn.innerHTML = '⏹️ Arrêter la démo';
                toggleAudioBtn.style.background = '#2dd4bf';
                toggleAudioBtn.style.color = '#071720';
                if (audioStatus) audioStatus.textContent = 'En direct : 60 FPS (FFT 2048)';
                animateVisualizer();

                // Son subtil facultatif via Web Audio API
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (AudioContext) {
                        audioCtx = new AudioContext();
                        oscillator = audioCtx.createOscillator();
                        gainNode = audioCtx.createGain();
                        oscillator.type = 'sine';
                        oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
                        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime); // volume très discret
                        oscillator.connect(gainNode);
                        gainNode.connect(audioCtx.destination);
                        oscillator.start();
                    }
                } catch (e) {
                    // Audio bloqué ou non supporté
                }
            } else {
                toggleAudioBtn.innerHTML = '▶️ Lancer la démo FFT 60 FPS';
                toggleAudioBtn.style.background = 'rgba(45, 212, 191, 0.15)';
                toggleAudioBtn.style.color = '#2dd4bf';
                if (audioStatus) audioStatus.textContent = 'Pause · Prêt à tester';
                cancelAnimationFrame(animationFrameId);
                drawIdle();

                if (oscillator) {
                    try { oscillator.stop(); } catch(e) {}
                    oscillator = null;
                }
                if (audioCtx) {
                    try { audioCtx.close(); } catch(e) {}
                    audioCtx = null;
                }
            }
        });
    }

    // ==============================================================================
    // 📡 SIMULATEUR WIFI SIGNAL TRACKER
    // ==============================================================================
    const toggleWifiBtn = document.getElementById('toggleWifiSim');
    const wifiGauge = document.getElementById('wifiGaugeFill');
    const wifiDbm = document.getElementById('wifiDbmVal');

    if (toggleWifiBtn && wifiGauge && wifiDbm) {
        let isWifiSimulating = false;
        let wifiInterval = null;

        toggleWifiBtn.addEventListener('click', () => {
            isWifiSimulating = !isWifiSimulating;

            if (isWifiSimulating) {
                toggleWifiBtn.innerHTML = '⏹️ Stopper le radar';
                toggleWifiBtn.style.background = '#38bdf8';
                toggleWifiBtn.style.color = '#071720';

                wifiInterval = setInterval(() => {
                    const dbm = Math.floor(Math.random() * 35) - 80; // entre -45 dBm et -80 dBm
                    const percent = Math.min(100, Math.max(10, (dbm + 90) * 2));
                    wifiGauge.style.width = percent + '%';
                    wifiDbm.textContent = dbm + ' dBm';
                }, 600);
            } else {
                toggleWifiBtn.innerHTML = '📶 Simuler le scan radar';
                toggleWifiBtn.style.background = 'rgba(56, 189, 248, 0.15)';
                toggleWifiBtn.style.color = '#38bdf8';
                clearInterval(wifiInterval);
                wifiGauge.style.width = '70%';
                wifiDbm.textContent = '-52 dBm (Salon)';
            }
        });
    }

    // ==============================================================================
    // 🌐 INTERNATIONALISATION (i18n)
    // ==============================================================================
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
        }
    } catch (e) {}

    setLanguage(initialLang);
});
