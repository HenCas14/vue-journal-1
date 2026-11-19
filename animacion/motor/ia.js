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
