// BS.JS with COC structure
// DATA PRODUK
const products = [
  { id: 1, name: "100 Diamonds", price: 0.99, image: "assets/diamond_icon.png", bonus: "+5%", bestSeller: true },
  { id: 2, name: "500 Diamonds", price: 4.99, image: "assets/diamond_icon.png", bonus: "+10%" },
  { id: 3, name: "1200 Diamonds", price: 9.99, image: "assets/diamond_icon.png", bonus: "+15%" },
  { id: 4, name: "2500 Diamonds", price: 19.99, image: "assets/diamond_icon.png", bonus: "+20%" }
];

// METODE PEMBAYARAN
const paymentMethods = [
  { id: "paypal", name: "PayPal", image: "assets/paypal_icon.png" },
  { id: "skrill", name: "Skrill", image: "assets/skrill_icon.png" },
  { id: "visa", name: "Visa", image: "assets/visa_icon.png" },
  { id: "mastercard", name: "Mastercard", image: "assets/mastercard_icon.png" },
  { id: "bitcoin", name: "Bitcoin", image: "assets/bitcoin_icon.png" },
  { id: "ethereum", name: "Ethereum", image: "assets/ethereum_icon.png" }
];

// GLOBAL VAR
let selectedProduct = null;
let selectedPayment = null;

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
      badge = '<div class="badge">BEST</div>';
    }

    productCard.innerHTML = `
      ${badge}
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <small>${product.bonus} Bonus</small>
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
  const bloodBonusElement = document.getElementById('bloodBonus');
  const totalPaymentElement = document.getElementById('totalPayment');

  if (selectedProduct) {
    productSummary.textContent = selectedProduct.name;
    productPriceElement.textContent = `$${selectedProduct.price.toFixed(2)}`;
    bloodBonusElement.textContent = selectedProduct.bonus;
    totalPaymentElement.textContent = `$${selectedProduct.price.toFixed(2)}`;
  }
}

function validateForm() {
  const playerId = document.getElementById('playerId').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!playerId) {
    alert('Please enter your Player ID');
    return false;
  }

  if (!email.match(/^\S+@\S+\.\S+$/)) {
    alert('Please enter a valid email address');
    return false;
  }

  if (!selectedProduct) {
    alert('Please select a diamond package');
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
    const orderData = {
      game: "Blood Strike",
      playerId: document.getElementById('playerId').value.trim(),
      product: selectedProduct.name,
      price: selectedProduct.price,
      bonus: selectedProduct.bonus,
      paymentMethod: selectedPayment.name,
      email: document.getElementById('email').value.trim(),
      whatsapp: document.getElementById('whatsapp').value.trim() || null,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('bloodStrikeOrder', JSON.stringify(orderData));
    window.location.href = "payment.html";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadPaymentMethods();
  document.getElementById('checkoutBtn').addEventListener('click', processCheckout);
});