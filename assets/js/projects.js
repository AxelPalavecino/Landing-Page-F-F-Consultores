/* assets/js/projects.js */

/* =========================================
   LIGHTBOX PRO (Galería Interactiva)
   ========================================= */

const initLightbox = () => {
    const lightbox = document.getElementById('project-lightbox');
    if (!lightbox) return;

    // Elementos del DOM
    const lbImg = lightbox.querySelector('.lightbox__img');
    const lbCategory = lightbox.querySelector('.lightbox__category');
    const lbTitle = lightbox.querySelector('.lightbox__title');
    const lbDesc = lightbox.querySelector('.lightbox__desc');
    const btnPrev = lightbox.querySelector('.lightbox__nav--prev');
    const btnNext = lightbox.querySelector('.lightbox__nav--next');
    const btnClose = lightbox.querySelector('.lightbox__close');

    // Datos
    const projectTriggers = Array.from(document.querySelectorAll('.project__btn'));
    if (projectTriggers.length === 0) return;

    // Estado
    let currentIndex = 0;
    const totalProjects = projectTriggers.length;
    
    // Variables para Touch
    let touchStartX = 0;
    let touchStartY = 0;

    // ----------------------------------------------------
    // FUNCIÓN CORE: Actualizar UI
    // ----------------------------------------------------
    const updateLightboxUI = (index) => {
        const trigger = projectTriggers[index];
        const data = trigger.dataset;

        // 1. Ocultar imagen actual suavemente
        // Usamos opacidad 0 para evitar ver la imagen anterior mientras carga la nueva
        lbImg.style.opacity = '0';
        lbImg.style.transform = 'scale(0.96)'; // Pequeño efecto zoom out

        // Pequeño timeout para permitir que la transición de salida se note
        setTimeout(() => {
            // 2. Cambiar datos
            lbImg.src = data.src;
            lbImg.alt = data.title;
            lbCategory.textContent = data.category;
            lbTitle.textContent = data.title;
            lbDesc.textContent = data.description;

            // 3. Mostrar cuando esté cargada
            lbImg.onload = () => {
                lbImg.style.opacity = '1';
                lbImg.style.transform = 'scale(1)';
            };
        }, 200); // 200ms coincide con una transición rápida CSS

        // 4. Precarga Inteligente (Siguiente imagen)
        const nextIndex = (index + 1) % totalProjects;
        const nextImg = new Image();
        nextImg.src = projectTriggers[nextIndex].dataset.src;
    };

    // ----------------------------------------------------
    // CONTROLADORES
    // ----------------------------------------------------
    const openLightbox = (index) => {
        currentIndex = index;
        // Pre-carga inmediata sin animación para la primera vez
        const trigger = projectTriggers[index];
        lbImg.src = trigger.dataset.src;
        lbCategory.textContent = trigger.dataset.category;
        lbTitle.textContent = trigger.dataset.title;
        lbDesc.textContent = trigger.dataset.description;
        
        // Mostrar
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Accesibilidad: Enfocar el botón de cerrar
        setTimeout(() => btnClose.focus(), 100);
        
        // Animación entrada imagen
        requestAnimationFrame(() => {
            lbImg.style.opacity = '1';
            lbImg.style.transform = 'scale(1)';
        });
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    const nextImage = () => {
        currentIndex = (currentIndex + 1) % totalProjects;
        updateLightboxUI(currentIndex);
    };

    const prevImage = () => {
        currentIndex = (currentIndex - 1 + totalProjects) % totalProjects;
        updateLightboxUI(currentIndex);
    };

    // ----------------------------------------------------
    // EVENT LISTENERS
    // ----------------------------------------------------
    
    // Triggers (Tarjetas)
    projectTriggers.forEach((trigger, index) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    // Botones Navegación
    btnNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });
    btnClose.addEventListener('click', closeLightbox);

    // Cerrar al click fuera
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox__overlay')) {
            closeLightbox();
        }
    });

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        
        switch(e.key) {
            case 'Escape': closeLightbox(); break;
            case 'ArrowRight': nextImage(); break;
            case 'ArrowLeft': prevImage(); break;
        }
    });

    // ----------------------------------------------------
    // GESTOS TÁCTILES PRO (Con detección de eje Y)
    // ----------------------------------------------------
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const touchEndY = e.changedTouches[0].screenY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;

        // Lógica PRO: Solo deslizar si el movimiento es horizontal
        // Si se movió mucho en vertical (Y), es que quería hacer scroll, no swipe.
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Umbral de 50px para confirmar intención
            if (Math.abs(diffX) > 50) {
                if (diffX > 0) nextImage(); // Deslizó a izquierda -> Siguiente
                else prevImage(); // Deslizó a derecha -> Anterior
            }
        }
    }, { passive: true });
};

/* =========================================
   ANIMACIÓN DE CARDS AL SCROLL
   ========================================= */
const initProjectAnimations = () => {
    const cards = document.querySelectorAll('.project__card');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Cálculo dinámico del delay basado en el índice
                // Esto evita tener que saber el índice global si hay filtrado
                const target = entry.target;
                target.classList.add('is-visible');
                observer.unobserve(target);
            }
        });
    }, { 
        threshold: 0.15, // Esperar a que se vea un 15%
        rootMargin: "0px 0px -50px 0px" // Offset inferior para efecto elegante
    });

    cards.forEach((card, index) => {
        card.classList.add('is-hidden');
        // Asignamos el delay via estilo inline para la cascada
        card.style.transitionDelay = `${index * 0.1}s`; 
        observer.observe(card);
    });
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initLightbox();
    initProjectAnimations();
});