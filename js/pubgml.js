// PUBG Lite UC Products
const products = [
    { id: 1, name: "35 UC", price: 5000, image: "assets/uc_icon.png" },
    { id: 2, name: "125 UC", price: 15000, image: "assets/uc_icon.png" },
    { id: 3, name: "250 UC", price: 30000, image: "assets/uc_icon.png" },
    { id: 4, name: "500 UC", price: 60000, image: "assets/uc_icon.png" }
];

// Payment Methods
const paymentMethods = {
    ewallet: [
        { id: "dana", name: "DANA", image: "assets/dana_icon.png" },
        { id: "ovo", name: "OVO", image: "assets/ovo_icon.png" }
    ],
    voucher: [
        { id: "codashop", name: "Codashop", image: "assets/codashop_icon.png" }
    ]
};

let selectedProduct = null;
let selectedPayment = null;

function loadProducts() {
    const produkList = document.getElementById('produkList');
    produkList.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'produk-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>Rp ${product.price.toLocaleString('id-ID')}</p>
        `;
        
        productCard.addEventListener('click', () => {
            document.querySelectorAll('.produk-card').forEach(card => {
                card.classList.remove('selected');
            });
            productCard.classList.add('selected');
            selectedProduct = product;
            updateSummary();
        });
        
        produkList.appendChild(productCard);
    });
}

function updateSummary() {
    document.getElementById('selectedProduct').textContent = selectedProduct?.name || "-";
    document.getElementById('productPrice').textContent = selectedProduct ? `Rp ${selectedProduct.price.toLocaleString('id-ID')}` : "Rp 0";
    document.getElementById('totalPayment').textContent = selectedProduct ? `Rp ${selectedProduct.price.toLocaleString('id-ID')}` : "Rp 0";
}

function loadPaymentMethods(category) {
    const container = document.querySelector(`#${category} .card-payment-row`);
    container.innerHTML = '';
    
    paymentMethods[category].forEach(method => {
        const paymentCard = document.createElement('label');
        paymentCard.className = 'card-payment';
        paymentCard.innerHTML = `
            <input type="radio" name="paymentMethod" value="${method.id}">
            <img src="${method.image}" alt="${method.name}">
            <span>${method.name}</span>
        `;
        
        paymentCard.querySelector('input').addEventListener('change', () => {
            selectedPayment = method;
        });
        
        container.appendChild(paymentCard);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-button').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const tabId = button.dataset.tab;
            document.getElementById(tabId).classList.add('active');
            loadPaymentMethods(tabId);
        });
    });
    
    loadPaymentMethods('ewallet');
    
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        if (!selectedProduct) {
            alert('Please select a UC package');
            return;
        }
        if (!selectedPayment) {
            alert('Please select a payment method');
            return;
        }
        
        const orderData = {
            playerId: document.getElementById('playerId').value,
            product: selectedProduct.name,
            price: selectedProduct.price,
            paymentMethod: selectedPayment.name,
            email: document.getElementById('email').value
        };
        
        console.log('Order:', orderData);
        localStorage.setItem('pubgLiteOrder', JSON.stringify(orderData));
        alert('Payment processing...');
    });
});