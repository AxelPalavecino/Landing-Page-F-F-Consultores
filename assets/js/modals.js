/* assets/js/modals.js */

/* =========================================
   SISTEMA DE MODALES (Template Pattern)
   ========================================= */

const initModals = () => {
    // Elementos del DOM
    const modal = document.getElementById('global-modal');
    if (!modal) return;

    const modalBody = document.getElementById('modal-body-content');
    const modalTitle = modal.querySelector('.modal__title');
    const modalIconContainer = modal.querySelector('.modal__icon-wrapper');
    const gridContainer = document.querySelector('.services__grid');

    // =========================================
    // LÓGICA DE APERTURA
    // =========================================
    const openModal = (triggerButton) => {
        const id = triggerButton.getAttribute('data-id');
        const template = document.getElementById(`template-${id}`);

        if (!template) {
            console.error(`Error: No se encontró el template id="template-${id}"`);
            return;
        }

        // Extraer datos de la tarjeta clickeada
        const card = triggerButton.closest('.services__card');
        const cardTitle = card.querySelector('.services__card-title').textContent;
        const cardIcon = card.querySelector('.services__icon').cloneNode(true);

        // Inyectar datos en el Header
        modalTitle.textContent = cardTitle;
        modalIconContainer.innerHTML = '';
        modalIconContainer.appendChild(cardIcon);

        // Inyectar contenido del Template
        const content = document.importNode(template.content, true);
        modalBody.innerHTML = '';
        modalBody.appendChild(content);
        
        // Animar items del contenido con stagger
        const items = modalBody.querySelectorAll('.modal__item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            item.style.transition = `opacity 0.4s ease ${index * 0.1 + 0.2}s, transform 0.4s ease ${index * 0.1 + 0.2}s`;
            
            // Trigger animation
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
            });
        });

        // Resetear scroll
        modalBody.scrollTop = 0;

        // Mostrar Modal
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        
        // Focus trap - enfocar el modal para accesibilidad
        modal.querySelector('.modal__close').focus();
    };

    // =========================================
    // LÓGICA DE CIERRE
    // =========================================
    const closeModal = () => {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Limpiar contenido después de la transición
        setTimeout(() => {
            modalBody.innerHTML = '';
        }, 400);
    };

    // =========================================
    // EVENT LISTENERS
    // =========================================

    // Abrir con delegación de eventos
    if (gridContainer) {
        gridContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.services__button');
            if (button) {
                openModal(button);
            }
        });
    }

    // Cerrar con data-close
    modal.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) {
            if (e.target.closest('.modal__cta')) {
                closeModal();
            } else {
                e.preventDefault();
                closeModal();
            }
        }
    });

    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
};

// =========================================
// LÓGICA MODAL ALL C:ODING STUDIO
// =========================================
const initCodingModal = () => {
    const btnOpenCoding = document.getElementById('btn-open-coding');
    const codingModal = document.getElementById('coding-modal');
    
    if (!btnOpenCoding || !codingModal) return;

    // Abrir Modal
    btnOpenCoding.addEventListener('click', (e) => {
        e.preventDefault();
        codingModal.setAttribute('aria-hidden', 'false');
        codingModal.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        
        // Animar items con stagger
        const items = codingModal.querySelectorAll('.coding-modal__item');
        items.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(15px)';
            item.style.transition = `opacity 0.4s ease ${index * 0.08 + 0.15}s, transform 0.4s ease ${index * 0.08 + 0.15}s`;
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
            });
        });
        
        // Animar tech stack tags
        const tags = codingModal.querySelectorAll('.coding-modal__stack-tag');
        tags.forEach((tag, index) => {
            tag.style.opacity = '0';
            tag.style.transform = 'scale(0.8)';
            tag.style.transition = `opacity 0.3s ease ${index * 0.04 + 0.4}s, transform 0.3s ease ${index * 0.04 + 0.4}s`;
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    tag.style.opacity = '1';
                    tag.style.transform = 'scale(1)';
                });
            });
        });
    });

    // Cerrar Modal
    const closeCodingModal = () => {
        codingModal.classList.remove('is-open');
        codingModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    codingModal.addEventListener('click', (e) => {
        if (e.target.closest('[data-close-coding]')) {
            closeCodingModal();
        }
    });
    
    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && codingModal.classList.contains('is-open')) {
            closeCodingModal();
        }
    });
};

// Modificamos el listener final para que inicie ambos sistemas
document.addEventListener('DOMContentLoaded', () => {
    initModals();       // El original de F&F
    initCodingModal();  // El nuevo de Coding Studio
});