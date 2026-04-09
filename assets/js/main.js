/* ================================================
   TheSecondWave — Main JS
   ================================================ */

// ── Page Loader ──────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 600);
  }
});

// ── Navbar Scroll ────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── Mobile Nav ───────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
}

// ── Cart Sidebar ─────────────────────────────
const cartOverlay = document.getElementById('cart-overlay');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOpenBtns = document.querySelectorAll('[data-cart-open]');
const cartCloseBtn = document.getElementById('cart-close');

function openCart() {
  if (cartOverlay) cartOverlay.classList.add('open');
  if (cartSidebar) cartSidebar.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  if (cartOverlay) cartOverlay.classList.remove('open');
  if (cartSidebar) cartSidebar.classList.remove('open');
  document.body.style.overflow = '';
}
cartOpenBtns.forEach(btn => btn.addEventListener('click', openCart));
if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// ── Cart State ───────────────────────────────
let cartItems = JSON.parse(localStorage.getItem('tsw_cart') || '[]');

function saveCart() {
  localStorage.setItem('tsw_cart', JSON.stringify(cartItems));
  updateCartCount();
  renderCartSidebar();
}

function updateCartCount() {
  const count = cartItems.reduce((sum, i) => sum + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = count;
    el.classList.toggle('visible', count > 0);
  });
}

function addToCart(product) {
  const existing = cartItems.find(i => i.id === product.id && i.size === product.size);
  if (existing) {
    existing.qty += product.qty || 1;
  } else {
    cartItems.push({ ...product, qty: product.qty || 1 });
  }
  saveCart();
  showToast(`${product.name} added to cart ✓`);
  openCart();
}

function renderCartSidebar() {
  const body = document.querySelector('.cart-body');
  const subtotalEl = document.querySelector('.cart-subtotal span:last-child');
  if (!body) return;

  if (cartItems.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
        <p>Your cart is empty</p>
        <span>Add some pieces to get started</span>
      </div>`;
    if (subtotalEl) subtotalEl.textContent = '₹0';
    return;
  }

  const total = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  body.innerHTML = cartItems.map((item, idx) => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=80'">
      <div>
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-variant">Size: ${item.size || 'M'} · ${item.color || 'Default'}</div>
        <div class="cart-item-qty">
          <button class="cart-item-qty-btn" onclick="changeQty(${idx}, -1)">−</button>
          <span class="cart-item-qty-val">${item.qty}</span>
          <button class="cart-item-qty-btn" onclick="changeQty(${idx}, 1)">+</button>
        </div>
      </div>
      <div>
        <div class="cart-item-price">₹${(item.price * item.qty).toLocaleString()}</div>
        <button onclick="removeCartItem(${idx})" style="font-size:11px;color:var(--taupe);margin-top:8px;display:block;">Remove</button>
      </div>
    </div>`).join('');

  if (subtotalEl) subtotalEl.textContent = `₹${total.toLocaleString()}`;
}

function changeQty(idx, delta) {
  cartItems[idx].qty += delta;
  if (cartItems[idx].qty <= 0) cartItems.splice(idx, 1);
  saveCart();
}
function removeCartItem(idx) {
  cartItems.splice(idx, 1);
  saveCart();
}

// ── Toast ────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.querySelector('.toast-msg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ── Reveal on Scroll ─────────────────────────
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
}

// ── Filter Buttons ───────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const group = this.closest('.filter-group');
    if (group) {
      group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    }
    this.classList.toggle('active');
  });
});

// ── Accordion ────────────────────────────────
document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    const body = this.nextElementSibling;
    const isOpen = body.classList.contains('open');
    // Close all
    document.querySelectorAll('.accordion-body').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.accordion-btn').forEach(b => b.classList.remove('open'));
    if (!isOpen) {
      body.classList.add('open');
      this.classList.add('open');
    }
  });
});

// ── Size Selector ────────────────────────────
document.querySelectorAll('.size-btn:not(.disabled)').forEach(btn => {
  btn.addEventListener('click', function () {
    this.closest('.size-options').querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Color Selector ───────────────────────────
document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    this.closest('.color-options').querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Quantity Control ─────────────────────────
function initQtyControls() {
  document.querySelectorAll('.qty-control').forEach(ctrl => {
    const display = ctrl.querySelector('.qty-display');
    if (!display) return;
    let qty = parseInt(display.textContent) || 1;

    ctrl.querySelector('.qty-decrease')?.addEventListener('click', () => {
      if (qty > 1) { qty--; display.textContent = qty; }
    });
    ctrl.querySelector('.qty-increase')?.addEventListener('click', () => {
      if (qty < 10) { qty++; display.textContent = qty; }
    });
  });
}
initQtyControls();

// ── Gallery Thumbs ───────────────────────────
document.querySelectorAll('.gallery-thumb').forEach(thumb => {
  thumb.addEventListener('click', function () {
    const main = this.closest('.product-gallery')?.querySelector('.gallery-main-img');
    if (main) {
      main.style.opacity = '0';
      setTimeout(() => {
        main.src = this.src;
        main.style.opacity = '1';
      }, 200);
    }
    this.closest('.gallery-thumbs')?.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
  });
});

// ── Horizontal Scroll Nav ────────────────────
const scrollContainer = document.querySelector('.arrivals-scroll');
document.querySelector('.scroll-prev')?.addEventListener('click', () => {
  scrollContainer?.scrollBy({ left: -300, behavior: 'smooth' });
});
document.querySelector('.scroll-next')?.addEventListener('click', () => {
  scrollContainer?.scrollBy({ left: 300, behavior: 'smooth' });
});

// ── Add to Cart from Detail Page ─────────────
const addToCartBtn = document.querySelector('.add-to-cart-btn');
if (addToCartBtn) {
  addToCartBtn.addEventListener('click', () => {
    const name = document.querySelector('.product-info-name')?.textContent || 'Product';
    const priceText = document.querySelector('.price-current')?.textContent?.replace(/[^\d]/g, '') || '0';
    const size = document.querySelector('.size-btn.active')?.textContent || 'M';
    const qty = parseInt(document.querySelector('.qty-display')?.textContent) || 1;
    const img = document.querySelector('.gallery-main-img')?.src || '';

    addToCart({
      id: Date.now(),
      name, price: parseInt(priceText),
      size, qty, img, color: 'Default'
    });
  });
}

// ── Add to Cart from Cards ───────────────────
document.querySelectorAll('[data-add-cart]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const card = btn.closest('.product-card');
    const name = card?.querySelector('.product-card-name')?.textContent || 'Product';
    const priceText = card?.querySelector('.product-price')?.textContent?.replace(/[^\d]/g, '') || '0';
    const img = card?.querySelector('.product-card-img')?.src || '';
    addToCart({ id: Date.now(), name, price: parseInt(priceText), size: 'M', qty: 1, img });
  });
});

// ── Wishlist toggle ───────────────────────────
document.querySelectorAll('[data-wishlist]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault(); e.stopPropagation();
    btn.classList.toggle('wishlisted');
    const svg = btn.querySelector('svg');
    if (btn.classList.contains('wishlisted')) {
      svg.style.fill = 'currentColor';
      svg.style.color = '#c0392b';
      showToast('Added to wishlist ♥');
    } else {
      svg.style.fill = 'none';
      svg.style.color = '';
    }
  });
});

// ── Init ─────────────────────────────────────
updateCartCount();
renderCartSidebar();
