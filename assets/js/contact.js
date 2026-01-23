// ========================================
// EMAILJS - ENVÍO DE FORMULARIO
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('submitButton');
    const btnText = document.getElementById('buttonText');
    const form = document.getElementById('contactForm');
    const statusDiv = document.getElementById('formMessage');

    // Verificar que los elementos existen
    if (!form || !btn || !btnText || !statusDiv) {
        console.warn('Formulario de contacto: elementos no encontrados');
        return;
    }

    const originalBtnText = btnText.textContent;

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // Limpiar mensajes previos
        statusDiv.style.display = 'none';
        statusDiv.textContent = '';

        // Validación básica
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const asunto = document.getElementById('asunto').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        if (!nombre || !email || !asunto || !mensaje) {
            mostrarMensaje('Por favor, completa todos los campos obligatorios.', 'error');
            return;
        }

        // Cambiar texto del botón
        btnText.textContent = 'Enviando...';
        btn.disabled = true;

        // Configuración de EmailJS
        const serviceID = 'service_402520j';
        const templateID = 'template_060wr76';

        // Enviar formulario usando sendForm (como indica la documentación)
        emailjs.sendForm(serviceID, templateID, this)
            .then(function() {
                btnText.textContent = originalBtnText;
                btn.disabled = false;
                mostrarMensaje('¡Mensaje enviado con éxito! Nos contactaremos pronto.', 'success');
                form.reset();
                
                // Limpiar estados visuales de validación
                const inputs = form.querySelectorAll('.contact__input');
                inputs.forEach(function(input) {
                    input.closest('.contact__group').classList.remove('is-valid', 'is-typing');
                });
            }, function(err) {
                btnText.textContent = originalBtnText;
                btn.disabled = false;
                console.error('Error EmailJS:', JSON.stringify(err));
                mostrarMensaje('Hubo un error al enviar el mensaje. Por favor, contáctanos por WhatsApp.', 'error');
            });
    });

    // Función para mostrar mensajes
    function mostrarMensaje(texto, tipo) {
        statusDiv.style.display = 'block';
        statusDiv.textContent = texto;
        statusDiv.style.padding = '1rem';
        statusDiv.style.borderRadius = '0.5rem';
        statusDiv.style.marginBottom = '1rem';
        statusDiv.style.fontWeight = '500';
        
        if (tipo === 'success') {
            statusDiv.style.color = '#155724';
            statusDiv.style.backgroundColor = '#d4edda';
            statusDiv.style.border = '1px solid #c3e6cb';
        } else {
            statusDiv.style.color = '#721c24';
            statusDiv.style.backgroundColor = '#f8d7da';
            statusDiv.style.border = '1px solid #f5c6cb';
        }

        statusDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        if (tipo === 'success') {
            setTimeout(function() {
                statusDiv.style.display = 'none';
            }, 7000);
        }
    }
});