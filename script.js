document.addEventListener('DOMContentLoaded', () => {
    // Riferimenti agli elementi del DOM
    const productList = document.getElementById('product-list');
    const resultsCount = document.getElementById('results-count');
    const filterForm = document.getElementById('filter-form');
    const searchTerm = document.getElementById('search-term');
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');
    const capacityRange = document.getElementById('capacity-range');
    const capacityValue = document.getElementById('capacity-value');
    const brandFiltersContainer = document.getElementById('brand-filters');
    const energyClassFiltersContainer = document.getElementById('energy-class-filters');
    const featureCheckboxes = document.querySelectorAll('input[name="feature"]');
    
    // Riferimenti per la comparazione
    const comparisonDrawer = document.getElementById('comparison-drawer');
    const comparisonCount = document.getElementById('comparison-count');
    const comparisonItemsContainer = document.getElementById('comparison-items');
    const compareNowBtn = document.getElementById('compare-now-btn');
    const clearComparisonBtn = document.getElementById('clear-comparison-btn');
    const comparisonModal = document.getElementById('comparison-modal');
    const closeModalBtn = document.querySelector('.close-btn');
    const comparisonTableContainer = document.getElementById('comparison-table-container');

    let comparisonList = [];
    const MAX_COMPARE = 4;

    // Funzione per creare e visualizzare le schede prodotto
    function displayProducts(products) {
        productList.innerHTML = ''; // Pulisce la lista attuale
        if (products.length === 0) {
            productList.innerHTML = '<p>Nessun prodotto trovato. Prova a modificare i filtri.</p>';
        } else {
            products.forEach(product => {
                const card = document.createElement('div');
                card.className = 'product-card';
                card.innerHTML = `
                    <img src="https://placehold.co/300x300/eee/ccc?text=${product.marca}+${product.modello}" alt="${product.marca} ${product.modello}">
                    <div class="product-card-content">
                        <h3>${product.marca}</h3>
                        <p class="model">${product.modello}</p>
                        <p class="price">€ ${product.prezzo_min} - ${product.prezzo_max}</p>
                        <ul class="product-specs">
                            <li><strong>Capacità:</strong> ${product.capacita_kg} kg</li>
                            <li><strong>Classe:</strong> ${product.classe_energetica}</li>
                            <li><strong>Rumore:</strong> ${product.rumorosita_db} dB</li>
                        </ul>
                        <div class="product-card-actions">
                             <label class="compare-label">
                                <input type="checkbox" class="compare-checkbox" data-id="${product.id}" ${comparisonList.includes(product.id) ? 'checked' : ''}>
                                Confronta
                            </label>
                        </div>
                    </div>
                `;
                productList.appendChild(card);
            });
        }
        resultsCount.textContent = `Trovati ${products.length} modelli.`;
    }

    // Funzione per popolare i filtri dinamicamente
    function populateFilters() {
        if (typeof lavatriciDatabase === 'undefined' || lavatriciDatabase.length === 0) {
            console.error("Il database delle lavatrici non è stato caricato o è vuoto.");
            resultsCount.textContent = "Errore: impossibile caricare il database dei prodotti.";
            return;
        }
        const brands = [...new Set(lavatriciDatabase.map(p => p.marca))];
        brands.forEach(brand => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" name="brand" value="${brand}"> ${brand}`;
            brandFiltersContainer.appendChild(label);
        });

        const energyClasses = [...new Set(lavatriciDatabase.map(p => p.classe_energetica))];
        energyClasses.sort().reverse();
        energyClasses.forEach(ec => {
            const label = document.createElement('label');
            label.innerHTML = `<input type="checkbox" name="energy-class" value="${ec}"> ${ec}`;
            energyClassFiltersContainer.appendChild(label);
        });
    }

    // Funzione principale di filtraggio
    function applyFilters() {
        if (typeof lavatriciDatabase === 'undefined') return;

        const searchText = searchTerm.value.toLowerCase();
        const maxPrice = parseInt(priceRange.value);
        const maxCapacity = parseInt(capacityRange.value);

        const selectedBrands = [...document.querySelectorAll('input[name="brand"]:checked')].map(cb => cb.value);
        const selectedEnergyClasses = [...document.querySelectorAll('input[name="energy-class"]:checked')].map(cb => cb.value);
        const selectedFeatures = [...document.querySelectorAll('input[name="feature"]:checked')].map(cb => cb.value);

        const filteredProducts = lavatriciDatabase.filter(p => {
            const nameMatch = p.marca.toLowerCase().includes(searchText) || p.modello.toLowerCase().includes(searchText);
            const priceMatch = p.prezzo_max <= maxPrice;
            const capacityMatch = p.capacita_kg <= maxCapacity;
            const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(p.marca);
            const energyMatch = selectedEnergyClasses.length === 0 || selectedEnergyClasses.includes(p.classe_energetica);
            
            const featureMatch = selectedFeatures.every(feature => {
                if (feature === 'ai') return p.ai === true;
                return p[feature] && (p[feature].toLowerCase() === 'sì' || p[feature].toLowerCase().startsWith('sì ('));
            });

            return nameMatch && priceMatch && capacityMatch && brandMatch && energyMatch && featureMatch;
        });

        displayProducts(filteredProducts);
    }

    // Gestione della logica di comparazione
    function updateComparisonDrawer() {
        comparisonCount.textContent = comparisonList.length;
        comparisonItemsContainer.innerHTML = '';

        if (comparisonList.length > 0) {
            comparisonDrawer.classList.add('show');
            comparisonList.forEach(id => {
                const product = lavatriciDatabase.find(p => p.id === id);
                if (product) {
                    const item = document.createElement('div');
                    item.className = 'comparison-item';
                    item.innerHTML = `
                        <img src="https://placehold.co/40x40/eee/ccc?text=${product.marca}" alt="${product.marca}">
                        <span>${product.marca} ${product.modello}</span>
                    `;
                    comparisonItemsContainer.appendChild(item);
                }
            });
        } else {
            comparisonDrawer.classList.remove('show');
        }
        
        compareNowBtn.disabled = comparisonList.length < 2;
    }

    // Aggiungi o rimuovi un prodotto dalla lista di confronto
    productList.addEventListener('change', e => {
        if (e.target.classList.contains('compare-checkbox')) {
            const productId = parseInt(e.target.dataset.id);
            if (e.target.checked) {
                if (comparisonList.length < MAX_COMPARE) {
                    comparisonList.push(productId);
                } else {
                    e.target.checked = false;
                    alert(`Puoi confrontare al massimo ${MAX_COMPARE} modelli.`);
                }
            } else {
                comparisonList = comparisonList.filter(id => id !== productId);
            }
            updateComparisonDrawer();
        }
    });
    
    // Pulisce la selezione
    clearComparisonBtn.addEventListener('click', () => {
        comparisonList = [];
        applyFilters(); // Ridisegna i prodotti per deselezionare le checkbox
        updateComparisonDrawer();
    });

    // Mostra la modale di confronto
    compareNowBtn.addEventListener('click', () => {
        generateComparisonTable();
        comparisonModal.style.display = 'block';
    });

    // Chiude la modale
    closeModalBtn.addEventListener('click', () => {
        comparisonModal.style.display = 'none';
    });
    window.addEventListener('click', e => {
        if (e.target == comparisonModal) {
            comparisonModal.style.display = 'none';
        }
    });

    // Genera la tabella di confronto
    function generateComparisonTable() {
        const productsToCompare = lavatriciDatabase.filter(p => comparisonList.includes(p.id));
        
        let tableHTML = '<table class="comparison-table"><thead><tr><th>Caratteristica</th>';
        productsToCompare.forEach(p => {
            tableHTML += `<th>${p.marca} ${p.modello}</th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        const featuresToCompare = {
            'Prezzo': p => `€ ${p.prezzo_min} - ${p.prezzo_max}`,
            'Capacità': p => `${p.capacita_kg} kg`,
            'Classe Energetica': p => p.classe_energetica,
            'Consumo Energia': p => `${p.consumo_energia_kwh} kWh/100 cicli`,
            'Rumorosità': p => `${p.rumorosita_db} dB`,
            'Centrifuga Max': p => `${p.centrifuga_max} giri/min`,
            'Dimensioni (LxAxP)': p => p.dimensioni.replace(/x/g, 'x'),
            'Funzione Vapore': p => p.funzione_vapore,
            'WiFi': p => p.wifi,
            'Auto Dosaggio': p => p.auto_dosaggio,
            'Intelligenza Artificiale': p => p.ai ? 'Sì' : 'No',
            'Tecnologie Principali': p => p.tecnologie_principali.join(', '),
        };

        for (const feature in featuresToCompare) {
            tableHTML += `<tr><th>${feature}</th>`;
            const values = productsToCompare.map(p => featuresToCompare[feature](p));
            productsToCompare.forEach(p => {
                tableHTML += `<td>${featuresToCompare[feature](p)}</td>`;
            });
            tableHTML += `</tr>`;
        }

        tableHTML += '</tbody></table>';
        comparisonTableContainer.innerHTML = tableHTML;
    }

    // Event listener per i filtri
    filterForm.addEventListener('input', applyFilters);
    filterForm.addEventListener('reset', () => {
        setTimeout(() => {
            priceRange.value = 3000;
            capacityRange.value = 20;
            priceValue.textContent = '0 - 3000';
            capacityValue.textContent = '0 - 20';
            applyFilters();
        }, 0);
    });

    // Aggiornamento etichette per i range slider
    priceRange.addEventListener('input', () => priceValue.textContent = `0 - ${priceRange.value}`);
    capacityRange.addEventListener('input', () => capacityValue.textContent = `0 - ${capacityRange.value}`);

    // Inizializzazione
    populateFilters();
    applyFilters();
});
