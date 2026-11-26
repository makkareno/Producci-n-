import Link from "next/link";
import { signOut, modoDemo } from "@/auth";
import { elegirProyecto } from "@/app/acciones";
import { proyectoActual, proyectosVisibles, requierePersona } from "@/lib/sesion";
import { Navegacion, SelectorProyecto } from "@/components/navegacion";

export const dynamic = "force-dynamic";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await requierePersona();
  const visibles = await proyectosVisibles();
  const actual = await proyectoActual();

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
            <img src="/marca/quervo-studios_horizontal_negativo_chica.svg" alt="QUERVO Studios" width={150} height={17} />
          </Link>
          <Navegacion enlaces={enlaces} />
          <SelectorProyecto accion={elegirProyecto} opciones={visibles.map((p) => ({ slug: p.slug, nombre: p.nombre }))} actual={actual?.slug ?? "todos"} />
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
          <img src="/marca/quervo-studios_apilado_negativo.svg" alt="QUERVO Studios" width={120} height={31} />
        </div>
      </footer>
    </>
  );
}
