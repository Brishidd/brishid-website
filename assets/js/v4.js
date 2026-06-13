const root=document.documentElement;
let ticking=false;
window.addEventListener('scroll',()=>{
  if(ticking)return;
  ticking=true;
  requestAnimationFrame(()=>{
    const y=window.scrollY;
    root.style.setProperty('--spin',`${y*.08}deg`);
    root.style.setProperty('--float',`${Math.sin(y*.01)*18}px`);
    ticking=false;
  });
},{passive:true});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible')}
  });
},{threshold:.18});

document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
