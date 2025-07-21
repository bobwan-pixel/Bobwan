// Rules of Survival Diamond Products
const products = [
    { 
        id: 1, 
        name: "60 Diamonds", 
        price: 0.99, 
        image: "assets/ros_diamond.png",
        bonus: "+5%"
    },
    { 
        id: 2, 
        name: "300 Diamonds", 
        price: 4.99, 
        image: "assets/ros_diamond.png",
        bestSeller: true,
        bonus: "+10%"
    },
    { 
        id: 3, 
        name: "980 Diamonds", 
        price: 14.99, 
        image: "assets/ros_diamond.png",
        bonus: "+15%"
    },
    { 
        id: 4, 
        name: "1980 Diamonds", 
        price: 29.99, 
        image: "assets/ros_diamond.png",
        bonus: "+20%"
    },
    { 
        id: 5, 
        name: "3280 Diamonds", 
        price: 49.99, 
        image: "assets/ros_diamond.png",
        bestSeller: true,
        bonus: "+25%"
    },
    { 
        id: 6, 
        name: "6480 Diamonds", 
        price: 99.99, 
        image: "assets/ros_diamond.png",
        bonus: "+30%"
    }
];

// Payment Methods
const paymentMethods = {
    ewallet: [
        { id: "paypal", name: "PayPal", image: "assets/paypal_icon.png" },
        { id: "skrill", name: "Skrill", image: "assets/skrill_icon.png" }
    ],
    bank: [
        { id: "visa", name: "Visa", image: "assets/visa_icon.png" },
        { id: "mastercard", name: "Mastercard", image: "assets/mastercard_icon.png" }
    ],
    voucher: [
        { id: "codashop", name: "Codashop", image: "assets/codashop_icon.png" },
        { id: "razer", name: "Razer Gold", image: "assets/razer_icon.png" }
    ]
};

// Global Variables
let selectedProduct = null;
let selectedPayment = null;

// Load Diamond Products
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
            badge = '<div class="badge">BEST</div>';
        }
        
        productCard.innerHTML = `
            ${badge}
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <small>${product.bonus} Bonus</small>
        `;
        
        productCard.addEventListener('click', () => selectProduct(productCard, product));
        produkList.appendChild(productCard);
    });
}

// Select Product
function selectProduct(element, product) {
    document.querySelectorAll('.produk-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    element.classList.add('selected');
    selectedProduct = product;
    updateSummary();
}

// Update Order Summary
function updateSummary() {
    const productSummary = document.getElementById('selectedProduct');
    const productPriceElement = document.getElementById('productPrice');
    const rosBonusElement = document.getElementById('rosBonus');
    const totalPaymentElement = document.getElementById('totalPayment');
    
    if (selectedProduct) {
        productSummary.textContent = selectedProduct.name;
        const basePrice = selectedProduct.price;
        const bonusText = selectedProduct.bonus;
        
        productPriceElement.textContent = `$${basePrice.toFixed(2)}`;
        rosBonusElement.textContent = bonusText;
        totalPaymentElement.textContent = `$${basePrice.toFixed(2)}`;
    } else {
        productSummary.textContent = "-";
        productPriceElement.textContent = "$0.00";
        rosBonusElement.textContent = "+0%";
        totalPaymentElement.textContent = "$0.00";
    }
}

// Validate Form
function validateForm() {
    const playerId = document.getElementById('playerId').value;
    const character = document.getElementById('character').value;
    
    if (!playerId) {
        alert('Please enter your Player ID');
        return false;
    }
    
    if (!character) {
        alert('Please enter your Character Name');
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

// Process Checkout
function processCheckout() {
    if (validateForm()) {
        const orderData = {
            playerId: document.getElementById('playerId').value,
            character: document.getElementById('character').value,
            product: selectedProduct.name,
            price: selectedProduct.price,
            bonus: selectedProduct.bonus,
            paymentMethod: selectedPayment.name,
            timestamp: new Date().toISOString()
        };
        
        console.log('ROS Order:', orderData);
        localStorage.setItem('rosOrder', JSON.stringify(orderData));
        alert('Processing your diamond purchase...');
    }
}

// Initialize Page
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Tab Switching
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
            
            // Load payment methods for this tab
            loadPaymentMethods(tabId);
        });
    });
    
    // Load initial payment methods
    loadPaymentMethods('ewallet');
    
    // Checkout button
    document.getElementById('checkoutBtn').addEventListener('click', processCheckout);
});

// Load Payment Methods
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
        
        paymentCard.querySelector('input').addEventListener('change', function() {
            if (this.checked) {
                selectedPayment = method;
            }
        });
        
        container.appendChild(paymentCard);
    });
}