// Ganti ini:
window.location.href = "pembayaran.html";

// Dengan ini untuk test:
setTimeout(() => {
    console.log('Testing redirect...');
    window.location.href = "pembayaran.html"; 
}, 1000);