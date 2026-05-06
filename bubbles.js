// bubbles.js — Animated bubble background
(function() {
  const container = document.getElementById('bubblesContainer');
  if (!container) return;

  const BUBBLE_COUNT = 18;
  const colors = [
    'rgba(0,212,255,0.18)',
    'rgba(123,97,255,0.15)',
    'rgba(0,212,255,0.08)',
    'rgba(123,97,255,0.22)',
    'rgba(0,180,255,0.12)',
  ];

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function createBubble() {
    const el = document.createElement('div');
    el.classList.add('bubble');

    const size = randomBetween(30, 140);
    const left = randomBetween(0, 100);
    const duration = randomBetween(12, 30);
    const delay = randomBetween(0, 20);
    const drift = randomBetween(-80, 80);
    const color = colors[Math.floor(Math.random() * colors.length)];

    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      --drift: ${drift}px;
      background: radial-gradient(circle at 30% 30%, ${color}, transparent 70%);
      border: 1px solid ${color.replace(/[\d.]+\)$/, '0.3)')};
    `;

    container.appendChild(el);
  }

  for (let i = 0; i < BUBBLE_COUNT; i++) {
    createBubble();
  }
})();