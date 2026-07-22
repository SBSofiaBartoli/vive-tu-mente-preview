"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AboutUsPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
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
        <section className="px-4 py-8 md:px-16 md:py-12 lg:px-28">
          <div className="mx-auto flex max-w-[1200px] flex-1 flex-col">
            <div className="py-3">
              <div className="relative flex min-h-[400px] flex-col justify-end overflow-hidden rounded-xl">
                <Image
                  src="/images/about-hero-community.png"
                  alt="Personas compartiendo y colaborando en una actividad comunitaria"
                  fill
                  className="object-cover"
                  priority
                  sizes="(min-width: 1024px) 1120px, 100vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(17, 33, 22, 0.78) 0%, rgba(17, 33, 22, 0.42) 30%, rgba(17, 33, 22, 0) 60%)",
                  }}
                />
                <div className="relative z-10 flex flex-col gap-2 p-8">
                  <h1 className="max-w-5xl text-3xl font-extrabold leading-tight tracking-[-0.07em] text-white md:text-5xl">
                    Empoderando mentes, transformando vidas
                  </h1>
                  <p className="mt-2 max-w-2xl text-lg leading-[-0.04em] text-slate-200">
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
                  src="/images/about-history-workspace.png"
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
                    style={{ fontSize: "36px" }}
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
                    style={{ fontSize: "36px" }}
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

            <section className="py-16">
              <div className="mx-auto mb-12 max-w-2xl text-center">
                <div className="mb-12">
                  <h2 className="mb-3 text-3xl font-bold tracking-[-0.02em] text-slate-900">
                    Nuestro Equipo Fundador
                  </h2>
                  <p className="text-slate-600">
                    Líderes apasionados y comprometidos con el impacto social.
                  </p>
                </div>

                <p className="text-slate-600">
                  Nuestro equipo reúne experiencia en educación, tecnología,
                  emprendimiento y trabajo social. Unidos por la convicción de
                  que el desarrollo personal transforma las comunidades,
                  trabajamos a diario para ampliar el alcance y la profundidad
                  de nuestros programas.
                </p>
              </div>
            </section>

            <section className="relative my-16 overflow-hidden rounded-2xl bg-background-dark p-8 text-center md:p-16">
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 50% 50%, #40b2b2 0%, transparent 70%)",
                }}
              />

              <div className="relative z-10 mx-auto max-w-2xl">
                <h2 className="mb-6 text-3xl font-bold text-white tracking-[-0.03em] md:text-4xl">
                  Únete al movimiento
                </h2>
                <p className="mb-8 text-lg leading-relaxed text-slate-300">
                  Podés participar, colaborar o construir una alianza para
                  acercar más herramientas de bienestar, educación y
                  oportunidades a quienes las necesitan y, marcar la diferencia
                  en la vida de muchas personas.
                </p>

                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Link
                    className="rounded-lg bg-primary px-8 py-3 font-bold text-slate-900 transition-all hover:shadow-lg hover:shadow-primary/20"
                    href="/participate#formulario"
                  >
                    Participá con nosotros
                  </Link>
                  <Link
                    className="rounded-lg border-2 border-white/20 bg-transparent px-8 py-3 font-bold text-white transition-all hover:bg-white/10"
                    href="/donations"
                  >
                    Apoyá nuestro trabajo
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-12 text-slate-300">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <div className="mb-6 flex items-center gap-2 text-white">
                <Image
                  src="/images/vive-tu-mente.png"
                  alt="Fundación Vive Tu Mente"
                  width={40}
                  height={40}
                  className="h-8 w-auto"
                />
                <span className="text-lg font-bold">
                  Fundación Vive Tu Mente
                </span>
              </div>
              <p className="max-w-sm text-sm leading-relaxed">
                Dedicada a romper el estigma en torno a la salud mental y
                proporcionar sistemas de apoyo accesibles para comunidades
                globales. Organización sin fines de lucro registrada N° 386717.
              </p>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-white">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    href="/programs"
                  >
                    Programas
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    href="/training"
                  >
                    Educación
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    href="/blog"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    href="/about_us"
                  >
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link
                    className="transition-colors hover:text-primary"
                    href="/participate#formulario"
                  >
                    Participación
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="mb-4 font-bold text-white">Contacto</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex min-w-0 items-start gap-2">
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{ fontSize: "16px" }}
                  >
                    mail
                  </span>
                  <a
                    className="min-w-0 break-all transition-colors hover:text-primary"
                    href="mailto:contacto@tuautocuidado.cl"
                  >
                    contacto@tuautocuidado.cl
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined shrink-0"
                    style={{ fontSize: "16px" }}
                  >
                    link
                  </span>
                  <a
                    className="transition-colors hover:text-primary"
                    href="https://www.linkedin.com/company/vivetumente/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-slate-800 pt-8 text-center text-xs text-slate-500">
            <p>
              © 2026 Fundación Vive Tu Mente. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
        {isHelpOpen ? (
          <div className="flex w-[calc(100vw-2rem)] flex-col gap-4 rounded-2xl border-t-4 border-primary bg-white p-5 shadow-2xl sm:w-96">
            <div className="flex items-start justify-between gap-2">
              <p className="brand-title text-base font-bold leading-snug">
                ¿Necesitás ayuda ahora?
              </p>
              <button
                type="button"
                aria-label="Cerrar"
                className="text-lg leading-none text-slate-400 hover:text-primary"
                onClick={() => setIsHelpOpen(false)}
              >
                ×
              </button>
            </div>

            <p className="text-sm leading-relaxed text-slate-500">
              Si estás pasando por un momento difícil, hay personas capacitadas
              esperando escucharte. Es gratis y confidencial.
            </p>

            <a
              href="tel:*4141"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-background px-3 py-3 transition-all hover:border-primary hover:bg-primary/5"
            >
              <span className="flex-shrink-0 text-2xl">📞</span>
              <div className="flex flex-col gap-0.5">
                <span className="block text-sm font-bold text-slate-800">
                  Línea Prevención del Suicidio
                </span>
                <span className="block text-lg font-extrabold tracking-wide text-primary">
                  *4141
                </span>
                <span className="block text-xs text-slate-500">
                  Ministerio de Salud · Gratis · 24/7
                </span>
              </div>
            </a>

            <a
              href="tel:6003607777"
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-background px-3 py-3 transition-all hover:border-primary hover:bg-primary/5"
            >
              <span className="flex-shrink-0 text-2xl">🧠</span>
              <div className="flex flex-col gap-0.5">
                <span className="block text-sm font-bold text-slate-800">
                  Salud Responde · Opción 2
                </span>
                <span className="block text-lg font-extrabold tracking-wide text-primary">
                  600 360 7777
                </span>
                <span className="block text-xs text-slate-500">
                  Psicólogos · Gratis · 24/7
                </span>
              </div>
            </a>

            <p className="border-t border-slate-100 pt-3 text-center text-xs leading-relaxed text-slate-500">
              Si estás en peligro inmediato, llamá al{" "}
              <strong className="text-slate-700">131</strong> o acudí a
              urgencias.
            </p>
          </div>
        ) : null}

        <button
          type="button"
          aria-label="Necesitás ayuda ahora"
          className="flex items-center gap-2.5 rounded-full bg-primary px-4 py-4 text-sm font-bold text-background-dark shadow-lg shadow-primary/40 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/50 sm:px-5 sm:py-3.5"
          onClick={() => setIsHelpOpen((currentValue) => !currentValue)}
        >
          <span className="vtm-pulse-dot h-2 w-2 flex-shrink-0 rounded-full bg-background-dark" />
          ¿Necesitás ayuda ahora?
        </button>
      </div>
    </div>
  );
}
