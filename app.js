// MDM Calci - State & Logic

// 1. DEFAULT DATA SCHEMAS
const DEFAULTS = {
    schoolName: "शिवछत्रपती माध्यमिक विद्यालय रणखांब",
    suppDay: "बुधवार",
    language: "mr",
    theme: "light",
    
    ingredients: [
        { id: "rice", name: "तांदूळ", nameEn: "Rice", rate1to5: 0.100, rate6to8: 0.150, unit: "kg" },
        { id: "dal1", name: "डाळ", nameEn: "Pulses", rate1to5: 0.02, rate6to8: 0.03, unit: "kg" },
        { id: "cumin", name: "जिरे", nameEn: "Cumin Seeds", rate1to5: 0.00015, rate6to8: 0.0002, unit: "kg" },
        { id: "mustard", name: "मोहरी", nameEn: "Mustard Seeds", rate1to5: 0.0002, rate6to8: 0.0003, unit: "kg" },
        { id: "turmeric", name: "हळद", nameEn: "Turmeric", rate1to5: 0.0002, rate6to8: 0.0003, unit: "kg" },
        { id: "chili", name: "तिखट", nameEn: "Chili Powder", rate1to5: 0.0015, rate6to8: 0.0022, unit: "kg" },
        { id: "oil", name: "तेल", nameEn: "Cooking Oil", rate1to5: 0.005, rate6to8: 0.0075, unit: "kg" },
        { id: "salt", name: "मीठ", nameEn: "Salt", rate1to5: 0.0015, rate6to8: 0.002, unit: "kg" },
        { id: "dal2", name: "डाळ", nameEn: "Additional Pulses", rate1to5: 0.01, rate6to8: 0.015, unit: "kg" },
        { id: "veggies", name: "भाजीपाला", nameEn: "Vegetables (Cost)", rate1to5: 0.72, rate6to8: 1.14, unit: "Rs" },
        { id: "supp_diet", name: "पूरक आहार", nameEn: "Supp. Diet (Cost)", rate1to5: 0.53, rate6to8: 0.82, unit: "Rs" },
        { id: "fuel", name: "इंधन खर्च", nameEn: "Fuel Cost", rate1to5: 0.64, rate6to8: 0.88, unit: "Rs" },
        { id: "total_cost", name: "एकूण खर्च", nameEn: "Total Cost", rate1to5: 2.08, rate6to8: 3.11, unit: "Rs" },
        { id: "custom1", name: "NA", nameEn: "NA", rate1to5: 0.0, rate6to8: 0.0, unit: "kg" }
    ],
    
    weeklyMenu: [
        { id: "mon", day: "सोमवार", dayEn: "Monday", menu: "मसुरी पुलाव", menuEn: "Masoor Pulao" },
        { id: "tue", day: "मंगळवार", dayEn: "Tuesday", menu: "मूग शेवगा वरण-भात", menuEn: "Moong Drumstick Varan-Rice" },
        { id: "wed", day: "बुधवार", dayEn: "Wednesday", menu: "सोयाबीन पुलाव", menuEn: "Soyabean Pulao" },
        { id: "thu", day: "गुरुवार", dayEn: "Thursday", menu: "मोड आलेली मटकी उसळ भात", menuEn: "Sprouted Usal Rice" },
        { id: "fri", day: "शुक्रवार", dayEn: "Friday", menu: "हरभरा/चना पुलाव", menuEn: "Chana Pulao" },
        { id: "sat", day: "शनिवार", dayEn: "Saturday", menu: "मटार पुलाव(वाटाणा)", menuEn: "Green Pea Pulao" }
    ],
    
    suppDiet: [
        { id: "w1", week: "पहिला", weekEn: "1st Week", diet: "फळे स्थानिक उपलब्धतेनुसार", dietEn: "Local Fruits" },
        { id: "w2", week: "दुसरा", weekEn: "2nd Week", diet: "शेंगदाणा लाडू / शेंगदाणा चिक्की", dietEn: "Peanut Laddu / Chikki" },
        { id: "w3", week: "तिसरा", weekEn: "3rd Week", diet: "राजगिरा लाडू / चिरमुरा लाडू", dietEn: "Rajgira / Puffed Rice Laddu" },
        { id: "w4", week: "चौथा", weekEn: "4th Week", diet: "खजूर / खारीक", dietEn: "Dates / Dry Dates" },
        { id: "w5", week: "पाचावा", weekEn: "5th Week", diet: "फळे स्थानिक उपलब्धतेनुसार", dietEn: "Local Fruits" }
    ]
};

// 2. ACTIVE STATE VARIABLES (LOADED ON START)
let state = {};

// 3. PAGE INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    loadState();
    setupEventListeners();
    applyTheme(state.theme);
    applyLanguage(state.language);
    renderAppContents();
    
    // Seed initial history state
    if (window.history && window.history.replaceState) {
        window.history.replaceState({ screen: "home" }, "", "#home");
    }
    navigateTo("home", false);
    
    registerServiceWorker();
});

// History popstate listener for back button mapping
window.addEventListener("popstate", (event) => {
    const screenId = (event.state && event.state.screen) || "home";
    navigateTo(screenId, false);
});

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(reg => console.log('Service Worker registered successfully with scope:', reg.scope))
                .catch(err => console.error('Service Worker registration failed:', err));
        });
    }
}

// Load state from local storage or set defaults
function loadState() {
    try {
        const stored = localStorage.getItem("mdm_calci_state");
        if (stored) {
            state = JSON.parse(stored);
            
            // Migration check: make sure dal2 is directly after salt
            if (state.ingredients && state.ingredients.length > 0) {
                const dal2Index = state.ingredients.findIndex(i => i.id === "dal2");
                const saltIndex = state.ingredients.findIndex(i => i.id === "salt");
                if (dal2Index !== -1 && saltIndex !== -1 && dal2Index > saltIndex + 1) {
                    const [dal2Item] = state.ingredients.splice(dal2Index, 1);
                    state.ingredients.splice(saltIndex + 1, 0, dal2Item);
                }
            }

            // Sync with default schema additions if any (migration support)
            if (!state.ingredients || state.ingredients.length === 0) state.ingredients = [...DEFAULTS.ingredients];
            if (!state.weeklyMenu) state.weeklyMenu = [...DEFAULTS.weeklyMenu];
            if (!state.suppDiet) state.suppDiet = [...DEFAULTS.suppDiet];
            if (!state.schoolName) state.schoolName = DEFAULTS.schoolName;
            if (!state.suppDay) state.suppDay = DEFAULTS.suppDay;
            if (!state.language) state.language = DEFAULTS.language;
            if (!state.theme) state.theme = DEFAULTS.theme;
        } else {
            // Seed defaults
            state = JSON.parse(JSON.stringify(DEFAULTS)); // deep copy
            saveStateToStorage();
        }
    } catch (e) {
        console.error("Error loading state from localStorage, loading defaults:", e);
        state = JSON.parse(JSON.stringify(DEFAULTS));
    }
}

function saveStateToStorage() {
    try {
        localStorage.setItem("mdm_calci_state", JSON.stringify(state));
    } catch (e) {
        console.error("Error saving state to localStorage:", e);
    }
}

function setupEventListeners() {
    // Back button (top left corner)
    document.getElementById("btn-back").addEventListener("click", () => {
        if (window.history && window.history.back) {
            window.history.back();
        } else {
            navigateTo("home");
        }
    });

    // Language Toggle
    document.getElementById("btn-lang").addEventListener("click", () => {
        const newLang = state.language === "mr" ? "en" : "mr";
        state.language = newLang;
        saveStateToStorage();
        applyLanguage(newLang);
        renderAppContents();
    });

    // Dark/Light Theme Toggle
    document.getElementById("btn-theme").addEventListener("click", () => {
        const newTheme = state.theme === "light" ? "dark" : "light";
        state.theme = newTheme;
        saveStateToStorage();
        applyTheme(newTheme);
    });
}

// 4. THEME & LANGUAGE MANAGEMENT
function applyTheme(theme) {
    document.body.setAttribute("data-theme", theme);
    const sunIcon = document.getElementById("icon-sun");
    const moonIcon = document.getElementById("icon-moon");
    
    if (theme === "dark") {
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
    } else {
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
    }
}

function applyLanguage(lang) {
    document.documentElement.lang = lang;
    
    // Toggle label on lang button (shows what language to switch to next)
    const langBtnText = document.querySelector("#btn-lang .lang-text");
    langBtnText.textContent = lang === "mr" ? "EN" : "मराठी";

    // Set translation for all DOM elements with data-mr/data-en attributes
    document.querySelectorAll("[data-mr]").forEach(el => {
        const text = lang === "mr" ? el.getAttribute("data-mr") : el.getAttribute("data-en");
        if (text) {
            // Check if it's an input or placeholder
            if (el.tagName === "INPUT" && el.hasAttribute("placeholder")) {
                el.placeholder = text;
            } else {
                el.textContent = text;
            }
        }
    });

    // Handle conditional fonts/classes based on language selection
    const container = document.querySelector(".app-container");
    if (lang === "en") {
        container.classList.remove("lang-mr");
        container.classList.add("lang-en");
    } else {
        container.classList.remove("lang-en");
        container.classList.add("lang-mr");
    }
}

// 5. SCREEN NAVIGATION
function navigateTo(screenId, push = true) {
    // Push browser state to history if requested
    if (push && window.history && window.history.pushState) {
        window.history.pushState({ screen: screenId }, "", `#${screenId}`);
    }

    // Hide all screens
    document.querySelectorAll(".app-screen").forEach(screen => {
        screen.classList.remove("active");
    });

    // Show selected screen
    const targetScreen = document.getElementById(`screen-${screenId}`);
    if (targetScreen) {
        targetScreen.classList.add("active");
    }

    // Toggle Back button visibility
    const backBtn = document.getElementById("btn-back");
    if (screenId === "home") {
        backBtn.classList.remove("visible");
    } else {
        backBtn.classList.add("visible");
    }

    // Customize Header Titles according to current Screen & Language
    const headerTitle = document.getElementById("txt-header-title");
    if (screenId === "home") {
        headerTitle.textContent = "MDM Calci";
    } else if (screenId === "calc-primary") {
        headerTitle.textContent = state.language === "mr" ? "१ ते ५ आहार" : "1 to 5 Diet";
    } else if (screenId === "calc-upper") {
        headerTitle.textContent = state.language === "mr" ? "६ ते ८ आहार" : "6 to 8 Diet";
    } else if (screenId === "recipes") {
        headerTitle.textContent = state.language === "mr" ? "पाककृती" : "Recipes & Menu";
    } else if (screenId === "bmi") {
        headerTitle.textContent = "BMI Calculator";
    } else if (screenId === "settings") {
        headerTitle.textContent = state.language === "mr" ? "सेटिंग्ज" : "Settings";
    } else if (screenId === "help") {
        headerTitle.textContent = state.language === "mr" ? "मदत व सूचना" : "Help & Docs";
    } else if (screenId === "about") {
        headerTitle.textContent = state.language === "mr" ? "आमच्याविषयी" : "About Us";
    }

    // Perform specific render tasks for pages when navigating to them
    if (screenId === "recipes") {
        renderRecipesPage();
    } else if (screenId === "settings") {
        renderSettingsForm();
    }
}

// 6. RENDER DYNAMIC PAGES CONTENTS
function renderAppContents() {
    // Render school name banner
    document.getElementById("school-banner").textContent = state.schoolName;

    // Render calculator blank states
    resetCalculatorTables();
}

function resetCalculatorTables() {
    renderCalculatorTable("primary", 0);
    renderCalculatorTable("upper", 0);
}

// 7. MDM CALCULATIONS LOGIC
function calculateMDM(type) {
    const inputEl = document.getElementById(`plates-${type}`);
    const plates = parseInt(inputEl.value);
    
    if (isNaN(plates) || plates < 0) {
        showToast(state.language === "mr" ? "कृपया योग्य विद्यार्थी संख्या प्रविष्ट करा!" : "Please enter a valid number of students!");
        return;
    }
    
    renderCalculatorTable(type, plates);
    showToast(state.language === "mr" ? "गणन पूर्ण झाले!" : "Calculated successfully!");
}

function formatWeightValue(value) {
    if (value === 0) {
        return `0 ${state.language === "mr" ? "ग्रॅम" : "g"}`;
    }
    if (value < 1) {
        const grams = value * 1000;
        // round to 2 decimals for precision, e.g. 0.15g
        const formatted = parseFloat(grams.toFixed(2)).toString();
        return `${formatted} ${state.language === "mr" ? "ग्रॅम" : "g"}`;
    } else {
        const formatted = parseFloat(value.toFixed(3)).toString();
        return `${formatted} ${state.language === "mr" ? "कि.ग्रॅ." : "kg"}`;
    }
}

// Helper formatters
function formatCost(value) {
    return parseFloat(value.toFixed(2)).toLocaleString(state.language === "mr" ? "en-IN" : "en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatGram(value) {
    return parseFloat(value.toFixed(2)).toLocaleString(state.language === "mr" ? "en-IN" : "en-US", {
        maximumFractionDigits: 2
    });
}

function renderCalculatorTable(type, plates) {
    const tbody = document.getElementById(`table-body-${type}`);
    tbody.innerHTML = "";
    
    let totalCostVal = 0;
    
    state.ingredients.forEach(item => {
        // Skip hidden/deleted items (marked as NA)
        if (item.name === "NA" || item.name.trim() === "") return;
        
        const rate = type === "primary" ? item.rate1to5 : item.rate6to8;
        const total = plates * rate;
        
        if (item.id === "total_cost") {
            totalCostVal = total;
            return; // Skip rendering Total Cost as a normal row inside the table
        }
        
        let valKgOrCost = "";
        let valGm = "";
        let valRate = "";
        
        if (item.unit === "Rs") {
            const unitText = state.language === "mr" ? "रु." : "Rs";
            valKgOrCost = `${unitText} ${formatCost(total)}`;
            valGm = "-";
            valRate = `${unitText} ${formatCost(rate)}`;
        } else {
            // Formatting weight in kg (Column 2) - strictly numeric
            valKgOrCost = parseFloat(total.toFixed(5)).toString();
            
            // Formatting weight in grams (Column 3) - strictly numeric with comma separator
            valGm = formatGram(total * 1000);
            
            // Formatting rate (Column 4) - strictly numeric (standard rate in kg/student)
            valRate = parseFloat(rate.toFixed(5)).toString();
        }
        
        const tr = document.createElement("tr");
        if (item.id === "dal2") {
            tr.classList.add("section-divider-row");
        }
        
        // 1. Details/Name
        const tdName = document.createElement("td");
        tdName.textContent = item.name;
        
        // 2. Weight (kg) / Cost
        const tdKg = document.createElement("td");
        tdKg.className = "weight-cell";
        tdKg.textContent = valKgOrCost;
        
        // 3. Weight (g)
        const tdGm = document.createElement("td");
        tdGm.className = "weight-cell";
        tdGm.textContent = valGm;
        
        // 4. Rate/Scale
        const tdRate = document.createElement("td");
        tdRate.className = "rate-cell";
        tdRate.textContent = valRate;
        
        tr.appendChild(tdName);
        tr.appendChild(tdKg);
        tr.appendChild(tdGm);
        tr.appendChild(tdRate);
        
        tbody.appendChild(tr);
    });
    
    // Update the dedicated total box
    const totalValEl = document.getElementById(`total-val-${type}`);
    if (totalValEl) {
        const unitText = state.language === "mr" ? "रु." : "Rs";
        totalValEl.textContent = `${unitText} ${formatCost(totalCostVal)}`;
    }
}

// 8. RENDER RECIPES SCREEN TABLES
function renderRecipesPage() {
    // 1. Weekly Menu Table
    const recipeBody = document.getElementById("recipe-list-body");
    recipeBody.innerHTML = "";
    
    state.weeklyMenu.forEach((item, index) => {
        const tr = document.createElement("tr");
        
        const tdNum = document.createElement("td");
        tdNum.textContent = `${index + 1}.`;
        
        const tdDay = document.createElement("td");
        tdDay.textContent = state.language === "mr" ? item.day : item.dayEn;
        
        const tdMenu = document.createElement("td");
        tdMenu.textContent = item.menu;
        
        tr.appendChild(tdNum);
        tr.appendChild(tdDay);
        tr.appendChild(tdMenu);
        recipeBody.appendChild(tr);
    });

    // 2. Supplementary Diet Table
    const suppDayTitle = document.getElementById("supp-day-title");
    const thSuppDay = document.getElementById("th-supp-day");
    
    if (state.language === "mr") {
        suppDayTitle.textContent = `${state.suppDay} पूरक आहार प्रकार`;
        thSuppDay.textContent = state.suppDay;
    } else {
        // Translate day to English if matching standard days
        const englishDays = {
            "सोमवार": "Monday", "मंगळवार": "Tuesday", "बुधवार": "Wednesday",
            "गुरुवार": "Thursday", "शुक्रवार": "Friday", "शनिवार": "Saturday"
        };
        const mappedDay = englishDays[state.suppDay] || state.suppDay;
        suppDayTitle.textContent = `${mappedDay} - Supplementary Diet Schedule`;
        thSuppDay.textContent = mappedDay;
    }

    const suppBody = document.getElementById("supp-diet-body");
    suppBody.innerHTML = "";
    
    state.suppDiet.forEach((item, index) => {
        const tr = document.createElement("tr");
        
        const tdNum = document.createElement("td");
        tdNum.textContent = `${index + 1}.`;
        
        const tdWeek = document.createElement("td");
        tdWeek.textContent = state.language === "mr" ? item.week : item.weekEn;
        
        const tdDiet = document.createElement("td");
        tdDiet.textContent = item.diet;
        
        tr.appendChild(tdNum);
        tr.appendChild(tdWeek);
        tr.appendChild(tdDiet);
        suppBody.appendChild(tr);
    });
}

// 9. TAB SWITCHING LOGIC (used in Recipes page & Settings page)
function switchTab(btn, paneId) {
    // Deactivate siblings buttons
    const tabContainer = btn.parentElement;
    tabContainer.querySelectorAll(".tab-btn").forEach(b => {
        b.classList.remove("active");
    });
    
    // Activate this button
    btn.classList.add("active");
    
    // Hide all sibling pane content
    const activePane = document.getElementById(paneId);
    const parentContainer = activePane.parentElement;
    parentContainer.querySelectorAll(".tab-pane").forEach(pane => {
        pane.classList.remove("active");
    });
    
    // Show active pane
    activePane.classList.add("active");
}

// 10. BMI CALCULATOR LOGIC
function calculateBMI() {
    const weightEl = document.getElementById("bmi-weight");
    const heightEl = document.getElementById("bmi-height");
    
    const weight = parseFloat(weightEl.value);
    const height = parseFloat(heightEl.value);
    
    if (isNaN(weight) || weight <= 0 || isNaN(height) || height <= 0) {
        showToast(state.language === "mr" ? "कृपया वजन आणि उंचीचे योग्य मूल्य प्रविष्ट करा!" : "Please enter valid weight and height values!");
        return;
    }
    
    // Formula: Weight (kg) / Height (m)^2
    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    
    const bmiValEl = document.getElementById("bmi-val");
    const bmiStatusEl = document.getElementById("bmi-status");
    const resultCard = document.getElementById("bmi-result");
    
    bmiValEl.textContent = bmi.toFixed(1);
    
    // Classify and Highlight Row
    let statusMr = "";
    let statusEn = "";
    let cssClass = "";
    
    // Reset all standard table highlighting rows
    document.getElementById("bmi-row-under").className = "";
    document.getElementById("bmi-row-normal").className = "";
    document.getElementById("bmi-row-over").className = "";
    document.getElementById("bmi-row-obese").className = "";
    
    if (bmi < 18.5) {
        statusMr = "कमी वजन";
        statusEn = "Underweight";
        cssClass = "highlight-underweight";
        document.getElementById("bmi-row-under").className = cssClass;
    } else if (bmi >= 18.5 && bmi < 25) {
        statusMr = "सामान्य";
        statusEn = "Normal";
        cssClass = "highlight-normal";
        document.getElementById("bmi-row-normal").className = cssClass;
    } else if (bmi >= 25 && bmi < 30) {
        statusMr = "सामान्यापेक्षा जास्त वजन";
        statusEn = "Overweight";
        cssClass = "highlight-overweight";
        document.getElementById("bmi-row-over").className = cssClass;
    } else {
        statusMr = "स्थूल";
        statusEn = "Obese";
        cssClass = "highlight-obese";
        document.getElementById("bmi-row-obese").className = cssClass;
    }
    
    bmiStatusEl.textContent = state.language === "mr" ? statusMr : statusEn;
    resultCard.style.display = "block";
    
    // Smooth scroll down to result card
    resultCard.scrollIntoView({ behavior: 'smooth' });
}

// 11. SETTINGS VIEW MANAGEMENT & ACTIONS
function renderSettingsForm() {
    // 1. Ingredients list rates
    const listContainer = document.getElementById("settings-ingredients-list");
    listContainer.innerHTML = "";
    
    state.ingredients.forEach((item, index) => {
        const row = document.createElement("div");
        row.className = "settings-row";
        
        // Name input
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = item.name;
        nameInput.id = `set-ing-name-${index}`;
        nameInput.placeholder = "पदार्थाचे नाव";
        
        // Primary Rate input
        const ratePrimary = document.createElement("input");
        ratePrimary.type = "number";
        ratePrimary.step = "any";
        ratePrimary.value = item.rate1to5;
        ratePrimary.id = `set-ing-rate15-${index}`;
        
        // Upper Primary Rate input
        const rateUpper = document.createElement("input");
        rateUpper.type = "number";
        rateUpper.step = "any";
        rateUpper.value = item.rate6to8;
        rateUpper.id = `set-ing-rate68-${index}`;
        
        row.appendChild(nameInput);
        row.appendChild(ratePrimary);
        row.appendChild(rateUpper);
        listContainer.appendChild(row);
    });

    // 2. Weekly Menu List
    const menuContainer = document.getElementById("settings-menu-list");
    menuContainer.innerHTML = "";
    
    state.weeklyMenu.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "form-group";
        
        const label = document.createElement("label");
        label.className = "form-label";
        label.textContent = state.language === "mr" ? item.day : item.dayEn;
        
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-input";
        input.value = item.menu;
        input.id = `set-menu-${index}`;
        
        div.appendChild(label);
        div.appendChild(input);
        menuContainer.appendChild(div);
    });

    // 3. Wednesday Supplementary Diet List
    const suppContainer = document.getElementById("settings-supp-list");
    suppContainer.innerHTML = "";
    
    state.suppDiet.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "form-group";
        
        const label = document.createElement("label");
        label.className = "form-label";
        label.textContent = state.language === "mr" ? `${item.week} आठवडा` : `${item.weekEn} Week`;
        
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-input";
        input.value = item.diet;
        input.id = `set-supp-${index}`;
        
        div.appendChild(label);
        div.appendChild(input);
        suppContainer.appendChild(div);
    });

    // 4. General Settings Values
    document.getElementById("input-school-name").value = state.schoolName;
    document.getElementById("input-supp-day").value = state.suppDay;
}

function saveSettings() {
    // 1. Save Ingredients Rates
    state.ingredients.forEach((item, index) => {
        const nameVal = document.getElementById(`set-ing-name-${index}`).value.trim();
        const r15Val = parseFloat(document.getElementById(`set-ing-rate15-${index}`).value);
        const r68Val = parseFloat(document.getElementById(`set-ing-rate68-${index}`).value);
        
        item.name = nameVal;
        // In English, keep original item details if name is NA, or mirror the Marathi name
        if (nameVal === "NA") {
            item.nameEn = "NA";
        } else if (item.nameEn === "NA" || nameVal !== DEFAULTS.ingredients[index].name) {
            item.nameEn = nameVal; // fallback
        }
        item.rate1to5 = isNaN(r15Val) ? 0.0 : r15Val;
        item.rate6to8 = isNaN(r68Val) ? 0.0 : r68Val;
    });

    // 2. Save Weekly Recipes Menu
    state.weeklyMenu.forEach((item, index) => {
        const menuVal = document.getElementById(`set-menu-${index}`).value.trim();
        item.menu = menuVal;
        // Translate update fallback
        if (menuVal !== DEFAULTS.weeklyMenu[index].menu) {
            item.menuEn = menuVal;
        }
    });

    // 3. Save Supplementary Diet Menu
    state.suppDiet.forEach((item, index) => {
        const dietVal = document.getElementById(`set-supp-${index}`).value.trim();
        item.diet = dietVal;
        if (dietVal !== DEFAULTS.suppDiet[index].diet) {
            item.dietEn = dietVal;
        }
    });

    // 4. Save General Settings
    const schoolVal = document.getElementById("input-school-name").value.trim();
    const suppDayVal = document.getElementById("input-supp-day").value.trim();
    
    if (schoolVal) state.schoolName = schoolVal;
    if (suppDayVal) state.suppDay = suppDayVal;

    saveStateToStorage();
    renderAppContents();
    
    showToast(state.language === "mr" ? "सेटिंग्ज यशस्वीरित्या जतन केल्या!" : "Settings saved successfully!");
    navigateTo("home");
}

function restoreDefaultSettings() {
    if (confirm(state.language === "mr" ? "तुम्हाला खात्री आहे की मूळ सेटिंग्ज पुनर्संचयित करायच्या आहेत?" : "Are you sure you want to reset all settings to defaults?")) {
        // Overwrite active configurations with defaults
        const lang = state.language;
        const theme = state.theme;
        
        state = JSON.parse(JSON.stringify(DEFAULTS));
        state.language = lang; // preserve selected language
        state.theme = theme; // preserve selected theme
        
        saveStateToStorage();
        renderAppContents();
        renderSettingsForm();
        
        showToast(state.language === "mr" ? "मूळ सेटिंग्ज पुनर्संचयित केल्या!" : "Reset to defaults completed!");
    }
}

// 12. TOAST NOTIFICATIONS ACTIONS
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.classList.add("visible");
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove("visible");
    }, 2500);
}
