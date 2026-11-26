CREATE TABLE "areas" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"color" text NOT NULL,
	"orden" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "asignaciones" (
	"proyecto_id" integer NOT NULL,
	"rol" text NOT NULL,
	"persona_id" integer NOT NULL,
	CONSTRAINT "asignaciones_proyecto_id_rol_persona_id_pk" PRIMARY KEY("proyecto_id","rol","persona_id")
);
--> statement-breakpoint
CREATE TABLE "bitacora" (
	"id" serial PRIMARY KEY NOT NULL,
	"persona_id" integer,
	"accion" text NOT NULL,
	"entidad" text NOT NULL,
	"entidad_id" integer,
	"detalle" jsonb,
	"fecha" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"interno" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departamentos" (
	"codigo" text PRIMARY KEY NOT NULL,
	"area_id" text NOT NULL,
	"nombre" text NOT NULL,
	"orden" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "eventos" (
	"id" serial PRIMARY KEY NOT NULL,
	"proyecto_id" integer,
	"titulo" text NOT NULL,
	"tipo" text NOT NULL,
	"fecha" date NOT NULL,
	"hora" text,
	"roles" text[] NOT NULL,
	"lugar" text,
	"creado_por" integer
);
--> statement-breakpoint
CREATE TABLE "formatos" (
	"id" text PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"unidad_singular" text NOT NULL,
	"unidad_plural" text NOT NULL,
	"activo" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "personas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"email" text NOT NULL,
	"admin" boolean DEFAULT false NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"ical_token" text NOT NULL,
	"creado" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plantilla_estados" (
	"plantilla_id" text NOT NULL,
	"codigo" text NOT NULL,
	"nombre" text NOT NULL,
	"descripcion" text NOT NULL,
	"puerta" text,
	"orden" integer NOT NULL,
	CONSTRAINT "plantilla_estados_plantilla_id_codigo_pk" PRIMARY KEY("plantilla_id","codigo")
);
--> statement-breakpoint
CREATE TABLE "plantilla_fases" (
	"plantilla_id" text NOT NULL,
	"codigo" text NOT NULL,
	"nombre" text NOT NULL,
	"orden" integer NOT NULL,
	CONSTRAINT "plantilla_fases_plantilla_id_codigo_pk" PRIMARY KEY("plantilla_id","codigo")
);
--> statement-breakpoint
CREATE TABLE "plantilla_puertas" (
	"plantilla_id" text NOT NULL,
	"codigo" text NOT NULL,
	"nombre" text NOT NULL,
	"descripcion" text NOT NULL,
	"rol_aprueba" text NOT NULL,
	"requisitos" text[] NOT NULL,
	CONSTRAINT "plantilla_puertas_plantilla_id_codigo_pk" PRIMARY KEY("plantilla_id","codigo")
);
--> statement-breakpoint
CREATE TABLE "plantilla_tareas" (
	"id" serial PRIMARY KEY NOT NULL,
	"plantilla_id" text NOT NULL,
	"codigo" text NOT NULL,
	"fase" text NOT NULL,
	"nombre" text NOT NULL,
	"roles_hace" text[] NOT NULL,
	"rol_aprueba" text NOT NULL,
	"referencia" text NOT NULL,
	"desfase" integer NOT NULL,
	"entregable" text NOT NULL,
	"criterio" text NOT NULL,
	"orden" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plantillas" (
	"id" text PRIMARY KEY NOT NULL,
	"formato_id" text NOT NULL,
	"nombre" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"dias_g_a_p" integer DEFAULT 7 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proyectos" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"nombre" text NOT NULL,
	"cliente_id" integer NOT NULL,
	"formato_id" text NOT NULL,
	"plantilla_id" text NOT NULL,
	"abreviatura" text NOT NULL,
	"activo" boolean DEFAULT true NOT NULL,
	"creado" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "puertas" (
	"id" serial PRIMARY KEY NOT NULL,
	"unidad_id" integer NOT NULL,
	"codigo" text NOT NULL,
	"nombre" text NOT NULL,
	"rol_aprueba" text NOT NULL,
	"requisitos" text[] NOT NULL,
	"aprobada" boolean DEFAULT false NOT NULL,
	"aprobada_por" integer,
	"aprobada_en" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"codigo" text PRIMARY KEY NOT NULL,
	"departamento" text NOT NULL,
	"nombre" text NOT NULL,
	"resumen" text NOT NULL,
	"responsable" boolean DEFAULT false NOT NULL,
	"orden" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tareas" (
	"id" serial PRIMARY KEY NOT NULL,
	"unidad_id" integer NOT NULL,
	"codigo" text NOT NULL,
	"fase" text NOT NULL,
	"nombre" text NOT NULL,
	"roles_hace" text[] NOT NULL,
	"rol_aprueba" text NOT NULL,
	"referencia" text NOT NULL,
	"desfase" integer NOT NULL,
	"fecha_limite" date,
	"estado" text DEFAULT 'todo' NOT NULL,
	"nota_bloqueo" text,
	"entregable" text NOT NULL,
	"criterio" text NOT NULL,
	"orden" integer NOT NULL,
	"actualizado" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unidades" (
	"id" serial PRIMARY KEY NOT NULL,
	"proyecto_id" integer NOT NULL,
	"codigo" text NOT NULL,
	"temporada" integer,
	"numero" integer NOT NULL,
	"titulo" text NOT NULL,
	"estado" text NOT NULL,
	"fecha_g" date,
	"fecha_p" date,
	"invitado" text,
	"notas" text,
	"creado" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_rol_roles_codigo_fk" FOREIGN KEY ("rol") REFERENCES "public"."roles"("codigo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "asignaciones" ADD CONSTRAINT "asignaciones_persona_id_personas_id_fk" FOREIGN KEY ("persona_id") REFERENCES "public"."personas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bitacora" ADD CONSTRAINT "bitacora_persona_id_personas_id_fk" FOREIGN KEY ("persona_id") REFERENCES "public"."personas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "departamentos" ADD CONSTRAINT "departamentos_area_id_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."areas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_creado_por_personas_id_fk" FOREIGN KEY ("creado_por") REFERENCES "public"."personas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantilla_estados" ADD CONSTRAINT "plantilla_estados_plantilla_id_plantillas_id_fk" FOREIGN KEY ("plantilla_id") REFERENCES "public"."plantillas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantilla_fases" ADD CONSTRAINT "plantilla_fases_plantilla_id_plantillas_id_fk" FOREIGN KEY ("plantilla_id") REFERENCES "public"."plantillas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantilla_puertas" ADD CONSTRAINT "plantilla_puertas_plantilla_id_plantillas_id_fk" FOREIGN KEY ("plantilla_id") REFERENCES "public"."plantillas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantilla_puertas" ADD CONSTRAINT "plantilla_puertas_rol_aprueba_roles_codigo_fk" FOREIGN KEY ("rol_aprueba") REFERENCES "public"."roles"("codigo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantilla_tareas" ADD CONSTRAINT "plantilla_tareas_plantilla_id_plantillas_id_fk" FOREIGN KEY ("plantilla_id") REFERENCES "public"."plantillas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantilla_tareas" ADD CONSTRAINT "plantilla_tareas_rol_aprueba_roles_codigo_fk" FOREIGN KEY ("rol_aprueba") REFERENCES "public"."roles"("codigo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plantillas" ADD CONSTRAINT "plantillas_formato_id_formatos_id_fk" FOREIGN KEY ("formato_id") REFERENCES "public"."formatos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_formato_id_formatos_id_fk" FOREIGN KEY ("formato_id") REFERENCES "public"."formatos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proyectos" ADD CONSTRAINT "proyectos_plantilla_id_plantillas_id_fk" FOREIGN KEY ("plantilla_id") REFERENCES "public"."plantillas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puertas" ADD CONSTRAINT "puertas_unidad_id_unidades_id_fk" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "puertas" ADD CONSTRAINT "puertas_aprobada_por_personas_id_fk" FOREIGN KEY ("aprobada_por") REFERENCES "public"."personas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "roles" ADD CONSTRAINT "roles_departamento_departamentos_codigo_fk" FOREIGN KEY ("departamento") REFERENCES "public"."departamentos"("codigo") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tareas" ADD CONSTRAINT "tareas_unidad_id_unidades_id_fk" FOREIGN KEY ("unidad_id") REFERENCES "public"."unidades"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_proyecto_id_proyectos_id_fk" FOREIGN KEY ("proyecto_id") REFERENCES "public"."proyectos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "evento_fecha" ON "eventos" USING btree ("fecha");--> statement-breakpoint
CREATE UNIQUE INDEX "persona_email" ON "personas" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "persona_ical" ON "personas" USING btree ("ical_token");--> statement-breakpoint
CREATE UNIQUE INDEX "plantilla_tarea_codigo" ON "plantilla_tareas" USING btree ("plantilla_id","codigo");--> statement-breakpoint
CREATE UNIQUE INDEX "proyecto_slug" ON "proyectos" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "puerta_unidad_codigo" ON "puertas" USING btree ("unidad_id","codigo");--> statement-breakpoint
CREATE INDEX "tarea_unidad" ON "tareas" USING btree ("unidad_id");--> statement-breakpoint
CREATE INDEX "tarea_fecha" ON "tareas" USING btree ("fecha_limite");--> statement-breakpoint
CREATE UNIQUE INDEX "unidad_codigo" ON "unidades" USING btree ("proyecto_id","codigo");--> statement-breakpoint
CREATE INDEX "unidad_fecha_g" ON "unidades" USING btree ("fecha_g");