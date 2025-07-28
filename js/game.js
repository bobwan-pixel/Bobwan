// game.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA2s25k3SNFq4CcNvTVb5M6wEmVKgHAoOU",
  authDomain: "bobwan-11aed.firebaseapp.com",
  projectId: "bobwan-11aed",
  storageBucket: "bobwan-11aed.appspot.com",
  messagingSenderId: "870245501386",
  appId: "1:870245501386:web:6c24f4ed2b0fab4dd0a733",
  measurementId: "G-ENT7HV7GHN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// -------------------- VARIABEL --------------------
let selectedProduct = null;
let selectedPayment = null;
let gameId = null;

// -------------------- GAME ID --------------------
const gameSelect = document.getElementById("gameSelect");

if (gameSelect) {
  gameId = gameSelect.value;
  gameSelect.addEventListener("change", () => {
    gameId = gameSelect.value;
    loadProducts();
  });
} else {
  const urlParts = window.location.pathname.split("/");
  const fileName = urlParts[urlParts.length - 1].replace(".html", "");
  gameId = fileName.toLowerCase(); // contoh: ff, ml, pb
}

// -------------------- PAYMENT METHODS --------------------
const paymentMethods = {
  ewallet: [
    { id: "qris", name: "QRIS", image: "../asset/logo/qris.png" },
    { id: "dana", name: "DANA", image: "../asset/logo/dana.png" },
    { id: "shopeepay", name: "ShopeePay", image: "../asset/logo/shopeepay.png" },
    { id: "ovo", name: "OVO", image: "../asset/logo/ovo.png" },
    { id: "gopay", name: "GOPAY", image: "../asset/logo/gopay.png" },
    { id: "linkaja", name: "LINKAJA", image: "../asset/logo/linkaja.png" }
  ],
  bank: [
    { id: "bca", name: "BCA", image: "../asset/logo/bca.png" },
    { id: "bri", name: "BRI", image: "../asset/logo/bri.png" },
    { id: "mandiri", name: "Mandiri", image: "../asset/logo/mandiri.png" }
  ],
  retail: [
    { id: "alfamart", name: "Alfamart", image: "../asset/logo/alfamart.png" },
    { id: "indomaret", name: "Indomaret", image: "../asset/logo/indomaret.png" }
  ],
  pulsa: [
    { id: "tri", name: "Tri", image: "../asset/logo/tri.png" },
    { id: "telkomsel", name: "Telkomsel", image: "../asset/logo/telkomsel.png" },
    { id: "xl", name: "XL", image: "../asset/logo/xl.png" },
    { id: "indosat", name: "Indosat", image: "../asset/logo/indosat.png" }
  ]
};

// -------------------- LOAD PRODUK --------------------
async function loadProducts() {
  const produkList = document.getElementById("produkList");
  if (!produkList || !gameId) return;

  produkList.innerHTML = `<p>Memuat produk...</p>`;

  const q = query(collection(db, "produk"), where("game", "==", gameId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    produkList.innerHTML = "<p>Belum ada produk tersedia.</p>";
    return;
  }

  produkList.innerHTML = "";

  snapshot.forEach((doc) => {
    const data = doc.data();
    const card = document.createElement("div");
    card.className = "produk-card";
    card.dataset.id = doc.id;
    card.dataset.price = data.harga;

    const badge = data.bestSeller ? '<div class="badge">Best Seller</div>' : "";

    card.innerHTML = `
      ${badge}
      <img src="${data.image}" alt="${data.nama}" onerror="this.src='../asset/icon/fallback.png'">
      <h3>${data.nama}</h3>
      <p>Rp ${data.harga.toLocaleString("id-ID")}</p>
    `;

    card.addEventListener("click", () => selectProduct(card, data));
    produkList.appendChild(card);
  });
}

function selectProduct(card, product) {
  document.querySelectorAll(".produk-card").forEach((el) => el.classList.remove("selected"));
  card.classList.add("selected");
  selectedProduct = product;
  updateSummary();
}

// -------------------- LOAD PAYMENT --------------------
function loadPaymentMethods() {
  for (const group in paymentMethods) {
    const container = document.getElementById(group);
    if (!container) continue;

    const row = document.createElement("div");
    row.className = "card-payment-row";

    paymentMethods[group].forEach((method) => {
      const label = document.createElement("label");
      label.className = "card-payment";
      label.innerHTML = `
        <input type="radio" name="metodePembayaran" value="${method.id}">
        <img src="${method.image}" alt="${method.name}">
        <span>${method.name}</span>
      `;

      label.querySelector("input").addEventListener("change", () => {
        selectedPayment = method;
        updateSummary();
      });

      row.appendChild(label);
    });

    container.appendChild(row);
  }
}

// -------------------- RINGKASAN --------------------
function updateSummary() {
  const price = selectedProduct?.harga || 0;
  const tax = Math.round(price * 0.1);
  const total = price + tax;

  document.getElementById("selectedProduct").textContent = selectedProduct?.nama || "-";
  document.getElementById("productPrice").textContent = `Rp ${price.toLocaleString("id-ID")}`;
  document.getElementById("taxAmount").textContent = `Rp ${tax.toLocaleString("id-ID")}`;
  document.getElementById("totalPayment").textContent = `Rp ${total.toLocaleString("id-ID")}`;
}

// -------------------- CHECKOUT --------------------
async function processCheckout(e) {
  e.preventDefault();

  const playerId = document.getElementById("playerId")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const whatsapp = document.getElementById("whatsapp")?.value.trim();

  if (!selectedProduct || !selectedPayment || !playerId || !email) {
    alert("Silakan lengkapi semua data terlebih dahulu.");
    return;
  }

  const tax = Math.round(selectedProduct.harga * 0.1);
  const total = selectedProduct.harga + tax;

  const transaksi = {
    game: gameId,
    id: playerId,
    email,
    whatsapp,
    produk: selectedProduct.nama,
    harga: selectedProduct.harga,
    pajak: tax,
    total,
    metode: selectedPayment.name,
    waktu: serverTimestamp(),
    login: false
  };

  try {
    await addDoc(collection(db, "transaksi"), transaksi);
    alert("Transaksi berhasil disimpan!");
    window.location.href = "../pembayaran.html";
  } catch (err) {
    console.error("Gagal menyimpan transaksi:", err);
    alert("Terjadi kesalahan saat menyimpan transaksi.");
  }
}

// -------------------- INIT --------------------
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();
  loadPaymentMethods();

  const checkoutBtn = document.getElementById("checkoutBtn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", processCheckout);
  }

  document.querySelectorAll(".tab-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      document.querySelectorAll(".tab-button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
      document.getElementById(tabId).classList.add("active");
    });
  });
});