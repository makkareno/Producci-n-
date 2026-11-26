/*
 * Carga el catálogo base (idempotente). Uso:
 *   npm run db:seed                → catálogo + equipo (si existe equipo.local.json)
 *   npm run local                  → en una computadora: tablas + catálogo + demostración + servidor
 *   npm run db:seed -- --demo      → además, un proyecto de demostración con datos de ejemplo
 *
 * equipo.local.json (no se versiona): [{ "nombre": "...", "email": "...", "admin": true }]
 */
import { readFileSync, existsSync } from "node:fs";
import { catalogo, demo, persona } from "./datos";

async function equipo() {
  const ruta = new URL("../../equipo.local.json", import.meta.url);
  if (!existsSync(ruta)) { console.log("Sin equipo.local.json: el equipo se da de alta desde Configuración."); return; }
  const lista = JSON.parse(readFileSync(ruta, "utf8")) as { nombre: string; email: string; admin?: boolean }[];
  for (const p of lista) await persona(p.nombre, p.email, !!p.admin);
  console.log(`Equipo: ${lista.length} personas.`);
}

async function main() {
  await catalogo();
  await equipo();
  if (process.argv.includes("--demo")) await demo();
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
