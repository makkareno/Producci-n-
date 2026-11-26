/* Aplica las migraciones SQL de ./drizzle a la base configurada (Postgres o PGlite). */
import { existsSync, writeFileSync, mkdirSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { migrate as migrarPg } from "drizzle-orm/node-postgres/migrator";
import { migrate as migrarLite } from "drizzle-orm/pglite/migrator";
import { db, usaPglite, carpetaPglite } from "./index";

async function main() {
  if (usaPglite) {
    mkdirSync(carpetaPglite, { recursive: true });
    // Primera vez en una computadora: crea la configuración local mínima.
    if (!existsSync(".env.local")) {
      writeFileSync(".env.local", [
        "# Generado al preparar el entorno local. Base de datos: PGlite en ./.datos",
        `AUTH_SECRET=${randomBytes(32).toString("base64")}`,
        "AUTH_GOOGLE_ID=local",
        "AUTH_GOOGLE_SECRET=local",
        "DEV_LOGIN=1",
        "APP_URL=http://localhost:3000",
        "",
      ].join("\n"));
      console.log("Creado .env.local para uso local.");
    }
    await migrarLite(db as never, { migrationsFolder: "./drizzle" });
  } else {
    await migrarPg(db, { migrationsFolder: "./drizzle" });
  }
  console.log(`Tablas al día (${usaPglite ? "PGlite local" : "Postgres"}).`);
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
