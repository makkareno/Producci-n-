# Plan técnico · Sistema de producción QUERVO Studios

Estado: **propuesta para aprobación** · 2026-11-26

Decisión tomada: el sistema se construye **a la medida**, porque producir podcasts es una línea permanente de QUERVO Studios.
Se basa en la arquitectura aprobada en `docs/arquitectura.html`: áreas, departamentos, 26 roles,
colores y códigos, 7 fases, 49 tareas por episodio y 7 puertas de aprobación.

---

## 1. Tecnología propuesta

| Pieza | Elección | Por qué |
|---|---|---|
| Aplicación web | **Next.js + TypeScript** | Estándar, rápido y fácil de mantener; funciona en computadora y celular |
| Publicación | **Vercel**, equipo MAKARENO | Ya publican ahí 15 proyectos |
| Base de datos | **Postgres** (Neon, desde el Marketplace de Vercel) | Relacional, como el modelo de datos; respaldos automáticos |
| Inicio de sesión | **Cuenta de Google** + lista de correos autorizados | Sin contraseñas nuevas; solo entra quien esté dado de alta |
| Permisos | Por rol, **aplicados en el servidor** | Cada quien recibe solo los datos que le corresponden; no basta con ocultarlos en pantalla |
| Archivos | Siguen en **Google Drive**; el sistema guarda el enlace | Ya trabajan ahí y evita duplicar almacenamiento |
| Calendario | Dentro del sistema + **enlace de suscripción** por persona (iCal) | Cada quien ve sus fechas en Google Calendar sin configurar nada más |
| Avisos | Correo: tareas por vencer, vencidas y puertas pendientes | Fase 2 |
| Diseño | Identidad QUERVO Studios: negro, blanco, Outfit, firmas | Los colores por área quedan como señal interna |

## 2. Modelo de datos

```
Clientes ─┐
          └─ Shows (podcasts) ─ Temporadas ─ Episodios ─┬─ Tareas (49, desde plantilla)
                                                        ├─ Puertas P1–P7
                                                        ├─ Invitado(s)
                                                        ├─ Eventos de calendario
                                                        └─ Gastos

Personas ─ Asignaciones de rol (por show o temporada) ─ Roles (26) ─ Departamentos (11) ─ Áreas (6)
Plantilla de tareas (49) · Banco de temas · Bitácora de cambios
```

**Decisión clave propuesta: varios shows desde el inicio.**
QUERVO Studios produce podcasts para clientes (por ejemplo, EmociónEs). Si el sistema solo contempla
un podcast, habría que rehacerlo con el segundo cliente.

**Cómo se asigna el trabajo.** Las tareas se asignan a un **rol**, no a una persona. Cada show define
quién cubre cada rol, por ejemplo "PR = Persona A". Así:

- "Mis pendientes" muestra las tareas de todos los roles que tiene la persona en todos sus shows.
- Si alguien sale del equipo, se reasigna el rol una vez y todas sus tareas cambian de dueño.

**Fechas automáticas.** Cada tarea de la plantilla tiene un desfase respecto al día de grabación (G)
o de publicación (P), por ejemplo G−7. Si cambia G, todas las fechas se recalculan.

## 3. Pantallas

| Pantalla | Quién la ve | Contenido |
|---|---|---|
| **Panel general** | Todos | Episodios por estado y show, próximas grabaciones y publicaciones, semáforo de bloqueos |
| **Calendario** | Todos | Grabaciones, publicaciones, juntas y reservas de set (Cortinas, Librero, Verde), con el color de área y los códigos de rol |
| **Mis pendientes** | Cada persona | Lo que me toca hacer y lo que me toca aprobar, ordenado por fecha |
| **Episodio** | Quien participa en él | Ficha, tareas por fase, puertas, invitado, enlaces a Drive |
| **Mi área** | Integrantes del área | Tareas y carga de trabajo del área en todos los shows |
| **Invitados** | DIR, PROD, EDIT, MKT | Directorio con estado de contacto y autorización firmada |
| **Banco de temas** | DIR, EDIT, PROD | Ideas con prioridad; de aquí nacen los episodios |
| **Dirección** | DIR, ADM | Presupuesto contra gasto real, indicadores, episodios en banco |
| **Configuración** | PE, PR | Personas, roles, shows, plantilla de tareas |

### Reglas de visibilidad

| Dato | Quién lo ve |
|---|---|
| Panel general y calendario | Todos (sin montos) |
| Tareas | Las propias, las de mi área y las de los episodios en que participo. DIR y PROD ven todas. |
| Datos de contacto de invitados | DIR, PROD, EDIT, MKT |
| Presupuesto, tarifas y pagos | Solo DIR y ADM |
| Personas y roles | Todos ven quién cubre cada rol; solo PE y PR los editan |

## 4. Etapas de construcción

| Etapa | Contenido | Resultado |
|---|---|---|
| **1 · Base** | Inicio de sesión con Google, personas y roles, shows y episodios, generación de las 49 tareas, puertas, Mis pendientes, Panel general, Calendario y suscripción iCal | El equipo ya puede operar un episodio completo |
| **2 · Operación** | Invitados, banco de temas, presupuesto y gastos, avisos por correo, bitácora de cambios | El sistema reemplaza las hojas sueltas |
| **3 · Crecimiento** | Métricas por episodio, inventario de equipo (enlazado a Rentals), reservas de sets, contratos y licencias | Visión completa de Studios |
| **Después** | Portal para clientes (ver el avance de su podcast), estadísticas automáticas de plataformas | Producto diferencial para clientes |

La etapa 1 se construye y prueba con un **episodio piloto real** antes de seguir.

## 5. Costos a confirmar

- **Vercel:** el plan gratuito (Hobby) es solo para uso personal y no comercial. Una herramienta de la empresa requiere el plan **Pro** del equipo. Hay que confirmar el plan actual del equipo MAKARENO.
- **Base de datos:** Neon tiene un nivel gratuito que probablemente alcanza para la etapa 1. Se revisa al crecer.
- **Correo de avisos:** un servicio como Resend tiene nivel gratuito suficiente para un equipo chico.
- **Dominio:** opcional, por ejemplo `produccion.quervo.mx` (el dominio está pendiente según el brandbook).

Precios por verificar en las páginas oficiales antes de contratar.

## 6. Portabilidad: moverlo a una cuenta propia de QUERVO

El sistema se construye para poder **mudarse de equipo de Vercel** sin rehacer nada.

**Reglas de construcción**
- Toda la configuración va en variables de entorno: conexión a la base, credenciales de Google y correo. No hay identificadores de equipo escritos en el código.
- La base de datos es Postgres estándar, así que se puede exportar e importar completa con `pg_dump` y `pg_restore`.
- La dirección pública debería ser un dominio de QUERVO desde el inicio, por ejemplo `produccion.quervo.mx`, para que no cambie con la mudanza.

**Pasos de la mudanza**
1. Crear el equipo de QUERVO en Vercel, con el plan Pro.
2. Transferir el proyecto. Vercel lo permite entre equipos: Configuración del proyecto › Transferir. Se lleva los despliegues y la configuración.
3. **Base de datos:** la que se crea desde el Marketplace queda ligada al equipo original. Lo seguro es crear una nueva en el equipo de QUERVO, copiar los datos y cambiar la variable de conexión.
4. **Dominio:** se mueve aparte, con `vercel domains move` o desde el panel. Los registros DNS se conservan.
5. **Inicio de sesión con Google:** si cambia la dirección, hay que actualizar las URL autorizadas en Google Cloud.
6. **Código:** el repositorio está en la cuenta personal de GitHub (`makkareno`). Se puede transferir a una organización de QUERVO en GitHub.

**Alternativa sin mudanza:** crear desde ahora el equipo de QUERVO en Vercel y construir ahí directamente.
Como una herramienta de la empresa necesita el plan Pro de todos modos, es la opción más limpia si la cuenta se puede abrir ya.

## 7. Decisiones abiertas

1. ¿El sistema maneja **todos los podcasts** que produce QUERVO Studios (varios clientes) o solo uno? Recomendado: todos.
2. ¿Todo el equipo, incluidos los freelancers, tiene **cuenta de Google** para iniciar sesión?
3. ¿Cuántas personas lo usarían al inicio?
4. ¿Los **clientes** deben ver algo en la primera versión, o eso queda para después? Recomendado: después.
