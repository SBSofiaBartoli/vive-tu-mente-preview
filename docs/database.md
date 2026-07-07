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
| review_notes       | Observaciones internas o cambios solicitados por administración.           |
| published_at       | Fecha de publicación visible del artículo.                                 |
| created_at         | Fecha de creación del registro.                                            |
| updated_at         | Fecha de última modificación.                                              |

### Estados

| Estado            | Descripción                                                     |
| ----------------- | --------------------------------------------------------------- |
| draft             | Artículo creado por el administrador, todavía no publicado.     |
| pending_review    | Artículo enviado por un profesional, pendiente de revisión.     |
| changes_requested | Artículo revisado con solicitud de cambios antes de publicarse. |
| published         | Artículo aprobado y visible públicamente en el blog.            |
| rejected          | Artículo rechazado tras revisión.                               |
| archived          | Artículo oculto sin eliminar definitivamente.                   |

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

---

## testimonials

Tabla destinada a almacenar testimonios enviados por personas que participaron, colaboraron o estuvieron vinculadas con actividades de la fundación.

### Campos

| Campo            | Descripción                                                        |
| ---------------- | ------------------------------------------------------------------ |
| id               | Identificador único del testimonio.                                |
| full_name        | Nombre completo de la persona que deja el testimonio.              |
| role             | Tipo de vínculo de la persona con la fundación o actividad.        |
| workshop_name    | Nombre del taller o actividad relacionada, si aplica.              |
| comment          | Comentario enviado por la persona.                                 |
| status           | Estado de revisión del testimonio.                                 |
| is_featured      | Indica si el testimonio debe mostrarse como destacado en el sitio. |
| rejection_reason | Motivo interno por el cual el testimonio fue rechazado.            |
| reviewed_at      | Fecha en la que el testimonio fue revisado por administración.     |
| created_at       | Fecha de creación del registro.                                    |
| updated_at       | Fecha de última modificación.                                      |

### Estados

| Estado   | Descripción                                                 |
| -------- | ----------------------------------------------------------- |
| pending  | Testimonio recibido y pendiente de revisión administrativa. |
| approved | Testimonio aprobado y visible públicamente en el sitio.     |
| rejected | Testimonio rechazado y no visible públicamente en el sitio. |

### Roles

| Rol          | Descripción                                       |
| ------------ | ------------------------------------------------- |
| participant  | Persona participante de un taller o actividad.    |
| professional | Profesional que colaboró o participó.             |
| alliance     | Persona o entidad vinculada mediante una alianza. |
| company      | Empresa vinculada con la fundación.               |
| institution  | Institución vinculada con la fundación.           |
| organization | Organización vinculada con la fundación.          |

---

## faqs

Tabla destinada a gestionar preguntas frecuentes editables desde el dashboard administrativo y visibles como desplegables en el sitio.

### Campos

| Campo      | Descripción                                                        |
| ---------- | ------------------------------------------------------------------ |
| id         | Identificador único de la pregunta frecuente.                      |
| question   | Pregunta visible para los usuarios del sitio.                      |
| answer     | Respuesta asociada a la pregunta frecuente.                        |
| category   | Categoría utilizada para agrupar preguntas por sección o temática. |
| sort_order | Orden visual de la pregunta dentro de su categoría.                |
| is_active  | Indica si la pregunta frecuente está visible públicamente.         |
| created_at | Fecha de creación del registro.                                    |
| updated_at | Fecha de última modificación.                                      |

---

## education_tips

Tabla destinada a gestionar tips educativos editables para las cards de la sección Educación.

### Campos

| Campo        | Descripción                                                         |
| ------------ | ------------------------------------------------------------------- |
| id           | Identificador único del tip educativo.                              |
| segment_key  | Clave del segmento o card educativa a la que pertenece el tip.      |
| title        | Título corto del tip educativo.                                     |
| content      | Contenido principal del tip educativo.                              |
| resource_url | Enlace opcional a un recurso descargable o material complementario. |
| is_active    | Indica si el tip educativo puede mostrarse públicamente.            |
| starts_at    | Fecha desde la cual el tip puede mostrarse.                         |
| ends_at      | Fecha hasta la cual el tip puede mostrarse.                         |
| created_at   | Fecha de creación del registro.                                     |
| updated_at   | Fecha de última modificación.                                       |

### Uso

Los tips se agrupan mediante `segment_key`, por ejemplo:

| Segmento       | Descripción                            |
| -------------- | -------------------------------------- |
| ia-aplicada    | Tips asociados a IA aplicada.          |
| emprendimiento | Tips asociados a emprendimiento.       |
| finanzas       | Tips asociados a educación financiera. |
| desarrollo     | Tips asociados a desarrollo personal.  |
| tecnologia     | Tips asociados a tecnología.           |

### Visibilidad

Un tip se considera visible públicamente cuando:

| Condición | Descripción                                             |
| --------- | ------------------------------------------------------- |
| is_active | Debe estar marcado como activo.                         |
| starts_at | Si tiene fecha de inicio, debe ser menor o igual a hoy. |
| ends_at   | Si tiene fecha de fin, debe ser mayor o igual a hoy.    |

---

## page_visits

Tabla destinada a registrar visitas anónimas a páginas del sitio para construir un contador visible.

### Campos

| Campo       | Descripción                                                             |
| ----------- | ----------------------------------------------------------------------- |
| id          | Identificador único de la visita registrada.                            |
| page_path   | Ruta de la página visitada. Por defecto se utiliza `/`.                 |
| visitor_key | Clave anónima generada desde el frontend para identificar al visitante. |
| visited_at  | Fecha y hora en la que se registró la visita.                           |

### Regla de conteo

El contador evita duplicar visitas de un mismo `visitor_key` dentro de una ventana de tiempo definida en backend.

## Actualmente, una misma persona vuelve a contar como nueva visita si regresa luego de 2 horas.

## media_files

Tabla destinada a guardar la metadata de imágenes, documentos y otros archivos multimedia vinculados al sitio.

### Campos

| Campo             | Descripción                                                      |
| ----------------- | ---------------------------------------------------------------- |
| id                | Identificador único del archivo.                                 |
| original_name     | Nombre original del archivo subido.                              |
| storage_path      | Ruta del archivo dentro de Supabase Storage.                     |
| public_url        | URL pública del archivo, si corresponde.                         |
| mime_type         | Tipo MIME del archivo.                                           |
| file_size         | Tamaño del archivo en bytes.                                     |
| section           | Sección del sitio asociada al archivo.                           |
| status            | Estado editorial o administrativo del archivo.                   |
| uploaded_by_name  | Nombre de la persona que subió el archivo, si aplica.            |
| uploaded_by_email | Email de contacto de la persona que subió el archivo, si aplica. |
| review_notes      | Observaciones internas o cambios solicitados por administración. |
| rejection_reason  | Motivo por el cual el archivo fue rechazado.                     |
| reviewed_at       | Fecha en la que el archivo fue revisado por administración.      |
| created_at        | Fecha de creación del registro.                                  |
| updated_at        | Fecha de última modificación.                                    |

### Estados

| Estado            | Descripción                                                         |
| ----------------- | ------------------------------------------------------------------- |
| pending           | Archivo recibido y pendiente de revisión.                           |
| changes_requested | Archivo revisado con solicitud de cambios.                          |
| approved          | Archivo aprobado para uso o visualización.                          |
| rejected          | Archivo rechazado por administración.                               |
| archived          | Archivo oculto o retirado sin eliminar definitivamente el registro. |

### Criterio editorial

Las personas externas no modifican directamente una propuesta ya enviada. Si administración solicita cambios, se registra la observación en `review_notes` y la persona puede enviar una nueva versión.
