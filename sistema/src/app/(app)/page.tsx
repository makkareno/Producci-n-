import Link from "next/link";
import { requierePersona, proyectosEnFoco, rolesCubiertos } from "@/lib/sesion";
import { esAprobacionMia, esPendienteMio, puertasDe, tareasVisibles, unidadesDe, estadosPlantilla } from "@/lib/consultas";
import { fechaCorta, hoyCDMX, sumarDias } from "@/lib/fechas";
import { ROLES } from "@/lib/catalogo";
import { TablaTareas } from "@/components/tareas";
import { Rol } from "@/components/ui";
import { dirigeProyecto } from "@/lib/acceso";

export const metadata = { title: "Panel" };

export default async function Panel() {
  const ctx = await requierePersona();
  const proyectos = await proyectosEnFoco();
  const ids = proyectos.map((p) => p.id);
  const hoy = hoyCDMX();
  const [tareas, unidades, estados, cubiertos] = await Promise.all([tareasVisibles(ctx, ids), unidadesDe(ids), estadosPlantilla("podcast-v1"), rolesCubiertos(ids)]);
  const puertas = await puertasDe(unidades.map((u) => u.id));

  const abiertas = tareas.filter((t) => t.estado !== "done");
  const vencidas = abiertas.filter((t) => t.fechaLimite && t.fechaLimite < hoy);
  const bloqueadas = abiertas.filter((t) => t.estado === "blocked");
  const misPend = tareas.filter(esPendienteMio);
  const misAprob = tareas.filter(esAprobacionMia);
  const en14 = sumarDias(hoy, 14);
  const grabaciones = unidades.filter((u) => u.fechaG && u.fechaG >= hoy && u.fechaG <= en14);
  const publicaciones = unidades.filter((u) => u.fechaP && u.fechaP >= hoy && u.fechaP <= en14);
  const activas = unidades.filter((u) => u.estado !== "E11");
  const porEstado = estados.map((e) => ({ ...e, lista: activas.filter((u) => u.estado === e.codigo) }));

  // Roles que la plantilla usa y nadie cubre (solo lo ve quien dirige).
  const sinCubrir = proyectos
    .filter((p) => dirigeProyecto(ctx, p.id))
    .map((p) => {
      const usados = new Set(tareas.filter((t) => t.proyectoId === p.id).flatMap((t) => t.rolesHace));
      const cub = cubiertos.get(p.id) ?? new Set();
      return { proyecto: p, faltan: ROLES.filter((r) => usados.has(r.codigo) && !cub.has(r.codigo)).map((r) => r.codigo) };
    })
    .filter((x) => x.faltan.length);

  return (
    <>
      <div className="cabeza">
        <span className="etq etq-raya">Panel general · {proyectos.length === 1 ? proyectos[0].nombre : "todos los proyectos"}</span>
        <h1>Hola, {ctx.nombre.split(" ")[0]}.</h1>
        <p>{misPend.length ? `Tienes ${misPend.length} ${misPend.length === 1 ? "tarea pendiente" : "tareas pendientes"}` : "No tienes tareas pendientes"}{misAprob.length ? ` y ${misAprob.length} por aprobar.` : "."}</p>
      </div>

      <div className="rejilla">
        <Link href="/pendientes" className="caja" style={{ textDecoration: "none" }}>
          <span className="etq">Mis pendientes</span><span className="dato">{misPend.length}</span>
        </Link>
        <Link href="/pendientes#aprobar" className="caja" style={{ textDecoration: "none" }}>
          <span className="etq">Por aprobar</span><span className="dato">{misAprob.length}</span>
        </Link>
        <div className="caja"><span className="etq">Vencidas</span><span className={`dato ${vencidas.length ? "alerta" : ""}`}>{vencidas.length}</span></div>
        <div className="caja"><span className="etq">Bloqueadas</span><span className={`dato ${bloqueadas.length ? "alerta" : ""}`}>{bloqueadas.length}</span></div>
      </div>

      <section className="seccion">
        <header><h2>Episodios por estado</h2><span className="etq">{activas.length} activos</span></header>
        <div className="desplazable">
          <div className="flujo" style={{ gap: 6 }}>
            {porEstado.map((e) => (
              <div key={e.codigo} className="paso" style={{ width: 150, alignContent: "start", minHeight: 110 }}>
                <span className="tenue" style={{ fontSize: ".7rem" }}>{e.codigo}{e.puerta ? ` · tras ${e.puerta}` : ""}</span>
                <b>{e.nombre}</b>
                {e.lista.map((u) => (
                  <Link key={u.id} href={`/u/${u.id}`} style={{ fontSize: ".8rem" }}>{u.codigo} · {u.titulo}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rejilla seccion" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
        <div className="caja">
          <span className="etq">Grabaciones · próximos 14 días</span>
          {grabaciones.length ? grabaciones.map((u) => (
            <Link key={u.id} href={`/u/${u.id}`}>{fechaCorta(u.fechaG!)} · {u.codigo} · {u.titulo}</Link>
          )) : <span className="tenue">Sin grabaciones.</span>}
        </div>
        <div className="caja">
          <span className="etq">Publicaciones · próximos 14 días</span>
          {publicaciones.length ? publicaciones.map((u) => (
            <Link key={u.id} href={`/u/${u.id}`}>{fechaCorta(u.fechaP!)} · {u.codigo} · {u.titulo}</Link>
          )) : <span className="tenue">Sin publicaciones.</span>}
        </div>
        <div className="caja">
          <span className="etq">Siguiente puerta de cada episodio</span>
          {unidades.map((u) => {
            const sig = estados[estados.findIndex((e) => e.codigo === u.estado) + 1];
            const p = sig?.puerta ? puertas.find((x) => x.unidadId === u.id && x.codigo === sig.puerta) : null;
            return p && !p.aprobada ? (
              <Link key={u.id} href={`/u/${u.id}`} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span className="rombo"><i>{p.codigo.slice(1)}</i></span> {u.codigo} · {p.nombre} <Rol codigo={p.rolAprueba} aprueba />
              </Link>
            ) : null;
          })}
        </div>
      </div>

      {sinCubrir.length ? (
        <section className="seccion">
          <header><h2>Roles sin asignar</h2><Link href="/proyectos" className="etq">Asignar en Proyectos</Link></header>
          {sinCubrir.map(({ proyecto, faltan }) => (
            <div key={proyecto.id} className="form-fila"><span className="gris">{proyecto.nombre}:</span> <span className="roles">{faltan.map((r) => <Rol key={r} codigo={r} />)}</span></div>
          ))}
          <p className="tenue">Las tareas de estos roles no le aparecen a nadie en "Mis pendientes" hasta que se asignen.</p>
        </section>
      ) : null}

      <section className="seccion">
        <header><h2>Atención</h2><span className="etq">Vencidas y bloqueadas</span></header>
        <TablaTareas lista={[...bloqueadas, ...vencidas.filter((t) => t.estado !== "blocked")].slice(0, 20)} vacio="Todo al día." />
      </section>
    </>
  );
}
