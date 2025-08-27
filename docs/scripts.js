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

// ==== CAROUSEL ====
const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
let index = 0;

function showSlide(i) {
  if (!track || !items.length) return;
  index = (i + items.length) % items.length;
  track.style.transform = `translateX(-${index * 100}%)`;
}
if (prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => showSlide(index - 1));
  nextBtn.addEventListener('click', () => showSlide(index + 1));
}
showSlide(0);

// Optional: auto-advance every 6s (comment out to disable)
let autoTimer = setInterval(() => showSlide(index + 1), 6000);
[prevBtn, nextBtn, track].forEach(el => el && el.addEventListener('mouseenter', () => clearInterval(autoTimer)));

// ==== LIGHTBOX ====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.querySelector('.lightbox-img');
const closeBtn = document.querySelector('.close');

items.forEach(img => {
  img.addEventListener('click', () => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = img.src;
    lightbox.classList.remove('hidden');
  });
});

if (closeBtn) closeBtn.addEventListener('click', () => lightbox.classList.add('hidden'));
if (lightbox) {
  lightbox.addEventListener('click', (e) => {
    // Close when clicking outside the image
    if (e.target === lightbox) lightbox.classList.add('hidden');
  });
  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.add('hidden');
  });
}
