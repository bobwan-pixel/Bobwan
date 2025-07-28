import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  orderBy,
  limit,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA2s25k3SNFq4CcNvTVb5M6wEmVKgHAoOU",
  authDomain: "bobwan-11aed.firebaseapp.com",
  projectId: "bobwan-11aed",
  storageBucket: "bobwan-11aed.appspot.com",
  messagingSenderId: "870245501386",
  appId: "1:870245501386:web:6c24f4ed2b0fab4dd0a733"
};

// Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let transaksiTerakhir = null;

document.addEventListener("DOMContentLoaded", () => {
  let timeLeft = 180;
  const timerEl = document.getElementById("timer");
  const progressCircle = document.querySelector('.countdown-progress');
  const circumference = 2 * Math.PI * 45;
  progressCircle.style.strokeDasharray = circumference;

  updateTimer();

  const countdown = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft <= 0) {
      clearInterval(countdown);
      timerEl.textContent = "00:00";
      progressCircle.style.strokeDashoffset = circumference;
      tampilkanPopupTransaksi();
    }
  }, 1000);

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    timerEl.textContent = `${minutes}:${seconds}`;

    const offset = circumference - (timeLeft / 180) * circumference;
    progressCircle.style.strokeDashoffset = offset;

    if (timeLeft <= 30) {
      progressCircle.style.stroke = '#ff4757';
      timerEl.style.color = '#ff4757';
    }
  }

  tampilkanTransaksiTerakhir();
});

async function tampilkanTransaksiTerakhir() {
  const container = document.getElementById("transaksi-container");
  try {
    const q = query(collection(db, "transaksi"), orderBy("waktu", "desc"), limit(1));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      container.innerHTML = `<div class="card error-state"><p><i class="fas fa-times-circle"></i> Tidak ada transaksi ditemukan.</p></div>`;
      return;
    }

    const doc = snapshot.docs[0];
    const data = doc.data();
    transaksiTerakhir = data;

    const waktu = data.waktu?.toDate?.().toLocaleString("id-ID") || "-";

    container.innerHTML = `
      <div class="card">
        <p><strong><i class="fas fa-gamepad"></i> Game:</strong> ${data.game || "-"}</p>
        <p><strong><i class="fas fa-shopping-bag"></i> Produk:</strong> ${data.produk || "-"}</p>
        <p><strong><i class="fas fa-id-card"></i> ID:</strong> ${data.id || "-"}</p>
        <p><strong><i class="fas fa-phone"></i> Kontak:</strong> ${data.whatsapp || data.email || "-"}</p>
        <p><strong><i class="fas fa-credit-card"></i> Pembayaran:</strong> ${data.metode || "-"}</p>
        <p><strong><i class="fas fa-money-bill"></i> Total:</strong> Rp ${data.total?.toLocaleString("id-ID") || "0"}</p>
        <p><strong><i class="fas fa-clock"></i> Waktu:</strong> ${waktu}</p>
      </div>
    `;
  } catch (error) {
    console.error(error);
    container.innerHTML = `<div class="card error-state"><p><i class="fas fa-times-circle"></i> Gagal memuat data transaksi.</p></div>`;
  }
}

function tampilkanPopupTransaksi() {
  const popup = document.getElementById("popupTransaksi");
  const content = document.getElementById("popupContent");

  if (!transaksiTerakhir) return;

  const waktu = transaksiTerakhir.waktu?.toDate?.().toLocaleString("id-ID") || "-";

  content.innerHTML = `
    <p><strong>ID:</strong> ${transaksiTerakhir.id || "-"}</p>
    <p><strong>Produk:</strong> ${transaksiTerakhir.produk || "-"}</p>
    <p><strong>Metode:</strong> ${transaksiTerakhir.metode || "-"}</p>
    <p><strong>Total:</strong> Rp ${transaksiTerakhir.total?.toLocaleString("id-ID") || "0"}</p>
    <p><strong>Tanggal:</strong> ${waktu}</p>
  `;

  popup.style.display = "flex";

  document.getElementById("popupOkBtn").addEventListener("click", () => {
    const isLogin = localStorage.getItem("user_uid");
    popup.style.display = "none";
    window.location.href = isLogin ? "bukti.html" : "index.html";
  });
}