// App State
let currentData = [];
let compareList = [];
let currentView = 'grid';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const marcaFilter = document.getElementById('marcaFilter');
const capacitaFilter = document.getElementById('capacitaFilter');
const prezzoFilter = document.getElementById('prezzoFilter');
const classeFilter = document.getElementById('classeFilter');
const vaporeFilter = document.getElementById('vaporeFilter');
const wifiFilter = document.getElementById('wifiFilter');
const aiFilter = document.getElementById('aiFilter');
const autoDosaggioFilter = document.getElementById('autoDosaggioFilter');
const sortSelect = document.getElementById('sortSelect');
const resultsCount = document.getElementById('resultsCount');
const resultsGrid = document.getElementById('resultsGrid');
const compareSection = document.getElementById('compareSection');
const compareTable = document.getElementById('compareTable');
const clearFilters = document.getElementById('clearFilters');
const clearCompare = document.getElementById('clearCompare');
const gridView = document.getElementById('gridView');
const listView = document.getElementById('listView');

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    currentData = [...lavatriciDatabase];
    populateFilters();
    renderResults();
    bindEvents();
}

// Populate Filter Options
function populateFilters() {
    // Marca Filter
    const marche = [...new Set(currentData.map(item => item.marca))].sort();
    marcaFilter.innerHTML = '<option value="">Tutte le marche</option>';
    marche.forEach(marca => {
        const count = currentData.filter(item => item.marca === marca).length;
        marcaFilter.innerHTML += `<option value="${marca}">${marca} (${count})</option>`;
    });
}

// Event Listeners
function bindEvents() {
    // Search
    searchInput.addEventListener('input', debounce(handleSearch, 300));
    
    // Filters
    marcaFilter.addEventListener('change', applyFilters);
    capacitaFilter.addEventListener('change', applyFilters);
    prezzoFilter.addEventListener('change', applyFilters);
    classeFilter.addEventListener('change', applyFilters);
    vaporeFilter.addEventListener('change', applyFilters);
    wifiFilter.addEventListener('change', applyFilters);
    aiFilter.addEventListener('change', applyFilters);
    autoDosaggioFilter.addEventListener('change', applyFilters);
    
    // Sort
    sortSelect.addEventListener('change', handleSort);
    
    // View Toggle
    gridView.addEventListener('click', () => switchView('grid'));
    listView.addEventListener('click', () => switchView('list'));
    
    // Clear Actions
    clearFilters.addEventListener('click', clearAllFilters);
    clearCompare.addEventListener('click', clearComparison);
}

// Search Function
function handleSearch() {
    applyFilters();
}

// Apply All Filters
function applyFilters() {
    let filteredData = [...lavatriciDatabase];
    
    // Search Filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.marca.toLowerCase().includes(searchTerm) ||
            item.modello.toLowerCase().includes(searchTerm) ||
            item.serie.toLowerCase().includes(searchTerm) ||
            item.tecnologie_principali.some(tech => tech.toLowerCase().includes(searchTerm)) ||
            item.innovazioni.toLowerCase().includes(searchTerm) ||
            Object.values(item.programmi_dettaglio).some(prog => 
                prog.nome.toLowerCase().includes(searchTerm)
            )
        );
    }
    
    // Marca Filter
    if (marcaFilter.value) {
        filteredData = filteredData.filter(item => item.marca === marcaFilter.value);
    }
    
    // Capacità Filter
    if (capacitaFilter.value) {
        const [min, max] = getCapacityRange(capacitaFilter.value);
        filteredData = filteredData.filter(item => {
            const capacity = item.capacita_kg;
            if (max === Infinity) return capacity >= min;
            return capacity >= min && capacity <= max;
        });
    }
    
    // Prezzo Filter
    if (prezzoFilter.value) {
        const [min, max] = getPriceRange(prezzoFilter.value);
        filteredData = filteredData.filter(item => {
            const price = item.prezzo_min;
            if (max === Infinity) return price >= min;
            return price >= min && price <= max;
        });
    }
    
    // Classe Energetica Filter
    if (classeFilter.value) {
        filteredData = filteredData.filter(item => item.classe_energetica === classeFilter.value);
    }
    
    // Technology Filters
    if (vaporeFilter.checked) {
        filteredData = filteredData.filter(item => item.funzione_vapore === "Sì");
    }
    
    if (wifiFilter.checked) {
        filteredData = filteredData.filter(item => item.wifi === "Sì");
    }
    
    if (aiFilter.checked) {
        filteredData = filteredData.filter(item => item.ai === true);
    }
    
    if (autoDosaggioFilter.checked) {
        filteredData = filteredData.filter(item => 
            item.auto_dosaggio && !item.auto_dosaggio.includes("Non disponibile")
        );
    }
    
    currentData = filteredData;
    handleSort();
}

// Helper Functions for Filters
function getCapacityRange(value) {
    switch(value) {
        case '6-7': return [6, 7];
        case '8-9': return [8, 9];
        case '10-11': return [10, 11];
        case '12+': return [12, Infinity];
        default: return [0, Infinity];
    }
}

function getPriceRange(value) {
    switch(value) {
        case 'budget': return [0, 600];
        case 'medio': return [600, 1000];
        case 'premium': return [1000, 2000];
        case 'luxury': return [2000, Infinity];
        default: return [0, Infinity];
    }
}

// Sorting
function handleSort() {
    const sortValue = sortSelect.value;
    
    switch(sortValue) {
        case 'prezzo-asc':
            currentData.sort((a, b) => a.prezzo_min - b.prezzo_min);
            break;
        case 'prezzo-desc':
            currentData.sort((a, b) => b.prezzo_min - a.prezzo_min);
            break;
        case 'capacita-desc':
            currentData.sort((a, b) => b.capacita_kg - a.capacita_kg);
            break;
        case 'efficienza':
            currentData.sort((a, b) => {
                const getEfficiencyScore = (classe) => {
                    if (classe.includes('A-60%')) return 6;
                    if (classe.includes('A-40%')) return 5;
                    if (classe.includes('A-20%')) return 4;
                    if (classe.includes('A-10%')) return 3;
                    if (classe === 'A') return 2;
                    if (classe === 'B') return 1;
                    return 0;
                };
                return getEfficiencyScore(b.classe_energetica) - getEfficiencyScore(a.classe_energetica);
            });
            break;
        case 'marca':
            currentData.sort((a, b) => a.marca.localeCompare(b.marca));
            break;
    }
    
    renderResults();
}

// View Switching
function switchView(view) {
    currentView = view;
    gridView.classList.toggle('active', view === 'grid');
    listView.classList.toggle('active', view === 'list');
    resultsGrid.classList.toggle('list-view', view === 'list');
    renderResults();
}

// Render Results
function renderResults() {
    resultsCount.textContent = `${currentData.length} modelli trovati`;
    
    if (currentData.length === 0) {
        resultsGrid.innerHTML = `
            <div class="no-results">
                <h3>🔍 Nessun risultato trovato</h3>
                <p>Prova a modificare i filtri di ricerca</p>
            </div>
        `;
        return;
    }
    
    const html = currentData.map(item => createProductCard(item)).join('');
    resultsGrid.innerHTML = html;
    
    // Bind compare buttons
    document.querySelectorAll('.compare-btn').forEach(btn => {
        btn.addEventListener('click', handleCompare);
    });
}

// Create Product Card
function createProductCard(item) {
    const isComparing = compareList.some(comp => comp.id === item.id);
    const programmiSignature = getSignaturePrograms(item);
    
    return `
        <div class="product-card ${isComparing ? 'comparing' : ''}">
            <div class="card-header">
                <div class="brand-logo">${item.marca}</div>
                <h3 class="model-name">${item.modello}</h3>
                <div class="price-range">${item.prezzo_min}€ - ${item.prezzo_max}€</div>
            </div>
            
            <div class="card-body">
                <div class="specs-grid">
                    <div class="spec-item">
                        <span class="spec-label">Capacità</span>
                        <span class="spec-value">${item.capacita_kg} kg</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Classe Energetica</span>
                        <span class="spec-value">
                            <span class="energy-badge energy-${item.classe_energetica.replace(/[-%]/g, '-')}">${item.classe_energetica}</span>
                        </span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Centrifuga</span>
                        <span class="spec-value">${item.centrifuga_max} rpm</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Rumorosità</span>
                        <span class="spec-value">${item.rumorosita_db} dB</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Consumo</span>
                        <span class="spec-value">${item.consumo_energia_kwh} kWh/100</span>
                    </div>
                    <div class="spec-item">
                        <span class="spec-label">Tipo Carica</span>
                        <span class="spec-value">${item.tipo_carica}</span>
                    </div>
                </div>
                
                <div class="tech-tags">
                    ${item.funzione_vapore === "Sì" ? '<span class="tech-tag vapore">💨 Vapore</span>' : ''}
                    ${item.wifi === "Sì" ? '<span class="tech-tag wifi">📶 WiFi</span>' : ''}
                    ${item.ai ? '<span class="tech-tag ai">🤖 AI</span>' : ''}
                    ${item.auto_dosaggio && !item.auto_dosaggio.includes("Non disponibile") ? '<span class="tech-tag auto-dosaggio">⚗️ Auto-dosaggio</span>' : ''}
                </div>
                
                <div class="programs-section">
                    <div class="programs-summary">
                        ${item.numero_programmi_totali} programmi • ${item.durata_minima_minuti}-${item.durata_massima_minuti} min
                    </div>
                    <div class="program-highlights">
                        ${programmiSignature.map(prog => `<span class="program-tag">${prog}</span>`).join('')}
                    </div>
                </div>
                
                ${item.innovazioni ? `
                    <div class="innovations">
                        <small style="color: var(--text-light);">💎 ${item.innovazioni}</small>
                    </div>
                ` : ''}
            </div>
            
            <div class="card-actions">
                <button class="compare-btn ${isComparing ? 'active' : ''}" data-id="${item.id}">
                    ${isComparing ? '✓ In confronto' : '🔄 Confronta'}
                </button>
            </div>
        </div>
    `;
}

// Get Signature Programs
function getSignaturePrograms(item) {
    const programs = Object.values(item.programmi_dettaglio);
    const signature = [];
    
    // Find fastest program
    const fastest = programs.reduce((min, prog) => 
        prog.durata_minuti < min.durata_minuti ? prog : min
    );
    signature.push(`⚡ ${fastest.nome} (${fastest.durata_minuti}')`);
    
    // Find eco program
    const eco = programs.find(prog => prog.tipo === 'eco');
    if (eco) signature.push(`🌱 ${eco.nome}`);
    
    // Find vapor program if exists
    const vapor = programs.find(prog => prog.nome.toLowerCase().includes('vapor') || prog.nome.toLowerCase().includes('steam'));
    if (vapor) signature.push(`💨 ${vapor.nome}`);
    
    return signature.slice(0, 3);
}

// Compare Functionality
function handleCompare(e) {
    const id = parseInt(e.target.dataset.id);
    const item = lavatriciDatabase.find(item => item.id === id);
    
    if (compareList.some(comp => comp.id === id)) {
        // Remove from compare
        compareList = compareList.filter(comp => comp.id !== id);
    } else {
        // Add to compare (max 4)
        if (compareList.length < 4) {
            compareList.push(item);
        } else {
            alert('Puoi confrontare massimo 4 modelli alla volta');
            return;
        }
    }
    
    updateCompareSection();
    renderResults(); // Update button states
}

// Update Compare Section
function updateCompareSection() {
    if (compareList.length === 0) {
        compareSection.style.display = 'none';
        return;
    }
    
    compareSection.style.display = 'block';
    compareTable.innerHTML = createCompareTable();
}

// Create Compare Table
function createCompareTable() {
    if (compareList.length === 0) return '';
    
    const rows = [
        'Marca', 'Modello', 'Serie', 'Prezzo', 'Capacità', 'Classe Energetica', 
        'Consumo kWh', 'Centrifuga', 'Rumorosità', 'Vapore', 'WiFi', 'AI', 
        'Auto-dosaggio', 'Programmi Totali', 'Durata Min-Max', 'Innovazioni'
    ];
    
    let html = '<table class="compare-table"><thead><tr><th>Caratteristica</th>';
    compareList.forEach(item => {
        html += `<th>${item.marca}<br><strong>${item.modello}</strong></th>`;
    });
    html += '</tr></thead><tbody>';
    
    rows.forEach(row => {
        html += `<tr><td><strong>${row}</strong></td>`;
        compareList.forEach(item => {
            let value = '';
            switch(row) {
                case 'Marca': value = item.marca; break;
                case 'Modello': value = item.modello; break;
                case 'Serie': value = item.serie; break;
                case 'Prezzo': value = `${item.prezzo_min}€ - ${item.prezzo_max}€`; break;
                case 'Capacità': value = `${item.capacita_kg} kg`; break;
                case 'Classe Energetica': value = `<span class="energy-badge energy-${item.classe_energetica.replace(/[-%]/g, '-')}">${item.classe_energetica}</span>`; break;
                case 'Consumo kWh': value = `${item.consumo_energia_kwh} kWh/100`; break;
                case 'Centrifuga': value = `${item.centrifuga_max} rpm`; break;
                case 'Rumorosità': value = `${item.rumorosita_db} dB`; break;
                case 'Vapore': value = item.funzione_vapore; break;
                case 'WiFi': value = item.wifi; break;
                case 'AI': value = item.ai ? 'Sì' : 'No'; break;
                case 'Auto-dosaggio': value = item.auto_dosaggio; break;
                case 'Programmi Totali': value = item.numero_programmi_totali; break;
                case 'Durata Min-Max': value = `${item.durata_minima_minuti}-${item.durata_massima_minuti} min`; break;
                case 'Innovazioni': value = item.innovazioni || '-'; break;
            }
            html += `<td>${value}</td>`;
        });
        html += '</tr>';
    });
    
    html += '</tbody></table>';
    return html;
}

// Clear Functions
function clearAllFilters() {
    searchInput.value = '';
    marcaFilter.value = '';
    capacitaFilter.value = '';
    prezzoFilter.value = '';
    classeFilter.value = '';
    vaporeFilter.checked = false;
    wifiFilter.checked = false;
    aiFilter.checked = false;
    autoDosaggioFilter.checked = false;
    sortSelect.value = 'prezzo-asc';
    
    currentData = [...lavatriciDatabase];
    renderResults();
}

function clearComparison() {
    compareList = [];
    updateCompareSection();
    renderResults();
}

// Utility Functions
function debounce(func, wait) {
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

// Initialize filters and render on load
window.addEventListener('load', () => {
    applyFilters();
});
