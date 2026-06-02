const products = [
  { id: 'matcha', name: 'Matcha', tone: '#7cc043', link: 'products/matcha.html', note: 'Japanese ceremonial-inspired powder for premium lattes and signature drinks.' },
  { id: 'ube', name: 'Ube', tone: '#8f59d2', link: 'products/ube.html', note: 'Purple yam sweetness for eye-catching beverages and desserts.' },
  { id: 'spirulina', name: 'Spirulina', tone: '#0096b7', link: 'products/spirulina.html', note: 'Blue superfood powder for vibrant wellness menus.' },
  { id: 'taro', name: 'Taro', tone: '#b69ac8', link: 'products/taro.html', note: 'Soft purple taro flavour for creamy drinks.' },
  { id: 'turmeric', name: 'Turmeric', tone: '#d7a326', link: 'products/turmeric.html', note: 'Golden powder for warm functional lattes.' },
  { id: 'cacao', name: 'Cacao', tone: '#7a4a2c', link: 'products/cacao.html', note: 'Deep chocolate body for mochas and hot chocolate.' },
  { id: 'hojicha', name: 'Hojicha', tone: '#9c653d', link: 'products/hojicha.html', note: 'Roasted tea depth with warm nutty character.' },
  { id: 'strawberry', name: 'Strawberry', tone: '#e14b70', link: 'products/strawberry.html', note: 'Bright fruit colour for iced drinks and cream menus.' },
  { id: 'vanilla', name: 'Vanilla', tone: '#e5d4b6', link: 'products/vanilla.html', note: 'Creamy classic flavour for all-day menus.' },
  { id: 'ginger', name: 'Ginger', tone: '#c28a32', link: 'products/ginger.html', note: 'Warm spice for wellness drinks and winter specials.' },
  { id: 'coconut', name: 'Coconut', tone: '#f0e4d3', link: 'products/coconut.html', note: 'Tropical creaminess for smoothies and cold drinks.' },
  { id: 'beetroot', name: 'Beetroot', tone: '#b01855', link: 'products/beetroot.html', note: 'Bold magenta powder for naturally striking creations.' }
];

const grid = document.querySelector('#product-grid');
if (grid) {
  products.forEach((product, index) => {
    const card = document.createElement('a');
    card.className = 'powder-card reveal-card';
    card.href = product.link;
    card.style.setProperty('--tone', product.tone);
    card.innerHTML = `
      <span class="powder-number">${String(index + 1).padStart(2, '0')}</span>
      <span class="powder-orb" aria-hidden="true"></span>
      <span class="powder-name">${product.name}</span>
      <span class="powder-note">${product.note}</span>
      <span class="powder-link">Open product page</span>
    `;
    grid.appendChild(card);
  });
}

const canvas = document.getElementById('powder-canvas');
const ctx = canvas.getContext('2d');
let width = 0;
let height = 0;
let lastScroll = window.scrollY;
let scrollVelocity = 0;
let pointerX = 0.5;
let pointerY = 0.5;
let particles = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth * window.devicePixelRatio;
  height = canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function activePalette() {
  const scenes = [...document.querySelectorAll('.scene')];
  let closest = scenes[0];
  let distance = Infinity;
  scenes.forEach(scene => {
    const rect = scene.getBoundingClientRect();
    const d = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
    if (d < distance) {
      distance = d;
      closest = scene;
    }
  });
  const ids = (closest?.dataset.powders || products.map(p => p.id).join(' ')).split(' ');
  return products.filter(p => ids.includes(p.id));
}

function burst(amount = 7) {
  const palette = activePalette();
  for (let i = 0; i < amount; i++) {
    const p = palette[Math.floor(Math.random() * palette.length)] || products[0];
    const direction = Math.random() > 0.5 ? 1 : -1;
    particles.push({
      x: (0.12 + Math.random() * 0.76) * window.innerWidth,
      y: (0.18 + Math.random() * 0.64) * window.innerHeight,
      vx: direction * (0.4 + Math.random() * 2.2) + (pointerX - 0.5) * 1.8,
      vy: -0.8 - Math.random() * 2.4 + scrollVelocity * 0.025,
      size: 8 + Math.random() * 42,
      life: 1,
      decay: 0.006 + Math.random() * 0.015,
      color: p.tone,
      spin: Math.random() * Math.PI * 2
    });
  }
  if (particles.length > 340) particles = particles.slice(particles.length - 340);
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.globalCompositeOperation = 'screen';

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.018;
    p.vx *= 0.992;
    p.life -= p.decay;
    p.spin += 0.01;

    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    gradient.addColorStop(0, p.color + 'ee');
    gradient.addColorStop(0.42, p.color + '70');
    gradient.addColorStop(1, p.color + '00');
    ctx.globalAlpha = Math.max(p.life, 0) * 0.82;
    ctx.beginPath();
    ctx.ellipse(p.x, p.y, p.size * (1.45 + Math.sin(p.spin) * 0.2), p.size * 0.68, p.spin, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  });

  particles = particles.filter(p => p.life > 0 && p.y < window.innerHeight + 150);
  requestAnimationFrame(draw);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      burst(18);
    }
  });
}, { threshold: 0.28 });

document.querySelectorAll('.reveal-card, .experience, .wholesale-card').forEach(el => observer.observe(el));

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  scrollVelocity = current - lastScroll;
  lastScroll = current;
  const intensity = Math.min(18, Math.max(3, Math.abs(scrollVelocity) / 8));
  burst(intensity);
}, { passive: true });

window.addEventListener('mousemove', (event) => {
  pointerX = event.clientX / window.innerWidth;
  pointerY = event.clientY / window.innerHeight;
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
burst(45);
draw();
