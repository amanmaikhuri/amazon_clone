// Helper function to select elements with error handling
const $ = (selector, err) => {
    const el = document.querySelector(selector);
    if (!el && err !== false) {
        console.error(err || `Missing element: ${selector}`);
    }
    return el;
};

const dom = {
    logo: $(".nav_logo"),
    boxSection: $(".boxsection"),
    back2top: $(".back2top"),
    navLogo: $(".nav_logo"),
    toggle: $(".toggle"),
    body: $("body"),
    heroSection: $(".herosection"),
    search: $(".search")
};

let data = []; // Global data array to store fetched product data

// Toggle between dark and light theme
function switchMode() {
    if (dom.body.classList.contains("darkmode")) {
        dom.body.classList.replace("darkmode", "lightmode");
        saveToLocalStorage("mode", "lightmode");
        console.log("Switched to light mode");
    } else {
        dom.body.classList.replace("lightmode", "darkmode");
        saveToLocalStorage("mode", "darkmode");
        console.log("Switched to dark mode");
    }
}

// Add event listeners
function addEvents() {
    if (dom.logo) {
        dom.logo.addEventListener("click", redirectToAmazon);
    }
    if (dom.back2top) {
        dom.back2top.addEventListener("click", back2Top);
    }
    if (dom.toggle) {
        dom.toggle.addEventListener("click", switchMode);
    }
    if (dom.search) {
        dom.search.addEventListener("input", (e) => {
            const searchText = e.target.value.toLowerCase();
            const filteredCategory= data.filter(product =>
                product.category.toLowerCase().includes(searchText) ||
                (product.product1 && product.product1.toLowerCase().includes(searchText)) ||
                (product.product2 && product.product2.toLowerCase().includes(searchText)) ||
                (product.product3 && product.product3.toLowerCase().includes(searchText)) ||
                (product.product4 && product.product4.toLowerCase().includes(searchText))
            );

            dom.boxSection.innerHTML = "<p>Loading...</p>";

            renderCards(filteredCategory);
        });
    }

    if(dom.heroSection) dom.heroSection.addEventListener("click",redirectToAmazon);
}

// Redirect to Amazon
function redirectToAmazon() {
    window.location.href = "https://www.amazon.in/deals?ref_=nav_cs_gb";
}

function back2Top() {
    window.location.href = "#main";
}

// Fetch product data from the JSON file
async function fetchProductData() {
    try {
        const res = await fetch("products.json");
        if (!res.ok) throw new Error('Failed to load product data');
        data = await res.json(); // Store in global variable
        renderCards(data);
    } catch (err) {
        console.error("Error fetching data: ", err.message);
    }
}

// Render product cards dynamically
function renderCards(products) {
    if (!Array.isArray(products) || products.length === 0) {
        dom.boxSection.innerHTML = `<p>No products found.</p>`;
        return;
    }

    dom.boxSection.innerHTML = "";

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("box");

        productCard.innerHTML = `
        <h2>${product.category || 'Unknown Category'}</h2>
        <div class="subbox">
            <img src="${product.image1}" alt="${product.product1 || 'Product 1'}" loading="lazy">
            ${product.product1 || 'Product 1'}
        </div>
        <div class="subbox">
            <img src="${product.image2}" alt="${product.product2 || 'Product 2'}" loading="lazy">
            ${product.product2 || 'Product 2'}
        </div>
        <div class="subbox">
            <img src="${product.image3}" alt="${product.product3 || 'Product 3'}" loading="lazy">
            ${product.product3 || 'Product 3'}
        </div>
        <div class="subbox">
            <img src="${product.image4}" alt="${product.product4 || 'Product 4'}" loading="lazy">
            ${product.product4 || 'Product 4'}
        </div>
        <p>${product["link-text"] || 'No description available'}</p>`;

        dom.boxSection.appendChild(productCard);
    });
}

// Utilities
function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Initialize the app
function init() {
    addEvents();
    fetchProductData();
    console.log("App initialized");
    console.log(dom.boxSection);
}

document.addEventListener("DOMContentLoaded", init);
