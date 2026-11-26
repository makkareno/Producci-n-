import Link from "next/link";
import { cambiarEstadoTarea } from "@/app/acciones";
import type { TareaFila } from "@/lib/consultas";
import { etiquetaRelativa, fechaCorta, hoyCDMX } from "@/lib/fechas";
import { Estado, Roles } from "./ui";

function Boton({ tarea, estado, texto, clase = "" }: { tarea: number; estado: string; texto: string; clase?: string }) {
  return (
    <form action={cambiarEstadoTarea}>
      <input type="hidden" name="tarea" value={tarea} />
      <input type="hidden" name="estado" value={estado} />
      <button className={`mini ${clase}`} type="submit">{texto}</button>
    </form>
  );
}

/** Acciones disponibles según el estado y lo que la persona puede hacer. */
export function AccionesTarea({ t }: { t: TareaFila }) {
  const a: React.ReactNode[] = [];
  if (t.estado === "review") {
    if (t.apruebo) {
      a.push(<Boton key="ok" tarea={t.id} estado="done" texto="Aprobar" clase="ok" />);
      a.push(<Boton key="dev" tarea={t.id} estado="doing" texto="Devolver" />);
    }
  } else if (t.estado !== "done" && (t.hago || t.apruebo)) {
    if (t.estado === "todo") a.push(<Boton key="emp" tarea={t.id} estado="doing" texto="Empezar" />);
    if (t.estado === "blocked") a.push(<Boton key="des" tarea={t.id} estado="doing" texto="Desbloquear" />);
    if (t.estado === "doing" || t.estado === "todo") a.push(<Boton key="rev" tarea={t.id} estado="review" texto="A revisión" clase="ok" />);
    if (t.estado !== "blocked") {
      a.push(
        <details key="blq">
          <summary className="mini-sum"><span className="boton" style={{ padding: "4px 8px", fontSize: ".64rem", borderColor: "var(--rec)", color: "var(--rec)" }}>Bloquear</span></summary>
          <form action={cambiarEstadoTarea}>
            <input type="hidden" name="tarea" value={t.id} />
            <input type="hidden" name="estado" value="blocked" />
            <input name="nota" placeholder="¿Qué falta?" aria-label="Motivo del bloqueo" required style={{ padding: "4px 8px", fontSize: ".8rem" }} />
            <button className="mini alerta" type="submit">Guardar</button>
          </form>
        </details>,
      );
    }
  } else if (t.estado === "done" && t.apruebo) {
    a.push(<Boton key="reab" tarea={t.id} estado="doing" texto="Reabrir" />);
  }
  return <div className="acciones-tarea">{a}</div>;
}

export function TablaTareas({ lista, mostrarUnidad = true, vacio = "Nada por aquí." }: { lista: TareaFila[]; mostrarUnidad?: boolean; vacio?: string }) {
  if (!lista.length) return <p className="vacio">{vacio}</p>;
  const hoy = hoyCDMX();
  return (
    <div className="desplazable">
      <table>
        <thead>
          <tr>
            <th>Tarea</th><th></th><th>Hace → aprueba</th><th>Vence</th><th>Estado</th><th></th>
          </tr>
        </thead>
        <tbody>
          {lista.map((t) => {
            const vencida = t.fechaLimite && t.fechaLimite < hoy && t.estado !== "done";
            return (
              <tr key={t.id} className={t.estado}>
                <td className="codigo">
                  {mostrarUnidad ? <Link href={`/u/${t.unidadId}`}>{t.unidadCodigo}</Link> : null}
                  {mostrarUnidad ? " · " : ""}{t.fase} · {t.codigo}
                </td>
                <td className="nombre">
                  {t.nombre}
                  {mostrarUnidad ? <div className="tenue" style={{ fontSize: ".78rem" }}>{t.proyectoNombre}</div> : null}
                  {t.estado === "blocked" && t.notaBloqueo ? <div className="nota">{t.notaBloqueo}</div> : null}
                </td>
                <td><Roles hace={t.rolesHace} aprueba={t.rolAprueba} /></td>
                <td className={`fecha ${vencida ? "vencida" : ""}`}>
                  {t.fechaLimite ? fechaCorta(t.fechaLimite) : "Sin fecha"}
                  <div className="tenue" style={{ fontSize: ".72rem" }}>{etiquetaRelativa(t.referencia, t.desfase)}</div>
                </td>
                <td><Estado estado={t.estado} /></td>
                <td className="acciones"><AccionesTarea t={t} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
