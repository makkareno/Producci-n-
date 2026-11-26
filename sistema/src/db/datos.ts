/* Datos base del sistema: catálogo y proyecto de demostración. Los usan el script de carga y el modo demostración.
   Todo se escribe en bloque (una sentencia por tabla) para que preparar la demo tarde lo mínimo. */
import { randomBytes } from "node:crypto";
import { and, eq, getTableColumns, inArray, sql, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db, schema } from "./index";
import {
  AREAS, DEPARTAMENTOS, ROLES, FORMATOS, PLANTILLA_PODCAST, FASES, ESTADOS, PUERTAS, TAREAS_PODCAST,
} from "../lib/catalogo";
import { crearUnidad } from "../lib/produccion";
import { hoyCDMX, sumarDias } from "../lib/fechas";

const s = schema;

/** SET de un upsert: toma cada columna del valor nuevo (excluded), salvo la clave. */
function nuevos(tabla: PgTable, excepto: string[]): Record<string, SQL> {
  const set: Record<string, SQL> = {};
  for (const [k, c] of Object.entries(getTableColumns(tabla))) {
    if (!excepto.includes(k) && k !== "id") set[k] = sql.raw(`excluded."${c.name}"`);
  }
  return set;
}

export async function catalogo() {
  const p = PLANTILLA_PODCAST;
  await db.insert(s.areas).values([...AREAS]).onConflictDoUpdate({ target: s.areas.id, set: nuevos(s.areas, []) });
  await db.insert(s.departamentos).values([...DEPARTAMENTOS]).onConflictDoUpdate({ target: s.departamentos.codigo, set: nuevos(s.departamentos, ["codigo"]) });
  await db.insert(s.roles).values(ROLES.map((r, i) => ({ ...r, responsable: !!r.responsable, orden: i + 1 })))
    .onConflictDoUpdate({ target: s.roles.codigo, set: nuevos(s.roles, ["codigo"]) });
  await db.insert(s.formatos).values(FORMATOS).onConflictDoUpdate({ target: s.formatos.id, set: nuevos(s.formatos, []) });
  await db.insert(s.plantillas).values(p).onConflictDoUpdate({ target: s.plantillas.id, set: nuevos(s.plantillas, []) });
  await db.insert(s.plantillaFases).values(FASES.map((f) => ({ plantillaId: p.id, ...f })))
    .onConflictDoUpdate({ target: [s.plantillaFases.plantillaId, s.plantillaFases.codigo], set: nuevos(s.plantillaFases, ["plantillaId", "codigo"]) });
  await db.insert(s.plantillaEstados).values(ESTADOS.map((e, i) => ({ plantillaId: p.id, ...e, orden: i + 1 })))
    .onConflictDoUpdate({ target: [s.plantillaEstados.plantillaId, s.plantillaEstados.codigo], set: nuevos(s.plantillaEstados, ["plantillaId", "codigo"]) });
  await db.insert(s.plantillaPuertas).values(PUERTAS.map((pu) => ({ plantillaId: p.id, ...pu })))
    .onConflictDoUpdate({ target: [s.plantillaPuertas.plantillaId, s.plantillaPuertas.codigo], set: nuevos(s.plantillaPuertas, ["plantillaId", "codigo"]) });
  await db.insert(s.plantillaTareas).values(TAREAS_PODCAST.map((t) => ({ plantillaId: p.id, ...t })))
    .onConflictDoUpdate({ target: [s.plantillaTareas.plantillaId, s.plantillaTareas.codigo], set: nuevos(s.plantillaTareas, ["plantillaId", "codigo"]) });
  console.log(`Catálogo: ${AREAS.length} áreas, ${DEPARTAMENTOS.length} departamentos, ${ROLES.length} roles, ${TAREAS_PODCAST.length} tareas de plantilla.`);
}

const token = () => randomBytes(18).toString("base64url");

export async function persona(nombre: string, email: string, admin = false) {
  const [existe] = await db.select().from(s.personas).where(eq(s.personas.email, email.toLowerCase()));
  if (existe) return existe;
  const [nueva] = await db.insert(s.personas).values({ nombre, email: email.toLowerCase(), admin, icalToken: token() }).returning();
  return nueva;
}

/* Proyecto de demostración con personas ficticias, para probar el sistema. */
export async function demo() {
  let [cliente] = await db.select().from(s.clientes).where(eq(s.clientes.nombre, "QUERVO Studios"));
  if (!cliente) [cliente] = await db.insert(s.clientes).values({ nombre: "QUERVO Studios", interno: true }).returning();
  const [proyecto] = await db.insert(s.proyectos).values({
    slug: "podcast-demo", nombre: "Podcast de demostración", clienteId: cliente.id, formatoId: "podcast", plantillaId: "podcast-v1", abreviatura: "DEM",
  }).onConflictDoNothing().returning();
  if (!proyecto) { console.log("La demostración ya existe."); return; }

  const reparto: [string, string, string[], boolean?][] = [
    ["Demo Dirección", "demo.direccion@quervo.local", ["PE"], true], // admin, para probar Configuración
    ["Demo Producción", "demo.produccion@quervo.local", ["PR", "BK", "AP"]],
    ["Demo Contenido", "demo.contenido@quervo.local", ["ED", "IN"]],
    ["Demo Host", "demo.host@quervo.local", ["HO"]],
    ["Demo Técnica", "demo.tecnica@quervo.local", ["SO", "RE", "CA", "IL"]],
    ["Demo Edición", "demo.edicion@quervo.local", ["EA", "EV", "CL"]],
    ["Demo Diseño y Redes", "demo.redes@quervo.local", ["DG", "EG", "RP", "CM", "AN"]],
  ];
  const emails = reparto.map((r) => r[1]);
  await db.insert(s.personas).values(reparto.map(([nombre, email, , admin]) => ({ nombre, email, admin: !!admin, icalToken: token() })))
    .onConflictDoNothing();
  const ids = new Map((await db.select().from(s.personas).where(inArray(s.personas.email, emails))).map((p) => [p.email, p.id]));
  await db.insert(s.asignaciones)
    .values(reparto.flatMap(([, email, roles]) => roles.map((rol) => ({ proyectoId: proyecto.id, rol, personaId: ids.get(email)! }))))
    .onConflictDoNothing();

  const hoy = hoyCDMX();
  const ep = [
    { numero: 1, titulo: "Piloto: cómo empezar un podcast", g: -10 },
    { numero: 2, titulo: "La voz como herramienta", g: 6 },
    { numero: 3, titulo: "Invitado por confirmar", g: 20 },
  ];
  const unidades = [];
  for (const e of ep) { // una por una: cada una es una transacción
    unidades.push(await crearUnidad({ proyectoId: proyecto.id, temporada: 1, numero: e.numero, titulo: e.titulo, fechaG: sumarDias(hoy, e.g), fechaP: null, invitado: null }));
  }
  const [u1, u2] = unidades;

  const estado = (unidadId: number, codigos: string[] | SQL, valor: string, nota: string | null = null) =>
    db.update(s.tareas).set({ estado: valor, notaBloqueo: nota })
      .where(and(eq(s.tareas.unidadId, unidadId), Array.isArray(codigos) ? inArray(s.tareas.codigo, codigos) : codigos));
  const aprobar = (unidadId: number, codigos: string[]) =>
    db.update(s.puertas).set({ aprobada: true, aprobadaEn: new Date() }).where(and(eq(s.puertas.unidadId, unidadId), inArray(s.puertas.codigo, codigos)));

  // Episodio 1: preproducción y grabación hechas, en edición con el corte en revisión.
  await Promise.all([
    estado(u1.id, inArray(s.tareas.fase, ["F1", "F2"]), "done"),
    estado(u1.id, ["3.1", "3.2", "3.3"], "done"),
    estado(u1.id, ["3.4"], "review"),
    aprobar(u1.id, ["P1", "P2", "P3"]),
    db.update(s.unidades).set({ estado: "E06" }).where(eq(s.unidades.id, u1.id)),
  ]);
  // Episodio 2: preproducción a medias, con la autorización bloqueada.
  await Promise.all([
    estado(u2.id, ["1.1", "1.2", "1.3"], "done"),
    estado(u2.id, ["1.4"], "blocked", "Esperando firma del invitado"),
    estado(u2.id, ["1.5"], "doing"),
    estado(u2.id, ["1.6"], "review"),
    aprobar(u2.id, ["P1"]),
    db.update(s.unidades).set({ estado: "E03" }).where(eq(s.unidades.id, u2.id)),
    db.insert(s.eventos).values({ proyectoId: proyecto.id, titulo: "Junta editorial", tipo: "junta", fecha: sumarDias(hoy, 2), hora: "10:00", roles: ["ED", "PE", "PR", "EG"], lugar: "Narvarte" }),
  ]);
  console.log("Demostración creada: proyecto 'podcast-demo' con 3 episodios y 7 personas de prueba.");
}
