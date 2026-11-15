# Canal animado — proyecto de producción

Videos animados de explicación ("¿Qué pasaría si…?", "¿Por qué…?") para YouTube.
Formato principal: videos largos (8–12 min). De cada uno se recortan 3–5 Shorts.

## Estructura

```
canal/                 Estrategia, nicho, lista de ideas y guía de estilo visual
guiones/NNN-tema/      Un folder por video
  guion.md             Guion con escenas, notas visuales, títulos, miniatura y Shorts
  narracion.txt        Solo el texto a narrar (listo para pegar en ElevenLabs)
animacion/             Motor de animación (personaje, escenarios, efectos, audio) y escenas
audio/                 Narraciones exportadas de ElevenLabs (no se suben a git)
renders/               Videos finales MP4 (no se suben a git)
```

## Flujo de trabajo

1. **Idea** → se elige de `canal/ideas.md`.
2. **Guion** → Claude escribe `guion.md` + `narracion.txt`.
3. **Voz** → se genera el audio en ElevenLabs con `narracion.txt` y se guarda en `audio/NNN.mp3`.
4. **Animación** → Claude anima escena por escena sincronizado con el audio y renderiza el MP4.
5. **Publicación** → subida manual a YouTube con título, descripción, capítulos y miniatura.
6. **Shorts** → recortes verticales de los momentos marcados en el guion.

## Renderizar una escena

```
animacion/render.sh prueba-estilo                       # video + efectos + música
animacion/render.sh 001-sin-dormir audio/001.mp3 0.5    # con narración (empieza en 0.5 s)
```
Vista previa en vivo: abrir `animacion/motor/pagina.html?escena=prueba-estilo` en el navegador.
