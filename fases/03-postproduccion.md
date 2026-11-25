# Fase 3 — Postproducción

**Cuándo:** de G + 1 a G + 5.
**Entradas:** archivos brutos, bitácora, escaleta.
**Salidas:** máster de audio, video horizontal, clips verticales, subtítulos, transcripción, capítulos.

## Orden de trabajo

El orden importa: **sincronizar antes de cortar** y **cortar contenido antes de pulir**.

```
1. Ingesta y organización
2. Sincronización (audio ↔ cámaras)
3. Transcripción
4. Corte editorial (qué se queda)          ← aprobación de HO/PE
5. Limpieza de audio
6. Mezcla
7. Masterización a −16 LUFS
8. Edición de video sobre el audio final   ← aprobación de PE
9. Clips verticales y subtítulos
10. QC
11. Exportación de entregables
12. Archivo
```

## 1–3. Ingesta, sincronía y transcripción

- Copiar a la estructura de carpetas del episodio ([convención](../anexos/archivos-y-nomenclatura.md)).
- Renombrar archivos según convención **antes** de importarlos.
- Sincronizar por forma de onda o timecode; revisar el desfase al **final** del archivo, no solo al principio.
- Transcribir (Descript, Riverside, Whisper, Premiere). Corregir nombres propios: la transcripción se reutiliza para subtítulos, notas y SEO.

## 4. Corte editorial

- Quitar: arranques en falso, repeticiones, tramos sin valor, información que el invitado pidió retirar.
- Mantener: naturalidad. No eliminar todas las pausas ni todas las muletillas; suena robótico.
- Validar que las **3 preguntas imprescindibles** sobreviven.
- Marcar en la transcripción los candidatos a clip.

## 5–7. Audio: limpieza, mezcla y masterización

Cadena típica por pista de voz:

| Paso | Qué hace | Referencia |
|---|---|---|
| Reducción de ruido | Quita ruido de fondo constante | Suave; demasiado deja voz "metálica" |
| Filtro paso-altos | Quita retumbo grave | ~80 Hz (voz grave) a ~100 Hz |
| De-esser | Suaviza las "s" | Solo si sobresalen |
| Ecualización | Claridad y cuerpo | Correctiva primero, luego de carácter |
| Compresión | Nivela la dinámica | Ratio 2:1–4:1, 3–6 dB de reducción |
| Nivelación | Iguala voces entre sí | Auphonic o manual |
| Limitador en máster | Controla picos | True peak ≤ −1 dBTP |

**Objetivo del máster:** −16 LUFS integrado (±1), true peak ≤ −1 dBTP.
Ver [especificaciones técnicas](../anexos/especificaciones-tecnicas.md).

Música: por debajo de la voz (típicamente 15–25 dB menos cuando hay habla). Que no compita.

## 8–9. Video

- Editar el video **sobre el audio final** (o al menos sobre el corte editorial cerrado).
- Cambios de cámara siguiendo a quien habla, con reacciones del que escucha; usar el plano general para disimular cortes.
- Gráficos: nombre del invitado (zócalo/lower third) en los primeros minutos, temas, datos.
- Subtítulos: archivo SRT para YouTube; subtítulos quemados en clips verticales.
- Corrección de color básica para igualar cámaras.
- Clips verticales 9:16: gancho en los primeros 2–3 segundos, 20–90 s, subtítulos grandes y legibles, encuadre centrado en el rostro.

## 10. Control de calidad (QC)

Usar [`plantillas/checklist-qc.md`](../plantillas/checklist-qc.md). Lo hace **alguien que no editó** el episodio, de preferencia escuchando con audífonos y también en bocina de celular.

## 11. Entregables

| Entregable | Formato | Destino |
|---|---|---|
| Máster de archivo | WAV 48 kHz / 24 bit | Archivo |
| Audio de distribución | MP3 (ver specs) | Hosting/RSS |
| Video horizontal | MP4 H.264, 1080p o más, 16:9, AAC | YouTube, Spotify |
| Clips verticales | MP4 9:16, 1080×1920 | Reels, TikTok, Shorts |
| Subtítulos | SRT | YouTube, web |
| Transcripción | TXT/DOCX | Web, notas |
| Capítulos | Lista de marcas de tiempo | Descripción, hosting |

## 12. Archivo

- Guardar proyecto, masters y brutos según política de retención (ver [archivos](../anexos/archivos-y-nomenclatura.md)).
- Probar que el proyecto abre desde la copia de archivo.
