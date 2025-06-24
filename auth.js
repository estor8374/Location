// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

const email = document.getElementById('email');
const password = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const googleBtn = document.getElementById('googleBtn');
const authSection = document.getElementById('auth-section');
const locationSection = document.getElementById('location-section');

signupBtn.onclick = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(user => alert('Signup successful!'))
    .catch(err => alert(err.message));
};

loginBtn.onclick = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .catch(err => alert(err.message));
};

googleBtn.onclick = () => {
  signInWithPopup(auth, provider)
    .catch(err => alert(err.message));
};

logoutBtn.onclick = () => {
  signOut(auth);
};

onAuthStateChanged(auth, user => {
  if (user) {
    authSection.style.display = 'none';
    locationSection.style.display = 'block';
    logoutBtn.style.display = 'inline-block';
  } else {
    authSection.style.display = 'block';
    locationSection.style.display = 'none';
    logoutBtn.style.display = 'none';
  }
});
