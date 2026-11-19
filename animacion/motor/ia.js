// Elementos del tema "inteligencia artificial" — estándar PRO (ver canal/guia-dibujo.md)

// ---------- LA IA como personaje: esfera de luz amigable ----------
// o: { mood: 'happy'|'think'|'surprised'|'calm', glowCol, scale de anillos, talk 0-1, size }
function aiCore(ctx, x, y, r, t, o = {}) {
  const col = o.color || '#5ee0f0', col2 = o.color2 || '#8b7bff', mood = o.mood || 'happy';
  const bob = Math.sin(t * 1.8) * r * 0.06;
  ctx.save(); ctx.translate(x, y + bob);
  glow(ctx, 0, 0, r * 3.2, col, 0.28); glow(ctx, 0, 0, r * 1.8, col2, 0.35);
  // anillos orbitando (detrás)
  const ring = (k, front) => { ctx.save(); ctx.rotate(0.35 + k * 0.9 + Math.sin(t * 0.3 + k) * 0.1); ctx.scale(1, 0.32); ctx.strokeStyle = k % 2 ? 'rgba(139,123,255,0.75)' : 'rgba(94,224,240,0.75)'; ctx.lineWidth = r * 0.05; ctx.beginPath(); ctx.arc(0, 0, r * (1.45 + k * 0.22), front ? 0 : Math.PI, front ? Math.PI : Math.PI * 2); ctx.stroke(); const a = t * (1.2 - k * 0.3) + k * 2; if ((Math.sin(a) > 0) === front) { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(Math.cos(a) * r * (1.45 + k * 0.22), Math.sin(a) * r * (1.45 + k * 0.22), r * 0.08 / 0.32 * 0.32, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); };
  for (let k = 0; k < 3; k++) ring(k, false);
  // esfera con degradado y red neuronal interior
  const g = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r); g.addColorStop(0, '#e0fbff'); g.addColorStop(0.45, col); g.addColorStop(1, col2);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r * 0.98, 0, Math.PI * 2); ctx.clip();
  const rr = rng(7), nodes = []; for (let i = 0; i < 16; i++) { const a = rr() * Math.PI * 2 + t * 0.2 * (i % 2 ? 1 : -1), d = r * (0.25 + rr() * 0.65); nodes.push([Math.cos(a) * d, Math.sin(a) * d]); }
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = r * 0.015; for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) { const dx = nodes[i][0] - nodes[j][0], dy = nodes[i][1] - nodes[j][1]; if (dx * dx + dy * dy < (r * 0.5) ** 2) { ctx.beginPath(); ctx.moveTo(nodes[i][0], nodes[i][1]); ctx.lineTo(nodes[j][0], nodes[j][1]); ctx.stroke(); } }
  nodes.forEach(([nx, ny], i) => { const p = 0.5 + 0.5 * Math.sin(t * 4 + i * 1.7); ctx.fillStyle = `rgba(255,255,255,${0.4 + 0.6 * p})`; ctx.beginPath(); ctx.arc(nx, ny, r * (0.025 + 0.02 * p), 0, Math.PI * 2); ctx.fill(); });
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-r * 0.38, -r * 0.45, r * 0.28, r * 0.16, -0.6, 0, Math.PI * 2); ctx.fill(); // brillo
  // carita (ojos de luz) — expresiva pero nunca amenazante
  if (o.face !== false) {
    const blink = ((t * 0.35 + 0.2) % 1) < 0.05 ? 0.15 : 1, ey = -r * 0.05, eh = r * 0.2 * blink * (mood === 'surprised' ? 1.3 : 1), ew = r * 0.12 * (mood === 'surprised' ? 1.25 : 1);
    ctx.fillStyle = '#ffffff'; for (const sx of [-1, 1]) { const lx = (o.look || [0, 0])[0] * r * 0.08; if (mood === 'happy' && blink > 0.5) { ctx.strokeStyle = '#fff'; ctx.lineWidth = r * 0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(sx * r * 0.3 + lx, ey + r * 0.06, r * 0.11, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); } else { ctx.beginPath(); ctx.ellipse(sx * r * 0.3 + lx, ey, ew, eh, 0, 0, Math.PI * 2); ctx.fill(); } }
    ctx.strokeStyle = '#fff'; ctx.lineWidth = r * 0.06; ctx.lineCap = 'round';
    if (mood === 'surprised') { ctx.beginPath(); ctx.ellipse(0, r * 0.32, r * 0.08, r * 0.11, 0, 0, Math.PI * 2); ctx.stroke(); }
    else if (mood === 'think') { ctx.beginPath(); ctx.moveTo(-r * 0.12, r * 0.32); ctx.lineTo(r * 0.14, r * 0.28); ctx.stroke(); }
    else { const tk = (o.talk || 0) * Math.abs(Math.sin(t * 11)); ctx.beginPath(); ctx.arc(0, r * 0.2, r * 0.18, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); if (tk > 0.2) { ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.beginPath(); ctx.ellipse(0, r * 0.33, r * 0.1, r * 0.06 * tk + 2, 0, 0, Math.PI * 2); ctx.fill(); } }
    ctx.fillStyle = 'rgba(255,140,200,0.35)'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * r * 0.52, r * 0.15, r * 0.1, r * 0.06, 0, 0, Math.PI * 2); ctx.fill(); }
  }
  for (let k = 0; k < 3; k++) ring(k, true);
  // chispas que orbitan
  for (let i = 0; i < 8; i++) { const a = t * 0.8 + i * 0.785, d = r * (1.9 + 0.2 * Math.sin(t * 2 + i)); ctx.fillStyle = `rgba(255,255,255,${0.4 + 0.4 * Math.sin(t * 3 + i)})`; ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d * 0.6, r * 0.03, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore();
}

// ---------- CENTRO DE DATOS por dentro (perspectiva de pasillo) ----------
function sceneDataCenter(ctx, t, o = {}) {
  const vx = W / 2, vy = H * 0.42, cool = o.cool ?? 1;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#060a1c'); g.addColorStop(1, '#0d1430'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // techo con lámparas en perspectiva
  for (let i = 0; i < 7; i++) { const k = i / 7, z = 1 / (1 + i * 0.55), y = vy - (vy - 30) * z; ctx.fillStyle = `rgba(160,220,255,${0.25 + 0.5 * z})`; rrect(ctx, vx - 300 * z, y, 600 * z, 10 * z + 2, 4); ctx.fill(); glow(ctx, vx, y + 8, 200 * z + 20, '#a0dcff', 0.25 * z); }
  // piso con rejilla y reflejo
  const fg = ctx.createLinearGradient(0, vy, 0, H); fg.addColorStop(0, '#0b1230'); fg.addColorStop(1, '#162050'); ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(vx - 40, vy + 40); ctx.lineTo(vx + 40, vy + 40); ctx.lineTo(W, H); ctx.fill();
  ctx.strokeStyle = 'rgba(94,224,240,0.12)'; ctx.lineWidth = 2; for (let i = 1; i < 9; i++) { const z = 1 / (1 + i * 0.5), y = vy + 40 + (H - vy - 40) * z; ctx.beginPath(); ctx.moveTo(vx - (vx - 40) * z * 1.1, y); ctx.lineTo(vx + (vx - 40) * z * 1.1, y); ctx.stroke(); }
  glow(ctx, vx, H * 0.85, 520, cool > 0.5 ? '#3fa7ff' : '#ff6b5b', 0.18);
  // dos filas de racks (izquierda y derecha) en perspectiva
  for (const side of [-1, 1]) for (let i = 6; i >= 0; i--) {
    const z = 1 / (1 + i * 0.55), z2 = 1 / (1 + (i + 1) * 0.55);
    const xNear = vx + side * (90 + (vx - 90) * z), xFar = vx + side * (90 + (vx - 90) * z2);
    const top = vy - (vy - 60) * z, bot = vy + 40 + (H - vy - 80) * z, top2 = vy - (vy - 60) * z2, bot2 = vy + 40 + (H - vy - 80) * z2;
    ctx.fillStyle = i % 2 ? '#1b2340' : '#20294a'; ctx.beginPath(); ctx.moveTo(xNear, top); ctx.lineTo(xFar, top2); ctx.lineTo(xFar, bot2); ctx.lineTo(xNear, bot); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 3; ctx.stroke();
    // LEDs parpadeando en cada rack
    for (let r2 = 0; r2 < 9; r2++) for (let c = 0; c < 4; c++) {
      const u = (c + 0.5) / 4, v = (r2 + 0.7) / 10, xx = lerp(xNear, xFar, u), yy = lerp(lerp(top, top2, u), lerp(bot, bot2, u), v);
      const on = Math.sin(t * (3 + (r2 * 7 + c * 3 + i) % 5) + r2 * 1.3 + c * 2.1 + i) > 0.1;
      if (!on) continue; const cc = (r2 + c + i) % 5 === 0 ? '#ffb703' : (r2 + c) % 3 === 0 ? '#7cf29c' : '#5ee0f0';
      const sz = 5 * lerp(z, z2, u); ctx.fillStyle = cc; ctx.fillRect(xx - sz, yy - sz * 0.5, sz * 2, sz); if (i < 2) glow(ctx, xx, yy, sz * 5, cc, 0.35);
    }
  }
  // aire frío que fluye por el pasillo
  for (let i = 0; i < 18; i++) { const r = rng(i + 200), p = (t * (0.15 + r() * 0.1) + r()) % 1, z = 1 - p; ctx.strokeStyle = `rgba(160,220,255,${0.25 * p})`; ctx.lineWidth = 3; const yy = vy + 40 + (H - vy - 40) * (0.2 + r() * 0.7) * (1 - z * 0.6); ctx.beginPath(); ctx.moveTo(vx - 300 * p + r() * 200, yy); ctx.quadraticCurveTo(vx + r() * 300 * p, yy - 30, vx + 400 * p - r() * 200, yy + 10); ctx.stroke(); }
}

// ---------- LABORATORIO de científicos (fondo) ----------
function sceneLab(ctx, t, o = {}) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#e9f5ff'); g.addColorStop(1, '#cfe3f5'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(100,140,190,0.10)'; for (let x = 0; x < W; x += 140) ctx.fillRect(x, 0, 4, H * 0.62);
  // pizarrón con fórmulas que se escriben solas
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; ctx.fillStyle = '#26453b'; rrect(ctx, 120, 120, 640, 380, 16); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#8d6e63'; ctx.fillRect(110, 498, 660, 16);
  const eqs = ['E = mc²', 'a² + b² = c²', '∫ f(x) dx', 'Σ 1/n²  = π²/6', '∇ · E = ρ/ε₀']; eqs.forEach((q, i) => { const k = clamp((t * 0.6) - i * 0.6); ctx.save(); ctx.beginPath(); ctx.rect(150, 150 + i * 66, 580 * k, 60); ctx.clip(); text(ctx, q, 160, 182 + i * 66, { size: 44, fill: '#e8f5e9', lw: 0, shadow: false, align: 'left' }); ctx.restore(); });
  // mesa con matraces burbujeando
  const ty = H * 0.72; ctx.fillStyle = '#f8f9fa'; ctx.fillRect(0, ty, W, 30); ctx.fillStyle = '#adb5bd'; ctx.fillRect(0, ty + 30, W, H - ty - 30); ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.fillRect(0, ty + 30, W, 18);
  [[1180, '#5ee0c0'], [1330, '#ff8fab'], [1480, '#ffd23f'], [1640, '#8b7bff']].forEach(([x, c], i) => {
    softShadow(ctx, x, ty + 4, 70, 10, 0.3);
    ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.moveTo(x - 18, ty - 170); ctx.lineTo(x + 18, ty - 170); ctx.lineTo(x + 18, ty - 110); ctx.lineTo(x + 60, ty - 4); ctx.lineTo(x - 60, ty - 4); ctx.lineTo(x - 18, ty - 110); ctx.closePath(); ctx.fill();
    ctx.save(); ctx.clip(); ctx.fillStyle = c; ctx.fillRect(x - 70, ty - 80 + Math.sin(t * 2 + i) * 4, 140, 80); ctx.restore();
    for (let b = 0; b < 4; b++) { const p = (t * 0.9 + b / 4 + i * 0.2) % 1; ctx.fillStyle = `rgba(255,255,255,${0.8 * (1 - p)})`; ctx.beginPath(); ctx.arc(x + Math.sin(p * 8 + b) * 10, ty - 40 - p * 160, 6 + p * 6, 0, Math.PI * 2); ctx.fill(); }
    glow(ctx, x, ty - 40, 120, c, 0.25);
  });
  // pantalla con gráfica
  ctx.fillStyle = '#1d1830'; rrect(ctx, 860, 160, 360, 240, 16); ctx.fill(); ctx.fillStyle = '#0b1230'; ctx.fillRect(876, 176, 328, 208);
  ctx.strokeStyle = '#5ee0c0'; ctx.lineWidth = 5; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const xx = 886 + i * 8, yy = 330 - Math.sin(i * 0.35 + t * 3) * 40 - i * 2; i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
}

// ---------- CAJA NEGRA que se abre (open 0-1) ----------
function blackBox(ctx, x, y, s, t, open = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  softShadow(ctx, 0, 150, 260, 30, 0.45);
  if (open > 0.05) { glow(ctx, 0, -60, 420 * open, '#5ee0f0', 0.6 * open); ctx.save(); ctx.globalAlpha = open; for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.18 + Math.sin(t * 2 + i) * 0.03; ctx.fillStyle = 'rgba(160,240,255,0.18)'; ctx.beginPath(); ctx.moveTo(-60, -80); ctx.lineTo(Math.cos(a) * 700, Math.sin(a) * 700); ctx.lineTo(Math.cos(a + 0.06) * 700, Math.sin(a + 0.06) * 700); ctx.lineTo(60, -80); ctx.fill(); } ctx.restore();
    for (let i = 0; i < 14; i++) { const p = (t * 0.5 + i / 14) % 1; ctx.fillStyle = `rgba(255,255,255,${(1 - p) * open})`; ctx.font = `${30 + p * 20}px Lilita`; ctx.textAlign = 'center'; ctx.fillText(['0', '1', '?', '∑', '★'][i % 5], (i - 7) * 26 + Math.sin(t * 2 + i) * 20, -100 - p * 340); } }
  // cuerpo (cubo en perspectiva)
  ctx.fillStyle = '#15121f'; ctx.beginPath(); ctx.moveTo(-200, -80); ctx.lineTo(200, -80); ctx.lineTo(200, 140); ctx.lineTo(-200, 140); ctx.fill();
  ctx.fillStyle = '#231e33'; ctx.beginPath(); ctx.moveTo(200, -80); ctx.lineTo(260, -130); ctx.lineTo(260, 90); ctx.lineTo(200, 140); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(-200, -80, 400, 30);
  text(ctx, '?', 0, 40, { size: 150, fill: '#3b3554', lw: 0, shadow: false });
  // tapa que gira
  ctx.save(); ctx.translate(-200, -80); ctx.rotate(-open * 1.9); ctx.fillStyle = '#2d2742'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(400, 0); ctx.lineTo(460, -50); ctx.lineTo(60, -50); ctx.closePath(); ctx.fill(); ctx.restore();
  ctx.restore();
}

// ---------- PROTEÍNA 3D (cadena de esferas que gira) ----------
function protein(ctx, x, y, s, t, seed = 3, fold = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const r = rng(seed), pts = []; let px = 0, py = 0, pz = 0;
  for (let i = 0; i < 46; i++) { const a = i * 0.55 + r() * 0.6, b = i * 0.31 + r(); px += Math.cos(a) * 28 * fold + (1 - fold) * 22; py += Math.sin(b) * 26 * fold; pz += Math.sin(a * 1.3) * 26 * fold; pts.push([px, py, pz]); }
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length, cy = pts.reduce((a, p) => a + p[1], 0) / pts.length, cz = pts.reduce((a, p) => a + p[2], 0) / pts.length;
  const rot = t * 0.6, proj = pts.map(([a, b, c], i) => { const X = (a - cx) * Math.cos(rot) - (c - cz) * Math.sin(rot), Z = (a - cx) * Math.sin(rot) + (c - cz) * Math.cos(rot); return [X, b - cy, Z, i]; });
  const cols = ['#ff6b5b', '#ffd23f', '#5ee0c0', '#7cc6ff', '#8b7bff', '#ff8fab'];
  ctx.lineCap = 'round'; for (let i = 1; i < proj.length; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(proj[i - 1][0], proj[i - 1][1]); ctx.lineTo(proj[i][0], proj[i][1]); ctx.stroke(); }
  [...proj].sort((a, b) => a[2] - b[2]).forEach(([X, Y, Z, i]) => { const k = 0.75 + Z / 400, rr = 16 * k; const c = cols[Math.floor(i / 8) % cols.length]; const g = ctx.createRadialGradient(X - rr * 0.35, Y - rr * 0.35, rr * 0.1, X, Y, rr); g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, c); g.addColorStop(1, shadeHex(c, -0.35)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X, Y, rr, 0, Math.PI * 2); ctx.fill(); });
  ctx.restore();
}

// ---------- TABLEROS: ajedrez y Go ----------
function chessBoard(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.save(); ctx.transform(1, 0, -0.35, 0.55, 0, 0);
  softShadow(ctx, 0, 230, 320, 40, 0.35);
  ctx.fillStyle = '#6d4c41'; rrect(ctx, -250, -250, 500, 500, 18); ctx.fill();
  for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) { ctx.fillStyle = (r + c) % 2 ? '#8d6e63' : '#f1e3c8'; ctx.fillRect(-220 + c * 55, -220 + r * 55, 55, 55); }
  ctx.restore();
  // piezas (rey y caballo) que saltan
  const hop = Math.abs(Math.sin(t * 2)) * 30;
  const piece = (px, py, c, king) => { ctx.save(); ctx.translate(px, py); softShadow(ctx, 0, 6, 40, 10, 0.35); const g = ctx.createLinearGradient(-30, 0, 30, 0); g.addColorStop(0, shadeHex(c, 0.2)); g.addColorStop(1, shadeHex(c, -0.2)); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, 34, 12, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(-22, -6); ctx.quadraticCurveTo(-12, -60, -14, -100); ctx.lineTo(14, -100); ctx.quadraticCurveTo(12, -60, 22, -6); ctx.fill(); if (king) { ctx.beginPath(); ctx.arc(0, -112, 20, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-4, -160, 8, 34); ctx.fillRect(-14, -146, 28, 8); } else { ctx.beginPath(); ctx.moveTo(-16, -100); ctx.quadraticCurveTo(-30, -150, 6, -160); ctx.quadraticCurveTo(36, -140, 18, -100); ctx.fill(); ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(8, -140, 4, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); };
  piece(-120, 10, '#f8f9fa', true); piece(90, -40 - hop, '#2b2d42', false);
  ctx.restore();
}
function goBoard(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.save(); ctx.transform(1, 0, 0.3, 0.55, 0, 0);
  softShadow(ctx, 0, 240, 320, 40, 0.35);
  ctx.fillStyle = '#e9b872'; rrect(ctx, -260, -260, 520, 520, 16); ctx.fill(); ctx.strokeStyle = 'rgba(80,50,20,0.6)'; ctx.lineWidth = 2; for (let i = 0; i < 13; i++) { ctx.beginPath(); ctx.moveTo(-230 + i * 38.3, -230); ctx.lineTo(-230 + i * 38.3, 230); ctx.moveTo(-230, -230 + i * 38.3); ctx.lineTo(230, -230 + i * 38.3); ctx.stroke(); }
  const r = rng(5), n = Math.min(40, Math.floor(t * 6)); for (let i = 0; i < n; i++) { const c = Math.floor(r() * 13), rr = Math.floor(r() * 13), bw = i % 2; const g = ctx.createRadialGradient(-230 + c * 38.3 - 5, -230 + rr * 38.3 - 5, 2, -230 + c * 38.3, -230 + rr * 38.3, 17); g.addColorStop(0, bw ? '#ffffff' : '#555'); g.addColorStop(1, bw ? '#ced4da' : '#111'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(-230 + c * 38.3, -230 + rr * 38.3, 17, 0, Math.PI * 2); ctx.fill(); }
  ctx.restore(); ctx.restore();
}
function goldMedal(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 2) * 0.08);
  ctx.fillStyle = '#1d4ed8'; ctx.beginPath(); ctx.moveTo(-60, -220); ctx.lineTo(-10, -60); ctx.lineTo(10, -60); ctx.lineTo(-30, -220); ctx.fill(); ctx.fillStyle = '#ef233c'; ctx.beginPath(); ctx.moveTo(60, -220); ctx.lineTo(10, -60); ctx.lineTo(-10, -60); ctx.lineTo(30, -220); ctx.fill();
  glow(ctx, 0, 0, 220, '#ffd23f', 0.5);
  const g = ctx.createRadialGradient(-30, -30, 10, 0, 0, 110); g.addColorStop(0, '#fff3b0'); g.addColorStop(0.5, '#ffc300'); g.addColorStop(1, '#c98a00'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 110, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(160,100,0,0.6)'; ctx.lineWidth = 8; ctx.beginPath(); ctx.arc(0, 0, 82, 0, Math.PI * 2); ctx.stroke();
  text(ctx, '1', 0, 6, { size: 110, fill: '#fff8dc', stroke: '#c98a00', lw: 10, shadow: false });
  const sp = (t * 0.7) % 1; ctx.fillStyle = `rgba(255,255,255,${0.8 * Math.sin(sp * Math.PI)})`; ctx.save(); ctx.rotate(0.6); ctx.fillRect(-120 + sp * 240, -110, 18, 220); ctx.restore();
  ctx.restore();
}

// ---------- LIBROS que vuelan hacia la IA (aprendizaje) ----------
function flyingBook(ctx, x, y, s, t, col) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 3) * 0.2);
  const flap = Math.sin(t * 12) * 0.5;
  ctx.fillStyle = col; ctx.save(); ctx.rotate(-0.15 - flap * 0.4); rrect(ctx, -70, -48, 70, 96, 8); ctx.fill(); ctx.restore(); ctx.save(); ctx.rotate(0.15 + flap * 0.4); rrect(ctx, 0, -48, 70, 96, 8); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#fffdf5'; ctx.save(); ctx.rotate(-0.1 - flap * 0.3); ctx.fillRect(-62, -40, 60, 80); ctx.restore(); ctx.save(); ctx.rotate(0.1 + flap * 0.3); ctx.fillRect(2, -40, 60, 80); ctx.restore();
  ctx.restore();
}

// ---------- ROBOT amigable (para el ejemplo del café) ----------
function robotHelper(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
  softShadow(ctx, 0, 6, 110, 16, 0.3);
  const bob = Math.sin(t * 3) * 6, roll = t * (o.move ? 6 : 0);
  // ruedas
  for (const sx of [-1, 1]) { ctx.save(); ctx.translate(sx * 55, -30); ctx.rotate(roll); ctx.fillStyle = '#343a40'; ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#adb5bd'; ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-3, -26, 6, 52); ctx.restore(); }
  ctx.translate(0, bob);
  const body = ctx.createLinearGradient(-80, 0, 80, 0); body.addColorStop(0, '#ffffff'); body.addColorStop(1, '#c9d6e8');
  ctx.fillStyle = body; rrect(ctx, -80, -220, 160, 170, 40); ctx.fill(); ctx.fillStyle = '#5ee0c0'; rrect(ctx, -40, -170, 80, 50, 14); ctx.fill(); glow(ctx, 0, -145, 60, '#5ee0c0', 0.4);
  // brazos
  const armUp = o.armUp ?? 0;
  for (const sx of [-1, 1]) { ctx.strokeStyle = '#c9d6e8'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx * 78, -180); ctx.quadraticCurveTo(sx * 120, -150 - armUp * 60, sx * 115, -100 - armUp * 120); ctx.stroke(); ctx.fillStyle = '#adb5bd'; ctx.beginPath(); ctx.arc(sx * 115, -96 - armUp * 120, 18, 0, Math.PI * 2); ctx.fill(); }
  if (o.coffee) drawCoffee(ctx, 125, -150 - armUp * 120, t, 0.8);
  // cabeza-pantalla
  ctx.fillStyle = body; rrect(ctx, -95, -360, 190, 140, 50); ctx.fill(); ctx.fillStyle = '#1d2a44'; rrect(ctx, -75, -340, 150, 100, 36); ctx.fill();
  ctx.strokeStyle = '#adb5bd'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, -360); ctx.lineTo(0, -400); ctx.stroke(); ctx.fillStyle = Math.sin(t * 6) > 0 ? '#ff6b5b' : '#ffd23f'; ctx.beginPath(); ctx.arc(0, -408, 12, 0, Math.PI * 2); ctx.fill(); glow(ctx, 0, -408, 40, '#ff6b5b', 0.4);
  const mood = o.mood || 'happy', bl = ((t * 0.4) % 1) < 0.05 ? 0.2 : 1;
  ctx.fillStyle = '#5ff4ff'; ctx.save(); ctx.shadowColor = '#5ff4ff'; ctx.shadowBlur = 16;
  for (const sx of [-1, 1]) { if (mood === 'worried') { ctx.save(); ctx.translate(sx * 34, -298); ctx.rotate(sx * 0.3); ctx.fillRect(-16, -4, 32, 8); ctx.restore(); } else { rrect(ctx, sx * 34 - 12, -310 - 14 * bl, 24, 28 * bl + 2, 10); ctx.fill(); } }
  ctx.strokeStyle = '#5ff4ff'; ctx.lineWidth = 6; ctx.beginPath(); if (mood === 'worried') { ctx.moveTo(-20, -262); ctx.lineTo(20, -262); } else ctx.arc(0, -276, 20, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); ctx.restore();
  ctx.restore();
}
function offButton(ctx, x, y, s, t, pressed = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  softShadow(ctx, 0, 40, 130, 24, 0.35); ctx.fillStyle = '#495057'; ctx.beginPath(); ctx.ellipse(0, 20, 120, 46, 0, 0, Math.PI * 2); ctx.fill();
  const dy = pressed * 20; const g = ctx.createRadialGradient(-30, -30 + dy, 10, 0, dy, 100); g.addColorStop(0, '#ff8a80'); g.addColorStop(1, '#c1121f'); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, dy - 10, 96, 38, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-96, dy - 10, 192, 30 - dy); ctx.beginPath(); ctx.ellipse(0, 20, 96, 30, 0, 0, Math.PI); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(0, dy - 12, 22, -0.3 * Math.PI, 1.3 * Math.PI); ctx.stroke(); ctx.beginPath(); ctx.moveTo(0, dy - 42); ctx.lineTo(0, dy - 14); ctx.stroke();
  ctx.restore();
}

// ---------- PALACIO del rey Midas (todo lo que toca se vuelve oro) ----------
function scenePalace(ctx, t, gold = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#5a189a'); g.addColorStop(1, '#240046'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 6; i++) { const x = 160 + i * 320; const cg = ctx.createLinearGradient(x - 40, 0, x + 40, 0); cg.addColorStop(0, '#e9d8a6'); cg.addColorStop(0.5, '#fff8e7'); cg.addColorStop(1, '#c9b27c'); ctx.fillStyle = cg; ctx.fillRect(x - 36, 120, 72, H * 0.62); ctx.fillStyle = '#c9b27c'; ctx.fillRect(x - 52, 100, 104, 28); ctx.fillRect(x - 52, 120 + H * 0.62 - 20, 104, 28); }
  ctx.fillStyle = '#9d0208'; ctx.beginPath(); ctx.moveTo(W / 2 - 260, H); ctx.lineTo(W / 2 - 120, H * 0.66); ctx.lineTo(W / 2 + 120, H * 0.66); ctx.lineTo(W / 2 + 260, H); ctx.fill(); // alfombra
  ctx.fillStyle = '#3c096c'; ctx.fillRect(0, H * 0.78, W, H * 0.22); ctx.fillStyle = 'rgba(255,215,0,0.15)'; for (let i = 0; i < 14; i++) ctx.fillRect(i * 150 - ((t * 10) % 150), H * 0.8, 70, 6);
  // antorchas
  for (const x of [80, W - 80]) { ctx.fillStyle = '#6d4c41'; ctx.fillRect(x - 8, 300, 16, 120); const f = 1 + 0.15 * Math.sin(t * 13 + x); glow(ctx, x, 280, 160, '#ffb703', 0.5); ctx.fillStyle = '#ffba08'; ctx.beginPath(); ctx.moveTo(x - 18, 300); ctx.quadraticCurveTo(x - 20, 260 * f, x, 230 / f); ctx.quadraticCurveTo(x + 20, 260 * f, x + 18, 300); ctx.fill(); }
  if (gold > 0) { ctx.fillStyle = `rgba(255,200,0,${0.18 * gold})`; ctx.fillRect(0, 0, W, H); for (let i = 0; i < 40; i++) { const r = rng(i + 33), p = (t * (0.2 + r() * 0.3) + r()) % 1; ctx.fillStyle = `rgba(255,230,120,${gold * Math.sin(p * Math.PI)})`; ctx.beginPath(); ctx.arc(r() * W, H - p * H, 3 + r() * 4, 0, Math.PI * 2); ctx.fill(); } }
}
function crownOn(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const g = ctx.createLinearGradient(0, -60, 0, 20); g.addColorStop(0, '#fff3b0'); g.addColorStop(1, '#e0a800'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(-60, 20); ctx.lineTo(-70, -40); ctx.lineTo(-35, -10); ctx.lineTo(0, -60); ctx.lineTo(35, -10); ctx.lineTo(70, -40); ctx.lineTo(60, 20); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#ef233c'; for (const xx of [-35, 0, 35]) { ctx.beginPath(); ctx.arc(xx, 2, 8, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); }
let _goldCv = null;
function goldify(ctx, k, fn) { // dibuja un objeto (centrado en 0,0, radio < 200) y lo "convierte en oro" según k
  if (k <= 0) { fn(ctx); return; }
  if (!_goldCv) _goldCv = document.createElement('canvas'); _goldCv.width = 400; _goldCv.height = 400; const g2 = _goldCv.getContext('2d');
  g2.clearRect(0, 0, 400, 400); g2.save(); g2.translate(200, 200); fn(g2); g2.restore();
  g2.save(); g2.globalCompositeOperation = 'source-atop'; g2.globalAlpha = k; const g = g2.createLinearGradient(80, 80, 320, 320); g.addColorStop(0, '#fff3b0'); g.addColorStop(0.5, '#ffc300'); g.addColorStop(1, '#b8860b'); g2.fillStyle = g; g2.fillRect(0, 0, 400, 400); g2.restore();
  if (k > 0.5) glow(ctx, 0, 0, 160, '#ffd23f', 0.4 * k);
  ctx.drawImage(_goldCv, -200, -200);
}
function apple(ctx, x, y, s) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const g = ctx.createRadialGradient(-20, -20, 5, 0, 0, 60); g.addColorStop(0, '#ff8a80'); g.addColorStop(1, '#c1121f'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(-18, 0, 44, 0, Math.PI * 2); ctx.arc(18, 0, 44, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#6d4c41'; ctx.fillRect(-3, -60, 6, 22); ctx.fillStyle = '#52b788'; ctx.beginPath(); ctx.ellipse(16, -54, 18, 8, -0.5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.ellipse(-30, -16, 10, 16, 0.4, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }

// ---------- SALÓN DE CLASES ----------
function sceneClassroom(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#fff3d6'); g.addColorStop(1, '#ffe0a8'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 10; ctx.fillStyle = '#2d6a4f'; rrect(ctx, 520, 90, 880, 420, 18); ctx.fill(); ctx.restore(); ctx.fillStyle = '#8d6e63'; ctx.fillRect(510, 508, 900, 18);
  const lines = ['2 + 2 = 4  ✓', '¿Por qué el cielo es azul?', 'H₂O = agua 💧']; lines.forEach((q, i) => { const k = clamp(t * 0.5 - i * 0.7); ctx.save(); ctx.beginPath(); ctx.rect(560, 130 + i * 110, 820 * k, 100); ctx.clip(); text(ctx, q, 580, 180 + i * 110, { size: 58, fill: '#e8f5e9', lw: 0, shadow: false, align: 'left' }); ctx.restore(); });
  // ventana con árbol
  ctx.fillStyle = '#fffdf5'; rrect(ctx, 80, 120, 340, 300, 12); ctx.fill(); ctx.fillStyle = '#8ecae6'; ctx.fillRect(96, 136, 308, 268); ctx.fillStyle = '#52b788'; ctx.beginPath(); ctx.arc(260 + Math.sin(t) * 6, 330, 90, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fffdf5'; ctx.fillRect(244, 136, 12, 268);
  // reloj de pared
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(1650, 200, 70, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#1d1830'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(1650, 200); ctx.lineTo(1650 + Math.cos(t - 1.5) * 50, 200 + Math.sin(t - 1.5) * 50); ctx.moveTo(1650, 200); ctx.lineTo(1650 + Math.cos(t / 12 - 1.5) * 34, 200 + Math.sin(t / 12 - 1.5) * 34); ctx.stroke();
  ctx.fillStyle = '#c98a5e'; ctx.fillRect(0, H * 0.8, W, H * 0.2);
}
function tablet(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.08); ctx.fillStyle = '#2b2f3b'; rrect(ctx, -170, -120, 340, 240, 26); ctx.fill(); const g = ctx.createLinearGradient(-150, -100, 150, 100); g.addColorStop(0, '#4f6df5'); g.addColorStop(1, '#7b2ff7'); ctx.fillStyle = g; rrect(ctx, -152, -102, 304, 204, 16); ctx.fill(); aiCore(ctx, -70, 0, 46, t, { mood: 'happy', talk: 1 }); ctx.fillStyle = 'rgba(255,255,255,0.9)'; for (let i = 0; i < 3; i++) { rrect(ctx, 10, -50 + i * 36, 120 - (i % 2) * 30, 22, 10); ctx.fill(); } ctx.restore(); }

// ---------- MAPA DEL MUNDO con noticias ----------
function newsDesk(ctx, t, headline) {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0b1a3a'); g.addColorStop(1, '#1d3557'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  globeGrids(ctx, 1400, 420, 300, t * 2, { night: 0.3 });
  for (let i = 0; i < 5; i++) { const p = (t * 0.25 + i / 5) % 1; ctx.strokeStyle = `rgba(94,224,240,${1 - p})`; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(1400, 420, 300 + p * 300, 0, Math.PI * 2); ctx.stroke(); }
  ctx.fillStyle = '#c1121f'; ctx.fillRect(0, H * 0.74, W, 110); ctx.fillStyle = '#fff'; ctx.fillRect(0, H * 0.74 + 110, W, 70);
  text(ctx, 'ÚLTIMA HORA', 200, H * 0.74 + 55, { size: 58, fill: '#fff', lw: 0, shadow: false });
  ctx.save(); ctx.beginPath(); ctx.rect(400, H * 0.74, W - 400, 110); ctx.clip(); text(ctx, headline, 420 + W - ((t * 220) % (W + 1400)), H * 0.74 + 55, { size: 54, fill: '#fff', lw: 0, shadow: false, align: 'left' }); ctx.restore();
}

// ---------- íconos extra ----------
function pillIcon(ctx, x, y, s, t, c1 = '#ff6b5b', c2 = '#ffffff') { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.6 + Math.sin(t * 2) * 0.1); softShadow(ctx, 0, 70, 80, 12, 0.25); ctx.save(); rrect(ctx, -100, -40, 200, 80, 40); ctx.clip(); ctx.fillStyle = c1; ctx.fillRect(-100, -40, 100, 80); ctx.fillStyle = c2; ctx.fillRect(0, -40, 100, 80); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(-100, 14, 200, 30); ctx.fillStyle = 'rgba(255,255,255,0.5)'; rrect(ctx, -76, -28, 120, 14, 7); ctx.fill(); ctx.restore(); ctx.restore(); }
function shieldIcon(ctx, x, y, s, t, col = '#5ee0c0') { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(ctx, 0, 0, 220, col, 0.4 + 0.15 * Math.sin(t * 3)); const g = ctx.createLinearGradient(-100, -120, 100, 120); g.addColorStop(0, shadeHex(col, 0.3)); g.addColorStop(1, shadeHex(col, -0.3)); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -130); ctx.quadraticCurveTo(70, -95, 110, -100); ctx.quadraticCurveTo(115, 60, 0, 140); ctx.quadraticCurveTo(-115, 60, -110, -100); ctx.quadraticCurveTo(-70, -95, 0, -130); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); ctx.moveTo(-45, 5); ctx.lineTo(-10, 42); ctx.lineTo(55, -35); ctx.stroke(); ctx.restore(); }
function bigCheck(ctx, x, y, s, ok) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = ok ? '#2dc653' : '#ef233c'; ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); if (ok) { ctx.moveTo(-22, 2); ctx.lineTo(-6, 20); ctx.lineTo(24, -16); } else { ctx.moveTo(-18, -18); ctx.lineTo(18, 18); ctx.moveTo(18, -18); ctx.lineTo(-18, 18); } ctx.stroke(); ctx.restore(); }
function crossOut(ctx, x, y, w, k) { if (k <= 0) return; ctx.save(); ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 26; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - w, y - w); ctx.lineTo(x - w + 2 * w * Math.min(1, k * 2), y - w + 2 * w * Math.min(1, k * 2)); if (k > 0.5) { const q = (k - 0.5) * 2; ctx.moveTo(x + w, y - w); ctx.lineTo(x + w - 2 * w * q, y - w + 2 * w * q); } ctx.stroke(); ctx.restore(); }

// =================== ESCENARIOS NUEVOS (video 004) ===================
// Amanecer sobre colinas y ciudad lejana (3 planos)
function sceneSunrise(ctx, t, k = 1) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mixHex('#1b1f4b', '#7cc6ff', k)); g.addColorStop(0.55, mixHex('#5a3d7a', '#ffd6a5', k)); g.addColorStop(1, mixHex('#ff8f6b', '#fff1d0', k)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const sy = 700 - 260 * k; glow(ctx, 1400, sy, 520, '#ffb703', 0.55); ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(1400, sy, 110, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 12; i++) { const a = i * 0.52 + t * 0.08; ctx.fillStyle = 'rgba(255,230,150,0.07)'; ctx.beginPath(); ctx.moveTo(1400, sy); ctx.lineTo(1400 + Math.cos(a) * 1600, sy + Math.sin(a) * 1600); ctx.lineTo(1400 + Math.cos(a + 0.12) * 1600, sy + Math.sin(a + 0.12) * 1600); ctx.fill(); }
  for (let i = 0; i < 5; i++) { const x = ((i * 470 + t * (12 + i * 4)) % (W + 500)) - 250, y = 140 + i * 55; ctx.fillStyle = 'rgba(255,255,255,0.75)'; for (const [dx, dy, r] of [[0, 0, 50], [55, -18, 62], [115, 0, 46], [55, 18, 52]]) { ctx.beginPath(); ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2); ctx.fill(); } }
  // ciudad lejana
  const r = rng(91); ctx.fillStyle = mixHex('#6d5a9c', '#b8c4e8', k); for (let x = 0; x < W; x += 70) { const h = 80 + r() * 160; ctx.fillRect(x, 720 - h, 60, h); }
  // colinas medias y cercanas
  ctx.fillStyle = mixHex('#3d5a80', '#7fc8a9', k); ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 760 + Math.sin(x * 0.004 + 1) * 50); ctx.lineTo(W, H); ctx.fill();
  ctx.fillStyle = mixHex('#2b4162', '#52b788', k); ctx.beginPath(); ctx.moveTo(0, H); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 880 + Math.sin(x * 0.006 + 3) * 40); ctx.lineTo(W, H); ctx.fill();
  for (let i = 0; i < 4; i++) { const p = (t * 0.08 + i * 0.25) % 1; const x = W * p, y = 300 + Math.sin(p * 9 + i) * 30; ctx.strokeStyle = 'rgba(40,30,60,0.7)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x - 14, y - 6 * Math.sin(t * 9 + i)); ctx.lineTo(x, y); ctx.lineTo(x + 14, y - 6 * Math.sin(t * 9 + i)); ctx.stroke(); }
}
// Escenario de olimpiada: telón, reflectores, podio
function sceneStage(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3c096c'); g.addColorStop(1, '#10002b'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 14; i++) { const x = i * 140; const cg = ctx.createLinearGradient(x, 0, x + 140, 0); cg.addColorStop(0, '#9d0208'); cg.addColorStop(0.5, '#d00000'); cg.addColorStop(1, '#6a040f'); ctx.fillStyle = cg; ctx.beginPath(); ctx.moveTo(x, 0); ctx.quadraticCurveTo(x + 70 + Math.sin(t + i) * 8, 400, x, 760); ctx.lineTo(x + 140, 760); ctx.quadraticCurveTo(x + 70 + Math.sin(t + i + 1) * 8, 400, x + 140, 0); ctx.fill(); }
  ctx.globalAlpha = 0.85; ctx.fillStyle = '#1d0b2e'; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; // telón al fondo, oscuro
  for (const [x, c] of [[300, '#ffd23f'], [960, '#ffffff'], [1620, '#7cc6ff']]) { const a = Math.sin(t * 0.7 + x) * 0.25; ctx.save(); ctx.translate(x, -40); ctx.rotate(a); const lg = ctx.createLinearGradient(0, 0, 0, 1000); lg.addColorStop(0, c + '88'); lg.addColorStop(1, c + '00'); ctx.fillStyle = lg; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(30, 0); ctx.lineTo(260, 1100); ctx.lineTo(-260, 1100); ctx.fill(); ctx.restore(); glow(ctx, x, 0, 120, c, 0.6); }
  ctx.fillStyle = '#240046'; ctx.fillRect(0, 860, W, 220); ctx.fillStyle = '#3c096c'; ctx.fillRect(0, 860, W, 18);
  for (let i = 0; i < 30; i++) { const r = rng(i + 70), p = (t * 0.3 + r()) % 1; ctx.fillStyle = ['#ffd23f', '#ff6b5b', '#5ee0c0', '#7cc6ff'][i % 4]; ctx.save(); ctx.translate(r() * W, p * H); ctx.rotate(t * 3 + i); ctx.fillRect(-8, -4, 16, 8); ctx.restore(); }
}
function podium(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); softShadow(ctx, 0, 0, 380, 30, 0.4); [[-240, 140, '#c0c0c0', '2'], [0, 220, '#ffd23f', '1'], [240, 100, '#cd7f32', '3']].forEach(([px, h, c, n]) => { const g = ctx.createLinearGradient(px - 120, 0, px + 120, 0); g.addColorStop(0, shadeHex(c, 0.2)); g.addColorStop(1, shadeHex(c, -0.25)); ctx.fillStyle = g; ctx.fillRect(px - 120, -h, 240, h); ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(px - 120, -h, 240, 12); text(ctx, n, px, -h / 2, { size: 80, fill: '#fff', lw: 0, shadow: false }); }); ctx.restore(); }
// Biblioteca en perspectiva
function sceneLibrary(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#4a2c17'); g.addColorStop(1, '#2b1a0e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const cols = ['#e63946', '#457b9d', '#2a9d8f', '#e9c46a', '#f4a261', '#8b7bff', '#ff8fab'];
  const shelf = (x0, x1, y0, rows, h, sc) => { for (let r2 = 0; r2 < rows; r2++) { const y = y0 + r2 * h; ctx.fillStyle = '#6d4c41'; ctx.fillRect(x0, y + h - 14, x1 - x0, 14); let x = x0 + 6; const rr = rng(r2 * 13 + x0); while (x < x1 - 30) { const w = (18 + rr() * 22) * sc, bh = h * (0.6 + rr() * 0.3); ctx.fillStyle = cols[Math.floor(rr() * cols.length)]; ctx.fillRect(x, y + h - 14 - bh, w - 3, bh); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(x + 3, y + h - 14 - bh + 8, 4, bh - 16); x += w; } } };
  ctx.globalAlpha = 0.45; shelf(0, W, 20, 3, 150, 0.7); ctx.globalAlpha = 1;
  ctx.fillStyle = 'rgba(30,15,5,0.4)'; ctx.fillRect(0, 0, W, 480);
  shelf(0, 520, 380, 4, 150, 1); shelf(W - 520, W, 380, 4, 150, 1);
  // ventana central con luz y polvo dorado
  ctx.fillStyle = '#fff1c1'; rrect(ctx, 760, 120, 400, 520, 200); ctx.fill(); glow(ctx, 960, 380, 500, '#ffd166', 0.45);
  ctx.fillStyle = 'rgba(255,220,140,0.12)'; ctx.beginPath(); ctx.moveTo(760, 400); ctx.lineTo(1160, 400); ctx.lineTo(1500, H); ctx.lineTo(420, H); ctx.fill();
  for (let i = 0; i < 30; i++) { const r = rng(i + 400), p = (t * 0.05 + r()) % 1; ctx.fillStyle = `rgba(255,235,180,${0.7 * Math.sin(p * Math.PI)})`; ctx.beginPath(); ctx.arc(600 + r() * 700 + Math.sin(t + i) * 20, H - p * 700, 2 + r() * 3, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#5d3a1a'; ctx.fillRect(0, 980, W, 100); ctx.fillStyle = '#7b4f2c'; ctx.fillRect(0, 980, W, 10);
}
// Parque de día (pasto, árboles, banca, estanque, papalote)
function scenePark(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#8ecae6'); g.addColorStop(1, '#e0f7ff'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  glow(ctx, 260, 170, 260, '#fff3b0', 0.6); ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(260, 170, 70, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 4; i++) { const x = ((i * 560 + t * 18) % (W + 400)) - 200, y = 120 + (i % 2) * 90; ctx.fillStyle = 'rgba(255,255,255,0.9)'; for (const [dx, dy, r] of [[0, 0, 44], [50, -16, 56], [104, 0, 40]]) { ctx.beginPath(); ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2); ctx.fill(); } }
  // ciudad lejana tenue + colinas
  const r = rng(12); ctx.fillStyle = '#b8d8e8'; for (let x = 0; x < W; x += 90) { const h = 80 + r() * 200; ctx.fillRect(x, 600 - h, 76, h); }
  ctx.fillStyle = '#95d5b2'; ctx.beginPath(); ctx.moveTo(0, 700); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 600 + Math.sin(x * 0.005) * 30); ctx.lineTo(W, 700); ctx.fill();
  ctx.fillStyle = '#74c69d'; ctx.fillRect(0, 640, W, H - 640); ctx.fillStyle = '#52b788'; ctx.fillRect(0, 900, W, 180);
  // camino curvo
  ctx.fillStyle = '#e9d8a6'; ctx.beginPath(); ctx.moveTo(700, 640); ctx.quadraticCurveTo(500, 850, 300, H); ctx.lineTo(900, H); ctx.quadraticCurveTo(900, 800, 820, 640); ctx.fill();
  // estanque con patos
  ctx.fillStyle = '#48cae4'; ctx.beginPath(); ctx.ellipse(1450, 760, 300, 70, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 3; for (let i = 0; i < 3; i++) { const p = (t * 0.4 + i / 3) % 1; ctx.beginPath(); ctx.ellipse(1450, 760, 80 + p * 200, 15 + p * 45, 0, 0, Math.PI * 2); ctx.globalAlpha = 1 - p; ctx.stroke(); ctx.globalAlpha = 1; }
  const dx = 1400 + Math.sin(t * 0.5) * 140; ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.ellipse(dx, 752, 26, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.arc(dx + 20 * Math.sign(Math.cos(t * 0.5)), 734, 11, 0, Math.PI * 2); ctx.fill();
  // árboles (lejanos y cercanos) que se mecen
  const tree = (x, y, s) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); softShadow(ctx, 0, 0, 120, 20, 0.25); ctx.fillStyle = '#6d4c41'; ctx.fillRect(-14, -160, 28, 160); ctx.rotate(Math.sin(t * 1.3 + x) * 0.03); for (const [ax, ay, ar, c] of [[0, -230, 110, '#40916c'], [-70, -190, 80, '#2d6a4f'], [70, -195, 85, '#52b788'], [20, -280, 70, '#74c69d']]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(ax, ay, ar, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); };
  tree(1100, 660, 0.6); tree(1840, 690, 0.7); tree(120, 980, 1.1);
  // banca
  ctx.fillStyle = '#8d6e63'; ctx.fillRect(1180, 880, 300, 20); ctx.fillRect(1180, 830, 300, 16); ctx.fillStyle = '#495057'; ctx.fillRect(1200, 900, 12, 50); ctx.fillRect(1450, 900, 12, 50);
  // papalote
  const kx = 1650 + Math.sin(t * 0.8) * 60, ky = 260 + Math.cos(t * 1.1) * 30; ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(kx, ky + 60); ctx.quadraticCurveTo(kx - 100, 600, 1560, 940); ctx.stroke(); ctx.fillStyle = '#ff6b5b'; ctx.beginPath(); ctx.moveTo(kx, ky - 60); ctx.lineTo(kx + 45, ky); ctx.lineTo(kx, ky + 60); ctx.lineTo(kx - 45, ky); ctx.fill(); ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.moveTo(kx, ky - 60); ctx.lineTo(kx + 45, ky); ctx.lineTo(kx, ky); ctx.fill();
}
// Mapa del clima en pantalla de TV
function sceneWeather(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0077b6'); g.addColorStop(1, '#023e8a'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.35)'; ctx.shadowBlur = 30; ctx.shadowOffsetY = 14; ctx.fillStyle = '#1d1830'; rrect(ctx, 380, 90, 1160, 700, 30); ctx.fill(); ctx.restore();
  ctx.save(); rrect(ctx, 400, 110, 1120, 660, 18); ctx.clip();
  ctx.fillStyle = '#48cae4'; ctx.fillRect(400, 110, 1120, 660);
  ctx.fillStyle = '#95d5b2'; ctx.beginPath(); ctx.moveTo(520, 200); ctx.bezierCurveTo(800, 150, 900, 300, 1000, 280); ctx.bezierCurveTo(1150, 260, 1300, 380, 1250, 520); ctx.bezierCurveTo(1200, 700, 950, 720, 850, 640); ctx.bezierCurveTo(700, 560, 520, 600, 480, 450); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.08)'; ctx.beginPath(); ctx.ellipse(950, 520, 260, 120, 0, 0, Math.PI * 2); ctx.fill();
  // frentes de lluvia moviéndose
  for (let i = 0; i < 3; i++) { const x = 380 + ((t * 70 + i * 420) % 1300), y = 260 + i * 150; ctx.fillStyle = 'rgba(255,255,255,0.85)'; for (const [dx, dy, r] of [[0, 0, 40], [44, -14, 50], [92, 0, 36]]) { ctx.beginPath(); ctx.arc(x + dx, y + dy, r, 0, Math.PI * 2); ctx.fill(); } ctx.strokeStyle = '#0077b6'; ctx.lineWidth = 5; for (let k = 0; k < 4; k++) { const p = (t * 2 + k / 4) % 1; ctx.beginPath(); ctx.moveTo(x + k * 28, y + 40 + p * 50); ctx.lineTo(x + k * 28 - 6, y + 58 + p * 50); ctx.stroke(); } }
  // sol sobre el mapa
  ctx.save(); ctx.translate(1300, 230); ctx.rotate(t * 0.5); ctx.fillStyle = '#ffd23f'; for (let i = 0; i < 10; i++) { ctx.rotate(Math.PI / 5); ctx.fillRect(48, -6, 30, 12); } ctx.beginPath(); ctx.arc(0, 0, 40, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  // temperaturas
  [[640, 420, '24°'], [900, 360, '19°'], [1100, 560, '28°']].forEach(([x, y, s], i) => { ctx.fillStyle = '#fff'; rrect(ctx, x - 55, y - 34, 110, 68, 20); ctx.fill(); text(ctx, s, x, y, { size: 44, fill: i === 2 ? '#e85d04' : '#0077b6', lw: 0, shadow: false }); });
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.beginPath(); ctx.moveTo(400, 110); ctx.lineTo(760, 110); ctx.lineTo(560, 770); ctx.lineTo(400, 770); ctx.fill();
  ctx.fillStyle = '#03045e'; ctx.fillRect(0, 900, W, 180);
}
// Oficina moderna con escritorios y monitores
function sceneOffice(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#e3f2fd'); g.addColorStop(1, '#bbdefb'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // ventanal con ciudad
  ctx.fillStyle = '#90caf9'; ctx.fillRect(0, 80, W, 420); const r = rng(5); for (let x = 0; x < W; x += 110) { const h = 120 + r() * 260; ctx.fillStyle = '#64b5f6'; ctx.fillRect(x, 500 - h, 90, h); ctx.fillStyle = 'rgba(255,255,255,0.4)'; for (let y = 500 - h + 20; y < 490; y += 40) ctx.fillRect(x + 14, y, 62, 14); }
  ctx.fillStyle = '#eceff1'; for (let x = 0; x <= W; x += 320) ctx.fillRect(x - 8, 80, 16, 420); ctx.fillRect(0, 70, W, 20); ctx.fillRect(0, 495, W, 20);
  ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.moveTo(200, 80); ctx.lineTo(400, 80); ctx.lineTo(250, 500); ctx.lineTo(50, 500); ctx.fill();
  ctx.fillStyle = '#cfd8dc'; ctx.fillRect(0, 515, W, H - 515); ctx.fillStyle = 'rgba(0,0,0,0.05)'; for (let x = 0; x < W; x += 160) ctx.fillRect(x, 515, 3, H);
  // plantas
  for (const x of [80, 1850]) { ctx.fillStyle = '#8d6e63'; ctx.fillRect(x - 40, 830, 80, 90); for (let i = 0; i < 6; i++) { ctx.save(); ctx.translate(x, 840); ctx.rotate(-1.2 + i * 0.48 + Math.sin(t * 1.2 + i) * 0.05); ctx.fillStyle = i % 2 ? '#40916c' : '#52b788'; ctx.beginPath(); ctx.ellipse(0, -80, 22, 80, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } }
}
function monitor(ctx, x, y, s, t, kind = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#90a4ae'; ctx.fillRect(-12, 0, 24, 60); ctx.fillRect(-70, 56, 140, 12); ctx.fillStyle = '#263238'; rrect(ctx, -170, -220, 340, 220, 14); ctx.fill(); const g = ctx.createLinearGradient(0, -200, 0, -20); g.addColorStop(0, '#e3f2fd'); g.addColorStop(1, '#bbdefb'); ctx.fillStyle = g; ctx.fillRect(-155, -205, 310, 190); ctx.fillStyle = ['#5c6bc0', '#26a69a', '#ef5350', '#ffa726'][kind % 4]; for (let i = 0; i < 6; i++) { const w = 60 + ((i * 47 + kind * 31) % 180), k = clamp(((t * 2 + kind) % 4) - i * 0.3); ctx.fillRect(-140, -190 + i * 28, w * k, 14); } ctx.restore(); }
// Parlamento (hemiciclo) para la ley de la UE
function sceneParliament(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1d3557'); g.addColorStop(1, '#0b1a2e'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // cúpula de vidrio
  ctx.strokeStyle = 'rgba(160,200,255,0.25)'; ctx.lineWidth = 4; for (let i = 0; i < 9; i++) { ctx.beginPath(); ctx.ellipse(960, 420, 120 + i * 90, 420, 0, Math.PI, 0); ctx.stroke(); } glow(ctx, 960, 60, 500, '#a0c4ff', 0.3);
  // hemiciclo de asientos
  for (let row = 0; row < 6; row++) { const R = 260 + row * 110, n = 10 + row * 4; for (let i = 0; i < n; i++) { const a = Math.PI + (i + 0.5) / n * Math.PI, x = 960 + Math.cos(a) * R * 1.6, y = 1040 + Math.sin(a) * R * 0.7; const c = ['#3a86ff', '#ff006e', '#ffbe0b', '#8338ec', '#06d6a0'][Math.floor(i / n * 5)]; const up = Math.max(0, Math.sin(t * 2 + i * 0.7 + row)) > 0.95 ? 10 : 0; ctx.fillStyle = shadeHex(c, -0.2); rrect(ctx, x - 22, y - 16, 44, 30, 8); ctx.fill(); ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y - 28 - up, 13, 0, Math.PI * 2); ctx.fill(); } }
  // estrado
  ctx.fillStyle = '#457b9d'; rrect(ctx, 760, 900, 400, 180, 20); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(760, 900, 400, 14);
}
function euFlag(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#6c757d'; ctx.fillRect(-150, -10, 8, 300); ctx.save(); ctx.translate(-142, 0); ctx.beginPath(); ctx.moveTo(0, 0); for (let i = 0; i <= 20; i++) ctx.lineTo(i * 14, Math.sin(t * 4 - i * 0.4) * 8 * i / 20); for (let i = 20; i >= 0; i--) ctx.lineTo(i * 14, 190 + Math.sin(t * 4 - i * 0.4) * 8 * i / 20); ctx.closePath(); ctx.fillStyle = '#003399'; ctx.fill(); ctx.fillStyle = '#ffcc00'; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2, sx = 140 + Math.cos(a) * 60, sy = 95 + Math.sin(a) * 60 + Math.sin(t * 4 - sx / 14 * 0.4) * 8 * sx / 280; ctx.beginPath(); ctx.arc(sx, sy, 8, 0, Math.PI * 2); ctx.fill(); } ctx.restore(); ctx.restore(); }
function lawBook(ctx, x, y, s, t, title = 'LEY DE IA') { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); softShadow(ctx, 0, 170, 220, 26, 0.4); ctx.fillStyle = '#7b2cbf'; rrect(ctx, -170, -200, 340, 380, 18); ctx.fill(); ctx.fillStyle = '#fffdf5'; ctx.fillRect(-160, 160, 330, 16); ctx.fillStyle = '#5a189a'; ctx.fillRect(-170, -200, 40, 380); text(ctx, '⚖', 20, -70, { size: 110, fill: '#ffd23f', lw: 0, shadow: false }); text(ctx, title, 20, 60, { size: 46, fill: '#fff', lw: 0, shadow: false }); ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fillRect(-120, -190, 20, 360); ctx.restore(); }
function stamp(ctx, x, y, s, k, str = 'APROBADA') { if (k <= 0) return; ctx.save(); ctx.translate(x, y); const z = 1 + 1.5 * (1 - ease.out(Math.min(1, k * 1.5))); ctx.scale(s * z, s * z); ctx.rotate(-0.2); ctx.globalAlpha = Math.min(1, k * 2); ctx.strokeStyle = '#2dc653'; ctx.lineWidth = 14; rrect(ctx, -230, -70, 460, 140, 20); ctx.stroke(); text(ctx, str, 0, 0, { size: 84, fill: '#2dc653', lw: 0, shadow: false }); ctx.restore(); }
// Azotea al atardecer
function sceneRooftop(ctx, t) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#3a0ca3'); g.addColorStop(0.45, '#f72585'); g.addColorStop(0.75, '#ff9e00'); g.addColorStop(1, '#ffd166'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  glow(ctx, 960, 640, 520, '#ffb703', 0.6); ctx.fillStyle = '#ffe8a3'; ctx.beginPath(); ctx.arc(960, 640, 140, 0, Math.PI * 2); ctx.fill();
  starfield(ctx, t, 30, 4);
  const r = rng(33); ctx.fillStyle = '#7b2cbf'; for (let x = 0; x < W; x += 80) { const h = 100 + r() * 240; ctx.fillRect(x, 760 - h, 70, h); }
  const r2 = rng(34); for (let x = -40; x < W; x += 150) { const h = 180 + r2() * 260; ctx.fillStyle = '#3c096c'; ctx.fillRect(x, 840 - h, 130, h); for (let y = 840 - h + 30; y < 820; y += 50) for (let c = 0; c < 3; c++) if ((x + y + c * 7) % 3 !== 0) { ctx.fillStyle = Math.sin(t * 0.5 + x + y) > -0.6 ? '#ffd166' : '#5a189a'; ctx.fillRect(x + 14 + c * 38, y, 24, 26); } }
  ctx.fillStyle = '#240046'; ctx.fillRect(0, 840, W, 240); ctx.fillStyle = '#3c096c'; ctx.fillRect(0, 840, W, 16);
  // barandal y foquitos colgantes
  ctx.strokeStyle = '#10002b'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(0, 790); ctx.lineTo(W, 790); ctx.stroke(); for (let x = 30; x < W; x += 90) { ctx.beginPath(); ctx.moveTo(x, 790); ctx.lineTo(x, 840); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, 560); for (let x = 0; x <= W; x += 20) ctx.lineTo(x, 560 + Math.sin(x / W * Math.PI * 3) * 40 + 40); ctx.stroke();
  for (let i = 0; i < 24; i++) { const x = i * 84 + 20, y = 600 + Math.sin(x / W * Math.PI * 3) * 40 + 8; const on = 0.6 + 0.4 * Math.sin(t * 3 + i); glow(ctx, x, y, 40, '#ffd166', 0.5 * on); ctx.fillStyle = `rgba(255,230,150,${on})`; ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill(); }
}
// Tostadora (chiste final de la parte 4)
function toaster(ctx, x, y, s, t, popK = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); softShadow(ctx, 0, 0, 200, 24, 0.35);
  const up = ease.back(clamp(popK)) * 120; for (const sx of [-60, 60]) { ctx.fillStyle = '#e9c46a'; rrect(ctx, sx - 50, -230 - up, 100, 120, 22); ctx.fill(); ctx.fillStyle = '#d4a24c'; rrect(ctx, sx - 40, -220 - up, 80, 100, 18); ctx.fill(); }
  const g = ctx.createLinearGradient(-180, 0, 180, 0); g.addColorStop(0, '#f1f3f5'); g.addColorStop(0.5, '#ced4da'); g.addColorStop(1, '#868e96'); ctx.fillStyle = g; rrect(ctx, -180, -200, 360, 200, 60); ctx.fill(); ctx.fillStyle = '#343a40'; for (const sx of [-60, 60]) rrect(ctx, sx - 52, -205, 104, 14, 7), ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; rrect(ctx, -150, -180, 80, 20, 10); ctx.fill(); ctx.fillStyle = '#ff6b5b'; ctx.fillRect(180, -110 + (popK > 0 ? 0 : 30), 30, 18);
  // carita
  ctx.fillStyle = '#1d1830'; for (const sx of [-50, 50]) { ctx.beginPath(); ctx.arc(sx, -110, 10, 0, Math.PI * 2); ctx.fill(); } ctx.strokeStyle = '#1d1830'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -90, 24, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
  ctx.restore(); }
// Chip de computadora con brillo
function chip(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t) * 0.05); ctx.fillStyle = '#adb5bd'; for (let i = 0; i < 6; i++) for (const [dx, dy, w, h] of [[-110 + i * 40, -150, 14, 40], [-110 + i * 40, 110, 14, 40], [-150, -110 + i * 40, 40, 14], [110, -110 + i * 40, 40, 14]]) ctx.fillRect(dx, dy, w, h); const g = ctx.createLinearGradient(-120, -120, 120, 120); g.addColorStop(0, '#495057'); g.addColorStop(1, '#212529'); ctx.fillStyle = g; rrect(ctx, -120, -120, 240, 240, 20); ctx.fill(); ctx.fillStyle = '#5ee0f0'; rrect(ctx, -60, -60, 120, 120, 12); ctx.fill(); glow(ctx, 0, 0, 160, '#5ee0f0', 0.4 + 0.2 * Math.sin(t * 4)); text(ctx, 'IA', 0, 4, { size: 64, fill: '#0b1230', lw: 0, shadow: false }); ctx.restore(); }
// Flechas de "alineación"
function alignArrows(ctx, x, y, s, t, k) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); const arrow = (ang, c, lbl) => { ctx.save(); ctx.rotate(ang); ctx.fillStyle = c; ctx.fillRect(0, -18, 300, 36); ctx.beginPath(); ctx.moveTo(300, -50); ctx.lineTo(380, 0); ctx.lineTo(300, 50); ctx.fill(); ctx.restore(); }; const a2 = lerp(-0.9, 0, ease.inOut(k)) + Math.sin(t * 3) * 0.04 * (1 - k); arrow(0, '#ffd23f'); arrow(a2, '#5ee0f0'); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 30, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
// Bocadillo de diálogo
function bubble(ctx, x, y, w, h, str, size = 52, fill = '#fff', col = FLAT.ink, tail = 'down') { ctx.save(); ctx.translate(x, y); ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 18; ctx.shadowOffsetY = 8; ctx.fillStyle = fill; rrect(ctx, -w / 2, -h / 2, w, h, h / 2.4); ctx.fill(); ctx.beginPath(); if (tail === 'down') { ctx.moveTo(-30, h / 2 - 4); ctx.lineTo(-60, h / 2 + 50); ctx.lineTo(20, h / 2 - 4); } else { ctx.moveTo(w / 2 - 4, -20); ctx.lineTo(w / 2 + 50, 30); ctx.lineTo(w / 2 - 4, 30); } ctx.fill(); ctx.restore(); text(ctx, str, 0, 0, { size, fill: col, lw: 0, shadow: false }); ctx.restore(); }
// Reloj de arena
function hourglass(ctx, x, y, s, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(Math.sin(t) * 0.05); ctx.fillStyle = '#8d6e63'; rrect(ctx, -110, -200, 220, 26, 10); ctx.fill(); rrect(ctx, -110, 174, 220, 26, 10); ctx.fill(); ctx.fillStyle = 'rgba(200,230,255,0.45)'; ctx.beginPath(); ctx.moveTo(-90, -174); ctx.lineTo(90, -174); ctx.quadraticCurveTo(80, -40, 10, 0); ctx.quadraticCurveTo(80, 40, 90, 174); ctx.lineTo(-90, 174); ctx.quadraticCurveTo(-80, 40, -10, 0); ctx.quadraticCurveTo(-80, -40, -90, -174); ctx.fill(); const k = (t * 0.15) % 1; ctx.fillStyle = '#ffd166'; ctx.beginPath(); ctx.moveTo(-70 * (1 - k), -20 - 120 * (1 - k)); ctx.lineTo(70 * (1 - k), -20 - 120 * (1 - k)); ctx.lineTo(0, -10); ctx.fill(); ctx.fillRect(-3, -10, 6, 180); ctx.beginPath(); ctx.moveTo(-80, 174); ctx.lineTo(80, 174); ctx.lineTo(0, 174 - 120 * k); ctx.fill(); ctx.restore(); }
// Bandera genérica de colores (países sin identificar)
function miniFlag(ctx, x, y, s, t, seed) { const r = rng(seed), c = ['#ef233c', '#ffd23f', '#2b9348', '#1d4ed8', '#ffffff', '#ff7b00', '#7b2cbf']; const a = c[Math.floor(r() * 7)], b = c[Math.floor(r() * 7)], d = c[Math.floor(r() * 7)]; ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#6c757d'; ctx.fillRect(-4, -10, 6, 120); for (let i = 0; i < 3; i++) { ctx.fillStyle = [a, b, d][i]; ctx.beginPath(); ctx.moveTo(0, i * 22); for (let k = 0; k <= 10; k++) ctx.lineTo(k * 9, i * 22 + Math.sin(t * 5 - k * 0.5 + seed) * 3 * k / 10); for (let k = 10; k >= 0; k--) ctx.lineTo(k * 9, i * 22 + 22 + Math.sin(t * 5 - k * 0.5 + seed) * 3 * k / 10); ctx.fill(); } ctx.restore(); }
function battery(ctx, x, y, s, v) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.fillStyle = '#495057'; rrect(ctx, -90, -45, 180, 90, 16); ctx.fill(); ctx.fillRect(90, -18, 16, 36); ctx.fillStyle = v < 0.25 ? '#ef233c' : '#5ee0c0'; rrect(ctx, -80, -35, 160 * clamp(v), 70, 10); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(-80, -35, 160 * clamp(v), 12); ctx.restore(); }
