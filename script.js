// ── Register GSAP Plugins ──
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ══════════════════════════════════════
//  1. CUSTOM CURSOR
// ══════════════════════════════════════
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.1 });
});

// Smooth follow ring
function animateRing() {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor hover effects
document.querySelectorAll('a, button, .skill-card, .project-card, .cert-card, .magnetic').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.classList.add('hovering'); ring.classList.add('hovering'); });
  el.addEventListener('mouseleave', () => { dot.classList.remove('hovering'); ring.classList.remove('hovering'); });
});

// ══════════════════════════════════════
//  2. FLOATING PARTICLES
// ══════════════════════════════════════
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.3 + 0.1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(59, 148, 224, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 50; i++) particles.push(new Particle());

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });

  // Draw connections
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(59, 148, 224, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ══════════════════════════════════════
//  3. MAGNETIC BUTTONS
// ══════════════════════════════════════
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
  });
});

// ══════════════════════════════════════
//  4. 3D TILT CARDS
// ══════════════════════════════════════
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(card, {
      rotateY: x * 10, rotateX: -y * 10,
      duration: 0.3, ease: 'power2.out'
    });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'elastic.out(1, 0.6)' });
  });
});

// ══════════════════════════════════════
//  5. GSAP SCROLL ANIMATIONS
// ══════════════════════════════════════

// ── Hero entrance ──
const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
heroTl
  .from('.hero-badge', { y: 40, opacity: 0, duration: 0.8 })
  .from('.hero-title .line-inner', { y: '110%', duration: 1, stagger: 0.15 }, '-=0.4')
  .from('.hero-desc', { y: 30, opacity: 0, duration: 0.7 }, '-=0.5')
  .from('.hero-buttons', { y: 30, opacity: 0, duration: 0.7 }, '-=0.4')
  .from('.scroll-indicator', { opacity: 0, duration: 0.8 }, '-=0.2');

// ── Navbar scroll ──
const navbar = document.querySelector('.navbar');
ScrollTrigger.create({
  start: 'top -50',
  onUpdate: (self) => navbar.classList.toggle('scrolled', self.progress > 0)
});

// ── Section headers ──
gsap.utils.toArray('.section-header').forEach(header => {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: header, start: 'top 80%', toggleActions: 'play none none none' }
  });
  tl.from(header.querySelector('.section-label'), { y: 20, opacity: 0, duration: 0.5 })
    .from(header.querySelector('h2'), { y: 30, opacity: 0, duration: 0.6 }, '-=0.3')
    .from(header.querySelector('p'), { y: 20, opacity: 0, duration: 0.5 }, '-=0.3');
});

// ── About section ──
gsap.from('.about-image', {
  scrollTrigger: { trigger: '.about-grid', start: 'top 75%' },
  x: -80, opacity: 0, duration: 1, ease: 'power3.out'
});
gsap.from('.about-text > *', {
  scrollTrigger: { trigger: '.about-grid', start: 'top 75%' },
  x: 80, opacity: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out'
});

// ── Counter animation ──
document.querySelectorAll('.counter').forEach(counter => {
  const target = parseInt(counter.dataset.target);
  ScrollTrigger.create({
    trigger: counter,
    start: 'top 85%',
    onEnter: () => {
      gsap.to(counter, {
        innerHTML: target, duration: 1.5, ease: 'power2.out',
        snap: { innerHTML: 1 },
        onUpdate: function() { counter.textContent = Math.round(parseFloat(counter.textContent)); }
      });
    },
    once: true
  });
});



// ── Marquee parallax ──
gsap.to('.marquee-track', {
  scrollTrigger: { trigger: '.marquee-section', start: 'top bottom', end: 'bottom top', scrub: 1 },
  x: -200
});

// ── Timeline items ──
gsap.utils.toArray('.timeline-item').forEach((item, i) => {
  gsap.from(item, {
    scrollTrigger: { trigger: item, start: 'top 80%' },
    x: -50, opacity: 0, duration: 0.7, delay: i * 0.15, ease: 'power3.out',
    onStart: () => item.classList.add('active')
  });
});

// ── Project cards ──
gsap.from('.project-card', {
  scrollTrigger: { trigger: '.projects-grid', start: 'top 80%' },
  y: 80, opacity: 0, rotation: 3, duration: 0.8,
  stagger: { each: 0.15, from: 'start' }, ease: 'power3.out'
});

// ── Cert cards ──
gsap.from('.cert-card', {
  scrollTrigger: { trigger: '.certs-grid', start: 'top 80%' },
  scale: 0.85, opacity: 0, duration: 0.6,
  stagger: { each: 0.1, from: 'center' }, ease: 'back.out(1.4)'
});

// ── Contact section ──
gsap.from('.contact-info > *', {
  scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
  x: -40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out'
});
gsap.from('.contact-form > *', {
  scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
  x: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out'
});

// ── Footer ──
gsap.from('.social-links a', {
  scrollTrigger: { trigger: 'footer', start: 'top 90%' },
  y: 20, opacity: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(2)'
});

// ══════════════════════════════════════
//  6. SMOOTH NAV SCROLL (GSAP ScrollTo)
// ══════════════════════════════════════
document.querySelectorAll('.nav-links a, .hero-buttons a').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      gsap.to(window, { duration: 1, scrollTo: { y: href, offsetY: 70 }, ease: 'power3.inOut' });
    }
  });
});

// ══════════════════════════════════════
//  7. MOBILE MENU
// ══════════════════════════════════════
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = menuToggle.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    gsap.to(spans[0], { rotation: 45, y: 7, duration: 0.3 });
    gsap.to(spans[1], { opacity: 0, duration: 0.2 });
    gsap.to(spans[2], { rotation: -45, y: -7, duration: 0.3 });
  } else {
    gsap.to(spans, { rotation: 0, y: 0, opacity: 1, duration: 0.3 });
  }
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = menuToggle.querySelectorAll('span');
    gsap.to(spans, { rotation: 0, y: 0, opacity: 1, duration: 0.3 });
  });
});

// ── Active nav highlight ──
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
  });
});

// ══════════════════════════════════════
//  8. CONTACT FORM
// ══════════════════════════════════════
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button');
    gsap.to(btn, {
      scale: 0.95, duration: 0.1,
      onComplete: () => {
        btn.textContent = '✓ Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #34d399, #10b981)';
        gsap.to(btn, { scale: 1, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
        setTimeout(() => {
          btn.textContent = 'Send Message →';
          btn.style.background = '';
          form.reset();
        }, 2500);
      }
    });
  });
}

// ══════════════════════════════════════
//  9. PARALLAX HERO ELEMENTS
// ══════════════════════════════════════
gsap.to('.hero::before, .hero::after', {
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
});
gsap.to('.hero-content', {
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 },
  y: 120, opacity: 0.3
});
