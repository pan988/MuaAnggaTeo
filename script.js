document.addEventListener('DOMContentLoaded', () => {

  /* ---------- PAGE TRANSITION (fade like Beranda) ---------- */
  const overlay = document.querySelector('.page-transition-overlay');
  if (overlay) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => overlay.classList.add('hide'));
    });

    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const isSamePageAnchor = href.startsWith('#');
      const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
      const isInternalPage = !isSamePageAnchor && !isExternal;
      if (isInternalPage) {
        link.addEventListener('click', function (e) {
          e.preventDefault();
          overlay.classList.remove('hide');
          setTimeout(() => { window.location.href = href; }, 380);
        });
      }
    });
  }

  /* ---------- ACTIVE NAV LINK ---------- */
  const current = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a, .mobile-panel a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
  });

  /* ---------- MOBILE MENU TOGGLE ---------- */
  const burger = document.getElementById('burgerBtn');
  const panel = document.getElementById('mobilePanel');
  if (burger && panel) {
    burger.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('open');
      burger.classList.toggle('open', isOpen);
      burger.setAttribute('aria-expanded', isOpen);
    });
  }

  /* ---------- PORTFOLIO FILTER ---------- */
  const filters = document.querySelectorAll('.filter');
  const items = document.querySelectorAll('.gallery-item');
  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.cat;
      items.forEach(item => {
        const show = cat === 'semua' || item.dataset.cat === cat;
        item.classList.toggle('is-hidden', !show);
      });
    });
  });

  /* ---------- PRESELECT PAKET FROM URL (?paket=Premium) ---------- */
  const paketSelect = document.getElementById('paketSelect');
  if (paketSelect) {
    const params = new URLSearchParams(location.search);
    const paket = params.get('paket');
    if (paket) paketSelect.value = paket;
  }

  /* ---------- BOOKING FORM -> WHATSAPP ---------- */
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(bookingForm);
      const nama = data.get('nama');
      const wa = data.get('wa');
      const tanggal = data.get('tanggal');
      const paket = data.get('paket');
      const catatan = data.get('catatan') || '-';
      const text = `Halo kak, saya mau booking makeup.%0ANama: ${encodeURIComponent(nama)}%0ANo WA: ${encodeURIComponent(wa)}%0ATanggal Acara: ${encodeURIComponent(tanggal)}%0APaket: ${encodeURIComponent(paket)}%0ACatatan: ${encodeURIComponent(catatan)}`;
      window.open(`https://wa.me/6282266145607?text=${text}`, '_blank');
    });
  }

  /* ---------- SCROLL REVEAL ----------
     Auto-tags common elements with data-reveal so nothing in the HTML
     needs to change. Elements fade + slide in the first time they enter
     the viewport, staggered one after another within their own section. */
  const revealGroups = [
    { selector: '.about-img', type: 'left' },
    { selector: '.about-text', type: 'right' },
    { selector: '.section-head', type: 'up' },
    { selector: '.stat-grid .stat-card', type: 'up' },
    { selector: '.contact-info-grid .stat-card', type: 'up' },
    { selector: '.gallery-item', type: 'zoom' },
    { selector: '.price-card', type: 'up' },
    { selector: '.test-card', type: 'up' },
    { selector: '.step', type: 'up' },
    { selector: '.contact-social-item', type: 'up' },
    { selector: '.page-header .eyebrow', type: 'up' },
    { selector: '.page-header h1', type: 'up' },
    { selector: '.page-header p', type: 'up' },
    { selector: '.booking-form', type: 'up' }
  ];

  revealGroups.forEach(({ selector, type }) => {
    const byParent = new Map();
    document.querySelectorAll(selector).forEach(el => {
      if (el.hasAttribute('data-reveal')) return;
      const parent = el.parentElement;
      const idx = byParent.get(parent) || 0;
      byParent.set(parent, idx + 1);
      el.setAttribute('data-reveal', type);
      el.style.transitionDelay = Math.min(idx * 90, 450) + 'ms';
    });
  });

  const supportsIO = 'IntersectionObserver' in window;
  const revealTargets = document.querySelectorAll('[data-reveal]');

  if (supportsIO) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealTargets.forEach(el => io.observe(el));
  } else {
    // fallback: just show everything if the browser can't do IntersectionObserver
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }
});