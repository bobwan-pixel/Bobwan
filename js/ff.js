// Data Produk Free Fire
const products = [
  { id: 1, name: "70 Diamonds", price: 10000, image: "assets/g/ff/70dm.png", bestSeller: true },
  { id: 2, name: "140 Diamonds", price: 19000, image: "assets/g/ff/140dm.png" },
  { id: 3, name: "355 Diamonds", price: 48000, image: "assets/g/ff/355dm.png", popular: true },
  { id: 4, name: "720 Diamonds", price: 95000, image: "assets/g/ff/720dm.png" },
  { id: 5, name: "1000+100 Diamonds", price: 135000, image: "assets/g/ff/1100dm.png" },
  { id: 6, name: "Membership Weekly", price: 31000, image: "assets/g/ff/weekly.png" },
  { id: 7, name: "Membership Monthly", price: 125000, image: "assets/g/ff/monthly.png" }
];

// Metode Pembayaran
const paymentMethods = {
  ewallet: [
    { id: "qris", name: "QRIS", image: "assets/logo/qris.png" },
    { id: "dana", name: "DANA", image: "assets/logo/dana.png" },
    { id: "shopeepay", name: "ShopeePay", image: "assets/logo/shopeepay.png" },
    { id: "gopay", name: "GoPay", image: "assets/logo/gopay.png" },
    { id: "ovo", name: "OVO", image: "assets/logo/ovo.png" }
  ],
  bank: [
    { id: "bca", name: "BCA", image: "assets/logo/bca.png" },
    { id: "bri", name: "BRI", image: "assets/logo/bri.png" }
  ],
  retail: [
    { id: "alfamart", name: "Alfamart", image: "assets/logo/alfamart.png" },
    { id: "indomaret", name: "Indomaret", image: "assets/logo/indomaret.png" }
  ],
  pulsa: [
    { id: "telkomsel", name: "Telkomsel", image: "assets/logo/telkomsel.png" },
    { id: "tri", name: "Tri", image: "assets/logo/tri.png" }
  ]
};

let selectedProduct = null;
let selectedPayment = null;
const TAX_RATE = 0.1;

// Tampilkan produk
function loadProducts() {
  const list = document.getElementById('produkList');
  list.innerHTML = '';

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'produk-card';
    card.dataset.id = product.id;
    card.dataset.price = product.price;

    let badge = '';
    if (product.bestSeller) badge = '<div class="badge">Best Seller</div>';
    if (product.popular) badge = '<div class="badge">Populer</div>';

    card.innerHTML = `
      ${badge}
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Rp ${product.price.toLocaleString('id-ID')}</p>
    `;
    card.addEventListener('click', () => selectProduct(card, product));
    list.appendChild(card);
  });
}

function selectProduct(card, product) {
  document.querySelectorAll('.produk-card').forEach(el => el.classList.remove('selected'));
  card.classList.add('selected');
  selectedProduct = product;
  updateSummary();
}

function updateSummary() {
  const productSummary = document.getElementById('selectedProduct');
  const productPriceElement = document.getElementById('productPrice');
  const taxAmountElement = document.getElementById('taxAmount');
  const totalPaymentElement = document.getElementById('totalPayment');

  if (selectedProduct) {
    const tax = Math.round(selectedProduct.price * TAX_RATE);
    const total = selectedProduct.price + tax;

    productSummary.textContent = selectedProduct.name;
    productPriceElement.textContent = `Rp ${selectedProduct.price.toLocaleString('id-ID')}`;
    taxAmountElement.textContent = `Rp ${tax.toLocaleString('id-ID')}`;
    totalPaymentElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;

    document.getElementById('checkoutBtn').querySelector('.button-price').textContent = 
      `Rp ${total.toLocaleString('id-ID')}`;
  } else {
    productSummary.textContent = "-";
    productPriceElement.textContent = "Rp 0";
    taxAmountElement.textContent = "Rp 0";
    totalPaymentElement.textContent = "Rp 0";
  }
}

function validateForm() {
  const playerId = document.getElementById('playerId').value;
  const email = document.getElementById('email').value;

  if (!playerId) return alert("Masukkan Player ID"), false;
  if (!email.match(/^\S+@\S+\.\S+$/)) return alert("Masukkan email yang valid"), false;
  if (!selectedProduct) return alert("Pilih produk"), false;
  if (!selectedPayment) return alert("Pilih metode pembayaran"), false;

  return true;
}

function processCheckout() {
  if (!validateForm()) return;

  const tax = Math.round(selectedProduct.price * TAX_RATE);
  const total = selectedProduct.price + tax;

  const data = {
    game: "Free Fire",
    playerId: document.getElementById('playerId').value,
    email: document.getElementById('email').value,
    whatsapp: document.getElementById('whatsapp').value || null,
    product: selectedProduct.name,
    price: selectedProduct.price,
    tax: tax,
    total: total,
    payment: selectedPayment.name,
    payment_id: selectedPayment.id,
    timestamp: new Date().toISOString()
  };

  localStorage.setItem("checkoutData", JSON.stringify(data));
  window.location.href = "../pembayaran.html";
}

// Inisialisasi
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  // Tab button (jika ada)
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      const tabId = button.dataset.tab;
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Payment select
  document.querySelectorAll('.card-payment input').forEach(input => {
    input.addEventListener('change', () => {
      const methodId = input.value;
      for (let group in paymentMethods) {
        const found = paymentMethods[group].find(p => p.id === methodId);
        if (found) {
          selectedPayment = found;
          updateSummary();
          break;
        }
      }
    });
  });

  document.getElementById('checkoutBtn').addEventListener('click', processCheckout);
});