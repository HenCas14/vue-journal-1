// Propuestas de personaje (amigables para niños y adultos).
// Cada función: draw(ctx, x, y(base de los pies), s(escala), e(expresión))
// e = { t, open (0-1 párpado), shock (0-1), look ([-1..1, -1..1]), talk (0-1) }

function cuteEye(ctx, x, y, r, e, o = {}) {
  const sh = clamp(e.shock || 0), open = clamp(e.open ?? 1);
  const [lx, ly] = e.look || [0, 0];
  ctx.save(); ctx.translate(x, y);
  if (open < 0.12) { // ojo cerrado: curvita feliz
    ctx.strokeStyle = OUT; ctx.lineWidth = r * 0.28; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, r * 0.2, r * 0.7, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); ctx.restore(); return;
  }
  ctx.scale(1, open);
  const R = r * (1 + 0.45 * sh);
  // blanco del ojo
  ctx.beginPath(); ctx.ellipse(0, 0, R, R * 1.12, 0, 0, Math.PI * 2); fillStroke(ctx, '#fff', Math.max(4, r * 0.16));
  // iris grande y brillante (se encoge con el susto)
  const ir = R * lerp(0.72, 0.38, sh);
  const px = lx * (R - ir) * 0.8, py = ly * (R - ir) * 0.8;
  const g = ctx.createRadialGradient(px, py - ir * 0.3, ir * 0.1, px, py, ir);
  g.addColorStop(0, o.iris2 || '#6a4cff'); g.addColorStop(1, o.iris || '#2a1a6b');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(px, py, ir, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(px, py, ir * 0.55, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.arc(px - ir * 0.35, py - ir * 0.38, ir * 0.32, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(px + ir * 0.35, py + ir * 0.3, ir * 0.14, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function cuteMouth(ctx, x, y, w, e, o = {}) {
  const sh = clamp(e.shock || 0), talk = clamp(e.talk || 0);
  ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (sh > 0.3) {
    const rh = w * (0.35 + 0.35 * sh);
    ctx.beginPath(); ctx.ellipse(0, rh * 0.4, w * 0.32, rh, 0, 0, Math.PI * 2); fillStroke(ctx, '#7a1f3d', w * 0.12);
    ctx.save(); ctx.clip(); ctx.fillStyle = '#ff7a9a'; ctx.beginPath(); ctx.ellipse(0, rh * 1.25, w * 0.25, rh * 0.5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  } else if (o.cat) { // boquita de gato "w"
    ctx.strokeStyle = OUT; ctx.lineWidth = w * 0.11;
    ctx.beginPath(); ctx.arc(-w * 0.18, 0, w * 0.18, 0.1 * Math.PI, 0.9 * Math.PI); ctx.arc(w * 0.18, 0, w * 0.18, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke();
    if (talk > 0.05) { ctx.beginPath(); ctx.ellipse(0, w * 0.28, w * 0.15, w * 0.2 * talk, 0, 0, Math.PI * 2); fillStroke(ctx, '#7a1f3d', w * 0.08); }
  } else { // sonrisa abierta con lengua
    const open = 0.35 + 0.45 * talk;
    ctx.beginPath(); ctx.moveTo(-w / 2, 0); ctx.quadraticCurveTo(0, w * open * 1.4, w / 2, 0); ctx.quadraticCurveTo(0, w * 0.12, -w / 2, 0); ctx.closePath();
    fillStroke(ctx, '#7a1f3d', w * 0.11);
    ctx.save(); ctx.clip(); ctx.fillStyle = '#ff7a9a'; ctx.beginPath(); ctx.ellipse(0, w * open * 0.9, w * 0.25, w * 0.18, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff'; ctx.fillRect(-w * 0.3, 0, w * 0.6, w * 0.1); ctx.restore();
  }
  ctx.restore();
}

function blush(ctx, x, y, r) { ctx.fillStyle = 'rgba(255,120,150,0.55)'; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.6, 0, 0, Math.PI * 2); ctx.fill(); }

// ---------- A) TEO: niño/a curioso/a con sudadera ----------
function drawTeo(ctx, x, y, s, e) {
  const t = e.t, sh = clamp(e.shock || 0), bob = Math.sin(t * 3) * 4;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(0, 6, 120, 18, 0, 0, Math.PI * 2); ctx.fill();
  // piernas y tenis
  for (const sx of [-1, 1]) {
    rrect(ctx, sx * 48 - 22, -70, 44, 70, 14); fillStroke(ctx, '#3d4b8f', 7);
    ctx.beginPath(); ctx.ellipse(sx * 52, -6, 40, 20, 0, 0, Math.PI * 2); fillStroke(ctx, '#ffffff', 7);
    ctx.fillStyle = '#ff6b5b'; ctx.fillRect(sx * 52 - 30, -12, 60, 7);
  }
  ctx.translate(0, bob);
  // brazos (se levantan con el susto)
  const armUp = sh;
  for (const sx of [-1, 1]) {
    const wave = sx > 0 ? Math.sin(t * 4) * 10 : 0;
    limb(ctx, [[sx * 85, -190], [sx * (125 + 20 * armUp), lerp(-120, -260, armUp) + wave], [sx * (120 + 30 * armUp), lerp(-70, -330, armUp) + wave]], '#ffb347', 34);
    ctx.beginPath(); ctx.arc(sx * (120 + 30 * armUp), lerp(-62, -340, armUp) + wave, 22, 0, Math.PI * 2); fillStroke(ctx, '#ffd3b0', 7);
  }
  // sudadera
  ctx.beginPath(); ctx.moveTo(-90, -220); ctx.quadraticCurveTo(0, -245, 90, -220); ctx.lineTo(110, -60); ctx.quadraticCurveTo(0, -40, -110, -60); ctx.closePath();
  fillStroke(ctx, '#ffb347', 8);
  rrect(ctx, -55, -130, 110, 50, 20); fillStroke(ctx, '#ff9a1f', 6); // bolsillo
  ctx.strokeStyle = OUT; ctx.lineWidth = 5; // cordones
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 18, -222); ctx.lineTo(sx * 22 + Math.sin(t * 3 + sx) * 4, -175); ctx.stroke(); ctx.beginPath(); ctx.arc(sx * 22 + Math.sin(t * 3 + sx) * 4, -172, 5, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.stroke(); }
  // cabeza
  const hy = -345 - sh * 15;
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 122, hy + 10, 24, 0, Math.PI * 2); fillStroke(ctx, '#ffc79e', 7); }
  ctx.beginPath(); ctx.ellipse(0, hy, 128, 118, 0, 0, Math.PI * 2); fillStroke(ctx, '#ffd3b0', 8);
  // pelo despeinado (se mueve; se eriza con el susto)
  ctx.save(); ctx.translate(0, hy - 60);
  ctx.beginPath(); ctx.moveTo(-128, 50);
  const spikes = [[-120, -20], [-95, -70 - sh * 40], [-60, -40], [-30, -95 - sh * 50], [5, -55], [35, -100 - sh * 55], [70, -50], [100, -80 - sh * 40], [125, -10], [130, 50]];
  spikes.forEach(([sx2, sy], i) => ctx.lineTo(sx2 + Math.sin(t * 4 + i) * 3, sy + Math.cos(t * 3 + i) * 3));
  ctx.quadraticCurveTo(60, 0, 0, 10); ctx.quadraticCurveTo(-60, 20, -128, 50); ctx.closePath();
  fillStroke(ctx, '#5a3a2e', 8); ctx.restore();
  // cejas
  ctx.strokeStyle = '#5a3a2e'; ctx.lineWidth = 10; ctx.lineCap = 'round';
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(sx * 30, hy - 48 - sh * 18); ctx.lineTo(sx * 72, hy - 52 - sh * 22 + (sh ? 0 : Math.sin(t * 2) * 2)); ctx.stroke(); }
  cuteEye(ctx, -50, hy - 5, 34, e, { iris: '#3a2412', iris2: '#9a6a3a' }); cuteEye(ctx, 50, hy - 5, 34, e, { iris: '#3a2412', iris2: '#9a6a3a' });
  blush(ctx, -85, hy + 40, 20); blush(ctx, 85, hy + 40, 20);
  cuteMouth(ctx, 0, hy + 50, 60, e);
  ctx.restore();
}

// ---------- B) MICHI: gato redondo naranja ----------
function drawMichi(ctx, x, y, s, e) {
  const t = e.t, sh = clamp(e.shock || 0), bob = Math.sin(t * 3) * 5;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(0, 6, 140, 20, 0, 0, Math.PI * 2); ctx.fill();
  // cola que se mueve (se esponja con el susto)
  ctx.save(); ctx.translate(110, -60); ctx.rotate(Math.sin(t * 2.5) * 0.3 - 0.2);
  limb(ctx, [[0, 0], [90, -40], [70, -150]], '#ffa94d', 30 + sh * 20); ctx.restore();
  ctx.translate(0, bob);
  // cuerpo/cabeza redonda (estilo "todo cabeza")
  const sq = 1 + Math.sin(t * 3) * 0.02 - sh * 0.06;
  ctx.save(); ctx.scale(1 / sq, sq);
  // orejas
  for (const sx of [-1, 1]) {
    const ea = sx * (0.15 + Math.sin(t * 5 + sx) * 0.05) + sx * sh * 0.25;
    ctx.save(); ctx.translate(sx * 95, -270); ctx.rotate(ea);
    ctx.beginPath(); ctx.moveTo(-50, 30); ctx.lineTo(0, -80 - sh * 20); ctx.lineTo(50, 30); ctx.closePath(); fillStroke(ctx, '#ffa94d', 8);
    ctx.beginPath(); ctx.moveTo(-28, 20); ctx.lineTo(0, -48); ctx.lineTo(28, 20); ctx.closePath(); ctx.fillStyle = '#ffb3c6'; ctx.fill(); ctx.restore();
  }
  ctx.beginPath(); ctx.ellipse(0, -160, 160, 155, 0, 0, Math.PI * 2); fillStroke(ctx, '#ffa94d', 9);
  ctx.save(); ctx.beginPath(); ctx.ellipse(0, -160, 156, 151, 0, 0, Math.PI * 2); ctx.clip();
  ctx.fillStyle = '#ff8c1a'; for (const sx of [-1, 0, 1]) { ctx.beginPath(); ctx.ellipse(sx * 40, -305, 14, 45, sx * 0.3, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#fff1dc'; ctx.beginPath(); ctx.ellipse(0, -60, 110, 85, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  ctx.restore();
  // patitas
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 60, -8, 40, 24, 0, 0, Math.PI * 2); fillStroke(ctx, '#fff1dc', 7); }
  const hy = -190 - sh * 10;
  cuteEye(ctx, -58, hy, 36, e, { iris: '#0f5a3a', iris2: '#3fd18a' }); cuteEye(ctx, 58, hy, 36, e, { iris: '#0f5a3a', iris2: '#3fd18a' });
  // nariz y bigotes
  ctx.beginPath(); ctx.moveTo(-10, hy + 40); ctx.lineTo(10, hy + 40); ctx.lineTo(0, hy + 52); ctx.closePath(); fillStroke(ctx, '#ff7a9a', 5);
  ctx.strokeStyle = OUT; ctx.lineWidth = 5; ctx.lineCap = 'round';
  for (const sx of [-1, 1]) for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(sx * 70, hy + 50 + k * 14); ctx.lineTo(sx * (145 + sh * 20), hy + 45 + k * 22 + Math.sin(t * 6 + k) * 3); ctx.stroke(); }
  blush(ctx, -95, hy + 45, 20); blush(ctx, 95, hy + 45, 20);
  cuteMouth(ctx, 0, hy + 62, 60, e, { cat: true });
  ctx.restore();
}

// ---------- C) PIP: robotcito explorador ----------
function drawPip(ctx, x, y, s, e) {
  const t = e.t, sh = clamp(e.shock || 0), bob = Math.sin(t * 3) * 6;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(0, 6, 120, 18, 0, 0, Math.PI * 2); ctx.fill();
  // rueda / base flotante con chispas
  rrect(ctx, -70, -50, 140, 50, 25); fillStroke(ctx, '#5b6b8c', 7);
  ctx.translate(0, bob - 20);
  // brazos de resorte
  for (const sx of [-1, 1]) {
    const up = sh, wave = sx > 0 ? Math.sin(t * 5) * 15 : 0;
    limb(ctx, [[sx * 95, -130], [sx * (140 + up * 10), lerp(-100, -230, up) + wave], [sx * 150, lerp(-60, -300, up) + wave]], '#9aa8c7', 18);
    ctx.beginPath(); ctx.arc(sx * 150, lerp(-55, -305, up) + wave, 20, 0, Math.PI * 2); fillStroke(ctx, '#ffd23f', 7);
  }
  // cuerpo
  rrect(ctx, -100, -200, 200, 160, 50); fillStroke(ctx, '#7cc6ff', 8);
  ctx.beginPath(); ctx.arc(0, -120, 26, 0, Math.PI * 2); fillStroke(ctx, '#ffd23f', 6);
  ctx.fillStyle = `rgba(255,255,255,${0.5 + 0.5 * Math.sin(t * 6)})`; ctx.beginPath(); ctx.arc(0, -120, 10, 0, Math.PI * 2); ctx.fill();
  // cabeza-pantalla
  const hy = -300 - sh * 18;
  // antena con foquito que parpadea
  ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, hy - 95); ctx.quadraticCurveTo(Math.sin(t * 4) * 20, hy - 140, Math.sin(t * 4) * 25, hy - 165 - sh * 20); ctx.stroke();
  ctx.beginPath(); ctx.arc(Math.sin(t * 4) * 25, hy - 170 - sh * 20, 18, 0, Math.PI * 2); fillStroke(ctx, sh > 0.3 ? '#ff4d4d' : mix('#ff6b5b', '#ffd23f', 0.5 + 0.5 * Math.sin(t * 8)), 6);
  rrect(ctx, -150, hy - 100, 300, 200, 70); fillStroke(ctx, '#e8f1ff', 9);
  rrect(ctx, -120, hy - 72, 240, 144, 50); fillStroke(ctx, '#1d2a44', 6);
  // ojos de pantalla (brillan)
  const open = clamp(e.open ?? 1), [lx, ly] = e.look || [0, 0];
  ctx.save(); ctx.shadowColor = '#5ff4ff'; ctx.shadowBlur = 25; ctx.fillStyle = '#5ff4ff';
  for (const sx of [-1, 1]) {
    const ex = sx * 52 + lx * 12, ey = hy - 8 + ly * 8;
    if (sh > 0.3) { ctx.beginPath(); ctx.arc(ex, ey, 30 + sh * 8, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#1d2a44'; ctx.beginPath(); ctx.arc(ex, ey, 12, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#5ff4ff'; }
    else if (open < 0.12) { ctx.fillRect(ex - 26, ey, 52, 8); }
    else { rrect(ctx, ex - 22, ey - 34 * open, 44, 68 * open, 20); ctx.fill(); }
  }
  // boca de pantalla
  ctx.strokeStyle = '#5ff4ff'; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath();
  if (sh > 0.3) ctx.ellipse(0, hy + 45, 16, 14 + sh * 6, 0, 0, Math.PI * 2);
  else ctx.arc(0, hy + 25, 28, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke(); ctx.restore();
  blush(ctx, -90, hy + 40, 16); blush(ctx, 90, hy + 40, 16);
  ctx.restore();
}

// ---------- D) PROFE BÚHO: búho sabio y simpático ----------
function drawBuho(ctx, x, y, s, e) {
  const t = e.t, sh = clamp(e.shock || 0), bob = Math.sin(t * 3) * 4;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = 'rgba(0,0,0,0.22)'; ctx.beginPath(); ctx.ellipse(0, 6, 120, 18, 0, 0, Math.PI * 2); ctx.fill();
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 40, -6, 34, 16, 0, 0, Math.PI * 2); fillStroke(ctx, '#ffb347', 6); }
  ctx.translate(0, bob);
  // alas (aletean; se abren con el susto)
  for (const sx of [-1, 1]) {
    ctx.save(); ctx.translate(sx * 115, -180); ctx.rotate(sx * (0.2 + sh * 1.0 + (sx > 0 ? Math.sin(t * 5) * 0.12 : 0)));
    ctx.beginPath(); ctx.ellipse(sx * 10, 50, 40, 90, 0, 0, Math.PI * 2); fillStroke(ctx, '#6a4fb3', 8); ctx.restore();
  }
  // cuerpo
  ctx.beginPath(); ctx.ellipse(0, -170, 135, 170, 0, 0, Math.PI * 2); fillStroke(ctx, '#8a6fd6', 9);
  ctx.save(); ctx.clip();
  ctx.fillStyle = '#e9e1ff'; ctx.beginPath(); ctx.ellipse(0, -80, 90, 95, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#c9b8ff'; ctx.lineWidth = 6;
  for (let r = 0; r < 3; r++) for (let c = -2; c <= 2; c++) { ctx.beginPath(); ctx.arc(c * 30 + (r % 2) * 15, -110 + r * 35, 12, 0.1 * Math.PI, 0.9 * Math.PI); ctx.stroke(); }
  ctx.restore();
  // penachos
  const hy = -235 - sh * 12;
  for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * 85, hy - 105); ctx.rotate(sx * (0.4 + Math.sin(t * 3) * 0.08 + sh * 0.3)); ctx.beginPath(); ctx.moveTo(-22, 20); ctx.lineTo(0, -50); ctx.lineTo(22, 20); ctx.closePath(); fillStroke(ctx, '#6a4fb3', 7); ctx.restore(); }
  // anillos de los ojos
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 58, hy, 62, 0, Math.PI * 2); fillStroke(ctx, '#ffd23f', 7); }
  cuteEye(ctx, -58, hy, 42, e, { iris: '#3a2412', iris2: '#c27a2a' }); cuteEye(ctx, 58, hy, 42, e, { iris: '#3a2412', iris2: '#c27a2a' });
  // lentes redondos
  ctx.strokeStyle = OUT; ctx.lineWidth = 6;
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 58, hy, 66, 0, Math.PI * 2); ctx.stroke(); }
  // pico (se abre con el susto o al hablar)
  const op = Math.max(sh, (e.talk || 0) * 0.5);
  ctx.beginPath(); ctx.moveTo(-20, hy + 55); ctx.lineTo(20, hy + 55); ctx.lineTo(0, hy + 85); ctx.closePath(); fillStroke(ctx, '#ff9a1f', 6);
  if (op > 0.1) { ctx.beginPath(); ctx.moveTo(-16, hy + 68 + op * 10); ctx.lineTo(16, hy + 68 + op * 10); ctx.lineTo(0, hy + 85 + op * 25); ctx.closePath(); fillStroke(ctx, '#ff7a1f', 6); }
  blush(ctx, -100, hy + 60, 18); blush(ctx, 100, hy + 60, 18);
  ctx.restore();
}
