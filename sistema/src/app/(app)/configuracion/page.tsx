import Link from "next/link";
import { asc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requiereAdmin } from "@/lib/sesion";
import { crearProyecto, guardarPersona } from "@/app/acciones";
import { Rol } from "@/components/ui";

export const metadata = { title: "Configuración" };

export default async function Configuracion() {
  const ctx = await requiereAdmin();
  const personas = await db.select().from(schema.personas).orderBy(asc(schema.personas.nombre));
  const asig = await db.select({ personaId: schema.asignaciones.personaId, rol: schema.asignaciones.rol, proyecto: schema.proyectos.nombre })
    .from(schema.asignaciones).innerJoin(schema.proyectos, eq(schema.asignaciones.proyectoId, schema.proyectos.id));
  const proyectos = await db.select().from(schema.proyectos).orderBy(asc(schema.proyectos.nombre));
  const formatos = await db.select().from(schema.formatos);
  const conPlantilla = new Set((await db.select().from(schema.plantillas)).map((p) => p.formatoId));

  return (
    <>
      <div className="cabeza">
        <span className="etq etq-raya">Configuración · solo administración</span>
        <h1>Personas y proyectos.</h1>
        <p>Solo entran al sistema los correos de esta lista que estén activos. Los roles se asignan dentro de cada proyecto.</p>
      </div>

      <section className="seccion">
        <header><h2>Personas</h2><span className="etq">{personas.filter((p) => p.activo).length} activas</span></header>
        <div className="desplazable">
          <table>
            <thead><tr><th>Nombre</th><th>Correo de Google</th><th>Admin</th><th>Activa</th><th></th><th>Roles</th></tr></thead>
            <tbody>
              {personas.map((p) => {
                const pendiente = p.email.endsWith("@quervo.local");
                const formId = `persona-${p.id}`;
                return (
                  <tr key={p.id}>
                    <td><input form={formId} name="nombre" defaultValue={p.nombre} aria-label="Nombre" required /></td>
                    <td>
                      <input form={formId} name="email" type="email" defaultValue={p.email} aria-label="Correo" required style={{ minWidth: 250, borderColor: pendiente ? "var(--rec)" : undefined }} />
                      {pendiente ? <div className="nota">Correo provisional: cámbialo por su cuenta de Google.</div> : null}
                    </td>
                    <td><input form={formId} type="checkbox" name="admin" defaultChecked={p.admin} aria-label="Administración" disabled={p.id === ctx.personaId} />{p.id === ctx.personaId ? <input form={formId} type="hidden" name="admin" value="on" /> : null}</td>
                    <td><input form={formId} type="checkbox" name="activo" defaultChecked={p.activo} aria-label="Activa" disabled={p.id === ctx.personaId} />{p.id === ctx.personaId ? <input form={formId} type="hidden" name="activo" value="on" /> : null}</td>
                    <td><form id={formId} action={guardarPersona}><input type="hidden" name="id" value={p.id} /><button className="mini" type="submit">Guardar</button></form></td>
                    <td><span className="roles">{asig.filter((a) => a.personaId === p.id).map((a, i) => <span key={i} title={a.proyecto}><Rol codigo={a.rol} /></span>)}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <form action={guardarPersona} className="form-fila caja" style={{ display: "flex" }}>
          <label style={{ flex: "1 1 200px" }}>Nombre<input name="nombre" required /></label>
          <label style={{ flex: "1 1 260px" }}>Correo de Google<input name="email" type="email" required /></label>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}><input type="checkbox" name="admin" /> Admin</label>
          <button type="submit">Agregar persona</button>
        </form>
      </section>

      <section className="seccion">
        <header><h2>Proyectos</h2><span className="etq">{proyectos.length}</span></header>
        <div className="rejilla">
          {proyectos.map((p) => (
            <Link key={p.id} href={`/proyectos/${p.slug}`} className="caja" style={{ textDecoration: "none" }}>
              <span className="etq">{formatos.find((f) => f.id === p.formatoId)?.nombre} · {p.abreviatura}</span>
              <b>{p.nombre}</b>
              <span className="tenue">Asignar equipo →</span>
            </Link>
          ))}
        </div>
        <form action={crearProyecto} className="form-fila caja" style={{ display: "flex" }}>
          <label style={{ flex: "1 1 220px" }}>Nombre del proyecto<input name="nombre" required placeholder="EmociónEs" /></label>
          <label style={{ flex: "1 1 200px" }}>Cliente<input name="cliente" placeholder="QUERVO Studios" /></label>
          <label>Formato<select name="formato">
            {formatos.map((f) => <option key={f.id} value={f.id} disabled={!conPlantilla.has(f.id)}>{f.nombre}{conPlantilla.has(f.id) ? "" : " (próximamente)"}</option>)}
          </select></label>
          <label>Abreviatura<input name="abreviatura" required maxLength={5} placeholder="EMO" style={{ width: 100 }} /></label>
          <button type="submit">Crear proyecto</button>
        </form>
      </section>
    </>
  );
}
