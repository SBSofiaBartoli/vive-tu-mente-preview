"use client";

import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { apiGetClient } from "@/lib/api-client";
import type { Article } from "@/types/article";

type BlogArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const formatDate = (date: string | null) => {
  if (!date) {
    return "Sin fecha de publicación";
  }

  return new Intl.DateTimeFormat("es-CL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
};

export default function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { slug } = use(params);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [article, setArticle] = useState<Article | null>(null);
  const [isLoadingArticle, setIsLoadingArticle] = useState(true);
  const [articleError, setArticleError] = useState<string | null>(null);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        const articleResponse = await apiGetClient<Article>(
          `/api/articles/${slug}`,
        );

        setArticle(articleResponse);
        setArticleError(null);
      } catch {
        setArticleError("No se pudo cargar el artículo publicado.");
      } finally {
        setIsLoadingArticle(false);
      }
    };

    void loadArticle();
  }, [slug]);

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
              <Link className="text-sm font-bold text-primary" href="/training">
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
        <section className="px-6 py-16 lg:px-20 lg:py-24">
          <article className="mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-primary transition-opacity hover:opacity-80"
            >
              <span className="material-symbols-outlined text-lg">
                arrow_back
              </span>
              Volver al Blog
            </Link>

            {isLoadingArticle ? (
              <div className="rounded-xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
                Cargando artículo...
              </div>
            ) : articleError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-8 font-semibold text-red-700">
                {articleError}
              </div>
            ) : article ? (
              <>
                <div className="mb-8">
                  <span className="inline-block rounded-full bg-primary/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                    {article.category ?? "Bienestar"}
                  </span>

                  <h1 className="mt-6 text-4xl font-bold tracking-[-0.05em] text-slate-900 lg:text-6xl">
                    {article.title}
                  </h1>

                  <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
                    <span>
                      {article.author_name ?? "Fundación Vive Tu Mente"}
                    </span>
                    <span>·</span>
                    <span>{formatDate(article.published_at)}</span>
                  </div>

                  {article.excerpt ? (
                    <p className="mt-6 text-xl leading-relaxed text-slate-600">
                      {article.excerpt}
                    </p>
                  ) : null}
                </div>

                <Image
                  src={
                    article.cover_image_url ?? "/images/students-studying.jpg"
                  }
                  alt={article.cover_image_alt ?? article.title}
                  width={1200}
                  height={675}
                  className="mb-10 h-auto w-full rounded-2xl object-cover shadow-xl shadow-primary/5"
                  priority
                />

                <div className="prose prose-slate max-w-none text-lg leading-relaxed prose-p:text-slate-600">
                  {article.content
                    .split("\n")
                    .map((paragraph) =>
                      paragraph.trim() ? (
                        <p key={paragraph}>{paragraph}</p>
                      ) : null,
                    )}
                </div>
              </>
            ) : null}
          </article>
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
