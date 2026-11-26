import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { auth, signIn, loginDePrueba } from "@/auth";
import { db, schema } from "@/db";

export const metadata = { title: "Entrar" };

const ERRORES: Record<string, string> = {
  "no-autorizado": "Ese correo no tiene acceso. Pide a quien administra el sistema que te dé de alta.",
  AccessDenied: "Ese correo no tiene acceso. Pide a quien administra el sistema que te dé de alta.",
  Configuration: "El inicio de sesión no está configurado todavía.",
};

export default async function Entrar({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const sesion = await auth();
  if ((sesion as unknown as { personaId?: number } | null)?.personaId && !error) redirect("/");

  const personas = loginDePrueba
    ? await db.select().from(schema.personas).where(eq(schema.personas.activo, true)).orderBy(asc(schema.personas.nombre))
    : [];

  return (
    <main className="entrar">
      <div className="tarjeta">
        <img src="/marca/quervo-studios_apilado_negativo.svg" alt="QUERVO Studios" width={220} height={57} />
        <div style={{ display: "grid", gap: 8 }}>
          <span className="etq etq-raya">Sistema de producción</span>
          <h1 style={{ fontSize: "2.45rem" }}>Entra con tu cuenta de Google.</h1>
        </div>
        {error ? <p className="error" role="alert">{ERRORES[error] ?? "No se pudo iniciar sesión. Intenta de nuevo."}</p> : null}
        <form action={async () => { "use server"; await signIn("google", { redirectTo: "/" }); }}>
          <button className="lleno" type="submit" style={{ width: "100%", justifyContent: "center", padding: "14px" }}>Entrar con Google</button>
        </form>

        {loginDePrueba ? (
          <div className="caja" style={{ gap: 10 }}>
            <span className="etq">Solo en desarrollo · entrar como</span>
            <form
              action={async (f: FormData) => { "use server"; await signIn("prueba", { email: String(f.get("email")), redirectTo: "/" }); }}
              className="form-fila"
            >
              <select name="email" aria-label="Persona" style={{ flex: 1 }}>
                {personas.map((p) => <option key={p.id} value={p.email}>{p.nombre}{p.admin ? " · admin" : ""}</option>)}
              </select>
              <button type="submit">Entrar</button>
            </form>
          </div>
        ) : null}
      </div>
    </main>
  );
}
