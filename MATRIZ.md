# Matriz maestra de producción

Cada fila es una tarea. Las columnas responden: **qué** se hace, **quién**, **con qué**, **qué se entrega**
y **cuándo está terminado**. La versión importable está en
[`plantillas/tareas-por-episodio.csv`](plantillas/tareas-por-episodio.csv).

Abreviaturas de roles (detalle en [`anexos/roles-raci.md`](anexos/roles-raci.md)):
**PE** Productor/a ejecutivo/a · **PR** Productor/a · **HO** Host · **IN** Investigación/guion ·
**SO** Sonido · **CA** Cámara/realización · **EA** Edición de audio · **EV** Edición de video ·
**DI** Diseño · **CM** Redes/community · **AN** Análisis.

Momento: **G** = día de grabación, **P** = día de publicación.

---

## Fase 0 — Desarrollo (una vez por temporada)

| ID | Tarea | Resp. | Herramienta | Entregable | Criterio de terminado | Momento |
|---|---|---|---|---|---|---|
| 0.1 | Definir propósito, audiencia y propuesta de valor | PE, HO | Biblia del show | Sección 1–2 de la biblia | Se puede explicar el show en una frase | Inicio |
| 0.2 | Investigar competencia y referentes | IN | Spotify, Apple, YouTube | Tabla de 10 referentes | Diferenciador claro | Inicio |
| 0.3 | Definir formato, segmentos y duración | PE, HO, PR | Biblia del show | Estructura tipo de episodio | Escaleta tipo aprobada | Inicio |
| 0.4 | Nombre, descripción y categorías | PE | — | Nombre + descripción corta/larga | Nombre disponible en plataformas y redes | Inicio |
| 0.5 | Identidad visual (logo, portada, plantillas de miniaturas) | DI | Figma / Photoshop | Portada 3000×3000, kit de marca | Legible a tamaño miniatura | Inicio |
| 0.6 | Identidad sonora (intro, outro, cortinillas, cama musical) | SO | DAW / librería licenciada | Paquete de audio + licencias | Licencias archivadas | Inicio |
| 0.7 | Diseño del set / escenografía (si hay video) | PR, CA | — | Plano de set y planos de cámara | Prueba de cámara aprobada | Inicio |
| 0.8 | Plan de temporada (temas e invitados) | PE, IN | Calendario editorial | Lista de N episodios | Al menos 2× episodios candidatos que slots | Inicio |
| 0.9 | Configurar hosting/RSS y cuentas | PR | Hosting elegido | Feed RSS + cuentas | Feed validado | Antes del lanzamiento |
| 0.10 | Plantillas legales (cesión de derechos) | PE | Abogado | Formato de cesión | Revisado por abogado | Antes de grabar |
| 0.11 | Episodio piloto y retro del proceso | Todos | Esta matriz | Piloto + ajustes a la matriz | Matriz corregida | Antes del lanzamiento |

## Fase 1 — Preproducción (por episodio)

| ID | Tarea | Resp. | Herramienta | Entregable | Criterio de terminado | Momento |
|---|---|---|---|---|---|---|
| 1.1 | Proponer y aprobar tema/ángulo | PE, HO | Ficha de episodio | Ficha con ángulo y objetivo | Aprobado por PE | G − 21 |
| 1.2 | Identificar y contactar invitado | PR | Plantilla de invitación | Invitación enviada | Respuesta recibida | G − 21 |
| 1.3 | Confirmar invitado, fecha y modalidad | PR | Calendario | Evento en calendario | Fecha confirmada por escrito | G − 14 |
| 1.4 | Enviar y recibir cesión de derechos firmada | PR | Firma electrónica | Cesión firmada | Archivada en carpeta legal | Antes de G |
| 1.5 | Investigación del tema e invitado | IN | Docs | Dossier de investigación | Datos verificados con fuente | G − 7 |
| 1.6 | Escaleta / guion | IN, HO | Plantilla de escaleta | Escaleta con tiempos | Aprobada por HO | G − 7 |
| 1.7 | Brief para el invitado | PR | Plantilla | Brief enviado | Invitado confirma recepción | G − 7 |
| 1.8 | Reserva de estudio, equipo y personal | PR | Calendario | Reservas confirmadas | Todo confirmado | G − 7 |
| 1.9 | Prueba técnica (invitado remoto) | SO | Plataforma remota | Prueba OK | Audio/video del invitado aprobado | G − 2 |
| 1.10 | Hoja de llamado | PR | Plantilla | Hoja enviada a todos | Todos confirman | G − 2 |
| 1.11 | Preparar tarjetas, gráficos o materiales en pantalla | DI | — | Archivos listos | Revisados | G − 1 |

## Fase 2 — Producción / grabación

| ID | Tarea | Resp. | Herramienta | Entregable | Criterio de terminado | Momento |
|---|---|---|---|---|---|---|
| 2.1 | Montaje de set, luces, cámaras y micrófonos | SO, CA | Checklist técnico | Set listo | Checklist completo | G − 2 h |
| 2.2 | Configurar formatos (48 kHz/24 bit, fps, resolución) | SO, CA | Specs técnicas | Configuración verificada | Todas las fuentes iguales | G − 2 h |
| 2.3 | Prueba de niveles y de cámara con talento | SO, CA | Grabación de prueba | Clip de prueba revisado | Picos −12 a −6 dBFS, sin ruido | G − 30 min |
| 2.4 | Recepción del invitado y briefing en sala | PR | — | — | Invitado cómodo, celular en silencio | G − 15 min |
| 2.5 | Grabación (con pistas aisladas y respaldo) | HO, SO, CA | Interfaz/grabadora, cámaras | Archivos brutos | Grabado completo sin cortes perdidos | G |
| 2.6 | Bitácora de grabación (marcas de tiempo, errores, momentos clave) | PR | Plantilla de hoja de llamado | Bitácora | Marcas para edición y clips | G |
| 2.7 | Grabar extras: intro de invitado, pickups, foto, video vertical | PR, CA | — | Material extra | Lista de extras cubierta | G |
| 2.8 | Descarga y respaldo doble (regla 3-2-1) | PR | Disco + nube | 2 copias verificadas | Tamaños/checksums coinciden | G (mismo día) |
| 2.9 | Desmontaje e inventario | SO, CA | Inventario | Equipo guardado | Nada faltante | G |

## Fase 3 — Postproducción

| ID | Tarea | Resp. | Herramienta | Entregable | Criterio de terminado | Momento |
|---|---|---|---|---|---|---|
| 3.1 | Ingesta y organización de archivos | EA/EV | Estructura de carpetas | Proyecto creado | Nombres según convención | G + 1 |
| 3.2 | Sincronización de pistas y cámaras | EV | Premiere / Resolve | Multicámara sincronizado | Sin desfase al final del archivo | G + 1 |
| 3.3 | Transcripción | EA | Descript / Whisper / Riverside | Transcripción | Revisada en nombres propios | G + 1 |
| 3.4 | Edición de contenido (corte editorial) | EA, HO | DAW / Descript | Corte 1 | Aprobado por HO/PE | G + 2 |
| 3.5 | Limpieza de audio (ruido, muletillas, respiraciones) | EA | iZotope RX / Audition | Pistas limpias | Sin ruidos que distraigan | G + 3 |
| 3.6 | Mezcla (voces, música, efectos) | EA | DAW | Mezcla | Voces balanceadas e inteligibles | G + 3 |
| 3.7 | Masterización a especificación | EA | Auphonic / limitador | Máster | −16 LUFS integrado (±1), true peak ≤ −1 dBTP | G + 3 |
| 3.8 | Edición de video (cambios de cámara, gráficos, subtítulos) | EV | Premiere / Resolve | Video horizontal | Aprobado por PE | G + 4 |
| 3.9 | Clips y cortes verticales | EV | Editor / Opus / CapCut | 3–8 clips 9:16 con subtítulos | Revisados ortografía y encuadre | G + 4 |
| 3.10 | Control de calidad (QC) completo | PR | Checklist QC | QC firmado | Checklist sin pendientes | G + 5 |
| 3.11 | Aprobación del invitado (si se acordó) | PR | — | Visto bueno | Por escrito | G + 5 |
| 3.12 | Exportar entregables finales | EA, EV | Specs técnicas | MP3/WAV, MP4, clips, SRT | Cumplen specs de cada plataforma | G + 5 |
| 3.13 | Archivar proyecto y masters | EA/EV | Disco + nube | Carpeta final | Proyecto abre desde el archivo | G + 7 |

## Fase 4 — Distribución

| ID | Tarea | Resp. | Herramienta | Entregable | Criterio de terminado | Momento |
|---|---|---|---|---|---|---|
| 4.1 | Título, descripción, notas del episodio, enlaces | PR, IN | Ficha de episodio | Metadatos | Revisados ortografía y enlaces | G + 5 |
| 4.2 | Capítulos con marcas de tiempo | EA | Hosting / YouTube | Capítulos | Coinciden con el máster | G + 5 |
| 4.3 | Portada de episodio y miniatura de YouTube | DI | Plantillas | Imágenes | Legibles en móvil | G + 5 |
| 4.4 | Subir audio (y video) al hosting; programar | PR | Hosting | Episodio programado | Vista previa revisada | G + 6 |
| 4.5 | Subir/programar en YouTube (si no es vía RSS) | PR | YouTube Studio | Video programado | Miniatura, capítulos, subtítulos, playlist | G + 6 |
| 4.6 | Verificar publicación en todas las plataformas | PR | Spotify, Apple, YouTube | Enlaces finales | Episodio visible y reproduce bien | P |
| 4.7 | Publicar transcripción / página en web | PR | Web | Página del episodio | Enlazada | P |

## Fase 5 — Promoción

| ID | Tarea | Resp. | Herramienta | Entregable | Criterio de terminado | Momento |
|---|---|---|---|---|---|---|
| 5.1 | Calendario de publicaciones del episodio | CM | Planner de redes | Calendario P − 2 a P + 14 | Programado | G + 6 |
| 5.2 | Teaser/adelanto | CM | Redes | Post | Publicado | P − 2 |
| 5.3 | Publicar clips verticales escalonados | CM | Reels, TikTok, Shorts | 3–8 publicaciones | Programadas | P a P + 14 |
| 5.4 | Kit para el invitado (clips, textos, enlaces) | CM | Drive | Kit enviado | Invitado confirma | P |
| 5.5 | Newsletter / comunidad | CM | Email | Envío | Enviado | P |
| 5.6 | Responder comentarios | CM, HO | Plataformas | — | Respuesta en < 48 h | P a P + 7 |

## Fase 6 — Medición y mejora

| ID | Tarea | Resp. | Herramienta | Entregable | Criterio de terminado | Momento |
|---|---|---|---|---|---|---|
| 6.1 | Registrar métricas a 7 días | AN | Hosting, Spotify, Apple, YouTube | Fila en tablero | Datos capturados | P + 7 |
| 6.2 | Registrar métricas a 30 días | AN | Ídem | Fila en tablero | Datos capturados | P + 30 |
| 6.3 | Retro del episodio (qué funcionó, qué no) | Todos | Ficha de episodio | 3 aprendizajes | Acciones asignadas | P + 7 |
| 6.4 | Ajustar proceso/matriz | PR | Este repositorio | Cambio en la matriz | Versionado | Mensual |
