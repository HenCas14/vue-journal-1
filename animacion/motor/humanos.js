// Propuestas de personaje humano, cada una en un estilo de animación distinto.
// Todas trabajan en un panel de 960×540. e = { t, open, shock (0-1), look:[x,y], talk (0-1) }

// ===================== A) CARICATURA REDONDA (contorno grueso) — "Sofi" =====================
function bgCaricatura(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, 540); g.addColorStop(0, '#ffd166'); g.addColorStop(1, '#ff8a5b');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 960, 540);
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  for (let y = -60; y < 600; y += 60) for (let x = -60; x < 1020; x += 60) {
    const ox = (x + t * 30) % 1020 - 30, oy = (y + t * 30 + (x / 60 % 2) * 30) % 600 - 30;
    ctx.beginPath(); ctx.arc(ox, oy, 8 + 3 * Math.sin(t * 3 + x * 0.05), 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = '#e85d3a'; ctx.beginPath(); ctx.ellipse(480, 560, 600, 90, 0, 0, Math.PI * 2); ctx.fill();
}
function drawSofi(ctx, x, y, s, e) {
  const t = e.t, sh = clamp(e.shock || 0), bob = Math.abs(Math.sin(t * 3)) * -6 - sh * 25;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.ellipse(0, 4, 90, 14, 0, 0, Math.PI * 2); ctx.fill();
  for (const sx of [-1, 1]) { // piernas y tenis
    limb(ctx, [[sx * 28, -80 + bob], [sx * 30, -10]], '#ffcfa8', 22);
    ctx.beginPath(); ctx.ellipse(sx * 34, -6, 30, 15, 0, 0, Math.PI * 2); fillStroke(ctx, '#ffffff', 6);
  }
  ctx.translate(0, bob);
  rrect(ctx, -58, -100, 116, 40, 14); fillStroke(ctx, '#4361ee', 7); // short
  // brazos
  for (const sx of [-1, 1]) {
    const wave = sx > 0 && !sh ? Math.sin(t * 5) * 18 : 0;
    const hand = [sx * lerp(85, 95, sh), lerp(-70, -230, sh) + wave];
    limb(ctx, [[sx * 50, -160], [sx * lerp(80, 110, sh), lerp(-120, -190, sh)], hand], '#ffcfa8', 20);
    ctx.beginPath(); ctx.arc(hand[0], hand[1], 15, 0, Math.PI * 2); fillStroke(ctx, '#ffcfa8', 6);
  }
  ctx.beginPath(); ctx.moveTo(-55, -180); ctx.quadraticCurveTo(0, -195, 55, -180); ctx.lineTo(62, -95); ctx.lineTo(-62, -95); ctx.closePath(); fillStroke(ctx, '#3fc1c9', 7);
  ctx.fillStyle = '#fff'; ctx.font = '40px Lilita'; ctx.textAlign = 'center'; ctx.fillText('★', 0, -122);
  // cabeza
  const hy = -270;
  ctx.save(); ctx.translate(95, hy - 40); ctx.rotate(0.5 + Math.sin(t * 4) * 0.25 + sh * 0.6); // cola de caballo
  ctx.beginPath(); ctx.ellipse(40, 0, 55, 30, 0.3, 0, Math.PI * 2); fillStroke(ctx, '#4a2617', 7); ctx.restore();
  ctx.beginPath(); ctx.arc(0, hy - 5, 112, 0, Math.PI * 2); fillStroke(ctx, '#4a2617', 8);
  ctx.beginPath(); ctx.ellipse(0, hy + 10, 100, 95, 0, 0, Math.PI * 2); fillStroke(ctx, '#ffcfa8', 7);
  // fleco
  ctx.beginPath(); ctx.moveTo(-108, hy); ctx.quadraticCurveTo(-100, hy - 110, 0, hy - 112); ctx.quadraticCurveTo(105, hy - 110, 108, hy);
  ctx.quadraticCurveTo(70, hy - 45, 30, hy - 60); ctx.quadraticCurveTo(0, hy - 30, -30, hy - 60); ctx.quadraticCurveTo(-70, hy - 40, -108, hy); ctx.closePath();
  fillStroke(ctx, '#5c3020', 7);
  ctx.beginPath(); ctx.arc(85, hy - 65, 16, 0, Math.PI * 2); fillStroke(ctx, '#ff5d8f', 5); // moño
  cuteEye(ctx, -40, hy + 8, 27, e, { iris: '#3a2412', iris2: '#8a5a2a' }); cuteEye(ctx, 40, hy + 8, 27, e, { iris: '#3a2412', iris2: '#8a5a2a' });
  blush(ctx, -68, hy + 45, 16); blush(ctx, 68, hy + 45, 16);
  cuteMouth(ctx, 0, hy + 52, 44, e);
  ctx.restore();
}

// Utilidades de expresión compartidas por los humanos
// e.extra: red, bags, spiral, eyeSize, pupil, mouth ('smile'|'o'|'yawn'|'wobbly'|'grin'|'flat'|'none'),
//          mouthOpen, frazzle, handL/handR [x,y], hold ('phone'|'coffee'), rot
function heldObject(ctx, e, hx, hy) {
  if (e.hold === 'phone') drawPhone(ctx, hx + 6, hy - 40, e.t);
  if (e.hold === 'coffee') drawCoffee(ctx, hx + 10, hy - 18, e.t, 0.85);
}
function veins(ctx, ex, ey, r, red) {
  if (red < 0.05) return;
  ctx.save(); ctx.beginPath(); ctx.arc(ex, ey, r - 1, 0, Math.PI * 2); ctx.clip();
  ctx.strokeStyle = `rgba(220,40,60,${clamp(red)})`; ctx.lineWidth = Math.max(1.5, r * 0.09); ctx.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.4;
    ctx.beginPath(); ctx.moveTo(ex + Math.cos(a) * r, ey + Math.sin(a) * r);
    ctx.quadraticCurveTo(ex + Math.cos(a + 0.35) * r * 0.7, ey + Math.sin(a + 0.35) * r * 0.7, ex + Math.cos(a) * r * 0.45, ey + Math.sin(a) * r * 0.45); ctx.stroke();
  }
  ctx.restore();
}
function spiralEye(ctx, ex, ey, r, t, dir, color) {
  ctx.strokeStyle = color; ctx.lineWidth = Math.max(2.5, r * 0.16); ctx.beginPath();
  for (let a = 0; a < Math.PI * 6; a += 0.15) { const rr = (a / (Math.PI * 6)) * r, X = ex + Math.cos(a + t * 9 * dir) * rr, Y = ey + Math.sin(a + t * 9 * dir) * rr; a ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
  ctx.stroke();
}

// ===================== B) PLANO MODERNO (sin contornos, geométrico) — "Leo" =====================
function bgPlano(ctx, t) {
  ctx.fillStyle = '#e8f0ff'; ctx.fillRect(0, 0, 960, 540);
  const shapes = [['#ffb4a2', 'c', 120, 120, 70], ['#b8e0d2', 't', 800, 140, 80], ['#ffd6a5', 'r', 760, 400, 60], ['#cdb4db', 'c', 180, 420, 50], ['#a2d2ff', 't', 380, 90, 40], ['#ffc8dd', 'r', 600, 60, 34]];
  shapes.forEach(([c, k, sx, sy, r], i) => {
    ctx.save(); ctx.translate(sx + Math.sin(t * 0.8 + i) * 20, sy + Math.cos(t * 0.7 + i) * 15); ctx.rotate(t * 0.4 * (i % 2 ? 1 : -1));
    ctx.fillStyle = c; ctx.beginPath();
    if (k === 'c') ctx.arc(0, 0, r, 0, Math.PI * 2); else if (k === 't') { ctx.moveTo(0, -r); ctx.lineTo(r, r * 0.8); ctx.lineTo(-r, r * 0.8); } else ctx.rect(-r, -r, r * 2, r * 2);
    ctx.fill(); ctx.restore();
  });
  ctx.fillStyle = '#c9d6f5'; ctx.fillRect(0, 470, 960, 70);
}
function drawLeo(ctx, x, y, s, e) {
  const t = e.t, sh = clamp(e.shock || 0), talk = e.talk || 0, red = e.red || 0, bags = e.bags || 0, fr = e.frazzle || 0;
  const SK = '#a86b3c', SKd = '#8d5630', SH = '#2f6fde', SHd = '#2558b8', HAIR = '#1b1b1b';
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(e.rot || 0);
  ctx.fillStyle = 'rgba(30,40,90,0.12)'; ctx.beginPath(); ctx.ellipse(0, 2, 80, 10, 0, 0, Math.PI * 2); ctx.fill();
  const step = e.inBed ? 0 : Math.sin(t * 3) * 4 - sh * 20;
  ctx.fillStyle = '#1f2a44'; ctx.fillRect(-32, -175 + step, 26, 170 - step); ctx.fillRect(6, -175 + step, 26, 170 - step);
  ctx.fillStyle = '#ffffff'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 22, -6, 26, 10, 0, Math.PI, 0); ctx.fill(); }
  ctx.translate(0, step);
  ctx.fillStyle = SH; rrect(ctx, -62, -340, 124, 175, 30); ctx.fill();
  ctx.fillStyle = SHd; ctx.save(); rrect(ctx, -62, -340, 124, 175, 30); ctx.clip(); ctx.fillRect(15, -340, 60, 175); ctx.restore();
  ctx.fillStyle = SK; ctx.fillRect(-14, -365, 28, 30);
  // cabeza (antes que los brazos, para que las manos queden delante)
  const hy = -425 - sh * 10;
  ctx.fillStyle = SK; ctx.beginPath(); ctx.ellipse(0, hy, 55, 66, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = SKd; ctx.beginPath(); ctx.ellipse(52, hy + 5, 12, 18, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = HAIR;
  for (let i = 0; i < 9; i++) {
    const a = Math.PI * (1.05 + i * 0.11), jr = fr * (6 + 4 * Math.sin(t * 30 + i * 2));
    ctx.beginPath(); ctx.arc(Math.cos(a) * (52 + fr * 10), hy - 18 + Math.sin(a) * (52 + fr * 12), 22 + sh * 6 + jr, 0, Math.PI * 2); ctx.fill();
  }
  const [lx, ly] = e.look || [0, 0], op = clamp(e.open ?? 1), es = e.eyeSize || 1;
  const big = sh > 0.3 || red > 0.2 || e.spiral || es > 1.05;
  for (const sx of [-1, 1]) {
    const ex = sx * 22 + lx * 4, ey = hy + 2 + ly * 3, r = 17 * es * (sh > 0.3 ? 1.1 : 1);
    if (bags > 0.05) { ctx.strokeStyle = `rgba(90,40,30,${0.7 * bags})`; ctx.lineWidth = 4; for (let k = 0; k < 2; k++) { ctx.beginPath(); ctx.arc(ex, ey + 4 + k * 6, r + 3, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke(); } }
    if (big) {
      ctx.fillStyle = mix('#ffffff', '#ffd0d0', red * 0.8); ctx.beginPath(); ctx.arc(ex, ey, r, 0, Math.PI * 2); ctx.fill();
      veins(ctx, ex, ey, r, red);
      if (e.spiral) spiralEye(ctx, ex, ey, r * 0.9, t, sx, HAIR);
      else { ctx.fillStyle = HAIR; ctx.beginPath(); ctx.arc(ex + lx * r * 0.3, ey + ly * r * 0.3, 6 * (e.pupil || 1), 0, Math.PI * 2); ctx.fill(); }
      if (op < 0.98) { ctx.save(); ctx.beginPath(); ctx.arc(ex, ey, r + 1, 0, Math.PI * 2); ctx.clip(); ctx.fillStyle = SK; ctx.fillRect(ex - r - 2, ey - r - 2, 2 * r + 4, (2 * r + 2) * (1 - op)); ctx.restore(); }
    } else { ctx.fillStyle = HAIR; ctx.beginPath(); ctx.ellipse(ex, ey, 7, 8 * op + 0.5, 0, 0, Math.PI * 2); ctx.fill(); }
    // cejas: suben con el susto, se caen con el cansancio
    const tired = clamp(red + bags * 0.5) * (1 - sh);
    ctx.strokeStyle = HAIR; ctx.lineWidth = 6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(ex - 12 * sx, hy - 22 - sh * 16 - tired * 4); ctx.lineTo(ex + 12 * sx, hy - 24 - sh * 16 + tired * 7); ctx.stroke();
  }
  const mouth = e.mouth || (sh > 0.3 ? 'o' : 'smile'), mo = clamp(e.mouthOpen ?? sh);
  ctx.fillStyle = '#5a1e2a'; ctx.strokeStyle = '#5a1e2a'; ctx.lineWidth = 5; ctx.lineCap = 'round';
  const my = hy + 32;
  if (mouth === 'o') { ctx.beginPath(); ctx.ellipse(0, my + 4, 11, 8 + 12 * mo, 0, 0, Math.PI * 2); ctx.fill(); }
  else if (mouth === 'yawn') { ctx.beginPath(); ctx.ellipse(0, my + 6, 14 + 6 * mo, 6 + 22 * mo, 0, 0, Math.PI * 2); ctx.fill(); }
  else if (mouth === 'wobbly') { ctx.beginPath(); for (let i = 0; i <= 12; i++) { const X = -18 + i * 3, Y = my + Math.sin(i * 1.3 + t * 25) * 3; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); }
  else if (mouth === 'grin') { ctx.beginPath(); ctx.ellipse(0, my - 2, 22, 14, 0, 0, Math.PI); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-18, my - 2, 36, 5); }
  else if (mouth === 'flat') { ctx.beginPath(); ctx.moveTo(-13, my); ctx.lineTo(13, my); ctx.stroke(); }
  else { ctx.beginPath(); ctx.ellipse(0, my - 2, 16, 4 + talk * 10, 0, 0, Math.PI); ctx.fill(); }
  // brazos largos con manos grandes
  for (const sx of [-1, 1]) {
    const gest = sx > 0 ? (talk ? Math.sin(t * 6) * 30 : Math.sin(t * 2) * 8) : 0;
    let [hx, hy2] = [sx * lerp(95, 62, sh), lerp(-185 - gest, -420, sh)];
    const ov = sx < 0 ? e.handL : e.handR; if (ov) [hx, hy2] = ov;
    ctx.strokeStyle = sx > 0 ? SHd : SH; ctx.lineWidth = 26; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(sx * 52, -320); ctx.quadraticCurveTo(sx * Math.max(Math.abs(hx) + 40, 100), (-320 + hy2) / 2 + 30, hx, hy2); ctx.stroke();
    ctx.fillStyle = sx > 0 ? SKd : SK; ctx.beginPath(); ctx.arc(hx, hy2, 22, 0, Math.PI * 2); ctx.fill();
    if (sx > 0 && e.hold) heldObject(ctx, e, hx, hy2);
  }
  ctx.restore();
}

// ===================== C) SILUETA CINEMÁTICA (luz de contra, atmósfera) — "Max" =====================
function bgCine(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, 540);
  g.addColorStop(0, '#24163f'); g.addColorStop(0.55, '#b5487a'); g.addColorStop(0.78, '#ff9e5e'); g.addColorStop(1, '#2a1838');
  ctx.fillStyle = g; ctx.fillRect(0, 0, 960, 540);
  const sx = 640, sy = 395;
  const sg = ctx.createRadialGradient(sx, sy, 10, sx, sy, 380); sg.addColorStop(0, 'rgba(255,230,170,0.95)'); sg.addColorStop(0.15, 'rgba(255,170,100,0.6)'); sg.addColorStop(1, 'rgba(255,120,80,0)');
  ctx.fillStyle = sg; ctx.fillRect(0, 0, 960, 540);
  ctx.fillStyle = '#ffe9b8'; ctx.beginPath(); ctx.arc(sx, sy, 45, 0, Math.PI * 2); ctx.fill();
  [[0.15, '#5a2a55', 140, 3], [0.35, '#3a1c40', 90, 9], [0.7, '#1c1028', 50, 17]].forEach(([sp, c, base, seed]) => {
    const r = rng(seed); let bx = -((t * sp * 40) % 200) - 100; ctx.fillStyle = c;
    while (bx < 1060) { const bw = 40 + r() * 70, bh = base + r() * 110; ctx.fillRect(bx, 430 - bh, bw, bh + 10); bx += bw + 4; }
  });
  ctx.fillStyle = '#140b1e'; ctx.fillRect(0, 430, 960, 110);
  const r = rng(4);
  for (let i = 0; i < 18; i++) {
    const bx = (r() * 960 + t * (8 + r() * 14)) % 1000 - 20, by = 80 + r() * 380, br = 6 + r() * 18;
    ctx.fillStyle = `rgba(255,${180 + r() * 60 | 0},140,${0.12 + 0.15 * Math.abs(Math.sin(t + i))})`; ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fill();
  }
}
function drawMax(ctx, x, y, s, e) {
  const t = e.t, sh = clamp(e.shock || 0), sway = Math.sin(t * 1.5) * 0.03 + (e.rot || 0), fr = e.frazzle || 0;
  const rim = e.rim || '#ffd6a0', glow = e.glow || '#ffb36b', BODY = '#170f22';
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const jump = e.inBed ? 0 : -sh * 30;
  const hands = [-1, 1].map(sx => {
    const swing = sx > 0 ? Math.sin(t * 2) * 10 : 0;
    const ov = sx < 0 ? e.handL : e.handR;
    return ov || [sx * lerp(62, 70, sh), lerp(-140, -390, sh) + swing];
  });
  const figure = (col) => {
    ctx.save(); ctx.translate(0, jump); ctx.rotate(sway);
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.lineWidth = 30;
    ctx.beginPath(); ctx.moveTo(-18, -150); ctx.lineTo(-30, -10 - jump); ctx.moveTo(18, -150); ctx.lineTo(32, -10 - jump); ctx.stroke();
    rrect(ctx, -48, -300, 96, 165, 40); ctx.fill();
    ctx.beginPath(); ctx.arc(0, -362, 66, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-60, -385); ctx.quadraticCurveTo(-20, -460, 50, -420); ctx.quadraticCurveTo(75, -400, 66, -370); ctx.fill();
    if (fr > 0.05) for (let i = 0; i < 6; i++) { // pelo erizado
      const a = Math.PI * (1.15 + i * 0.14), len = 25 + fr * 30 + Math.sin(t * 35 + i) * 6 * fr;
      ctx.beginPath(); ctx.moveTo(Math.cos(a - 0.12) * 60, -362 + Math.sin(a - 0.12) * 60); ctx.lineTo(Math.cos(a) * (66 + len), -362 + Math.sin(a) * (66 + len)); ctx.lineTo(Math.cos(a + 0.12) * 60, -362 + Math.sin(a + 0.12) * 60); ctx.fill();
    }
    ctx.lineWidth = 24;
    hands.forEach(([hx, hy], i) => { const sx = i ? 1 : -1; ctx.beginPath(); ctx.moveTo(sx * 40, -275); ctx.quadraticCurveTo(sx * Math.max(Math.abs(hx) + 30, 85), (-275 + hy) / 2 + 20, hx, hy); ctx.stroke(); ctx.beginPath(); ctx.arc(hx, hy, 17, 0, Math.PI * 2); ctx.fill(); });
    ctx.restore();
  };
  ctx.save(); ctx.filter = 'blur(7px)'; ctx.globalAlpha = 0.75; ctx.translate(9, -5); figure(glow); ctx.restore();
  ctx.save(); ctx.translate(5, -3); figure(rim); ctx.restore();
  figure(BODY);
  ctx.save(); ctx.translate(0, jump); ctx.rotate(sway);
  const op = clamp(e.open ?? 1), [lx, ly] = e.look || [0, 0], es = e.eyeSize || 1, red = e.red || 0, bags = e.bags || 0;
  for (const sx of [-1, 1]) {
    const ex = sx * 24 + lx * 8, ey = -360 + ly * 4;
    if (bags > 0.05) { ctx.strokeStyle = `rgba(160,120,255,${0.8 * bags})`; ctx.lineWidth = 3.5; for (let k = 0; k < 2; k++) { ctx.beginPath(); ctx.arc(ex, ey + 6 + k * 6, 16 * es, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); } }
    if (e.spiral) { spiralEye(ctx, ex, ey, 17 * es, t, sx, '#ffffff'); continue; }
    const big = sh > 0.3 || es > 1.05 || red > 0.3;
    ctx.fillStyle = mix('#ffffff', '#ffc4c4', red);
    if (big) {
      const r = (sh > 0.3 ? 20 : 15) * es;
      ctx.save(); ctx.beginPath(); ctx.arc(ex, ey, r, 0, Math.PI * 2); ctx.clip();
      ctx.fill(); ctx.fillRect(ex - r, ey - r, 2 * r, 2 * r); veins(ctx, ex, ey, r, red);
      ctx.fillStyle = BODY; ctx.beginPath(); ctx.arc(ex + lx * 5, ey + ly * 4, 5 * (e.pupil || 1), 0, Math.PI * 2); ctx.fill();
      if (op < 0.98) ctx.fillRect(ex - r, ey - r, 2 * r, 2 * r * (1 - op));
      ctx.restore();
    } else { ctx.beginPath(); ctx.ellipse(ex, ey, 9, 15 * op + 0.5, 0, 0, Math.PI * 2); ctx.fill(); }
  }
  const mouth = e.mouth || (sh > 0.3 ? 'o' : 'none'), mo = clamp(e.mouthOpen ?? sh);
  ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 4; ctx.lineCap = 'round';
  if (mouth === 'o') { ctx.beginPath(); ctx.ellipse(0, -318, 9, 6 + 10 * mo, 0, 0, Math.PI * 2); ctx.fill(); }
  else if (mouth === 'yawn') { ctx.beginPath(); ctx.ellipse(0, -316, 12 + 4 * mo, 4 + 18 * mo, 0, 0, Math.PI * 2); ctx.fill(); }
  else if (mouth === 'wobbly') { ctx.beginPath(); for (let i = 0; i <= 12; i++) { const X = -16 + i * 2.7, Y = -320 + Math.sin(i * 1.3 + t * 25) * 3; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); }
  else if (mouth === 'grin') { ctx.beginPath(); ctx.ellipse(0, -324, 20, 12, 0, 0, Math.PI); ctx.fill(); }
  else if (mouth === 'smile') { ctx.beginPath(); ctx.arc(0, -334, 16, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke(); }
  ctx.restore();
  if (e.hold) { const [hx, hy] = hands[1]; ctx.save(); ctx.translate(0, jump); heldObject(ctx, e, hx, hy); ctx.restore(); }
  ctx.restore();
}

// ===================== D) PAPEL RECORTADO (stop-motion a 12 fps) — "Ana" =====================
let _paperPat = null;
function paperPattern(ctx) {
  if (_paperPat) return _paperPat;
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), r = rng(9);
  const img = g.createImageData(256, 256);
  for (let i = 0; i < img.data.length; i += 4) { const v = 128 + (r() - 0.5) * 90; img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255; }
  g.putImageData(img, 0, 0);
  g.strokeStyle = 'rgba(255,255,255,0.25)'; for (let i = 0; i < 60; i++) { g.beginPath(); const x = r() * 256, y = r() * 256; g.moveTo(x, y); g.lineTo(x + r() * 30, y + r() * 4); g.stroke(); }
  return (_paperPat = ctx.createPattern(c, 'repeat'));
}
// Rellena la forma actual como papel: color + textura + sombra proyectada
function paper(ctx, color) {
  ctx.save(); ctx.shadowColor = 'rgba(40,20,0,0.35)'; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 6; ctx.shadowBlur = 5;
  ctx.fillStyle = color; ctx.fill(); ctx.restore();
  ctx.save(); ctx.clip(); ctx.globalAlpha = 0.18; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = paperPattern(ctx); ctx.fillRect(-2000, -2000, 4000, 4000); ctx.restore();
}
const stepT = t => Math.floor(t * 12) / 12; // movimiento "a saltitos" como stop-motion
function jitter(t, k = 1) { const r = rng(Math.floor(t * 12) * 31 + 7); return [(r() - 0.5) * 3 * k, (r() - 0.5) * 0.02 * k]; }
function bgPapel(ctx, t) {
  const ts = stepT(t);
  ctx.beginPath(); ctx.rect(0, 0, 960, 540); ctx.fillStyle = '#d9b07a'; ctx.fill();
  ctx.save(); ctx.globalAlpha = 0.25; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = paperPattern(ctx); ctx.fillRect(0, 0, 960, 540); ctx.restore();
  // sol de papel con rayos que giran a saltos
  ctx.save(); ctx.translate(800, 110); ctx.rotate(ts * 0.5);
  for (let i = 0; i < 10; i++) { ctx.rotate(Math.PI / 5); ctx.beginPath(); ctx.moveTo(-12, 55); ctx.lineTo(0, 95); ctx.lineTo(12, 55); ctx.closePath(); paper(ctx, '#ffb703'); }
  ctx.beginPath(); ctx.arc(0, 0, 55, 0, Math.PI * 2); paper(ctx, '#ffd166'); ctx.restore();
  // nubes de papel rasgado
  [[150, 100, 0], [470, 70, 2]].forEach(([cx, cy, k]) => {
    const ox = ((cx + ts * 25) % 1100) - 100;
    ctx.beginPath(); const r = rng(13 + k);
    for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.35) { const rr = 1 + (r() - 0.5) * 0.15; ctx.lineTo(ox + Math.cos(a) * 95 * rr, cy + Math.sin(a) * 38 * rr); }
    ctx.closePath(); paper(ctx, '#fbf6ec');
  });
  // colinas de papel
  ctx.beginPath(); ctx.moveTo(0, 470); for (let x = 0; x <= 960; x += 40) ctx.lineTo(x, 450 + Math.sin(x * 0.02) * 18 + (x / 40 % 2) * 6); ctx.lineTo(960, 540); ctx.lineTo(0, 540); ctx.closePath(); paper(ctx, '#7cb518');
}
function drawAna(ctx, x, y, s, e) {
  const ts = stepT(e.t), sh = clamp(e.shock || 0), [jx, jr] = jitter(e.t);
  ctx.save(); ctx.translate(x + jx, y); ctx.rotate(jr); ctx.scale(s, s);
  const hop = -Math.abs(Math.sin(ts * 3)) * 8 - sh * 28;
  for (const sx of [-1, 1]) { ctx.beginPath(); rrect(ctx, sx * 26 - 10, -110, 20, 105, 8); paper(ctx, '#e0a96d'); ctx.beginPath(); ctx.ellipse(sx * 30, -6, 26, 12, 0, 0, Math.PI * 2); paper(ctx, '#264653'); }
  ctx.translate(0, hop);
  // brazos (piezas unidas en el hombro que giran)
  for (const sx of [-1, 1]) {
    const ang = -sx * (sh ? 2.5 : 0.35 + (sx > 0 ? Math.sin(ts * 5) * 0.4 : 0));
    ctx.save(); ctx.translate(sx * 38, -235); ctx.rotate(ang);
    ctx.beginPath(); rrect(ctx, -11, 0, 22, 110, 10); paper(ctx, '#e0a96d');
    ctx.beginPath(); ctx.arc(0, 115, 15, 0, Math.PI * 2); paper(ctx, '#e0a96d'); ctx.restore();
  }
  // vestido trapecio
  ctx.beginPath(); ctx.moveTo(-42, -250); ctx.lineTo(42, -250); ctx.lineTo(80, -100); ctx.lineTo(-80, -100); ctx.closePath(); paper(ctx, '#e63946');
  ctx.beginPath(); ctx.moveTo(-75, -125); ctx.lineTo(75, -125); ctx.lineTo(80, -100); ctx.lineTo(-80, -100); ctx.closePath(); paper(ctx, '#ffffff');
  // cabeza con pelo rizado (bolitas de papel; se esponja con el susto)
  const hy = -320;
  const r = rng(3);
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, rr = 88 + sh * 18 + r() * 10; ctx.beginPath(); ctx.arc(Math.cos(a) * rr * 0.9, hy - 10 + Math.sin(a) * rr * 0.85, 34 + r() * 8, 0, Math.PI * 2); paper(ctx, '#6b3e26'); }
  ctx.beginPath(); ctx.ellipse(0, hy + 5, 72, 78, 0, 0, Math.PI * 2); paper(ctx, '#e0a96d');
  const op = clamp(e.open ?? 1);
  for (const sx of [-1, 1]) {
    const ex = sx * 26, ey = hy;
    if (sh > 0.3) { ctx.beginPath(); ctx.arc(ex, ey, 20, 0, Math.PI * 2); paper(ctx, '#fff'); ctx.fillStyle = '#222'; ctx.beginPath(); ctx.arc(ex, ey + 2, 7, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.fillStyle = '#222'; ctx.beginPath(); ctx.ellipse(ex, ey, 9, 11 * op + 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ex - 3, ey - 4, 3, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.beginPath(); ctx.ellipse(-46, hy + 28, 13, 8, 0, 0, Math.PI * 2); paper(ctx, '#f28482'); ctx.beginPath(); ctx.ellipse(46, hy + 28, 13, 8, 0, 0, Math.PI * 2); paper(ctx, '#f28482');
  ctx.beginPath();
  if (sh > 0.3) ctx.ellipse(0, hy + 40, 12, 17, 0, 0, Math.PI * 2); else ctx.ellipse(0, hy + 32, 20, 8 + (e.talk || 0) * 8, 0, 0, Math.PI);
  paper(ctx, '#7a1f3d');
  ctx.restore();
}
