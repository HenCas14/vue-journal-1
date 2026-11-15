#!/usr/bin/env bash
# Uso: animacion/render.sh <escena> [narracion.mp3] [inicio-voz-en-segundos]
# Genera renders/<escena>.mp4 con video + efectos + música (+ narración si se indica).
set -euo pipefail
cd "$(dirname "$0")/.."
esc="$1"; mkdir -p renders
# Estilo opcional: ESTILO=plano animacion/render.sh prueba-estilo
url="$esc${ESTILO:+&estilo=$ESTILO}"; esc="$esc${ESTILO:+-$ESTILO}"
# PARTES=n divide el render en n procesos paralelos (más rápido en videos largos)
if [ "${PARTES:-1}" -gt 1 ]; then
  dur=$(node -e "
    const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage();
    await p.goto('file://'+require('path').resolve('animacion/motor/pagina.html')+'?escena=$url');
    await p.waitForFunction('window.READY===true');console.log(await p.evaluate(()=>SCENE.duration+' '+SCENE.fps));await b.close();})()")
  read total fps <<< "$dur"
  chunk=$(python3 -c "import math;print(math.ceil($total/$PARTES*$fps)/$fps)")
  : > "renders/$esc-lista.txt"
  for k in $(seq 0 $((PARTES-1))); do
    a=$(python3 -c "print($k*$chunk)"); b=$(python3 -c "print(min($total, ($k+1)*$chunk))")
    node animacion/motor/render.js "$url" "renders/$esc-p$k.mp4" --desde "$a" --hasta "$b" > "renders/$esc-p$k.log" 2>&1 &
    echo "file '$esc-p$k.mp4'" >> "renders/$esc-lista.txt"
  done
  wait
  ffmpeg -y -v error -f concat -safe 0 -i "renders/$esc-lista.txt" -c copy "renders/$esc-video.mp4"
  cp "renders/$esc-p0.sfx.json" "renders/$esc-video.sfx.json"
  rm -f renders/$esc-p*.mp4 renders/$esc-p*.sfx.json renders/$esc-p*.log "renders/$esc-lista.txt"
else
  node animacion/motor/render.js "$url" "renders/$esc-video.mp4"
fi
extra=(); [ $# -ge 2 ] && extra=(--voz "$2" --voz-inicio "${3:-0}")
python3 animacion/motor/audio.py "renders/$esc-video.sfx.json" "renders/$esc-audio.wav" "${extra[@]}"
ffmpeg -y -v error -i "renders/$esc-video.mp4" -i "renders/$esc-audio.wav" -c:v copy -c:a aac -b:a 192k -shortest "renders/$esc.mp4"
rm -f "renders/$esc-video.mp4" "renders/$esc-audio.wav"
echo "Listo: renders/$esc.mp4"
