import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const auth = getAuth();
const db = getFirestore();

// Vérifier la connexion
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "login.html"; // Redirige si pas connecté
    }
});

// Logique pour ajouter un membre
document.getElementById('add-member').addEventListener('click', async () => {
    await addDoc(collection(db, "equipe"), {
        nom: document.getElementById('member-name').value,
        role: document.getElementById('member-role').value,
        photo: document.getElementById('member-photo').value,
        info: document.getElementById('member-info').value
    });
    alert("Membre ajouté !");
});

// Logique pour le fond d'écran
document.getElementById('save-bg').addEventListener('click', async () => {
    await setDoc(doc(db, "settings", "appearance"), {
        bgUrl: document.getElementById('bg-url').value
    });
    alert("Fond mis à jour !");
});