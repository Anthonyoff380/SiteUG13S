// ═══════════════════════════════════════════
//   UG13S — MAIN.JS
//   Firebase Firestore driven frontend
// ═══════════════════════════════════════════

import {
  collection, getDocs, query, orderBy, limit
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Wait for Firebase init
await new Promise(resolve => {
  if (window.__db) return resolve();
  window.addEventListener("firebase-ready", resolve, { once: true });
});

const db   = window.__db;
const auth = window.__auth;

// ─────────────────────────────────────────
// 1. CUSTOM CURSOR
// ─────────────────────────────────────────
const cursor      = document.getElementById("cursor");
const cursorTrail = document.getElementById("cursor-trail");
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener("mousemove", e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + "px";
  cursor.style.top  = my + "px";
});

(function animateTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  cursorTrail.style.left = tx + "px";
  cursorTrail.style.top  = ty + "px";
  requestAnimationFrame(animateTrail);
})();

// ─────────────────────────────────────────
// 2. BACKGROUND PARTICLE CANVAS
// ─────────────────────────────────────────
const canvas = document.getElementById("bg-canvas");
const ctx    = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function randomParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    r: Math.random() * 1.5 + .5,
    o: Math.random() * .5 + .2
  };
}

for (let i = 0; i < 80; i++) particles.push(randomParticle());

function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,212,255,${p.o})`;
    ctx.fill();
  }
  // Draw lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,212,255,${(1 - d/100) * .1})`;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawCanvas);
}
drawCanvas();

// ─────────────────────────────────────────
// 3. NAVBAR
// ─────────────────────────────────────────
const navbar     = document.getElementById("navbar");
const hamburger  = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");

window.addEventListener("scroll", () => {
  navbar.style.background = window.scrollY > 50
    ? "rgba(7,11,15,.98)" : "rgba(7,11,15,.8)";
});

hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});

// Close mobile menu on link click
document.querySelectorAll(".mobile-link").forEach(l => {
  l.addEventListener("click", () => mobileMenu.classList.remove("open"));
});

// Active nav link on scroll
const sections  = document.querySelectorAll("section[id]");
const navLinks  = document.querySelectorAll(".nav-link");

const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.remove("active"));
      const active = document.querySelector(`.nav-link[data-section="${e.target.id}"]`);
      if (active) active.classList.add("active");
    }
  });
}, { threshold: .4 });

sections.forEach(s => observer.observe(s));

// ─────────────────────────────────────────
// 4. STATS COUNTER ANIMATION
// ─────────────────────────────────────────
function animateCounter(el, target) {
  let current = 0;
  const step  = Math.ceil(target / 60);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString("fr-FR");
    if (current >= target) clearInterval(timer);
  }, 20);
}

// Load stats from Firestore
async function loadStats() {
  try {
    const snap = await getDocs(collection(db, "settings"));
    let stats  = { members: 0, posts: 0, days: 0 };
    snap.forEach(d => {
      if (d.id === "stats") Object.assign(stats, d.data());
    });

    const statsObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        animateCounter(document.getElementById("stat-members"), stats.members || 0);
        animateCounter(document.getElementById("stat-posts"),   stats.posts   || 0);
        animateCounter(document.getElementById("stat-days"),    stats.days    || 0);
        statsObs.disconnect();
      }
    }, { threshold: .5 });
    statsObs.observe(document.querySelector(".stats-bar"));
  } catch(e) {
    console.warn("Stats load failed:", e);
  }
}
loadStats();

// ─────────────────────────────────────────
// 5. GAME INFO SECTION
// ─────────────────────────────────────────
const ICON_MAP = {
  info: "fa-circle-info",
  rules: "fa-scroll",
  how: "fa-gamepad",
  join: "fa-user-plus",
  lore: "fa-book-open",
  server: "fa-server",
  reward: "fa-trophy",
  warning: "fa-triangle-exclamation",
};

async function loadGameInfo() {
  const grid = document.getElementById("game-info-grid");
  try {
    const q    = query(collection(db, "game_info"), orderBy("order", "asc"));
    const snap = await getDocs(q);

    if (snap.empty) {
      grid.innerHTML = `
        <div class="info-card">
          <div class="info-icon"><i class="fa fa-circle-info"></i></div>
          <h3>Informations à venir</h3>
          <p>Le contenu du jeu sera bientôt disponible. Revenez plus tard !</p>
        </div>`;
      return;
    }

    grid.innerHTML = "";
    snap.forEach(doc => {
      const d    = doc.data();
      const icon = ICON_MAP[d.icon] || "fa-circle-info";
      const card = document.createElement("div");
      card.className = "info-card";
      card.innerHTML = `
        <div class="info-icon"><i class="fa ${icon}"></i></div>
        <h3>${escHtml(d.title || "")}</h3>
        <p>${escHtml(d.content || "")}</p>
      `;
      grid.appendChild(card);
    });
  } catch(e) {
    grid.innerHTML = `<div class="info-card"><p style="color:var(--text-muted)">Impossible de charger les informations. Vérifiez la configuration Firebase.</p></div>`;
    console.error(e);
  }
}
loadGameInfo();

// ─────────────────────────────────────────
// 6. TEAM SECTION
// ─────────────────────────────────────────
async function loadTeam() {
  const grid = document.getElementById("team-grid");
  try {
    const q    = query(collection(db, "team"), orderBy("order", "asc"));
    const snap = await getDocs(q);

    if (snap.empty) {
      grid.innerHTML = `<div class="team-placeholder"><p style="color:var(--text-muted)">L'équipe sera bientôt présentée ici.</p></div>`;
      return;
    }

    grid.innerHTML = "";
    snap.forEach(doc => {
      const d = doc.data();
      grid.appendChild(buildMemberCard(d));
    });
  } catch(e) {
    grid.innerHTML = `<div class="team-placeholder"><p style="color:var(--text-muted)">Impossible de charger l'équipe.</p></div>`;
    console.error(e);
  }
}

function buildMemberCard(d) {
  const card = document.createElement("div");
  card.className = "member-card";

  const initials = ((d.firstname || "?")[0] + (d.lastname || "")[0]).toUpperCase();

  const avatarHtml = d.photoURL
    ? `<img src="${escHtml(d.photoURL)}" alt="${escHtml(d.firstname)}" class="member-avatar" />`
    : `<div class="member-avatar-placeholder">${initials}</div>`;

  card.innerHTML = `
    <div class="member-avatar-wrap">
      ${avatarHtml}
      <div class="member-avatar-ring"></div>
    </div>
    <div class="member-role">${escHtml(d.role || "Membre")}</div>
    <div class="member-name">${escHtml(d.firstname || "")} ${escHtml(d.lastname || "")}</div>
    ${d.info ? `<div class="member-info">${escHtml(d.info)}</div>` : ""}
  `;
  return card;
}

loadTeam();

// ─────────────────────────────────────────
// 7. GALLERY SECTION
// ─────────────────────────────────────────
async function loadGallery() {
  const grid = document.getElementById("gallery-grid");
  try {
    const q    = query(collection(db, "gallery"), orderBy("createdAt", "desc"), limit(30));
    const snap = await getDocs(q);

    if (snap.empty) {
      grid.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:3rem; grid-column:1/-1; font-family:var(--font-mono)">Aucune photo pour le moment.</p>`;
      return;
    }

    grid.innerHTML = "";
    snap.forEach(doc => {
      const d    = doc.data();
      const item = document.createElement("div");
      item.className = "gallery-item";
      item.innerHTML = `
        <img src="${escHtml(d.url)}" alt="${escHtml(d.caption || '')}" loading="lazy" />
        <div class="gallery-overlay">
          <span class="gallery-caption">${escHtml(d.caption || "")}</span>
        </div>
      `;
      item.addEventListener("click", () => openLightbox(d.url, d.caption));
      grid.appendChild(item);
    });
  } catch(e) {
    grid.innerHTML = `<p style="color:var(--text-muted); padding:3rem; font-family:var(--font-mono)">Impossible de charger la galerie.</p>`;
    console.error(e);
  }
}
loadGallery();

// Lightbox
const lightboxEl = document.createElement("div");
lightboxEl.id = "lightbox-backdrop";
lightboxEl.innerHTML = `
  <span id="lightbox-x" title="Fermer">✕</span>
  <img id="lightbox-img" src="" alt="" />
`;
document.body.appendChild(lightboxEl);

function openLightbox(url, caption) {
  document.getElementById("lightbox-img").src = url;
  lightboxEl.classList.add("open");
}
document.getElementById("lightbox-x").addEventListener("click", () => lightboxEl.classList.remove("open"));
lightboxEl.addEventListener("click", e => { if (e.target === lightboxEl) lightboxEl.classList.remove("open"); });

// ─────────────────────────────────────────
// 8. SOCIAL SECTION
// ─────────────────────────────────────────
const SOCIAL_ICONS = {
  discord:   "fa-brands fa-discord",
  twitter:   "fa-brands fa-x-twitter",
  youtube:   "fa-brands fa-youtube",
  instagram: "fa-brands fa-instagram",
  tiktok:    "fa-brands fa-tiktok",
  twitch:    "fa-brands fa-twitch",
  facebook:  "fa-brands fa-facebook",
  other:     "fa fa-link",
};

async function loadSocial() {
  const grid = document.getElementById("social-grid");
  try {
    const q    = query(collection(db, "social_links"), orderBy("order", "asc"));
    const snap = await getDocs(q);

    if (snap.empty) {
      grid.innerHTML = `<p style="color:var(--text-muted); font-family:var(--font-mono)">Réseaux à venir bientôt.</p>`;
      return;
    }

    grid.innerHTML = "";
    snap.forEach(doc => {
      const d    = doc.data();
      const plat = (d.platform || "other").toLowerCase();
      const icon = SOCIAL_ICONS[plat] || SOCIAL_ICONS.other;

      const card = document.createElement("div");
      card.className   = "social-card";
      card.dataset.platform = plat;
      card.innerHTML = `
        <div class="social-icon"><i class="${icon}"></i></div>
        <div class="social-name">${escHtml(d.name || d.platform || "")}</div>
        ${d.description ? `<div class="social-desc">${escHtml(d.description)}</div>` : ""}
        <a href="${escHtml(d.url || "#")}" target="_blank" rel="noopener" class="social-btn">
          <i class="fa fa-arrow-up-right-from-square"></i> Rejoindre
        </a>
      `;
      grid.appendChild(card);
    });
  } catch(e) {
    console.error(e);
  }
}
loadSocial();

// ─────────────────────────────────────────
// 9. UTILS
// ─────────────────────────────────────────
function escHtml(s) {
  if (!s) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

window.showToast = function(msg, type = "") {
  const t = document.getElementById("toast");
  t.textContent  = msg;
  t.className    = "toast " + type + " show";
  setTimeout(() => t.className = "toast", 3000);
};

console.log("%c[UG13S]%c Loaded", "color:#00d4ff;font-weight:bold", "color:#5a7a8a");