import Image from "next/image";
import Link from "next/link";

const trainingCards = [
  {
    icon: "smart_toy",
    title: "Inteligencia Artificial Aplicada",
    description:
      "Domina herramientas prácticas de IA para mejorar la productividad y resolver problemas complejos en escenarios del mundo real.",
    tip: "Probá pedirle a una IA: “Organizá mi semana en bloques de estudio, descanso y tareas importantes”.",
  },
  {
    icon: "lightbulb",
    title: "Emprendimiento",
    description:
      "Desde la ideación hasta la ejecución, aprende los marcos necesarios para construir y escalar tu propio emprendimiento sostenible.",
    tip: "Escribí tu idea en una frase: qué problema resuelve, para quién y por qué es diferente.",
  },
  {
    icon: "show_chart",
    title: "Pitching",
    description:
      "Perfecciona tu narrativa y la presentación de tu propuesta de negocio para captar la atención de inversores y socios.",
    tip: "Practicá explicar tu idea en 30 segundos: problema, solución, impacto y próximo paso.",
  },
  {
    icon: "payments",
    title: "Educación Financiera",
    description:
      "Toma el control de tu futuro financiero con una formación integral en gestión de patrimonio e inversión.",
    tip: "Usá la regla 50/30/20 como punto de partida: necesidades, gustos y ahorro.",
  },
  {
    icon: "self_improvement",
    title: "Desarrollo Personal",
    description:
      "Cultiva una mentalidad de crecimiento y la inteligencia emocional para desbloquear tu máximo potencial en todos los aspectos de la vida.",
    tip: "Hacé una pausa de 2 minutos: inhalá profundo, nombrá lo que sentís y elegí una acción pequeña para continuar.",
  },
  {
    icon: "terminal",
    title: "Tecnología Productiva",
    description:
      "Aprende a optimizar tu entorno digital y aprovechar los flujos de trabajo modernos para lograr más con menos esfuerzo.",
    tip: "Revisá tus herramientas digitales y eliminá una notificación que interrumpa tu concentración.",
  },
];

export default function TrainingPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background text-slate-900">
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/vive-tu-mente.png"
                alt="Fundación Vive Tu Mente"
                width={56}
                height={56}
                className="h-12 w-auto"
                priority
              />
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Fundación Vive Tu Mente
              </span>
            </Link>

            <nav className="hidden items-center gap-8 lg:flex">
              <Link
                className="text-sm font-semibold transition-colors hover:text-primary"
                href="/"
              >
                Inicio
              </Link>
              <Link
                className="text-sm font-semibold transition-colors hover:text-primary"
                href="/programs"
              >
                Programas
              </Link>
              <Link
                className="text-sm font-bold text-primary"
                href="/training"
                aria-current="page"
              >
                Educación
              </Link>
              <Link
                className="text-sm font-semibold transition-colors hover:text-primary"
                href="/about_us"
              >
                Sobre Nosotros
              </Link>
              <Link
                className="text-sm font-semibold transition-colors hover:text-primary"
                href="/participate"
              >
                Participar
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              <details className="group/mobile-menu relative lg:hidden">
                <summary
                  className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-primary/20 text-slate-900 transition-colors hover:bg-primary/10 [&::-webkit-details-marker]:hidden"
                  aria-label="Abrir menú"
                >
                  <span className="material-symbols-outlined group-open/mobile-menu:hidden">
                    menu
                  </span>
                  <span className="material-symbols-outlined hidden group-open/mobile-menu:inline">
                    close
                  </span>
                </summary>

                <div className="absolute right-0 top-12 z-[60] w-56 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                  <Link
                    className="block rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/10"
                    href="/"
                  >
                    Inicio
                  </Link>
                  <Link
                    className="block rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/10"
                    href="/programs"
                  >
                    Programas
                  </Link>
                  <Link
                    className="block rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/10"
                    href="/training"
                  >
                    Educación
                  </Link>
                  <Link
                    className="block rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/10"
                    href="/about_us"
                  >
                    Sobre Nosotros
                  </Link>
                  <Link
                    className="block rounded-lg px-4 py-2 text-sm font-semibold hover:bg-primary/10"
                    href="/participate#formulario"
                  >
                    Participar
                  </Link>
                </div>
              </details>

              <Link
                className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-background-dark transition-all hover:shadow-lg hover:shadow-primary/20"
                href="/donations"
              >
                Donación
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="bg-gradient-to-b from-primary/5 to-transparent px-6 py-16 lg:px-20 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Programas Educacionales
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-[-0.03em] text-slate-900 lg:text-6xl">
                Empoderándote con las{" "}
                <span className="text-primary">habilidades del futuro.</span>
              </h1>
              <p className="mt-6 text-lg leading-snug text-slate-600">
                Nuestro plan de estudios está diseñado para cerrar la brecha
                entre la educación tradicional y las demandas en rápida
                evolución del mundo moderno. Explora nuestras áreas de enseñanza
                principales.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {trainingCards.map((card) => (
                <article
                  key={card.title}
                  className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-background-dark">
                    <span className="material-symbols-outlined text-3xl">
                      {card.icon}
                    </span>
                  </div>

                  <details className="absolute right-6 top-6 z-20 group/tip">
                    <summary
                      className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-primary bg-primary text-background-dark shadow-sm transition-all hover:bg-primary/10 hover:text-primary [&::-webkit-details-marker]:hidden"
                      aria-label="Ver tip rápido"
                    >
                      <span className="material-symbols-outlined transition-transform group-open/tip:rotate-45">
                        add
                      </span>
                    </summary>

                    <div className="absolute right-0 top-12 w-64 rounded-xl border border-primary/20 bg-white p-4 shadow-xl">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                        Tip rápido
                      </p>
                      <p className="text-sm leading-relaxed text-slate-600">
                        {card.tip}
                      </p>
                    </div>
                  </details>

                  <h3 className="text-xl font-bold text-slate-900">
                    {card.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-slate-600">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-20">
          <div className="mx-auto max-w-7xl rounded-2xl border border-primary/20 bg-primary/10 p-8 md:p-10">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <span className="text-sm font-bold uppercase tracking-wider text-primary">
                  Recursos para seguir aprendiendo
                </span>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">
                  Explorá artículos prácticos en nuestro Blog
                </h2>
                <p className="mt-3 text-slate-600">
                  Encontrá ideas breves sobre bienestar, productividad,
                  propósito y herramientas para aplicar en tu vida diaria.
                </p>
              </div>

              <Link
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-background-dark transition-colors hover:bg-primary/90"
                href="/blog"
              >
                Ir al Blog
                <span className="material-symbols-outlined text-lg">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
