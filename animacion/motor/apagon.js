// Escenarios y objetos del tema "apagón" (sirven en horizontal y vertical: usan W y H).

// Ciudad de noche: lights 1 = todo encendido, 0 = apagón. stars 0-1 = cielo estrellado.
function sceneCityNight(ctx, t, o = {}) {
  const lights = o.lights ?? 1, stars = o.stars ?? (1 - lights) * 0.9;
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mix('#05051a', '#1b1b4a', lights)); g.addColorStop(1, mix('#0b0b25', '#4a2c6e', lights));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // estrellas y vía láctea cuando no hay luces
  const r = rng(31);
  for (let i = 0; i < 260; i++) { const x = r() * W, y = r() * H * 0.62, s = r(); ctx.globalAlpha = stars * (0.25 + 0.75 * Math.abs(Math.sin(t * (0.5 + s * 2) + i))); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, 1 + s * 2.4, 0, Math.PI * 2); ctx.fill(); }
  if (stars > 0.3) { ctx.save(); ctx.globalAlpha = (stars - 0.3) * 0.45; ctx.translate(W * 0.5, H * 0.3); ctx.rotate(-0.5); const mg = ctx.createRadialGradient(0, 0, 10, 0, 0, W * 0.6); mg.addColorStop(0, 'rgba(200,180,255,0.6)'); mg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = mg; ctx.scale(1, 0.18); ctx.beginPath(); ctx.arc(0, 0, W * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#fff6d6'; ctx.beginPath(); ctx.arc(W * (VERTICAL ? 0.88 : 0.82), H * (VERTICAL ? 0.045 : 0.14), 46, 0, Math.PI * 2); ctx.fill();
  // edificios en dos capas (paralaje), ventanas que se apagan
  [[0.25, '#16163a', H * 0.55, 3, 0.6], [0.6, '#0e0e28', H * 0.68, 9, 1]].forEach(([sp, col, base, seed, layer]) => {
    const rr = rng(seed); let bx = -((t * sp * 12) % 240) - 120;
    while (bx < W + 120) {
      const bw = 110 + rr() * 140, bh = (layer < 1 ? 260 : 200) + rr() * (H * 0.35);
      ctx.fillStyle = col; ctx.fillRect(bx, base + (H - base) * 0.6 - bh, bw, bh + H);
      for (let wy = base + (H - base) * 0.6 - bh + 20; wy < H * 0.86; wy += 34) for (let wx = bx + 14; wx < bx + bw - 18; wx += 26) {
        const k = Math.sin(wx * 3.7 + wy * 1.3) * 0.5 + 0.5; // cada ventana se apaga en su propio momento
        if (k < lights * 1.15 - 0.1) { const fl = 0.75 + 0.25 * Math.sin(t * 3 + wx); ctx.fillStyle = `rgba(255,${200 + 30 * k | 0},120,${0.85 * fl * layer})`; ctx.fillRect(wx, wy, 13, 18); }
      }
      bx += bw + 10;
    }
  });
  ctx.fillStyle = '#07071a'; ctx.fillRect(0, H * 0.86, W, H * 0.14);
  // farolas
  for (let i = 0; i < 6; i++) { const x = ((i * 380 - t * 20) % (W + 400) + W + 400) % (W + 400) - 200; ctx.fillStyle = '#2b2d42'; ctx.fillRect(x - 5, H * 0.72, 10, H * 0.14); if (lights > 0.5) { const lg = ctx.createRadialGradient(x, H * 0.72, 5, x, H * 0.72, 160); lg.addColorStop(0, `rgba(255,220,140,${0.6 * lights})`); lg.addColorStop(1, 'rgba(255,220,140,0)'); ctx.fillStyle = lg; ctx.fillRect(x - 160, H * 0.72 - 160, 320, 320); } ctx.fillStyle = lights > 0.5 ? '#ffe066' : '#495057'; ctx.beginPath(); ctx.arc(x, H * 0.72, 12, 0, Math.PI * 2); ctx.fill(); }
}
// Televisión con la "prueba de alerta" (barras de color)
function tvSet(ctx, x, y, s, t, mode = 'alerta') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#343a40'; rrect(ctx, -300, -200, 600, 400, 30); ctx.fill(); ctx.fillStyle = '#212529'; ctx.fillRect(-40, 200, 80, 40); ctx.fillRect(-140, 236, 280, 18);
  ctx.save(); rrect(ctx, -270, -170, 540, 340, 16); ctx.clip();
  if (mode === 'alerta') {
    const bars = ['#ffffff', '#ffd23f', '#5ee0c0', '#4cc9f0', '#ff8fab', '#ef233c', '#3a0ca3'];
    bars.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(-270 + i * (540 / 7), -170, 540 / 7 + 1, 240); });
    ctx.fillStyle = '#1d1830'; ctx.fillRect(-270, 70, 540, 100);
    text(ctx, 'PRUEBA DE ALERTA', 0, 120, { size: 44, fill: Math.sin(t * 8) > 0 ? '#ffd23f' : '#fff', lw: 0, shadow: false });
  } else { ctx.fillStyle = '#ffd23f'; ctx.fillRect(-270, -170, 540, 340); const r = rng(7); for (let i = 0; i < 6; i++) { ctx.fillStyle = ['#4cc9f0', '#ff6b5b', '#5ee0c0'][i % 3]; ctx.beginPath(); ctx.arc(-200 + r() * 400, -120 + r() * 240, 30 + r() * 30, 0, Math.PI * 2); ctx.fill(); } }
  ctx.fillStyle = `rgba(255,255,255,${0.05 + 0.05 * Math.sin(t * 30)})`; for (let yy = -170; yy < 170; yy += 8) ctx.fillRect(-270, yy, 540, 3);
  ctx.restore(); ctx.restore();
}
// Celular grande (pantalla de bloqueo); muted = campana tachada
function bigPhone(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
  ctx.fillStyle = '#212529'; rrect(ctx, -140, -270, 280, 540, 40); ctx.fill();
  const g = ctx.createLinearGradient(0, -250, 0, 250); g.addColorStop(0, '#4361ee'); g.addColorStop(1, '#7209b7'); ctx.fillStyle = g; rrect(ctx, -125, -250, 250, 500, 30); ctx.fill();
  text(ctx, o.time || '2:20', 0, -150, { size: 70, fill: '#fff', lw: 0, shadow: false });
  if (o.battery != null) { ctx.fillStyle = '#fff'; rrect(ctx, -60, -60, 120, 56, 10); ctx.fill(); ctx.fillStyle = o.battery < 0.2 ? '#ef233c' : '#5ee0c0'; rrect(ctx, -54, -54, 108 * o.battery, 44, 8); ctx.fill(); text(ctx, Math.round(o.battery * 100) + '%', 0, 40, { size: 50, fill: '#fff', lw: 0, shadow: false }); }
  if (o.muted) { ctx.save(); ctx.translate(0, 60); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-50, 40); ctx.quadraticCurveTo(-50, -60, 0, -60); ctx.quadraticCurveTo(50, -60, 50, 40); ctx.lineTo(65, 55); ctx.lineTo(-65, 55); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(0, 70, 14, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-80, -80); ctx.lineTo(80, 90); ctx.stroke(); ctx.restore(); }
  if (o.signal != null) { for (let i = 0; i < 4; i++) { ctx.fillStyle = i < o.signal * 4 ? '#fff' : 'rgba(255,255,255,0.25)'; ctx.fillRect(-60 + i * 32, 180 - i * 22, 22, 30 + i * 22); } }
  ctx.restore();
}
// Globo terráqueo con regiones de red eléctrica independientes que parpadean por separado
function globeGrids(ctx, x, y, r, t, o = {}) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#1d3557'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.clip();
  const conts = [[-0.45, -0.35, 0.38, 0.26, '#52b788'], [-0.3, 0.3, 0.2, 0.36, '#74c69d'], [0.2, -0.3, 0.42, 0.2, '#40916c'], [0.25, 0.15, 0.22, 0.3, '#95d5b2'], [0.6, 0.45, 0.2, 0.14, '#52b788']];
  conts.forEach(([cx, cy, rx, ry, c], i) => {
    const off = ((t * 0.08) % 2) * r * 2;
    const X = ((cx * r + off) % (r * 2.4)) - r * 0.2;
    ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(X - r * 0.5, cy * r, rx * r, ry * r, 0.3, 0, Math.PI * 2); ctx.fill();
    // luces de cada red: cada región se apaga y se prende sola
    const on = o.independent ? Math.sin(t * 1.3 + i * 2.1) > -0.3 : true;
    for (let k = 0; k < 6; k++) { const rr = rng(i * 10 + k); ctx.fillStyle = on ? '#ffe066' : '#495057'; ctx.beginPath(); ctx.arc(X - r * 0.5 + (rr() - 0.5) * rx * r * 1.4, cy * r + (rr() - 0.5) * ry * r * 1.4, 6, 0, Math.PI * 2); ctx.fill(); }
  });
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(-r * 0.35, -r * 0.35, r * 0.4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
// Objetos del kit
function flashlight(ctx, x, y, s, t, on = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(-0.3);
  if (on) { const g = ctx.createLinearGradient(80, 0, 420, 0); g.addColorStop(0, 'rgba(255,240,170,0.7)'); g.addColorStop(1, 'rgba(255,240,170,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(80, -30); ctx.lineTo(420, -130 - Math.sin(t * 3) * 10); ctx.lineTo(420, 130 + Math.sin(t * 3) * 10); ctx.lineTo(80, 30); ctx.fill(); }
  ctx.fillStyle = '#ffd23f'; rrect(ctx, -100, -28, 150, 56, 18); ctx.fill(); ctx.fillStyle = '#ff6b5b'; ctx.beginPath(); ctx.moveTo(50, -40); ctx.lineTo(90, -55); ctx.lineTo(90, 55); ctx.lineTo(50, 40); ctx.fill(); ctx.fillStyle = '#212529'; ctx.fillRect(-40, -10, 30, 20);
  ctx.restore();
}
function cashIcon(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let i = 2; i >= 0; i--) { ctx.save(); ctx.translate(i * 14, -i * 14); ctx.rotate(Math.sin(t * 2 + i) * 0.04 - 0.08); ctx.fillStyle = '#52b788'; rrect(ctx, -120, -60, 240, 120, 14); ctx.fill(); ctx.fillStyle = '#2d6a4f'; ctx.beginPath(); ctx.arc(0, 0, 36, 0, Math.PI * 2); ctx.fill(); text(ctx, '$', 0, 4, { size: 54, fill: '#b7e4c7', lw: 0, shadow: false }); ctx.restore(); }
  ctx.restore();
}
function radioIcon(ctx, x, y, s, t, playing = true) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = '#adb5bd'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(100, -90); ctx.lineTo(170, -230); ctx.stroke();
  ctx.fillStyle = '#e76f51'; rrect(ctx, -170, -100, 340, 200, 30); ctx.fill();
  ctx.fillStyle = '#264653'; ctx.beginPath(); ctx.arc(-80, 10, 62, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#2a9d8f'; for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.arc(-80, 10, 12 + i * 10, 0, Math.PI * 2); ctx.lineWidth = 3; ctx.strokeStyle = '#2a9d8f'; ctx.stroke(); }
  ctx.fillStyle = '#f4a261'; rrect(ctx, 20, -60, 120, 50, 10); ctx.fill(); ctx.fillStyle = '#e9c46a'; ctx.beginPath(); ctx.arc(80, 50, 26, 0, Math.PI * 2); ctx.fill();
  if (playing) for (let i = 0; i < 3; i++) { const p = (t * 1.2 + i / 3) % 1; ctx.globalAlpha = 1 - p; text(ctx, '♪', -200 - p * 80, -60 - p * 140 + i * 20, { size: 50, fill: '#fff' }); } ctx.globalAlpha = 1;
  ctx.restore();
}
function candle(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const gl = ctx.createRadialGradient(0, -130, 5, 0, -130, 260); gl.addColorStop(0, 'rgba(255,200,100,0.45)'); gl.addColorStop(1, 'rgba(255,200,100,0)'); ctx.fillStyle = gl; ctx.fillRect(-260, -390, 520, 520);
  ctx.fillStyle = '#fff3e0'; rrect(ctx, -30, -100, 60, 170, 10); ctx.fill();
  const f = 1 + 0.12 * Math.sin(t * 14) + 0.06 * Math.sin(t * 23);
  ctx.fillStyle = '#ffba08'; ctx.beginPath(); ctx.moveTo(-14, -104); ctx.quadraticCurveTo(-16, -150 * f, 0, -175 * f); ctx.quadraticCurveTo(16, -150 * f, 14, -104); ctx.fill();
  ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.ellipse(0, -122, 6, 16 * f, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function trafficLight(ctx, x, y, s, t, on) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#495057'; ctx.fillRect(-10, 0, 20, 400); ctx.fillStyle = '#212529'; rrect(ctx, -55, -260, 110, 270, 26); ctx.fill();
  ['#ef233c', '#ffd23f', '#52b788'].forEach((c, i) => { const lit = on && Math.floor(t / 2) % 3 === i; ctx.fillStyle = lit ? c : '#343a40'; ctx.beginPath(); ctx.arc(0, -210 + i * 82, 32, 0, Math.PI * 2); ctx.fill(); });
  ctx.restore();
}
function gasPump(ctx, x, y, s, t, on) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#e63946'; rrect(ctx, -90, -320, 180, 320, 20); ctx.fill(); ctx.fillStyle = on ? '#caf0f8' : '#212529'; rrect(ctx, -65, -290, 130, 90, 10); ctx.fill();
  if (on) text(ctx, '$$$', 0, -245, { size: 40, fill: '#1d1830', lw: 0, shadow: false }); else { ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-40, -270); ctx.lineTo(40, -220); ctx.stroke(); }
  ctx.strokeStyle = '#212529'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(90, -150); ctx.quadraticCurveTo(160, -100, 140, -20); ctx.stroke(); ctx.fillStyle = '#212529'; ctx.fillRect(120, -40, 40, 70);
  ctx.restore();
}
function shelves(ctx, x, y, w, t, fill) { // estantes del súper que se vacían (fill 0-1)
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#adb5bd'; ctx.fillRect(0, 0, w, 520);
  for (let r = 0; r < 4; r++) {
    ctx.fillStyle = '#6c757d'; ctx.fillRect(0, 100 + r * 130, w, 12);
    for (let i = 0; i < w / 70; i++) { const rr = rng(r * 50 + i); if (rr() > fill) continue; const kind = Math.floor(rr() * 3); ctx.fillStyle = ['#4cc9f0', '#f4a261', '#ffd23f'][kind]; if (kind === 0) rrect(ctx, 10 + i * 70, 30 + r * 130, 40, 70, 10); else ctx.fillRect(10 + i * 70, 40 + r * 130 + Math.sin(t * 3 + i) * 2, 50, 60); ctx.fill(); }
  }
  ctx.restore();
}
function hospital(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = '#f1f3f5'; ctx.fillRect(-300, -420, 600, 420); ctx.fillStyle = '#e63946'; ctx.fillRect(-40, -400, 80, 30); ctx.fillRect(-15, -425, 30, 80);
  for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const on = Math.sin(t * 2 + r * 3 + c) > -0.6; ctx.fillStyle = on ? '#ffe066' : '#adb5bd'; ctx.fillRect(-260 + c * 110, -320 + r * 100, 70, 60); }
  // generador con humito
  ctx.fillStyle = '#ffb703'; rrect(ctx, 320, -150, 220, 150, 16); ctx.fill(); ctx.fillStyle = '#212529'; ctx.fillRect(350, -120, 60, 60); ctx.save(); ctx.translate(380, -90); ctx.rotate(t * 10); ctx.fillStyle = '#adb5bd'; ctx.fillRect(-25, -5, 50, 10); ctx.fillRect(-5, -25, 10, 50); ctx.restore();
  for (let i = 0; i < 3; i++) { const p = (t * 0.7 + i / 3) % 1; ctx.fillStyle = `rgba(173,181,189,${0.6 * (1 - p)})`; ctx.beginPath(); ctx.arc(500 + p * 40, -170 - p * 160, 18 + p * 30, 0, Math.PI * 2); ctx.fill(); }
  text(ctx, 'GENERADOR', 430, 40, { size: 36, fill: '#fff' });
  ctx.restore();
}
function sunFlare(ctx, x, y, r, t) { // sol con eyección de plasma
  ctx.save(); ctx.translate(x, y);
  for (let k = 3; k > 0; k--) { ctx.fillStyle = `rgba(255,170,0,${0.12 * k})`; ctx.beginPath(); ctx.arc(0, 0, r + k * 40 + Math.sin(t * 2 + k) * 10, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = '#ffb703'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fb8500'; for (let i = 0; i < 7; i++) { const rr = rng(i + 4); ctx.beginPath(); ctx.arc((rr() - 0.5) * r, (rr() - 0.5) * r, 10 + rr() * 20, 0, Math.PI * 2); ctx.fill(); }
  for (let i = 0; i < 3; i++) { const a = -0.3 + i * 0.25, L = r * (1.4 + 0.5 * Math.sin(t * 3 + i)); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 18 - i * 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r); ctx.quadraticCurveTo(Math.cos(a + 0.4) * L, Math.sin(a + 0.4) * L, Math.cos(a + 0.7) * r, Math.sin(a + 0.7) * r); ctx.stroke(); }
  ctx.restore();
}
function aurora(ctx, t, top = 0, h = H * 0.55, alpha = 1) {
  for (let k = 0; k < 3; k++) {
    ctx.save(); ctx.globalAlpha = 0.35 * alpha; const col = ['#5ee0c0', '#80ffdb', '#b388ff'][k];
    const g = ctx.createLinearGradient(0, top, 0, top + h); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, col); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(0, top + h);
    for (let x = 0; x <= W; x += 30) ctx.lineTo(x, top + h * 0.3 + Math.sin(x * 0.004 + t * (0.6 + k * 0.2) + k) * h * 0.18 + k * 30);
    ctx.lineTo(W, top + h); ctx.fill(); ctx.restore();
  }
}
function powerTower(ctx, x, y, s, on) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.strokeStyle = '#adb5bd'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(-60, 0); ctx.lineTo(0, -340); ctx.lineTo(60, 0); ctx.moveTo(-90, -250); ctx.lineTo(90, -250); ctx.moveTo(-70, -180); ctx.lineTo(70, -180); ctx.moveTo(-45, -100); ctx.lineTo(45, -60); ctx.moveTo(45, -100); ctx.lineTo(-45, -60); ctx.stroke();
  if (on) { ctx.fillStyle = '#ffe066'; for (const sx of [-90, 90]) { ctx.beginPath(); ctx.arc(sx, -250, 10, 0, Math.PI * 2); ctx.fill(); } }
  ctx.restore();
}
