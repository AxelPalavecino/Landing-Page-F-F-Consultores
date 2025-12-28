/* assets/js/modals.js */

/* =========================================
   SISTEMA DE MODALES (Template Pattern)
   ========================================= */

const initModals = () => {
    // 1. Elementos del DOM (Referencia al Cascarón Único)
    const modal = document.getElementById('global-modal');
    if (!modal) return; // Si no hay modal, no hacemos nada (seguridad)

    const modalBody = document.getElementById('modal-body-content');
    const modalTitle = modal.querySelector('.modal__title');
    const modalIconContainer = modal.querySelector('.modal__icon-wrapper');
    const gridContainer = document.querySelector('.services__grid'); // Para Event Delegation

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

        // A. Extraer datos visuales de la tarjeta clickeada (Título e Icono)
        // Esto evita tener que repetir el título y el SVG dentro del template oculto.
        const card = triggerButton.closest('.services__card');
        const cardTitle = card.querySelector('.services__card-title').textContent;
        const cardIcon = card.querySelector('.services__icon').cloneNode(true); // Clonamos el SVG

        // B. Inyectar datos en el Header del Modal
        modalTitle.textContent = cardTitle;
        modalIconContainer.innerHTML = ''; // Limpiar icono anterior
        modalIconContainer.appendChild(cardIcon);

        // C. Inyectar contenido del Template en el Body del Modal
        // Usamos importNode o cloneNode para crear una copia limpia del contenido
        const content = document.importNode(template.content, true);
        modalBody.innerHTML = ''; // Limpiar contenido anterior
        modalBody.appendChild(content);
        
        // D. Resetear el scroll del modal (por si se quedó scrolleado abajo)
        modal.querySelector('.modal__body').scrollTop = 0;

        // E. Mostrar Modal y Bloquear Scroll del Body
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('is-open');
        document.body.style.overflow = 'hidden'; // Vital para móviles
    };

    // =========================================
    // LÓGICA DE CIERRE
    // =========================================
    const closeModal = () => {
        // A. Ocultar visualmente
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');

        // B. Restaurar Scroll del Body
        document.body.style.overflow = '';

        // C. Limpiar contenido (Opcional, por seguridad de memoria)
        // Esperamos a que termine la transición CSS (0.3s)
        setTimeout(() => {
            modalBody.innerHTML = '';
        }, 300);
    };

    // =========================================
    // EVENT LISTENERS (Escuchadores)
    // =========================================

    // 1. Abrir: Usamos "Delegación de Eventos" en la grilla
    // Detectamos si el click fue en un botón con clase .services__button
    if (gridContainer) {
        gridContainer.addEventListener('click', (e) => {
            const button = e.target.closest('.services__button');
            if (button) {
                openModal(button);
            }
        });
    }

    // 2. Cerrar: Detectar clicks en elementos con data-close (Overlay, Botón X, Botón CTA)
    modal.addEventListener('click', (e) => {
        // Si el elemento clickeado (o uno de sus padres) tiene el atributo data-close...
        if (e.target.closest('[data-close]')) {
            // Si es el botón CTA, permitimos la navegación al ancla (#contacto) antes de cerrar
            if (e.target.closest('.modal__cta')) {
                closeModal(); // Cierra y deja que el href funcione
            } else {
                e.preventDefault(); // Evita saltos raros en botones normales
                closeModal();
            }
        }
    });

    // 3. Cerrar con Tecla ESC (Accesibilidad)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            closeModal();
        }
    });
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initModals);