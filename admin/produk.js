import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA2s25k3SNFq4CcNvTVb5M6wEmVKgHAoOU",
  authDomain: "bobwan-11aed.firebaseapp.com",
  projectId: "bobwan-11aed",
  storageBucket: "bobwan-11aed.appspot.com",
  messagingSenderId: "870245501386",
  appId: "1:870245501386:web:6c24f4ed2b0fab4dd0a733",
  measurementId: "G-ENT7HV7GHN"
};

// Inisialisasi
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM
const form = document.getElementById("produkForm");
const produkList = document.getElementById("produkList");

let editId = null; // Untuk mode edit

// Submit Form
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const game = document.getElementById("game").value;
  const nama = document.getElementById("nama").value.trim();
  const harga = parseInt(document.getElementById("harga").value);
  const image = document.getElementById("image").value.trim();
  const bestSeller = document.getElementById("bestSeller").checked;
  const tersedia = document.getElementById("tersedia").checked;

  if (!game || !nama || !harga || !image) {
    return alert("Mohon lengkapi semua data.");
  }

  const data = {
    nama,
    harga,
    image,
    bestSeller,
    tersedia,
    updatedAt: serverTimestamp()
  };

  const ref = collection(db, `produk_${game}`);

  try {
    if (editId) {
      await updateDoc(doc(ref, editId), data);
      alert("Produk berhasil diperbarui.");
      editId = null;
      form.querySelector("#submitBtn").textContent = "Tambah Produk";
    } else {
      data.createdAt = serverTimestamp();
      await addDoc(ref, data);
      alert("Produk berhasil ditambahkan.");
    }

    form.reset();
    loadProduk();
  } catch (err) {
    console.error("Gagal:", err);
    alert("Terjadi kesalahan saat menyimpan data.");
  }
});

// Load Produk
async function loadProduk() {
  produkList.innerHTML = "<p>Memuat produk...</p>";
  const game = document.getElementById("game").value;
  if (!game) {
    produkList.innerHTML = "<p>Pilih game terlebih dahulu.</p>";
    return;
  }

  const q = collection(db, `produk_${game}`);
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    produkList.innerHTML = "<p>Belum ada produk.</p>";
    return;
  }

  produkList.innerHTML = "";

  snapshot.forEach((docu) => {
    const data = docu.data();
    const div = document.createElement("div");
    div.className = `produk-card ${!data.tersedia ? 'tidak-tersedia' : ''}`;

    div.innerHTML = `
      <img src="${data.image}" alt="${data.nama}" />
      <div>
        <h3>${data.nama}</h3>
        <p>Rp ${data.harga.toLocaleString("id-ID")}</p>
        ${data.bestSeller ? `<span class="badge">Best Seller</span>` : ""}
        ${data.tersedia ? "" : `<p class="status-label">Produk Tidak Tersedia / Kesalahan Sistem</p>`}
        <div class="actions">
          <button class="edit">Edit</button>
          <button class="hapus">Hapus</button>
        </div>
      </div>
    `;

    // Edit
    div.querySelector(".edit").addEventListener("click", () => {
      document.getElementById("nama").value = data.nama;
      document.getElementById("harga").value = data.harga;
      document.getElementById("image").value = data.image;
      document.getElementById("bestSeller").checked = data.bestSeller;
      document.getElementById("tersedia").checked = data.tersedia;
      document.getElementById("game").value = game;
      editId = docu.id;
      form.querySelector("#submitBtn").textContent = "Simpan Perubahan";
    });

    // Hapus
    div.querySelector(".hapus").addEventListener("click", async () => {
      const konfirmasi = confirm(`Hapus produk: ${data.nama}?`);
      if (!konfirmasi) return;
      await deleteDoc(doc(db, `produk_${game}`, docu.id));
      alert("Produk dihapus.");
      loadProduk();
    });

    produkList.appendChild(div);
  });
}

// Refresh otomatis saat game dipilih
document.getElementById("game").addEventListener("change", loadProduk);

// Auto load jika sudah ada game terpilih
window.addEventListener("DOMContentLoaded", () => {
  const game = document.getElementById("game").value;
  if (game) loadProduk();
});