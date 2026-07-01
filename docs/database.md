# Base de Datos

Este documento describe las tablas principales del proyecto y el propósito de sus campos.

---

## site_contents

Tabla destinada a gestionar textos editables de secciones generales del sitio, como hero, propósito, llamados a la acción o textos institucionales.

### Campos

| Campo       | Descripción                                                  |
| ----------- | ------------------------------------------------------------ |
| id          | Identificador único del contenido.                           |
| section_key | Clave única que identifica la sección. Ejemplo: `home-hero`. |
| title       | Título editable de la sección.                               |
| subtitle    | Subtítulo o bajada de la sección. Campo opcional.            |
| body        | Texto principal de la sección.                               |
| metadata    | Información adicional flexible en formato JSON.              |
| is_active   | Indica si el contenido está activo.                          |
| created_at  | Fecha de creación del registro.                              |
| updated_at  | Fecha de última modificación.                                |

---

## articles

Tabla destinada a gestionar los artículos del blog, tanto los creados desde el dashboard administrativo como los enviados por profesionales para revisión.

### Campos

| Campo              | Descripción                                                                |
| ------------------ | -------------------------------------------------------------------------- |
| id                 | Identificador único del artículo.                                          |
| title              | Título principal del artículo.                                             |
| slug               | Identificador usado en la URL del artículo. Ejemplo: `ansiedad-academica`. |
| excerpt            | Resumen breve utilizado en cards o listados.                               |
| content            | Contenido completo del artículo.                                           |
| cover_image_url    | URL de la imagen principal del artículo.                                   |
| cover_image_alt    | Texto alternativo de la imagen para accesibilidad.                         |
| author_name        | Nombre del autor visible en el artículo.                                   |
| category           | Categoría o temática del artículo.                                         |
| status             | Estado editorial del artículo.                                             |
| is_featured        | Indica si el artículo aparece en la sección de destacados.                 |
| submitted_by_name  | Nombre de la persona que envió una propuesta de artículo.                  |
| submitted_by_email | Email de la persona que envió una propuesta de artículo.                   |
| rejection_reason   | Motivo del rechazo, si el artículo fue rechazado.                          |
| published_at       | Fecha de publicación visible del artículo.                                 |
| created_at         | Fecha de creación del registro.                                            |
| updated_at         | Fecha de última modificación.                                              |

### Estados

| Estado         | Descripción                                                 |
| -------------- | ----------------------------------------------------------- |
| draft          | Artículo creado por el administrador, todavía no publicado. |
| pending_review | Artículo enviado por un profesional, pendiente de revisión. |
| published      | Artículo aprobado y visible públicamente en el blog.        |
| rejected       | Artículo rechazado tras revisión.                           |
| archived       | Artículo oculto sin eliminar definitivamente.               |

---

## admin_profiles

Tabla destinada a definir qué usuarios autenticados mediante Supabase Auth tienen acceso al dashboard administrativo.

### Campos

| Campo        | Descripción                                            |
| ------------ | ------------------------------------------------------ |
| id           | Identificador único del perfil administrativo.         |
| user_id      | Identificador del usuario en Supabase Auth.            |
| role         | Rol administrativo del usuario.                        |
| is_active    | Indica si el usuario tiene acceso activo al dashboard. |
| display_name | Nombre visible del administrador.                      |
| created_at   | Fecha de creación del registro.                        |
| updated_at   | Fecha de última modificación.                          |

### Roles

| Rol      | Descripción                                                    |
| -------- | -------------------------------------------------------------- |
| admin    | Puede administrar todo el dashboard.                           |
| editor   | Puede crear y editar contenido.                                |
| reviewer | Puede revisar propuestas, testimonios o contenidos pendientes. |

---

## participation_messages

Tabla destinada a almacenar los mensajes enviados desde el formulario de participación del sitio.

### Campos

| Campo         | Descripción                                            |
| ------------- | ------------------------------------------------------ |
| id            | Identificador único del mensaje.                       |
| full_name     | Nombre completo de la persona que envía el formulario. |
| email         | Correo electrónico de contacto.                        |
| phone         | Número de teléfono opcional.                           |
| interest_area | Área de interés seleccionada en el formulario.         |
| message       | Mensaje enviado por la persona.                        |
| is_read       | Indica si el mensaje ya fue leído desde el dashboard.  |
| is_starred    | Indica si el mensaje fue marcado como destacado.       |
| is_contacted  | Indica si la persona ya fue contactada por el equipo.  |
| created_at    | Fecha de creación del registro.                        |
| updated_at    | Fecha de última modificación.                          |
