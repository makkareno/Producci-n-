import {
  pgTable, text, integer, boolean, date, timestamp, serial, jsonb, primaryKey, uniqueIndex, index,
} from "drizzle-orm/pg-core";

/* ───────────── Catálogo de organización (arquitectura v0.5) ───────────── */

export const areas = pgTable("areas", {
  id: text("id").primaryKey(),            // dir, cont, prod, post, aud, adm
  nombre: text("nombre").notNull(),
  color: text("color").notNull(),         // hex del color de trabajo (sobre negro)
  orden: integer("orden").notNull(),
});

export const departamentos = pgTable("departamentos", {
  codigo: text("codigo").primaryKey(),    // DIR, EDIT, PROD, SON, VID, POST, DIS, MKT, DATA, COM, ADM
  areaId: text("area_id").notNull().references(() => areas.id),
  nombre: text("nombre").notNull(),
  orden: integer("orden").notNull(),
});

export const roles = pgTable("roles", {
  codigo: text("codigo").primaryKey(),    // dos letras: PE, ED, HO, ...
  departamento: text("departamento").notNull().references(() => departamentos.codigo),
  nombre: text("nombre").notNull(),
  resumen: text("resumen").notNull(),
  responsable: boolean("responsable").notNull().default(false), // responsable del departamento
  orden: integer("orden").notNull(),
});

/* ───────────── Formatos y plantillas de proceso ───────────── */

export const formatos = pgTable("formatos", {
  id: text("id").primaryKey(),            // podcast, comercial, cortometraje, contenido, promo
  nombre: text("nombre").notNull(),
  unidadSingular: text("unidad_singular").notNull(), // episodio, pieza, corte…
  unidadPlural: text("unidad_plural").notNull(),
  activo: boolean("activo").notNull().default(true),
});

export const plantillas = pgTable("plantillas", {
  id: text("id").primaryKey(),            // podcast-v1
  formatoId: text("formato_id").notNull().references(() => formatos.id),
  nombre: text("nombre").notNull(),
  version: integer("version").notNull().default(1),
  diasGaP: integer("dias_g_a_p").notNull().default(7), // publicación por defecto = grabación + N
});

export const plantillaFases = pgTable("plantilla_fases", {
  plantillaId: text("plantilla_id").notNull().references(() => plantillas.id),
  codigo: text("codigo").notNull(),       // F1…F6
  nombre: text("nombre").notNull(),
  orden: integer("orden").notNull(),
}, (t) => [primaryKey({ columns: [t.plantillaId, t.codigo] })]);

export const plantillaEstados = pgTable("plantilla_estados", {
  plantillaId: text("plantilla_id").notNull().references(() => plantillas.id),
  codigo: text("codigo").notNull(),       // E01…E11
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion").notNull(),
  puerta: text("puerta"),                 // puerta que hay que aprobar para ENTRAR a este estado
  orden: integer("orden").notNull(),
}, (t) => [primaryKey({ columns: [t.plantillaId, t.codigo] })]);

export const plantillaPuertas = pgTable("plantilla_puertas", {
  plantillaId: text("plantilla_id").notNull().references(() => plantillas.id),
  codigo: text("codigo").notNull(),       // P1…P7
  nombre: text("nombre").notNull(),
  descripcion: text("descripcion").notNull(),
  rolAprueba: text("rol_aprueba").notNull().references(() => roles.codigo),
  requisitos: text("requisitos").array().notNull(), // códigos de tarea que deben estar hechos
}, (t) => [primaryKey({ columns: [t.plantillaId, t.codigo] })]);

export const plantillaTareas = pgTable("plantilla_tareas", {
  id: serial("id").primaryKey(),
  plantillaId: text("plantilla_id").notNull().references(() => plantillas.id),
  codigo: text("codigo").notNull(),       // 1.4
  fase: text("fase").notNull(),           // F1
  nombre: text("nombre").notNull(),
  rolesHace: text("roles_hace").array().notNull(),
  rolAprueba: text("rol_aprueba").notNull().references(() => roles.codigo),
  referencia: text("referencia").notNull(), // "G" (grabación) o "P" (publicación)
  desfase: integer("desfase").notNull(),    // días respecto a la referencia
  entregable: text("entregable").notNull(),
  criterio: text("criterio").notNull(),
  orden: integer("orden").notNull(),
}, (t) => [uniqueIndex("plantilla_tarea_codigo").on(t.plantillaId, t.codigo)]);

/* ───────────── Personas y proyectos ───────────── */

export const personas = pgTable("personas", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  email: text("email").notNull(),
  admin: boolean("admin").notNull().default(false), // acceso a Configuración y a todos los proyectos
  activo: boolean("activo").notNull().default(true),
  icalToken: text("ical_token").notNull(),
  creado: timestamp("creado", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("persona_email").on(t.email), uniqueIndex("persona_ical").on(t.icalToken)]);

export const clientes = pgTable("clientes", {
  id: serial("id").primaryKey(),
  nombre: text("nombre").notNull(),
  interno: boolean("interno").notNull().default(false), // proyectos propios de QUERVO
});

export const proyectos = pgTable("proyectos", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  nombre: text("nombre").notNull(),
  clienteId: integer("cliente_id").notNull().references(() => clientes.id),
  formatoId: text("formato_id").notNull().references(() => formatos.id),
  plantillaId: text("plantilla_id").notNull().references(() => plantillas.id),
  abreviatura: text("abreviatura").notNull(), // para nombres de archivo: PDC
  activo: boolean("activo").notNull().default(true),
  creado: timestamp("creado", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("proyecto_slug").on(t.slug)]);

export const asignaciones = pgTable("asignaciones", {
  proyectoId: integer("proyecto_id").notNull().references(() => proyectos.id, { onDelete: "cascade" }),
  rol: text("rol").notNull().references(() => roles.codigo),
  personaId: integer("persona_id").notNull().references(() => personas.id, { onDelete: "cascade" }),
}, (t) => [primaryKey({ columns: [t.proyectoId, t.rol, t.personaId] })]);

/* ───────────── Producción: unidades (episodios / piezas), tareas y puertas ───────────── */

export const unidades = pgTable("unidades", {
  id: serial("id").primaryKey(),
  proyectoId: integer("proyecto_id").notNull().references(() => proyectos.id, { onDelete: "cascade" }),
  codigo: text("codigo").notNull(),       // T01E03
  temporada: integer("temporada"),
  numero: integer("numero").notNull(),
  titulo: text("titulo").notNull(),
  estado: text("estado").notNull(),       // E01…E11
  fechaG: date("fecha_g", { mode: "string" }),
  fechaP: date("fecha_p", { mode: "string" }),
  invitado: text("invitado"),
  notas: text("notas"),
  creado: timestamp("creado", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("unidad_codigo").on(t.proyectoId, t.codigo), index("unidad_fecha_g").on(t.fechaG)]);

export const tareas = pgTable("tareas", {
  id: serial("id").primaryKey(),
  unidadId: integer("unidad_id").notNull().references(() => unidades.id, { onDelete: "cascade" }),
  codigo: text("codigo").notNull(),
  fase: text("fase").notNull(),
  nombre: text("nombre").notNull(),
  rolesHace: text("roles_hace").array().notNull(),
  rolAprueba: text("rol_aprueba").notNull(),
  referencia: text("referencia").notNull(),
  desfase: integer("desfase").notNull(),
  fechaLimite: date("fecha_limite", { mode: "string" }),
  estado: text("estado").notNull().default("todo"), // todo, doing, review, blocked, done
  notaBloqueo: text("nota_bloqueo"),
  entregable: text("entregable").notNull(),
  criterio: text("criterio").notNull(),
  orden: integer("orden").notNull(),
  actualizado: timestamp("actualizado", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("tarea_unidad").on(t.unidadId), index("tarea_fecha").on(t.fechaLimite)]);

export const puertas = pgTable("puertas", {
  id: serial("id").primaryKey(),
  unidadId: integer("unidad_id").notNull().references(() => unidades.id, { onDelete: "cascade" }),
  codigo: text("codigo").notNull(),
  nombre: text("nombre").notNull(),
  rolAprueba: text("rol_aprueba").notNull(),
  requisitos: text("requisitos").array().notNull(),
  aprobada: boolean("aprobada").notNull().default(false),
  aprobadaPor: integer("aprobada_por").references(() => personas.id),
  aprobadaEn: timestamp("aprobada_en", { withTimezone: true }),
}, (t) => [uniqueIndex("puerta_unidad_codigo").on(t.unidadId, t.codigo)]);

/* ───────────── Calendario y bitácora ───────────── */

export const eventos = pgTable("eventos", {
  id: serial("id").primaryKey(),
  proyectoId: integer("proyecto_id").references(() => proyectos.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  tipo: text("tipo").notNull(),           // junta, reserva, otro
  fecha: date("fecha", { mode: "string" }).notNull(),
  hora: text("hora"),                     // "10:00" opcional
  roles: text("roles").array().notNull(), // códigos de quienes deben estar
  lugar: text("lugar"),
  creadoPor: integer("creado_por").references(() => personas.id),
}, (t) => [index("evento_fecha").on(t.fecha)]);

export const bitacora = pgTable("bitacora", {
  id: serial("id").primaryKey(),
  personaId: integer("persona_id").references(() => personas.id),
  accion: text("accion").notNull(),
  entidad: text("entidad").notNull(),
  entidadId: integer("entidad_id"),
  detalle: jsonb("detalle"),
  fecha: timestamp("fecha", { withTimezone: true }).notNull().defaultNow(),
});
