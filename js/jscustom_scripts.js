document.addEventListener('DOMContentLoaded', () => {
    // --- DROPDOWN MENU NA HOVER (DESKTOP) A AUTOMATICKÉ ROZBALENÍ (MOBIL) ---

    // Vyber všechny dropdown položky (např. 'Menu')
    const navDropdowns = document.querySelectorAll('.navbar-nav .nav-item.dropdown');
    // Bootstrap breakpoint pro "mobilní" zobrazení (obvykle 991.98px)
    const mobileBreakpoint = 991.98;

    navDropdowns.forEach(dropdownItem => {
        const dropdownToggle = dropdownItem.querySelector('.dropdown-toggle');
        const dropdownMenu = dropdownItem.querySelector('.dropdown-menu');

        if (!dropdownToggle || !dropdownMenu) {
            return; // Přeskočit, pokud chybí části dropdownu
        }

        // Funkce pro otevření dropdownu
        const openDropdown = () => {
            dropdownItem.classList.add('show'); // Bootstrap třída pro "otevřeno"
            dropdownToggle.classList.add('show'); // Bootstrap třída pro "otevřeno"
            // Náš vlastní CSS hack pro zobrazení dropdownu
            dropdownMenu.style.display = 'block';
            dropdownMenu.style.opacity = '1';
            dropdownMenu.style.visibility = 'visible';
            dropdownMenu.style.transform = 'translateY(0)';
        };

        // Funkce pro zavření dropdownu
        const closeDropdown = () => {
            dropdownItem.classList.remove('show');
            dropdownToggle.classList.remove('show');
            // Náš vlastní CSS hack pro skrytí dropdownu
            dropdownMenu.style.opacity = '0';
            dropdownMenu.style.visibility = 'hidden';
            dropdownMenu.style.transform = 'translateY(10px)';
            // Po animaci skryjeme, aby se nepletl
            setTimeout(() => {
                dropdownMenu.style.display = 'none';
            }, 300); // Doba by měla odpovídat CSS transition
        };

        // Posluchače pro desktop (hover)
        dropdownItem.addEventListener('mouseenter', () => {
            if (window.innerWidth > mobileBreakpoint) {
                openDropdown();
            }
        });

        dropdownItem.addEventListener('mouseleave', () => {
            if (window.innerWidth > mobileBreakpoint) {
                closeDropdown();
            }
        });

        // Posluchač pro mobil (kliknutí na toggle, ale nechte Bootstrap, ať si to spravuje)
        // Důležité: Na mobilu chceme, aby Bootstrap spravoval kliknutí na hamburger i na dropdown toggle
        // Není potřeba zde nic složitého, Bootstrap by si to měl vyřešit sám, pokud se načte JS.
        // Náš CSS pro mobil (`display: block !important; position: static !important;`) by měl automaticky rozbalit menu
        // když je navbar rozbalený přes Bootstrap JS.
    });


    // --- CENTROVANÝ POP-UP MODAL (myPopover) ---
    const myPopover = document.getElementById('myPopover');
    const closePopoverBtn = myPopover ? myPopover.querySelector('.close-popover-btn') : null;
    const actionPopoverBtn = myPopover ? myPopover.querySelector('.popover-action-btn') : null;

    // Funkce pro zobrazení popoveru
    function showPopover() {
        if (myPopover) {
            myPopover.classList.add('active'); // Přidá třídu pro zobrazení (aktivuje CSS animace)
            document.body.style.overflow = 'hidden'; // Zabrání skrolování pozadí
        }
    }

    // Funkce pro skrytí popoveru
    function hidePopover() {
        if (myPopover) {
            myPopover.classList.remove('active'); // Odebere třídu pro skrytí
            document.body.style.overflow = ''; // Povolí skrolování pozadí
        }
    }

    // Automatické zobrazení popoveru po načtení stránky (s prodlevou)
    if (myPopover) {
        setTimeout(() => {
            showPopover();
        }, 1500); // Zobrazí popover po 1.5 sekundě (můžete upravit)
    }

    // Zavírání popoveru
    if (closePopoverBtn) {
        closePopoverBtn.addEventListener('click', hidePopover);
    }
    if (actionPopoverBtn) {
        actionPopoverBtn.addEventListener('click', hidePopover);
    }

    // Zavření po kliknutí na tmavé pozadí (mimo obsah popoveru)
    if (myPopover) {
        myPopover.addEventListener('click', (event) => {
            if (event.target === myPopover) { // Kontroluje, zda bylo kliknuto přímo na overlay
                hidePopover();
            }
        });
    }

    // Zavření po stisku klávesy Esc
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && myPopover && myPopover.classList.contains('active')) {
            hidePopover();
        }
    });

    // --- FOTKY (GALERIE) - Rychlá optimalizace zobrazení ---
    // Toto je velmi základní optimalizace. Ideální je použít lightbox s lazy loadingem.
    const galleryImages = document.querySelectorAll('.gallery-box img'); // Cílí na obrázky v galerii

    galleryImages.forEach(img => {
        // Kontrola, zda je obrázek příliš velký (např. přes 1000px na šířku)
        // Tuto logiku je lepší dělat na straně serveru nebo při uploadu!
        // Toto je jen pro ukázku, jak to ovlivňuje zobrazení.
        // Není to náhrada skutečné optimalizace.
        if (img.naturalWidth > 1200) { // Pokud je obrázek širší než 1200px
            img.style.maxWidth = '100%';
            img.style.height = 'auto';
        }
    });
});