import Image from "next/image";
import Link from "next/link";

const articles = [
  {
    category: "Bienestar",
    title: "Cómo reconocer señales de estrés académico",
    description:
      "Algunas señales pueden aparecer en el cuerpo, el ánimo o la forma en que organizamos nuestras tareas. Reconocerlas es el primer paso para pedir apoyo y recuperar equilibrio.",
    image: "/images/students-studying.jpg",
    alt: "Estudiantes revisando apuntes durante una jornada de estudio",
  },
  {
    category: "Productividad",
    title: "Herramientas simples para organizar tu semana",
    description:
      "Planificar no significa llenar cada minuto. Una buena organización combina prioridades, descanso y espacios reales para avanzar sin saturarte.",
    image: "/images/weekly-planning.jpg",
    alt: "Cuaderno de planificación semanal sobre un escritorio",
  },
  {
    category: "Impacto social",
    title: "Hablar de salud mental también es construir oportunidades",
    description:
      "El bienestar emocional influye en cómo aprendemos, trabajamos y nos relacionamos. Por eso acompañar la salud mental también abre caminos de desarrollo.",
    image: "/images/people-support-group.jpg",
    alt: "Grupo de personas conversando en un espacio de apoyo comunitario",
  },
];

export default function BlogPage() {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-slate-900">
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
            <div className="max-w-3xl">
              <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                Blog de bienestar
              </span>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 lg:text-6xl">
                Ideas prácticas para cuidar tu{" "}
                <span className="text-primary">mente</span> y construir
                oportunidades
              </h1>

              <p className="mt-6 text-lg leading-relaxed text-slate-600">
                Artículos breves para acompañar procesos de bienestar emocional,
                aprendizaje, productividad, propósito y desarrollo personal.
              </p>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article.title}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                >
                  <Image
                    className="h-48 w-full object-cover"
                    src={article.image}
                    alt={article.alt}
                    width={640}
                    height={360}
                  />

                  <div className="p-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      {article.category}
                    </span>

                    <h2 className="mt-4 text-2xl font-bold text-slate-900">
                      {article.title}
                    </h2>

                    <p className="mt-4 leading-relaxed text-slate-600">
                      {article.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-20">
          <div className="mx-auto max-w-7xl rounded-2xl bg-primary p-8 text-background-dark md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="mb-3 text-3xl font-black tracking-[-0.02em]">
                  ¿Querés participar o proponer un tema?
                </h2>
                <p className="text-background-dark/80">
                  Si tenés una idea, querés colaborar o necesitás orientación
                  sobre un programa, podés escribirnos desde el formulario.
                </p>
              </div>

              <Link
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-background-dark px-6 py-3 font-bold text-white transition-opacity hover:opacity-90"
                href="/participate#formulario"
              >
                Contactar
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
