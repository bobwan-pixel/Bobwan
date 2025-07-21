// Data Produk Valorant
const products = [
    { id: 1, name: "100 PB Cash", price: 10000, image: "assets/pb_cash_icon.png", bestSeller: true },
    { id: 2, name: "250 PB Cash", price: 25000, image: "assets/pb_cash_icon.png" },
    { id: 3, name: "500 PB Cash", price: 50000, image: "assets/pb_cash_icon.png", popular: true },
    { id: 4, name: "1000 PB Cash", price: 100000, image: "assets/pb_cash_icon.png" },
    { id: 5, name: "2500 PB Cash", price: 250000, image: "assets/pb_cash_icon.png" },
    { id: 6, name: "5000 PB Cash", price: 500000, image: "assets/pb_cash_icon.png" }
];

// Data Metode Pembayaran
const paymentMethods = {
  ewallet: [
    { id: "qris", name: "QRIS", image: "assets/qris_icon.png" },
    { id: "dana", name: "DANA", image: "assets/dana_icon.png" },
    { id: "shopeepay", name: "ShopeePay", image: "assets/shopeepay_icon.png" }
  ],
  bank: [
    { id: "bca", name: "BCA", image: "assets/bca_icon.png" },
    { id: "bri", name: "BRI", image: "assets/bri_icon.png" }
  ],
  retail: [
    { id: "alfamart", name: "Alfamart", image: "assets/alfamart_icon.png" },
    { id: "indomaret", name: "Indomaret", image: "assets/indomaret_icon.png" }
  ],
  pulsa: [
    { id: "tri", name: "Tri", image: "assets/tri_icon.png" },
    { id: "telkomsel", name: "Telkomsel", image: "assets/telkomsel_icon.png" },
    { id: "xl", name: "XL", image: "assets/xl_icon.png" },
    { id: "indosat", name: "Indosat", image: "assets/indosat_icon.png" }
  ]
};

// Variabel Global
let selectedProduct = null;
let selectedPayment = null;
const TAX_RATE = 0.1;

// Load produk ke halaman
function loadProducts() {
  const produkList = document.getElementById('produkList');
  produkList.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'produk-card';
    card.dataset.id = product.id;
    card.dataset.price = product.price;

    let badge = '';
    if (product.bestSeller) badge = '<div class="badge">Best Value</div>';
    else if (product.popular) badge = '<div class="badge">Populer</div>';

    card.innerHTML = `
      ${badge}
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Rp ${product.price.toLocaleString('id-ID')}</p>
    `;

    card.addEventListener('click', () => selectProduct(card, product));
    produkList.appendChild(card);
  });
}

// Pilih produk
function selectProduct(element, product) {
  document.querySelectorAll('.produk-card').forEach(card => card.classList.remove('selected'));
  element.classList.add('selected');
  selectedProduct = product;
  updateSummary();
}

// Ringkasan Pembayaran
function updateSummary() {
  const price = selectedProduct?.price || 0;
  const tax = Math.round(price * TAX_RATE);
  const total = price + tax;

  document.getElementById('selectedProduct').textContent = selectedProduct?.name || "-";
  document.getElementById('productPrice').textContent = `Rp ${price.toLocaleString('id-ID')}`;
  document.getElementById('taxAmount').textContent = `Rp ${tax.toLocaleString('id-ID')}`;
  document.getElementById('totalPayment').textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// Validasi Form
function validateForm() {
  const id = document.getElementById('playerId').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!id) return alert("Masukkan ID Anda");
  if (!/^\S+@\S+\.\S+$/.test(email)) return alert("Masukkan email yang valid");
  if (!selectedProduct) return alert("Pilih produk terlebih dahulu");
  if (!selectedPayment) return alert("Pilih metode pembayaran");

  return true;
}

// Proses Checkout
function processCheckout() {
  if (!validateForm()) return;

  const price = selectedProduct.price;
  const tax = Math.round(price * TAX_RATE);
  const total = price + tax;

  const order = {
    playerId: document.getElementById('playerId').value,
    email: document.getElementById('email').value,
    whatsapp: document.getElementById('whatsapp').value || null,
    product: selectedProduct.name,
    price,
    tax,
    total,
    paymentMethod: selectedPayment.name,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem('orderData', JSON.stringify(order));
  window.location.href = "../pembayaran.html";
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();

  // Tab Button Event
  document.querySelectorAll('.tab-button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // Load metode pembayaran
  for (const tab in paymentMethods) {
    const container = document.getElementById(tab);
    if (!container) continue;

    const row = document.createElement('div');
    row.className = 'card-payment-row';

    paymentMethods[tab].forEach(method => {
      const label = document.createElement('label');
      label.className = 'card-payment';
      label.innerHTML = `
        <input type="radio" name="metodePembayaran" value="${method.id}">
        <img src="${method.image}" alt="${method.name}">
        <span>${method.name}</span>
      `;

      label.querySelector('input').addEventListener('change', () => {
        selectedPayment = method;
        updateSummary();
      });

      row.appendChild(label);
    });

    container.appendChild(row);
  }

  // Checkout Button
  document.getElementById('checkoutBtn').addEventListener('click', processCheckout);
});