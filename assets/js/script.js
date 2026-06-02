/*
 * Brishid interactive catalogue script
 *
 * This script dynamically injects product cards into the catalogue grid
 * and attaches an IntersectionObserver to animate them into view as
 * users scroll. Each card is assigned both a descriptive class (e.g.,
 * `matcha`) and an ID based on its product key; the corresponding
 * CSS uses these classes to apply unique swirling backgrounds.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Define the product catalogue. Each entry corresponds to one of
  // Brishid's powders. The `id` property must match a CSS class
  // defined in style.css so that the correct coloured swirl is applied.
  const products = [
    { id: 'matcha', name: 'Ceremonial Matcha', tagline: 'Japanese heritage in every cup.' },
    { id: 'ube', name: 'Ube Powder', tagline: 'Rich, creamy purple sweetness.' },
    { id: 'spirulina', name: 'Spirulina Powder', tagline: 'Vivid blue superfood for wellness.' },
    { id: 'taro', name: 'Taro Powder', tagline: 'Sweet taro creaminess in style.' },
    { id: 'turmeric', name: 'Turmeric Powder', tagline: 'Golden warmth and ancient spice.' },
    { id: 'cacao', name: 'Cacao Powder', tagline: 'Deep chocolate for indulgent drinks.' },
    { id: 'hojicha', name: 'Hojicha Powder', tagline: 'Roasted tea with nutty notes.' },
    { id: 'strawberry', name: 'Strawberry Powder', tagline: 'Vibrant pink for fruity delights.' },
    { id: 'vanilla', name: 'Vanilla Powder', tagline: 'Sweet and creamy classic flavour.' },
    { id: 'ginger', name: 'Ginger Powder', tagline: 'Warm spice for invigorating blends.' },
    { id: 'coconut', name: 'Coconut Powder', tagline: 'Tropical white for smooth sips.' },
    { id: 'beetroot', name: 'Beetroot Powder', tagline: 'Bold magenta with earthy sweetness.' }
  ];

  const grid = document.getElementById('product-grid');
  if (grid) {
    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('card', product.id);
      card.innerHTML = `
        <h3>${product.name}</h3>
        <p>${product.tagline}</p>
      `;
      grid.appendChild(card);
    });
  }

  // IntersectionObserver to animate cards into view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.25
  });

  document.querySelectorAll('.card').forEach(card => {
    observer.observe(card);
  });
});