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
    // Fond d'écran
    const bgSnap = await getDoc(doc(db, "settings", "appearance"));
    if(bgSnap.exists()) document.getElementById('hero-section').style.backgroundImage = `url('${bgSnap.data().bgUrl}')`;

    // Équipe
    const teamSnap = await getDocs(collection(db, "equipe"));
    teamSnap.forEach(doc => {
        const d = doc.data();
        document.getElementById('team-display').innerHTML += `
            <div class="embed-card">
                <img src="${d.photo}" class="member-photo">
                <h4 style="color:#ff3e3e">${d.role}</h4>
                <h3>${d.nom}</h3>
                <p>${d.info}</p>
            </div>`;
    });
}
loadContent();