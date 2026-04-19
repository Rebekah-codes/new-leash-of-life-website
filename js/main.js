// ------------------------------
// LOAD REUSABLE COMPONENTS
// ------------------------------

async function loadComponent(id, file) {
    const element = document.getElementById(id);
    if (element) {
        try {
            const response = await fetch(`/components/${file}`);
            const html = await response.text();
            element.innerHTML = html;
        } catch (error) {
            console.error(`Error loading ${file}:`, error);
        }
    }
}

loadComponent("site-header", "header.html");
loadComponent("site-nav", "nav.html");
loadComponent("site-footer", "footer.html");


// ------------------------------
// SHOP PAGE LOGIC
// ------------------------------

function renderProducts(list) {
    const grid = document.getElementById("product-grid");
    if (!grid) return;

    grid.innerHTML = "";

    list.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">

            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">£${product.price.toFixed(2)}</p>
            </div>

            <a href="product.html?id=${product.id}" class="btn-secondary">View Details</a>
        `;

        grid.appendChild(card);
    });
}

function populateCategories() {
    const dropdown = document.getElementById("category-filter");
    if (!dropdown) return;

    const categories = getCategories();

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        dropdown.appendChild(option);
    });
}

function applyFilters() {
    let filtered = [...products];

    // Search
    const search = document.getElementById("search");
    if (search && search.value.trim() !== "") {
        const term = search.value.toLowerCase();
        filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }

    // Category
    const category = document.getElementById("category-filter");
    if (category && category.value !== "All") {
        filtered = filtered.filter(p => p.category === category.value);
    }

    // Sorting
    const sort = document.getElementById("sort-filter");
    if (sort) {
        if (sort.value === "price-asc") filtered.sort((a, b) => a.price - b.price);
        if (sort.value === "price-desc") filtered.sort((a, b) => b.price - a.price);
        if (sort.value === "name-asc") filtered.sort((a, b) => a.name.localeCompare(b.name));
        if (sort.value === "name-desc") filtered.sort((a, b) => b.name.localeCompare(a.name));
    }

    renderProducts(filtered);
}

function initShopPage() {
    if (!document.getElementById("product-grid")) return;

    populateCategories();
    renderProducts(products);

    document.getElementById("search").addEventListener("input", applyFilters);
    document.getElementById("category-filter").addEventListener("change", applyFilters);
    document.getElementById("sort-filter").addEventListener("change", applyFilters);
}

document.addEventListener("DOMContentLoaded", initShopPage);


// ------------------------------
// PRODUCT PAGE LOGIC
// ------------------------------

function initProductPage() {
    const container = document.getElementById("product-details");
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));

    const product = products.find(p => p.id === id);

    if (!product) {
        container.innerHTML = "<p>Product not found.</p>";
        return;
    }

    container.innerHTML = `
        <img src="${product.image}" alt="${product.name}">

        <div class="product-info-block">
            <h1>${product.name}</h1>
            <p class="product-price">£${product.price.toFixed(2)}</p>
            <p>${product.description}</p>

            <a href="/pages/shop.html" class="btn-secondary">Back to Shop</a>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", initProductPage);
