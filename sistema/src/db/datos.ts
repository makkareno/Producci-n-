/* Datos base del sistema: catálogo y proyecto de demostración. Los usan el script de carga y el modo demostración. */
import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, schema } from "./index";
import {
  AREAS, DEPARTAMENTOS, ROLES, FORMATOS, PLANTILLA_PODCAST, FASES, ESTADOS, PUERTAS, TAREAS_PODCAST,
} from "../lib/catalogo";
import { crearUnidad } from "../lib/produccion";
import { hoyCDMX, sumarDias } from "../lib/fechas";

const s = schema;

export async function catalogo() {
  for (const a of AREAS) await db.insert(s.areas).values(a).onConflictDoUpdate({ target: s.areas.id, set: a });
  for (const d of DEPARTAMENTOS) await db.insert(s.departamentos).values(d).onConflictDoUpdate({ target: s.departamentos.codigo, set: d });
  for (const [i, r] of ROLES.entries()) {
    const v = { ...r, responsable: !!r.responsable, orden: i + 1 };
    await db.insert(s.roles).values(v).onConflictDoUpdate({ target: s.roles.codigo, set: v });
  }
  for (const f of FORMATOS) await db.insert(s.formatos).values(f).onConflictDoUpdate({ target: s.formatos.id, set: f });

  const p = PLANTILLA_PODCAST;
  await db.insert(s.plantillas).values(p).onConflictDoUpdate({ target: s.plantillas.id, set: p });
  for (const f of FASES) {
    const v = { plantillaId: p.id, ...f };
    await db.insert(s.plantillaFases).values(v).onConflictDoUpdate({ target: [s.plantillaFases.plantillaId, s.plantillaFases.codigo], set: v });
  }
  for (const [i, e] of ESTADOS.entries()) {
    const v = { plantillaId: p.id, ...e, orden: i + 1 };
    await db.insert(s.plantillaEstados).values(v).onConflictDoUpdate({ target: [s.plantillaEstados.plantillaId, s.plantillaEstados.codigo], set: v });
  }
  for (const pu of PUERTAS) {
    const v = { plantillaId: p.id, ...pu };
    await db.insert(s.plantillaPuertas).values(v).onConflictDoUpdate({ target: [s.plantillaPuertas.plantillaId, s.plantillaPuertas.codigo], set: v });
  }
  for (const t of TAREAS_PODCAST) {
    const v = { plantillaId: p.id, ...t };
    await db.insert(s.plantillaTareas).values(v).onConflictDoUpdate({ target: [s.plantillaTareas.plantillaId, s.plantillaTareas.codigo], set: v });
  }
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
  for (const [nombre, email, roles, admin] of reparto) {
    const p = await persona(nombre, email, !!admin);
    for (const rol of roles) await db.insert(s.asignaciones).values({ proyectoId: proyecto.id, rol, personaId: p.id }).onConflictDoNothing();
  }

  const hoy = hoyCDMX();
  const ep = [
    { numero: 1, titulo: "Piloto: cómo empezar un podcast", g: -10 },
    { numero: 2, titulo: "La voz como herramienta", g: 6 },
    { numero: 3, titulo: "Invitado por confirmar", g: 20 },
  ];
  for (const e of ep) {
    await crearUnidad({ proyectoId: proyecto.id, temporada: 1, numero: e.numero, titulo: e.titulo, fechaG: sumarDias(hoy, e.g), fechaP: null, invitado: null });
  }
  // Avance realista del episodio 1: preproducción y grabación hechas, en edición.
  const [u1] = await db.select().from(s.unidades).where(eq(s.unidades.codigo, "T01E01"));
  const ts = await db.select().from(s.tareas).where(eq(s.tareas.unidadId, u1.id));
  for (const t of ts) {
    const estado = t.fase === "F1" || t.fase === "F2" || t.codigo === "3.1" || t.codigo === "3.2" || t.codigo === "3.3" ? "done" : t.codigo === "3.4" ? "review" : "todo";
    await db.update(s.tareas).set({ estado }).where(eq(s.tareas.id, t.id));
  }
  for (const pu of await db.select().from(s.puertas).where(eq(s.puertas.unidadId, u1.id))) {
    if (["P1", "P2", "P3"].includes(pu.codigo)) {
      await db.update(s.puertas).set({ aprobada: true, aprobadaEn: new Date() }).where(eq(s.puertas.id, pu.id));
    }
  }
  await db.update(s.unidades).set({ estado: "E06" }).where(eq(s.unidades.id, u1.id));

  // Episodio 2: preproducción a medias, con la autorización bloqueada.
  const [u2] = await db.select().from(s.unidades).where(eq(s.unidades.codigo, "T01E02"));
  const t2 = await db.select().from(s.tareas).where(eq(s.tareas.unidadId, u2.id));
  for (const t of t2) {
    const estado = ["1.1", "1.2", "1.3"].includes(t.codigo) ? "done" : t.codigo === "1.4" ? "blocked" : t.codigo === "1.5" ? "doing" : t.codigo === "1.6" ? "review" : "todo";
    await db.update(s.tareas).set({ estado, notaBloqueo: t.codigo === "1.4" ? "Esperando firma del invitado" : null }).where(eq(s.tareas.id, t.id));
  }
  const [p1] = (await db.select().from(s.puertas).where(eq(s.puertas.unidadId, u2.id))).filter((x) => x.codigo === "P1");
  await db.update(s.puertas).set({ aprobada: true, aprobadaEn: new Date() }).where(eq(s.puertas.id, p1.id));
  await db.update(s.unidades).set({ estado: "E03" }).where(eq(s.unidades.id, u2.id));

  await db.insert(s.eventos).values({ proyectoId: proyecto.id, titulo: "Junta editorial", tipo: "junta", fecha: sumarDias(hoy, 2), hora: "10:00", roles: ["ED", "PE", "PR", "EG"], lugar: "Narvarte" });
  console.log("Demostración creada: proyecto 'podcast-demo' con 3 episodios y 7 personas de prueba.");
}

