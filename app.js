// App.js - Logica principale dell'applicazione
class LavatriciFinder {
    constructor() {
        this.filteredModels = [...washingMachinesDB];
        this.compareList = [];
        this.currentView = 'grid';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderProducts();
        this.updateResultsCount();
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', this.debounce(() => {
            this.applyFilters();
        }, 300));

        // Filter checkboxes
        const filterGroups = ['brandFilter', 'capacityFilter', 'energyFilter', 'priceFilter', 'technologyFilter', 'typeFilter'];
        filterGroups.forEach(groupId => {
            const group = document.getElementById(groupId);
            if (group) {
                group.addEventListener('change', () => {
                    this.applyFilters();
                });
            }
        });

        // Reset filters
        document.getElementById('resetFilters').addEventListener('click', () => {
            this.resetAllFilters();
        });

        // Sort select
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortProducts(e.target.value);
        });

        // View buttons
        document.getElementById('gridView').addEventListener('click', () => {
            this.setView('grid');
        });

        document.getElementById('listView').addEventListener('click', () => {
            this.setView('list');
        });

        document.getElementById('compareView').addEventListener('click', () => {
            this.toggleComparePanel();
        });

        // Close compare panel
        document.getElementById('closeCompare').addEventListener('click', () => {
            this.closeComparePanel();
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    getActiveFilters() {
        return {
            search: document.getElementById('searchInput').value.trim(),
            brands: this.getCheckedValues('brandFilter'),
            capacities: this.getCheckedValues('capacityFilter'),
            energyClasses: this.getCheckedValues('energyFilter'),
            prices: this.getCheckedValues('priceFilter'),
            technologies: this.getCheckedValues('technologyFilter'),
            types: this.getCheckedValues('typeFilter')
        };
    }

    getCheckedValues(groupId) {
        const group = document.getElementById(groupId);
        const checkedBoxes = group.querySelectorAll('input[type="checkbox"]:checked');
        return Array.from(checkedBoxes).map(cb => cb.value);
    }

    applyFilters() {
        const filters = this.getActiveFilters();
        
        this.filteredModels = washingMachinesDB.filter(model => {
            // Search filter
            if (filters.search && !searchInModel(model, filters.search)) {
                return false;
            }
            
            return matchesFilters(model, filters);
        });

        this.renderProducts();
        this.updateResultsCount();
    }

    sortProducts(sortType) {
        switch (sortType) {
            case 'prezzo-asc':
                this.filteredModels.sort((a, b) => a.prezzo_min - b.prezzo_min);
                break;
            case 'prezzo-desc':
                this.filteredModels.sort((a, b) => b.prezzo_max - a.prezzo_max);
                break;
            case 'capacita-asc':
                this.filteredModels.sort((a, b) => a.capacita_kg - b.capacita_kg);
                break;
            case 'capacita-desc':
                this.filteredModels.sort((a, b) => b.capacita_kg - a.capacita_kg);
                break;
            case 'efficienza':
                this.filteredModels.sort((a, b) => a.consumo_energia_kwh - b.consumo_energia_kwh);
                break;
            case 'marca':
                this.filteredModels.sort((a, b) => a.marca.localeCompare(b.marca));
                break;
        }
        
        this.renderProducts();
    }

    setView(viewType) {
        this.currentView = viewType;
        
        // Update buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (viewType === 'grid') {
            document.getElementById('gridView').classList.add('active');
        } else if (viewType === 'list') {
            document.getElementById('listView').classList.add('active');
        }
        
        this.renderProducts();
    }

    renderProducts() {
        const container = document.getElementById('productsContainer');
        container.className = `products-grid ${this.currentView === 'list' ? 'list-view' : ''}`;
        
        if (this.filteredModels.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <div class="no-results-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>Nessun risultato trovato</h3>
                    <p>Prova a modificare i filtri di ricerca</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.filteredModels.map(model => {
            return this.currentView === 'list' ? this.renderProductList(model) : this.renderProductCard(model);
        }).join('');

        // Add event listeners to compare buttons
        container.querySelectorAll('.btn-compare').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modelId = parseInt(e.target.dataset.modelId);
                this.toggleCompare(modelId);
            });
        });
    }

    renderProductCard(model) {
        const energyClass = this.getEnergyBadgeClass(model.classe_energetica);
        const techTags = this.renderTechTags(model);
        const isInCompare = this.compareList.includes(model.id);
        
        return `
            <div class="product-card" data-id="${model.id}">
                <div class="product-header">
                    <div class="brand-logo">${model.marca}</div>
                    <div class="energy-badge ${energyClass}">${model.classe_energetica}</div>
                </div>
                
                <h3 class="product-title">${model.modello}</h3>
                <p class="product-serie">${model.serie}</p>
                
                <div class="product-specs">
                    <div class="spec">
                        <span class="spec-label">Capacità</span>
                        <span class="spec-value">${model.capacita_kg} kg</span>
                    </div>
                    <div class="spec">
                        <span class="spec-label">Consumo</span>
                        <span class="spec-value">${model.consumo_energia_kwh} kWh</span>
                    </div>
                    <div class="spec">
                        <span class="spec-label">Centrifuga</span>
                        <span class="spec-value">${model.centrifuga_max} rpm</span>
                    </div>
                    <div class="spec">
                        <span class="spec-label">Rumorosità</span>
                        <span class="spec-value">${model.rumorosita_db} dB</span>
                    </div>
                </div>
                
                <div class="product-technologies">
                    <div class="tech-tags">${techTags}</div>
                </div>
                
                <div class="product-footer">
                    <div class="price-range">${model.prezzo_min}€ - ${model.prezzo_max}€</div>
                    <div class="action-buttons">
                        <button class="btn-compare ${isInCompare ? 'active' : ''}" data-model-id="${model.id}">
                            <i class="fas fa-balance-scale"></i>
                            ${isInCompare ? 'Rimuovi' : 'Confronta'}
                        </button>
                        <button class="btn-details" onclick="this.showDetails(${model.id})">
                            Dettagli
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderProductList(model) {
        const energyClass = this.getEnergyBadgeClass(model.classe_energetica);
        const techTags = this.renderTechTags(model);
        
        return `
            <div class="product-card list-item" data-id="${model.id}">
                <div class="product-basic-info">
                    <div class="brand-logo">${model.marca}</div>
                    <div>
                        <h3 class="product-title">${model.modello}</h3>
                        <p class="product-serie">${model.serie}</p>
                    </div>
                </div>
                
                <div class="product-key-specs">
                    <span class="energy-badge ${energyClass}">${model.classe_energetica}</span>
                    <span class="capacity">${model.capacita_kg}kg</span>
                    <span class="consumption">${model.consumo_energia_kwh} kWh</span>
                    <div class="tech-tags-inline">${techTags}</div>
                </div>
                
                <div class="product-price-actions">
                    <div class="price-range">${model.prezzo_min}€ - ${model.prezzo_max}€</div>
                    <div class="action-buttons">
                        <button class="btn-compare" data-model-id="${model.id}">
                            <i class="fas fa-balance-scale"></i>
                        </button>
                        <button class="btn-details">Dettagli</button>
                    </div>
                </div>
            </div>
        `;
    }

    renderTechTags(model) {
        const tags = [];
        
        if (model.funzione_vapore === "Sì") tags.push('<span class="tech-tag premium">Vapore</span>');
        if (model.wifi === "Sì") tags.push('<span class="tech-tag premium">WiFi</span>');
        if (model.auto_dosaggio !== "No") tags.push('<span class="tech-tag premium">Auto-Dosaggio</span>');
        if (model.ai) tags.push('<span class="tech-tag premium">AI</span>');
        if (model.tipo_carica.includes("Slim")) tags.push('<span class="tech-tag">Slim</span>');
        if (model.tipo_carica.includes("Alto")) tags.push('<span class="tech-tag">Top Load</span>');
        if (model.tipo_carica.includes("Lavasciuga")) tags.push('<span class="tech-tag">Lavasciuga</span>');
        
        return tags.join('');
    }

    getEnergyBadgeClass(classe) {
        if (classe.includes("A-60%")) return "energy-a-60";
        if (classe.includes("A-40%")) return "energy-a-40";
        if (classe.includes("A-20%")) return "energy-a-20";
        if (classe.includes("A-10%")) return "energy-a-10";
        if (classe === "A") return "energy-a";
        if (classe === "B") return "energy-b";
        if (classe === "D") return "energy-d";
        return "";
    }

    toggleCompare(modelId) {
        const index = this.compareList.indexOf(modelId);
        
        if (index > -1) {
            this.compareList.splice(index, 1);
        } else {
            if (this.compareList.length >= 4) {
                alert('Puoi confrontare massimo 4 modelli alla volta');
                return;
            }
            this.compareList.push(modelId);
        }
        
        this.updateCompareButton();
        this.renderProducts(); // Re-render to update button states
    }

    updateCompareButton() {
        const compareBtn = document.getElementById('compareView');
        compareBtn.innerHTML = `
            <i class="fas fa-columns"></i> 
            Confronta ${this.compareList.length > 0 ? `(${this.compareList.length})` : ''}
        `;
    }

    toggleComparePanel() {
        const panel = document.getElementById('comparePanel');
        
        if (this.compareList.length === 0) {
            alert('Seleziona almeno 2 modelli da confrontare');
            return;
        }
        
        if (panel.style.display === 'none' || !panel.style.display) {
            this.showComparePanel();
        } else {
            this.closeComparePanel();
        }
    }

    showComparePanel() {
        const panel = document.getElementById('comparePanel');
        const content = document.getElementById('compareContent');
        
        const compareModels = this.compareList.map(id => 
            washingMachinesDB.find(model => model.id === id)
        );
        
        content.innerHTML = this.renderCompareTable(compareModels);
        panel.style.display = 'block';
    }

    renderCompareTable(models) {
        if (models.length === 0) return '';
        
        const characteristics = [
            { key: 'marca', label: 'Marca' },
            { key: 'modello', label: 'Modello' },
            { key: 'serie', label: 'Serie' },
            { key: 'prezzo_range', label: 'Prezzo' },
            { key: 'capacita_kg', label: 'Capacità' },
            { key: 'classe_energetica', label: 'Classe Energetica' },
            { key: 'consumo_energia_kwh', label: 'Consumo (kWh/100)' },
            { key: 'centrifuga_max', label: 'Centrifuga (rpm)' },
            { key: 'rumorosita_db', label: 'Rumorosità (dB)' },
            { key: 'funzione_vapore', label: 'Funzione Vapore' },
            { key: 'wifi', label: 'WiFi' },
            { key: 'auto_dosaggio', label: 'Auto-dosaggio' },
            { key: 'innovazioni', label: 'Innovazioni' }
        ];
        
        let table = `
            <table class="compare-table">
                <thead>
                    <tr>
                        <th>Caratteristica</th>
                        ${models.map(model => `<th>${model.marca} ${model.modello}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
        `;
        
        characteristics.forEach(char => {
            table += `
                <tr>
                    <td class="char-label">${char.label}</td>
                    ${models.map(model => {
                        let value = model[char.key];
                        if (char.key === 'prezzo_range') {
                            value = `${model.prezzo_min}€ - ${model.prezzo_max}€`;
                        }
                        if (char.key === 'capacita_kg') {
                            value = `${value} kg`;
                        }
                        return `<td>${value || '-'}</td>`;
                    }).join('')}
                </tr>
            `;
        });
        
        table += `
                </tbody>
            </table>
            <div class="compare-actions">
                <button class="btn-export" onclick="app.exportCompare()">
                    <i class="fas fa-download"></i> Esporta PDF
                </button>
            </div>
        `;
        
        return table;
    }

    closeComparePanel() {
        document.getElementById('comparePanel').style.display = 'none';
    }

    resetAllFilters() {
        // Clear search
        document.getElementById('searchInput').value = '';
        
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            cb.checked = false;
        });
        
        // Reset sort
        document.getElementById('sortSelect').value = 'prezzo-asc';
        
        // Clear compare list
        this.compareList = [];
        this.updateCompareButton();
        
        // Apply filters (will show all products)
        this.applyFilters();
    }

    updateResultsCount() {
        const count = this.filteredModels.length;
        document.getElementById('resultsCount').textContent = 
            `${count} ${count === 1 ? 'modello trovato' : 'modelli trovati'}`;
    }

    exportCompare() {
        // Simple export functionality - in a real app you'd use a PDF library
        const compareModels = this.compareList.map(id => 
            washingMachinesDB.find(model => model.id === id)
        );
        
        let exportData = "CONFRONTO LAVATRICI\n";
        exportData += "=".repeat(50) + "\n\n";
        
        compareModels.forEach((model, index) => {
            exportData += `${index + 1}. ${model.marca} ${model.modello}\n`;
            exportData += `   Serie: ${model.serie}\n`;
            exportData += `   Prezzo: ${model.prezzo_min}€ - ${model.prezzo_max}€\n`;
            exportData += `   Capacità: ${model.capacita_kg}kg\n`;
            exportData += `   Classe: ${model.classe_energetica}\n`;
            exportData += `   Innovazioni: ${model.innovazioni}\n\n`;
        });
        
        // Create and download text file
        const blob = new Blob([exportData], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'confronto_lavatrici.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LavatriciFinder();
});