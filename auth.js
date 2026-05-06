import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDAcd1Gsbrks6TRum6mEhoGAY2xBaNwxIM",
  authDomain: "siteug13s.firebaseapp.com",
  projectId: "siteug13s",
  storageBucket: "siteug13s.firebasestorage.app",
  messagingSenderId: "122631194173",
  appId: "1:122631194173:web:dff794d0c2c5fc31a04c54",
  measurementId: "G-G8V3N5BH7X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginBtn = document.getElementById('login-btn');
if(loginBtn) {
    loginBtn.addEventListener('click', () => {
        const email = document.getElementById('email').value;
        const pass = document.getElementById('password').value;

        signInWithEmailAndPassword(auth, email, pass)
            .then(() => { 
                window.location.href = "admin.html"; 
            })
            .catch(err => { 
                document.getElementById('error-msg').innerText = "Identifiants invalides."; 
            });
    });
}