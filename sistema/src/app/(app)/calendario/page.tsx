import Link from "next/link";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { requierePersona, proyectosEnFoco } from "@/lib/sesion";
import { agenda } from "@/lib/agenda";
import { dirigeProyecto } from "@/lib/acceso";
import { hoyCDMX, nombreMes, sumarDias } from "@/lib/fechas";
import { nuevoEvento } from "@/app/acciones";
import { colorDeRol } from "@/components/ui";

export const metadata = { title: "Calendario" };

const DIAS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

export default async function Calendario({ searchParams }: { searchParams: Promise<{ m?: string; mis?: string }> }) {
  const ctx = await requierePersona();
  const sp = await searchParams;
  const hoy = hoyCDMX();
  const [anio, mes] = /^\d{4}-\d{2}$/.test(sp.m ?? "") ? sp.m!.split("-").map(Number) : hoy.slice(0, 7).split("-").map(Number);
  const conMis = sp.mis === "1";
  const primero = `${anio}-${String(mes).padStart(2, "0")}-01`;
  const diaSemana = (new Date(Date.UTC(anio, mes - 1, 1)).getUTCDay() + 6) % 7; // lunes = 0
  const inicio = sumarDias(primero, -diaSemana);
  const dias = Array.from({ length: 42 }, (_, i) => sumarDias(inicio, i));
  const fin = dias[41];

  const proyectos = await proyectosEnFoco();
  const entradas = await agenda(ctx, proyectos, inicio, fin, conMis);
  const [persona] = await db.select().from(schema.personas).where(eq(schema.personas.id, ctx.personaId));
  const urlIcal = `${process.env.APP_URL ?? ""}/api/ical/${persona.icalToken}`;
  const puedeCrear = ctx.admin || proyectos.some((p) => dirigeProyecto(ctx, p.id));

  const mesAnt = mes === 1 ? `${anio - 1}-12` : `${anio}-${String(mes - 1).padStart(2, "0")}`;
  const mesSig = mes === 12 ? `${anio + 1}-01` : `${anio}-${String(mes + 1).padStart(2, "0")}`;
  const q = (m: string, mis = conMis) => `/calendario?m=${m}${mis ? "&mis=1" : ""}`;

  return (
    <>
      <div className="cabeza">
        <span className="etq etq-raya">Calendario · {proyectos.length === 1 ? proyectos[0].nombre : "todos los proyectos"}</span>
        <div className="form-fila" style={{ justifyContent: "space-between" }}>
          <h1>{nombreMes(anio, mes)}</h1>
          <div className="form-fila">
            <Link className="boton" href={q(mesAnt)} aria-label="Mes anterior">←</Link>
            <Link className="boton" href={q(hoy.slice(0, 7))}>Hoy</Link>
            <Link className="boton" href={q(mesSig)} aria-label="Mes siguiente">→</Link>
            <Link className={`boton ${conMis ? "lleno" : ""}`} href={q(`${anio}-${String(mes).padStart(2, "0")}`, !conMis)}>{conMis ? "Con mis tareas" : "Mostrar mis tareas"}</Link>
          </div>
        </div>
        <p>Grabaciones, publicaciones y juntas de todo el equipo. El color es el área de quien lo lidera; los códigos dicen quién debe estar.</p>
      </div>

      <div className="mes" role="grid" aria-label={nombreMes(anio, mes)}>
        {DIAS.map((d) => <div key={d} className="dia-nombre">{d}</div>)}
        {dias.map((d) => {
          const del = entradas.filter((e) => e.fecha === d);
          const fuera = d.slice(0, 7) !== primero.slice(0, 7);
          return (
            <div key={d} className={`dia ${fuera ? "fuera" : ""} ${d === hoy ? "hoy" : ""} ${!del.length ? "vacio-movil" : ""}`}>
              <span className="n">{Number(d.slice(8))}</span>
              {del.map((e, i) => {
                const contenido = <><b>{e.roles.map((r) => `[${r}]`).join("")}</b> {e.hora ? `${e.hora} ` : ""}{e.titulo}</>;
                const estilo = { borderLeftColor: colorDeRol(e.roles[0] ?? "") };
                const titulo = `${e.proyecto} · ${e.titulo}`;
                return e.enlace
                  ? <Link key={i} href={e.enlace} className={`ev ${e.tipo}`} style={estilo} title={titulo}>{contenido}</Link>
                  : <span key={i} className={`ev ${e.tipo}`} style={estilo} title={titulo}>{contenido}</span>;
              })}
            </div>
          );
        })}
      </div>

      <div className="rejilla seccion" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        <div className="caja">
          <span className="etq">Ver en tu Google Calendar</span>
          <p className="gris" style={{ fontSize: ".9rem" }}>En Google Calendar: Otros calendarios › + › Desde URL, y pega este enlace. Incluye tus grabaciones, publicaciones, juntas y tus fechas límite. Es personal: no lo compartas.</p>
          <input readOnly value={urlIcal} aria-label="Enlace de suscripción al calendario" />
        </div>
        {puedeCrear ? (
          <div className="caja">
            <span className="etq">Agregar junta o reserva</span>
            <form action={nuevoEvento} style={{ display: "grid", gap: 10 }}>
              <label>Título<input name="titulo" required placeholder="Junta editorial" /></label>
              <div className="form-fila">
                <label>Fecha<input type="date" name="fecha" required /></label>
                <label>Hora<input type="time" name="hora" /></label>
                <label>Tipo<select name="tipo"><option value="junta">Junta</option><option value="reserva">Reserva de set</option><option value="otro">Otro</option></select></label>
              </div>
              <div className="form-fila">
                <label>Proyecto<select name="proyecto">
                  {ctx.admin ? <option value="">General</option> : null}
                  {proyectos.filter((p) => dirigeProyecto(ctx, p.id)).map((p) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                </select></label>
                <label style={{ flex: 1 }}>Roles que deben estar<input name="roles" placeholder="ED PE PR EG" /></label>
              </div>
              <label>Lugar<input name="lugar" placeholder="Set Verde, Narvarte" /></label>
              <button type="submit">Agregar</button>
            </form>
          </div>
        ) : null}
      </div>
    </>
  );
}
