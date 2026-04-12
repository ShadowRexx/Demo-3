// ============================================
// RN SPORTS HUB — App v2
// ============================================

import { fetchAllProducts } from "./products.js";

window.STORE_CONFIG = {
  upiId: "user123@upi",
  whatsappNumber: "919123456780",
  storeName: "RN Sports Hub",
};

// ---- NAVBAR ----
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  }, { passive: true });

  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  const backdrop = document.getElementById("mobile-nav-backdrop");

  if (hamburger && mobileNav) {
    const openNav = () => {
      mobileNav.classList.add("open");
      hamburger.classList.add("open");
      backdrop?.classList.add("open");
      document.body.style.overflow = "hidden";
    };
    const closeNav = () => {
      mobileNav.classList.remove("open");
      hamburger.classList.remove("open");
      backdrop?.classList.remove("open");
      document.body.style.overflow = "";
    };
    hamburger.addEventListener("click", e => {
      e.stopPropagation();
      mobileNav.classList.contains("open") ? closeNav() : openNav();
    });
    backdrop?.addEventListener("click", closeNav);
    document.addEventListener("click", e => {
      if (!hamburger.contains(e.target) && !mobileNav?.contains(e.target)) closeNav();
    });
  }

  // Active link highlight
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link, .mobile-nav-link").forEach(link => {
    const href = link.getAttribute("href") || "";
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });
}

// ---- SEARCH ----
function initSearch() {
  const input = document.getElementById("nav-search-input");
  const dropdown = document.getElementById("search-results-dropdown");
  const mobileBtn = document.getElementById("mobile-search-btn");
  const mobileOverlay = document.getElementById("mobile-search-overlay");
  const mobileInput = document.getElementById("mobile-search-input");
  const mobileDropdown = document.getElementById("mobile-search-dropdown");
  const mobileClose = document.getElementById("mobile-search-close");

  function renderDropdown(q, target) {
    if (!q || q.length < 2 || !target) { target?.classList.remove("active"); return; }
    const results = (window.PRODUCTS || []).filter(p =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q)
    ).slice(0, 6);
    if (!results.length) { target.classList.remove("active"); return; }
    target.innerHTML = results.map(p => `
      <div class="search-result-item" onclick="window.location='product.html?id=${p.id}'">
        <img src="${(p.images||[])[0]||""}" alt="${p.name}"
          onerror="this.src='https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=100&q=60'"/>
        <div style="flex:1;min-width:0;">
          <div class="name">${p.name}</div>
          <div class="price">${window.formatPrice?.(p.price)||'₹'+p.price}</div>
        </div>
        <span style="font-family:var(--font-fine);font-size:10px;color:var(--silver);text-transform:uppercase;">${p.category}</span>
      </div>`).join("");
    target.classList.add("active");
  }

  if (input && dropdown) {
    input.addEventListener("input", () => renderDropdown(input.value.toLowerCase().trim(), dropdown));
    input.addEventListener("keydown", e => {
      if (e.key === "Enter" && input.value.trim())
        window.location = `shop.html?q=${encodeURIComponent(input.value.trim())}`;
    });
    document.addEventListener("click", e => {
      if (!input.contains(e.target) && !dropdown.contains(e.target))
        dropdown.classList.remove("active");
    });
  }

  if (mobileBtn && mobileOverlay) {
    mobileBtn.addEventListener("click", () => { mobileOverlay.classList.add("open"); mobileInput?.focus(); });
    mobileClose?.addEventListener("click", () => mobileOverlay.classList.remove("open"));
    mobileInput?.addEventListener("input", () => renderDropdown(mobileInput.value.toLowerCase().trim(), mobileDropdown));
    mobileInput?.addEventListener("keydown", e => {
      if (e.key === "Enter" && mobileInput.value.trim()) {
        mobileOverlay.classList.remove("open");
        window.location = `shop.html?q=${encodeURIComponent(mobileInput.value.trim())}`;
      }
    });
  }
}

// ---- SCROLL REVEAL ----
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
}

// ---- PRODUCT CARD BUILDER ----
function buildProductCard(p) {
  const disc = p.originalPrice && p.originalPrice > p.price
    ? Math.round((1 - p.price / p.originalPrice) * 100) : 0;
  const badgeHtml = p.badge
    ? `<span class="product-card-badge badge-${p.badge}">${p.badge.toUpperCase()}</span>`
    : disc ? `<span class="product-card-badge badge-sale">-${disc}%</span>` : "";
  const sizesHtml = (p.sizes || []).slice(0, 4).map(s => `<span class="size-dot">${s}</span>`).join("");
  const img = (p.images || [])[0] || "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=60";
  const oos = p.stock === 0;

  return `
    <div class="product-card${oos ? ' oos' : ''}" onclick="window.location='product.html?id=${p.id}'" style="${oos?'opacity:0.6':''}">
      <div class="product-card-img-wrap">
        ${badgeHtml}
        ${oos ? `<span class="product-card-badge" style="background:var(--silver);color:var(--dark-1);top:auto;bottom:12px;left:12px;">Out of Stock</span>` : ''}
        <img src="${img}" alt="${p.name}" class="product-card-img" loading="lazy"
          onerror="this.src='https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=60'"/>
        ${!oos ? `
        <button class="product-card-quick" onclick="event.stopPropagation();window.quickAddToCart('${p.id}')">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.3 2.3c-.6.6-.2 1.7.7 1.7H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          Quick Add
        </button>` : ''}
      </div>
      <div class="product-card-body">
        <div class="product-card-cat">${p.category}${p.jerseyType ? ' · ' + p.jerseyType : ''}</div>
        <div class="product-card-name">${p.name}</div>
        <div class="product-card-prices">
          <span class="product-card-price">₹${Number(p.price).toLocaleString("en-IN")}</span>
          ${p.originalPrice ? `<span class="product-card-original">₹${Number(p.originalPrice).toLocaleString("en-IN")}</span>` : ""}
        </div>
        <div class="product-card-sizes">${sizesHtml}</div>
      </div>
    </div>`;
}
window.buildProductCard = buildProductCard;

// ---- HOMEPAGE ----
async function initHomepage() {
  const featuredGrid = document.getElementById("featured-products-grid");
  const heroSlider = document.getElementById("hero-slider");

  if (!featuredGrid && !heroSlider) return; // Not homepage

  // Load products
  const products = await fetchAllProducts();

  // Hero image slider
  if (heroSlider) {
    const heroImages = products.length >= 3
      ? products.slice(0, 3).map(p => (p.images||[])[0]).filter(Boolean)
      : [
          "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1400&q=80",
          "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=1400&q=80",
          "https://images.unsplash.com/photo-1556906781-9a412961a28c?w=1400&q=80",
        ];

    let current = 0;
    const slides = heroImages.map((src, i) => {
      const div = document.createElement("div");
      div.style.cssText = `
        position:absolute; inset:0;
        background-image:url(${src});
        background-size:cover; background-position:center;
        opacity:${i === 0 ? 1 : 0};
        transition:opacity 1.2s ease;`;
      heroSlider.appendChild(div);
      return div;
    });

    if (slides.length > 1) {
      setInterval(() => {
        slides[current].style.opacity = "0";
        current = (current + 1) % slides.length;
        slides[current].style.opacity = "1";
      }, 5000);
    }
  }

  // Featured products grid
  if (featuredGrid) {
    const featured = products.filter(p => p.featured).slice(0, 8);
    const toShow = featured.length > 0 ? featured : products.slice(0, 8);

    if (toShow.length === 0) {
      featuredGrid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:60px 20px;color:var(--silver);font-family:var(--font-fine);">
          No products available yet.
        </div>`;
    } else {
      featuredGrid.innerHTML = toShow.map(p => buildProductCard(p)).join("");
    }
  }
}

// ---- INIT ----
document.addEventListener("DOMContentLoaded", async () => {
  initNavbar();
  initSearch();
  initReveal();
  await initHomepage();
});
