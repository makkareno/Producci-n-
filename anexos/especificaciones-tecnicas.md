# Especificaciones técnicas

Revisado: **noviembre 2026**. Las plataformas cambian sus especificaciones; volver a revisar las fuentes oficiales antes de cada temporada.

## Grabación (captura)

| Parámetro | Valor | Por qué |
|---|---|---|
| Frecuencia de muestreo | **48 kHz** en todo (interfaz, grabadora, cámaras, plataforma remota) | Estándar de video; evita desfase. |
| Profundidad de bits | 24 bit (o 32 bit flotante si la grabadora lo permite) | Margen para errores de ganancia. |
| Formato | WAV / BWF, una pista por micrófono | Edición independiente de cada voz. |
| Niveles | Picos entre −12 y −6 dBFS | Margen sin saturar. |
| Video | Misma resolución y fps en todas las cámaras; 1080p mínimo, 4K si se recortarán clips verticales | Recorte a 9:16 sin perder calidad. |
| fps | 24, 25, 30 (o 50/60); elegir uno y mantenerlo | Spotify acepta 24/25/30/50/60. |

## Máster de audio (entrega)

| Parámetro | Valor | Fuente |
|---|---|---|
| Sonoridad integrada | **−16 LUFS (LKFS) ±1 dB** | Apple Podcasts |
| True peak | **≤ −1 dBTP** | Apple Podcasts |
| Medición | ITU-R BS.1770 | Apple / Spotify |
| Spotify | Normaliza reproducción a −14 LUFS; un máster a −16 se reproduce bien | Spotify |
| Archivo | WAV 48 kHz / 24 bit | Interno |
| Distribución | MP3 128 kbps estéreo (o 96 kbps mono si todo es voz), 44.1 o 48 kHz | Práctica común; confirmar con el hosting |

> Apple pide preacondicionar la sonoridad **antes** de codificar a MP3/AAC: el códec no corrige la
> sonoridad y puede recortar si no se respeta el true peak.

## Video podcast — Spotify

| Parámetro | Recomendado | Aceptado |
|---|---|---|
| Contenedor | MP4 | MOV |
| Códec de video | H.264 | Otros |
| Resolución | 1080p o más | Desde 180p |
| Relación de aspecto | 16:9 | Cualquiera (con barras) |
| Bitrate (1080p) | 25 Mbit/s CBR | — |
| fps | 24, 25, 30, 50, 60 | — |
| Keyframe | ~1 por segundo | — |
| Color | Rec.709 SDR, progresivo, 8 o 10 bit | — |
| Audio | AAC-LC, ≥ 128 kbps, estéreo | Mono (se convierte) |
| Tamaño | < 10 GB | Hasta 60 GB |
| Duración | < 4 h | Hasta 12 h |

## Video — YouTube

| Parámetro | Recomendación |
|---|---|
| Contenedor / códec | MP4, H.264, audio AAC |
| Resolución | 1080p o 4K, 16:9 |
| Miniatura | 1280×720, JPG/PNG, texto legible en móvil |
| Subtítulos | Archivo SRT revisado |
| Capítulos | En la descripción, primero en 00:00, mínimo 3 |
| Playlist | Marcada como podcast para que aparezca en YouTube Music |
| Ingesta RSS | Solo podcasts audio-first; sin anuncios en el contenido; entran como privados |

## Clips verticales

| Parámetro | Valor |
|---|---|
| Resolución | 1080×1920 (9:16) |
| Duración | 20–90 s (Shorts admite hasta 3 min) |
| Subtítulos | Quemados, dentro de la zona segura |
| Formato | MP4 H.264, AAC |

## Portadas

| Pieza | Especificación |
|---|---|
| Portada del show | 3000×3000 px (mínimo 1400×1400), cuadrada, JPG o PNG, RGB, **sin transparencia** |
| Portada de episodio | Igual que la del show |
| Miniatura YouTube | 1280×720 |

## Fuentes

- [Apple Podcasts — Audio requirements](https://podcasters.apple.com/support/audio-requirements)
- [Apple Podcasts — Artwork requirements](https://podcasters.apple.com/support/artwork-requirements)
- [Spotify — Video specs](https://support.spotify.com/creators/article/video-specs/)
- [Spotify — Loudness normalization](https://artists.spotify.com/help/article/loudness-normalization)
- [YouTube — Deliver podcasts using an RSS feed](https://support.google.com/youtube/answer/13525207)
- [YouTube — Publish or disconnect RSS episodes](https://support.google.com/youtube/answer/13973017)
- [Auphonic — The new loudness target war](https://auphonic.com/blog/2019/06/12/the-new-loudness-target-war/)
