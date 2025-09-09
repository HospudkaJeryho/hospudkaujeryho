document.addEventListener('DOMContentLoaded', () => {
    const showSuccessToastBtn = document.getElementById('showSuccessToastBtn');
    const showErrorToastBtn = document.getElementById('showErrorToastBtn');
    const showInfoToastBtn = document.getElementById('showInfoToastBtn');
    const toastContainer = document.getElementById('toastContainer');

    /**
     * Mapování typů zpráv na ikony Font Awesome.
     */
    const iconMap = {
        success: 'fas fa-check-circle', // Ikona pro úspěch (fajfka v kruhu)
        error: 'fas fa-times-circle',   // Ikona pro chybu (křížek v kruhu)
        info: 'fas fa-info-circle'      // Ikona pro informaci (i v kruhu)
    };

    /**
     * Zobrazí toast notifikaci.
     * @param {string} message - Text zprávy.
     * @param {string} type - Typ zprávy ('success', 'error', 'info').
     * @param {number} duration - Doba zobrazení v milisekundách (výchozí 3000ms).
     */
	 
	 
	 
    function showToast(message, type = 'success', duration = 10000) {
        // Vytvoříme nový div pro toast
        const toastDiv = document.createElement('div');
        toastDiv.classList.add('toast', type); // Přidáme třídu 'toast' a typ (např. 'success')

        // Obsah toastu
        toastDiv.innerHTML = `
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        `;
    
        // Přidáme toast do kontejneru
        toastContainer.appendChild(toastDiv);

        // Nastavíme časovač pro automatické zmizení
        let timeoutId = setTimeout(() => {
            hideToast(toastDiv);
        }, duration);

        // Přidáme posluchač události pro tlačítko zavření
        const closeBtn = toastDiv.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            clearTimeout(timeoutId); // Zrušíme automatické zmizení, pokud uživatel zavře ručně
            hideToast(toastDiv);
        });

        // Po dokončení animace fadeIn nastavíme opacity na 1, aby se animace fadeOut mohla spustit
        toastDiv.addEventListener('animationend', (event) => {
            if (event.animationName === 'fadeIn') {
                toastDiv.style.opacity = '1';
            }
        });
    }

    /**
     * Skryje a odstraní toast notifikaci.
     * @param {HTMLElement} toastElement - Element toastu, který má být skryt.
     */
    function hideToast(toastElement) {
        toastElement.classList.add('hide'); // Přidáme třídu pro spuštění animace fadeOut

        // Po dokončení animace odebereme element z DOMu
        toastElement.addEventListener('animationend', (event) => {
            if (event.animationName === 'fadeOut' && toastElement.parentNode) {
                toastElement.parentNode.removeChild(toastElement);
            }
        });
    }

    // Posluchač události pro tlačítko "Zobrazit zprávu"
    showToastBtn.addEventListener('click', () => {
        showToast('Vaše rezervace byla úspěšně uložena!', 'success');
        // Můžete vyzkoušet i jiné typy:
        // showToast('Při ukládání došlo k chybě.', 'error');
        // showToast('Informace: Zkontrolujte prosím svůj e-mail.', 'info');
    });
});