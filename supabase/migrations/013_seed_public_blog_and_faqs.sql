delete from public.faqs
where lower(question) like '%que te gusta hacer%';

insert into public.faqs
  (question, answer, category, sort_order, is_active)
values
  (
    '¿Quiénes pueden participar en los programas?',
    'Los programas están pensados para jóvenes, estudiantes, personas mayores, comunidades educativas, organizaciones y personas que buscan fortalecer habilidades personales, emocionales o laborales. Cada iniciativa puede tener requisitos específicos según sus objetivos.',
    'programas',
    1,
    true
  ),
  (
    '¿Necesito experiencia previa para sumarme?',
    'No siempre. Muchos talleres están diseñados para comenzar desde cero y acompañar el proceso paso a paso. Cuando un programa requiere conocimientos previos, esa información se comunica antes de la inscripción.',
    'programas',
    2,
    true
  ),
  (
    '¿Los talleres son gratuitos?',
    'Algunas actividades pueden ser gratuitas y otras pueden realizarse mediante alianzas, instituciones o empresas colaboradoras. La fundación busca ampliar el acceso a oportunidades, por eso cada convocatoria informa claramente sus condiciones.',
    'programas',
    3,
    true
  ),
  (
    '¿Cómo puede una institución solicitar un taller?',
    'Una institución puede contactarse desde la sección Participar para conversar sobre necesidades, público objetivo y modalidad. Luego el equipo evalúa la mejor propuesta de taller o programa según el contexto.',
    'programas',
    4,
    true
  ),
  (
    '¿Qué sucede después de enviar un testimonio?',
    'El testimonio queda pendiente de revisión por parte del equipo. Esto permite cuidar la privacidad, el tono y la coherencia del contenido antes de publicarlo en el sitio.',
    'programas',
    5,
    true
  );

insert into public.articles
  (
    title,
    slug,
    excerpt,
    content,
    cover_image_url,
    cover_image_alt,
    author_name,
    category,
    status,
    is_featured,
    published_at
  )
values
  (
    'Cómo acompañar la ansiedad académica sin minimizar lo que siente un estudiante',
    'acompanar-ansiedad-academica',
    'Ideas prácticas para escuchar, ordenar y acompañar momentos de presión académica sin caer en frases que invalidan la experiencia.',
    'La ansiedad académica no siempre aparece como una crisis evidente. A veces se expresa como cansancio constante, irritabilidad, bloqueo frente a tareas simples, dificultad para dormir o una sensación persistente de no llegar nunca.

Acompañar a una persona en ese estado no significa resolverle todo ni exigirle calma inmediata. Muchas veces el primer paso es validar lo que siente: reconocer que la presión existe, que su cuerpo está respondiendo a una carga alta y que pedir ayuda no es una señal de debilidad.

Una herramienta simple es ayudar a separar lo urgente de lo importante. Cuando todo parece igual de pesado, una lista breve puede devolver claridad: qué debe resolverse hoy, qué puede esperar y qué necesita apoyo de otra persona. Esa organización reduce la sensación de caos.

También es importante cuidar el lenguaje. Frases como “no es para tanto” o “solo tenés que organizarte” pueden aumentar la culpa. En cambio, preguntas como “¿qué parte te está costando más?” o “¿qué sería un primer paso posible?” abren una conversación más amable y concreta.

El objetivo no es eliminar toda incomodidad, sino construir recursos para atravesarla. Dormir mejor, pedir orientación, dividir tareas, hacer pausas reales y hablar con alguien de confianza pueden ser pasos pequeños, pero sostenibles.',
    '/images/students-studying.jpg',
    'Estudiantes trabajando sobre apuntes y materiales de estudio',
    'Equipo Vive Tu Mente',
    'Bienestar',
    'published',
    true,
    now() - interval '5 days'
  ),
  (
    'De la idea al primer paso: cómo aterrizar un proyecto de emprendimiento',
    'aterrizar-idea-emprendimiento',
    'Una guía clara para pasar de una idea general a una primera versión posible, observable y mejorable.',
    'Muchas ideas de emprendimiento se frenan porque intentan nacer demasiado grandes. Antes de pensar en una marca completa, una página perfecta o una inversión importante, conviene responder una pregunta más simple: ¿qué problema quiero resolver y para quién?

Aterrizar una idea implica convertirla en algo observable. Una forma práctica es escribir tres elementos: la persona a la que quiero ayudar, la dificultad concreta que enfrenta y la solución mínima que podría probar. Si alguno de esos puntos queda demasiado amplio, todavía falta definición.

Después aparece la validación. Validar no es preguntarle a todo el mundo si “le gusta” la idea. Es conversar con personas reales, escuchar cómo viven ese problema y detectar si la solución propuesta tiene sentido para ellas. A veces una conversación honesta enseña más que semanas de planificación aislada.

El primer paso debería ser pequeño. Puede ser una encuesta, una maqueta, una publicación, una reunión piloto o una versión simple del servicio. Lo importante es que permita aprender algo. Un emprendimiento crece mejor cuando sus decisiones se apoyan en evidencia y no solo en entusiasmo.

Emprender también requiere sostén emocional. La incertidumbre, el miedo a equivocarse y la comparación son parte del proceso. Por eso, además de herramientas técnicas, es clave fortalecer la confianza, la comunicación y la capacidad de pedir ayuda.',
    '/images/weekly-planning.jpg',
    'Cuaderno de planificación semanal con notas de trabajo',
    'Equipo Vive Tu Mente',
    'Emprendimiento',
    'published',
    true,
    now() - interval '3 days'
  ),
  (
    'Educación financiera cotidiana: empezar con claridad antes que con perfección',
    'educacion-financiera-cotidiana',
    'Organizar el dinero no empieza con fórmulas complejas, sino con mirar hábitos, prioridades y decisiones pequeñas.',
    'Hablar de educación financiera no debería sentirse lejano ni intimidante. Para muchas personas, el primer paso no es invertir ni dominar conceptos técnicos, sino entender cómo entra y sale el dinero en la vida cotidiana.

Una práctica útil es registrar gastos durante algunos días sin juzgarse. El objetivo no es culparse, sino observar patrones: qué pagos se repiten, qué compras aparecen por impulso, qué gastos son necesarios y cuáles podrían ajustarse. La claridad suele aparecer antes que el cambio.

También ayuda separar el dinero por objetivos. Aunque los montos sean pequeños, distinguir entre gastos básicos, ahorro, aprendizaje, transporte o emergencias permite tomar decisiones con más calma. La organización financiera no depende solo de cuánto se gana, sino de cuánto se puede anticipar.

La regla 50/30/20 puede servir como referencia, pero no como obligación rígida. Cada realidad es distinta. Lo importante es construir un sistema posible, que pueda sostenerse en el tiempo y adaptarse cuando cambian los ingresos o las prioridades.

Aprender sobre dinero también es aprender sobre autonomía. Cuando una persona entiende mejor sus recursos, puede planificar, pedir ayuda a tiempo y tomar decisiones con menos miedo.',
    '/images/people-support-group.jpg',
    'Personas reunidas conversando en un espacio de apoyo',
    'Equipo Vive Tu Mente',
    'Educación financiera',
    'published',
    false,
    now() - interval '1 day'
  )
on conflict (slug) do update set
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  cover_image_url = excluded.cover_image_url,
  cover_image_alt = excluded.cover_image_alt,
  author_name = excluded.author_name,
  category = excluded.category,
  status = excluded.status,
  is_featured = excluded.is_featured,
  published_at = excluded.published_at,
  updated_at = now();
  