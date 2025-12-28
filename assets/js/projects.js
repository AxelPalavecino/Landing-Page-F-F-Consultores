/* assets/js/projects.js */

/* =========================================
   LIGHTBOX (Galería de Proyectos)
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

    // Datos
    const projectTriggers = Array.from(document.querySelectorAll('.project__btn'));
    if (projectTriggers.length === 0) return;

    // Estado
    let currentIndex = 0;
    const totalProjects = projectTriggers.length;
    let touchStartX = 0;

    // Actualizar UI
    const updateLightboxUI = (index) => {
        const trigger = projectTriggers[index];
        const data = trigger.dataset;

        lbImg.style.opacity = '0.5';
        lbImg.src = data.src;
        lbImg.alt = data.title;
        lbCategory.textContent = data.category;
        lbTitle.textContent = data.title;
        lbDesc.textContent = data.description;

        lbImg.onload = () => {
            lbImg.style.opacity = '1';
        };

        // Precarga siguiente imagen
        const nextIndex = (index + 1) % totalProjects;
        const nextImg = new Image();
        nextImg.src = projectTriggers[nextIndex].dataset.src;
    };

    // Abrir
    const openLightbox = (index) => {
        currentIndex = index;
        updateLightboxUI(currentIndex);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    // Cerrar
    const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Navegación
    const nextImage = () => {
        currentIndex = (currentIndex + 1) % totalProjects;
        updateLightboxUI(currentIndex);
    };

    const prevImage = () => {
        currentIndex = (currentIndex - 1 + totalProjects) % totalProjects;
        updateLightboxUI(currentIndex);
    };

    // Event Listeners
    projectTriggers.forEach((trigger, index) => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            openLightbox(index);
        });
    });

    btnNext.addEventListener('click', (e) => { e.stopPropagation(); nextImage(); });
    btnPrev.addEventListener('click', (e) => { e.stopPropagation(); prevImage(); });

    // Cerrar con data-close
    lightbox.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) {
            closeLightbox();
        }
    });

    // Teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Swipe táctil
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextImage() : prevImage();
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
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                entry.target.style.transitionDelay = `${index * 0.1}s`;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.classList.add('is-hidden');
        observer.observe(card);
    });
};

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    initLightbox();
    initProjectAnimations();
});