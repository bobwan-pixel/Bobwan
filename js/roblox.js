let selectedProduct = null;
let selectedPayment = null;

const Products = [
  {
    id: 1,
    name: "80 Robux",
    price: 10000,
    image: "../asset/produk/robux_80.png"
  },
  {
    id: 2,
    name: "400 Robux",
    price: 50000,
    image: "../asset/produk/robux_400.png"
  },
  {
    id: 3,
    name: "800 Robux",
    price: 100000,
    image: "../asset/produk/robux_800.png"
  },
  {
    id: 4,
    name: "2000 Robux",
    price: 250000,
    image: "../asset/produk/robux_2000.png"
  },
  {
    id: 5,
    name: "4000 Robux",
    price: 500000,
    image: "../asset/produk/robux_4000.png"
  },
  {
    id: 6,
    name: "8000 Robux",
    price: 1000000,
    image: "../asset/produk/robux_8000.png"
  },
  {
    id: 7,
    name: "Premium 1 Bulan",
    price: 150000,
    image: "../asset/produk/robux_premium.png",
    badge: "BEST"
  }
];

// Metode Pembayaran
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

// Load daftar produk
function loadProducts() {
  const produkList = document.getElementById('produkList');
  if (!produkList) return;

  produkList.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'produk-card';
    card.dataset.id = product.id;
    card.dataset.price = product.price;

    let badge = '';
    if (product.bestSeller) badge = '<div class="badge">Best Value</div>';

    card.innerHTML = `
      ${badge}
      <img src="${product.image}" alt="${product.name}" onerror="this.src='../asset/icon/fallback.png'">
      <h3>${product.name}</h3>
      <p>Rp ${product.price.toLocaleString('id-ID')}</p>
    `;

    card.addEventListener('click', () => selectProduct(card, product));
    produkList.appendChild(card);
  });
}

// Pilih produk
function selectProduct(card, product) {
  document.querySelectorAll('.produk-card').forEach(el => el.classList.remove('selected'));
  card.classList.add('selected');
  selectedProduct = product;
  updateSummary();
}

// Tampilkan ringkasan
function updateSummary() {
  const price = selectedProduct?.price || 0;
  const tax = Math.round(price * 0.1); // Pajak 10%
  const total = price + tax;

  document.getElementById('selectedProduct').textContent = selectedProduct?.name || "-";
  document.getElementById('productPrice').textContent = `Rp ${price.toLocaleString('id-ID')}`;
  document.getElementById('taxAmount').textContent = `Rp ${tax.toLocaleString('id-ID')}`;
  document.getElementById('totalPayment').textContent = `Rp ${total.toLocaleString('id-ID')}`;
}

// Load metode pembayaran
function loadPaymentMethods() {
  for (const group in paymentMethods) {
    const container = document.getElementById(group);
    if (!container) continue;

    const row = document.createElement('div');
    row.className = 'card-payment-row';

    paymentMethods[group].forEach(method => {
      const label = document.createElement('label');
      label.className = 'card-payment';
      label.innerHTML = `
        <input type="radio" name="metodePembayaran" value="${method.id}">
        <img src="${method.image}" alt="${method.name}" onerror="this.src='../asset/logo/fallback.png'">
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
}

// Checkout
function processCheckout(e) {
  e.preventDefault();

  if (!selectedProduct || !selectedPayment) {
    alert("Silakan pilih produk dan metode pembayaran.");
    return;
  }

  // Simulasi redirect ke pembayaran
  window.location.href = "../pembayaran.html";
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadPaymentMethods();
  document.getElementById('checkoutBtn').addEventListener('click', processCheckout);

  // Tab switching functionality
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.dataset.tab;
      
      // Update active tab button
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Update active tab content
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });
});