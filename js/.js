document.addEventListener('DOMContentLoaded', function() {
    const kosikButton = document.getElementById('kosik-button');
    const kosikCountSpan = document.getElementById('kosik-count');
    const itemsContainer = document.getElementById('products-container'); 

    function updateCartCount() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        const totalItems = cartItems.reduce((sum, item) => sum + (item.kusy || 0), 0);
        kosikCountSpan.textContent = totalItems;

        if (totalItems > 0) {
            kosikButton.classList.remove('disabled-link');
        } else {
            kosikButton.classList.add('disabled-link');
        }
    }

    // TATO FUNKCE VŠE ZOBRAZÍ
    function displayAllItems() {
        // Kód pro JEDNORÁZOVÉ vložení dat do localStorage, můžete ho pak smazat
        const productsInStorage = JSON.parse(localStorage.getItem('products'));
        if (!productsInStorage || productsInStorage.length === 0) { // Kontrola, zda localStorage neobsahuje data
            localStorage.setItem('products', JSON.stringify([
                {"name":"Pečené vepřové koleno","price":290,"img":"images/878-878.jpg","description":"S hořčicí, strouhaným křenem a chlebem. cca 900 g"},
                {"name":"Kuřecí křidélka","price":79,"img":"images/img-11.jpg","description":"Podávané s hořčicí a chlebem. 6 ks"},
                {"name":"Panini","price":95,"img":"images/337351.jpg","description":""}
            ]));
        }

        const products = JSON.parse(localStorage.getItem('products')) || [];
        itemsContainer.innerHTML = ''; 

        if (products.length === 0) {
            itemsContainer.innerHTML = '<p>Zatím zde nejsou žádné produkty.</p>';
            return;
        }

        products.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('col-lg-4', 'col-md-6', 'special-grid', 'drinks');

            itemDiv.innerHTML = `
                <div class="gallery-single">
                    <img src="${item.img}" class="img-fluid" alt="${item.name}"> 
                    
                        <h2>${item.name}</h2>
						
                        <h5>${item.description || ''}</h5> 
                        <h2>${item.price} kč</h2>
						
                       
						
                        <a href="edit.html?name=${encodeURIComponent(item.name)}">
                            <button class="back-button" ">Editovat</button>
							
							
                        </a>
                    
              
				
				
                 </div>
				
            `;
            itemsContainer.appendChild(itemDiv);
        });

        const addNewProductButton = document.createElement('div');
        addNewProductButton.classList.add('col-lg-4', 'col-md-6', 'special-grid', 'add-new');
        addNewProductButton.innerHTML = `
            <div class="gallery-single fix">
			
                <a href="edit.html" class="add-new-link">
                    <h3>Přidat nový produkt</h3>
                    <i class="fas fa-plus"></i>
					<Style= background-color: red;</Style>
                </a>
            </div>
        `;
        itemsContainer.appendChild(addNewProductButton);
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

    updateCartCount();
    displayAllItems();
    window.addEventListener('storage', function() {
        updateCartCount();
        displayAllItems();
    });
});