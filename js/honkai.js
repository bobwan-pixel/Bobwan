// Data produk Honkai: Star Rail
const honkaiProducts = [
  {
    id: 1,
    name: "60 Oneiric Shards",
    price: 15000,
    image: "../asset/produk/honkai_60os.png"
  },
  {
    id: 2,
    name: "300 Oneiric Shards",
    price: 30000,
    image: "../asset/produk/honkai_300os.png"
  },
  {
    id: 3,
    name: "980 Oneiric Shards",
    price: 60000,
    image: "../asset/produk/honkai_980os.png"
  },
  {
    id: 4,
    name: "1980 Oneiric Shards",
    price: 150000,
    image: "../asset/produk/honkai_1980os.png"
  },
  {
    id: 5,
    name: "3280 Oneiric Shards",
    price: 300000,
    image: "../asset/produk/honkai_3280os.png"
  },
  {
    id: 6,
    name: "6480 Oneiric Shards",
    price: 600000,
    image: "../asset/produk/honkai_6480os.png"
  },
  {
    id: 7,
    name: "Express Supply Pass",
    price: 75000,
    image: "../asset/produk/honkai_supply.png"
  },
  {
    id: 8,
    name: "Nameless Honor",
    price: 150000,
    image: "../asset/produk/honkai_honor.png"
  }
];

// Variabel global
let selectedProduct = null;
let selectedPrice = 0;

// Fungsi untuk menampilkan produk
function displayProducts() {
  const produkList = document.getElementById('produkList');
  produkList.innerHTML = '';

  honkaiProducts.forEach(product => {
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
      game: 'Honkai: Star Rail',
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