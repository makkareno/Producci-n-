/*
 * Reglas de acceso. Todas se evalúan en el servidor: la interfaz solo muestra
 * lo que estas funciones permiten, y cada acción vuelve a comprobarlas.
 *
 *  - Admin: ve y edita todo, incluida Configuración.
 *  - PE o PR en un proyecto: ven y mueven todo dentro de ese proyecto.
 *  - Resto: ven los proyectos donde tienen un rol; dentro, ven las tareas de sus roles,
 *    las que les toca aprobar y las de su área.
 */
import { ROLES, DEPARTAMENTOS, ROLES_DIRECCION } from "./catalogo";

const AREA_DE_DEPTO = new Map<string, string>(DEPARTAMENTOS.map((d) => [d.codigo, d.areaId]));
export const AREA_DE_ROL = new Map<string, string>(ROLES.map((r) => [r.codigo, AREA_DE_DEPTO.get(r.departamento)!]));

export type Contexto = {
  personaId: number;
  nombre: string;
  email: string;
  admin: boolean;
  /** roles por proyecto */
  roles: Map<number, Set<string>>;
};

export function rolesEn(ctx: Contexto, proyectoId: number): Set<string> {
  return ctx.roles.get(proyectoId) ?? new Set();
}

export function areasEn(ctx: Contexto, proyectoId: number): Set<string> {
  return new Set([...rolesEn(ctx, proyectoId)].map((r) => AREA_DE_ROL.get(r)!).filter(Boolean));
}

export function veProyecto(ctx: Contexto, proyectoId: number): boolean {
  return ctx.admin || rolesEn(ctx, proyectoId).size > 0;
}

export function dirigeProyecto(ctx: Contexto, proyectoId: number): boolean {
  if (ctx.admin) return true;
  const mis = rolesEn(ctx, proyectoId);
  return ROLES_DIRECCION.some((r) => mis.has(r));
}

type TareaMin = { rolesHace: string[]; rolAprueba: string };

export function haceTarea(ctx: Contexto, proyectoId: number, t: TareaMin): boolean {
  const mis = rolesEn(ctx, proyectoId);
  return t.rolesHace.some((r) => mis.has(r));
}

export function apruebaTarea(ctx: Contexto, proyectoId: number, t: TareaMin, rolesCubiertos?: Set<string>): boolean {
  if (dirigeProyecto(ctx, proyectoId)) return true;
  const mis = rolesEn(ctx, proyectoId);
  if (mis.has(t.rolAprueba)) return true;
  // Si nadie cubre el rol que aprueba, la aprobación sube a Producción (PR).
  if (rolesCubiertos && !rolesCubiertos.has(t.rolAprueba)) return mis.has("PR");
  return false;
}

export function veTarea(ctx: Contexto, proyectoId: number, t: TareaMin): boolean {
  if (dirigeProyecto(ctx, proyectoId)) return true;
  if (haceTarea(ctx, proyectoId, t) || rolesEn(ctx, proyectoId).has(t.rolAprueba)) return true;
  const areas = areasEn(ctx, proyectoId);
  return t.rolesHace.some((r) => areas.has(AREA_DE_ROL.get(r)!));
}

/** Transiciones de estado de una tarea según quién la mueve. */
export function puedeCambiarEstado(
  ctx: Contexto, proyectoId: number, t: TareaMin & { estado: string }, nuevo: string, rolesCubiertos?: Set<string>,
): boolean {
  if (dirigeProyecto(ctx, proyectoId)) return true;
  const hace = haceTarea(ctx, proyectoId, t);
  const aprueba = apruebaTarea(ctx, proyectoId, t, rolesCubiertos);
  // Aprobar (review → done) o devolver (review → doing) es de quien aprueba.
  if (t.estado === "review" && (nuevo === "done" || nuevo === "doing")) return aprueba;
  if (nuevo === "done") return aprueba; // marcar hecha sin revisión solo quien aprueba
  return hace; // todo / doing / review / blocked
}

export function puedeAprobarPuerta(ctx: Contexto, proyectoId: number, rolAprueba: string): boolean {
  if (dirigeProyecto(ctx, proyectoId)) return true;
  return rolesEn(ctx, proyectoId).has(rolAprueba);
}
