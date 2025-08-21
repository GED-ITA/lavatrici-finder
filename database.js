// Database completo con 42 modelli di lavatrici - Versione campione (primi 10 modelli)
const washingMachinesDB = [
    {
        id: 1,
        marca: "Miele",
        modello: "WEK375 WPS",
        serie: "W1 ChromeEdition",
        capacita_kg: 10,
        classe_energetica: "A",
        prezzo_min: 1600,
        prezzo_max: 1800,
        tipo_carica: "Frontale",
        funzione_vapore: "Sì",
        wifi: "Sì",
        auto_dosaggio: "Sì (TwinDos)",
        ai: false,
        centrifuga_max: 1400,
        consumo_energia_kwh: 41,
        rumorosita_db: 72,
        tecnologie_principali: ["TwinDos", "Steam", "CapDosing", "SoftSteam"],
        dimensioni: "596x850x636",
        colore: "ChromeEdition",
        garanzia_anni: 2,
        paese_produzione: "Germania",
        innovazioni: "TwinDos UltraPhase, Steam finale ciclo"
    },
    {
        id: 2,
        marca: "Bosch",
        modello: "WGB254A1IT",
        serie: "Serie 8",
        capacita_kg: 10,
        classe_energetica: "A-40%",
        prezzo_min: 1200,
        prezzo_max: 1400,
        tipo_carica: "Frontale",
        funzione_vapore: "Sì",
        wifi: "Sì",
        auto_dosaggio: "Sì (i-DOS)",
        ai: true,
        centrifuga_max: 1400,
        consumo_energia_kwh: 32,
        rumorosita_db: 71,
        tecnologie_principali: ["i-DOS", "AI ActiveWater", "EcoSilence Drive", "AntiVibration"],
        dimensioni: "598x848x590",
        colore: "Bianco",
        garanzia_anni: 2,
        paese_produzione: "Germania",
        innovazioni: "i-DOS automatico, AI ActiveWater Plus"
    },
    {
        id: 3,
        marca: "LG",
        modello: "F4X9009TWCE",
        serie: "Next AI DD 2025",
        capacita_kg: 9,
        classe_energetica: "A-60%",
        prezzo_min: 1300,
        prezzo_max: 1500,
        tipo_carica: "Frontale",
        funzione_vapore: "Sì",
        wifi: "Sì",
        auto_dosaggio: "Sì (Auto Dispenser)",
        ai: true,
        centrifuga_max: 1400,
        consumo_energia_kwh: 20,
        rumorosita_db: 72,
        tecnologie_principali: ["AI DD", "TurboWash", "Steam+", "ThinQ AI"],
        dimensioni: "600x850x560",
        colore: "Bianco con pannello nero",
        garanzia_anni: 2,
        paese_produzione: "Corea del Sud",
        innovazioni: "A-60% record, AI DD 2025, 20 kWh/100 cicli"
    },
    {
        id: 4,
        marca: "AEG",
        modello: "LR9H94GBS",
        serie: "Serie 9000 AbsoluteCare",
        capacita_kg: 9,
        classe_energetica: "A",
        prezzo_min: 1200,
        prezzo_max: 1500,
        tipo_carica: "Frontale",
        funzione_vapore: "Sì",
        wifi: "Sì",
        auto_dosaggio: "No",
        ai: false,
        centrifuga_max: 1400,
        consumo_energia_kwh: 35,
        rumorosita_db: 72,
        tecnologie_principali: ["SoftWater", "AbsoluteCare", "PowerCare", "My AEG Care"],
        dimensioni: "597x847x631",
        colore: "Bianco con pannello nero premium",
        garanzia_anni: 2,
        paese_produzione: "Italia",
        innovazioni: "SoftWater unica al mondo, filtra minerali dannosi"
    },
    {
        id: 5,
        marca: "Electrolux",
        modello: "EW10F8946GCY",
        serie: "Serie 900 UltraCare",
        capacita_kg: 10,
        classe_energetica: "A",
        prezzo_min: 1100,
        prezzo_max: 1400,
        tipo_carica: "Frontale",
        funzione_vapore: "Sì",
        wifi: "Sì",
        auto_dosaggio: "Sì (AutoDose)",
        ai: false,
        centrifuga_max: 1600,
        consumo_energia_kwh: 42,
        rumorosita_db: 76,
        tecnologie_principali: ["SoftWater", "AbsoluteCare", "AutoDose", "PowerClean"],
        dimensioni: "596x847x636",
        colore: "Bianco con pannello grigio",
        garanzia_anni: 2,
        paese_produzione: "Italia",
        innovazioni: "SoftWater 30°C = 60°C efficacia"
    },
    {
        id: 6,
        marca: "Beko",
        modello: "WTY91436SI",
        serie: "SteamCure Premium",
        capacita_kg: 9,
        classe_energetica: "A",
        prezzo_min: 750,
        prezzo_max: 950,
        tipo_carica: "Frontale",
        funzione_vapore: "Sì",
        wifi: "No",
        auto_dosaggio: "No",
        ai: false,
        centrifuga_max: 1400,
        consumo_energia_kwh: 47,
        rumorosita_db: 75,
        tecnologie_principali: ["SteamCure 3-in-1", "AquaWave", "StainExpert", "Pet Hair Removal"],
        dimensioni: "600x845x540",
        colore: "Bianco",
        garanzia_anni: 2,
        paese_produzione: "Turchia",
        innovazioni: "SteamCure 3-in-1: antibatterico + antimacchia + antipiega"
    },
    {
        id: 7,
        marca: "ASKO",
        modello: "W6098X.W/2",
        serie: "Style Series",
        capacita_kg: 9,
        classe_energetica: "A",
        prezzo_min: 2500,
        prezzo_max: 3000,
        tipo_carica: "Frontale",
        funzione_vapore: "Sì",
        wifi: "Sì",
        auto_dosaggio: "No",
        ai: false,
        centrifuga_max: 1800,
        consumo_energia_kwh: 48,
        rumorosita_db: 68,
        tecnologie_principali: ["Steel Seal", "Quattro Construction", "ActiveDrum", "Pro Wash"],
        dimensioni: "595x850x600",
        colore: "Bianco",
        garanzia_anni: 5,
        paese_produzione: "Svezia",
        innovazioni: "Steel Seal: porta senza guarnizioni, durata 20 anni"
    },
    {
        id: 8,
        marca: "Haier",
        modello: "HW110-BD14397U1",
        serie: "X Serie 11",
        capacita_kg: 11,
        classe_energetica: "A-40%",
        prezzo_min: 1200,
        prezzo_max: 1500,
        tipo_carica: "Frontale",
        funzione_vapore: "Sì",
        wifi: "Sì",
        auto_dosaggio: "Sì (Smart Dosing)",
        ai: true,
        centrifuga_max: 1400,
        consumo_energia_kwh: 36,
        rumorosita_db: 70,
        tecnologie_principali: ["Ultra Fresh Air", "Smart Dosing", "AI Dynamic Balance", "Pillow Drum"],
        dimensioni: "600x680x850",
        colore: "Bianco",
        garanzia_anni: 2,
        paese_produzione: "Cina",
        innovazioni: "Ultra Fresh Air: 12h freschezza post-lavaggio"
    },
    {
        id: 9,
        marca: "Hisense",
        modello: "WF7S1247BB",
        serie: "Serie 7S AI",
        capacita_kg: 12,
        classe_energetica: "A-20%",
        prezzo_min: 900,
        prezzo_max: 1200,
        tipo_carica: "Frontale",
        funzione_vapore: "Sì",
        wifi: "Sì",
        auto_dosaggio: "Sì (Smart Dosing)",
        ai: true,
        centrifuga_max: 1400,
        consumo_energia_kwh: 43,
        rumorosita_db: 70,
        tecnologie_principali: ["Super AI 7 sensori", "Pure Steam", "Hygiene Guard+", "TFT Touch 6.86'"],
        dimensioni: "595x640x845",
        colore: "Nero",
        garanzia_anni: 2,
        paese_produzione: "Cina",
        innovazioni: "Super AI 7 sensori: lavaggio perfetto automatico"
    },
    {
        id: 10,
        marca: "Electrolux",
        modello: "EW6S526W",
        serie: "PerfectCare 600 Slim",
        capacita_kg: 6,
        classe_energetica: "B",
        prezzo_min: 390,
        prezzo_max: 550,
        tipo_carica: "Frontale Slim",
        funzione_vapore: "Sì",
        wifi: "No",
        auto_dosaggio: "No",
        ai: false,
        centrifuga_max: 1200,
        consumo_energia_kwh: 48,
        rumorosita_db: 74,
        tecnologie_principali: ["SensiCare", "Design Slim 37.8cm", "Rapido 20min"],
        dimensioni: "595x843x378",
        colore: "Bianco",
        garanzia_anni: 2,
        paese_produzione: "Europa",
        innovazioni: "37.8cm profondità: unica ultra-slim per spazi ristretti"
    }
];

// Funzioni helper per i filtri
function getCapacityRange(kg) {
    if (kg <= 7) return "6-7";
    if (kg <= 9) return "8-9";
    if (kg <= 11) return "10-11";
    return "12+";
}

function getPriceCategory(min, max) {
    const avgPrice = (min + max) / 2;
    if (avgPrice <= 600) return "budget";
    if (avgPrice <= 1000) return "medio";
    if (avgPrice <= 2000) return "premium";
    return "luxury";
}

function getEnergyClass(classe) {
    if (classe.includes("A-60%") || classe.includes("A-40%")) return "A-60%,A-40%";
    if (classe.includes("A-20%") || classe.includes("A-10%")) return "A-20%,A-10%";
    return classe;
}

function getLoadType(tipo) {
    if (tipo.includes("Slim")) return "slim";
    if (tipo.includes("Alto")) return "top-loading";
    if (tipo.includes("Lavasciuga")) return "lavasciuga";
    return "frontale";
}

// Funzioni di ricerca e filtraggio
function searchInModel(model, query) {
    const searchFields = [
        model.marca,
        model.modello,
        model.serie,
        model.tecnologie_principali.join(" "),
        model.innovazioni,
        `${model.capacita_kg}kg`,
        model.classe_energetica
    ].join(" ").toLowerCase();
    
    return searchFields.includes(query.toLowerCase());
}

function matchesFilters(model, filters) {
    // Brand filter
    if (filters.brands.length > 0 && !filters.brands.includes(model.marca)) {
        return false;
    }
    
    // Capacity filter
    if (filters.capacities.length > 0) {
        const modelCapacity = getCapacityRange(model.capacita_kg);
        if (!filters.capacities.includes(modelCapacity)) {
            return false;
        }
    }
    
    // Energy class filter
    if (filters.energyClasses.length > 0) {
        const modelEnergy = getEnergyClass(model.classe_energetica);
        const matches = filters.energyClasses.some(filter => {
            return filter.split(",").some(energy => modelEnergy.includes(energy));
        });
        if (!matches) {
            return false;
        }
    }
    
    // Price filter
    if (filters.prices.length > 0) {
        const modelPrice = getPriceCategory(model.prezzo_min, model.prezzo_max);
        if (!filters.prices.includes(modelPrice)) {
            return false;
        }
    }
    
    // Technology filters
    if (filters.technologies.length > 0) {
        const hasVapore = filters.technologies.includes("vapore") && model.funzione_vapore === "Sì";
        const hasWifi = filters.technologies.includes("wifi") && model.wifi === "Sì";
        const hasAutoDose = filters.technologies.includes("auto-dosaggio") && model.auto_dosaggio !== "No";
        const hasAI = filters.technologies.includes("ai") && model.ai === true;
        
        const techMatches = [];
        if (filters.technologies.includes("vapore")) techMatches.push(hasVapore);
        if (filters.technologies.includes("wifi")) techMatches.push(hasWifi);
        if (filters.technologies.includes("auto-dosaggio")) techMatches.push(hasAutoDose);
        if (filters.technologies.includes("ai")) techMatches.push(hasAI);
        
        if (!techMatches.some(match => match)) {
            return false;
        }
    }
    
    // Type filter
    if (filters.types.length > 0) {
        const modelType = getLoadType(model.tipo_carica);
        if (!filters.types.includes(modelType)) {
            return false;
        }
    }
    
    return true;
}

// Export per uso in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { washingMachinesDB, searchInModel, matchesFilters, getCapacityRange, getPriceCategory, getEnergyClass, getLoadType };
}