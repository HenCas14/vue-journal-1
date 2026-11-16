// ============================================================================
// ESTÁNDAR DE CALIDAD "PRO" del canal Curioso Leo.
// Se carga después de las demás bibliotecas y REEMPLAZA sus versiones simples:
//   drawPerson, bgFlat, card, sceneCityNight, sceneLivingRoom, sceneStreetDay,
//   globeGrids, sunFlare, bigPhone  (+ postFX: resplandor y viñeta finales).
// Reglas de dibujo: ver canal/guia-dibujo.md
// ============================================================================

// ---------- utilidades de acabado ----------
function softShadow(ctx, x, y, rx, ry, a = 0.28) {
  const g = ctx.createRadialGradient(x, y, 0, x, y, rx); g.addColorStop(0, `rgba(0,0,0,${a})`); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx); ctx.translate(-x, -y); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rx, 0, Math.PI * 2); ctx.fill(); ctx.restore();
}
function glow(ctx, x, y, r, color, a = 0.6) { // halo de luz (usar en toda fuente luminosa)
  const c = toRGB(color) || [255, 255, 255]; const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${a})`); g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}
const shadeHex = (c, k) => mixHex(c, k < 0 ? '#000000' : '#ffffff', Math.abs(k)); // k<0 oscurece, k>0 aclara

// Resplandor (bloom) + viñeta sobre la imagen ya dibujada. Lo llama video.js en cada cuadro.
let _fxA = null, _fxB = null;
function postFX(ctx, t, o = {}) {
  const bw = Math.round(W / 6), bh = Math.round(H / 6);
  if (!_fxA) { _fxA = document.createElement('canvas'); _fxB = document.createElement('canvas'); _fxA.width = _fxB.width = bw; _fxA.height = _fxB.height = bh; }
  const a = _fxA.getContext('2d'), b = _fxB.getContext('2d');
  a.globalCompositeOperation = 'copy'; a.filter = 'none'; a.drawImage(ctx.canvas, 0, 0, bw, bh);
  a.globalCompositeOperation = 'multiply'; a.drawImage(_fxA, 0, 0); a.drawImage(_fxA, 0, 0); // deja solo las zonas brillantes
  b.globalCompositeOperation = 'copy'; b.filter = 'blur(5px)'; b.drawImage(_fxA, 0, 0);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'screen'; ctx.globalAlpha = o.bloom ?? 0.45; ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(_fxB, 0, 0, W, H); ctx.restore();
  const v = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.55, W / 2, H / 2, Math.max(W, H) * 0.75);
  v.addColorStop(0, 'rgba(8,4,24,0)'); v.addColorStop(1, `rgba(8,4,24,${o.vignette ?? 0.38})`); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}

// ---------- tarjetas con sombra suave y brillo superior ----------
function card(ctx, x, y, w, h, color = '#fff', r = 30, shadow = true) {
  if (shadow) { ctx.save(); ctx.shadowColor = 'rgba(10,6,40,0.35)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 14; ctx.fillStyle = color; rrect(ctx, x, y, w, h, r); ctx.fill(); ctx.restore(); }
  else { ctx.fillStyle = color; rrect(ctx, x, y, w, h, r); ctx.fill(); }
  if (h > 40 && shadow) { ctx.save(); rrect(ctx, x, y, w, h, r); ctx.clip(); const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, 'rgba(255,255,255,0.22)'); g.addColorStop(0.45, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,0.08)'); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); ctx.restore(); }
}

// ---------- fondo abstracto con profundidad ----------
function bgFlat(ctx, t, c1 = FLAT.bg1, c2 = FLAT.bg2, seed = 1, shapes = true) {
  const g = ctx.createLinearGradient(0, 0, W * 0.25, H); g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const r = rng(seed + 100);
  // manchas de luz grandes que derivan (dan volumen al color plano)
  for (let i = 0; i < 4; i++) { const x = r() * W + Math.sin(t * 0.15 + i * 2) * 120, y = r() * H + Math.cos(t * 0.12 + i) * 80, rad = 380 + r() * 420; const gg = ctx.createRadialGradient(x, y, 0, x, y, rad); gg.addColorStop(0, i % 2 ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,30,0.16)'); gg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gg; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  if (!shapes) return;
  // figuras en 3 planos: lejos (pequeñas, tenues, lentas) → cerca (grandes, rápidas)
  for (let layer = 0; layer < 3; layer++) for (let i = 0; i < 7; i++) {
    const x = r() * W, y = r() * H, sz = (14 + r() * 26) * (1 + layer * 0.9), k = Math.floor(r() * 4), sp = (0.25 + r() * 0.4) * (1 + layer * 0.6);
    ctx.save(); ctx.translate(x + Math.sin(t * sp + i) * 30 * (1 + layer), ((y - t * 6 * (1 + layer)) % (H + 200) + H + 200) % (H + 200) - 100); ctx.rotate(t * sp * (i % 2 ? 0.5 : -0.5));
    ctx.fillStyle = `rgba(255,255,255,${0.035 + layer * 0.022})`; ctx.strokeStyle = `rgba(255,255,255,${0.05 + layer * 0.03})`; ctx.lineWidth = 4; ctx.beginPath();
    if (k === 0) ctx.arc(0, 0, sz, 0, Math.PI * 2); else if (k === 1) { ctx.moveTo(0, -sz); ctx.lineTo(sz, sz * 0.8); ctx.lineTo(-sz, sz * 0.8); ctx.closePath(); } else if (k === 2) rrect(ctx, -sz * 0.8, -sz * 0.8, sz * 1.6, sz * 1.6, sz * 0.3); else { ctx.arc(0, 0, sz, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); continue; }
    ctx.fill(); ctx.restore();
  }
}

// ============================================================================
// PERSONAJE PRO. Misma interfaz que antes: drawPerson(ctx, x, y, s, e, P)
// Anclas fijas: pies en (0,0) · hombros (±52,-320) · cabeza centro (0,-425) · manos e.handL/e.handR
// ============================================================================
function _hand(ctx, hx, hy, dx, dy, sx, skin, skinD) {
  const L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L, px = -uy, py = ux;
  ctx.fillStyle = skin;
  for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.arc(hx + ux * 15 + px * k * 10, hy + uy * 15 + py * k * 10, 8.5, 0, Math.PI * 2); ctx.fill(); } // dedos
  ctx.beginPath(); ctx.arc(hx, hy, 20, 0, Math.PI * 2); ctx.fill();                                   // palma
  ctx.beginPath(); ctx.arc(hx + px * -sx * 17 + ux * 4, hy + py * -sx * 17 + uy * 4, 9, 0, Math.PI * 2); ctx.fill(); // pulgar
  ctx.fillStyle = skinD; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(hx + 5, hy + 6, 14, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
}
function _arm(ctx, S, Hd, sx, sleeve, cuff, skin, skinD) {
  const L1 = 112, L2 = 112; let dx = Hd[0] - S[0], dy = Hd[1] - S[1]; let d = Math.hypot(dx, dy) || 1; d = Math.min(d, L1 + L2 - 2);
  const a = d / 2, h = Math.sqrt(Math.max(0, L1 * L1 - a * a)), mx = S[0] + dx / 2, my = S[1] + dy / 2; let px = -dy / d, py = dx / d;
  const score = (qx, qy) => qx * sx * 0.75 + qy * 0.55;             // el codo prefiere abrirse hacia afuera y hacia abajo
  if (score(px, py) < score(-px, -py)) { px = -px; py = -py; }
  const E = [mx + px * h, my + py * h];
  const fx = Hd[0] - E[0], fy = Hd[1] - E[1], C = [E[0] + fx * 0.8, E[1] + fy * 0.8];
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.strokeStyle = sleeve; ctx.lineWidth = 32; ctx.beginPath(); ctx.moveTo(S[0], S[1]); ctx.lineTo(E[0], E[1]); ctx.lineTo(C[0], C[1]); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,0.14)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(S[0] + 4, S[1] + 10); ctx.lineTo(E[0] + 4, E[1] + 8); ctx.stroke(); // pliegue de sombra
  ctx.strokeStyle = cuff; ctx.lineWidth = 34; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(E[0] + fx * 0.72, E[1] + fy * 0.72); ctx.lineTo(C[0], C[1]); ctx.stroke(); // puño
  ctx.strokeStyle = skin; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(C[0], C[1]); ctx.lineTo(Hd[0], Hd[1]); ctx.stroke();
  _hand(ctx, Hd[0], Hd[1], fx, fy, sx, skin, skinD);
}
function drawPerson(ctx, x, y, s, e, P) {
  const t = e.t, sh = clamp(e.shock || 0), talk = e.talk || 0, red = e.red || 0, bags = e.bags || 0, fr = e.frazzle || 0;
  const { skin, skinD, shirt, pants, hair } = P; const shirtD = P.shirtD || shadeHex(shirt, -0.18);
  const hoodie = P === PEOPLE.leo || P.hoodie, coat = P.coat;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (e.flip ? -1 : 1), s); ctx.rotate(e.rot || 0);
  if (!e.noShadow) softShadow(ctx, 0, 4, 110, 16, 0.3);
  ctx.scale(1 - 0.03 * sh, 1 + 0.045 * sh);                        // estirón al asustarse (squash & stretch)
  const walk = e.walk ? Math.sin(t * 9) : 0;
  const step = e.inBed || e.sit ? 0 : (e.walk ? -Math.abs(walk) * 8 : Math.sin(t * 3) * 3) - sh * 20;
  // --- piernas y tenis ---
  if (!e.sit) for (const sx of [-1, 1]) {
    ctx.save(); ctx.translate(sx * 19, -178 + step); ctx.rotate(sx * walk * 0.3);
    const len = 170 - step;
    ctx.fillStyle = pants; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(16, 0); ctx.lineTo(12, len); ctx.lineTo(-12, len); ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.beginPath(); ctx.moveTo(sx < 0 ? 4 : -16, 0); ctx.lineTo(sx < 0 ? 16 : -4, 0); ctx.lineTo(sx < 0 ? 12 : -6, len); ctx.lineTo(sx < 0 ? 4 : -12, len); ctx.fill();
    ctx.translate(0, len);
    ctx.fillStyle = P.shoes || '#f8f9fa'; ctx.beginPath(); ctx.moveTo(-16, -14); ctx.quadraticCurveTo(-18, 8, -10, 8); ctx.lineTo(30, 8); ctx.quadraticCurveTo(36, -6, 16, -14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ced4da'; rrect(ctx, -16, 4, 50, 7, 3); ctx.fill(); ctx.fillStyle = shirt; ctx.fillRect(2, -8, 12, 5);
    ctx.restore();
  }
  ctx.translate(0, step);
  const br = 1 + Math.sin(t * 2.2) * 0.012;                         // respiración
  // --- capucha (detrás de la cabeza) ---
  if (hoodie) { ctx.fillStyle = shirtD; ctx.beginPath(); ctx.ellipse(0, -348, 74, 34, 0, 0, Math.PI * 2); ctx.fill(); }
  // --- torso ---
  ctx.save(); ctx.translate(0, -165); ctx.scale(br, br); ctx.translate(0, 165);
  ctx.fillStyle = coat ? '#f4f7fb' : shirt; ctx.beginPath(); ctx.moveTo(-50, -342); ctx.quadraticCurveTo(0, -352, 50, -342); ctx.quadraticCurveTo(70, -334, 66, -300); ctx.lineTo(60, -190); ctx.quadraticCurveTo(60, -165, 36, -165); ctx.lineTo(-36, -165); ctx.quadraticCurveTo(-60, -165, -60, -190); ctx.lineTo(-66, -300); ctx.quadraticCurveTo(-70, -334, -50, -342); ctx.closePath(); ctx.fill();
  ctx.save(); ctx.clip();
  if (coat) { ctx.fillStyle = shirt; ctx.beginPath(); ctx.moveTo(-24, -350); ctx.lineTo(24, -350); ctx.lineTo(8, -235); ctx.lineTo(-8, -235); ctx.fill(); ctx.fillStyle = '#dfe6ef'; ctx.beginPath(); ctx.moveTo(-24, -350); ctx.lineTo(-8, -235); ctx.lineTo(-30, -270); ctx.fill(); ctx.beginPath(); ctx.moveTo(24, -350); ctx.lineTo(8, -235); ctx.lineTo(30, -270); ctx.fill(); ctx.fillStyle = '#adb5bd'; for (let k = 0; k < 2; k++) { ctx.beginPath(); ctx.arc(0, -215 + k * 26, 4, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = '#dfe6ef'; rrect(ctx, 22, -230, 30, 34, 4); ctx.fill(); }
  if (P.stripes && !coat) { ctx.fillStyle = P.stripes; for (let k = 0; k < 5; k++) ctx.fillRect(-80, -322 + k * 34, 160, 12); }
  const sg = ctx.createLinearGradient(-66, 0, 66, 0); sg.addColorStop(0, 'rgba(255,255,255,0.10)'); sg.addColorStop(0.55, 'rgba(0,0,0,0)'); sg.addColorStop(1, 'rgba(0,0,0,0.22)'); ctx.fillStyle = sg; ctx.fillRect(-80, -360, 160, 200); // luz de izquierda, sombra a la derecha
  if (hoodie) { ctx.fillStyle = 'rgba(0,0,0,0.16)'; ctx.beginPath(); ctx.moveTo(-34, -238); ctx.lineTo(34, -238); ctx.lineTo(44, -196); ctx.lineTo(-44, -196); ctx.closePath(); ctx.fill(); }  // bolsillo
  ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(-70, -180, 140, 16);                                   // resorte inferior
  ctx.restore();
  if (hoodie) { ctx.strokeStyle = '#f8f9fa'; ctx.lineWidth = 4; ctx.lineCap = 'round'; for (const sx of [-1, 1]) { const sw = Math.sin(t * 3 + sx) * 3 + walk * 4; ctx.beginPath(); ctx.moveTo(sx * 14, -338); ctx.quadraticCurveTo(sx * 16, -315, sx * 15 + sw, -292); ctx.stroke(); ctx.fillStyle = '#f8f9fa'; ctx.beginPath(); ctx.arc(sx * 15 + sw, -290, 4.5, 0, Math.PI * 2); ctx.fill(); } } // cordones
  else if (!coat) { ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, -350, 22, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
  ctx.restore();
  // --- cuello ---
  ctx.fillStyle = skin; ctx.fillRect(-14, -368, 28, 34); ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(-14, -368, 28, 12);
  // --- cabeza (se inclina hacia donde mira) ---
  const [lx, ly] = e.look || [0, 0];
  const hy = -425 - sh * 10; ctx.save(); ctx.translate(0, hy + 60); ctx.rotate(lx * 0.045 + Math.sin(t * 1.3) * 0.012); ctx.translate(0, -(hy + 60));
  const hs = P.hairStyle;
  if (hs === 'long') { ctx.fillStyle = hair; rrect(ctx, -70, hy - 52, 140, 158, 52); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,0.08)'; rrect(ctx, -62, hy - 40, 26, 130, 13); ctx.fill(); }
  for (const sx of [-1, 1]) { ctx.fillStyle = sx > 0 ? skinD : skin; ctx.beginPath(); ctx.ellipse(sx * 54, hy + 6, 11, 17, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.beginPath(); ctx.ellipse(sx * 55, hy + 8, 5, 9, 0, 0, Math.PI * 2); ctx.fill(); } // orejas
  ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(0, hy, 55, 66, 0, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.clip(); const hg = ctx.createLinearGradient(-55, 0, 55, 0); hg.addColorStop(0, 'rgba(255,255,255,0.10)'); hg.addColorStop(0.6, 'rgba(0,0,0,0)'); hg.addColorStop(1, 'rgba(0,0,0,0.20)'); ctx.fillStyle = hg; ctx.fillRect(-60, hy - 70, 120, 140); ctx.restore();
  ctx.fillStyle = 'rgba(255,110,110,0.22)'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 34, hy + 24, 12, 7, 0, 0, Math.PI * 2); ctx.fill(); } // mejillas
  // pelo
  ctx.fillStyle = hair; const hl = shadeHex(hair, 0.13);
  if (hs === 'curly') { for (let i = 0; i < 9; i++) { const a = Math.PI * (1.05 + i * 0.11), jr = fr * (6 + 4 * Math.sin(t * 30 + i * 2)), bob = Math.sin(t * 3 + i) * 1.5 - step * 0.08; ctx.fillStyle = hair; ctx.beginPath(); ctx.arc(Math.cos(a) * (52 + fr * 10), hy - 18 + Math.sin(a) * (52 + fr * 12) + bob, 22 + sh * 6 + jr, 0, Math.PI * 2); ctx.fill(); } for (let i = 1; i < 8; i += 2) { const a = Math.PI * (1.05 + i * 0.11); ctx.fillStyle = hl; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 54 - 6, hy - 28 + Math.sin(a) * 54, 9, 5, -0.6, 0, Math.PI * 2); ctx.fill(); } }
  else if (hs === 'crew' || hs === 'long' || hs === 'bun') {
    ctx.beginPath(); ctx.ellipse(0, hy - 22, 58, 48, 0, Math.PI, 0); ctx.quadraticCurveTo(30, hy - 40, -10, hy - 30); ctx.quadraticCurveTo(-45, hy - 20, -58, hy - 10); ctx.fill();
    ctx.fillStyle = hl; ctx.beginPath(); ctx.ellipse(-18, hy - 52, 22, 8, -0.3, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = hair;
    if (hs === 'bun') { ctx.beginPath(); ctx.arc(0, hy - 80, 26, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = hl; ctx.beginPath(); ctx.arc(-8, hy - 88, 8, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = hair; }
    if (fr > 0.05) for (let i = 0; i < 7; i++) { const a = Math.PI * (1.1 + i * 0.13); ctx.beginPath(); ctx.moveTo(Math.cos(a - 0.1) * 50, hy - 15 + Math.sin(a - 0.1) * 55); ctx.lineTo(Math.cos(a) * (70 + fr * 25 + Math.sin(t * 30 + i) * 5), hy - 15 + Math.sin(a) * (75 + fr * 25)); ctx.lineTo(Math.cos(a + 0.1) * 50, hy - 15 + Math.sin(a + 0.1) * 55); ctx.fill(); }
  } else if (hs === 'spiky') { ctx.beginPath(); ctx.moveTo(-58, hy - 10); for (let i = 0; i <= 8; i++) { const a = Math.PI * (1 + i / 8), rr = i % 2 ? 62 : 88 + fr * 20; ctx.lineTo(Math.cos(a) * rr * 0.8, hy - 15 + Math.sin(a) * rr * 0.85); } ctx.closePath(); ctx.fill(); }
  if (P.helmet || e.helmet) { ctx.fillStyle = '#ffb703'; ctx.beginPath(); ctx.arc(0, hy - 8, 72, Math.PI * 0.95, Math.PI * 2.05); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-6, hy - 80, 12, 60); ctx.strokeStyle = '#6c757d'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(-50, hy + 30); ctx.lineTo(50, hy + 30); ctx.moveTo(-40, hy + 50); ctx.lineTo(40, hy + 50); ctx.moveTo(0, hy + 20); ctx.lineTo(0, hy + 60); ctx.stroke(); }
  // --- ojos: blanco + iris + pupila + brillo; párpado del color de la piel ---
  const op = clamp(e.open ?? 1), es = e.eyeSize || 1, iris = P.iris || '#4a2c17';
  for (const sx of [-1, 1]) {
    const ex = sx * 22 + lx * 3, ey = hy + 2 + ly * 2, big = sh > 0.3 || es > 1.05;
    const rx = (big ? 17 : 13) * es * (sh > 0.3 ? 1.1 : 1), ry = (big ? 17 : 15) * es * (sh > 0.3 ? 1.1 : 1);
    if (bags > 0.05) { ctx.strokeStyle = `rgba(90,40,60,${0.55 * bags})`; ctx.lineWidth = 3.5; for (let k = 0; k < 2; k++) { ctx.beginPath(); ctx.arc(ex, ey + 5 + k * 6, rx + 3, 0.25 * Math.PI, 0.75 * Math.PI); ctx.stroke(); } }
    if (op < 0.12) { ctx.strokeStyle = '#1b1b1b'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(ex, ey - 3, 9, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
    else {
      ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, 0, 0, Math.PI * 2); ctx.clip();
      ctx.fillStyle = mix('#ffffff', '#ffd0d0', red * 0.8); ctx.fillRect(ex - rx, ey - ry, rx * 2, ry * 2);
      veins(ctx, ex, ey, rx, red);
      if (e.spiral) spiralEye(ctx, ex, ey, rx * 0.9, t, sx, '#1b1b1b');
      else { const ir = Math.min(rx, ry) * 0.62 * (e.pupil || 1) * (sh > 0.3 ? 0.6 : 1), px = ex + lx * (rx - ir) * 0.8, py = ey + ly * (ry - ir) * 0.8; ctx.fillStyle = iris; ctx.beginPath(); ctx.arc(px, py, ir, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#120a06'; ctx.beginPath(); ctx.arc(px, py, ir * 0.55, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px - ir * 0.35, py - ir * 0.4, ir * 0.3, 0, Math.PI * 2); ctx.fill(); }
      if (op < 0.98) { ctx.fillStyle = skin; ctx.fillRect(ex - rx - 2, ey - ry - 2, 2 * rx + 4, (2 * ry + 2) * (1 - op)); ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(ex - rx - 2, ey - ry - 2 + (2 * ry + 2) * (1 - op) - 3, 2 * rx + 4, 3); }
      ctx.restore();
    }
    if (!e.helmet && !P.helmet) { const tired = clamp(red + bags * 0.5) * (1 - sh), angry = e.angry || 0; ctx.strokeStyle = hs === 'bald' ? skinD : hair; ctx.lineWidth = 6.5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ex - 13 * sx, hy - 24 - sh * 16 - tired * 4 + angry * 8); ctx.quadraticCurveTo(ex, hy - 30 - sh * 16, ex + 13 * sx, hy - 25 - sh * 16 + tired * 7 - angry * 4); ctx.stroke(); }
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.22)'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(lx * 3, hy + 14, 7, 0.1 * Math.PI, 0.8 * Math.PI); ctx.stroke(); // nariz
  if (P.glasses) { ctx.strokeStyle = '#1b1b1b'; ctx.lineWidth = 4; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 22, hy + 2, 21, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fill(); } ctx.beginPath(); ctx.moveTo(-2, hy); ctx.lineTo(2, hy); ctx.stroke(); }
  // --- boca (con dientes y lengua) ---
  const mouth = e.mouth || (sh > 0.3 ? 'o' : 'smile'), mo = clamp(e.mouthOpen ?? sh), my = hy + 34, DK = '#5a1e2a', TG = '#ff7a9a';
  ctx.fillStyle = DK; ctx.strokeStyle = DK; ctx.lineWidth = 5; ctx.lineCap = 'round';
  const tongue = (w, yy) => { ctx.save(); ctx.clip(); ctx.fillStyle = TG; ctx.beginPath(); ctx.ellipse(0, yy, w, w * 0.7, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); };
  if (mouth === 'o') { const rh = 8 + 12 * mo; ctx.beginPath(); ctx.ellipse(0, my + 4, 11, rh, 0, 0, Math.PI * 2); ctx.fill(); tongue(9, my + 4 + rh); }
  else if (mouth === 'yawn') { const rh = 6 + 22 * mo; ctx.beginPath(); ctx.ellipse(0, my + 6, 14 + 6 * mo, rh, 0, 0, Math.PI * 2); ctx.fill(); tongue(11, my + 6 + rh); }
  else if (mouth === 'wobbly') { ctx.beginPath(); for (let i = 0; i <= 12; i++) { const X = -18 + i * 3, Y = my + Math.sin(i * 1.3 + t * 25) * 3; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); } ctx.stroke(); }
  else if (mouth === 'grin') { ctx.beginPath(); ctx.moveTo(-22, my - 4); ctx.quadraticCurveTo(0, my + 26, 22, my - 4); ctx.closePath(); ctx.fill(); ctx.save(); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(-20, my - 4, 40, 7); ctx.fillStyle = TG; ctx.beginPath(); ctx.ellipse(0, my + 14, 10, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
  else if (mouth === 'flat') { ctx.beginPath(); ctx.moveTo(-13, my); ctx.lineTo(13, my); ctx.stroke(); }
  else if (mouth === 'sad') { ctx.beginPath(); ctx.arc(0, my + 12, 14, 1.15 * Math.PI, 1.85 * Math.PI); ctx.stroke(); }
  else if (mouth === 'angry') { ctx.beginPath(); ctx.ellipse(0, my + 4, 18, 8 + 6 * Math.abs(Math.sin(t * 20)), 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-14, my - 2, 28, 5); }
  else if (mouth === 'chew') { ctx.beginPath(); ctx.ellipse(0, my, 14, 4 + 6 * Math.abs(Math.sin(t * 14)), 0, 0, Math.PI * 2); ctx.fill(); }
  else { const oh = 4 + talk * 11; ctx.beginPath(); ctx.moveTo(-16, my - 2); ctx.quadraticCurveTo(0, my - 2 + oh * 2.1, 16, my - 2); ctx.quadraticCurveTo(0, my + 2, -16, my - 2); ctx.closePath(); ctx.fill(); if (talk > 0.3) { ctx.save(); ctx.clip(); ctx.fillStyle = '#fff'; ctx.fillRect(-12, my - 3, 24, 4); ctx.fillStyle = TG; ctx.beginPath(); ctx.ellipse(0, my + oh * 1.4, 8, 5, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } }
  if (e.blush) { ctx.fillStyle = 'rgba(255,90,90,0.35)'; for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 36, hy + 20, 12, 7, 0, 0, Math.PI * 2); ctx.fill(); } }
  ctx.restore(); // fin cabeza
  // --- brazos con codo y manos con dedos ---
  for (const sx of [-1, 1]) {
    const gest = sx > 0 ? (talk ? Math.sin(t * 6) * 30 : Math.sin(t * 2) * 8) : (e.walk ? -walk * 20 : Math.sin(t * 2 + 2) * 5);
    let Hd = [sx * lerp(74, 62, sh), lerp(-118 - gest, -420, sh)];             // reposo: brazo colgando natural
    const ov = sx < 0 ? e.handL : e.handR; if (ov) Hd = ov;
    const sleeve = coat ? (sx > 0 ? '#dfe6ef' : '#f4f7fb') : (sx > 0 ? shirtD : shirt);
    _arm(ctx, [sx * 54, -322], Hd, sx, sleeve, coat ? '#ced4da' : shadeHex(sx > 0 ? shirtD : shirt, -0.12), sx > 0 ? skinD : skin, skinD);
    if (sx > 0 && e.hold) heldObject2(ctx, e, Hd[0], Hd[1]);
    if (sx < 0 && e.holdL) heldObject2(ctx, Object.assign({}, e, { hold: e.holdL }), Hd[0], Hd[1]);
  }
  ctx.restore();
}

// ============================================================================
// CIUDAD DE NOCHE PRO.  o: { lights 0-1 (1 = encendida), stars 0-1 }
// Capas: cielo → estrellas/vía láctea → luna → nubes → skyline lejano → edificios → calle
// ============================================================================
function _roof(ctx, x, top, w, kind, col, on, t) {
  ctx.fillStyle = col;
  if (kind === 0) { ctx.fillRect(x + w * 0.3, top - 26, w * 0.4, 26); ctx.fillRect(x + w * 0.48, top - 70, 5, 46); if (on) { const b = Math.sin(t * 3 + x) > 0.3; ctx.fillStyle = b ? '#ff4d4d' : '#7a1f1f'; ctx.beginPath(); ctx.arc(x + w * 0.5, top - 72, 5, 0, Math.PI * 2); ctx.fill(); if (b) glow(ctx, x + w * 0.5, top - 72, 30, '#ff4d4d', 0.5); } }
  else if (kind === 1) { ctx.beginPath(); ctx.moveTo(x + w * 0.2, top); ctx.lineTo(x + w * 0.5, top - 60); ctx.lineTo(x + w * 0.8, top); ctx.fill(); }
  else if (kind === 2) { ctx.fillRect(x + w * 0.15, top - 16, w * 0.7, 16); ctx.fillRect(x + w * 0.3, top - 34, w * 0.4, 18); }
  else if (kind === 3) { rrect(ctx, x + w * 0.55, top - 44, 34, 34, 6); ctx.fill(); ctx.fillRect(x + w * 0.55 + 4, top - 10, 5, 10); ctx.fillRect(x + w * 0.55 + 25, top - 10, 5, 10); }
}
function sceneCityNight(ctx, t, o = {}) {
  const lights = o.lights ?? 1, stars = o.stars ?? (1 - lights) * 0.9, horizon = H * 0.86;
  const g = ctx.createLinearGradient(0, 0, 0, horizon); g.addColorStop(0, mix('#02030f', '#0b1030', lights)); g.addColorStop(0.6, mix('#070a22', '#2a1f5c', lights)); g.addColorStop(1, mix('#0c1030', '#7a3f6e', lights));
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (stars > 0.25) { ctx.save(); ctx.globalAlpha = (stars - 0.25) * 0.75; ctx.translate(W * 0.45, H * 0.3); ctx.rotate(-0.55); for (let k = 0; k < 3; k++) { const mg = ctx.createRadialGradient(0, 0, 10, 0, 0, W * (0.55 - k * 0.12)); mg.addColorStop(0, ['rgba(190,170,255,0.5)', 'rgba(255,200,230,0.35)', 'rgba(255,255,255,0.3)'][k]); mg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = mg; ctx.save(); ctx.scale(1, 0.2 - k * 0.04); ctx.beginPath(); ctx.arc(0, 0, W * 0.6, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } ctx.restore(); }
  const r = rng(31);
  for (let i = 0; i < 320; i++) { const x = r() * W, y = r() * horizon * 0.75, s = r(), col = s > 0.9 ? '#ffd6a5' : s > 0.8 ? '#bde0fe' : '#ffffff'; ctx.globalAlpha = clamp(stars * 1.1 + 0.08) * (0.3 + 0.7 * Math.abs(Math.sin(t * (0.5 + s * 2) + i))); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 0.8 + s * 2.2, 0, Math.PI * 2); ctx.fill(); if (s > 0.94 && stars > 0.4) { ctx.globalAlpha *= 0.5; ctx.fillRect(x - 9, y - 0.8, 18, 1.6); ctx.fillRect(x - 0.8, y - 9, 1.6, 18); } }
  ctx.globalAlpha = 1;
  if (stars > 0.4) { const p = (t * 0.22) % 1; if (p < 0.12) { const k = p / 0.12, sx = W * (0.2 + 0.5 * ((Math.floor(t * 0.22) * 0.37) % 1)), sy = H * 0.08; ctx.strokeStyle = `rgba(255,255,255,${1 - k})`; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx + k * 260, sy + k * 110); ctx.lineTo(sx + k * 260 - 90, sy + k * 110 - 38); ctx.stroke(); } }
  // luna con halo y cráteres
  const mx = W * (VERTICAL ? 0.86 : 0.82), my = H * (VERTICAL ? 0.05 : 0.14);
  glow(ctx, mx, my, 220, '#cfd8ff', 0.28); ctx.fillStyle = '#f4f1de'; ctx.beginPath(); ctx.arc(mx, my, 48, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(160,160,190,0.35)'; for (const [dx, dy, rr] of [[-14, -10, 11], [16, 8, 8], [-4, 20, 6], [20, -18, 5]]) { ctx.beginPath(); ctx.arc(mx + dx, my + dy, rr, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = 'rgba(10,10,40,0.18)'; ctx.beginPath(); ctx.arc(mx + 14, my + 6, 48, -0.9, 1.9); ctx.fill();
  // nubes oscuras que cruzan
  for (let i = 0; i < 3; i++) { const cx = ((i * 760 + t * (10 + i * 5)) % (W + 700)) - 350, cy = H * (0.2 + i * 0.09); ctx.fillStyle = mix('#0a0c26', '#3b2f6b', lights); ctx.globalAlpha = 0.55; for (const [dx, dy, rx, ry] of [[0, 0, 150, 30], [90, -18, 110, 34], [-80, 8, 120, 24], [190, 6, 100, 22]]) { ctx.beginPath(); ctx.ellipse(cx + dx, cy + dy, rx, ry, 0, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; }
  if (lights > 0.3) { const hg = ctx.createLinearGradient(0, horizon - H * 0.35, 0, horizon); hg.addColorStop(0, 'rgba(255,150,90,0)'); hg.addColorStop(1, `rgba(255,150,90,${0.22 * lights})`); ctx.fillStyle = hg; ctx.fillRect(0, horizon - H * 0.35, W, H * 0.35); } // resplandor de la ciudad
  // tres capas de edificios
  [[0.12, mix('#0b0e2a', '#1a1c48', lights), 0.52, 3, 0.35, 70, 120], [0.3, mix('#080a20', '#121338', lights), 0.42, 9, 0.7, 110, 150], [0.6, mix('#05061a', '#0a0b26', lights), 0.3, 17, 1, 150, 200]].forEach(([sp, col, hgt, seed, layer, wmin, wvar]) => {
    const rr = rng(seed), period = W + 600; let bx = -((t * sp * 12) % 300) - 300;
    while (bx < W + 300) {
      const bw = wmin + rr() * wvar, bh = H * hgt * (0.45 + rr() * 0.75), top = horizon - bh, kind = Math.floor(rr() * 5), tint = rr();
      ctx.fillStyle = col; ctx.fillRect(bx, top, bw, bh + 4); _roof(ctx, bx, top, bw, kind, col, lights > 0.5 && layer > 0.5, t);
      ctx.fillStyle = 'rgba(255,255,255,0.03)'; ctx.fillRect(bx, top, 5, bh);                               // arista iluminada
      const ws = layer < 0.5 ? [8, 10, 18, 24] : layer < 1 ? [11, 15, 24, 32] : [14, 20, 30, 40];
      for (let wy = top + 18; wy < horizon - 14; wy += ws[3]) for (let wx = bx + 12; wx < bx + bw - ws[0] - 6; wx += ws[2]) {
        const k = (Math.sin(wx * 12.9898 + wy * 78.233) * 43758.5453) % 1, kk = Math.abs(k);
        if (kk < lights * 0.78) { const tv = kk < 0.06, fl = tv ? 0.6 + 0.4 * Math.sin(t * 9 + wx) : 0.85 + 0.15 * Math.sin(t * 2 + wx); ctx.fillStyle = tv ? `rgba(120,190,255,${fl * layer})` : tint > 0.7 ? `rgba(255,244,214,${fl * layer})` : `rgba(255,${196 + 40 * kk | 0},110,${fl * layer})`; ctx.fillRect(wx, wy, ws[0], ws[1]); }
        else if (layer >= 0.7) { ctx.fillStyle = 'rgba(120,140,220,0.07)'; ctx.fillRect(wx, wy, ws[0], ws[1]); }
      }
      bx += bw + 6 + rr() * 14;
    }
  });
  // calle: asfalto, reflejos y farolas
  const sg = ctx.createLinearGradient(0, horizon, 0, H); sg.addColorStop(0, '#0a0b1e'); sg.addColorStop(1, '#03030c'); ctx.fillStyle = sg; ctx.fillRect(0, horizon, W, H - horizon);
  ctx.fillStyle = 'rgba(255,255,255,0.10)'; for (let i = 0; i < 12; i++) ctx.fillRect(((i * 260 - t * 40) % (W + 300) + W + 300) % (W + 300) - 150, horizon + (H - horizon) * 0.55, 120, 6);
  for (let i = 0; i < 6; i++) {
    const x = ((i * 420 - t * 20) % (W + 500) + W + 500) % (W + 500) - 250, top = horizon - H * 0.16;
    ctx.fillStyle = '#1b1d33'; ctx.fillRect(x - 5, top, 10, H * 0.16); ctx.fillRect(x - 5, top, 46, 8);
    const on = lights > 0.5;
    if (on) { const cone = ctx.createLinearGradient(0, top, 0, horizon + 60); cone.addColorStop(0, `rgba(255,214,130,${0.30 * lights})`); cone.addColorStop(1, 'rgba(255,214,130,0)'); ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(x + 30, top + 10); ctx.lineTo(x + 170, horizon + 60); ctx.lineTo(x - 110, horizon + 60); ctx.closePath(); ctx.fill(); glow(ctx, x + 34, top + 12, 90, '#ffd88a', 0.7 * lights); const rf = ctx.createLinearGradient(0, horizon, 0, H); rf.addColorStop(0, `rgba(255,214,130,${0.25 * lights})`); rf.addColorStop(1, 'rgba(255,214,130,0)'); ctx.fillStyle = rf; ctx.fillRect(x + 14, horizon, 40, H - horizon); }
    ctx.fillStyle = on ? '#fff3c4' : '#3a3d55'; ctx.beginPath(); ctx.ellipse(x + 34, top + 12, 13, 8, 0, 0, Math.PI * 2); ctx.fill();
  }
  const fog = ctx.createLinearGradient(0, horizon - 120, 0, horizon + 20); fog.addColorStop(0, 'rgba(60,60,120,0)'); fog.addColorStop(1, `rgba(60,60,120,${0.16 + 0.1 * lights})`); ctx.fillStyle = fog; ctx.fillRect(0, horizon - 120, W, 140);
}

// ============================================================================
// SALA DE LEO PRO.  o: { lights 0-1, fanSlow 0-1 }
// ============================================================================
function sceneLivingRoom(ctx, t, o = {}) {
  const on = (o.lights ?? 1) > 0.5, floorY = 860;
  const wg = ctx.createLinearGradient(0, 0, 0, floorY); wg.addColorStop(0, '#f6ecd4'); wg.addColorStop(1, '#ecdcb8'); ctx.fillStyle = wg; ctx.fillRect(0, 0, W, floorY);
  ctx.fillStyle = 'rgba(190,150,90,0.10)'; for (let x = 0; x < W; x += 96) ctx.fillRect(x, 0, 40, floorY - 150);
  ctx.fillStyle = '#e3cfa3'; ctx.fillRect(0, floorY - 150, W, 150); ctx.fillStyle = '#d4bb88'; ctx.fillRect(0, floorY - 150, W, 10); ctx.fillStyle = '#fff8e7'; ctx.fillRect(0, floorY - 22, W, 22); // zócalo
  // piso de madera con duelas
  const fg = ctx.createLinearGradient(0, floorY, 0, H); fg.addColorStop(0, '#b06a2c'); fg.addColorStop(1, '#8a4f1d'); ctx.fillStyle = fg; ctx.fillRect(0, floorY, W, H - floorY);
  ctx.strokeStyle = 'rgba(60,30,10,0.25)'; ctx.lineWidth = 3; for (let i = -6; i <= 18; i++) { ctx.beginPath(); ctx.moveTo(W / 2 + (i * 140 - W / 2) * 0.72, floorY); ctx.lineTo(i * 140 * 1.5 - W * 0.25, H); ctx.stroke(); }
  // cuadros en la pared
  [[620, 250, 190, 150, '#4cc9f0', 0], [860, 220, 150, 190, '#ffb703', 1]].forEach(([x, y, w, h, c, k]) => { ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.25)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 8; ctx.fillStyle = '#6d4c41'; rrect(ctx, x, y, w, h, 8); ctx.fill(); ctx.restore(); ctx.fillStyle = '#fffdf5'; ctx.fillRect(x + 12, y + 12, w - 24, h - 24); ctx.fillStyle = c; if (k) { ctx.beginPath(); ctx.arc(x + w / 2, y + h * 0.45, 36, 0, Math.PI * 2); ctx.fill(); } else { ctx.beginPath(); ctx.moveTo(x + 24, y + h - 24); ctx.lineTo(x + w * 0.4, y + 50); ctx.lineTo(x + w * 0.6, y + h - 50); ctx.lineTo(x + w * 0.75, y + 70); ctx.lineTo(x + w - 24, y + h - 24); ctx.fill(); } });
  // ventana con ciudad, cortinas y barra
  const wx = 1240, wy = 150, ww = 520, wh = 400;
  ctx.fillStyle = '#fffdf5'; rrect(ctx, wx - 16, wy - 16, ww + 32, wh + 32, 14); ctx.fill();
  ctx.save(); rrect(ctx, wx, wy, ww, wh, 8); ctx.clip();
  const sk = ctx.createLinearGradient(0, wy, 0, wy + wh); sk.addColorStop(0, '#070b2a'); sk.addColorStop(1, on ? '#4a2c6e' : '#141838'); ctx.fillStyle = sk; ctx.fillRect(wx, wy, ww, wh);
  const r0 = rng(12); for (let i = 0; i < 40; i++) { ctx.fillStyle = `rgba(255,255,255,${(on ? 0.3 : 0.9) * Math.abs(Math.sin(t * 2 + i))})`; ctx.fillRect(wx + r0() * ww, wy + r0() * wh * 0.5, 2.5, 2.5); }
  ctx.fillStyle = '#f4f1de'; ctx.beginPath(); ctx.arc(wx + 400, wy + 80, 30, 0, Math.PI * 2); ctx.fill();
  const r = rng(3); let bx = wx - 10; while (bx < wx + ww + 10) { const bw = 50 + r() * 50, bh = 110 + r() * 160; ctx.fillStyle = '#0d0f2b'; ctx.fillRect(bx, wy + wh - bh, bw, bh); for (let yy = wy + wh - bh + 10; yy < wy + wh - 8; yy += 22) for (let xx = bx + 6; xx < bx + bw - 10; xx += 16) if (on && Math.sin(xx * 5 + yy) > 0) { ctx.fillStyle = '#ffd166'; ctx.fillRect(xx, yy, 8, 11); } bx += bw + 4; }
  ctx.restore();
  ctx.fillStyle = '#fffdf5'; ctx.fillRect(wx + ww / 2 - 7, wy, 14, wh); ctx.fillRect(wx, wy + wh / 2 - 7, ww, 14); rrect(ctx, wx - 36, wy + wh + 10, ww + 72, 26, 8); ctx.fill();
  for (const sd of [-1, 1]) { const cx = sd < 0 ? wx - 20 : wx + ww + 20, sw = Math.sin(t * 1.2 + sd) * 10; ctx.fillStyle = '#e76f51'; ctx.beginPath(); ctx.moveTo(cx - 60, wy - 46); ctx.lineTo(cx + 60, wy - 46); ctx.bezierCurveTo(cx + 50 + sw, wy + 180, cx + 70 + sw, wy + 340, cx + 46 + sw * 1.6, wy + wh + 90); ctx.lineTo(cx - 46 + sw * 1.6, wy + wh + 90); ctx.bezierCurveTo(cx - 70 + sw, wy + 300, cx - 50, wy + 150, cx - 60, wy - 46); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.12)'; for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(cx + k * 28 - 5, wy - 46); ctx.quadraticCurveTo(cx + k * 30 + sw, wy + 250, cx + k * 24 + sw * 1.6 - 5, wy + wh + 90); ctx.lineTo(cx + k * 24 + sw * 1.6 + 7, wy + wh + 90); ctx.quadraticCurveTo(cx + k * 30 + sw + 10, wy + 250, cx + k * 28 + 5, wy - 46); ctx.fill(); } }
  ctx.fillStyle = '#6d4c41'; rrect(ctx, wx - 110, wy - 62, ww + 220, 18, 9); ctx.fill();
  // tapete
  ctx.fillStyle = '#2a9d8f'; ctx.beginPath(); ctx.ellipse(820, 985, 560, 70, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#e9c46a'; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(820, 985, 500, 54, 0, 0, Math.PI * 2); ctx.stroke();
  // sofá con cojines
  softShadow(ctx, 820, 945, 470, 40, 0.35);
  ctx.fillStyle = '#c8553d'; rrect(ctx, 430, 600, 780, 240, 56); ctx.fill();                               // respaldo
  ctx.fillStyle = '#e76f51'; rrect(ctx, 470, 630, 340, 190, 40); ctx.fill(); rrect(ctx, 830, 630, 340, 190, 40); ctx.fill();
  ctx.fillStyle = '#d9603f'; rrect(ctx, 400, 720, 130, 220, 46); ctx.fill(); rrect(ctx, 1110, 720, 130, 220, 46); ctx.fill(); // brazos
  ctx.fillStyle = '#ef8a6f'; rrect(ctx, 510, 790, 620, 110, 40); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(812, 800, 6, 90);
  ctx.fillStyle = '#5a3825'; ctx.fillRect(470, 935, 26, 30); ctx.fillRect(1144, 935, 26, 30);
  ctx.save(); ctx.translate(560, 760); ctx.rotate(-0.2); ctx.fillStyle = '#ffd166'; rrect(ctx, -60, -55, 120, 110, 26); ctx.fill(); ctx.restore(); ctx.save(); ctx.translate(1080, 765); ctx.rotate(0.18); ctx.fillStyle = '#4cc9f0'; rrect(ctx, -55, -50, 110, 100, 24); ctx.fill(); ctx.restore();
  // mesita con planta
  ctx.fillStyle = '#8d6e63'; rrect(ctx, 1290, 800, 170, 16, 8); ctx.fill(); ctx.fillRect(1305, 816, 12, 130); ctx.fillRect(1433, 816, 12, 130);
  ctx.save(); ctx.translate(1375, 800); for (let i = 0; i < 6; i++) { ctx.save(); ctx.rotate((i - 2.5) * 0.36 + Math.sin(t * 1.5 + i) * 0.06); ctx.fillStyle = i % 2 ? '#52b788' : '#2d6a4f'; ctx.beginPath(); ctx.moveTo(0, -50); ctx.quadraticCurveTo(-26, -120, 0, -170 + Math.abs(i - 2.5) * 22); ctx.quadraticCurveTo(26, -120, 0, -50); ctx.fill(); ctx.restore(); } ctx.fillStyle = '#f4a261'; ctx.beginPath(); ctx.moveTo(-42, -62); ctx.lineTo(42, -62); ctx.lineTo(32, 0); ctx.lineTo(-32, 0); ctx.fill(); ctx.fillStyle = '#e76f51'; ctx.fillRect(-46, -70, 92, 14); ctx.restore();
  // lámpara de pie
  if (on) { const cone = ctx.createLinearGradient(0, 390, 0, 980); cone.addColorStop(0, 'rgba(255,225,150,0.42)'); cone.addColorStop(1, 'rgba(255,225,150,0)'); ctx.fillStyle = cone; ctx.beginPath(); ctx.moveTo(200, 440); ctx.lineTo(320, 440); ctx.lineTo(560, 980); ctx.lineTo(-40, 980); ctx.fill(); glow(ctx, 260, 420, 260, '#ffe29a', 0.55); }
  ctx.fillStyle = '#495057'; ctx.fillRect(254, 440, 12, 500); rrect(ctx, 200, 936, 120, 16, 8); ctx.fill();
  ctx.fillStyle = on ? '#ffe29a' : '#b8b2a0'; ctx.beginPath(); ctx.moveTo(190, 440); ctx.lineTo(330, 440); ctx.lineTo(300, 340); ctx.lineTo(220, 340); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(190, 428, 140, 12);
  // ventilador de techo
  ctx.fillStyle = '#6c757d'; ctx.fillRect(894, 0, 12, 60); ctx.save(); ctx.translate(900, 78); ctx.rotate(t * (on ? 9 : 9 * Math.max(0, 1 - (o.fanSlow ?? 1)))); for (let i = 0; i < 4; i++) { ctx.rotate(Math.PI / 2); ctx.fillStyle = '#b08968'; rrect(ctx, 14, -15, 220, 30, 15); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(14, 2, 220, 8); } ctx.restore(); ctx.fillStyle = '#495057'; ctx.beginPath(); ctx.arc(900, 78, 24, 0, Math.PI * 2); ctx.fill();
  if (on) { ctx.fillStyle = 'rgba(255,238,190,0.10)'; ctx.fillRect(0, 0, W, H); }
  else { ctx.save(); ctx.globalCompositeOperation = 'screen'; const ms = ctx.createLinearGradient(wx, wy, wx - 500, H); ms.addColorStop(0, 'rgba(120,150,255,0.30)'); ms.addColorStop(1, 'rgba(120,150,255,0)'); ctx.fillStyle = ms; ctx.beginPath(); ctx.moveTo(wx, wy + wh); ctx.lineTo(wx + ww, wy + wh); ctx.lineTo(wx + ww - 380, H); ctx.lineTo(wx - 620, H); ctx.fill(); ctx.restore(); } // luz de luna
  floaters(ctx, t, { n: 26, color: on ? 'rgba(255,240,200,0.6)' : 'rgba(170,200,255,0.5)', speed: 10, size: 3, seed: 5 });
}

// ============================================================================
// CALLE DE DÍA PRO.  dim 0-1 (apaga colores para días grises o sin luz)
// ============================================================================
function sceneStreetDay(ctx, t, dim = 0) {
  const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, mix('#4fb8ff', '#7d8597', dim)); g.addColorStop(0.7, mix('#cdefff', '#c5c9d3', dim)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  glow(ctx, W * 0.84, H * 0.16, 300, '#fff4c2', 0.6 * (1 - dim)); ctx.fillStyle = mix('#ffe066', '#e9ecef', dim); ctx.beginPath(); ctx.arc(W * 0.84, H * 0.16, 62, 0, Math.PI * 2); ctx.fill();
  for (let i = 0; i < 4; i++) { const cx = ((i * 620 + t * (14 + i * 4)) % (W + 600)) - 300, cy = 110 + i * 60; ctx.fillStyle = 'rgba(255,255,255,0.92)'; for (const [dx, dy, rr] of [[0, 0, 44], [50, -18, 56], [108, 0, 42], [54, 16, 46]]) { ctx.beginPath(); ctx.arc(cx + dx, cy + dy, rr, 0, Math.PI * 2); ctx.fill(); } }
  const base = 860, r = rng(8); let bx = -((t * 30) % 280) - 280;
  // fila lejana
  ctx.fillStyle = mix('#a9c7e8', '#9aa0ad', dim); for (let i = 0; i < 12; i++) { const hh = 300 + ((i * 97) % 220); ctx.fillRect(i * 190 - ((t * 10) % 190), base - hh - 120, 170, hh + 120); }
  while (bx < W + 280) {
    const bw = 220 + r() * 120, bh = 380 + r() * 260, top = base - bh, col = mix(['#ffb4a2', '#cdb4db', '#b5e48c', '#a2d2ff', '#ffd6a5'][Math.floor(r() * 5)], '#8d99ae', dim * 0.65);
    ctx.fillStyle = col; ctx.fillRect(bx, top, bw, bh); ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(bx + bw - 26, top, 26, bh); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(bx - 6, top - 12, bw + 12, 14);
    for (let wy = top + 34; wy < base - 190; wy += 96) for (let wx = bx + 26; wx < bx + bw - 70; wx += 74) { ctx.fillStyle = '#f8f9fa'; rrect(ctx, wx - 5, wy - 5, 54, 68, 6); ctx.fill(); const wg = ctx.createLinearGradient(wx, wy, wx + 44, wy + 58); wg.addColorStop(0, mix('#8fd3ff', '#adb5bd', dim)); wg.addColorStop(1, mix('#4a90d9', '#6c757d', dim)); ctx.fillStyle = wg; ctx.fillRect(wx, wy, 44, 58); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.moveTo(wx, wy + 30); ctx.lineTo(wx + 26, wy); ctx.lineTo(wx + 38, wy); ctx.lineTo(wx, wy + 44); ctx.fill(); ctx.fillStyle = '#f8f9fa'; ctx.fillRect(wx + 20, wy, 4, 58); }
    // planta baja: toldo, puerta y aparador
    ctx.fillStyle = 'rgba(0,0,0,0.14)'; ctx.fillRect(bx, base - 150, bw, 150);
    const aw = ['#ef476f', '#06d6a0', '#ffd166', '#118ab2'][Math.floor(r() * 4)]; for (let k = 0; k < Math.floor(bw / 36); k++) { ctx.fillStyle = k % 2 ? '#fff' : mix(aw, '#8d99ae', dim * 0.6); ctx.beginPath(); ctx.moveTo(bx + k * 36, base - 150); ctx.lineTo(bx + k * 36 + 36, base - 150); ctx.lineTo(bx + k * 36 + 36, base - 112); ctx.quadraticCurveTo(bx + k * 36 + 18, base - 96, bx + k * 36, base - 112); ctx.fill(); }
    ctx.fillStyle = '#6d4c41'; rrect(ctx, bx + 28, base - 96, 58, 96, 6); ctx.fill(); ctx.fillStyle = mix('#bde0fe', '#adb5bd', dim); rrect(ctx, bx + 108, base - 90, bw - 140, 62, 6); ctx.fill();
    bx += bw + 14;
  }
  ctx.fillStyle = '#ced4da'; ctx.fillRect(0, base, W, 56); ctx.fillStyle = '#adb5bd'; ctx.fillRect(0, base + 48, W, 10);
  const rg = ctx.createLinearGradient(0, base + 56, 0, H); rg.addColorStop(0, '#495057'); rg.addColorStop(1, '#343a40'); ctx.fillStyle = rg; ctx.fillRect(0, base + 56, W, H - base - 56);
  ctx.fillStyle = '#f8f9fa'; for (let i = 0; i < 14; i++) ctx.fillRect(((i * 200 - t * 120) % (W + 300) + W + 300) % (W + 300) - 150, base + 130, 100, 10);
  for (let i = 0; i < 4; i++) { const x = ((i * 560 - t * 30) % (W + 600) + W + 600) % (W + 600) - 300; ctx.fillStyle = '#6d4c41'; ctx.fillRect(x - 8, base - 120, 16, 120); ctx.fillStyle = mix('#40916c', '#6c757d', dim * 0.6); for (const [dx, dy, rr] of [[0, -170, 62], [-44, -140, 46], [44, -142, 48]]) { ctx.beginPath(); ctx.arc(x + dx + Math.sin(t * 1.5 + i) * 3, base + dy, rr, 0, Math.PI * 2); ctx.fill(); } ctx.fillStyle = 'rgba(255,255,255,0.14)'; ctx.beginPath(); ctx.arc(x - 18, base - 190, 26, 0, Math.PI * 2); ctx.fill(); }
}

// ============================================================================
// PLANETA TIERRA PRO (proyección esférica real: los continentes giran y se deforman en el borde)
// globeGrids(ctx, x, y, r, t, { independent, night 0-1 })
// ============================================================================
const _CONT = [ // [lon°, y (-1 norte … 1 sur)]
  [[-130, -0.78], [-100, -0.86], [-72, -0.74], [-58, -0.52], [-78, -0.34], [-83, -0.12], [-100, -0.16], [-112, -0.32], [-126, -0.5]],
  [[-80, -0.02], [-62, -0.08], [-38, 0.12], [-44, 0.4], [-64, 0.8], [-72, 0.52], [-80, 0.2]],
  [[-12, -0.62], [4, -0.78], [30, -0.82], [44, -0.62], [28, -0.46], [10, -0.46], [-6, -0.5]],
  [[-16, -0.26], [10, -0.36], [34, -0.3], [50, -0.06], [40, 0.2], [30, 0.56], [18, 0.6], [10, 0.2], [-10, 0.06], [-17, -0.1]],
  [[46, -0.6], [62, -0.86], [110, -0.88], [142, -0.72], [136, -0.46], [120, -0.3], [106, -0.08], [96, -0.2], [80, -0.08], [70, -0.3], [50, -0.36]],
  [[114, 0.3], [136, 0.22], [152, 0.4], [146, 0.6], [124, 0.58], [112, 0.44]],
];
function globeGrids(ctx, x, y, r, t, o = {}) {
  const rot = (t * 9) % 360, night = o.night ?? 0.55;
  ctx.save(); ctx.translate(x, y);
  glow(ctx, 0, 0, r * 1.5, '#4cc9f0', 0.35);                                                            // atmósfera
  const og = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.1, 0, 0, r); og.addColorStop(0, '#3fa7e0'); og.addColorStop(0.7, '#1d5fa8'); og.addColorStop(1, '#123a75');
  ctx.fillStyle = og; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.clip();
  const proj = (lon, yy) => { let d = ((lon - rot + 540) % 360) - 180; const vis = Math.abs(d) <= 90; d = clamp(d, -90, 90); return [Math.sin(d * Math.PI / 180) * Math.sqrt(1 - yy * yy) * r, yy * r, vis]; };
  _CONT.forEach((poly, ci) => {
    const dense = []; poly.forEach((a, i) => { const b = poly[(i + 1) % poly.length]; for (let k = 0; k < 6; k++) dense.push([lerp(a[0], b[0], k / 6), lerp(a[1], b[1], k / 6)]); });
    const pts = dense.map(([lo, yy]) => proj(lo, yy)); if (!pts.some(p => p[2])) return;
    ctx.fillStyle = ['#4fae7c', '#5fc27f', '#63b98a', '#74c08a', '#58b384', '#8fc27a'][ci]; ctx.lineJoin = 'round'; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); ctx.fill();
    if (ci === 3 || ci === 5) { const c0 = proj(ci === 3 ? 12 : 132, ci === 3 ? -0.2 : 0.4); if (c0[2]) { ctx.save(); ctx.clip(); ctx.fillStyle = 'rgba(233,196,106,0.75)'; ctx.beginPath(); ctx.ellipse(c0[0], c0[1], r * 0.2, r * 0.09, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); } }
    ctx.strokeStyle = 'rgba(255,255,255,0.22)'; ctx.lineWidth = Math.max(3, r * 0.02); ctx.stroke();
    // luces de la red de cada región (cada una se apaga y enciende por separado)
    const on = o.independent ? Math.sin(t * 1.3 + ci * 2.1) > -0.3 : true, rr = rng(ci * 13 + 5);
    const lo0 = poly.reduce((a, p) => a + p[0], 0) / poly.length, y0 = poly.reduce((a, p) => a + p[1], 0) / poly.length;
    for (let k = 0; k < 9; k++) { const p = proj(lo0 + (rr() - 0.5) * 34, clamp(y0 + (rr() - 0.5) * 0.3, -0.95, 0.95)); if (!p[2]) continue; if (on) glow(ctx, p[0], p[1], 16, '#ffe066', 0.9); ctx.fillStyle = on ? '#fff3b0' : 'rgba(40,50,70,0.8)'; ctx.beginPath(); ctx.arc(p[0], p[1], 3.5, 0, Math.PI * 2); ctx.fill(); }
  });
  ctx.fillStyle = 'rgba(255,255,255,0.92)'; ctx.beginPath(); ctx.ellipse(0, -r * 0.98, r * 0.5, r * 0.12, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(0, r * 0.99, r * 0.6, r * 0.13, 0, 0, Math.PI * 2); ctx.fill(); // casquetes
  for (let i = 0; i < 7; i++) { const rr = rng(i + 60), p = proj((rr() * 360 + t * 14) % 360 - 180 + rot * 0 + (t * 4), (rr() - 0.5) * 1.5); if (!p[2]) continue; ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.beginPath(); ctx.ellipse(p[0], p[1], r * (0.14 + rr() * 0.12) * Math.sqrt(Math.max(0.05, 1 - (p[0] / r) ** 2)), r * 0.035, 0.2, 0, Math.PI * 2); ctx.fill(); } // nubes
  const ng = ctx.createLinearGradient(-r, -r * 0.3, r, r * 0.5); ng.addColorStop(0.35, 'rgba(4,8,30,0)'); ng.addColorStop(1, `rgba(4,8,30,${night})`); ctx.fillStyle = ng; ctx.fillRect(-r, -r, r * 2, r * 2); // lado nocturno
  ctx.restore();
  const sp = ctx.createRadialGradient(-r * 0.4, -r * 0.45, 0, -r * 0.4, -r * 0.45, r * 0.6); sp.addColorStop(0, 'rgba(255,255,255,0.28)'); sp.addColorStop(1, 'rgba(255,255,255,0)'); ctx.fillStyle = sp; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(140,220,255,0.55)'; ctx.lineWidth = r * 0.03; ctx.beginPath(); ctx.arc(0, 0, r * 1.012, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}
function starfield(ctx, t, n = 160, seed = 7) { const r = rng(seed); for (let i = 0; i < n; i++) { const s = r(); ctx.fillStyle = `rgba(255,255,255,${0.25 + 0.75 * Math.abs(Math.sin(t * (0.6 + s) + i))})`; ctx.beginPath(); ctx.arc(r() * W, r() * H, 0.8 + s * 2.2, 0, Math.PI * 2); ctx.fill(); } }

// ============================================================================
// SOL PRO: halo, corona de rayos, superficie con granulación y protuberancias
// ============================================================================
function sunFlare(ctx, x, y, r, t) {
  ctx.save(); ctx.translate(x, y);
  glow(ctx, 0, 0, r * 3.2, '#ff9f1c', 0.35); glow(ctx, 0, 0, r * 1.9, '#ffd166', 0.55);
  ctx.save(); ctx.rotate(t * 0.12); for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, L = r * (1.25 + 0.3 * Math.sin(t * 2 + i * 1.7)); ctx.fillStyle = 'rgba(255,214,102,0.35)'; ctx.beginPath(); ctx.moveTo(Math.cos(a - 0.06) * r * 0.98, Math.sin(a - 0.06) * r * 0.98); ctx.lineTo(Math.cos(a) * L, Math.sin(a) * L); ctx.lineTo(Math.cos(a + 0.06) * r * 0.98, Math.sin(a + 0.06) * r * 0.98); ctx.fill(); } ctx.restore();
  const sg = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r); sg.addColorStop(0, '#fff3b0'); sg.addColorStop(0.55, '#ffb703'); sg.addColorStop(1, '#f77f00'); ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
  ctx.save(); ctx.clip(); for (let i = 0; i < 26; i++) { const rr = rng(i + 4), a = rr() * Math.PI * 2 + t * 0.05, d = rr() * r * 0.9; ctx.fillStyle = i % 3 ? 'rgba(247,127,0,0.35)' : 'rgba(255,243,176,0.35)'; ctx.beginPath(); ctx.ellipse(Math.cos(a) * d, Math.sin(a) * d, r * (0.06 + rr() * 0.1), r * (0.04 + rr() * 0.05), a, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = 'rgba(120,40,0,0.55)'; for (const [dx, dy, s2] of [[0.25, -0.2, 0.09], [0.38, -0.08, 0.05], [-0.3, 0.35, 0.07]]) { ctx.beginPath(); ctx.ellipse(dx * r, dy * r, s2 * r, s2 * r * 0.7, 0.4, 0, Math.PI * 2); ctx.fill(); } // manchas solares
  ctx.restore();
  for (let i = 0; i < 3; i++) { const a = -0.5 + i * 0.5 + Math.sin(t * 0.3 + i) * 0.1, L = r * (1.35 + 0.25 * Math.sin(t * 2.4 + i * 2)); ctx.strokeStyle = i % 2 ? '#ff7b00' : '#ffd166'; ctx.lineWidth = r * 0.07; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r * 0.97, Math.sin(a) * r * 0.97); ctx.quadraticCurveTo(Math.cos(a + 0.22) * L, Math.sin(a + 0.22) * L, Math.cos(a + 0.44) * r * 0.97, Math.sin(a + 0.44) * r * 0.97); ctx.stroke(); }
  ctx.restore();
}

// ============================================================================
// CELULAR PRO: marco, botones, cámara, reflejo de cristal.  o: { time, battery, muted, signal, rot }
// ============================================================================
function bigPhone(ctx, x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18; const bz = ctx.createLinearGradient(-140, 0, 140, 0); bz.addColorStop(0, '#3d4252'); bz.addColorStop(0.5, '#1b1e29'); bz.addColorStop(1, '#2b2f3b'); ctx.fillStyle = bz; rrect(ctx, -140, -270, 280, 540, 44); ctx.fill(); ctx.restore();
  ctx.fillStyle = '#12141c'; rrect(ctx, 138, -150, 7, 70, 3); ctx.fill(); rrect(ctx, -145, -170, 7, 44, 3); ctx.fill(); rrect(ctx, -145, -110, 7, 44, 3); ctx.fill();
  ctx.save(); rrect(ctx, -126, -254, 252, 508, 32); ctx.clip();
  const g = ctx.createLinearGradient(-126, -254, 126, 254); g.addColorStop(0, '#4f6df5'); g.addColorStop(0.55, '#7b2ff7'); g.addColorStop(1, '#f72585'); ctx.fillStyle = g; ctx.fillRect(-126, -254, 252, 508);
  for (let i = 0; i < 4; i++) { ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(-60 + i * 60 + Math.sin(t + i) * 20, 120 + Math.cos(t * 0.8 + i) * 40, 70, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,0.10)'; ctx.beginPath(); ctx.moveTo(-126, -254); ctx.lineTo(10, -254); ctx.lineTo(-126, 60); ctx.fill();   // reflejo
  ctx.restore();
  ctx.fillStyle = '#0c0d13'; rrect(ctx, -42, -246, 84, 24, 12); ctx.fill(); ctx.fillStyle = '#23263a'; ctx.beginPath(); ctx.arc(24, -234, 5, 0, Math.PI * 2); ctx.fill();
  if (o.time) text(ctx, o.time, 0, -150, { size: 72, fill: '#fff', lw: 0, shadow: false });
  if (o.battery != null) { ctx.fillStyle = 'rgba(255,255,255,0.95)'; rrect(ctx, -64, -62, 122, 60, 12); ctx.fill(); ctx.fillRect(58, -44, 9, 24); ctx.fillStyle = o.battery < 0.2 ? '#ef233c' : '#40c98a'; rrect(ctx, -57, -55, 108 * clamp(o.battery), 46, 8); ctx.fill(); text(ctx, Math.round(o.battery * 100) + '%', 0, 44, { size: 52, fill: '#fff', lw: 0, shadow: false }); }
  if (o.muted) { ctx.save(); ctx.translate(0, 60); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-50, 40); ctx.quadraticCurveTo(-50, -60, 0, -60); ctx.quadraticCurveTo(50, -60, 50, 40); ctx.lineTo(65, 55); ctx.lineTo(-65, 55); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.arc(0, 70, 14, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(-80, -80); ctx.lineTo(80, 90); ctx.stroke(); ctx.restore(); }
  if (o.signal != null) for (let i = 0; i < 4; i++) { ctx.fillStyle = i < o.signal * 4 ? '#fff' : 'rgba(255,255,255,0.25)'; rrect(ctx, -60 + i * 32, 180 - i * 22, 22, 30 + i * 22, 5); ctx.fill(); }
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; rrect(ctx, -44, 232, 88, 7, 3); ctx.fill();
  ctx.restore();
}
