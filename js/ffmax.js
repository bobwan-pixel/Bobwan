// FFMAX JS yang diadaptasi dari COC
// DATA PRODUK
const products = [
  { id: 1, name: "5 Diamonds", price: 10000, image: "assets/ffmax_diamond.png", bestSeller: true, bonus: "+5% Free" },
  { id: 2, name: "12 Diamonds", price: 20000, image: "assets/ffmax_diamond.png", bonus: "+8% Free" },
  { id: 3, name: "50 Diamonds", price: 50000, image: "assets/ffmax_diamond.png", popular: true, bonus: "+10% Free" },
  { id: 4, name: "70 Diamonds", price: 70000, image: "assets/ffmax_diamond.png", bonus: "+12% Free" }
];

// METODE PEMBAYARAN
const paymentMethods = [
  { id: "qris", name: "QRIS", image: "assets/payment/qris.png" },
  { id: "dana", name: "DANA", image: "assets/payment/dana.png" },
  { id: "gopay", name: "GoPay", image: "assets/payment/gopay.png" },
  { id: "ovo", name: "OVO", image: "assets/payment/ovo.png" },
  { id: "shopeepay", name: "ShopeePay", image: "assets/payment/shopeepay.png" },
  { id: "bca", name: "BCA", image: "assets/payment/bca.png" }
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
      badge = '<div class="badge best-seller">Best Value</div>';
    } else if (product.popular) {
      badge = '<div class="badge popular">Popular</div>';
    }

    productCard.innerHTML = `
      ${badge}
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>Rp ${product.price.toLocaleString('id-ID')}</p>
      <small>${product.bonus}</small>
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
  const maxBonusElement = document.getElementById('maxBonus');
  const totalPaymentElement = document.getElementById('totalPayment');

  if (selectedProduct) {
    productSummary.textContent = selectedProduct.name;
    const price = selectedProduct.price;
    const bonusText = selectedProduct.bonus || "+0% Free";

    productPriceElement.textContent = `Rp ${price.toLocaleString('id-ID')}`;
    maxBonusElement.textContent = bonusText;
    totalPaymentElement.textContent = `Rp ${price.toLocaleString('id-ID')}`;
  }
}

function validateForm() {
  const playerId = document.getElementById('playerId').value.trim();
  const email = document.getElementById('email').value.trim();

  if (!playerId) {
    alert('Please enter your Free Fire MAX ID');
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
      game: "Free Fire MAX",
      playerId: document.getElementById('playerId').value.trim(),
      product: selectedProduct.name,
      productPrice: selectedProduct.price,
      bonus: selectedProduct.bonus,
      paymentMethod: selectedPayment.name,
      paymentMethodId: selectedPayment.id,
      email: document.getElementById('email').value.trim(),
      whatsapp: document.getElementById('whatsapp').value.trim() || null,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('ffmaxOrderData', JSON.stringify(orderData));
    window.location.href = "payment.html";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  loadPaymentMethods();
  document.getElementById('checkoutBtn').addEventListener('click', processCheckout);
});