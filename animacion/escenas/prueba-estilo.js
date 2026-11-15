// Prueba de estilo (gancho del video 001): ~20 s
const SCENE = { duration: 20, fps: 30 };

const T = {
  clock: 2.4, counter: 3.0, yawn: 3.8, ffStart: 5.6, coffee: 6.8, h24: 9.4, ff2: 10.2,
  cups: [10.8, 11.3, 11.8], spiral: 12.4, scream: 13.0, wipe: 13.7, upChar: 15.6, yawn2: 17.4, end: 19.2,
};
T.switch = T.wipe + 0.7 * 0.6; // momento en que la transición cubre toda la pantalla

// Efectos de sonido (los lee el mezclador de audio)
SCENE.sfx = [
  ...[0.4, 0.9, 1.4, 1.9].map(t => ({ t, type: 'tick', vol: 0.5 })),
  { t: T.clock, type: 'ding', vol: 0.8 },
  { t: T.counter, type: 'pop', vol: 0.9 },
  { t: T.yawn, type: 'yawn', vol: 0.6 },
  { t: T.ffStart, type: 'ff', dur: T.h24 - T.ffStart, vol: 0.35 },
  { t: T.coffee, type: 'pop', vol: 0.9, pitch: 1.2 }, { t: T.coffee + 0.05, type: 'boing', vol: 0.45, pitch: 1.4 },
  { t: T.h24, type: 'ding', vol: 0.7, pitch: 1.5 }, { t: T.h24 + 0.05, type: 'boing', vol: 0.9 },
  { t: T.ff2, type: 'ff', dur: T.scream - T.ff2, vol: 0.4, pitch: 1.5 },
  ...T.cups.map((t, i) => ({ t, type: 'pop', vol: 0.8, pitch: 1 + i * 0.25 })),
  { t: 10.6, type: 'blip', vol: 0.5 }, { t: 11.6, type: 'blip', vol: 0.5, pitch: 1.2 },
  { t: T.spiral, type: 'dizzy', vol: 0.6 },
  { t: T.scream, type: 'impact', vol: 1.0 }, { t: T.scream + 0.02, type: 'boing', vol: 1.0, pitch: 0.7 },
  { t: T.wipe - 0.05, type: 'whoosh', vol: 0.9 },
  { t: T.switch + 0.1, type: 'sparkle', vol: 0.6 },
  ...[14.4, 14.75, 15.1, 15.35].map((t, i) => ({ t, type: 'pop', vol: 0.55, pitch: 0.9 + i * 0.15 })),
  { t: T.upChar, type: 'boing', vol: 0.8, pitch: 1.2 },
  { t: T.yawn2, type: 'yawn', vol: 0.5, pitch: 1.1 },
  { t: T.end, type: 'whoosh', vol: 0.4, pitch: 0.7 },
];
// Automatización de la música: [t, nivel]
SCENE.music = [[0, 0.12], [5.4, 0.12], [5.8, 0.2], [12.9, 0.2], [13.0, 0.05], [14.1, 0.05], [14.3, 0.3], [19.2, 0.3], [20, 0]];
SCENE.ambience = [{ type: 'crickets', from: 0, to: 5.6, vol: 0.25 }];

// ---------- tiempo dentro de la historia ----------
function hoursAt(t) {
  if (t < T.ffStart) return 0;
  if (t < T.h24) return 24 * ease.inOut(prog(t, T.ffStart, T.h24));
  if (t < T.ff2) return 24;
  return lerp(24, 72, ease.inOut(prog(t, T.ff2, T.scream)));
}
function clockHour(t) { // hora del reloj de pared (0-24)
  if (t < T.clock) return 23 + (58.8 + (t / T.clock) * 1.2) / 60;
  return (24 + hoursAt(t)) % 24;
}
function dayness(h) { // 0 = noche, 1 = pleno día
  if (h < 5.5 || h > 19.5) return 0;
  return clamp(Math.sin(((h - 5.5) / 14) * Math.PI) * 1.8);
}
function blink(t) { const c = (t * 0.42 + 0.3) % 1; return c < 0.045 ? Math.abs(c / 0.0225 - 1) : 1; }
function punch(t, at, amt = 0.07) { const p = prog(t, at, at + 0.6); return p > 0 && p < 1 ? amt * Math.sin(p * Math.PI) * (1 - p) * 2 : 0; }
function shake(t, at, amp, dur = 0.5) { const p = prog(t, at, at + dur); return p > 0 && p < 1 ? amp * (1 - p) : 0; }

// ---------- escenario: cuarto de noche ----------
function drawSkyWindow(ctx, t, h, d) {
  const X = 180, Y = 170, Wd = 520, Hd = 450;
  ctx.save(); rrect(ctx, X, Y, Wd, Hd, 16); ctx.clip();
  const dusk = clamp(d * (1 - d) * 4) * 0.8;
  const g = ctx.createLinearGradient(0, Y, 0, Y + Hd);
  g.addColorStop(0, mix('#0b1640', '#4fb8ff', d)); g.addColorStop(1, mix(mix('#3a2470', '#bfeaff', d), '#ff8a5b', dusk));
  ctx.fillStyle = g; ctx.fillRect(X, Y, Wd, Hd);
  // estrellas que titilan
  const r = rng(11);
  for (let i = 0; i < 45; i++) {
    const sx = X + r() * Wd, sy = Y + r() * Hd * 0.7, ph = r() * 9;
    ctx.globalAlpha = (1 - d) * (0.3 + 0.7 * Math.abs(Math.sin(t * 2.2 + ph)));
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(sx, sy, 1.5 + r() * 2.5, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
  // sol / luna recorren el cielo según la hora
  const sunA = ((h - 6) / 12) * Math.PI, moonA = (((h + 12) % 24 - 6) / 12) * Math.PI;
  const body = (a, R, fill, glow) => {
    const bx = X + Wd / 2 - Math.cos(a) * Wd * 0.45, by = Y + Hd * 0.85 - Math.sin(a) * Hd * 0.7;
    const gg = ctx.createRadialGradient(bx, by, R * 0.5, bx, by, R * 3);
    gg.addColorStop(0, glow); gg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = gg; ctx.fillRect(bx - R * 3, by - R * 3, R * 6, R * 6);
    ctx.beginPath(); ctx.arc(bx, by, R, 0, Math.PI * 2); fillStroke(ctx, fill, 6);
  };
  if (Math.sin(moonA) > -0.2) body(moonA, 42, '#fff6d6', 'rgba(255,246,214,0.35)');
  if (Math.sin(sunA) > -0.2) body(sunA, 50, '#ffd23f', 'rgba(255,210,63,0.5)');
  // nubes (se aceleran cuando corre el tiempo)
  const off = t * 25 + hoursAt(t) * 140;
  for (let i = 0; i < 4; i++) {
    const cx = X + ((i * 190 + off * (0.6 + i * 0.2)) % (Wd + 300)) - 150, cy = Y + 70 + i * 55;
    ctx.fillStyle = mix('#5a4a8a', '#ffffff', d); ctx.globalAlpha = 0.85;
    for (const [dx, dy, rr] of [[0, 0, 34], [36, -14, 42], [78, 0, 32], [40, 12, 34]]) { ctx.beginPath(); ctx.arc(cx + dx, cy + dy, rr, 0, Math.PI * 2); ctx.fill(); }
  }
  ctx.globalAlpha = 1;
  // ciudad con ventanas que se prenden y apagan
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
  // marco
  rrect(ctx, X, Y, Wd, Hd, 16); ctx.lineWidth = 22; ctx.strokeStyle = '#efe3ff'; ctx.stroke();
  ctx.lineWidth = 8; ctx.strokeStyle = OUT; rrect(ctx, X - 11, Y - 11, Wd + 22, Hd + 22, 22); ctx.stroke();
  ctx.fillStyle = '#efe3ff'; ctx.fillRect(X + Wd / 2 - 7, Y, 14, Hd); ctx.fillRect(X, Y + Hd / 2 - 7, Wd, 14);
  rrect(ctx, X - 40, Y + Hd + 4, Wd + 80, 30, 8); fillStroke(ctx, '#efe3ff', 7);
  // cortinas que se mecen
  for (const side of [-1, 1]) {
    const cx = side < 0 ? X - 30 : X + Wd + 30;
    ctx.beginPath(); ctx.moveTo(cx - 70 * side * -1, Y - 40);
    const sway = wob(t, 1.3, side) * 18;
    ctx.lineTo(cx + side * 70, Y - 40);
    ctx.bezierCurveTo(cx + side * 60 + sway, Y + 200, cx + side * 90 + sway * 1.5, Y + 380, cx + side * 50 + sway * 2, Y + Hd + 80);
    ctx.lineTo(cx - side * 40 + sway * 2, Y + Hd + 80);
    ctx.bezierCurveTo(cx - side * 10 + sway, Y + 300, cx - side * 60 + sway * 0.5, Y + 150, cx - side * 70, Y - 40);
    ctx.closePath(); fillStroke(ctx, mix('#7a3fa0', '#ff8fa3', d), 8);
  }
  rrect(ctx, X - 130, Y - 56, Wd + 260, 22, 10); fillStroke(ctx, '#c79a5b', 6);
}

function drawWallClock(ctx, t, h) {
  const s = 1 + 0.25 * (pop(t, T.clock, 0.6) < 1 && t > T.clock ? Math.sin(prog(t, T.clock, T.clock + 0.6) * Math.PI * 3) * (1 - prog(t, T.clock, T.clock + 0.6)) : 0);
  ctx.save(); ctx.translate(1370, 320); ctx.scale(s, s); ctx.rotate(Math.sin(t * 2) * 0.03);
  ctx.beginPath(); ctx.arc(0, 0, 100, 0, Math.PI * 2); fillStroke(ctx, '#ff6b5b', 9);
  ctx.beginPath(); ctx.arc(0, 0, 80, 0, Math.PI * 2); fillStroke(ctx, '#fff8ec', 6);
  ctx.strokeStyle = OUT; ctx.lineCap = 'round';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ctx.lineWidth = i % 3 ? 4 : 8; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 62, Math.sin(a) * 62); ctx.lineTo(Math.cos(a) * 72, Math.sin(a) * 72); ctx.stroke(); }
  const mA = ((h % 1) * Math.PI * 2) - Math.PI / 2, hA = ((h % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(hA) * 40, Math.sin(hA) * 40); ctx.stroke();
  ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(mA) * 62, Math.sin(mA) * 62); ctx.stroke();
  ctx.fillStyle = OUT; ctx.beginPath(); ctx.arc(0, 0, 9, 0, Math.PI * 2); ctx.fill();
  // campanitas
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.arc(sx * 62, -92, 26, Math.PI, 0); fillStroke(ctx, '#ffd23f', 7); }
  ctx.restore();
}

function drawShelf(ctx, t, d) {
  rrect(ctx, 1260, 560, 470, 26, 8); fillStroke(ctx, '#c79a5b', 7);
  const books = [['#ff6b5b', 50, 120], ['#5ee0c0', 40, 100], ['#ffd23f', 56, 130], ['#8b7bff', 36, 95]];
  let x = 1290; books.forEach(([c, w, hh], i) => { ctx.save(); ctx.translate(x + w / 2, 560); ctx.rotate(i === 3 ? 0.2 : 0); rrect(ctx, -w / 2, -hh, w, hh, 6); fillStroke(ctx, c, 6); ctx.restore(); x += w + 6; });
  // maceta con planta que se mece
  ctx.save(); ctx.translate(1620, 560);
  for (let i = 0; i < 5; i++) {
    ctx.save(); ctx.rotate((i - 2) * 0.38 + wob(t, 1.6, i) * 0.12);
    ctx.beginPath(); ctx.moveTo(0, -60); ctx.quadraticCurveTo(-30, -130, 0, -180 + Math.abs(i - 2) * 25); ctx.quadraticCurveTo(30, -130, 0, -60);
    fillStroke(ctx, '#4cc38a', 6); ctx.restore();
  }
  ctx.beginPath(); ctx.moveTo(-50, -70); ctx.lineTo(50, -70); ctx.lineTo(38, 0); ctx.lineTo(-38, 0); ctx.closePath(); fillStroke(ctx, '#ff8a5b', 7);
  ctx.restore();
}

function drawBed(ctx, t, front) {
  if (!front) {
    rrect(ctx, 830, 520, 640, 380, 60); fillStroke(ctx, '#8b5e3c', 9);
    rrect(ctx, 870, 560, 560, 300, 40); fillStroke(ctx, '#a8744b', 6);
    rrect(ctx, 930, 640, 300, 120, 50); fillStroke(ctx, '#fff3e0', 7); // almohada
  } else {
    // cobija con ondulación (respira)
    const br = Math.sin(t * 2.2) * 6;
    ctx.beginPath(); ctx.moveTo(780, 860);
    ctx.bezierCurveTo(900, 820 + br, 1050, 845 - br, 1180, 830 + br);
    ctx.bezierCurveTo(1300, 818, 1420, 845 + br, 1530, 835);
    ctx.lineTo(1560, 1000); ctx.lineTo(760, 1000); ctx.closePath();
    fillStroke(ctx, '#6c63ff', 9);
    ctx.save(); ctx.clip(); ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 16;
    for (let i = 0; i < 12; i++) { ctx.beginPath(); ctx.moveTo(760 + i * 80, 820); ctx.lineTo(700 + i * 80, 1000); ctx.stroke(); }
    ctx.restore();
  }
}

function drawNightstand(ctx, t, nCups) {
  rrect(ctx, 1520, 760, 230, 200, 18); fillStroke(ctx, '#c79a5b', 8);
  rrect(ctx, 1545, 820, 180, 50, 10); fillStroke(ctx, '#b0844b', 6);
  // tazas que van apareciendo y se apilan
  T.cups.forEach((ct, i) => {
    const s = pop(t, ct, 0.5); if (s <= 0 || i >= nCups) return;
    ctx.save(); ctx.translate(1635 + (i % 2 ? 22 : -18), 722 - i * 74); ctx.rotate((i % 2 ? 1 : -1) * 0.06 + Math.sin(t * 6 + i) * 0.03); ctx.scale(s, s);
    drawCoffee(ctx, 0, 0, t + i, 0.95); ctx.restore();
  });
}

function drawRoom(ctx, t) {
  const hrs = hoursAt(t), h = clockHour(t), d = dayness(h);
  // pared
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, mix('#2b2357', '#ffcf9e', d)); g.addColorStop(1, mix('#1a1538', '#f0a878', d));
  ctx.fillStyle = g; ctx.fillRect(-200, -200, W + 400, H + 400);
  // papel tapiz: rombitos que se desplazan suavemente
  ctx.fillStyle = mix('#352c66', '#ffdcb5', d);
  for (let y = -40; y < 900; y += 90) for (let x = -60; x < W + 60; x += 90) {
    const ox = ((x + t * 8) % (W + 120)) - 60, oy = y + ((x / 90) % 2) * 45;
    ctx.save(); ctx.translate(ox, oy); ctx.rotate(Math.PI / 4); ctx.fillRect(-7, -7, 14, 14); ctx.restore();
  }
  // piso
  ctx.fillStyle = mix('#3b2c5e', '#c98a5e', d); ctx.fillRect(-200, 900, W + 400, 400);
  ctx.strokeStyle = OUT; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(-200, 900); ctx.lineTo(W + 200, 900); ctx.stroke();
  drawSkyWindow(ctx, t, h, d);
  drawWallClock(ctx, t, h);
  drawShelf(ctx, t, d);
  // luz de la ventana proyectada en el piso
  ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = d > 0.3 ? '#fff4c2' : '#a9c4ff';
  ctx.beginPath(); ctx.moveTo(180, 620); ctx.lineTo(700, 620); ctx.lineTo(1000, 1080); ctx.lineTo(300, 1080); ctx.closePath(); ctx.fill(); ctx.restore();
  return { hrs, h, d };
}

// ---------- personaje según la línea de tiempo ----------
function charState(t) {
  const o = { x: 1150, y: 905, s: 0.95, t, mouth: 'smile', holding: 'phone', px: 0.55, py: 0.1, eyeOpen: blink(t) };
  const tired = prog(t, T.ffStart, T.h24), wrecked = prog(t, T.ff2, T.scream);
  o.red = tired * 0.55 + wrecked * 0.45; o.bags = tired * 0.6 + wrecked * 0.4;
  o.squash = Math.sin(t * 2.2) * 0.015; // respiración
  o.armL = [[-105, -120], [-170, -80], [-150, -20]];
  o.armR = [[105, -130], [185, -110], [205, -180]];
  // mira el reloj cuando suena
  if (t > T.clock && t < T.clock + 1.0) { o.px = 0.8; o.py = -0.8; o.mouth = 'o'; o.mouthOpen = 0.2; o.eyeOpen = 1; }
  // bostezo
  const yp = prog(t, T.yawn, T.yawn + 1.4);
  if (yp > 0 && yp < 1) {
    const k = Math.sin(yp * Math.PI);
    o.mouth = 'yawn'; o.mouthOpen = k; o.eyeOpen = 1 - k * 0.9; o.squash = -0.07 * k;
    o.armL = [[-105, -150], [-200 - 20 * k, -230 - 60 * k], [-170, -330 - 70 * k]];
  }
  if (t > T.ffStart) { o.eyeOpen = Math.min(o.eyeOpen, 1 - tired * 0.25); o.mouth = 'flat'; o.px = 0.55 + Math.sin(t * 7) * 0.2; }
  if (t > T.coffee) { o.holding = 'coffee'; o.armR = [[105, -130], [200, -100], [215, -150]]; o.mouth = tired > 0.6 ? 'wobbly' : 'grin'; }
  // ¡HORA 24!
  const hp = prog(t, T.h24, T.h24 + 0.8);
  if (hp > 0 && hp < 1) { o.eyeSize = 1 + 0.4 * Math.sin(hp * Math.PI); o.pupil = 0.55; o.mouth = 'o'; o.mouthOpen = 0.7; o.eyeOpen = 1; o.px = 0; o.py = 0; o.squash = -0.1 * Math.sin(hp * Math.PI); }
  if (t > T.ff2) {
    o.frazzle = wrecked; o.mouth = 'wobbly'; o.eyeOpen = 1; o.eyeSize = 1 + wrecked * 0.2; o.pupil = 0.7;
    o.x += Math.sin(t * 55) * 5 * wrecked; o.rot = Math.sin(t * 31) * 0.02 * wrecked;
    o.px = Math.sin(t * 9) * 0.5; o.py = Math.cos(t * 7) * 0.3;
  }
  if (t > T.spiral) { o.spiral = true; o.rot = Math.sin(t * 6) * 0.08; }
  const sp = prog(t, T.scream, T.scream + 0.7);
  if (sp > 0) { o.spiral = false; o.eyeSize = 1.55; o.pupil = 0.45; o.mouth = 'o'; o.mouthOpen = 1; o.squash = -0.14 * Math.sin(clamp(sp) * Math.PI) - 0.04; o.armL = [[-105, -150], [-210, -260], [-180, -360]]; o.armR = [[105, -150], [220, -250], [210, -340]]; o.holding = 'coffee'; }
  return o;
}

function drawRoomScene(ctx, t) {
  // cámara: acercamiento lento + "punch" + temblor
  const zoom = 1.1 + 0.16 * ease.inOut(prog(t, 0, T.wipe)) + punch(t, T.h24) + punch(t, T.scream, 0.12) + punch(t, T.coffee, 0.03);
  const sh = shake(t, T.h24, 12) + shake(t, T.scream, 28, 0.7) + (t > T.ff2 && t < T.scream ? 3 * prog(t, T.ff2, T.scream) : 0);
  const cf = 0.3 + 0.3 * ease.inOut(prog(t, 0, T.wipe)), fx = lerp(W / 2, 1180, cf), fy = lerp(H / 2, 660, cf);
  ctx.save();
  ctx.translate(W / 2 + Math.sin(t * 47) * sh, H / 2 + Math.cos(t * 39) * sh); ctx.scale(zoom, zoom); ctx.translate(-fx, -fy);
  ctx.translate(Math.sin(t * 0.5) * 6, Math.cos(t * 0.4) * 4); // deriva de cámara constante
  const { d } = drawRoom(ctx, t);
  drawBed(ctx, t, false);
  drawNightstand(ctx, t, T.cups.length);
  const o = charState(t);
  drawChar(ctx, o);
  drawBed(ctx, t, true);
  // brillo del celular de noche
  if (o.holding === 'phone') {
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    const gx = o.x + 205 * o.s, gy = o.y - 220 * o.s;
    const gg = ctx.createRadialGradient(gx, gy, 10, gx, gy, 420);
    gg.addColorStop(0, `rgba(90,170,255,${0.55 * (1 - d)})`); gg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gg; ctx.fillRect(gx - 420, gy - 420, 840, 840); ctx.restore();
  }
  // efectos de caricatura
  exclaim(ctx, 1290, 520, t, T.h24 + 0.05, '!');
  burst(ctx, 1150, 680, t, T.h24, '#ffd23f');
  burst(ctx, 1355, 690, t, T.coffee, '#fff', 8, 90);
  sweat(ctx, 1260, 640, t, 10.6, 1); sweat(ctx, 1040, 650, t, 11.6, -1); sweat(ctx, 1270, 660, t, 12.2, 1);
  exclaim(ctx, 1020, 420, t, T.scream + 0.05, '¡¡!!');
  burst(ctx, 1150, 650, t, T.scream, '#ff6b5b', 14, 260);
  // polvo flotando en el cuarto
  floaters(ctx, t, { n: 50, color: d > 0.3 ? 'rgba(255,240,200,0.7)' : 'rgba(170,200,255,0.6)', speed: 14, size: 3 });
  ctx.restore();
  speedLines(ctx, t, (t > T.ffStart && t < T.h24 ? 0.5 * Math.sin(prog(t, T.ffStart, T.h24) * Math.PI) : 0) + (t > T.ff2 && t < T.scream + 0.4 ? 0.7 * prog(t, T.ff2, T.scream) : 0));
  // contador de marca
  const hrs = hoursAt(t);
  drawCounter(ctx, t, counterLabel(hrs), T.counter, [T.h24, T.scream, ...Array.from({ length: 30 }, (_, i) => (i < 8 ? T.ffStart + i * 0.47 : T.ff2 + (i - 8) * 0.13))]);
  // viñeta
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.45, W / 2, H / 2, H * 1.05);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(10,5,30,0.55)'); ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
}

// ---------- tarjeta de título ----------
function drawTitle(ctx, t) {
  const lt = t - T.switch;
  const g = ctx.createRadialGradient(W / 2, H * 0.45, 50, W / 2, H * 0.45, W * 0.7);
  g.addColorStop(0, '#5a3fd6'); g.addColorStop(1, '#1a1048'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // rayos girando
  ctx.save(); ctx.translate(W / 2, H * 0.45); ctx.rotate(lt * 0.25); ctx.fillStyle = 'rgba(255,255,255,0.06)';
  for (let i = 0; i < 16; i++) { ctx.rotate(Math.PI / 8); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1400, -120); ctx.lineTo(1400, 120); ctx.closePath(); if (i % 2) ctx.fill(); }
  ctx.restore();
  // "Z" y estrellitas flotando
  const r = rng(21);
  for (let i = 0; i < 18; i++) {
    const x = r() * W, sp = 40 + r() * 70, ph = r() * H, y = H + 100 - ((lt * sp + ph) % (H + 200));
    ctx.save(); ctx.translate(x + Math.sin(lt * 1.5 + i) * 30, y); ctx.rotate(Math.sin(lt * 2 + i) * 0.4);
    ctx.globalAlpha = 0.55; text(ctx, i % 3 ? 'Z' : '★', 0, 0, { size: 40 + r() * 50, fill: i % 3 ? '#b9a8ff' : '#ffd23f', shadow: false });
    ctx.restore();
  }
  // título letra por letra (rebote elástico + ondulación continua)
  const lines = [['¿QUÉ LE PASA A TU CUERPO', 112, '#ffffff', 300], ['SI DEJAS DE DORMIR?', 168, '#ffd23f', 470]];
  let k = 0;
  lines.forEach(([str, size, fill, y], li) => {
    ctx.font = `${size}px Lilita`;
    const total = ctx.measureText(str).width; let x = W / 2 - total / 2;
    [...str].forEach(ch => {
      const w = ctx.measureText(ch).width, st = 0.15 + k * 0.035 + li * 0.25;
      const s = pop(lt, st, 0.6);
      if (s > 0 && ch !== ' ') {
        ctx.save(); ctx.translate(x + w / 2, y + Math.sin(lt * 4 - k * 0.45) * 8); ctx.scale(s, s); ctx.rotate(Math.sin(lt * 3 + k) * 0.04);
        text(ctx, ch, 0, 0, { size, fill }); ctx.restore();
      }
      x += w; k++;
    });
  });
  // el personaje aparece desde abajo, desvelado y con café
  const up = ease.back(prog(t, T.upChar, T.upChar + 0.6));
  if (up > 0) {
    const yp = prog(t, T.yawn2, T.yawn2 + 1.3), yk = yp > 0 && yp < 1 ? Math.sin(yp * Math.PI) : 0;
    drawChar(ctx, {
      x: W / 2 + Math.sin(t * 55) * 3, y: H + 260 - up * 230, s: 1.05, t, red: 1, bags: 1, frazzle: 0.8,
      eyeSize: 1.15, pupil: 0.7, px: Math.sin(t * 3) * 0.4, py: -0.2, eyeOpen: yk ? 1 - yk * 0.85 : blink(t),
      mouth: yk ? 'yawn' : 'wobbly', mouthOpen: yk, squash: Math.sin(t * 3) * 0.02 - yk * 0.06,
      armL: [[-105, -150], [-190, -120], [-200, -60]], armR: [[105, -150], [190, -170], [210, -240]], holding: 'coffee',
    });
  }
  const fade = prog(t, T.end, SCENE.duration - 0.1);
  if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
}

SCENE.render = function (ctx, t) {
  if (t < T.switch) drawRoomScene(ctx, t); else drawTitle(ctx, t);
  wipe(ctx, t, T.wipe);
};
