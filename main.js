/* ══════════════════════════════════════════════════════
   MIX DARK DEV — main.js  |  SPACE EDITION
══════════════════════════════════════════════════════ */
'use strict';

/* ═══════════════════════════════════════════════════
   CANVAS SETUP
═══════════════════════════════════════════════════ */
const canvas = document.getElementById('bgCanvas');
const ctx    = canvas.getContext('2d');
let W, H, mouseX = 0, mouseY = 0;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); buildScene(); });
window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

/* ═══════════════════════════════════════════════════
   WARP STAR FIELD  (viaje por el espacio)
═══════════════════════════════════════════════════ */
// Punto de fuga — sigue al mouse suavemente
let vpX = 0, vpY = 0, vpTX = 0, vpTY = 0;

// Tres capas de profundidad: lejos/medio/cerca
const WARP_LAYERS = [
  { count: 320, speed: 0.0045, maxR: 1.2, baseAlpha: 0.55, trailLen: 1.8 },
  { count: 180, speed: 0.0095, maxR: 2.0, baseAlpha: 0.75, trailLen: 2.8 },
  { count:  80, speed: 0.0175, maxR: 3.0, baseAlpha: 1.0,  trailLen: 4.5 },
];

class WarpStar {
  constructor(cfg) {
    this.cfg = cfg;
    this.reset(true);
  }
  reset(spread) {
    // Posición angular aleatoria, luego convertida a offset XY
    const angle = Math.random() * Math.PI * 2;
    const dist  = spread
      ? Math.random() * Math.max(W, H) * 0.85
      : Math.random() * Math.max(W, H) * 0.1 + 2;
    this.sx  = Math.cos(angle) * dist;
    this.sy  = Math.sin(angle) * dist;
    this.z   = spread ? Math.random() * 0.95 + 0.05 : 1.0;
    this.pz  = this.z;
    // Color: blanco puro, celeste tenue o cian
    const r  = Math.random();
    this.rgb = r < .55 ? '255,255,255' : r < .80 ? '200,240,255' : '0,245,255';
  }
  _project(z) {
    return {
      x: this.sx / z + vpX,
      y: this.sy / z + vpY,
    };
  }
  update() {
    this.pz  = this.z;
    this.z  -= this.cfg.speed;
    if (this.z <= 0.018) { this.reset(false); return; }
    const p = this._project(this.z);
    if (p.x < -80 || p.x > W + 80 || p.y < -80 || p.y > H + 80) {
      this.reset(false);
    }
  }
  draw() {
    const p   = this._project(this.z);
    const pp  = this._project(this.pz);
    const t   = 1 - this.z;                          // 0=lejos .. 1=cerca
    const r   = this.cfg.maxR * t + 0.2;
    const a   = Math.min(1, t * 1.4) * this.cfg.baseAlpha;
    const trailA = a * 0.55;

    // Cola de velocidad (trail)
    const trailScale = this.cfg.trailLen;
    const tx = p.x + (pp.x - p.x) * trailScale;
    const ty = p.y + (pp.y - p.y) * trailScale;
    const grad = ctx.createLinearGradient(tx, ty, p.x, p.y);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, `rgba(${this.rgb},${trailA})`);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(p.x, p.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = r * 0.75;
    ctx.globalAlpha = 1;
    ctx.stroke();

    // Cabeza de la estrella
    ctx.beginPath();
    ctx.arc(p.x, p.y, Math.max(r, 0.25), 0, Math.PI * 2);
    ctx.fillStyle   = `rgba(${this.rgb},1)`;
    ctx.globalAlpha = a;
    ctx.fill();

    // Halo suave en estrellas cercanas
    if (t > 0.55 && r > 1.4) {
      const g2 = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 4);
      g2.addColorStop(0, `rgba(${this.rgb},${a * .45})`);
      g2.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 4, 0, Math.PI * 2);
      ctx.fillStyle   = g2;
      ctx.globalAlpha = 1;
      ctx.fill();
    }
  }
}

/* ═══════════════════════════════════════════════════
   METEOROS EN CANVAS
═══════════════════════════════════════════════════ */
class Meteor {
  constructor() { this.reset(); }
  reset() {
    const angle  = Math.random() * Math.PI * 2;
    const dist   = Math.random() * 40 + 5;   // nace cerca del centro
    this.x       = vpX + Math.cos(angle) * dist;
    this.y       = vpY + Math.sin(angle) * dist;
    this.dirX    = Math.cos(angle);
    this.dirY    = Math.sin(angle);
    this.len     = Math.random() * 320 + 140;
    this.spd     = Math.random() * 28 + 14;
    this.a       = 0;
    this.life    = 0;
    this.maxLife = Math.random() * 70 + 45;
    const rnd    = Math.random();
    this.color   = rnd < .6 ? '#ffffff' : rnd < .85 ? '#00f5ff' : '#bf5fff';
    this.width   = Math.random() * 2.5 + 1.0;
    this.active  = false;
    this.delay   = Math.random() * 180;
    this.delayCount = 0;
  }
  update() {
    if (!this.active) {
      this.delayCount++;
      if (this.delayCount >= this.delay) this.active = true;
      return;
    }
    this.x    += this.dirX * this.spd;
    this.y    += this.dirY * this.spd;
    this.life++;
    const half = this.maxLife / 2;
    this.a = this.life < half
      ? this.life / half
      : 1 - (this.life - half) / half;
    if (this.life >= this.maxLife || this.x > W + 200 || this.y > H + 200) this.reset();
  }
  draw() {
    if (!this.active || this.a <= 0) return;
    const tx = this.x - this.dirX * this.len;
    const ty = this.y - this.dirY * this.len;
    const grad = ctx.createLinearGradient(tx, ty, this.x, this.y);
    const rgb = this.color === '#00f5ff' ? '0,245,255' : this.color === '#bf5fff' ? '191,95,255' : '255,255,255';
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(.4, `rgba(${rgb},${this.a * .35})`);
    grad.addColorStop(.85, `rgba(${rgb},${this.a * .8})`);
    grad.addColorStop(1, `rgba(${rgb},${this.a})`);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(this.x, this.y);
    ctx.strokeStyle = grad;
    ctx.lineWidth   = this.width;
    ctx.globalAlpha = this.a;
    ctx.stroke();
    // cabeza con halo brillante
    const headGlow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.width * 7);
    headGlow.addColorStop(0, `rgba(${rgb},${this.a})`);
    headGlow.addColorStop(.4, `rgba(${rgb},${this.a * .5})`);
    headGlow.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width * 7, 0, Math.PI * 2);
    ctx.fillStyle = headGlow;
    ctx.globalAlpha = this.a;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.width * 2.2, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.a;
    ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════
   PARTÍCULAS DE ENERGÍA (orbes con movimiento y destellos)
═══════════════════════════════════════════════════ */
class SparkParticle {
  constructor() { this.reset(true); }
  reset(rand) {
    this.ox    = Math.random() * W;          // origen X de la trayectoria
    this.oy    = rand ? Math.random() * H : Math.random() * H;
    this.x     = this.ox;
    this.y     = this.oy;
    // Trayectoria sinusoidal Lissajous independiente por eje
    this.ax    = Math.random() * 55 + 20;    // amplitud X
    this.ay    = Math.random() * 45 + 18;    // amplitud Y
    this.fx    = Math.random() * .008 + .003;// frecuencia X
    this.fy    = Math.random() * .006 + .002;// frecuencia Y
    this.dx    = (Math.random() - .5) * .5;  // deriva lenta
    this.dy    = (Math.random() - .5) * .4;
    this.phase = Math.random() * Math.PI * 2;
    this.phaseY= Math.random() * Math.PI * 2;
    this.spd   = Math.random() * .03 + .012; // velocidad fase
    this.t     = Math.random() * 600;        // tiempo interno

    this.core  = Math.random() * 2.5 + .9;
    this.halo  = this.core * (Math.random() * 9 + 7);
    this.peak  = Math.random() * .8 + .5;
    this.spikes = Math.random() < .45;       // ¿tiene puntas?
    this.numSpikes = Math.random() < .4 ? 8 : 4;
    this.flen  = this.halo * (Math.random() * .9 + .6);

    // Flash burst: explota cada N frames
    this.burstInterval = Math.floor(Math.random() * 220 + 120);
    this.burstTimer    = Math.floor(Math.random() * this.burstInterval);
    this.burstLife     = 0;
    this.bursting      = false;

    const rnd = Math.random();
    if      (rnd < .30) { this.rgb = '0,245,255';   this.hex = '#00f5ff'; }
    else if (rnd < .55) { this.rgb = '191,95,255';  this.hex = '#bf5fff'; }
    else if (rnd < .75) { this.rgb = '255,45,120';  this.hex = '#ff2d78'; }
    else if (rnd < .90) { this.rgb = '255,210,0';   this.hex = '#ffd200'; }
    else                { this.rgb = '255,255,255'; this.hex = '#ffffff'; }

    // wrap bordes
    if (this.ox < 0)  this.ox = W + this.ox;
    if (this.ox > W)  this.ox = this.ox - W;
    if (this.oy < 0)  this.oy = H + this.oy;
    if (this.oy > H)  this.oy = this.oy - H;
  }
  update() {
    this.t      += 1;
    this.phase  += this.spd;
    this.phaseY += this.spd * .7;
    // Posición = origen + curva sinusoidal por eje + deriva lenta
    this.x = this.ox + Math.sin(this.t * this.fx + this.phase)  * this.ax;
    this.y = this.oy + Math.cos(this.t * this.fy + this.phaseY) * this.ay;
    // Deriva del origen (movimiento suave de largo aliento)
    this.ox += this.dx;
    this.oy += this.dy;
    // Rebote de origen en bordes
    if (this.ox < -80 || this.ox > W + 80) this.dx *= -1;
    if (this.oy < -80 || this.oy > H + 80) this.dy *= -1;

    // Gestión flash burst
    this.burstTimer++;
    if (this.burstTimer >= this.burstInterval && !this.bursting) {
      this.bursting  = true;
      this.burstLife = 0;
      this.burstTimer= 0;
    }
    if (this.bursting) {
      this.burstLife++;
      if (this.burstLife > 28) { this.bursting = false; }
    }
  }
  draw() {
    const sinA = Math.abs(Math.sin(this.phase));
    const a    = this.peak * (.5 + .5 * sinA);
    const cx   = this.x, cy = this.y;

    // — Burst flash —
    let burstMult = 1;
    if (this.bursting) {
      const bt = this.burstLife / 28;
      burstMult = bt < .3
        ? 1 + bt * 10          // expansión rápida (1→4)
        : 1 + (1 - bt) * 3;    // contracción suave (4→1)
      // Anillo de onda expansiva
      const waveR = this.halo * burstMult * 1.8;
      const waveA = (1 - bt) * .6;
      const gWave = ctx.createRadialGradient(cx, cy, waveR * .7, cx, cy, waveR);
      gWave.addColorStop(0,   `rgba(${this.rgb},${waveA})`);
      gWave.addColorStop(.5,  `rgba(${this.rgb},${waveA * .4})`);
      gWave.addColorStop(1,   'transparent');
      ctx.beginPath();
      ctx.arc(cx, cy, waveR, 0, Math.PI * 2);
      ctx.fillStyle   = gWave;
      ctx.globalAlpha = 1;
      ctx.fill();
    }

    const haloR = this.halo * burstMult;
    const coreR = this.core * Math.min(burstMult, 2.2);

    // Halo exterior
    const gOuter = ctx.createRadialGradient(cx, cy, 0, cx, cy, haloR);
    gOuter.addColorStop(0,   `rgba(${this.rgb},${a * .6 * burstMult})`);
    gOuter.addColorStop(.3,  `rgba(${this.rgb},${a * .28})`);
    gOuter.addColorStop(.65, `rgba(${this.rgb},${a * .07})`);
    gOuter.addColorStop(1,   'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, haloR, 0, Math.PI * 2);
    ctx.fillStyle   = gOuter;
    ctx.globalAlpha = 1;
    ctx.fill();

    // Anillo interno
    const gMid = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 4.5);
    gMid.addColorStop(0,   `rgba(${this.rgb},${Math.min(a * burstMult, 1)})`);
    gMid.addColorStop(.5,  `rgba(${this.rgb},${a * .55})`);
    gMid.addColorStop(1,   'transparent');
    ctx.beginPath();
    ctx.arc(cx, cy, coreR * 4.5, 0, Math.PI * 2);
    ctx.fillStyle   = gMid;
    ctx.globalAlpha = 1;
    ctx.fill();

    // Núcleo
    ctx.beginPath();
    ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
    ctx.fillStyle   = this.hex;
    ctx.globalAlpha = Math.min(a * 1.5 * burstMult, 1);
    ctx.fill();

    // Puntas (siempre activas, más largas en burst)
    if (this.spikes || this.bursting) {
      const n   = this.bursting ? Math.max(this.numSpikes, 8) : this.numSpikes;
      const fl  = this.flen * (.55 + .45 * sinA) * (this.bursting ? burstMult * 1.4 : 1);
      const lw  = Math.max(coreR * .55, .7);
      ctx.lineCap = 'round';
      for (let i = 0; i < n; i++) {
        const ang  = (i / n) * Math.PI * 2;
        const x1   = cx - Math.cos(ang) * fl;
        const y1   = cy - Math.sin(ang) * fl;
        const x2   = cx + Math.cos(ang) * fl;
        const y2   = cy + Math.sin(ang) * fl;
        const grad = ctx.createLinearGradient(x1, y1, x2, y2);
        const pa   = Math.min(a * (this.bursting ? burstMult : 1), 1);
        grad.addColorStop(0,   'transparent');
        grad.addColorStop(.42, `rgba(${this.rgb},${pa * .85})`);
        grad.addColorStop(.5,  this.hex);
        grad.addColorStop(.58, `rgba(${this.rgb},${pa * .85})`);
        grad.addColorStop(1,   'transparent');
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = lw;
        ctx.globalAlpha = pa;
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;
  }
}

/* ═══════════════════════════════════════════════════
   NEBULOSAS EN CANVAS
═══════════════════════════════════════════════════ */
class NebulaBlob {
  constructor() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.r     = Math.random() * 380 + 160;
    this.phase = Math.random() * Math.PI * 2;
    this.spd   = Math.random() * .004 + .0015;
    this.vx    = (Math.random() - .5) * .22;
    this.vy    = (Math.random() - .5) * .16;
    const rnd  = Math.random();
    this.color = rnd < .25
      ? [80, 0, 160]
      : rnd < .50
        ? [0, 30, 140]
        : rnd < .75
          ? [0, 120, 100]
          : [140, 0, 80];
  }
  update() {
    this.phase += this.spd;
    this.x     += this.vx;
    this.y     += this.vy;
    if (this.x < -this.r)       this.x = W + this.r;
    if (this.x > W + this.r)    this.x = -this.r;
    if (this.y < -this.r)       this.y = H + this.r;
    if (this.y > H + this.r)    this.y = -this.r;
  }
  draw() {
    const a = .14 + .08 * Math.sin(this.phase);
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
    g.addColorStop(0,   `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${a})`);
    g.addColorStop(.5,  `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${a * .5})`);
    g.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.globalAlpha = 1;
    ctx.fill();
  }
}

/* ═══════════════════════════════════════════════════
   ESCENA
═══════════════════════════════════════════════════ */
let stars = [], meteors = [], asteroids = [], nebulas = [];

function buildScene() {
  vpX  = W / 2; vpY  = H / 2;
  vpTX = W / 2; vpTY = H / 2;
  stars     = WARP_LAYERS.flatMap(l => Array.from({ length: l.count }, () => new WarpStar(l)));
  meteors   = Array.from({ length: 28 }, () => new Meteor());
  asteroids = Array.from({ length: 60 }, () => new SparkParticle());
  nebulas   = Array.from({ length: 10 }, () => new NebulaBlob());
}
buildScene();

/* ═══════════════════════════════════════════════════
   PARALAJE CON MOUSE
═══════════════════════════════════════════════════ */
function getParallaxOffset(depth) {
  const cx = W / 2, cy = H / 2;
  return {
    x: ((mouseX - cx) / cx) * depth * 12,
    y: ((mouseY - cy) / cy) * depth * 8,
  };
}

/* ═══════════════════════════════════════════════════
   LOOP DE ANIMACIÓN
═══════════════════════════════════════════════════ */
function animLoop() {
  ctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = 1;

  // Punto de fuga sigue al mouse con inercia suave
  vpTX = W / 2 + (mouseX - W / 2) * 0.06;
  vpTY = H / 2 + (mouseY - H / 2) * 0.04;
  vpX += (vpTX - vpX) * 0.04;
  vpY += (vpTY - vpY) * 0.04;

  // Nebulosas (fondo más profundo)
  nebulas.forEach(n => { n.update(); n.draw(); });

  // Warp star field
  stars.forEach(s => { s.update(); s.draw(); });

  // Meteoros radiales
  ctx.save();
  meteors.forEach(m => { m.update(); m.draw(); });
  ctx.restore();

  // Partículas de energía
  ctx.save();
  asteroids.forEach(a => { a.update(); a.draw(); });
  ctx.restore();

  ctx.globalAlpha = 1;
  requestAnimationFrame(animLoop);
}
animLoop();

/* ═══════════════════════════════════════════════════
   SPLIT TÍTULO EN LETRAS INDIVIDUALES
═══════════════════════════════════════════════════ */
(function splitTitle() {
  const els = document.querySelectorAll('.main-title');
  if (!els.length) return;
  let idx = 0;
  els.forEach(el => {
    const text = (el.getAttribute('data-text') || el.textContent).trim();
    let html = '';
    for (const ch of text) {
      if (ch === ' ') {
        html += '<span class="char-space"> </span>';
      } else {
        html += `<span class="char" style="--i:${idx}">${ch}</span>`;
        idx++;
      }
    }
    el.innerHTML = html;
  });
})();

/* ═══════════════════════════════════════════════════
   CONTADOR HUD
═══════════════════════════════════════════════════ */
const hudCounter = document.getElementById('hudCounter');
let   counter    = 0;
setInterval(() => {
  counter = (counter + Math.floor(Math.random() * 17 + 3)) % 10000;
  hudCounter.textContent = `SYS:${String(counter).padStart(4, '0')}`;
}, 120);

/* ═══════════════════════════════════════════════════
   REPRODUCTOR MP3
═══════════════════════════════════════════════════ */
const audio      = document.getElementById('bgAudio');
const musicBtn   = document.getElementById('musicBtn');
const musicLabel = document.getElementById('musicLabel');
let   playing    = false;

// Fade de volumen suave
function fadeTo(target, ms = 600) {
  const start   = audio.volume;
  const diff    = target - start;
  const steps   = 30;
  const interval = ms / steps;
  let   step    = 0;
  clearInterval(audio._fadeTimer);
  audio._fadeTimer = setInterval(() => {
    step++;
    audio.volume = Math.min(1, Math.max(0, start + diff * (step / steps)));
    if (step >= steps) {
      clearInterval(audio._fadeTimer);
      if (target === 0) audio.pause();
    }
  }, interval);
}

function setPlaying(state) {
  playing = state;
  if (state) {
    musicBtn.classList.remove('paused');
    flashLabel('♫ ON');
  } else {
    musicBtn.classList.add('paused');
    flashLabel('♫ OFF');
  }
}

// Intento de autoplay al cargar
window.addEventListener('load', () => {
  audio.volume = 0.65;
  const promise = audio.play();
  if (promise !== undefined) {
    promise.then(() => {
      // Autoplay permitido
      setPlaying(true);
    }).catch(() => {
      // Bloqueado por el navegador: permanece con apariencia normal en paused
    });
  }
});

musicBtn.addEventListener('click', () => {
  if (!playing) {
    audio.volume = 0;
    audio.play().then(() => {
      fadeTo(0.65);
      setPlaying(true);
    }).catch(() => {});
  } else {
    fadeTo(0);
    setPlaying(false);
  }
});

function flashLabel(text) {
  musicLabel.textContent = text;
  musicLabel.classList.add('visible');
  clearTimeout(musicLabel._tid);
  musicLabel._tid = setTimeout(() => musicLabel.classList.remove('visible'), 2200);
}

