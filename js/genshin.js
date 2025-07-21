// Data Produk Genshin Impact
const products = [
  { id: 1, name: "60 Genesis Crystals", price: 15000, image: "assets/genshin_crystal.png", bestSeller: true },
  { id: 2, name: "300+30 Genesis Crystals", price: 74000, image: "assets/genshin_crystal.png" },
  { id: 3, name: "980+110 Genesis Crystals", price: 239000, image: "assets/genshin_crystal.png", popular: true },
  { id: 4, name: "1980+260 Genesis Crystals", price: 479000, image: "assets/genshin_crystal.png" },
  { id: 5, name: "3280+600 Genesis Crystals", price: 799000, image: "assets/genshin_crystal.png" },
  { id: 6, name: "6480+1600 Genesis Crystals", price: 1500000, image: "assets/genshin_crystal.png" }
];

// Metode Pembayaran
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

function selectProduct(element, product) {
  document.querySelectorAll('.produk-card').forEach(card => {
    card.classList.remove('selected');
  });

  element.classList.add('selected');
  selectedProduct = product;
  updateSummary();
}

function updateSummary() {
  const productSummary = document.getElementById('selectedProduct');
  const productPriceElement = document.getElementById('productPrice');
  const taxAmountElement = document.getElementById('taxAmount');
  const totalPaymentElement = document.getElementById('totalPayment');

  if (selectedProduct) {
    const productPrice = selectedProduct.price;
    const tax = Math.round(productPrice * TAX_RATE);
    const total = productPrice + tax;

    productSummary.textContent = selectedProduct.name;
    productPriceElement.textContent = `Rp ${productPrice.toLocaleString('id-ID')}`;
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

function processCheckout() {
  if (validateForm()) {
    const productPrice = selectedProduct.price;
    const tax = Math.round(productPrice * TAX_RATE);
    const total = productPrice + tax;

    const orderData = {
      uid: document.getElementById('uid').value,
      server: document.getElementById('server').value,
      product: selectedProduct.name,
      productPrice,
      tax,
      total,
      paymentMethod: selectedPayment.name,
      email: document.getElementById('email').value,
      whatsapp: document.getElementById('whatsapp').value || null,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('orderData', JSON.stringify(orderData));
    window.location.href = '../pembayaran.html';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();

  document.querySelectorAll('.card-payment input').forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.checked) {
        const methodId = this.value;
        for (const group in paymentMethods) {
          const method = paymentMethods[group].find(m => m.id === methodId);
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