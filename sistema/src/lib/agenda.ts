import "server-only";
import type { Contexto } from "./acceso";
import { esPendienteMio, eventosDe, tareasVisibles, unidadesDe } from "./consultas";

export type Entrada = {
  fecha: string; hora: string | null; titulo: string; roles: string[]; tipo: "grabacion" | "publicacion" | "evento" | "tarea";
  enlace: string | null; proyecto: string;
};

/** Agenda compartida (grabaciones, publicaciones, juntas) más, si se pide, las fechas límite propias. */
export async function agenda(ctx: Contexto, proyectos: { id: number; nombre: string }[], desde: string, hasta: string, conMisTareas: boolean): Promise<Entrada[]> {
  const ids = proyectos.map((p) => p.id);
  const nombre = new Map(proyectos.map((p) => [p.id, p.nombre]));
  const salida: Entrada[] = [];
  for (const u of await unidadesDe(ids)) {
    if (u.fechaG && u.fechaG >= desde && u.fechaG <= hasta) {
      salida.push({ fecha: u.fechaG, hora: null, titulo: `Grabación · ${u.codigo} · ${u.titulo}`, roles: ["PR", "HO", "SO", "RE", "CA"], tipo: "grabacion", enlace: `/u/${u.id}`, proyecto: u.proyectoNombre });
    }
    if (u.fechaP && u.fechaP >= desde && u.fechaP <= hasta) {
      salida.push({ fecha: u.fechaP, hora: null, titulo: `Publicación · ${u.codigo} · ${u.titulo}`, roles: ["RP", "CM"], tipo: "publicacion", enlace: `/u/${u.id}`, proyecto: u.proyectoNombre });
    }
  }
  for (const e of await eventosDe(ids, desde, hasta)) {
    salida.push({ fecha: e.fecha, hora: e.hora, titulo: e.titulo + (e.lugar ? ` · ${e.lugar}` : ""), roles: e.roles, tipo: "evento", enlace: null, proyecto: e.proyectoId ? nombre.get(e.proyectoId) ?? "" : "General" });
  }
  if (conMisTareas) {
    for (const t of (await tareasVisibles(ctx, ids)).filter(esPendienteMio)) {
      if (t.fechaLimite && t.fechaLimite >= desde && t.fechaLimite <= hasta) {
        salida.push({ fecha: t.fechaLimite, hora: null, titulo: `${t.unidadCodigo} · ${t.codigo} ${t.nombre}`, roles: t.rolesHace, tipo: "tarea", enlace: `/u/${t.unidadId}`, proyecto: t.proyectoNombre });
      }
    }
  }
  const orden = { grabacion: 0, publicacion: 1, evento: 2, tarea: 3 };
  return salida.sort((a, b) => a.fecha.localeCompare(b.fecha) || (a.hora ?? "").localeCompare(b.hora ?? "") || orden[a.tipo] - orden[b.tipo]);
}
