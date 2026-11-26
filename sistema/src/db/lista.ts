/*
 * En modo demostración (DEMO=1) la base vive en memoria: en el primer uso de cada servidor
 * se crean las tablas y se cargan el catálogo y los datos de prueba. Fuera de ese modo no hace nada.
 */
import { sql } from "drizzle-orm";
import { db, modoDemo } from "./index";
import { SENTENCIAS } from "./esquema-sql";
import { catalogo, demo } from "./datos";

const g = globalThis as unknown as { __baseLista?: Promise<void> };

export function baseLista(): Promise<void> {
  if (!modoDemo) return Promise.resolve();
  g.__baseLista ??= (async () => {
    for (const s of SENTENCIAS) await db.execute(sql.raw(s));
    await catalogo();
    await demo();
  })().catch((e) => { g.__baseLista = undefined; throw e; });
  return g.__baseLista;
}
