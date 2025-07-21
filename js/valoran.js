// VALORAN.JS dengan struktur COC
// DATA PRODUK
const products = [
  { id: 1, name: "125 VP", price: 15000, image: "assets/vp_icon.png", bestSeller: true },
  { id: 2, name: "420 VP", price: 50000, image: "assets/vp_icon.png" },
  { id: 3, name: "700 VP", price: 80000, image: "assets/vp_icon.png", popular: true },
  { id: 4, name: "1375 VP", price: 150000, image: "assets/vp_icon.png" }
];

// METODE PEMBAYARAN
const paymentMethods = [
  { id: "qris", name: "QRIS", image: "assets/qris_icon.png" },
  { id: "dana", name: "DANA", image: "assets/dana_icon.png" },
  { id: "gopay", name: "GoPay", image: "assets/gopay_icon.png" },
  { id: "ovo", name: "OVO", image: "assets/ovo_icon.png" },
  { id: "shopeepay", name: "ShopeePay", image: "assets/shopeepay_icon.png" },
  { id: "bca", name: "BCA", image: "assets/bca_icon.png" }
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
      badge = '<div class="badge popular">Popular</div>';
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
  const playerId = document.getElementById('playerId').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!playerId.match(/^.+#.+$/)) {
    alert('Riot ID must be in format Username#Tag');
    return false;
  }

  if (!email.match(/^\S+@\S+\.\S+$/)) {
    alert('Please enter a valid email address');
    return false;
  }

  if (!selectedProduct) {
    alert('Please select a Valorant Points package');
    return false;
  }

  if (!selectedPayment) {
    alert('Please select a payment method');
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
      game: "Valorant",
      playerId: document.getElementById('playerId').value.trim(),
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
    window.location.href = "payment.html";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadPaymentMethods();
  document.getElementById('checkoutBtn').addEventListener('click', processCheckout);
});