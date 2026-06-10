/* ================================================================
   NINJA SLICE QUIZ — script.js
   Coventry University 503IT | Team: The Originals

   ┌────────────────────────────────────────────────────────────┐
   │  TEAM ROLES                                                │
   │  Mukesh (Coordinator) - Planning, integration, cyber bar   │
   │  Suman                - Login & registration system        │
   │  Kishor               - Question system & timer            │
   │  Bishal               - Slicing mechanics & visual effects │
   │  Akash                - Scoring system & results screen    │
   └────────────────────────────────────────────────────────────┘

   FILE LAYOUT:
     1. CYBER ETHICS BAR        [Mukesh]
     2. BACKGROUND SCENE        [Bishal]
     3. AUDIO ENGINE            [Bishal]
     4. USER ACCOUNT SYSTEM     [Suman]
     5. QUESTION BANK           [Kishor]
     6. FRUIT & PARTICLE CLASSES[Bishal]
     7. GAME ENGINE             [Bishal + Kishor + Akash]
     8. TIMER SYSTEM            [Kishor]
     9. SCORING & RESULTS       [Akash]
    10. SCREEN MANAGEMENT       [Mukesh]
    11. EVENT WIRING            [Mukesh - Integration]
   ================================================================ */


/* ════════════════════════════════════════════════════════════════
   SECTION 1 — CYBER ETHICS BAR
   [Mukesh — Coordinator: Integration & Planning]
   ════════════════════════════════════════════════════════════════ */
const CYBER_TIPS = [
  "🔐 Tip: Use a unique password for every account you create.",
  "🎣 Tip: Think before you click — phishing emails look very real!",
  "🛡️ Tip: Enable two-factor authentication wherever possible.",
  "🌐 Tip: Always check for HTTPS before entering personal info.",
  "💾 Tip: Back up your data — ransomware can strike anyone.",
  "🕵️ Tip: Never share your password — not even with IT support!",
  "📱 Tip: Keep all your apps updated to patch security holes.",
  "⚖️ Tip: Unauthorised computer access is illegal under CMA 1990."
];

let cyberTipIdx = 0;
setInterval(() => {
  cyberTipIdx = (cyberTipIdx + 1) % CYBER_TIPS.length;
  const el = document.getElementById('cbTipText');
  el.style.opacity = 0;
  setTimeout(() => { el.textContent = CYBER_TIPS[cyberTipIdx]; el.style.opacity = 1; }, 350);
}, 6000);

document.getElementById('openCyberBtn').onclick  = () => document.getElementById('cyberModal').classList.add('open');
document.getElementById('closeCyberBtn').onclick = () => document.getElementById('cyberModal').classList.remove('open');
document.getElementById('cyberModal').onclick = (e) => {
  if (e.target.id === 'cyberModal') e.currentTarget.classList.remove('open');
};


/* ════════════════════════════════════════════════════════════════
   SECTION 2 — BACKGROUND SCENE
   [Bishal — Visual Effects]
   ════════════════════════════════════════════════════════════════ */
/*
   EPIC SAMURAI WORLD — layered parallax silhouette scene.
   Back→front: sky · stars · giant red moon · drifting clouds ·
   far mountains · Mount Fuji · mid mountains · pagoda · torii gate ·
   cherry trees · foreground hill · lone samurai · fog · cranes · petals.
*/
(() => {
  const c = document.getElementById('bgCanvas');
  const ctx = c.getContext('2d');
  let W, H;
  const resize = () => { W = c.width = c.offsetWidth; H = c.height = c.offsetHeight; };
  resize(); new ResizeObserver(resize).observe(c);

  let T = 0; // global time (frames)

  /* ---------- falling cherry petals ---------- */
  class Petal {
    constructor() { this.reset(true); }
    reset(initial) {
      this.x = Math.random() * W;
      this.y = initial ? Math.random() * H : -20;
      this.sz = 3 + Math.random() * 5;
      this.sp = 0.5 + Math.random() * 0.9;
      this.dx = (Math.random() - 0.5) * 0.6;
      this.rot = Math.random() * Math.PI * 2;
      this.rv = (Math.random() - 0.5) * 0.05;
      this.a  = 0.35 + Math.random() * 0.5;
      const cols = [[255,183,197],[255,209,220],[255,170,189],[255,225,232]];
      this.rgb = cols[Math.floor(Math.random()*cols.length)];
    }
    tick() {
      this.y += this.sp;
      this.x += this.dx + Math.sin(this.y*0.02)*0.5;
      this.rot += this.rv;
      if (this.y > H + 20) this.reset(false);
    }
    draw() {
      ctx.save();
      ctx.translate(this.x, this.y); ctx.rotate(this.rot); ctx.globalAlpha = this.a;
      ctx.beginPath(); ctx.ellipse(0,0,this.sz,this.sz*0.5,0,0,Math.PI*2);
      ctx.fillStyle = `rgb(${this.rgb})`; ctx.fill(); ctx.restore();
    }
  }
  const petals = Array.from({length: 55}, () => new Petal());

  /* ---------- twinkling stars ---------- */
  const stars = Array.from({length: 80}, () => ({
    x: Math.random(), y: Math.random()*0.5,
    r: Math.random()*1.4 + 0.3, ph: Math.random()*Math.PI*2
  }));

  /* ---------- flying cranes ---------- */
  const cranes = Array.from({length: 4}, (_, i) => ({
    x: Math.random(), y: 0.18 + Math.random()*0.18,
    sp: 0.00018 + Math.random()*0.00022, flap: Math.random()*Math.PI*2, sc: 0.8 + Math.random()*0.5
  }));

  /* ---------- helpers ---------- */
  // Smooth mountain ridge using layered sine waves
  function ridge(baseY, amp, color, seed, rough) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 8) {
      const n = Math.sin(x*0.004 + seed)*amp
              + Math.sin(x*0.011 + seed*2)*amp*rough
              + Math.sin(x*0.022 + seed*3)*amp*rough*0.5;
      ctx.lineTo(x, baseY - n);
    }
    ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
  }

  function drawMoon() {
    const mx = W*0.70, my = H*0.30, R = Math.min(W,H)*0.20;
    // glow
    const glow = ctx.createRadialGradient(mx,my,R*0.5, mx,my,R*2.4);
    glow.addColorStop(0,'rgba(255,120,90,0.55)');
    glow.addColorStop(0.5,'rgba(255,90,70,0.18)');
    glow.addColorStop(1,'transparent');
    ctx.fillStyle = glow; ctx.fillRect(0,0,W,H);
    // disc
    const disc = ctx.createRadialGradient(mx-R*0.25,my-R*0.25,R*0.2, mx,my,R);
    disc.addColorStop(0,'#ffd9a0'); disc.addColorStop(0.6,'#ff8a5c'); disc.addColorStop(1,'#e8553e');
    ctx.fillStyle = disc;
    ctx.beginPath(); ctx.arc(mx,my,R,0,Math.PI*2); ctx.fill();
  }

  function drawTorii(x, baseY, h, color) {
    const w = h*0.85, pw = h*0.08;
    ctx.fillStyle = color;
    // pillars (slightly angled)
    ctx.fillRect(x - w*0.42, baseY - h, pw, h);
    ctx.fillRect(x + w*0.42 - pw, baseY - h, pw, h);
    // top curved beam (kasagi)
    ctx.beginPath();
    ctx.moveTo(x - w*0.62, baseY - h);
    ctx.quadraticCurveTo(x, baseY - h - h*0.14, x + w*0.62, baseY - h);
    ctx.lineTo(x + w*0.62, baseY - h + pw*1.1);
    ctx.quadraticCurveTo(x, baseY - h - h*0.02, x - w*0.62, baseY - h + pw*1.1);
    ctx.closePath(); ctx.fill();
    // second beam (nuki)
    ctx.fillRect(x - w*0.5, baseY - h*0.78, w, pw*0.9);
  }

  function drawPagoda(x, baseY, scale, color) {
    ctx.fillStyle = color;
    const tiers = 4;
    let ty = baseY, tw = 54*scale;
    for (let i = 0; i < tiers; i++) {
      // roof eave
      ctx.beginPath();
      ctx.moveTo(x - tw, ty);
      ctx.quadraticCurveTo(x - tw*0.5, ty - 12*scale, x, ty - 8*scale);
      ctx.quadraticCurveTo(x + tw*0.5, ty - 12*scale, x + tw, ty);
      ctx.lineTo(x + tw*0.7, ty - 4*scale);
      ctx.lineTo(x - tw*0.7, ty - 4*scale);
      ctx.closePath(); ctx.fill();
      // body
      ctx.fillRect(x - tw*0.45, ty - 30*scale, tw*0.9, 26*scale);
      ty -= 34*scale; tw *= 0.78;
    }
    // spire
    ctx.fillRect(x - 2*scale, ty - 16*scale, 4*scale, 18*scale);
  }

  function drawCherryTree(x, baseY, scale, color) {
    ctx.strokeStyle = color; ctx.fillStyle = color;
    ctx.lineWidth = 6*scale; ctx.lineCap = 'round';
    // trunk
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.quadraticCurveTo(x - 14*scale, baseY - 40*scale, x - 6*scale, baseY - 70*scale);
    ctx.stroke();
    // branches
    [[-1,-55,-40],[1,-50,-65],[-0.4,-75,-80]].forEach(([dir,bx,by]) => {
      ctx.beginPath();
      ctx.moveTo(x - 6*scale, baseY - 60*scale);
      ctx.lineTo(x + bx*scale + dir*20*scale, baseY + by*scale);
      ctx.stroke();
    });
    // canopy blobs
    [[-30,-78,28],[6,-92,32],[34,-74,26],[-6,-66,22]].forEach(([cx,cy,r]) => {
      ctx.beginPath(); ctx.arc(x + cx*scale, baseY + cy*scale, r*scale, 0, Math.PI*2); ctx.fill();
    });
  }

  function drawSamurai(x, baseY, scale, color) {
    ctx.fillStyle = color;
    const s = scale;
    // legs / robe (trapezoid)
    ctx.beginPath();
    ctx.moveTo(x - 22*s, baseY);
    ctx.lineTo(x + 22*s, baseY);
    ctx.lineTo(x + 12*s, baseY - 70*s);
    ctx.lineTo(x - 12*s, baseY - 70*s);
    ctx.closePath(); ctx.fill();
    // shoulders
    ctx.beginPath();
    ctx.moveTo(x - 26*s, baseY - 62*s);
    ctx.lineTo(x + 26*s, baseY - 62*s);
    ctx.lineTo(x + 14*s, baseY - 90*s);
    ctx.lineTo(x - 14*s, baseY - 90*s);
    ctx.closePath(); ctx.fill();
    // head
    ctx.beginPath(); ctx.arc(x, baseY - 100*s, 11*s, 0, Math.PI*2); ctx.fill();
    // kasa (straw hat) — wide triangle
    ctx.beginPath();
    ctx.moveTo(x - 30*s, baseY - 102*s);
    ctx.quadraticCurveTo(x, baseY - 100*s, x + 30*s, baseY - 102*s);
    ctx.lineTo(x, baseY - 124*s);
    ctx.closePath(); ctx.fill();
    // katana (diagonal blade)
    ctx.strokeStyle = color; ctx.lineWidth = 4*s; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x + 24*s, baseY - 30*s);
    ctx.lineTo(x + 60*s, baseY - 96*s);
    ctx.stroke();
  }

  // Sneaky SHADOW NINJA silhouettes with glowing red eyes
  function drawShadowNinja(x, baseY, s, color, bob) {
    const by = baseY + Math.sin(T*0.04 + bob)*2*s;
    ctx.fillStyle = color;
    // crouched cloak body
    ctx.beginPath();
    ctx.moveTo(x - 17*s, by);
    ctx.quadraticCurveTo(x - 15*s, by - 34*s, x, by - 42*s);
    ctx.quadraticCurveTo(x + 15*s, by - 34*s, x + 17*s, by);
    ctx.closePath(); ctx.fill();
    // hooded head
    ctx.beginPath(); ctx.arc(x, by - 46*s, 8.5*s, 0, Math.PI*2); ctx.fill();
    // headband tails fluttering
    ctx.strokeStyle = color; ctx.lineWidth = 3*s; ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x - 6*s, by - 48*s);
    ctx.lineTo(x - 22*s, by - 42*s + Math.sin(T*0.08 + bob)*4*s);
    ctx.stroke();
    // katana strapped on back
    ctx.lineWidth = 2.6*s;
    ctx.beginPath();
    ctx.moveTo(x + 7*s, by - 52*s);
    ctx.lineTo(x + 20*s, by - 74*s);
    ctx.stroke();
    // glowing red eyes
    ctx.fillStyle = 'rgba(255,70,55,0.9)';
    ctx.beginPath(); ctx.arc(x - 3*s, by - 46*s, 1.4*s, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x + 3*s, by - 46*s, 1.4*s, 0, Math.PI*2); ctx.fill();
  }

  function drawCrane(cr) {
    const x = cr.x*W, y = cr.y*H, s = cr.sc;
    const wing = Math.sin(cr.flap)*9*s;
    ctx.strokeStyle = 'rgba(20,12,30,0.6)'; ctx.lineWidth = 2*s; ctx.lineCap='round';
    ctx.beginPath();
    ctx.moveTo(x - 11*s, y + wing);
    ctx.quadraticCurveTo(x, y - 4*s, x + 11*s, y + wing);
    ctx.stroke();
  }

  /* ---------- main render ---------- */
  (function loop() {
    T++;
    // SKY — deep indigo night fading to warm dusk at horizon
    const sky = ctx.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,'#140a2e');
    sky.addColorStop(0.35,'#3a1a52');
    sky.addColorStop(0.62,'#7a2f54');
    sky.addColorStop(0.8,'#c85a4a');
    sky.addColorStop(1,'#e8895a');
    ctx.fillStyle = sky; ctx.fillRect(0,0,W,H);

    // STARS (upper third, twinkling)
    stars.forEach(st => {
      const a = 0.4 + Math.sin(T*0.04 + st.ph)*0.4;
      ctx.globalAlpha = Math.max(0, a);
      ctx.fillStyle = '#fff7e6';
      ctx.beginPath(); ctx.arc(st.x*W, st.y*H, st.r, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // MOON
    drawMoon();

    // DRIFTING CLOUD BANDS across the moon
    ctx.save();
    for (let i = 0; i < 4; i++) {
      const cy = H*(0.18 + i*0.06);
      const off = (T*0.3*(i+1) + i*180) % (W+400) - 200;
      ctx.globalAlpha = 0.10 + i*0.03;
      ctx.fillStyle = '#2a1840';
      ctx.beginPath();
      ctx.ellipse(off, cy, 240, 16, 0, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();

    // CRANES
    cranes.forEach(cr => {
      cr.x += cr.sp; cr.flap += 0.18;
      if (cr.x > 1.1) { cr.x = -0.1; cr.y = 0.16 + Math.random()*0.2; }
      drawCrane(cr);
    });

    // FAR mountains (lightest, subtle parallax sway)
    ridge(H*0.62, 70, '#5b3168', 1.2 + Math.sin(T*0.002)*0.05, 0.4);

    // MOUNT FUJI (centre-left, snow cap)
    (function fuji() {
      const fx = W*0.34, fy = H*0.64, fw = Math.min(W,H)*0.42, fh = Math.min(W,H)*0.40;
      ctx.fillStyle = '#6a3a78';
      ctx.beginPath();
      ctx.moveTo(fx - fw/2, fy);
      ctx.quadraticCurveTo(fx - fw*0.18, fy - fh*0.78, fx - fw*0.13, fy - fh*0.85);
      ctx.lineTo(fx + fw*0.13, fy - fh*0.85);
      ctx.quadraticCurveTo(fx + fw*0.18, fy - fh*0.78, fx + fw/2, fy);
      ctx.closePath(); ctx.fill();
      // snow cap
      ctx.fillStyle = '#e9d6f2';
      ctx.beginPath();
      ctx.moveTo(fx - fw*0.16, fy - fh*0.70);
      ctx.lineTo(fx - fw*0.13, fy - fh*0.85);
      ctx.lineTo(fx + fw*0.13, fy - fh*0.85);
      ctx.lineTo(fx + fw*0.16, fy - fh*0.70);
      ctx.quadraticCurveTo(fx + fw*0.05, fy - fh*0.66, fx, fy - fh*0.72);
      ctx.quadraticCurveTo(fx - fw*0.05, fy - fh*0.66, fx - fw*0.16, fy - fh*0.70);
      ctx.closePath(); ctx.fill();
    })();

    // MID mountains
    ridge(H*0.72, 55, '#3f2150', 4.5, 0.5);

    // PAGODA (right) & TORII (left) on the mid ridge
    drawPagoda(W*0.84, H*0.70, Math.min(1.1, W/900), '#241636');
    drawTorii(W*0.16, H*0.74, Math.min(W,H)*0.16, '#2a1840');

    // CHERRY TREES silhouettes
    drawCherryTree(W*0.08, H*0.82, Math.min(1.3, W/800), '#1c1030');
    drawCherryTree(W*0.93, H*0.85, Math.min(1.1, W/800), '#1c1030');

    // FOREGROUND hill (near-black)
    ridge(H*0.86, 40, '#0e0820', 8.0, 0.35);

    // LONE SAMURAI on the hill
    drawSamurai(W*0.5, H*0.93, Math.min(1.25, W/1000), '#080414');

    // SHADOW NINJAS lurking in the hills (glowing red eyes)
    drawShadowNinja(W*0.22, H*0.90, Math.min(0.85, W/1400), 'rgba(6,3,14,0.92)', 0);
    drawShadowNinja(W*0.78, H*0.91, Math.min(0.75, W/1400), 'rgba(6,3,14,0.9)', 2.1);
    drawShadowNinja(W*0.64, H*0.81, Math.min(0.5,  W/1700), 'rgba(10,6,20,0.8)', 4.3);

    // FOG drifting low
    ctx.save();
    for (let i = 0; i < 3; i++) {
      const fy = H*(0.80 + i*0.05);
      const off = (T*0.5*(i+1)) % (W+500) - 250;
      ctx.globalAlpha = 0.08;
      const fg = ctx.createLinearGradient(0, fy-30, 0, fy+30);
      fg.addColorStop(0,'transparent'); fg.addColorStop(0.5,'#d9b8e0'); fg.addColorStop(1,'transparent');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.ellipse(off, fy, 400, 30, 0, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(off - W*0.6, fy, 400, 30, 0, 0, Math.PI*2); ctx.fill();
    }
    ctx.restore();

    // PETALS in front of everything
    petals.forEach(p => { p.tick(); p.draw(); });

    requestAnimationFrame(loop);
  })();
})();


/* ════════════════════════════════════════════════════════════════
   SECTION 3 — AUDIO ENGINE  [Bishal — Slicing Mechanics & Audio]
   ════════════════════════════════════════════════════════════════ */
let AC = null;
let SOUND_ON = true;
let MUSIC_ON = false;

const initAudio = () => {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
};

// Unlock AudioContext on first touch — Chrome autoplay policy
document.body.addEventListener('pointerdown', () => { try { initAudio(); } catch(e){} }, { capture:true, once:true });

// Start login music on first click anywhere on the login screen
document.getElementById('sLogin').addEventListener('click', () => {
  try { startLoginMusic(); } catch(e) {}
}, { capture: true });

/* ══════════════════════════════════════════════════════════
   🎵 NINJA BATTLE MUSIC — Taiko drums + pentatonic melody
   Inspired by Naruto/Shinobi action OST. Press 🎵 to toggle.
   ══════════════════════════════════════════════════════════ */
// A minor pentatonic: A3 C4 D4 E4 G4
const PENTA = [220.00, 261.63, 293.66, 329.63, 392.00];
let bgMusicScheduler = null;
let bgMusicGain = null;

function scheduleMusicBar(t0) {
  if (!bgMusicGain || !AC) return;
  const B = 0.46; // beat duration = 130 BPM

  /* ── TAIKO KICK ── */
  const kick = (t, vol) => {
    try {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(120, t);
      o.frequency.exponentialRampToValueAtTime(40, t + 0.08);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
      // noise body
      const nLen = AC.sampleRate * 0.06;
      const nBuf = AC.createBuffer(1, nLen, AC.sampleRate);
      const nd = nBuf.getChannelData(0);
      for (let i = 0; i < nLen; i++) nd[i] = (Math.random()*2-1)*Math.exp(-i/(nLen*0.15));
      const ns = AC.createBufferSource(); ns.buffer = nBuf;
      const nlp = AC.createBiquadFilter(); nlp.type='lowpass'; nlp.frequency.value = 180;
      const ng = AC.createGain(); ng.gain.setValueAtTime(vol*0.6, t); ng.gain.exponentialRampToValueAtTime(0.001, t+0.06);
      ns.connect(nlp); nlp.connect(ng); ng.connect(bgMusicGain);
      ns.start(t); ns.stop(t+0.08);
      o.connect(g); g.connect(bgMusicGain);
      o.start(t); o.stop(t+0.15);
    } catch(e) {}
  };

  /* ── SNARE CRACK ── */
  const snare = (t) => {
    try {
      const nLen = AC.sampleRate * 0.12;
      const nBuf = AC.createBuffer(1, nLen, AC.sampleRate);
      const nd = nBuf.getChannelData(0);
      for (let i=0; i<nLen; i++) nd[i] = (Math.random()*2-1)*Math.exp(-i/(nLen*0.25));
      const ns = AC.createBufferSource(); ns.buffer = nBuf;
      const hp = AC.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=1800;
      const g = AC.createGain(); g.gain.setValueAtTime(0.28, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.12);
      ns.connect(hp); hp.connect(g); g.connect(bgMusicGain);
      ns.start(t); ns.stop(t+0.15);
    } catch(e) {}
  };

  /* ── HI-HAT tick ── */
  const hihat = (t, vol) => {
    try {
      const nLen = AC.sampleRate * 0.04;
      const nBuf = AC.createBuffer(1, nLen, AC.sampleRate);
      const nd = nBuf.getChannelData(0);
      for (let i=0; i<nLen; i++) nd[i] = (Math.random()*2-1)*Math.exp(-i/(nLen*0.3));
      const ns = AC.createBufferSource(); ns.buffer = nBuf;
      const hp = AC.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=7000;
      const g = AC.createGain(); g.gain.setValueAtTime(vol||0.10, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.04);
      ns.connect(hp); hp.connect(g); g.connect(bgMusicGain);
      ns.start(t); ns.stop(t+0.05);
    } catch(e) {}
  };

  /* ── KOTO pluck ── short bright triangle note */
  const koto = (freq, t, dur, vol) => {
    try {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'triangle';
      o.frequency.setValueAtTime(freq*1.015, t);
      o.frequency.exponentialRampToValueAtTime(freq, t+0.025);
      g.gain.setValueAtTime(vol||0.11, t);
      g.gain.exponentialRampToValueAtTime(0.001, t+dur);
      o.connect(g); g.connect(bgMusicGain);
      o.start(t); o.stop(t+dur+0.04);
    } catch(e) {}
  };

  /* ── SHAKUHACHI flute — held note with vibrato ── */
  const flute = (freq, t, dur, vol) => {
    try {
      const o = AC.createOscillator(), g = AC.createGain();
      o.type = 'sine';
      const vib = AC.createOscillator(), vibG = AC.createGain();
      vib.type='sine'; vib.frequency.value=5.8; vibG.gain.value=4;
      vib.connect(vibG); vibG.connect(o.frequency);
      vib.start(t); vib.stop(t+dur+0.05);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol||0.09, t+0.12);
      g.gain.setValueAtTime(vol||0.09, t+dur-0.15);
      g.gain.linearRampToValueAtTime(0, t+dur);
      const lp = AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=2200;
      o.connect(lp); lp.connect(g); g.connect(bgMusicGain);
      o.start(t); o.stop(t+dur+0.08);
    } catch(e) {}
  };

  // ── 8-beat bar pattern (2 bars × 4 beats) ──
  // DRUMS: kick on 1,3; snare on 2,4; hi-hat every half-beat
  [0,2,4,6].forEach(b => kick(t0+b*B, b===0||b===4 ? 0.55 : 0.38));
  [1,3,5,7].forEach(b => snare(t0+b*B));
  for(let i=0;i<16;i++) hihat(t0+i*B*0.5, i%2===0?0.12:0.07);

  // KOTO melody riff — punchy, rhythmic, like a ninja battle
  // Pattern: A C D E  G E D C  | repeat
  [
    [0,    PENTA[0], 0.32],  // A3
    [0.5,  PENTA[1], 0.25],  // C4
    [1.0,  PENTA[2], 0.35],  // D4
    [1.5,  PENTA[3], 0.30],  // E4
    [2.0,  PENTA[4], 0.40],  // G4 — peak
    [2.75, PENTA[3], 0.28],  // E4
    [3.25, PENTA[2], 0.28],  // D4
    [3.75, PENTA[1], 0.32],  // C4
    // bar 2
    [4.0,  PENTA[0], 0.35],
    [4.5,  PENTA[2], 0.28],
    [5.0,  PENTA[4], 0.40],
    [5.5,  PENTA[3], 0.28],
    [6.0,  PENTA[4], 0.30],
    [6.5,  PENTA[2], 0.25],
    [7.0,  PENTA[3], 0.50],  // held
  ].forEach(([b,f,d]) => koto(f, t0+b*B, d, 0.13));

  // FLUTE counter-melody — long held notes floating above
  flute(PENTA[4]*2, t0,        B*2.5, 0.055); // G5 — high shimmer
  flute(PENTA[3]*2, t0+B*4,   B*2.0, 0.050); // E5
  flute(PENTA[0]*2, t0+B*6.5, B*1.5, 0.045); // A5 — resolve

  // BASS koto — low root notes
  koto(PENTA[0]/2, t0,      B*3.5, 0.06); // A2
  koto(PENTA[2]/2, t0+B*4,  B*3.5, 0.05); // D2
}

function startBgMusic() {
  if (!MUSIC_ON) return;
  stopBgMusic();

  // Play the game theme song directly — no fetch check needed
  const audio = new Audio('Game theme song.mp3');
  audio.loop = true;
  audio.volume = 0.30; // balanced background — not overpowering SFX
  audio.currentTime = 15;
  bgMusicGain = { _audio: audio, _type: 'mp3' };
  audio.play().catch(() => { bgMusicGain = null; startSynthMusic(); });
}

function startSynthMusic() {
  if (!MUSIC_ON) return;
  try {
    initAudio();
    bgMusicGain = AC.createGain();
    bgMusicGain.gain.value = 0.55;
    const comp = AC.createDynamicsCompressor();
    comp.threshold.value = -18; comp.ratio.value = 4;
    bgMusicGain.connect(comp); comp.connect(AC.destination);
    bgMusicGain._type = 'synth';

    const BAR = 8 * 0.46;
    let next = AC.currentTime;
    const loop = () => {
      if (!bgMusicGain) return;
      scheduleMusicBar(next);
      next += BAR;
      bgMusicScheduler = setTimeout(loop, (BAR - 0.5) * 1000);
    };
    loop();
  } catch(e) {}
}

function stopBgMusic() {
  if (bgMusicScheduler) { clearTimeout(bgMusicScheduler); bgMusicScheduler = null; }
  if (bgMusicGain) {
    if (bgMusicGain._type === 'mp3') {
      try { bgMusicGain._audio.pause(); bgMusicGain._audio.currentTime = 0; } catch(e) {}
    } else {
      try { bgMusicGain.disconnect(); } catch(e) {}
    }
    bgMusicGain = null;
  }
}

let loginAudio = null;

function startLoginMusic() {
  if (!loginMusicEnabled) return;
  if (loginAudio && !loginAudio.paused) return;
  if (!loginAudio) {
    loginAudio = new Audio('login music.mp3');
    loginAudio.loop = true;
    loginAudio.volume = 0.35;
    loginAudio.currentTime = 5;
  }
  loginAudio.play().catch(() => {});
}

function stopLoginMusic() {
  if (!loginAudio) return;
  try { loginAudio.pause(); loginAudio.currentTime = 0; } catch(e) {}
  loginAudio = null;
}

function toggleMusic(btn) {
  MUSIC_ON = !MUSIC_ON;
  const label = MUSIC_ON ? '🎵 Music: ON' : '🎵 Music: OFF';
  const op    = MUSIC_ON ? '1' : '0.55';
  [btn, document.getElementById('musicBtn'), document.getElementById('menuMusicBtn')]
    .forEach(b => { if (b) { b.textContent = label; b.style.opacity = op; } });
  if (MUSIC_ON) startBgMusic(); else stopBgMusic();
}

/* ══════════════════════════════════════════════════════════
   ⚔️  SFX — All ninja game sound effects
   ══════════════════════════════════════════════════════════ */

/* ── KATANA SLASH — uses Slash sound effect.mp3, plays 0.4s only on hit ── */
let _slashAudio = null;
try { _slashAudio = new Audio('Slash sound effect.mp3'); _slashAudio.volume = 0.85; } catch(e) {}

const sndSwoosh = () => {
  if (!SOUND_ON) return;
  if (_slashAudio) {
    try {
      _slashAudio.currentTime = 0;
      _slashAudio.play().catch(() => {});
      setTimeout(() => { try { _slashAudio.pause(); _slashAudio.currentTime = 0; } catch(e){} }, 400);
      return;
    } catch(e) {}
  }
  // Fallback synthesized slash if file missing
  try {
    initAudio();
    const t = AC.currentTime;
    const len = AC.sampleRate * 0.22;
    const buf = AC.createBuffer(1, len, AC.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random()*2-1) * Math.sin(Math.PI * i/len);
    const src = AC.createBufferSource(); src.buffer = buf;
    const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2.5;
    bp.frequency.setValueAtTime(300, t);
    bp.frequency.exponentialRampToValueAtTime(3500, t+0.08);
    bp.frequency.exponentialRampToValueAtTime(600, t+0.22);
    const g = AC.createGain(); g.gain.setValueAtTime(0.5, t); g.gain.linearRampToValueAtTime(0, t+0.22);
    src.connect(bp); bp.connect(g); g.connect(AC.destination);
    src.start(t); src.stop(t+0.25);
    const zing = AC.createOscillator(), zg = AC.createGain();
    zing.type = 'sawtooth';
    zing.frequency.setValueAtTime(2200, t+0.03);
    zing.frequency.exponentialRampToValueAtTime(180, t+0.18);
    zg.gain.setValueAtTime(0.18, t+0.03);
    zg.gain.exponentialRampToValueAtTime(0.001, t+0.18);
    const lp = AC.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=4000;
    zing.connect(lp); lp.connect(zg); zg.connect(AC.destination);
    zing.start(t+0.03); zing.stop(t+0.2);
  } catch(e) {}
};

/* ── KATANA SLICE — fruit cut + correct/wrong result ───── */
const sndSlice = (correct) => {
  if (!SOUND_ON) return;
  try {
    initAudio();
    const t = AC.currentTime;

    // SHWING — sharp metallic blade through the air
    const shLen = AC.sampleRate * 0.055;
    const shBuf = AC.createBuffer(1, shLen, AC.sampleRate);
    const shd = shBuf.getChannelData(0);
    for (let i=0; i<shLen; i++) shd[i]=(Math.random()*2-1)*Math.exp(-i/(shLen*0.06));
    const sh = AC.createBufferSource(); sh.buffer = shBuf;
    const shHP = AC.createBiquadFilter(); shHP.type='highpass'; shHP.frequency.value=5500;
    const shG = AC.createGain(); shG.gain.setValueAtTime(1.5,t); shG.gain.linearRampToValueAtTime(0,t+0.055);
    sh.connect(shHP); shHP.connect(shG); shG.connect(AC.destination);
    sh.start(t); sh.stop(t+0.07);

    // Metallic ZING — sawtooth sweep (the blade singing)
    const zing = AC.createOscillator(), zg = AC.createGain();
    zing.type = 'sawtooth';
    zing.frequency.setValueAtTime(3500, t);
    zing.frequency.exponentialRampToValueAtTime(220, t+0.16);
    zg.gain.setValueAtTime(0.22, t); zg.gain.exponentialRampToValueAtTime(0.001, t+0.16);
    const zlp = AC.createBiquadFilter(); zlp.type='lowpass'; zlp.frequency.value=5000;
    zing.connect(zlp); zlp.connect(zg); zg.connect(AC.destination);
    zing.start(t); zing.stop(t+0.18);

    if (correct) {
      // ✅ CORRECT — Anime-style victory: gong BOOM + rising chime
      // Deep gong strike
      const gong = AC.createOscillator(), gg = AC.createGain();
      gong.type='sine'; gong.frequency.value=220;
      gg.gain.setValueAtTime(0.45, t+0.04); gg.gain.exponentialRampToValueAtTime(0.001, t+1.8);
      gong.connect(gg); gg.connect(AC.destination); gong.start(t+0.04); gong.stop(t+1.85);
      // Gong shimmer harmonics
      [[440,0.28],[660,0.14],[880,0.07]].forEach(([f,v])=>{
        const o=AC.createOscillator(),g2=AC.createGain(); o.type='sine'; o.frequency.value=f;
        g2.gain.setValueAtTime(v,t+0.04); g2.gain.exponentialRampToValueAtTime(0.001,t+1.2);
        o.connect(g2); g2.connect(AC.destination); o.start(t+0.04); o.stop(t+1.25);
      });
      // Rising victory chime "ding-ding-DING"
      [[660,0.10,0.22],[880,0.18,0.22],[1108,0.26,0.30]].forEach(([f,dt,vol])=>{
        const o=AC.createOscillator(),g2=AC.createGain(); o.type='sine'; o.frequency.value=f;
        g2.gain.setValueAtTime(vol,t+dt); g2.gain.exponentialRampToValueAtTime(0.001,t+dt+0.5);
        o.connect(g2); g2.connect(AC.destination); o.start(t+dt); o.stop(t+dt+0.55);
      });
    } else {
      // ❌ WRONG — Heavy impact + descending "fail" tone
      // TAIKO BOOM — like getting hit by an enemy
      const boom=AC.createOscillator(), bg2=AC.createGain();
      boom.type='sine';
      boom.frequency.setValueAtTime(100,t+0.01); boom.frequency.exponentialRampToValueAtTime(32,t+0.2);
      bg2.gain.setValueAtTime(0.85,t+0.01); bg2.gain.exponentialRampToValueAtTime(0.001,t+0.22);
      boom.connect(bg2); bg2.connect(AC.destination); boom.start(t+0.01); boom.stop(t+0.25);
      // Impact CRACK (noise burst)
      const cLen=AC.sampleRate*0.05, cBuf=AC.createBuffer(1,cLen,AC.sampleRate), cd=cBuf.getChannelData(0);
      for(let i=0;i<cLen;i++) cd[i]=(Math.random()*2-1)*Math.exp(-i/(cLen*0.2));
      const cs=AC.createBufferSource(); cs.buffer=cBuf;
      const clp=AC.createBiquadFilter(); clp.type='lowpass'; clp.frequency.value=400;
      const cg=AC.createGain(); cg.gain.setValueAtTime(0.7,t); cg.gain.linearRampToValueAtTime(0,t+0.05);
      cs.connect(clp); clp.connect(cg); cg.connect(AC.destination); cs.start(t); cs.stop(t+0.06);
      // Descending "ohh no" tone
      const fail=AC.createOscillator(), fg=AC.createGain();
      fail.type='sawtooth';
      fail.frequency.setValueAtTime(180,t+0.08); fail.frequency.exponentialRampToValueAtTime(60,t+0.6);
      fg.gain.setValueAtTime(0.25,t+0.08); fg.gain.exponentialRampToValueAtTime(0.001,t+0.7);
      const flp=AC.createBiquadFilter(); flp.type='lowpass'; flp.frequency.value=600;
      fail.connect(flp); flp.connect(fg); fg.connect(AC.destination); fail.start(t+0.08); fail.stop(t+0.75);
    }
  } catch(e) {}
};

/* ── TAIKO BATTLE DRUM — game start ───────────────────── */
const sndDrum = () => {
  if (!SOUND_ON) return;
  try {
    initAudio();
    const t = AC.currentTime;
    // Three powerful taiko strikes
    [[0,120,0.85],[0.22,100,0.70],[0.40,85,0.60]].forEach(([dt,freq,vol])=>{
      const o=AC.createOscillator(),g=AC.createGain();
      o.type='sine'; o.frequency.setValueAtTime(freq,t+dt); o.frequency.exponentialRampToValueAtTime(35,t+dt+0.18);
      g.gain.setValueAtTime(vol,t+dt); g.gain.exponentialRampToValueAtTime(0.001,t+dt+0.22);
      o.connect(g); g.connect(AC.destination); o.start(t+dt); o.stop(t+dt+0.25);
      // noise body
      const nLen=AC.sampleRate*0.06, nBuf=AC.createBuffer(1,nLen,AC.sampleRate), nd=nBuf.getChannelData(0);
      for(let i=0;i<nLen;i++) nd[i]=(Math.random()*2-1)*Math.exp(-i/(nLen*0.15));
      const ns=AC.createBufferSource(); ns.buffer=nBuf;
      const nlp=AC.createBiquadFilter(); nlp.type='lowpass'; nlp.frequency.value=200;
      const ng=AC.createGain(); ng.gain.setValueAtTime(vol*0.5,t+dt); ng.gain.exponentialRampToValueAtTime(0.001,t+dt+0.07);
      ns.connect(nlp); nlp.connect(ng); ng.connect(AC.destination); ns.start(t+dt); ns.stop(t+dt+0.08);
    });
  } catch(e) {}
};

/* ── COMBO FANFARE — rapid ascending koto + cymbal crash ─ */
const sndCombo = () => {
  if (!SOUND_ON) return;
  try {
    initAudio();
    const t = AC.currentTime;
    // Fast rising koto notes
    [[220,0],[293.7,0.07],[392,0.14],[523,0.21],[698,0.28]].forEach(([f,dt])=>{
      const o=AC.createOscillator(),g=AC.createGain();
      o.type='triangle'; o.frequency.setValueAtTime(f*1.01,t+dt); o.frequency.exponentialRampToValueAtTime(f,t+dt+0.02);
      g.gain.setValueAtTime(0.25,t+dt); g.gain.exponentialRampToValueAtTime(0.001,t+dt+0.45);
      o.connect(g); g.connect(AC.destination); o.start(t+dt); o.stop(t+dt+0.5);
    });
    // Cymbal crash at the top
    const nLen=AC.sampleRate*0.3, nBuf=AC.createBuffer(1,nLen,AC.sampleRate), nd=nBuf.getChannelData(0);
    for(let i=0;i<nLen;i++) nd[i]=(Math.random()*2-1)*Math.exp(-i/(nLen*0.6));
    const ns=AC.createBufferSource(); ns.buffer=nBuf;
    const nhp=AC.createBiquadFilter(); nhp.type='highpass'; nhp.frequency.value=6000;
    const ng=AC.createGain(); ng.gain.setValueAtTime(0.25,t+0.30); ng.gain.exponentialRampToValueAtTime(0.001,t+0.6);
    ns.connect(nhp); nhp.connect(ng); ng.connect(AC.destination); ns.start(t+0.30); ns.stop(t+0.65);
  } catch(e) {}
};

/* ── UI CLICK — ninja kunai flick sound ─────────────────── */
const sndClick = () => {
  if (!SOUND_ON) return;
  try {
    initAudio();
    const t = AC.currentTime;
    // Sharp metallic kunai flick: quick high ping + low thud
    const ping = AC.createOscillator(), pg = AC.createGain();
    ping.type = 'sine'; ping.frequency.setValueAtTime(1400, t); ping.frequency.exponentialRampToValueAtTime(600, t+0.06);
    pg.gain.setValueAtTime(0.22, t); pg.gain.exponentialRampToValueAtTime(0.001, t+0.08);
    ping.connect(pg); pg.connect(AC.destination); ping.start(t); ping.stop(t+0.09);
    // Low body thud underneath
    const thud = AC.createOscillator(), tg = AC.createGain();
    thud.type = 'sine'; thud.frequency.setValueAtTime(180, t); thud.frequency.exponentialRampToValueAtTime(60, t+0.05);
    tg.gain.setValueAtTime(0.18, t); tg.gain.exponentialRampToValueAtTime(0.001, t+0.06);
    thud.connect(tg); tg.connect(AC.destination); thud.start(t); thud.stop(t+0.07);
  } catch(e) {}
};

/* ── SELECT CHIME — choosing subject/difficulty ────────── */
const sndSelect = () => {
  if (!SOUND_ON) return;
  try {
    initAudio();
    const t = AC.currentTime;
    // Double koto tap — clean and crisp
    [[880,0,0.18],[1174,0.07,0.14]].forEach(([f,dt,vol])=>{
      const o=AC.createOscillator(),g=AC.createGain();
      o.type='triangle'; o.frequency.setValueAtTime(f*1.01,t+dt); o.frequency.exponentialRampToValueAtTime(f,t+dt+0.015);
      g.gain.setValueAtTime(vol,t+dt); g.gain.exponentialRampToValueAtTime(0.001,t+dt+0.22);
      o.connect(g); g.connect(AC.destination); o.start(t+dt); o.stop(t+dt+0.25);
    });
  } catch(e) {}
};


/* ════════════════════════════════════════════════════════════════
   SECTION 4 — USER ACCOUNT SYSTEM
   [Suman — Login & Registration System]
   ════════════════════════════════════════════════════════════════ */
let currentUser = null;
const USERS_KEY = 'ninja_quiz_users_v1';
let userDB = JSON.parse(localStorage.getItem(USERS_KEY) || '{}');

const hashPassword = (s) => {
  let h = 5381;
  for (let i=0;i<s.length;i++) h = ((h<<5)+h) ^ s.charCodeAt(i);
  return 'h' + (h>>>0).toString(36);
};

const saveUsers = () => localStorage.setItem(USERS_KEY, JSON.stringify(userDB));

/* Password strength scorer [Suman] */
/* ── PASSWORD STRENGTH CHECKER [Suman] ──
   Rules: 8+ chars, uppercase, lowercase, number, symbol
   Each rule met = +1 score. Shows live feedback as you type.
─────────────────────────────────────────────────────────── */
const PASSWORD_RULES = [
  { test: p => p.length >= 8,              hint: 'At least 8 characters' },
  { test: p => p.length >= 12,             hint: 'Even better: 12+ characters' },
  { test: p => /[A-Z]/.test(p),            hint: 'One uppercase letter (A-Z)' },
  { test: p => /[a-z]/.test(p),            hint: 'One lowercase letter (a-z)' },
  { test: p => /[0-9]/.test(p),            hint: 'One number (0-9)' },
  { test: p => /[^A-Za-z0-9]/.test(p),     hint: 'One symbol (!@#$%^&*)' },
];

const getPasswordStrength = (pass) => {
  if (!pass || pass.length < 8) {
    const missing = PASSWORD_RULES.filter(r => !r.test(pass)).map(r => r.hint);
    return { level: 0, label: '⚠️ Too short — min 8 characters', color: '#ef4444', missing };
  }
  const score = PASSWORD_RULES.filter(r => r.test(pass)).length;
  const missing = PASSWORD_RULES.filter(r => !r.test(pass)).map(r => r.hint);
  if (score <= 3) return { level: 1, label: '🔴 Weak — add uppercase, numbers & symbols', color: '#ef4444', missing };
  if (score <= 4) return { level: 2, label: '🟠 Fair — almost there!',                    color: '#f97316', missing };
  if (score <= 5) return { level: 3, label: '🟡 Medium — good, add more variety',          color: '#f59e0b', missing };
  return                  { level: 4, label: '🟢 Strong — ninja-approved! ⚔️',             color: '#22c55e', missing: [] };
};

const registerUser = (username, password) => {
  if (!username || username.length < 3)    return { field:'user', msg:'Ninja name must be at least 3 characters' };
  if (username.length > 15)                return { field:'user', msg:'Maximum 15 characters allowed' };
  if (!/^[a-zA-Z0-9_]+$/.test(username))  return { field:'user', msg:'Letters, numbers and underscores only' };
  if (!password || password.length < 8)   return { field:'pass', msg:'Password must be at least 8 characters' };
  if (!/[A-Z]/.test(password))            return { field:'pass', msg:'Password needs at least one UPPERCASE letter' };
  if (!/[0-9]/.test(password))            return { field:'pass', msg:'Password needs at least one number (0-9)' };
  if (!/[^A-Za-z0-9]/.test(password))     return { field:'pass', msg:'Password needs at least one symbol (!@#$%)' };
  const key = username.toLowerCase();
  if (userDB[key]) return { field:'user', msg:'That ninja name is already taken!' };
  userDB[key] = { hash: hashPassword(password), display: username, createdAt: Date.now() };
  saveUsers();
  return { ok: true };
};

const loginUser = (username, password) => {
  const key = username.toLowerCase();
  // Generic error — don't reveal whether username or password is wrong (security best practice)
  const fail = { field:'pass', msg:'❌ Incorrect ninja name or secret code' };
  if (!userDB[key]) return fail;
  if (userDB[key].hash !== hashPassword(password)) return fail;
  currentUser = userDB[key].display || username;
  return { ok: true };
};


/* ════════════════════════════════════════════════════════════════
   SECTION 5 — QUESTION BANK
   [Kishor — Question System & Timer]
   ════════════════════════════════════════════════════════════════ */
const QUESTIONS = {
  Math: {
    easy: [
      { t:"🧮 15 × 4 = ?",                    o:["60","55","65","70"],     c:0 },
      { t:"🧮 144 ÷ 12 = ?",                  o:["11","12","13","14"],     c:1 },
      { t:"🧮 25% of 80 = ?",                 o:["15","20","25","30"],     c:1 },
      { t:"🧮 What is 7²?",                   o:["42","47","49","56"],     c:2 },
      { t:"🧮 Round 4.67 to nearest whole.",  o:["4","5","6","7"],         c:1 },
      { t:"🧮 Perimeter of square, side 6?",  o:["12","18","24","36"],     c:2 },
      { t:"🧮 3/4 as a decimal?",             o:["0.34","0.50","0.75","0.80"], c:2 },
      { t:"🧮 50% of 150 = ?",                o:["50","70","75","80"],     c:2 },
      { t:"🧮 Sides on a hexagon?",           o:["5","6","7","8"],         c:1 },
      { t:"🧮 8 × 9 = ?",                     o:["63","71","72","81"],     c:2 },
      { t:"🧮 √81 = ?",                       o:["7","8","9","10"],        c:2 },
      { t:"🧮 1000 − 367 = ?",                o:["623","633","643","653"], c:1 },
      { t:"🧮 0.5 × 0.5 = ?",                 o:["0.10","0.25","0.50","1.00"], c:1 },
      { t:"🧮 Area of rectangle 8 × 5?",      o:["26","30","40","45"],     c:2 },
      { t:"🧮 2³ = ?",                        o:["6","8","9","12"],        c:1 }
    ],
    medium: [
      { t:"📐 Solve: 5x − 3 = 22",            o:["x=4","x=5","x=6","x=7"], c:1 },
      { t:"📐 15% of 200 = ?",                o:["20","25","30","35"],     c:2 },
      { t:"📐 Triangle: 60°,80°. Third?",     o:["30°","40°","50°","60°"], c:1 },
      { t:"📐 LCM of 4 and 6?",               o:["8","10","12","24"],      c:2 },
      { t:"📐 Simplify: 3(2x + 4)",           o:["5x+4","6x+7","6x+12","6x+4"], c:2 },
      { t:"📐 HCF of 18 and 24?",             o:["3","4","6","9"],         c:2 },
      { t:"📐 y=3x−1, when x=4, y=?",         o:["10","11","12","13"],     c:1 },
      { t:"📐 2/5 + 1/3 = ?",                 o:["3/8","11/15","3/15","7/15"], c:1 },
      { t:"📐 Car 120km in 2 hrs. Speed?",    o:["50km/h","55km/h","60km/h","65km/h"], c:2 },
      { t:"📐 3⁴ = ?",                        o:["12","27","64","81"],     c:3 },
      { t:"📐 40% of 250 = ?",                o:["80","90","100","110"],   c:2 },
      { t:"📐 Solve: 2x + 7 = 19",            o:["x=5","x=6","x=7","x=8"], c:1 },
      { t:"📐 √144 = ?",                      o:["10","11","12","14"],     c:2 },
      { t:"📐 Mean of 4,7,8,9,12?",           o:["7","8","9","10"],        c:1 },
      { t:"📐 £80 reduced 25%. New price?",   o:["£55","£60","£65","£70"], c:1 }
    ],
    hard: [
      { t:"📏 Solve: x² − 5x + 6 = 0",        o:["x=1,6","x=2,3","x=−2,−3","x=3,4"], c:1 },
      { t:"📏 log₂(64) = ?",                  o:["4","5","6","7"],         c:2 },
      { t:"📏 sin(90°) = ?",                  o:["0","0.5","1","√2/2"],    c:2 },
      { t:"📏 nth term of 3,7,11,15...?",     o:["2n+1","3n+1","4n−1","4n+1"], c:2 },
      { t:"📏 Pentagon interior angles sum?", o:["360°","450°","540°","720°"], c:2 },
      { t:"📏 Differentiate y = 3x²",         o:["3x","6x","3x²","6x²"],   c:1 },
      { t:"📏 Solve: x+y=5, x−y=1",           o:["x=2,y=3","x=3,y=2","x=4,y=1","x=1,y=4"], c:1 },
      { t:"📏 2⁸ = ?",                        o:["128","256","512","1024"], c:1 },
      { t:"📏 P(rolling 6 twice)?",           o:["1/12","1/18","1/36","1/6"], c:2 },
      { t:"📏 Gradient of y = 2x + 5?",       o:["1","2","5","7"],         c:1 },
      { t:"📏 5! (factorial) = ?",            o:["25","60","100","120"],   c:3 },
      { t:"📏 tan(45°) = ?",                  o:["0","0.5","1","√3"],      c:2 },
      { t:"📏 Pythagoras: 3 and 4, hyp?",     o:["5","6","7","8"],         c:0 },
      { t:"📏 Expand (x+3)²",                 o:["x²+3","x²+6x+9","x²+9","x²+3x+9"], c:1 },
      { t:"📏 Median of 2,5,7,9,11,14,15?",   o:["7","8","9","10"],        c:2 }
    ]
  },
  Cyber: {
    easy: [
      { t:"🔐 What does 2FA stand for?",       o:["Two-File Access","Two-Factor Authentication","Two-Form Activation","Two-Function App"], c:1 },
      { t:"🔐 Safest password example?",       o:["password","123456","qwerty","K9$pLm#42q!"], c:3 },
      { t:"🔐 What is phishing?",              o:["A type of game","Fake message to steal info","A fishing app","A computer brand"], c:1 },
      { t:"🔐 What does HTTPS mean?",          o:["Secure HTTP","Hyper Text","Home Tab","Hosted Page"], c:0 },
      { t:"🔐 Should you share passwords?",    o:["Yes always","Only with friends","Never","Only on phone"], c:2 },
      { t:"🔐 What is a firewall?",            o:["A fire alarm","A network security barrier","A type of virus","A USB device"], c:1 },
      { t:"🔐 Malware means?",                 o:["Mail software","Malicious software","Mall website","Many wires"], c:1 },
      { t:"🔐 What is a VPN?",                 o:["Virtual Private Network","Very Personal Note","Video Plus Net","Visual Page Number"], c:0 },
      { t:"🔐 Antivirus protects against?",    o:["Viruses & malware","Spam emails only","Loud noises","Slow internet"], c:0 },
      { t:"🔐 What is ransomware?",            o:["Free software","Locks files for ransom","A safe browser","Email filter"], c:1 },
      { t:"🔐 Strongest password type?",       o:["Your name","Birthday","Mix of letters/numbers/symbols","All lowercase"], c:2 },
      { t:"🔐 Safe Wi-Fi to use for banking?", o:["Free café Wi-Fi","Airport public Wi-Fi","Your secured home Wi-Fi","Random open networks"], c:2 },
      { t:"🔐 What is a cookie (web)?",        o:["A snack","Small data file in browser","A virus","A game"], c:1 },
      { t:"🔐 Should you click unknown links?", o:["Always","Sometimes","Never","Only on phone"], c:2 },
      { t:"🔐 What does 'spam' mean?",         o:["Useful email","Unwanted/junk email","Important alert","Login info"], c:1 }
    ],
    medium: [
      { t:"🛡️ What is social engineering?",     o:["Building websites","Manipulating people for info","Coding skill","Hardware design"], c:1 },
      { t:"🛡️ DDoS attack means?",              o:["Direct Data Storage","Distributed Denial of Service","Digital Data Order","Domain Deletion"], c:1 },
      { t:"🛡️ Best protection against phishing?", o:["Click everything","Verify sender carefully","Reply quickly","Open attachments"], c:1 },
      { t:"🛡️ What is encryption?",             o:["Deleting data","Scrambling data so only authorised can read","Sharing data","Storing data"], c:1 },
      { t:"🛡️ A 'zero-day' is?",                o:["Free trial","Unknown vulnerability","Old software","First day password"], c:1 },
      { t:"🛡️ SQL injection attacks?",          o:["Networks","Databases","Hardware","Printers"], c:1 },
      { t:"🛡️ Safest backup strategy?",         o:["Cloud only","USB only","3-2-1 backup rule","No backups needed"], c:2 },
      { t:"🛡️ What is a Trojan horse?",         o:["A type of CPU","Malware disguised as legit software","An old computer","Anti-virus tool"], c:1 },
      { t:"🛡️ Multi-factor authentication adds?", o:["Speed","Extra security layers","Battery life","Storage space"], c:1 },
      { t:"🛡️ What does GDPR protect?",         o:["Computer hardware","Personal data of EU/UK citizens","Software licences","Wi-Fi networks"], c:1 },
      { t:"🛡️ A keylogger records?",            o:["Keys typed on keyboard","Door access","Computer temperature","Screen brightness"], c:0 },
      { t:"🛡️ Spyware does what?",              o:["Speeds up PC","Secretly monitors activity","Cleans files","Plays music"], c:1 },
      { t:"🛡️ Public Wi-Fi best practice?",     o:["Bank freely","Use a VPN","Save passwords","Disable antivirus"], c:1 },
      { t:"🛡️ Patching software helps?",        o:["Slow it down","Fix security holes","Add ads","Use more battery"], c:1 },
      { t:"🛡️ What is a brute-force attack?",   o:["Trying many passwords","Hacking with magnets","Stealing hardware","Disabling Wi-Fi"], c:0 }
    ],
    hard: [
      { t:"⚖️ UK Computer Misuse Act year?",     o:["1985","1990","1998","2005"], c:1 },
      { t:"⚖️ What is the CIA Triad?",          o:["Confidentiality, Integrity, Availability","Code, Internet, Access","CPU Identity App","None"], c:0 },
      { t:"⚖️ A 'pen test' is?",                 o:["Ink test","Penetration test","Pen-and-paper","Performance test"], c:1 },
      { t:"⚖️ Symmetric encryption uses?",      o:["1 key","2 keys","No key","Many keys"], c:0 },
      { t:"⚖️ Asymmetric encryption uses?",     o:["1 key","Public + private key pair","No keys","Same key twice"], c:1 },
      { t:"⚖️ Hashing is used for?",            o:["Encryption","Verifying integrity","Compression","Backups"], c:1 },
      { t:"⚖️ MITM stands for?",                 o:["Man-In-The-Middle","Most Important Tech Manager","Multi-Internet Test Mode","Master IT Method"], c:0 },
      { t:"⚖️ XSS is?",                          o:["Excel Spreadsheet","Cross-Site Scripting","Extra Secure System","X-System Server"], c:1 },
      { t:"⚖️ ISO 27001 relates to?",           o:["Gaming","Information security mgmt","Robotics","Web design"], c:1 },
      { t:"⚖️ A botnet is?",                    o:["Network of infected devices","Robot company","Bot competition","Web framework"], c:0 },
      { t:"⚖️ NIST is based in?",                o:["UK","USA","Germany","Japan"], c:1 },
      { t:"⚖️ A 'honeypot' is?",                o:["Sweet trap to attract attackers","Storage device","CPU type","Programming language"], c:0 },
      { t:"⚖️ SSL has been replaced by?",        o:["TLS","HTTP","FTP","SSH"], c:0 },
      { t:"⚖️ Principle of 'least privilege'?", o:["Give all access","Give minimum needed access","Random access","Open access"], c:1 },
      { t:"⚖️ A 'rootkit' allows attacker to?", o:["Charge phone","Gain admin-level hidden access","Browse faster","Save data"], c:1 }
    ]
  },
  Science: {
    easy: [
      { t:"🔬 H₂O is ___",                    o:["Salt","Water","Oxygen","Air"], c:1 },
      { t:"🔬 Planet closest to the Sun?",    o:["Venus","Mercury","Earth","Mars"], c:1 },
      { t:"🔬 Adult human bones?",            o:["186","206","226","246"], c:1 },
      { t:"🔬 Gas plants breathe in?",        o:["Oxygen","Nitrogen","CO₂","Helium"], c:2 },
      { t:"🔬 Largest organ in human body?",  o:["Heart","Brain","Skin","Liver"], c:2 },
      { t:"🔬 What does the heart pump?",     o:["Air","Water","Blood","Food"], c:2 },
      { t:"🔬 Speed of light is ~ ___",       o:["300 km/s","30,000 km/s","300,000 km/s","3 km/s"], c:2 },
      { t:"🔬 Animals that lay eggs are ___", o:["mammals","oviparous","carnivores","herbivores"], c:1 },
      { t:"🔬 The Sun is a ___",              o:["planet","star","moon","comet"], c:1 },
      { t:"🔬 Water boils at sea level ___",  o:["50°C","75°C","100°C","150°C"], c:2 },
      { t:"🔬 Chemical symbol for gold?",     o:["Go","Gd","Au","Ag"], c:2 },
      { t:"🔬 Planets in our solar system?",  o:["7","8","9","10"], c:1 },
      { t:"🔬 What gas do humans breathe out?", o:["Oxygen","Nitrogen","CO₂","Helium"], c:2 },
      { t:"🔬 What organ filters blood?",     o:["Lungs","Liver","Heart","Kidneys"], c:3 },
      { t:"🔬 The largest ocean?",            o:["Atlantic","Indian","Pacific","Arctic"], c:2 }
    ],
    medium: [
      { t:"⚗️ Chemical symbol for sodium?",    o:["S","So","Na","Sd"], c:2 },
      { t:"⚗️ DNA shape is a ___",             o:["spiral","square","double helix","ring"], c:2 },
      { t:"⚗️ Newton's 1st law of ___",        o:["gravity","motion","heat","light"], c:1 },
      { t:"⚗️ Chambers in human heart?",       o:["2","3","4","5"], c:2 },
      { t:"⚗️ pH of pure water?",              o:["1","7","10","14"], c:1 },
      { t:"⚗️ Hardest natural substance?",     o:["Gold","Iron","Diamond","Quartz"], c:2 },
      { t:"⚗️ Bones in a baby?",               o:["206","270","300","350"], c:1 },
      { t:"⚗️ Powerhouse of the cell?",        o:["Nucleus","Ribosome","Mitochondria","Vacuole"], c:2 },
      { t:"⚗️ Atomic number of oxygen?",       o:["6","7","8","9"], c:2 },
      { t:"⚗️ Force pulling to Earth?",        o:["Friction","Gravity","Magnetism","Inertia"], c:1 },
      { t:"⚗️ Largest planet?",                o:["Saturn","Jupiter","Neptune","Uranus"], c:1 },
      { t:"⚗️ Plants make food from light by?", o:["respiration","photosynthesis","digestion","osmosis"], c:1 },
      { t:"⚗️ Speed of sound in air?",         o:["~343 m/s","~1000 m/s","~50 m/s","~5000 m/s"], c:0 },
      { t:"⚗️ Most abundant atmospheric gas?", o:["Oxygen","Nitrogen","Argon","CO₂"], c:1 },
      { t:"⚗️ Symbol for iron?",               o:["I","Ir","Fe","Fr"], c:2 }
    ],
    hard: [
      { t:"🧪 E = mc^?",                      o:["1","2","3","4"], c:1 },
      { t:"🧪 Liquid to gas process?",        o:["melting","evaporation","condensation","freezing"], c:1 },
      { t:"🧪 Speed of light in vacuum ≈?",   o:["3×10⁵ km/s","3×10⁸ m/s","3×10⁶ m/s","3×10¹⁰ m/s"], c:1 },
      { t:"🧪 SI unit of force?",             o:["Joule","Watt","Newton","Pascal"], c:2 },
      { t:"🧪 Particle with no charge?",      o:["Electron","Proton","Neutron","Photon"], c:2 },
      { t:"🧪 Mendel is the father of ___",   o:["evolution","genetics","biology","chemistry"], c:1 },
      { t:"🧪 Elements in periodic table?",   o:["100","108","118","126"], c:2 },
      { t:"🧪 Frequency unit?",               o:["Volt","Watt","Hertz","Ampere"], c:2 },
      { t:"🧪 What does CPU stand for?",      o:["Central Processing Unit","Computer Personal Use","Control Power Unit","Central Power Unit"], c:0 },
      { t:"🧪 Universe is currently?",        o:["shrinking","stable","expanding","oscillating"], c:2 },
      { t:"🧪 'Theory of Relativity' by?",    o:["Newton","Einstein","Hawking","Galileo"], c:1 },
      { t:"🧪 Galaxy we live in?",            o:["Andromeda","Milky Way","Triangulum","Sombrero"], c:1 },
      { t:"🧪 Gravity on Earth ≈?",           o:["8.8 m/s²","9.8 m/s²","10.8 m/s²","11.8 m/s²"], c:1 },
      { t:"🧪 Symbol for potassium?",         o:["P","Pt","K","Po"], c:2 },
      { t:"🧪 Smallest unit of life?",        o:["atom","molecule","cell","organism"], c:2 }
    ]
  },
  GK: {
    easy: [
      { t:"🌍 Capital of UK?",                o:["Manchester","London","Edinburgh","Liverpool"], c:1 },
      { t:"🌍 Colours in a rainbow?",         o:["5","6","7","8"], c:2 },
      { t:"🌍 Largest ocean?",                o:["Atlantic","Indian","Arctic","Pacific"], c:3 },
      { t:"🌍 Football team players?",        o:["9","10","11","12"], c:2 },
      { t:"🌍 Currency of Japan?",            o:["Yuan","Won","Yen","Baht"], c:2 },
      { t:"🌍 Author of Harry Potter?",       o:["Tolkien","J.K. Rowling","C.S. Lewis","Roald Dahl"], c:1 },
      { t:"🌍 Smallest country?",             o:["Monaco","San Marino","Vatican City","Liechtenstein"], c:2 },
      { t:"🌍 Capital of France?",            o:["Lyon","Marseille","Paris","Nice"], c:2 },
      { t:"🌍 Largest planet?",               o:["Saturn","Uranus","Neptune","Jupiter"], c:3 },
      { t:"🌍 National animal of England?",   o:["Bear","Eagle","Lion","Dragon"], c:2 },
      { t:"🌍 Days in a leap year?",          o:["364","365","366","367"], c:2 },
      { t:"🌍 Most spoken language?",         o:["Spanish","English","Mandarin","Hindi"], c:2 },
      { t:"🌍 UK is on which continent?",     o:["Asia","Europe","Africa","Oceania"], c:1 },
      { t:"🌍 Capital of USA?",               o:["New York","Washington DC","Los Angeles","Boston"], c:1 },
      { t:"🌍 How many continents?",          o:["5","6","7","8"], c:2 }
    ],
    medium: [
      { t:"🏆 Who painted the Mona Lisa?",    o:["Michelangelo","Raphael","Leonardo da Vinci","Caravaggio"], c:2 },
      { t:"🏆 Year WWII ended?",              o:["1943","1944","1945","1946"], c:2 },
      { t:"🏆 Who invented the telephone?",   o:["Edison","Tesla","Marconi","Bell"], c:3 },
      { t:"🏆 Capital of Canada?",            o:["Toronto","Vancouver","Montreal","Ottawa"], c:3 },
      { t:"🏆 Chemical symbol 'K' is?",       o:["Krypton","Potassium","Calcium","Cobalt"], c:1 },
      { t:"🏆 'Romeo and Juliet' by?",        o:["Chaucer","Marlowe","Shakespeare","Dickens"], c:2 },
      { t:"🏆 Year Titanic sank?",            o:["1910","1912","1914","1916"], c:1 },
      { t:"🏆 First person on the Moon?",     o:["Buzz Aldrin","Yuri Gagarin","Neil Armstrong","John Glenn"], c:2 },
      { t:"🏆 Capital of Brazil?",            o:["Rio de Janeiro","São Paulo","Brasília","Salvador"], c:2 },
      { t:"🏆 Diamond is made of?",           o:["Silicon","Carbon","Nitrogen","Boron"], c:1 },
      { t:"🏆 Sport at Wimbledon?",           o:["Cricket","Golf","Tennis","Badminton"], c:2 },
      { t:"🏆 Largest population country?",   o:["USA","India","China","Russia"], c:1 },
      { t:"🏆 Who invented WWW?",             o:["Bill Gates","Steve Jobs","Tim Berners-Lee","Vint Cerf"], c:2 },
      { t:"🏆 Most abundant atm. gas?",       o:["Oxygen","CO₂","Argon","Nitrogen"], c:3 },
      { t:"🏆 2012 Olympics hosted by?",      o:["USA","France","UK","Australia"], c:2 }
    ],
    hard: [
      { t:"📜 Who wrote 'The Iliad'?",        o:["Virgil","Socrates","Homer","Plato"], c:2 },
      { t:"📜 Largest empire by land?",       o:["Roman","Mongol","British","Ottoman"], c:1 },
      { t:"📜 First artificial satellite?",   o:["Vostok 1","Explorer 1","Sputnik 1","Luna 1"], c:2 },
      { t:"📜 General relativity by?",        o:["Newton","Bohr","Einstein","Planck"], c:2 },
      { t:"📜 Magna Carta signed in?",        o:["1066","1215","1348","1415"], c:1 },
      { t:"📜 Author of 'The Republic'?",     o:["Aristotle","Socrates","Plato","Epicurus"], c:2 },
      { t:"📜 UN headquarters in?",           o:["Washington DC","Geneva","New York","Vienna"], c:2 },
      { t:"📜 China-Mediterranean trade route?", o:["Amber Route","Spice Road","Silk Road","Incense Trail"], c:2 },
      { t:"📜 Country that invented paper?",  o:["Egypt","Mesopotamia","China","India"], c:2 },
      { t:"📜 WWW publicly launched in?",     o:["1985","1989","1991","1995"], c:2 },
      { t:"📜 Nelson Mandela's party?",       o:["SWAPO","ANC","ZANU-PF","PAC"], c:1 },
      { t:"📜 First country women's vote?",   o:["UK","USA","Australia","New Zealand"], c:3 },
      { t:"📜 Berlin Wall fell in?",          o:["1987","1988","1989","1990"], c:2 },
      { t:"📜 Last pharaoh of Egypt?",        o:["Nefertiti","Ramesses III","Cleopatra VII","Tutankhamun"], c:2 },
      { t:"📜 UN founded in?",                o:["1919","1939","1945","1951"], c:2 }
    ]
  }
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};


/* ════════════════════════════════════════════════════════════════
   SECTION 6 — FRUIT & PARTICLE CLASSES
   [Bishal — Slicing Mechanics & Visual Effects]
   ════════════════════════════════════════════════════════════════ */
// SHURIKEN COLOURS — metallic ninja throwing star palette
const FRUIT_COLORS = [
  { main:'#c0392b', dark:'#4a0000', glow:'rgba(220,50,50,0.9)',  edge:'#ff6b6b' },  // blood red
  { main:'#e67e22', dark:'#7a3000', glow:'rgba(230,120,30,0.9)', edge:'#ffaa55' },  // orange fire
  { main:'#27ae60', dark:'#0a3d1f', glow:'rgba(40,180,90,0.9)',  edge:'#55dd88' },  // poison green
  { main:'#8e44ad', dark:'#2e0050', glow:'rgba(140,50,200,0.9)', edge:'#cc66ff' },  // shadow purple
];

class Fruit {
  constructor(text, idx, canvasW, canvasH) {
    this.text = text; this.idx = idx;
    this.cw = canvasW; this.ch = canvasH;
    this.color = FRUIT_COLORS[idx % FRUIT_COLORS.length];
    this.r = 72; // bigger shuriken — easier to read answer text
    this.sliced = false; this.split = 0; this.sAngle = 0; this.pulse = 0;
    this.launch();
  }
  launch() {
    const gap = this.cw / 5;
    this.x = gap*(this.idx+1) + (Math.random()*20 - 10);
    this.y = this.ch + 70;
    // Slow gentle arc. Peak height computed from canvas so fruits rise to
    // the middle area only — NEVER up into the question box at the top.
    this.g  = 0.025;                                  // soft gravity = slow float
    const peak = this.ch * (0.72 + Math.random()*0.10); // rise to 72-82% of canvas height
    this.vy = -Math.sqrt(2 * this.g * peak);
    this.vx = (Math.random()*0.6 - 0.3);
    this.rot = Math.random() * Math.PI*2;
    this.rv  = (Math.random() > 0.5 ? 1 : -1) * (0.035 + Math.random()*0.04); // fast ninja spin!
    this.ceil = 160;                                  // hard ceiling just below HUD
  }
  tick() {
    this.pulse += 0.05;
    if (!this.sliced) {
      this.x += this.vx; this.y += this.vy; this.vy += this.g; this.rot += this.rv;
      // soft ceiling — bounce fruit back down before it reaches the question box
      if (this.y < this.ceil && this.vy < 0) { this.y = this.ceil; this.vy = 0.4; }
      if (this.x < this.r) { this.x = this.r; this.vx = Math.abs(this.vx)*0.5; }
      if (this.x > this.cw - this.r) { this.x = this.cw - this.r; this.vx = -Math.abs(this.vx)*0.5; }
      if (this.y > this.ch + 120) this.launch(); // relaunch when fully off bottom
    } else {
      this.split += 3.5; this.vy += this.g*2.5;
      this.y += this.vy; this.x += this.vx;
    }
  }
  // Helper: draw a 4-pointed shuriken star path
  _shurikenPath(ctx, outerR, innerR) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (i * Math.PI / 4) - Math.PI / 8;
      if (i === 0) ctx.moveTo(r * Math.cos(angle), r * Math.sin(angle));
      else         ctx.lineTo(r * Math.cos(angle), r * Math.sin(angle));
    }
    ctx.closePath();
  }

  draw(ctx) {
    ctx.save();
    if (!this.sliced) {
      ctx.translate(this.x, this.y);

      // ── Glow aura ──
      ctx.shadowColor = this.color.glow;
      ctx.shadowBlur  = 20 + Math.sin(this.pulse) * 7;

      // ── Spinning shuriken ──
      ctx.rotate(this.rot);
      this._shurikenPath(ctx, this.r, this.r * 0.38);

      // Metallic gradient — silver highlight → colour → dark
      const mg = ctx.createLinearGradient(-this.r, -this.r, this.r, this.r);
      mg.addColorStop(0,   '#d0d0e0');
      mg.addColorStop(0.25, this.color.main);
      mg.addColorStop(0.65, this.color.dark);
      mg.addColorStop(1,   '#0a0510');
      ctx.fillStyle = mg;
      ctx.fill();

      // Blade edges — thin bright outline
      ctx.strokeStyle = this.color.edge;
      ctx.lineWidth   = 1.4;
      ctx.shadowBlur  = 6;
      ctx.stroke();

      // ── Center hub disc ──
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(0, 0, this.r * 0.30, 0, Math.PI * 2);
      const cg = ctx.createRadialGradient(-4, -4, 1, 0, 0, this.r * 0.30);
      cg.addColorStop(0, this.color.main);
      cg.addColorStop(1, this.color.dark);
      ctx.fillStyle = cg;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Tiny center hole
      ctx.beginPath();
      ctx.arc(0, 0, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#050210';
      ctx.fill();

      // ── UN-ROTATE → draw text upright ──
      ctx.rotate(-this.rot);
      ctx.shadowColor = 'rgba(0,0,0,0.95)';
      ctx.shadowBlur  = 7;
      ctx.fillStyle   = '#ffffff';
      ctx.font        = "bold 13px 'Nunito', Arial";
      ctx.textAlign   = 'center';
      ctx.textBaseline = 'middle';
      this._wrapText(ctx, this.text, 0, 0, this.r * 1.55, 15);

    } else {
      // ── SLICED — two halves split apart, tumbling ──
      [true, false].forEach(left => {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.sAngle);
        ctx.translate(left ? -this.split : this.split, 0);

        // clip to left or right half
        ctx.beginPath();
        ctx.rect(left ? -this.r * 2.5 : 0, -this.r * 2, this.r * 2.5, this.r * 4);
        ctx.clip();

        // draw the full shuriken shape (clipped to half)
        ctx.rotate(this.rot + this.split * 0.04 * (left ? 1 : -1));
        this._shurikenPath(ctx, this.r, this.r * 0.38);
        const sg = ctx.createLinearGradient(-this.r, -this.r, this.r, this.r);
        sg.addColorStop(0, '#ffe0e0');
        sg.addColorStop(0.4, this.color.main);
        sg.addColorStop(1, this.color.dark);
        ctx.fillStyle = sg;
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.4)';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.restore();
      });
    }
    ctx.restore();
  }
  _wrapText(ctx, txt, x, y, maxW, lh) {
    const words = txt.split(' ');
    let line = '', lines = [];
    words.forEach((w, n) => {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxW && n > 0) { lines.push(line); line = w + ' '; }
      else line = test;
    });
    lines.push(line);
    const sy = y - ((lines.length-1)*lh)/2;
    lines.forEach((l, i) => ctx.fillText(l.trim(), x, sy + i*lh));
  }
  hit(p1, p2) {
    if (this.sliced) return false;
    const A = p1.x - p2.x, B = p1.y - p2.y;
    const len = Math.sqrt(A*A + B*B);
    if (len < 2) return false;
    const dot = ((this.x-p1.x)*(p2.x-p1.x) + (this.y-p1.y)*(p2.y-p1.y)) / (len*len);
    let cx = p1.x + dot*(p2.x-p1.x), cy = p1.y + dot*(p2.y-p1.y);
    if (dot < 0) { cx = p1.x; cy = p1.y; }
    if (dot > 1) { cx = p2.x; cy = p2.y; }
    if (Math.sqrt((this.x-cx)**2 + (this.y-cy)**2) <= this.r) {
      this.sliced = true;
      this.sAngle = Math.atan2(p2.y-p1.y, p2.x-p1.x);
      this.vy = -3;
      return true;
    }
    return false;
  }
}

class Juice {
  constructor(x, y, color) {
    this.x = x; this.y = y; this.color = color;
    this.r = 5 + Math.random()*16;
    this.vx = (Math.random()-0.5)*9;
    this.vy = (Math.random()-0.5)*9 - 3;
    this.g = 0.28; this.a = 0.9; this.life = 42;
  }
  tick() { this.x += this.vx; this.y += this.vy; this.vy += this.g; this.a -= 0.022; this.life--; }
  draw(ctx) {
    if (this.a <= 0) return;
    ctx.save(); ctx.globalAlpha = this.a; ctx.fillStyle = this.color;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  }
}


/* ════════════════════════════════════════════════════════════════
   SECTION 7 — GAME ENGINE (canvas + slicing)
   [Bishal — Mechanics & Visuals]
   ════════════════════════════════════════════════════════════════ */
const gameCanvas = document.getElementById('gameCanvas');
const gctx = gameCanvas.getContext('2d');
let GW, GH;
const resizeGame = () => { GW = gameCanvas.width = gameCanvas.offsetWidth; GH = gameCanvas.height = gameCanvas.offsetHeight; };
resizeGame();
new ResizeObserver(resizeGame).observe(gameCanvas);

let fruits = [], juices = [], trail = [], slicing = false, animId = null, timerIv = null;

const game = {
  active: false, subject: 'Math', diff: 'easy',
  qs: [], idx: 0, score: 0, time: 20, wait: false,
  streak: 0, lives: 3, combo: 1
};

function renderLoop() {
  gctx.clearRect(0, 0, GW, GH);
  juices = juices.filter(j => j.life > 0);
  juices.forEach(j => { j.tick(); j.draw(gctx); });
  fruits.forEach(f => { f.tick(); f.draw(gctx); });
  if (trail.length > 1) {
    for (let i = 1; i < trail.length; i++) {
      const t = i / trail.length;
      gctx.save();
      gctx.beginPath();
      gctx.moveTo(trail[i-1].x, trail[i-1].y);
      gctx.lineTo(trail[i].x, trail[i].y);
      gctx.strokeStyle = `rgba(180,240,255,${t*0.9})`;
      gctx.lineWidth = t * 10;
      gctx.lineCap = 'round';
      gctx.shadowColor = '#00ddff';
      gctx.shadowBlur = 14;
      gctx.stroke();
      gctx.restore();
    }
  }
  if (!slicing && trail.length > 0) trail.shift();
  animId = requestAnimationFrame(renderLoop);
}

const getPos = (e) => {
  const r = gameCanvas.getBoundingClientRect();
  return { x: e.clientX - r.left, y: e.clientY - r.top };
};

const onPointerDown = (e) => {
  slicing = true;
  const p = getPos(e);
  trail = [{ x: p.x, y: p.y }];
};

const onPointerMove = (e) => {
  if (!slicing) return;
  const p = getPos(e);
  const prev = trail[trail.length - 1];
  trail.push({ x: p.x, y: p.y });
  if (trail.length > 20) trail.shift();
  if (prev && game.active && !game.wait) {
    fruits.forEach(f => { if (f.hit(prev, p)) onHit(f); });
  }
};

const onPointerUp = () => { slicing = false; };

gameCanvas.addEventListener('mousedown', onPointerDown);
gameCanvas.addEventListener('mousemove', onPointerMove);
window.addEventListener('mouseup', onPointerUp);
gameCanvas.addEventListener('touchstart', (e) => { onPointerDown(e.touches[0]); e.preventDefault(); }, { passive: false });
gameCanvas.addEventListener('touchmove',  (e) => { onPointerMove(e.touches[0]); e.preventDefault(); }, { passive: false });
gameCanvas.addEventListener('touchend',   onPointerUp,  { passive: false });

function flashScreen(color) {
  const f = document.getElementById('flashOverlay');
  f.style.transition = 'none';
  f.style.background = color;
  f.style.opacity = '0.45';
  setTimeout(() => { f.style.transition = 'opacity 0.35s'; f.style.opacity = '0'; }, 60);
}

function shakeArea() {
  const a = document.getElementById('gameArea');
  let n = 0;
  const iv = setInterval(() => {
    a.style.transform = `translate(${(Math.random()-0.5)*14}px, ${(Math.random()-0.5)*9}px)`;
    if (++n > 9) { clearInterval(iv); a.style.transform = 'none'; }
  }, 35);
}


/* ════════════════════════════════════════════════════════════════
   SECTION 8 — SCORING & HIT HANDLING
   [Akash — Scoring System & Results]
   ════════════════════════════════════════════════════════════════ */
function onHit(fruit) {
  const q = game.qs[game.idx];
  const ok = fruit.idx === q.c;
  sndSwoosh(); // slash sound ONLY when actually hitting a shuriken
  sndSlice(ok);

  // Juice explosion [Bishal]
  for (let i = 0; i < 18; i++) juices.push(new Juice(fruit.x, fruit.y, fruit.color.main));

  if (ok) {
    flashScreen('rgba(80,220,80,0.35)');
    const pointsEarned = game.combo;
    game.score += pointsEarned;
    game.streak++;
    showScoreFloat(fruit.x, fruit.y, '+' + pointsEarned);

    if      (game.streak === 3) { game.combo = 2; showCombo('2× COMBO! 🔥'); sndCombo(); }
    else if (game.streak === 5) { game.combo = 3; showCombo('3× NINJA! ⚡');  sndCombo(); }
    else if (game.streak === 8) { game.combo = 4; showCombo('4× MASTER! 🌟'); sndCombo(); }

    updateHUD();
    game.wait = true;
    setTimeout(() => {
      game.idx++;
      if (game.idx >= game.qs.length) endVictory();
      else { game.wait = false; launchQuestion(); }
    }, 750);

  } else {
    flashScreen('rgba(255,40,40,0.55)');
    shakeArea();
    game.lives--;
    game.streak = 0;
    game.combo = 1;
    updateHUD();

    if (game.lives <= 0) {
      game.active = false;
      setTimeout(() => { saveScore(); showGameOver(); }, 600);
    } else {
      game.wait = true;
      setTimeout(() => {
        game.idx++;
        if (game.idx >= game.qs.length) endVictory();
        else { game.wait = false; launchQuestion(); }
      }, 900);
    }
  }
}

function showCombo(msg) {
  const el = document.createElement('div');
  el.className = 'combo-popup';
  el.textContent = msg;
  document.getElementById('gameArea').appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function showScoreFloat(x, y, txt) {
  const el = document.createElement('div');
  el.className = 'score-float';
  el.textContent = txt;
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.getElementById('gameArea').appendChild(el);
  setTimeout(() => el.remove(), 900);
}

function updateHUD() {
  const s = document.getElementById('scoreEl');
  if (s) s.textContent = game.score;
  const q = document.getElementById('qNumEl');
  if (q) q.textContent = `Q ${game.idx + 1}/${game.qs.length}`;
  const l = document.getElementById('livesEl');
  if (l) l.innerHTML = [0,1,2].map(i => `<span style="opacity:${i<game.lives?1:0.25}">❤️</span>`).join('');
}


/* ════════════════════════════════════════════════════════════════
   SECTION 9 — QUESTION SYSTEM & TIMER
   [Kishor — Question System & Timer Functionality]
   ════════════════════════════════════════════════════════════════ */
function launchQuestion() {
  if (!game.active) return;
  game.time = 20;
  const q = game.qs[game.idx];
  const qd = document.getElementById('qBox');
  if (qd) qd.textContent = q.t;
  updateHUD();
  const tf = document.getElementById('timerFill');
  if (tf) {
    tf.style.transition = 'none';
    tf.style.width = '100%';
    tf.style.backgroundColor = '#22c55e';
  }
  juices = [];
  fruits = q.o.map((opt, i) => new Fruit(opt, i, GW, GH));
  startTimer();
}

function startTimer() {
  if (timerIv) clearInterval(timerIv);
  timerIv = setInterval(() => {
    if (!game.active || game.wait) return;
    game.time--;
    const pct = game.time / 20;
    const tf = document.getElementById('timerFill');
    if (tf) {
      tf.style.width = (pct*100) + '%';
      tf.style.backgroundColor = pct > 0.5 ? '#22c55e' : pct > 0.25 ? '#f59e0b' : '#ef4444';
    }
    if (game.time <= 0) {
      game.lives--;
      game.streak = 0;
      game.combo = 1;
      flashScreen('rgba(255,140,0,0.45)');
      shakeArea();
      updateHUD();
      if (game.lives <= 0) {
        game.active = false;
        clearInterval(timerIv);
        saveScore();
        setTimeout(showGameOver, 500);
      } else {
        game.time = 20;
        game.idx++;
        if (game.idx >= game.qs.length) endVictory();
        else launchQuestion();
      }
    }
  }, 1000);
}


/* ════════════════════════════════════════════════════════════════
   SECTION 10 — RESULTS, LEADERBOARD & GAME LIFECYCLE
   [Akash — Scoring System & Results Screen]
   ════════════════════════════════════════════════════════════════ */
const LB_KEY = 'ninja_quiz_leaderboard_v1';
let leaderboard = JSON.parse(localStorage.getItem(LB_KEY) || '[]');

function saveScore() {
  if (!currentUser || game.score === 0) return;
  leaderboard.push({
    user: currentUser, score: game.score, total: game.qs.length,
    subject: game.subject, diff: game.diff,
    date: new Date().toLocaleDateString('en-GB')
  });
  leaderboard.sort((a, b) => b.score - a.score);
  leaderboard = leaderboard.slice(0, 15);
  localStorage.setItem(LB_KEY, JSON.stringify(leaderboard));
}

function endVictory() {
  game.active = false;
  if (timerIv) clearInterval(timerIv);
  saveScore();
  const stars = game.score >= game.qs.length ? 3 : game.score >= Math.ceil(game.qs.length*0.7) ? 2 : 1;
  document.getElementById('vScore').textContent = `${game.score} pts`;
  document.getElementById('vStars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3-stars);
  document.getElementById('vMsg').innerHTML =
    `${stars === 3 ? '🏆 Perfect Sensei!' : stars === 2 ? '🌟 Excellent slicing!' : '💪 Keep training, Apprentice!'}` +
    `<br><small>${game.subject} · ${game.diff.toUpperCase()} · Best combo: ${game.combo}×</small>`;
  showScreen('sVictory');
}

function showGameOver() {
  document.getElementById('oScore').textContent = `${game.score} pts`;
  document.getElementById('oMsg').innerHTML =
    `You ran out of lives on Q${game.idx + 1}/${game.qs.length}.<br>Train harder and return, Apprentice! 🥷`;
  showScreen('sOver');
}

function buildLeaderboard() {
  const medals = ['🥇','🥈','🥉'];
  document.getElementById('lbBody').innerHTML = leaderboard.length
    ? leaderboard.map((l, i) =>
        `<tr>
          <td>${medals[i] || (i+1)}</td>
          <td>${l.user}</td>
          <td><b>${l.score}</b> / ${l.total}</td>
          <td>${l.subject}</td>
          <td style="text-transform:uppercase;font-size:0.74rem">${l.diff}</td>
          <td style="color:#94a3b8">${l.date}</td>
        </tr>`).join('')
    : '<tr><td colspan="6" style="color:#cbd5e1;padding:20px">No records yet — be the first!</td></tr>';
}


/* ════════════════════════════════════════════════════════════════
   SECTION 11 — SCREEN MANAGEMENT
   [Mukesh — Coordinator: Integration]
   ════════════════════════════════════════════════════════════════ */
function showScreen(id) {
  if (animId) { cancelAnimationFrame(animId); animId = null; }
  if (timerIv) { clearInterval(timerIv); timerIv = null; }
  ['hud','timerBar','qBox','quitRow'].forEach(el => document.getElementById(el).classList.add('hidden'));
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  const target = document.getElementById(id);
  if (target) target.classList.remove('hidden');
  if (id === 'sLb') buildLeaderboard();

  if (id === 'sLogin') {
    stopBgMusic();
    try { startLoginMusic(); } catch(e) {}
  } else {
    stopLoginMusic();
    if (!bgMusicGain) { try { startBgMusic(); } catch(e) {} }
  }
}

function startGame(subject, diff) {
  if (!currentUser) { showScreen('sLogin'); return; }
  const qs = shuffle(QUESTIONS[subject][diff]);
  Object.assign(game, {
    active: true, subject, diff, qs,
    idx: 0, score: 0, time: 20, wait: false,
    streak: 0, lives: 3, combo: 1
  });
  ['hud','timerBar','qBox','quitRow'].forEach(id => document.getElementById(id).classList.remove('hidden'));
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  if (animId) cancelAnimationFrame(animId);
  resizeGame();
  renderLoop();
  setTimeout(() => { launchQuestion(); sndDrum(); }, 120);
}


/* ════════════════════════════════════════════════════════════════
   SECTION 12 — EVENT WIRING
   [Mukesh — Coordinator: Integration & Wiring]
   ════════════════════════════════════════════════════════════════ */

/* Login/Register tabs [Suman] */
let isLoginMode = true;
const setTabMode = (login) => {
  isLoginMode = login;
  document.getElementById('tabLogin').classList.toggle('active', login);
  document.getElementById('tabRegister').classList.toggle('active', !login);
  document.getElementById('authBtn').textContent = login ? '⚡ Enter Arena' : '🍥 Enlist as Ninja';
  document.getElementById('msgUser').textContent = '';
  document.getElementById('msgPass').textContent = '';
  document.getElementById('msgUser').className = 'field-msg';
  // Show/hide password strength meter
  const wrap = document.getElementById('pwStrengthWrap');
  if (wrap) wrap.classList.toggle('hidden', login);
  // Reset strength bar
  const bar = document.getElementById('pwStrengthBar');
  const lbl = document.getElementById('pwStrengthLabel');
  if (bar) { bar.style.width = '0%'; }
  if (lbl) { lbl.textContent = ''; }
};
document.getElementById('tabLogin').onclick    = () => setTabMode(true);
document.getElementById('tabRegister').onclick = () => setTabMode(false);

document.getElementById('eyeToggle').onclick = () => {
  const i = document.getElementById('inPass');
  i.type = i.type === 'password' ? 'text' : 'password';
};

document.getElementById('inUser').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('inPass').focus();
});
document.getElementById('inPass').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') document.getElementById('authBtn').click();
});

/* Live password strength [Suman] */
document.getElementById('inPass').addEventListener('input', () => {
  if (isLoginMode) return;
  const bar = document.getElementById('pwStrengthBar');
  const lbl = document.getElementById('pwStrengthLabel');
  if (!bar || !lbl) return;
  const pass = document.getElementById('inPass').value;
  if (!pass) { bar.style.width = '0%'; lbl.textContent = ''; return; }
  const str = getPasswordStrength(pass);
  // 4 levels: 0=too short, 1=weak, 2=fair, 3=medium, 4=strong
  const pct = [0, 25, 50, 75, 100][str.level];
  bar.style.width = pct + '%';
  bar.style.backgroundColor = str.color;
  bar.style.boxShadow = `0 0 8px ${str.color}`;
  lbl.textContent = str.label;
  lbl.style.color = str.color;
  // Tick off individual rules
  const tick = (id, met) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = (met ? '✅ ' : '✗ ') + el.textContent.replace(/^[✅✗] /, '');
    el.style.color = met ? '#22c55e' : 'rgba(255,255,255,0.45)';
  };
  tick('r-len',   pass.length >= 8);
  tick('r-upper', /[A-Z]/.test(pass));
  tick('r-num',   /[0-9]/.test(pass));
  tick('r-sym',   /[^A-Za-z0-9]/.test(pass));
});

document.getElementById('authBtn').onclick = () => {
  const u = document.getElementById('inUser').value.trim();
  const p = document.getElementById('inPass').value;
  document.getElementById('msgUser').textContent = '';
  document.getElementById('msgPass').textContent = '';
  document.getElementById('msgUser').className = 'field-msg';

  const result = isLoginMode ? loginUser(u, p) : registerUser(u, p);
  if (result.ok) {
    if (!isLoginMode) {
      const m = document.getElementById('msgUser');
      m.className = 'field-msg ok';
      m.textContent = '✅ Registered! Now click Login.';
      setTabMode(true);
    } else {
      document.getElementById('userNameEl').textContent = currentUser;
      showScreen('sMenu');
    }
  } else {
    if (result.field === 'user') document.getElementById('msgUser').textContent = '⚠️ ' + result.msg;
    else                         document.getElementById('msgPass').textContent = '⚠️ ' + result.msg;
  }
};

/* Menu [Mukesh] */
document.querySelectorAll('.sub-card').forEach(btn => {
  btn.onclick = () => {
    sndSelect();
    document.querySelectorAll('.sub-card').forEach(x => x.classList.remove('sel'));
    btn.classList.add('sel');
    game.subject = btn.dataset.sub;
  };
});
/* Difficulty cards now just SELECT (highlight) — game starts via PLAY button [Kishor] */
document.querySelectorAll('.diff-card').forEach(btn => {
  btn.onclick = () => {
    sndSelect();
    document.querySelectorAll('.diff-card').forEach(x => x.classList.remove('sel'));
    btn.classList.add('sel');
    game.diff = btn.dataset.diff;
  };
});

/* BIG PLAY button — starts the actual battle [Mukesh + Akash] */
document.getElementById('btnPlay').onclick = () => {
  sndDrum();
  startGame(game.subject || 'Math', game.diff || 'easy');
};

document.getElementById('logoutBtn').onclick = () => { currentUser = null; showScreen('sLogin'); };

/* Navigation [Mukesh] */
document.getElementById('btnHowtoLogin').onclick = () => showScreen('sHowto');
document.getElementById('btnLbLogin').onclick    = () => showScreen('sLb');
document.getElementById('btnHowtoMenu').onclick  = () => showScreen('sHowto');
document.getElementById('btnLbMenu').onclick     = () => showScreen('sLb');
document.getElementById('lbBack').onclick        = () => showScreen(currentUser ? 'sMenu' : 'sLogin');
document.getElementById('htBack').onclick        = () => showScreen(currentUser ? 'sMenu' : 'sLogin');

/* Quiz controls [Kishor + Bishal] */
document.getElementById('quitBtn').onclick = () => { game.active = false; showScreen('sMenu'); };
document.getElementById('soundBtn').onclick = function () {
  SOUND_ON = !SOUND_ON;
  this.textContent = SOUND_ON ? '🔊 Sound' : '🔇 Muted';
  this.style.opacity = SOUND_ON ? '1' : '0.55';
  if (!SOUND_ON) stopBgMusic();
};
document.getElementById('musicBtn').onclick = function () {
  toggleMusic(this);
  const m2 = document.getElementById('menuMusicBtn');
  if (m2) { m2.textContent = MUSIC_ON ? '🎵 Music: ON' : '🎵 Music: OFF'; m2.style.opacity = MUSIC_ON ? '1' : '0.55'; }
};
document.getElementById('menuMusicBtn').onclick = function () {
  toggleMusic(this);
  const m2 = document.getElementById('musicBtn');
  if (m2) { m2.textContent = MUSIC_ON ? '🎵 Music: ON' : '🎵 Music: OFF'; m2.style.opacity = MUSIC_ON ? '1' : '0.55'; }
};

/* Login screen music toggle */
let loginMusicEnabled = true;
document.getElementById('loginMusicBtn').onclick = function () {
  loginMusicEnabled = !loginMusicEnabled;
  this.textContent = loginMusicEnabled ? '🎵 Music: ON' : '🔇 Music: OFF';
  this.style.opacity = loginMusicEnabled ? '1' : '0.55';
  if (loginMusicEnabled) {
    try { startLoginMusic(); } catch(e) {}
  } else {
    stopLoginMusic();
  }
};

/* Add soft click sound to ALL nav/ghost buttons [Bishal] */
document.querySelectorAll('.btn-ghost, .btn-orange, .btn-yellow, .auth-tab, .logout-btn').forEach(el => {
  el.addEventListener('click', () => sndClick(), { capture: true });
});

/* Results [Akash] */
document.getElementById('vPlayAgain').onclick = () => startGame(game.subject, game.diff);
document.getElementById('vLb').onclick        = () => showScreen('sLb');
document.getElementById('vMenu').onclick      = () => showScreen('sMenu');
document.getElementById('oPlayAgain').onclick = () => startGame(game.subject, game.diff);
document.getElementById('oMenu').onclick      = () => showScreen('sMenu');

/* Audio unlock is handled in Section 3 — no duplicate needed */

/* Boot — show login screen [Mukesh] */
showScreen('sLogin');
