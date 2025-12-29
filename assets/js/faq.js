/* assets/js/faq.js */

/* =========================================
   SISTEMA DE ACORDEÓN (FAQ)
   ========================================= */

const initFAQ = () => {
    // 1. Selector del contenedor principal
    const faqList = document.querySelector('.faq__list');
    
    // Seguridad: Si no existe la lista, no ejecutamos nada
    if (!faqList) return;

    // 2. Event Listener (Delegación de Eventos)
    // Escuchamos clicks en la lista entera, no botón por botón
    faqList.addEventListener('click', (e) => {
        
        // Buscamos si el click fue dentro de un botón disparador (.faq__trigger)
        const trigger = e.target.closest('.faq__trigger');
        
        // Si no fue en un botón, ignoramos
        if (!trigger) return;

        // 3. Identificamos el estado actual y el padre
        const item = trigger.parentElement; // .faq__item
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';

        // 4. Lógica de "Acordeón Exclusivo" (Cerrar los otros)
        // Seleccionamos todos los botones y todos los items activos
        const allTriggers = faqList.querySelectorAll('.faq__trigger');
        const allItems = faqList.querySelectorAll('.faq__item');

        // Reseteamos todos a cerrado
        allTriggers.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
        allItems.forEach(card => card.classList.remove('is-active'));

        // 5. Toggle del seleccionado
        // Si estaba cerrado, lo abrimos. Si estaba abierto, ya se cerró en el paso 4.
        if (!isOpen) {
            trigger.setAttribute('aria-expanded', 'true');
            item.classList.add('is-active'); // Para efectos de borde/sombra CSS
        }
    });
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initFAQ);