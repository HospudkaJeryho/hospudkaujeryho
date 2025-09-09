document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('product-form');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productImageInput = document.getElementById('product-image');
    const productDescriptionInput = document.getElementById('product-description');
    const imagePreview = document.getElementById('image-preview');
    const deleteButton = document.getElementById('delete-button');

    let products = JSON.parse(localStorage.getItem('products')) || [];
    const urlParams = new URLSearchParams(window.location.search);
    const productNameToEdit = urlParams.get('name');

    // Kontrola, jestli jsme v režimu editace
    if (productNameToEdit) {
        const productToEdit = products.find(p => p.name === productNameToEdit);
        if (productToEdit) {
            productNameInput.value = productToEdit.name;
            productPriceInput.value = productToEdit.price;
            productImageInput.value = productToEdit.img;
            productDescriptionInput.value = productToEdit.description;

            if (productToEdit.img) {
                imagePreview.src = productToEdit.img;
                imagePreview.style.display = 'block';
            }
            
            productNameInput.disabled = true;

            // Zobrazí tlačítko "Odebrat položku" pouze při editaci
            deleteButton.style.display = 'inline-block';

        } else {
            console.error('Produkt k editaci nebyl nalezen.');
        }
    }
	
	


    // Logika pro tlačítko "Uložit produkt"
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const newProduct = {
            name: productNameInput.value,
            price: parseFloat(productPriceInput.value),
            img: productImageInput.value,
            description: productDescriptionInput.value
        };

        if (productNameToEdit) {
            const index = products.findIndex(p => p.name === productNameToEdit);
            if (index !== -1) {
                products[index] = newProduct;
                alert('Produkt byl úspěšně aktualizován!');
            }
        } else {
            const isDuplicate = products.some(p => p.name === newProduct.name);
            if (isDuplicate) {
                alert('Produkt s tímto názvem již existuje!');
                return;
            }
            products.push(newProduct);
            alert('Nový produkt byl úspěšně přidán!');
        }

        localStorage.setItem('products', JSON.stringify(products));
        window.location.href = 'special.html';
    });
    
    // Logika pro tlačítko "Odebrat položku"
    deleteButton.addEventListener('click', function(event) {
        event.preventDefault();

        if (confirm('Opravdu chcete tuto položku odebrat?')) {
            // Najde a odstraní položku z pole
            products = products.filter(p => p.name !== productNameToEdit);
            localStorage.setItem('products', JSON.stringify(products));
            alert('Položka byla úspěšně odebrána!');
            window.location.href = 'special.html'; // Přejde zpět na hlavní stránku
        }
    });
});