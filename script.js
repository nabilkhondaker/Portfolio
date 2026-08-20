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
        this.setupWikiViewer();       // Setup the new Wiki Image Viewer
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
            threshold: 0.05, 
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

        let isUpdating = false;

        const applyThemeStyles = (accentColor, secondaryColor, backgroundColor = '#0a0a0b', skipInputUpdate = false) => {
            if (isUpdating) return;
            isUpdating = true;

            root.style.setProperty('--accent', accentColor);
            root.style.setProperty('--accent-blue', secondaryColor);
            root.style.setProperty('--bg-primary', backgroundColor);
            
            if (colorPreview) colorPreview.style.background = accentColor;
            
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

    // NEW WIKI VIEWER METHOD (Captionless with Spin Anim)
    setupWikiViewer() {
        const wikiBtn = document.getElementById('wiki-btn');
        const wikiModal = document.getElementById('wiki-modal');
        const wikiCloseBtn = document.getElementById('wiki-close-btn');
        const wikiRefreshBtn = document.getElementById('wiki-refresh-btn');
        const wikiImage = document.getElementById('wiki-image');

        const wikiData = [
    "img/wiki/1.jpg",
    "img/wiki/2.jpg",
    "img/wiki/3.jpg",
    "img/wiki/4.jpg",
    "img/wiki/5.jpg",
    "img/wiki/6.webp",
    "img/wiki/7.jpg",
    "img/wiki/8.jpg",
    "img/wiki/9.jpg",
    "img/wiki/10.jpg",
    "img/wiki/11.jpg",
    "img/wiki/12.webp",
    "img/wiki/13.jpg",
    "img/wiki/14.webp",
    "img/wiki/15.jpg",
    "img/wiki/16.jpg",
    "img/wiki/17.webp",
    "img/wiki/18.jpg",
    "img/wiki/19.jpg",
    "img/wiki/20.jpg",
    "img/wiki/21.jpg",
    "img/wiki/22.jpg",
    "img/wiki/23.webp",
    "img/wiki/24.jpg",
    "img/wiki/25.jpg",
    "img/wiki/26.jpg",
    "img/wiki/27.jpg",
    "img/wiki/28.jpg",
    "img/wiki/29.jpg",
    "img/wiki/30.webp",
    "img/wiki/31.jpg",
    "img/wiki/32.jpg",
    "img/wiki/33.jpg",
    "img/wiki/34.jpg",
    "img/wiki/35.jpg",
    "img/wiki/36.jpg",
    "img/wiki/37.jpg",
    "img/wiki/38.jpg",
    "img/wiki/39.jpg",
    "img/wiki/40.webp",
    "img/wiki/41.jpg",
    "img/wiki/42.jpg",
    "img/wiki/43.jpg",
    "img/wiki/44.webp",
    "img/wiki/45.jpg",
    "img/wiki/46.webp",
    "img/wiki/47.jpg",
    "img/wiki/48.jpg",
    "img/wiki/49.jpg",
    "img/wiki/50.jpg",
    "img/wiki/51.jpg",
    "img/wiki/52.jpg",
    "img/wiki/53.jpg",
    "img/wiki/54.jpg",
    "img/wiki/55.jpg",
    "img/wiki/56.jpg",
    "img/wiki/57.jpg",
    "img/wiki/58.jpg",
    "img/wiki/59.jpg",
    "img/wiki/60.jpg",
    "img/wiki/61.jpg",
    "img/wiki/62.jpg",
    "img/wiki/63.jpg",
    "img/wiki/64.jpg",
    "img/wiki/65.jpg",
    "img/wiki/66.jpg",
    "img/wiki/67.jpg",
    "img/wiki/68.jpg",
    "img/wiki/69.jpg",
    "img/wiki/70.jpg",
    "img/wiki/71.jpg",
    "img/wiki/72.jpg",
    "img/wiki/73.jpg",
    "img/wiki/74.jpg",
    "img/wiki/75.jpg",
    "img/wiki/76.jpg",
    "img/wiki/77.jpg",
    "img/wiki/78.jpg",
    "img/wiki/79.jpg",
    "img/wiki/80.jpg",
    "img/wiki/81.webp",
    "img/wiki/82.jpg",
    "img/wiki/83.jpg",
    "img/wiki/84.jpg",
    "img/wiki/85.jpg",
    "img/wiki/86.jpg",
    "img/wiki/87.jpg",
    "img/wiki/88.jpg",
    "img/wiki/89.jpg",
    "img/wiki/90.jpg",
    "img/wiki/91.jpg",
    "img/wiki/92.jpg",
    "img/wiki/93.jpg",
    "img/wiki/94.jpg",
    "img/wiki/95.jpg",
    "img/wiki/96.jpg",
    "img/wiki/97.webp",
    "img/wiki/98.jpg",
    "img/wiki/99.webp",
    "img/wiki/100.jpg",
    "img/wiki/101.jpg",
    "img/wiki/102.jpg",
    "img/wiki/103.jpg",
    "img/wiki/104.webp",
    "img/wiki/105.jpg",
    "img/wiki/106.jpg",
    "img/wiki/107.jpg",
    "img/wiki/108.jpg",
    "img/wiki/109.jpg",
    "img/wiki/110.jpg",
    "img/wiki/111.jpg",
    "img/wiki/112.jpg",
    "img/wiki/113.jpg",
    "img/wiki/114.jpg",
    "img/wiki/115.jpg",
    "img/wiki/116.jpg",
    "img/wiki/117.webp",
    "img/wiki/118.jpg",
    "img/wiki/119.jpg",
    "img/wiki/120.webp",
    "img/wiki/121.jpg",
    "img/wiki/122.jpg",
    "img/wiki/123.jpg",
    "img/wiki/124.jpg",
    "img/wiki/125.jpg",
    "img/wiki/126.jpg",
    "img/wiki/127.jpg",
    "img/wiki/128.jpg",
    "img/wiki/129.jpg",
    "img/wiki/130.jpg",
    "img/wiki/131.jpg",
    "img/wiki/132.jpg",
    "img/wiki/133.webp",
    "img/wiki/134.webp",
    "img/wiki/135.jpg",
    "img/wiki/136.jpg",
    "img/wiki/137.jpg",
    "img/wiki/138.webp",
    "img/wiki/139.jpg",
    "img/wiki/140.jpg",
    "img/wiki/141.jpg",
    "img/wiki/142.jpg",
    "img/wiki/143.jpg",
    "img/wiki/144.jpg",
    "img/wiki/145.jpg",
    "img/wiki/146.jpg",
    "img/wiki/147.jpg",
    "img/wiki/148.jpg",
    "img/wiki/149.jpg",
    "img/wiki/150.jpg",
    "img/wiki/151.webp",
    "img/wiki/152.jpg",
    "img/wiki/153.jpg",
    "img/wiki/154.jpg",
    "img/wiki/155.jpg",
    "img/wiki/156.jpg",
    "img/wiki/157.jpg",
    "img/wiki/158.jpg",
    "img/wiki/159.jpg",
    "img/wiki/160.jpg",
    "img/wiki/161.jpg",
    "img/wiki/162.jpg",
    "img/wiki/163.jpg",
    "img/wiki/164.webp",
    "img/wiki/165.jpg",
    "img/wiki/166.jpg",
    "img/wiki/167.jpg",
    "img/wiki/168.webp",
    "img/wiki/169.jpg",
    "img/wiki/170.jpg",
    "img/wiki/171.jpg",
    "img/wiki/172.jpg",
    "img/wiki/173.jpg",
    "img/wiki/174.jpg",
    "img/wiki/175.jpg",
    "img/wiki/176.jpg",
    "img/wiki/177.jpg",
    "img/wiki/178.jpg",
    "img/wiki/179.jpg",
    "img/wiki/180.jpg",
    "img/wiki/181.jpg",
    "img/wiki/182.jpg",
    "img/wiki/183.jpg",
    "img/wiki/184.jpg",
    "img/wiki/185.jpg",
    "img/wiki/186.jpg",
    "img/wiki/187.jpg",
    "img/wiki/188.jpg",
    "img/wiki/189.jpg"
];

        const getRandomImage = () => {
            const randomIndex = Math.floor(Math.random() * wikiData.length);
            const imagePath = wikiData[randomIndex];
            
            // Fade out, swap source, fade back in
            wikiImage.style.opacity = '0';
            setTimeout(() => {
                wikiImage.src = imagePath;
                
                wikiImage.onload = () => {
                    wikiImage.style.opacity = '1';
                };
            }, 200); // 200ms matches the CSS transition time
        };

        // Smooth transition applied to the image element
        wikiImage.style.transition = 'opacity 0.2s ease';

        if (wikiBtn && wikiModal) {
            // Open Modal & get random image
            wikiBtn.addEventListener('click', () => {
                getRandomImage();
                wikiModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevents background scrolling
            });

            const closeModal = () => {
                wikiModal.classList.add('hidden');
                document.body.style.overflow = 'auto'; // Restores background scrolling
            };

            // Close mechanics
            wikiCloseBtn.addEventListener('click', closeModal);
            wikiModal.addEventListener('click', (e) => {
                if (e.target === wikiModal) closeModal();
            });

            // Refresh mechanic with satisfying continuous icon spin
            wikiRefreshBtn.addEventListener('click', () => {
                const icon = wikiRefreshBtn.querySelector('i');
                
                // Set smooth spring-like rotation transition
                icon.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                
                // Add 360 degrees to whatever the current rotation is
                icon.style.transform = `rotate(${(wikiRefreshBtn.clicks || 1) * 360}deg)`;
                wikiRefreshBtn.clicks = (wikiRefreshBtn.clicks || 1) + 1;
                
                getRandomImage();
            });
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
