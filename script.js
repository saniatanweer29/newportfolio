/* ══════════════════════════════════════════════════════
   SANIA TANWEER — PORTFOLIO SCRIPT
   Podium-inspired: Fluid S, GSAP, Cursor, Grain
══════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ══════════════════════════════════════
//  LENIS SMOOTH SCROLLING
// ══════════════════════════════════════
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ══════════════════════════════════════
//  PRELOADER & SMOKE
// ══════════════════════════════════════
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};
window.scrollTo(0, 0);
if (typeof lenis !== 'undefined') lenis.scrollTo(0, { immediate: true });
document.body.style.overflow = 'hidden';
const preloader = document.getElementById('preloader');
const counterEl = document.getElementById('loader-counter');
const sCanvas = document.getElementById('smoke-canvas');
const sCtx = sCanvas.getContext('2d');

function resizeSmoke() {
  sCanvas.width = window.innerWidth;
  sCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeSmoke);
resizeSmoke();

const smokeParticles = [];
for (let i = 0; i < 45; i++) {
  smokeParticles.push({
    x: window.innerWidth * 0.5 + (Math.random() - 0.5) * window.innerWidth * 0.8,
    y: window.innerHeight + Math.random() * 300,
    r: 60 + Math.random() * 120,
    vx: (Math.random() - 0.5) * 1.5,
    vy: -1.5 - Math.random() * 3,
    alpha: 0,
    targetAlpha: 0.03 + Math.random() * 0.08,
    life: 0,
    maxLife: 200 + Math.random() * 200
  });
}

let smokeRunning = true;
function drawPreloaderSmoke() {
  if (!smokeRunning) return;
  sCtx.clearRect(0, 0, sCanvas.width, sCanvas.height);
  
  smokeParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.r += 0.3; // Expand slowly
    p.life++;
    
    if (p.life < 50) p.alpha += (p.targetAlpha - p.alpha) * 0.05;
    if (p.life > p.maxLife - 50) p.alpha *= 0.95;
    
    if (p.life > p.maxLife || p.y + p.r < 0) {
      p.y = sCanvas.height + 100;
      p.x = window.innerWidth * 0.5 + (Math.random() - 0.5) * window.innerWidth * 0.8;
      p.life = 0;
      p.r = 60 + Math.random() * 120;
      p.alpha = 0;
    }
    
    const grad = sCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
    grad.addColorStop(0, `rgba(10,10,10,${p.alpha})`);
    grad.addColorStop(1, `rgba(10,10,10,0)`);
    sCtx.fillStyle = grad;
    sCtx.beginPath();
    sCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    sCtx.fill();
  });
  
  requestAnimationFrame(drawPreloaderSmoke);
}
drawPreloaderSmoke();

// Counter Animation
let loaded = { v: 1 };
gsap.to(loaded, {
  v: 100,
  duration: 3.5, // Total loading time
  ease: "power2.inOut",
  onUpdate: () => {
    counterEl.textContent = Math.floor(loaded.v) + '%';
  },
  onComplete: () => {
    if (window.playHeroEntrance) window.playHeroEntrance();
    
    gsap.to(preloader, {
      yPercent: -100,
      duration: 1.2,
      ease: "power3.inOut",
      onComplete: () => {
        preloader.style.display = 'none';
        document.body.style.overflow = '';
        smokeRunning = false;
        ScrollTrigger.refresh();
      }
    });
  }
});

// ══════════════════════════════════════
//  BACKGROUND RAIN
// ══════════════════════════════════════
const rCanvas = document.getElementById('rain-canvas');
const rCtx = rCanvas.getContext('2d');
function resizeRainCanvas() {
  if (rCanvas) {
    rCanvas.width = window.innerWidth;
    rCanvas.height = window.innerHeight;
  }
}
window.addEventListener('resize', resizeRainCanvas);
resizeRainCanvas();

const raindrops = [];
for (let i = 0; i < 150; i++) {
  raindrops.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    len: Math.random() * 20 + 10,
    speed: Math.random() * 8 + 4,
    alpha: Math.random() * 0.15 + 0.05
  });
}

const darkSectionsNodes = document.querySelectorAll('.work-section, .manifesto-section, .skills-section, .contact-section, footer');
const splashes = [];

function createSplash(x, y) {
  const count = 2 + Math.random() * 3;
  for(let i=0; i<count; i++) {
    splashes.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 4,
      vy: -0.8 - Math.random() * 2,
      life: 0,
      maxLife: 10 + Math.random() * 10,
      r: 0.8 + Math.random() * 1.2
    });
  }
}

function drawRain() {
  if (!rCtx) return;
  
  let floorY = -1;
  for (let sec of darkSectionsNodes) {
    const rect = sec.getBoundingClientRect();
    if (rect.top > 0 && rect.top < rCanvas.height) {
      floorY = rect.top;
      break; 
    }
  }

  rCtx.clearRect(0, 0, rCanvas.width, rCanvas.height);
  rCtx.strokeStyle = 'rgba(0,0,0,0.12)';
  rCtx.lineWidth = 1;
  rCtx.beginPath();
  
  raindrops.forEach(drop => {
    rCtx.moveTo(drop.x, drop.y);
    let drawLen = drop.len;
    if (floorY !== -1 && drop.y + drawLen > floorY && drop.y < floorY) {
      drawLen = Math.max(0, floorY - drop.y);
    }
    rCtx.lineTo(drop.x, drop.y + drawLen);
    
    drop.y += drop.speed;
    
    if (floorY !== -1 && drop.y + drop.len >= floorY && drop.y < floorY + 50) {
      if (drop.y + drop.len - drop.speed < floorY) {
        createSplash(drop.x, floorY);
      }
      drop.y = -drop.len - Math.random() * 100;
      drop.x = Math.random() * rCanvas.width;
    } else if (drop.y > rCanvas.height) {
      drop.y = -drop.len - Math.random() * 100;
      drop.x = Math.random() * rCanvas.width;
    }
  });
  
  rCtx.stroke();

  if (splashes.length > 0) {
    rCtx.fillStyle = 'rgba(0,0,0,0.18)';
    for(let i = splashes.length - 1; i >= 0; i--) {
      let s = splashes[i];
      s.x += s.vx;
      s.y += s.vy;
      s.vy += 0.2; // gravity
      s.life++;
      
      rCtx.beginPath();
      rCtx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      rCtx.fill();
      
      if(s.life >= s.maxLife) {
        splashes.splice(i, 1);
      }
    }
  }

  requestAnimationFrame(drawRain);
}
drawRain();

// ══════════════════════════════════════
//  CHROMA HOVER EFFECT (Project Cards)
// ══════════════════════════════════════
document.querySelectorAll('.work-card-img').forEach(card => {
  const fadeEl = card.querySelector('.chroma-fade');
  const pos = { x: card.offsetWidth / 2, y: card.offsetHeight / 2 };
  
  card.style.setProperty('--x', `${pos.x}px`);
  card.style.setProperty('--y', `${pos.y}px`);

  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    gsap.to(pos, {
      x: x,
      y: y,
      duration: 0.45,
      ease: 'power3.out',
      onUpdate: () => {
        card.style.setProperty('--x', `${pos.x}px`);
        card.style.setProperty('--y', `${pos.y}px`);
      },
      overwrite: true
    });
    
    if (fadeEl) gsap.to(fadeEl, { opacity: 0, duration: 0.25, overwrite: true });
  });

  card.addEventListener('mouseleave', () => {
    if (fadeEl) gsap.to(fadeEl, {
      opacity: 1,
      duration: 0.6,
      overwrite: true
    });
  });
});

// ══════════════════════════════════════
//  CURSOR
// ══════════════════════════════════════
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;
let rx = mx, ry = my;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
});

(function tickRing() {
  rx += (mx - rx) * 0.09;
  ry += (my - ry) * 0.09;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(tickRing);
})();

// Cursor states: dark / inverted (on dark sections)
function setCursorInverted(yes) {
  dot.classList.toggle('inv', yes);
  ring.classList.toggle('inv', yes);
}

// Hover expand on interactive elements
document.querySelectorAll('a, button, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.classList.add('big'); ring.classList.add('big'); });
  el.addEventListener('mouseleave', () => { dot.classList.remove('big'); ring.classList.remove('big'); });
});

// ── Scroll progress bar ──
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
  progressBar.style.width = (pct * 100) + '%';
}, { passive: true });

// ── Invert cursor on dark sections ──
const darkSections = document.querySelectorAll(
  '.work-section, .manifesto-section, .skills-section, .contact-section, footer'
);
darkSections.forEach(sec => {
  ScrollTrigger.create({
    trigger: sec,
    start: 'top 50%',
    end:   'bottom 50%',
    onEnter:      () => setCursorInverted(true),
    onLeave:      () => setCursorInverted(false),
    onEnterBack:  () => setCursorInverted(true),
    onLeaveBack:  () => setCursorInverted(false),
  });
});

// ── Smooth nav links ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    // Close mobile nav if open
    closeMobileNav();
    const t = document.querySelector(href);
    if (t) gsap.to(window, { duration: 1.2, scrollTo: { y: t }, ease: 'power3.inOut' });
  });
});

// ── Mobile Nav Burger ──
const burger      = document.getElementById('burger');
const mobileNav   = document.getElementById('mobile-nav-overlay');

function openMobileNav() {
  burger.classList.add('open');
  burger.setAttribute('aria-expanded', 'true');
  mobileNav.classList.add('open');
  mobileNav.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  burger.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

burger.addEventListener('click', () => {
  burger.classList.contains('open') ? closeMobileNav() : openMobileNav();
});

// ══════════════════════════════════════
//  SHUFFLE NAV HOVER
// ══════════════════════════════════════
const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*';

document.querySelectorAll('[data-nav]').forEach(link => {
  const text = link.textContent.trim();
  link.textContent = '';
  
  const wrappers = [];
  
  // Split into characters
  text.split('').forEach((char, i) => {
    if (char === ' ') {
      const space = document.createElement('span');
      space.innerHTML = '&nbsp;';
      link.appendChild(space);
      return;
    }
    
    const wrapper = document.createElement('span');
    wrapper.className = 'shuffle-char-wrapper';
    
    const inner = document.createElement('span');
    inner.className = 'shuffle-char-inner';
    
    const origTop = document.createElement('span');
    origTop.textContent = char;
    inner.appendChild(origTop);
    
    const rolls = 2; // number of scrambled chars
    for(let k=0; k<rolls; k++) {
      const clone = document.createElement('span');
      clone.textContent = scrambleChars.charAt(Math.floor(Math.random() * scrambleChars.length));
      inner.appendChild(clone);
    }
    
    const origBottom = document.createElement('span');
    origBottom.textContent = char;
    inner.appendChild(origBottom);
    
    wrapper.appendChild(inner);
    link.appendChild(wrapper);
    wrappers.push(inner);
  });
  
  let isPlaying = false;
  
  link.addEventListener('mouseenter', () => {
    if (isPlaying) return;
    isPlaying = true;
    
    // Randomize middle characters
    wrappers.forEach(inner => {
      const children = inner.children;
      for (let i = 1; i < children.length - 1; i++) {
        children[i].textContent = scrambleChars.charAt(Math.floor(Math.random() * scrambleChars.length));
      }
    });
    
    const odd = wrappers.filter((_, i) => i % 2 !== 0);
    const even = wrappers.filter((_, i) => i % 2 === 0);
    
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(wrappers, { yPercent: 0 }); // seamless reset since top and bottom are identical
        isPlaying = false;
      }
    });
    
    const steps = 3; // total children minus 1
    const yP = -(steps * 100) / (steps + 1);
    
    if (odd.length) {
      tl.fromTo(odd, 
        { yPercent: 0 }, 
        { yPercent: yP, duration: 0.35, ease: 'power3.out' }, 0);
    }
    if (even.length) {
      tl.fromTo(even, 
        { yPercent: 0 }, 
        { yPercent: yP, duration: 0.35, ease: 'power3.out' }, 0.03); 
    }
  });
});

// ══════════════════════════════════════
//  FLUID S  —  Canvas 2D
//  Architecture:
//  1. Draw warm content preview (everywhere)
//  2. White mask OUTSIDE the S blobs  [evenodd]
//  3. Dark ink radial overlay INSIDE   [clip]
//  Result: S blobs = dark windows into content
// ══════════════════════════════════════
(function initFluidS() {
  const canvas = document.getElementById('s-main-canvas');
  if (!canvas) return;

  // ── Size setup ──────────────────────────────────────
  const DPR  = Math.min(window.devicePixelRatio || 1, 2);
  const wrapper = canvas.parentElement;

  function getSize() {
    return Math.min(560, wrapper.offsetWidth || 560);
  }

  let SIZE = getSize();
  canvas.style.width  = '100%';
  canvas.style.height = '100%';
  canvas.width  = SIZE * DPR;
  canvas.height = SIZE * DPR;

  const ctx = canvas.getContext('2d');
  ctx.scale(DPR, DPR);
  let W = SIZE, H = SIZE, CX = W / 2, CY = H / 2;

  // Resize handler
  window.addEventListener('resize', () => {
    const newSize = getSize();
    if (Math.abs(newSize - SIZE) < 2) return;
    SIZE = newSize;
    W = SIZE; H = SIZE; CX = W / 2; CY = H / 2;
    canvas.width  = SIZE * DPR;
    canvas.height = SIZE * DPR;
    ctx.scale(DPR, DPR);
  });

  let gx = -9999, gy = -9999;
  let targetGyroX = 0, targetGyroY = 0;
  let gyroX = 0, gyroY = 0;

  document.addEventListener('mousemove', e => {
    const hero  = document.getElementById('hero-pinned');
    if (!hero) return;
    const hr = hero.getBoundingClientRect();
    const cr = canvas.getBoundingClientRect();
    if (e.clientY >= hr.top && e.clientY <= hr.bottom) {
      gx = (e.clientX - cr.left) * (SIZE / cr.width);
      gy = (e.clientY - cr.top)  * (SIZE / cr.height);
      targetGyroX = (gx - CX) * 0.15;
      targetGyroY = (gy - CY) * 0.15;
    } else {
      targetGyroX = 0;
      targetGyroY = 0;
    }
  });

  // ── Organic noise (sum of sines) ─────────────────────
  function oNoise(x, ph) {
    ph = ph || 0;
    return (
      Math.sin(x * 1.0  + ph)               * 0.42 +
      Math.sin(x * 2.3  + ph * 1.4 + 0.9)  * 0.27 +
      Math.sin(x * 4.9  + ph * 0.7 + 1.8)  * 0.16 +
      Math.sin(x * 10.1 + ph * 1.8 + 3.0)  * 0.09 +
      Math.sin(x * 19.7 + ph * 0.5 + 4.2)  * 0.04 +
      Math.sin(x * 37.3 + ph * 1.2 + 5.5)  * 0.02
    );
  }

  // ── Blob point generation ─────────────────────────────
  function makePts(cx, cy, r, n, ph, t, amp) {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a  = (i / n) * Math.PI * 2;
      const nr = r + oNoise(a * 1.55 + t * 0.48, ph) * r * amp;
      pts.push([cx + nr * Math.cos(a), cy + nr * Math.sin(a)]);
    }
    return pts;
  }

  // ── Catmull-Rom path ─────────────────────────────────
  function catmull(pts) {
    const n = pts.length;
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n];
      const p1 = pts[i];
      const p2 = pts[(i + 1) % n];
      const p3 = pts[(i + 2) % n];
      const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
      const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
      const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
      const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
      i === 0 ? ctx.moveTo(p1[0], p1[1]) :
                ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2[0], p2[1]);
    }
    ctx.closePath();
  }

  // ── Content preview (drawn INSIDE S blobs) ───────────
  function drawContent() {
    // Warm paper gradient background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0,   '#ddd6ca');
    bg.addColorStop(0.5, '#d2cab8');
    bg.addColorStop(1,   '#c8bfac');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Faint large "S" letterform ghost behind everything
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `italic ${W * 0.72}px DM Serif Display, serif`;
    ctx.fillStyle = 'rgba(30,24,18, 0.06)';
    ctx.fillText('S', CX + 4, CY + 8);
    ctx.restore();

    // Role / identity labels stacked
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const labels = [
      { text: 'STUDENT',   y: CY - H * 0.18, size: W * 0.037, alpha: 0.48 },
      { text: '·',         y: CY - H * 0.07, size: W * 0.028, alpha: 0.28 },
      { text: 'DEVELOPER', y: CY + H * 0.01, size: W * 0.037, alpha: 0.42 },
      { text: '·',         y: CY + H * 0.09, size: W * 0.028, alpha: 0.28 },
      { text: 'LEARNER',   y: CY + H * 0.17, size: W * 0.037, alpha: 0.38 },
    ];
    labels.forEach(l => {
      ctx.font = `700 ${l.size}px Inter, sans-serif`;
      ctx.fillStyle = `rgba(28,22,16,${l.alpha})`;
      ctx.fillText(l.text, CX, l.y);
    });

    // CGPA stat
    ctx.font = `bold ${W * 0.14}px DM Serif Display, serif`;
    ctx.fillStyle = 'rgba(28,22,16,0.18)';
    ctx.fillText('9.77', CX, CY - H * 0.34);

    ctx.font = `600 ${W * 0.026}px Inter, sans-serif`;
    ctx.fillStyle = 'rgba(28,22,16,0.20)';
    ctx.fillText('CGPA', CX, CY - H * 0.26);

    ctx.restore();
  }

  // ── Main draw loop ────────────────────────────────────
  let time = 0;

  function draw() {
    ctx.clearRect(0, 0, W, H);

    const t   = time;
    const R   = W * 0.265;  // blob radius
    const NS  = 0.24;       // noise amplitude

    gyroX += (targetGyroX - gyroX) * 0.05;
    gyroY += (targetGyroY - gyroY) * 0.05;

    // Top blob — upper-right (moves less, pushed back)
    const tCX = CX + W * 0.092 + Math.sin(t * 0.19) * W * 0.020 + gyroX * 0.6;
    const tCY = CY - H * 0.220 + Math.sin(t * 0.16 + 1) * H * 0.018 + gyroY * 0.6;

    // Bottom blob — lower-left (moves more, closer to screen)
    const bCX = CX - W * 0.092 + Math.sin(t * 0.19 + 3) * W * 0.020 + gyroX * 1.4;
    const bCY = CY + H * 0.220 + Math.sin(t * 0.16 + 4) * H * 0.018 + gyroY * 1.4;

    // Center bridge connector
    const mCX = CX + Math.sin(t * 0.13) * W * 0.014 + gyroX;
    const mCY = CY + Math.sin(t * 0.17 + 2) * H * 0.012 + gyroY;
    const mR  = R * 0.41;

    const tp = makePts(tCX, tCY, R,  46, 0, t, NS);
    const bp = makePts(bCX, bCY, R,  46, 3, t, NS);
    const mp = makePts(mCX, mCY, mR, 30, 6, t, NS * 0.72);

    // ── STEP 1: Content preview (full canvas) ────────────
    drawContent();

    // ── STEP 2: White mask OUTSIDE blobs (evenodd rule) ──
    // rect fills white; blobs punch through (transparent holes)
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, W, H);
    catmull(tp);
    catmull(bp);
    catmull(mp);
    ctx.fillStyle = '#f4f4f0'; // matches hero-pinned background
    ctx.fill('evenodd');
    ctx.restore();

    // Radial gradient: lighter at center (content visible), very dark at rim
    [[tp, tCX, tCY, R], [bp, bCX, bCY, R], [mp, mCX, mCY, mR]].forEach(([pts, cx, cy, r]) => {
      ctx.save();
      ctx.beginPath();
      catmull(pts);
      ctx.clip();

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 1.18);
      g.addColorStop(0,    'rgba(8, 7,12, 0.52)');  // center — content shows through
      g.addColorStop(0.38, 'rgba(6, 5,10, 0.72)');
      g.addColorStop(0.72, 'rgba(3, 2, 7, 0.88)');
      g.addColorStop(1,    'rgba(1, 0, 4, 0.97)');  // near-black edge
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      ctx.restore();
    });

    time += 0.010;
    requestAnimationFrame(draw);
  }

  draw();
})();

// ══════════════════════════════════════
//  HERO SCROLL  —  S scales out → content appears
// ══════════════════════════════════════
const heroWrapper = document.getElementById('hero-wrapper');
const sWrapper    = document.getElementById('s-wrapper');
const heroTagline = document.getElementById('hero-tagline');
const heroScroll  = document.getElementById('hero-scroll-hint');
const siteNav     = document.getElementById('site-nav');

const heroTL = gsap.timeline({
  scrollTrigger: {
    trigger: heroWrapper,
    start:   'top top',
    end:     'bottom bottom',
    scrub:   1.5,
  }
});

// Phase 1 (0–30%): tagline + scroll hint fade out
heroTL.to([heroTagline, heroScroll], {
  opacity: 0, y: 14, duration: 0.3, ease: 'none',
}, 0);

// Phase 2 (0–100%): S scales massively, zooms out of viewport
heroTL.to(sWrapper, {
  scale:    52,
  ease:     'power1.in',
  duration: 1,
}, 0);

// Phase 3 (55–100%): nav fades on dark transition
heroTL.to(siteNav, {
  opacity: 0, duration: 0.4, ease: 'none',
}, 0.55);

// ── Hero entrance ──
window.playHeroEntrance = () => {
  gsap.from(siteNav,     { y: -18, opacity: 0, duration: 0.9, delay: 0.1, ease: 'power3.out' });
  gsap.from('#s-wrapper',{ scale: 0.88, opacity: 0, duration: 1.4, delay: 0.25, ease: 'power3.out', transformOrigin: 'center' });
  gsap.from(heroTagline, { y: 14, opacity: 0, duration: 0.9, delay: 0.6, ease: 'power3.out' });
  gsap.from(heroScroll,  { opacity: 0, duration: 0.9, delay: 0.9, ease: 'power2.out' });
};

// ── Nav re-appear on scroll past hero ──
ScrollTrigger.create({
  trigger: '.work-section',
  start: 'top 60%',
  onEnter:     () => gsap.to(siteNav, { opacity: 1, duration: 0.5, ease: 'power2.out' }),
  onLeaveBack: () => gsap.to(siteNav, { opacity: 0, duration: 0.3 }),
});

// ══════════════════════════════════════
//  WORK GRID  —  staggered scroll-in
// ══════════════════════════════════════
gsap.utils.toArray('.work-card').forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start:   'top 92%',
      toggleActions: 'play none none none',
    },
    y: 60 + i * 20,
    opacity: 0,
    duration: 1.0,
    delay: i * 0.08,
    ease: 'power3.out',
  });
});

// Work card image parallax
document.querySelectorAll('.work-card-img').forEach(img => {
  gsap.to(img, {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: img,
      start: 'top bottom',
      end:   'bottom top',
      scrub: true,
    }
  });
});

// ══════════════════════════════════════
//  MANIFESTO TEXT  —  split reveal
// ══════════════════════════════════════
const manifestoEl = document.getElementById('manifesto-text');
if (manifestoEl) {
  // Split into words for staggered reveal
  const words = manifestoEl.textContent.trim().split(/\s+/);
  manifestoEl.innerHTML = words.map(w =>
    `<span class="m-word" style="display:inline-block; overflow:hidden; vertical-align:bottom">` +
    `<span class="m-inner" style="display:inline-block;">${w}</span></span> `
  ).join('');

  gsap.from('.m-inner', {
    scrollTrigger: {
      trigger: manifestoEl,
      start:   'top 80%',
      toggleActions: 'play none none none',
    },
    y: '100%',
    opacity: 0,
    duration: 0.75,
    stagger: 0.04,
    ease: 'power3.out',
  });
}

// ══════════════════════════════════════
//  STATS COUNTER
// ══════════════════════════════════════
document.querySelectorAll('.counter').forEach(el => {
  const target  = parseFloat(el.dataset.target);
  const decimal = parseInt(el.dataset.decimal || '0');
  ScrollTrigger.create({
    trigger: el,
    start: 'top 88%',
    onEnter: () => {
      const obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 2.0, ease: 'power2.out',
        onUpdate() {
          el.textContent = obj.v.toFixed(decimal);
        }
      });
    }
  });
});

// ══════════════════════════════════════
//  SECTION REVEALS  —  fade + slide
// ══════════════════════════════════════
gsap.utils.toArray([
  '.section-label', '.eyebrow', '.manifesto-eyebrow',
  '.about-body-text p', '.stat-big',
  '.skill-row', '.edu-item', '.cert-item',
  '.contact-eyebrow', '.contact-email', '.contact-links',
]).forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: 'top 92%',
      toggleActions: 'play none none none',
    },
    y: 28, opacity: 0,
    duration: 0.72,
    delay: (i % 4) * 0.04,
    ease: 'power2.out',
  });
});

// Skill items slide in from right
gsap.utils.toArray('.skill-items').forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: { trigger: el, start: 'top 93%', toggleActions: 'play none none none' },
    x: 40, opacity: 0, duration: 0.7, delay: i * 0.06, ease: 'power2.out',
  });
});

// ══════════════════════════════════════
//  MAGNETIC LINKS & BUTTONS
// ══════════════════════════════════════
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const rx = e.clientX - (rect.left + rect.width  / 2);
    const ry = e.clientY - (rect.top  + rect.height / 2);
    gsap.to(el, { x: rx * 0.3, y: ry * 0.3, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
  });
});

// ══════════════════════════════════════
//  SCROLL REVEALS
// ══════════════════════════════════════
const manifestoSection = document.getElementById('about');
const manifestoLines = document.querySelectorAll('#manifesto-text span');

if (manifestoSection && manifestoLines.length > 0) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        manifestoLines.forEach((span, i) => {
          setTimeout(() => {
            span.classList.add('reveal-active');
          }, i * 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(manifestoSection);
}

// ══════════════════════════════════════
//  FOOTER DISTORTION
// ══════════════════════════════════════
const emailEl = document.getElementById('contact-email');
const distortMap = document.getElementById('distort-map');

if (emailEl && distortMap) {
  let distortTl = gsap.timeline({ paused: true })
    .to(distortMap, { attr: { scale: 120 }, duration: 0.4, ease: 'power2.out' })
    .to(distortMap, { attr: { scale: 0 }, duration: 0.8, ease: 'power2.inOut' });

  emailEl.addEventListener('mouseenter', () => {
    emailEl.classList.add('distort-active');
    distortTl.restart();
  });
  emailEl.addEventListener('mouseleave', () => {
    setTimeout(() => { emailEl.classList.remove('distort-active'); }, 1200);
  });
}

// ══════════════════════════════════════
//  CONTACT FORM
// ══════════════════════════════════════
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('form-btn');
    if (btn) {
      btn.textContent = 'SENT ✓';
      setTimeout(() => { btn.textContent = 'SEND MESSAGE →'; }, 3000);
    }
    contactForm.reset();
  });
}

// ══════════════════════════════════════
//  WORK CARD CURSOR — show arrow on hover
// ══════════════════════════════════════
document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    dot.classList.add('big'); ring.classList.add('big');
  });
  card.addEventListener('mouseleave', () => {
    dot.classList.remove('big'); ring.classList.remove('big');
  });
});
