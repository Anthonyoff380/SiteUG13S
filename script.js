import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore.js";

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
const db = getFirestore(app);

async function loadContent() {
    // Charger Background
    const bgSnap = await getDoc(doc(db, "settings", "appearance"));
    if(bgSnap.exists()) {
        document.getElementById('hero-section').style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${bgSnap.data().bgUrl}')`;
        document.getElementById('hero-section').style.backgroundSize = "cover";
    }

    // Charger Equipe
    const teamSnap = await getDocs(collection(db, "equipe"));
    const teamDiv = document.getElementById('team-display');
    teamSnap.forEach(doc => {
        const d = doc.data();
        teamDiv.innerHTML += `
            <div class="embed-card">
                <img src="${d.photo}" class="member-photo">
                <h4 style="color:var(--accent)">${d.role}</h4>
                <h3>${d.nom}</h3>
                <p style="color:#777; font-size:0.9rem; margin-top:10px;">${d.info}</p>
            </div>`;
    });
}
loadContent();