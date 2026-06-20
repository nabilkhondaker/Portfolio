// Portfolio class handles page setup and UI effects
class Portfolio {
    constructor() {
        this.init();
    }
    init() {
        this.setupLoading();          // Handles the initial loading spinner
        this.setupSocialLinks();      // Makes social buttons open links
        this.setupScrollAnimations(); // Animates sections on scroll
        this.setupProjectCards();     // Adds hover effect to project cards
        this.setupFooterYear();       // Set up automated dynamic footer updates
        this.setupEmailCopy();        // Setup clean click-to-copy email mechanics
        this.setupThemePicker();      // Setup premium glass theme picker mechanics
    }
    
    setupLoading() {
        const removeLoader = () => {
            const loading = document.getElementById('loading');
            if (loading) {
                setTimeout(() => {
                    loading.classList.add('hidden');
                    setTimeout(() => loading.remove(), 500);
                }, 1000);
            }
        };

        if (document.readyState === 'complete') {
            removeLoader();
        } else {
            window.addEventListener('load', removeLoader, { passive: true });
        }
    }

    setupSocialLinks() {
        const socialBtns = document.querySelectorAll('.social-btn[data-link]');
        socialBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(btn.dataset.link, '_blank', 'noopener,noreferrer');
            });
        });
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.05, // Lower threshold for earlier execution
            rootMargin: '0px 0px -30px 0px'
        };
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
    }

    setupProjectCards() {
        // Handled via high performance CSS hover modifiers
    }

    setupFooterYear() {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    setupEmailCopy() {
        const copyBtn = document.getElementById('copy-email-btn');
        const emailText = document.getElementById('email-text');
        
        if (copyBtn && emailText) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(emailText.textContent.trim())
                    .then(() => {
                        const originalIcon = copyBtn.innerHTML;
                        copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #23a55a;"></i>';
                        copyBtn.style.pointerEvents = 'none';
                        setTimeout(() => {
                            copyBtn.innerHTML = originalIcon;
                            copyBtn.style.pointerEvents = 'auto';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Failed to copy email: ', err);
                    });
            });
        }
    }

    setupThemePicker() {
        const themeBtn = document.getElementById('theme-btn');
        const themePanel = document.getElementById('theme-panel');
        const themeCloseBtn = document.getElementById('theme-panel-close');
        const colorPicker = document.getElementById('color-picker');
        const colorPreview = document.querySelector('.color-preview-circle');
        const presetButtons = document.querySelectorAll('.preset-btn');
        const root = document.documentElement;

        const themes = {
            gold: { accent: '#913700', secondary: '#ffe600', bg: '#0a0a0b' },
            cyber: { accent: '#ff0055', secondary: '#00ffcc', bg: '#05000a' },
            toxic: { accent: '#0d5f00', secondary: '#00ff66', bg: '#000501' },
            cosmic: { accent: '#4d0099', secondary: '#00ffff', bg: '#02000a' },
            crimson: { accent: '#910000', secondary: '#ff4d4d', bg: '#0a0000' }
        };

        // Flag to prevent event processing recursion loops
        let isUpdating = false;

        const applyThemeStyles = (accentColor, secondaryColor, backgroundColor = '#0a0a0b', skipInputUpdate = false) => {
            if (isUpdating) return;
            isUpdating = true;

            root.style.setProperty('--accent', accentColor);
            root.style.setProperty('--accent-blue', secondaryColor);
            root.style.setProperty('--bg-primary', backgroundColor);
            
            if (colorPreview) colorPreview.style.background = accentColor;
            
            // Only update DOM input control element if not triggered natively from the picker
            if (colorPicker && !skipInputUpdate) {
                colorPicker.value = accentColor;
            }

            const cleanHex = accentColor.replace('#', '');
            const r = parseInt(cleanHex.substring(0, 2), 16);
            const g = parseInt(cleanHex.substring(2, 4), 16);
            const b = parseInt(cleanHex.substring(4, 6), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;

            if (brightness > 165) {
                root.style.setProperty('--text-primary', '#111112');
                root.style.setProperty('--text-secondary', '#333336');
                root.style.setProperty('--border', 'rgba(0, 0, 0, 0.15)');
            } else {
                root.style.setProperty('--text-primary', '#ffffff');
                root.style.setProperty('--text-secondary', '#b3b3b3');
                root.style.setProperty('--border', 'rgba(255, 255, 255, 0.08)');
            }
            
            isUpdating = false;
        };

        if (themeBtn && themePanel) {
            themeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                themePanel.classList.toggle('hidden');
            });
        }

        if (themeCloseBtn && themePanel) {
            themeCloseBtn.addEventListener('click', () => {
                themePanel.classList.add('hidden');
            });
        }

        document.addEventListener('click', (e) => {
            if (themePanel && themeBtn && !themePanel.contains(e.target) && !themeBtn.contains(e.target)) {
                themePanel.classList.add('hidden');
            }
        }, { passive: true });

        presetButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                presetButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const targetName = btn.dataset.theme;
                const config = themes[targetName];

                if (config) {
                    applyThemeStyles(config.accent, config.secondary, config.bg, false);
                    localStorage.setItem('site-theme-custom', JSON.stringify(config));
                }
            });
        });

        if (colorPicker) {
            // Debounce/throttle rendering utilizing RequestAnimationFrame 
            let rafTimeout;
            colorPicker.addEventListener('input', (e) => {
                presetButtons.forEach(b => b.classList.remove('active'));
                
                const customAccent = e.target.value;
                const customSecondary = '#ffffff';

                if (rafTimeout) cancelAnimationFrame(rafTimeout);

                rafTimeout = requestAnimationFrame(() => {
                    applyThemeStyles(customAccent, customSecondary, '#0a0a0b', true);
                    localStorage.setItem('site-theme-custom', JSON.stringify({
                        accent: customAccent,
                        secondary: customSecondary,
                        bg: '#0a0a0b'
                    }));
                });
            });
        }

        const savedCustomConfig = localStorage.getItem('site-theme-custom');
        if (savedCustomConfig) {
            try {
                const parsed = JSON.parse(savedCustomConfig);
                applyThemeStyles(parsed.accent, parsed.secondary, parsed.bg, false);
                
                presetButtons.forEach(b => {
                    if (themes[b.dataset.theme]?.accent === parsed.accent) {
                        b.classList.add('active');
                    } else {
                        b.classList.remove('active');
                    }
                });
            } catch (e) {
                console.error("Theme configuration mapping issue on startup:", e);
            }
        }
    }
}

async function updateDiscordCard() {
    const statusCard = document.querySelector('.status-card');
    const statusAvatar = document.querySelector('.status-avatar');
    const statusDot = document.querySelector('.discord-status-dot');
    const statusIndicator = document.getElementById('discord-status-indicator');
    const statusName = document.querySelector('.status-info h3');
    const statusText = document.querySelector('.status-info p');
    
    const userId = "1056634135961153576";
    
    if (statusCard) statusCard.classList.add('loading');
    
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        if (!response.ok) throw new Error('Network status payload mismatch error');
        
        const data = await response.json();
        
        if (data.success && data.data) {
            const presence = data.data;
            const currentStatus = presence.discord_status || 'offline';
            
            if (statusAvatar && presence.discord_user.avatar) {
                const targetSrc = `https://cdn.discordapp.com/avatars/${userId}/${presence.discord_user.avatar}.png?size=128`;
                if (statusAvatar.src !== targetSrc) {
                    statusAvatar.src = targetSrc;
                    statusAvatar.alt = `${presence.discord_user.global_name || presence.discord_user.username}'s Profile`;
                }
            }
            
            if (statusName) {
                const targetName = presence.discord_user.global_name || presence.discord_user.username;
                if (statusName.textContent !== targetName) statusName.textContent = targetName;
            }
            
            if (statusDot) {
                let statusColor = '#80848e';
                switch (currentStatus) {
                    case 'online': statusColor = '#23a55a'; break;
                    case 'idle':   statusColor = '#f0b232'; break;
                    case 'dnd':    statusColor = '#f23f43'; break;
                    default:       statusColor = '#80848e';
                }
                if (statusDot.style.backgroundColor !== statusColor) {
                    statusDot.style.backgroundColor = statusColor;
                }
            }
            
            if (statusIndicator) {
                const targetClass = `discord-status-aesthetic status-${currentStatus}`;
                if (statusIndicator.className !== targetClass) {
                    statusIndicator.className = targetClass;
                }
            }
            
            if (statusText) {
                let newText = '';
                if (presence.custom_status) {
                    if (presence.custom_status.emoji && presence.custom_status.emoji.name) {
                        newText += presence.custom_status.emoji.name + ' ';
                    }
                    newText += presence.custom_status.text || '';
                    newText = newText.trim() || 'Active now';
                } else if (presence.activities && presence.activities.length > 0) {
                    const activeGame = presence.activities.find(act => act.type !== 4);
                    newText = activeGame ? `Playing ${activeGame.name}` : currentStatus.toUpperCase();
                } else {
                    newText = currentStatus === 'offline' ? 'offline right now' : 'online / active';
                }
                if (statusText.textContent !== newText) statusText.textContent = newText;
            }
        }
    } catch (err) {
        console.error("Lanyard payload syncing optimization abort:", err);
        if (statusText) statusText.textContent = "unable to sync live transmission";
        if (statusIndicator) {
            statusIndicator.className = 'discord-status-aesthetic status-offline';
        }
    } finally {
        if (statusCard) statusCard.classList.remove('loading');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Portfolio();
    if (typeof updateDiscordCard === 'function') {
        updateDiscordCard();
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
