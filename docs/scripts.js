// ==== THEME TOGGLE (prefers-color-scheme aware) ====
const toggle = document.getElementById('themeToggle');
(function initTheme(){
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const startDark = saved ? saved === 'dark' : prefersDark;
  document.body.classList.remove('light','dark');
  document.body.classList.add(startDark ? 'dark' : 'light');
  if (toggle) {
    toggle.setAttribute('aria-pressed', startDark ? 'true' : 'false');
    toggle.textContent = startDark ? '☀️' : '🌙';
    toggle.addEventListener('click', ()=>{
      const isDark = document.body.classList.toggle('dark');
      document.body.classList.toggle('light', !isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      toggle.textContent = isDark ? '☀️' : '🌙';
    });
  }
})();

// ==== CAROUSEL (3-up desktop, 1-up mobile) + DOTS ====
const viewport = document.querySelector('.viewport');
const track = document.querySelector('.carousel-track');
const items = Array.from(document.querySelectorAll('.carousel-item'));
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const dotsWrap = document.querySelector('.dots');

let visible = window.innerWidth <= 700 ? 1 : 3;  // items per page
let page = 0;
let pages = Math.max(1, Math.ceil(items.length / visible));

function setVisibleByViewport(){
  const newVisible = window.innerWidth <= 700 ? 1 : 3;
  if (newVisible !== visible) {
    visible = newVisible;
    pages = Math.max(1, Math.ceil(items.length / visible));
    page = Math.min(page, pages - 1);
    renderDots();
    goToPage(page, false);
  }
}

function goToPage(p, animate = true) {
  page = Math.max(0, Math.min(p, pages - 1));
  if (!track) return;
  if (!animate) track.style.transition = 'none';
  const offsetPercent = -(page * 100);
  track.style.transform = `translateX(${offsetPercent}%)`;
  if (!animate) {
    void track.offsetWidth; // reflow
    track.style.transition = '';
  }
  updateDots();
}

function renderDots(){
  if (!dotsWrap) return;
  dotsWrap.innerHTML = '';
  for (let i=0; i<pages; i++){
    const d = document.createElement('button');
    d.className = 'dot' + (i===page ? ' active' : '');
    d.setAttribute('aria-label', `Go to slide ${i+1}`);
    d.addEventListener('click', ()=>goToPage(i));
    dotsWrap.appendChild(d);
  }
}

function updateDots(){
  if (!dotsWrap) return;
  [...dotsWrap.children].forEach((n,i)=>n.classList.toggle('active', i===page));
}

if (prevBtn) prevBtn.addEventListener('click', ()=>goToPage(page - 1));
if (nextBtn) nextBtn.addEventListener('click', ()=>goToPage(page + 1));

// Keyboard nav within viewport
if (viewport) {
  viewport.addEventListener('keydown', (e)=>{
    if (e.key === 'ArrowLeft') { e.preventDefault(); goToPage(page - 1); }
    if (e.key === 'ArrowRight'){ e.preventDefault(); goToPage(page + 1); }
  });
}

// Auto-advance (pause on hover)
let auto = setInterval(()=>goToPage(page + 1), 6000);
[viewport, prevBtn, nextBtn].forEach(el => el && el.addEventListener('mouseenter', ()=>{ clearInterval(auto); auto = null; }));

// Initialize
renderDots();
goToPage(0, false);
window.addEventListener('resize', setVisibleByViewport);

// ==== LIGHTBOX ====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.close');

items.forEach(item => {
  const img = item.querySelector('img');
  img.addEventListener('click', () => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.src;
    lightbox.classList.remove('hidden');
  });
});

if (closeBtn) closeBtn.addEventListener('click', () => lightbox.classList.add('hidden'));
if (lightbox) {
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.add('hidden'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.add('hidden'); });
}
