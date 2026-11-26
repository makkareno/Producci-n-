import Link from "next/link";
import { requierePersona, proyectosEnFoco } from "@/lib/sesion";
import { esAprobacionMia, esPendienteMio, puertasDe, tareasVisibles, unidadesDe, estadosPlantilla } from "@/lib/consultas";
import { hoyCDMX, sumarDias } from "@/lib/fechas";
import { puedeAprobarPuerta, rolesEn } from "@/lib/acceso";
import { faltantes, tareasHechas } from "@/lib/produccion";
import { TablaTareas } from "@/components/tareas";
import { Rol } from "@/components/ui";

export const metadata = { title: "Mis pendientes" };

export default async function Pendientes() {
  const ctx = await requierePersona();
  const proyectos = await proyectosEnFoco();
  const ids = proyectos.map((p) => p.id);
  const hoy = hoyCDMX();
  const en7 = sumarDias(hoy, 7);
  const [tareas, unidades, estados] = await Promise.all([tareasVisibles(ctx, ids), unidadesDe(ids), estadosPlantilla("podcast-v1")]);
  const mias = tareas.filter(esPendienteMio);
  const vencidas = mias.filter((t) => t.fechaLimite && t.fechaLimite < hoy);
  const semana = mias.filter((t) => t.fechaLimite && t.fechaLimite >= hoy && t.fechaLimite <= en7);
  const despues = mias.filter((t) => !t.fechaLimite || t.fechaLimite > en7);
  const aprobar = tareas.filter(esAprobacionMia);

  // Puertas: la siguiente de cada episodio, si me toca aprobarla.
  const [puertas, hechas] = await Promise.all([puertasDe(unidades.map((u) => u.id)), tareasHechas(unidades.map((u) => u.id))]);
  const misPuertas = [];
  for (const u of unidades) {
    const sig = estados[estados.findIndex((e) => e.codigo === u.estado) + 1];
    const p = sig?.puerta ? puertas.find((x) => x.unidadId === u.id && x.codigo === sig.puerta) : null;
    if (!p || p.aprobada) continue;
    const directo = rolesEn(ctx, u.proyectoId).has(p.rolAprueba);
    if (!directo && !(puedeAprobarPuerta(ctx, u.proyectoId, p.rolAprueba) && rolesEn(ctx, u.proyectoId).has("PR"))) continue;
    misPuertas.push({ u, p, faltan: faltantes(p.requisitos, hechas.get(u.id)) });
  }

  const misRoles = proyectos.map((p) => ({ p, roles: [...rolesEn(ctx, p.id)] })).filter((x) => x.roles.length);

  return (
    <>
      <div className="cabeza">
        <span className="etq etq-raya">Mis pendientes</span>
        <h1>{mias.length} por hacer, {aprobar.length + misPuertas.length} por aprobar.</h1>
        {misRoles.length ? (
          <div className="form-fila">
            {misRoles.map(({ p, roles }) => (
              <span key={p.id} className="form-fila" style={{ gap: 6 }}>
                <span className="gris">{p.nombre}:</span>
                <span className="roles">{roles.map((r) => <Rol key={r} codigo={r} />)}</span>
              </span>
            ))}
          </div>
        ) : <p>Todavía no tienes roles asignados en {proyectos.length === 1 ? "este proyecto" : "ningún proyecto"}.</p>}
      </div>

      {vencidas.length ? (
        <section className="seccion"><header><h2 className="vencida">Vencidas</h2><span className="etq">{vencidas.length}</span></header>
          <TablaTareas lista={vencidas} />
        </section>
      ) : null}

      <section className="seccion"><header><h2>Esta semana</h2><span className="etq">{semana.length}</span></header>
        <TablaTareas lista={semana} vacio="Nada que venza en los próximos 7 días." />
      </section>

      <section className="seccion" id="aprobar"><header><h2>Por aprobar</h2><span className="etq">{aprobar.length + misPuertas.length}</span></header>
        {misPuertas.map(({ u, p, faltan }) => (
          <div key={p.id} className="caja" style={{ gridTemplateColumns: "auto 1fr auto", alignItems: "center", gap: 14 }}>
            <span className="rombo"><i>{p.codigo.slice(1)}</i></span>
            <div>
              <b>{u.codigo} · {p.nombre}</b> <span className="tenue">· {u.proyectoNombre}</span>
              <div className="tenue" style={{ fontSize: ".85rem" }}>{faltan.length ? `Faltan las tareas ${faltan.join(", ")}` : "Todos los requisitos están hechos."}</div>
            </div>
            <Link className="boton" href={`/u/${u.id}`}>Revisar</Link>
          </div>
        ))}
        <TablaTareas lista={aprobar} vacio={misPuertas.length ? "" : "No tienes nada por aprobar."} />
      </section>

      <section className="seccion"><header><h2>Más adelante</h2><span className="etq">{despues.length}</span></header>
        <TablaTareas lista={despues} vacio="Nada más por ahora." />
      </section>
    </>
  );
}
