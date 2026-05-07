// ================================================
//  URGENCE 13 SIMULATIONS — app.js
//  Logique globale : Firebase, nav, bulles, footer
// ================================================

import {
  db, auth, storage,
  collection, doc, getDoc, getDocs, setDoc, addDoc, updateDoc, deleteDoc, onSnapshot,
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  ref, uploadBytes, getDownloadURL, deleteObject
} from './firebase.js';

// ── Exposer Firebase globalement ──
window.db = db;
window.auth = auth;
window.storage = storage;

// ================================================
//  NAVBAR
// ================================================
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  // Active link
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === currentPage) a.classList.add('active');
  });

  // Scroll effect
  window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 40);
  });

  // Mobile toggle
  toggle?.addEventListener('click', () => links?.classList.toggle('open'));

  // Close on link click (mobile)
  links?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
}

// ================================================
//  BUBBLES BACKGROUND
// ================================================
function initBubbles() {
  const container = document.querySelector('.bubbles-container');
  if (!container) return;

  const count = 18;
  for (let i = 0; i < count; i++) {
    const b = document.createElement('div');
    b.classList.add('bubble');
    if (Math.random() < 0.15) b.classList.add('red');

    const size = Math.random() * 80 + 15;
    const left = Math.random() * 100;
    const duration = Math.random() * 18 + 8;
    const delay = Math.random() * 15;
    const drift = (Math.random() - 0.5) * 80;

    b.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      --drift: ${drift}px;
    `;
    container.appendChild(b);
  }
}

// ================================================
//  SCROLL ANIMATIONS (fade-in)
// ================================================
function initScrollAnimations() {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

// ================================================
//  SCROLL TO TOP
// ================================================
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400));
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ================================================
//  FOOTER — Chargement dynamique depuis Firebase
// ================================================
async function loadFooter() {
  try {
    const snap = await getDoc(doc(db, 'config', 'site'));
    const cfg = snap.exists() ? snap.data() : {};

    const logoEl       = document.getElementById('footer-logo');
    const nameEl       = document.getElementById('footer-name');
    const descEl       = document.getElementById('footer-desc');
    const copyrightEl  = document.getElementById('footer-copyright');
    const devEl        = document.getElementById('footer-dev');
    const discordLink  = document.getElementById('footer-discord-link');
    const discordBtn   = document.getElementById('footer-discord-btn');

    if (logoEl && cfg.logo) { logoEl.src = cfg.logo; logoEl.style.display = 'block'; logoEl.nextElementSibling?.remove(); }
    if (nameEl) nameEl.innerHTML = cfg.siteName ? cfg.siteName.replace(' ', ' <span>') + '</span>' : 'Urgence 13 <span>Simulations</span>';
    if (descEl) descEl.textContent = cfg.description || 'Serveur FiveM de simulation d\'urgence réaliste.';
    if (copyrightEl) copyrightEl.textContent = cfg.copyright || `© ${new Date().getFullYear()} Urgence 13 Simulations. Tous droits réservés.`;
    if (devEl) devEl.innerHTML = cfg.developer ? `Développé par <a href="${cfg.developerUrl || '#'}">${cfg.developer}</a>` : '';
    if (discordLink) discordLink.href = cfg.discordUrl || '#';
    if (discordBtn)  discordBtn.href  = cfg.discordUrl || '#';
  } catch(e) {
    console.warn('Footer config non chargée :', e);
  }
}

// ================================================
//  NAVBAR — Chargement logo/nom depuis Firebase
// ================================================
async function loadNavConfig() {
  try {
    const snap = await getDoc(doc(db, 'config', 'site'));
    const cfg = snap.exists() ? snap.data() : {};

    const logoEl  = document.querySelector('.nav-logo');
    const titleEl = document.querySelector('.nav-title');

    if (logoEl && cfg.logo) { logoEl.src = cfg.logo; logoEl.style.display = 'block'; }
    if (titleEl && cfg.siteName) {
      const parts = cfg.siteName.split(' ');
      titleEl.textContent = '';
      titleEl.append(parts.slice(0, -1).join(' ') + ' ');
      const span = document.createElement('span');
      span.textContent = parts[parts.length - 1];
      titleEl.appendChild(span);
    }
  } catch(e) {}
}

// ================================================
//  TOAST
// ================================================
window.showToast = function(msg, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = '';
  toast.className = `toast ${type}`;
  const icon = document.createElement('span');
  icon.textContent = type === 'success' ? '✅' : '❌';
  toast.prepend(icon);
  toast.append(' ' + msg);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
};

// ================================================
//  UPLOAD IMAGE vers Firebase Storage
// ================================================
window.uploadImage = async function(file, path) {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// ================================================
//  INIT
// ================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initBubbles();
  initScrollAnimations();
  initScrollTop();
  loadFooter();
  loadNavConfig();
});