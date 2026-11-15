// Esqueleto común de un video narrado: línea de tiempo de la voz, tomas, efectos, subtítulos,
// golpes de cámara, contador y música. Usa TIEMPOS (datos de la escena).
// Uso:  const V = crearVideo({ voces: ['audio/002-parte1.mp3', ...], hueco: 0.8, final: 16 });
//       V.shot(inicio, (ctx, lt, d, t) => {...}, { counter: t => 'HORA 3', mood: 'tense', trans: 'flash' });
//       V.terminar();  // al final del archivo
function crearVideo(cfg) {
  const SCENE = { fps: 30, sfx: [], voice: [], ambience: [] };
  const SEG = []; let cursor = cfg.inicio ?? 0.4; const hueco = cfg.hueco ?? 0.8;
  cfg.voces.forEach((f, i) => {
    SEG.push({ part: i, from: 0, to: TIEMPOS[i].duration, at: cursor });
    cursor += TIEMPOS[i].duration + (i < cfg.voces.length - 1 ? hueco : 0);
  });
  const VOICE_END = cursor;
  SCENE.duration = Math.ceil((VOICE_END + (cfg.final ?? 15.5)) * 10) / 10;
  SCENE.voice = SEG.map(s => ({ file: cfg.voces[s.part], from: s.from, to: s.to, at: s.at }));
  const PAR = (pt, pi) => TIEMPOS[pt].paragraphs[pi];
  const G = (pt, local) => { const s = SEG[pt]; return s.at + local - s.from; };
  const PS = (pt, pi) => G(pt, PAR(pt, pi).start), PE = (pt, pi) => G(pt, PAR(pt, pi).end);
  const SS = (pt, pi, si) => { const ss = PAR(pt, pi).sentences; return G(pt, ss[Math.min(si, ss.length - 1)].start); };
  // inicio de una palabra concreta dentro de un párrafo (primera coincidencia, sin acentos ni signos)
  const norm = w => w.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9ñ]/g, '');
  const W_ = (pt, pi, word, nth = 0) => {
    let k = 0; for (const s of PAR(pt, pi).sentences) for (const w of s.words) if (norm(w[0]) === norm(word) && k++ === nth) return G(pt, w[1]);
    return PS(pt, pi);
  };
  const SHOTS = [];
  const fx = (t, type, vol = 0.7, pitch = 1, extra = {}) => SCENE.sfx.push(Object.assign({ t, type, vol, pitch }, extra));
  const shot = (a, draw, o = {}) => { SHOTS.push(Object.assign({ a, draw }, o)); if (!o.quiet) fx(a, 'whoosh', 0.22, 1.3); };
  const V = { SCENE, SEG, VOICE_END, PAR, G, PS, PE, SS, W: W_, SHOTS, fx, shot, L: prog, counterFirst: null, musicExtra: [] };
  V.terminar = function () {
    SHOTS.sort((x, y) => x.a - y.a);
    SHOTS.forEach((s, i) => { s.b = i < SHOTS.length - 1 ? SHOTS[i + 1].a : SCENE.duration; });
    SCENE.moods = []; let last = 'happy';
    SHOTS.forEach(s => { const m = s.mood || last; if (m !== last || !SCENE.moods.length) SCENE.moods.push([s.a, m]); last = m; });
    SCENE.music = [[0, 0.14], ...V.musicExtra, [VOICE_END, 0.14], [VOICE_END + 0.6, 0.3], [SCENE.duration - 1, 0.3], [SCENE.duration, 0]].sort((a, b) => a[0] - b[0]);
    const SENTS = [];
    TIEMPOS.forEach((p, pt) => p.paragraphs.forEach(par => par.sentences.forEach(s => SENTS.push({ a: G(pt, s.start), b: G(pt, s.end), text: s.text, words: (s.words || []).map(w => [w[0], G(pt, w[1]), G(pt, w[2])]) }))));
    const CAPS = buildCaptions(SENTS), STARTS = SENTS.map(s => s.a);
    SCENE.render = function (ctx, t) {
      let i = 0; while (i < SHOTS.length - 1 && SHOTS[i + 1].a <= t) i++;
      const sh = SHOTS[i], lt = t - sh.a, d = sh.b - sh.a;
      ctx.save();
      const cam = cameraFor(t, STARTS);
      ctx.translate(W / 2 + cam.dx, H / 2 + cam.dy); ctx.rotate(cam.rot); ctx.scale(cam.zoom, cam.zoom); ctx.translate(-W / 2, -H / 2);
      if (sh.trans !== 'cut' && sh.trans !== 'wipe') { const z = 1 + 0.05 * (1 - ease.out(prog(lt, 0, 0.35))); ctx.translate(W / 2, H / 2); ctx.scale(z, z); ctx.translate(-W / 2, -H / 2); }
      sh.draw(ctx, lt, d, t);
      ctx.restore();
      if (sh.trans === 'flash' && lt < 0.25) { ctx.fillStyle = `rgba(255,255,255,${0.6 * (1 - lt / 0.25)})`; ctx.fillRect(0, 0, W, H); }
      if (sh.counter && V.counterFirst != null) drawCounter(ctx, t, sh.counter(t), V.counterFirst, (sh.bump || []).concat([sh.a + 0.05]));
      if (t < VOICE_END + 0.5) drawCaptions(ctx, t, CAPS);
      for (const s of SHOTS) if (s.trans === 'wipe' && Math.abs(t - s.a) < 0.6) wipe(ctx, t, s.a - 0.42);
    };
  };
  return V;
}
