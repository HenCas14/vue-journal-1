# Curioso Leo — canal de YouTube de curiosidades animadas

Proyecto de producción de videos animados por código (canvas 2D → Playwright → ffmpeg), en español, para niños y adultos. El usuario aprueba cada guion antes de generar la voz.

## Antes de dibujar o animar: LEE `canal/guia-dibujo.md`
Es el estándar de calidad obligatorio ("PRO"). Los modelos base están en `canal/marca/modelos/*.png` y se generan con `animacion/escenas/modelos-base.js`. Todo lo nuevo debe verse al nivel de esas hojas: formas planas **con luz y sombra**, 3 planos de profundidad, halos de luz, movimiento constante y acabado `postFX`. No dibujes personajes fuera de `drawPerson` ni reemplaces las funciones de `animacion/motor/pro.js` por versiones más simples.

## Reglas del canal (ver `canal/estilo-visual.md`)
- Protagonista: **Leo** (estilo plano). Animales solo cuando el tema lo pide.
- Nunca "solo voz": máximo 3 s sin algo nuevo en pantalla; subtítulos dinámicos siempre; golpe de cámara por frase.
- **Escenarios nuevos en cada video.** Se repite solo la marca (Leo, contador, subtítulos, transición).
- Guiones con etiquetas de ElevenLabs, **pocos susurros**; videos largos ≥ 8:00 (unas 1,300 palabras).
- Nada de terror; temas duros con metáforas. Datos verificados y fuentes en `youtube.md`.

## Flujo de un video nuevo
1. Guion en `guiones/NNN-tema/narracion-elevenlabs.txt` (partes `===== PARTE n =====` < 2,500 caracteres) → **aprobación del usuario**.
2. Voz: `python3 animacion/motor/voz.py guiones/NNN/narracion-elevenlabs.txt audio NNN` (David, `eleven_v4`, estabilidad 0.5; la clave la inyecta el entorno para api.elevenlabs.io).
3. Tiempos exactos: `animacion/motor/alinear_todo.sh guiones/NNN NNN NNN-tema`.
4. Escena en `animacion/escenas/NNN-tema.js` con `crearVideo` (ver `003-apagon.js` como ejemplo); sincronizar con `V.SS` / `V.W`.
5. Revisión: `node animacion/herramientas/revisar-errores.js NNN-tema` (debe decir "sin errores") y `node animacion/herramientas/cuadro-por-toma.js NNN-tema <carpeta> 0.6`.
6. Render: `PARTES=3 animacion/render.sh NNN-tema` → `renders/NNN-tema.mp4`.
7. Calidad: `python3 animacion/motor/actividad.py renders/NNN-tema.mp4 /tmp/a.npy` (0 tramos quietos), duración y volumen.
8. Miniatura (`animacion/escenas/miniatura-NNN.js`) y `guiones/NNN/youtube.md` (títulos, descripción con capítulos, fuentes).

Shorts: escenas cuyo nombre contiene `short` se renderizan en vertical (1080×1920).
Los `.mp4` y los audios no se guardan en git: entrégalos al usuario y recuérdale descargarlos.
