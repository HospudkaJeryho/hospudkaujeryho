   <script>
        document.addEventListener('DOMContentLoaded', function() {
    // Funkce pro inicializaci zbytku logiky formuláře
    function initializeFormLogic() {
        // Získání elementů z DOM pro formulář
        const jmenoInput = document.getElementById('jmeno');
        const jmenoInputGroup = document.querySelector('.jmeno-input-group');
        const popisObjednavkyInput = document.getElementById('popis-objednavky');
        const polozkaPoznamkaInput = document.getElementById('polozka-poznamka');
        const nazevZbozi = document.getElementById('nazev-zbozi');
        const pevnaCena1 = document.getElementById('pevna-cena-1');
        const kusy = document.getElementById('kusy');
        const tlacitkoSpocitatTotal = document.getElementById('spocitat-total');
        const tlacitkoZobrazitPopover = document.getElementById('zobrazit-popover');

        // Získání elementů pro zobrazení vybrané položky
        const selectedItemDisplay = document.getElementById('selected-item-display');
        const selectedItemImage = document.getElementById('selected-item-image');
        const selectedItemName = document.getElementById('selected-item-name');
        const selectedItemDescription = document.getElementById('selected-item-description'); 
        const selectedItemPrice = document.getElementById('selected-item-price');

        // Získání elementů z DOM pro popover
        const popover = document.getElementById('myPopover');
        const popoverCisloObjednavky = document.getElementById('popover-cislo-objednavky');
        const popoverJmenoZakaznika = document.getElementById('popover-jmeno-zakaznika');
        const popoverSeznamPolozek = document.getElementById('popover-seznam-polozek');
        const popoverCelkovaSuma = document.getElementById('popover-celkova-suma');
        const popoverOrderDescription = document.getElementById('popover-order-description');
        const closeButtonPopover = document.querySelector('.close-button-popover');
        const printButton = document.querySelector('.print-button');
        const closePopoverIcon = document.querySelector('.close-popover-icon');

        // Získání elementů pro univerzální dialog
        const customDialog = document.getElementById('customDialog');
        const dialogMessage = document.getElementById('dialog-message');
        const customDialogYes = document.getElementById('customDialogYes');
        const customDialogNo = document.getElementById('customDialogNo');
        const dialogOverlay = document.getElementById('dialogOverlay');
        const dialogEmojiSpan = document.getElementById('dialog-emoji');

        // Získání elementů pro děkovací dialog
        const thankYouDialog = document.getElementById('thankYouDialog');

        // Element pro zobrazení čísla objednávky na hlavní stránce formuláře
        const currentOrderDisplay = document.getElementById('current-order-display');
        const customerNameDisplay = document.querySelector('.customer-name-display');

        // Element: Vlastní tooltip
        const customTooltip = document.getElementById('customTooltip');

        // Globální pole pro uložení jednotlivých vypočtených položek
        // ZMĚNA: Používáme novou proměnnou pro interní práci, ale ukládáme pod 'cartItems'
        let cartItems = []; 
        // Proměnná pro číslo aktuální objednávky (null, dokud není přidána první položka)
        let cisloObjednavky = null;

        // Funkce pro generování náhodného čtyřmístného čísla
        function generateRandomFourDigitNumber() {
            return Math.floor(1000 + Math.random() * 9000);
        }

        // Funkce pro zobrazení univerzálního dialogu
        function showCustomDialog(message, onConfirmCallback, onCancelCallback, showButtons = true) {
            dialogEmojiSpan.textContent = '';
            dialogEmojiSpan.classList.remove('pulsing');

            if (showButtons) {
                dialogMessage.textContent = message;
                customDialogYes.style.display = 'inline-block';
                customDialogNo.style.display = 'inline-block';
                customDialogYes.textContent = 'Ano';
                customDialogNo.textContent = 'Ne';
            } else {
                dialogMessage.textContent = '';
                dialogEmojiSpan.textContent = message;
                dialogEmojiSpan.classList.add('pulsing');
                customDialogYes.style.display = 'none';
                customDialogNo.style.display = 'none';
            }

            customDialog.style.display = 'block';
            dialogOverlay.style.display = 'block';

            // Odebere předchozí listenery, aby se zabránilo vícenásobnému spuštění
            customDialogYes.onclick = null;
            customDialogNo.onclick = null;

            if (showButtons) {
                customDialogYes.onclick = function(event) {
                    event.stopPropagation();
                    hideCustomDialog();
                    if (onConfirmCallback) onConfirmCallback();
                };

                customDialogNo.onclick = function(event) {
                    event.stopPropagation();
                    hideCustomDialog();
                    if (onCancelCallback) onCancelCallback();
                };
            } else {
                // Pro dialog pouze se smajlíkem, skryje se po timeoutu
                setTimeout(() => {
                    hideCustomDialog();
                    setTimeout(() => {
                        if (onConfirmCallback) {
                            onConfirmCallback();
                        }
                    }, 50);
                }, 1500);
            }
        }

        // Funkce pro skrytí univerzálního dialogu
        function hideCustomDialog() {
            customDialog.style.display = 'none';
            dialogOverlay.style.display = 'none';
            dialogEmojiSpan.textContent = '';
            dialogEmojiSpan.classList.remove('pulsing');
        }

        // Funkce pro aktualizaci stavu tlačítek "Přidat do košíku" a "Zobrazit košík"
        function aktualizovatStavTlacitkaSpocitat() {
            const isNazevZboziEmpty = nazevZbozi.value.trim() === '';
            const isJmenoProvided = jmenoInput.value.trim() !== '' || cisloObjednavky !== null;

            tlacitkoSpocitatTotal.disabled = isNazevZboziEmpty || !isJmenoProvided;
            tlacitkoZobrazitPopover.disabled = popover.style.display === 'flex' || isNazevZboziEmpty || !isJmenoProvided;
        }
		
		
		
		

        // Funkce pro zobrazení dočasné zprávy (nyní jako "nálepka")
        function showTemporaryMessage(message, type = 'info', duration = 2000) { 
            let stickerDiv = document.getElementById('temporarySticker');
            if (!stickerDiv) {
                stickerDiv = document.createElement('div');
                stickerDiv.id = 'temporarySticker';
                stickerDiv.classList.add('temporary-sticker');
                document.body.appendChild(stickerDiv);
            }

            stickerDiv.textContent = message;
            stickerDiv.className = 'temporary-sticker';
            stickerDiv.classList.add(type);
            stickerDiv.classList.add('active');

            setTimeout(() => {
                stickerDiv.classList.remove('active');
                setTimeout(() => {
                    if (stickerDiv.parentNode) {
                        stickerDiv.parentNode.removeChild(stickerDiv);
                    }
                }, 400); 
            }, duration);
        }

        // Funkce pro aktualizaci popoveru
        function aktualizovatPopover() {
            popoverSeznamPolozek.innerHTML = '';
            popoverCisloObjednavky.textContent = cisloObjednavky;
            popoverJmenoZakaznika.textContent = localStorage.getItem('jmenoUzivatele') || '';

            let celkovaSuma = 0;

            cartItems.forEach((item, index) => { // ZMĚNA: Iterujeme přes cartItems
                const itemContainer = document.createElement('div');
                itemContainer.classList.add('popover-item-container');

                const detailsContainer = document.createElement('div');
                detailsContainer.classList.add('popover-item-details-container');

                const itemName = document.createElement('p');
                itemName.classList.add('popover-item-name');
                itemName.textContent = `${item.nazev}`;
                // Přidání event listenerů pro vlastní tooltip
                itemName.addEventListener('mouseover', function() {
                    customTooltip.textContent = item.nazev;
                    const rect = itemName.getBoundingClientRect();
                    // Upravená pozice Y pro tooltip (vyšší umístění)
                    customTooltip.style.left = `${rect.left + window.scrollX}px`;
                    customTooltip.style.top = `${rect.top + window.scrollY - customTooltip.offsetHeight - 20}px`; 
                    customTooltip.style.display = 'block';
                });
                itemName.addEventListener('mouseout', function() {
                    customTooltip.style.display = 'none';
                });


                const itemDetails = document.createElement('p');
                itemDetails.classList.add('popover-item-details');
                itemDetails.textContent = `${item.kusy} ks x ${item.cena.toFixed(2)} Kč = ${item.total.toFixed(2)} Kč`;

                detailsContainer.appendChild(itemName);
                detailsContainer.appendChild(itemDetails);

                // Zobrazení poznámky k položce, pokud existuje
                if (item.polozkaPoznamka && item.polozkaPoznamka.trim() !== '') {
                    const itemNote = document.createElement('p');
                    itemNote.classList.add('popover-item-note');
                    itemNote.textContent = `Poznámka: ${item.polozkaPoznamka}`;
                    detailsContainer.appendChild(itemNote);
                }

                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-button');
                deleteButton.innerHTML = '&times;';
                deleteButton.title = 'Odstranit položku';
                deleteButton.addEventListener('click', function() {
                    // Zobrazí potvrzovací dialog před smazáním
                    showCustomDialog(`Opravdu chcete odebrat položku "${item.nazev}"?`,
                        () => { // On Confirm (Ano)
                            // Mazání po kusech
                            if (item.kusy > 1) {
                                item.kusy--;
                                item.total -= item.cena;
                                showTemporaryMessage(`Odebrán 1 kus z "${item.nazev}".`, 'info', 2000);
                            } else {
                                cartItems.splice(index, 1); // ZMĚNA: Odstraňujeme z cartItems
                                showTemporaryMessage(`Položka "${item.nazev}" odebrána.`, 'info', 2000);
                            }
                            localStorage.setItem('cartItems', JSON.stringify(cartItems)); // ZMĚNA: Ukládáme cartItems
                            console.log(`[formular.html] cartItems po smazání/úpravě:`, JSON.parse(localStorage.getItem('cartItems'))); // Log pro ladění
                            if (cartItems.length === 0) { // ZMĚNA: Kontrolujeme cartItems
                                localStorage.removeItem('cisloObjednavky');
                                cisloObjednavky = null;
                                localStorage.removeItem('cartItems'); // ZMĚNA: Odstraníme i cartItems
                                console.log("[formular.html] Košík prázdný, cartItems odstraněno z localStorage.");
                            }
                            aktualizovatPopover();
                            updateNameDisplay();
                            aktualizovatStavTlacitkaSpocitat();
                        },
                        () => { // On Cancel (Ne)
                            showTemporaryMessage('Odebrání položky zrušeno.', 'info', 1500);
                        },
                        true
                    );
                });

                itemContainer.appendChild(detailsContainer);
                itemContainer.appendChild(deleteButton);
                popoverSeznamPolozek.appendChild(itemContainer);

                celkovaSuma += item.total;
            });

            popoverCelkovaSuma.textContent = celkovaSuma.toFixed(2) + " Kč";

            const popisObjednavky = localStorage.getItem('popisObjednavky');
            if (popisObjednavky && popisObjednavky.trim() !== '') {
                popoverOrderDescription.textContent = `Poznámka: ${popisObjednavky}`;
                popoverOrderDescription.style.display = 'block';
            } else {
                popoverOrderDescription.textContent = '';
                popoverOrderDescription.style.display = 'none';
            }

            // Logika pro zobrazení/skrytí popoveru
            if (cartItems.length > 0 || (popisObjednavky && popisObjednavky.trim() !== '')) { // ZMĚNA: Kontrolujeme cartItems
                popover.style.display = 'flex';
                tlacitkoZobrazitPopover.disabled = true;
            } else {
                popover.style.display = 'none';
                tlacitkoZobrazitPopover.disabled = false;
            }

            // Speciální případ: pokud je košík prázdný a není žádná celková poznámka, popover skryj
            if (cartItems.length === 0 && (popisObjednavky === null || popisObjednavky.trim() === '')) { // ZMĚNA: Kontrolujeme cartItems
                popover.style.display = 'none';
                tlacitkoZobrazitPopover.disabled = false;
            }

            // Aktualizace čísla objednávky na hlavní stránce formuláře
            currentOrderDisplay.textContent = cisloObjednavky ? `${cisloObjednavky}` : '';
        }

        // Funkce pro zobrazení/skrytí pole jména a jména v nadpisu
        function updateNameDisplay() {
            const currentJmeno = jmenoInput.value.trim();
            const hasOrder = cisloObjednavky !== null;
            const storedJmeno = localStorage.getItem('jmenoUzivatele');
            const nameToDisplay = storedJmeno || currentJmeno;

            if (hasOrder && nameToDisplay !== '') {
                jmenoInputGroup.style.display = 'none';
                jmenoInput.disabled = true;
                customerNameDisplay.textContent = nameToDisplay;
                customerNameDisplay.style.display = 'inline';
            } else {
                jmenoInputGroup.style.display = 'block';
                jmenoInput.disabled = false;
                customerNameDisplay.textContent = '';
                customerNameDisplay.style.display = 'none';
            }
            aktualizovatStavTlacitkaSpocitat();
        }

        // Funkce pro vynulování všech hodnot (celé objednávky)
        function resetovatVse() {
            cartItems = []; // ZMĚNA: Vynulujeme cartItems
            cisloObjednavky = null;
            popoverSeznamPolozek.innerHTML = '';
            popoverCelkovaSuma.textContent = "0.00 Kč";
            popover.style.display = 'none';
            popoverCisloObjednavky.textContent = '';
            currentOrderDisplay.textContent = '';
            
            localStorage.removeItem('cartItems'); // ZMĚNA: Odstraníme 'cartItems'
            localStorage.removeItem('cisloObjednavky');
            localStorage.removeItem('jmenoUzivatele');
            localStorage.removeItem('popisObjednavky');
            
            console.log("[formular.html] Vše vynulováno, localStorage vyčištěno."); // Log pro ladění

            jmenoInput.value = "";
            popisObjednavkyInput.value = "";
            polozkaPoznamkaInput.value = "";
            nazevZbozi.value = "";
            pevnaCena1.value = "120";
            kusy.value = "1";

            selectedItemDisplay.style.display = 'none';
            selectedItemImage.src = '';
            selectedItemImage.style.display = 'none';
            selectedItemName.textContent = '';
            selectedItemDescription.textContent = ''; // Vyčistí popis
            selectedItemPrice.textContent = '';

            updateNameDisplay();
            if (jmenoInputGroup.style.display !== 'none') {
                jmenoInput.focus();
            } else {
                kusy.focus();
            }
        }

        // Funkce pro zpracování kliknutí na tlačítko výpočtu
        tlacitkoSpocitatTotal.addEventListener('click', function(event) {
            event.stopPropagation();

            if (jmenoInputGroup.style.display !== 'none' && jmenoInput.value.trim() === '') {
                showTemporaryMessage('Prosím, vyplňte jméno.', 'warning');
                jmenoInput.focus();
                return;
            }

            const nazev = nazevZbozi.value || "Neznámé zboží";
            const cena = parseFloat(pevnaCena1.value);
            const pocetKusu = parseFloat(kusy.value);
            const itemNote = polozkaPoznamkaInput.value.trim();
            const itemDescription = selectedItemDescription.textContent.trim(); // Získá popis

            if (isNaN(cena) || isNaN(pocetKusu) || pocetKusu <= 0) {
                showTemporaryMessage('Prosím zadejte platné číslo pro počet kusů.', 'warning');
                return;
            }

            const existingItemIndex = cartItems.findIndex(item => item.nazev === nazev); // ZMĚNA: Hledáme v cartItems

            if (existingItemIndex > -1) {
                let message = `Položka "${nazev}" je již v košíku. Počet kusů se navýší o ${pocetKusu}. Chcete pokračovat?`;

                showCustomDialog(message,
                    () => { // On Confirm (Ano)
                        addItemConfirmed(nazev, cena, pocetKusu, existingItemIndex, itemNote, itemDescription); 
                    },
                    () => { // On Cancel (Ne)
                        showTemporaryMessage('Přidání položky zrušeno.', 'info', 1500);
                    },
                    true
                );
            } else {
                addItemConfirmed(nazev, cena, pocetKusu, -1, itemNote, itemDescription); 
            }
        });

        // Pomocná funkce, která zapouzdřuje skutečnou logiku přidávání
        function addItemConfirmed(nazev, cena, pocetKusu, existingItemIndex, itemNote, itemDescription) { 
            if (cartItems.length === 0) { // ZMĚNA: Kontrolujeme cartItems
                cisloObjednavky = generateRandomFourDigitNumber();
                localStorage.setItem('cisloObjednavky', cisloObjednavky);
                localStorage.setItem('jmenoUzivatele', jmenoInput.value.trim());
            }
            const novyTotal = cena * pocetKusu;

            if (existingItemIndex > -1) {
                cartItems[existingItemIndex].kusy += pocetKusu; // ZMĚNA: Měníme cartItems
                cartItems[existingItemIndex].total += novyTotal; // ZMĚNA: Měníme cartItems
                cartItems[existingItemIndex].polozkaPoznamka = itemNote; 
                cartItems[existingItemIndex].popisZbozi = itemDescription; 
                
                showTemporaryMessage(`Položka "${nazev}" aktualizována.`, 'info', 2000);
            } else {
                cartItems.push({ // ZMĚNA: Přidáváme do cartItems
                    nazev: nazev,
                    cena: cena,
                    kusy: pocetKusu,
                    total: novyTotal,
                    polozkaPoznamka: itemNote,
                    popisZbozi: itemDescription 
                });
                showTemporaryMessage('👍', 'info', 2000);
            }
            
            localStorage.setItem('cartItems', JSON.stringify(cartItems)); // ZMĚNA: Ukládáme 'cartItems'
            console.log(`[formular.html] Položka přidána/aktualizována, cartItems v localStorage:`, JSON.parse(localStorage.getItem('cartItems'))); // Log pro ladění

            updateNameDisplay();
            aktualizovatPopover();
            polozkaPoznamkaInput.value = ''; // Vymaže pole poznámky po PŘIDÁNÍ/AKTUALIZACI položky
        }

        // Zobrazí popover po kliknutí na tlačítko "Zobrazit seznam"
        tlacitkoZobrazitPopover.addEventListener('click', function(event) {
            event.stopPropagation();

            if (jmenoInputGroup.style.display !== 'none' && jmenoInput.value.trim() === '') {
                showTemporaryMessage('Prosím, vyplňte jméno.', 'warning');
                jmenoInput.focus();
                return;
            }

            // *** NOVÁ LOGIKA PRO AKTUALIZACI POZNÁMKY PŘED ZOBRAZENÍM KOŠÍKU (POZNÁMKA ZŮSTÁVÁ) ***
            const currentSelectedItemName = nazevZbozi.value.trim();
            const currentItemNote = polozkaPoznamkaInput.value.trim();

            if (currentSelectedItemName !== '') {
                const existingItemIndex = cartItems.findIndex(item => item.nazev === currentSelectedItemName); // ZMĚNA: Hledáme v cartItems
                if (existingItemIndex > -1) {
                    // Aktualizuje poznámku u existující položky v poli košíku
                    cartItems[existingItemIndex].polozkaPoznamka = currentItemNote; // ZMĚNA: Měníme cartItems
                    // Okamžitě uloží do localStorage
                    localStorage.setItem('cartItems', JSON.stringify(cartItems)); // ZMĚNA: Ukládáme 'cartItems'
                    console.log(`[formular.html] Položka v košíku aktualizována (poznámka), cartItems v localStorage:`, JSON.parse(localStorage.getItem('cartItems'))); // Log pro ladění
                }
            }
            // *** KONEC NOVÉ LOGIKY ***

            if (popover.style.display === 'flex') {
                popover.style.display = 'none';
                tlacitkoZobrazitPopover.disabled = false;
            } else {
                aktualizovatPopover(); // Zde se košík aktualizuje, když se zobrazuje
                popover.style.display = 'flex';
                tlacitkoZobrazitPopover.disabled = true;
            }
        });

        // Funkce pro odeslání popoveru k tisku
        printButton.addEventListener('click', function() {
            window.print();
            thankYouDialog.style.display = 'flex';
            setTimeout(() => {
                thankYouDialog.style.display = 'none';
                resetovatVse();
                // Přesměrování na stránku special.html po dokončení objednávky
                window.location.href = 'specialobj.html';
            }, 2000);
        });

        // Zavře popover a vynuluje objednávku (Zobrazí potvrzovací dialog)
        closeButtonPopover.addEventListener('click', function() {
            popover.style.display = 'none';
            tlacitkoZobrazitPopover.disabled = false;
 showCustomDialog('Vážně chcete zrušit objednávku?',
                () => { // onConfirm (Ano) pro první dialog
                    showCustomDialog('😢', null, null, false);
                    setTimeout(() => {
                        resetovatVse();
                        window.location.href = 'specialobj.html';
                    }, 1500 + 50);
                },
                () => { // onCancel (Ne) pro první dialog
                    showCustomDialog('😊', null, null, false);
                    setTimeout(() => {
                        window.location.href = 'specialobj.html';
                    }, 1500 + 50);
                },
                true
            );
        });

        // Zavře popover, ale NENULuje objednávku (pomocí křížku)
        if (closePopoverIcon) {
            closePopoverIcon.addEventListener('click', function() {
                popover.style.display = 'none';
                tlacitkoZobrazitPopover.disabled = false;
            });
        }

        // Skryje popover po kliknutí kdekoli na stránce mimo popover
        document.addEventListener('click', function(event) {
            const isClickInsidePopover = popover.contains(event.target);
            const isClickOnTriggerButton = (tlacitkoSpocitatTotal && tlacitkoSpocitatTotal.contains(event.target)) || (tlacitkoZobrazitPopover && tlacitkoZobrazitPopover.contains(event.target));
            const isClickOnDeleteButton = event.target.classList.contains('delete-button');
            const isClickInsideCustomDialog = customDialog.contains(event.target);
            const isCustomDialogVisible = customDialog.style.display === 'block';
            const isClickInsideThankYouDialog = thankYouDialog.contains(event.target);
            const isThankYouDialogVisible = thankYouDialog.style.display === 'flex';
            const isClickOnCloseIcon = closePopoverIcon && closePopoverIcon.contains(event.target);


            if (
                popover.style.display === 'flex' &&
                !isClickInsidePopover &&
                !isClickOnTriggerButton &&
                !isClickOnDeleteButton &&
                !(isCustomDialogVisible && isClickInsideCustomDialog) &&
                !(isThankYouDialogVisible && isClickInsideThankYouDialog) &&
                !isClickOnCloseIcon
            ) {
                popover.style.display = 'none';
                tlacitkoZobrazitPopover.disabled = false;
            }
        });

        // Funkce pro načtení dat z URL parametrů
        function loadDataFromUrl() {
            const urlParams = new URLSearchParams(window.location.search);
            const img = urlParams.get('img');
            const name = urlParams.get('name');
            const price = urlParams.get('price');
            const description = urlParams.get('description'); 

            if (img) {
                selectedItemImage.src = img;
                selectedItemImage.style.display = 'block';
            } else {
                selectedItemImage.style.display = 'none';
            }
            if (name) {
                selectedItemName.textContent = name;
                nazevZbozi.value = name;

                const existingItem = cartItems.find(item => item.nazev === name); // ZMĚNA: Hledáme v cartItems
                if (existingItem && existingItem.polozkaPoznamka) {
                    polozkaPoznamkaInput.value = existingItem.polozkaPoznamka;
                } else {
                    polozkaPoznamkaInput.value = ''; 
                }

            } else {
                polozkaPoznamkaInput.value = ''; 
            }
            if (price) {
                selectedItemPrice.textContent = `${parseFloat(price).toFixed(2)} Kč`;
                pevnaCena1.value = parseFloat(price);
            }
            
            // Zobrazí popis, pokud je k dispozici (pouze ve formuláři)
            if (description) {
                selectedItemDescription.textContent = description;
                selectedItemDescription.style.display = 'block';
            } else {
                selectedItemDescription.textContent = '';
                selectedItemDescription.style.display = 'none';
            }
            
            if (window.location.protocol !== 'blob:') {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
        }

        // Při načtení stránky se pokusíme načíst existující objednávku z localStorage
        const storedCartItems = localStorage.getItem('cartItems'); // ZMĚNA: Načítáme 'cartItems'
        if (storedCartItems) {
            try {
                cartItems = JSON.parse(storedCartItems); // ZMĚNA: Parsujeme do cartItems
                console.log("[formular.html] Načtené cartItems z localStorage:", cartItems); // Log pro ladění
            } catch (e) {
                console.error("[formular.html] Chyba při parsování cartItems z localStorage:", e); // Log pro ladění
                cartItems = [];
            }
        } else {
            console.log("[formular.html] Žádné cartItems v localStorage nalezeny."); // Log pro ladění
        }

        const storedCisloObjednavky = localStorage.getItem('cisloObjednavky');
        if (storedCisloObjednavky) {
            cisloObjednavky = parseInt(storedCisloObjednavky, 10);
        }

        // Načtení jména z localStorage při načtení stránky
        const storedJmeno = localStorage.getItem('jmenoUzivatele');
        if (storedJmeno) {
            jmenoInput.value = storedJmeno;
        }
        
        // Načtení popisu objednávky z localStorage při načtení stránky
        const storedPopisObjednavky = localStorage.getItem('popisObjednavky');
        if (storedPopisObjednavky) {
            popisObjednavkyInput.value = storedPopisObjednavky;
        }

        // Ukládání jména do localStorage při každé změně pole
        jmenoInput.addEventListener('input', function() {
            localStorage.setItem('jmenoUzivatele', jmenoInput.value);
            aktualizovatStavTlacitkaSpocitat();
        });

        // Ukládání popisu objednávky do localStorage při každé změně pole
        popisObjednavkyInput.addEventListener('input', function() {
            localStorage.setItem('popisObjednavky', popisObjednavkyInput.value);
            // Není potřeba aktualizovat stav tlačítek zde, protože to neovlivňuje jejich aktivaci
        });


        // Spustit funkci pro načtení dat z URL (pouze po načtení DOM)
        loadDataFromUrl();
        // Spustit aktualizaci stavu tlačítek, aby se hned na začátku zkontroloval stav
        aktualizovatStavTlacitkaSpocitat();
        // Aktualizovat jméno zákazníka v nadpisu (a skrýt input)
        updateNameDisplay();
        // Aktualizovat popover, pokud už existují položky z localStorage
        aktualizovatPopover();
    }

    // Před spuštěním logiky formuláře zkontrolujte a vymažte staré klíče, pokud existují
    // Tuto část můžete po prvním spuštění odstranit, je to jen pro jednorázovou migraci
    if (localStorage.getItem('seznamPolozek')) {
        console.warn("[formular.html] Detekován starý klíč 'seznamPolozek'. Migruji na 'cartItems' a odstraňuji starý klíč.");
        localStorage.setItem('cartItems', localStorage.getItem('seznamPolozek'));
        localStorage.removeItem('seznamPolozek');
    }

    initializeFormLogic();
});
    </script>