import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { and, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { modoDemo } from "@/db/index";
import { baseLista } from "@/db/lista";

/** Entrada sin Google: en desarrollo local, o en la demostración (que solo tiene datos de prueba en memoria). */
export const loginDePrueba = modoDemo || (process.env.DEV_LOGIN === "1" && process.env.NODE_ENV !== "production" && process.env.VERCEL_ENV !== "production");
export { modoDemo };

async function personaPorEmail(email: string) {
  await baseLista();
  const [p] = await db.select().from(schema.personas)
    .where(and(eq(schema.personas.email, email.toLowerCase()), eq(schema.personas.activo, true)));
  return p;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/entrar", error: "/entrar" },
  providers: [
    ...(modoDemo ? [] : [Google({ authorization: { params: { prompt: "select_account" } } })]),
    ...(loginDePrueba
      ? [Credentials({
          id: "prueba",
          name: "Prueba",
          credentials: { email: {} },
          async authorize(c) {
            const p = await personaPorEmail(String(c?.email ?? ""));
            return p ? { id: String(p.id), email: p.email, name: p.nombre } : null;
          },
        })]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "prueba") return true;
      // Solo entran correos dados de alta y activos en Configuración.
      const p = user.email ? await personaPorEmail(user.email) : undefined;
      return p ? true : "/entrar?error=no-autorizado";
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const p = await personaPorEmail(user.email);
        if (p) token.personaId = p.id;
      }
      return token;
    },
    async session({ session, token }) {
      (session as unknown as { personaId?: number }).personaId = token.personaId as number | undefined;
      return session;
    },
  },
});
