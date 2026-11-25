# Sistema de Producción de Podcast

Proceso, matriz y plantillas para producir un podcast (audio y/o video) de punta a punta,
de forma repetible, episodio tras episodio.

> **Estado:** v0.1. Es el marco general. Varias decisiones están marcadas como **[POR DEFINIR]**
> y se cierran en `DECISIONES.md` conforme avancemos.

## Cómo está organizado

| Archivo | Para qué sirve |
|---|---|
| [`MATRIZ.md`](MATRIZ.md) | **La matriz maestra**: cada fase, sus tareas, entregables, responsable, herramienta y criterio de "terminado". |
| [`DECISIONES.md`](DECISIONES.md) | Decisiones de fondo (formato, cadencia, equipo, presupuesto) que condicionan todo lo demás. |
| [`fases/00-desarrollo.md`](fases/00-desarrollo.md) | Una sola vez por temporada: concepto, audiencia, formato, identidad. |
| [`fases/01-preproduccion.md`](fases/01-preproduccion.md) | Por episodio: tema, investigación, invitado, escaleta, logística. |
| [`fases/02-produccion.md`](fases/02-produccion.md) | Día de grabación: montaje, pruebas, grabación, respaldo. |
| [`fases/03-postproduccion.md`](fases/03-postproduccion.md) | Edición de audio y video, mezcla, masterización, control de calidad. |
| [`fases/04-distribucion.md`](fases/04-distribucion.md) | Publicación en hosting/RSS, Spotify, Apple, YouTube. |
| [`fases/05-promocion.md`](fases/05-promocion.md) | Clips, redes, newsletter, invitado como amplificador. |
| [`fases/06-medicion.md`](fases/06-medicion.md) | Métricas, revisión del episodio y mejora continua. |
| [`anexos/especificaciones-tecnicas.md`](anexos/especificaciones-tecnicas.md) | Especificaciones de grabación y entrega por plataforma (verificadas nov-2026). |
| [`anexos/roles-raci.md`](anexos/roles-raci.md) | Roles del equipo y matriz RACI; cómo escalar de 1 a 8+ personas. |
| [`anexos/equipo-tecnico.md`](anexos/equipo-tecnico.md) | Inventario de equipo por nivel (básico / intermedio / estudio). |
| [`anexos/archivos-y-nomenclatura.md`](anexos/archivos-y-nomenclatura.md) | Estructura de carpetas, nombres de archivo y política de respaldo. |
| [`anexos/legal.md`](anexos/legal.md) | Cesión de derechos de invitados, música, patrocinios. |
| [`plantillas/`](plantillas/) | Plantillas listas para copiar: biblia del show, ficha de episodio, escaleta, hoja de llamado, QC, invitación. |
| [`plantillas/tareas-por-episodio.csv`](plantillas/tareas-por-episodio.csv) | La matriz en CSV para importar a Notion, Airtable, Sheets, ClickUp o Trello. |

## El flujo en una línea

```
DESARROLLO (1 vez) → PREPRODUCCIÓN → PRODUCCIÓN → POSTPRODUCCIÓN → DISTRIBUCIÓN → PROMOCIÓN → MEDICIÓN
                          ↑                                                                     │
                          └──────────────────── aprendizajes alimentan el siguiente episodio ───┘
```

## Calendario tipo por episodio (cadencia semanal)

Día **G** = día de grabación. Día **P** = día de publicación.

| Momento | Hito | Fase |
|---|---|---|
| G − 21 a G − 14 | Tema aprobado, invitado confirmado | Preproducción |
| G − 7 | Investigación y escaleta lista; brief enviado al invitado | Preproducción |
| G − 2 | Prueba técnica con invitado (si es remoto); hoja de llamado enviada | Preproducción |
| G | Grabación + respaldo doble el mismo día | Producción |
| G + 1 a G + 4 | Edición de audio/video, mezcla, máster | Postproducción |
| G + 5 | Control de calidad (QC) y aprobación | Postproducción |
| G + 5 | Metadatos, portada, clips, programación | Distribución / Promoción |
| **P = G + 7** | Publicación + arranque de promoción | Distribución / Promoción |
| P + 7 / P + 30 | Lectura de métricas y retro | Medición |

Recomendación de arranque: tener **3–4 episodios grabados en banco** antes del lanzamiento.

## Próximos pasos

1. Cerrar las decisiones de `DECISIONES.md` (formato, cadencia, equipo, presupuesto).
2. Llenar la biblia del show (`plantillas/biblia-del-show.md`).
3. Ajustar la matriz a esas decisiones (quitar lo que no aplica).
4. Hacer un episodio piloto con el proceso completo y corregir.
