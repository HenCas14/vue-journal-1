#!/usr/bin/env bash
# Uso: animacion/motor/alinear_todo.sh <carpeta_guion> <prefijo_audio> <escena>
# Alinea cada parte con ElevenLabs (forced alignment) y genera tiempos.json + escenas/<escena>.datos.js
set -euo pipefail
D="$1"; P="$2"; ESC="$3"
mkdir -p "$D/alineacion"
python3 - "$D" <<'PY'
import re, sys
d = sys.argv[1]; parts = []; cur = None
for line in open(f'{d}/narracion-elevenlabs.txt', encoding='utf-8'):
    line = line.strip()
    if line.startswith('====='): cur = []; parts.append(cur); continue
    if line and cur is not None: cur.append(re.sub(r'\[[^\]]*\]\s*', '', line))
for i, p in enumerate(parts, 1): open(f'{d}/alineacion/parte{i}.txt', 'w').write('\n'.join(p))
print(len(parts))
PY
n=$(ls "$D"/alineacion/parte*.txt | wc -l); js=()
for i in $(seq 1 $n); do
  curl -sS -m 300 -X POST https://api.elevenlabs.io/v1/forced-alignment -H "xi-api-key: proxy-injected" \
    -F "file=@audio/$P-parte$i.mp3" -F "text=<$D/alineacion/parte$i.txt" -o "$D/alineacion/parte$i.json" -w "parte$i HTTP %{http_code}\n"
  js+=("$D/alineacion/parte$i.json")
done
python3 animacion/motor/alinear_eleven.py "$D/narracion-elevenlabs.txt" "$D/tiempos.json" "${js[@]}"
python3 -c "import json;d=json.load(open('$D/tiempos.json'));open('animacion/escenas/$ESC.datos.js','w').write('const TIEMPOS = '+json.dumps(d,ensure_ascii=False)+';\n')"
