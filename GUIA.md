# Web de Reyes Ortodoncia: guía rápida

Página estática hecha con Astro 7, GSAP (DrawSVG + ScrollTrigger) y Lenis. Estética negro, grafito y plata, igual que el video del caso.

## Material generado en Google Flow (9-nov-2026)
En `public/flow/`: 3 videos de 8 s (`v-hero`, `v-modelos`, `v-alambre`), el bucle del inicio (`hero.mp4`, une los dos primeros), el video que avanza con el scroll (`scrub-alambre.mp4`, intra-frame) y 5 imágenes en blanco y negro (`.webp`/`.jpg`). Son imágenes de objetos, sin personas. Para regenerar o cambiar alguna, usa Flow con el mismo estilo (prompts: macro en blanco y negro, fondo grafito, sin texto ni personas).

## Cómo verla
- Doble clic en `ABRIR-WEB.bat` (instala la primera vez y abre http://localhost:4321).
- O en una terminal: `npm install` y `npm run dev`.

## Cómo publicarla
1. `npm run build` crea la carpeta `dist/` (unos 38 MB, casi todo videos).
2. Súbela a Cloudflare Pages o Netlify (arrastrar la carpeta `dist`).
3. Conecta el dominio que compres. No hay dominio ni hosting contratado.

## Dónde editar
| Qué | Archivo |
|---|---|
| Teléfono, WhatsApp, dirección, redes, horarios sugeridos, calendario Cal.com | `src/config.ts` |
| Casos de la galería (título, resumen, etiquetas) | `src/data/casos.ts` |
| Plan del caso destacado y piezas resaltadas | `src/data/casos.ts` (`PLAN_DESTACADO`) |
| Textos de todas las secciones, preguntas frecuentes, servicios | `src/pages/index.astro` |
| Colores y diseño | `src/styles/global.css` (variables al inicio) |
| Animaciones | `src/scripts/main.ts` |
| Videos y fotos de los casos | `public/casos/` (el nombre es el id del video de TikTok) |

## Agregar un caso
1. Comprime el video: `ffmpeg -i entrada.mp4 -t 60 -vf scale=576:-2 -c:v libx264 -crf 27 -pix_fmt yuv420p -c:a aac -b:a 64k -movflags +faststart public/casos/NOMBRE.mp4`
2. Saca la portada: `ffmpeg -ss 1.5 -i entrada.mp4 -frames:v 1 -vf scale=576:-2 public/casos/NOMBRE.jpg`
3. Añade un bloque en `src/data/casos.ts` con `id: "NOMBRE"`.

## Citas
- **Ahora:** el visitante elige día y horario y se abre WhatsApp con el mensaje armado. No es un calendario con disponibilidad real: los horarios son sugeridos y el doctor confirma.
- **Calendario real:** crea una cuenta en Cal.com, conecta el Google Calendar del doctor, crea un evento "Evaluación de ortodoncia" y escribe `"usuario/evento"` en `calLink` de `src/config.ts`. La web mostrará pestañas «Calendario en línea» y «Por WhatsApp».

## Pendientes antes de publicar
- **Consentimiento de los pacientes** para mostrar fotos y videos (hay bocas de pacientes reales).
- **Horarios y días** sugeridos (`slots` y `days` en `src/config.ts`): son provisionales.
- **Datos del doctor:** confirmar «docente universitario» (la investigación lo ubicó como docente de la USAT), número de colegiatura y estudios. No se inventó ninguno.
- **Preguntas frecuentes y textos de proceso:** son generales; el doctor debe revisarlos.
- **Dominio y hosting.** Revisar metadatos (título y descripción) con el dominio final.
- Foto del doctor y del consultorio (hoy se usa el logo).

## Accesibilidad y movimiento
- Respeta «reducir movimiento» del sistema y tiene botón «Pausar animaciones» en el pie.
- Menú, filtros, plan del caso, deslizador antes/después y ventana de video se manejan con teclado. La ventana cierra con Esc y devuelve el foco.
- Se probó en escritorio (1440 px) y móvil (375 px) en Chrome. No se probó en Safari ni en celulares reales.
