/* assets/js/contact.js */

/* =========================================
   CONTACT FORM - Premium Interactions
   ========================================= */

(() => {
    'use strict';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* =========================================
       1. SUBMIT BUTTON INTERACTION
       ========================================= */
    const initSubmitButton = () => {
        const form = document.querySelector('.contact__form');
        const submitBtn = document.querySelector('.contact__submit');
        
        if (!form || !submitBtn) return;

        // Store original content
        const originalContent = submitBtn.innerHTML;
        const originalText = 'Enviar Mensaje';
        
        // Loading state HTML
        const loadingContent = `
            <span class="button__spinner"></span>
            Enviando...
        `;
        
        // Success state HTML
        const successContent = `
            <svg class="button__icon button__icon--success" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ¡Enviado!
        `;

        // Handle form submission
        form.addEventListener('submit', (e) => {
            // Don't prevent default - let mailto work
            // But add visual feedback
            
            if (submitBtn.classList.contains('is-loading')) {
                e.preventDefault();
                return;
            }

            // Set loading state
            submitBtn.classList.add('is-loading');
            submitBtn.innerHTML = loadingContent;
            submitBtn.disabled = true;

            // Simulate sending (for visual feedback)
            setTimeout(() => {
                // Success state
                submitBtn.classList.remove('is-loading');
                submitBtn.classList.add('is-success');
                submitBtn.innerHTML = successContent;

                // Reset after delay
                setTimeout(() => {
                    submitBtn.classList.remove('is-success');
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                }, 2000);

            }, 1500);
        });

        // Add ripple effect on click (if not reduced motion)
        if (!prefersReducedMotion) {
            submitBtn.addEventListener('click', createRipple);
        }
    };

    /* =========================================
       2. RIPPLE EFFECT
       ========================================= */
    const createRipple = (e) => {
        const button = e.currentTarget;
        
        // Remove existing ripples
        const existingRipple = button.querySelector('.button__ripple');
        if (existingRipple) {
            existingRipple.remove();
        }

        // Create ripple element
        const ripple = document.createElement('span');
        ripple.className = 'button__ripple';
        
        // Calculate position
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        // Remove after animation
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    };

    /* =========================================
       3. INPUT FOCUS ENHANCEMENTS
       ========================================= */
    const initInputEnhancements = () => {
        const inputs = document.querySelectorAll('.contact__input');
        
        inputs.forEach(input => {
            // Add focus line element
            const group = input.parentElement;
            if (!group.querySelector('.contact__focus-line')) {
                const focusLine = document.createElement('span');
                focusLine.className = 'contact__focus-line';
                group.appendChild(focusLine);
            }

            // Add filled class for styling
            input.addEventListener('blur', () => {
                if (input.value.trim() !== '') {
                    input.classList.add('is-filled');
                } else {
                    input.classList.remove('is-filled');
                }
            });

            // Check on load
            if (input.value.trim() !== '') {
                input.classList.add('is-filled');
            }
        });
    };

    /* =========================================
       4. SOCIAL BUTTONS STAGGER
       ========================================= */
    const initSocialStagger = () => {
        const socialBtns = document.querySelectorAll('.social-btn');
        
        if (prefersReducedMotion || !socialBtns.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    socialBtns.forEach((btn, index) => {
                        btn.style.setProperty('--stagger-delay', `${index * 100}ms`);
                        btn.classList.add('is-visible');
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const socialsContainer = document.querySelector('.contact__social-links');
        if (socialsContainer) {
            observer.observe(socialsContainer);
        }
    };

    /* =========================================
       INITIALIZATION
       ========================================= */
    const init = () => {
        initSubmitButton();
        initInputEnhancements();
        initSocialStagger();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
