import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyA2s25k3SNFq4CcNvTVb5M6wEmVKgHAoOU",
  authDomain: "bobwan-11aed.firebaseapp.com",
  projectId: "bobwan-11aed",
  storageBucket: "bobwan-11aed.appspot.com",
  messagingSenderId: "870245501386",
  appId: "1:870245501386:web:6c24f4ed2b0fab4dd0a733"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Cek jika bukan admin, redirect
onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== "terepandu@gmail.com") {
    window.location.replace("../auth/auth.html");
  } else {
    loadDashboardData();
  }
});

// Ambil data dari Firestore
async function loadDashboardData() {
  const transaksiSnap = await getDocs(collection(db, "transaksi"));
  const penggunaSnap = await getDocs(collection(db, "pengguna"));

  document.getElementById("total-pembelian").textContent = transaksiSnap.size;
  document.getElementById("total-pengguna").textContent = penggunaSnap.size;

  // Hitung total saldo (dummy jika belum ada field)
  let totalSaldo = 0;
  penggunaSnap.forEach(doc => {
    const data = doc.data();
    totalSaldo += data.saldo || 0;
  });

  document.getElementById("total-saldo").textContent = "Rp" + formatRupiah(totalSaldo);
}

function formatRupiah(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}