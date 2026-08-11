"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { apiGetClient, apiPostClient } from "@/lib/api-client";
import type { Article } from "@/types/article";

const programs = [
  {
    title: "Escuela de oficios",
    text: "Dotar a las personas de habilidades técnicas prácticas para fomentar la independencia financiera y el éxito emprendedor.",
    image: "/images/school-trades-BpEJNx1B.jpg",
    href: "/programs#escuela-oficios",
  },
  {
    title: "Desafíate a Ti Mismo",
    text: "Un programa de crecimiento personal diseñado para superar límites y desarrollar resiliencia a través de mentoría y talleres de salud mental.",
    image: "/images/challenge-yourself-BZR2AxeA.jpg",
    href: "/programs#desafiate",
  },
  {
    title: "Línea Invisible",
    text: "Cerrando la brecha entre la conciencia emocional y el liderazgo profesional para el desarrollo de carreras modernas.",
    image: "/images/invisible-line-D5hqepxy.jpg",
    href: "/programs#linea-invisible",
  },
];

type VisitCounterResponse = {
  page_path: string;
  total_visits: number;
};

const getOrCreateVisitorKey = () => {
  const storageKey = "vtm_home_visitor_key";
  const existingVisitorKey = window.localStorage.getItem(storageKey);

  if (existingVisitorKey) {
    return existingVisitorKey;
  }

  const newVisitorKey =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `visitor_${Math.random().toString(36).slice(2)}_${Date.now()}`;

  window.localStorage.setItem(storageKey, newVisitorKey);

  return newVisitorKey;
};

export default function Home() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [visitCounter, setVisitCounter] = useState<number | null>(null);

  useEffect(() => {
    const loadFeaturedArticles = async () => {
      try {
        const articlesResponse = await apiGetClient<Article[]>(
          "/api/articles/featured",
        );

        setFeaturedArticles(articlesResponse.slice(0, 3));
        setArticlesError(null);
      } catch {
        setArticlesError("No se pudieron cargar los artículos destacados.");
      } finally {
        setIsLoadingArticles(false);
      }
    };

    void loadFeaturedArticles();
  }, []);

  useEffect(() => {
    const trackHomeVisit = async () => {
      try {
        const visitorKey = getOrCreateVisitorKey();

        const counterResponse = await apiPostClient<
          VisitCounterResponse,
          { visitor_key: string; page_path: string }
        >("/api/visits/track", {
          visitor_key: visitorKey,
          page_path: "/",
        });

        setVisitCounter(counterResponse.total_visits);
      } catch {
        setVisitCounter(null);
      }
    };

    void trackHomeVisit();
  }, []);

  return (
    <div className="min-h-screen bg-background text-slate-900">
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
            <Link className="text-sm font-bold text-primary" href="/">
              Inicio
            </Link>
            <a
              className="text-sm font-semibold hover:text-primary"
              href="/programs"
            >
              Programas
            </a>
            <a
              className="text-sm font-semibold hover:text-primary"
              href="/training"
            >
              Educación
            </a>
            <a
              className="text-sm font-semibold hover:text-primary"
              href="/about_us"
            >
              Sobre Nosotros
            </a>
            <a
              className="text-sm font-semibold hover:text-primary"
              href="/participate"
            >
              Participar
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              className="hidden rounded-lg border border-primary/30 px-4 py-2 text-sm font-bold text-primary transition-all hover:bg-primary/10 sm:inline-flex"
              href="/admin/login"
            >
              Admin
            </Link>

            <a
              className="rounded-lg bg-primary px-6 py-2 text-sm font-bold text-background-dark transition-transform hover:scale-105"
              href="/donations"
            >
              Donación
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <div className="flex flex-col gap-8">
                <div>
                  <span className="mb-2 inline-block rounded-full bg-primary/20 px-4 py-1 text-xs font-bold uppercase tracking-wider">
                    Empoderando el Potencial
                  </span>
                  <h1 className="brand-title mb-3 text-5xl font-black leading-tight tracking-tight lg:text-7xl">
                    Vive Tu <span className="text-primary">Mente</span>
                  </h1>
                  <p className="max-w-xl text-lg leading-snug text-slate-600 lg:text-xl">
                    Promovemos el bienestar emocional, el emprendimiento y el
                    desarrollo personal en todas las etapas de la vida a través
                    del apoyo comunitario dedicado.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <a
                    className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-background-dark transition-transform hover:scale-105"
                    href="/programs"
                  >
                    Conocé nuestros programas
                    <span
                      className="material-symbols-outlined"
                      aria-hidden="true"
                    >
                      arrow_forward
                    </span>
                  </a>
                  <a
                    className="rounded-xl bg-slate-200 px-8 py-4 text-base font-bold transition-colors hover:bg-slate-300"
                    href="/participate#formulario"
                  >
                    Participá
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="relative aspect-square overflow-hidden rounded-3xl shadow-2xl transition-transform duration-500 hover:rotate-0 lg:rotate-3">
                  <Image
                    src="/images/home-hero-community.jpg"
                    alt="Grupo de personas colaborando en una actividad de bienestar y desarrollo personal"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
            {[
              [
                "school",
                "¿Buscas herramientas para ti?",
                "Encuentra recursos para fortalecer tu bienestar, tu propósito y tu desarrollo personal.",
                "/training",
              ],
              [
                "diversity_3",
                "¿Quieres apoyar a alguien más?",
                "Conocé programas y herramientas para acompañar a jóvenes, familias y comunidades.",
                "/programs",
              ],
              [
                "volunteer_activism",
                "¿Quieres colaborar con la fundación?",
                "Súmate como voluntario, aliado o donante para impulsar nuevas oportunidades.",
                "/participate#formulario",
              ],
            ].map(([icon, title, text, href]) => (
              <a
                key={title}
                href={href}
                className="group rounded-xl border border-slate-100 bg-white p-6 transition-all hover:border-primary/60 hover:shadow-xl hover:shadow-primary/10"
              >
                <div className="mb-5 flex items-center justify-between gap-4 text-primary">
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "36px" }}
                  >
                    {icon}
                  </span>
                  <span className="text-slate-400 transition-all group-hover:translate-x-1 group-hover:text-primary">
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </span>
                </div>
                <h2 className="mb-3 text-2xl font-bold">{title}</h2>
                <p className="leading-relaxed text-slate-600">{text}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="bg-primary/5 py-20" id="about">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <span
              className="material-symbols-outlined mb-6 text-primary"
              style={{ fontSize: "50px" }}
            >
              diversity_3
            </span>
            <h2 className="brand-title mb-8 text-3xl font-bold lg:text-4xl">
              Nuestro Propósito
            </h2>
            <p
              className="text-xl leading-snug tracking-[-0.01em] text-slate-700 lg:text-2xl [&]:[font-style:oblique_10deg]"
              style={{
                transform: "skewX(-10deg)",
                transformOrigin: "center",
              }}
            >
              “Contribuir a que más personas vivan con{" "}
              <span className="font-black text-slate-900">
                bienestar, dignidad y oportunidades,
              </span>{" "}
              fortaleciendo su salud mental, su autonomía y su capacidad de
              construir proyectos de vida significativos.”
            </p>
          </div>
        </section>

        <section className="py-24 pb-14" id="programs">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="brand-title mb-4 text-4xl font-extrabold">
                Programas Transformadores
              </h2>
              <p className="text-slate-600">
                Conocé iniciativas pensadas para acompañar procesos de
                crecimiento, aprendizaje y bienestar.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {programs.map((program) => (
                <article
                  key={program.title}
                  className="group overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5"
                >
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-8">
                    <h3 className="mb-3 text-2xl font-bold">{program.title}</h3>
                    <p className="mb-6 leading-relaxed text-slate-600">
                      {program.text}
                    </p>
                    <a
                      className="flex items-center gap-2 font-bold text-primary"
                      href={program.href}
                    >
                      Conocé Más <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-primary py-5" id="impact">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-5 px-4 text-center text-background-dark sm:flex-row sm:px-6 lg:px-8">
            <div className="inline-flex rounded-full bg-background-dark/10 p-3">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "36px" }}
              >
                monitoring
              </span>
            </div>

            <div>
              <p className="text-lg font-black uppercase tracking-[0.14em]">
                Comunidad en movimiento
              </p>
              <p className="mt-1 font-medium opacity-85">
                Personas que ya visitaron nuestra página.
              </p>
            </div>

            <div className="flex items-baseline gap-2 bg-white/90 px-5 py-2.5 shadow-sm shadow-background-dark/10">
              <span className="text-4xl font-black leading-none text-background-dark">
                {visitCounter !== null
                  ? visitCounter.toLocaleString("es-CL")
                  : "..."}
              </span>
              <span className="text-sm font-black uppercase tracking-[0.1em] text-background-dark/70">
                visitas
              </span>
            </div>
          </div>
        </section>

        <section className="bg-primary/5 py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-10 text-center">
              <h2 className="brand-title mb-4 text-3xl font-extrabold lg:text-4xl">
                Mirá lo que construimos juntos
              </h2>
              <p className="text-lg text-slate-600">
                Cada taller, cada encuentro, cada historia cuenta. Esto es Vive
                Tu Mente en acción.
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
                  Video del taller próximamente
                </p>
                <p className="text-sm text-slate-400">
                  Este espacio está reservado para mostrar el impacto real de la
                  fundación.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <span className="text-sm font-bold uppercase tracking-wider text-primary">
                  Recursos prácticos
                </span>
                <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.04em] lg:text-4xl">
                  Aprendé más en el Blog
                </h2>
                <p className="mt-3 max-w-2xl text-slate-600">
                  Ideas breves para cuidar tu bienestar, organizarte mejor y
                  descubrir nuevas herramientas.
                </p>
              </div>
              <Link
                className="font-bold text-primary hover:text-primary/80"
                href="/blog"
              >
                Ver todos los artículos →
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {isLoadingArticles ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm md:col-span-3">
                  Cargando artículos destacados...
                </div>
              ) : articlesError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 font-semibold text-red-700 md:col-span-3">
                  {articlesError}
                </div>
              ) : featuredArticles.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm md:col-span-3">
                  Todavía no hay artículos destacados publicados.
                </div>
              ) : (
                featuredArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="relative h-44 w-full">
                      <Image
                        src={
                          article.cover_image_url ??
                          "/images/people-support-group.jpg"
                        }
                        alt={article.cover_image_alt ?? article.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {article.category ?? "Blog"}
                      </span>
                      <h3 className="mt-3 text-xl font-bold">
                        {article.title}
                      </h3>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2.5rem] bg-primary p-12 text-background-dark shadow-xl shadow-primary/10 lg:p-19">
              <div className="absolute right-0 top-0 p-10 opacity-10">
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "300px" }}
                >
                  volunteer_activism
                </span>
              </div>
              <div className="relative z-10 max-w-2xl">
                <h2 className="mb-8 text-4xl font-bold leading-[1.08] tracking-[-0.04em] lg:text-6xl">
                  ¿Listo para marcar la diferencia?
                </h2>
                <p className="mb-12 text-lg font-medium opacity-90 lg:text-xl">
                  Sumate a nuestra misión de impulsar bienestar, educación y
                  oportunidades. Podés participar, colaborar o construir una
                  alianza para ampliar el impacto de la fundación.
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    className="rounded-xl bg-background-dark px-8 py-4 font-bold text-white transition-transform hover:scale-105"
                    href="/participate#formulario"
                  >
                    Participá Ahora
                  </a>
                  <a
                    className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-bold text-background-dark transition-all hover:shadow-xl"
                    href="/donations"
                  >
                    <span className="material-symbols-outlined">favorite</span>
                    Donar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-12 text-slate-300">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-12 md:grid-cols-4">
            <div className="md:col-span-2">
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
                  <a className="hover:text-primary" href="/programs">
                    Programas
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary" href="/training">
                    Educación
                  </a>
                </li>
                <li>
                  <Link className="hover:text-primary" href="/blog">
                    Blog
                  </Link>
                </li>
                <li>
                  <a className="hover:text-primary" href="/about_us">
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-primary"
                    href="/participate#formulario"
                  >
                    Participación
                  </a>
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
                    rel="noreferrer"
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
