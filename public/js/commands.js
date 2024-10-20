document.addEventListener('DOMContentLoaded', () => {
    const commandsList = document.getElementById('commands-list');
    const toggleBtn = document.getElementById('toggle-btn');
    
    const items = commandsList.querySelectorAll('.command-item');
    const itemsToShow = 5; // Número de comandos a mostrar inicialmente

    // Mostrar solo los primeros `itemsToShow` comandos
    for (let i = itemsToShow; i < items.length; i++) {
        items[i].style.display = 'none';
    }

    // Manejar clic en el botón
    toggleBtn.addEventListener('click', () => {
        const isShowingMore = toggleBtn.textContent === 'Mostrar más';

        // Mostrar u ocultar los comandos según el estado del botón
        items.forEach((item, index) => {
            if (isShowingMore) {
                if (index >= itemsToShow) {
                    item.style.display = 'list-item';
                    setTimeout(() => {
                        item.style.opacity = '1'; // Mostrar suavemente
                    }, 10); // Retraso para permitir el cambio de display
                }
            } else {
                if (index >= itemsToShow) {
                    item.style.opacity = '0'; // Ocultar suavemente
                    setTimeout(() => {
                        item.style.display = 'none'; // Cambiar display después de la transición
                    }, 500); // Duración de la transición
                }
            }
        });

        // Cambiar el texto del botón
        toggleBtn.textContent = isShowingMore ? 'Mostrar menos' : 'Mostrar más';
    });
});
