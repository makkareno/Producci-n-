"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, asc, eq, max } from "drizzle-orm";
import { db, schema } from "@/db";
import { requierePersona, requiereAdmin, rolesCubiertos } from "@/lib/sesion";
import { dirigeProyecto, puedeAprobarPuerta, puedeCambiarEstado, type Contexto } from "@/lib/acceso";
import { cambiarFechas, crearUnidad, requisitosPendientes, estadosDe } from "@/lib/produccion";
import { ESTADOS_TAREA, ROLES } from "@/lib/catalogo";

const s = schema;
const FECHA = /^\d{4}-\d{2}-\d{2}$/;

async function registrar(ctx: Contexto, accion: string, entidad: string, entidadId: number | null, detalle?: unknown) {
  await db.insert(s.bitacora).values({ personaId: ctx.personaId, accion, entidad, entidadId, detalle: detalle ?? null });
}

function texto(f: FormData, k: string) { return String(f.get(k) ?? "").trim(); }
function fechaOpc(f: FormData, k: string) { const v = texto(f, k); return FECHA.test(v) ? v : null; }

async function proyectoDeUnidad(unidadId: number) {
  const [u] = await db.select({ unidad: s.unidades, proyecto: s.proyectos }).from(s.unidades)
    .innerJoin(s.proyectos, eq(s.unidades.proyectoId, s.proyectos.id)).where(eq(s.unidades.id, unidadId));
  if (!u) throw new Error("No existe");
  return u;
}

/* ───────── Selector de proyecto ───────── */

export async function elegirProyecto(formData: FormData) {
  await requierePersona();
  const slug = texto(formData, "proyecto");
  const c = await cookies();
  if (!slug || slug === "todos") c.delete("proyecto");
  else c.set("proyecto", slug, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365 });
  revalidatePath("/", "layout");
}

/* ───────── Tareas ───────── */

export async function cambiarEstadoTarea(formData: FormData) {
  const ctx = await requierePersona();
  const tareaId = Number(formData.get("tarea"));
  const nuevo = texto(formData, "estado");
  if (!(nuevo in ESTADOS_TAREA)) return;
  const [fila] = await db.select({ t: s.tareas, proyectoId: s.unidades.proyectoId }).from(s.tareas)
    .innerJoin(s.unidades, eq(s.tareas.unidadId, s.unidades.id)).where(eq(s.tareas.id, tareaId));
  if (!fila) return;
  const cubiertos = (await rolesCubiertos([fila.proyectoId])).get(fila.proyectoId);
  if (!puedeCambiarEstado(ctx, fila.proyectoId, fila.t, nuevo, cubiertos)) return;
  const nota = nuevo === "blocked" ? texto(formData, "nota") || "Sin detalle" : null;
  await db.update(s.tareas).set({ estado: nuevo, notaBloqueo: nota, actualizado: new Date() }).where(eq(s.tareas.id, tareaId));
  await registrar(ctx, "tarea.estado", "tarea", tareaId, { de: fila.t.estado, a: nuevo, nota });
  revalidatePath("/", "layout");
}

/* ───────── Puertas y estados de la unidad ───────── */

export async function aprobarPuerta(formData: FormData) {
  const ctx = await requierePersona();
  const puertaId = Number(formData.get("puerta"));
  const [p] = await db.select().from(s.puertas).where(eq(s.puertas.id, puertaId));
  if (!p || p.aprobada) return;
  const { unidad, proyecto } = await proyectoDeUnidad(p.unidadId);
  if (!puedeAprobarPuerta(ctx, proyecto.id, p.rolAprueba)) return;
  if ((await requisitosPendientes(unidad.id, p.requisitos)).length) return; // el sistema no deja pasar con requisitos abiertos

  await db.update(s.puertas).set({ aprobada: true, aprobadaPor: ctx.personaId, aprobadaEn: new Date() }).where(eq(s.puertas.id, p.id));
  // Si la unidad está justo antes del estado que abre esta puerta, avanza.
  const estados = await estadosDe(proyecto.plantillaId);
  const destino = estados.find((e) => e.puerta === p.codigo);
  const actual = estados.findIndex((e) => e.codigo === unidad.estado);
  if (destino && estados[actual + 1]?.codigo === destino.codigo) {
    await db.update(s.unidades).set({ estado: destino.codigo }).where(eq(s.unidades.id, unidad.id));
  }
  await registrar(ctx, "puerta.aprobar", "puerta", p.id, { unidad: unidad.codigo, puerta: p.codigo });
  revalidatePath("/", "layout");
}

/** Avanza a un estado que no tiene puerta (las puertas avanzan al aprobarse). */
export async function avanzarEstado(formData: FormData) {
  const ctx = await requierePersona();
  const unidadId = Number(formData.get("unidad"));
  const { unidad, proyecto } = await proyectoDeUnidad(unidadId);
  if (!dirigeProyecto(ctx, proyecto.id)) return;
  const estados = await estadosDe(proyecto.plantillaId);
  const i = estados.findIndex((e) => e.codigo === unidad.estado);
  const sig = estados[i + 1];
  if (!sig) return;
  if (sig.puerta) {
    const [pu] = await db.select().from(s.puertas).where(and(eq(s.puertas.unidadId, unidad.id), eq(s.puertas.codigo, sig.puerta)));
    if (!pu?.aprobada) return;
  }
  await db.update(s.unidades).set({ estado: sig.codigo }).where(eq(s.unidades.id, unidad.id));
  await registrar(ctx, "unidad.estado", "unidad", unidad.id, { de: unidad.estado, a: sig.codigo });
  revalidatePath("/", "layout");
}

export async function guardarFechas(formData: FormData) {
  const ctx = await requierePersona();
  const unidadId = Number(formData.get("unidad"));
  const { proyecto, unidad } = await proyectoDeUnidad(unidadId);
  if (!dirigeProyecto(ctx, proyecto.id)) return;
  const g = fechaOpc(formData, "fechaG");
  const p = fechaOpc(formData, "fechaP");
  await cambiarFechas(unidadId, g, p);
  await registrar(ctx, "unidad.fechas", "unidad", unidadId, { antes: { g: unidad.fechaG, p: unidad.fechaP }, despues: { g, p } });
  revalidatePath("/", "layout");
}

/* ───────── Nueva unidad (episodio / pieza) ───────── */

export async function nuevaUnidad(formData: FormData) {
  const ctx = await requierePersona();
  const proyectoId = Number(formData.get("proyecto"));
  if (!dirigeProyecto(ctx, proyectoId)) return;
  const temporada = Number(formData.get("temporada")) || null;
  let numero = Number(formData.get("numero"));
  if (!numero) {
    const [m] = await db.select({ n: max(s.unidades.numero) }).from(s.unidades)
      .where(and(eq(s.unidades.proyectoId, proyectoId), temporada ? eq(s.unidades.temporada, temporada) : undefined));
    numero = (m?.n ?? 0) + 1;
  }
  const titulo = texto(formData, "titulo") || "Sin título";
  const u = await crearUnidad({
    proyectoId, temporada, numero, titulo,
    fechaG: fechaOpc(formData, "fechaG"), fechaP: fechaOpc(formData, "fechaP"), invitado: texto(formData, "invitado") || null,
  });
  await registrar(ctx, "unidad.crear", "unidad", u.id, { codigo: u.codigo });
  revalidatePath("/", "layout");
  redirect(`/u/${u.id}`);
}

/* ───────── Calendario ───────── */

export async function nuevoEvento(formData: FormData) {
  const ctx = await requierePersona();
  const proyectoId = Number(formData.get("proyecto")) || null;
  if (proyectoId ? !dirigeProyecto(ctx, proyectoId) : !ctx.admin) return;
  const fecha = fechaOpc(formData, "fecha");
  const titulo = texto(formData, "titulo");
  if (!fecha || !titulo) return;
  const hora = /^\d{2}:\d{2}$/.test(texto(formData, "hora")) ? texto(formData, "hora") : null;
  const validos = new Set(ROLES.map((r) => r.codigo));
  const roles = texto(formData, "roles").toUpperCase().split(/[\s,]+/).filter((r) => validos.has(r));
  const [e] = await db.insert(s.eventos).values({
    proyectoId, titulo, fecha, hora, roles, tipo: texto(formData, "tipo") || "otro", lugar: texto(formData, "lugar") || null, creadoPor: ctx.personaId,
  }).returning();
  await registrar(ctx, "evento.crear", "evento", e.id, { titulo, fecha });
  revalidatePath("/calendario");
}

/* ───────── Configuración (solo admin) ───────── */

export async function guardarPersona(formData: FormData) {
  const ctx = await requiereAdmin();
  const id = Number(formData.get("id")) || null;
  const nombre = texto(formData, "nombre");
  const email = texto(formData, "email").toLowerCase();
  if (!nombre || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
  const admin = formData.get("admin") === "on";
  const activo = id ? formData.get("activo") === "on" : true;
  if (id === ctx.personaId && (!admin || !activo)) return; // nadie se quita a sí mismo el acceso de admin
  if (id) {
    await db.update(s.personas).set({ nombre, email, admin, activo }).where(eq(s.personas.id, id));
  } else {
    await db.insert(s.personas).values({ nombre, email, admin, activo, icalToken: randomBytes(18).toString("base64url") }).onConflictDoNothing();
  }
  await registrar(ctx, id ? "persona.editar" : "persona.crear", "persona", id, { nombre, email, admin, activo });
  revalidatePath("/configuracion");
}

export async function crearProyecto(formData: FormData) {
  const ctx = await requiereAdmin();
  const nombre = texto(formData, "nombre");
  const clienteNombre = texto(formData, "cliente") || "QUERVO Studios";
  const formatoId = texto(formData, "formato") || "podcast";
  const abreviatura = texto(formData, "abreviatura").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 5);
  if (!nombre || !abreviatura) return;
  const [plantilla] = await db.select().from(s.plantillas).where(eq(s.plantillas.formatoId, formatoId)).orderBy(asc(s.plantillas.version));
  if (!plantilla) return; // formato sin plantilla todavía
  let [cliente] = await db.select().from(s.clientes).where(eq(s.clientes.nombre, clienteNombre));
  if (!cliente) [cliente] = await db.insert(s.clientes).values({ nombre: clienteNombre, interno: clienteNombre === "QUERVO Studios" }).returning();
  const slug = nombre.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const [p] = await db.insert(s.proyectos).values({ slug, nombre, clienteId: cliente.id, formatoId, plantillaId: plantilla.id, abreviatura })
    .onConflictDoNothing().returning();
  if (p) await registrar(ctx, "proyecto.crear", "proyecto", p.id, { nombre });
  revalidatePath("/", "layout");
}

export async function asignarRol(formData: FormData) {
  const ctx = await requierePersona();
  const proyectoId = Number(formData.get("proyecto"));
  if (!ctx.admin && !dirigeProyecto(ctx, proyectoId)) return;
  const rol = texto(formData, "rol");
  const personaId = Number(formData.get("persona"));
  if (!ROLES.some((r) => r.codigo === rol) || !personaId) return;
  await db.insert(s.asignaciones).values({ proyectoId, rol, personaId }).onConflictDoNothing();
  await registrar(ctx, "rol.asignar", "proyecto", proyectoId, { rol, personaId });
  revalidatePath("/", "layout");
}

export async function quitarRol(formData: FormData) {
  const ctx = await requierePersona();
  const proyectoId = Number(formData.get("proyecto"));
  if (!ctx.admin && !dirigeProyecto(ctx, proyectoId)) return;
  const rol = texto(formData, "rol");
  const personaId = Number(formData.get("persona"));
  await db.delete(s.asignaciones).where(and(eq(s.asignaciones.proyectoId, proyectoId), eq(s.asignaciones.rol, rol), eq(s.asignaciones.personaId, personaId)));
  await registrar(ctx, "rol.quitar", "proyecto", proyectoId, { rol, personaId });
  revalidatePath("/", "layout");
}
