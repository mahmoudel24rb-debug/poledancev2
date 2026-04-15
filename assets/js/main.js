/* ============================================================
   Pole Dance Studio v2 — main.js
   Nav, Scroll reveal, Testimonials slider, FAQ, Map
   ============================================================ */

// --------------- Nav active link ---------------
const currentPath = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav__links a').forEach(a => {
  if (a.getAttribute('href') === currentPath) a.classList.add('is-active');
});

// --------------- Mobile nav ---------------
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

// --------------- Nav shrink on scroll ---------------
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

// --------------- Scroll reveal (IntersectionObserver) ---------------
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReduced) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        // Apply delay if set
        const delay = e.target.dataset.revealDelay;
        if (delay) {
          e.target.style.transitionDelay = delay + 'ms';
        }
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
}

// --------------- FAQ accordion ---------------
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq-item.is-open').forEach(i => i.classList.remove('is-open'));
    if (!wasOpen) item.classList.add('is-open');
  });
});

// --------------- Testimonials slider ---------------
const track = document.querySelector('.testimonials-track');
const prevBtn = document.querySelector('.slider-prev');
const nextBtn = document.querySelector('.slider-next');
const dotsWrap = document.querySelector('.slider-dots');

if (track && prevBtn && nextBtn) {
  const cards = track.querySelectorAll('.testimonial');
  const getStep = () => {
    const cardW = cards[0]?.offsetWidth || 300;
    return cardW + (parseInt(getComputedStyle(track).gap) || 20);
  };

  // Generate dots
  if (dotsWrap) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', 'Avis ' + (i + 1));
      dot.addEventListener('click', () => {
        track.scrollTo({ left: i * getStep(), behavior: 'smooth' });
      });
      dotsWrap.appendChild(dot);
    });
  }

  const updateNav = () => {
    const scrollMax = track.scrollWidth - track.clientWidth;
    const idx = Math.round(track.scrollLeft / getStep());
    prevBtn.disabled = track.scrollLeft <= 2;
    nextBtn.disabled = track.scrollLeft >= scrollMax - 2;
    if (dotsWrap) {
      dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === idx);
      });
    }
  };

  prevBtn.addEventListener('click', () => track.scrollBy({ left: -getStep(), behavior: 'smooth' }));
  nextBtn.addEventListener('click', () => track.scrollBy({ left: getStep(), behavior: 'smooth' }));
  track.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}

// --------------- Contact form stub ---------------
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

// --------------- Leaflet map (conditional) ---------------
const mapEl = document.getElementById('studio-map');
if (mapEl && typeof L !== 'undefined') {
  const map = L.map('studio-map', { scrollWheelZoom: false, attributionControl: false }).setView([47.3941, 0.7036], 14);
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(map);
  L.marker([47.3941, 0.7036]).addTo(map).bindPopup('Pole Dance Studio').openPopup();
  setTimeout(() => map.invalidateSize(), 200);
  window.addEventListener('resize', () => map.invalidateSize());
}
