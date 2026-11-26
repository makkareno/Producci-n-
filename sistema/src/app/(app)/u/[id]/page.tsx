import Link from "next/link";
import { notFound } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requierePersona } from "@/lib/sesion";
import { tareasVisibles, estadosPlantilla, puertasDe } from "@/lib/consultas";
import { dirigeProyecto, puedeAprobarPuerta, veProyecto } from "@/lib/acceso";
import { faltantes, tareasHechas } from "@/lib/produccion";
import { fechaCorta } from "@/lib/fechas";
import { FASES } from "@/lib/catalogo";
import { aprobarPuerta, avanzarEstado, guardarFechas } from "@/app/acciones";
import { TablaTareas } from "@/components/tareas";
import { Rol } from "@/components/ui";

export default async function Unidad({ params }: { params: Promise<{ id: string }> }) {
  const ctx = await requierePersona();
  const id = Number((await params).id);
  const [fila] = await db.select({ u: schema.unidades, p: schema.proyectos }).from(schema.unidades)
    .innerJoin(schema.proyectos, eq(schema.unidades.proyectoId, schema.proyectos.id)).where(eq(schema.unidades.id, id));
  if (!fila || !veProyecto(ctx, fila.p.id)) notFound();
  const { u, p } = fila;
  const dirige = dirigeProyecto(ctx, p.id);

  const [estados, puertas, todas, hechasPorUnidad, equipo] = await Promise.all([
    estadosPlantilla(p.plantillaId), puertasDe([u.id]), tareasVisibles(ctx, [p.id], { unidadId: u.id }), tareasHechas([u.id]),
    db.select({ rol: schema.asignaciones.rol, nombre: schema.personas.nombre }).from(schema.asignaciones)
      .innerJoin(schema.personas, eq(schema.asignaciones.personaId, schema.personas.id))
      .where(eq(schema.asignaciones.proyectoId, p.id)).orderBy(asc(schema.asignaciones.rol)),
  ]);
  const tareas = todas;
  const iActual = estados.findIndex((e) => e.codigo === u.estado);
  const siguiente = estados[iActual + 1];
  const faltan = new Map<string, string[]>();
  for (const pu of puertas) faltan.set(pu.codigo, pu.aprobada ? [] : faltantes(pu.requisitos, hechasPorUnidad.get(u.id)));
  const hechas = tareas.filter((t) => t.estado === "done").length;

  return (
    <>
      <div className="cabeza">
        <span className="etq etq-raya"><Link href={`/proyectos/${p.slug}`}>{p.nombre}</Link> · {u.codigo}</span>
        <h1>{u.titulo}</h1>
        <p>
          Estado: <b style={{ color: "var(--ink)" }}>{estados[iActual]?.nombre}</b> · Grabación {u.fechaG ? fechaCorta(u.fechaG) : "sin fecha"} · Publicación {u.fechaP ? fechaCorta(u.fechaP) : "sin fecha"}
          {u.invitado ? ` · Invitado: ${u.invitado}` : ""} · {hechas} de {tareas.length} tareas visibles hechas
        </p>
      </div>

      <section className="seccion">
        <header><h2>Recorrido</h2><span className="etq">Rombo rojo: puerta pendiente · verde: aprobada</span></header>
        <div className="flujo">
          {estados.map((e, i) => {
            const pu = e.puerta ? puertas.find((x) => x.codigo === e.puerta) : null;
            return (
              <div key={e.codigo} style={{ display: "contents" }}>
                {i > 0 ? <div className="union">{pu ? <span className={`rombo ${pu.aprobada ? "ok" : ""}`} title={`${pu.codigo} · ${pu.nombre}`}><i>{pu.codigo.slice(1)}</i></span> : null}</div> : null}
                <div className={`paso ${i < iActual ? "hecho" : ""} ${i === iActual ? "actual" : ""}`}>
                  <span className="tenue" style={{ fontSize: ".68rem" }}>{e.codigo}</span><b>{e.nombre}</b>
                </div>
              </div>
            );
          })}
        </div>
        {siguiente && !siguiente.puerta && dirige ? (
          <form action={avanzarEstado}><input type="hidden" name="unidad" value={u.id} />
            <button type="submit">Pasar a «{siguiente.nombre}»</button>
          </form>
        ) : null}
      </section>

      <section className="seccion">
        <header><h2>Puertas de aprobación</h2><span className="etq">{puertas.filter((x) => x.aprobada).length} de {puertas.length}</span></header>
        <div className="rejilla">
          {puertas.map((pu) => {
            const f = faltan.get(pu.codigo) ?? [];
            const esLaSiguiente = siguiente?.puerta === pu.codigo;
            const puedo = puedeAprobarPuerta(ctx, p.id, pu.rolAprueba);
            return (
              <div key={pu.id} className="caja" style={{ borderColor: esLaSiguiente && !pu.aprobada ? "var(--rec)" : undefined }}>
                <div className="form-fila" style={{ justifyContent: "space-between" }}>
                  <span style={{ display: "flex", gap: 10, alignItems: "center" }}><span className={`rombo ${pu.aprobada ? "ok" : ""}`}><i>{pu.codigo.slice(1)}</i></span><b>{pu.nombre}</b></span>
                  <Rol codigo={pu.rolAprueba} aprueba />
                </div>
                {pu.aprobada
                  ? <span className="tenue">Aprobada{pu.aprobadaEn ? ` el ${fechaCorta(pu.aprobadaEn.toISOString().slice(0, 10))}` : ""}.</span>
                  : <span className="gris" style={{ fontSize: ".85rem" }}>{f.length ? `Faltan: ${f.join(", ")}` : "Requisitos completos."}</span>}
                {!pu.aprobada && esLaSiguiente && puedo && !f.length ? (
                  <form action={aprobarPuerta}><input type="hidden" name="puerta" value={pu.id} />
                    <button className="lleno" type="submit">Aprobar {pu.codigo}</button>
                  </form>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {dirige ? (
        <section className="seccion">
          <header><h2>Fechas</h2><span className="etq">Al cambiarlas se recalculan todas las tareas</span></header>
          <form action={guardarFechas} className="form-fila">
            <input type="hidden" name="unidad" value={u.id} />
            <label>Grabación (G)<input type="date" name="fechaG" defaultValue={u.fechaG ?? ""} /></label>
            <label>Publicación (P)<input type="date" name="fechaP" defaultValue={u.fechaP ?? ""} /></label>
            <button type="submit">Guardar fechas</button>
          </form>
        </section>
      ) : null}

      {FASES.map((f) => {
        const lista = tareas.filter((t) => t.fase === f.codigo);
        if (!lista.length) return null;
        return (
          <section key={f.codigo} className="seccion">
            <header><h2>{f.codigo} · {f.nombre}</h2><span className="etq">{lista.filter((t) => t.estado === "done").length} / {lista.length}</span></header>
            <TablaTareas lista={lista} mostrarUnidad={false} />
          </section>
        );
      })}

      <section className="seccion">
        <header><h2>Equipo del proyecto</h2></header>
        {equipo.length ? (
          <div className="rejilla">
            {equipo.map((e) => <div key={e.rol + e.nombre} className="form-fila" style={{ gap: 8 }}><Rol codigo={e.rol} /> {e.nombre}</div>)}
          </div>
        ) : <p className="vacio">Sin roles asignados.</p>}
      </section>
    </>
  );
}
