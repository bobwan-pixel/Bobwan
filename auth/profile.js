import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./auth-firebase.js";

// Daftar email admin
const ADMIN_EMAILS = ["terepandu@gmail.com"];

// Tambahkan variabel untuk menandai apakah redirect dilakukan oleh sistem
let systemRedirect = false;

// Toast notification function
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

// Calculate days since joining
function calculateJoinedDays(creationTime) {
  const joinDate = new Date(creationTime);
  const today = new Date();
  const diffTime = today - joinDate;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// Update profile completion (example)
function updateProfileCompletion(user) {
  const completionPercent = user.displayName ? 75 : 50;
  const progressFill = document.querySelector('.progress-fill');
  const completionText = document.getElementById('completion-percent');
  
  progressFill.style.width = `${completionPercent}%`;
  completionText.textContent = `${completionPercent}%`;
  
  return completionPercent;
}

onAuthStateChanged(auth, (user) => {
  if (!user) {
    systemRedirect = true; // Tandai sebagai redirect sistem
    window.location.href = "../auth/auth.html";
    return;
  }
  
  // Set user data
  document.getElementById('user-email').textContent = user.email;
  
  // Show dashboard button for admin
  if (ADMIN_EMAILS.includes(user.email)) {
    document.getElementById('btn-dashboard').style.display = "flex";
  }
  
  // Update stats
  document.getElementById('joined-days').textContent = calculateJoinedDays(user.metadata.creationTime);
  document.getElementById('completed-tasks').textContent = "12"; // Example data
  
  // Update profile completion
  updateProfileCompletion(user);
  
  // Manipulasi history browser
  if (window.history && window.history.replaceState) {
    // Ganti history saat ini dengan halaman beranda
    window.history.replaceState({ isHome: true }, '', '../index.html');
    
    // Tambahkan event listener untuk popstate
    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.isHome) {
        // Jika mencoba kembali ke 'state' beranda, tetap di halaman ini
        window.history.pushState({ isHome: true }, '', '../index.html');
      } else if (!systemRedirect) {
        // Jika bukan redirect sistem, arahkan ke beranda
        window.location.href = '../index.html';
      }
    });
  }
});

document.addEventListener('DOMContentLoaded', function() {
  // Logout button
  document.getElementById('btn-logout').addEventListener('click', function() {
    signOut(auth).then(() => {
      systemRedirect = true; // Tandai sebagai redirect sistem
      showToast("Logout berhasil");
      setTimeout(() => {
        window.location.href = "../auth/auth.html";
      }, 1000);
    }).catch((error) => {
      showToast("Logout gagal: " + error.message);
    });
  });
  
  // Dashboard button
  document.getElementById('btn-dashboard').addEventListener('click', function() {
    window.location.href = "../admin/dasboard.html";
  });
  
  // Edit profile button
  document.getElementById('btn-edit-profile').addEventListener('click', function() {
    showToast("Fitur edit profil akan segera hadir");
  });
  
  // Avatar edit button
  document.querySelector('.avatar-edit-btn').addEventListener('click', function() {
    showToast("Fitur ganti avatar akan segera hadir");
  });
  
  // Tambahkan state awal ke history
  if (window.history && window.history.replaceState) {
    window.history.replaceState({ isHome: true }, '', '../index.html');
  }
});