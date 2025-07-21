// Data produk Roblox
const robloxProducts = [
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

// Variabel global
let selectedProduct = null;
let selectedPrice = 0;

// Fungsi untuk menampilkan produk
function displayProducts() {
  const produkList = document.getElementById('produkList');
  produkList.innerHTML = '';

  robloxProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'produk-card';
    productCard.setAttribute('data-harga', product.price);
    productCard.innerHTML = `
      ${product.badge ? `<div class="badge">${product.badge}</div>` : ''}
      <img src="${product.image}" alt="${product.name}">
      <span>${product.name}</span>
      <span class="harga">${formatCurrency(product.price)}</span>
    `;
    produkList.appendChild(productCard);
  });

  addProductEventListeners();
}

// Fungsi untuk menambahkan event listener ke produk
function addProductEventListeners() {
  const productCards = document.querySelectorAll('.produk-card');
  
  productCards.forEach(card => {
    card.addEventListener('click', function() {
      productCards.forEach(c => c.classList.remove('selected'));
      this.classList.add('selected');
      
      const productName = this.querySelector('span:first-child').textContent;
      const productPrice = parseInt(this.getAttribute('data-harga'));
      
      selectedProduct = productName;
      selectedPrice = productPrice;
      
      updateSummary();
    });
  });
}

// Fungsi untuk update ringkasan pembayaran
function updateSummary() {
  const selectedProductEl = document.getElementById('selectedProduct');
  const productPriceEl = document.getElementById('productPrice');
  const taxAmountEl = document.getElementById('taxAmount');
  const totalPaymentEl = document.getElementById('totalPayment');
  
  if (selectedProduct) {
    selectedProductEl.textContent = selectedProduct;
    productPriceEl.textContent = formatCurrency(selectedPrice);
    
    const tax = Math.round(selectedPrice * 0.1);
    taxAmountEl.textContent = formatCurrency(tax);
    
    const total = selectedPrice + tax;
    totalPaymentEl.textContent = formatCurrency(total);
  } else {
    selectedProductEl.textContent = '-';
    productPriceEl.textContent = 'Rp 0';
    taxAmountEl.textContent = 'Rp 0';
    totalPaymentEl.textContent = 'Rp 0';
  }
}

// Fungsi helper untuk format mata uang
function formatCurrency(amount) {
  return 'Rp ' + amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

// Fungsi untuk inisialisasi tab pembayaran
function initPaymentTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
      
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      document.getElementById(tabId).classList.add('active');
    });
  });
}

// Fungsi untuk handle checkout dan redirect ke pembayaran.html
function handleCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  checkoutBtn.addEventListener('click', function() {
    const username = document.getElementById('username').value;
    const deliveryMethod = document.getElementById('deliveryMethod').value;
    const additionalInfo = document.getElementById('additionalInfo').value;
    const email = document.getElementById('email').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const paymentMethod = document.querySelector('input[name="metodePembayaran"]:checked');
    
    // Validasi form
    if (!username) {
      alert('Silakan masukkan Username Roblox');
      return;
    }
    
    if (!deliveryMethod) {
      alert('Silakan pilih metode pengiriman');
      return;
    }
    
    if (!additionalInfo) {
      alert('Silakan isi informasi tambahan');
      return;
    }
    
    if (!selectedProduct) {
      alert('Silakan pilih produk');
      return;
    }
    
    if (!paymentMethod) {
      alert('Silakan pilih metode pembayaran');
      return;
    }
    
    if (!email) {
      alert('Silakan masukkan email Anda');
      return;
    }
    
    // Prepare order data
    const orderData = {
      game: 'Roblox',
      username: username,
      deliveryMethod: deliveryMethod,
      additionalInfo: additionalInfo,
      product: selectedProduct,
      price: selectedPrice,
      tax: Math.round(selectedPrice * 0.1),
      total: selectedPrice + Math.round(selectedPrice * 0.1),
      paymentMethod: paymentMethod.value,
      email: email,
      whatsapp: whatsapp || '',
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('orderData', JSON.stringify(orderData));
    window.location.href = "pembayaran.html";
  });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  displayProducts();
  initPaymentTabs();
  handleCheckout();
});