/* assets/js/hero.js */

// Array de imágenes (Asegúrate de tener estos archivos o cambia los nombres)
const heroImages = [
    './assets/img/content/hero/hero1.webp',
    './assets/img/content/hero/hero2.webp',
    './assets/img/content/hero/hero3.webp',
    './assets/img/content/hero/hero4.webp',
    './assets/img/content/hero/hero5.webp',
    './assets/img/content/hero/hero6.webp',
    './assets/img/content/hero/hero7.webp',
    
];

const sliderContainer = document.getElementById('hero-slider');
let currentIndex = 0;

// Función para cambiar el fondo
function changeBackground() {
    if (!sliderContainer) return;

    // Calculamos el siguiente índice
    currentIndex = (currentIndex + 1) % heroImages.length;
    const nextImage = heroImages[currentIndex];

    // Creamos un nuevo div para la siguiente imagen
    const slideDiv = document.createElement('div');
    slideDiv.style.backgroundImage = `url('${nextImage}')`;
    
    // Estilos base para la animación
    slideDiv.style.position = 'absolute';
    slideDiv.style.top = '0';
    slideDiv.style.left = '0';
    slideDiv.style.width = '100%';
    slideDiv.style.height = '100%';
    slideDiv.style.backgroundSize = 'cover';
    slideDiv.style.backgroundPosition = 'center';
    slideDiv.style.zIndex = '0'; // Detrás del overlay
    slideDiv.style.opacity = '0'; // Empieza invisible
    slideDiv.style.transition = 'opacity 1s ease-in-out';

    // Insertamos ANTES del overlay para no taparlo
    const overlay = sliderContainer.querySelector('.hero__overlay');
    sliderContainer.insertBefore(slideDiv, overlay);

    // Forzamos el reflow (para que el navegador detecte el cambio de opacity)
    setTimeout(() => {
        slideDiv.style.opacity = '1';
    }, 50);

    // Limpieza: Eliminamos la imagen vieja después de la transición
    setTimeout(() => {
        const oldSlides = sliderContainer.querySelectorAll('div:not(.hero__overlay)');
        if (oldSlides.length > 1) {
            sliderContainer.removeChild(oldSlides[0]);
        }
    }, 1100); // Esperamos 1.1s (un poco más que la transición)
}

// Iniciamos el slider solo si existe el contenedor
if (sliderContainer && heroImages.length > 1) {
    // Cambiar imagen cada 5 segundos
    setInterval(changeBackground, 5000);
}