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

function initGlobalSearch() {
  const form = document.getElementById("global-search-form");
  const input = document.getElementById("global-search-input");

  if (!form || !input || form.dataset.bound === "true") return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = input.value.trim();
    const target = query
      ? resolveSitePath(`/pages/shop.html?q=${encodeURIComponent(query)}`)
      : resolveSitePath("/pages/shop.html");
    window.location.href = target;
  });

  form.dataset.bound = "true";
}

async function loadComponent(id, file) {
  const element = document.getElementById(id);
  if (element) {
    try {
      const response = await fetch(`${getComponentBasePath()}${file}`);
      const html = await response.text();
      element.innerHTML = html;
      normalizeComponentPaths(element);
      if (id === "site-header") {
        initGlobalSearch();
      }
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
document.addEventListener("DOMContentLoaded", initGlobalSearch);
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

const promoOffers = [
  {
    label: "Free delivery over £39",
    url: "/pages/shipping.html",
  },
  {
    label: "20% off selected treats this week",
    url: "/pages/shop.html?collection=Offers",
  },
  {
    label: "New spring picks now live",
    url: "/pages/shop.html?collection=New%20Lines",
  },
  {
    label: "Clearance bundles while stock lasts",
    url: "/pages/shop.html?collection=Clearance",
  },
];

const petTypes = ["Dog", "Cat", "Small Pet", "Bird"];

let offerSliderInterval;

function getCollectionTag(product) {
  if (!Array.isArray(product.collections) || product.collections.length === 0) {
    return "Featured";
  }

  if (product.collections.includes("Price Drop")) return "Price Drop";
  if (product.collections.includes("Offers")) return "Offer";
  if (product.collections.includes("New Lines")) return "New";
  if (product.collections.includes("Clearance")) return "Clearance";
  return product.collections[0];
}

function getStars(rating) {
  const safeRating = typeof rating === "number" ? rating : 4;
  const fullStars = Math.round(safeRating);
  return "★".repeat(fullStars) + "☆".repeat(5 - fullStars);
}

function createProductCardHTML(product, detailLabel = "View Details") {
  const oldPriceMarkup = product.oldPrice
    ? `<p class="product-price-previous">Was £${product.oldPrice.toFixed(2)}</p>`
    : "";

  const unitPriceMarkup = product.unitPrice
    ? `<p class="product-unit-price">${product.unitPrice}</p>`
    : "";

  const reviewCount = typeof product.reviews === "number" ? product.reviews : 0;
  const rating =
    typeof product.rating === "number" ? product.rating.toFixed(1) : "4.0";

  return `
    <article class="product-card">
      <span class="product-badge">${getCollectionTag(product)}</span>
      <img src="${resolveSitePath(product.image)}" alt="${product.name}" class="product-image">

      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-rating" aria-label="Rating ${rating} out of 5">${getStars(product.rating)} <span>(${reviewCount})</span></p>
        <p class="product-price">£${product.price.toFixed(2)}</p>
        ${oldPriceMarkup}
        ${unitPriceMarkup}
      </div>

      <a href="${resolveSitePath(`/pages/product.html?id=${product.id}`)}" class="btn-secondary">${detailLabel}</a>
      <button type="button" class="btn-primary" data-add-to-cart="true" data-product-id="${product.id}">Add to Cart</button>
    </article>
  `;
}

function renderPromoBar() {
  const list = document.getElementById("promo-offers-list");
  if (!list) return;

  list.innerHTML = promoOffers
    .slice(0, 3)
    .map(
      (offer) =>
        `<li><a href="${resolveSitePath(offer.url)}">${offer.label}</a></li>`,
    )
    .join("");
}

function renderOfferSlider() {
  const slider = document.getElementById("offer-slider-track");
  if (!slider) return;

  slider.innerHTML = promoOffers
    .map(
      (offer, index) => `
      <a class="offer-slide${index === 0 ? " is-active" : ""}" href="${resolveSitePath(offer.url)}">
        <span class="offer-slide-tag">Live Offer</span>
        <strong>${offer.label}</strong>
      </a>
    `,
    )
    .join("");
}

function startOfferSlider() {
  const slides = Array.from(document.querySelectorAll(".offer-slide"));
  if (slides.length < 2) return;

  let activeIndex = 0;
  if (offerSliderInterval) clearInterval(offerSliderInterval);

  offerSliderInterval = setInterval(() => {
    slides[activeIndex].classList.remove("is-active");
    activeIndex = (activeIndex + 1) % slides.length;
    slides[activeIndex].classList.add("is-active");
  }, 3800);
}

function renderPetTypeSwitcher() {
  const container = document.getElementById("pet-type-switcher");
  if (!container) return;

  container.innerHTML = petTypes
    .map(
      (petType) =>
        `<a class="pet-switch-chip" href="${resolveSitePath(`/pages/shop.html?pet=${encodeURIComponent(petType)}`)}">${petType}</a>`,
    )
    .join("");
}

function renderHomeCollectionRail(elementId, collection, emptyText) {
  const grid = document.getElementById(elementId);
  if (!grid || typeof products === "undefined") return;

  const collectionItems = products
    .filter((product) =>
      Array.isArray(product.collections)
        ? product.collections.includes(collection)
        : false,
    )
    .slice(0, 3);

  if (collectionItems.length === 0) {
    grid.innerHTML = `<p>${emptyText}</p>`;
    return;
  }

  grid.innerHTML = collectionItems
    .map((product) => createProductCardHTML(product, "View product"))
    .join("");
}

function renderHomeBrands() {
  const grid = document.getElementById("brand-grid");
  if (!grid) return;

  if (typeof getBrands === "function") {
    const brandLinks = getBrands();
    grid.innerHTML = brandLinks
      .map(
        (brand) =>
          `<a class="brand-tile" href="${resolveSitePath(`/pages/shop.html?brand=${encodeURIComponent(brand)}`)}">${brand}</a>`,
      )
      .join("");
    return;
  }

  grid.innerHTML = homeBrands
    .map((brand) => `<article class="brand-tile">${brand}</article>`)
    .join("");
}

function renderHomeDeals() {
  const grid = document.getElementById("top-deals-grid");
  if (!grid || typeof products === "undefined") return;

  const topDeals = products
    .filter((product) =>
      Array.isArray(product.collections)
        ? product.collections.includes("Offers") ||
          product.collections.includes("Price Drop")
        : false,
    )
    .slice(0, 3);

  const fallbackDeals = topDeals.length > 0 ? topDeals : products.slice(0, 3);

  grid.innerHTML = fallbackDeals
    .map((product, index) => {
      const teaser = product.description.slice(0, 72);
      const teaserText =
        product.description.length > 72 ? `${teaser}...` : teaser;
      const tag =
        Array.isArray(product.collections) && product.collections.length > 0
          ? product.collections[0]
          : ["Top Deal", "Best Seller", "Limited"][index] || "Deal";

      return `
        <article class="deal-card">
          <p class="deal-tag">${tag}</p>
          <h3>${product.name}</h3>
          <p>${teaserText}</p>
          <p class="product-price">£${product.price.toFixed(2)}</p>
          ${product.oldPrice ? `<p class="product-price-previous">Was £${product.oldPrice.toFixed(2)}</p>` : ""}
          ${product.unitPrice ? `<p class="product-unit-price">${product.unitPrice}</p>` : ""}
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
  renderHomeBrands();
  renderHomeDeals();
  renderHomeCollectionRail(
    "new-lines-grid",
    "New Lines",
    "New lines are arriving soon.",
  );
  renderHomeCollectionRail(
    "clearance-grid",
    "Clearance",
    "No clearance products available right now.",
  );
  renderHomeNews();
  renderPromoBar();
  renderOfferSlider();
  renderPetTypeSwitcher();
  startOfferSlider();
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

  grid.innerHTML = list
    .map((product) => createProductCardHTML(product, "View Details"))
    .join("");
}

function getShopQueryFilters() {
  const params = new URLSearchParams(window.location.search);
  return {
    category: params.get("category"),
    brand: params.get("brand"),
    collection: params.get("collection"),
    pet: params.get("pet"),
    q: params.get("q"),
  };
}

function populateCategories() {
  const dropdown = document.getElementById("category-filter");
  if (!dropdown) return;

  dropdown.innerHTML = '<option value="all">All Departments</option>';

  const categories = getCategories();

  categories
    .filter((cat) => cat !== "all")
    .forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      dropdown.appendChild(option);
    });
}

function applyFilters() {
  let filtered = [...products];
  const queryFilters = getShopQueryFilters();

  const categoryDropdown = document.getElementById("category-filter");
  const selectedCategory =
    categoryDropdown && categoryDropdown.value !== "all"
      ? categoryDropdown.value
      : queryFilters.category;

  if (selectedCategory && selectedCategory !== "all") {
    filtered = filtered.filter((p) => p.category === selectedCategory);
  }

  if (queryFilters.brand) {
    filtered = filtered.filter((p) => p.brand === queryFilters.brand);
  }

  if (queryFilters.collection) {
    filtered = filtered.filter((p) =>
      Array.isArray(p.collections)
        ? p.collections.includes(queryFilters.collection)
        : false,
    );
  }

  if (queryFilters.pet) {
    filtered = filtered.filter((p) => p.petType === queryFilters.pet);
  }

  // Search
  const search = document.getElementById("search");
  if (search && search.value.trim() !== "") {
    const term = search.value.toLowerCase();
    filtered = filtered.filter((p) => p.name.toLowerCase().includes(term));
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

  const queryFilters = getShopQueryFilters();

  populateCategories();

  const title = document.querySelector(".page-title");
  if (title) {
    if (queryFilters.category) title.textContent = queryFilters.category;
    else if (queryFilters.brand)
      title.textContent = `${queryFilters.brand} Products`;
    else if (queryFilters.collection)
      title.textContent = queryFilters.collection;
    else if (queryFilters.pet)
      title.textContent = `${queryFilters.pet} Essentials`;
  }

  const categoryFilter = document.getElementById("category-filter");
  if (categoryFilter && queryFilters.category) {
    categoryFilter.value = queryFilters.category;
  }

  const searchInput = document.getElementById("search");
  if (searchInput && queryFilters.q) {
    searchInput.value = queryFilters.q;
  }

  applyFilters();

  document.getElementById("search").addEventListener("input", applyFilters);
  categoryFilter.addEventListener("change", applyFilters);
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

// Register service worker for offline support and smart caching
if ("serviceWorker" in navigator && location.protocol !== "file:") {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("Service Worker registered successfully:", registration);
    })
    .catch((error) => {
      console.warn("Service Worker registration failed:", error);
    });
}
