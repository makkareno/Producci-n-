/* Catálogo base del sistema. Fuente: docs/arquitectura.html (v0.5) y MATRIZ.md. */

export const AREAS = [
  { id: "dir", nombre: "Dirección", color: "#A595FF", orden: 1 },
  { id: "cont", nombre: "Contenido", color: "#E2B045", orden: 2 },
  { id: "prod", nombre: "Producción y Técnica", color: "#4CC7B3", orden: 3 },
  { id: "post", nombre: "Postproducción y Diseño", color: "#F07BC6", orden: 4 },
  { id: "aud", nombre: "Audiencia y Negocio", color: "#6FAEFF", orden: 5 },
  { id: "adm", nombre: "Administración y Legal", color: "#A4AEBD", orden: 6 },
] as const;

export const DEPARTAMENTOS = [
  { codigo: "DIR", areaId: "dir", nombre: "Dirección y Producción Ejecutiva", orden: 1 },
  { codigo: "EDIT", areaId: "cont", nombre: "Contenido y Editorial", orden: 2 },
  { codigo: "PROD", areaId: "prod", nombre: "Producción y Coordinación", orden: 3 },
  { codigo: "SON", areaId: "prod", nombre: "Audio", orden: 4 },
  { codigo: "VID", areaId: "prod", nombre: "Video y Realización", orden: 5 },
  { codigo: "POST", areaId: "post", nombre: "Postproducción", orden: 6 },
  { codigo: "DIS", areaId: "post", nombre: "Diseño y Marca", orden: 7 },
  { codigo: "MKT", areaId: "aud", nombre: "Distribución y Marketing", orden: 8 },
  { codigo: "DATA", areaId: "aud", nombre: "Datos y Análisis", orden: 9 },
  { codigo: "COM", areaId: "aud", nombre: "Comercial y Alianzas", orden: 10 },
  { codigo: "ADM", areaId: "adm", nombre: "Administración, Finanzas y Legal", orden: 11 },
] as const;

type Rol = { codigo: string; departamento: string; nombre: string; resumen: string; responsable?: boolean };

export const ROLES: Rol[] = [
  { codigo: "PE", departamento: "DIR", nombre: "Productor/a ejecutivo/a", resumen: "Dueño/a de la visión y de las decisiones finales.", responsable: true },
  { codigo: "ED", departamento: "EDIT", nombre: "Editor/a de contenido", resumen: "Diseña qué se dice y en qué orden.", responsable: true },
  { codigo: "HO", departamento: "EDIT", nombre: "Host / conductor(a)", resumen: "La voz y la cara del show." },
  { codigo: "IN", departamento: "EDIT", nombre: "Investigador/a", resumen: "Llega con los datos correctos antes de grabar." },
  { codigo: "PR", departamento: "PROD", nombre: "Productor/a", resumen: "Hace que todo pase a tiempo y mantiene el sistema al día.", responsable: true },
  { codigo: "BK", departamento: "PROD", nombre: "Booker de invitados", resumen: "Consigue y cuida a los invitados." },
  { codigo: "AP", departamento: "PROD", nombre: "Asistente de producción", resumen: "Resuelve la logística del día de grabación." },
  { codigo: "SO", departamento: "SON", nombre: "Ingeniero/a de sonido", resumen: "Responde por la calidad del audio grabado.", responsable: true },
  { codigo: "RE", departamento: "VID", nombre: "Realizador/a", resumen: "Decide cómo se ve el show.", responsable: true },
  { codigo: "CA", departamento: "VID", nombre: "Camarógrafo/a", resumen: "Opera las cámaras." },
  { codigo: "IL", departamento: "VID", nombre: "Iluminador/a", resumen: "Hace que el set y las personas se vean bien." },
  { codigo: "CP", departamento: "POST", nombre: "Coordinador/a de postproducción", resumen: "Ordena el trabajo de edición y las versiones.", responsable: true },
  { codigo: "EA", departamento: "POST", nombre: "Editor/a de audio", resumen: "Deja el audio final listo para publicar." },
  { codigo: "EV", departamento: "POST", nombre: "Editor/a de video", resumen: "Arma el episodio en video." },
  { codigo: "CL", departamento: "POST", nombre: "Editor/a de clips", resumen: "Convierte los mejores momentos en clips verticales." },
  { codigo: "DG", departamento: "DIS", nombre: "Diseñador/a gráfico/a", resumen: "Cuida la identidad visual en cada pieza.", responsable: true },
  { codigo: "MO", departamento: "DIS", nombre: "Motion designer", resumen: "Da movimiento a la marca." },
  { codigo: "EG", departamento: "MKT", nombre: "Estratega de crecimiento", resumen: "Decide cómo crece la audiencia.", responsable: true },
  { codigo: "RP", departamento: "MKT", nombre: "Responsable de publicación", resumen: "Sube cada episodio y verifica que funcione." },
  { codigo: "CM", departamento: "MKT", nombre: "Community manager", resumen: "Mueve el episodio en redes y cuida a la comunidad." },
  { codigo: "AN", departamento: "DATA", nombre: "Analista", resumen: "Convierte las cifras en decisiones.", responsable: true },
  { codigo: "VE", departamento: "COM", nombre: "Ejecutivo/a comercial", resumen: "Consigue patrocinios y alianzas.", responsable: true },
  { codigo: "AM", departamento: "COM", nombre: "Account manager", resumen: "Cumple lo prometido al patrocinador." },
  { codigo: "AD", departamento: "ADM", nombre: "Administrador/a", resumen: "Lleva el dinero, los papeles y el inventario.", responsable: true },
  { codigo: "CO", departamento: "ADM", nombre: "Contador/a", resumen: "Mantiene en orden la contabilidad y los impuestos." },
  { codigo: "AB", departamento: "ADM", nombre: "Abogado/a", resumen: "Protege al show en lo legal." },
];

/* Roles que ven y pueden mover todo dentro de un proyecto */
export const ROLES_DIRECCION = ["PE", "PR"];

export const FORMATOS = [
  { id: "podcast", nombre: "Podcast", unidadSingular: "episodio", unidadPlural: "episodios", activo: true },
  { id: "comercial", nombre: "Comercial", unidadSingular: "pieza", unidadPlural: "piezas", activo: false },
  { id: "cortometraje", nombre: "Cortometraje", unidadSingular: "corte", unidadPlural: "cortes", activo: false },
  { id: "contenido", nombre: "Contenido", unidadSingular: "pieza", unidadPlural: "piezas", activo: false },
  { id: "promo", nombre: "Promo", unidadSingular: "pieza", unidadPlural: "piezas", activo: false },
];

/* ───────────── Plantilla: Podcast v1 ───────────── */

export const PLANTILLA_PODCAST = { id: "podcast-v1", formatoId: "podcast", nombre: "Podcast · proceso estándar", version: 1, diasGaP: 7 };

export const FASES = [
  { codigo: "F1", nombre: "Preproducción", orden: 1 },
  { codigo: "F2", nombre: "Producción", orden: 2 },
  { codigo: "F3", nombre: "Postproducción", orden: 3 },
  { codigo: "F4", nombre: "Distribución", orden: 4 },
  { codigo: "F5", nombre: "Promoción", orden: 5 },
  { codigo: "F6", nombre: "Medición", orden: 6 },
];

export const ESTADOS = [
  { codigo: "E01", nombre: "Idea", descripcion: "En el banco de temas", puerta: null },
  { codigo: "E02", nombre: "Aprobado", descripcion: "Tema e invitado aprobados", puerta: "P1" },
  { codigo: "E03", nombre: "En preproducción", descripcion: "Investigación, escaleta, logística", puerta: null },
  { codigo: "E04", nombre: "Listo para grabar", descripcion: "Todo confirmado", puerta: "P2" },
  { codigo: "E05", nombre: "Grabado", descripcion: "Brutos respaldados", puerta: "P3" },
  { codigo: "E06", nombre: "En edición", descripcion: "Corte, mezcla, video", puerta: null },
  { codigo: "E07", nombre: "En revisión", descripcion: "Corte final y control de calidad", puerta: "P4" },
  { codigo: "E08", nombre: "Aprobado final", descripcion: "Listo para salir", puerta: "P5" },
  { codigo: "E09", nombre: "Programado", descripcion: "Cargado con fecha y hora", puerta: null },
  { codigo: "E10", nombre: "Publicado", descripcion: "Visible en todas las plataformas", puerta: "P6" },
  { codigo: "E11", nombre: "Cerrado", descripcion: "Métricas y retro hechas", puerta: "P7" },
];

export const PUERTAS = [
  { codigo: "P1", nombre: "Tema aprobado", rolAprueba: "PE", requisitos: ["1.1"], descripcion: "Ángulo claro, invitado viable y lugar en el calendario." },
  { codigo: "P2", nombre: "Listo para grabar", rolAprueba: "PR", requisitos: ["1.3", "1.4", "1.6", "1.8", "1.10"], descripcion: "Invitado confirmado, autorización firmada, escaleta aprobada, estudio y equipo reservados, hoja de llamado enviada." },
  { codigo: "P3", nombre: "Respaldo verificado", rolAprueba: "PR", requisitos: ["2.5", "2.8"], descripcion: "Tres copias de todos los brutos verificadas antes de formatear tarjetas." },
  { codigo: "P4", nombre: "Corte aprobado", rolAprueba: "PE", requisitos: ["3.4"], descripcion: "El host y Dirección aprueban el contenido; pasan las 3 preguntas imprescindibles." },
  { codigo: "P5", nombre: "Control de calidad", rolAprueba: "PR", requisitos: ["3.10", "3.12"], descripcion: "Checklist completo: −16 LUFS, sincronía, subtítulos, metadatos y patrocinios declarados." },
  { codigo: "P6", nombre: "Publicación verificada", rolAprueba: "PR", requisitos: ["4.6"], descripcion: "El episodio aparece y se reproduce en Spotify, Apple y YouTube; enlaces guardados." },
  { codigo: "P7", nombre: "Cierre", rolAprueba: "AN", requisitos: ["6.2", "6.3"], descripcion: "Métricas a 30 días registradas y retro con acciones asignadas." },
];

type T = [codigo: string, nombre: string, hace: string[], aprueba: string, ref: "G" | "P", desfase: number, entregable: string, criterio: string];

const T_: T[] = [
  // F1 · Preproducción
  ["1.1", "Proponer y aprobar tema y ángulo", ["ED"], "PE", "G", -21, "Ficha con ángulo y objetivo", "Aprobado por PE"],
  ["1.2", "Identificar y contactar al invitado", ["BK"], "PR", "G", -21, "Invitación enviada", "Respuesta recibida"],
  ["1.3", "Confirmar invitado, fecha y modalidad", ["BK"], "PR", "G", -14, "Evento en calendario", "Fecha confirmada por escrito"],
  ["1.4", "Autorización firmada del invitado", ["BK"], "PR", "G", -7, "Autorización firmada", "Archivada en carpeta legal"],
  ["1.5", "Investigación del tema e invitado", ["IN"], "ED", "G", -7, "Dossier de investigación", "Datos verificados con fuente"],
  ["1.6", "Escaleta con tiempos", ["ED"], "HO", "G", -7, "Escaleta con tiempos", "Aprobada por el host"],
  ["1.7", "Brief para el invitado", ["BK"], "PR", "G", -7, "Brief enviado", "El invitado confirma recepción"],
  ["1.8", "Reserva de estudio, equipo y personal", ["AP"], "PR", "G", -7, "Reservas confirmadas", "Todo confirmado"],
  ["1.9", "Prueba técnica con invitado remoto", ["SO"], "PR", "G", -2, "Prueba OK", "Audio y video del invitado aprobados"],
  ["1.10", "Hoja de llamado", ["AP"], "PR", "G", -2, "Hoja enviada a todos", "Todos confirman"],
  ["1.11", "Gráficos y materiales en pantalla", ["DG"], "RE", "G", -1, "Archivos listos", "Revisados"],
  // F2 · Producción
  ["2.1", "Montaje de set, luces, cámaras y micrófonos", ["SO", "RE", "IL"], "PR", "G", 0, "Set listo", "Checklist técnico completo"],
  ["2.2", "Configurar formatos (48 kHz / 24 bit, fps, resolución)", ["SO", "CA"], "RE", "G", 0, "Configuración verificada", "Todas las fuentes iguales"],
  ["2.3", "Prueba de niveles y de cámara con talento", ["SO", "CA"], "PR", "G", 0, "Clip de prueba revisado", "Picos de −12 a −6 dBFS, sin ruido"],
  ["2.4", "Recepción y briefing del invitado", ["AP"], "PR", "G", 0, "—", "Invitado listo, celular en silencio"],
  ["2.5", "Grabación con pistas aisladas y respaldo", ["HO", "SO", "RE", "CA"], "PR", "G", 0, "Archivos brutos", "Grabado completo"],
  ["2.6", "Bitácora de grabación", ["AP"], "PR", "G", 0, "Bitácora", "Marcas para edición y clips"],
  ["2.7", "Grabar extras: intro, pickups, foto y vertical", ["CA"], "RE", "G", 0, "Material extra", "Lista de extras cubierta"],
  ["2.8", "Descarga y respaldo 3-2-1", ["AP", "SO"], "PR", "G", 0, "Copias verificadas", "Tamaños o checksums coinciden"],
  ["2.9", "Desmontaje e inventario", ["SO", "CA"], "PR", "G", 0, "Equipo guardado", "Nada faltante"],
  // F3 · Postproducción
  ["3.1", "Ingesta y organización de archivos", ["EA", "EV"], "CP", "G", 1, "Proyecto creado", "Nombres según convención"],
  ["3.2", "Sincronización de pistas y cámaras", ["EV"], "CP", "G", 1, "Multicámara sincronizado", "Sin desfase al final del archivo"],
  ["3.3", "Transcripción", ["EA"], "ED", "G", 1, "Transcripción", "Nombres propios revisados"],
  ["3.4", "Corte editorial", ["EA", "ED"], "HO", "G", 2, "Corte 1", "Aprobado por el host"],
  ["3.5", "Limpieza de audio", ["EA"], "CP", "G", 3, "Pistas limpias", "Sin ruidos que distraigan"],
  ["3.6", "Mezcla", ["EA"], "CP", "G", 3, "Mezcla", "Voces balanceadas"],
  ["3.7", "Masterización a −16 LUFS", ["EA"], "PR", "G", 3, "Máster", "−16 LUFS ±1 y true peak ≤ −1 dBTP"],
  ["3.8", "Edición de video", ["EV"], "PE", "G", 4, "Video horizontal", "Aprobado por PE"],
  ["3.9", "Clips verticales", ["CL"], "EG", "G", 4, "3 a 8 clips 9:16", "Revisados ortografía y encuadre"],
  ["3.10", "Control de calidad", ["PR"], "PE", "G", 5, "Checklist QC firmado", "Sin pendientes"],
  ["3.11", "Aprobación del invitado (si se acordó)", ["BK"], "PR", "G", 5, "Visto bueno", "Por escrito"],
  ["3.12", "Exportar entregables finales", ["EA", "EV"], "PR", "G", 5, "MP3, WAV, MP4, clips, SRT", "Cumplen specs de cada plataforma"],
  ["3.13", "Archivar proyecto y masters", ["EA", "EV"], "CP", "G", 7, "Carpeta final", "El proyecto abre desde el archivo"],
  // F4 · Distribución
  ["4.1", "Título, descripción, notas y enlaces", ["ED"], "RP", "P", -2, "Metadatos", "Ortografía y enlaces revisados"],
  ["4.2", "Capítulos con marcas de tiempo", ["EA"], "RP", "P", -2, "Capítulos", "Coinciden con el máster"],
  ["4.3", "Portada de episodio y miniatura", ["DG"], "EG", "P", -2, "Imágenes", "Legibles en el teléfono"],
  ["4.4", "Subir al hosting y programar", ["RP"], "PR", "P", -1, "Episodio programado", "Vista previa revisada"],
  ["4.5", "Subir y programar en YouTube", ["RP"], "PR", "P", -1, "Video programado", "Miniatura, capítulos, subtítulos y playlist"],
  ["4.6", "Verificar publicación en todas las plataformas", ["RP"], "PR", "P", 0, "Enlaces finales", "Visible y reproduce bien"],
  ["4.7", "Página del episodio con transcripción", ["RP"], "EG", "P", 0, "Página del episodio", "Enlazada"],
  // F5 · Promoción
  ["5.1", "Calendario de publicaciones del episodio", ["CM"], "EG", "P", -3, "Calendario de P−2 a P+14", "Programado"],
  ["5.2", "Teaser", ["CM"], "EG", "P", -2, "Post", "Publicado"],
  ["5.3", "Clips verticales escalonados", ["CM"], "EG", "P", 14, "3 a 8 publicaciones", "Programadas"],
  ["5.4", "Kit para el invitado", ["CM"], "EG", "P", 0, "Kit enviado", "El invitado confirma"],
  ["5.5", "Newsletter / comunidad", ["CM"], "EG", "P", 0, "Envío", "Enviado"],
  ["5.6", "Responder comentarios", ["CM", "HO"], "EG", "P", 7, "—", "Respuesta en menos de 48 h"],
  // F6 · Medición
  ["6.1", "Métricas a 7 días", ["AN"], "EG", "P", 7, "Fila en el tablero", "Datos capturados"],
  ["6.2", "Métricas a 30 días", ["AN"], "EG", "P", 30, "Fila en el tablero", "Datos capturados"],
  ["6.3", "Retro del episodio", ["PR"], "PE", "P", 7, "3 aprendizajes", "Acciones asignadas"],
];

export const TAREAS_PODCAST = T_.map(([codigo, nombre, rolesHace, rolAprueba, referencia, desfase, entregable, criterio], i) => ({
  codigo, fase: "F" + codigo.split(".")[0], nombre, rolesHace, rolAprueba, referencia, desfase, entregable, criterio, orden: i + 1,
}));

export const ESTADOS_TAREA = {
  todo: { simbolo: "○", nombre: "Por hacer" },
  doing: { simbolo: "◐", nombre: "En curso" },
  review: { simbolo: "◎", nombre: "En revisión" },
  blocked: { simbolo: "!", nombre: "Bloqueado" },
  done: { simbolo: "✓", nombre: "Hecho" },
} as const;
export type EstadoTarea = keyof typeof ESTADOS_TAREA;
