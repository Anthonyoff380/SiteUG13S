import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
const db = getFirestore(app);

// CONFIGURATION PROPRIÉTAIRE
const MY_EMAIL = "benjamin17pros@gmail.com"; 

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        document.getElementById('user-welcome').innerText = `Connecté en tant que : ${user.email}`;
        // Vérifie si c'est toi
        if (user.email === MY_EMAIL) {
            document.getElementById('super-admin-section').style.display = "block";
        }
    }
});

// Créer un nouvel admin
document.getElementById('create-admin-btn').addEventListener('click', () => {
    const email = document.getElementById('new-admin-email').value;
    const pass = document.getElementById('new-admin-pass').value;
    createUserWithEmailAndPassword(auth, email, pass)
        .then(() => alert("Compte admin créé !"))
        .catch(err => alert("Erreur : " + err.message));
});

// Déconnexion
document.getElementById('logout-btn').addEventListener('click', () => {
    signOut(auth).then(() => window.location.href = "index.html");
});

// Enregistrer le BG
document.getElementById('save-bg').addEventListener('click', async () => {
    const url = document.getElementById('bg-url').value;
    await setDoc(doc(db, "settings", "appearance"), { bgUrl: url });
    alert("Background mis à jour !");
});

// Ajouter membre
document.getElementById('add-member').addEventListener('click', async () => {
    await addDoc(collection(db, "equipe"), {
        nom: document.getElementById('m-nom').value,
        role: document.getElementById('m-role').value,
        photo: document.getElementById('m-img').value,
        info: document.getElementById('m-info').value
    });
    alert("Membre ajouté !");
});