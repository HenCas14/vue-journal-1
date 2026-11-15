// Motor de animación del canal: utilidades, personaje, escenario y efectos.
// Todo es determinista en función del tiempo t (segundos) para poder renderizar cuadro por cuadro.

const W = 1920, H = 1080;
const OUT = '#1d1830'; // color de contorno (estilo caricatura)

// ---------- utilidades ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const ease = {
  inOut: t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
  back: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  elastic: t => (t <= 0 ? 0 : t >= 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * (2 * Math.PI) / 3) + 1),
};
// Escala "pop" elástica que arranca en `start`
const pop = (t, start, dur = 0.6) => ease.elastic(prog(t, start, start + dur));
// Oscilación orgánica (suma de senos)
const wob = (t, f = 1, seed = 0) => 0.6 * Math.sin(t * f + seed) + 0.4 * Math.sin(t * f * 1.73 + seed * 2.1);
function rng(seed) { let s = (Math.abs(Math.floor(seed)) * 2654435761 + 12345) % 2147483647 || 1; for (let i = 0; i < 3; i++) s = (s * 16807) % 2147483647; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

function hex(c) { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function mix(c1, c2, t) {
  const a = hex(c1), b = hex(c2);
  return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], clamp(t)))).join(',')})`;
}
function mixHex(c1, c2, t) {
  const a = hex(c1), b = hex(c2);
  return '#' + a.map((v, i) => Math.round(lerp(v, b[i], clamp(t))).toString(16).padStart(2, '0')).join('');
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
// Estilo visual global: outline = 0 quita contornos (estilos plano y silueta)
const THEME = { outline: 1 };
function fillStroke(ctx, fill, lw = 8, stroke = OUT) {
  ctx.fillStyle = fill; ctx.fill();
  lw *= THEME.outline;
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.stroke(); }
}
// Línea gruesa con contorno (brazos, etc.)
function limb(ctx, pts, color, w = 22) {
  for (const [c, lw] of THEME.outline ? [[OUT, w + 12], [color, w]] : [[color, w]]) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    if (pts.length === 3) ctx.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]);
    else for (const p of pts.slice(1)) ctx.lineTo(p[0], p[1]);
    ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
  }
}

// ---------- texto ----------
function text(ctx, str, x, y, o = {}) {
  const { size = 80, font = 'Lilita', fill = '#fff', stroke = OUT, lw = size * 0.16, align = 'center', shadow = true } = o;
  ctx.font = `${size}px ${font}`; ctx.textAlign = align; ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  if (shadow) { ctx.fillStyle = OUT; ctx.fillText(str, x + size * 0.06, y + size * 0.09); if (lw > 0) { ctx.lineWidth = lw; ctx.strokeStyle = OUT; ctx.strokeText(str, x + size * 0.06, y + size * 0.09); } }
  if (lw > 0) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.strokeText(str, x, y); }
  ctx.fillStyle = fill; ctx.fillText(str, x, y);
}

// ---------- personaje: "Frijol" (bean con ojos enormes y un mechón) ----------
// o: { x, y (base), s (escala), rot, squash, color, eyeOpen, eyeSize, px, py (mirada),
//      red, bags, mouth ('smile'|'flat'|'o'|'yawn'|'wobbly'|'grin'), mouthOpen, spiral, frazzle,
//      armL, armR: [[x,y],...] relativos | null, holding ('phone'|'coffee'|null), t }
const CHAR = { body: '#5ee0c0', belly: '#a8f2de', cheek: '#ff8fa3', tuft: '#3fbf9f' };

function drawEye(ctx, ex, ey, o, side) {
  const rx = 40 * o.eyeSize, ry = 50 * o.eyeSize;
  // blanco del ojo (tinte rojo si hay cansancio)
  ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, 0, 0, Math.PI * 2);
  fillStroke(ctx, mix('#ffffff', '#ffd2d2', o.red * 0.8), 7);
  ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey, rx - 3, ry - 3, 0, 0, Math.PI * 2); ctx.clip();
  // venitas rojas
  if (o.red > 0.05) {
    ctx.strokeStyle = `rgba(220,40,60,${clamp(o.red)})`; ctx.lineWidth = 3; ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + side;
      ctx.beginPath(); ctx.moveTo(ex + Math.cos(a) * rx, ey + Math.sin(a) * ry);
      ctx.quadraticCurveTo(ex + Math.cos(a + 0.3) * rx * 0.7, ey + Math.sin(a + 0.3) * ry * 0.7, ex + Math.cos(a) * rx * 0.45, ey + Math.sin(a) * ry * 0.45);
      ctx.stroke();
    }
  }
  if (o.spiral) {
    ctx.strokeStyle = OUT; ctx.lineWidth = 6; ctx.beginPath();
    const rot = o.t * 9 * (side > 0 ? 1 : -1);
    for (let a = 0; a < Math.PI * 7; a += 0.15) {
      const r = a * 2.0 * o.eyeSize;
      const X = ex + Math.cos(a + rot) * r, Y = ey + Math.sin(a + rot) * r;
      a === 0 ? ctx.moveTo(X, Y) : ctx.lineTo(X, Y);
    }
    ctx.stroke();
  } else {
    const pr = 17 * Math.min(1.3, o.eyeSize) * (o.pupil ?? 1);
    const px = ex + o.px * rx * 0.45, py = ey + o.py * ry * 0.45;
    ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(px, py, pr, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px - pr * 0.35, py - pr * 0.4, pr * 0.35, 0, Math.PI * 2); ctx.fill();
  }
  // párpado
  const lid = 1 - clamp(o.eyeOpen);
  if (lid > 0.01) {
    ctx.fillStyle = o.color; ctx.fillRect(ex - rx - 5, ey - ry - 5, rx * 2 + 10, (ry * 2 + 5) * lid);
    ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.beginPath();
    const ly = ey - ry + (ry * 2) * lid; ctx.moveTo(ex - rx, ly); ctx.lineTo(ex + rx, ly); ctx.stroke();
  }
  ctx.restore();
  ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, 0, 0, Math.PI * 2); ctx.lineWidth = 7; ctx.strokeStyle = OUT; ctx.stroke();
  // ojeras
  if (o.bags > 0.05) {
    ctx.strokeStyle = `rgba(110,60,140,${clamp(o.bags)})`; ctx.lineWidth = 6; ctx.lineCap = 'round';
    for (let k = 0; k < 2; k++) {
      ctx.beginPath(); ctx.ellipse(ex, ey + ry * 0.35 + k * 11, rx * (0.85 - k * 0.15), ry * 0.75, 0, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke();
    }
  }
}

function drawMouth(ctx, o) {
  const y = -112, op = clamp(o.mouthOpen ?? 0.5);
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = OUT; ctx.lineWidth = 7;
  switch (o.mouth) {
    case 'smile': ctx.beginPath(); ctx.arc(0, y - 18, 30, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); break;
    case 'flat': ctx.beginPath(); ctx.moveTo(-22, y); ctx.lineTo(22, y); ctx.stroke(); break;
    case 'wobbly': {
      ctx.beginPath();
      for (let i = 0; i <= 20; i++) { const X = -32 + i * 3.2, Y = y + Math.sin(i * 1.2 + o.t * 25) * 5; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
      ctx.stroke(); break;
    }
    case 'grin': {
      ctx.beginPath(); ctx.moveTo(-40, y - 10); ctx.quadraticCurveTo(0, y + 40, 40, y - 10); ctx.closePath();
      fillStroke(ctx, '#fff', 7);
      ctx.beginPath(); ctx.moveTo(-36, y + 2); ctx.lineTo(36, y + 2); ctx.stroke(); break;
    }
    case 'o': case 'yawn': {
      const rw = o.mouth === 'yawn' ? 26 + op * 14 : 16 + op * 14, rh = o.mouth === 'yawn' ? 14 + op * 40 : 14 + op * 22;
      ctx.beginPath(); ctx.ellipse(0, y + rh * 0.3, rw, rh, 0, 0, Math.PI * 2); fillStroke(ctx, '#7a1f3d', 7);
      ctx.save(); ctx.clip(); ctx.fillStyle = '#ff7a9a'; ctx.beginPath(); ctx.ellipse(0, y + rh * 1.1, rw * 0.7, rh * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      break;
    }
  }
}

function drawPhone(ctx, x, y, t, glow = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(-0.15);
  rrect(ctx, -34, -58, 68, 116, 12); fillStroke(ctx, '#2b2b3d', 6);
  rrect(ctx, -26, -48, 52, 92, 6);
  const flick = 0.85 + 0.15 * Math.sin(t * 13) * Math.sin(t * 5.3);
  ctx.fillStyle = mix('#3fa9ff', '#b7e4ff', flick * glow); ctx.fill();
  // "contenido" moviéndose (scroll)
  ctx.save(); rrect(ctx, -26, -48, 52, 92, 6); ctx.clip();
  for (let i = 0; i < 6; i++) {
    const yy = -48 + ((i * 24 - t * 60) % 144 + 144) % 144 - 20;
    ctx.fillStyle = 'rgba(255,255,255,0.75)'; rrect(ctx, -20, yy, 40, 14, 4); ctx.fill();
  }
  ctx.restore(); ctx.restore();
}

function drawCoffee(ctx, x, y, t, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  // vapor animado
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = 6; ctx.lineCap = 'round';
  for (let k = -1; k <= 1; k++) {
    ctx.beginPath();
    for (let i = 0; i <= 12; i++) { const yy = -50 - i * 7, xx = k * 16 + Math.sin(i * 0.7 - t * 8 + k) * 7; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); }
    ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 4 + k); ctx.stroke(); ctx.globalAlpha = 1;
  }
  ctx.beginPath(); ctx.arc(40, -10, 20, -Math.PI / 2, Math.PI / 2); ctx.lineWidth = 18; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 8; ctx.strokeStyle = '#fff'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-40, -45); ctx.lineTo(40, -45); ctx.lineTo(32, 35); ctx.quadraticCurveTo(0, 45, -32, 35); ctx.closePath();
  fillStroke(ctx, '#ff6b5b', 7);
  ctx.fillStyle = '#ffd23f'; ctx.font = '34px Lilita'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('☕', 0, -3);
  ctx.restore();
}

function drawChar(ctx, o) {
  o = Object.assign({ s: 1, rot: 0, squash: 0, color: CHAR.body, eyeOpen: 1, eyeSize: 1, px: 0, py: 0, red: 0, bags: 0, mouth: 'smile', mouthOpen: 0.5, spiral: false, frazzle: 0, t: 0, holding: null }, o);
  ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rot); ctx.scale(o.s * (1 + o.squash), o.s * (1 - o.squash));
  // sombra
  ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(0, 8, 130, 22, 0, 0, Math.PI * 2); ctx.fill();
  // mechón (se mueve; se encrespa con frazzle)
  const ta = wob(o.t, 3, 1) * 0.25;
  const n = 1 + Math.round(o.frazzle * 4);
  for (let i = 0; i < n; i++) {
    const a = ta + (i - (n - 1) / 2) * 0.45 + (o.frazzle ? Math.sin(o.t * 40 + i) * 0.15 * o.frazzle : 0);
    ctx.save(); ctx.translate(0, -300); ctx.rotate(a);
    ctx.beginPath(); ctx.moveTo(-14, 10); ctx.quadraticCurveTo(-30, -60, 10, -80); ctx.quadraticCurveTo(0, -40, 16, 10); ctx.closePath();
    fillStroke(ctx, CHAR.tuft, 7); ctx.restore();
  }
  // brazo trasero
  if (o.armL) limb(ctx, o.armL, o.color);
  // cuerpo (frijol)
  ctx.beginPath();
  ctx.moveTo(-120, -10);
  ctx.bezierCurveTo(-150, -150, -140, -310, 0, -310);
  ctx.bezierCurveTo(140, -310, 150, -150, 120, -10);
  ctx.quadraticCurveTo(0, 15, -120, -10); ctx.closePath();
  fillStroke(ctx, o.color, 9);
  // panza
  ctx.save(); ctx.clip();
  ctx.fillStyle = CHAR.belly; ctx.beginPath(); ctx.ellipse(0, -30, 85, 75, 0, 0, Math.PI * 2); ctx.fill();
  // brillo
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-70, -240, 22, 40, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  // mejillas
  ctx.fillStyle = CHAR.cheek; ctx.globalAlpha = 0.7;
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 82, -138, 20, 12, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.globalAlpha = 1;
  drawEye(ctx, -46, -205, o, -1); drawEye(ctx, 46, -205, o, 1);
  drawMouth(ctx, o);
  if (o.armR) {
    limb(ctx, o.armR, o.color);
    const hand = o.armR[o.armR.length - 1];
    if (o.holding === 'phone') drawPhone(ctx, hand[0], hand[1] - 40, o.t);
    if (o.holding === 'coffee') drawCoffee(ctx, hand[0], hand[1] - 20, o.t, 0.9);
  }
  ctx.restore();
}

// ---------- efectos tipo caricatura ----------
function exclaim(ctx, x, y, t, start, str = '!') {
  const s = pop(t, start, 0.5); if (s <= 0) return;
  const fade = 1 - prog(t, start + 1.4, start + 1.8); if (fade <= 0) return;
  ctx.save(); ctx.globalAlpha = fade; ctx.translate(x, y + Math.sin(t * 20) * 4); ctx.scale(s, s); ctx.rotate(Math.sin(t * 15) * 0.08);
  text(ctx, str, 0, 0, { size: 170, fill: '#ffd23f' });
  ctx.restore();
}
function sweat(ctx, x, y, t, start, dir = 1) {
  const p = prog(t, start, start + 0.9); if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.translate(x + dir * p * 60, y - Math.sin(p * Math.PI) * 60 + p * 40); ctx.rotate(dir * 0.5);
  ctx.globalAlpha = 1 - p * 0.6;
  ctx.beginPath(); ctx.moveTo(0, -26); ctx.quadraticCurveTo(18, 0, 0, 14); ctx.quadraticCurveTo(-18, 0, 0, -26);
  fillStroke(ctx, '#7fd4ff', 5); ctx.restore();
}
function burst(ctx, x, y, t, start, color = '#ffd23f', n = 10, R = 160) {
  const p = prog(t, start, start + 0.45); if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.translate(x, y); ctx.strokeStyle = color; ctx.lineCap = 'round'; ctx.lineWidth = 12 * (1 - p);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, r1 = R * ease.out(p), r2 = r1 + 50 * (1 - p);
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.lineTo(Math.cos(a) * r2, Math.sin(a) * r2); ctx.stroke();
  }
  ctx.restore();
}
function speedLines(ctx, t, alpha, seed = 3) {
  if (alpha <= 0) return;
  const r = rng(seed); ctx.save(); ctx.translate(W / 2, H / 2); ctx.globalAlpha = alpha;
  for (let i = 0; i < 60; i++) {
    const a = r() * Math.PI * 2, ph = (r() + t * 2.5) % 1, r1 = 500 + ph * 700;
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 3 + r() * 6;
    ctx.beginPath(); ctx.moveTo(Math.cos(a) * r1, Math.sin(a) * r1); ctx.lineTo(Math.cos(a) * (r1 + 160), Math.sin(a) * (r1 + 160)); ctx.stroke();
  }
  ctx.restore();
}
// Partículas flotantes siempre en movimiento (polvo, estrellitas, "z")
function floaters(ctx, t, o = {}) {
  const { n = 40, color = 'rgba(255,255,255,0.5)', seed = 7, speed = 20, size = 4, area = [0, 0, W, H] } = o;
  const r = rng(seed); ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const bx = r() * area[2], by = r() * area[3], sp = 0.5 + r(), ph = r() * 10, sz = size * (0.5 + r());
    const x = area[0] + ((bx + Math.sin(t * 0.6 * sp + ph) * 40) % area[2] + area[2]) % area[2];
    const y = area[1] + ((by - t * speed * sp) % area[3] + area[3]) % area[3];
    ctx.globalAlpha = 0.4 + 0.6 * Math.abs(Math.sin(t * sp + ph));
    ctx.beginPath(); ctx.arc(x, y, sz, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// ---------- contador de marca ----------
function counterLabel(hours) {
  if (hours < 48) return `HORA ${Math.floor(hours)}`;
  return `DÍA ${Math.floor(hours / 24)}`;
}
function drawCounter(ctx, t, label, appear, bumpAt = []) {
  const s = pop(t, appear, 0.7); if (s <= 0) return;
  let bump = 0; for (const b of bumpAt) { const p = prog(t, b, b + 0.35); if (p > 0 && p < 1) bump = Math.max(bump, Math.sin(p * Math.PI) * 0.25); }
  ctx.save(); ctx.translate(W - 230, 110); ctx.scale(s * (1 + bump), s * (1 + bump)); ctx.rotate(-0.04 + Math.sin(t * 2) * 0.02);
  rrect(ctx, -190, -62, 380, 124, 40); fillStroke(ctx, '#ffd23f', 9);
  // icono reloj
  ctx.beginPath(); ctx.arc(-125, 0, 36, 0, Math.PI * 2); fillStroke(ctx, '#fff', 7);
  ctx.strokeStyle = OUT; ctx.lineWidth = 7; ctx.lineCap = 'round';
  const ha = t * 6; ctx.beginPath(); ctx.moveTo(-125, 0); ctx.lineTo(-125 + Math.cos(ha) * 24, Math.sin(ha) * 24); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-125, 0); ctx.lineTo(-125, -18); ctx.stroke();
  ctx.font = '74px Lilita'; ctx.fillStyle = OUT; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, 40, 6);
  ctx.restore();
}

// ---------- transición "whoosh" de marca ----------
function wipe(ctx, t, start, dur = 0.7, colors = ['#ff6b5b', '#ffd23f', '#5ee0c0']) {
  const p = prog(t, start, start + dur); if (p <= 0 || p >= 1) return;
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-0.35);
  colors.forEach((c, i) => {
    const q = clamp(p * 1.25 - i * 0.12);
    const inX = lerp(-2600, 0, ease.out(clamp(q * 2))), outX = lerp(0, 2600, ease.in(clamp(q * 2 - 1)));
    const x = q < 0.5 ? inX : outX;
    ctx.fillStyle = c; ctx.fillRect(x - 1400, -1400, 2800, 2800);
  });
  ctx.restore();
}

// ---------- tematizado de colores ----------
function toRGB(c) {
  if (c[0] === '#') return hex(c);
  const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null;
  return m[1].split(',').map(Number);
}
// Devuelve un contexto que transforma todos los colores con map([r,g,b]) -> [r,g,b]
function themedCtx(ctx, map) {
  const conv = c => {
    if (typeof c !== 'string') return c;
    const v = toRGB(c); if (!v) return c;
    const [r, g, b] = map(v.slice(0, 3)); const a = v.length > 3 ? v[3] : 1;
    return `rgba(${r | 0},${g | 0},${b | 0},${a})`;
  };
  const wrapGrad = gr => new Proxy(gr, { get: (o, k) => k === 'addColorStop' ? (p, c) => o.addColorStop(p, conv(c)) : (typeof o[k] === 'function' ? o[k].bind(o) : o[k]) });
  return new Proxy(ctx, {
    get(o, k) {
      if (k === 'createLinearGradient' || k === 'createRadialGradient') return (...a) => wrapGrad(o[k](...a));
      const v = o[k]; return typeof v === 'function' ? v.bind(o) : v;
    },
    set(o, k, v) { o[k] = (k === 'fillStyle' || k === 'strokeStyle' || k === 'shadowColor') ? conv(v) : v; return true; },
  });
}
