/* assets/js/main.js */

/* =========================================
    MENU SHOW Y HIDDEN
   ========================================= */

// ========================
// Seleccionamos los elementos del DOM (Document Object Model)
// ========================

// Usamos 'const' porque estas referencias no van a cambiar.
const navMenu = document.getElementById('nav-menu');      // El menú entero (<nav>)
const navToggle = document.querySelector('.header__toggle'); // El botón hamburguesa
const navClose = document.querySelector('.nav__close');      // La 'X' de cerrar

// ========================
// MOSTRAR MENÚ
// ========================

// Validamos si la constante 'navToggle' existe (para evitar errores)
if (navToggle) {
    navToggle.addEventListener('click', () => {
        // Al hacer clic, añadimos la clase 'show-menu' al nav
        // CSS se encarga de la animación (right: 0)
        navMenu.classList.add('show-menu');
    });
}

// ========================
// OCULTAR MENÚ
// ========================

// Validamos si la constante 'navClose' existe
if (navClose) {
    navClose.addEventListener('click', () => {
        // Al hacer clic, quitamos la clase 'show-menu'
        // El menú vuelve a esconderse (right: -100%)
        navMenu.classList.remove('show-menu');
    });
}

/* =========================================
    QUITAR MENÚ AL HACER CLICK EN UN LINK
    (UX: Experiencia de Usuario)
   ========================================= */
// Seleccionamos TODOS los links del menú
const navLink = document.querySelectorAll('.nav__link');

const linkAction = () => {
    // Cuando hagamos clic en cualquier link, quitamos la clase show-menu
    navMenu.classList.remove('show-menu');
}

// Por cada link, agregamos un "escuchador" de clic
navLink.forEach(n => n.addEventListener('click', linkAction));

/* =========================================
    EFECTO SCROLL EN HEADER
    (Añade sombra al hacer scroll)
   ========================================= */
const header = document.querySelector('.header');

const scrollHeader = () => {
    // Si el scroll es mayor a 50px, añadimos la clase 'scrolled'
    if (window.scrollY >= 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

// Escuchamos el evento scroll
window.addEventListener('scroll', scrollHeader);