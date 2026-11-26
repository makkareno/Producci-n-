import "server-only";
import { and, asc, eq, inArray, ne } from "drizzle-orm";
import { db, schema } from "@/db";
import { apruebaTarea, haceTarea, veTarea, type Contexto } from "./acceso";
import { rolesCubiertos } from "./sesion";

const { tareas, unidades, proyectos, puertas, eventos, plantillaEstados } = schema;

export type TareaFila = {
  id: number; codigo: string; fase: string; nombre: string; rolesHace: string[]; rolAprueba: string;
  fechaLimite: string | null; estado: string; notaBloqueo: string | null; referencia: string; desfase: number;
  unidadId: number; unidadCodigo: string; unidadTitulo: string;
  proyectoId: number; proyectoSlug: string; proyectoNombre: string;
  hago: boolean; apruebo: boolean;
  /** le toca aprobar por su rol (o por ser PR cuando nadie cubre el rol que aprueba) */
  meTocaAprobar: boolean;
};

/** Tareas de los proyectos indicados que la persona puede ver. */
export async function tareasVisibles(ctx: Contexto, proyectoIds: number[], opciones: { soloAbiertas?: boolean } = {}): Promise<TareaFila[]> {
  if (!proyectoIds.length) return [];
  const filas = await db.select({
    id: tareas.id, codigo: tareas.codigo, fase: tareas.fase, nombre: tareas.nombre, rolesHace: tareas.rolesHace,
    rolAprueba: tareas.rolAprueba, fechaLimite: tareas.fechaLimite, estado: tareas.estado, notaBloqueo: tareas.notaBloqueo,
    referencia: tareas.referencia, desfase: tareas.desfase, orden: tareas.orden,
    unidadId: unidades.id, unidadCodigo: unidades.codigo, unidadTitulo: unidades.titulo,
    proyectoId: proyectos.id, proyectoSlug: proyectos.slug, proyectoNombre: proyectos.nombre,
  }).from(tareas)
    .innerJoin(unidades, eq(tareas.unidadId, unidades.id))
    .innerJoin(proyectos, eq(unidades.proyectoId, proyectos.id))
    .where(and(inArray(proyectos.id, proyectoIds), opciones.soloAbiertas ? ne(tareas.estado, "done") : undefined))
    .orderBy(asc(tareas.fechaLimite), asc(unidades.codigo), asc(tareas.orden));

  const cubiertos = await rolesCubiertos(proyectoIds);
  return filas
    .filter((t) => veTarea(ctx, t.proyectoId, t))
    .map((t) => ({
      ...t,
      hago: haceTarea(ctx, t.proyectoId, t),
      apruebo: apruebaTarea(ctx, t.proyectoId, t, cubiertos.get(t.proyectoId)),
      meTocaAprobar: (() => {
        const mis = ctx.roles.get(t.proyectoId) ?? new Set<string>();
        const cub = cubiertos.get(t.proyectoId) ?? new Set<string>();
        return mis.has(t.rolAprueba) || (!cub.has(t.rolAprueba) && mis.has("PR"));
      })(),
    }));
}

/** Lo que le toca hacer a la persona (no lo que solo puede ver por dirigir). */
export function esPendienteMio(t: TareaFila) {
  return t.hago && t.estado !== "done" && t.estado !== "review";
}
export function esAprobacionMia(t: TareaFila) {
  return t.estado === "review" && t.meTocaAprobar;
}

export async function unidadesDe(proyectoIds: number[]) {
  if (!proyectoIds.length) return [];
  return db.select({
    id: unidades.id, codigo: unidades.codigo, titulo: unidades.titulo, estado: unidades.estado, fechaG: unidades.fechaG, fechaP: unidades.fechaP,
    invitado: unidades.invitado, proyectoId: proyectos.id, proyectoSlug: proyectos.slug, proyectoNombre: proyectos.nombre, plantillaId: proyectos.plantillaId,
  }).from(unidades).innerJoin(proyectos, eq(unidades.proyectoId, proyectos.id))
    .where(inArray(proyectos.id, proyectoIds)).orderBy(asc(unidades.fechaG), asc(unidades.codigo));
}

export async function puertasDe(unidadIds: number[]) {
  if (!unidadIds.length) return [];
  return db.select().from(puertas).where(inArray(puertas.unidadId, unidadIds)).orderBy(asc(puertas.codigo));
}

export async function eventosDe(proyectoIds: number[], desde: string, hasta: string) {
  const todos = await db.select().from(eventos).orderBy(asc(eventos.fecha), asc(eventos.hora));
  return todos.filter((e) => e.fecha >= desde && e.fecha <= hasta && (e.proyectoId === null || proyectoIds.includes(e.proyectoId)));
}

export async function estadosPlantilla(plantillaId: string) {
  return db.select().from(plantillaEstados).where(eq(plantillaEstados.plantillaId, plantillaId)).orderBy(asc(plantillaEstados.orden));
}
