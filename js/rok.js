// Data Produk Rise of Kingdoms
const products = [
  { id: 1, name: "500 Gems", price: 10000, image: "assets/rok_gems.png" },
  { id: 2, name: "1,200 Gems", price: 20000, image: "assets/rok_gems.png" },
  { id: 3, name: "2,500 Gems", price: 40000, image: "assets/rok_gems.png", bestSeller: true },
  { id: 4, name: "5,000 Gems", price: 75000, image: "assets/rok_gems.png" },
  { id: 5, name: "8,000 Gems", price: 120000, image: "assets/rok_gems.png", popular: true },
  { id: 6, name: "12,000 Gems", price: 180000, image: "assets/rok_gems.png" },
  { id: 7, name: "VIP 30 Hari", price: 50000, image: "assets/rok_vip.png" },
  { id: 8, name: "Growth Fund", price: 150000, image: "assets/rok_growth.png" }
];

// Data Metode Pembayaran
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

// Variabel Global
let selectedProduct = null;
let selectedPayment = null;
const TAX_RATE = 0.1; // Pajak 10%

// Fungsi untuk memuat produk
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

// Fungsi untuk memilih produk
function selectProduct(element, product) {
  // Hapus selected class dari semua produk
  document.querySelectorAll('.produk-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Tambahkan selected class ke produk yang dipilih
  element.classList.add('selected');
  selectedProduct = product;
  
  // Update ringkasan
  updateSummary();
}

// Fungsi untuk update ringkasan pembayaran
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
    checkoutButtonPrice.textContent = `Rp ${totalPayment.toLocaleString('id-ID')}`;
  } else {
    productSummary.textContent = "-";
    productPriceElement.textContent = "Rp 0";
    taxAmountElement.textContent = "Rp 0";
    totalPaymentElement.textContent = "Rp 0";
    checkoutButtonPrice.textContent = "Rp 0";
  }
}

// Fungsi untuk validasi form
function validateForm() {
  const playerId = document.getElementById('playerId').value;
  const kingdomId = document.getElementById('kingdomId').value;
  const email = document.getElementById('email').value;
  
  if (!playerId) {
    alert('Masukkan Player ID Anda');
    return false;
  }
  
  if (!kingdomId) {
    alert('Masukkan Kingdom ID Anda');
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

// Fungsi untuk proses checkout
function processCheckout() {
  if (validateForm()) {
    const productPrice = selectedProduct.price;
    const taxAmount = Math.round(productPrice * TAX_RATE);
    const totalPayment = productPrice + taxAmount;
    
    const orderData = {
      playerId: document.getElementById('playerId').value,
      kingdomId: document.getElementById('kingdomId').value,
      product: selectedProduct.name,
      productPrice: productPrice,
      tax: taxAmount,
      total: totalPayment,
      paymentMethod: selectedPayment.name,
      email: document.getElementById('email').value,
      whatsapp: document.getElementById('whatsapp').value || null,
      timestamp: new Date().toISOString()
    };
    
    // Simulasi pengiriman data ke server
    console.log('Data Order:', orderData);
    
    // Tampilkan konfirmasi
    alert(`Pembayaran berhasil diproses!\n\nTotal: Rp ${totalPayment.toLocaleString('id-ID')}\nMetode: ${selectedPayment.name}\n\nHadiah akan masuk dalam 1-5 menit.`);
  }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  
  // Event listener untuk tombol tab
  document.querySelectorAll('.tab-button').forEach(button => {
    button.addEventListener('click', () => {
      // Hapus active class dari semua tab
      document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Tambahkan active class ke tab yang diklik
      button.classList.add('active');
      
      // Sembunyikan semua konten tab
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Tampilkan konten tab yang dipilih
      const tabId = button.dataset.tab;
      document.getElementById(tabId).classList.add('active');
    });
  });
  
  // Event listener untuk metode pembayaran
  document.querySelectorAll('.card-payment input').forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        const methodId = this.value;
        let method;
        
        // Cari metode pembayaran yang dipilih
        for (const category in paymentMethods) {
          method = paymentMethods[category].find(m => m.id === methodId);
          if (method) break;
        }
        
        selectedPayment = method;
        updateSummary();
      }
    });
  });
  
  // Event listener untuk tombol checkout
  document.getElementById('checkoutBtn').addEventListener('click', processCheckout);
});