"use client";

import Image from "next/image";
import Link from "next/link";

export default function ParticipatePage() {
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
                className="text-sm font-semibold transition-colors hover:text-primary"
                href="/training"
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
                className="text-sm font-bold text-primary"
                href="/participate"
                aria-current="page"
              >
                Participar
              </Link>
            </nav>

            <Link
              href="/donations"
              className="rounded-lg bg-primary px-7 py-3 text-sm font-bold text-background-dark transition-colors hover:bg-primary/90"
            >
              Donación
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-64 w-full overflow-hidden md:h-80">
          <Image
            src="/images/about-hero-community.png"
            alt="Grupo diverso de personas sonriendo"
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(17, 33, 22, 0.8) 0%, rgba(17, 33, 22, 0.2) 100%)",
            }}
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
            <h1 className="brand-title mb-4 text-3xl font-bold text-white drop-shadow-lg md:text-5xl">
              Participa con nosotros
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-white drop-shadow-lg md:text-xl">
              Tu contribución impulsa un futuro donde la salud mental es una
              prioridad para todos.
            </p>
          </div>
        </section>

        <section className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-12 md:flex-row md:py-20">
          <aside className="flex w-full flex-col gap-4 md:w-1/3">
            <div>
              <h2 className="brand-title mb-4 text-2xl font-bold text-slate-900">
                Únete al Movimiento
              </h2>
              <p className="leading-relaxed text-slate-600">
                Ya sea que quieras aprender, colaborar o construir algo en
                conjunto, este puede ser tu primer paso. Creemos que todos
                tienen un papel único en la promoción del bienestar mental.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4">
                <span className="material-symbols-outlined mt-1 text-primary">
                  favorite
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">Voluntariado</h3>
                  <p className="text-sm text-slate-600">
                    Dedica tu tiempo y habilidades para apoyar nuestras
                    iniciativas comunitarias locales.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4">
                <span className="material-symbols-outlined mt-1 text-primary">
                  school
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">Programas</h3>
                  <p className="text-sm text-slate-600">
                    Únete a nuestros programas de aprendizaje estructurados y
                    talleres diseñados para el crecimiento.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-primary/10 bg-primary/5 p-4">
                <span className="material-symbols-outlined mt-1 text-primary">
                  handshake
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">Colaborar</h3>
                  <p className="text-sm text-slate-600">
                    Colabora con nosotros como organización o profesional para
                    expandir nuestro alcance.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <div className="w-full md:w-2/3" id="formulario">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <form className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm font-semibold text-slate-700"
                      htmlFor="name"
                    >
                      Nombre completo
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="María González"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm font-semibold text-slate-700"
                      htmlFor="email"
                    >
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="nombre@correo.com"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm font-semibold text-slate-700"
                      htmlFor="phone"
                    >
                      Número de teléfono
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+56 9 0000 0000"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      className="text-sm font-semibold text-slate-700"
                      htmlFor="interest"
                    >
                      Área de interés
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      required
                      defaultValue=""
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                    >
                      <option value="" disabled>
                        Seleccioná una opción
                      </option>
                      <option value="programs">
                        Registrarse para programas
                      </option>
                      <option value="volunteer">
                        Oportunidad de voluntariado
                      </option>
                      <option value="organization">
                        Empresa, alianza o taller corporativo
                      </option>
                      <option value="collaborate">
                        Colaboración profesional
                      </option>
                      <option value="other">Consulta general</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    className="text-sm font-semibold text-slate-700"
                    htmlFor="message"
                  >
                    Tu mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Contanos cómo te gustaría participar o colaborar..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-slate-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary/90"
                >
                  <span>Enviar Solicitud</span>
                  <span className="material-symbols-outlined text-lg">
                    send
                  </span>
                </button>

                <p className="mt-4 text-center text-xs text-slate-500">
                  Al enviar tu solicitud, autorizas a la fundación a contactarte
                  para conversar sobre actividades, programas o formas de
                  colaboración.
                </p>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
