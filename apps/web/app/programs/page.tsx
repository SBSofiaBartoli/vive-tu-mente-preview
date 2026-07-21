"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const challengeCards = [
  {
    icon: "rocket_launch",
    title: "Linea Junior",
    text: "Fomentar el espíritu emprendedor en los estudiantes. Convertir las ideas del aula en modelos de negocio reales.",
    detail: "Preparar a los jóvenes para la fuerza laboral o el emprendimiento",
  },
  {
    icon: "devices",
    title: "Economía Plateada",
    text: "Alfabetización digital para personas mayores. Cerrando la brecha generacional en el panorama digital moderno.",
    detail: "Reducir la brecha digital y promover la independencia económica",
  },
  {
    icon: "verified",
    title: "Validación de Start-Up",
    text: "Validación empresarial y apoyo a la recolocación laboral para aspirantes a emprendedores.",
    detail: "Apoyar la creación de empresas y la reinserción laboral",
  },
];

const testimonials = [
  {
    text: "Antes no sabía por dónde empezar. La Escuela de Oficios me dio herramientas concretas y la confianza para animarme a emprender. Hoy tengo mi propio taller de carpintería.",
    name: "Martín Soto",
    role: "Participante · Escuela de Oficios",
  },
  {
    text: "El programa me ayudó a entender lo que sentía y a pedir ayuda sin vergüenza. Aprendí que cuidar mi salud mental es tan importante como cualquier otra cosa.",
    name: "Valentina Reyes",
    role: "Participante · Desafíate a Ti Mismo",
  },
  {
    text: "Línea Invisible me mostró cómo conectar mi mundo emocional con mi desarrollo profesional. Salí del programa con claridad y con herramientas que uso todos los días.",
    name: "Camila Fuentes",
    role: "Participante · Línea Invisible",
  },
];

const faqs = [
  {
    question: "¿Necesito experiencia previa para participar?",
    answer:
      "No. Los programas están pensados para acompañar distintos puntos de partida. Lo importante es tener interés en aprender, crecer o desarrollar nuevas herramientas.",
  },
  {
    question: "¿Cómo sé qué programa es para mí?",
    answer:
      "Podés revisar la descripción de cada programa y escribirnos desde el formulario de participación. El equipo podrá orientarte según tus intereses y necesidades.",
  },
  {
    question: "¿Los programas son presenciales o virtuales?",
    answer:
      "La modalidad puede variar según el programa, el taller y la disponibilidad de la fundación. Se recomienda consultar por las próximas fechas y formatos disponibles.",
  },
  {
    question: "¿Puedo participar como organización o empresa?",
    answer:
      "Sí. Las organizaciones pueden colaborar, generar alianzas o contratar talleres para apoyar el trabajo de la fundación y ampliar su impacto social.",
  },
];

export default function ProgramsPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/vive-tu-mente.png"
              alt="Fundación Vive Tu Mente"
              width={56}
              height={56}
              className="h-12 w-auto"
              priority
            />
            <span className="text-xl font-extrabold tracking-tight">
              Fundación Vive Tu Mente
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            <Link className="text-sm font-semibold hover:text-primary" href="/">
              Inicio
            </Link>
            <Link
              className="text-sm font-semibold text-primary"
              href="/programs"
            >
              Programas
            </Link>
            <Link
              className="text-sm font-semibold hover:text-primary"
              href="/training"
            >
              Educación
            </Link>
            <Link
              className="text-sm font-semibold hover:text-primary"
              href="/about_us"
            >
              Sobre Nosotros
            </Link>
            <Link
              className="text-sm font-semibold hover:text-primary"
              href="/participate"
            >
              Participar
            </Link>
          </nav>

          <Link
            className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-background-dark transition-transform hover:scale-105"
            href="/donations"
          >
            Donación
          </Link>
        </div>
      </header>

      <main>
        <section className="px-6 py-12 md:px-20 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="relative mb-12 h-[300px] w-full overflow-hidden rounded-xl md:h-[450px]">
              <div
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{
                  backgroundImage: 'url("/images/programs-hero-community.jpg")',
                }}
              />
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-background-dark/80 to-transparent" />
              <div className="absolute bottom-0 left-0 z-20 p-8">
                <h1 className="max-w-2xl text-4xl font-bold leading-[1] tracking-[-0.05em] text-white md:text-6xl">
                  Acortando la distancia entre el potencial y el propósito.
                </h1>
              </div>
            </div>

            <div className="max-w-3xl">
              <p className="text-lg leading-snug text-slate-600 md:text-xl">
                Proporcionamos las herramientas, las habilidades y la mentalidad
                necesarias para ayudar a todas las generaciones a prosperar en
                el mundo moderno. Explore nuestras especializaciones diseñadas
                para el crecimiento individual y el impacto en la comunidad.
              </p>
            </div>
          </div>
        </section>

        <section
          id="linea-invisible"
          className="relative overflow-hidden bg-background-dark px-6 py-20 text-white md:px-20"
        >
          <div
            className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-20"
            style={{
              background:
                "radial-gradient(circle at center, #40b2b2 0%, transparent 65%)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
              <div className="group relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-primary to-green-300 opacity-25 blur transition duration-1000 group-hover:opacity-50" />
                <div className="relative h-[400px] overflow-hidden rounded-xl bg-black">
                  <Image
                    src="/images/invisible-line-D5hqepxy.jpg"
                    alt="Representación visual de talentos ocultos"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="inline-block rounded-full border border-primary/30 bg-primary/20 px-4 py-1 text-sm font-bold text-primary">
                  Nuevo Programa
                </div>
                <h2 className="brand-title text-4xl font-bold">
                  Linea Invisible
                </h2>
                <p className="text-lg leading-relaxed text-slate-400">
                  Más allá de las habilidades evidentes, existen talentos
                  ocultos esperando ser descubiertos. Nuestra metodología
                  &quot;Linea Invisible&quot; utiliza conocimientos psicológicos
                  y talleres creativos para revelar capacidades latentes que no
                  sabías que tenías.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="escuela-oficios"
          className="bg-slate-100 px-6 py-20 md:px-20"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="material-symbols-outlined text-primary"
                style={{ fontSize: "36px" }}
              >
                construction
              </span>
              <h2 className="brand-title text-3xl font-bold">
                Escuela de Oficios
              </h2>
            </div>

            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-800">
                  Domina habilidades prácticas para el mundo real
                </h3>
                <p className="text-lg text-slate-600">
                  Formación profesional en oficios con gran demanda, como
                  carpintería, fontanería y electricidad. Nos centramos en la
                  experiencia práctica y en las certificaciones estándar del
                  sector para garantizar tu futuro financiero.
                </p>

                <ul className="space-y-4">
                  {[
                    "Tutoría profesional por parte de maestros artesanos",
                    "Certificación acreditada al completar el curso",
                    "Asistencia directa para la colocación laboral",
                  ].map((item) => (
                    <li className="flex items-start gap-3" key={item}>
                      <span className="material-symbols-outlined mt-1 text-primary">
                        check_circle
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  className="inline-flex rounded-lg bg-primary px-8 py-3 font-bold text-background-dark transition-colors hover:bg-primary/90"
                  href="/participate#formulario"
                >
                  Quiero más información
                </Link>
              </div>

              <div className="relative h-[400px] overflow-hidden rounded-xl shadow-2xl">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  aria-label="Persona trabajando con herramientas de oficio"
                  style={{
                    backgroundImage:
                      'url("/images/unnamedprograms-school-trades.png")',
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section id="desafiate" className="px-6 py-20 md:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 text-center">
              <h2 className="brand-title mb-4 text-4xl font-black">
                Desafíate a ti mismo
              </h2>
              <p className="mx-auto max-w-2xl text-slate-600">
                Elige un camino que se adapte a tu etapa de vida y tus
                ambiciones. Nuestros programas especializados están diseñados
                para generar impacto.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {challengeCards.map((card) => (
                <article
                  className="rounded-xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
                  key={card.title}
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary">
                    <span className="material-symbols-outlined">
                      {card.icon}
                    </span>
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{card.title}</h3>
                  <p className="mb-6 text-slate-600">{card.text}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-primary">
                    {card.detail}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24" id="testimonios">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-[-0.03em] lg:text-4xl">
                Lo que dicen quienes vivieron la experiencia
              </h2>
              <p className="text-lg text-slate-600">
                Historias reales de personas que transformaron su vida con Vive
                Tu Mente.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <article
                  className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
                  key={testimonial.name}
                >
                  <div className="flex h-full flex-col gap-6">
                    <p className="leading-relaxed text-slate-600 italic">
                      “{testimonial.text}”
                    </p>
                    <div className="mt-auto flex items-center gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/20">
                        <span className="material-symbols-outlined text-primary">
                          person
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">
                          {testimonial.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-100 px-6 py-20 md:px-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold tracking-[-0.03em] lg:text-4xl">
                Preguntas frecuentes
              </h2>
              <p className="text-lg text-slate-600">
                Resolvemos algunas dudas comunes para ayudarte a dar el primer
                paso.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <article
                  className="rounded-xl border border-slate-100 bg-white p-6"
                  key={faq.question}
                >
                  <h3 className="mb-2 text-lg font-bold">{faq.question}</h3>
                  <p className="leading-relaxed text-slate-600">{faq.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-24 md:px-20">
          <div className="mx-auto max-w-4xl rounded-2xl bg-primary p-8 text-center shadow-xl md:p-12">
            <h2 className="mb-4 text-3xl font-bold text-background-dark tracking-[-0.04em] md:text-4xl">
              ¿Listo para encontrar tu camino?
            </h2>
            <p className="mb-8 text-lg text-background-dark/80">
              Únete a miles de personas que han redefinido su futuro a través de
              la Fundación Vive Tu Mente.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                className="w-full rounded-xl bg-background-dark px-10 py-4 font-bold text-white hover:opacity-90 sm:w-auto"
                href="/participate"
              >
                Participá Ahora
              </Link>
              <Link
                className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-background-dark transition-all hover:shadow-xl"
                href="/donations"
              >
                <span className="material-symbols-outlined">favorite</span>
                Donar
              </Link>
            </div>
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
