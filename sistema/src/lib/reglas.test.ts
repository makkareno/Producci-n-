import { test } from "node:test";
import assert from "node:assert/strict";
import { sumarDias, fechaLimite, etiquetaRelativa, diasEntre } from "./fechas";
import { apruebaTarea, dirigeProyecto, puedeCambiarEstado, veTarea, type Contexto } from "./acceso";
import { TAREAS_PODCAST, PUERTAS, ROLES } from "./catalogo";

const ctx = (roles: string[], admin = false): Contexto => ({ personaId: 1, nombre: "X", email: "x@x", admin, roles: new Map([[10, new Set(roles)]]) });

test("fechas: suma días cruzando mes y año", () => {
  assert.equal(sumarDias("2026-12-28", 7), "2027-01-04");
  assert.equal(sumarDias("2026-03-01", -1), "2026-02-28");
  assert.equal(diasEntre("2026-11-25", "2026-12-02"), 7);
});

test("fechas: límite según G o P", () => {
  assert.equal(fechaLimite("G", -7, "2026-12-10", "2026-12-17"), "2026-12-03");
  assert.equal(fechaLimite("P", 30, "2026-12-10", "2026-12-17"), "2027-01-16");
  assert.equal(fechaLimite("G", 0, null, null), null);
  assert.equal(etiquetaRelativa("G", -21), "G−21");
  assert.equal(etiquetaRelativa("P", 0), "P");
});

test("plantilla: 49 tareas, códigos únicos y roles válidos", () => {
  assert.equal(TAREAS_PODCAST.length, 49);
  assert.equal(new Set(TAREAS_PODCAST.map((t) => t.codigo)).size, 49);
  const validos = new Set(ROLES.map((r) => r.codigo));
  for (const t of TAREAS_PODCAST) {
    for (const r of [...t.rolesHace, t.rolAprueba]) assert.ok(validos.has(r), `${t.codigo}: rol ${r}`);
  }
  const codigos = new Set(TAREAS_PODCAST.map((t) => t.codigo));
  for (const p of PUERTAS) for (const r of p.requisitos) assert.ok(codigos.has(r), `${p.codigo}: requisito ${r}`);
});

test("acceso: PR dirige el proyecto; el booker no", () => {
  assert.ok(dirigeProyecto(ctx(["PR"]), 10));
  assert.ok(!dirigeProyecto(ctx(["BK"]), 10));
  assert.ok(dirigeProyecto(ctx([], true), 10));
  assert.ok(!dirigeProyecto(ctx(["PR"]), 99));
});

test("acceso: cada quien ve lo suyo y lo de su área, no lo de otras", () => {
  const editor = ctx(["EA"]);
  assert.ok(veTarea(editor, 10, { rolesHace: ["EA"], rolAprueba: "CP" }));
  assert.ok(veTarea(editor, 10, { rolesHace: ["DG"], rolAprueba: "EG" })); // Diseño es de su misma área
  assert.ok(!veTarea(editor, 10, { rolesHace: ["BK"], rolAprueba: "PR" })); // Producción, otra área
});

test("acceso: quien hace manda a revisión; solo quien aprueba la cierra", () => {
  const bk = ctx(["BK"]);
  const t = { rolesHace: ["BK"], rolAprueba: "PR", estado: "doing" };
  assert.ok(puedeCambiarEstado(bk, 10, t, "review"));
  assert.ok(!puedeCambiarEstado(bk, 10, t, "done"));
  assert.ok(!puedeCambiarEstado(bk, 10, { ...t, estado: "review" }, "done"));
  assert.ok(puedeCambiarEstado(ctx(["PR"]), 10, { ...t, estado: "review" }, "done"));
});

test("acceso: si nadie cubre el rol que aprueba, aprueba PR", () => {
  const t = { rolesHace: ["EA"], rolAprueba: "CP" };
  assert.ok(!apruebaTarea(ctx(["EA"]), 10, t, new Set(["EA", "PR"])));
  assert.ok(apruebaTarea(ctx(["PR"]), 10, t, new Set(["EA", "PR"])));
});
