// ------------------------------
// LOAD REUSABLE COMPONENTS
// ------------------------------

function getComponentBasePath() {
  return window.location.pathname.includes("/pages/")
    ? "../components/"
    : "components/";
}

function resolveSitePath(path) {
  if (!path.startsWith("/")) {
    return path;
  }

  const prefix = window.location.pathname.includes("/pages/") ? "../" : "";
  return `${prefix}${path.slice(1)}`;
}

function normalizeComponentPaths(element) {
  element.querySelectorAll("[href], [src]").forEach((node) => {
    ["href", "src"].forEach((attribute) => {
      const value = node.getAttribute(attribute);
      if (value && value.startsWith("/")) {
        node.setAttribute(attribute, resolveSitePath(value));
      }
    });
  });
}

function updateStickyOffsets() {
  const header = document.getElementById("site-header");
  const headerHeight = header ? header.offsetHeight : 0;
  document.documentElement.style.setProperty(
    "--header-offset",
    `${headerHeight}px`,
  );
}

async function loadComponent(id, file) {
  const element = document.getElementById(id);
  if (element) {
    try {
      const response = await fetch(`${getComponentBasePath()}${file}`);
      const html = await response.text();
      element.innerHTML = html;
      normalizeComponentPaths(element);
      updateStickyOffsets();
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }
}

loadComponent("site-header", "header.html");
loadComponent("site-nav", "nav.html");
loadComponent("site-footer", "footer.html");

document.addEventListener("DOMContentLoaded", updateStickyOffsets);
window.addEventListener("resize", updateStickyOffsets);

// ------------------------------
// HOMEPAGE DATA
// ------------------------------

const homeBrands = [
  "KONG",
  "Rosewood",
  "Natures Menu",
  "Hurtta",
  "Ancol",
  "SportsPet",
];

const blogPosts = [
  {
    title: "How to Choose the Right Toy for Your Dog",
    date: "16 Apr 2026",
    url: "/pages/blog.html",
  },
  {
    title: "Spring Essentials for Active Pets",
    date: "14 Apr 2026",
    url: "/pages/blog.html",
  },
  {
    title: "Top Seller Roundup: What Pet Owners Love",
    date: "12 Apr 2026",
    url: "/pages/blog.html",
  },
];

function renderHomeBrands() {
  const grid = document.getElementById("brand-grid");
  if (!grid) return;

  grid.innerHTML = homeBrands
    .map((brand) => `<article class="brand-tile">${brand}</article>`)
    .join("");
}

function renderHomeDeals() {
  const grid = document.getElementById("top-deals-grid");
  if (!grid || typeof products === "undefined") return;

  const dealTags = ["Top Deal", "Best Seller", "Limited"];
  const topDeals = products.slice(0, 3);

  grid.innerHTML = topDeals
    .map((product, index) => {
      const teaser = product.description.slice(0, 72);
      const teaserText =
        product.description.length > 72 ? `${teaser}...` : teaser;

      return `
        <article class="deal-card">
          <p class="deal-tag">${dealTags[index] || "Deal"}</p>
          <h3>${product.name}</h3>
          <p>${teaserText}</p>
          <p class="product-price">£${product.price.toFixed(2)}</p>
          <a href="${resolveSitePath(`/pages/product.html?id=${product.id}`)}" class="btn-secondary">View deal</a>
        </article>
      `;
    })
    .join("");
}

function renderHomeNews() {
  const grid = document.getElementById("home-news-grid");
  if (!grid) return;

  grid.innerHTML = blogPosts
    .map(
      (post) => `
      <article class="news-card">
        <p class="news-date">${post.date}</p>
        <h3>${post.title}</h3>
        <a href="${resolveSitePath(post.url)}">Read more</a>
      </article>
    `,
    )
    .join("");
}

function initHomePage() {
  if (!document.querySelector(".home-page")) return;
  renderHomeBrands();
  renderHomeDeals();
  renderHomeNews();
}

document.addEventListener("DOMContentLoaded", initHomePage);

// ------------------------------
// MOBILE MENU TOGGLE
// ------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const navContainer = document.querySelector(".nav-container");

  if (hamburger && navContainer) {
    hamburger.addEventListener("click", () => {
      navContainer.classList.toggle("open");
    });
  }
});

// ------------------------------
// SHOP PAGE LOGIC
// ------------------------------

function renderProducts(list) {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  grid.innerHTML = "";

  list.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${resolveSitePath(product.image)}" alt="${product.name}" class="product-image">

            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">£${product.price.toFixed(2)}</p>
            </div>

      <a href="${resolveSitePath(`/pages/product.html?id=${product.id}`)}" class="btn-secondary">View Details</a>
      <button type="button" class="btn-primary" data-add-to-cart="true" data-product-id="${product.id}">Add to Cart</button>
        `;

    grid.appendChild(card);
  });
}

function populateCategories() {
  const dropdown = document.getElementById("category-filter");
  if (!dropdown) return;

  dropdown.innerHTML = '<option value="all">All Categories</option>';

  const categories = getCategories();

  categories
    .filter((cat) => cat !== "All")
    .forEach((cat) => {
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
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(term));
  }

  // Category
  const category = document.getElementById("category-filter");
  if (category && category.value !== "all") {
    filtered = filtered.filter((p) => p.category === category.value);
  }

  // Sorting
  const sort = document.getElementById("sort-filter");
  if (sort) {
    if (sort.value === "price-asc") filtered.sort((a, b) => a.price - b.price);
    if (sort.value === "price-desc") filtered.sort((a, b) => b.price - a.price);
    if (sort.value === "name-asc")
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort.value === "name-desc")
      filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderProducts(filtered);
}

function initShopPage() {
  if (!document.getElementById("product-grid")) return;

  populateCategories();
  renderProducts(products);

  document.getElementById("search").addEventListener("input", applyFilters);
  document
    .getElementById("category-filter")
    .addEventListener("change", applyFilters);
  document
    .getElementById("sort-filter")
    .addEventListener("change", applyFilters);
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

  const product = products.find((p) => p.id === id);

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

            <button type="button" class="btn-primary" data-add-to-cart="true" data-product-id="${product.id}">Add to Cart</button>
            <a href="${resolveSitePath("/pages/shop.html")}" class="btn-secondary">Back to Shop</a>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", initProductPage);

// ------------------------------
// CART SYSTEM
// ------------------------------

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  initCartPage();
}

function addToCart(id) {
  const cart = getCart();
  const itemId = Number(id);
  const item = cart.find((p) => p.id === itemId);

  if (item) {
    item.qty += 1;
  } else {
    cart.push({ id: itemId, qty: 1 });
  }

  saveCart(cart);
  alert("Added to cart!");
}

function updateCartItemQuantity(id, delta) {
  const cart = getCart();
  const itemId = Number(id);
  const item = cart.find((p) => p.id === itemId);

  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    const index = cart.findIndex((p) => p.id === itemId);
    cart.splice(index, 1);
  }

  saveCart(cart);
}

function removeCartItem(id) {
  const cart = getCart().filter((item) => item.id !== Number(id));
  saveCart(cart);
}

function clearCart() {
  saveCart([]);
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.qty, 0);

  const cartIcon = document.getElementById("cart-count");
  if (cartIcon) cartIcon.textContent = count;
}

document.addEventListener("DOMContentLoaded", updateCartCount);

document.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-to-cart]");
  if (addButton) {
    addToCart(addButton.dataset.productId);
    return;
  }

  const actionButton = event.target.closest("[data-cart-action]");
  if (!actionButton) return;

  const { cartAction, productId } = actionButton.dataset;

  if (cartAction === "increase") {
    updateCartItemQuantity(productId, 1);
  }

  if (cartAction === "decrease") {
    updateCartItemQuantity(productId, -1);
  }

  if (cartAction === "remove") {
    removeCartItem(productId);
  }

  if (cartAction === "clear-cart") {
    clearCart();
  }
});

// ------------------------------
// CART PAGE RENDERING
// ------------------------------

function initCartPage() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const cart = getCart();

  if (cart.length === 0) {
    container.innerHTML = `
      <p>Your cart is empty.</p>
      <div class="cart-empty-actions">
        <a href="${resolveSitePath("/pages/shop.html")}" class="btn-primary">Continue Shopping</a>
      </div>
    `;
    const summary = document.getElementById("cart-summary");
    if (summary) summary.innerHTML = "";
    return;
  }

  let total = 0;

  container.innerHTML = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      if (!product) return "";

      const subtotal = product.price * item.qty;
      total += subtotal;

      return `
            <article class="cart-item" data-product-id="${product.id}">
                <img src="${resolveSitePath(product.image)}" alt="${product.name}">

                <div class="cart-item-content">
                    <h3>${product.name}</h3>
                    <p class="product-price">£${product.price.toFixed(2)}</p>
                    <p>Subtotal: £${subtotal.toFixed(2)}</p>

                    <div class="cart-qty">
                        <button type="button" class="qty-btn" data-cart-action="decrease" data-product-id="${product.id}">-</button>
                        <span>${item.qty}</span>
                        <button type="button" class="qty-btn" data-cart-action="increase" data-product-id="${product.id}">+</button>
                    </div>

                    <button type="button" class="btn-secondary" data-cart-action="remove" data-product-id="${product.id}">Remove</button>
                </div>
            </article>
        `;
    })
    .join("");

  const summary = document.getElementById("cart-summary");
  if (summary) {
    summary.innerHTML = `
            <p><strong>Total: £${total.toFixed(2)}</strong></p>
            <button type="button" class="btn-secondary" data-cart-action="clear-cart">Clear Cart</button>
        `;
  }
}

document.addEventListener("DOMContentLoaded", initCartPage);
