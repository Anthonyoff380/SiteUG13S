import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = {
  // COLLE TES INFOS ICI
  apiKey: "AIzaSyDAcd1Gsbrks6TRum6mEhoGAY2xBaNwxIM",
  authDomain: "siteug13s.firebaseapp.com",
  projectId: "siteug13s",
  storageBucket: "siteug13s.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Charger l'équipe
async function loadTeam() {
    const querySnapshot = await getDocs(collection(db, "equipe"));
    const container = document.getElementById('team-container');
    
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        container.innerHTML += `
            <div class="member-card">
                <img src="${data.photo}" class="member-img">
                <h3>${data.prenom} ${data.nom}</h3>
                <p style="color: red;">${data.role}</p>
                <small>${data.info || ""}</small>
            </div>
        `;
    });
}

loadTeam();