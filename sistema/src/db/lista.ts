/*
 * Modo demostración (DEMO=1): en el primer uso se crean las tablas y se cargan el catálogo y los datos
 * de prueba. Con base compartida (DATABASE_URL) se hace una sola vez; en memoria, una vez por servidor.
 * Fuera de ese modo no hace nada.
 */
import { sql } from "drizzle-orm";
import { db, modoDemo, demoEnMemoria } from "./index";
import { SENTENCIAS } from "./esquema-sql";
import { catalogo, demo } from "./datos";

const g = globalThis as unknown as { __baseLista?: Promise<void> };

export function baseLista(): Promise<void> {
  if (!modoDemo) return Promise.resolve();
  g.__baseLista ??= (async () => {
    if (demoEnMemoria) {
      for (const s of SENTENCIAS) await db.execute(sql.raw(s));
    } else {
      // Base compartida: varios servidores pueden arrancar a la vez; un candado evita crearla dos veces.
      await db.transaction(async (tx) => {
        await tx.execute(sql`select pg_advisory_xact_lock(727001)`);
        const r = await tx.execute(sql`select to_regclass('public.areas') as t`);
        const existe = (r as unknown as { rows: { t: string | null }[] }).rows[0]?.t;
        if (!existe) for (const s of SENTENCIAS) await tx.execute(sql.raw(s));
      });
    }
    if (!demoEnMemoria) {
      const r = await db.execute(sql`select 1 from proyectos where slug = 'podcast-demo'`);
      if ((r as unknown as { rows: unknown[] }).rows.length) return; // ya preparada por otro servidor
    }
    await catalogo();
    await demo();
  })().catch((e) => { g.__baseLista = undefined; throw e; });
  return g.__baseLista;
}
