// VIDEO 001 — ¿Qué le pasa a tu cuerpo si dejas de dormir? (estilo plano, protagonista: Leo)
// Sincronizado con la narración de ElevenLabs usando TIEMPOS (001-sin-dormir.datos.js).
THEME.outline = 0;
const SCENE = { fps: 30, sfx: [], voice: [] };

// ================= LÍNEA DE TIEMPO DE LA VOZ =================
const VO = ['audio/001-parte1.mp3', 'audio/001-parte2.mp3', 'audio/001-parte3.mp3', 'audio/001-parte4.mp3'];
const PAR = (pt, pi) => TIEMPOS[pt].paragraphs[pi];
const cutBefore = (pt, pi) => (PAR(pt, pi - 1).end + PAR(pt, pi).start) / 2;
const SEG = []; let cursor = 0.4;
function seg(part, from, to, gap) { SEG.push({ part, from, to, at: cursor }); cursor += to - from + gap; }
const TITLE_LEN = 3.6, END_LEN = 15.5;
seg(0, 0, cutBefore(0, 5), 0); const TITLE_AT = cursor; cursor += TITLE_LEN;
seg(0, cutBefore(0, 5), TIEMPOS[0].duration, 0.8);
seg(1, 0, TIEMPOS[1].duration, 0.8);
seg(2, 0, cutBefore(2, 6), 1.6);
seg(2, cutBefore(2, 6), TIEMPOS[2].duration, 0.8);
seg(3, 0, cutBefore(3, 8), 0.6);
seg(3, cutBefore(3, 8), TIEMPOS[3].duration, 0);
const VOICE_END = cursor;
SCENE.duration = Math.ceil((VOICE_END + END_LEN) * 10) / 10;
SCENE.voice = SEG.map(s => ({ file: VO[s.part], from: s.from, to: s.to, at: s.at }));
function G(pt, local) {
  const s = SEG.find(s => s.part === pt && local >= s.from - 0.05 && local <= s.to + 0.05) || SEG.filter(s => s.part === pt).pop();
  return s.at + local - s.from;
}
const PS = (pt, pi) => G(pt, PAR(pt, pi).start);           // inicio de párrafo (global)
const PE = (pt, pi) => G(pt, PAR(pt, pi).end);             // fin de párrafo (global)
const SS = (pt, pi, si) => { const ss = PAR(pt, pi).sentences; return G(pt, ss[Math.min(si, ss.length - 1)].start); }; // inicio de frase

// ================= TOMAS =================
const SHOTS = [];
function shot(a, draw, o = {}) { SHOTS.push(Object.assign({ a, draw }, o)); if (!o.quiet) fx(a, 'whoosh', 0.22, 1.3); }
function fx(t, type, vol = 0.7, pitch = 1, extra = {}) { SCENE.sfx.push(Object.assign({ t, type, vol, pitch }, extra)); }
const L = (t, a, b) => prog(t, a, b); // atajo
const blinkE = (t, extra) => E(t, extra);
let COUNTER_FIRST = null;

// ---------- 1. GANCHO: noche en el cuarto ----------
{
  const a = 0, s1 = SS(0, 0, 1), p1a = PS(0, 1), p1b = PE(0, 1);
  fx(0.2, 'tick', 0.5); fx(0.7, 'tick', 0.5); fx(1.2, 'tick', 0.5); fx(1.7, 'tick', 0.5); fx(s1, 'ding', 0.6); fx(s1 + 0.05, 'boing', 0.5, 1.3);
  fx(p1a, 'ff', 0.35, 1, { dur: p1b - p1a });
  SCENE.ambience = [{ type: 'crickets', from: 0, to: p1a, vol: 0.2 }];
  shot(a, (ctx, lt, d, t) => {
    const ffp = ease.inOut(L(t, p1a, p1b)), hrs = 48 * ffp;
    const hour = t < s1 ? 23 + (58.5 + 1.5 * t / s1) / 60 : (24 + hrs) % 24;
    const wide = L(t, s1, s1 + 0.6);
    const e = blinkE(t, { hold: 'phone', handR: BED.phone, look: [0.6, -0.1], red: ffp * 0.6, bags: ffp * 0.5 });
    if (wide > 0 && wide < 1) Object.assign(e, { eyeSize: 1 + 0.35 * Math.sin(wide * Math.PI), open: 1, mouth: 'o', mouthOpen: 0.4, look: [0.9, -0.9] });
    if (t > p1a) { e.mouth = 'flat'; e.look = [0.6 + Math.sin(t * 7) * 0.2, 0]; }
    room(ctx, t, { hour, clouds: hrs * 140, clockBounce: s1, cam: { zoom: 1.12 + 0.12 * L(t, 0, p1b), fx: 1100, fy: 640 } }, e);
    speedLines(ctx, t, 0.5 * Math.sin(ffp * Math.PI));
    if (t > p1a) { const days = Math.floor(hrs / 24); text(ctx, ['HOY', 'MAÑANA', 'PASADO MAÑANA'][Math.min(2, days)], W / 2, 130, { size: 90, fill: FLAT.accent }); }
  }, { quiet: true });
}

// ---------- 2. Avance: Randy 1964 (retro) ----------
{
  const a = PS(0, 2), elevenAt = SS(0, 2, 1), p3 = PS(0, 3), hallu = SS(0, 3, 1), other = SS(0, 3, 2);
  fx(a + 0.1, 'impact', 0.6); fx(elevenAt, 'ff', 0.3, 1.3, { dur: 1.2 }); fx(elevenAt + 1.2, 'ding', 0.6, 1.2);
  fx(hallu, 'dizzy', 0.5); fx(other, 'boing', 0.7, 0.8); fx(other + 0.1, 'sparkle', 0.5);
  shot(a, (ctx, lt, d, t) => {
    retroRoom(ctx, t);
    const days = Math.min(11, 1 + Math.floor(10 * L(t, elevenAt, elevenAt + 1.2)));
    const tired = L(t, elevenAt, p3);
    const e = blinkE(t, { red: tired * 0.7, bags: tired, mouth: 'smile' });
    if (t > p3) Object.assign(e, { mouth: 'wobbly', frazzle: 0.6, spiral: t > hallu && t < other, eyeSize: 1.15 });
    if (t > other) Object.assign(e, { helmet: true, mouth: 'grin', spiral: false });
    drawPerson(ctx, 960 + (t > p3 ? Math.sin(t * 30) * 3 : 0), 1000, 1.2, e, PEOPLE.randy);
    if (t > hallu && t < other + 0.3) for (let i = 0; i < 6; i++) { const ang = t * 1.5 + i; ctx.save(); ctx.globalAlpha = 0.7; ctx.translate(960 + Math.cos(ang) * 420, 480 + Math.sin(ang * 1.3) * 220); ctx.rotate(t * 2 + i); ctx.fillStyle = [FLAT.coral, FLAT.mint, FLAT.purple][i % 3]; ctx.beginPath(); ctx.moveTo(0, -50); ctx.lineTo(45, 30); ctx.lineTo(-45, 30); ctx.fill(); ctx.restore(); }
    if (t > p3 && t < hallu) speech(ctx, t, p3, 1250, 330, 'bla... ¿qué...?');
    if (t > other) { text(ctx, '¿?', 1250, 330, { size: 120, fill: FLAT.accent }); stars(ctx, t, 960, 420); }
    popIn(ctx, t, a + 0.1, 300, 170, () => text(ctx, '1964', 0, 0, { size: 150, fill: FLAT.accent }));
    if (t > elevenAt) calendar(ctx, 1560, 260, 0.6, 'DÍA', String(days), FLAT.coral, (t * 8) % 1);
    retroOverlay(ctx, t);
  }, { trans: 'flash' });
}

// ---------- 3. "Hoy vamos a ver hora por hora" ----------
{
  const a = PS(0, 4), tease = SS(0, 4, 1), weird = SS(0, 4, 2);
  COUNTER_FIRST = a + 0.6; fx(a + 0.6, 'pop', 0.9); fx(tease, 'dizzy', 0.4); fx(weird, 'impact', 0.5);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#3a2f8f', '#1c1a4a', 3); rays(ctx, t, W / 2, 600);
    const glitch = t > tease ? L(t, tease, tease + 0.4) : 0;
    const e = blinkE(t, { talk: talking(t), mouth: t > weird ? 'o' : null, shock: t > weird ? 0.8 : 0, look: [0, -0.2] });
    leo(ctx, 760 + (t > weird ? Math.sin(t * 50) * 4 : 0), 1000, 1.2, e);
    if (t > tease) {
      ctx.save(); ctx.translate(1350, 470); ctx.rotate(Math.sin(t * 3) * 0.05);
      const s = pop(t, tease, 0.6); ctx.scale(s, s);
      const jx = (Math.sin(t * 37) > 0.85 ? 1 : 0) * Math.sin(t * 90) * 12;
      text(ctx, 'DÍA 3', jx, 0, { size: 220, fill: FLAT.coral }); text(ctx, '???', 0, 170, { size: 100, fill: '#fff' });
      ctx.restore();
    }
    if (glitch > 0 && glitch < 1) { ctx.fillStyle = `rgba(255,255,255,${0.3 * (1 - glitch)})`; ctx.fillRect(0, 0, W, H); }
  }, { counter: () => 'HORA 0' });
}

// ---------- TARJETA DE TÍTULO ----------
{
  const a = TITLE_AT - 0.15;
  fx(a, 'whoosh', 0.8); fx(a + 0.4, 'sparkle', 0.6); [0.5, 0.8, 1.1, 1.35].forEach((d, i) => fx(a + d, 'pop', 0.5, 0.9 + i * 0.15)); fx(a + 1.9, 'boing', 0.7, 1.2);
  shot(a, (ctx, lt, d, t) => titleCard(ctx, lt), { trans: 'wipe', quiet: true });
}

// ---------- 4. Un día normal (montaje) ----------
{
  const a = TITLE_AT + TITLE_LEN, p = PAR(0, 5), s1 = SS(0, 5, 1), s2 = SS(0, 5, 2);
  const step = (s2 - s1) / 3;
  [0, 1, 2].forEach(k => fx(s1 + k * step, 'pop', 0.8, 1 + k * 0.2)); fx(s2, 'sparkle', 0.5);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ffcf9e', '#ff9e7a', 4);
    const panels = [['TE DESPIERTAS', drawWake], ['DESAYUNAS', drawBreakfast], ['ESCUELA / TRABAJO', drawWalk]];
    panels.forEach(([name, fn], k) => {
      const st = s1 + k * step, s = ease.back(L(t, st, st + 0.5)); if (s <= 0) return;
      const x = 330 + k * 630;
      ctx.save(); ctx.translate(x, 520); ctx.scale(s, s); ctx.rotate((k - 1) * 0.03 + Math.sin(t * 1.5 + k) * 0.01);
      card(ctx, -280, -330, 560, 640, '#fff', 36);
      ctx.save(); rrect(ctx, -260, -310, 520, 520, 28); ctx.clip(); fn(ctx, t, k); ctx.restore();
      text(ctx, name, 0, 262, { size: 50, fill: FLAT.coral, shadow: false, lw: 0 });
      ctx.restore();
    });
    if (t > s2) popIn(ctx, t, s2, W / 2, 110, () => text(ctx, '¡NADA RARO!', 0, 0, { size: 100, fill: '#fff' }));
  }, { trans: 'cut', counter: t => counterLabel(8 * L(t, PS(0, 5), PE(0, 5))) });
}

// ---------- 5. Adenosina: la barra de cansancio ----------
{
  const a = PS(0, 6);
  fx(a + 0.5, 'pop', 0.8); fx(SS(0, 6, 2), 'blip', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#2b2d7a', '#16163f', 5);
    const fill = 0.15 + 0.55 * L(t, a, PE(0, 6));
    brain(ctx, 720, 520, 1.35, t, { sleepy: fill * 0.7 });
    // moléculas de adenosina que entran al cerebro
    const n = Math.floor(lt * 2.2);
    for (let i = 0; i < Math.min(n, 40); i++) {
      const r = rng(i + 1), born = i / 2.2, age = lt - born;
      const sx = r() < 0.5 ? -100 : W + 100, sy = r() * H;
      const tx = 720 + (r() - 0.5) * 420, ty = 520 + (r() - 0.5) * 300;
      const k = ease.out(clamp(age / 1.6));
      molecule(ctx, lerp(sx, tx, k) + Math.sin(t * 3 + i) * 8, lerp(sy, ty, k) + Math.cos(t * 2 + i) * 8, 34, 'adenosina', t + i, { rot: Math.sin(t + i) * 0.3 });
      if (age > 0 && age < 0.05) {} // (sonido en lista)
    }
    meterBar(ctx, 1420, 260, 180, 600, fill, 'CANSANCIO', FLAT.purple, t);
    popIn(ctx, t, a + 0.5, 720, 870, () => card(ctx, -230, -55, 460, 110, FLAT.purple, 55) || text(ctx, 'ADENOSINA', 0, 0, { size: 60, fill: '#fff', lw: 0, shadow: false }));
  }, { counter: t => counterLabel(8 + 5 * L(t, PS(0, 6), PE(0, 6))) });
  for (let i = 0; i < 18; i++) fx(a + i / 2.2 + 1.3, 'blip', 0.18, 0.8 + (i % 4) * 0.1);
}

// ---------- 6. El café engaña al cerebro ----------
{
  const a = PS(0, 7), plug = SS(0, 7, 1), still = SS(0, 7, 2), hide = SS(0, 7, 3), end = PE(0, 7);
  fx(a + 0.3, 'boing', 0.6, 1.3); [0, 1, 2, 3, 4].forEach(i => fx(plug + 0.6 + i * 0.35, 'pop', 0.7, 0.9 + i * 0.1)); fx(plug + 3, 'boing', 0.5, 0.8); fx(hide, 'whoosh', 0.5, 1.5);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#3b2a6b', '#1a1238', 6);
    // membrana con receptores
    ctx.fillStyle = '#ff8fab'; ctx.fillRect(0, 820, 1300, 260);
    ctx.fillStyle = 'rgba(255,255,255,0.15)'; for (let x = 0; x < 1300; x += 60) { ctx.beginPath(); ctx.arc(x + ((t * 20) % 60), 830, 22, 0, Math.PI * 2); ctx.fill(); }
    const rx = [180, 410, 640, 870, 1100];
    rx.forEach((x, i) => {
      const land = plug + 0.6 + i * 0.35, k = ease.out(L(t, land - 0.6, land));
      receptor(ctx, x, 830, 120, t > land);
      if (t > plug) molecule(ctx, x, lerp(-100, 760, k), 42, 'cafeina', t, { rot: (1 - k) * 4 });
      // adenosina que intenta entrar y rebota
      const tryT = plug + 2.5 + i * 0.2, bp = L(t, tryT, tryT + 1.2);
      if (bp > 0) { const yy = 600 - Math.sin(bp * Math.PI) * 200 + bp * 50, xx = x + bp * (i % 2 ? 160 : -160); molecule(ctx, xx, yy, 34, 'adenosina', t, { sad: true, rot: bp * 3 }); }
    });
    if (t < plug + 0.6) drawCoffee(ctx, 640, 300 + Math.sin(t * 3) * 10, t, 2.4);
    // barra de cansancio que sigue subiendo (y luego se oculta)
    meterBar(ctx, 1500, 200, 180, 600, 0.7 + 0.2 * L(t, still, end), 'CANSANCIO', FLAT.purple, t);
    const hp = ease.out(L(t, hide, hide + 0.5));
    if (hp > 0) { ctx.fillStyle = '#2b2d42'; rrect(ctx, 1480, 180, 220, 640 * hp, 24); ctx.fill(); if (hp > 0.9) text(ctx, '???', 1590, 500, { size: 90, fill: '#fff' }); }
    if (t > a + 0.3 && t < plug) popIn(ctx, t, a + 0.3, 640, 640, () => text(ctx, '¡ENGAÑA A TU CEREBRO!', 0, 0, { size: 84, fill: FLAT.accent }));
  }, { counter: t => counterLabel(13 + 2 * L(t, PS(0, 7), PE(0, 7))) });
}

// ---------- 7. 16 horas: "hoy no le vas a hacer caso" ----------
{
  const a = PS(0, 8), but = SS(0, 8, 1), no = SS(0, 8, 2);
  fx(a + 0.4, 'yawn', 0.5); fx(no, 'boing', 0.7, 1.1); fx(no + 0.1, 'sparkle', 0.5);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ff9e7a', '#7a3f8f', 7); rays(ctx, t, 760, 600, 'rgba(255,255,255,0.06)');
    const yk = Math.sin(clamp(L(t, a + 0.3, a + 1.8)) * Math.PI);
    const e = blinkE(t, { red: 0.2, bags: 0.3, mouth: yk > 0.05 ? 'yawn' : 'flat', mouthOpen: yk, open: yk > 0.05 ? 1 - yk * 0.9 : undefined });
    if (yk > 0.05) e.handL = [-55, -560];
    if (t > but && t < no) { e.look = [Math.sin(t * 14), 0]; e.mouth = 'flat'; }
    if (t > no) Object.assign(e, { mouth: 'grin', hold: 'coffee', handR: [110, -300], eyeSize: 1.1, angry: 0.6 });
    leo(ctx, 760, 1000, 1.2, e);
    meterBar(ctx, 1300, 230, 200, 620, 0.92 + Math.sin(t * 6) * 0.02, '¡CASI LLENA!', FLAT.purple, t);
    if (t > no) popIn(ctx, t, no, 760, 180, () => text(ctx, '¡HOY NO!', 0, 0, { size: 130, fill: FLAT.accent }));
  }, { counter: t => counterLabel(16) });
}

// ---------- 8. ¡24 horas! ----------
{
  const a = PS(0, 9); fx(a + 0.15, 'ding', 0.7, 1.5); fx(a + 0.2, 'boing', 0.9); fx(a + 0.2, 'impact', 0.5);
  shot(a, (ctx, lt, d, t) => {
    const k = Math.sin(clamp(L(t, a + 0.15, a + 1.4)) * Math.PI);
    const e = blinkE(t, { hold: 'coffee', handR: BED.coffee, red: 0.55, bags: 0.6, mouth: 'wobbly' });
    if (k > 0.02) Object.assign(e, { shock: k, eyeSize: 1 + 0.35 * k, pupil: 0.6, mouth: 'o', mouthOpen: 0.8, open: 1, handL: [lerp(-95, -62, k), lerp(-185, -425, k)] });
    room(ctx, t, { hour: 0.2, cups: [a - 5, a - 4], cam: { zoom: 1.25 + 0.08 * k, fx: 1150, fy: 660, shake: 14 * k } }, e);
    exclaim(ctx, 1180, 300, t, a + 0.2, '¡!');
    popIn(ctx, t, a + 0.15, W / 2, 140, () => text(ctx, '¡24 HORAS!', 0, 0, { size: 130, fill: FLAT.accent }));
  }, { trans: 'flash', counter: () => 'HORA 24', bump: [a + 0.15] });
}

// ---------- 9. Sin dormir = como haber bebido ----------
{
  const a = PS(0, 10), left = SS(0, 10, 1), right = SS(0, 10, 2), eq = SS(0, 10, 3);
  fx(left, 'pop', 0.8); fx(right, 'pop', 0.8, 1.2); fx(eq, 'ding', 0.6); fx(eq + 0.1, 'boing', 0.5, 1.4);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#2d2a6e', '#1c1a4a', 8);
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(W / 2 - 4, 0, 8, H);
    if (t < left) { popIn(ctx, t, a + 0.2, W / 2, H / 2, () => { text(ctx, 'UN DATO', 0, -60, { size: 140, fill: FLAT.accent }); text(ctx, 'SORPRENDENTE', 0, 80, { size: 110, fill: '#fff' }); }); questionMarks(ctx, t, W / 2, 800); return; }
    const sway = t > eq ? Math.sin(t * 2.5) * 0.08 : 0;
    const sL = ease.back(L(t, left, left + 0.6)), sR = ease.back(L(t, right, right + 0.6));
    if (sL > 0) { ctx.save(); ctx.translate(480, 0); ctx.scale(sL, 1); ctx.translate(-480, 0); leo(ctx, 480, 960, 1.1, blinkE(t, { red: 0.5, bags: 0.6, mouth: 'wobbly', rot: sway, eyeSize: 1.05 })); ctx.restore(); label(ctx, 'SIN DORMIR', 480, 240, { size: 76, fill: FLAT.sky }); }
    if (sR > 0) { ctx.save(); ctx.translate(1440, 0); ctx.scale(sR, 1); ctx.translate(-1440, 0); drawPerson(ctx, 1440, 960, 1.1, blinkE(t, { hold: 'wine', handR: [110, -300], mouth: 'grin', blush: true, rot: -sway }), PEOPLE.adulto); ctx.restore(); label(ctx, 'CON ALCOHOL', 1440, 240, { size: 76, fill: FLAT.coral }); }
    if (t > eq) {
      popIn(ctx, t, eq, W / 2, 520, () => { ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.arc(0, 0, 90, 0, Math.PI * 2); ctx.fill(); text(ctx, '=', 0, 6, { size: 150, fill: FLAT.ink, lw: 0, shadow: false }); });
      subtitleBar(ctx, t, eq + 0.4, '17-18 h despierto ≈ un par de copas');
    }
  }, { counter: () => 'HORA 18' });
}

// ---------- 10. 24 h ≈ 0.1 % de alcohol en sangre ----------
{
  const a = PS(0, 11), legal = SS(0, 11, 1);
  fx(a + 0.4, 'ff', 0.3, 1.2, { dur: 1.5 }); fx(a + 1.9, 'ding', 0.6); fx(legal, 'impact', 0.6); fx(legal + 0.05, 'boing', 0.6, 0.8);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#4a1d5e', '#1c1238', 9);
    const v = 0.85 * ease.out(L(t, a + 0.4, a + 1.9));
    for (let i = 0; i < 16; i++) { const r = rng(i + 7), p = (t * (0.25 + r() * 0.3) + r()) % 1; ctx.globalAlpha = Math.sin(p * Math.PI) * 0.6; ctx.fillStyle = '#ff8fab'; ctx.beginPath(); ctx.arc(250 + r() * 900 + Math.sin(t * 2 + i) * 30, 1000 - p * 900, 10 + r() * 22, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1;
    gauge(ctx, 700, 640, 300, v + (v > 0.8 ? Math.sin(t * 9) * 0.015 : 0), 'ALCOHOL EN SANGRE', FLAT.coral, { value: (0.1 * v / 0.85).toFixed(2) + ' %', mark: 0.55, markLabel: 'límite' });
    if (t > legal) {
      popIn(ctx, t, legal, 1430, 520, () => {
        drawCar(ctx, 0, 0, 0.75, t, FLAT.sky, 0.2);
        ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 34; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(0, -20, 250, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-175, -195); ctx.lineTo(175, 155); ctx.stroke();
      });
      label(ctx, 'NO PODRÍAS MANEJAR', 1430, 830, { size: 64, fill: '#fff' });
    }
    popIn(ctx, t, a + 0.2, 700, 170, () => text(ctx, '24 HORAS SIN DORMIR', 0, 0, { size: 84, fill: FLAT.accent }));
  }, { counter: () => 'HORA 24' });
}

// ---------- 11. Cortisol, frío, irritabilidad, amígdala +60 % ----------
{
  const a = PS(0, 12), cort = SS(0, 12, 1), cold = SS(0, 12, 2), irr = SS(0, 12, 3), amy = SS(0, 12, 4), boom = SS(0, 12, 5), end = PE(0, 12);
  fx(cort, 'ff', 0.3, 1.5, { dur: 0.8 }); fx(cort + 0.8, 'impact', 0.4); fx(cold, 'whoosh', 0.5, 0.6); fx(amy + 1, 'ding', 0.6, 0.8); fx(boom + 0.3, 'impact', 0.8); fx(boom + 0.35, 'boing', 0.9, 0.6);
  shot(a, (ctx, lt, d, t) => {
    const phase = t < cold ? 0 : t < irr ? 1 : t < boom ? 2 : 3;
    const bgc = [['#5e2a84', '#24123f'], ['#2a6f97', '#0b2545'], ['#3a2f8f', '#1c1a4a'], ['#d62828', '#6a040f']][phase];
    bgFlat(ctx, t, bgc[0], bgc[1], 10 + phase);
    if (phase === 0) {
      leo(ctx, 640, 1000, 1.15, blinkE(t, { red: 0.5, bags: 0.6, mouth: 'flat', eyeSize: 1.05 }));
      gauge(ctx, 1320, 620, 260, 0.2 + 0.7 * ease.out(L(t, cort, cort + 0.8)), 'CORTISOL', FLAT.coral, { value: 'ESTRÉS' });
      if (t > cort + 0.8) for (let i = 0; i < 3; i++) bolt(ctx, 640 + (i - 1) * 160, 300 - i % 2 * 40, t + i);
    } else if (phase === 1) {
      const sh = Math.sin(t * 50) * 6;
      leo(ctx, 760 + sh, 1000, 1.15, blinkE(t, { red: 0.5, bags: 0.6, mouth: 'wobbly', handL: [60, -260], handR: [-60, -250] }));
      thermometer(ctx, 1350, 700, 0.75 - 0.4 * ease.out(L(t, cold, cold + 1.2)), t);
      floaters(ctx, t, { n: 70, color: 'rgba(255,255,255,0.9)', speed: -60, size: 6, seed: 4 });
      popIn(ctx, t, cold + 0.3, 1350, 260, () => text(ctx, '¡FRÍO!', 0, 0, { size: 110, fill: '#bde0fe' }));
    } else if (phase === 2) {
      brain(ctx, 760, 520, 1.25, t, { worried: true });
      const glow = 0.6 + 0.4 * Math.sin(t * 8);
      ctx.fillStyle = `rgba(239,35,60,${glow})`; ctx.beginPath(); ctx.ellipse(800, 600, 50, 34, 0.4, 0, Math.PI * 2); ctx.fill();
      for (let k = 0; k < 3; k++) { const p = (t * 1.1 + k / 3) % 1; ctx.strokeStyle = `rgba(239,35,60,${1 - p})`; ctx.lineWidth = 10 * (1 - p) + 2; ctx.beginPath(); ctx.ellipse(800, 600, 50 + p * 300, 34 + p * 200, 0.4, 0, Math.PI * 2); ctx.stroke(); }
      if (t > amy) for (let k = 0; k < 4; k++) { const ang = t * 1.6 + k * 1.57; bolt(ctx, 760 + Math.cos(ang) * 420, 520 + Math.sin(ang) * 300, t + k); }
      if (t > amy) { label(ctx, 'AMÍGDALA', 800, 750, { size: 56, fill: '#ff8fab' }); bigStat(ctx, t, amy + 1, 1450, 520, 60, { prefix: '+', suffix: '%', size: 230, color: FLAT.coral, label: 'MÁS REACTIVA' }); }
      else popIn(ctx, t, irr, 1400, 500, () => text(ctx, 'IRRITABLE', 0, 0, { size: 120, fill: FLAT.coral }));
    } else {
      // explota por algo pequeñito (una gotita de café)
      const k = L(t, boom + 0.3, boom + 0.6);
      leo(ctx, 760 + Math.sin(t * 40) * 6 * k, 1000, 1.15, blinkE(t, { red: 0.7, angry: 1, mouth: t > boom + 0.3 ? 'angry' : 'flat', eyeSize: 1.1, handL: t > boom + 0.3 ? [-130, -520] : null, handR: t > boom + 0.3 ? [130, -520] : null, open: 1 }));
      ctx.fillStyle = '#6f4518'; ctx.beginPath(); ctx.ellipse(1250, 830, 26, 10, 0, 0, Math.PI * 2); ctx.fill();
      label(ctx, '(una gotita de café)', 1250, 880, { size: 40, fill: '#ffd6a5' });
      if (k > 0) { for (let i = 0; i < 4; i++) { const p = (t * 1.5 + i / 4) % 1; ctx.globalAlpha = 1 - p; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(700 + (i % 2 ? 140 : -20) + Math.sin(p * 6) * 20, 380 - p * 200, 30 + p * 40, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1; }
      popIn(ctx, t, boom + 0.3, 1300, 300, () => text(ctx, '¡EL FIN DEL MUNDO!', 0, 0, { size: 96, fill: FLAT.accent }));
    }
  }, { counter: () => 'HORA 30' });
}

// ---------- PARTE 2 ----------
// 12. 36 horas, algo inquietante
{
  const a = PS(1, 0) - 0.4; fx(a + 0.5, 'ding', 0.5, 0.7);
  shot(a, (ctx, lt, d, t) => {
    const e = blinkE(t, { hold: 'coffee', handR: BED.coffee, red: 0.65, bags: 0.7, mouth: 'flat', look: [0, 0], eyeSize: 1.05 });
    room(ctx, t, { hour: 12 + 0.2, cups: [a - 3, a - 2], dark: 0.35 + 0.15 * L(t, a, a + 4), cam: { zoom: 1.3 + 0.1 * L(t, a, a + 4), fx: 1150, fy: 640 } }, e);
    popIn(ctx, t, PS(1, 0) + 1.6, W / 2, 800, () => text(ctx, 'algo inquietante...', 0, 0, { size: 80, fill: '#c9b8ff' }));
  }, { counter: () => 'HORA 36', bump: [PS(1, 0)], mood: 'tense' });
}
// 13. Partes del cerebro se apagan
{
  const a = PS(1, 1), off = SS(1, 1, 2), name = SS(1, 1, 3);
  fx(off, 'impact', 0.3, 1.5); fx(off + 0.6, 'impact', 0.3, 1.3); fx(off + 1.2, 'impact', 0.3, 1.1); fx(name, 'ding', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#1d1b4a', '#0c0b24', 13);
    brain(ctx, 960, 520, 1.5, t, { sleepy: t > off ? 0.3 : 0 });
    const spots = [[-180, -60], [-60, -170], [90, -150], [200, -20], [100, 80], [-120, 70], [0, -40]];
    spots.forEach(([x, y], i) => {
      const flick = t > off && Math.sin(t * 2.5 + i * 1.7) > 0.2; const on = !flick;
      const X = 960 + x * 1.5, Y = 520 + y * 1.5;
      if (on) { const g = ctx.createRadialGradient(X, Y, 5, X, Y, 90); g.addColorStop(0, 'rgba(255,230,120,0.9)'); g.addColorStop(1, 'rgba(255,230,120,0)'); ctx.fillStyle = g; ctx.fillRect(X - 90, Y - 90, 180, 180); }
      ctx.fillStyle = on ? '#ffe066' : '#495057'; ctx.beginPath(); ctx.arc(X, Y, 26, 0, Math.PI * 2); ctx.fill();
    });
    if (t > a + 1) popIn(ctx, t, a + 1, W / 2, 110, () => text(ctx, 'SIN PEDIRTE PERMISO', 0, 0, { size: 80, fill: '#fff' }));
    if (t > name) subtitleBar(ctx, t, name, 'MICROSUEÑO', FLAT.accent);
  }, { counter: () => 'HORA 36', mood: 'tense' });
}
// 14. Leyendo... ¡y no recuerdas el párrafo!
{
  const a = PS(1, 2), unaware = SS(1, 2, 1), read = SS(1, 2, 2), forgot = SS(1, 2, 3);
  fx(a + 0.4, 'pop', 0.6); fx(a + 1.2, 'pop', 0.6, 1.3); fx(read + 1.0, 'whoosh', 0.4, 0.5); fx(forgot + 0.2, 'boing', 0.7, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#2d3a6e', '#141c3a', 14, false);
    lamp(ctx, 1450, 420, t);
    const black = t > read + 1.0 && t < read + 1.6;
    const e = blinkE(t, { hold: 'book', handR: [70, -290], holdL: null, handL: [-70, -290], red: 0.6, bags: 0.7, look: [0, 0.6], mouth: 'flat' });
    if (t > forgot) Object.assign(e, { look: [0, 0], mouth: 'o', mouthOpen: 0.3, eyeSize: 1.15, holdL: null, handL: [-40 + Math.sin(t * 14) * 18, -540], rot: Math.sin(t * 3) * 0.03 });
    leo(ctx, 900, 1060, 1.15, e);
    desk(ctx, 900, 820, 900);
    if (t < unaware) { popIn(ctx, t, a + 0.4, 420, 300, () => stopwatch(ctx, t, '0,5 s')); popIn(ctx, t, a + 1.2, 1450, 260, () => stopwatch(ctx, t, '3 s')); }
    if (t > forgot) questionMarks(ctx, t, 900, 230, 3, FLAT.accent);
    if (black) { ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); text(ctx, '. . .', W / 2, H / 2, { size: 80, fill: '#555', shadow: false, lw: 0 }); }
    if (t > unaware && t < read) popIn(ctx, t, unaware, W / 2, 120, () => text(ctx, 'NI TE DAS CUENTA', 0, 0, { size: 90, fill: FLAT.accent }));
  }, { counter: () => 'HORA 38', mood: 'tense' });
}
// 15. Manejando: 4 s a 100 km/h = más de 100 m
{
  const a = PS(1, 3), num = SS(1, 3, 1), nobody = SS(1, 3, 2), acc = SS(1, 3, 3);
  fx(a, 'ff', 0.25, 0.6, { dur: 3 }); fx(num + 1.2, 'yawn', 0.4, 1.4); fx(nobody, 'impact', 0.5); fx(nobody + 0.5, 'boing', 0.6, 0.7); fx(acc, 'ding', 0.5, 0.8);
  shot(a, (ctx, lt, d, t) => {
    road(ctx, t, 1400, 820, 0.8);
    const drift = t > nobody ? Math.sin((t - nobody) * 2) * 40 : 0;
    // coche y conductor visible a través de las ventanas
    drawCar(ctx, 820, 690 + drift * 0.2, 1, t, FLAT.coral, 1);
    const sleep = L(t, num + 1.2, num + 1.6) * (1 - L(t, acc - 0.6, acc));
    ctx.save(); ctx.translate(820, 690 + drift * 0.2 + Math.sin(t * 20) * 2);
    ctx.beginPath(); ctx.moveTo(-120, -45); ctx.quadraticCurveTo(-95, -130, -10, -130); ctx.lineTo(-10, -45); ctx.closePath(); ctx.rect(10, -130, 155, 85); ctx.clip();
    leo(ctx, 70, 160, 0.55, blinkE(t, { red: 0.7, bags: 0.8, open: 1 - sleep, mouth: sleep > 0.5 ? 'o' : 'flat', mouthOpen: 0.2, noShadow: true, look: [1, 0] }));
    ctx.fillStyle = 'rgba(189,224,254,0.25)'; ctx.fillRect(-130, -140, 320, 100);
    ctx.restore();
    // velocímetro y distancia recorrida "dormido"
    card(ctx, 70, 80, 470, 230, 'rgba(0,0,0,0.45)', 30, false);
    text(ctx, '100 km/h', 305, 150, { size: 70, fill: '#fff' });
    const m = 111 * L(t, num + 1.6, num + 5.6);
    text(ctx, `${m.toFixed(0)} m`, 305, 250, { size: 80, fill: m > 0 ? FLAT.coral : '#fff' });
    if (sleep > 0) { ctx.fillStyle = `rgba(0,0,0,${0.55 * sleep})`; ctx.fillRect(0, 0, W, H * 0.5 * sleep); ctx.fillRect(0, H - H * 0.5 * sleep, W, H * 0.5 * sleep); }
    if (t > nobody && t < acc) popIn(ctx, t, nobody, W / 2, 440, () => text(ctx, '¡SIN NADIE AL VOLANTE!', 0, 0, { size: 100, fill: FLAT.accent }));
    if (t > acc) popIn(ctx, t, acc, W / 2, 420, () => { ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.moveTo(0, -170); ctx.lineTo(190, 150); ctx.lineTo(-190, 150); ctx.closePath(); ctx.fill(); text(ctx, '!', 0, 40, { size: 230, fill: FLAT.ink, lw: 0, shadow: false }); });
  }, { counter: () => 'HORA 40', mood: 'tense' });
}
// 16. La memoria falla: estudiar toda la noche
{
  const a = PS(1, 4), study = SS(1, 4, 2), leak = SS(1, 4, 3);
  fx(study, 'pop', 0.6); fx(leak, 'boing', 0.5, 0.7);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#1d2b64', '#0e1430', 16);
    lamp(ctx, 1500, 420, t);
    leo(ctx, 900, 1060, 1.15, blinkE(t, { hold: 'book', handR: [70, -290], handL: [-70, -290], red: 0.6, bags: 0.7, look: [0, 0.5], mouth: t > leak ? 'sad' : 'flat' }));
    desk(ctx, 900, 820, 1000);
    for (let i = 0; i < 5; i++) { ctx.fillStyle = [FLAT.coral, FLAT.mint, FLAT.accent, FLAT.purple, FLAT.sky][i]; rrect(ctx, 1150, 790 - i * 40, 200, 36, 6); ctx.fill(); }
    // letras que entran a la cabeza... y se escapan
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 16; i++) {
      const p = (t * 0.5 + i / 16) % 1, ch = letters[(i * 7) % 26];
      let x, y; if (p < 0.5) { const k = p / 0.5; x = lerp(990, 900, k); y = lerp(700, 420, k); } else { const k = (p - 0.5) / 0.5; const lost = t > leak; x = 900 + (lost ? lerp(0, (i % 2 ? 500 : -500), k) : 0); y = 420 + (lost ? k * 500 : 0); }
      if (p > 0.5 && t < leak) continue;
      ctx.globalAlpha = p < 0.5 ? 1 : 1 - (p - 0.5) * 2; text(ctx, ch, x, y, { size: 60, fill: FLAT.accent }); ctx.globalAlpha = 1;
    }
    if (t > a + 0.5) popIn(ctx, t, a + 0.5, W / 2, 110, () => text(ctx, 'MEMORIA', 0, 0, { size: 110, fill: '#fff' }));
    if (t > leak) { popIn(ctx, t, leak + 0.3, 1500, 330, () => { ctx.rotate(Math.sin(t * 5) * 0.06); card(ctx, -230, -75, 460, 150, '#ef233c', 40); text(ctx, '¡SE OLVIDA!', 0, 0, { size: 72, fill: '#fff', lw: 0, shadow: false }); }); questionMarks(ctx, t, 900, 300, 3, '#fff'); }
  }, { counter: () => 'HORA 44' });
}
// 17. ¡Dos días!
{
  const a = PS(1, 5) - 0.1; fx(a + 0.2, 'ding', 0.7, 1.3); fx(a + 0.25, 'boing', 0.9, 0.9); fx(a + 0.25, 'impact', 0.5);
  shot(a, (ctx, lt, d, t) => {
    const k = Math.sin(clamp(L(t, a + 0.2, a + 1.6)) * Math.PI);
    const e = blinkE(t, { hold: 'coffee', handR: BED.coffee, red: 0.8, bags: 0.8, frazzle: 0.5, mouth: 'wobbly', eyeSize: 1.1 });
    if (k > 0.02) Object.assign(e, { shock: k, eyeSize: 1.1 + 0.35 * k, pupil: 0.5, mouth: 'o', mouthOpen: 1, open: 1, handL: [lerp(-95, -62, k), lerp(-185, -425, k)] });
    room(ctx, t, { hour: 0.3, cups: [a - 5, a - 4, a - 3], cam: { zoom: 1.28 + 0.08 * k, fx: 1150, fy: 660, shake: 16 * k } }, e);
    burst(ctx, W / 2, 500, t, a + 0.2, FLAT.accent, 14, 300);
    popIn(ctx, t, a + 0.2, W / 2, 140, () => text(ctx, '¡DOS DÍAS!', 0, 0, { size: 140, fill: FLAT.accent }));
  }, { trans: 'flash', counter: () => 'DÍA 2', bump: [a + 0.2] });
}
// 18. Hambre: grelina sube, leptina baja
{
  const a = PS(1, 6), s2 = SS(1, 6, 2), gre = SS(1, 6, 3), lep = SS(1, 6, 4), junk = SS(1, 6, 5), w = SS(1, 6, 6);
  fx(a + 0.3, 'dizzy', 0.4, 0.5); fx(s2 + 0.3, 'boing', 0.5, 0.8); fx(gre + 1, 'ff', 0.3, 1.4, { dur: 0.8 }); fx(lep + 0.8, 'ff', 0.3, 0.6, { dur: 0.8 });
  for (let i = 0; i < 8; i++) fx(junk + i * 0.35, 'pop', 0.4, 0.8 + (i % 4) * 0.15);
  for (let tt = a + 0.6; tt < junk - 0.3; tt += 0.8) fx(tt, 'pop', 0.3, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ff9f1c', '#e85d04', 18);
    if (t > junk) { const kinds = ['burger', 'fries', 'donut', 'candy', 'pizza']; for (let i = 0; i < 14; i++) { const r = rng(i + 9), st = junk + i * 0.25; if (t < st) continue; const p = (t - st) * 0.45 % 1.4; foodIcon(ctx, kinds[i % 5], 100 + r() * 1700, -120 + p * 900, 0.9, Math.sin(t * 2 + i)); } }
    const chew = t > junk;
    const e = blinkE(t, { red: 0.6, bags: 0.7, mouth: chew ? 'chew' : 'o', mouthOpen: 0.3, hold: chew ? 'burger' : null, handR: chew ? [60, -390] : null, eyeSize: 1.1 });
    leo(ctx, 600, 1000, 1.15, e);
    if (t < junk) { // panza que ruge
      for (let i = 0; i < 3; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(600, 760, 90 + i * 30 + Math.sin(t * 10) * 6, -0.5, 0.5); ctx.stroke(); }
      if (t > s2) { foodIcon(ctx, 'salad', 1000, 860, 1.1, 0); ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(920, 780); ctx.lineTo(1080, 920); ctx.moveTo(1080, 780); ctx.lineTo(920, 920); ctx.stroke(); }
    }
    if (t > a + 0.6 && t < junk) {
      const cyc = Math.max(0, Math.floor((t - a - 0.6) / 0.8)), kinds = ['burger', 'pizza', 'donut', 'fries', 'candy'];
      popIn(ctx, t, a + 0.6, 960, 360, () => { ctx.fillStyle = '#fff'; for (const [x, y, r] of [[-120, 170, 18], [-80, 120, 28]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); } ctx.beginPath(); ctx.ellipse(0, 0, 170, 120, 0, 0, Math.PI * 2); ctx.fill();
        const sp = pop(t, a + 0.6 + cyc * 0.8, 0.4); foodIcon(ctx, kinds[cyc % 5], 0, 10, 1.1 * sp, Math.sin(t * 4) * 0.15); });
    }
    if (t > gre) gauge(ctx, 1300, 420, 190, 0.2 + 0.75 * ease.out(L(t, gre + 1, gre + 1.8)), 'GRELINA', '#ef233c', { value: '¡HAMBRE!' }); if (t > gre + 1.8) ctx.translate(Math.sin(t * 40) * 2, 0);
    if (t > lep) gauge(ctx, 1580, 800, 160, 0.8 - 0.65 * ease.out(L(t, lep + 0.8, lep + 1.6)), 'LEPTINA', FLAT.mint, { value: 'LLENO' });
    if (t > w) subtitleBar(ctx, t, w, 'más antojos = subir de peso');
    if (t < gre) popIn(ctx, t, a + 0.2, 1300, 300, () => text(ctx, '¡HAMBRE!', 0, 0, { size: 150, fill: '#fff' }));
  }, { counter: () => 'DÍA 2' });
}
// 19. Defensas: 4 veces más resfriados
{
  const a = PS(1, 7), exp = SS(1, 7, 1), res = SS(1, 7, 2);
  fx(a + 0.5, 'dizzy', 0.4); fx(exp + 0.5, 'pop', 0.5); fx(res + 0.6, 'ding', 0.6); fx(res + 0.65, 'boing', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#6a994e', '#1b4332', 19);
    if (t < res) {
      for (let i = 0; i < 4; i++) defender(ctx, 260 + i * 240, 700, 70, t + i, 1);
      for (let i = 0; i < 6; i++) virus(ctx, 1100 + (i % 3) * 230 + Math.sin(t + i) * 30 - L(t, a, res) * 300, 330 + Math.floor(i / 3) * 280 + Math.cos(t * 1.3 + i) * 30, 55, t + i);
      popIn(ctx, t, a + 0.4, 600, 200, () => text(ctx, 'DEFENSAS DORMIDAS', 0, 0, { size: 84, fill: '#fff' }));
      if (t > exp) popIn(ctx, t, exp + 0.5, 1400, 850, () => card(ctx, -330, -60, 660, 120, FLAT.ink, 60) || text(ctx, 'virus del resfriado', 0, 0, { size: 52, fill: '#80ed99', lw: 0, shadow: false }));
    } else {
      const h1 = 120, h2 = 480, k = ease.out(L(t, res + 0.3, res + 1.3));
      card(ctx, 360, 790 - h1 * k, 300, h1 * k, FLAT.mint, 20, false); card(ctx, 1260, 790 - h2 * k, 300, h2 * k, FLAT.coral, 20, false);
      label(ctx, '7+ horas', 510, 850, { size: 60 }); label(ctx, 'menos de 6 h', 1410, 850, { size: 60 });
      if (k > 0.9) { bigStat(ctx, t, res + 1.3, 1410, 190, '×4', { size: 180, color: FLAT.accent }); }
      for (let i = 0; i < 4; i++) virus(ctx, 1300 + i * 70, 750 - h2 * k + 40 + (i % 2) * 70, 24, t + i);
      virus(ctx, 510, 790 - h1 * k + 50, 24, t);
      if (k > 0.9) for (let j = 0; j < 2; j++) { const p = (t * 0.8 + j * 0.5) % 1; ctx.globalAlpha = 1 - p; text(ctx, '¡ACHÚ!', 1680 + p * 100, 520 - p * 160 + j * 160, { size: 64, fill: '#80ed99' }); virus(ctx, 1600 + p * 300, 560 + j * 120 - p * 60, 18, t + j, '#80ed99'); ctx.globalAlpha = 1; }
    }
  }, { counter: () => 'DÍA 2' });
}
// 20. Vista borrosa y luz molesta
{
  const a = PS(1, 8), blur = SS(1, 8, 1), light = SS(1, 8, 2);
  fx(light, 'sparkle', 0.5, 1.5); fx(light + 0.1, 'whoosh', 0.4, 2);
  shot(a, (ctx, lt, d, t) => {
    const b = 14 * L(t, blur, blur + 1.2);
    ctx.save(); if (b > 0.5) ctx.filter = `blur(${b.toFixed(1)}px)`;
    bgFlat(ctx, t, '#ffd6a5', '#f4a261', 20);
    for (let i = 0; i < 6; i++) { ctx.fillStyle = [FLAT.coral, FLAT.mint, FLAT.sky][i % 3]; ctx.beginPath(); ctx.arc(200 + i * 300, 300 + (i % 2) * 400, 80, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    const squint = t > light ? 0.25 : 0.7 - 0.3 * L(t, blur, blur + 1);
    leo(ctx, 960, 1600, 2.3, blinkE(t, { red: 0.8, bags: 0.8, open: squint, mouth: t > light ? 'sad' : 'flat', handR: t > light ? [40, -560] : null, noShadow: true }));
    if (t > light) { const g = ctx.createRadialGradient(1500, 150, 20, 1500, 150, 1200); g.addColorStop(0, 'rgba(255,255,230,0.95)'); g.addColorStop(1, 'rgba(255,255,230,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
    if (t > blur) popIn(ctx, t, blur, W / 2, 110, () => text(ctx, 'TODO BORROSO', 0, 0, { size: 100, fill: '#fff' }));
  }, { counter: () => 'DÍA 2' });
}

// ---------- PARTE 3 ----------
// 21. ¿Por qué pasa todo esto?
{
  const a = PS(2, 0) - 0.4; fx(a + 0.6, 'dizzy', 0.4, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#4361ee', '#3a0ca3', 21); rays(ctx, t, 960, 600);
    leo(ctx, 960, 1000, 1.2, blinkE(t, { handR: [40, -380], mouth: 'flat', look: [0.6, -0.8], red: 0.3 }));
    questionMarks(ctx, t, 960, 260, 3, FLAT.accent);
    popIn(ctx, t, a + 0.8, 960, 120, () => text(ctx, '¿POR QUÉ?', 0, 0, { size: 120, fill: '#fff' }));
  }, { mood: 'happy' });
}
// 22. ¡Tu cerebro se limpia!
{
  const a = PS(2, 1), sleep = SS(2, 1, 1), clean = SS(2, 1, 2);
  fx(clean, 'sparkle', 0.8); fx(clean + 0.05, 'ding', 0.6, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#1d2b64', '#0b1026', 22);
    const night = t > sleep; ctx.fillStyle = '#fff6d6'; if (night) { ctx.beginPath(); ctx.arc(1600, 200, 70, 0, Math.PI * 2); ctx.fill(); }
    brain(ctx, 960, 540, 1.6, t, { sleepy: night && t < clean ? 1 : 0, happy: t > clean });
    if (night && t < clean) zzz(ctx, t, 1250, 330);
    if (t > clean) { for (let i = 0; i < 12; i++) { const a2 = t * 1.2 + i * 0.52, r = 360 + Math.sin(t * 3 + i) * 40; text(ctx, '✦', 960 + Math.cos(a2) * r, 540 + Math.sin(a2) * r * 0.7, { size: 50, fill: FLAT.accent, shadow: false }); } subtitleBar(ctx, t, clean, '¡TU CEREBRO SE LIMPIA!'); }
  });
}
// 23. Líquido que arrastra desechos (estudios con ratones)
{
  const a = PS(2, 2), crew = SS(2, 2, 1);
  fx(crew, 'boing', 0.6, 1.4); fx(crew + 0.3, 'ff', 0.25, 1.3, { dur: 1.5 });
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#3c1642', '#1a0b24', 23, false);
    const spread = 1 + 0.25 * L(t, a + 2, a + 6);
    for (let i = 0; i < 6; i++) neuron(ctx, 960 + (i % 3 - 1) * 520 * spread, 330 + Math.floor(i / 3) * 420 * spread - 60, 0.9, t + i, [FLAT.accent, FLAT.pink, FLAT.mint][i % 3], i + 2);
    // flujo de líquido azul que arrastra basura café
    for (let i = 0; i < 70; i++) {
      const r = rng(i + 40), y = 80 + r() * 920, sp = 160 + r() * 200, x = ((r() * W + t * sp) % (W + 100)) - 50;
      const debris = i % 4 === 0 && t > a + 2;
      ctx.fillStyle = debris ? '#8d6e63' : 'rgba(76,201,240,0.75)'; ctx.beginPath(); ctx.arc(x, y + Math.sin(t * 3 + i) * 10, debris ? 12 : 8, 0, Math.PI * 2); ctx.fill();
    }
    popIn(ctx, t, a + 0.3, 330, 120, () => { card(ctx, -260, -60, 520, 120, '#fff', 60); rat(ctx, -170, 30, 0.35, t); text(ctx, 'en ratones', 60, 0, { size: 56, fill: FLAT.ink, lw: 0, shadow: false }); });
    if (t > crew) { const x = lerp(-400, W + 400, L(t, crew, crew + 3.2)); cleanTruck(ctx, x, 900, t); popIn(ctx, t, crew, W / 2, 110, () => text(ctx, 'LIMPIEZA NOCTURNA', 0, 0, { size: 96, fill: FLAT.sky })); }
  });
}
// 24. Beta amiloide
{
  const a = PS(2, 3), study = SS(2, 3, 1);
  fx(a + 0.6, 'pop', 0.6); fx(study + 1.5, 'ff', 0.3, 1.2, { dur: 1 }); fx(study + 2.5, 'ding', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#2b2d42', '#14152a', 24);
    if (t < study) {
      for (let i = 0; i < 26; i++) { const r = rng(i + 3), ang = r() * 6.28 + t * 0.2, rad = 120 + r() * 260 * (1 - 0.4 * L(t, a, study)); ctx.fillStyle = '#c08552'; ctx.beginPath(); ctx.arc(960 + Math.cos(ang) * rad, 540 + Math.sin(ang) * rad * 0.7, 18 + r() * 12, 0, Math.PI * 2); ctx.fill(); }
      popIn(ctx, t, a + 0.6, 960, 540, () => { card(ctx, -300, -80, 600, 160, '#c08552', 80); text(ctx, 'β-AMILOIDE', 0, 0, { size: 90, fill: '#fff', lw: 0, shadow: false }); });
      label(ctx, 'relacionada con el Alzheimer', 960, 830, { size: 60, fill: '#ffd6a5' });
    } else {
      const k = ease.out(L(t, study + 1.5, study + 2.5));
      card(ctx, 420, 780 - 300, 280, 300, FLAT.mint, 20, false); card(ctx, 1220, 780 - 300 - 160 * k, 280, 300 + 160 * k, FLAT.coral, 20, false);
      label(ctx, 'durmiendo', 560, 840, { size: 56 }); label(ctx, '1 noche sin dormir', 1360, 840, { size: 56 });
      zzz(ctx, t, 600, 420, '#b9a8ff');
      for (let i = 0; i < 10; i++) { const r = rng(i + 70), ang = t * (0.5 + r()) + i; ctx.fillStyle = '#c08552'; ctx.beginPath(); ctx.arc(1360 + Math.cos(ang) * (150 + r() * 80), 600 - 160 * k + Math.sin(ang) * 120, 10 + r() * 8, 0, Math.PI * 2); ctx.fill(); }
      if (k > 0.5) { const top = 480 - 160 * k - 30 + Math.sin(t * 6) * 12; ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.moveTo(1360, top - 90); ctx.lineTo(1430, top); ctx.lineTo(1290, top); ctx.fill(); }
      label(ctx, 'β-amiloide en el cerebro', 960, 120, { size: 72, fill: '#fff' });
    }
  });
}
// 25. Cerebro lleno de basura
{
  const a = PS(2, 4); fx(SS(2, 4, 1) + 0.3, 'boing', 0.6, 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#5f0f40', '#2a0a1f', 25);
    brain(ctx, 960, 560, 1.4, t, { worried: true, sleepy: 0.3 });
    for (let i = 0; i < 6; i++) { const x = 760 + i * 80, y = 400 + (i % 2) * 220 + Math.sin(t * 2 + i) * 6; ctx.fillStyle = '#343a40'; ctx.beginPath(); ctx.ellipse(x, y, 42, 50, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#495057'; ctx.fillRect(x - 12, y - 62, 24, 18); }
    for (let i = 0; i < 5; i++) { const a2 = t * 4 + i * 1.3; ctx.fillStyle = '#111'; ctx.beginPath(); ctx.arc(960 + Math.cos(a2) * 330, 420 + Math.sin(a2 * 1.4) * 140, 8, 0, Math.PI * 2); ctx.fill(); }
    popIn(ctx, t, SS(2, 4, 1), W / 2, 110, () => text(ctx, '¡LLENO DE BASURA!', 0, 0, { size: 100, fill: FLAT.accent }));
  });
}
// 26. "Y ahora sí... lo que pasa después del tercer día"
{
  const a = PS(2, 5) - 0.2; fx(SS(2, 5, 1), 'impact', 0.7); fx(SS(2, 5, 1) + 0.05, 'dizzy', 0.5, 0.7);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#10002b', '#000', 26);
    const s = SS(2, 5, 1);
    if (t > s) { ctx.save(); ctx.translate(W / 2 + (Math.sin(t * 70) > 0.8 ? 14 : 0), H / 2); ctx.scale(pop(t, s), pop(t, s)); text(ctx, 'DÍA 3', 0, 0, { size: 300, fill: FLAT.coral }); ctx.restore(); }
    else popIn(ctx, t, a + 0.3, W / 2, H / 2, () => text(ctx, 'Y AHORA SÍ...', 0, 0, { size: 120, fill: '#fff' }));
  }, { counter: () => 'DÍA 3', mood: 'tense' });
}
// 27. Randy Gardner, 1964 (retro)
{
  const a = PS(2, 6) - 0.9, fair = SS(2, 6, 1), friends = SS(2, 6, 2);
  fx(a + 0.5, 'sparkle', 0.5); fx(fair + 0.8, 'pop', 0.7); fx(friends, 'boing', 0.5, 1.3);
  shot(a, (ctx, lt, d, t) => {
    retroRoom(ctx, t);
    drawPerson(ctx, 960, 1000, 1.2, blinkE(t, { talk: 0, mouth: 'grin' }), PEOPLE.randy);
    popIn(ctx, t, a + 1.0, 960, 120, () => { card(ctx, -460, -70, 920, 140, '#fff3d6', 30); text(ctx, 'RANDY GARDNER · 17 AÑOS', 0, 0, { size: 64, fill: '#6f4518', lw: 0, shadow: false }); });
    if (t > fair) popIn(ctx, t, fair + 0.8, 1520, 330, () => { card(ctx, -230, -110, 460, 220, '#e63946', 20); text(ctx, 'FERIA DE', 0, -40, { size: 56, fill: '#fff', lw: 0, shadow: false }); text(ctx, 'CIENCIAS', 0, 40, { size: 70, fill: FLAT.accent, lw: 0, shadow: false }); });
    if (t > friends) {
      drawPerson(ctx, 380, 1010, 1.05, blinkE(t + 1, { look: [1, 0], hold: 'phone', handR: [100, -330], mouth: 'flat' }), PEOPLE.amigo1);
      drawPerson(ctx, 1540, 1010, 1.05, blinkE(t + 2, { look: [-1, 0], mouth: 'smile', talk: talking(t) }), PEOPLE.amigo2);
      popIn(ctx, t, friends + 0.3, 960, 300, () => text(ctx, '¡NO TE DUERMAS!', 0, 0, { size: 70, fill: FLAT.accent }));
    }
    retroOverlay(ctx, t);
  }, { trans: 'wipe', mood: 'mystery', counter: () => 'DÍA 1' });
}
// 28. Día 2 y 3: vista, mal humor, hablar
{
  const a = PS(2, 7), d3 = SS(2, 7, 1);
  fx(a + 0.2, 'pop', 0.6); fx(d3, 'pop', 0.7, 1.2); fx(d3 + 0.5, 'dizzy', 0.4);
  shot(a, (ctx, lt, d, t) => {
    retroRoom(ctx, t);
    const day3 = t > d3;
    const e = blinkE(t, { red: day3 ? 0.6 : 0.4, bags: day3 ? 0.7 : 0.4, mouth: day3 ? 'angry' : 'flat', angry: day3 ? 1 : 0, open: day3 ? 0.8 : 0.6, look: day3 ? [0, 0] : [Math.sin(t * 3), 0] });
    ctx.save(); if (!day3) ctx.filter = 'blur(3px)'; drawPerson(ctx, 960, 1000, 1.2, e, PEOPLE.randy); ctx.restore();
    if (day3) speech(ctx, t, d3 + 0.4, 1350, 320, 'grrr... ¿qé dij... dije?');
    calendar(ctx, 300, 330, 0.7, 'DÍA', day3 ? '3' : '2', '#bc6c25');
    retroOverlay(ctx, t);
  }, { mood: 'mystery', counter: t => t > SS(2, 7, 1) ? 'DÍA 3' : 'DÍA 2' });
}
// 29. Día 4: alucinaciones
{
  const a = PS(2, 8), see = SS(2, 8, 1), sign = SS(2, 8, 2), star = SS(2, 8, 3);
  fx(see, 'dizzy', 0.5); fx(sign + 0.6, 'boing', 0.7, 1.3); fx(star, 'sparkle', 0.7); fx(star + 0.1, 'boing', 0.6, 0.9);
  shot(a, (ctx, lt, d, t) => {
    // calle de los 60
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#f6bd60'); g.addColorStop(1, '#f28482'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    for (let i = 0; i < 7; i++) { const x = ((i * 300 - t * 20) % 2100 + 2100) % 2100 - 150; ctx.fillStyle = ['#84a59d', '#f5cac3', '#ffcb77'][i % 3]; ctx.fillRect(x, 300 + (i % 3) * 40, 260, 600); ctx.fillStyle = 'rgba(255,255,255,0.5)'; for (let k = 0; k < 3; k++) ctx.fillRect(x + 30 + k * 75, 380 + (i % 3) * 40, 50, 70); }
    ctx.fillStyle = '#6d6875'; ctx.fillRect(0, 900, W, 180);
    const morph = ease.inOut(L(t, sign + 0.3, sign + 1.2));
    streetSign(ctx, 1400, 920, 1.2, morph, t);
    const e = blinkE(t, { red: 0.7, bags: 0.8, eyeSize: 1.2, spiral: t > see && t < sign, mouth: t > sign ? 'o' : 'wobbly', look: [1, -0.3], frazzle: 0.4 });
    if (t > star) Object.assign(e, { helmet: true, mouth: 'grin', look: [0, 0], spiral: false, handL: [-130, -520], handR: [130, -520] });
    drawPerson(ctx, 640, 1000, 1.2, e, PEOPLE.randy);
    if (t > see && t < sign) for (let i = 0; i < 6; i++) { const ang = t * 1.5 + i; ctx.save(); ctx.globalAlpha = 0.6; ctx.translate(960 + Math.cos(ang) * 600, 480 + Math.sin(ang * 1.3) * 300); ctx.rotate(t * 2 + i); ctx.fillStyle = [FLAT.purple, FLAT.mint, FLAT.coral][i % 3]; ctx.fillRect(-40, -40, 80, 80); ctx.restore(); }
    if (t > sign && t < star) popIn(ctx, t, sign + 0.6, 1400, 380, () => text(ctx, '¿hola?', 0, 0, { size: 80, fill: '#fff' }));
    if (t > star) { stars(ctx, t, 640, 380); popIn(ctx, t, star, 1150, 230, () => text(ctx, '¡SOY ESTRELLA DEL FÚTBOL!', 0, 0, { size: 76, fill: '#fff' })); }
    calendar(ctx, 250, 260, 0.6, 'DÍA', '4', '#bc6c25');
    retroOverlay(ctx, t);
  }, { mood: 'mystery', counter: () => 'DÍA 4' });
}
// 30. Olvida lo que dice; no puede restar
{
  const a = PS(2, 9), math = SS(2, 9, 1);
  fx(math, 'pop', 0.6); fx(math + 1, 'boing', 0.5, 0.7);
  shot(a, (ctx, lt, d, t) => {
    retroRoom(ctx, t);
    drawPerson(ctx, 700, 1000, 1.2, blinkE(t, { red: 0.8, bags: 0.9, mouth: t < math ? 'smile' : 'o', talk: t < math ? talking(t) : 0, mouthOpen: 0.3, look: [0.5, -0.4], frazzle: 0.5 }), PEOPLE.randy);
    if (t < math) { // frase que se desvanece a la mitad
      const words = ['Y', 'entonces', 'yo', 'iba', 'a...', '...']; const n = Math.floor(L(t, a + 0.4, a + 3.5) * words.length);
      speech(ctx, t, a + 0.3, 1300, 320, words.slice(0, Math.max(1, n)).map((w, i) => i > 3 ? '' : w).join(' ') + (n > 4 ? ' ¿qué decía?' : ''));
    } else {
      popIn(ctx, t, math, 1380, 480, () => { card(ctx, -330, -180, 660, 360, '#2d6a4f', 20); text(ctx, '100 − 7 =', 0, -40, { size: 100, fill: '#fff', lw: 0, shadow: false }); text(ctx, '¿ ? ?', 0, 90, { size: 100, fill: FLAT.accent, lw: 0, shadow: false }); });
    }
    retroOverlay(ctx, t);
  }, { mood: 'mystery', counter: () => 'DÍA 8' });
}
// 31. 264 horas = 11 días
{
  const a = PS(2, 10), eleven = SS(2, 10, 1);
  fx(a + 0.3, 'ff', 0.3, 1.2, { dur: 1 }); fx(a + 1.3, 'ding', 0.7); fx(eleven, 'impact', 0.6); fx(eleven + 0.05, 'boing', 0.8);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#bc6c25', '#6f4518', 31); rays(ctx, t, W / 2, H / 2, 'rgba(255,255,255,0.08)');
    bigStat(ctx, t, a + 0.3, W / 2, 420, 264, { size: 300, color: FLAT.accent, label: 'HORAS', count: 1 });
    if (t > eleven) popIn(ctx, t, eleven, W / 2, 800, () => { card(ctx, -380, -80, 760, 160, FLAT.coral, 80); text(ctx, '¡11 DÍAS!', 0, 0, { size: 110, fill: '#fff', lw: 0, shadow: false }); });
    retroOverlay(ctx, t);
  }, { mood: 'mystery', counter: () => 'DÍA 11', bump: [SS(2, 10, 1)] });
}
// 32. Durmió 14 horas
{
  const a = PS(2, 11), slept = SS(2, 11, 1), deep = SS(2, 11, 2);
  fx(slept, 'yawn', 0.5); for (let tt = slept + 0.5; tt < PS(2, 12) - 0.3; tt += 1 / 0.7) fx(tt + 0.5 / 0.7, 'blip', 0.25, 0.9); fx(slept + 1, 'ff', 0.3, 0.8, { dur: 1.8 }); fx(deep + 0.5, 'pop', 0.6); fx(deep + 1, 'pop', 0.6, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#1d3557', '#0b1a2e', 32);
    if (t < slept) { questionMarks(ctx, t, W / 2, 500, 3, FLAT.accent); popIn(ctx, t, a + 0.2, W / 2, 200, () => text(ctx, '¿Y DESPUÉS?', 0, 0, { size: 120, fill: '#fff' })); retroOverlay(ctx, t); return; }
    // Randy dormido en la cama
    ctx.fillStyle = '#8b5e3c'; rrect(ctx, 400, 560, 900, 320, 40); ctx.fill(); ctx.fillStyle = '#fff3e0'; rrect(ctx, 440, 600, 220, 110, 40); ctx.fill();
    drawPerson(ctx, 560, 980, 0.8, E(t, { open: 0, mouth: 'smile', noShadow: true }), PEOPLE.randy);
    ctx.fillStyle = '#e63946'; rrect(ctx, 380, 720, 940, 320, 40); ctx.fill();
    zzz(ctx, t, 640, 480, '#fff');
    popIn(ctx, t, slept + 0.5, 980, 300, () => {
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(0, 0, 230, 140, 0, 0, Math.PI * 2); ctx.fill(); for (const [x, y, r] of [[-200, 160, 16], [-240, 210, 10]]) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#8d6e63'; ctx.fillRect(-20, 30, 12, 60); ctx.fillRect(20, 30, 12, 60); ctx.fillRect(-40, 50, 100, 10);
      const p = (t * 0.7) % 1, sx = lerp(-170, 170, p), sy = 40 - Math.sin(p * Math.PI) * 110;
      ctx.fillStyle = '#f1f3f5'; for (const [dx, dy] of [[-18, 0], [0, -12], [18, 0], [0, 8]]) { ctx.beginPath(); ctx.arc(sx + dx, sy + dy, 22, 0, Math.PI * 2); ctx.fill(); }
      ctx.fillStyle = '#495057'; ctx.beginPath(); ctx.arc(sx + 34, sy - 6, 13, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(sx - 18, sy + 18, 6, 18); ctx.fillRect(sx + 12, sy + 18, 6, 18);
      text(ctx, String(1 + Math.floor(t * 0.7) % 99), 150, -90, { size: 44, fill: '#8d6e63', lw: 0, shadow: false });
    });
    const hrs = 14 * ease.inOut(L(t, slept + 1, slept + 2.8));
    roomClockMini(ctx, 1550, 320, t, hrs);
    text(ctx, `${hrs.toFixed(0)} HORAS`, 1550, 520, { size: 80, fill: FLAT.accent });
    if (t > deep) { [['PROFUNDO', 0.95, FLAT.purple], ['LIGERO', 0.35, FLAT.sky]].forEach(([n, v, c], i) => { const k = ease.out(L(t, deep + 0.5 + i * 0.5, deep + 1.2 + i * 0.5)); card(ctx, 1380, 640 + i * 150, 420 * v * k, 100, c, 20, false); text(ctx, n, 1390 + 10, 690 + i * 150, { size: 46, fill: '#fff', align: 'left' }); }); }
    retroOverlay(ctx, t);
  }, { mood: 'happy' });
}
// 33. Tuvo suerte; el libro de récords lo prohíbe
{
  const a = PS(2, 12), insom = SS(2, 12, 1), book = SS(2, 12, 2), danger = SS(2, 12, 3);
  fx(insom, 'pop', 0.5, 0.8); fx(book, 'whoosh', 0.5); fx(danger, 'impact', 0.9); fx(danger + 0.05, 'boing', 0.6, 0.7);
  shot(a, (ctx, lt, d, t) => {
    if (t < book) {
      retroRoom(ctx, t);
      drawPerson(ctx, 960, 1000, 1.2, blinkE(t, { mouth: t > insom ? 'sad' : 'grin', red: t > insom ? 0.4 : 0, bags: t > insom ? 0.6 : 0 }), PEOPLE.randy);
      if (t < insom) popIn(ctx, t, a + 0.3, 1450, 300, () => text(ctx, '¡SUERTE!', 0, 0, { size: 110, fill: FLAT.accent }));
      else popIn(ctx, t, insom, 1450, 300, () => { text(ctx, 'AÑOS DESPUÉS:', 0, -60, { size: 60, fill: '#fff' }); text(ctx, 'INSOMNIO', 0, 40, { size: 100, fill: FLAT.coral }); });
      retroOverlay(ctx, t);
    } else {
      bgFlat(ctx, t, '#2d2a6e', '#1c1a4a', 33); rays(ctx, t, W / 2, H / 2);
      recordBook(ctx, W / 2, 540, 1.2, t, danger);
      popIn(ctx, t, book + 0.2, W / 2, 110, () => text(ctx, 'HOY', 0, 0, { size: 90, fill: '#fff' }));
    }
  }, { mood: 'mystery' });
}

// ---------- PARTE 4 ----------
// 34. ¿Se puede morir?
{
  const a = PS(3, 0) - 0.4; fx(a + 1.2, 'impact', 0.7); fx(a + 1.25, 'dizzy', 0.4, 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#2b0f2e', '#0a0410', 34);
    leo(ctx, 600, 1000, 1.15, blinkE(t, { mouth: 'o', mouthOpen: 0.4, eyeSize: 1.15, shock: 0.5, red: 0.3 }));
    popIn(ctx, t, a + 1.2, 1300, 480, () => { text(ctx, '¿SE PUEDE', 0, -90, { size: 120, fill: '#fff' }); text(ctx, 'MORIR?', 0, 70, { size: 190, fill: FLAT.coral }); });
  }, { mood: 'tense' });
}
// 35. Ratas de laboratorio
{
  const a = PS(3, 1), rats = SS(3, 1, 1), weeks = SS(3, 1, 2), died = SS(3, 1, 3), temp = SS(3, 1, 4), weight = SS(3, 1, 5);
  fx(rats, 'pop', 0.6); fx(weeks, 'ff', 0.3, 1, { dur: 1.2 }); fx(died, 'impact', 0.4, 0.6); fx(weight, 'boing', 0.5, 0.7);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#2a3d45', '#13202a', 35, false);
    // laboratorio
    for (let i = 0; i < 3; i++) { ctx.fillStyle = '#3d5a6c'; ctx.fillRect(0, 240 + i * 180, W, 18); for (let k = 0; k < 8; k++) { const x = 100 + k * 240 + i * 60; ctx.fillStyle = ['#80ed99', '#ffd166', '#4cc9f0'][(k + i) % 3]; ctx.globalAlpha = 0.7; ctx.beginPath(); ctx.moveTo(x, 240 + i * 180); ctx.lineTo(x + 30, 170 + i * 180); ctx.lineTo(x + 60, 240 + i * 180); ctx.fill(); ctx.globalAlpha = 1; } }
    if (t < rats) {
      iconPerson(ctx, W / 2, 620, 4, '#adb5bd');
      ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(760, 300); ctx.lineTo(1160, 800); ctx.moveTo(1160, 300); ctx.lineTo(760, 800); ctx.stroke();
      return;
    }
    const lightsOff = L(t, died, died + 1.2) * (1 - L(t, temp, temp + 0.5));
    // rueda y rata
    ctx.save(); ctx.translate(700, 700); ctx.strokeStyle = '#adb5bd'; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 230, 0, Math.PI * 2); ctx.stroke();
    ctx.rotate(t < died ? t * 4 : died * 4); for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(230, 0); ctx.lineWidth = 5; ctx.stroke(); } ctx.restore();
    rat(ctx, 700, 900, 0.8, t, { run: t < died, sleepy: t > died });
    drawPerson(ctx, 1450, 1010, 1.05, blinkE(t, { hold: 'book', handR: [70, -300], look: [-1, 0.3], mouth: t > died ? 'sad' : 'flat' }), PEOPLE.cientifica);
    if (t > weeks && t < died) calendar(ctx, 1600, 300, 0.6, 'SEMANAS', '2-3', FLAT.coral);
    if (lightsOff > 0) { ctx.fillStyle = `rgba(0,0,0,${0.6 * lightsOff * (0.85 + 0.15 * Math.sin(t * 23))})`; ctx.fillRect(0, 0, W, H); }
    if (t > temp) { ctx.fillStyle = '#adb5bd'; ctx.beginPath(); ctx.ellipse(1000, 980, 90, 26, 0, 0, Math.PI); ctx.fill(); for (let i = 0; i < 9; i++) { const pp = pop(t, temp + i * 0.25, 0.4); if (pp > 0) { ctx.fillStyle = '#e9c46a'; ctx.beginPath(); ctx.arc(950 + (i % 4) * 30, 965 - Math.floor(i / 4) * 22, 14 * pp, 0, Math.PI * 2); ctx.fill(); } }
      thermometer(ctx, 1150, 560, 0.3 + 0.2 * Math.sin(t * 3), t); popIn(ctx, t, weight, 1600, 360, () => { text(ctx, 'COMÍAN MÁS', 0, -50, { size: 60, fill: '#fff' }); text(ctx, 'PESABAN MENOS', 0, 40, { size: 60, fill: FLAT.coral }); }); }
    popIn(ctx, t, rats, 400, 120, () => text(ctx, 'AÑOS 80', 0, 0, { size: 100, fill: FLAT.accent }));
  }, { mood: 'tense' });
}
// 36. Insomnio familiar fatal
{
  const a = PS(3, 2), gen = SS(3, 2, 1), fam = SS(3, 2, 1) + 2, mortal = SS(3, 2, 3);
  fx(a + 0.4, 'pop', 0.6); fx(gen + 0.5, 'sparkle', 0.4, 0.8); fx(mortal, 'impact', 0.5, 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#240046', '#10002b', 36);
    dna(ctx, 300, 560, 760, t);
    popIn(ctx, t, a + 0.4, 1150, 170, () => { card(ctx, -560, -80, 1120, 160, '#fff', 80); text(ctx, 'INSOMNIO FAMILIAR FATAL', 0, 0, { size: 72, fill: '#5a189a', lw: 0, shadow: false }); });
    // árbol familiar de íconos; algunos resaltados
    const k = L(t, gen, gen + 2);
    for (let row = 0; row < 3; row++) for (let i = 0; i < 6; i++) {
      const idx = row * 6 + i; if (idx / 18 > k) continue;
      const hl = [2, 7, 9, 14].includes(idx);
      iconPerson(ctx, 760 + i * 150, 480 + row * 190, 1.2, hl ? FLAT.coral : 'rgba(255,255,255,0.5)');
    }
    if (t > fam) label(ctx, 'solo unas pocas decenas de familias', 1150, 900, { size: 54, fill: '#e0aaff' });
    if (t > mortal) { ctx.fillStyle = `rgba(0,0,0,${0.4 * L(t, mortal, mortal + 1)})`; ctx.fillRect(0, 0, W, H); }
  }, { mood: 'tense' });
}
// 37. Tan necesario como comer o respirar
{
  const a = PS(3, 3), eq = SS(3, 3, 1);
  fx(eq, 'pop', 0.6); fx(eq + 0.6, 'pop', 0.6, 1.2); fx(eq + 1.2, 'pop', 0.6, 1.4); fx(eq + 1.6, 'ding', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#06d6a0', '#118ab2', 37); rays(ctx, t, W / 2, 560);
    if (t < eq) { popIn(ctx, t, a + 0.3, W / 2, 500, () => { text(ctx, 'DORMIR NO ES', 0, -80, { size: 110, fill: '#fff' }); text(ctx, 'UN LUJO', 0, 70, { size: 160, fill: FLAT.accent }); }); return; }
    const items = [['COMER', (c) => foodIcon(c, 'burger', 0, 0, 1.5, 0)], ['RESPIRAR', (c) => lungs(c, 0, 0, 1.6, t)], ['DORMIR', (c) => bedIcon(c, 0, 0, 1.4)]];
    items.forEach(([n, f], i) => popIn(ctx, t, eq + i * 0.6, 400 + i * 560, 500, () => { card(ctx, -210, -230, 420, 460, '#fff', 40); f(ctx); text(ctx, n, 0, 170, { size: 60, fill: FLAT.ink, lw: 0, shadow: false }); }));
    if (t > eq + 1.6) [680, 1240].forEach(x => text(ctx, '=', x, 500, { size: 120, fill: '#fff' }));
  }, { mood: 'happy' });
}
// 38. "Yo nunca voy a pasar 11 días..." → algo más común
{
  const a = PS(3, 4), quote = SS(3, 4, 1), common = SS(3, 4, 3), danger = SS(3, 4, 4);
  fx(quote, 'pop', 0.5); fx(common, 'whoosh', 0.5); fx(common + 0.5, 'ding', 0.6, 0.9); fx(danger, 'impact', 0.5);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#4361ee', '#3a0ca3', 38);
    const shrug = t > quote && t < common;
    leo(ctx, 640, 1000, 1.2, blinkE(t, { mouth: t > danger ? 'o' : 'smile', talk: shrug ? talking(t) : 0, handL: shrug ? [-150, -330] : null, handR: shrug ? [150, -330] : null, shock: t > danger ? 0.5 : 0, rot: shrug ? Math.sin(t * 9) * 0.04 : 0, look: shrug ? [Math.sin(t * 9), 0] : [0, 0] }));
    if (shrug) for (let i = 0; i < 3; i++) { const p = (t * 1.2 + i / 3) % 1; ctx.globalAlpha = 1 - p; text(ctx, 'ja', 760 + p * 120 + i * 30, 380 - p * 150, { size: 50 + i * 8, fill: '#fff' }); ctx.globalAlpha = 1; }
    if (shrug) popIn(ctx, t, quote, 1300, 380, () => { card(ctx, -380, -140, 760, 280, '#fff', 60); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-250, 130); ctx.lineTo(-320, 220); ctx.lineTo(-180, 130); ctx.fill(); text(ctx, '¿11 días? ¡Nunca!', 0, 0, { size: 72, fill: FLAT.ink, lw: 0, shadow: false }); });
    if (t > common) popIn(ctx, t, common + 0.5, 1350, 500, () => { alarmClock(ctx, 0, 0, 1.6, t); text(ctx, '6 HORAS', 0, 260, { size: 110, fill: FLAT.accent }); });
  });
}
// 39. 6 h por noche durante 2 semanas
{
  const a = PS(3, 5); fx(a + 0.5, 'ff', 0.3, 1, { dur: 3 }); fx(a + 3.6, 'ding', 0.6); fx(a + 4.5, 'boing', 0.6, 0.8);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#3d348b', '#1c1a4a', 39);
    const day = Math.min(14, 1 + Math.floor(13 * L(t, a + 0.5, a + 3.5))), k = day / 14;
    calendar(ctx, 380, 470, 1, 'DÍA', String(day), FLAT.coral, t < a + 3.5 ? (t * 4.3) % 1 : 0);
    const yk = Math.max(0, Math.sin(t * 1.4)) ** 3;
    leo(ctx, 960, 1000, 1.15, blinkE(t, { red: k * 0.5, bags: k * 0.8, mouth: yk > 0.2 ? 'yawn' : 'flat', mouthOpen: yk, open: 1 - k * 0.3 - yk * 0.5, rot: Math.sin(t * 2) * 0.03 * k }));
    zzz(ctx, t, 1060, 480, '#b9a8ff');
    popIn(ctx, t, a + 0.3, 960, 120, () => text(ctx, 'SOLO 6 HORAS POR NOCHE', 0, 0, { size: 84, fill: '#fff' }));
    if (t > a + 3.6) popIn(ctx, t, a + 3.6, 1500, 520, () => { card(ctx, -300, -200, 600, 400, FLAT.coral, 40); text(ctx, '=', 0, -110, { size: 100, fill: '#fff', lw: 0, shadow: false }); text(ctx, '1-2 NOCHES', 0, 0, { size: 80, fill: '#fff', lw: 0, shadow: false }); text(ctx, 'SIN DORMIR', 0, 100, { size: 80, fill: FLAT.accent, lw: 0, shadow: false }); });
  });
}
// 40. No lo notaban: sensación vs rendimiento
{
  const a = PS(3, 6), chart = SS(3, 6, 1);
  fx(chart + 0.3, 'ff', 0.25, 0.7, { dur: 2.5 }); fx(SS(3, 6, 3), 'boing', 0.5, 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#2b2d42', '#14152a', 40);
    if (t < chart) { popIn(ctx, t, a + 0.3, W / 2, H / 2, () => { text(ctx, 'NO LO', 0, -80, { size: 140, fill: '#fff' }); text(ctx, 'NOTABAN', 0, 80, { size: 180, fill: FLAT.coral }); }); return; }
    lineChart(ctx, 260, 180, 1400, 760, t, chart + 0.3, 5.5, [
      { f: u => 0.75 - 0.08 * u, color: FLAT.mint, name: 'cómo se sentían' },
      { f: u => 0.8 - 0.62 * u * u * (3 - 2 * u), color: FLAT.coral, name: 'cómo rendían' },
    ]);
    text(ctx, '14 días →', 1550, 140, { size: 50, fill: '#fff' });
    const gp = ease.back(L(t, chart + 5.8, chart + 6.4));
    if (gp > 0) { const x = 260 + 60 + 0.85 * 1280, y1 = 180 + 760 - 50 - (0.75 - 0.068) * 640, y2 = 180 + 760 - 50 - (0.8 - 0.62 * 0.85 * 0.85 * (3 - 1.7)) * 640;
      ctx.strokeStyle = FLAT.accent; ctx.lineWidth = 10; ctx.setLineDash([18, 12]); ctx.lineDashOffset = -t * 40; ctx.beginPath(); ctx.moveTo(x, y1 + 20); ctx.lineTo(x, y2 - 20); ctx.stroke(); ctx.setLineDash([]);
      popIn(ctx, t, chart + 5.8, x - 330, (y1 + y2) / 2, () => { ctx.rotate(Math.sin(t * 4) * 0.04); card(ctx, -240, -60, 480, 120, FLAT.accent, 60); text(ctx, '¡NO LO NOTAN!', 0, 0, { size: 60, fill: FLAT.ink, lw: 0, shadow: false }); }); }
  });
}
// 41. Recomendaciones: 7+ h adultos, 8-10 h adolescentes
{
  const a = PS(3, 7), maint = SS(3, 7, 1);
  fx(a + 0.4, 'pop', 0.6); fx(a + 1.6, 'pop', 0.6, 1.2); fx(maint, 'sparkle', 0.6); fx(maint + 0.6, 'ding', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#06d6a0', '#028090', 41); rays(ctx, t, W / 2, 500);
    if (t < maint) {
      popIn(ctx, t, a + 0.4, 560, 520, () => { card(ctx, -320, -300, 640, 600, '#fff', 40); drawPerson(ctx, 0, 150, 0.6, E(t, { talk: talking(t) }), PEOPLE.adulto); ctx.save(); ctx.translate(230, -230); ctx.scale(0.45, 0.45); roomClockMini(ctx, 0, 0, t, t * 3); ctx.restore(); text(ctx, 'ADULTOS', 0, 200, { size: 60, fill: FLAT.ink, lw: 0, shadow: false }); text(ctx, '7+ HORAS', 0, 260, { size: 70, fill: '#ef476f', lw: 0, shadow: false }); });
      popIn(ctx, t, a + 1.6, 1360, 520, () => { card(ctx, -320, -300, 640, 600, '#fff', 40); drawPerson(ctx, 0, 150, 0.55, E(t + 1, { talk: talking(t + 1), handR: [90, -440 + Math.sin(t * 6) * 30] }), PEOPLE.amigo1); ctx.save(); ctx.translate(230, -230); ctx.scale(0.45, 0.45); roomClockMini(ctx, 0, 0, t, t * 3 + 4); ctx.restore(); text(ctx, 'ADOLESCENTES', 0, 200, { size: 60, fill: FLAT.ink, lw: 0, shadow: false }); text(ctx, '8-10 HORAS', 0, 260, { size: 70, fill: '#118ab2', lw: 0, shadow: false }); });
    } else {
      brain(ctx, 1250, 520, 1.2, t, { happy: true });
      leo(ctx, 600, 1000, 1.15, blinkE(t, { hold: 'wrench', handR: [150, -420], mouth: 'grin' }));
      popIn(ctx, t, maint + 0.6, 1250, 830, () => text(ctx, '¡ES MANTENIMIENTO!', 0, 0, { size: 100, fill: FLAT.accent }));
      for (let i = 0; i < 8; i++) { const a2 = t * 2 + i * 0.8; text(ctx, '✦', 1250 + Math.cos(a2) * 330, 520 + Math.sin(a2) * 250, { size: 40, fill: '#fff', shadow: false }); }
    }
  }, { mood: 'happy' });
}
// 42. Repaso: un capítulo más...
{
  const a = PS(3, 8) - 0.3, r1 = SS(3, 8, 0) + 4.2; const step = (PE(3, 8) - r1) / 3;
  [0, 1, 2].forEach(k => fx(r1 + k * step, 'pop', 0.7, 1 + k * 0.2));
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#1d2b64', '#0b1026', 42);
    leo(ctx, 520, 1100, 1.15, blinkE(t, { red: 0.4, bags: 0.4, look: [0.8, 0.4], mouth: 'smile' }));
    laptop(ctx, 900, 900, 0.9, t);
    popIn(ctx, t, a + 0.5, 900, 520, () => text(ctx, '"un capítulo más..."', 0, 0, { size: 64, fill: '#fff' }));
    const icons = [['= ALCOHOL', c => heldObject2(c, { hold: 'wine', t }, 0, 40)], ['DEFENSAS ↓', c => defender(c, 0, 0, 60, t, 1)], ['CEREBRO SUCIO', c => brain(c, 0, 0, 0.35, t, { worried: true })]];
    icons.forEach(([n, f], k) => popIn(ctx, t, r1 + k * step, 1500, 230 + k * 280, () => { card(ctx, -280, -110, 560, 220, '#fff', 30); ctx.save(); ctx.translate(-170, 0); f(ctx); ctx.restore(); text(ctx, n, 70, 0, { size: 48, fill: FLAT.ink, lw: 0, shadow: false }); }));
  });
}
// 43. Pregunta para comentarios
{
  const a = PS(3, 9); fx(a + 0.4, 'pop', 0.7); for (let i = 0; i < 10; i++) fx(a + 1 + i * 0.18, 'tick', 0.25, 1.3);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ff006e', '#8338ec', 43); rays(ctx, t, W / 2, H / 2);
    leo(ctx, 420, 1000, 1.15, blinkE(t, { handR: [150, -420], mouth: 'grin', talk: talking(t) }));
    popIn(ctx, t, a + 0.4, 1200, 450, () => {
      card(ctx, -560, -200, 1120, 400, '#fff', 40);
      ctx.fillStyle = FLAT.sky; ctx.beginPath(); ctx.arc(-450, -100, 50, 0, Math.PI * 2); ctx.fill();
      const msg = '¿Cuál es tu récord sin dormir?'; const n = Math.floor(L(t, a + 1, a + 2.8) * msg.length);
      ctx.font = '56px Lilita'; ctx.fillStyle = FLAT.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(msg.slice(0, n) + (Math.sin(t * 10) > 0 ? '|' : ''), -370, -100);
      ctx.fillStyle = '#e9ecef'; rrect(ctx, -480, 30, 960, 110, 30); ctx.fill();
      text(ctx, '👍  💬  COMENTA', 0, 85, { size: 52, fill: FLAT.ink, lw: 0, shadow: false });
    });
  });
}
// 44. Próximo video: sin agua
{
  const a = PS(3, 10); fx(SS(3, 10, 1), 'pop', 0.6); fx(SS(3, 10, 2), 'sparkle', 0.7); fx(SS(3, 10, 2) + 0.1, 'boing', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ffb703'); g.addColorStop(1, '#fb8500'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#fff3b0'; ctx.beginPath(); ctx.arc(1550, 220, 120 + Math.sin(t * 2) * 8, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#e9c46a'; ctx.beginPath(); ctx.moveTo(0, 820); for (let x = 0; x <= W; x += 60) ctx.lineTo(x, 800 + Math.sin(x * 0.006 + t * 0.3) * 40); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.fill();
    leo(ctx, 600, 1000, 1.15, blinkE(t, { mouth: 'o', mouthOpen: 0.6, red: 0.3, handL: [-60, -380], look: [0.8, -0.5] }));
    for (let i = 0; i < 3; i++) { ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.beginPath(); ctx.arc(600 + Math.sin(t * 3 + i) * 120, 420 - ((t * 60 + i * 80) % 240), 8, 0, Math.PI * 2); ctx.fill(); }
    waterDrop(ctx, 1300, 520 + Math.sin(t * 2) * 20, 1.4, t);
    for (let i = 0; i < 5; i++) { ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 6; ctx.beginPath(); for (let y = 0; y < 300; y += 10) { const x = 200 + i * 360 + Math.sin(y * 0.05 + t * 5 + i) * 14; y ? ctx.lineTo(x, 760 - y) : ctx.moveTo(x, 760 - y); } ctx.stroke(); }
    { const x = ((t * 260) % (W + 400)) - 200; ctx.save(); ctx.translate(x, 900); ctx.rotate(t * 5); ctx.strokeStyle = '#a0522d'; ctx.lineWidth = 6; for (let k = 0; k < 8; k++) { ctx.beginPath(); ctx.arc(0, 0, 30 + k * 6, k, k + 4); ctx.stroke(); } ctx.restore(); }
    for (let i = 0; i < 2; i++) { const p = (t * 1.3 + i * 0.5) % 1; ctx.fillStyle = '#7fd4ff'; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.arc(660 + i * 40, 520 + p * 120, 12, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1; }
    popIn(ctx, t, SS(3, 10, 2), 1300, 800, () => { card(ctx, -460, -80, 920, 160, '#fff', 80); text(ctx, '¿CUÁNTO SIN AGUA?', 0, 0, { size: 80, fill: '#0077b6', lw: 0, shadow: false }); });
  });
}
// 45. Pantalla final (15 s): Leo por fin duerme
{
  const a = VOICE_END + 0.2; fx(a + 0.6, 'sparkle', 0.5); fx(SCENE.duration - 0.9, 'whoosh', 0.4, 0.7);
  shot(a, (ctx, lt, d, t) => {
    room(ctx, t, { hour: 22.5, dark: 0.25, cam: { zoom: 1.0, fx: 960, fy: 540 } }, E(t, { open: 0, mouth: 'smile', inBed: true }));
    zzz(ctx, t, 1250, 520, '#fff');
    ctx.fillStyle = 'rgba(10,6,30,0.55)'; ctx.fillRect(0, 0, W, H);
    // espacios para las tarjetas de pantalla final de YouTube
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; rrect(ctx, 120, 230, 760, 428, 24); ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 6; ctx.setLineDash([24, 16]); rrect(ctx, 120, 230, 760, 428, 24); ctx.stroke(); ctx.setLineDash([]);
    text(ctx, 'SIGUIENTE VIDEO', 500, 444, { size: 64, fill: '#fff' });
    ctx.fillStyle = 'rgba(255,255,255,0.12)'; ctx.beginPath(); ctx.arc(1500, 330, 150, 0, Math.PI * 2); ctx.fill();
    text(ctx, '¡SUSCRÍBETE!', 1500, 540, { size: 70, fill: FLAT.accent });
    const fade = L(t, SCENE.duration - 1, SCENE.duration - 0.1); if (fade > 0) { ctx.fillStyle = `rgba(0,0,0,${fade})`; ctx.fillRect(0, 0, W, H); }
  }, { quiet: true, mood: 'happy' });
}

// ================= ELEMENTOS AUXILIARES =================
function retroRoom(ctx, t) {
  ctx.fillStyle = '#e9c46a'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#f4a261'; for (let x = -40; x < W + 80; x += 80) ctx.fillRect(x + (t * 6) % 80, 0, 30, 860);
  ctx.fillStyle = '#8d6e63'; ctx.fillRect(0, 860, W, 220);
  // tele antigua
  ctx.fillStyle = '#6d4c41'; rrect(ctx, 1400, 560, 300, 260, 20); ctx.fill(); ctx.fillStyle = '#a5a58d'; rrect(ctx, 1430, 590, 200, 180, 30); ctx.fill();
  ctx.fillStyle = `rgba(255,255,255,${0.2 + 0.2 * Math.sin(t * 20)})`; rrect(ctx, 1430, 590, 200, 180, 30); ctx.fill();
  ctx.strokeStyle = '#495057'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(1550, 560); ctx.lineTo(1490 + Math.sin(t) * 8, 460); ctx.moveTo(1550, 560); ctx.lineTo(1620, 470); ctx.stroke();
  // ventana día/noche que cambia
  const dn = 0.5 + 0.5 * Math.sin(t * 0.8);
  ctx.fillStyle = mix('#1d3557', '#8ecae6', dn); rrect(ctx, 160, 200, 340, 300, 16); ctx.fill();
  ctx.fillStyle = dn > 0.5 ? '#ffd23f' : '#fff6d6'; ctx.beginPath(); ctx.arc(330 + Math.cos(t * 0.8) * 100, 330 - Math.sin(t * 0.8) * 60, 34, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#6d4c41'; ctx.fillRect(160, 345, 340, 10); ctx.fillRect(325, 200, 10, 300);
}
function speech(ctx, t, st, x, y, str) {
  popIn(ctx, t, st, x, y, () => {
    ctx.font = '56px Lilita'; const w = Math.max(300, ctx.measureText(str).width + 80);
    card(ctx, -w / 2, -80, w, 160, '#fff', 50);
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(-w / 2 + 60, 70); ctx.lineTo(-w / 2 + 20, 140); ctx.lineTo(-w / 2 + 130, 70); ctx.fill();
    text(ctx, str, 0, 0, { size: 56, fill: FLAT.ink, lw: 0, shadow: false });
  });
}
function stars(ctx, t, x, y) { for (let i = 0; i < 6; i++) { const a = t * 3 + i * 1.05; text(ctx, '★', x + Math.cos(a) * 160, y + Math.sin(a) * 50, { size: 50, fill: FLAT.accent }); } }
function bolt(ctx, x, y, t) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 8) * 10); ctx.fillStyle = FLAT.accent;
  ctx.beginPath(); ctx.moveTo(10, -60); ctx.lineTo(-30, 10); ctx.lineTo(0, 10); ctx.lineTo(-15, 70); ctx.lineTo(35, -10); ctx.lineTo(5, -10); ctx.closePath(); ctx.fill(); ctx.restore();
}
function stopwatch(ctx, t, str) {
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 110, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-20, -150, 40, 40);
  ctx.strokeStyle = FLAT.coral; ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(0, 0, 85, -Math.PI / 2, -Math.PI / 2 + (t * 3) % (Math.PI * 2)); ctx.stroke();
  text(ctx, str, 0, 0, { size: 52, fill: FLAT.ink, lw: 0, shadow: false });
}
function cleanTruck(ctx, x, y, t) {
  ctx.save(); ctx.translate(x, y);
  ctx.fillStyle = '#4cc9f0'; rrect(ctx, -180, -120, 260, 120, 20); ctx.fill(); ctx.fillStyle = '#fff'; rrect(ctx, 90, -100, 110, 100, 20); ctx.fill();
  ctx.fillStyle = '#bde0fe'; rrect(ctx, 110, -85, 70, 45, 10); ctx.fill();
  ctx.fillStyle = Math.sin(t * 20) > 0 ? '#ef233c' : '#ffd23f'; ctx.beginPath(); ctx.arc(140, -115, 16, 0, Math.PI * 2); ctx.fill();
  for (const wx of [-120, 140]) { ctx.fillStyle = '#2b2d42'; ctx.beginPath(); ctx.arc(wx, 0, 34, 0, Math.PI * 2); ctx.fill(); }
  text(ctx, 'LIMPIEZA', -50, -60, { size: 40, fill: '#fff', lw: 0, shadow: false });
  ctx.restore();
}
function roomClockMini(ctx, x, y, t, hrs) {
  ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 120, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = FLAT.ink; ctx.lineCap = 'round'; ctx.lineWidth = 10; const hA = (hrs / 12) * Math.PI * 2 - Math.PI / 2, mA = (hrs % 1) * Math.PI * 2 - Math.PI / 2;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(hA) * 60, Math.sin(hA) * 60); ctx.stroke(); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(mA) * 95, Math.sin(mA) * 95); ctx.stroke(); ctx.restore();
}
function alarmClock(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x + Math.sin(t * 40) * 4, y); ctx.scale(s, s); ctx.rotate(Math.sin(t * 30) * 0.05);
  for (const sx of [-1, 1]) { ctx.fillStyle = FLAT.accent; ctx.beginPath(); ctx.arc(sx * 60, -90, 30, Math.PI, 0); ctx.fill(); }
  ctx.fillStyle = FLAT.coral; ctx.beginPath(); ctx.arc(0, 0, 110, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 88, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = FLAT.ink; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -60); ctx.moveTo(0, 0); ctx.lineTo(45, 25); ctx.stroke();
  ctx.restore();
}
function drawWake(ctx, t) {
  ctx.fillStyle = '#ffd6a5'; ctx.fillRect(-300, -400, 600, 700);
  ctx.fillStyle = '#ffd23f'; ctx.beginPath(); ctx.arc(150, -200, 60 + Math.sin(t * 2) * 5, 0, Math.PI * 2); ctx.fill();
  leo(ctx, 0, 330, 0.9, E(t, { handL: [-60, -560], handR: [60, -560], mouth: 'yawn', mouthOpen: 0.5 + 0.5 * Math.sin(t * 2), open: 0.2 }));
}
function drawBreakfast(ctx, t) {
  ctx.fillStyle = '#caf0f8'; ctx.fillRect(-300, -400, 600, 700);
  leo(ctx, 0, 380, 0.9, E(t, { mouth: 'chew', handR: [80, -350], look: [0, 0.4] }));
  ctx.fillStyle = '#b08968'; ctx.fillRect(-300, 80, 600, 200);
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(-60, 80, 90, 30, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = '#f4a261'; for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.arc(-110 + i * 20, 72 + Math.sin(t * 3 + i) * 3, 9, 0, Math.PI * 2); ctx.fill(); }
  drawCoffee(ctx, 140, 60, t, 0.7);
}
function drawWalk(ctx, t) {
  ctx.fillStyle = '#90e0ef'; ctx.fillRect(-300, -400, 600, 700);
  for (let i = 0; i < 5; i++) { const x = ((i * 180 - t * 120) % 900 + 900) % 900 - 400; ctx.fillStyle = ['#ffb4a2', '#cdb4db', '#b5e48c'][i % 3]; ctx.fillRect(x, -200 + (i % 2) * 60, 150, 400); }
  ctx.fillStyle = '#6c757d'; ctx.fillRect(-300, 180, 600, 120);
  leo(ctx, 0, 250, 0.8, E(t, { walk: true, mouth: 'smile' }));
}
function titleCard(ctx, lt) {
  ctx.save(); ctx.scale(2, 2); bgPlano(themedCtx(ctx, c => c.map((v, i) => lerp(v, [45, 55, 160][i], 0.5))), lt); ctx.restore();
  const r = rng(21);
  for (let i = 0; i < 18; i++) { const x = r() * W, sp = 40 + r() * 70, ph = r() * H, y = H + 100 - ((lt * sp + ph) % (H + 200)); ctx.save(); ctx.translate(x + Math.sin(lt * 1.5 + i) * 30, y); ctx.rotate(Math.sin(lt * 2 + i) * 0.4); ctx.globalAlpha = 0.55; text(ctx, i % 3 ? 'Z' : '★', 0, 0, { size: 40 + r() * 50, fill: i % 3 ? '#b9a8ff' : '#ffd23f', shadow: false }); ctx.restore(); }
  const lines = [['¿QUÉ LE PASA A TU CUERPO', 112, '#ffffff', 300], ['SI DEJAS DE DORMIR?', 168, '#ffd23f', 470]]; let k = 0;
  lines.forEach(([str, size, fill, y], li) => {
    ctx.font = `${size}px Lilita`; const total = ctx.measureText(str).width; let x = W / 2 - total / 2;
    [...str].forEach(ch => { const w = ctx.measureText(ch).width, st = 0.45 + k * 0.03 + li * 0.2, s = pop(lt, st, 0.6); if (s > 0 && ch !== ' ') { ctx.save(); ctx.translate(x + w / 2, y + Math.sin(lt * 4 - k * 0.45) * 8); ctx.scale(s, s); text(ctx, ch, 0, 0, { size, fill }); ctx.restore(); } x += w; k++; });
  });
  const up = ease.back(prog(lt, 1.9, 2.5));
  if (up > 0) leo(ctx, W / 2, 1228 + 500 * (1 - up), 1.1, E(lt, { red: 1, bags: 1, frazzle: 0.8, eyeSize: 1.15, pupil: 0.7, look: [Math.sin(lt * 3) * 0.4, -0.2], inBed: true, mouth: 'wobbly', hold: 'coffee', handR: [110, -300] }));
}

// ================= MÚSICA Y RENDER =================
SHOTS.sort((x, y) => x.a - y.a);
SHOTS.forEach((s, i) => { s.b = i < SHOTS.length - 1 ? SHOTS[i + 1].a : SCENE.duration; });
// Ambiente musical por toma y nivel de música (más alto en título, pausas y final)
SCENE.moods = []; let lastMood = 'happy';
SHOTS.forEach(s => { const m = s.mood || lastMood; if (m !== lastMood || !SCENE.moods.length) SCENE.moods.push([s.a, m]); lastMood = m; });
SCENE.music = [[0, 0.14], [TITLE_AT - 0.2, 0.14], [TITLE_AT, 0.3], [TITLE_AT + TITLE_LEN - 0.2, 0.3], [TITLE_AT + TITLE_LEN, 0.14], [VOICE_END, 0.14], [VOICE_END + 0.6, 0.3], [SCENE.duration - 1, 0.3], [SCENE.duration, 0]];

// Subtítulos y golpes de cámara a partir de las frases de la narración
const SENTS = [];
TIEMPOS.forEach((p, pt) => p.paragraphs.forEach(par => par.sentences.forEach(s => SENTS.push({ a: G(pt, s.start), b: G(pt, s.end), text: s.text }))));
const CAPS = buildCaptions(SENTS), SENT_STARTS = SENTS.map(s => s.a);

SCENE.render = function (ctx, t) {
  let i = 0; while (i < SHOTS.length - 1 && SHOTS[i + 1].a <= t) i++;
  const sh = SHOTS[i], lt = t - sh.a, d = sh.b - sh.a;
  ctx.save();
  const cam = cameraFor(t, SENT_STARTS);
  ctx.translate(W / 2 + cam.dx, H / 2 + cam.dy); ctx.rotate(cam.rot); ctx.scale(cam.zoom, cam.zoom); ctx.translate(-W / 2, -H / 2);
  if (sh.trans !== 'cut' && sh.trans !== 'wipe') { const z = 1 + 0.05 * (1 - ease.out(prog(lt, 0, 0.35))); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); }
  sh.draw(ctx, lt, d, t);
  ctx.restore();
  if (sh.trans === 'flash' && lt < 0.25) { ctx.fillStyle = `rgba(255,255,255,${0.6 * (1 - lt / 0.25)})`; ctx.fillRect(0, 0, W, H); }
  if (sh.counter) {
    const bumps = (sh.bump || []).concat([sh.a + 0.05]);
    drawCounter(ctx, t, sh.counter(t), COUNTER_FIRST, bumps);
  }
  drawCaptions(ctx, t, CAPS);
  for (const s of SHOTS) if (s.trans === 'wipe' && Math.abs(t - s.a) < 0.6) wipe(ctx, t, s.a - 0.42);
};
