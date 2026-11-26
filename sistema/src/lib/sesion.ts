import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { and, asc, eq, inArray } from "drizzle-orm";
import { auth } from "@/auth";
import { db, schema } from "@/db";
import { baseLista } from "@/db/lista";
import type { Contexto } from "./acceso";

/** Persona que inició sesión, con sus roles por proyecto. Redirige a /entrar si no hay sesión válida. */
export const requierePersona = cache(async (): Promise<Contexto> => {
  await baseLista();
  const sesion = await auth();
  const personaId = (sesion as unknown as { personaId?: number } | null)?.personaId;
  if (!personaId) redirect("/entrar");
  const [p] = await db.select().from(schema.personas).where(and(eq(schema.personas.id, personaId), eq(schema.personas.activo, true)));
  if (!p) redirect("/entrar?error=no-autorizado");
  const asig = await db.select().from(schema.asignaciones).where(eq(schema.asignaciones.personaId, p.id));
  const roles = new Map<number, Set<string>>();
  for (const a of asig) {
    if (!roles.has(a.proyectoId)) roles.set(a.proyectoId, new Set());
    roles.get(a.proyectoId)!.add(a.rol);
  }
  return { personaId: p.id, nombre: p.nombre, email: p.email, admin: p.admin, roles };
});

export const requiereAdmin = cache(async (): Promise<Contexto> => {
  const ctx = await requierePersona();
  if (!ctx.admin) redirect("/");
  return ctx;
});

/** Proyectos activos que la persona puede ver. */
export const proyectosVisibles = cache(async () => {
  const ctx = await requierePersona();
  const todos = await db.select().from(schema.proyectos).where(eq(schema.proyectos.activo, true)).orderBy(asc(schema.proyectos.nombre));
  return ctx.admin ? todos : todos.filter((p) => ctx.roles.has(p.id));
});

/** Proyecto elegido en el selector (o null = todos). */
export const proyectoActual = cache(async () => {
  const slug = (await cookies()).get("proyecto")?.value;
  const visibles = await proyectosVisibles();
  return visibles.find((p) => p.slug === slug) ?? null;
});

/** Ids de los proyectos con los que filtrar las vistas: el elegido o todos los visibles. */
export const proyectosEnFoco = cache(async () => {
  const actual = await proyectoActual();
  return actual ? [actual] : await proyectosVisibles();
});

/** Roles cubiertos por alguien, por proyecto. */
export async function rolesCubiertos(proyectoIds: number[]) {
  const m = new Map<number, Set<string>>();
  if (!proyectoIds.length) return m;
  const filas = await db.select({ proyectoId: schema.asignaciones.proyectoId, rol: schema.asignaciones.rol })
    .from(schema.asignaciones).where(inArray(schema.asignaciones.proyectoId, proyectoIds));
  for (const f of filas) {
    if (!m.has(f.proyectoId)) m.set(f.proyectoId, new Set());
    m.get(f.proyectoId)!.add(f.rol);
  }
  return m;
}
