# Fase 4 — Distribución

**Cuándo:** G + 5 a P.
**Entradas:** entregables aprobados en QC, ficha de episodio.
**Salidas:** episodio publicado y verificado en todas las plataformas.

## Cómo viaja un episodio

```
                     ┌──────────────► Apple Podcasts
  HOSTING ── RSS ────┼──────────────► Spotify (audio; video si el hosting lo admite)
  (audio + metadatos)├──────────────► Amazon, Pocket Casts, Overcast, etc.
                     └──(opcional)──► YouTube vía ingestión RSS (solo audio-first, sin anuncios)

  YOUTUBE STUDIO ─────────────────────► YouTube / YouTube Music (subida directa de video)
  SPOTIFY FOR CREATORS ───────────────► Spotify (subida directa de video)
```

El **hosting** es la fuente de verdad del audio. El video se sube directamente donde haya video
(YouTube, Spotify), salvo que el hosting elegido distribuya video por sí mismo.

## Metadatos del episodio

| Campo | Recomendación |
|---|---|
| Título | Claro y buscable; lo importante en los primeros ~60 caracteres. Evitar solo "Episodio 12". |
| Número de episodio / temporada | Llenar los campos propios del hosting, no solo en el título. |
| Tipo de episodio | Completo, tráiler o bonus. |
| Descripción | Primeras 2 líneas = gancho (es lo que se ve en el teléfono). Luego resumen, invitado, enlaces, créditos. |
| Capítulos | Marcas de tiempo `00:00 Introducción`. En YouTube el primero debe ser 00:00. |
| Contenido explícito | Marcar si aplica (lenguaje, temas). |
| Portada de episodio | Opcional; misma especificación que la del show. |
| Créditos | Host, invitado, producción, edición, música (con licencia). |
| Divulgaciones | Patrocinios o contenido de marca, también dicho en el audio. |

## Checklist de publicación

- [ ] Audio cargado al hosting y escuchado completo en la vista previa (al menos inicio, mitad y final)
- [ ] Metadatos completos y revisados
- [ ] Episodio programado a la hora definida (considerar zona horaria de la audiencia)
- [ ] Video subido a YouTube: título, descripción, capítulos, miniatura, subtítulos, playlist del podcast, pantalla final, contenido de marca si aplica
- [ ] Video en Spotify (si aplica)
- [ ] Al publicarse: verificar que aparece y reproduce en Spotify, Apple y YouTube
- [ ] Copiar los enlaces finales a la ficha del episodio
- [ ] Página del episodio en la web con transcripción (opcional, ayuda a SEO)

## Notas de plataforma

- **YouTube por RSS**: pensado para podcasts audio-first; el contenido subido no puede contener anuncios. Los episodios entran como privados primero. Borrar en YouTube no borra del RSS: para ocultar, poner en privado.
- **Apple Podcasts**: recomienda audio preacondicionado a −16 LKFS ±1 dB y true peak ≤ −1 dBFS.
- **Spotify**: normaliza la reproducción a −14 LUFS; para video recomienda MP4 H.264, 16:9, 1080p o más, AAC ≥ 128 kbps.

Detalle en [especificaciones técnicas](../anexos/especificaciones-tecnicas.md).
