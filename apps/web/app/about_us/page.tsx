import Image from "next/image";
import Link from "next/link";

export default function AboutUsPage() {
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
                className="text-sm font-semibold transition-colors hover:text-primary"
                href="/training"
              >
                Educación
              </Link>
              <Link
                className="text-sm font-bold text-primary"
                href="/about_us"
                aria-current="page"
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

      <main className="flex-1">
        <section className="px-4 py-8 md:px-20 md:py-12 lg:px-40">
          <div className="mx-auto flex max-w-[1200px] flex-1 flex-col">
            <div className="py-3">
              <div className="relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-xl bg-cover bg-center">
                <Image
                  src="/images/about-hero-community.jpg"
                  alt="Personas compartiendo y colaborando en una actividad comunitaria"
                  fill
                  className="object-cover"
                  priority
                  sizes="(min-width: 1024px) 1200px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent" />
                <div className="relative z-10 flex flex-col gap-2 p-8">
                  <h1 className="max-w-3xl text-4xl font-extrabold leading-tight tracking-[-0.04em] text-white md:text-5xl">
                    Empoderando mentes, transformando vidas
                  </h1>
                  <p className="mt-2 max-w-2xl text-lg leading-snug text-slate-200">
                    Un viaje desde una pequeña iniciativa comunitaria hasta una
                    fundación que impulsa bienestar emocional, educación y
                    oportunidades a través de talleres, programas y alianzas con
                    sentido social.
                  </p>
                </div>
              </div>
            </div>

            <section className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 font-bold text-primary">
                  <span className="material-symbols-outlined">history</span>
                  <span className="text-sm uppercase tracking-widest">
                    Nuestra Historia
                  </span>
                </div>

                <h2 className="brand-title text-3xl font-bold leading-tight text-slate-900 md:text-4xl">
                  Cómo comenzó todo
                </h2>

                <p className="text-lg leading-relaxed text-slate-600">
                  Fundación Vive Tu Mente nace con una convicción clara: que el
                  bienestar emocional no es un lujo, sino un derecho humano
                  fundamental. Las oportunidades deben estar al alcance de más
                  personas.
                </p>

                <p className="text-lg leading-relaxed text-slate-600">
                  Lo que comenzó como un grupo de apoyo local en el sótano de un
                  centro comunitario ha evolucionado hasta convertirse en un
                  equipo global dedicado a cerrar la brecha en los sistemas de
                  apoyo social. Trabajamos para acercar herramientas prácticas a
                  jóvenes, familias, comunidades y organizaciones, combinando
                  salud mental, desarrollo personal, tecnología y
                  emprendimiento.
                </p>
              </div>

              <div className="overflow-hidden rounded-xl shadow-2xl">
                <Image
                  src="/images/about-history-workspace.jpg"
                  alt="Personas colaborando en un espacio de trabajo comunitario"
                  width={900}
                  height={900}
                  className="aspect-square h-full w-full object-cover md:aspect-video lg:aspect-square"
                />
              </div>
            </section>

            <section className="my-8 rounded-2xl bg-primary/10 p-8 md:p-12">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                <div className="space-y-4">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontSize: "40px" }}
                  >
                    visibility
                  </span>
                  <h3 className="brand-title text-2xl font-bold">
                    Nuestra Visión
                  </h3>
                  <p className="leading-relaxed text-slate-600">
                    Un mundo donde más personas puedan acceder a herramientas de
                    bienestar, formación y acompañamiento para construir
                    proyectos de vida con mayor confianza y autonomía. Donde
                    nadie enfrente desafíos de salud mental solo sin importar su
                    origen.
                  </p>
                </div>

                <div className="space-y-4">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontSize: "40px" }}
                  >
                    rocket_launch
                  </span>
                  <h3 className="brand-title text-2xl font-bold">
                    Nuestro Propósito
                  </h3>
                  <p className="leading-relaxed text-slate-600">
                    Desmantelar el estigma que rodea la salud mental y acompañar
                    procesos de crecimiento personal y comunitario,
                    proporcionando herramientas de apoyo emocional accesibles y
                    basadas en la ciencia a comunidades marginadas a nivel
                    global. Brindando oportunidades a través de programas,
                    talleres y alianzas.
                  </p>
                </div>
              </div>
            </section>

            <section className="py-12">
              <div className="mx-auto mb-8 max-w-2xl text-center">
                <h2 className="brand-title mb-3 text-3xl font-bold text-slate-900">
                  Conocenos en acción
                </h2>
                <p className="text-slate-600">
                  Mirá cómo trabajamos y el impacto que generamos en cada
                  comunidad.
                </p>
              </div>

              <div className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-2xl bg-background-dark shadow-2xl">
                <div className="space-y-3 p-8 text-center text-white">
                  <span
                    className="material-symbols-outlined text-primary"
                    style={{ fontSize: "84px" }}
                  >
                    play_circle
                  </span>
                  <p className="brand-title text-2xl font-bold">
                    Video institucional próximamente
                  </p>
                  <p className="text-sm text-slate-400">
                    Este espacio está reservado para el video de la fundación.
                  </p>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}
