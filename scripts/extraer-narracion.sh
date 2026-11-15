#!/usr/bin/env bash
# Uso: scripts/extraer-narracion.sh guiones/001-sin-dormir
# Toma los bloques "> " de guion.md (desde la Escena 1) y genera narracion.txt
set -euo pipefail
dir="$1"
awk '/^## Escena 1/{on=1} /^## Fuentes/{on=0} on && /^## Escena/{print ""} on && /^>/' "$dir/guion.md" \
  | sed -E 's/^> ?//' | cat -s | sed '/./,$!d' > "$dir/narracion.txt"
echo "$(wc -w < "$dir/narracion.txt") palabras → $dir/narracion.txt"
