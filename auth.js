import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = { /* TES INFOS */ };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById('login-btn').addEventListener('click', () => {
    const email = document.getElementById('email').value;
    const pass = document.getElementById('password').value;

    signInWithEmailAndPassword(auth, email, pass)
        .then(() => { window.location.href = "admin.html"; })
        .catch(err => { document.getElementById('error-msg').innerText = "Accès refusé."; });
});