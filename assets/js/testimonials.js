/* assets/js/testimonials.js */

/* =========================================
   TESTIMONIALS - Premium Effects
   ========================================= */

(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =========================================
       1. DYNAMIC AVATAR INITIALS
       ========================================= */
    const initAvatarInitials = () => {
        const cards = document.querySelectorAll('.testimonial__card');
        if (!cards.length) return;

        cards.forEach((card, index) => {
            const nameEl = card.querySelector('.testimonial__name');
            const avatarEl = card.querySelector('.testimonial__avatar');
            
            if (!nameEl || !avatarEl) return;

            // Extract initials from name
            const name = nameEl.textContent.trim();
            const initials = extractInitials(name);

            // Generate a subtle color variation based on index
            const hueShift = (index * 15) % 60; // Slight hue variation
            
            // Replace SVG with initials
            avatarEl.innerHTML = `<span class="testimonial__initials">${initials}</span>`;
            avatarEl.style.setProperty('--avatar-hue-shift', `${hueShift}deg`);
            avatarEl.classList.add('testimonial__avatar--initials');
        });
    };

    /**
     * Extract initials from a name string
     * "Adrián S." -> "AS"
     * "Juan Carlos" -> "JC"
     */
    const extractInitials = (name) => {
        // Remove special characters and extra spaces
        const cleanName = name
            .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '')
            .trim();
        
        // Split into words and get first letter of each
        const words = cleanName.split(/\s+/).filter(word => word.length > 0);
        
        if (words.length === 0) return '?';
        if (words.length === 1) return words[0].charAt(0).toUpperCase();
        
        // Get first letter of first and last word
        const firstInitial = words[0].charAt(0).toUpperCase();
        const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
        
        return firstInitial + lastInitial;
    };

    /* =========================================
       2. STAGGERED ENTRANCE ANIMATION
       ========================================= */
    const initStaggeredReveal = () => {
        const section = document.querySelector('.testimonials');
        const cards = document.querySelectorAll('.testimonial__card');
        
        if (!section || !cards.length) return;

        // Add initial hidden state
        cards.forEach((card, index) => {
            card.classList.add('testimonial__card--hidden');
            card.style.setProperty('--card-index', index);
        });

        // Skip animation if reduced motion
        if (prefersReducedMotion) {
            cards.forEach(card => {
                card.classList.remove('testimonial__card--hidden');
                card.classList.add('testimonial__card--visible');
            });
            return;
        }

        // Create observer
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealCards = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Stagger the reveal of each card
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.classList.remove('testimonial__card--hidden');
                            card.classList.add('testimonial__card--visible');
                        }, index * 150); // 150ms stagger between cards
                    });
                    
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(revealCards, observerOptions);
        observer.observe(section);
    };

    /* =========================================
       3. SUBTLE PARALLAX ON QUOTE ICON
       ========================================= */
    const initQuoteParallax = () => {
        if (prefersReducedMotion) return;

        const cards = document.querySelectorAll('.testimonial__card');
        
        cards.forEach(card => {
            const quoteIcon = card.querySelector('.testimonial__quote-icon');
            if (!quoteIcon) return;

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                
                // Subtle movement (max 10px)
                const moveX = x * 10;
                const moveY = y * 10;
                
                quoteIcon.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1) rotate(-10deg)`;
            });

            card.addEventListener('mouseleave', () => {
                quoteIcon.style.transform = '';
            });
        });
    };

    /* =========================================
       INITIALIZATION
       ========================================= */
    const init = () => {
        initAvatarInitials();
        initStaggeredReveal();
        initQuoteParallax();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
