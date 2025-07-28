// auth.js
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./auth-firebase.js";

// Login dengan Email
export function loginEmail() {
  const email = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const msg = document.getElementById('login-msg');

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      msg.textContent = "Login berhasil!";
      window.location.href = "./profile.html";
    })
    .catch((error) => {
      msg.textContent = "Login gagal: " + error.message;
    });
}

// Registrasi dengan Email
export function registerEmail() {
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const msg = document.getElementById('reg-msg');

  if (!username || !password || !email) {
    msg.textContent = "Semua data harus diisi!";
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      msg.textContent = "Registrasi berhasil! Silakan login.";
      showLogin();
    })
    .catch((error) => {
      msg.textContent = "Registrasi gagal: " + error.message;
    });
}

// Login Google
export function googleLogin() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "./profile.html";
    })
    .catch((error) => {
      alert("Login Google gagal: " + error.message);
    });
}

// Login GitHub
export function githubLogin() {
  const provider = new GithubAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "./profile.html";
    })
    .catch((error) => {
      alert("Login GitHub gagal: " + error.message);
    });
}

// Login Facebook
export function fbLogin() {
  const provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "./profile.html";
    })
    .catch((error) => {
      alert("Login Facebook gagal: " + error.message);
    });
}

// Navigasi Form
window.showRegister = function () {
  document.getElementById('form-login').style.display = 'none';
  document.getElementById('form-register').style.display = 'block';
  document.getElementById('login-msg').textContent = '';
  document.getElementById('reg-msg').textContent = '';
};

window.showLogin = function () {
  document.getElementById('form-login').style.display = 'block';
  document.getElementById('form-register').style.display = 'none';
  document.getElementById('login-msg').textContent = '';
  document.getElementById('reg-msg').textContent = '';
};

// Event listener link
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('to-register').addEventListener('click', function (e) {
    e.preventDefault();
    showRegister();
  });
  document.getElementById('to-login').addEventListener('click', function (e) {
    e.preventDefault();
    showLogin();
  });
  showLogin(); // Default tampilan awal
});

// Global ke window agar dipanggil di onclick
window.login = loginEmail;
window.register = registerEmail;
window.googleLogin = googleLogin;
window.githubLogin = githubLogin;
window.fbLogin = fbLogin;