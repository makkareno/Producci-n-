# Sistema de producción · QUERVO Studios

Aplicación web interna para gestionar la producción: proyectos de cualquier formato, episodios o piezas,
tareas por rol, puertas de aprobación y calendario. Diseño y reglas en `../docs/` (arquitectura y plan técnico).

**Etapa 1 (esta versión)**
- Inicio de sesión con Google.
- Personas, y roles asignados por proyecto.
- Proyectos con su cliente y formato (por ahora solo podcast).
- Episodios que nacen con 49 tareas y 7 puertas, con fechas calculadas desde la grabación (G) y la publicación (P).
- Pantallas: Panel general, Mis pendientes, Mi área, ficha de episodio, Calendario y suscripción iCal.
- Configuración solo para administración.

## Cómo está hecho

- Next.js 15 (App Router) y TypeScript. Los datos se leen y las acciones se ejecutan en el servidor.
- Postgres con Drizzle ORM (`src/db/schema.ts`).
- Auth.js con Google. Solo entran los correos dados de alta y activos.
- Permisos en `src/lib/acceso.ts`, comprobados en cada consulta y en cada acción.
- Catálogo (áreas, roles, plantilla del podcast) en `src/lib/catalogo.ts`.
- Identidad QUERVO Studios: Outfit en `src/fuentes/` (OFL), firmas en `public/marca/`.

## Trabajar en local

```bash
cp .env.example .env.local        # y ajusta DATABASE_URL
npm install
npx drizzle-kit push              # crea las tablas
npm run db:seed -- --demo         # catálogo + proyecto de demostración
npm run dev                       # http://localhost:3000
npm test                          # reglas de fechas, plantilla y permisos
```

- Con `DEV_LOGIN=1` aparece "entrar como" en `/entrar`, para probar con cada persona sin Google. **Nunca se activa en producción**: el código lo bloquea aunque la variable exista.
- El equipo real puede cargarse desde `equipo.local.json`, que no se versiona, o desde Configuración.

## Publicar en Vercel (equipo MAKARENO)

1. **Base de datos.** En Vercel › Storage › Create › Neon (Postgres), conectada al proyecto. Esto crea `DATABASE_URL`.
2. **Google.** En Google Cloud Console › APIs y servicios › Credenciales › ID de cliente OAuth (aplicación web):
   - Orígenes autorizados: `https://<dominio>`.
   - URI de redirección: `https://<dominio>/api/auth/callback/google`.
3. **Proyecto en Vercel**, con Root Directory = `sistema`. Variables de entorno:
   - `DATABASE_URL`
   - `AUTH_SECRET` (genéralo con `npx auth secret`)
   - `AUTH_GOOGLE_ID`
   - `AUTH_GOOGLE_SECRET`
   - `APP_URL=https://<dominio>`
   - **No** definas `DEV_LOGIN`.
4. Con `DATABASE_URL` de producción en el entorno local, crea las tablas y carga el catálogo:
   `npx drizzle-kit push && npm run db:seed` (sin `--demo`).
5. Entra con tu cuenta (admin), cambia los correos provisionales por los reales en Configuración, crea los proyectos y asigna los roles.

Para mudarlo después a un equipo de QUERVO, sigue `../docs/plan-tecnico.md` › Portabilidad.
