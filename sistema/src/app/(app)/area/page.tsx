import { requierePersona, proyectosEnFoco } from "@/lib/sesion";
import { tareasVisibles } from "@/lib/consultas";
import { AREA_DE_ROL, areasEn } from "@/lib/acceso";
import { AREAS, DEPARTAMENTOS, ROLES } from "@/lib/catalogo";
import { hoyCDMX } from "@/lib/fechas";
import { TablaTareas } from "@/components/tareas";
import { Rol } from "@/components/ui";

export const metadata = { title: "Mi área" };

export default async function MiArea() {
  const ctx = await requierePersona();
  const proyectos = await proyectosEnFoco();
  const ids = proyectos.map((p) => p.id);
  const misAreas = new Set(proyectos.flatMap((p) => [...areasEn(ctx, p.id)]));
  const tareas = (await tareasVisibles(ctx, ids, { soloAbiertas: true }))
    .filter((t) => t.rolesHace.some((r) => misAreas.has(AREA_DE_ROL.get(r)!)));
  const hoy = hoyCDMX();

  if (!misAreas.size) {
    return (
      <div className="cabeza">
        <span className="etq etq-raya">Mi área</span>
        <h1>Sin área asignada.</h1>
        <p>Cuando te asignen un rol en un proyecto, aquí verás el trabajo de tu área.</p>
      </div>
    );
  }

  return (
    <>
      <div className="cabeza">
        <span className="etq etq-raya">Mi área</span>
        <h1>{AREAS.filter((a) => misAreas.has(a.id)).map((a) => a.nombre).join(" · ")}</h1>
        <p>Tareas abiertas de tu área en {proyectos.length === 1 ? proyectos[0].nombre : "todos tus proyectos"}, agrupadas por departamento.</p>
      </div>

      <section className="seccion">
        <header><h2>Carga por rol</h2><span className="etq">Abiertas · vencidas</span></header>
        <div className="rejilla">
          {ROLES.filter((r) => misAreas.has(AREA_DE_ROL.get(r.codigo)!)).map((r) => {
            const suyas = tareas.filter((t) => t.rolesHace.includes(r.codigo));
            const venc = suyas.filter((t) => t.fechaLimite && t.fechaLimite < hoy).length;
            return (
              <div key={r.codigo} className="caja" style={{ gridTemplateColumns: "auto 1fr auto", alignItems: "center" }}>
                <Rol codigo={r.codigo} /><span>{r.nombre}</span>
                <span className="num">{suyas.length}{venc ? <span className="vencida"> · {venc}</span> : null}</span>
              </div>
            );
          })}
        </div>
      </section>

      {DEPARTAMENTOS.filter((d) => misAreas.has(d.areaId)).map((d) => {
        const rolesDepto = new Set(ROLES.filter((r) => r.departamento === d.codigo).map((r) => r.codigo));
        const lista = tareas.filter((t) => rolesDepto.has(t.rolesHace[0]));
        return (
          <section key={d.codigo} className="seccion">
            <header><h2>{d.nombre}</h2><span className="etq">{lista.length} abiertas</span></header>
            <TablaTareas lista={lista} vacio="Sin tareas abiertas." />
          </section>
        );
      })}
    </>
  );
}
