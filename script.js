
const $ = (q, c=document) => c.querySelector(q);
const $$ = (q, c=document) => Array.from(c.querySelectorAll(q));
function setLang(lang){
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  localStorage.setItem('brishid-lang', lang);
  $$('[data-en]').forEach(el => {
    const value = el.dataset[lang];
    if(value !== undefined){ el.textContent = value; }
  });
  $$('[data-placeholder-en]').forEach(el => {
    el.setAttribute('placeholder', lang === 'fa' ? el.dataset.placeholderFa : el.dataset.placeholderEn);
  });
  $$('.lang').forEach(btn => btn.textContent = lang === 'fa' ? 'EN' : 'FA');
}
function toggleLang(){ setLang((localStorage.getItem('brishid-lang') || 'en') === 'en' ? 'fa' : 'en'); }
document.addEventListener('DOMContentLoaded', () => {
  setLang(localStorage.getItem('brishid-lang') || 'en');
  $$('.lang').forEach(btn => btn.addEventListener('click', toggleLang));
  const toggle = $('.mobile-toggle');
  const panel = $('.mobile-panel');
  if(toggle && panel){ toggle.addEventListener('click', () => panel.classList.toggle('open')); }
  $$('form[data-mailto]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent('Brishid wholesale inquiry');
    const body = encodeURIComponent([...data.entries()].map(([k,v]) => `${k}: ${v}`).join('\n'));
    window.location.href = `mailto:info@brishid.com?subject=${subject}&body=${body}`;
  }));
});
