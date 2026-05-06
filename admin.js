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

const MY_EMAIL = "benjamin17pros@gmail.com"; // <-- METS TON EMAIL ICI

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html";
    } else {
        if (user.email === MY_EMAIL) {
            document.getElementById('super-admin-section').style.display = "block";
        }
    }
});

// Créer un autre admin
const createBtn = document.getElementById('create-admin-btn');
if(createBtn) {
    createBtn.addEventListener('click', () => {
        const email = document.getElementById('new-admin-email').value;
        const pass = document.getElementById('new-admin-pass').value;
        createUserWithEmailAndPassword(auth, email, pass)
            .then(() => alert("Succès : Compte créé !"))
            .catch(err => alert("Erreur : " + err.message));
    });
}

// Ajouter un membre
document.getElementById('add-member').addEventListener('click', async () => {
    await addDoc(collection(db, "equipe"), {
        nom: document.getElementById('m-nom').value,
        role: document.getElementById('m-role').value,
        photo: document.getElementById('m-img').value,
        info: document.getElementById('m-info').value
    });
    alert("Ajouté !");
});

// Update Background
document.getElementById('save-bg').addEventListener('click', async () => {
    const url = document.getElementById('bg-url').value;
    await setDoc(doc(db, "settings", "appearance"), { bgUrl: url });
    alert("Fond mis à jour !");
});