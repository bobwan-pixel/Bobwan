// DATA PRODUK
const products = [
  { id: 1, name: "500 Gems", price: 15000, image: "../asset/g/coc/gems.png", bestSeller: true },
  { id: 2, name: "1200 Gems", price: 30000, image: "../asset/g/coc/gems.png" },
  { id: 3, name: "2500 Gems", price: 75000, image: "../asset/g/coc/gems.png", popular: true },
  { id: 4, name: "6500 Gems", price: 150000, image: "../asset/g/coc/gems.png" }
];

// METODE PEMBAYARAN
const paymentMethods = [
  { id: "qris", name: "QRIS", image: "../asset/payment/qris.png" },
  { id: "dana", name: "DANA", image: "../asset/payment/dana.png" },
  { id: "gopay", name: "GoPay", image: "../asset/payment/gopay.png" },
  { id: "ovo", name: "OVO", image: "../asset/payment/ovo.png" },
  { id: "shopeepay", name: "ShopeePay", image: "../asset/payment/shopeepay.png" },
  { id: "bca", name: "BCA", image: "../asset/payment/bca.png" }
];

// GLOBAL VAR
let selectedProduct = null;
let selectedPayment = null;
const TAX_RATE = 0.1;

// LOAD PRODUK
function loadProducts() {
  const produkList = document.getElementById('produkList');
  produkList.innerHTML = '';

  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'produk-card';
    productCard.dataset.id = product.id;
    productCard.dataset.price = product.price;

    let badge = '';
    if (product.bestSeller) {
      badge = '<div class="badge best-seller">Best Value</div>';
    } else if (product.popular) {
      badge = '<div class="badge popular">Populer</div>';
    }

    productCard.innerHTML = `
      ${badge}
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Rp ${product.price.toLocaleString('id-ID')}</p>
    `;

    productCard.addEventListener('click', () => selectProduct(productCard, product));
    produkList.appendChild(productCard);
  });
}

function selectProduct(element, product) {
  document.querySelectorAll('.produk-card').forEach(card => card.classList.remove('selected'));
  element.classList.add('selected');
  selectedProduct = product;
  updateSummary();
}

// LOAD PAYMENT
function loadPaymentMethods() {
  const container = document.getElementById('paymentMethods');
  container.innerHTML = '';

  paymentMethods.forEach(method => {
    const el = document.createElement('div');
    el.className = 'payment-method';
    el.dataset.id = method.id;

    el.innerHTML = `
      <img src="${method.image}" alt="${method.name}">
      <span>${method.name}</span>
    `;

    el.addEventListener('click', () => selectPaymentMethod(el, method));
    container.appendChild(el);
  });
}

function selectPaymentMethod(el, method) {
  document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('selected'));
  el.classList.add('selected');
  selectedPayment = method;
  updateSummary();
}

function updateSummary() {
  const productSummary = document.getElementById('selectedProduct');
  const productPriceElement = document.getElementById('productPrice');
  const taxAmountElement = document.getElementById('taxAmount');
  const totalPaymentElement = document.getElementById('totalPayment');

  if (selectedProduct) {
    productSummary.textContent = selectedProduct.name;
    const price = selectedProduct.price;
    const tax = Math.round(price * TAX_RATE);
    const total = price + tax;

    productPriceElement.textContent = `Rp ${price.toLocaleString('id-ID')}`;
    taxAmountElement.textContent = `Rp ${tax.toLocaleString('id-ID')}`;
    totalPaymentElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
  }
}

function validateForm() {
  const playerTag = document.getElementById('playerTag').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!playerTag.match(/^#[A-Z0-9]{8}$/)) {
    alert('Player Tag harus diawali dengan # dan terdiri dari 8 karakter huruf kapital/angka.');
    return false;
  }

  if (!email.match(/^\S+@\S+\.\S+$/)) {
    alert('Masukkan email yang valid.');
    return false;
  }

  if (!selectedProduct) {
    alert('Silakan pilih produk.');
    return false;
  }

  if (!selectedPayment) {
    alert('Silakan pilih metode pembayaran.');
    return false;
  }

  return true;
}

function processCheckout() {
  if (validateForm()) {
    const price = selectedProduct.price;
    const tax = Math.round(price * TAX_RATE);
    const total = price + tax;

    const orderData = {
      game: "Clash of Clans",
      playerTag: document.getElementById('playerTag').value.trim(),
      product: selectedProduct.name,
      productPrice: price,
      tax: tax,
      total: total,
      paymentMethod: selectedPayment.name,
      paymentMethodId: selectedPayment.id,
      email: document.getElementById('email').value.trim(),
      whatsapp: document.getElementById('whatsapp').value.trim() || null,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('orderData', JSON.stringify(orderData));
    window.location.href = "../pembayaran.html";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadPaymentMethods();
  document.getElementById('checkoutBtn').addEventListener('click', processCheckout);
  document.getElementById('playerTag').addEventListener('input', function () {
    this.value = this.value.toUpperCase();
  });
});