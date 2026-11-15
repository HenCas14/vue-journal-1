// Biblioteca de elementos en ESTILO PLANO (sin contornos, formas geométricas, sombras planas).
// Personas genéricas, íconos, cerebro, gráficas, fondos. Todo animable con t.

const FLAT = {
  bg1: '#2d2a6e', bg2: '#1c1a4a', accent: '#ffd23f', coral: '#ff6b5b', mint: '#5ee0c0', sky: '#7cc6ff',
  purple: '#8b7bff', pink: '#ff8fab', ink: '#1d1830', white: '#ffffff', paper: '#f4efe6',
};

// ---------- fondos ----------
function bgFlat(ctx, t, c1 = FLAT.bg1, c2 = FLAT.bg2, seed = 1, shapes = true) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (!shapes) return;
  const r = rng(seed);
  for (let i = 0; i < 14; i++) {
    const x = r() * W, y = r() * H, sz = 20 + r() * 70, k = Math.floor(r() * 3), sp = 0.3 + r() * 0.6;
    ctx.save(); ctx.translate(x + Math.sin(t * sp + i) * 40, y + Math.cos(t * sp * 0.8 + i) * 30); ctx.rotate(t * sp * (i % 2 ? 0.5 : -0.5));
    ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.beginPath();
    if (k === 0) ctx.arc(0, 0, sz, 0, Math.PI * 2); else if (k === 1) { ctx.moveTo(0, -sz); ctx.lineTo(sz, sz * 0.8); ctx.lineTo(-sz, sz * 0.8); } else ctx.rect(-sz * 0.8, -sz * 0.8, sz * 1.6, sz * 1.6);
    ctx.fill(); ctx.restore();
  }
}
function rays(ctx, t, x, y, color = 'rgba(255,255,255,0.05)', n = 14) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.2); ctx.fillStyle = color;
  for (let i = 0; i < n; i++) { ctx.rotate((Math.PI * 2) / n); if (i % 2) continue; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(2000, -180); ctx.lineTo(2000, 180); ctx.fill(); }
  ctx.restore();
}
function floorFlat(ctx, y, c = 'rgba(0,0,0,0.18)') { ctx.fillStyle = c; ctx.fillRect(0, y, W, H - y); }

// ---------- tarjetas y textos ----------
function card(ctx, x, y, w, h, color = '#fff', r = 30, shadow = true) {
  if (shadow) { ctx.fillStyle = 'rgba(0,0,0,0.22)'; rrect(ctx, x + 10, y + 14, w, h, r); ctx.fill(); }
  ctx.fillStyle = color; rrect(ctx, x, y, w, h, r); ctx.fill();
}
function popIn(ctx, t, st, x, y, fn, dur = 0.6) {
  const s = pop(t, st, dur); if (s <= 0) return 0;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); fn(); ctx.restore(); return s;
}
// Dato grande con número que cuenta hacia arriba
function bigStat(ctx, t, st, x, y, value, o = {}) {
  const { prefix = '', suffix = '', dec = 0, label = '', color = FLAT.accent, size = 200, count = 0.9, bg = null } = o;
  popIn(ctx, t, st, x, y, () => {
    if (bg) card(ctx, -o.w / 2, -o.h / 2, o.w, o.h, bg, 40);
    const v = typeof value === 'number' ? (value * ease.out(prog(t, st, st + count))).toFixed(dec) : value;
    text(ctx, prefix + v + suffix, 0, label ? -size * 0.25 : 0, { size, fill: color });
    if (label) text(ctx, label, 0, size * 0.55, { size: size * 0.28, fill: '#fff' });
  });
}
function label(ctx, str, x, y, o = {}) { text(ctx, str, x, y, Object.assign({ size: 64, fill: '#fff' }, o)); }
function subtitleBar(ctx, t, st, str, color = FLAT.accent) {
  const s = ease.back(prog(t, st, st + 0.5)); if (s <= 0) return;
  ctx.save(); ctx.translate(W / 2, H - 250); ctx.scale(s, s);
  ctx.font = '62px Lilita'; const w = ctx.measureText(str).width + 90;
  card(ctx, -w / 2, -55, w, 110, color, 55);
  text(ctx, str, 0, 2, { size: 62, fill: FLAT.ink, stroke: color, lw: 0, shadow: false });
  ctx.restore();
}

// ---------- personas genéricas en estilo plano ----------
// P: { skin, skinD, shirt, shirtD, pants, hair, hairStyle ('curly'|'crew'|'long'|'bun'|'bald'|'spiky'),
//      stripes, coat, glasses, helmet, h (alto), shoes }
const PEOPLE = {
  leo: { skin: '#a86b3c', skinD: '#8d5630', shirt: '#2f6fde', shirtD: '#2558b8', pants: '#1f2a44', hair: '#1b1b1b', hairStyle: 'curly' },
  randy: { skin: '#f1c9a5', skinD: '#ddae86', shirt: '#e63946', shirtD: '#c52f3b', stripes: '#ffffff', pants: '#3d5a80', hair: '#8a5a2b', hairStyle: 'crew' },
  amigo1: { skin: '#e0ac69', skinD: '#c68f50', shirt: '#2a9d8f', shirtD: '#21867a', pants: '#264653', hair: '#2b1d14', hairStyle: 'spiky' },
  amigo2: { skin: '#ffdbac', skinD: '#e8c08e', shirt: '#f4a261', shirtD: '#dd8c4c', pants: '#6d597a', hair: '#d4a24c', hairStyle: 'crew', glasses: true },
  cientifica: { skin: '#c68642', skinD: '#a96f33', shirt: '#9b5de5', shirtD: '#8148cc', pants: '#2b2d42', hair: '#2b1d14', hairStyle: 'bun', coat: true, glasses: true },
  adulto: { skin: '#f1c27d', skinD: '#d9a861', shirt: '#ef476f', shirtD: '#d23a5f', pants: '#073b4c', hair: '#5c3a21', hairStyle: 'long' },
  medico: { skin: '#8d5524', skinD: '#74441c', shirt: '#06d6a0', shirtD: '#05b386', pants: '#118ab2', hair: '#111', hairStyle: 'bald', coat: true },
};
function drawPerson(ctx, x, y, s, e, P) {
  const t = e.t, sh = clamp(e.shock || 0), talk = e.talk || 0, red = e.red || 0, bags = e.bags || 0, fr = e.frazzle || 0;
  const { skin, skinD, shirt, shirtD, pants, hair } = P;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (e.flip ? -1 : 1), s); ctx.rotate(e.rot || 0);
  if (!e.noShadow) { ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.beginPath(); ctx.ellipse(0, 2, 80, 10, 0, 0, Math.PI * 2); ctx.fill(); }
  const walk = e.walk ? Math.sin(t * 9) : 0;
  const step = e.inBed || e.sit ? 0 : (e.walk ? -Math.abs(walk) * 8 : Math.sin(t * 3) * 3) - sh * 20;
  if (!e.sit) {
    ctx.fillStyle = pants;
    ctx.save(); ctx.translate(-19, -175 + step); ctx.rotate(walk * 0.3); ctx.fillRect(-13, 0, 26, 170 - step); ctx.restore();
    ctx.save(); ctx.translate(19, -175 + step); ctx.rotate(-walk * 0.3); ctx.fillRect(-13, 0, 26, 170 - step); ctx.restore();
    ctx.fillStyle = P.shoes || '#ffffff'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 22 + (sx * walk * 25), -6, 26, 10, 0, Math.PI, 0); ctx.fill(); }
  }
  ctx.translate(0, step + (e.sit ? 0 : 0));
  // torso
  const coat = P.coat;
  ctx.fillStyle = coat ? '#f4f7fb' : shirt; rrect(ctx, -62, -340, 124, 175, 30); ctx.fill();
  ctx.save(); rrect(ctx, -62, -340, 124, 175, 30); ctx.clip();
  if (coat) { ctx.fillStyle = shirt; ctx.beginPath(); ctx.moveTo(-22, -340); ctx.lineTo(22, -340); ctx.lineTo(10, -230); ctx.lineTo(-10, -230); ctx.fill(); ctx.fillStyle = '#dfe6ef'; ctx.fillRect(20, -340, 60, 175); }
  else {
    if (P.stripes) { ctx.fillStyle = P.stripes; for (let k = 0; k < 5; k++) ctx.fillRect(-70, -320 + k * 34, 140, 12); }
    ctx.fillStyle = 'rgba(0,0,0,0.13)'; ctx.fillRect(15, -340, 60, 175);
  }
  ctx.restore();
  ctx.fillStyle = skin; ctx.fillRect(-14, -365, 28, 30);
  // pelo trasero (largo)
  const hy = -425 - sh * 10;
  if (P.hairStyle === 'long') { ctx.fillStyle = hair; rrect(ctx, -68, hy - 50, 136, 150, 50); ctx.fill(); }
  // cabeza
  ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(0, hy, 55, 66, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = skinD; ctx.beginPath(); ctx.ellipse(52, hy + 5, 12, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = hair;
  const hs = P.hairStyle;
  if (hs === 'curly') for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + i * 0.11), jr = fr * (6 + 4 * Math.sin(t * 30 + i * 2)); ctx.beginPath(); ctx.arc(Math.cos(a) * (52 + fr * 10), hy - 18 + Math.sin(a) * (52 + fr * 12), 22 + sh * 6 + jr, 0, Math.PI * 2); ctx.fill(); }
  else if (hs === 'crew' || hs === 'long' || hs === 'bun') {
    ctx.beginPath(); ctx.ellipse(0, hy - 22, 58, 48, 0, Math.PI, 0); ctx.quadraticCurveTo(30, hy - 40, -10, hy - 30); ctx.quadraticCurveTo(-45, hy - 20, -58, hy - 10); ctx.fill();
    if (hs === 'bun') { ctx.beginPath(); ctx.arc(0, hy - 80, 26, 0, Math.PI * 2); ctx.fill(); }
    if (fr > 0.05) for (let i = 0; i < 7; i++) { const a = Math.PI * (1.1 + i * 0.13); ctx.beginPath(); ctx.moveTo(Math.cos(a - 0.1) * 50, hy - 15 + Math.sin(a - 0.1) * 55); ctx.lineTo(Math.cos(a) * (70 + fr * 25 + Math.sin(t * 30 + i) * 5), hy - 15 + Math.sin(a) * (75 + fr * 25)); ctx.lineTo(Math.cos(a + 0.1) * 50, hy - 15 + Math.sin(a + 0.1) * 55); ctx.fill(); }
  } else if (hs === 'spiky') {
    ctx.beginPath(); ctx.moveTo(-58, hy - 10);
    for (let i = 0; i <= 8; i++) { const a = Math.PI * (1 + i / 8); const rr = i % 2 ? 62 : 88 + fr * 20; ctx.lineTo(Math.cos(a) * rr * 0.8, hy - 15 + Math.sin(a) * rr * 0.85); }
    ctx.closePath(); ctx.fill();
  }
  if (P.helmet || e.helmet) { // casco de fútbol americano
    ctx.fillStyle = '#ffb703'; ctx.beginPath(); ctx.arc(0, hy - 8, 72, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(-6, hy - 80, 12, 60);
    ctx.strokeStyle = '#6c757d'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-50, hy + 30); ctx.lineTo(50, hy + 30); ctx.moveTo(-40, hy + 50); ctx.lineTo(40, hy + 50); ctx.moveTo(0, hy + 20); ctx.lineTo(0, hy + 60); ctx.stroke();
  }
  // ojos
  const [lx, ly] = e.look || [0, 0], op = clamp(e.open ?? 1), es = e.eyeSize || 1;
  const big = sh > 0.3 || red > 0.2 || e.spiral || es > 1.05;
  for (const sx of [-1, 1]) {
    const ex = sx * 22 + lx * 4, ey = hy + 2 + ly * 3, r = 17 * es * (sh > 0.3 ? 1.1 : 1);
    if (bags > 0.05) { ctx.strokeStyle = `rgba(90,40,30,${0.6 * bags})`; ctx.lineWidth = 4; for (let k = 0; k < 2; k++) { ctx.beginPath(); ctx.arc(ex, ey + 4 + k * 6, r + 3, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke(); } }
    if (big) {
      ctx.fillStyle = mix('#ffffff', '#ffd0d0', red * 0.8); ctx.beginPath(); ctx.arc(ex, ey, r, 0, Math.PI * 2); ctx.fill();
      veins(ctx, ex, ey, r, red);
      if (e.spiral) spiralEye(ctx, ex, ey, r * 0.9, t, sx, '#1b1b1b');
      else { ctx.fillStyle = '#1b1b1b'; ctx.beginPath(); ctx.arc(ex + lx * r * 0.3, ey + ly * r * 0.3, 6 * (e.pupil || 1), 0, Math.PI * 2); ctx.fill(); }
      if (op < 0.98) { ctx.save(); ctx.beginPath(); ctx.arc(ex, ey, r + 1, 0, Math.PI * 2); ctx.clip(); ctx.fillStyle = skin; ctx.fillRect(ex - r - 2, ey - r - 2, 2 * r + 4, (2 * r + 2) * (1 - op)); ctx.restore(); }
    } else if (op < 0.12) { ctx.strokeStyle = '#1b1b1b'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(ex, ey - 3, 8, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
    else { ctx.fillStyle = '#1b1b1b'; ctx.beginPath(); ctx.ellipse(ex, ey, 7, 8 * op + 0.5, 0, 0, Math.PI * 2); ctx.fill(); }
    if (!e.helmet && !P.helmet) {
      const tired = clamp(red + bags * 0.5) * (1 - sh), angry = e.angry || 0;
      ctx.strokeStyle = hs === 'bald' ? skinD : hair; ctx.lineWidth = 6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(ex - 12 * sx, hy - 22 - sh * 16 - tired * 4 + angry * 8); ctx.lineTo(ex + 12 * sx, hy - 24 - sh * 16 + tired * 7 - angry * 4); ctx.stroke();
    }
  }
  if (P.glasses) { ctx.strokeStyle = '#1b1b1b'; ctx.lineWidth = 4; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 22, hy + 2, 21, 0, Math.PI * 2); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-2, hy); ctx.lineTo(2, hy); ctx.stroke(); }
  // boca
  const mouth = e.mouth || (sh > 0.3 ? 'o' : 'smile'), mo = clamp(e.mouthOpen ?? sh);
  ctx.fillStyle = '#5a1e2a'; ctx.strokeStyle = '#5a1e2a'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  const my = hy + 32;
  if (mouth === 'o') { ctx.beginPath(); ctx.ellipse(0, my + 4, 11, 8 + 12 * mo, 0, 0, Math.PI * 2); ctx.fill(); }
  else if (mouth === 'yawn') { ctx.beginPath(); ctx.ellipse(0, my + 6, 14 + 6 * mo, 6 + 22 * mo, 0, 0, Math.PI * 2); ctx.fill(); }
  else if (mouth === 'wobbly') { ctx.beginPath(); for (let i = 0; i <= 12; i++) { const X = -18 + i * 3, Y = my + Math.sin(i * 1.3 + t * 25) * 3; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); }
  else if (mouth === 'grin') { ctx.beginPath(); ctx.ellipse(0, my - 2, 22, 14, 0, 0, Math.PI); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-18, my - 2, 36, 5); }
  else if (mouth === 'flat') { ctx.beginPath(); ctx.moveTo(-13, my); ctx.lineTo(13, my); ctx.stroke(); }
  else if (mouth === 'sad') { ctx.beginPath(); ctx.arc(0, my + 12, 14, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); }
  else if (mouth === 'angry') { ctx.beginPath(); ctx.ellipse(0, my + 4, 18, 8 + 6 * Math.abs(Math.sin(t * 20)), 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-14, my - 2, 28, 5); }
  else if (mouth === 'chew') { ctx.beginPath(); ctx.ellipse(0, my, 14, 4 + 6 * Math.abs(Math.sin(t * 14)), 0, 0, Math.PI * 2); ctx.fill(); }
  else { ctx.beginPath(); ctx.ellipse(0, my - 2, 16, 4 + talk * 10, 0, 0, Math.PI); ctx.fill(); }
  if (e.blush) { ctx.fillStyle = 'rgba(255,90,90,0.35)'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 36, hy + 20, 12, 7, 0, 0, Math.PI * 2); ctx.fill(); } }
  // brazos
  for (const sx of [-1, 1]) {
    const gest = sx > 0 ? (talk ? Math.sin(t * 6) * 30 : Math.sin(t * 2) * 8) : (e.walk ? -walk * 20 : 0);
    let [hx, hy2] = [sx * lerp(95, 62, sh), lerp(-185 - gest, -420, sh)];
    const ov = sx < 0 ? e.handL : e.handR; if (ov) [hx, hy2] = ov;
    ctx.strokeStyle = coat ? (sx > 0 ? '#dfe6ef' : '#f4f7fb') : (sx > 0 ? shirtD : shirt); ctx.lineWidth = 26; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(sx * 52, -320); ctx.quadraticCurveTo(sx * Math.max(Math.abs(hx) + 40, 100), (-320 + hy2) / 2 + 30, hx, hy2); ctx.stroke();
    ctx.fillStyle = sx > 0 ? skinD : skin; ctx.beginPath(); ctx.arc(hx, hy2, 22, 0, Math.PI * 2); ctx.fill();
    if (sx > 0 && e.hold) heldObject2(ctx, e, hx, hy2);
    if (sx < 0 && e.holdL) heldObject2(ctx, Object.assign({}, e, { hold: e.holdL }), hx, hy2);
  }
  ctx.restore();
}
function heldObject2(ctx, e, hx, hy) {
  const k = e.hold;
  if (k === 'phone') drawPhone(ctx, hx + 6, hy - 40, e.t);
  else if (k === 'coffee') drawCoffee(ctx, hx + 10, hy - 18, e.t, 0.85);
  else if (k === 'book') { ctx.save(); ctx.translate(hx, hy - 30); ctx.rotate(-0.1); ctx.fillStyle = '#e63946'; ctx.fillRect(-55, -40, 110, 80); ctx.fillStyle = '#fff'; ctx.fillRect(-48, -34, 96, 68); ctx.fillStyle = '#ccc'; for (let i = 0; i < 5; i++) ctx.fillRect(-40, -26 + i * 12, 80, 5); ctx.restore(); }
  else if (k === 'wine') { ctx.save(); ctx.translate(hx, hy - 30); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.moveTo(-22, -45); ctx.lineTo(22, -45); ctx.quadraticCurveTo(22, 0, 0, 2); ctx.quadraticCurveTo(-22, 0, -22, -45); ctx.fill(); ctx.fillStyle = '#9d0208'; ctx.beginPath(); ctx.moveTo(-20, -25); ctx.lineTo(20, -25); ctx.quadraticCurveTo(20, 0, 0, 0); ctx.quadraticCurveTo(-20, 0, -20, -25); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fillRect(-3, 2, 6, 30); ctx.fillRect(-16, 30, 32, 5); ctx.restore(); }
  else if (k === 'burger') foodIcon(ctx, 'burger', hx, hy - 30, 0.7, 0);
  else if (k === 'wrench') { ctx.save(); ctx.translate(hx, hy - 20); ctx.rotate(-0.6 + Math.sin(e.t * 8) * 0.3); ctx.fillStyle = '#adb5bd'; ctx.fillRect(-8, -80, 16, 90); ctx.beginPath(); ctx.arc(0, -85, 24, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = FLAT.bg1; ctx.fillRect(-8, -112, 16, 30); ctx.restore(); }
}
const LEO = PEOPLE.leo;
function leo(ctx, x, y, s, e) { drawPerson(ctx, x, y, s, e, LEO); }
// expresión base con parpadeo
function E(t, extra = {}) { const c = (t * 0.42 + 0.3) % 1; return Object.assign({ t, open: c < 0.045 ? Math.abs(c / 0.0225 - 1) : 1 }, extra); }
// boca que "habla" (para personajes que hablan en pantalla)
function talking(t) { return Math.abs(Math.sin(t * 11)) * (Math.sin(t * 2.3) > -0.3 ? 1 : 0); }

// ---------- objetos ----------
function foodIcon(ctx, kind, x, y, s = 1, rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (kind === 'burger') {
    ctx.fillStyle = '#f4a261'; ctx.beginPath(); ctx.ellipse(0, -25, 70, 40, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#fff'; for (const [a, b] of [[-30, -45], [0, -52], [28, -44], [-10, -35]]) { ctx.beginPath(); ctx.ellipse(a, b, 5, 3, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#80b918'; ctx.fillRect(-75, -28, 150, 12); ctx.fillStyle = '#ffd60a'; ctx.fillRect(-70, -18, 140, 10);
    ctx.fillStyle = '#6f1d1b'; rrect(ctx, -72, -10, 144, 26, 13); ctx.fill(); ctx.fillStyle = '#f4a261'; rrect(ctx, -68, 14, 136, 24, 12); ctx.fill();
  } else if (kind === 'fries') {
    ctx.fillStyle = '#ffd60a'; for (let i = -3; i <= 3; i++) { ctx.save(); ctx.rotate(i * 0.08); ctx.fillRect(i * 13 - 6, -85, 12, 70); ctx.restore(); }
    ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.moveTo(-50, -30); ctx.lineTo(50, -30); ctx.lineTo(38, 40); ctx.lineTo(-38, 40); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 5, 14, 0, Math.PI * 2); ctx.fill();
  } else if (kind === 'donut') {
    ctx.fillStyle = '#e9c46a'; ctx.beginPath(); ctx.arc(0, 0, 55, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ff8fab'; ctx.beginPath(); ctx.arc(0, -3, 48, 0, Math.PI * 2); ctx.fill();
    const r = rng(3); for (let i = 0; i < 12; i++) { ctx.fillStyle = ['#fff', '#ffd23f', '#5ee0c0', '#7cc6ff'][i % 4]; ctx.save(); const a = r() * 6.28, d = 25 + r() * 18; ctx.translate(Math.cos(a) * d, Math.sin(a) * d - 3); ctx.rotate(r() * 3); ctx.fillRect(-6, -2, 12, 4); ctx.restore(); }
    ctx.fillStyle = 'rgba(0,0,0,0.0)'; ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fillStyle = '#000'; ctx.fill(); ctx.globalCompositeOperation = 'source-over';
  } else if (kind === 'candy') {
    ctx.fillStyle = '#9b5de5'; ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-75, -25); ctx.lineTo(-75, 25); ctx.fill(); ctx.beginPath(); ctx.moveTo(40, 0); ctx.lineTo(75, -25); ctx.lineTo(75, 25); ctx.fill();
    ctx.fillStyle = '#f15bb5'; ctx.beginPath(); ctx.ellipse(0, 0, 45, 32, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fillRect(-20, -32, 12, 64);
  } else if (kind === 'pizza') {
    ctx.fillStyle = '#f4a261'; ctx.beginPath(); ctx.moveTo(-60, -50); ctx.lineTo(60, -50); ctx.lineTo(0, 70); ctx.fill();
    ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.moveTo(-50, -38); ctx.lineTo(50, -38); ctx.lineTo(0, 58); ctx.fill();
    ctx.fillStyle = '#d62828'; for (const [a, b] of [[-20, -20], [15, -15], [0, 15]]) { ctx.beginPath(); ctx.arc(a, b, 11, 0, Math.PI * 2); ctx.fill(); }
  } else if (kind === 'salad') {
    ctx.fillStyle = '#80b918'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(-35 + i * 14, -25 - (i % 2) * 10, 22, 14, i, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.arc(10, -30, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, -10, 60, 40, 0, 0, Math.PI); ctx.fill();
  }
  ctx.restore();
}
// molécula con carita (adenosina, cafeína)
function molecule(ctx, x, y, r, kind, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(o.rot || 0);
  if (kind === 'adenosina') {
    ctx.fillStyle = '#8b7bff'; ctx.beginPath();
    for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r); } ctx.fill();
    ctx.fillStyle = '#b5a8ff'; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.2, 0, Math.PI * 2); ctx.fill();
    // cara somnolienta
    ctx.strokeStyle = FLAT.ink; ctx.lineWidth = r * 0.09; ctx.lineCap = 'round';
    for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * r * 0.3, -r * 0.05, r * 0.14, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke(); }
    if (o.sad) { ctx.beginPath(); ctx.arc(0, r * 0.45, r * 0.15, 1.1 * Math.PI, 1.9 * Math.PI); ctx.stroke(); }
    else { ctx.beginPath(); ctx.ellipse(0, r * 0.32, r * 0.1, r * 0.08 + Math.abs(Math.sin(t * 2)) * r * 0.06, 0, 0, Math.PI * 2); ctx.stroke(); }
  } else if (kind === 'cafeina') {
    ctx.fillStyle = '#7f4f24'; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.8, r, 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#5c3a1a'; ctx.lineWidth = r * 0.1; ctx.beginPath(); ctx.moveTo(-r * 0.3, -r * 0.8); ctx.quadraticCurveTo(r * 0.3, 0, -r * 0.1, r * 0.85); ctx.stroke();
    // lentes oscuros + sonrisa traviesa
    ctx.fillStyle = FLAT.ink; for (const sx of [-1, 1]) { rrect(ctx, sx * r * 0.42 - r * 0.25, -r * 0.3, r * 0.5, r * 0.3, r * 0.1); ctx.fill(); }
    ctx.fillRect(-r * 0.2, -r * 0.22, r * 0.4, r * 0.07);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = r * 0.08; ctx.beginPath(); ctx.arc(0, r * 0.2, r * 0.25, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  }
  if (o.label) text(ctx, o.label, 0, r + 30, { size: 32, fill: '#fff' });
  ctx.restore();
}
function receptor(ctx, x, y, w = 110, full = false) {
  ctx.fillStyle = full ? '#5ee0c0' : '#ff8fab';
  ctx.beginPath(); ctx.moveTo(x - w / 2, y); ctx.lineTo(x - w / 2, y - 60); ctx.lineTo(x - w / 2 + 22, y - 60); ctx.lineTo(x - w / 2 + 22, y - 18); ctx.lineTo(x + w / 2 - 22, y - 18); ctx.lineTo(x + w / 2 - 22, y - 60); ctx.lineTo(x + w / 2, y - 60); ctx.lineTo(x + w / 2, y); ctx.fill();
}
function brain(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + Math.sin(t * 2) * 0.01), s);
  const base = o.color || '#ff9fb2', dark = o.dark || '#f07a93';
  ctx.fillStyle = dark; ctx.beginPath(); ctx.ellipse(40, 120, 70, 50, 0.3, 0, Math.PI * 2); ctx.fill(); // cerebelo
  ctx.fillStyle = '#e8687f'; ctx.fillRect(-10, 110, 40, 90);
  ctx.fillStyle = base;
  const lobes = [[-120, -20, 110], [-40, -90, 115], [70, -80, 110], [140, 10, 100], [80, 70, 100], [-30, 50, 110], [-140, 60, 80]];
  ctx.beginPath(); for (const [a, b, r] of lobes) { ctx.moveTo(a + r, b); ctx.arc(a, b, r, 0, Math.PI * 2); } ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = 14; ctx.lineCap = 'round';
  const folds = [[-180, -10, -120, -60, -60, -20], [-60, -150, -20, -90, 30, -140], [60, -30, 120, -60, 170, -20], [-120, 60, -60, 20, 0, 70], [40, 40, 100, 10, 160, 60], [-20, -40, 0, 0, 40, -30]];
  for (const [a, b, c, d, e2, f] of folds) { ctx.beginPath(); ctx.moveTo(a, b); ctx.quadraticCurveTo(c, d, e2, f); ctx.stroke(); }
  if (o.face !== false) { // carita del cerebro
    const sl = o.sleepy || 0, ex = o.eyesX || 0;
    ctx.fillStyle = FLAT.ink;
    for (const sx of [-1, 1]) {
      if (sl > 0.5) { ctx.strokeStyle = FLAT.ink; ctx.lineWidth = 9; ctx.beginPath(); ctx.arc(sx * 55 + ex, -10, 18, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke(); }
      else { ctx.beginPath(); ctx.ellipse(sx * 55 + ex, -10, 14, 20 * (1 - sl), 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sx * 55 + ex - 4, -18, 5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = FLAT.ink; }
    }
    ctx.strokeStyle = FLAT.ink; ctx.lineWidth = 8;
    ctx.beginPath(); if (o.happy) ctx.arc(0, 25, 26, 0.15 * Math.PI, 0.85 * Math.PI); else if (o.worried) ctx.arc(0, 55, 20, 1.15 * Math.PI, 1.85 * Math.PI); else { ctx.moveTo(-18, 40); ctx.lineTo(18, 40); } ctx.stroke();
  }
  ctx.restore();
}
function neuron(ctx, x, y, s, t, color = '#ffd23f', seed = 1) {
  const r = rng(seed); ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = color; ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const a = i / 6 * Math.PI * 2 + r() * 0.5, L = 70 + r() * 60;
    ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(0, 0);
    const mx = Math.cos(a) * L * 0.5 + Math.sin(t + i) * 6, my = Math.sin(a) * L * 0.5 + Math.cos(t + i) * 6;
    ctx.quadraticCurveTo(mx, my, Math.cos(a) * L, Math.sin(a) * L); ctx.stroke();
    ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * L, Math.sin(a) * L); ctx.lineTo(Math.cos(a + 0.4) * (L + 25), Math.sin(a + 0.4) * (L + 25)); ctx.moveTo(Math.cos(a) * L, Math.sin(a) * L); ctx.lineTo(Math.cos(a - 0.4) * (L + 25), Math.sin(a - 0.4) * (L + 25)); ctx.stroke();
  }
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 0, 38, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(-10, -10, 14, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function virus(ctx, x, y, r, t, color = '#80ed99') {
  ctx.save(); ctx.translate(x, y); ctx.rotate(t * 0.8);
  ctx.strokeStyle = color; ctx.lineWidth = r * 0.14; ctx.fillStyle = color;
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); ctx.lineTo(Math.cos(a) * r * 1.4, Math.sin(a) * r * 1.4); ctx.stroke(); ctx.beginPath(); ctx.arc(Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.45, r * 0.13, 0, Math.PI * 2); ctx.fill(); }
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.rotate(-t * 0.8); ctx.fillStyle = FLAT.ink;
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * r * 0.55, -r * 0.35); ctx.lineTo(sx * r * 0.12, -r * 0.15); ctx.lineTo(sx * r * 0.5, -r * 0.05); ctx.fill(); }
  ctx.beginPath(); ctx.arc(0, r * 0.3, r * 0.25, 0, Math.PI); ctx.fill();
  ctx.restore();
}
function defender(ctx, x, y, r, t, sleepy = 0) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 3 + x) * 5);
  ctx.fillStyle = '#f1faee'; ctx.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, rr = r * (1 + 0.06 * Math.sin(t * 4 + i * 2)); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.fill();
  ctx.fillStyle = '#a8dadc'; ctx.beginPath(); ctx.arc(r * 0.2, r * 0.25, r * 0.35, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = FLAT.ink; ctx.strokeStyle = FLAT.ink; ctx.lineWidth = r * 0.08; ctx.lineCap = 'round';
  for (const sx of [-1, 1]) {
    if (sleepy > 0.5) { ctx.beginPath(); ctx.arc(sx * r * 0.3, -r * 0.15, r * 0.14, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke(); }
    else { ctx.beginPath(); ctx.arc(sx * r * 0.3, -r * 0.15, r * 0.11, 0, Math.PI * 2); ctx.fill(); }
  }
  // casco de soldadito
  ctx.fillStyle = '#457b9d'; ctx.beginPath(); ctx.arc(0, -r * 0.45, r * 0.75, Math.PI, 0); ctx.fill();
  if (sleepy > 0.5) text(ctx, 'z', r * 0.8, -r * 0.9 - Math.abs(Math.sin(t * 2)) * 20, { size: r * 0.6, fill: '#fff', shadow: false, lw: 0 });
  ctx.restore();
}
function gauge(ctx, x, y, r, v, title, color = FLAT.coral, o = {}) {
  ctx.save(); ctx.translate(x, y);
  ctx.lineCap = 'round'; ctx.lineWidth = r * 0.22;
  ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, 0); ctx.stroke();
  ctx.strokeStyle = color; ctx.beginPath(); ctx.arc(0, 0, r, Math.PI, Math.PI + Math.PI * clamp(v)); ctx.stroke();
  if (o.mark != null) { const a = Math.PI + Math.PI * o.mark; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.75, Math.sin(a) * r * 0.75); ctx.lineTo(Math.cos(a) * r * 1.25, Math.sin(a) * r * 1.25); ctx.stroke(); if (o.markLabel) text(ctx, o.markLabel, Math.cos(a) * r * 1.45, Math.sin(a) * r * 1.4, { size: 30, fill: '#fff' }); }
  const a = Math.PI + Math.PI * clamp(v); ctx.strokeStyle = '#fff'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a) * r * 0.8, Math.sin(a) * r * 0.8); ctx.stroke();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 16, 0, Math.PI * 2); ctx.fill();
  if (title) text(ctx, title, 0, 70, { size: 48, fill: '#fff' });
  if (o.value) text(ctx, o.value, 0, -r * 0.4, { size: 70, fill: color });
  ctx.restore();
}
function meterBar(ctx, x, y, w, h, v, title, color = FLAT.purple, t = 0) {
  card(ctx, x, y, w, h, 'rgba(255,255,255,0.12)', 24, false);
  const fh = (h - 16) * clamp(v);
  ctx.save(); rrect(ctx, x + 8, y + 8, w - 16, h - 16, 18); ctx.clip();
  ctx.fillStyle = color; ctx.fillRect(x + 8, y + h - 8 - fh, w - 16, fh);
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath();
  for (let i = 0; i <= 20; i++) { const X = x + 8 + i * (w - 16) / 20, Y = y + h - 8 - fh + Math.sin(i * 0.8 + t * 5) * 6; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
  ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.fill();
  ctx.restore();
  if (title) text(ctx, title, x + w / 2, y - 45, { size: 44, fill: '#fff' });
}
function thermometer(ctx, x, y, v, t) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#fff'; rrect(ctx, -30, -260, 60, 280, 30); ctx.fill(); ctx.beginPath(); ctx.arc(0, 40, 55, 0, Math.PI * 2); ctx.fill();
  const c = mix('#4cc9f0', '#ef476f', v);
  ctx.fillStyle = c; ctx.beginPath(); ctx.arc(0, 40, 42, 0, Math.PI * 2); ctx.fill(); rrect(ctx, -16, 30 - 260 * clamp(v), 32, 260 * clamp(v) + 10, 16); ctx.fill();
  ctx.fillStyle = '#adb5bd'; for (let i = 0; i < 8; i++) ctx.fillRect(18, -230 + i * 30, 16, 5);
  ctx.restore();
}
function calendar(ctx, x, y, s, top, big, color = FLAT.coral, flip = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  card(ctx, -150, -150, 300, 320, '#fff', 30);
  ctx.fillStyle = color; rrect(ctx, -150, -150, 300, 90, 30); ctx.fill(); ctx.fillRect(-150, -90, 300, 30);
  for (const sx of [-1, 1]) { ctx.fillStyle = '#adb5bd'; rrect(ctx, sx * 80 - 10, -175, 20, 50, 10); ctx.fill(); }
  text(ctx, top, 0, -105, { size: 44, fill: '#fff', shadow: false, lw: 0 });
  ctx.fillStyle = FLAT.ink; ctx.font = '150px Lilita'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(big, 0, 50);
  if (flip > 0 && flip < 1) { // hoja que se arranca
    ctx.save(); ctx.translate(0, -60); ctx.rotate(-flip * 1.2); ctx.globalAlpha = 1 - flip; ctx.fillStyle = '#f1f3f5'; ctx.fillRect(-150, 0, 300, 230 * (1 - flip * 0.5)); ctx.restore();
  }
  ctx.restore();
}
function iconPerson(ctx, x, y, s, color) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y - 60 * s, 22 * s, 0, Math.PI * 2); ctx.fill();
  rrect(ctx, x - 28 * s, y - 32 * s, 56 * s, 62 * s, 20 * s); ctx.fill();
}
function questionMarks(ctx, t, x, y, n = 3, color = '#fff') {
  for (let i = 0; i < n; i++) { const a = t * 2 + i * 2.1; text(ctx, '?', x + Math.cos(a) * 90, y + Math.sin(a * 1.3) * 30 - i * 10, { size: 70 + i * 10, fill: color }); }
}
function zzz(ctx, t, x, y, color = '#b9a8ff') {
  for (let i = 0; i < 3; i++) { const p = (t * 0.6 + i / 3) % 1; ctx.globalAlpha = Math.sin(p * Math.PI); text(ctx, 'Z', x + p * 80 + Math.sin(p * 6) * 10, y - p * 160, { size: 40 + p * 50, fill: color }); }
  ctx.globalAlpha = 1;
}
function drawCar(ctx, x, y, s, t, color = FLAT.coral, speed = 1) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 20) * 2 * speed); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(0, 70, 260, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = color; rrect(ctx, -260, -40, 520, 110, 40); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-150, -40); ctx.quadraticCurveTo(-110, -150, 0, -150); ctx.lineTo(90, -150); ctx.quadraticCurveTo(150, -150, 190, -40); ctx.fill();
  ctx.fillStyle = '#bde0fe'; ctx.beginPath(); ctx.moveTo(-120, -45); ctx.quadraticCurveTo(-95, -130, -10, -130); ctx.lineTo(-10, -45); ctx.fill();
  ctx.beginPath(); ctx.moveTo(10, -45); ctx.lineTo(10, -130); ctx.lineTo(85, -130); ctx.quadraticCurveTo(135, -130, 165, -45); ctx.fill();
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.ellipse(250, 0, 16, 22, 0, 0, Math.PI * 2); ctx.fill();
  for (const wx of [-160, 160]) {
    ctx.save(); ctx.translate(wx, 70); ctx.rotate(t * 12 * speed);
    ctx.fillStyle = '#2b2d42'; ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#adb5bd'; ctx.beginPath(); ctx.arc(0, 0, 24, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#2b2d42'; ctx.fillRect(-4, -24, 8, 48); ctx.restore();
  }
  ctx.restore();
}
function road(ctx, t, speed, y = 820, day = 1) {
  const g = ctx.createLinearGradient(0, 0, 0, y); g.addColorStop(0, mix('#1d2b64', '#8ecae6', day)); g.addColorStop(1, mix('#4a4e9a', '#ffd6a5', day));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, y);
  const off = t * speed;
  // montañas lejanas y árboles (paralaje)
  ctx.fillStyle = mix('#2b2d6e', '#90be6d', day * 0.8);
  for (let i = -1; i < 8; i++) { const x = ((i * 320 - off * 0.15) % 2240 + 2240) % 2240 - 160; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 180, y - 260 - (i % 3) * 60); ctx.lineTo(x + 360, y); ctx.fill(); }
  for (let i = -1; i < 12; i++) {
    const x = ((i * 220 - off * 0.6) % 2420 + 2420) % 2420 - 110;
    ctx.fillStyle = '#6d4c41'; ctx.fillRect(x - 10, y - 90, 20, 90);
    ctx.fillStyle = mix('#1b4332', '#52b788', day); ctx.beginPath(); ctx.arc(x, y - 120, 60, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#3d405b'; ctx.fillRect(0, y, W, H - y);
  ctx.fillStyle = '#f2cc8f'; for (let i = -1; i < 12; i++) { const x = ((i * 220 - off) % 2420 + 2420) % 2420 - 110; ctx.fillRect(x, y + 120, 120, 14); }
}
function desk(ctx, x, y, w = 700) {
  ctx.fillStyle = '#b08968'; rrect(ctx, x - w / 2, y, w, 40, 12); ctx.fill();
  ctx.fillStyle = '#9c6644'; ctx.fillRect(x - w / 2 + 30, y + 40, 30, 200); ctx.fillRect(x + w / 2 - 60, y + 40, 30, 200);
}
function lamp(ctx, x, y, t, on = 1) {
  if (on) { const g = ctx.createRadialGradient(x, y + 80, 10, x, y + 120, 380); g.addColorStop(0, `rgba(255,230,150,${0.35 * on})`); g.addColorStop(1, 'rgba(255,230,150,0)'); ctx.fillStyle = g; ctx.fillRect(x - 400, y - 200, 800, 700); }
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(x - 60, y + 40); ctx.lineTo(x + 60, y + 40); ctx.lineTo(x + 30, y - 30); ctx.lineTo(x - 30, y - 30); ctx.fill();
  ctx.fillStyle = '#6c757d'; ctx.fillRect(x - 6, y + 40, 12, 120); ctx.fillRect(x - 50, y + 160, 100, 14);
}
function laptop(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#adb5bd'; rrect(ctx, -170, -220, 340, 220, 16); ctx.fill();
  const g = ctx.createLinearGradient(0, -205, 0, -15); g.addColorStop(0, '#4361ee'); g.addColorStop(1, '#7209b7');
  ctx.fillStyle = g; ctx.fillRect(-155, -205, 310, 190);
  // "serie" reproduciéndose
  ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.moveTo(-20, -140); ctx.lineTo(30, -110); ctx.lineTo(-20, -80); ctx.fill();
  ctx.fillStyle = '#ef476f'; ctx.fillRect(-140, -32, 280 * ((t * 0.05) % 1), 8);
  ctx.fillStyle = '#ced4da'; rrect(ctx, -200, 0, 400, 22, 10); ctx.fill();
  ctx.restore();
}
function streetSign(ctx, x, y, s, morph, t) { // letrero que "se convierte" en persona
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#6c757d'; ctx.fillRect(-8, -300, 16, 300);
  ctx.save(); ctx.translate(0, -300); ctx.rotate(Math.sin(t * 3) * 0.05 * morph);
  ctx.fillStyle = mix('#2a9d8f', '#e9c46a', morph); rrect(ctx, -110, -60, 220, 90, 18); ctx.fill();
  if (morph < 0.5) text(ctx, 'STOP', 0, -15, { size: 54, fill: '#fff', shadow: false, lw: 0 });
  else { // cara que aparece en el letrero
    ctx.fillStyle = FLAT.ink; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 35, -25, 10, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = FLAT.ink; ctx.lineWidth = 7; ctx.beginPath(); ctx.arc(0, -5, 22, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
    // bracitos saludando
    ctx.strokeStyle = '#6c757d'; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(0, 90); ctx.lineTo(-80, 40 + Math.sin(t * 8) * 20); ctx.moveTo(0, 90); ctx.lineTo(80, 50); ctx.stroke();
  }
  ctx.restore(); ctx.restore();
}
function recordBook(ctx, x, y, s, t, stamp = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.08);
  ctx.fillStyle = '#1d3557'; rrect(ctx, -170, -220, 340, 440, 20); ctx.fill();
  ctx.fillStyle = '#ffd23f'; rrect(ctx, -140, -190, 280, 120, 14); ctx.fill();
  text(ctx, 'LIBRO DE', 0, -150, { size: 40, fill: FLAT.ink, shadow: false, lw: 0 }); text(ctx, 'RÉCORDS', 0, -105, { size: 48, fill: FLAT.ink, shadow: false, lw: 0 });
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 40 : 90; ctx.lineTo(Math.cos(a) * r, 60 + Math.sin(a) * r); } ctx.fill();
  ctx.restore();
  const sp = pop(t, stamp, 0.4);
  if (stamp && sp > 0) {
    ctx.save(); ctx.translate(x + 20, y + 20); ctx.rotate(-0.3); ctx.scale(sp * s, sp * s);
    ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 14; rrect(ctx, -230, -70, 460, 140, 20); ctx.stroke();
    text(ctx, 'PROHIBIDO', 0, 0, { size: 96, fill: '#ef233c', stroke: '#ef233c', lw: 0, shadow: false });
    ctx.restore();
  }
}
function rat(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
  const run = o.run ? Math.sin(t * 18) : 0;
  ctx.strokeStyle = '#ffb4c2'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-90, 0); ctx.quadraticCurveTo(-170, -10 + Math.sin(t * 4) * 20, -200, -60); ctx.stroke();
  ctx.fillStyle = '#f1f3f5'; ctx.beginPath(); ctx.ellipse(0, -30, 100, 60, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(90, -50, 55, 42, -0.3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffb4c2'; ctx.beginPath(); ctx.arc(75, -100, 24, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(140, -40, 10, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = FLAT.ink; const op = o.sleepy ? 0.2 : 1; ctx.beginPath(); ctx.ellipse(105, -60, 7, 9 * op + 0.5, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#ffb4c2'; for (const lx of [-50, 40]) { ctx.beginPath(); ctx.ellipse(lx + run * 15, 25, 20, 10, 0, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}
function dna(ctx, x, y, h, t, c1 = FLAT.coral, c2 = FLAT.sky) {
  for (let i = 0; i < 18; i++) {
    const yy = y - h / 2 + i * h / 18, a = t * 2 + i * 0.5, w = Math.sin(a) * 90;
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x - w, yy); ctx.lineTo(x + w, yy); ctx.stroke();
    ctx.fillStyle = Math.cos(a) > 0 ? c1 : c2; ctx.beginPath(); ctx.arc(x - w, yy, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = Math.cos(a) > 0 ? c2 : c1; ctx.beginPath(); ctx.arc(x + w, yy, 14, 0, Math.PI * 2); ctx.fill();
  }
}
function lineChart(ctx, x, y, w, h, t, st, dur, series) {
  if (Array.isArray(dur)) { series = dur; dur = 3; }
  card(ctx, x, y, w, h, 'rgba(255,255,255,0.1)', 30, false);
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(x + 60, y + 40); ctx.lineTo(x + 60, y + h - 50); ctx.lineTo(x + w - 40, y + h - 50); ctx.stroke();
  const p = ease.inOut(prog(t, st, st + dur));
  series.forEach(({ f, color, name }, k) => {
    ctx.strokeStyle = color; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    const n = 40; let lx = 0, ly = 0;
    for (let i = 0; i <= n * p; i++) { const u = i / n; lx = x + 60 + u * (w - 120); ly = y + h - 50 - f(u) * (h - 120); i ? ctx.lineTo(lx, ly) : ctx.moveTo(lx, ly); }
    ctx.stroke();
    if (p > 0.05) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(lx, ly, 16, 0, Math.PI * 2); ctx.fill(); text(ctx, name, lx - 10, ly - 50, { size: 40, fill: color, align: 'right' }); }
  });
}
function lungs(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (1 + Math.sin(t * 2) * 0.05), s * (1 + Math.sin(t * 2) * 0.05));
  ctx.fillStyle = '#ff8fab'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 55, 10, 45, 80, sx * 0.15, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#f07a93'; ctx.fillRect(-8, -90, 16, 70); ctx.restore();
}
function bedIcon(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#8b5e3c'; rrect(ctx, -110, -90, 30, 140, 10); ctx.fill(); ctx.fillRect(-110, 20, 220, 30);
  ctx.fillStyle = '#6c63ff'; rrect(ctx, -80, -20, 190, 50, 14); ctx.fill(); ctx.fillStyle = '#fff'; rrect(ctx, -78, -45, 60, 30, 12); ctx.fill();
  ctx.restore();
}
function waterDrop(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s * (1 + Math.sin(t * 4) * 0.04));
  ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.moveTo(0, -120); ctx.bezierCurveTo(60, -40, 80, 0, 80, 30); ctx.arc(0, 30, 80, 0, Math.PI); ctx.bezierCurveTo(-80, 0, -60, -40, 0, -120); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.ellipse(-30, 20, 14, 28, 0.3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// Filtro retro: sepia + grano + parpadeo + viñeta (para la historia de 1964)
function retroOverlay(ctx, t) {
  const r = rng(Math.floor(t * 24) + 3);
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(255,220,170,0.35)'; ctx.fillRect(0, 0, W, H); ctx.restore();
  ctx.fillStyle = `rgba(255,240,210,${0.04 + r() * 0.05})`; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(40,20,0,0.25)'; for (let i = 0; i < 140; i++) ctx.fillRect(r() * W, r() * H, 2 + r() * 3, 2 + r() * 3);
  if (r() > 0.7) { ctx.fillStyle = 'rgba(40,20,0,0.25)'; ctx.fillRect(r() * W, 0, 2, H); }
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(40,20,0,0.65)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}
function vignette(ctx, a = 0.5) {
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(10,5,30,${a})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}

// ================= SUBTÍTULOS DINÁMICOS (karaoke) =================
// sents: [{a, b, text}] en tiempo global. Divide cada frase en grupos de 2-4 palabras
// y reparte el tiempo según el largo de cada palabra.
function buildCaptions(sents) {
  const caps = [];
  for (const s of sents) {
    const words = s.text.replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
    const weights = words.map(w => w.replace(/[^\wáéíóúñü]/gi, '').length + 2);
    const total = weights.reduce((x, y) => x + y, 0), dur = Math.max(0.3, s.b - s.a);
    let acc = 0; let times = weights.map(wt => { const st = s.a + dur * acc / total; acc += wt; return [st, s.a + dur * acc / total]; });
    if (s.words && s.words.length === words.length) times = s.words.map(w => [w[1], w[2]]); // tiempos reales por palabra
    let cur = [], len = 0;
    const flush = () => { if (cur.length) { caps.push({ a: times[cur[0]][0], b: times[cur[cur.length - 1]][1], words: cur.map(i => ({ w: words[i], a: times[i][0] })) }); cur = []; len = 0; } };
    words.forEach((w, i) => {
      if (cur.length && (len + w.length > 17 || cur.length >= 4)) flush();
      cur.push(i); len += w.length + 1;
      if (/[,.;:!?…]$/.test(w) && len > 6) flush();
    });
    flush();
  }
  // cada grupo se queda en pantalla hasta que empieza el siguiente (máx. 0.6 s extra)
  caps.forEach((c, i) => { const next = caps[i + 1]; c.end = next ? Math.min(next.a, c.b + 0.6) : c.b + 0.6; });
  return caps;
}
function drawCaptions(ctx, t, caps, y = H - 92) {
  let lo = 0, hi = caps.length - 1, idx = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (caps[m].a <= t) { idx = m; lo = m + 1; } else hi = m - 1; }
  if (idx < 0) return; const c = caps[idx]; if (t > c.end) return;
  const size = 74; ctx.font = `${size}px Lilita`;
  const parts = c.words.map(o => ({ ...o, w: o.w.toUpperCase(), width: 0 }));
  const space = size * 0.28; parts.forEach(p => p.width = ctx.measureText(p.w).width);
  const total = parts.reduce((x, p) => x + p.width, 0) + space * (parts.length - 1);
  const s = 0.6 + 0.4 * ease.back(prog(t, c.a, c.a + 0.22));
  ctx.save(); ctx.translate(W / 2, y); ctx.scale(s, s); ctx.rotate(Math.sin(c.a * 7) * 0.015);
  ctx.fillStyle = 'rgba(18,12,40,0.62)'; rrect(ctx, -total / 2 - 34, -size * 0.72, total + 68, size * 1.45, 26); ctx.fill();
  let x = -total / 2;
  parts.forEach((p, i) => {
    const active = t >= p.a && (i === parts.length - 1 || t < parts[i + 1].a);
    const loud = p.w.length > 2 && p.w === c.words[i].w; // palabra que ya venía en MAYÚSCULAS (énfasis)
    const fill = active ? FLAT.accent : loud ? '#ff8fab' : '#ffffff';
    const bump = active ? 1 + 0.12 * Math.sin(clamp((t - p.a) / 0.18) * Math.PI) : 1;
    ctx.save(); ctx.translate(x + p.width / 2, 0); ctx.scale(bump, bump);
    text(ctx, p.w, 0, 2, { size, fill, lw: size * 0.14 });
    ctx.restore(); x += p.width + space;
  });
  ctx.restore();
}
// Golpe de cámara al inicio de cada frase + movimiento lento constante
function cameraFor(t, sentStarts) {
  let k = 0, lo = 0, hi = sentStarts.length - 1, idx = -1;
  while (lo <= hi) { const m = (lo + hi) >> 1; if (sentStarts[m] <= t) { idx = m; lo = m + 1; } else hi = m - 1; }
  if (idx >= 0) { const p = (t - sentStarts[idx]) / 0.45; if (p < 1) k = Math.sin(p * Math.PI) * (1 - p * 0.5); }
  const dir = idx % 2 ? 1 : -1;
  return { zoom: 1.03 + 0.02 * Math.sin(t * 0.21) + 0.035 * k, rot: dir * 0.006 * k + 0.004 * Math.sin(t * 0.17), dx: 14 * Math.sin(t * 0.13), dy: 9 * Math.cos(t * 0.11) };
}
