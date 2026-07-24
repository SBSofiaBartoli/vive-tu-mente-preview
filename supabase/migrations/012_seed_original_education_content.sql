insert into public.education_cards (
  segment_key,
  title,
  description,
  icon_name,
  sort_order,
  is_active
)
values
  (
    'ia-aplicada',
    'Inteligencia Artificial Aplicada',
    'Domina herramientas prácticas de IA para mejorar la productividad y resolver problemas complejos en escenarios del mundo real.',
    'smart_toy',
    1,
    true
  ),
  (
    'emprendimiento',
    'Emprendimiento',
    'Desde la ideación hasta la ejecución, aprende los marcos necesarios para construir y escalar tu propio emprendimiento sostenible.',
    'lightbulb',
    2,
    true
  ),
  (
    'pitching',
    'Pitching',
    'Perfecciona tu narrativa y la presentación de tu propuesta de negocio para captar la atención de inversores y socios.',
    'show_chart',
    3,
    true
  ),
  (
    'educacion-financiera',
    'Educación Financiera',
    'Toma el control de tu futuro financiero con una formación integral en gestión de patrimonio e inversión.',
    'payments',
    4,
    true
  ),
  (
    'desarrollo-personal',
    'Desarrollo Personal',
    'Cultiva una mentalidad de crecimiento y la inteligencia emocional para desbloquear tu máximo potencial en todos los aspectos de la vida.',
    'self_improvement',
    5,
    true
  ),
  (
    'tecnologia-productiva',
    'Tecnología Productiva',
    'Aprende a optimizar tu entorno digital y aprovechar los flujos de trabajo modernos para lograr más con menos esfuerzo.',
    'terminal',
    6,
    true
  )
on conflict (segment_key) do update
set
  title = excluded.title,
  description = excluded.description,
  icon_name = excluded.icon_name,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.education_tips (
  segment_key,
  title,
  content,
  resource_url,
  is_active
)
values
  (
    'ia-aplicada',
    'Prompt para organizar tu semana',
    'Probá pedirle a una IA: “Organizá mi semana en bloques de estudio, descanso y tareas importantes”.',
    null,
    true
  ),
  (
    'emprendimiento',
    'Definí tu idea en una frase',
    'Escribí tu idea en una frase: qué problema resuelve, para quién y por qué es diferente.',
    null,
    true
  ),
  (
    'pitching',
    'Practicá tu idea en 30 segundos',
    'Practicá explicar tu idea en 30 segundos: problema, solución, impacto y próximo paso.',
    null,
    true
  ),
  (
    'educacion-financiera',
    'Regla 50/30/20',
    'Usá la regla 50/30/20 como punto de partida: necesidades, gustos y ahorro.',
    null,
    true
  ),
  (
    'desarrollo-personal',
    'Pausa de 2 minutos',
    'Hacé una pausa de 2 minutos: inhalá profundo, nombrá lo que sentís y elegí una acción pequeña para continuar.',
    null,
    true
  ),
  (
    'tecnologia-productiva',
    'Reducí una interrupción digital',
    'Revisá tus herramientas digitales y eliminá una notificación que interrumpa tu concentración.',
    null,
    true
  )
on conflict do nothing;
