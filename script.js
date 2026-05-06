import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = { /* TES INFOS FIREBASE */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Charger le Fond d'écran
const configDoc = await getDoc(doc(db, "settings", "appearance"));
if (configDoc.exists()) {
    document.getElementById('hero-bg').style.backgroundImage = `url('${configDoc.data().bgUrl}')`;
}

// Charger les Métiers (Jobs)
const jobsSnap = await getDocs(collection(db, "metiers"));
jobsSnap.forEach((doc) => {
    const data = doc.data();
    document.getElementById('jobs-grid').innerHTML += `
        <div class="embed-card">
            <img src="${data.img}" class="embed-img">
            <div class="embed-content">
                <h3>${data.titre}</h3>
                <p style="color: #aaa; font-size: 0.8rem;">${data.desc}</p>
            </div>
        </div>`;
});

// Charger l'Équipe
const teamSnap = await getDocs(collection(db, "equipe"));
teamSnap.forEach((doc) => {
    const data = doc.data();
    document.getElementById('team-grid').innerHTML += `
        <div class="embed-card member-card">
            <img src="${data.photo}" class="member-img">
            <div class="embed-content">
                <span style="color:red; font-weight:bold;">${data.role}</span>
                <h3>${data.nom}</h3>
                <p>${data.info}</p>
            </div>
        </div>`;
});