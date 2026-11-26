/* Copia las migraciones SQL de ./drizzle a un módulo TypeScript, para que el modo demostración
   pueda crear las tablas sin leer archivos en el servidor. Se ejecuta con `npm run db:generar`. */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const archivos = readdirSync("drizzle").filter((f) => f.endsWith(".sql")).sort();
const sentencias = archivos.flatMap((f) =>
  readFileSync(`drizzle/${f}`, "utf8").split("--> statement-breakpoint").map((x) => x.trim()).filter(Boolean));
writeFileSync("src/db/esquema-sql.ts",
  `/* Generado por src/db/exportar-sql.ts a partir de ./drizzle. No editar a mano. */\nexport const SENTENCIAS: string[] = ${JSON.stringify(sentencias, null, 2)};\n`);
console.log(`${sentencias.length} sentencias de ${archivos.length} migraciones.`);
