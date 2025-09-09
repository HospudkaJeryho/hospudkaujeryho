document.addEventListener('DOMContentLoaded', () => {
    // Pro Popover
    const myPopoverBtn = document.getElementById('myPopoverBtn');
    const myPopover = document.getElementById('myPopover');
    const closePopoverBtn = myPopover.querySelector('.close-popover-btn');

    // Funkce pro zobrazení popoveru
    function showPopover() {
        myPopover.style.display = 'block';
        // Volitelně: Pozicování popoveru relativně k tlačítku
        // const btnRect = myPopoverBtn.getBoundingClientRect();
        // myPopover.style.top = `${btnRect.bottom + 10}px`; // 10px pod tlačítkem
        // myPopover.style.left = `${btnRect.left}px`;
    }

    // Funkce pro skrytí popoveru
    function hidePopover() {
        myPopover.style.display = 'none';
    }

    // Otevřít popover na kliknutí
    myPopoverBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Zabrání okamžitému zavření, pokud by bublalo na document
        if (myPopover.style.display === 'block') {
            hidePopover();
        } else {
            showPopover();
        }
    });

    // Zavřít popover na kliknutí na křížek
    closePopoverBtn.addEventListener('click', hidePopover);

    // Zavřít popover na kliknutí mimo popover nebo tlačítko
    document.addEventListener('click', (event) => {
        if (myPopover.style.display === 'block' && !myPopover.contains(event.target) && event.target !== myPopoverBtn) {
            hidePopover();
        }
    });
});