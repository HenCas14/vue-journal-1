#!/usr/bin/env python3
"""Alinea el texto de la narración con el audio (sin transcripción).

Detecta las pausas de la voz y asigna el final de cada frase a la pausa más probable,
según el largo del texto. Genera tiempos por párrafo para sincronizar la animación.

Uso: python3 alinear.py <narracion-elevenlabs.txt> <salida.json> parte1.mp3 parte2.mp3 ...
"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from pausas import pauses

def parse(txt):
    parts, cur = [], None
    for line in open(txt, encoding='utf-8'):
        line = line.strip()
        if line.startswith('====='):
            cur = []; parts.append(cur); continue
        if line and cur is not None:
            clean = re.sub(r'\[[^\]]*\]\s*', '', line)
            cur.append(clean)
    return parts

def sentences(par):
    return [s for s in re.split(r'(?<=[.!?…])\s+', par) if s.strip()]

def weight(s):  # duración relativa aproximada de una frase
    return len(re.sub(r'\s', '', s)) + 4 * len(re.findall(r'\.\.\.|…|,', s))

def align(paragraphs, audio):
    ps, dur = pauses(audio, rel=-30, mind=0.12)
    speech_start = ps[0][1] if ps and ps[0][0] < 0.05 else 0.0
    speech_end = ps[-1][0] if ps and ps[-1][1] > dur - 0.1 else dur
    inner = [p for p in ps if p[0] > speech_start + 0.1 and p[1] < speech_end - 0.1]
    sents = [(pi, s) for pi, par in enumerate(paragraphs) for s in sentences(par)]
    w = [weight(s) for _, s in sents]; tot = sum(w)
    pred, acc = [], 0
    for x in w[:-1]:
        acc += x; pred.append(speech_start + (speech_end - speech_start) * acc / tot)
    # Candidatos por frontera: cualquier pausa real o el tiempo estimado (con penalización)
    cands = [((a + b) / 2, a, b, 2 * (b - a)) for a, b in inner]
    N = len(pred); VIRT = 3.0
    states = []  # por frontera: lista de (tiempo, ini_pausa, fin_pausa, costo, padre)
    for i in range(N):
        opts = [(m, a, b, (m - pred[i]) ** 2 / 4 - bonus) for m, a, b, bonus in cands if abs(m - pred[i]) < 12]
        opts.append((pred[i], pred[i] - 0.05, pred[i] + 0.05, VIRT))
        cur = []
        for (m, a, b, c) in opts:
            if i == 0: cur.append((m, a, b, c, -1)); continue
            best = min(((st[3], k) for k, st in enumerate(states[-1]) if st[0] < m - 0.4), default=None)
            if best: cur.append((m, a, b, c + best[0], best[1]))
        if not cur: cur = [(pred[i], pred[i] - 0.05, pred[i] + 0.05, 1e9, 0)]
        states.append(cur)
    k = min(range(len(states[-1])), key=lambda q: states[-1][q][3]) if N else 0
    chosen = [None] * N
    for i in range(N - 1, -1, -1): chosen[i] = states[i][k]; k = states[i][k][4]
    bounds = [speech_start] + [c[2] for c in chosen]
    ends = [c[1] for c in chosen] + [speech_end]
    out = []
    for k, (pi, s) in enumerate(sents):
        out.append({'p': pi, 'text': s, 'start': round(bounds[k], 2), 'end': round(ends[k], 2)})
    pars = []
    for pi, par in enumerate(paragraphs):
        ss = [x for x in out if x['p'] == pi]
        pars.append({'start': ss[0]['start'], 'end': ss[-1]['end'], 'text': par, 'sentences': ss})
    return {'audio': audio, 'duration': round(dur, 2), 'paragraphs': pars}

if __name__ == '__main__':
    txt, outp, audios = sys.argv[1], sys.argv[2], sys.argv[3:]
    parts = parse(txt)
    assert len(parts) == len(audios), (len(parts), len(audios))
    res = [align(p, a) for p, a in zip(parts, audios)]
    json.dump(res, open(outp, 'w'), ensure_ascii=False, indent=1)
    for k, r in enumerate(res):
        print(f"Parte {k+1}: {r['duration']} s")
        for i, p in enumerate(r['paragraphs']): print(f"  p{i:02d} {p['start']:7.2f}-{p['end']:7.2f}  {p['text'][:60]}")
