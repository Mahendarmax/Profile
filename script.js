/* ===========================================
   MAHENDAR SHIVARATHRI — 3D ANIMATED PORTFOLIO
   Premium JS: particles, tilt, cursor, reveals
   =========================================== */

(function () {
  'use strict';

  // ─── Preloader ────────────────────────────
  window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    if (pre) {
      setTimeout(() => {
        pre.classList.add('hidden');
        document.body.style.overflow = '';
        initRevealAnimations();
        initCounters();
      }, 800);
    }
  });

  // ─── Custom Cursor — Comet Trail ─────────
  const dot = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  let cursorX = 0, cursorY = 0, outlineX = 0, outlineY = 0;
  let dotX = 0, dotY = 0;

  // Trail particles pool
  const TRAIL_COUNT = 16;
  const trails = [];
  let trailIdx = 0;

  if (dot && outline && window.matchMedia('(pointer:fine)').matches) {
    // Create trail elements
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const t = document.createElement('div');
      t.className = 'cursor-trail';
      document.body.appendChild(t);
      trails.push(t);
    }

    let lastTrailTime = 0;

    document.addEventListener('mousemove', e => {
      cursorX = e.clientX;
      cursorY = e.clientY;

      // Spawn trail particle every ~25ms
      const now = performance.now();
      if (now - lastTrailTime > 25) {
        lastTrailTime = now;
        const trail = trails[trailIdx % TRAIL_COUNT];
        trail.style.transform = 'translate3d(' + (cursorX - 3) + 'px,' + (cursorY - 3) + 'px,0) scale(1)';
        trail.style.opacity = '0.7';

        // Fade out
        requestAnimationFrame(() => {
          trail.style.transition = 'opacity .5s ease, transform .5s ease';
          trail.style.opacity = '0';
          trail.style.transform = 'translate3d(' + (cursorX - 3) + 'px,' + (cursorY - 3) + 'px,0) scale(0.2)';
          setTimeout(() => { trail.style.transition = 'none'; }, 500);
        });
        trailIdx++;
      }
    }, { passive: true });

    // Smooth cursor loop — interpolate at display refresh rate
    (function animateCursor() {
      // Dot follows with slight smoothing for 360Hz feel
      dotX += (cursorX - dotX) * 0.6;
      dotY += (cursorY - dotY) * 0.6;
      dot.style.transform = 'translate3d(' + (dotX - 5) + 'px,' + (dotY - 5) + 'px,0)';

      // Outline follows with heavier smoothing
      outlineX += (cursorX - outlineX) * 0.1;
      outlineY += (cursorY - outlineY) * 0.1;
      outline.style.transform = 'translate3d(' + (outlineX - 20) + 'px,' + (outlineY - 20) + 'px,0) rotate(' + ((performance.now() / 2000 * 360) % 360) + 'deg)';

      requestAnimationFrame(animateCursor);
    })();

    // Hover states
    document.querySelectorAll('a, button, .magnetic, .tilt-card, .nav-link').forEach(el => {
      el.addEventListener('mouseenter', () => { outline.classList.add('hover'); dot.classList.add('hover'); });
      el.addEventListener('mouseleave', () => { outline.classList.remove('hover'); dot.classList.remove('hover'); });
    });
  }

  // ─── Scroll Progress Bar ──────────────────
  const progressBar = document.getElementById('scrollProgress');
  let scrollTicking = false;
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && docHeight > 0) {
      progressBar.style.transform = 'scaleX(' + (scrollTop / docHeight) + ') translateZ(0)';
    }
    scrollTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollTicking) { scrollTicking = true; requestAnimationFrame(updateProgress); }
  }, { passive: true });

  // ─── Navbar ───────────────────────────────
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    }
  }, { passive: true });

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
    });
  }

  // Active link tracking + close mobile menu
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      }
      navLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      if (navMenu) navMenu.classList.remove('open');
      if (hamburger) hamburger.classList.remove('active');
    });
  });

  // Highlight nav on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 150;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      const link = document.querySelector('.nav-link[href="#' + id + '"]');
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }, { passive: true });

  // ─── Typing Effect ────────────────────────
  const typingEl = document.getElementById('typingText');
  const phrases = [
    'Cyber Security Engineer',
    'Cloud Security Specialist',
    'Azure DevOps Engineer',
    'AI Automation Enthusiast',
    'Infrastructure Engineer'
  ];
  let phraseIdx = 0, charIdx = 0, deleting = false;

  function typeEffect() {
    if (!typingEl) return;
    const current = phrases[phraseIdx];
    if (deleting) {
      charIdx--;
      typingEl.textContent = current.substring(0, charIdx);
    } else {
      charIdx++;
      typingEl.textContent = current.substring(0, charIdx);
    }

    let speed = deleting ? 40 : 80;

    if (!deleting && charIdx === current.length) {
      speed = 2200;
      deleting = true;
    } else if (deleting && charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      speed = 400;
    }
    setTimeout(typeEffect, speed);
  }
  setTimeout(typeEffect, 1200);

  // ─── 3D Canvas Background (Hero) ─────────
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles = [], mouse = { x: -999, y: -999 };
    const PARTICLE_COUNT = 120;
    const CONNECT_DIST = 140;
    const MOUSE_RADIUS = 180;

    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

    // Create particles with depth (z) for 3D feel
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        r: Math.random() * 2 + 1
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, w, h);

      // Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.25;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(99,102,241,' + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Particles
      particles.forEach(p => {
        // Mouse repulsion
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_RADIUS && dist > 0) {
          const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS * 0.03;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }

        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        // Damping
        p.vx *= 0.998;
        p.vy *= 0.998;

        // Wrap around
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        const size = p.r * (p.z * 0.5 + 0.5);
        const opacity = 0.3 + p.z * 0.2;

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, size + 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,' + (opacity * 0.15) + ')';
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(99,102,241,' + opacity + ')';
        ctx.fill();
      });

      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // ─── 3D Tilt Effect ──────────────────────
  function initTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      let tiltRaf = null;
      card.addEventListener('mousemove', function (e) {
        const el = this;
        if (tiltRaf) cancelAnimationFrame(tiltRaf);
        tiltRaf = requestAnimationFrame(() => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const cx = rect.width / 2;
          const cy = rect.height / 2;
          const rotateX = ((y - cy) / cy) * -8;
          const rotateY = ((x - cx) / cx) * 8;
          el.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02,1.02,1.02) translateZ(0)';
        });
      });

      card.addEventListener('mouseleave', function () {
        if (tiltRaf) cancelAnimationFrame(tiltRaf);
        this.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1) translateZ(0)';
        this.style.transition = 'transform .5s cubic-bezier(.4,0,.2,1)';
        setTimeout(() => { this.style.transition = ''; }, 500);
      });

      card.addEventListener('mouseenter', function () {
        this.style.transition = 'none';
      });
    });
  }

  // ─── Profile Card 3D Tilt ────────────────
  const profileCard = document.getElementById('profileCard');
  if (profileCard) {
    const inner = profileCard.querySelector('.profile-inner');
    let profileRaf = null;
    profileCard.addEventListener('mousemove', e => {
      if (profileRaf) cancelAnimationFrame(profileRaf);
      profileRaf = requestAnimationFrame(() => {
        const rect = profileCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const rx = ((y - cy) / cy) * -12;
        const ry = ((x - cx) / cx) * 12;
        if (inner) {
          inner.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg) translateZ(0)';
        }
      });
    });
    profileCard.addEventListener('mouseleave', () => {
      if (profileRaf) cancelAnimationFrame(profileRaf);
      if (inner) {
        inner.style.transition = 'transform .6s cubic-bezier(.4,0,.2,1)';
        inner.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
        setTimeout(() => { inner.style.transition = ''; }, 600);
      }
    });
    profileCard.addEventListener('mouseenter', () => {
      if (inner) inner.style.transition = 'none';
    });
  }

  // ─── Scroll Reveal Animations ─────────────
  function initRevealAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-up, .reveal-right').forEach(el => {
      observer.observe(el);
    });
  }

  // ─── Counter Animation ────────────────────
  function initCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.counter');
          counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const isDecimal = counter.hasAttribute('data-decimal');
            animateCount(counter, target, isDecimal);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsEl = document.querySelector('.hero-stats');
    if (statsEl) observer.observe(statsEl);
  }

  function animateCount(el, target, isDecimal) {
    const totalFrames = 60;
    const step = target / totalFrames;
    let current = 0;
    const interval = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
    }, 30);
  }

  // ─── Magnetic Button Effect ───────────────
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      this.style.transform = 'translate3d(' + (x * 0.2) + 'px,' + (y * 0.2) + 'px,0)';
    });
    btn.addEventListener('mouseleave', function () {
      this.style.transform = 'translate3d(0,0,0)';
      this.style.transition = 'transform .3s cubic-bezier(.4,0,.2,1)';
      setTimeout(() => { this.style.transition = ''; }, 300);
    });
    btn.addEventListener('mouseenter', function () {
      this.style.transition = 'none';
    });
  });

  // ─── Parallax on Hero ─────────────────────
  let parallaxTicking = false;
  window.addEventListener('scroll', () => {
    if (!parallaxTicking) {
      parallaxTicking = true;
      requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && scrolled < window.innerHeight) {
          heroContent.style.transform = 'translate3d(0,' + (scrolled * 0.3) + 'px,0)';
          heroContent.style.opacity = Math.max(0, 1 - scrolled / window.innerHeight);
        }
        parallaxTicking = false;
      });
    }
  }, { passive: true });

  // ─── Init Tilt after DOM ready ─────────────
  document.addEventListener('DOMContentLoaded', () => {
    initTilt();
    // Re-init cursor hovers for dynamically added elements
    document.querySelectorAll('a, button, .magnetic, .tilt-card, .nav-link').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const o = document.getElementById('cursorOutline');
        const d = document.getElementById('cursorDot');
        if (o) o.classList.add('hover');
        if (d) d.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        const o = document.getElementById('cursorOutline');
        const d = document.getElementById('cursorDot');
        if (o) o.classList.remove('hover');
        if (d) d.classList.remove('hover');
      });
    });
  });

})();
