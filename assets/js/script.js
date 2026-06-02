/*
  script.js

  This file dynamically constructs the catalogue on page load and
  orchestrates basic scroll‑activated animations. Each powder entry in
  the products array contains a name, a hex colour used for tinting the
  card, and a short tagline drawn from the original Brishid catalogue.

  Intersection observers are used to reveal cards as they enter the
  viewport. Feel free to extend this script with more advanced 3D or
  scroll animations if building upon this foundation.
*/

document.addEventListener('DOMContentLoaded', () => {
  const products = [
    {
      name: 'Matcha',
      color: '#6ca03c',
      tagline: 'Vibrant green, smooth flavor & pure origin.'
    },
    {
      name: 'Ube',
      color: '#7e4ca0',
      tagline: 'Sweet and earthy purple yam powder for trendy drinks & desserts.'
    },
    {
      name: 'Spirulina',
      color: '#005c86',
      tagline: 'Deep blue superfood powder for vivid smoothies & drinks.'
    },
    {
      name: 'Taro',
      color: '#b299c1',
      tagline: 'Creamy taro root powder with natural lilac hue for cozy creations.'
    },
    {
      name: 'Turmeric',
      color: '#c7972e',
      tagline: 'Golden turmeric latte powder rich in curcumin.'
    },
    {
      name: 'Cacao',
      color: '#6b4226',
      tagline: 'Rich cacao powder for decadent mochas & chocolate drinks.'
    },
    {
      name: 'Hojicha',
      color: '#8c5734',
      tagline: 'Roasted green tea powder for warm, toasty drinks.'
    },
    {
      name: 'Strawberry',
      color: '#d65a6f',
      tagline: 'Sweet and bright strawberry powder for fruity beverages.'
    },
    {
      name: 'Vanilla',
      color: '#e8d5b7',
      tagline: 'Smooth vanilla powder for creamy drinks & desserts.'
    },
    {
      name: 'Ginger',
      color: '#d2a45e',
      tagline: 'Spicy and invigorating ginger powder for wellness lattes.'
    },
    {
      name: 'Coconut',
      color: '#f5f5f2',
      tagline: 'Creamy coconut powder for tropical drinks and smoothies.'
    },
    {
      name: 'Beetroot',
      color: '#8c1f4b',
      tagline: 'Earthy beetroot powder for natural pink drinks & bakes.'
    }
  ];

  const container = document.getElementById('productContainer');

  // Build each product card.
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.setProperty('--color', product.color);

    const h3 = document.createElement('h3');
    h3.textContent = `${product.name} Powder`;
    card.appendChild(h3);

    const p = document.createElement('p');
    p.textContent = product.tagline;
    card.appendChild(p);

    // Optionally, we could add click handlers here to open detail pages.
    card.addEventListener('click', () => {
      alert(`${product.name} page is under construction!`);
    });

    container.appendChild(card);
  });

  // Intersection observer for reveal animations.
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  // Observe each product card after creation.
  document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
  });
});