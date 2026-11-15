#!/usr/bin/env python3
"""Mezclador de audio del canal.

Sintetiza efectos de sonido tipo caricatura y una música de fondo (todo generado por código:
sin problemas de derechos de autor) y los mezcla según el .sfx.json que exporta render.js.

Uso:
  python3 audio.py <escena.sfx.json> <salida.wav> [--voz narracion.mp3] [--voz-inicio 0.5]
Con --voz, la música baja automáticamente cuando habla el narrador (ducking).
"""
import json
import subprocess
import sys
import wave

import numpy as np

SR = 48000
rnd = np.random.default_rng(7)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def osc(freq, kind="sine"):
    """Oscilador con frecuencia variable (freq: array por muestra)."""
    ph = 2 * np.pi * np.cumsum(freq) / SR
    if kind == "sine":
        return np.sin(ph)
    if kind == "tri":
        return 2 / np.pi * np.arcsin(np.sin(ph))
    if kind == "saw":
        return 2 * ((ph / (2 * np.pi)) % 1) - 1
    raise ValueError(kind)


def lowpass(x, cutoff):
    """Filtro pasa-bajos de un polo con corte variable (cutoff: escalar o array)."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)


def adsr(n, a=0.005, tau=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / tau)


# ---------------- efectos ----------------
def sfx_pop(p=1.0, **_):
    t = t_axis(0.11)
    f = 380 * p * np.exp(np.log(3) * t / 0.11)
    return osc(f) * adsr(len(t), 0.002, 0.03) + 0.15 * rnd.standard_normal(len(t)) * adsr(len(t), 0.001, 0.004)


def sfx_boing(p=1.0, **_):
    t = t_axis(0.6)
    f = (320 - 160 * t / 0.6) * p * (1 + 0.3 * np.sin(2 * np.pi * 16 * t) * np.exp(-t * 3))
    x = osc(f) + 0.35 * osc(2 * f)
    return x * adsr(len(t), 0.004, 0.22) * 0.8


def sfx_ding(p=1.0, **_):
    t = t_axis(1.6)
    f0 = 1046 * p
    x = sum(a * np.sin(2 * np.pi * f0 * k * t) * np.exp(-t / d) for k, a, d in [(1, 1, 0.9), (2, 0.4, 0.6), (2.76, 0.35, 0.4), (5.4, 0.15, 0.2)])
    return x * np.minimum(1, t / 0.003) * 0.6


def sfx_tick(p=1.0, **_):
    t = t_axis(0.04)
    n = highpass(rnd.standard_normal(len(t)), 2000) * adsr(len(t), 0.0005, 0.004)
    return n * 0.8 + 0.4 * np.sin(2 * np.pi * 2600 * p * t) * adsr(len(t), 0.0005, 0.008)


def sfx_yawn(p=1.0, **_):  # silbato deslizante hacia abajo
    t = t_axis(1.0)
    f = (900 - 560 * (t / 1.0) ** 0.8) * p * (1 + 0.025 * np.sin(2 * np.pi * 6 * t))
    env = np.sin(np.pi * t / 1.0) ** 0.6
    return (osc(f) + 0.15 * osc(2 * f)) * env * 0.5


def sfx_ff(p=1.0, dur=3.0, **_):  # avance rápido: zumbido que sube + tic-tacs que se aceleran
    t = t_axis(dur)
    u = t / dur
    f = (140 + 520 * u ** 1.5) * p
    trem = 0.6 + 0.4 * np.sin(2 * np.pi * np.cumsum(10 + 25 * u) / SR)
    x = lowpass(osc(f, "saw"), 900 + 2500 * u) * trem * 0.5
    env = np.minimum(1, t / 0.25) * np.minimum(1, (dur - t) / 0.15)
    out = x * env
    # tic-tacs acelerando
    tt, k = 0.0, 0
    tick = sfx_tick()
    while tt < dur - 0.05:
        i = int(tt * SR)
        seg = tick * (1.0 if k % 2 else 0.7)
        out[i:i + len(seg)] += seg[: len(out) - i] * 0.6
        tt += 0.22 - 0.18 * (tt / dur)
        k += 1
    return out


def sfx_blip(p=1.0, **_):  # gota
    t = t_axis(0.12)
    f = 600 * p * np.exp(np.log(2.6) * t / 0.12)
    return osc(f) * adsr(len(t), 0.002, 0.04) * 0.7


def sfx_dizzy(p=1.0, **_):  # resorte "boing-boing" mareado
    t = t_axis(1.1)
    f = (520 + 180 * np.sin(2 * np.pi * 7 * t)) * p
    return (osc(f) + 0.3 * osc(1.5 * f)) * np.exp(-t / 0.6) * np.minimum(1, t / 0.01) * 0.5


def sfx_impact(p=1.0, **_):
    t = t_axis(1.2)
    thump = osc(120 * np.exp(-t * 6) + 38) * adsr(len(t), 0.002, 0.18)
    crash = highpass(rnd.standard_normal(len(t)), 3500) * adsr(len(t), 0.002, 0.35) * 0.35
    body = lowpass(rnd.standard_normal(len(t)), 600) * adsr(len(t), 0.001, 0.06)
    return (thump * 1.1 + crash + body) * 0.9


def sfx_whoosh(p=1.0, **_):
    dur = 0.65
    t = t_axis(dur)
    u = t / dur
    cut = (300 + 5000 * np.sin(np.pi * u) ** 2) * p
    x = lowpass(rnd.standard_normal(len(t)), cut)
    return x * np.sin(np.pi * u) ** 2 * 1.6


def sfx_sparkle(p=1.0, **_):
    out = np.zeros(int(0.8 * SR))
    for k in range(7):
        t = t_axis(0.3)
        f = rnd.uniform(1800, 3800) * p
        s = np.sin(2 * np.pi * f * t) * adsr(len(t), 0.001, 0.06) * 0.35
        i = int(k * 0.06 * SR)
        out[i:i + len(s)] += s
    return out


SFX = {k[4:]: v for k, v in globals().items() if k.startswith("sfx_")}


def crickets(dur):
    out = np.zeros(int(dur * SR))
    for carrier, period, off in [(4400, 0.75, 0.0), (4900, 0.93, 0.31)]:
        tt = off
        while tt < dur:
            for k in range(3):  # 3 pulsos por chirrido
                t = t_axis(0.025)
                s = np.sin(2 * np.pi * carrier * t) * np.sin(np.pi * t / 0.025)
                i = int((tt + k * 0.035) * SR)
                out[i:i + len(s)] += s[: max(0, len(out) - i)] * 0.3
            tt += period + rnd.uniform(-0.1, 0.1)
    return out


# ---------------- música ----------------
def music(dur, bpm=112, minor=False):
    """Loop de marimba + bajo + hi-hat + bombo. minor=True: ambiente de misterio. Devuelve (plucks, ritmo)."""
    n = int(dur * SR)
    plucks, groove = np.zeros(n), np.zeros(n)
    beat = 60 / bpm
    if minor:
        prog_ = [(57, [57, 60, 64, 69]), (53, [53, 57, 60, 65]), (50, [50, 53, 57, 62]), (52, [52, 56, 59, 64])]
        pattern = [0, 2, 1, 3, 0, 2, 1, 2]
    else:
        prog_ = [(60, [60, 64, 67, 72]), (57, [57, 60, 64, 69]), (53, [53, 57, 60, 65]), (55, [55, 59, 62, 67])]
        pattern = [0, 1, 2, 3, 2, 1, 2, 3]
    mtof = lambda m: 440 * 2 ** ((m - 69) / 12)
    hat = highpass(rnd.standard_normal(int(0.05 * SR)), 6000) * adsr(int(0.05 * SR), 0.001, 0.012)
    snap = lowpass(rnd.standard_normal(int(0.12 * SR)), 2500) * adsr(int(0.12 * SR), 0.001, 0.04)
    tk = t_axis(0.25); kick = osc(110 * np.exp(-tk * 25) + 45) * adsr(len(tk), 0.002, 0.1)
    tn = t_axis(0.5); notes_cache = {}
    def note(m):
        if m not in notes_cache:
            f = mtof(m)
            notes_cache[m] = (np.sin(2 * np.pi * f * tn) + 0.25 * np.sin(2 * np.pi * 4 * f * tn) * np.exp(-tn / 0.03)) * adsr(len(tn), 0.002, 0.25 if minor else 0.18)
        return notes_cache[m]
    tb = t_axis(beat * 1.6); bass_cache = {}
    def bassn(m):
        if m not in bass_cache: bass_cache[m] = osc(np.full(len(tb), mtof(m)), "tri") * adsr(len(tb), 0.005, 0.35)
        return bass_cache[m]

    def place(buf, at, sig, g=1.0):
        i = int(at * SR)
        if i >= n:
            return
        buf[i:i + len(sig)] += sig[: n - i] * g

    bar = 0
    tt = 0.0
    while tt < dur:
        root, notes = prog_[bar % 4]
        for k, idx in enumerate(pattern):
            place(plucks, tt + k * beat / 2, note(notes[idx] + (0 if minor else 12)), 0.5 if k % 2 else 0.7)
            if not minor or k % 2 == 0:
                place(groove, tt + k * beat / 2, hat, 0.25 if k % 2 == 0 else 0.45)
        for b in (0, 2):
            place(groove, tt + b * beat, bassn(root - 12), 0.8)
            if not minor or b == 0:
                place(groove, tt + b * beat, kick, 0.7)
        if not minor:
            for b in (1, 3):
                place(groove, tt + b * beat, snap, 0.35)
        tt += 4 * beat
        bar += 1
    return plucks, groove


def smooth(x, w):
    """Media móvil rápida (vectorizada)."""
    if w < 2:
        return x
    c = np.cumsum(np.insert(x, 0, 0.0))
    y = (c[w:] - c[:-w]) / w
    pad = w // 2
    return np.concatenate([np.full(pad, y[0]), y, np.full(len(x) - len(y) - pad, y[-1])])


def automation(points, n):
    if not points:
        return np.full(n, 0.2)
    ts, vs = zip(*points)
    return np.interp(np.arange(n) / SR, ts, vs)


def load_voice(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(float)


def main():
    args = sys.argv[1:]
    meta = json.load(open(args[0]))
    out_path = args[1]
    dur = meta["duration"]
    n = int(dur * SR)
    fx = np.zeros(n)
    for ev in meta["sfx"]:
        sig = SFX[ev["type"]](p=ev.get("pitch", 1.0), dur=ev.get("dur", 1.0)) * ev.get("vol", 1.0)
        i = int(ev["t"] * SR)
        if i < n:
            fx[i:i + len(sig)] += sig[: n - i]
    amb = np.zeros(n)
    for a in meta.get("ambience", []):
        if a["type"] == "crickets":
            seg = crickets(a["to"] - a["from"])
            seg *= np.minimum(1, np.minimum(np.arange(len(seg)) / (0.3 * SR), (len(seg) - np.arange(len(seg))) / (0.5 * SR)))
            i = int(a["from"] * SR)
            amb[i:i + len(seg)] += seg[: n - i] * a.get("vol", 0.3)
    level = automation(meta.get("music", []), n)
    groove_gate = np.clip((level - 0.12) / 0.08, 0, 1)  # en las partes tranquilas solo suena la marimba
    moods = meta.get("moods", [])
    if moods:
        minor_mask = np.zeros(n)
        for k, (t0, m) in enumerate(moods):
            t1 = moods[k + 1][0] if k + 1 < len(moods) else dur
            if m in ("tense", "mystery"):
                minor_mask[int(t0 * SR):int(t1 * SR)] = 1
        minor_mask = smooth(minor_mask, int(1.0 * SR))
        p1, g1 = music(dur)
        p2, g2 = music(dur, bpm=92, minor=True)
        mus = ((p1 + g1 * np.maximum(groove_gate, 0.6)) * (1 - minor_mask) + (p2 + g2 * 0.8) * minor_mask) * level
    else:
        plucks, groove = music(dur)
        mus = (plucks + groove * groove_gate) * level

    voice = np.zeros(n)
    segs = list(meta.get("voice", []))
    if "--voz" in args:
        segs.append({"file": args[args.index("--voz") + 1], "from": 0, "to": None,
                     "at": float(args[args.index("--voz-inicio") + 1]) if "--voz-inicio" in args else 0.0})
    cache = {}
    for sgm in segs:
        if sgm["file"] not in cache:
            cache[sgm["file"]] = load_voice(sgm["file"])
        v = cache[sgm["file"]]
        a0 = int(sgm["from"] * SR); a1 = len(v) if sgm.get("to") is None else min(len(v), int(sgm["to"] * SR))
        piece = v[a0:a1].copy()
        f = min(len(piece), int(0.01 * SR)); piece[:f] *= np.linspace(0, 1, f); piece[len(piece) - f:] *= np.linspace(1, 0, f)
        i = int(sgm["at"] * SR)
        voice[i:i + len(piece)] += piece[: max(0, n - i)]
    if np.abs(voice).max() > 0:
        env = smooth(np.abs(voice), int(0.25 * SR))
        duck = np.clip(env / (env.max() * 0.25 + 1e-9), 0, 1)
        mus *= 1 - 0.55 * duck

    mix = mus + fx * 0.8 + amb + voice
    mix = np.tanh(mix * 1.2) / np.tanh(1.2)  # limitador suave
    mix *= 0.89 / max(1e-9, np.abs(mix).max())
    # estéreo con un ensanchado leve de la música
    left = mix + 0.08 * np.roll(mus, 240)
    right = mix - 0.08 * np.roll(mus, 240)
    st = np.stack([left, right], axis=1)
    st *= 0.89 / np.abs(st).max()
    with wave.open(out_path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
    print(f"Audio: {out_path}")


if __name__ == "__main__":
    main()
