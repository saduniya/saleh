/* ============================================================
   SALEH AHMED — PORTFOLIO  |  script.js
   ============================================================ */

'use strict';

/* ── ANIMATED GRID CANVAS ───────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('grid-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const GRID     = 60;
  const DOT_R    = 1.2;
  const C_ACCENT = '0, 229, 160';   // teal-green
  const C_BLUE   = '0, 170, 255';   // electric blue

  let W, H, cols, rows, dots = [];
  let mouseX = -999, mouseY = -999;
  let raf;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    cols = Math.ceil(W / GRID) + 1;
    rows = Math.ceil(H / GRID) + 1;
    buildDots();
  }

  function buildDots() {
    dots = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({ x: c * GRID, y: r * GRID, pulse: Math.random() * Math.PI * 2 });
      }
    }
  }

  function draw(ts) {
    ctx.clearRect(0, 0, W, H);

    /* ── animated gradient bg ── */
    const phase = ts * 0.0003;
    const grd   = ctx.createRadialGradient(
      W * (0.5 + 0.15 * Math.sin(phase)),
      H * (0.5 + 0.12 * Math.cos(phase * 0.8)),
      0,
      W * 0.5, H * 0.5, Math.max(W, H) * 0.85
    );
    grd.addColorStop(0,   `rgba(0,229,160, 0.05)`);
    grd.addColorStop(0.4, `rgba(0,170,255, 0.03)`);
    grd.addColorStop(1,   `rgba(7,9,15,    0)`);
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, W, H);

    /* ── grid lines ── */
    ctx.lineWidth   = 0.35;
    ctx.strokeStyle = `rgba(${C_ACCENT}, 0.055)`;
    for (let c = 0; c < cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * GRID, 0);
      ctx.lineTo(c * GRID, H);
      ctx.stroke();
    }
    for (let r = 0; r < rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0,  r * GRID);
      ctx.lineTo(W,  r * GRID);
      ctx.stroke();
    }

    /* ── dots ── */
    dots.forEach(d => {
      const dx   = d.x - mouseX;
      const dy   = d.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const prox = Math.max(0, 1 - dist / 200);
      const base = 0.09 + 0.06 * Math.sin(d.pulse + ts * 0.0015);
      const alpha = base + prox * 0.55;
      const color = prox > 0.2 ? C_BLUE : C_ACCENT;
      ctx.beginPath();
      ctx.arc(d.x, d.y, DOT_R + prox * 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color}, ${alpha})`;
      ctx.fill();
    });

    raf = requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', e => {
    const rect  = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  window.addEventListener('mouseleave', () => { mouseX = -999; mouseY = -999; });

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  resize();
  raf = requestAnimationFrame(draw);
})();


/* ── TYPEWRITER ─────────────────────────────────────────────── */
(function typewriter() {
  const el = document.getElementById('typed-title');
  if (!el) return;

  const phrases = [
    'Python Learner',
    'Ethical Hacking Enthusiast',
    'Virtual Assistant',
    'Automation Builder',
  ];

  let pi = 0, ci = 0, deleting = false;

  function tick() {
    const current = phrases[pi];
    el.textContent = deleting
      ? current.slice(0, ci--)
      : current.slice(0, ci++);

    let delay = deleting ? 50 : 95;

    if (!deleting && ci > current.length) {
      delay    = 1600;
      deleting = true;
    } else if (deleting && ci < 0) {
      ci       = 0;
      deleting = false;
      pi       = (pi + 1) % phrases.length;
      delay    = 400;
    }
    setTimeout(tick, delay);
  }
  setTimeout(tick, 800);
})();


/* ── NAVBAR SCROLL ──────────────────────────────────────────── */
(function navScroll() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
})();


/* ── MOBILE BURGER ──────────────────────────────────────────── */
(function burger() {
  const btn   = document.getElementById('burger');
  const links = document.getElementById('nav-links');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });
})();


/* ── SCROLL-REVEAL ──────────────────────────────────────────── */
(function scrollReveal() {
  const els = document.querySelectorAll(
    '#about .about-text, #about .skills-wrap, ' +
    '.card, .service-card, ' +
    '.contact-info, .contact-form'
  );
  els.forEach((el, i) => {
    el.classList.add('reveal');
    if (i % 3 === 1) el.classList.add('reveal-delay-1');
    if (i % 3 === 2) el.classList.add('reveal-delay-2');
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
})();


/* ── SKILL BAR ANIMATION ────────────────────────────────────── */
(function skillBars() {
  const bars = document.querySelectorAll('.bar-fill');
  const io   = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.w + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => io.observe(b));
})();


/* ── CONTACT FORM ───────────────────────────────────────────── */
(function contactForm() {
  const form   = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      status.textContent = '⚠ Please fill in the required fields.';
      status.className   = 'form-status error';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      status.textContent = '⚠ Please enter a valid email address.';
      status.className   = 'form-status error';
      return;
    }

    /* Simulate send (no backend) */
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled     = true;
    btn.textContent  = 'Sending…';
    status.textContent = '';

    setTimeout(() => {
      form.reset();
      status.textContent = '✓ Message sent! I\'ll be in touch within 24 hours.';
      status.className   = 'form-status success';
      btn.disabled    = false;
      btn.textContent = 'Send Message';
    }, 1400);
  });
})();


/* ── ACTIVE NAV HIGHLIGHT ───────────────────────────────────── */
(function activeNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.remove('active-link'));
        const active = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
        if (active) active.classList.add('active-link');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => io.observe(s));
})();
