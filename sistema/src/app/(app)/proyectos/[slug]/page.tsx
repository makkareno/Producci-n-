import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requierePersona } from "@/lib/sesion";
import { unidadesDe, estadosPlantilla } from "@/lib/consultas";
import { dirigeProyecto, veProyecto } from "@/lib/acceso";
import { fechaCorta } from "@/lib/fechas";
import { DEPARTAMENTOS, ROLES } from "@/lib/catalogo";
import { asignarRol, nuevaUnidad, quitarRol } from "@/app/acciones";
import { Rol } from "@/components/ui";

export default async function Proyecto({ params }: { params: Promise<{ slug: string }> }) {
  const ctx = await requierePersona();
  const { slug } = await params;
  const [p] = await db.select().from(schema.proyectos).where(eq(schema.proyectos.slug, slug));
  if (!p || !veProyecto(ctx, p.id)) notFound();
  const dirige = dirigeProyecto(ctx, p.id);
  const [formato] = await db.select().from(schema.formatos).where(eq(schema.formatos.id, p.formatoId));
  const [unidades, estados] = await Promise.all([unidadesDe([p.id]), estadosPlantilla(p.plantillaId)]);
  const equipo = await db.select({ rol: schema.asignaciones.rol, personaId: schema.personas.id, nombre: schema.personas.nombre })
    .from(schema.asignaciones).innerJoin(schema.personas, eq(schema.asignaciones.personaId, schema.personas.id))
    .where(eq(schema.asignaciones.proyectoId, p.id));
  const personas = dirige ? await db.select().from(schema.personas).where(eq(schema.personas.activo, true)).orderBy(asc(schema.personas.nombre)) : [];
  const nombreEstado = new Map(estados.map((e) => [e.codigo, e.nombre]));
  const unidad = formato?.unidadSingular ?? "episodio";

  return (
    <>
      <div className="cabeza">
        <span className="etq etq-raya">{formato?.nombre} · {p.abreviatura}</span>
        <h1>{p.nombre}</h1>
        <p>{unidades.length} {formato?.unidadPlural}. Cada {unidad} nace con las tareas y puertas de la plantilla, con fechas calculadas desde la grabación.</p>
      </div>

      <section className="seccion">
        <header><h2>{formato?.unidadPlural?.replace(/^./, (c) => c.toUpperCase())}</h2></header>
        {unidades.length ? (
          <div className="desplazable">
            <table>
              <thead><tr><th>Código</th><th>Título</th><th>Estado</th><th>Grabación</th><th>Publicación</th></tr></thead>
              <tbody>
                {unidades.map((u) => (
                  <tr key={u.id}>
                    <td className="codigo"><Link href={`/u/${u.id}`}>{u.codigo}</Link></td>
                    <td><Link href={`/u/${u.id}`}>{u.titulo}</Link></td>
                    <td>{nombreEstado.get(u.estado)}</td>
                    <td className="fecha">{u.fechaG ? fechaCorta(u.fechaG) : "—"}</td>
                    <td className="fecha">{u.fechaP ? fechaCorta(u.fechaP) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p className="vacio">Aún no hay {formato?.unidadPlural}.</p>}
      </section>

      {dirige ? (
        <section className="seccion">
          <header><h2>Nuevo {unidad}</h2><span className="etq">Genera tareas y puertas</span></header>
          <form action={nuevaUnidad} className="form-fila">
            <input type="hidden" name="proyecto" value={p.id} />
            <label>Temporada<input type="number" name="temporada" min={1} defaultValue={1} style={{ width: 90 }} /></label>
            <label>Número (vacío = siguiente)<input type="number" name="numero" min={1} style={{ width: 120 }} /></label>
            <label style={{ flex: "1 1 240px" }}>Título de trabajo<input name="titulo" required /></label>
            <label>Invitado<input name="invitado" /></label>
            <label>Grabación (G)<input type="date" name="fechaG" required /></label>
            <label>Publicación (P, opcional)<input type="date" name="fechaP" /></label>
            <button className="lleno" type="submit">Crear {unidad}</button>
          </form>
        </section>
      ) : null}

      <section className="seccion">
        <header><h2>Equipo</h2><span className="etq">Quién cubre cada rol</span></header>
        <div className="desplazable">
          <table>
            <thead><tr><th>Rol</th><th>Departamento</th><th>Persona(s)</th>{dirige ? <th>Asignar</th> : null}</tr></thead>
            <tbody>
              {ROLES.map((r) => {
                const quienes = equipo.filter((e) => e.rol === r.codigo);
                return (
                  <tr key={r.codigo}>
                    <td style={{ whiteSpace: "nowrap" }}><span className="roles"><Rol codigo={r.codigo} /> {r.nombre}</span></td>
                    <td className="tenue">{DEPARTAMENTOS.find((d) => d.codigo === r.departamento)?.nombre}</td>
                    <td>
                      {quienes.length ? quienes.map((q) => (
                        <span key={q.personaId} className="form-fila" style={{ gap: 6, display: "inline-flex", marginRight: 10 }}>
                          {q.nombre}
                          {dirige ? (
                            <form action={quitarRol}>
                              <input type="hidden" name="proyecto" value={p.id} /><input type="hidden" name="rol" value={r.codigo} /><input type="hidden" name="persona" value={q.personaId} />
                              <button className="mini" type="submit" aria-label={`Quitar a ${q.nombre} de ${r.nombre}`}>×</button>
                            </form>
                          ) : null}
                        </span>
                      )) : <span className="tenue">Sin asignar</span>}
                    </td>
                    {dirige ? (
                      <td>
                        <form action={asignarRol} className="form-fila" style={{ gap: 6 }}>
                          <input type="hidden" name="proyecto" value={p.id} /><input type="hidden" name="rol" value={r.codigo} />
                          <select name="persona" aria-label={`Persona para ${r.nombre}`} defaultValue="">
                            <option value="" disabled>Elegir…</option>
                            {personas.map((x) => <option key={x.id} value={x.id}>{x.nombre}</option>)}
                          </select>
                          <button className="mini" type="submit">Asignar</button>
                        </form>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
