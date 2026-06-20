/* ============================================================
   PORTFOLIO JAVASCRIPT – SATYA MANIKANTA YALLA
   Handles: CustomCursor, Particles, Typewriter, Scroll, Counters, Tabs, Form
   ============================================================ */

'use strict';

// ============================================================
// 0. CUSTOM ANIMATED CURSOR
// ============================================================
(function initCustomCursor() {
  // Skip on touch devices
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

  const dot   = document.getElementById('cursor-dot');
  const ring  = document.getElementById('cursor-ring');
  const trail = document.getElementById('cursor-trail');
  if (!dot || !ring || !trail) return;

  // Mouse position (exact)
  let mx = -200, my = -200;
  // Ring/trail position (lerped)
  let rx = -200, ry = -200;
  let tx = -200, ty = -200;

  // Lerp factors — ring is slower (more lag), trail is medium
  const RING_LERP  = 0.12;
  const TRAIL_LERP = 0.22;

  // Track actual mouse
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Lerp helper
  function lerp(a, b, t) { return a + (b - a) * t; }

  // Animation loop
  (function loop() {
    // Dot snaps exactly to mouse
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    // Ring lags behind with lerp
    rx = lerp(rx, mx, RING_LERP);
    ry = lerp(ry, my, RING_LERP);
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    // Trail lags behind ring
    tx = lerp(tx, rx, TRAIL_LERP);
    ty = lerp(ty, ry, TRAIL_LERP);
    trail.style.left = tx + 'px';
    trail.style.top  = ty + 'px';

    requestAnimationFrame(loop);
  })();

  // Hover state — detect interactive elements
  const hoverTargets = 'a, button, .project-card, .stat-card, .ts-category, .skill-item, .achievement-card, .edu-card, .nav-link, .btn, .social-link, input, textarea, label, .skills-tab, .timeline-card';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Click ripple burst
  document.addEventListener('mousedown', e => {
    document.body.classList.add('cursor-click');

    // Create ripple element
    const ripple = document.createElement('div');
    ripple.className = 'cursor-ripple';
    ripple.style.left   = e.clientX + 'px';
    ripple.style.top    = e.clientY + 'px';
    ripple.style.width  = '28px';
    ripple.style.height = '28px';
    document.body.appendChild(ripple);

    // Remove ripple after animation
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity   = '0';
    ring.style.opacity  = '0';
    trail.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity   = '';
    ring.style.opacity  = '';
    trail.style.opacity = '';
  });
}());

// ============================================================
// 1. PARTICLE SYSTEM
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.r  = Math.random() * 1.8 + 0.4;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.alpha = Math.random() * 0.5 + 0.1;
    const palette = ['38,189,248', '99,102,241', '168,85,247', '16,185,129'];
    this.color = palette[Math.floor(Math.random() * palette.length)];
  };

  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < -10 || this.x > canvas.width + 10 ||
        this.y < -10 || this.y > canvas.height + 10) {
      this.reset();
    }
  };

  Particle.prototype.draw = function () {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.fill();
    ctx.restore();
  };

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    animId = requestAnimationFrame(loop);
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 100);
    particles = Array.from({ length: count }, () => new Particle());
    if (animId) cancelAnimationFrame(animId);
    loop();
  }

  window.addEventListener('resize', init);
  init();
}());

// ============================================================
// 2. TYPEWRITER EFFECT
// ============================================================
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'Enterprise Web Apps',
    'Scalable REST APIs',
    'Angular Frontends',
    'Cloud Platforms',
    'Real-Time Systems',
    'SSO with Keycloak',
  ];

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = phrases[phraseIdx];
    el.textContent = deleting
      ? current.slice(0, charIdx--)
      : current.slice(0, charIdx++);

    let delay = deleting ? 60 : 90;
    if (!deleting && charIdx > current.length) {
      delay = 1800;
      deleting = true;
    } else if (deleting && charIdx < 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      charIdx = 0;
      delay = 400;
    }
    setTimeout(tick, delay);
  }

  setTimeout(tick, 800);
}());

// ============================================================
// 3. NAVIGATION – SCROLL & MOBILE TOGGLE
// ============================================================
(function initNav() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const btt       = document.getElementById('back-to-top');
  const allLinks  = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar?.classList.toggle('scrolled', y > 50);
    btt?.classList.toggle('visible', y > 400);

    // Active section highlighting
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (y >= top) current = sec.id;
    });
    allLinks.forEach(a => {
      a.classList.toggle('active', a.dataset.section === current);
    });
  });

  hamburger?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks?.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      const spans = hamburger?.querySelectorAll('span');
      spans?.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}());

// ============================================================
// 4. SCROLL REVEAL
// ============================================================
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  els.forEach(el => observer.observe(el));
}());

// ============================================================
// 5. COUNTER ANIMATION
// ============================================================
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const duration = 1800;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current);
        if (current >= target) clearInterval(timer);
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}());

// ============================================================
// 6. SKILLS TABS + BAR ANIMATION
// ============================================================
(function initSkills() {
  const tabs   = document.querySelectorAll('.skills-tab');
  const panels = document.querySelectorAll('.skills-panel');

  function activatePanel(tab) {
    const target = tab.dataset.tab;
    tabs.forEach(t   => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.querySelector(`.skills-panel[data-panel="${target}"]`);
    if (!panel) return;
    panel.classList.add('active');
    // animate bars
    setTimeout(() => {
      panel.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.width = fill.dataset.width + '%';
      });
    }, 100);
  }

  tabs.forEach(tab => tab.addEventListener('click', () => activatePanel(tab)));

  // Trigger first panel bars when section enters viewport
  const skillsSection = document.getElementById('skills');
  let triggered = false;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !triggered) {
        triggered = true;
        const activeTab = document.querySelector('.skills-tab.active');
        if (activeTab) activatePanel(activeTab);
      }
    });
  }, { threshold: 0.2 });

  if (skillsSection) observer.observe(skillsSection);
}());

// ============================================================
// 7. CONTACT FORM
// ============================================================
function handleFormSubmit(e) {
  e.preventDefault();
  const btn     = document.getElementById('form-submit-btn');
  const success = document.getElementById('form-success');
  const form    = document.getElementById('contact-form');

  btn.innerHTML = '<span>Sending…</span>';
  btn.disabled  = true;
  btn.style.opacity = '0.7';

  setTimeout(() => {
    btn.innerHTML = `<span>Send Message</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>`;
    btn.disabled  = false;
    btn.style.opacity = '';
    success?.classList.add('visible');
    form.reset();
    setTimeout(() => success?.classList.remove('visible'), 5000);
  }, 1400);
}

// ============================================================
// 8. SCROLL INDICATOR HIDE
// ============================================================
window.addEventListener('scroll', () => {
  const si = document.getElementById('scroll-indicator');
  if (si) si.style.opacity = window.scrollY > 80 ? '0' : '1';
}, { passive: true });

// ============================================================
// 9. SMOOTH HOVER TILT ON PROJECT CARDS
// ============================================================
(function initTilt() {
  document.querySelectorAll('.project-card, .stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rx     = (y - cy) / cy * 5;
      const ry     = (cx - x) / cx * 5;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}());

// ============================================================
// 10. AURORA BG GRADIENT FOLLOW MOUSE
// ============================================================
(function initAurora() {
  const overlay = document.querySelector('.hero-bg-overlay');
  if (!overlay) return;
  document.addEventListener('mousemove', e => {
    const xPct = (e.clientX / window.innerWidth  * 100).toFixed(1);
    const yPct = (e.clientY / window.innerHeight * 100).toFixed(1);
    overlay.style.background = `
      radial-gradient(ellipse 80% 60% at ${xPct}% ${yPct}%, rgba(56,189,248,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 60% 80% at ${100 - xPct}% ${100 - yPct}%, rgba(168,85,247,0.08) 0%, transparent 60%)
    `;
  });
}());

console.log('%c SMY Portfolio Loaded ✓ ', 'background: linear-gradient(135deg,#38bdf8,#6366f1,#a855f7); color:#fff; padding:8px 16px; border-radius:6px; font-weight:bold;');
