// Cuarto de Leo (reutilizable). st = { hour (0-24, hora del reloj), clouds (desplazamiento extra),
//   cups: [tiempos de aparición], clockBounce: t, dark (0-1 oscurecer), cam: {zoom, fx, fy, shake} }
function dayOf(h) { if (h < 5.5 || h > 19.5) return 0; return clamp(Math.sin(((h - 5.5) / 14) * Math.PI) * 1.8); }

function roomWindow(ctx, t, h, d, cloudOff) {
  const X = 180, Y = 170, Wd = 520, Hd = 450;
  ctx.save(); rrect(ctx, X, Y, Wd, Hd, 16); ctx.clip();
  const dusk = clamp(d * (1 - d) * 4) * 0.8;
  const g = ctx.createLinearGradient(0, Y, 0, Y + Hd);
  g.addColorStop(0, mix('#0b1640', '#4fb8ff', d)); g.addColorStop(1, mix(mix('#3a2470', '#bfeaff', d), '#ff8a5b', dusk));
  ctx.fillStyle = g; ctx.fillRect(X, Y, Wd, Hd);
  const r = rng(11);
  for (let i = 0; i < 45; i++) {
    const sx = X + r() * Wd, sy = Y + r() * Hd * 0.7, ph = r() * 9;
    ctx.globalAlpha = (1 - d) * (0.3 + 0.7 * Math.abs(Math.sin(t * 2.2 + ph)));
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sx, sy, 1.5 + r() * 2.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  const sunA = ((h - 6) / 12) * Math.PI, moonA = (((h + 12) % 24 - 6) / 12) * Math.PI;
  const body = (a, R, fill, glow) => {
    const bx = X + Wd / 2 - Math.cos(a) * Wd * 0.45, by = Y + Hd * 0.85 - Math.sin(a) * Hd * 0.7;
    const gg = ctx.createRadialGradient(bx, by, R * 0.5, bx, by, R * 3);
    gg.addColorStop(0, glow); gg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gg; ctx.fillRect(bx - R * 3, by - R * 3, R * 6, R * 6);
    ctx.beginPath(); ctx.arc(bx, by, R, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill();
  };
  if (Math.sin(moonA) > -0.2) body(moonA, 42, '#fff6d6', 'rgba(255,246,214,0.35)');
  if (Math.sin(sunA) > -0.2) body(sunA, 50, '#ffd23f', 'rgba(255,210,63,0.5)');
  const off = t * 25 + cloudOff;
  for (let i = 0; i < 4; i++) {
    const cx = X + ((i * 190 + off * (0.6 + i * 0.2)) % (Wd + 300)) - 150, cy = Y + 70 + i * 55;
    ctx.fillStyle = mix('#5a4a8a', '#ffffff', d); ctx.globalAlpha = 0.85;
    for (const [dx, dy, rr] of [[0, 0, 34], [36, -14, 42], [78, 0, 32], [40, 12, 34]]) { ctx.beginPath(); ctx.arc(cx + dx, cy + dy, rr, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.globalAlpha = 1;
  const r2 = rng(5); let bx = X - 10;
  while (bx < X + Wd) {
    const bw = 50 + r2() * 60, bh = 90 + r2() * 130;
    ctx.fillStyle = mix('#1b1440', '#6b7fae', d); ctx.fillRect(bx, Y + Hd - bh, bw, bh);
    for (let wy = Y + Hd - bh + 14; wy < Y + Hd - 10; wy += 24) for (let wx = bx + 8; wx < bx + bw - 12; wx += 18) {
      const on = Math.sin(wx * 12.9 + wy * 7.3 + Math.floor(t * 1.5 + wx) * 3.1) > 0.1;
      if (on && d < 0.6) { ctx.fillStyle = `rgba(255,214,120,${0.9 - d})`; ctx.fillRect(wx, wy, 9, 12); }
    }
    bx += bw + 6;
  }
  ctx.restore();
  ctx.fillStyle = '#efe3ff';
  rrect(ctx, X - 11, Y - 11, Wd + 22, 22, 8); ctx.fill(); rrect(ctx, X - 11, Y + Hd - 11, Wd + 22, 22, 8); ctx.fill();
  ctx.fillRect(X - 11, Y - 11, 22, Hd + 22); ctx.fillRect(X + Wd - 11, Y - 11, 22, Hd + 22);
  ctx.fillRect(X + Wd / 2 - 7, Y, 14, Hd); ctx.fillRect(X, Y + Hd / 2 - 7, Wd, 14);
  rrect(ctx, X - 40, Y + Hd + 4, Wd + 80, 30, 8); ctx.fill();
  for (const side of [-1, 1]) {
    const cx = side < 0 ? X - 30 : X + Wd + 30, sway = wob(t, 1.3, side) * 18;
    ctx.beginPath(); ctx.moveTo(cx + 70 * side, Y - 40); ctx.lineTo(cx + side * 70, Y - 40);
    ctx.bezierCurveTo(cx + side * 60 + sway, Y + 200, cx + side * 90 + sway * 1.5, Y + 380, cx + side * 50 + sway * 2, Y + Hd + 80);
    ctx.lineTo(cx - side * 40 + sway * 2, Y + Hd + 80);
    ctx.bezierCurveTo(cx - side * 10 + sway, Y + 300, cx - side * 60 + sway * 0.5, Y + 150, cx - side * 70, Y - 40);
    ctx.closePath(); ctx.fillStyle = mix('#7a3fa0', '#ff8fa3', d); ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fill();
  }
  ctx.fillStyle = '#c79a5b'; rrect(ctx, X - 130, Y - 56, Wd + 260, 22, 10); ctx.fill();
}
function roomClock(ctx, t, h, bounceAt) {
  let s = 1; if (bounceAt != null) { const p = prog(t, bounceAt, bounceAt + 0.6); if (p > 0 && p < 1) s += 0.25 * Math.sin(p * Math.PI * 3) * (1 - p); }
  ctx.save(); ctx.translate(1370, 320); ctx.scale(s, s); ctx.rotate(Math.sin(t * 2) * 0.03);
  for (const sx of [-1, 1]) { ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(sx * 62, -92, 26, Math.PI, 0); ctx.fill(); }
  ctx.fillStyle = '#ff6b5b'; ctx.beginPath(); ctx.arc(0, 0, 100, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff8ec'; ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = FLAT.ink; ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ctx.lineWidth = i % 3 ? 4 : 8; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 62, Math.sin(a) * 62); ctx.lineTo(Math.cos(a) * 72, Math.sin(a) * 72); ctx.stroke(); }
  const mA = ((h % 1) * Math.PI * 2) - Math.PI / 2, hA = ((h % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(hA) * 40, Math.sin(hA) * 40); ctx.stroke();
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(mA) * 62, Math.sin(mA) * 62); ctx.stroke();
  ctx.fillStyle = FLAT.ink; ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
function roomShelf(ctx, t) {
  ctx.fillStyle = '#c79a5b'; rrect(ctx, 1260, 560, 470, 26, 8); ctx.fill();
  const books = [['#ff6b5b', 50, 120], ['#5ee0c0', 40, 100], ['#ffd23f', 56, 130], ['#8b7bff', 36, 95]];
  let x = 1290; books.forEach(([c, w, hh], i) => { ctx.save(); ctx.translate(x + w / 2, 560); ctx.rotate(i === 3 ? 0.2 : 0); ctx.fillStyle = c; rrect(ctx, -w / 2, -hh, w, hh, 6); ctx.fill(); ctx.fillStyle = 'rgba(0,0,0,0.12)'; ctx.fillRect(w / 6, -hh, w / 3, hh); ctx.restore(); x += w + 6; });
  ctx.save(); ctx.translate(1620, 560);
  for (let i = 0; i < 5; i++) { ctx.save(); ctx.rotate((i - 2) * 0.38 + wob(t, 1.6, i) * 0.12); ctx.beginPath(); ctx.moveTo(0, -60); ctx.quadraticCurveTo(-30, -130, 0, -180 + Math.abs(i - 2) * 25); ctx.quadraticCurveTo(30, -130, 0, -60); ctx.fillStyle = i % 2 ? '#4cc38a' : '#3aa676'; ctx.fill(); ctx.restore(); }
  ctx.fillStyle = '#ff8a5b'; ctx.beginPath(); ctx.moveTo(-50, -70); ctx.lineTo(50, -70); ctx.lineTo(38, 0); ctx.lineTo(-38, 0); ctx.closePath(); ctx.fill();
  ctx.restore();
}
function roomBedBack(ctx) {
  ctx.fillStyle = '#8b5e3c'; rrect(ctx, 830, 520, 640, 380, 60); ctx.fill();
  ctx.fillStyle = '#a8744b'; rrect(ctx, 870, 560, 560, 300, 40); ctx.fill();
  ctx.fillStyle = '#fff3e0'; rrect(ctx, 930, 640, 300, 120, 50); ctx.fill();
}
function roomBedFront(ctx, t) {
  const br = Math.sin(t * 2.2) * 6;
  ctx.beginPath(); ctx.moveTo(780, 860);
  ctx.bezierCurveTo(900, 820 + br, 1050, 845 - br, 1180, 830 + br);
  ctx.bezierCurveTo(1300, 818, 1420, 845 + br, 1530, 835);
  ctx.lineTo(1560, 1130); ctx.lineTo(760, 1130); ctx.closePath();
  ctx.fillStyle = '#6c63ff'; ctx.fill();
  ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 16;
  for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(760 + i * 80, 820); ctx.lineTo(680 + i * 80, 1130); ctx.stroke(); }
  ctx.restore();
}
function roomNightstand(ctx, t, cups = []) {
  ctx.fillStyle = '#c79a5b'; rrect(ctx, 1520, 760, 230, 200, 18); ctx.fill();
  ctx.fillStyle = '#b0844b'; rrect(ctx, 1545, 820, 180, 50, 10); ctx.fill();
  cups.forEach((ct, i) => {
    const s = pop(t, ct, 0.5); if (s <= 0) return;
    ctx.save(); ctx.translate(1635 + (i % 2 ? 22 : -18), 722 - i * 74); ctx.rotate((i % 2 ? 1 : -1) * 0.06 + Math.sin(t * 6 + i) * 0.03); ctx.scale(s, s);
    drawCoffee(ctx, 0, 0, t + i, 0.95); ctx.restore();
  });
}
// Dibuja el cuarto completo con Leo en la cama. e = expresión de Leo (o null), st = estado del cuarto
function room(ctx, t, st, e) {
  const h = st.hour ?? 23.9, d = st.day ?? dayOf(h), cam = st.cam || {};
  const zoom = cam.zoom || 1.15, fx = cam.fx ?? 1080, fy = cam.fy ?? 620, sh = cam.shake || 0;
  ctx.save();
  ctx.translate(W / 2 + Math.sin(t * 47) * sh, H / 2 + Math.cos(t * 39) * sh); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy);
  ctx.translate(Math.sin(t * 0.5) * 6, Math.cos(t * 0.4) * 4);
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, mix('#2b2357', '#ffcf9e', d)); g.addColorStop(1, mix('#1a1538', '#f0a878', d));
  ctx.fillStyle = g; ctx.fillRect(-300, -300, W + 600, H + 600);
  ctx.fillStyle = mix('#352c66', '#ffdcb5', d);
  for (let y = -40; y < 900; y += 90) for (let x = -60; x < W + 60; x += 90) {
    const ox = ((x + t * 8) % (W + 120)) - 60, oy = y + ((x / 90) % 2) * 45;
    ctx.save(); ctx.translate(ox, oy); ctx.rotate(Math.PI / 4); ctx.fillRect(-7, -7, 14, 14); ctx.restore();
  }
  ctx.fillStyle = mix('#3b2c5e', '#c98a5e', d); ctx.fillRect(-300, 900, W + 600, 500);
  roomWindow(ctx, t, h, d, st.clouds || 0);
  roomClock(ctx, t, h, st.clockBounce);
  roomShelf(ctx, t);
  ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = d > 0.3 ? '#fff4c2' : '#a9c4ff';
  ctx.beginPath(); ctx.moveTo(180, 620); ctx.lineTo(700, 620); ctx.lineTo(1000, 1080); ctx.lineTo(300, 1080); ctx.closePath(); ctx.fill(); ctx.restore();
  roomBedBack(ctx);
  roomNightstand(ctx, t, st.cups || []);
  if (e) leo(ctx, (st.x || 1150) + (e.jx || 0), 1045, 1.15, Object.assign({ inBed: true }, e));
  roomBedFront(ctx, t);
  if (e && e.hold === 'phone' && d < 0.5) {
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    const gx = 1150 + 105 * 1.15, gy = 1045 - 405 * 1.15;
    const gg = ctx.createRadialGradient(gx, gy, 10, gx, gy, 420);
    gg.addColorStop(0, `rgba(90,170,255,${0.5 * (1 - d)})`); gg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gg; ctx.fillRect(gx - 420, gy - 420, 840, 840); ctx.restore();
  }
  if (st.overlay) st.overlay(ctx);
  floaters(ctx, t, { n: 50, color: d > 0.3 ? 'rgba(255,240,200,0.7)' : 'rgba(170,200,255,0.6)', speed: 14, size: 3 });
  ctx.restore();
  if (st.dark) { ctx.fillStyle = `rgba(8,4,25,${st.dark})`; ctx.fillRect(0, 0, W, H); }
  vignette(ctx, 0.5);
  return d;
}
// Poses de Leo en la cama (coordenadas locales)
const BED = { rest: [-95, -185], phone: [105, -365], coffee: [110, -300], stretch: [-55, -570], up: [[-125, -560], [135, -560]], head: [-62, -425] };
