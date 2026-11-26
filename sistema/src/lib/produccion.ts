import { and, asc, eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { fechaLimite, sumarDias } from "./fechas";

const { unidades, tareas, puertas, plantillas, plantillaTareas, plantillaPuertas, plantillaEstados, proyectos } = schema;

export function codigoUnidad(temporada: number | null, numero: number): string {
  const n = String(numero).padStart(2, "0");
  return temporada ? `T${String(temporada).padStart(2, "0")}E${n}` : `E${n}`;
}

type NuevaUnidad = {
  proyectoId: number;
  temporada: number | null;
  numero: number;
  titulo: string;
  fechaG: string | null;
  fechaP: string | null;
  invitado?: string | null;
};

/** Crea una unidad (episodio o pieza) con todas sus tareas y puertas a partir de la plantilla del proyecto. */
export async function crearUnidad(datos: NuevaUnidad) {
  const [proyecto] = await db.select().from(proyectos).where(eq(proyectos.id, datos.proyectoId));
  if (!proyecto) throw new Error("Proyecto no encontrado");
  const [plantilla] = await db.select().from(plantillas).where(eq(plantillas.id, proyecto.plantillaId));
  const [primerEstado] = await db.select().from(plantillaEstados)
    .where(eq(plantillaEstados.plantillaId, plantilla.id)).orderBy(asc(plantillaEstados.orden)).limit(1);

  const fechaP = datos.fechaP ?? (datos.fechaG ? sumarDias(datos.fechaG, plantilla.diasGaP) : null);

  return db.transaction(async (tx) => {
    const [unidad] = await tx.insert(unidades).values({
      proyectoId: datos.proyectoId,
      codigo: codigoUnidad(datos.temporada, datos.numero),
      temporada: datos.temporada,
      numero: datos.numero,
      titulo: datos.titulo,
      estado: primerEstado.codigo,
      fechaG: datos.fechaG,
      fechaP,
      invitado: datos.invitado ?? null,
    }).returning();

    const base = await tx.select().from(plantillaTareas)
      .where(eq(plantillaTareas.plantillaId, plantilla.id)).orderBy(asc(plantillaTareas.orden));
    if (base.length) {
      await tx.insert(tareas).values(base.map((t) => ({
        unidadId: unidad.id,
        codigo: t.codigo,
        fase: t.fase,
        nombre: t.nombre,
        rolesHace: t.rolesHace,
        rolAprueba: t.rolAprueba,
        referencia: t.referencia,
        desfase: t.desfase,
        fechaLimite: fechaLimite(t.referencia, t.desfase, unidad.fechaG, unidad.fechaP),
        entregable: t.entregable,
        criterio: t.criterio,
        orden: t.orden,
      })));
    }

    const ps = await tx.select().from(plantillaPuertas).where(eq(plantillaPuertas.plantillaId, plantilla.id));
    if (ps.length) {
      await tx.insert(puertas).values(ps.map((p) => ({
        unidadId: unidad.id, codigo: p.codigo, nombre: p.nombre, rolAprueba: p.rolAprueba, requisitos: p.requisitos,
      })));
    }
    return unidad;
  });
}

/** Cambia las fechas de grabación y publicación y recalcula las fechas límite de todas las tareas. */
export async function cambiarFechas(unidadId: number, fechaG: string | null, fechaP: string | null) {
  await db.transaction(async (tx) => {
    await tx.update(unidades).set({ fechaG, fechaP }).where(eq(unidades.id, unidadId));
    const lista = await tx.select({ id: tareas.id, referencia: tareas.referencia, desfase: tareas.desfase })
      .from(tareas).where(eq(tareas.unidadId, unidadId));
    for (const t of lista) {
      await tx.update(tareas).set({ fechaLimite: fechaLimite(t.referencia, t.desfase, fechaG, fechaP) }).where(eq(tareas.id, t.id));
    }
  });
}

/** Requisitos de una puerta que aún no están hechos. */
export async function requisitosPendientes(unidadId: number, requisitos: string[]): Promise<string[]> {
  if (!requisitos.length) return [];
  const hechas = await db.select({ codigo: tareas.codigo }).from(tareas)
    .where(and(eq(tareas.unidadId, unidadId), inArray(tareas.codigo, requisitos), eq(tareas.estado, "done")));
  const set = new Set(hechas.map((h) => h.codigo));
  return requisitos.filter((r) => !set.has(r));
}

/** Estados de la plantilla de una unidad, en orden. */
export async function estadosDe(plantillaId: string) {
  return db.select().from(plantillaEstados).where(eq(plantillaEstados.plantillaId, plantillaId)).orderBy(asc(plantillaEstados.orden));
}
