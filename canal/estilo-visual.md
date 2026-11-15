# Guía de estilo visual (v1)

## Reglas fijas del canal
1. **Nada se queda quieto.** Fondos, objetos y cámara siempre tienen movimiento (nubes, estrellas, plantas, polvo, cortinas, deriva de cámara).
2. **Reacciones de caricatura exageradas:** ojos gigantes, espirales, "¡!" que rebotan, gotas de sudor, temblores, estiramientos (squash & stretch).
3. **Cada acción importante lleva efecto de sonido** (pop, boing, ding, whoosh, impacto…) y hay música de fondo alegre que baja cuando habla el narrador.
4. **Estilo plano** (sin contornos, formas geométricas, sombras planas) con tipografía gruesa redondeada (Lilita One). Amigable para niños y adultos; nada de terror.
5. **Nunca "solo voz".** Máximo 3 segundos sin algo nuevo en pantalla. Cada frase de la narración trae un cambio visual (un objeto que aparece, una reacción, un dato, un cambio de toma).
6. **Subtítulos dinámicos** tipo karaoke siempre activos (grupos de 2-4 palabras, palabra actual en amarillo, énfasis en rosa).
7. **Cámara viva:** golpe de zoom al iniciar cada frase + movimiento lento constante.
9. **Escenarios nuevos en cada video.** Lo que se repite es la marca (Leo, contador, subtítulos, estilo plano, transición de colores); los lugares cambian según el tema (cocina, desierto, dentro del cuerpo, mar, laboratorio...). El cuarto de Leo se usa solo como guiño breve, nunca como escenario principal de otro video.
8. **Control de calidad:** antes de publicar, correr `animacion/motor/actividad.py` y rellenar cualquier tramo quieto de 3 s o más.

Inspiración: animación 2D cinematográfica con personajes simples. **No copiamos personajes ni escenas de otros canales**: creamos los nuestros.

## Personaje principal: Leo
- Joven en estilo plano: piel morena, pelo rizado, sudadera azul, piernas y brazos largos con manos grandes.
- Muy expresivo: ojos rojos/ojeras/espirales, pelo que se alborota, sustos con las manos en la cabeza.
- Es "el espectador": a él le pasa todo lo que cuenta el video.
- Personajes secundarios humanos según la historia (Randy, científica, médicos...). Animales solo cuando el tema lo pide.

## Color
- Fondos con degradados y luz ambiental (atardecer, noche azul, laboratorio frío) para dar ambiente cinematográfico.
- Un color de acento de marca para textos, contador y datos clave.
- Cambia la temperatura del color según la tensión: cálido al inicio → frío/oscuro en la parte extrema.

## Recursos fijos de marca
- **Contador en pantalla** (ej. "HORA 36", "DÍA 3") en una esquina, siempre igual.
- **Fichas de dato**: tarjetas con el número grande cuando aparece una cifra.
- Transiciones rápidas (zoom/whip) entre etapas.
- Cámara con movimiento suave constante (nunca imagen totalmente quieta).

## Técnica
- Animación por código propia (`animacion/`), renderizada a 1920×1080, 30 fps. Efectos y música sintetizados por código (sin derechos de autor).
- Shorts: 1080×1920, se recomponen las escenas, no solo se recortan.
