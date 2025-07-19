// Data produk Genshin Impact
const genshinProducts = [
  {
    id: 1,
    name: "60 Genesis Crystals",
    price: 15000,
    image: "../asset/produk/genshin_60gc.png"
  },
  {
    id: 2,
    name: "300 Genesis Crystals",
    price: 30000,
    image: "../asset/produk/genshin_300gc.png"
  },
  {
    id: 3,
    name: "980 Genesis Crystals",
    price: 60000,
    image: "../asset/produk/genshin_980gc.png"
  },
  {
    id: 4,
    name: "1980 Genesis Crystals",
    price: 150000,
    image: "../asset/produk/genshin_1980gc.png"
  },
  {
    id: 5,
    name: "3280 Genesis Crystals",
    price: 300000,
    image: "../asset/produk/genshin_3280gc.png"
  },
  {
    id: 6,
    name: "6480 Genesis Crystals",
    price: 600000,
    image: "../asset/produk/genshin_6480gc.png"
  },
  {
    id: 7,
    name: "Welkin Moon (30 Days)",
    price: 75000,
    image: "../asset/produk/genshin_welkin.png"
  },
  {
    id: 8,
    name: "Gnostic Hymn (BP)",
    price: 150000,
    image: "../asset/produk/genshin_bp.png"
  }
];

// Variabel global
let selectedProduct = null;
let selectedPrice = 0;

// Fungsi untuk menampilkan produk
function displayProducts() {
  const produkList = document.getElementById('produkList');
  produkList.innerHTML = '';

  genshinProducts.forEach(product => {
    const productCard = document.createElement('div');
    productCard.className = 'produk-card';
    productCard.setAttribute('data-harga', product.price);
    productCard.innerHTML = `
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
      productCards.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      
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
    const playerId = document.getElementById('uid').value;
    const server = document.getElementById('server').value;
    const email = document.getElementById('email').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const paymentMethod = document.querySelector('input[name="metodePembayaran"]:checked');
    
    // Validasi form
    if (!playerId) {
      alert('Silakan masukkan UID Anda');
      return;
    }
    
    if (!server) {
      alert('Silakan pilih server');
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
      game: 'Genshin Impact',
      uid: playerId,
      server: server,
      product: selectedProduct,
      price: selectedPrice,
      tax: Math.round(selectedPrice * 0.1),
      total: selectedPrice + Math.round(selectedPrice * 0.1),
      paymentMethod: paymentMethod.value,
      email: email,
      whatsapp: whatsapp || '',
      timestamp: new Date().toISOString()
    };
    
    console.log('Order Data:', orderData);
    alert(`Pembelian berhasil!\n\nUID: ${playerId}\nServer: ${server}\nProduk: ${selectedProduct}\nTotal: ${formatCurrency(orderData.total)}\n\nSilakan selesaikan pembayaran.`);
  });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  displayProducts();
  initPaymentTabs();
  handleCheckout();
});