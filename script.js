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
const footprintsContainer = document.getElementById('footprints-container');

const footprintSVG = `<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="20" cy="24" rx="10" ry="8" fill="currentColor"/>
  <ellipse cx="12" cy="14" rx="4" ry="5" fill="currentColor" transform="rotate(-15 12 14)"/>
  <ellipse cx="20" cy="10" rx="4" ry="5" fill="currentColor"/>
  <ellipse cx="28" cy="14" rx="4" ry="5" fill="currentColor" transform="rotate(15 28 14)"/>
</svg>`;

let lastFootprintV = 0;
let isLeftPaw = true;

// Counter Animation
let loaded = { v: 1 };
gsap.to(loaded, {
  v: 100,
  duration: 3.5, // Total loading time
  ease: "power2.inOut",
  onUpdate: () => {
    let currentV = Math.floor(loaded.v);
    counterEl.textContent = currentV + '%';
    
    // Spawn footprint every 5%
    if (currentV - lastFootprintV >= 5) {
      lastFootprintV = currentV;
      
      const fp = document.createElement('div');
      fp.className = 'footprint-svg';
      
      const rotation = isLeftPaw ? 'rotate(80deg)' : 'rotate(100deg)';
      fp.innerHTML = footprintSVG.replace('<svg', `<svg style="width:100%; height:100%; transform: ${rotation}"`);
      
      const yOffset = isLeftPaw ? -40 : 40;
      fp.style.left = currentV + '%';
      fp.style.top = `calc(50% + ${yOffset}px)`;
      
      footprintsContainer.appendChild(fp);
      isLeftPaw = !isLeftPaw;
    }
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
  rCtx.strokeStyle = 'rgba(26,58,107,0.22)';  /* col 2 — dark blue */
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
    rCtx.fillStyle = 'rgba(26,58,107,0.28)';  /* col 2 — dark blue */
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
const cursorPaw = document.getElementById('cursor-paw');
let mx = window.innerWidth / 2, my = window.innerHeight / 2;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursorPaw.style.left = mx + 'px';
  cursorPaw.style.top  = my + 'px';
});

// Click for claws
document.addEventListener('mousedown', () => cursorPaw.classList.add('clicking'));
document.addEventListener('mouseup',   () => cursorPaw.classList.remove('clicking'));

// Cursor states: dark / inverted (on dark sections)
function setCursorInverted(yes) {
  cursorPaw.classList.toggle('inv', yes);
}

// Hover expand on interactive elements
document.querySelectorAll('a, button, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => cursorPaw.classList.add('big'));
  el.addEventListener('mouseleave', () => cursorPaw.classList.remove('big'));
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



// ════════════════════════════════════
//  HERO SCROLL  —  cat entrance (no more S zoom)
// ════════════════════════════════════
const heroWrapper = document.getElementById('hero-wrapper');
const catWrapper  = document.getElementById('cat-wrapper');
const heroTagline = document.getElementById('hero-tagline');
const heroScroll  = document.getElementById('hero-scroll-hint');
const siteNav     = document.getElementById('site-nav');

// ── Hero entrance (triggered by preloader) ──
window.playHeroEntrance = () => {
  gsap.from(siteNav,      { y: -18, opacity: 0, duration: 0.9, delay: 0.10, ease: 'power3.out' });
  gsap.from(heroTagline,  { y: 14,  opacity: 0, duration: 0.9, delay: 0.75, ease: 'power3.out' });
  gsap.from(heroScroll,   { opacity: 0, duration: 0.9, delay: 1.05, ease: 'power2.out' });
};

// Nav stays visible — no hide/show needed with simple 100vh hero

// ════════════════════════════════════
//  CAT MASCOT — Eye Tracking
// ════════════════════════════════════
const catMascot  = document.getElementById('cat-mascot');
if (catMascot) gsap.set(catMascot, { scaleX: -1 }); // Explicitly define flip for GSAP matrix math
const pupilLeft  = document.getElementById('pupil-left');
const pupilRight = document.getElementById('pupil-right');

// Eye resting centers (in SVG coordinate space, viewBox 300x400)
const EYE_L = { cx: 112, cy: 152, restX: 112, restY: 154 };
const EYE_R = { cx: 188, cy: 152, restX: 188, restY: 154 };
const MAX_TRAVEL = 9; // max pupil offset in SVG units

let catRect = null;
function refreshCatRect() {
  if (catMascot) catRect = catMascot.getBoundingClientRect();
}
window.addEventListener('resize', refreshCatRect);
requestAnimationFrame(refreshCatRect);

document.addEventListener('mousemove', (e) => {
  if (!catMascot || !catRect || catRect.width === 0) return;
  const svgW = 300, svgH = 400;
  const rawMx = (e.clientX - catRect.left) * (svgW / catRect.width);
  const mx = svgW - rawMx; // Inverted because SVG has scaleX(-1)
  const my = (e.clientY - catRect.top)  * (svgH / catRect.height);

  [{ eye: EYE_L, pupil: pupilLeft }, { eye: EYE_R, pupil: pupilRight }].forEach(({ eye, pupil }) => {
    if (!pupil) return;
    const dx = mx - eye.cx, dy = my - eye.cy;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const t    = Math.min(1, MAX_TRAVEL / dist);
    gsap.to(pupil, {
      attr: { cx: eye.cx + dx * t, cy: eye.cy + dy * t },
      duration: 0.22, ease: 'power2.out', overwrite: 'auto'
    });
  });
});

catMascot && catMascot.addEventListener('mouseleave', () => {
  gsap.to(pupilLeft,  { attr: { cx: EYE_L.restX, cy: EYE_L.restY }, duration: 0.5, ease: 'elastic.out(1, 0.45)' });
  gsap.to(pupilRight, { attr: { cx: EYE_R.restX, cy: EYE_R.restY }, duration: 0.5, ease: 'elastic.out(1, 0.45)' });
});

// ════════════════════════════════════
//  CAT MASCOT — Whisker Hover Wiggle
// ════════════════════════════════════
['#whiskers-left','#whiskers-right'].forEach((sel, i) => {
  const group = document.querySelector(sel);
  if (!group) return;
  let playing = false;
  const origin = i === 0 ? '110 183' : '190 183';
  const dir    = i === 0 ? -9 : 9;

  group.addEventListener('mouseenter', () => {
    if (playing) return;
    playing = true;
    const visibleWhiskers = group.querySelectorAll('.whisker');
    gsap.timeline({ onComplete: () => (playing = false) })
      .to(visibleWhiskers, { rotation: dir, svgOrigin: origin, stagger: 0.04, duration: 0.14, ease: 'power2.out' })
      .to(visibleWhiskers, { rotation: 0,   svgOrigin: origin, stagger: 0.04, duration: 0.32, ease: 'elastic.out(1.4, 0.4)' });
  });
});

// ════════════════════════════════════
//  CAT MASCOT — Idle Animations
// ════════════════════════════════════
const blinkL = document.getElementById('blink-left');
const blinkR = document.getElementById('blink-right');
const earL   = document.getElementById('ear-left');
const earR   = document.getElementById('ear-right');

function doSlowBlink(cb) {
  if (!blinkL) return cb && cb();
  gsap.timeline({ onComplete: cb })
    .to([blinkL, blinkR], { attr: { ry: 30 }, duration: 0.09, ease: 'power2.in',  stagger: 0.02 })
    .to([blinkL, blinkR], { attr: { ry: 0  }, duration: 0.22, ease: 'power2.out', stagger: 0.02, delay: 0.06 });
}

function doDoubleBlink(cb) {
  if (!blinkL) return cb && cb();
  gsap.timeline({ onComplete: cb })
    .to([blinkL, blinkR], { attr: { ry: 30 }, duration: 0.08, ease: 'power2.in' })
    .to([blinkL, blinkR], { attr: { ry: 0  }, duration: 0.18, ease: 'power2.out', delay: 0.04 })
    .to([blinkL, blinkR], { attr: { ry: 30 }, duration: 0.08, ease: 'power2.in',  delay: 0.14 })
    .to([blinkL, blinkR], { attr: { ry: 0  }, duration: 0.20, ease: 'power2.out', delay: 0.04 });
}

function doEarTwitch(cb) {
  const el = Math.random() > 0.5 ? earR : earL;
  const ox = el === earR ? '224 96' : '64 96';
  gsap.timeline({ onComplete: cb })
    .to(el, { rotation: -10, svgOrigin: ox, duration: 0.10, ease: 'power1.out' })
    .to(el, { rotation:   5, svgOrigin: ox, duration: 0.12 })
    .to(el, { rotation:   0, svgOrigin: ox, duration: 0.32, ease: 'elastic.out(1.2, 0.4)' });
}

function doHeadTilt(cb) {
  if (!catMascot) return cb && cb();
  const dir = Math.random() > 0.5 ? 7 : -7;
  gsap.timeline({ onComplete: cb })
    .to(catMascot, { rotation: dir, svgOrigin: '150 200', duration: 0.55, ease: 'power2.inOut' })
    .to(catMascot, { rotation: 0,   svgOrigin: '150 200', duration: 0.55, ease: 'power2.inOut', delay: 0.85 });
}

function doWhiskerIdle(cb) {
  const i = Math.random() > 0.5 ? 0 : 1;
  const sel = i === 0 ? '#whiskers-left' : '#whiskers-right';
  const group = document.querySelector(sel);
  if (!group) return cb && cb();
  const ox  = i === 0 ? '110 183' : '190 183';
  const dir = i === 0 ? -5 : 5;
  const ws  = group.querySelectorAll('.whisker');
  gsap.timeline({ onComplete: cb })
    .to(ws, { rotation: dir, svgOrigin: ox, stagger: 0.05, duration: 0.15 })
    .to(ws, { rotation: 0,  svgOrigin: ox, stagger: 0.05, duration: 0.30, ease: 'elastic.out(1.3, 0.4)' });
}

const idleAnims = [
  doSlowBlink, doSlowBlink, doDoubleBlink,
  doEarTwitch, doEarTwitch,
  doHeadTilt,  doWhiskerIdle
];

function scheduleIdle() {
  const delay = 5000 + Math.random() * 10000; // 5–15 s
  setTimeout(() => {
    const fn = idleAnims[Math.floor(Math.random() * idleAnims.length)];
    fn(scheduleIdle);
  }, delay);
}
setTimeout(scheduleIdle, 3200); // start after entrance settles

// ════════════════════════════════════
//  CAT MASCOT — Native Scroll Paw Zoom
// ════════════════════════════════════
const pawSwipe    = document.getElementById('paw-swipe');
const catMascotEl = document.getElementById('cat-mascot');

// Initialize GSAP transforms cleanly for scrub
gsap.set(pawSwipe, { xPercent: -50, yPercent: -50, scale: 0 });

const heroTL = gsap.timeline({
  scrollTrigger: {
    trigger: heroWrapper,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1.5,
  }
});

// Phase 1 (0–20%): Fade out tagline, scroll hint, and slide cat down. Bring paw in.
heroTL.fromTo([heroTagline, heroScroll], 
  { opacity: 1, y: 0 },
  { opacity: 0, y: 14, duration: 0.2, ease: 'none' }, 
  0
);

// Slide cat down to hide instead of fading
heroTL.fromTo(catWrapper,
  { yPercent: 0 },
  { yPercent: 120, duration: 0.2, ease: 'power2.in' },
  0
);

// Make the cat look sad (frown, half-closed droopy eyes, look down)
heroTL.fromTo(document.getElementById('cat-mouth'),
  { attr: { d: "M143,187 Q150,193 157,187" } },
  { attr: { d: "M143,187 Q150,183 157,187" }, duration: 0.2, ease: 'none' },
  0
);
heroTL.fromTo(document.getElementById('eyelid-left'),
  { attr: { d: "M80,120 L144,120 L144,120 L80,120 Z" } },
  { attr: { d: "M80,120 L144,120 L144,142 L80,158 Z" }, duration: 0.2, ease: 'none' },
  0
);
heroTL.fromTo(document.getElementById('eyelid-right'),
  { attr: { d: "M156,120 L220,120 L220,120 L156,120 Z" } },
  { attr: { d: "M156,120 L220,120 L220,158 L156,142 Z" }, duration: 0.2, ease: 'none' },
  0
);
heroTL.fromTo([pupilLeft, pupilRight],
  { y: 0 },
  { y: 6, duration: 0.2, ease: 'none' },
  0
);

heroTL.fromTo(pawSwipe, 
  { opacity: 0 },
  { opacity: 1, duration: 0.2, ease: 'power2.out' }, 
  0
);

// Phase 2 (20–100%): Paw scales massively, zooming into the center pad.
heroTL.fromTo(pawSwipe, 
  { scale: 0 },
  { scale: 30, duration: 0.8, ease: 'power1.in' }, 
  0.2
);

// Phase 3 (50-100%): Nav fade
heroTL.to(siteNav, {
  opacity: 0, duration: 0.5, ease: 'none'
}, 0.5);

// ── Nav re-appear on scroll past hero ──
ScrollTrigger.create({
  trigger: '.work-section',
  start: 'top 60%',
  onEnter:     () => gsap.to(siteNav, { opacity: 1, duration: 0.5, ease: 'power2.out' }),
  onLeaveBack: () => gsap.to(siteNav, { opacity: 0, duration: 0.3 }),
});

// ════════════════════════════════════
//  SITE-WIDE CAT GLIMPSES
// ════════════════════════════════════

// Cert cat peeps in, meows, then retreats
const certCat = document.getElementById('cert-cat-peek');
const meowText = document.getElementById('meow-text');
if (certCat && meowText) {
  ScrollTrigger.create({
    trigger: '.certs-section',
    start: 'top 55%',
    once: true,
    onEnter: () => {
      gsap.timeline()
        .to(certCat, { x: -120, duration: 0.6, ease: 'back.out(1.2)' })
        .to(meowText, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, '+=0.2')
        .to(meowText, { opacity: 0, scale: 0.5, duration: 0.2 }, '+=5') // Stays for 5 seconds
        .to(certCat, { x: 0, duration: 0.5, ease: 'power2.in' }, '+=0.1');
    }
  });
}
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
