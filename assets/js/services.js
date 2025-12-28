/* assets/js/services.js */

/* =========================================
   CONTADOR ANIMADO
   ========================================= */
const initCounters = () => {
    const counters = document.querySelectorAll('.services__counter-number');
    
    if (!counters.length) return;

    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        
        // Ajuste inteligente: si el número es pequeño, animar más rápido
        // para evitar que se sienta "trabado" entre número y número.
        const duration = target < 20 ? 1000 : 2000; 
        
        const frameDuration = 1000 / 60; // 60fps (~16ms)
        const totalFrames = Math.round(duration / frameDuration);
        const easeOutQuad = t => t * (2 - t); // Función de aceleración suave

        let frame = 0;

        const updateCounter = () => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames); // Progreso de 0 a 1
            const current = Math.round(target * progress);

            if (frame < totalFrames) {
                counter.textContent = current;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target; // Asegurar número final exacto
            }
        };

        updateCounter();
    };

    const observerOptions = { threshold: 0.5 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
};

/* =========================================
   ANIMACIÓN DE CARDS (Staggered Fade-in)
   ========================================= */
const initCardAnimations = () => {
    const cards = document.querySelectorAll('.services__card');
    
    if (!cards.length) return;

    // 1. Preparar estado inicial (Invisible y desplazado)
    cards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        // 'will-change' avisa al navegador para optimizar renderizado
        card.style.willChange = 'opacity, transform';
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Se activa apenas se ve un 10%
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                
                // Calcular delay basado en el índice visual (aproximado)
                // Usamos dataset o un cálculo simple si tenemos el índice en el loop original
                // Aquí usamos una transición directa.
                
                // Recuperar el índice del nodo para el efecto escalonado
                const index = Array.from(cards).indexOf(card);
                const delay = index * 100; // 100ms entre cada carta

                // Aplicar la animación
                // NOTA: Usamos setTimeout para el delay en lugar de transition-delay en CSS
                // para tener control total en JS.
                setTimeout(() => {
                    // Definimos la transición de ENTRADA
                    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';

                    // CRÍTICO: Limpiar estilos inline después de la animación
                    // Esto devuelve el control al archivo services.css para que el HOVER funcione bien
                    setTimeout(() => {
                        card.style.transition = ''; 
                        card.style.willChange = 'auto';
                    }, 600); // 600ms = duración de la animación

                }, delay);

                observer.unobserve(card);
            }
        });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));
};

/* =========================================
   INICIALIZACIÓN
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    initCounters();
    initCardAnimations();
});