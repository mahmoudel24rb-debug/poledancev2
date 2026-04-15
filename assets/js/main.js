/* ============================================================
   Pole Dance Studio v2 — main.js
   Nav, Scroll-spy, Reveal, Reviews slider, FAQ, Map
   ============================================================ */

// === Nav active link (page-based fallback for inner pages) ===
const currentPath = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a[href$=".html"]').forEach(a => {
  if (a.getAttribute('href') === currentPath) a.classList.add('is-active');
});

// === Mobile nav toggle ===
const burger = document.querySelector('.nav__burger');
const navLinks = document.querySelector('.nav__links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  navLinks.addEventListener('click', e => {
    if (e.target.tagName === 'A') {
      navLinks.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

// === Nav shrink on scroll ===
const navWrap = document.querySelector('.nav-wrap');
if (navWrap) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navWrap.classList.toggle('is-scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// === Scroll-spy (anchor links on home) ===
const spySections = document.querySelectorAll('section[id]');
const spyLinks = document.querySelectorAll('.nav__links a[href^="#"]');
if (spySections.length && spyLinks.length) {
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        spyLinks.forEach(l => {
          l.classList.toggle('is-active', l.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  spySections.forEach(s => spy.observe(s));
}

// === Scroll reveal (IntersectionObserver) ===
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.revealDelay;
        if (delay) e.target.style.transitionDelay = delay + 'ms';
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
}

// === FAQ accordion ===
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item.is-open').forEach(i => i.classList.remove('is-open'));
    if (!wasOpen) item.classList.add('is-open');
  });
});

// === Reviews slider (prev/next only, no dots) ===
const track = document.querySelector('.reviews-track');
const prevBtn = document.querySelector('.reviews-prev');
const nextBtn = document.querySelector('.reviews-next');
if (track && prevBtn && nextBtn) {
  const getStep = () => {
    const card = track.querySelector('.testimonial');
    if (!card) return 300;
    return card.offsetWidth + (parseInt(getComputedStyle(track).gap) || 20);
  };
  const updateNav = () => {
    const max = track.scrollWidth - track.clientWidth;
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft >= max - 2;
  };
  prevBtn.addEventListener('click', () => track.scrollBy({ left: -getStep(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: getStep(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

// === Contact form stub ===
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button');
    const orig = btn.textContent;
    btn.textContent = 'Envoyé ✓'; btn.disabled = true;
    setTimeout(() => { btn.textContent = orig; btn.disabled = false; form.reset(); }, 2500);
  });
}

// === Map Leaflet ===
const mapEl = document.getElementById('studio-map');
if (mapEl && typeof L !== 'undefined') {
  const COORDS = [47.3941, 0.7036];
  const map = L.map('studio-map', {
    scrollWheelZoom: false,
    attributionControl: false,
    zoomControl: true
  }).setView(COORDS, 14);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19, subdomains: 'abcd'
  }).addTo(map);

  const markerIcon = L.divIcon({
    className: 'studio-marker',
    html: '<div class="studio-marker__dot"></div>',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  L.marker(COORDS, { icon: markerIcon }).addTo(map)
    .bindPopup('<strong>Pole Dance Studio</strong><br>Tours, France')
    .openPopup();

  setTimeout(() => map.invalidateSize(), 200);
  window.addEventListener('resize', () => map.invalidateSize());
}
