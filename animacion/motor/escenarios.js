// Escenarios nuevos (video 002 en adelante). Cada uno siempre tiene algo en movimiento.
// Firma: fn(ctx, t, o) — o con opciones propias de cada escenario.

// ---------- COCINA (la llave que no da agua) ----------
function sceneKitchen(ctx, t, o = {}) {
  const heat = o.heat || 0; // 0 normal → 1 todo reseco
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mix('#bde0fe', '#ffd6a5', heat)); g.addColorStop(1, mix('#a2d2ff', '#ffb4a2', heat));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // azulejos
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (let y = 120; y < 620; y += 70) for (let x = (y / 70 % 2) * 35; x < W; x += 70) ctx.fillRect(x + 3, y + 3, 64, 64);
  // ventana con sol que se mueve
  ctx.fillStyle = '#fff'; rrect(ctx, 1380, 120, 380, 300, 20); ctx.fill();
  ctx.fillStyle = mix('#8ecae6', '#ffb703', heat); rrect(ctx, 1400, 140, 340, 260, 12); ctx.fill();
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(1570 + Math.sin(t * 0.3) * 80, 250 - Math.cos(t * 0.3) * 30, 40 + Math.sin(t * 3) * 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.fillRect(1565, 140, 10, 260);
  // refri
  ctx.fillStyle = '#e9ecef'; rrect(ctx, 80, 230, 330, 700, 30); ctx.fill(); ctx.fillStyle = '#dee2e6'; ctx.fillRect(80, 470, 330, 10);
  ctx.fillStyle = '#adb5bd'; rrect(ctx, 360, 300, 18, 120, 9); ctx.fill(); rrect(ctx, 360, 520, 18, 160, 9); ctx.fill();
  if (o.fridgeOpen) { ctx.fillStyle = '#f8f9fa'; ctx.beginPath(); ctx.moveTo(410, 480); ctx.lineTo(560 + 30 * Math.sin(t * 2), 450); ctx.lineTo(560 + 30 * Math.sin(t * 2), 960); ctx.lineTo(410, 930); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,220,0.6)'; ctx.fillRect(95, 490, 300, 430); }
  // barra y fregadero
  ctx.fillStyle = '#6c757d'; ctx.fillRect(560, 640, 1360, 40); ctx.fillStyle = '#ced4da'; ctx.fillRect(560, 680, 1360, 400);
  ctx.fillStyle = '#adb5bd'; for (let x = 620; x < 1900; x += 330) { rrect(ctx, x, 720, 280, 300, 16); ctx.fill(); }
  ctx.fillStyle = '#495057'; rrect(ctx, 1020, 610, 360, 40, 20); ctx.fill();
  // llave (gotea, luego nada)
  ctx.save(); ctx.translate(1200, 470); ctx.rotate(Math.sin(t * 8) * 0.02 * (o.shake || 0));
  ctx.fillStyle = '#adb5bd'; rrect(ctx, -15, 0, 30, 140, 12); ctx.fill(); rrect(ctx, -15, 0, 150, 30, 15); ctx.fill(); rrect(ctx, 110, 0, 30, 60, 12); ctx.fill();
  ctx.fillStyle = FLAT.coral; ctx.beginPath(); ctx.arc(0, -10, 26, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
  if (o.drip) { const p = (t * 0.8) % 1; ctx.fillStyle = '#4cc9f0'; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.arc(1325, 540 + p * 80, 10 * (1 - p * 0.5), 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
  // polvo/calor
  floaters(ctx, t, { n: 30, color: heat > 0.5 ? 'rgba(255,200,120,0.6)' : 'rgba(255,255,255,0.5)', speed: 15, size: 3, seed: 17 });
}

// ---------- DESIERTO (dunas con paralaje, ondas de calor, sol que pulsa) ----------
function sceneDesert(ctx, t, o = {}) {
  const heat = o.heat ?? 1, off = t * (o.speed || 40);
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mix('#ffd166', '#ff7b00', heat)); g.addColorStop(1, mix('#fff3b0', '#ffb703', heat));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const sx = o.sunX || 1500, sy = o.sunY || 220;
  for (let k = 3; k > 0; k--) { ctx.fillStyle = `rgba(255,255,200,${0.12 * k})`; ctx.beginPath(); ctx.arc(sx, sy, 110 + k * 50 + Math.sin(t * 2 + k) * 10, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#fffbe6'; ctx.beginPath(); ctx.arc(sx, sy, 110, 0, Math.PI * 2); ctx.fill();
  const layers = [[0.15, '#f4a261', 640, 60], [0.35, '#e9c46a', 760, 50], [0.7, '#f2cc8f', 880, 40]];
  layers.forEach(([sp, c, y, amp], li) => {
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 20) ctx.lineTo(x, y + Math.sin((x + off * sp * 10) * 0.004 + li) * amp + Math.sin((x + off * sp * 10) * 0.011) * amp * 0.4);
    ctx.lineTo(W, H); ctx.fill();
  });
  // cactus y huesitos
  for (let i = 0; i < 3; i++) { const x = ((i * 700 - off * 0.7) % 2300 + 2300) % 2300 - 200; cactus(ctx, x, 900, 0.8 + (i % 2) * 0.3, t + i); }
  // ondas de calor
  for (let i = 0; i < 6; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 5; ctx.beginPath(); for (let y = 0; y < 260; y += 10) { const x = 150 + i * 320 + Math.sin(y * 0.05 + t * 5 + i) * 14; y ? ctx.lineTo(x, 640 - y) : ctx.moveTo(x, 640 - y); } ctx.stroke(); }
  // zopilotes dando vueltas
  for (let i = 0; i < 2; i++) { const a = t * 0.5 + i * Math.PI; const bx = 700 + Math.cos(a) * 260, by = 230 + Math.sin(a) * 60; ctx.strokeStyle = '#3d2c2e'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); const fl = Math.sin(t * 6 + i) * 12; ctx.moveTo(bx - 40, by + fl); ctx.quadraticCurveTo(bx - 20, by - 15, bx, by); ctx.quadraticCurveTo(bx + 20, by - 15, bx + 40, by + fl); ctx.stroke(); }
  // rodadora
  const rx = ((t * 260) % (W + 400)) - 200; ctx.save(); ctx.translate(rx, 920 - Math.abs(Math.sin(t * 4)) * 30); ctx.rotate(t * 5); ctx.strokeStyle = '#a0522d'; ctx.lineWidth = 5; for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.arc(0, 0, 25 + k * 5, k, k + 4); ctx.stroke(); } ctx.restore();
}
function cactus(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t) * 0.02);
  ctx.fillStyle = '#52b788'; rrect(ctx, -30, -260, 60, 260, 30); ctx.fill();
  rrect(ctx, -100, -170, 40, 100, 20); ctx.fill(); ctx.fillRect(-100, -100, 80, 34);
  rrect(ctx, 60, -210, 40, 110, 20); ctx.fill(); ctx.fillRect(20, -130, 70, 34);
  ctx.fillStyle = '#ff8fab'; ctx.beginPath(); ctx.arc(0, -262, 14, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ---------- DENTRO DEL CUERPO: vaso sanguíneo (glóbulos que fluyen, sangre que se espesa) ----------
function sceneBlood(ctx, t, o = {}) {
  const thick = o.thick || 0, speed = (o.speed || 1) * (1 - thick * 0.6);
  ctx.fillStyle = mix('#7b0d1e', '#3d0611', thick); ctx.fillRect(0, 0, W, H);
  // paredes del vaso
  ctx.fillStyle = mix('#c9184a', '#800f2f', thick);
  ctx.beginPath(); ctx.moveTo(0, 0); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, 170 + Math.sin(x * 0.008 + t) * 25); ctx.lineTo(W, 0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 30) ctx.lineTo(x, 910 + Math.sin(x * 0.008 + t + 2) * 25); ctx.lineTo(W, H); ctx.fill();
  const n = Math.round(26 + thick * 30);
  for (let i = 0; i < n; i++) {
    const r = rng(i + 300), y = 230 + r() * 620, sp = (120 + r() * 160) * speed, x = ((r() * W + t * sp) % (W + 200)) - 100;
    rbc(ctx, x, y + Math.sin(t * 2 + i) * 10, 46 + r() * 14, t * (0.5 + r()) + i);
  }
  // corazón latiendo en la esquina (más rápido si la sangre es espesa)
  if (o.heart) { const bpm = 70 + thick * 70, beat = Math.pow(Math.max(0, Math.sin(t * bpm / 60 * Math.PI * 2)), 6); heartIcon(ctx, 1700, 200, 1 + beat * 0.18); text(ctx, `${Math.round(bpm)} lpm`, 1700, 330, { size: 52, fill: '#fff' }); }
}
function rbc(ctx, x, y, r, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.cos(rot)));
  ctx.fillStyle = '#e63946'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#c1121f'; ctx.beginPath(); ctx.arc(0, 0, r * 0.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function heartIcon(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#ff4d6d';
  ctx.beginPath(); ctx.moveTo(0, 60); ctx.bezierCurveTo(-110, -10, -60, -90, 0, -40); ctx.bezierCurveTo(60, -90, 110, -10, 0, 60); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.ellipse(-35, -30, 14, 22, -0.5, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

// ---------- CELDA DE 1979 (retro, gotas que se condensan en la pared) ----------
function sceneCell(ctx, t, o = {}) {
  ctx.fillStyle = '#6b705c'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#7f8471'; for (let y = 0; y < 880; y += 60) for (let x = (y / 60 % 2) * 60; x < W; x += 120) ctx.fillRect(x + 2, y + 2, 116, 56);
  ctx.fillStyle = '#4a4e3f'; ctx.fillRect(0, 880, W, 200);
  // ventanita con barrotes y rayo de luz que se mueve
  ctx.fillStyle = '#a5a58d'; ctx.fillRect(1380, 150, 260, 180);
  ctx.fillStyle = 'rgba(255,240,200,0.15)'; ctx.beginPath(); ctx.moveTo(1380, 150); ctx.lineTo(1640, 150); ctx.lineTo(1300 + Math.sin(t * 0.3) * 60, 1080); ctx.lineTo(900 + Math.sin(t * 0.3) * 60, 1080); ctx.fill();
  ctx.fillStyle = '#343a40'; for (let i = 0; i < 5; i++) ctx.fillRect(1395 + i * 55, 150, 14, 180);
  // catre
  ctx.fillStyle = '#5c4033'; ctx.fillRect(120, 760, 620, 40); ctx.fillRect(140, 800, 30, 90); ctx.fillRect(690, 800, 30, 90);
  ctx.fillStyle = '#9c8c7a'; rrect(ctx, 130, 720, 600, 50, 20); ctx.fill();
  // gotas de condensación que bajan por la pared
  for (let i = 0; i < 9; i++) { const r = rng(i + 500), x = 860 + r() * 420, p = (t * (0.1 + r() * 0.15) + r()) % 1; ctx.fillStyle = 'rgba(180,230,255,0.85)'; ctx.beginPath(); ctx.ellipse(x, 300 + p * 500, 8, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(180,230,255,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, 300); ctx.lineTo(x, 300 + p * 500); ctx.stroke(); }
  // puerta de barrotes
  if (o.bars !== false) { ctx.fillStyle = '#212529'; for (let i = 0; i < 9; i++) ctx.fillRect(40 + i * 230 + Math.sin(t * 0.2) * 3, 0, 22, 1080); ctx.fillRect(0, 120, W, 22); ctx.fillRect(0, 980, W, 22); }
}

// ---------- MAR ABIERTO (balsa que se mece, olas en capas, gaviotas) ----------
function sceneSea(ctx, t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, 560); g.addColorStop(0, '#48cae4'); g.addColorStop(1, '#caf0f8');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, 560);
  ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(1600, 160, 90, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 3; i++) { const x = ((i * 700 + t * 30) % 2300) - 200; ctx.fillStyle = 'rgba(255,255,255,0.9)'; for (const [dx, dy, r] of [[0, 0, 50], [60, -20, 60], [120, 0, 45]]) { ctx.beginPath(); ctx.arc(x + dx, 150 + i * 40 + dy, r, 0, Math.PI * 2); ctx.fill(); } }
  const cols = ['#0096c7', '#0077b6', '#023e8a'];
  cols.forEach((c, k) => {
    ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 540 + k * 130 + Math.sin(x * 0.006 + t * (1 + k * 0.4) + k) * (25 + k * 10));
    ctx.lineTo(W, H); ctx.fill();
  });
  for (let i = 0; i < 2; i++) { const a = t * 0.6 + i * 2; const bx = 400 + i * 700 + Math.sin(a) * 120, by = 260 + Math.cos(a * 1.3) * 40; ctx.strokeStyle = '#fff'; ctx.lineWidth = 6; ctx.lineCap = 'round'; const fl = Math.sin(t * 7 + i) * 10; ctx.beginPath(); ctx.moveTo(bx - 34, by + fl); ctx.quadraticCurveTo(bx - 17, by - 12, bx, by); ctx.quadraticCurveTo(bx + 17, by - 12, bx + 34, by + fl); ctx.stroke(); }
}
function raft(ctx, x, y, t) { // balsa (dibujar después del personaje para tapar las piernas)
  ctx.save(); ctx.translate(x, y + Math.sin(t * 1.5) * 15); ctx.rotate(Math.sin(t * 1.2) * 0.04);
  ctx.fillStyle = '#bc6c25'; for (let i = -3; i <= 3; i++) { rrect(ctx, i * 70 - 32, -30, 64, 70, 20); ctx.fill(); }
  ctx.fillStyle = '#dda15e'; ctx.fillRect(-250, -10, 500, 16);
  ctx.restore();
}

// ---------- OASIS con camello (para el mito de la joroba) ----------
function camel(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
  const walk = o.walk ? Math.sin(t * 6) : 0, C = '#d4a373', D = '#bc8a5f';
  ctx.fillStyle = D; for (const [lx, ph] of [[-110, 0], [-60, 1], [70, 0.5], [120, 1.5]]) { ctx.save(); ctx.translate(lx, -120); ctx.rotate(Math.sin(t * 6 + ph) * 0.25 * (o.walk ? 1 : 0)); ctx.fillRect(-12, 0, 24, 130); ctx.restore(); }
  ctx.fillStyle = C; ctx.beginPath(); ctx.ellipse(0, -160, 170, 70, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(-20 + (o.hump2 ? -50 : 0), -230, 80, 70, 0, Math.PI, 0); ctx.fill();
  if (o.hump2) { ctx.beginPath(); ctx.ellipse(60, -230, 70, 60, 0, Math.PI, 0); ctx.fill(); }
  ctx.save(); ctx.translate(150, -180); ctx.rotate(0.5 + Math.sin(t * 2) * 0.05); ctx.fillRect(-22, -150, 44, 170); ctx.restore();
  ctx.save(); ctx.translate(250, -310 + Math.sin(t * 2) * 4); ctx.beginPath(); ctx.ellipse(0, 0, 60, 34, 0.2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = FLAT.ink; ctx.beginPath(); ctx.arc(10, -10, 7, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = FLAT.ink; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(40, 10, 10, 0.2, 2.2); ctx.stroke();
  ctx.fillStyle = D; ctx.beginPath(); ctx.ellipse(-30, -24, 10, 18, -0.4, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  ctx.restore();
}
function sceneOasis(ctx, t) {
  sceneDesert(ctx, t, { heat: 0.4, speed: 10 });
  ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.ellipse(1300, 930, 380, 70, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; for (let i = 0; i < 5; i++) { ctx.fillRect(1000 + i * 120 + Math.sin(t * 2 + i) * 20, 920 + (i % 2) * 20, 60, 5); }
  for (const px of [1000, 1620]) palm(ctx, px, 900, t);
}
function palm(ctx, x, y, t) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#8d6e63';
  ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(30, -200, 10, -380); ctx.lineTo(30, -380); ctx.quadraticCurveTo(50, -200, 14, 0); ctx.fill();
  ctx.translate(20, -380);
  for (let i = 0; i < 6; i++) { ctx.save(); ctx.rotate(i * 1.05 + Math.sin(t * 1.5 + i) * 0.08); ctx.fillStyle = i % 2 ? '#2d6a4f' : '#40916c'; ctx.beginPath(); ctx.ellipse(90, 0, 100, 26, 0.3, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  ctx.restore();
}
