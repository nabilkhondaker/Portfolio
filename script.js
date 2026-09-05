class Portfolio {
    constructor() {
        this.init();
    }
    init() {
        this.setupLoading();
        this.setupSocialLinks();
        this.setupScrollAnimations();
        this.setupFooterYear();
        this.setupClock();
        this.setupEmailCopy();
        this.setupThemePicker();
        this.setupWikiViewer();
        this.setupSimulations();
        this.setupPortfolioOverlay();
        this.setupOverviewModal();
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
            window.addEventListener('load', removeLoader, {
                passive: true
            });
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

    setupFooterYear() {
        const yearSpan = document.getElementById('current-year');
        if (yearSpan) {
            yearSpan.textContent = new Date().getFullYear();
        }
    }

    setupClock() {
    const clockEl = document.getElementById('clock-time');
    if (!clockEl) return;

    const update = () => {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    };

    update();
    setInterval(update, 1000);
}

    setupEmailCopy() {
        const copyBtn = document.getElementById('copy-email-btn');
        const emailText = document.getElementById('email-text');

        if (copyBtn && emailText) {
            copyBtn.addEventListener('click', () => {
                const emailLink = emailText.querySelector('a');
                const targetString = emailLink ? emailLink.textContent.trim() : emailText.textContent.trim();
                navigator.clipboard.writeText(targetString)
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
            gold: {
                accent: '#913700',
                secondary: '#ffe600',
                bg: '#0a0a0b'
            },
            cyber: {
                accent: '#ff0055',
                secondary: '#00ffcc',
                bg: '#05000a'
            },
            toxic: {
                accent: '#0d5f00',
                secondary: '#00ff66',
                bg: '#000501'
            },
            cosmic: {
                accent: '#4d0099',
                secondary: '#00ffff',
                bg: '#02000a'
            },
            crimson: {
                accent: '#910000',
                secondary: '#ff4d4d',
                bg: '#0a0000'
            }
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
        }, {
            passive: true
        });

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

            wikiImage.style.opacity = '0';
            setTimeout(() => {
                wikiImage.src = imagePath;
                wikiImage.onload = () => {
                    wikiImage.style.opacity = '1';
                };
            }, 200);
        };

        if (wikiImage) wikiImage.style.transition = 'opacity 0.2s ease';

        if (wikiBtn && wikiModal) {
            wikiBtn.addEventListener('click', () => {
                getRandomImage();
                wikiModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });

            const closeModal = () => {
                wikiModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            };

            wikiCloseBtn.addEventListener('click', closeModal);
            wikiModal.addEventListener('click', (e) => {
                if (e.target === wikiModal) closeModal();
            });

            if (wikiRefreshBtn) {
                wikiRefreshBtn.addEventListener('click', () => {
                    const icon = wikiRefreshBtn.querySelector('i');
                    icon.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    icon.style.transform = `rotate(${(wikiRefreshBtn.clicks || 1) * 360}deg)`;
                    wikiRefreshBtn.clicks = (wikiRefreshBtn.clicks || 1) + 1;
                    getRandomImage();
                });
            }
        }
    }

    setupSimulations() {
        const simulationsData = [{
                id: 1,
                title: "two disks bouncing on flat plate spring-coupled between opposed pin supports",
                desc: "two disks bounce on a frictionless flat plate that is spring-supported at both ends between opposed pin supports, with perfectly elastic collisions (e = 1)",
                videoSrc: "simulations/ds1.mp4",
                whyText: "i wanted a clean test case for impact dynamics combined with a flexible base. the plate isn’t rigid, so every collision feeds energy into the springs and the motion of the plate feeds back into the next bounce. it felt like a good way to practice modeling contact + continuous elastic deformation together.",
                learnedText: "how to formulate the equations when the “ground” itself is a dynamic degree of freedom, and how energy is conserved (or nearly conserved) across successive impacts when e = 1. also got better at handling the discontinuous velocity jumps from elastic collisions inside an otherwise continuous spring-mass system.",
                challengesText: "getting the impact detection and impulse resolution correct without introducing artificial energy gain or loss was the main headache. the coupling between the vertical motion of the plate and the horizontal/rotational degrees of freedom of the disks also required careful lagrange or newton-euler setup so the reactions at the pin supports stayed consistent."
            },
            {
                id: 2,
                title: "formation of blocks coupled by rods and springs ",
                desc: "a multi-body system of rigid blocks linked by rods and springs, subjected to harmonic base excitation at angular frequencies around 3–5 rad/s",
                videoSrc: "simulations/ds2.mp4",
                whyText: "i was interested in how a chain of rigid bodies connected by both rigid and elastic elements responds when the whole thing is shaken. it’s a classic vibration-isolation / multi-degree-of-freedom problem and a good excuse to derive the full mass, damping, and stiffness matrices.",
                learnedText: "how the natural frequencies and mode shapes shift once you mix rigid links with springs, and how base excitation projects onto those modes. also practiced assembling the equations for a system that has both holonomic constraints (the rods) and force elements (the springs).",
                challengesText: "keeping the rigid rods from introducing numerical stiffness or constraint drift while still letting the springs do their job. choosing the right coordinates (absolute vs relative) and making sure the harmonic forcing term was applied correctly to the base without accidentally forcing internal degrees of freedom was fiddly."
            },
            {
                id: 3,
                title: "swinging block with harmonic driving force spring-coupled to masses with pendulums",
                desc: "a central swinging block driven by a harmonic force and spring-coupled on either side to masses that each carry a pendulum",
                videoSrc: "simulations/ds3.mp4",
                whyText: "this one combines forced vibration of a rigid body with secondary pendulum dynamics. i wanted to see energy transfer between the driven block and the pendulums through the coupling springs, and how the pendulums can act as tuned absorbers or amplifiers depending on frequency.",
                learnedText: "how to write the lagrange equations for a system that mixes translational/rotational motion of the central block with the angular degrees of freedom of the pendulums. also saw clearly how the phase relationship between the driving force and the pendulum swings changes across resonance.",
                challengesText: "the nonlinear geometry of the pendulums (sin/cos terms) made the equations messy. linearizing for small angles was tempting but i wanted the full nonlinear behavior, so the numerical integration had to stay stable when the pendulums swung large."
            },
            {
                id: 4,
                title: "pulley system with spring-coupled blocks and oscillating disk",
                desc: "a cable-and-pulley arrangement featuring two spring-coupled sliding blocks on a horizontal track together with a vertically oscillating disk.",
                videoSrc: "simulations/ds4.mp4",
                whyText: "pulley systems force you to deal with kinematic constraints that link translational degrees of freedom in non-obvious ways. adding the springs and the oscillating disk made it a nice mixed constraint + force problem.",
                learnedText: "how to reduce the system using the pulley constraint (the cable length is constant) so you only keep independent coordinates, then derive the effective inertia and the forces that appear in those reduced coordinates. also practiced treating the disk’s vertical motion as an additional degree of freedom that still has to satisfy the cable constraint.",
                challengesText: "making sure the constraint forces (cable tensions) were consistent and that the numerical scheme didn’t slowly violate the constant-length condition. the interaction between the horizontal spring-coupled blocks and the vertical disk motion through the cable was easy to get wrong in the virtual-work or lagrange formulation."
            },
            {
                id: 5,
                title: "triple pendulum with spring coupling fixed mount to second mass",
                desc: "a triple-pendulum system consisting of two disks and a tip mass, with an additional spring that couples the fixed mount to the second mass",
                videoSrc: "simulations/ds5.mp4",
                whyText: "triple pendulums are already chaotic and interesting; adding a spring from the fixed support to an intermediate mass changes the effective restoring forces and couples the angles in a new way. i wanted to see how that extra elastic term alters the classic multi-pendulum dynamics.",
                learnedText: "deriving the full nonlinear equations for a triple pendulum is already a workout (lots of coupled sin/cos terms and coriolis accelerations). inserting the spring force into the lagrange equations and tracking how energy flows between the three angles taught me a lot about generalized forces.",
                challengesText: "the algebra for the kinetic and potential energy gets long fast. keeping the equations organized and verifying them against special cases (e.g., setting the spring stiffness to zero should recover a normal triple pendulum) took care. numerical stability when the system goes chaotic was also something i had to watch."
            },
            {
                id: 6,
                title: "rigid swinging frame with two spring-pendulum assemblies",
                desc: "a rigid swinging frame that contains two independent spring-supported pendulum assemblies, one on each side",
                videoSrc: "simulations/ds6.mp4",
                whyText: "i liked the idea of a rigid body that itself can swing, carrying two internal vibrating systems. it creates a clear primary motion (the frame) and secondary motions (the spring-pendulums) that interact through the moving support points.",
                learnedText: "how the acceleration of the frame appears as a kinematic excitation for the internal pendulums, and how the reaction forces from those pendulums feed back into the equation of motion of the frame. it’s a nice illustration of two-way coupling between a rigid-body degree of freedom and elastic-pendulum degrees of freedom.",
                challengesText: "writing the position of each pendulum mass in an inertial frame (so the kinetic energy is correct) while the frame is rotating required careful use of rotation matrices or complex geometry. making sure the spring forces and gravity were projected onto the right generalized coordinates was the main source of bugs."
            },
            {
                id: 7,
                title: "disk with offset pendulum rolling without slipping on horizontally oscillating mass",
                desc: "a disk carrying an offset pendulum that rolls without slipping atop a horizontally oscillating, spring-supported cart",
                videoSrc: "simulations/ds7.mp4",
                whyText: "rolling-without-slipping is a classic non-holonomic (or holonomic in this planar case) constraint, and attaching an offset pendulum adds an interesting unbalanced rotor effect. the whole thing sitting on a spring-supported cart that can move horizontally makes the base itself dynamic.",
                learnedText: "how to enforce the no-slip condition (relating the cart’s translation, the disk’s translation, and the disk’s rotation) and then derive the remaining independent equations. the offset pendulum introduces a time-varying inertia and a centrifugal term that couples strongly into the rolling motion.",
                challengesText: "getting the rolling constraint correct and consistent with the spring force on the cart was tricky. the offset pendulum also means the center of mass of the disk+pendulum system is moving, so the moment balance about the contact point has to be handled carefully."
            },
            {
                id: 8,
                title: "two disks coupled by parallel rods with pendulum",
                desc: "two disks connected by parallel rods and fitted with a pendulum, constrained to move along a parabolic surface",
                videoSrc: "simulations/ds8.mp4",
                whyText: "parallel rods keep the orientation of the disks linked, and the parabolic constraint forces the whole assembly to follow a curved path. adding a pendulum gives an extra swinging degree of freedom. it’s a nice mix of geometric constraint and rigid-body coupling.",
                learnedText: "how to parameterize motion on a parabolic constraint and then write the lagrange equations with the remaining free coordinates (including the pendulum angle). the parallel-rod connection also imposes orientation constraints that reduce the number of independent rotational degrees of freedom.",
                challengesText: "the parabolic surface means the normal force and the tangential acceleration are related through the local curvature. deriving the effective kinetic energy and the generalized forces while respecting both the parallel-rod constraints and the surface constraint required careful coordinate choice."
            },
            {
                id: 9,
                title: "a free slider and a spring-bound slider carrying a pendulum",
                desc: "a free sliding mass and a spring-restrained sliding mass that carries a pendulum, both free to move on a frictionless horizontal track",
                videoSrc: "simulations/ds9.mp4",
                whyText: "simple looking, but it cleanly shows the interaction between an unconstrained degree of freedom and a spring-pendulum system. momentum conservation in the horizontal direction becomes interesting once the pendulum starts swinging.",
                learnedText: "how the free slider’s motion is affected by the reaction force transmitted through the (implicit) interaction or just by the overall momentum balance, and how the pendulum’s swing modulates the effective force on the spring-bound mass. good practice with systems that have both free and elastically constrained coordinates.",
                challengesText: "keeping the horizontal momentum accounting correct and making sure the pendulum’s horizontal inertia was properly coupled into the equations of the two sliders. small mistakes in the kinetic-energy terms showed up as violations of momentum conservation."
            },
            {
                id: 10,
                title: "rocking frame with suspended interior block and pendulum",
                desc: "a rocking rectangular frame that contains an interior block suspended by a spring and also carries a pendulum at its base",
                videoSrc: "simulations/ds10.mp4",
                whyText: "rocking frames appear in seismic and impact problems. putting a sprung mass and a pendulum inside creates internal dynamics that interact with the rocking motion, which itself is discontinuous when the frame lifts off or impacts the ground.",
                learnedText: "how to model a rigid body that can rock (piecewise contact) while still carrying continuous internal degrees of freedom. the switch between one-sided contact and free flight, plus the impact map when the frame hits the ground again, had to live alongside the ordinary differential equations of the suspended block and pendulum.",
                challengesText: "hybrid dynamics (continuous ODEs + discrete impact events) are always messy. detecting contact, applying the correct impulse, and then restarting the integration without introducing energy errors or constraint drift took the most care."
            },
            {
                id: 11,
                title: "two disks coupled by springs rolling horizontally on parallel surfaces",
                desc: "two disks linked by springs that roll horizontally on a pair of parallel upper and lower surfaces",
                videoSrc: "simulations/ds11.mp4",
                whyText: "rolling on both an upper and lower surface is an unusual constraint setup, and the springs between the disks create an elastic coupling. i wanted to see the resulting oscillation modes under pure rolling.",
                learnedText: "how the no-slip conditions on two parallel surfaces constrain the relative translation and rotation of the disks, and how the spring forces then drive the remaining free motion. the kinematics alone already force a relationship between the angular and linear velocities.",
                challengesText: "enforcing two simultaneous rolling constraints without over-constraining the system or introducing inconsistency. the algebraic relationship between the coordinates had to be derived carefully before the dynamics could even be written."
            },
            {
                id: 12,
                title: "three inverted pendulums sharing common pivot coupled by springs",
                desc: "three inverted pendulums that share a common pivot point and are mutually coupled to one another by springs",
                videoSrc: "simulations/ds12.mp4",
                whyText: "inverted pendulums are classic unstable systems; coupling three of them at a single pivot with springs creates a multi-degree-of-freedom unstable equilibrium whose linearized modes can be studied, and whose nonlinear behavior is rich.",
                learnedText: "how to write the equations for multiple inverted pendulums that share the same pivot (so the kinetic energy terms are tightly coupled) and then add the spring potential between them. linearizing about the upright position gives a clear eigenvalue problem for the coupled system.",
                challengesText: "the upright equilibrium is unstable, so any numerical integration is sensitive to initial conditions and time-step size. getting the linearized stiffness and mass matrices right so the predicted natural frequencies matched the nonlinear simulation for small amplitudes was the main verification step."
            }
        ];

        const featuredGrid = document.getElementById('featured-sims-grid');
        const allGrid = document.getElementById('all-sims-grid');

        const modal = document.getElementById('sim-modal');
        const modalVideo = document.getElementById('sim-modal-video');
        const modalTitle = document.getElementById('sim-modal-title');
        const modalDesc = document.getElementById('sim-modal-desc');
        const closeBtn = document.getElementById('sim-close-btn');

        const featuredSimIds = [1, 5, 12];

        const renderSims = (container, dataList) => {
            if (!container) return;
            container.innerHTML = '';

            dataList.forEach((sim) => {
                const card = document.createElement('div');
                card.className = 'sim-card';

                // FIXED: removed broken poster="${sim.posterSrc}" and added preload="metadata"
                card.innerHTML = `
    <div class="sim-video-wrapper">
        <video muted loop playsinline preload="auto" style="pointer-events: none;">
            <source src="${sim.videoSrc}" type="video/mp4">
        </video>
    </div>
    <div class="sim-info">
        <h4>${sim.title}</h4>
    </div>
    
    <div class="glass-bubble">
        <div class="glass-bubble-inner">
            <h4>Simulation Details</h4>
            <p>${sim.desc}</p>
            <button class="mini-btn overview-btn"><i class="fa-solid fa-circle-info"></i> overview</button>
        </div>
    </div>
`;

const video = card.querySelector('video');

// More reliable way to force the first real frame
const forceThumbnail = () => {
    if (video.readyState >= 2) {          // HAVE_CURRENT_DATA or higher
        video.currentTime = 0.1;          // jump a tiny bit past any black intro
        video.pause();
    }
};

video.addEventListener('loadeddata', forceThumbnail, { once: true });
video.addEventListener('loadedmetadata', forceThumbnail, { once: true });

// Fallback in case the events already fired
if (video.readyState >= 2) {
    forceThumbnail();
}
                card.addEventListener('mouseenter', () => {
                    video.play().catch(() => {});
                });
                card.addEventListener('mouseleave', () => {
                    video.pause();
                });

                card.addEventListener('click', () => {
                    modalVideo.src = sim.videoSrc;
                    modalTitle.textContent = sim.title;
                    modalDesc.textContent = sim.desc;

                    // --- Inject modal overview button inside the video player ---
                    const videoContainer = modalVideo.parentElement;
                    let modalOverviewBtn = videoContainer.querySelector('.sim-modal-overview-btn');

                    if (!modalOverviewBtn) {
                        videoContainer.style.position = 'relative'; // Ensure absolute positioning is relative to this wrapper
                        modalOverviewBtn = document.createElement('button');
                        modalOverviewBtn.className = 'mini-btn overview-btn sim-modal-overview-btn';
                        modalOverviewBtn.innerHTML = '<i class="fa-solid fa-circle-info"></i> overview';
                        videoContainer.appendChild(modalOverviewBtn);
                    }

                    modalOverviewBtn.onclick = (e) => {
                        e.stopPropagation(); // Prevent the sim-modal from closing
                        if (window.openOverviewModal) {
                            window.openOverviewModal(
                                sim.title,
                                sim.desc,
                                sim.whyText,
                                sim.learnedText,
                                sim.challengesText
                            );
                        }
                    };
                    // ------------------------------------------------------------

                    modal.classList.remove('hidden');
                    modalVideo.play().catch(() => {});
                });

                // Attach overview modal hook for the main grid card
                const overviewBtn = card.querySelector('.overview-btn');
                if (overviewBtn) {
                    overviewBtn.addEventListener('click', (e) => {
                        e.stopPropagation(); // prevent sim-modal from opening
                        if (window.openOverviewModal) {
                            window.openOverviewModal(
                                sim.title,
                                sim.desc,
                                sim.whyText,
                                sim.learnedText,
                                sim.challengesText
                            );
                        }
                    });
                }

                container.appendChild(card);
            });
        };

        const featuredSims = simulationsData.filter(s => featuredSimIds.includes(s.id));

        renderSims(featuredGrid, featuredSims);
        renderSims(allGrid, simulationsData);

        const closeModal = () => {
            modal.classList.add('hidden');
            modalVideo.pause();
            setTimeout(() => {
                modalVideo.src = '';
            }, 300);
        };

        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) closeModal();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
                closeModal();
            }
        });
    }

    setupPortfolioOverlay() {
        const openBtn = document.getElementById('open-full-portfolio-btn');
        const closeBtn = document.getElementById('close-portfolio-btn');
        const closeBtnFront = document.getElementById('close-portfolio-btn-front');
        const overlay = document.getElementById('full-portfolio-page');
        const scrollToSimsBtn = document.getElementById('scroll-to-sims-btn');

        if (openBtn && (closeBtn || closeBtnFront) && overlay) {
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
                overlay.scrollTo(0, 0);

                // Reset button state when opening
                if (scrollToSimsBtn) {
                    scrollToSimsBtn.classList.remove('hidden-btn');
                }
            });

            const triggerClose = () => {
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            };

            if (closeBtn) closeBtn.addEventListener('click', triggerClose);
            if (closeBtnFront) closeBtnFront.addEventListener('click', triggerClose);
        }

        // Smart show/hide + click behavior
        if (scrollToSimsBtn && overlay) {
            const target = document.getElementById('dynamics-sims-section');

            const updateButtonVisibility = () => {
                if (!target) return;

                const overlayRect = overlay.getBoundingClientRect();
                const targetRect = target.getBoundingClientRect();

                // Show button only when the Dynamics section is still below the visible area
                const isSectionBelow = targetRect.top > overlayRect.bottom - 120;

                if (isSectionBelow) {
                    scrollToSimsBtn.classList.remove('hidden-btn');
                } else {
                    scrollToSimsBtn.classList.add('hidden-btn');
                }
            };

            // Listen to scroll inside the overlay
            overlay.addEventListener('scroll', updateButtonVisibility, {
                passive: true
            });

            // Also check on open / resize
            window.addEventListener('resize', updateButtonVisibility);

            // Click → smooth scroll to simulations
            scrollToSimsBtn.addEventListener('click', () => {
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        }
    }

    setupOverviewModal() {
        const overviewModal = document.getElementById('overview-modal');
        const overviewCloseBtn = document.getElementById('overview-close-btn');

        if (overviewCloseBtn && overviewModal) {
            const closeOverview = () => {
                overviewModal.classList.add('hidden');
            };
            overviewCloseBtn.addEventListener('click', closeOverview);
            overviewModal.addEventListener('click', (e) => {
                if (e.target === overviewModal) closeOverview();
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !overviewModal.classList.contains('hidden')) {
                    closeOverview();
                }
            });
        }
    }
}

window.openOverviewModal = (title, summary, why, learned, challenges) => {
    document.getElementById('overview-title').innerHTML = title;
    document.getElementById('overview-summary').innerHTML = summary || "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    document.getElementById('overview-why').innerHTML = why || "Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore.";
    document.getElementById('overview-learned').innerHTML = learned || "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.";
    document.getElementById('overview-challenges').innerHTML = challenges || "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.";

    const modal = document.getElementById('overview-modal');
    if (modal) {
        modal.classList.remove('hidden');
    }
};

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
                    case 'online':
                        statusColor = '#23a55a';
                        break;
                    case 'idle':
                        statusColor = '#f0b232';
                        break;
                    case 'dnd':
                        statusColor = '#f23f43';
                        break;
                    default:
                        statusColor = '#80848e';
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
    anchor.addEventListener('click', function(e) {
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
