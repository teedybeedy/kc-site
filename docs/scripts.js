// ==== THEME TOGGLE ====
const toggle = document.getElementById('themeToggle');
if (toggle) {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') {
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    toggle.textContent = '☀️';
  } else {
    document.body.classList.add('light');
    toggle.textContent = '🌙';
  }

  toggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark');
    document.body.classList.toggle('light', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    toggle.textContent = isDark ? '☀️' : '🌙';
  });
}

// ==== CAROUSEL (3-up desktop, 1-up mobile) ====
const viewport = document.querySelector('.viewport');
const track = document.querySelector('.carousel-track');
const items = Array.from(document.querySelectorAll('.carousel-item'));
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');

let visible = window.innerWidth <= 700 ? 1 : 3;  // items per view
let page = 0;                                     // current page (0-based)
let pages = Math.max(1, Math.ceil(items.length / visible));

function updateVisible() {
  const newVisible = window.innerWidth <= 700 ? 1 : 3;
  if (newVisible !== visible) {
    visible = newVisible;
    pages = Math.max(1, Math.ceil(items.length / visible));
    page = Math.min(page, pages - 1);
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
    // force reflow to apply transition reset cleanly next time
    void track.offsetWidth;
    track.style.transition = '';
  }
}

// Buttons
if (prevBtn) prevBtn.addEventListener('click', () => goToPage(page - 1));
if (nextBtn) nextBtn.addEventListener('click', () => goToPage(page + 1));

// Auto-advance every 6s; pause on hover
let auto = setInterval(() => goToPage(page + 1), 6000);
[viewport, prevBtn, nextBtn].forEach(el => el && el.addEventListener('mouseenter', () => { clearInterval(auto); auto = null; }));

// Initialize
goToPage(0, false);
window.addEventListener('resize', () => { updateVisible(); });

// ==== LIGHTBOX ====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.close');

// Delegate click from images to open
items.forEach(item => {
  const img = item.querySelector('img');
  img.addEventListener('click', () => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.src;
    lightbox.classList.remove('hidden');
  });
});

// Close actions
if (closeBtn) closeBtn.addEventListener('click', () => lightbox.classList.add('hidden'));
if (lightbox) {
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.add('hidden'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') lightbox.classList.add('hidden'); });
}
