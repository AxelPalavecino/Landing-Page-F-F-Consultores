document.addEventListener('DOMContentLoaded', function() {
    // Inicializamos las variables del formulario
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitButton');
    const btnText = document.getElementById('buttonText');
    
    // Verificar que los elementos existen
    if (!form || !statusDiv || !submitBtn || !btnText) {
        console.warn('Formulario de contacto: elementos no encontrados');
        return;
    }
    
    const originalBtnText = btnText.innerText;

    // --- CONFIGURACIÓN DE EMAILJS ---
    // IMPORTANTE: Reemplaza estos valores con los de tu cuenta EmailJS
    const serviceID = 'service_402520j';
    const templateID = 'template_060wr76';

    // Expresión regular para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Evita que la página se recargue

        // 1. Limpiar mensajes previos
        statusDiv.style.display = 'none';
        statusDiv.innerHTML = '';
        statusDiv.className = 'contact__message';

        // 2. Obtener y sanitizar valores
        const nombre = sanitizeInput(document.getElementById('nombre').value);
        const email = document.getElementById('email').value.trim().toLowerCase();
        const asunto = sanitizeInput(document.getElementById('asunto').value);
        const mensaje = sanitizeInput(document.getElementById('mensaje').value);

        // 3. Validaciones
        if (!nombre || !email || !asunto || !mensaje) {
            mostrarMensaje('Por favor, completa todos los campos obligatorios.', 'error');
            return;
        }

        if (nombre.length < 2 || nombre.length > 100) {
            mostrarMensaje('El nombre debe tener entre 2 y 100 caracteres.', 'error');
            return;
        }

        if (!emailRegex.test(email)) {
            mostrarMensaje('Por favor, ingresa un correo electrónico válido.', 'error');
            return;
        }

        if (asunto.length < 3 || asunto.length > 150) {
            mostrarMensaje('El asunto debe tener entre 3 y 150 caracteres.', 'error');
            return;
        }

        if (mensaje.length < 10 || mensaje.length > 2000) {
            mostrarMensaje('El mensaje debe tener entre 10 y 2000 caracteres.', 'error');
            return;
        }

        // 4. UI: Botón en estado "Cargando"
        submitBtn.disabled = true;
        btnText.innerText = "Enviando...";

        // 5. Enviar con EmailJS
        emailjs.sendForm(serviceID, templateID, this)
            .then(() => {
                // ÉXITO
                mostrarMensaje('¡Mensaje enviado con éxito! Nos contactaremos pronto.', 'success');
                form.reset();
            })
            .catch((err) => {
                // ERROR
                console.error('Error de EmailJS:', err);
                mostrarMensaje('Hubo un error al enviar el mensaje. Por favor, intenta nuevamente o contáctanos directamente.', 'error');
            })
            .finally(() => {
                // 6. Restaurar botón
                submitBtn.disabled = false;
                btnText.innerText = originalBtnText;
            });
    });

    // Función para sanitizar inputs (previene XSS básico)
    function sanitizeInput(str) {
        if (!str) return '';
        return str
            .trim()
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }

    // Función para mostrar mensajes de éxito/error
    function mostrarMensaje(texto, tipo) {
        statusDiv.style.display = 'block';
        statusDiv.innerText = texto;
        statusDiv.style.padding = '1rem';
        statusDiv.style.borderRadius = '0.5rem';
        statusDiv.style.marginBottom = '1rem';
        
        if (tipo === 'success') {
            statusDiv.style.color = '#155724';
            statusDiv.style.backgroundColor = '#d4edda';
            statusDiv.style.border = '1px solid #c3e6cb';
        } else {
            statusDiv.style.color = '#721c24';
            statusDiv.style.backgroundColor = '#f8d7da';
            statusDiv.style.border = '1px solid #f5c6cb';
        }

        // Auto-ocultar mensaje de éxito después de 5 segundos
        if (tipo === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }
});