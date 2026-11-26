import Link from "next/link";
import { eq, inArray } from "drizzle-orm";
import { db, schema } from "@/db";
import { proyectosVisibles, requierePersona } from "@/lib/sesion";
import { unidadesDe } from "@/lib/consultas";
import { rolesEn } from "@/lib/acceso";
import { Rol } from "@/components/ui";

export const metadata = { title: "Proyectos" };

export default async function Proyectos() {
  const ctx = await requierePersona();
  const visibles = await proyectosVisibles();
  const ids = visibles.map((p) => p.id);
  const unidades = await unidadesDe(ids);
  const clientes = ids.length ? await db.select().from(schema.clientes).where(inArray(schema.clientes.id, visibles.map((p) => p.clienteId))) : [];
  const formatos = await db.select().from(schema.formatos).where(eq(schema.formatos.activo, true));

  return (
    <>
      <div className="cabeza">
        <span className="etq etq-raya">Proyectos</span>
        <h1>{visibles.length} {visibles.length === 1 ? "proyecto" : "proyectos"} en producción.</h1>
        <p>Cada proyecto es un show o una producción con su cliente, su formato y su equipo. {ctx.admin ? "Los proyectos nuevos se crean en Configuración." : ""}</p>
      </div>
      <div className="rejilla">
        {visibles.map((p) => {
          const us = unidades.filter((u) => u.proyectoId === p.id);
          const cliente = clientes.find((c) => c.id === p.clienteId);
          const formato = formatos.find((f) => f.id === p.formatoId);
          const mis = [...rolesEn(ctx, p.id)];
          return (
            <Link key={p.id} href={`/proyectos/${p.slug}`} className="caja" style={{ textDecoration: "none" }}>
              <span className="etq">{formato?.nombre ?? p.formatoId} · {cliente?.nombre}</span>
              <h3>{p.nombre}</h3>
              <span className="gris">{us.length} {formato?.unidadPlural ?? "unidades"}</span>
              {mis.length ? <span className="roles">{mis.map((r) => <Rol key={r} codigo={r} />)}</span> : null}
            </Link>
          );
        })}
      </div>
      {!visibles.length ? <p className="vacio">Aún no participas en ningún proyecto. Pide que te asignen un rol.</p> : null}
    </>
  );
}
