// js/auth-firebase.js
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  FacebookAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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

// Cegah duplikasi inisialisasi
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Auth & Providers
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Optional: minta permission tambahan jika perlu
facebookProvider.addScope('email');
githubProvider.addScope('read:user');

export {
  auth,
  googleProvider,
  githubProvider,
  facebookProvider
};