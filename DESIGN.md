# DESIGN.md · Reyes Ortodoncia (v3)

Sistema de diseño inspirado en la **estructura** de [aventuradentalarts.com](https://aventuradentalarts.com/) (referencia pedida por el cliente): video a pantalla completa al inicio, titulares serif enormes, bandas claras que alternan con oscuras, paneles fijados con imágenes en blanco y negro y un video que avanza con el scroll. No se copió código, imágenes, textos ni marca: todo el material visual es propio.

## Tema
Grafito casi negro con bandas gris claro. Plata y blanco como únicos acentos. Fotografía y video monocromáticos generados para este sitio (objetos de ortodoncia, sin personas), más fotos y videos reales de los casos del consultorio.

## Color
| Rol | Valor |
|---|---|
| Fondo | `#131418` · secundario `#1a1b20` · tarjetas `#202127` |
| Banda clara | `#e8e8ea` con texto `#131418` |
| Texto | `#f4f4f6`, cuerpo `#c9c9cd`, tenue `#8b8c93` |
| Línea fina | `rgba(255,255,255,.14)` (sobre claro `rgba(19,20,24,.16)`) |

## Tipografía
- **Titulares:** Instrument Serif (regular y cursiva), interletrado negativo, tamaños de hasta ~196 px.
- **Cuerpo y botones:** Inter Tight (variable).
- **Etiquetas técnicas:** JetBrains Mono, mayúsculas, 11 px.

## Forma
Botones en píldora, tarjetas con 16-24 px de radio, líneas finas, imágenes en blanco y negro con degradado oscuro encima del texto.

## Movimiento (GSAP + ScrollTrigger + Lenis, un solo reloj)
1. **Pantalla de carga** con el logo (brillo plateado y barra) que sube como cortina.
2. **Hero:** video en bucle que se atenúa al reiniciar, titular que sube línea por línea.
3. **Meta:** texto que se llena palabra por palabra con el scroll.
4. **Tratamientos:** panel fijado; cada tramo de scroll cambia imagen y título.
5. **Proceso:** el video del alambre avanza con el scroll y se encienden los brackets.
6. **Cierre:** imagen con parallax y cortina curva que revela el contacto.
- Respeta «reducir movimiento» y tiene botón «Pausar animaciones».
