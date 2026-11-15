#!/usr/bin/env python3
"""Convierte la alineación forzada de ElevenLabs (tiempo por palabra) al formato de tiempos del video.

Uso: python3 alinear_eleven.py <narracion-elevenlabs.txt> <salida.json> parte1.json parte2.json ...
(los parteN.json salen de POST https://api.elevenlabs.io/v1/forced-alignment con el audio y su texto)
"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from alinear import parse, sentences

def main():
    txt, outp, aligns = sys.argv[1], sys.argv[2], sys.argv[3:]
    parts = parse(txt)
    res = []
    for paragraphs, af in zip(parts, aligns):
        words = [w for w in json.load(open(af))['words'] if w['text'].strip()]
        k = 0; pars = []
        for par in paragraphs:
            ss = []
            for s in sentences(par):
                toks = s.split()
                ws = words[k:k + len(toks)]; k += len(toks)
                ss.append({'text': s, 'start': round(ws[0]['start'], 2), 'end': round(ws[-1]['end'], 2),
                           'words': [[w['text'], round(w['start'], 2), round(w['end'], 2)] for w in ws]})
            pars.append({'start': ss[0]['start'], 'end': ss[-1]['end'], 'text': par, 'sentences': ss})
        assert k == len(words), f'{af}: {k} palabras del texto vs {len(words)} alineadas'
        res.append({'audio': af, 'duration': round(words[-1]['end'] + 0.3, 2), 'paragraphs': pars})
    json.dump(res, open(outp, 'w'), ensure_ascii=False, indent=1)
    print('ok', outp)

if __name__ == '__main__':
    main()
