// Data Produk PUBG Mobile
const products = [
  { id: 1, name: "60 UC", price: 12000, image: "assets/pubgm_uc.png", bestSeller: true },
  { id: 2, name: "300+25 UC", price: 60000, image: "assets/pubgm_uc.png" },
  { id: 3, name: "600+60 UC", price: 120000, image: "assets/pubgm_uc.png", popular: true },
  { id: 4, name: "1500+300 UC", price: 300000, image: "assets/pubgm_uc.png" },
  { id: 5, name: "3000+850 UC", price: 600000, image: "assets/pubgm_uc.png" }
];

// Variabel global
let selectedProduct = null;
let selectedPayment = null;
const TAX_RATE = 0.1;

// Tampilkan produk
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
      badge = '<div class="badge">Best Value</div>';
    } else if (product.popular) {
      badge = '<div class="badge">Populer</div>';
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

// Pilih produk
function selectProduct(element, product) {
  document.querySelectorAll('.produk-card').forEach(card => {
    card.classList.remove('selected');
  });
  element.classList.add('selected');
  selectedProduct = product;
  updateSummary();
}

// Update ringkasan pembayaran
function updateSummary() {
  const productSummary = document.getElementById('selectedProduct');
  const productPriceElement = document.getElementById('productPrice');
  const taxAmountElement = document.getElementById('taxAmount');
  const totalPaymentElement = document.getElementById('totalPayment');
  const checkoutButtonPrice = document.querySelector('.button-price');

  if (selectedProduct) {
    const productPrice = selectedProduct.price;
    const taxAmount = Math.round(productPrice * TAX_RATE);
    const totalPayment = productPrice + taxAmount;

    productSummary.textContent = selectedProduct.name;
    productPriceElement.textContent = `Rp ${productPrice.toLocaleString('id-ID')}`;
    taxAmountElement.textContent = `Rp ${taxAmount.toLocaleString('id-ID')}`;
    totalPaymentElement.textContent = `Rp ${totalPayment.toLocaleString('id-ID')}`;
    if (checkoutButtonPrice) {
      checkoutButtonPrice.textContent = `Rp ${totalPayment.toLocaleString('id-ID')}`;
    }
  } else {
    productSummary.textContent = "-";
    productPriceElement.textContent = "Rp 0";
    taxAmountElement.textContent = "Rp 0";
    totalPaymentElement.textContent = "Rp 0";
    if (checkoutButtonPrice) {
      checkoutButtonPrice.textContent = "Rp 0";
    }
  }
}

// Validasi form
function validateForm() {
  const playerId = document.getElementById('playerId').value;
  const email = document.getElementById('email').value;

  if (!playerId) {
    alert('Masukkan Player ID Anda');
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
    const productPrice = selectedProduct.price;
    const taxAmount = Math.round(productPrice * TAX_RATE);
    const totalPayment = productPrice + taxAmount;

    const orderData = {
      game: "PUBG Mobile",
      playerId: document.getElementById('playerId').value,
      product: selectedProduct.name,
      productPrice: productPrice,
      tax: taxAmount,
      total: totalPayment,
      paymentMethod: selectedPayment.name,
      email: document.getElementById('email').value,
      whatsapp: document.getElementById('whatsapp').value || null,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('orderData', JSON.stringify(orderData));
    window.location.href = "pembayaran.html";
  }
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();

  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      const tabId = button.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });

  document.querySelectorAll('.card-payment input').forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.checked) {
        const methodId = this.value;
        let method;

        for (const group of ['ewallet', 'bank', 'retail']) {
          method = paymentMethods[group].find(m => m.id === methodId);
          if (method) break;
        }

        selectedPayment = method;
        updateSummary();
      }
    });
  });

  document.getElementById('checkoutBtn').addEventListener('click', processCheckout);
});