/*
 * Conexión a la base de datos.
 *  - DEMO=1: demostración con datos de prueba. Con DATABASE_URL usa esa base (que debe ser una base
 *    exclusiva para la demo); sin ella, PGlite en memoria.
 *  - Con DATABASE_URL (postgres://…): Postgres real (local o Neon en producción).
 *  - Sin DATABASE_URL: PGlite guardado en ./.datos (para probar en una computadora sin instalar nada).
 */
import { drizzle as drizzlePg, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { drizzle as drizzleLite } from "drizzle-orm/pglite";
import { PGlite } from "@electric-sql/pglite";
import { Pool } from "pg";
import * as schema from "./schema";

export const modoDemo = process.env.DEMO === "1";
const hayPostgres = !!process.env.DATABASE_URL?.startsWith("postgres");
/** Demo sin base compartida: cada servidor tiene su propia copia en memoria. */
export const demoEnMemoria = modoDemo && !hayPostgres;
export const usaPglite = !hayPostgres;
export const carpetaPglite = process.env.PGLITE_DIR ?? ".datos/pglite";

type Db = NodePgDatabase<typeof schema>;
const g = globalThis as unknown as { __db?: Db; __lite?: PGlite };

function crear(): Db {
  if (demoEnMemoria) {
    g.__lite ??= new PGlite(); // en memoria
    return drizzleLite(g.__lite, { schema }) as unknown as Db;
  }
  if (usaPglite) {
    if (process.env.VERCEL) throw new Error("Falta DATABASE_URL en Vercel.");
    g.__lite ??= new PGlite(carpetaPglite);
    return drizzleLite(g.__lite, { schema }) as unknown as Db;
  }
  const url = process.env.DATABASE_URL!;
  const pool = new Pool({ connectionString: url, max: 5, ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: true } });
  return drizzlePg(pool, { schema });
}

export const db: Db = g.__db ?? crear();
g.__db = db;
export { schema };
