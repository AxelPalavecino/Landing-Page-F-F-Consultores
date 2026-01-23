// filepath: /Users/palavecinoaxeldavid/Desktop/Webs/Proyectos/F&F_Consultores/Landing-Page-F-F-Consultores/assets/js/contact-effects.js
// ========================================
// EFECTOS VISUALES - FORMULARIO DE CONTACTO
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;
    
    const inputs = form.querySelectorAll('.contact__input');
    
    inputs.forEach(function(input) {
        const group = input.closest('.contact__group');
        let typingTimeout;

        // Detectar cuando el usuario escribe
        input.addEventListener('input', function() {
            // Remover estado válido mientras escribe
            group.classList.remove('is-valid');
            
            // Añadir estado de typing
            group.classList.add('is-typing');
            
            // Remover typing después de dejar de escribir
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(function() {
                group.classList.remove('is-typing');
                
                // Verificar si el campo es válido
                if (input.value.trim().length > 0) {
                    // Validación especial para email
                    if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (emailRegex.test(input.value)) {
                            group.classList.add('is-valid');
                        }
                    } else {
                        group.classList.add('is-valid');
                    }
                }
            }, 500);
        });

        // Limpiar estados al perder foco
        input.addEventListener('blur', function() {
            group.classList.remove('is-typing');
            
            // Validar al salir del campo
            if (input.value.trim().length > 0) {
                if (input.type === 'email') {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (emailRegex.test(input.value)) {
                        group.classList.add('is-valid');
                    } else {
                        group.classList.remove('is-valid');
                    }
                } else {
                    group.classList.add('is-valid');
                }
            } else {
                group.classList.remove('is-valid');
            }
        });
    });
});