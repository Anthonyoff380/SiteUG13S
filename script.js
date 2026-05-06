import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

const firebaseConfig = { /* COLLE TES INFOS ICI */ };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 1. Charger l'image de fond configurée par l'admin
async function loadSettings() {
    const docRef = doc(db, "settings", "appearance");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        document.getElementById('hero-section').style.backgroundImage = `url('${docSnap.data().bgUrl}')`;
    }
}

// 2. Charger les Métiers
async function loadJobs() {
    const querySnapshot = await getDocs(collection(db, "metiers"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        document.getElementById('jobs-display').innerHTML += `
            <div class="embed-card">
                <img src="${data.img}" class="job-img">
                <h3>${data.titre}</h3>
                <p style="color:#666">${data.desc}</p>
            </div>`;
    });
}

// 3. Charger l'Équipe
async function loadTeam() {
    const querySnapshot = await getDocs(collection(db, "equipe"));
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        document.getElementById('team-display').innerHTML += `
            <div class="embed-card">
                <img src="${data.photo}" class="member-photo">
                <h4 style="color:var(--accent); margin:0;">${data.role}</h4>
                <h3>${data.nom}</h3>
                <p style="font-size:0.8rem; color:#888;">${data.info}</p>
            </div>`;
    });
}

loadSettings();
loadJobs();
loadTeam();