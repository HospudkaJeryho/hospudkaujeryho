document.addEventListener('DOMContentLoaded', function() {
    const kosikButton = document.getElementById('kosik-button');
    const kosikCountSpan = document.getElementById('kosik-count');
    const itemsContainer = document.getElementById('products-container');

    function updateCartCount() {
        // Tento kód se stále spoléhá na localStorage pro košík
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const totalItems = cartItems.reduce((sum, item) => sum + (item.kusy || 0), 0);
        kosikCountSpan.textContent = totalItems;

        if (totalItems > 0) {
            kosikButton.classList.remove('disabled-link');
        } else {
            kosikButton.classList.add('disabled-link');
        }
    }

    // Funkce pro načtení produktů z databáze přes API
    function displayAllItems() {
        fetch('http://localhost:3000/products')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Nepodařilo se načíst produkty.');
                }
                return response.json();
            })
            .then(products => {
                itemsContainer.innerHTML = '';

                if (products.length === 0) {
                    itemsContainer.innerHTML = '<p>Zatím zde nejsou žádné produkty.</p>';
                } else {
                    products.forEach(item => {
                        const itemDiv = document.createElement('div');
                        
						itemDiv.classList.add('col-lg-4', 'col-md-6');

                        itemDiv.innerHTML = `
                            <div class="gallery-single">
                                <img src="${item.img}" class="img-fluid" alt="${item.name}">
                                <h2>${item.name}</h2>
                                <h5>${item.description || ''}</h5>
                                <h2>${item.price} kč</h2>
                                <a href="formular.html?img=${encodeURIComponent(item.img)}&name=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.price)}&description=${encodeURIComponent(item.description || '')}">
                                    <button class="back-button">Objednat</button>
                                </a>
                            </div>
                        `;
                        itemsContainer.appendChild(itemDiv);
                    });
                }
            })
            .catch(error => {
                console.error('Došlo k chybě při načítání dat:', error);
                itemsContainer.innerHTML = '<p>Nepodařilo se načíst menu. Zkuste to prosím později.</p>';
            });
    }

    if (kosikButton) {
        kosikButton.addEventListener('click', function(event) {
            const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
            if (cartItems.length > 0) {
                window.location.href = 'formular.html?showCart=true';
            } else {
                alert('Váš košík je prázdný.');
                event.preventDefault();
            }
        });
    }

    // Spouštíme funkce
    updateCartCount();
    displayAllItems();
    window.addEventListener('storage', updateCartCount);
});