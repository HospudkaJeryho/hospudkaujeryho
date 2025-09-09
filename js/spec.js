document.addEventListener('DOMContentLoaded', function() {
    const itemsContainer = document.getElementById('products-container');

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
                        itemDiv.classList.add('col-lg-4', 'col-md-6', 'special-grid', 'drinks');
                        itemDiv.innerHTML = `
                            <div class="gallery-single fix">
                                <img src="${item.img}" class="img-fluid" alt="${item.name}">
                                <div class="why-text">
                                    <h4>${item.name}</h4>
                                    <h3>${item.description || ''}</h3> 
                                    <h2>${item.price} kč</h2>
                                    <a href="formular.html?img=${encodeURIComponent(item.img)}&name=${encodeURIComponent(item.name)}&price=${encodeURIComponent(item.price)}&description=${encodeURIComponent(item.description || '')}">
                                        <button class="order-button">Objednat</button>
                                    </a>
                                    <a href="edit.html?name=${encodeURIComponent(item.name)}">
                                        <button class="edit-button">Editovat</button>
                                    </a>
                                </div>
                            </div>
                        `;
                        itemsContainer.appendChild(itemDiv);
                    });
                }

                // Vložení tlačítka pro přidání nového produktu
                const addNewProductButton = document.createElement('div');
                addNewProductButton.classList.add('col-lg-4', 'col-md-6', 'special-grid', 'add-new');
                addNewProductButton.innerHTML = `
                    <div class="gallery-single fix">
                        <a href="edit.html" class="add-new-link">
                            <h3>Přidat nový produkt</h3>
                            <i class="fas fa-plus"></i>
                        </a>
                    </div>
                `;
                itemsContainer.appendChild(addNewProductButton);
            })
            .catch(error => {
                console.error('Došlo k chybě při načítání dat:', error);
                itemsContainer.innerHTML = '<p>Nepodařilo se načíst menu. Zkuste to prosím později.</p>';
            });
    }

    displayAllItems();
});