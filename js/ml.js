// Data produk Mobile Legends
const products = [
  { id: 1, name: "86 Diamonds", price: 20000, image: "assets/ml_diamonds.png", bestSeller: true },
  { id: 2, name: "172 Diamonds", price: 40000, image: "assets/ml_diamonds.png" },
  { id: 3, name: "257 Diamonds", price: 60000, image: "assets/ml_diamonds.png", popular: true },
  { id: 4, name: "344 Diamonds", price: 80000, image: "assets/ml_diamonds.png" },
  { id: 5, name: "429 Diamonds", price: 100000, image: "assets/ml_diamonds.png" },
  { id: 6, name: "514 Diamonds", price: 120000, image: "assets/ml_diamonds.png" }
];

// Variabel Global
let selectedProduct = null;
let selectedPayment = null;
const TAX_RATE = 0.1; // Pajak 10%

// Fungsi untuk menampilkan produk
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

// Fungsi pilih produk
function selectProduct(element, product) {
  document.querySelectorAll('.produk-card').forEach(card => {
    card.classList.remove('selected');
  });
  element.classList.add('selected');
  selectedProduct = product;
  updateSummary();
}

// Fungsi ringkasan
function updateSummary() {
  const productSummary = document.getElementById('selectedProduct');
  const productPriceElement = document.getElementById('productPrice');
  const taxAmountElement = document.getElementById('taxAmount');
  const totalPaymentElement = document.getElementById('totalPayment');
  const checkoutButtonPrice = document.querySelector('.button-price');

  if (selectedProduct) {
    productSummary.textContent = selectedProduct.name;

    const productPrice = selectedProduct.price;
    const taxAmount = Math.round(productPrice * TAX_RATE);
    const totalPayment = productPrice + taxAmount;

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
  const userId = document.getElementById('userId').value;
  const zoneId = document.getElementById('zoneId').value;
  const email = document.getElementById('email').value;

  if (!userId) {
    alert('Masukkan User ID Anda');
    return false;
  }

  if (!zoneId) {
    alert('Masukkan Zone ID Anda');
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
      game: "Mobile Legends",
      userId: document.getElementById('userId').value,
      zoneId: document.getElementById('zoneId').value,
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

// Tab & Metode Pembayaran
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