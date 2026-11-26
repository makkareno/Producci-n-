import Link from "next/link";
import { signOut, modoDemo } from "@/auth";
import { cookies } from "next/headers";
import { elegirProyecto, elegirTema } from "@/app/acciones";
import { Logo } from "@/components/ui";
import { proyectoActual, proyectosVisibles, requierePersona } from "@/lib/sesion";
import { Navegacion, SelectorProyecto } from "@/components/navegacion";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requierePersona();
  const visibles = await proyectosVisibles();
  const actual = await proyectoActual();
  const tema = (await cookies()).get("tema")?.value ?? "auto";

  const enlaces = [
    { href: "/", texto: "Panel" },
    { href: "/pendientes", texto: "Mis pendientes" },
    { href: "/calendario", texto: "Calendario" },
    { href: "/area", texto: "Mi área" },
    { href: "/proyectos", texto: "Proyectos" },
    ...(ctx.admin ? [{ href: "/configuracion", texto: "Configuración" }] : []),
  ];

  return (
    <>
      {modoDemo ? <div className="aviso-demo">Demostración · datos de prueba · los cambios pueden reiniciarse</div> : null}
      <header className="cab">
        <div className="envoltura">
          <Link href="/" className="logo" aria-label="Inicio">
            <Logo version="horizontal" ancho={150} alto={17} />
          </Link>
          <Navegacion enlaces={enlaces} />
          <SelectorProyecto accion={elegirProyecto} opciones={visibles.map((p) => ({ slug: p.slug, nombre: p.nombre }))} actual={actual?.slug ?? "todos"} />
          <form action={elegirTema} className="tema" aria-label="Tema">
            {[["dia", "Día"], ["noche", "Noche"], ["auto", "Auto"]].map(([v, t]) => (
              <button key={v} type="submit" name="tema" value={v} aria-pressed={tema === v} title={v === "auto" ? "Según tu dispositivo" : `Tema de ${t.toLowerCase()}`}>{t}</button>
            ))}
          </form>
          <div className="yo">
            <span>{ctx.nombre}</span>
            <form action={async () => { "use server"; await signOut({ redirectTo: "/entrar" }); }}>
              <button className="mini" type="submit">Salir</button>
            </form>
          </div>
        </div>
      </header>
      <main className="envoltura">{children}</main>
      <footer className="pie">
        <div className="envoltura">
          <span className="etq">Sistema de producción · v0.1</span>
          <Logo version="apilado" ancho={120} alto={31} />
        </div>
      </footer>
    </>
  );
}
