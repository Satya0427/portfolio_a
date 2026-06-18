// Lightweight interactions: typed text, reveal on scroll, modal, nav download
document.addEventListener('DOMContentLoaded', () => {
  // Insert current year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Typed effect
  const phrases = [
    'Angular • Node.js • REST APIs',
    'Reusable UI components • Scalable backends',
    'AWS S3 • Nginx • CI/CD'
  ];
  const typeEl = document.getElementById('typeText');
  let pi = 0, ci = 0, deleting = false;
  function tick(){
    const txt = phrases[pi];
    if(!deleting){
      typeEl.textContent = txt.slice(0, ci+1);
      ci++;
      if(ci === txt.length){ deleting = true; setTimeout(tick, 900); return; }
    } else {
      typeEl.textContent = txt.slice(0, ci-1);
      ci--;
      if(ci === 0){ deleting=false; pi = (pi+1)%phrases.length; }
    }
    setTimeout(tick, deleting ? 40 : 60);
  }
  tick();

  // Simple scroll reveal
  const observers = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting) e.target.classList.add('show');
    });
  }, {threshold: 0.12});
  document.querySelectorAll('.reveal').forEach(el => observers.observe(el));

  // Project modal
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  document.querySelectorAll('[data-open]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-open');
      openProject(id);
    });
  });
  function openProject(id){
    const data = {
      1: {
        title: 'FOIS Migration — Indian Railways',
        body: `<p>Led migration of legacy Freight Operations apps (TMS, RMS, OCC) to Angular; built reusable tables and modules, integrated with backend services.</p><p><strong>Tech:</strong> Angular 15 · Node.js · WebLogic</p>`
      },
      2: {
        title: 'Bhuvi — Land Management System',
        body: `<p>Role-based land management for owners/agents with geofencing and secure workflows.</p><p><strong>Tech:</strong> Angular · C# Web API · SQL Server</p>`
      },
      3: {
        title: 'HRMS & Inventory',
        body: `<p>Scalable HRMS for managing employees and inventory. AWS S3 for document storage, Redis cache for performance.</p><p><strong>Tech:</strong> Node.js · MySQL · Redis · AWS S3</p>`
      },
      4: {
        title: 'Jio Humsafar — B2B Logistics',
        body: `<p>Designed features and scalable REST APIs handling high throughput with improved response times.</p><p><strong>Tech:</strong> Angular · Node.js · MongoDB · Kafka</p>`
      }
    };
    const item = data[id];
    modalContent.innerHTML = `<h3 style="margin-top:0">${item.title}</h3>${item.body}<p style="margin-top:12px"><em>Want code samples or a dev walkthrough? I can prepare a case-specific write-up.</em></p>`;
    modal.setAttribute('aria-hidden','false');
  }
  modalClose.addEventListener('click', () => modal.setAttribute('aria-hidden','true'));
  modal.addEventListener('click', (e) => { if(e.target === modal) modal.setAttribute('aria-hidden','true'); });

  // Contact send (mock)
  document.getElementById('sendMsg').addEventListener('click', () => {
    const form = document.getElementById('contactForm');
    const fd = new FormData(form);
    // Basic UI feedback (in real site, send via API)
    alert(`Thanks ${fd.get('name') || ''}! Message queued to ${fd.get('email') || ''}.`);
    form.reset();
  });

  // Download resume link — points to provided PDF filename; replace path as needed
  document.getElementById('downloadResume').addEventListener('click', () => {
    window.location.href = 'Satya_Manikanta_Yalla_MEAN_Developer.pdf';
  });

  // Small parallax tilt for media card
  const media = document.getElementById('mediaCard');
  if(media){
    media.addEventListener('mousemove', (e) => {
      const rect = media.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      media.style.transform = `rotateX(${ -y * 6 }deg) rotateY(${ x * 8 }deg) translateZ(6px)`;
    });
    media.addEventListener('mouseleave', () => { media.style.transform = ''; });
  }

  // Mobile burger toggle
  const burger = document.querySelector('.burger');
  const navLinks = document.querySelector('.nav-links');
  if(burger){
    burger.addEventListener('click', () => {
      if(navLinks.style.display === 'flex') navLinks.style.display = '';
      else navLinks.style.display = 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.gap = '10px';
      navLinks.style.padding = '12px';
      navLinks.style.background = 'rgba(255,255,255,0.02)';
      navLinks.style.borderRadius = '10px';
    });
  }
});
