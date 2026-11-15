#!/usr/bin/env python3
"""Genera la narración con ElevenLabs (con tiempos por carácter) a partir de narracion-elevenlabs.txt.

Uso: python3 voz.py <narracion-elevenlabs.txt> <carpeta_audio> <prefijo> [partes...]
  p. ej.: python3 voz.py guiones/002-sin-agua/narracion-elevenlabs.txt audio 002 1
Configuración del canal: voz David, modelo Eleven v4, estabilidad Natural (0.5), similitud 0.5.
La clave la inyecta el proxy del entorno (no se guarda en el código).
"""
import base64, json, os, re, sys, urllib.request

VOICE_ID = 'qRUgOhnxGASxirG4fKjv'   # David
MODEL_ID = 'eleven_v4'
SETTINGS = {'stability': 0.5, 'similarity_boost': 0.5}

def parts_of(path):
    parts, cur = [], None
    for line in open(path, encoding='utf-8'):
        if line.startswith('====='):
            cur = []; parts.append(cur); continue
        if cur is not None: cur.append(line.rstrip('\n'))
    return ['\n'.join(p).strip() for p in parts]

def tts(text):
    req = urllib.request.Request(
        f'https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/with-timestamps?output_format=mp3_44100_128',
        data=json.dumps({'text': text, 'model_id': MODEL_ID, 'voice_settings': SETTINGS}).encode(),
        headers={'Content-Type': 'application/json', 'xi-api-key': os.environ.get('ELEVEN_KEY', 'proxy-injected')})
    with urllib.request.urlopen(req, timeout=600) as r:
        return json.load(r)

if __name__ == '__main__':
    src, outdir, prefix = sys.argv[1:4]
    parts = parts_of(src)
    which = [int(x) for x in sys.argv[4:]] or range(1, len(parts) + 1)
    os.makedirs(outdir, exist_ok=True)
    for k in which:
        res = tts(parts[k - 1])
        mp3 = os.path.join(outdir, f'{prefix}-parte{k}.mp3')
        open(mp3, 'wb').write(base64.b64decode(res['audio_base64']))
        json.dump(res.get('alignment'), open(os.path.join(outdir, f'{prefix}-parte{k}.tiempos.json'), 'w'))
        print('ok', mp3)
