// Data Produk Honkai: Star Rail
const products = [
  { id: 1, name: "60 Oneiric Shards", price: 15000, image: "assets/honkai_60os.png", bestSeller: true },
  { id: 2, name: "300 Oneiric Shards", price: 30000, image: "assets/honkai_300os.png" },
  { id: 3, name: "980 Oneiric Shards", price: 60000, image: "assets/honkai_980os.png", popular: true },
  { id: 4, name: "1980 Oneiric Shards", price: 150000, image: "assets/honkai_1980os.png" },
  { id: 5, name: "3280 Oneiric Shards", price: 300000, image: "assets/honkai_3280os.png" },
  { id: 6, name: "6480 Oneiric Shards", price: 600000, image: "assets/honkai_6480os.png" },
  { id: 7, name: "Express Supply Pass", price: 75000, image: "assets/honkai_supply.png" },
  { id: 8, name: "Nameless Honor", price: 150000, image: "assets/honkai_honor.png" }
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
  ]
};

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
    if (product.bestSeller) {
      badge = '<div class="badge">Best Value</div>';
    } else if (product.popular) {
      badge = '<div class="badge">Populer</div>';
    }

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

// Update ringkasan
function updateSummary() {
  const productSummary = document.getElementById('selectedProduct');
  const productPriceEl = document.getElementById('productPrice');
  const taxAmountEl = document.getElementById('taxAmount');
  const totalPaymentEl = document.getElementById('totalPayment');

  if (selectedProduct) {
    const tax = Math.round(selectedProduct.price * TAX_RATE);
    const total = selectedProduct.price + tax;

    productSummary.textContent = selectedProduct.name;
    productPriceEl.textContent = `Rp ${selectedProduct.price.toLocaleString('id-ID')}`;
    taxAmountEl.textContent = `Rp ${tax.toLocaleString('id-ID')}`;
    totalPaymentEl.textContent = `Rp ${total.toLocaleString('id-ID')}`;

    document.getElementById('checkoutBtn').querySelector('.button-price').textContent =
      `Rp ${total.toLocaleString('id-ID')}`;
  } else {
    productSummary.textContent = "-";
    productPriceEl.textContent = "Rp 0";
    taxAmountEl.textContent = "Rp 0";
    totalPaymentEl.textContent = "Rp 0";
  }
}

// Validasi form sebelum checkout
function validateForm() {
  const uid = document.getElementById('uid').value;
  const server = document.getElementById('server').value;
  const email = document.getElementById('email').value;

  if (!uid) {
    alert('Masukkan UID Anda');
    return false;
  }
  if (!server) {
    alert('Pilih server Anda');
    return false;
  }
  if (!email.match(/^\S+@\S+\.\S+$/)) {
    alert('Masukkan email yang valid');
    return false;
  }
  if (!selectedProduct) {
    alert('Pilih produk terlebih dahulu');
    return false;
  }
  if (!selectedPayment) {
    alert('Pilih metode pembayaran terlebih dahulu');
    return false;
  }
  return true;
}

// Proses checkout
function processCheckout() {
  if (validateForm()) {
    const tax = Math.round(selectedProduct.price * TAX_RATE);
    const total = selectedProduct.price + tax;

    const orderData = {
      game: "Honkai: Star Rail",
      uid: document.getElementById('uid').value,
      server: document.getElementById('server').value,
      product: selectedProduct.name,
      productPrice: selectedProduct.price,
      tax,
      total,
      paymentMethod: selectedPayment.name,
      email: document.getElementById('email').value,
      whatsapp: document.getElementById('whatsapp').value || '',
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('orderData', JSON.stringify(orderData));
    window.location.href = "../pembayaran.html";
  }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();

  document.querySelectorAll('.card-payment input').forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.checked) {
        for (const group in paymentMethods) {
          const method = paymentMethods[group].find(m => m.id === this.value);
          if (method) {
            selectedPayment = method;
            updateSummary();
            break;
          }
        }
      }
    });
  });

  document.getElementById('checkoutBtn').addEventListener('click', processCheckout);
});