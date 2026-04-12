// ============================================
// RN SPORTS HUB — Products v2
// Falls back to dummy data when Firebase is not configured
// ============================================

import { db, isConfigured } from "./firebase.js";

// ---- DUMMY PRODUCTS (used until Firebase is set up) ----
const DUMMY_PRODUCTS = [
  {
    id:"d1", name:"Real Madrid Home Fan Jersey", category:"jersey", brand:"Adidas",
    jerseyType:"fan", price:799, originalPrice:1299, badge:"new", featured:true, stock:15,
    rating:4.8, reviews:32,
    images:["https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80"],
    sizes:["S","M","L","XL","XXL"],
    description:"Official design fan version jersey. Premium polyester fabric, breathable and comfortable.",
    features:["Breathable polyester","Official badge embroidery","Regular fit","Machine washable"],
    specs:{Material:"Polyester",Fit:"Regular",Version:"Fan",Season:"2024-25"}
  },
  {
    id:"d2", name:"Barcelona Away Player Jersey", category:"jersey", brand:"Nike",
    jerseyType:"player", price:1499, originalPrice:2499, badge:"hot", featured:true, stock:8,
    rating:4.9, reviews:57,
    images:["https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=600&q=80"],
    sizes:["S","M","L","XL"],
    description:"Player version jersey with Dri-FIT technology. Same spec as what pros wear on the pitch.",
    features:["Dri-FIT technology","Slim fit cut","Heat-transferred badge","Sweat-wicking fabric"],
    specs:{Material:"Recycled Polyester",Fit:"Slim",Version:"Player",Season:"2024-25"}
  },
  {
    id:"d3", name:"Nike Mercurial Football Studs", category:"studs", brand:"Nike",
    jerseyType:null, price:1299, originalPrice:1999, badge:"sale", featured:true, stock:12,
    rating:4.7, reviews:41,
    images:["https://images.unsplash.com/photo-1556906781-9a412961a28c?w=600&q=80"],
    sizes:["6","7","8","9","10","11"],
    description:"Lightweight and explosive speed. Designed for natural and artificial grass.",
    features:["Lightweight upper","Conical stud configuration","Responsive cushioning","All-weather traction"],
    specs:{Upper:"Synthetic",Sole:"TPU",Surface:"FG/AG",Weight:"210g"}
  },
  {
    id:"d4", name:"Adidas Predator Studs", category:"studs", brand:"Adidas",
    jerseyType:null, price:1599, originalPrice:2399, badge:null, featured:true, stock:6,
    rating:4.6, reviews:28,
    images:["https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&q=80"],
    sizes:["6","7","8","9","10"],
    description:"Precision control on every touch. The Predator legacy continues.",
    features:["Controlframe outsole","Laceless design","Zone skin texture","High grip rubber studs"],
    specs:{Upper:"Synthetic",Sole:"TPU",Surface:"FG",Weight:"225g"}
  },
  {
    id:"d5", name:"Football Training Gear Set", category:"gear", brand:"Nike",
    jerseyType:null, price:999, originalPrice:1599, badge:"new", featured:false, stock:20,
    rating:4.5, reviews:19,
    images:["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80"],
    sizes:["One Size"],
    description:"Complete training gear set for serious footballers.",
    features:["Shin guards included","Goalkeeper gloves","Football socks x2","Carry bag"],
    specs:{Contents:"4 items",Size:"Adjustable",Material:"Mixed",For:"Training"}
  },
  {
    id:"d6", name:"Manchester City Home Fan Jersey", category:"jersey", brand:"Puma",
    jerseyType:"fan", price:749, originalPrice:1199, badge:null, featured:false, stock:18,
    rating:4.7, reviews:23,
    images:["https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=600&q=80"],
    sizes:["S","M","L","XL","XXL"],
    description:"Sky blue fan version jersey. Perfect for every City supporter.",
    features:["Breathable mesh fabric","Screen-printed badge","Classic fit","Wicking technology"],
    specs:{Material:"Polyester",Fit:"Regular",Version:"Fan",Season:"2024-25"}
  },
  {
    id:"d7", name:"PSG Home Player Jersey", category:"jersey", brand:"Nike",
    jerseyType:"player", price:1699, originalPrice:2799, badge:"hot", featured:false, stock:5,
    rating:4.9, reviews:61,
    images:["https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&q=80"],
    sizes:["S","M","L","XL"],
    description:"Paris Saint-Germain home player jersey. Same as worn by stars on match day.",
    features:["Vaporknit technology","Slim fit","Heat-transferred graphics","Ultra lightweight"],
    specs:{Material:"Vaporknit",Fit:"Slim",Version:"Player",Season:"2024-25"}
  },
  {
    id:"d8", name:"Mizuno Morelia Football Boots", category:"studs", brand:"Mizuno",
    jerseyType:null, price:1899, originalPrice:2999, badge:null, featured:false, stock:9,
    rating:4.8, reviews:34,
    images:["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
    sizes:["6","7","8","9","10","11"],
    description:"Japanese craftsmanship meets football performance. Kangaroo leather upper.",
    features:["K-leather upper","Ortholite insole","Wave plate technology","Superior ball feel"],
    specs:{Upper:"K-Leather",Sole:"TPU",Surface:"FG",Weight:"200g"}
  },
  {
    id:"d9", name:"Liverpool Home Fan Jersey", category:"jersey", brand:"Nike",
    jerseyType:"fan", price:849, originalPrice:1399, badge:null, featured:false, stock:14,
    rating:4.6, reviews:45,
    images:["https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&q=80"],
    sizes:["S","M","L","XL","XXL"],
    description:"You'll Never Walk Alone. Wear the red with pride.",
    features:["Dri-FIT fabric","Regular fit","Authentic design","Machine washable"],
    specs:{Material:"Polyester",Fit:"Regular",Version:"Fan",Season:"2024-25"}
  },
  {
    id:"d10", name:"Football Goalkeeper Gloves", category:"gear", brand:"Adidas",
    jerseyType:null, price:599, originalPrice:899, badge:"sale", featured:false, stock:22,
    rating:4.4, reviews:17,
    images:["https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=600&q=80"],
    sizes:["7","8","9","10"],
    description:"Pro-grade goalkeeper gloves with superior grip and protection.",
    features:["Latex palm","Finger spines","Wrist strap","Cut resistance"],
    specs:{Palm:"Latex",Cut:"Flat cut",Level:"Match",Care:"Hand wash"}
  },
  {
    id:"d11", name:"Chelsea Away Fan Jersey", category:"jersey", brand:"Nike",
    jerseyType:"fan", price:779, originalPrice:1249, badge:null, featured:false, stock:11,
    rating:4.5, reviews:29,
    images:["https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=600&q=80"],
    sizes:["S","M","L","XL"],
    description:"Chelsea away fan jersey for the true Blues supporter.",
    features:["Breathable polyester","Official badge","Regular fit","Quick-dry fabric"],
    specs:{Material:"Polyester",Fit:"Regular",Version:"Fan",Season:"2024-25"}
  },
  {
    id:"d12", name:"Football Shin Guards Pro", category:"gear", brand:"Adidas",
    jerseyType:null, price:399, originalPrice:649, badge:null, featured:false, stock:30,
    rating:4.3, reviews:12,
    images:["https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80"],
    sizes:["S","M","L"],
    description:"Lightweight shin guards with EVA foam padding for maximum protection.",
    features:["Hard outer shell","EVA foam padding","Elastic sleeve","Anatomical fit"],
    specs:{Material:"PP Shell + EVA",Weight:"120g",Level:"Match/Training",Care:"Wipe clean"}
  },
];

window.PRODUCTS = [];

export async function fetchAllProducts() {
  // If already loaded, return cached
  if (window.PRODUCTS.length > 0) return window.PRODUCTS;

  // Try Firebase first
  if (isConfigured && db) {
    try {
      const { collection, getDocs } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const snap = await getDocs(collection(db, "products"));
      window.PRODUCTS = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      console.log(`[Products] Loaded ${window.PRODUCTS.length} products from Firebase.`);
      return window.PRODUCTS;
    } catch (err) {
      console.warn("[Products] Firebase fetch failed, using dummy data:", err.message);
    }
  }

  // Fallback to dummy products
  window.PRODUCTS = DUMMY_PRODUCTS;
  console.info(`[Products] Using ${window.PRODUCTS.length} dummy products.`);
  return window.PRODUCTS;
}

export async function fetchProductById(id) {
  // Try cache first
  if (window.PRODUCTS.length > 0) {
    const cached = window.PRODUCTS.find(p => p.id === id);
    if (cached) return cached;
  }

  // Try Firebase
  if (isConfigured && db) {
    try {
      const { doc, getDoc } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
      const snap = await getDoc(doc(db, "products", id));
      if (snap.exists()) return { id: snap.id, ...snap.data() };
    } catch (err) {
      console.warn("[Products] fetchById Firebase failed:", err.message);
    }
  }

  // Fallback: search dummy data
  await fetchAllProducts();
  return window.PRODUCTS.find(p => p.id === id) || null;
}

// ---- GLOBAL HELPERS ----
window.getProductById = (id) => window.PRODUCTS.find(p => p.id === id) || null;

window.getProductsByCategory = (cat) =>
  cat === "all" ? window.PRODUCTS : window.PRODUCTS.filter(p => p.category === cat);

window.getFeaturedProducts = () => window.PRODUCTS.filter(p => p.featured === true);

window.getRelatedProducts = (product, limit = 4) =>
  window.PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, limit);

window.getDiscountPct = (product) => {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.originalPrice) * 100);
};

window.formatPrice = (n) => "₹" + Number(n).toLocaleString("en-IN");
