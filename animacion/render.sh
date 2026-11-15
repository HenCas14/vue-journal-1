#!/usr/bin/env bash
# Uso: animacion/render.sh <escena> [narracion.mp3] [inicio-voz-en-segundos]
# Genera renders/<escena>.mp4 con video + efectos + música (+ narración si se indica).
set -euo pipefail
cd "$(dirname "$0")/.."
esc="$1"; mkdir -p renders
# Estilo opcional: ESTILO=plano animacion/render.sh prueba-estilo
url="$esc${ESTILO:+&estilo=$ESTILO}"; esc="$esc${ESTILO:+-$ESTILO}"
node animacion/motor/render.js "$url" "renders/$esc-video.mp4"
extra=(); [ $# -ge 2 ] && extra=(--voz "$2" --voz-inicio "${3:-0}")
python3 animacion/motor/audio.py "renders/$esc-video.sfx.json" "renders/$esc-audio.wav" "${extra[@]}"
ffmpeg -y -v error -i "renders/$esc-video.mp4" -i "renders/$esc-audio.wav" -c:v copy -c:a aac -b:a 192k -shortest "renders/$esc.mp4"
rm -f "renders/$esc-video.mp4" "renders/$esc-audio.wav"
echo "Listo: renders/$esc.mp4"
