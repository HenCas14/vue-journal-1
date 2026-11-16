# Guía de dibujo y animación — estándar PRO de Curioso Leo

> **Para quien continúe este proyecto (persona o modelo de IA): lee esto antes de dibujar o animar.**
> Todo lo nuevo debe verse como los modelos base de `canal/marca/modelos/`. Si algo nuevo se ve más simple que esas hojas, no está terminado.

## 0. Dónde está cada cosa

| Archivo | Qué contiene |
|---|---|
| `animacion/motor/pro.js` | **El estándar de calidad.** Personaje, fondos, planeta, sol, celular, tarjetas, resplandor. Se carga al final y reemplaza las versiones simples. |
| `animacion/motor/lib.js` | Utilidades: `ease`, `pop`, `prog`, `lerp`, `mix`, `rng`, `text`, `rrect`, contador, transición `wipe`. |
| `animacion/motor/plano.js` | Paleta `FLAT`, lista `PEOPLE`, íconos sencillos, subtítulos (`buildCaptions`), cámara (`cameraFor`). |
| `animacion/motor/video.js` | Esqueleto de un video: voz, tomas (`shot`), efectos (`fx`), música, subtítulos, cámara y `postFX`. |
| `animacion/motor/escenarios.js`, `apagon.js` | Escenarios y objetos por tema. |
| `animacion/escenas/modelos-base.js` | **Hojas de modelos base** (`?modo=personaje|expresiones|secundarios|fondos|objetos`). |
| `canal/marca/modelos/*.png` | Las hojas ya renderizadas (referencia visual). |

Para regenerar las hojas después de cambiar el estándar: abrir `animacion/motor/pagina.html?escena=modelos-base&modo=personaje` (y los demás modos).

## 1. Principios del estilo

1. **Plano con volumen.** Formas vectoriales sin contorno negro, pero nunca un color plano solo: cada forma lleva **luz arriba-izquierda y sombra abajo-derecha** (degradado suave o franja de sombra del 12–22 %).
2. **La luz viene de arriba a la izquierda.** Sombras de contacto debajo de todo lo que toca el piso (`softShadow`). Toda fuente de luz lleva halo (`glow`).
3. **Tres planos de profundidad** en cada fondo: lejos (pequeño, tenue, lento), medio, cerca (grande, contrastado, rápido). El paralaje es obligatorio cuando el fondo se mueve.
4. **Nada quieto.** Todo elemento tiene un movimiento secundario (respirar, mecerse, parpadear, girar, flotar). Máximo 3 s sin algo nuevo en pantalla.
5. **Acabado.** Cada cuadro pasa por `postFX` (resplandor de las zonas brillantes + viñeta). No dibujar brillos "a mano" grandes: usar colores claros y dejar que el resplandor haga el trabajo.
6. **Amigable.** Nada de terror ni gore. Temas duros se muestran con metáforas (luces que se apagan, medidores, mapas).

## 2. Paleta

- **Marca:** amarillo `#ffd23f` (acento, contador, palabra activa del subtítulo), coral `#ff6b5b`, menta `#5ee0c0`, cielo `#7cc6ff`, morado `#8b7bff`, tinta `#1d1830`.
- **Leo:** piel `#a86b3c` / sombra `#8d5630`, sudadera `#2f6fde` / sombra `#2558b8`, pantalón `#1f2a44`, pelo `#1b1b1b`, iris `#4a2c17`.
- **Noche:** cielo `#02030f → #0b1030 → #2a1f5c`; ventanas `#ffd166` cálidas, `#fff4d6` blancas, `#78beff` (tele).
- **Regla:** fondos con degradado de 2–3 tonos del mismo color; el personaje siempre contrasta con el fondo (si el fondo es azul oscuro, agrega luz o viñeta clara detrás de Leo).

## 3. Personaje (ver `modelos/personaje.png` y `modelos/expresiones.png`)

**Función:** `drawPerson(ctx, x, y, escala, e, P)` — atajo para Leo: `leo(ctx, x, y, escala, e)`.

**Anclas (a escala 1):** pies en `(0,0)`, cadera `y=-178`, hombros `(±54,-322)`, centro de la cabeza `(0,-425)`, alto total ≈ 500 px. Brazo y antebrazo miden 112 px cada uno (alcance máximo ≈ 224 px desde el hombro).

**Cómo se construye (orden de capas):**
1. Sombra de contacto → piernas (trapecios con franja de sombra interior) → tenis (suela gris, franja del color de la sudadera).
2. Capucha (detrás) → torso (forma redondeada, degradado luz-sombra, bolsillo, resorte inferior, cordones que se mecen).
3. Cuello (con sombra bajo la barbilla) → orejas → cabeza (óvalo 55×66 con degradado lateral) → mejillas.
4. Pelo: círculos con un brillo pequeño y discreto en cada rizo.
5. **Ojos:** blanco + iris + pupila + brillo; el párpado es del color de la piel y baja con `open`. Las cejas son curvas gruesas.
6. Nariz (arco tenue) → boca (con dientes y lengua cuando abre).
7. **Brazos con codo** (cinemática inversa: el codo se abre hacia afuera y abajo) → puño de la manga → **mano con palma, 3 dedos y pulgar**.

**Parámetros de expresión `e`:** `open` (párpado 0–1), `look [x,y]`, `mouth` (`smile|grin|o|yawn|wobbly|flat|sad|angry|chew`), `mouthOpen`, `talk`, `shock`, `eyeSize`, `pupil`, `red`, `bags`, `spiral`, `frazzle`, `angry`, `blush`, `handL/handR [x,y]`, `hold/holdL`, `walk`, `sit`, `inBed`, `flip`, `rot`, `noShadow`.

**Poses de mano útiles (coordenadas locales):** reposo `(±74,-118)` · saludar `(140,-470)` · señalar `(190,-330)` · pensar `(40,-385)` · manos a la cabeza (susto) `(±62,-420)` · brazos arriba `(±130,-520)` · sostener algo `(110,-300)`.

**Vida propia (ya incluida, no quitar):** respiración del torso, inclinación de la cabeza hacia donde mira, cordones y pelo que rebotan, estirón vertical con `shock`, parpadeo con `E(t, {...})`.

**Personajes nuevos:** agregar una entrada en `PEOPLE` (`skin, skinD, shirt, shirtD, pants, hair, hairStyle: curly|crew|long|bun|spiky|bald`, opcional `glasses, coat, stripes, hoodie, iris`). No dibujar personajes "a mano" fuera de `drawPerson`.

## 4. Fondos (ver `modelos/fondos.png`)

- **Ciudad de noche** `sceneCityNight(ctx, t, { lights, stars })`: cielo en degradado, vía láctea y estrellas de colores (más visibles al apagarse), luna con cráteres y halo, nubes, **3 capas de edificios** con azoteas variadas (antenas con luz roja, tinacos), ventanas cálidas/blancas/tele, farolas con cono de luz y reflejo en el asfalto, neblina en la base.
- **Sala** `sceneLivingRoom(ctx, t, { lights, fanSlow })`: pared con zócalo, piso de duelas en perspectiva, cuadros, ventana con ciudad y cortinas que se mecen, sofá con cojines, mesita con planta, lámpara con cono de luz, ventilador. Sin luz: rayo de luna desde la ventana (y la toma agrega `darkOv`).
- **Calle de día** `sceneStreetDay(ctx, t, dim)`: cielo, sol con halo, nubes, fila lejana + edificios con cornisa, ventanas con marco y reflejo, toldos a rayas, puerta y aparador, árboles, banqueta y calle.
- **Fondo abstracto** `bgFlat(ctx, t, c1, c2, semilla)`: degradado diagonal + manchas de luz + figuras en 3 planos. Usarlo con `rays()` para datos y tarjetas.

**Receta para un escenario nuevo:** 1) cielo/pared con degradado; 2) capa lejana tenue; 3) capa media con detalle; 4) piso con textura o perspectiva; 5) 2–3 objetos "de vida" (planta, cuadro, lámpara); 6) al menos 3 cosas en movimiento; 7) una fuente de luz con `glow`; 8) sombras de contacto.

## 5. Planeta, sol y objetos (ver `modelos/objetos.png`)

- **Tierra** `globeGrids(ctx, x, y, r, t, { independent, night })`: proyección esférica real (los continentes giran y se comprimen en el borde), atmósfera con halo, casquetes polares, nubes, luces de ciudades con resplandor, lado nocturno y brillo especular. Siempre sobre `starfield()`.
- **Sol** `sunFlare(ctx, x, y, r, t)`: doble halo, corona de rayos que gira, superficie con granulación y manchas, protuberancias animadas.
- **Celular** `bigPhone(ctx, x, y, s, t, { time, battery, muted, signal, rot })`: marco con degradado, botones, cámara, fondo de pantalla animado y reflejo de cristal.
- **Tarjetas** `card()`: sombra suave + brillo superior. Texto de tarjeta con `text(..., { lw: 0, shadow: false })`.
- **Objeto nuevo — receta:** forma base → franja o degradado de sombra a la derecha/abajo → un brillo pequeño arriba-izquierda → 1 detalle que lo identifique → 1 movimiento (vapor, parpadeo, giro) → `glow` si emite luz → sombra de contacto si está apoyado.

## 6. Animación

- **Entradas:** `popIn(ctx, t, inicio, x, y, fn)` (rebote elástico). Nunca aparecer "de golpe".
- **Curvas:** `ease.out` para llegar, `ease.inOut` para recorridos, `ease.back` para subir con rebote, `ease.elastic` para pops.
- **Sincronía:** cada acción arranca en la palabra exacta: `V.SS(parte, párrafo, frase)` o `V.W(parte, párrafo, 'palabra')`. Los tiempos salen de la alineación forzada de ElevenLabs (`animacion/motor/alinear_todo.sh`).
- **Reacciones:** susto = `shock` + `eyeSize` 1.2–1.4 + boca `o` + temblor de cámara + `exclaim` + sonido `boing`/`impact`.
- **Cámara:** `cameraFor` ya da golpe de zoom por frase y deriva constante. Para énfasis extra, mover o escalar dentro de la toma.
- **Sonido:** todo `popIn` importante lleva `fx(t, 'pop'|'ding'|'boing'|'whoosh'|'sparkle'|'impact'...)`.
- **Subtítulos:** siempre activos; no poner textos propios en la franja inferior (`y > 880` en horizontal).
- **Contador:** ocupa la esquina superior derecha (`x > 1500, y < 180`); los títulos van centrados en `x ≈ 860` cuando hay contador.

## 7. Control de calidad antes de entregar

1. `node .../scan` (recorrer todo el video sin errores) — ver README.
2. Hoja de contacto con un cuadro por toma: revisar choques de texto con el contador y los subtítulos.
3. `python3 animacion/motor/actividad.py renders/VIDEO.mp4 /tmp/a.npy` → debe dar **0 tramos quietos**.
4. Duración ≥ 8:00 en videos largos; volumen ≈ −14 LUFS.
5. Comparar 3 cuadros al azar contra los modelos base: ¿tienen luz y sombra, profundidad, movimiento y resplandor?
