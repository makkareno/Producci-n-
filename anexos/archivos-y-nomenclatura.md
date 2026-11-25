# Archivos, nomenclatura y respaldo

## Estructura de carpetas por episodio

```
PODCAST/
├── 00_MARCA/                  logos, tipografías, plantillas, música con licencias
├── 01_LEGAL/                  cesiones firmadas, contratos, licencias
├── T01/                       temporada
│   └── T01E03_2026-12-02_Apellido-Invitado/
│       ├── 01_PREPRO/         ficha, investigación, escaleta, brief
│       ├── 02_BRUTOS/
│       │   ├── AUDIO/
│       │   ├── CAM-A/
│       │   ├── CAM-B/
│       │   ├── CAM-C/
│       │   └── REMOTO/
│       ├── 03_PROYECTOS/      sesiones de DAW y editor de video
│       ├── 04_EXPORTS/
│       │   ├── AUDIO/         máster WAV, MP3 distribución
│       │   ├── VIDEO/         horizontal final
│       │   ├── CLIPS/         verticales
│       │   └── SUBS/          SRT, transcripción
│       ├── 05_GRAFICOS/       portada, miniatura, piezas de redes
│       └── 06_DOCS/           bitácora, QC, métricas
└── PLANTILLAS/
```

## Nomenclatura de archivos

```
[SHOW]_[TxxEyy]_[AAAA-MM-DD]_[TIPO]_[DETALLE]_v[NN].[ext]
```

| Ejemplo | Qué es |
|---|---|
| `PDC_T01E03_2026-12-02_AUD_HOST.wav` | Pista bruta del host |
| `PDC_T01E03_2026-12-02_AUD_INV.wav` | Pista bruta del invitado |
| `PDC_T01E03_2026-12-02_CAM-A_001.mp4` | Cámara A, archivo 1 |
| `PDC_T01E03_MASTER_v02.wav` | Máster de audio, versión 2 |
| `PDC_T01E03_DIST.mp3` | Audio de distribución |
| `PDC_T01E03_VIDEO-16x9_v03.mp4` | Video horizontal |
| `PDC_T01E03_CLIP-02_9x16_v01.mp4` | Clip vertical 2 |
| `PDC_T01E03_SUBS_ES.srt` | Subtítulos |

Reglas: sin espacios ni acentos ni ñ en nombres de archivo; fecha siempre AAAA-MM-DD; la palabra
`FINAL` está prohibida (usar números de versión).

`PDC` = abreviatura del show **[POR DEFINIR]**.

## Respaldo y retención

| Material | Copias | Retención |
|---|---|---|
| Brutos de audio | 3 (trabajo + respaldo + nube) | Permanente (pesan poco) |
| Brutos de video | 3 hasta publicar; luego 2 | [POR DEFINIR] p. ej. 12 meses y después solo masters |
| Proyectos | 2 | Permanente |
| Masters y exports | 3 | Permanente |
| Legal | 2 (una en nube) | Permanente |

Estimación de espacio: 1 h de video 4K por cámara ≈ 40–100 GB según códec; 1080p ≈ 10–30 GB.
Audio WAV 48/24 ≈ 0.5 GB por hora por pista.
