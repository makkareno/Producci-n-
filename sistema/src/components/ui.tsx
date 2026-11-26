import { ESTADOS_TAREA, ROLES, type EstadoTarea } from "@/lib/catalogo";
import { AREA_DE_ROL } from "@/lib/acceso";

const NOMBRE_ROL = new Map(ROLES.map((r) => [r.codigo, r.nombre]));

/** Color de trabajo del área del rol, como variable CSS: cambia sola entre tema de día y de noche. */
export function colorDeRol(codigo: string) {
  return `var(--a-${AREA_DE_ROL.get(codigo) ?? "adm"})`;
}

/** Firma de QUERVO Studios: blanca en noche, negra en día. Nunca en color. */
export function Logo({ version, ancho, alto }: { version: "horizontal" | "apilado"; ancho: number; alto: number }) {
  const archivo = version === "horizontal" ? "quervo-studios_horizontal_%_chica.svg" : "quervo-studios_apilado_%.svg";
  return (
    <>
      <img className="solo-noche" src={`/marca/${archivo.replace("%", "negativo")}`} alt="QUERVO Studios" width={ancho} height={alto} style={{ width: ancho, height: "auto" }} />
      <img className="solo-dia" src={`/marca/${archivo.replace("%", "positivo")}`} alt="" aria-hidden="true" width={ancho} height={alto} style={{ width: ancho, height: "auto" }} />
    </>
  );
}

/** Chip de rol: relleno = lo hace; contorno = lo aprueba. */
export function Rol({ codigo, aprueba = false }: { codigo: string; aprueba?: boolean }) {
  const c = colorDeRol(codigo);
  const titulo = `${aprueba ? "Aprueba" : "Hace"}: ${NOMBRE_ROL.get(codigo) ?? codigo}`;
  return aprueba
    ? <span className="rol ap" style={{ color: c }} title={titulo}>{codigo}</span>
    : <span className="rol" style={{ background: c }} title={titulo}>{codigo}</span>;
}

export function Roles({ hace, aprueba }: { hace: string[]; aprueba?: string }) {
  return (
    <span className="roles">
      {hace.map((r) => <Rol key={r} codigo={r} />)}
      {aprueba ? <><span className="tenue" aria-hidden="true">→</span><Rol codigo={aprueba} aprueba /></> : null}
    </span>
  );
}

export function Estado({ estado }: { estado: string }) {
  const e = ESTADOS_TAREA[estado as EstadoTarea] ?? ESTADOS_TAREA.todo;
  return <span className={`estado ${estado}`}><span aria-hidden="true">{e.simbolo}</span>{e.nombre}</span>;
}
