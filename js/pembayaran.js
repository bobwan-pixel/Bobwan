document.addEventListener("DOMContentLoaded", () => {
  // Countdown timer (3 minutes = 180 seconds)
  let timeLeft = 180;
  const timerEl = document.getElementById("timer");
  const progressCircle = document.querySelector('.countdown-progress');
  const circumference = 2 * Math.PI * 45;
  progressCircle.style.strokeDasharray = circumference;
  
  // Initial update
  updateTimer();
  
  const countdown = setInterval(() => {
    timeLeft--;
    updateTimer();
    
    if (timeLeft <= 0) {
      clearInterval(countdown);
      timerEl.textContent = "00:00";
      progressCircle.style.strokeDashoffset = circumference;
      window.location.href = "proses.html";
    }
  }, 1000);
  
  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerEl.textContent = `${minutes}:${seconds}`;
    
    // Update circle progress
    const offset = circumference - (timeLeft / 180) * circumference;
    progressCircle.style.strokeDashoffset = offset;
    
    // Change color when time is running out
    if (timeLeft <= 30) {
      progressCircle.style.stroke = 'var(--danger)';
      timerEl.style.color = 'var(--danger)';
    }
  }
  
  // Load transaction data
  async function tampilkanTransaksiTerakhir() {
    const container = document.getElementById("transaksi-container");
    try {
      // Mock data for demonstration - replace with your Firebase code
      const data = {
        game: "Mobile Legends",
        product: "Diamond 100",
        userId: "ML12345678",
        server: "Server 123",
        contact: "081234567890",
        payment: "Bank BCA",
        createdAt: new Date().getTime()
      };
      
      container.innerHTML = `
        <div class="card">
          <p><strong><i class="fas fa-gamepad"></i> Game:</strong> ${data.game}</p>
          <p><strong><i class="fas fa-shopping-bag"></i> Produk:</strong> ${data.product}</p>
          <p><strong><i class="fas fa-id-card"></i> ID:</strong> ${data.userId}</p>
          ${data.server ? `<p><strong><i class="fas fa-server"></i> Server:</strong> ${data.server}</p>` : ""}
          <p><strong><i class="fas fa-phone"></i> Kontak:</strong> ${data.contact}</p>
          <p><strong><i class="fas fa-credit-card"></i> Pembayaran:</strong> ${data.payment}</p>
          <p><strong><i class="fas fa-clock"></i> Waktu:</strong> ${new Date(data.createdAt).toLocaleString("id-ID")}</p>
        </div>
      `;
    } catch (error) {
      console.error(error);
      container.innerHTML = `
        <div class="card" style="border-left-color: var(--danger)">
          <p><i class="fas fa-exclamation-triangle"></i> Gagal memuat data transaksi.</p>
        </div>
      `;
    }
  }
  
  tampilkanTransaksiTerakhir();
});