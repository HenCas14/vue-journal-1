// SHORT — ¿Habrá un apagón mundial el 17 de noviembre? (vertical 1080×1920)
THEME.outline = 0;
const V = crearVideo({ voces: ['audio/short-apagon-parte1.mp3'], final: 1.6, inicio: 0.25 });
const SCENE = V.SCENE, SHOTS = V.SHOTS;
const { shot, fx, PS, PE, SS, L } = V; const WD = V.W;
const CX = W / 2;

// 1. ¿Apagón mundial? ¡NO!
{
  const a = 0, no = SS(0, 0, 1), explico = SS(0, 0, 2);
  fx(0.3, 'impact', 0.4, 0.7); fx(no, 'impact', 0.9); fx(no + 0.05, 'boing', 0.9, 0.7); fx(explico, 'pop', 0.6);
  shot(a, (ctx, lt, d, t) => {
    const lights = t < no ? 1 - 0.85 * L(t, 0.4, no) : 1;
    sceneCityNight(ctx, t, { lights });
    if (t < no) {
      popIn(ctx, t, 0.3, CX, 330, () => { text(ctx, '¿APAGÓN', 0, -70, { size: 130, fill: '#fff' }); text(ctx, 'MUNDIAL?', 0, 70, { size: 150, fill: FLAT.accent }); });
      popIn(ctx, t, 1.4, CX, 760, () => calendar(ctx, 0, 0, 1.1, 'NOVIEMBRE', '17', FLAT.coral));
      popIn(ctx, t, 2.6, CX, 1100, () => { card(ctx, -260, -60, 520, 120, '#000', 60); text(ctx, '72 HORAS SIN LUZ', 0, 0, { size: 56, fill: '#fff', lw: 0, shadow: false }); });
    } else {
      ctx.fillStyle = `rgba(255,255,255,${0.7 * (1 - L(t, no, no + 0.3))})`; ctx.fillRect(0, 0, W, H);
      popIn(ctx, t, no, CX, 620, () => { ctx.rotate(-0.12 + Math.sin(t * 5) * 0.02); ctx.strokeStyle = '#ef233c'; ctx.lineWidth = 26; rrect(ctx, -380, -150, 760, 300, 30); ctx.stroke(); text(ctx, 'FALSO', 0, 10, { size: 220, fill: '#ef233c', stroke: '#fff', lw: 18 }); });
      leo(ctx, CX, 1950, 1.25, E(t, { mouth: 'grin', rot: Math.sin(t * 9) * 0.05, handR: t > explico ? [150, -470] : [150, -330], look: [Math.sin(t * 9), 0] }));
      if (t > explico) popIn(ctx, t, explico, CX, 230, () => text(ctx, 'TE EXPLICO 👇', 0, 0, { size: 90, fill: FLAT.accent }));
    }
  }, { quiet: true });
}
// 2. La prueba de alertas en EE. UU.
{
  const a = PS(0, 1) - 0.2, minuto = SS(0, 1, 1), cel = SS(0, 1, 2);
  fx(a + 0.4, 'ding', 0.6, 1.6); for (let i = 0; i < 6; i++) fx(a + 0.9 + i * 0.35, 'tick', 0.35, 2); fx(minuto, 'pop', 0.6); fx(cel, 'pop', 0.6, 0.8); fx(cel + 0.8, 'boing', 0.6, 0.7);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#1d3557', '#0b1a2e', 3); rays(ctx, t, CX, 700, 'rgba(255,255,255,0.05)');
    if (t < cel) {
      popIn(ctx, t, a + 0.2, CX, 200, () => { text(ctx, 'EE. UU.', 0, -60, { size: 110, fill: '#fff' }); text(ctx, 'PRUEBA DE ALERTAS', 0, 60, { size: 76, fill: FLAT.accent }); });
      tvSet(ctx, CX, 640 + Math.sin(t * 2) * 8, 1.4, t, 'alerta');
      leo(ctx, CX, 1960, 1.1, E(t, { mouth: 'flat', look: [0, -1], handL: Math.sin(t * 3) > 0 ? [-60, -500] : null }));
      if (t > minuto) { popIn(ctx, t, minuto, 300, 1090, () => { ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 110, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = FLAT.coral; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 85, -Math.PI / 2, -Math.PI / 2 + (t * 2) % (Math.PI * 2)); ctx.stroke(); text(ctx, '1 MIN', 0, 0, { size: 52, fill: FLAT.ink, lw: 0, shadow: false }); }); popIn(ctx, t, minuto + 0.6, 790, 1110, () => radioIcon(ctx, 0, 0, 0.8, t)); }
    } else {
      bigPhone(ctx, CX, 720, 1.4, t, { muted: true, time: '2:20', rot: Math.sin(t * 2) * 0.03 });
      leo(ctx, CX, 1960, 1.1, E(t, { mouth: 'o', mouthOpen: 0.4, look: [0, -1], handR: [120, -440] }));
      popIn(ctx, t, cel + 0.3, CX, 200, () => { text(ctx, 'TU CELULAR', 0, -60, { size: 100, fill: '#fff' }); text(ctx, 'NI SUENA', 0, 60, { size: 120, fill: FLAT.accent }); });
    }
  });
}
// 3. Los Simpson y la fecha sin año
{
  const a = PS(0, 2), anio = SS(0, 2, 1);
  fx(a + 0.4, 'pop', 0.6); fx(anio, 'boing', 0.7, 1.3); for (let i = 0; i < 3; i++) fx(anio + 0.3 + i * 0.25, 'pop', 0.3, 1.5);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#ffd23f', '#ff9f1c', 4); rays(ctx, t, CX, 650, 'rgba(255,255,255,0.12)');
    tvSet(ctx, CX, 560, 1.3, t, 'caricatura');
    popIn(ctx, t, a + 0.2, CX, 150, () => text(ctx, 'UN CAPÍTULO DE TV', 0, 0, { size: 84, fill: '#fff' }));
    popIn(ctx, t, a + 0.8, 300, 1080, () => calendar(ctx, 0, 0, 0.9, 'NOV', '17', FLAT.coral));
    leo(ctx, CX, 1960, 1.1, E(t, { mouth: t > anio ? 'grin' : 'smile', rot: t > anio ? Math.sin(t * 12) * 0.03 : 0, look: [0.5, -1] }));
    if (t > anio) { for (let i = 0; i < 3; i++) { const p = (t * 1.2 + i / 3) % 1; ctx.globalAlpha = 1 - p; text(ctx, 'ja', 700 + p * 100 + i * 30, 1420 - p * 120, { size: 56, fill: '#fff' }); ctx.globalAlpha = 1; } }
    if (t > anio) { popIn(ctx, t, anio, 760, 1080, () => { text(ctx, '¿AÑO?', 0, 0, { size: 130, fill: '#ef233c', stroke: '#fff', lw: 14 }); }); questionMarks(ctx, t, 760, 900, 3, FLAT.ink); }
  });
}
// 4. Redes separadas: muy poco probable
{
  const a = PS(0, 3); fx(a + 0.3, 'whoosh', 0.5, 0.8); fx(a + 3.5, 'ding', 0.6);
  shot(a, (ctx, lt, d, t) => {
    bgFlat(ctx, t, '#03045e', '#000814', 5);
    globeGrids(ctx, CX, 720, 380, t, { independent: true });
    leo(ctx, CX, 1960, 1.1, E(t, { mouth: 'smile', talk: talking(t), handR: [140, -470], look: [0, -1] }));
    popIn(ctx, t, a + 0.3, CX, 180, () => { text(ctx, 'CADA PAÍS TIENE', 0, -50, { size: 80, fill: '#fff' }); text(ctx, 'SU PROPIA RED', 0, 60, { size: 96, fill: FLAT.mint }); });
    popIn(ctx, t, a + 3.5, CX, 1210, () => { card(ctx, -400, -60, 800, 120, FLAT.accent, 60); text(ctx, 'MUY POCO PROBABLE', 0, 0, { size: 64, fill: FLAT.ink, lw: 0, shadow: false }); });
  });
}
// 5. Kit + "¿y si de verdad pasara?" + video completo
{
  const a = PS(0, 4), q = SS(0, 4, 1), full = SS(0, 4, 2), agua = WD(0, 4, 'agua'), lint = WD(0, 4, 'linterna'), efec = WD(0, 4, 'efectivo');
  [agua, lint, efec].forEach((s, i) => fx(s, 'pop', 0.7, 1 + i * 0.15)); fx(q, 'impact', 0.5, 0.7); fx(full, 'sparkle', 0.7); fx(full + 0.1, 'boing', 0.6, 1.2);
  shot(a, (ctx, lt, d, t) => {
    if (t < q) {
      bgFlat(ctx, t, '#06d6a0', '#118ab2', 6); rays(ctx, t, CX, 700);
      popIn(ctx, t, agua, CX, 300, () => { card(ctx, -360, -150, 720, 300, '#fff', 40); waterGlass2(ctx, -200, 0, 1, t); text(ctx, 'AGUA', 120, 0, { size: 90, fill: '#0077b6', lw: 0, shadow: false }); });
      popIn(ctx, t, lint, CX, 660, () => { card(ctx, -360, -150, 720, 300, '#fff', 40); flashlight(ctx, -230, 0, 0.9, t, false); text(ctx, 'LINTERNA', 120, 0, { size: 80, fill: '#e76f51', lw: 0, shadow: false }); });
      leo(ctx, CX, 1960, 1.1, E(t, { mouth: 'grin', handR: [150, -330 - Math.abs(Math.sin(t * 3)) * 80] }));
      popIn(ctx, t, efec, CX, 1020, () => { card(ctx, -360, -150, 720, 300, '#fff', 40); cashIcon(ctx, -200, 10, 0.8, t); text(ctx, 'EFECTIVO', 120, 0, { size: 80, fill: '#2d6a4f', lw: 0, shadow: false }); });
    } else {
      sceneCityNight(ctx, t, { lights: t < full ? 1 - L(t, q, q + 2) : 0 });
      popIn(ctx, t, q + 0.3, CX, 330, () => { text(ctx, '¿Y SI DE VERDAD', 0, -70, { size: 92, fill: '#fff' }); text(ctx, 'PASARA?', 0, 70, { size: 150, fill: FLAT.accent }); });
      if (t > full) {
        popIn(ctx, t, full, CX, 760, () => { ctx.rotate(Math.sin(t * 4) * 0.03); card(ctx, -400, -120, 800, 240, FLAT.coral, 50); text(ctx, '▶ VIDEO COMPLETO', 0, 0, { size: 76, fill: '#fff', lw: 0, shadow: false }); });
        leo(ctx, CX, 1950, 1.25, E(t, { mouth: 'grin', handR: [150, -480 + Math.sin(t * 8) * 20], talk: talking(t) }));
      }
    }
  });
}
function waterGlass2(ctx, x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  const path = () => { ctx.beginPath(); ctx.moveTo(-70, -110); ctx.lineTo(70, -110); ctx.lineTo(55, 110); ctx.lineTo(-55, 110); ctx.closePath(); };
  path(); ctx.fillStyle = 'rgba(76,201,240,0.25)'; ctx.fill();
  ctx.save(); path(); ctx.clip(); const top = -50; ctx.fillStyle = '#4cc9f0'; ctx.beginPath(); ctx.moveTo(-80, top); for (let xx = -80; xx <= 80; xx += 8) ctx.lineTo(xx, top + Math.sin(xx * 0.08 + t * 4) * 5); ctx.lineTo(80, 120); ctx.lineTo(-80, 120); ctx.fill(); ctx.restore();
  ctx.restore();
}
V.terminar();
