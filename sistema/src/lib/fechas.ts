/* Fechas como texto "AAAA-MM-DD" para evitar desfases de zona horaria. */

export function sumarDias(fecha: string, dias: number): string {
  const [a, m, d] = fecha.split("-").map(Number);
  const f = new Date(Date.UTC(a, m - 1, d + dias));
  return f.toISOString().slice(0, 10);
}

export function diasEntre(desde: string, hasta: string): number {
  const a = Date.parse(desde + "T00:00:00Z");
  const b = Date.parse(hasta + "T00:00:00Z");
  return Math.round((b - a) / 86_400_000);
}

/** Hoy en la Ciudad de México. */
export function hoyCDMX(ahora = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit" }).format(ahora);
}

/** Fecha límite de una tarea según su referencia (G o P) y desfase. */
export function fechaLimite(referencia: string, desfase: number, fechaG: string | null, fechaP: string | null): string | null {
  const base = referencia === "P" ? fechaP : fechaG;
  return base ? sumarDias(base, desfase) : null;
}

/** Etiqueta relativa: G−7, G, P+30. */
export function etiquetaRelativa(referencia: string, desfase: number): string {
  if (desfase === 0) return referencia;
  return referencia + (desfase > 0 ? "+" : "−") + Math.abs(desfase);
}

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const DIAS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

export function fechaCorta(fecha: string): string {
  const [a, m, d] = fecha.split("-").map(Number);
  const dia = new Date(Date.UTC(a, m - 1, d)).getUTCDay();
  return `${DIAS[dia]} ${d} ${MESES[m - 1]}`;
}

export function nombreMes(anio: number, mes: number): string {
  const n = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  return `${n[mes - 1]} ${anio}`;
}
