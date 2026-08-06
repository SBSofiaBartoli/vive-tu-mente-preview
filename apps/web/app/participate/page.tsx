"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { apiPostClient } from "@/lib/api-client";
import type { ParticipationMessage } from "@/types/participation-message";

type ParticipationFormStatus = "idle" | "success" | "error";

type ParticipationFormState = {
  full_name: string;
  email: string;
  phone: string;
  interest_area: string;
  message: string;
};

export default function ParticipatePage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [formData, setFormData] = useState<ParticipationFormState>({
    full_name: "",
    email: "",
    phone: "",
    interest_area: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState<ParticipationFormStatus>("idle");
  const [formMessage, setFormMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormField = (
    field: keyof ParticipationFormState,
    value: string,
  ) => {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  };

  const handleParticipationSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setIsSubmitting(true);
    setFormStatus("idle");
    setFormMessage("");

    try {
      await apiPostClient<ParticipationMessage, ParticipationFormState>(
        "/api/participation/messages",
        formData,
      );

      setFormData({
        full_name: "",
        email: "",
        phone: "",
        interest_area: "",
        message: "",
      });
      setFormStatus("success");
      setFormMessage(
        "Recibimos tu solicitud. Pronto nos contactaremos para conversar.",
      );
    } catch {
      setFormStatus("error");
      setFormMessage(
        "No se pudo enviar la solicitud. Revisá los datos e intentá nuevamente.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

            <div className="flex items-center gap-3">
              <Link
                className="hidden rounded-lg border border-primary/30 px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary/10 sm:inline-flex"
                href="/admin/login"
              >
                Admin
              </Link>

              <Link
                href="/donations"
                className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-background-dark transition-all hover:shadow-lg hover:shadow-primary/20"
              >
                Donación
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative h-64 w-full overflow-hidden md:h-80">
          <Image
            src="/images/participate-hero-community.png"
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
              <form className="space-y-6" onSubmit={handleParticipationSubmit}>
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
                      name="full_name"
                      value={formData.full_name}
                      onChange={(event) =>
                        updateFormField("full_name", event.target.value)
                      }
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
                      value={formData.email}
                      onChange={(event) =>
                        updateFormField("email", event.target.value)
                      }
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
                      value={formData.phone}
                      onChange={(event) =>
                        updateFormField("phone", event.target.value)
                      }
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
                      value={formData.interest_area}
                      onChange={(event) =>
                        updateFormField("interest_area", event.target.value)
                      }
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
                    required
                    value={formData.message}
                    onChange={(event) =>
                      updateFormField("message", event.target.value)
                    }
                    rows={5}
                    placeholder="Contanos cómo te gustaría participar o colaborar..."
                    className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>

                {formMessage ? (
                  <div
                    className={`rounded-xl border px-5 py-4 text-sm font-bold shadow-sm ${
                      formStatus === "success"
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                    role={formStatus === "success" ? "status" : "alert"}
                    aria-live={formStatus === "success" ? "polite" : undefined}
                  >
                    {formMessage}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-slate-900 shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <span>
                    {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
                  </span>
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

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 md:pb-24 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-background-dark p-8 text-white shadow-xl md:p-12 lg:p-14">
            <div className="pointer-events-none absolute right-6 top-4 opacity-10">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "220px", lineHeight: 1 }}
              >
                handshake
              </span>
            </div>

            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <span
                  className="material-symbols-outlined text-primary"
                  style={{ fontSize: "30px", lineHeight: 1 }}
                >
                  business_center
                </span>
                <span className="text-sm font-bold uppercase tracking-wider text-primary">
                  Empresas y alianzas
                </span>
              </div>

              <div className="max-w-3xl">
                <h2 className="mb-4 text-3xl font-bold leading-[1.16] tracking-[-0.03em] md:text-4xl">
                  Tu organización también puede impulsar bienestar
                </h2>

                <p className="mb-8 text-lg leading-relaxed text-slate-300">
                  Las empresas, instituciones y organizaciones pueden colaborar
                  contratando talleres, impulsando alianzas o apoyando programas
                  que acerquen bienestar emocional, educación y oportunidades a
                  más personas.
                </p>
              </div>

              <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-2 font-bold">Talleres</h3>
                  <p className="text-sm text-slate-300">
                    Actividades para equipos, comunidades educativas u
                    organizaciones.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-2 font-bold">Alianzas</h3>
                  <p className="text-sm text-slate-300">
                    Proyectos colaborativos para ampliar el alcance de la
                    fundación.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <h3 className="mb-2 font-bold">Impacto social</h3>
                  <p className="text-sm text-slate-300">
                    Iniciativas que ayudan a financiar programas para más
                    personas.
                  </p>
                </div>
              </div>

              <div className="flex justify-stretch md:justify-end">
                <a
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-bold text-background-dark transition-colors hover:bg-primary/90 md:w-auto"
                  href="#formulario"
                >
                  Quiero conversar
                  <span className="material-symbols-outlined text-lg">
                    arrow_forward
                  </span>
                </a>
              </div>
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
              <p className="brand-title text-base font-bold leading-snug text-slate-900">
                ¿Necesitás ayuda ahora?
              </p>

              <button
                type="button"
                aria-label="Cerrar"
                className="text-lg leading-none text-slate-400 transition-colors hover:text-primary"
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
