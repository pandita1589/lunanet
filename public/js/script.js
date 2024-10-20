// script.js

const starsContainer = document.querySelector('.stars');

// Función para crear una estrella
function createStar() {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1; // Tamaño aleatorio de 1 a 3 px
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.opacity = Math.random(); // Opacidad aleatoria
    star.style.animationDuration = `${Math.random() * 2 + 1}s`; // Duración aleatoria de la animación
    starsContainer.appendChild(star);
}

// Crear varias estrellas
for (let i = 0; i < 100; i++) {
    createStar();
}
