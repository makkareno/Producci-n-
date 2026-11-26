"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";

export function Navegacion({ enlaces }: { enlaces: { href: string; texto: string }[] }) {
  const ruta = usePathname();
  return (
    <nav aria-label="Principal">
      {enlaces.map((e) => {
        const activo = e.href === "/" ? ruta === "/" : ruta.startsWith(e.href);
        return <Link key={e.href} href={e.href} aria-current={activo ? "page" : undefined}>{e.texto}</Link>;
      })}
    </nav>
  );
}

/** Selector de proyecto: se envía solo al cambiar. */
export function SelectorProyecto({ accion, opciones, actual }: {
  accion: (f: FormData) => Promise<void>;
  opciones: { slug: string; nombre: string }[];
  actual: string;
}) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <form ref={form} action={accion} className="selector">
      <label htmlFor="selector-proyecto" className="etq" style={{ display: "block" }}>Proyecto</label>
      <select id="selector-proyecto" name="proyecto" defaultValue={actual} onChange={() => form.current?.requestSubmit()}>
        <option value="todos">Todos los proyectos</option>
        {opciones.map((o) => <option key={o.slug} value={o.slug}>{o.nombre}</option>)}
      </select>
      <noscript><button type="submit">Ver</button></noscript>
    </form>
  );
}
