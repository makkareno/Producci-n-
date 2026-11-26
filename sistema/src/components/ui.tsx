import { AREAS, ESTADOS_TAREA, ROLES, type EstadoTarea } from "@/lib/catalogo";
import { AREA_DE_ROL } from "@/lib/acceso";

const COLOR_AREA = new Map<string, string>(AREAS.map((a) => [a.id, a.color]));
const NOMBRE_ROL = new Map(ROLES.map((r) => [r.codigo, r.nombre]));

export function colorDeRol(codigo: string) {
  return COLOR_AREA.get(AREA_DE_ROL.get(codigo) ?? "") ?? "#a4aebd";
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
