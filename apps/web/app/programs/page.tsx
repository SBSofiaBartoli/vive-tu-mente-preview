"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { apiGetClient, apiPostClient } from "@/lib/api-client";
import type { Faq } from "@/types/faq";
import type { Testimonial } from "@/types/testimonial";

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

const testimonialRoleOptions = [
  { value: "participant", label: "Participante" },
  { value: "professional", label: "Profesional" },
  { value: "alliance", label: "Alianza" },
  { value: "company", label: "Empresa" },
  { value: "institution", label: "Institución" },
  { value: "organization", label: "Organización" },
] as const;

type TestimonialForm = {
  full_name: string;
  role: Testimonial["role"];
  workshop_name: string;
  comment: string;
};

const initialTestimonialForm: TestimonialForm = {
  full_name: "",
  role: "participant",
  workshop_name: "",
  comment: "",
};

const getTestimonialsVisibleCount = () => {
  if (typeof window === "undefined") return 3;

  if (window.innerWidth >= 1024) return 3;
  if (window.innerWidth >= 768) return 2;

  return 1;
};

export default function ProgramsPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [featuredTestimonials, setFeaturedTestimonials] = useState<
    Testimonial[]
  >([]);
  const [testimonialSlideIndex, setTestimonialSlideIndex] = useState(0);
  const [testimonialVisibleCount, setTestimonialVisibleCount] = useState(3);
  const [isTestimonialCarouselPaused, setIsTestimonialCarouselPaused] =
    useState(false);
  const [isLoadingTestimonials, setIsLoadingTestimonials] = useState(true);
  const [testimonialsError, setTestimonialsError] = useState<string | null>(
    null,
  );
  const [programFaqs, setProgramFaqs] = useState<Faq[]>([]);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(true);
  const [faqsError, setFaqsError] = useState<string | null>(null);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState<TestimonialForm>(
    initialTestimonialForm,
  );
  const [isSubmittingTestimonial, setIsSubmittingTestimonial] = useState(false);
  const [testimonialSuccess, setTestimonialSuccess] = useState<string | null>(
    null,
  );
  const [testimonialSubmitError, setTestimonialSubmitError] = useState<
    string | null
  >(null);

  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        const testimonialsResponse = await apiGetClient<Testimonial[]>(
          "/api/testimonials/featured",
        );

        setFeaturedTestimonials(testimonialsResponse);
        setTestimonialsError(null);
      } catch {
        setTestimonialsError("No se pudieron cargar los testimonios.");
      } finally {
        setIsLoadingTestimonials(false);
      }
    };

    void loadTestimonials();
  }, []);

  useEffect(() => {
    const updateVisibleTestimonials = () => {
      window.requestAnimationFrame(() => {
        setTestimonialVisibleCount(getTestimonialsVisibleCount());
      });
    };

    updateVisibleTestimonials();
    window.addEventListener("resize", updateVisibleTestimonials);

    return () => {
      window.removeEventListener("resize", updateVisibleTestimonials);
    };
  }, []);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const maxSlideIndex = Math.max(
        featuredTestimonials.length - testimonialVisibleCount,
        0,
      );

      setTestimonialSlideIndex((currentIndex) =>
        currentIndex > maxSlideIndex ? maxSlideIndex : currentIndex,
      );
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [featuredTestimonials.length, testimonialVisibleCount]);

  useEffect(() => {
    const maxSlideIndex = Math.max(
      featuredTestimonials.length - testimonialVisibleCount,
      0,
    );

    if (maxSlideIndex === 0 || isTestimonialCarouselPaused) return;

    const intervalId = window.setInterval(() => {
      setTestimonialSlideIndex((currentIndex) =>
        currentIndex >= maxSlideIndex ? 0 : currentIndex + 1,
      );
    }, 3000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [
    featuredTestimonials.length,
    isTestimonialCarouselPaused,
    testimonialVisibleCount,
  ]);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const faqsResponse = await apiGetClient<Faq[]>(
          "/api/faqs?category=programas",
        );

        setProgramFaqs(faqsResponse);
        setFaqsError(null);
      } catch {
        setFaqsError("No se pudieron cargar las preguntas frecuentes.");
      } finally {
        setIsLoadingFaqs(false);
      }
    };

    void loadFaqs();
  }, []);

  const handleSubmitTestimonial = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmittingTestimonial(true);

    try {
      await apiPostClient<Testimonial, TestimonialForm>(
        "/api/testimonials",
        testimonialForm,
      );

      setTestimonialForm(initialTestimonialForm);
      setTestimonialSubmitError(null);
      setTestimonialSuccess(
        "Gracias por compartir tu experiencia. El testimonio quedó pendiente de revisión.",
      );
      window.setTimeout(() => {
        setIsTestimonialModalOpen(false);
        setTestimonialSuccess(null);
      }, 1600);
    } catch {
      setTestimonialSuccess(null);
      setTestimonialSubmitError(
        "No se pudo enviar el testimonio. Revisá los datos e intentá nuevamente.",
      );
    } finally {
      setIsSubmittingTestimonial(false);
    }
  };

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

          <div className="flex items-center gap-3">
            <Link
              className="hidden rounded-lg border border-primary/30 px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary/10 sm:inline-flex"
              href="/admin/login"
            >
              Admin
            </Link>

            <Link
              className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-background-dark transition-transform hover:scale-105"
              href="/donations"
            >
              Donación
            </Link>
          </div>
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
              <button
                type="button"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                onClick={() => {
                  setIsTestimonialModalOpen(true);
                  setTestimonialSuccess(null);
                  setTestimonialSubmitError(null);
                }}
              >
                Dejar testimonio
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  rate_review
                </span>
              </button>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setIsTestimonialCarouselPaused(true)}
              onMouseLeave={() => setIsTestimonialCarouselPaused(false)}
              onFocus={() => setIsTestimonialCarouselPaused(true)}
              onBlur={() => setIsTestimonialCarouselPaused(false)}
            >
              {isLoadingTestimonials ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-8 text-slate-600 shadow-sm">
                  Cargando testimonios...
                </div>
              ) : testimonialsError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-8 font-semibold text-red-700">
                  {testimonialsError}
                </div>
              ) : featuredTestimonials.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-8 text-slate-600 shadow-sm">
                  Todavía no hay testimonios destacados.
                </div>
              ) : (
                <>
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-700 ease-out"
                      style={{
                        transform: `translateX(-${
                          testimonialSlideIndex *
                          (100 / testimonialVisibleCount)
                        }%)`,
                      }}
                    >
                      {featuredTestimonials.map((testimonial) => (
                        <article
                          className="w-full shrink-0 px-3 md:w-1/2 lg:w-1/3"
                          key={testimonial.id}
                        >
                          <div className="flex h-full flex-col gap-6 rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
                            <p className="leading-relaxed text-slate-600 italic">
                              “{testimonial.comment}”
                            </p>

                            <div className="mt-auto flex items-center gap-4">
                              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/20">
                                <span className="material-symbols-outlined text-primary">
                                  person
                                </span>
                              </div>

                              <div>
                                <p className="font-bold text-slate-900">
                                  {testimonial.full_name}
                                </p>
                                <p className="text-sm text-slate-500">
                                  {testimonial.workshop_name ??
                                    "Participante Vive Tu Mente"}
                                </p>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>

                  {featuredTestimonials.length > testimonialVisibleCount ? (
                    <div className="mt-8 flex items-center justify-center gap-4">
                      <button
                        type="button"
                        aria-label="Ver testimonio anterior"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors hover:bg-primary hover:text-background-dark"
                        onClick={() => {
                          const maxSlideIndex = Math.max(
                            featuredTestimonials.length -
                              testimonialVisibleCount,
                            0,
                          );

                          setTestimonialSlideIndex((currentIndex) =>
                            currentIndex === 0
                              ? maxSlideIndex
                              : currentIndex - 1,
                          );
                        }}
                      >
                        <span className="material-symbols-outlined">
                          arrow_back
                        </span>
                      </button>

                      <button
                        type="button"
                        aria-label="Ver testimonio siguiente"
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors hover:bg-primary hover:text-background-dark"
                        onClick={() => {
                          const maxSlideIndex = Math.max(
                            featuredTestimonials.length -
                              testimonialVisibleCount,
                            0,
                          );

                          setTestimonialSlideIndex((currentIndex) =>
                            currentIndex >= maxSlideIndex
                              ? 0
                              : currentIndex + 1,
                          );
                        }}
                      >
                        <span className="material-symbols-outlined">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  ) : null}
                </>
              )}
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
              {isLoadingFaqs ? (
                <article className="rounded-xl border border-slate-100 bg-white p-6 text-slate-600">
                  Cargando preguntas frecuentes...
                </article>
              ) : faqsError ? (
                <article className="rounded-xl border border-red-200 bg-red-50 p-6 font-semibold text-red-700">
                  {faqsError}
                </article>
              ) : programFaqs.length === 0 ? (
                <article className="rounded-xl border border-slate-100 bg-white p-6 text-slate-600">
                  Todavía no hay preguntas frecuentes publicadas.
                </article>
              ) : (
                programFaqs.map((faq) => (
                  <article
                    className="overflow-hidden rounded-xl border border-slate-100 bg-white"
                    key={faq.id}
                  >
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                      onClick={() =>
                        setOpenFaqId((currentFaqId) =>
                          currentFaqId === faq.id ? null : faq.id,
                        )
                      }
                    >
                      <span className="text-lg font-bold text-slate-900">
                        {faq.question}
                      </span>
                      <span
                        className="material-symbols-outlined shrink-0 text-primary transition-transform"
                        style={{
                          fontSize: "24px",
                          transform:
                            openFaqId === faq.id
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                      >
                        expand_more
                      </span>
                    </button>

                    {openFaqId === faq.id ? (
                      <div className="border-t border-slate-100 px-6 pb-6 pt-4">
                        <p className="leading-relaxed text-slate-600">
                          {faq.answer}
                        </p>
                      </div>
                    ) : null}
                  </article>
                ))
              )}
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

      {isTestimonialModalOpen ? (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-background-dark/60 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border-t-4 border-primary bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold tracking-[-0.03em] text-slate-900">
                  Dejá tu testimonio
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Tu experiencia será revisada por el equipo antes de mostrarse
                  en el sitio.
                </p>
              </div>

              <button
                type="button"
                aria-label="Cerrar formulario"
                className="text-2xl leading-none text-slate-400 hover:text-primary"
                onClick={() => setIsTestimonialModalOpen(false)}
              >
                ×
              </button>
            </div>

            {testimonialSuccess ? (
              <div
                className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700 shadow-sm"
                role="status"
                aria-live="polite"
              >
                {testimonialSuccess}
              </div>
            ) : null}

            {testimonialSubmitError ? (
              <div
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700 shadow-sm"
                role="alert"
              >
                {testimonialSubmitError}
              </div>
            ) : null}

            <form className="space-y-5" onSubmit={handleSubmitTestimonial}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-900">
                    Nombre y apellido
                  </span>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
                    type="text"
                    value={testimonialForm.full_name}
                    onChange={(event) =>
                      setTestimonialForm((currentValue) => ({
                        ...currentValue,
                        full_name: event.target.value,
                      }))
                    }
                    required
                    minLength={2}
                    placeholder="María González"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-900">
                    Tipo de vínculo
                  </span>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
                    value={testimonialForm.role}
                    onChange={(event) =>
                      setTestimonialForm((currentValue) => ({
                        ...currentValue,
                        role: event.target.value as Testimonial["role"],
                      }))
                    }
                  >
                    {testimonialRoleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-900">
                  Taller o actividad
                </span>
                <input
                  className="w-full rounded-xl border border-slate-200 bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
                  type="text"
                  value={testimonialForm.workshop_name}
                  onChange={(event) =>
                    setTestimonialForm((currentValue) => ({
                      ...currentValue,
                      workshop_name: event.target.value,
                    }))
                  }
                  placeholder="Taller de bienestar emocional"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-900">
                  Comentario
                </span>
                <textarea
                  className="min-h-36 w-full resize-y rounded-xl border border-slate-200 bg-background px-4 py-3 leading-relaxed outline-none transition-colors focus:border-primary"
                  value={testimonialForm.comment}
                  onChange={(event) =>
                    setTestimonialForm((currentValue) => ({
                      ...currentValue,
                      comment: event.target.value,
                    }))
                  }
                  required
                  minLength={10}
                  placeholder="Contanos cómo fue tu experiencia..."
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-6 py-3 font-bold text-slate-700 transition-colors hover:border-primary hover:text-primary"
                  onClick={() => setIsTestimonialModalOpen(false)}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingTestimonial}
                  className="rounded-xl bg-primary px-6 py-3 font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingTestimonial
                    ? "Enviando..."
                    : "Enviar testimonio"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

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
