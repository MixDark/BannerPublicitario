# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [Unreleased]

### Por hacer
- Soporte para múltiples temas de color.
- Versión adaptada para dispositivos móviles.
- Opciones de configuración externos (colores, velocidad, densidad de estrellas).

---

## [1.1.0] — 2026-03-03

### Cambiado
- Licencia actualizada a **MIT**.
- README ampliado con documentación detallada: descripción de cada sistema de animación, compatibilidad de navegadores, notas de rendimiento y texto completo de la licencia MIT.

## [1.0.0] — 2026-03-03

### Añadido
- Estructura inicial del proyecto: `index.html`, `main.js`, `style.css`.
- Fondo animado con campo de estrellas tipo warp (3 capas de profundidad) renderizado en Canvas 2D con punto de fuga dinámico que sigue al cursor.
- Sistema de meteoros radiales (28 instancias) con gradiente, halo y delay aleatorio.
- Partículas de energía (`SparkParticle`, 60 instancias) con trayectorias Lissajous, flash burst y 4 colores neón.
- Nebulosas en Canvas (10 instancias) animadas con gradiente radial.
- Nebulosas CSS, meteoros CSS, planetas decorativos y overlay de scanlines.
- Grid HUD, rayo de escaneo y esquinas HUD decorativas.
- Tarjeta de perfil con avatar SVG (globo terráqueo), anillo giratorio y dos órbitas.
- Título con efecto glitch animado y split dinámico de letras en JS.
- Links a redes sociales (GitHub, YouTube, LinkedIn) con efecto hover sweep.
- Contador HUD decorativo en tiempo real.
- Reproductor de música de fondo con autoplay, fade in/out y botón con visualizador EQ.
- Integración de Tailwind CSS vía CDN con fuentes Orbitron y Share Tech Mono.
- Paleta de colores neón definida mediante variables CSS (`:root`).
