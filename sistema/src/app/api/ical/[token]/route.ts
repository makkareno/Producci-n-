import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { baseLista } from "@/db/lista";
import { agenda } from "@/lib/agenda";
import { hoyCDMX, sumarDias } from "@/lib/fechas";
import type { Contexto } from "@/lib/acceso";

export const dynamic = "force-dynamic";

function escapar(t: string) {
  return t.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Calendario personal en formato iCalendar, para suscribirse desde Google Calendar. */
export async function GET(_req: Request, { params }: { params: Promise<{ token: string }> }) {
  await baseLista();
  const token = (await params).token.replace(/\.ics$/, "");
  const [p] = await db.select().from(schema.personas).where(and(eq(schema.personas.icalToken, token), eq(schema.personas.activo, true)));
  if (!p) return new Response("No encontrado", { status: 404 });

  const asig = await db.select().from(schema.asignaciones).where(eq(schema.asignaciones.personaId, p.id));
  const roles = new Map<number, Set<string>>();
  for (const a of asig) { if (!roles.has(a.proyectoId)) roles.set(a.proyectoId, new Set()); roles.get(a.proyectoId)!.add(a.rol); }
  const ctx: Contexto = { personaId: p.id, nombre: p.nombre, email: p.email, admin: p.admin, roles };
  const proyectos = (await db.select().from(schema.proyectos).where(eq(schema.proyectos.activo, true)))
    .filter((x) => p.admin || roles.has(x.id));

  const hoy = hoyCDMX();
  const entradas = await agenda(ctx, proyectos, sumarDias(hoy, -30), sumarDias(hoy, 180), true);
  const sello = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  const base = (process.env.APP_URL ?? "").replace(/\/$/, "");
  const lineas = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//QUERVO Studios//Produccion//ES", "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${escapar("QUERVO Studios · " + p.nombre)}`, "X-WR-TIMEZONE:America/Mexico_City",
  ];
  entradas.forEach((e, i) => {
    const d = e.fecha.replace(/-/g, "");
    const uid = `${e.tipo}-${d}-${i}-${p.id}@quervo-produccion`;
    lineas.push("BEGIN:VEVENT", `UID:${uid}`, `DTSTAMP:${sello}`);
    if (e.hora) {
      const h = e.hora.replace(":", "") + "00";
      lineas.push(`DTSTART;TZID=America/Mexico_City:${d}T${h}`, "DURATION:PT1H");
    } else {
      lineas.push(`DTSTART;VALUE=DATE:${d}`, `DTEND;VALUE=DATE:${sumarDias(e.fecha, 1).replace(/-/g, "")}`);
    }
    const prefijo = e.tipo === "tarea" ? "Vence: " : "";
    lineas.push(`SUMMARY:${escapar(prefijo + e.roles.map((r) => `[${r}]`).join("") + " " + e.titulo)}`);
    lineas.push(`DESCRIPTION:${escapar(e.proyecto + (e.enlace && base ? `\n${base}${e.enlace}` : ""))}`);
    lineas.push("END:VEVENT");
  });
  lineas.push("END:VCALENDAR");
  return new Response(lineas.join("\r\n") + "\r\n", {
    headers: { "Content-Type": "text/calendar; charset=utf-8", "Cache-Control": "private, max-age=900" },
  });
}
