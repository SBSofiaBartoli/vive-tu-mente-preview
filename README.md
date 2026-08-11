# Vive Tu Mente - Plataforma web administrable

Proyecto realizado para **Fundacion Vive Tu Mente**, una organizacion enfocada en bienestar socioemocional, educacion, acompanamiento comunitario y desarrollo de oportunidades.

Este repositorio muestra la evolucion completa de un sitio institucional inicialmente estatico hacia una plataforma administrable con frontend moderno, backend modular, base de datos, almacenamiento de archivos, autenticacion y dashboard interno.

> El objetivo no fue solo "hacer una pagina": fue transformar una web informativa en una herramienta sostenible para que la fundacion pueda administrar contenido, revisar aportes externos, publicar recursos y comunicar mejor su impacto.

---

## Impacto del proyecto

- Migre el sitio desde HTML/CSS/JavaScript estatico hacia una arquitectura con **Next.js, NestJS y Supabase**.
- Desarrolle un **dashboard administrativo protegido** para gestionar articulos, testimonios, preguntas frecuentes, educacion, archivos, donaciones, mensajes de participacion y contenido editable.
- Implemente un backend documentado con **Swagger**, DTOs, validaciones, filtros, paginacion y control de acceso administrativo.
- Conecte formularios publicos para recibir mensajes, testimonios, propuestas de articulos e informes de donacion.
- Respete la identidad visual existente: colores, tipografias, textos, composicion, iconografia, comportamiento responsive y tono institucional.
- Agregue un contador real de visitas y secciones dinamicas alimentadas desde base de datos.
- Documente migraciones SQL y decisiones de modelo de datos para facilitar continuidad del proyecto.

---

## Stack principal

| Area | Tecnologia |
| --- | --- |
| Frontend publico y dashboard | Next.js 16, React 19, TypeScript |
| Backend | NestJS 11, TypeScript |
| Base de datos | Supabase Postgres |
| Autenticacion | Supabase Auth |
| Storage | Supabase Storage |
| Validacion | class-validator, class-transformer |
| Documentacion API | Swagger / OpenAPI |
| Estilos | Tailwind CSS 4 |
| Monorepo | pnpm workspaces |
| Deploy | Render / Vercel compatible |

---

## Contexto inicial

El proyecto comenzo como un sitio institucional estatico. En esa primera etapa realice un analisis funcional y visual para detectar mejoras de experiencia de usuario, navegacion, accesibilidad, contenido y comunicacion emocional.

### Problemas detectados en la web estatica

- El sitio trataba a todos los visitantes por igual, sin rutas claras para jovenes, familias, educadores, empresas o personas interesadas en colaborar.
- Habia botones con enlaces muertos o recorridos incompletos.
- Faltaban llamados de accion de ayuda inmediata para situaciones sensibles de salud mental.
- El contenido tenia un tono mas institucional que cercano.
- La administracion futura dependia de modificar archivos manualmente.
- El blog, testimonios, recursos educativos y preguntas frecuentes no tenian una logica administrable.
- No habia flujo para revisar propuestas externas antes de publicarlas.
- La seccion de donaciones/colaboracion necesitaba mayor claridad y trazabilidad.

### Primeras mejoras sobre el sitio estatico

Antes de migrar a una arquitectura administrable, trabaje sobre la experiencia actual:

- Correccion de enlaces internos.
- Segmentacion de recorridos desde Home.
- Boton flotante de ayuda inmediata.
- Ajustes responsive en navbar, footer y secciones criticas.
- Mejora de textos para un tono mas empatico.
- Carrusel de testimonios.
- Tips educativos desplegables.
- Blog y secciones de articulos destacados.
- Preguntas frecuentes desplegables.
- Secciones para empresas, alianzas y colaboradores.
- Ajustes de tipografia, espaciado, contraste e identidad visual.

---

## Decision de evolucion: de sitio estatico a plataforma administrable

Durante el avance del proyecto se definio que la fundacion necesitaba poder administrar el contenido sin depender siempre de cambios directos en codigo.

Por eso propuse y desarrolle una nueva estructura con:

- **Frontend en Next.js**, para migrar el sitio publico y construir el dashboard administrativo.
- **Backend en NestJS**, para centralizar reglas de negocio, validaciones, seguridad y documentacion de endpoints.
- **Supabase**, para base de datos, autenticacion y almacenamiento de imagenes/documentos.
- **Migraciones SQL**, para que el modelo de datos sea versionable y reproducible.

La decision tecnica busco equilibrar velocidad, costo bajo, mantenibilidad y claridad para un equipo pequeno.

---

## Arquitectura del proyecto

```txt
vive-tu-mente/
├── apps/
│   ├── api/                 # Backend NestJS
│   │   └── src/
│   │       ├── articles/
│   │       ├── auth/
│   │       ├── content/
│   │       ├── donation-reports/
│   │       ├── education-cards/
│   │       ├── education-tips/
│   │       ├── faqs/
│   │       ├── media-files/
│   │       ├── participation-messages/
│   │       ├── storage/
│   │       ├── supabase/
│   │       ├── testimonials/
│   │       └── visit-counter/
│   │
│   └── web/                 # Frontend Next.js
│       ├── app/
│       │   ├── admin/
│       │   ├── about_us/
│       │   ├── blog/
│       │   ├── donations/
│       │   ├── participate/
│       │   ├── programs/
│       │   ├── training/
│       │   └── page.tsx
│       ├── lib/
│       ├── public/images/
│       └── types/
│
├── docs/
│   └── database.md
├── supabase/
│   └── migrations/
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

---

## Modulos implementados en backend

### Autenticacion y autorizacion

- Integracion con Supabase Auth.
- Guard administrativo para proteger endpoints internos.
- Tabla `admin_profiles` para controlar usuarios habilitados, roles y estado activo.
- Endpoint `/api/auth/me` para validar sesion administrativa.

### Articulos y propuestas para blog

- Creacion de articulos desde dashboard.
- Recepcion de propuestas publicas de articulos.
- Carga de imagen sugerida para la propuesta.
- Revision administrativa.
- Estados editoriales: borrador, pendiente, cambios solicitados, publicado, rechazado y archivado.
- Articulos destacados para mostrar primero en secciones publicas.
- Slugs publicos para detalle de articulo.

### Testimonios

- Formulario publico para enviar testimonios.
- Revision administrativa antes de publicar.
- Aprobacion, rechazo, marcado como destacado y eliminacion.
- Carrusel publico con testimonios aprobados y destacados.

### Participacion

- Formulario publico para personas interesadas en participar, colaborar o consultar.
- Dashboard con mensajes recibidos.
- Filtros por leido/no leido, destacado, contactado y area de interes.
- Acciones administrativas para organizar seguimiento.

### Preguntas frecuentes

- FAQ administrables desde dashboard.
- Creacion, edicion, activacion/desactivacion y eliminacion.
- Visual publica desplegable.
- Seeds iniciales con preguntas reales alineadas al proyecto.

### Educacion

- Cards educativas administrables.
- Tips educativos asociados por segmento.
- Activacion/desactivacion desde dashboard.
- Contenido base sembrado en base de datos para no perder las cards originales del sitio.

### Archivos

- Biblioteca administrativa para archivos generales del sitio.
- Upload a Supabase Storage.
- Metadata en base de datos.
- Estados de revision, archivo y rechazo.
- Pensado para futuros recursos descargables, documentos institucionales o materiales internos.

### Donaciones e informes

- Formulario publico para informar transferencias.
- Carga de comprobante.
- Dashboard administrativo para revisar reportes.
- Estados de gestion del comprobante.

### Contador de visitas

- Registro anonimo de visitas a la pagina principal.
- Ventana de conteo para evitar duplicados inmediatos.
- Visualizacion publica del contador real en Home.

---

## Dashboard administrativo

El dashboard fue disenado para que el equipo pueda operar contenido sin tocar codigo.

Incluye:

- Login protegido con Supabase Auth.
- Navegacion administrativa con identidad visual de la fundacion.
- Resumen general del estado de contenidos.
- Filtros, buscadores y paginacion desde backend.
- Modales de creacion/edicion para evitar pantallas interminables.
- Acciones de revision: aprobar, rechazar, solicitar cambios, destacar, archivar, activar o desactivar.
- Separacion entre contenido publico, propuestas externas y gestion interna.

Rutas principales:

```txt
/admin/login
/admin
/admin/articles
/admin/content
/admin/donations
/admin/education
/admin/files
/admin/participation
/admin/testimonials
```

---

## Sitio publico migrado

Se migraron las paginas principales del sitio original, manteniendo la identidad visual y corrigiendo inconsistencias detectadas durante el proceso.

```txt
/
/programs
/training
/about_us
/participate
/donations
/blog
/blog/[slug]
```

### Criterios de migracion visual

- Mantener textos originales aprobados.
- Respetar colores institucionales.
- Conservar tipografias principales y jerarquia visual.
- Igualar espaciados, iconos, botones, cards, footer y navbar.
- Mantener comportamiento responsive.
- Evitar que la migracion tecnica modifique la identidad del sitio.

---

## Base de datos

El modelo de datos se versiona mediante migraciones SQL en `supabase/migrations`.

Migraciones actuales:

```txt
001_create_site_contents.sql
002_create_articles.sql
003_create_admin_profiles.sql
004_create_participation_messages.sql
005_create_testimonials.sql
006_create_faqs.sql
007_create_education_tips.sql
008_create_visit_counter.sql
009_create_media_files.sql
010_update_articles_review_notes.sql
011_create_education_cards.sql
012_seed_original_education_content.sql
013_seed_public_blog_and_faqs.sql
014_create_donation_reports.sql
```

La descripcion funcional de tablas y campos esta documentada en:

```txt
docs/database.md
```

---

## API y documentacion

El backend expone endpoints bajo el prefijo:

```txt
/api
```

Swagger esta disponible en:

```txt
/api/docs
```

Health check:

```txt
/api/health
```

La API usa:

- DTOs para entrada y salida.
- Validaciones con `class-validator`.
- `ValidationPipe` global con whitelist.
- Filtros y paginacion para listados administrativos.
- Bearer token para endpoints protegidos.

---

## Variables de entorno

### Backend (`apps/api`)

```env
PORT=3001
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=media
FRONTEND_URL=http://localhost:3000
MAX_UPLOAD_SIZE_MB=2
```

### Frontend (`apps/web`)

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Instalacion local

Requisitos:

- Node.js
- pnpm
- Proyecto Supabase configurado
- Migraciones SQL ejecutadas

Instalar dependencias:

```bash
pnpm install
```

Levantar backend:

```bash
pnpm dev:api
```

Levantar frontend:

```bash
pnpm dev:web
```

URLs locales:

```txt
Frontend: http://localhost:3000
Backend:  http://localhost:3001/api
Swagger:  http://localhost:3001/api/docs
```

---

## Scripts utiles

```bash
pnpm build:api
pnpm lint:api
pnpm build:web
pnpm lint:web
```

Tambien se puede ejecutar por filtro:

```bash
pnpm --filter api build
pnpm --filter api lint
pnpm --filter web build
pnpm --filter web lint
```

---

## Decisiones tecnicas destacadas

### Por que NestJS para backend

Elegi NestJS porque permite organizar el backend por modulos, separar responsabilidades y mantener una estructura escalable desde el inicio. Esto fue importante porque el proyecto paso de ser una web estatica a una plataforma con multiples flujos administrativos.

### Por que Supabase

Supabase resolvio tres necesidades del proyecto sin sumar complejidad excesiva:

- Base de datos Postgres.
- Autenticacion para administradores.
- Storage para imagenes y comprobantes.

Para una fundacion y un equipo pequeno, esto reduce costos y acelera el desarrollo.

### Por que migraciones SQL

Use migraciones para que la estructura de datos sea reproducible, versionada y clara para el equipo. Esto evita depender de cambios manuales hechos solo desde el panel de Supabase.

### Por que no usar ORM/entities

El proyecto trabaja directamente con Supabase Client y tipos propios. En este contexto, las migraciones SQL y los DTOs cubren la necesidad de estructura, validacion y documentacion sin sumar una capa extra de ORM.

### Por que separar archivos generales de imagenes de articulos y comprobantes

Los archivos generales funcionan como una biblioteca administrativa futura para materiales o recursos del sitio. En cambio, las imagenes de articulos y comprobantes de donacion se gestionan dentro de su propio flujo para conservar contexto y trazabilidad.

---

## Aprendizajes aplicados

Este proyecto me permitio trabajar sobre decisiones reales de producto y desarrollo:

- Como analizar una web existente antes de escribir codigo.
- Como priorizar mejoras de UX, accesibilidad y confianza.
- Como migrar progresivamente sin perder identidad visual.
- Como modelar flujos de revision antes de publicar contenido.
- Como documentar una API para que otras personas puedan entenderla.
- Como pensar un dashboard para usuarios no tecnicos.
- Como trabajar con ramas, commits, PR/MR y despliegues en un proyecto vivo.

---

## Proceso de trabajo y crecimiento tecnico

El valor de este proyecto tambien estuvo en el proceso. Comence recibiendo credenciales de hosting y acceso a un repositorio en GitLab, por lo que primero tuve que entender como se relacionaban el hosting, el codigo fuente, GitLab, GitHub, ramas, commits y despliegues.

A partir de ahi fui avanzando por etapas:

1. **Exploracion y diagnostico**
   Revise el sitio existente, identifique fricciones de navegacion, enlaces rotos, problemas responsive, oportunidades de mejora en contenido y puntos donde la fundacion necesitaba mas cercania y confianza.

2. **Mejoras sobre HTML estatico**
   Aplique cambios progresivos en la web existente: enlaces, cards de segmentacion, boton de ayuda inmediata, testimonios, FAQ, blog, recursos educativos, secciones de colaboracion, ajustes visuales y mejoras responsive.

3. **Definicion de una nueva arquitectura**
   Cuando surgio la necesidad de administrar contenido sin editar codigo, participe en la definicion funcional de una plataforma con backend, base de datos, dashboard administrativo y flujos de revision.

4. **Construccion del backend**
   Cree modulos en NestJS, DTOs, validaciones, endpoints documentados, guards administrativos, integracion con Supabase y migraciones SQL para versionar el modelo de datos.

5. **Construccion del dashboard**
   Desarrolle pantallas administrativas con filtros, buscadores, paginacion, modales, acciones de revision y estados para que el equipo pueda gestionar contenido de forma clara.

6. **Migracion visual del sitio publico**
   Migre las paginas publicas a Next.js cuidando que se vieran lo mas similares posible al sitio original. Este trabajo incluyo ajustes finos de tipografia, iconos, espaciados, imagenes, navbar, footer, botones y comportamiento responsive.

7. **Pruebas, deploy y entrega**
   Valide build/lint de frontend y backend, configure variables de entorno, probe Supabase, Render/Vercel y prepare ramas para GitHub y GitLab con PR/MR.

Durante el proceso tambien aprendi a tomar decisiones practicas: cuando mantener una solucion simple, cuando separar responsabilidades, cuando documentar mas, cuando crear una migracion, como ordenar commits y como explicar el valor tecnico de un cambio a personas no tecnicas.

---

## Estado actual

El proyecto cuenta con:

- Sitio publico migrado a Next.js.
- Backend NestJS funcional.
- Dashboard administrativo protegido.
- Supabase como base de datos, auth y storage.
- Migraciones SQL versionadas.
- Formularios publicos conectados.
- Blog dinamico con articulos destacados.
- Testimonios revisables y publicables.
- Contador real de visitas.
- Documentacion de base de datos y API.

---

## Proximos pasos posibles

- Conectar medio de pago online, por ejemplo Mercado Pago.
- Mejorar gestion de roles administrativos.
- Agregar notificaciones por email para propuestas revisadas.
- Incorporar pruebas automatizadas de endpoints criticos.
- Mejorar observabilidad de errores en produccion.
- Agregar paneles de analitica para contenido y visitas.

---

## Sobre este repositorio

Este repositorio forma parte de mi experiencia practica como desarrolladora Full Stack. Refleja no solo implementacion tecnica, sino tambien analisis funcional, criterio de producto, documentacion, comunicacion con equipo y toma de decisiones para evolucionar un sitio real hacia una plataforma administrable.
