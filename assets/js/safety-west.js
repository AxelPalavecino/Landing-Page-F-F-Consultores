/* assets/js/safety-west.js */

/* =========================================
   SAFETY WEST - Premium Effects
   ========================================= */

(() => {
    'use strict';

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =========================================
       1. CANVAS FIRE EMBERS (Background Particles)
       ========================================= */
    const initFireEmbers = () => {
        const bgElement = document.querySelector('.safety-west__bg');
        if (!bgElement || prefersReducedMotion) return;

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.className = 'safety-west__canvas';
        canvas.setAttribute('aria-hidden', 'true');
        bgElement.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let animationId;
        let particles = [];
        let isVisible = false;

        // Ember colors (using CSS variable values)
        const colors = [
            { r: 233, g: 59, b: 38 },   // --color-sw-red
            { r: 233, g: 141, b: 58 },  // --color-sw-orange
            { r: 237, g: 184, b: 64 },  // --color-sw-yellow
            { r: 255, g: 140, b: 0 },   // Dark orange
            { r: 255, g: 69, b: 0 }     // Red-orange
        ];

        // Resize handler
        const resize = () => {
            const rect = bgElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
        };

        // Particle class
        class Ember {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + 10;
                this.size = Math.random() * 3 + 1;
                this.speedY = Math.random() * 1.5 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.8;
                this.opacity = Math.random() * 0.6 + 0.4;
                this.fadeRate = Math.random() * 0.008 + 0.003;
                this.wobble = Math.random() * Math.PI * 2;
                this.wobbleSpeed = Math.random() * 0.02 + 0.01;
                
                const colorIndex = Math.floor(Math.random() * colors.length);
                this.color = colors[colorIndex];
                this.glowSize = this.size * (Math.random() * 2 + 2);
            }

            update() {
                this.wobble += this.wobbleSpeed;
                this.x += this.speedX + Math.sin(this.wobble) * 0.3;
                this.y -= this.speedY;
                this.opacity -= this.fadeRate;
                this.size *= 0.998;

                if (this.opacity <= 0 || this.y < -20) {
                    this.reset();
                }
            }

            draw() {
                if (this.opacity <= 0) return;

                ctx.save();
                
                // Outer glow
                const gradient = ctx.createRadialGradient(
                    this.x, this.y, 0,
                    this.x, this.y, this.glowSize
                );
                gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.8})`);
                gradient.addColorStop(0.4, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.3})`);
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
                ctx.fill();

                // Core
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity * 0.9})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size * 0.5, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            }
        }

        // Initialize particles
        const initParticles = () => {
            const particleCount = Math.min(Math.floor(canvas.width / 15), 80);
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                const ember = new Ember();
                ember.y = Math.random() * canvas.height; // Distribute initially
                particles.push(ember);
            }
        };

        // Animation loop
        const animate = () => {
            if (!isVisible) return;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationId = requestAnimationFrame(animate);
        };

        // Visibility observer for performance
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (isVisible) {
                    animate();
                } else {
                    cancelAnimationFrame(animationId);
                }
            });
        }, { threshold: 0.1 });

        // Initialize
        resize();
        initParticles();
        observer.observe(bgElement);

        // Resize listener with debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resize();
                initParticles();
            }, 200);
        });
    };

    /* =========================================
       2. MOUSE SPOTLIGHT EFFECT
       ========================================= */
    const initMouseSpotlight = () => {
        const section = document.querySelector('.safety-west');
        if (!section || prefersReducedMotion) return;

        // Create spotlight element
        const spotlight = document.createElement('div');
        spotlight.className = 'safety-west__spotlight';
        spotlight.setAttribute('aria-hidden', 'true');
        section.appendChild(spotlight);

        let isActive = false;
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;
        let rafId;

        // Smooth follow animation
        const updateSpotlight = () => {
            if (!isActive) return;

            // Smooth interpolation
            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;

            spotlight.style.setProperty('--spotlight-x', `${currentX}px`);
            spotlight.style.setProperty('--spotlight-y', `${currentY}px`);

            rafId = requestAnimationFrame(updateSpotlight);
        };

        // Mouse events
        section.addEventListener('mouseenter', () => {
            isActive = true;
            spotlight.classList.add('is-active');
            updateSpotlight();
        });

        section.addEventListener('mouseleave', () => {
            isActive = false;
            spotlight.classList.remove('is-active');
            cancelAnimationFrame(rafId);
        });

        section.addEventListener('mousemove', (e) => {
            const rect = section.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });
    };

    /* =========================================
       3. CINEMATIC SCROLL REVEAL
       ========================================= */
    const initScrollReveal = () => {
        const section = document.querySelector('.safety-west');
        if (!section) return;

        // Elements to animate
        const brand = section.querySelector('.safety-west__brand');
        const taglineTop = section.querySelector('.sw-line--top');
        const taglineBottom = section.querySelector('.sw-line--bottom');
        const description = section.querySelector('.safety-west__description');
        const actions = section.querySelector('.safety-west__actions');
        const marquee = section.querySelector('.safety-west__marquee');

        // Add reveal classes
        const revealElements = [
            { el: brand, delay: 0 },
            { el: taglineTop, delay: 100 },
            { el: taglineBottom, delay: 200 },
            { el: description, delay: 350 },
            { el: actions, delay: 500 },
            { el: marquee, delay: 650 }
        ];

        revealElements.forEach(({ el, delay }) => {
            if (el) {
                el.classList.add('sw-reveal');
                el.style.setProperty('--reveal-delay', `${delay}ms`);
            }
        });

        // Intersection Observer
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger all reveals
                    revealElements.forEach(({ el }) => {
                        if (el) {
                            el.classList.add('sw-reveal--visible');
                        }
                    });
                    revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe the header container
        const header = section.querySelector('.safety-west__header');
        if (header) {
            revealObserver.observe(header);
        }
    };

    /* =========================================
       INITIALIZATION
       ========================================= */
    const init = () => {
        initFireEmbers();
        initMouseSpotlight();
        initScrollReveal();
    };

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
