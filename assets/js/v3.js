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
      <span class="powder-sample" aria-hidden="true"></span>
      <span class="powder-name">${product.name}</span>
      <span class="powder-note">${product.note}</span>
      <span class="powder-link">View product</span>
    `;
    grid.appendChild(card);
  });
}

const canvas = document.getElementById('powder-canvas');
const ctx = canvas.getContext('2d');
let dpr = Math.min(window.devicePixelRatio || 1, 2);
let particles = [];
let lastScroll = window.scrollY;
let scrollVelocity = 0;
let centerX = window.innerWidth * 0.56;
let centerY = window.innerHeight * 0.5;
let clockwiseRotation = 0;

function resizeCanvas() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
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

function updateCenter() {
  const stage = document.querySelector('.hero-stage');
  const visibleStage = stage && stage.getBoundingClientRect().bottom > 0 && stage.getBoundingClientRect().top < window.innerHeight;
  if (visibleStage) {
    const rect = stage.getBoundingClientRect();
    centerX = rect.left + rect.width * 0.5;
    centerY = rect.top + rect.height * 0.5;
  } else {
    centerX = window.innerWidth * 0.5;
    centerY = window.innerHeight * 0.48;
  }
}

function circularDust(amount = 8, radiusBase = 130) {
  updateCenter();
  const palette = activePalette();
  const velocityBoost = Math.min(1.4, Math.abs(scrollVelocity) / 90);
  for (let i = 0; i < amount; i++) {
    const product = palette[Math.floor(Math.random() * palette.length)] || products[0];
    const angle = clockwiseRotation + Math.random() * Math.PI * 2;
    const radius = radiusBase + Math.random() * 160;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius * 0.55;

    // Clockwise tangent: dx/dt = sin, dy/dt = -cos.
    const tangentPower = 0.55 + Math.random() * 0.95 + velocityBoost;
    const radialDrift = -0.03 + Math.random() * 0.10;
    particles.push({
      x,
      y,
      vx: Math.sin(angle) * tangentPower + Math.cos(angle) * radialDrift,
      vy: -Math.cos(angle) * tangentPower * 0.55 + Math.sin(angle) * radialDrift,
      size: 1.2 + Math.random() * 4.8,
      life: 0.65 + Math.random() * 0.35,
      decay: 0.008 + Math.random() * 0.014,
      color: product.tone,
      alpha: 0.16 + Math.random() * 0.26,
      grain: Math.random() > 0.72
    });
  }
  if (particles.length > 520) particles = particles.slice(-520);
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  ctx.globalCompositeOperation = 'source-over';
  clockwiseRotation += 0.006;

  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.996;
    p.vy *= 0.996;
    p.life -= p.decay;

    const alpha = Math.max(p.life, 0) * p.alpha;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    if (p.grain) {
      ctx.rect(p.x, p.y, Math.max(0.8, p.size * 0.52), Math.max(0.8, p.size * 0.52));
    } else {
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }
    ctx.fill();
  });

  particles = particles.filter(p => p.life > 0 && p.x > -80 && p.x < window.innerWidth + 80 && p.y > -80 && p.y < window.innerHeight + 80);
  requestAnimationFrame(draw);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      circularDust(42, 95);
    }
  });
}, { threshold: 0.24 });

document.querySelectorAll('.reveal-card, .experience, .wholesale-card').forEach(el => observer.observe(el));

let scrollTimer = null;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  scrollVelocity = current - lastScroll;
  lastScroll = current;
  const amount = Math.min(24, Math.max(6, Math.abs(scrollVelocity) / 8));
  circularDust(amount, 100);
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(() => { scrollVelocity = 0; }, 80);
}, { passive: true });

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
circularDust(90, 110);
draw();
