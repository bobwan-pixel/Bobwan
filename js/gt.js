// Data produk Growtopia
const growtopiaProducts = [
  // Paket Gems
  {
    id: 1,
    name: "10.000 Gems",
    price: 10000,
    image: "../asset/produk/gt_gems1.png"
  },
  {
    id: 2,
    name: "25.000 Gems",
    price: 25000,
    image: "../asset/produk/gt_gems2.png"
  },
  {
    id: 3,
    name: "50.000 Gems",
    price: 50000,
    image: "../asset/produk/gt_gems3.png"
  },
  {
    id: 4,
    name: "100.000 Gems",
    price: 100000,
    image: "../asset/produk/gt_gems4.png"
  },
  {
    id: 5,
    name: "250.000 Gems",
    price: 250000,
    image: "../asset/produk/gt_gems5.png"
  },
  {
    id: 6,
    name: "500.000 Gems",
    price: 500000,
    image: "../asset/produk/gt_gems6.png"
  },
  {
    id: 7,
    name: "1.000.000 Gems",
    price: 1000000,
    image: "../asset/produk/gt_gems7.png"
  },
  
  // Paket Lock
  {
    id: 8,
    name: "World Lock",
    price: 1000000,
    image: "../asset/produk/gt_worldlock.png",
    badge: "HOT"
  },
  {
    id: 9,
    name: "Diamond Lock",
    price: 1500000,
    image: "../asset/produk/gt_diamondlock.png",
    badge: "NEW"
  },
  {
    id: 10,
    name: "Blue Gem Lock",
    price: 1200000,
    image: "../asset/produk/gt_bluegemlock.png",
    badge: "LIMITED"
  }
];

// Variabel global
let selectedProduct = null;
let selectedPrice = 0;

// Fungsi untuk menampilkan produk
function displayProducts() {
  const produkList = document.getElementById('produkList');
  produkList.innerHTML = '';

  growtopiaProducts.forEach(product => {
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

// Fungsi untuk handle checkout
function handleCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  checkoutBtn.addEventListener('click', function() {
    const growid = document.getElementById('growid').value;
    const world = document.getElementById('world').value;
    const email = document.getElementById('email').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const paymentMethod = document.querySelector('input[name="metodePembayaran"]:checked');
    
    // Validasi form
    if (!growid) {
      alert('Silakan masukkan GrowID Anda');
      return;
    }
    
    if (!world) {
      alert('Silakan masukkan Nama World');
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
      game: 'Growtopia',
      growid: growid,
      world: world,
      product: selectedProduct,
      price: selectedPrice,
      tax: Math.round(selectedPrice * 0.1),
      total: selectedPrice + Math.round(selectedPrice * 0.1),
      paymentMethod: paymentMethod.value,
      paymentMethodId: paymentMethod.id,
      email: email,
      whatsapp: whatsapp || '',
      timestamp: new Date().toISOString()
    };
    
    // Save to localStorage and redirect
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
```
