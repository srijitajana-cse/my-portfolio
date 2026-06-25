/* ============================================================
   SRIJITA JANA — NEBULA PORTFOLIO · script.js
   ============================================================ */

'use strict';

/* ── 1. THEME TOGGLE ── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
const body        = document.body;

function applyTheme(theme) {
  if (theme === 'light') {
    body.classList.add('light-mode');
    themeIcon.className = 'fas fa-moon';
  } else {
    body.classList.remove('light-mode');
    themeIcon.className = 'fas fa-sun';
  }
}

// Default: dark
const savedTheme = localStorage.getItem('sj-theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const isLight = body.classList.contains('light-mode');
  const next = isLight ? 'dark' : 'light';
  localStorage.setItem('sj-theme', next);
  applyTheme(next);
});

/* ── 2. NAVBAR — scroll state + active link ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveLink();
  updateScrollProgress();
  updateBackToTop();
  triggerCounters();
  triggerBars();
}, { passive: true });

function updateScrollProgress() {
  const el = document.getElementById('scrollProgress');
  const total = document.documentElement.scrollHeight - window.innerHeight;
  el.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
}

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const scrollY  = window.scrollY + 120;

  sections.forEach(section => {
    const top    = section.offsetTop;
    const height = section.offsetHeight;
    const id     = section.getAttribute('id');
    const link   = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

/* ── 3. HAMBURGER ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  body.style.overflow = isOpen ? 'hidden' : '';
});

// Close on nav link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Close on outside click
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) closeMenu();
});

function closeMenu() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', false);
  body.style.overflow = '';
}

/* ── 4. SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h')) || 70;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

/* ── 5. TYPED TEXT (hero tagline) ── */
const phrases = [
  'ML & AI Enthusiast',
  'Cyber Security Learner',
  'Python Developer',
  'Problem Solver',
  'CSE Student @ HIT'
];

let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  if (!typedEl) return;
  const phrase = phrases[phraseIdx];

  if (deleting) {
    typedEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 450);
      return;
    }
    setTimeout(type, 45);
  } else {
    typedEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(type, 2000);
      return;
    }
    setTimeout(type, 75);
  }
}

setTimeout(type, 800);

/* ── 6. SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal, .skill-category, .timeline-item');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── 7. STAT COUNTER ANIMATION ── */
let countersTriggered = false;

function triggerCounters() {
  if (countersTriggered) return;
  const statsRow = document.querySelector('.stats-row');
  if (!statsRow) return;

  const rect = statsRow.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85) {
    countersTriggered = true;
    document.querySelectorAll('.stat-number').forEach(el => {
      const target = parseInt(el.dataset.target);
      let start = 0;
      const duration = 1400;
      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        el.textContent = Math.floor(easeOutCubic(progress) * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + '+';
      };
      requestAnimationFrame(step);
    });
  }
}

function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

/* ── 8. SKILL BAR ANIMATION ── */
let barsTriggered = false;

function triggerBars() {
  if (barsTriggered) return;
  const profSection = document.querySelector('.proficiency-section');
  if (!profSection) return;

  const rect = profSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.9) {
    barsTriggered = true;
    document.querySelectorAll('.prof-bar-fill').forEach((bar, i) => {
      const w = bar.dataset.width;
      setTimeout(() => {
        bar.style.width = w + '%';
      }, i * 120);
    });
  }
}

/* ── 9. BACK TO TOP ── */
const backToTopBtn = document.getElementById('backToTop');

function updateBackToTop() {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 10. CONTACT FORM (demo / mailto fallback) ── */
const contactForm = document.getElementById('contactForm');
const formNote    = document.getElementById('formNote');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      formNote.style.color = 'var(--rose)';
      formNote.textContent = 'Please fill in all fields.';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      formNote.style.color = 'var(--rose)';
      formNote.textContent = 'Please enter a valid email address.';
      return;
    }

    // Build mailto link as a fallback
    const mailto = `mailto:srijitajanacs@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Srijita,\n\n${message}\n\n— ${name} (${email})`)}`;
    window.location.href = mailto;

    formNote.style.color = 'var(--teal)';
    formNote.textContent = '✓ Opening your email client…';
    this.reset();
    setTimeout(() => { formNote.textContent = ''; }, 4000);
  });
}

/* ── 11. STARS — generate dynamically for richness ── */
(function generateStars() {
  const container = document.getElementById('stars1');
  if (!container) return;
  const count = 80;
  const extras = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const s = Math.random() * 1.5 + 0.5;
    const o = Math.random() * 0.6 + 0.2;
    extras.push(`radial-gradient(${s}px ${s}px at ${x}% ${y}%, rgba(255,255,255,${o.toFixed(2)}) 0%, transparent 100%)`);
  }
  const existing = getComputedStyle(container).backgroundImage;
  container.style.backgroundImage = existing + ',' + extras.join(',');
  container.style.backgroundSize = '100% 100%';
})();

/* ── 12. CURSOR GLOW (desktop only) ── */
if (window.matchMedia('(pointer:fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed; pointer-events:none; z-index:9998;
    width:280px; height:280px; border-radius:50%;
    background:radial-gradient(circle, rgba(0,212,200,0.06) 0%, transparent 70%);
    transform:translate(-50%,-50%);
    transition:left 0.12s ease, top 0.12s ease;
    will-change:left,top;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}

/* ── 13. KEYBOARD ACCESSIBILITY — trap focus in open mobile menu ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* ── 14. INITIAL CHECK — run on load ── */
window.addEventListener('load', () => {
  updateScrollProgress();
  updateBackToTop();
  updateActiveLink();
  triggerCounters();
  triggerBars();
});
