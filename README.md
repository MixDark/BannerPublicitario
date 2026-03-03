# MIX DARK DEV — Banner Publicitario · Space Edition

> Tarjeta de perfil / banner publicitario animado con temática espacial futurista, construido íntegramente con HTML, CSS y JavaScript puro. Sin frameworks de JS, sin proceso de build.

[![GitHub](https://img.shields.io/badge/GitHub-MixDark-181717?logo=github)](https://github.com/MixDark)
[![YouTube](https://img.shields.io/badge/YouTube-mixdarkdev-FF0000?logo=youtube)](https://youtube.com/@mixdarkdev)
[![License: MIT](https://img.shields.io/badge/License-MIT-00f5ff.svg)](#licencia)

---

## Vista previa

La tarjeta muestra un perfil HUD con efecto holográfico sobre un fondo espacial completamente animado: estrellas en warp, meteoros, partículas de energía y nebulosas en movimiento.

---

## Características

### Fondo animado (Canvas 2D)
- **Warp star field** — campo de estrellas con perspectiva y punto de fuga dinámico que sigue al cursor del mouse, en 3 capas de profundidad (lejos / medio / cerca), cada estrella con cola de velocidad (trail) y halo de brillo.
- **Meteoros radiales** — 28 meteoros con gradiente lineal, cabeza luminosa y halo. Aparecen con delay aleatorio para mayor naturalidad.
- **Partículas de energía** (`SparkParticle`) — 60 orbes que recorren trayectorias sinusoidales tipo Lissajous, con 4 colores neón (cian, púrpura, rosa, dorado), puntas / destellos y **flash burst** periódico con onda expansiva.
- **Nebulosas en Canvas** — 10 manchas de color con gradiente radial animadas, que se desplazan lentamente y se envuelven en los bordes.

### Efectos CSS puros
- **Nebulosas CSS** con `filter: blur` y gradientes radiales animadas mediante `@keyframes`.
- **Meteoros CSS** (14 divs) con animación de entrada diagonal.
- **Planetas decorativos** en 6 posiciones del fondo.
- **Grid HUD** y **rayo de escaneo** que atraviesa la pantalla.
- **Esquinas HUD** decorativas en las cuatro esquinas del viewport.
- **Overlay de scanlines** que simula monitor CRT.

### Tarjeta de perfil
- **Avatar** con globo terráqueo SVG personalizado, anillo giratorio y dos órbitas animadas.
- **Título con efecto glitch** animado letra por letra (split dinámico con JS).
- **Tags de rol** con colores neón: `DEVELOPER`, `CREATOR`, `BUILDER`.
- **Links a redes sociales** con efecto hover de barrido (sweep): GitHub, YouTube y LinkedIn.
- **Punto de estado** animado (`ONLINE`).
- **Contador HUD** decorativo en tiempo real (`SYS:0000`).

### Audio
- Reproducción de música de fondo en bucle (`.mp3`).
- **Autoplay** al cargar con manejo del bloqueo del navegador.
- **Botón de música** con visualizador de ecualizador animado (barras EQ).
- **Fade in / fade out** suave al activar o pausar.

---

## Estructura del proyecto

```
BannerPublicitario/
├── index.html                    # Estructura principal, Tailwind config, HUD y tarjeta
├── main.js                       # Canvas 2D: WarpStar, Meteor, SparkParticle, NebulaBlob + audio
├── style.css                     # Estilos globales, nebulosas, meteoros, card, HUD, EQ
├── I Believe (Extended Mix).mp3  # Música de fondo (bucle)
├── README.md
├── CHANGELOG.md
└── .gitignore
```

---

## Uso

```bash
# 1. Clona el repositorio
git clone https://github.com/MixDark/BannerPublicitario.git

# 2. Entra a la carpeta
cd BannerPublicitario

# 3. Abre index.html en el navegador
#    — Doble clic directo, o
#    — Con Live Server en VS Code: clic derecho → "Open with Live Server"
```

> No requiere Node.js, npm ni ningún proceso de build.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 Canvas 2D | Animaciones de fondo (estrellas, meteoros, partículas, nebulosas) |
| CSS3 | Animaciones HUD, nebulosas, meteoros, card, scanlines |
| JavaScript ES6+ (Vanilla) | Motor de animación, audio, interactividad |
| Tailwind CSS (CDN) | Utilidades de layout y estilos de la tarjeta |
| Google Fonts | Orbitron (títulos) · Share Tech Mono (monoespaciado HUD) |

---

## Paleta de colores

| Variable CSS | Hex | Uso |
|---|---|---|
| `--neon-cyan` | `#00f5ff` | Elementos principales, estrellas, GitHub |
| `--neon-purple` | `#bf5fff` | Acentos, órbitas, partículas |
| `--neon-pink` | `#ff2d78` | Tags, partículas, YouTube |
| `--dark-base` | `#020210` | Fondo base profundo |

---

## Rendimiento

- El loop de animación usa `requestAnimationFrame` para sincronización con el refresco del monitor.
- Las capas de Canvas se limpian y redibujan en cada frame (`clearRect`).
- El punto de fuga y el parallax se calculan con interpolación lineal suave (lerp) para evitar saltos bruscos.

---

## Compatibilidad

Funciona en cualquier navegador moderno con soporte de Canvas 2D:

| Navegador | ✓ |
|---|---|
| Chrome / Edge | ✅ |
| Firefox | ✅ |
| Safari | ✅ |

> El autoplay de audio puede estar bloqueado por defecto en Chrome/Edge por política del navegador. El botón musical permite activarlo manualmente con un clic.

---

## Licencia

MIT License

Copyright (c) 2026 MIX DARK DEV

Se concede permiso, de forma gratuita, a cualquier persona que obtenga una copia de este software y de los archivos de documentación asociados, para utilizar el software sin restricciones, incluyendo sin limitación los derechos de usar, copiar, modificar, fusionar, publicar, distribuir y/o vender copias del mismo, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso deben incluirse en todas las copias o partes sustanciales del software.

EL SOFTWARE SE PROPORCIONA "TAL CUAL", SIN GARANTÍA DE NINGÚN TIPO.
