"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  apiFormDataPostClient,
  apiGetClient,
  apiPostClient,
} from "@/lib/api-client";
import type { Article } from "@/types/article";

const getArticleDescription = (article: Article) => {
  if (article.excerpt) {
    return article.excerpt;
  }

  return article.content.length > 160
    ? `${article.content.slice(0, 160)}...`
    : article.content;
};

type ArticleProposalForm = {
  title: string;
  excerpt: string;
  content: string;
  author_name: string;
  category: string;
  submitted_by_name: string;
  submitted_by_email: string;
};

type CreateArticleProposalPayload = ArticleProposalForm & {
  cover_image_url?: string | null;
  cover_image_alt?: string | null;
};

type UploadFileResponse = {
  original_name: string;
  storage_path: string;
  public_url: string;
  mime_type: string;
  file_size: number;
};

type CreateMediaFilePayload = UploadFileResponse & {
  section: string;
  uploaded_by_name: string;
  uploaded_by_email: string;
};

type MediaFile = {
  id: string;
};

const initialArticleProposalForm: ArticleProposalForm = {
  title: "",
  excerpt: "",
  content: "",
  author_name: "",
  category: "",
  submitted_by_name: "",
  submitted_by_email: "",
};

export default function BlogPage() {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [publishedArticles, setPublishedArticles] = useState<Article[]>([]);
  const [isLoadingArticles, setIsLoadingArticles] = useState(true);
  const [articlesError, setArticlesError] = useState<string | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [proposalForm, setProposalForm] = useState<ArticleProposalForm>(
    initialArticleProposalForm,
  );
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalSuccess, setProposalSuccess] = useState<string | null>(null);
  const [proposalSubmitError, setProposalSubmitError] = useState<string | null>(
    null,
  );
  const [proposalImage, setProposalImage] = useState<File | null>(null);

  useEffect(() => {
    const loadArticles = async () => {
      try {
        const articlesResponse = await apiGetClient<Article[]>("/api/articles");

        setPublishedArticles(articlesResponse);
        setArticlesError(null);
      } catch {
        setArticlesError("No se pudieron cargar los artículos publicados.");
      } finally {
        setIsLoadingArticles(false);
      }
    };

    void loadArticles();
  }, []);

  const handleSubmitArticleProposal = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setIsSubmittingProposal(true);

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxImageSize = 2 * 1024 * 1024;

    if (proposalImage && !allowedImageTypes.includes(proposalImage.type)) {
      setProposalSuccess(null);
      setProposalSubmitError("La imagen debe ser JPG, PNG o WebP.");
      setIsSubmittingProposal(false);
      return;
    }

    if (proposalImage && proposalImage.size > maxImageSize) {
      setProposalSuccess(null);
      setProposalSubmitError("La imagen no puede superar los 2 MB.");
      setIsSubmittingProposal(false);
      return;
    }

    try {
      let uploadedImage: UploadFileResponse | null = null;

      if (proposalImage) {
        const imageFormData = new FormData();
        imageFormData.append("file", proposalImage);

        uploadedImage = await apiFormDataPostClient<UploadFileResponse>(
          "/api/storage/upload?section=article-proposals",
          imageFormData,
        );

        await apiPostClient<MediaFile, CreateMediaFilePayload>(
          "/api/media-files",
          {
            ...uploadedImage,
            section: "article-proposals",
            uploaded_by_name: proposalForm.submitted_by_name,
            uploaded_by_email: proposalForm.submitted_by_email,
          },
        );
      }

      await apiPostClient<Article, CreateArticleProposalPayload>(
        "/api/articles/proposals",
        {
          ...proposalForm,
          cover_image_url: uploadedImage?.public_url ?? null,
          cover_image_alt: uploadedImage
            ? `Imagen sugerida para ${proposalForm.title}`
            : null,
        },
      );

      setProposalForm(initialArticleProposalForm);
      setProposalImage(null);
      setProposalSubmitError(null);
      setProposalSuccess(
        "Gracias por enviar tu propuesta. El artículo quedó pendiente de revisión.",
      );
      window.setTimeout(() => {
        setIsProposalModalOpen(false);
        setProposalSuccess(null);
      }, 1600);
    } catch {
      setProposalSuccess(null);
      setProposalSubmitError(
        "No se pudo enviar la propuesta. Revisá los datos e intentá nuevamente.",
      );
    } finally {
      setIsSubmittingProposal(false);
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
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="inline-block rounded-full bg-primary/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
                  Blog de bienestar
                </span>

                <h1 className="mt-6 text-4xl font-bold tracking-[-0.07em] text-slate-900 lg:text-6xl">
                  Ideas prácticas para cuidar tu{" "}
                  <span className="text-primary">mente</span> y construir
                  oportunidades
                </h1>

                <p className="mt-6 text-lg leading-relaxed text-slate-600">
                  Artículos breves para acompañar procesos de bienestar
                  emocional, aprendizaje, productividad, propósito y desarrollo
                  personal.
                </p>
              </div>

              <button
                type="button"
                className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-xl"
                onClick={() => {
                  setProposalSuccess(null);
                  setProposalSubmitError(null);
                  setIsProposalModalOpen(true);
                }}
              >
                Proponer artículo
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: "18px" }}
                >
                  edit_note
                </span>
              </button>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {isLoadingArticles ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm md:col-span-3">
                  Cargando artículos...
                </div>
              ) : articlesError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-6 font-semibold text-red-700 md:col-span-3">
                  {articlesError}
                </div>
              ) : publishedArticles.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm md:col-span-3">
                  Todavía no hay artículos publicados.
                </div>
              ) : (
                publishedArticles.map((article) => (
                  <Link
                    key={article.id}
                    href={`/blog/${article.slug}`}
                    className="block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
                  >
                    <Image
                      className="h-48 w-full object-cover"
                      src={
                        article.cover_image_url ??
                        "/images/students-studying.jpg"
                      }
                      alt={article.cover_image_alt ?? article.title}
                      width={640}
                      height={360}
                    />

                    <div className="p-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {article.category ?? "Bienestar"}
                      </span>

                      <h2 className="mt-4 text-2xl font-bold text-slate-900">
                        {article.title}
                      </h2>

                      <p className="mt-4 leading-relaxed text-slate-600">
                        {getArticleDescription(article)}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>

        <section className="px-6 pb-24 lg:px-20">
          <div className="mx-auto max-w-7xl rounded-2xl bg-primary p-8 text-background-dark md:p-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-2xl">
                <h2 className="mb-3 text-3xl font-extrabold tracking-[-0.03em]">
                  ¿Querés participar o proponer un tema?
                </h2>
                <p className="text-background-dark/80">
                  Si tenés una idea, querés colaborar o necesitás orientación
                  sobre un programa, podés escribirnos desde el formulario.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-background-dark px-6 py-3 font-bold text-white transition-opacity hover:opacity-90"
                  onClick={() => {
                    setProposalSuccess(null);
                    setProposalSubmitError(null);
                    setIsProposalModalOpen(true);
                  }}
                >
                  Proponer artículo
                  <span className="material-symbols-outlined text-lg">
                    edit_note
                  </span>
                </button>

                <Link
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-background-dark transition-opacity hover:opacity-90"
                  href="/participate#formulario"
                >
                  Contactar
                  <span className="material-symbols-outlined text-lg">
                    arrow_forward
                  </span>
                </Link>
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

      {isProposalModalOpen ? (
        <div className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-slate-950/50 px-4 py-6 sm:py-8">
          <div className="w-full max-w-3xl rounded-2xl border-t-4 border-primary bg-white p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold tracking-[-0.03em] text-slate-900">
                  Proponer artículo
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Compartí una propuesta para el blog. El equipo la revisará
                  antes de publicarla.
                </p>
              </div>

              <button
                type="button"
                aria-label="Cerrar formulario"
                className="text-2xl leading-none text-slate-400 transition-colors hover:text-primary"
                onClick={() => setIsProposalModalOpen(false)}
              >
                ×
              </button>
            </div>

            {proposalSuccess ? (
              <div
                className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-700 shadow-sm"
                role="status"
                aria-live="polite"
              >
                {proposalSuccess}
              </div>
            ) : null}

            {proposalSubmitError ? (
              <div
                className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700 shadow-sm"
                role="alert"
              >
                {proposalSubmitError}
              </div>
            ) : null}

            <form className="space-y-6" onSubmit={handleSubmitArticleProposal}>
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Título del artículo
                </label>
                <input
                  required
                  minLength={4}
                  className="w-full rounded-xl border border-slate-200 bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
                  value={proposalForm.title}
                  onChange={(event) =>
                    setProposalForm((currentForm) => ({
                      ...currentForm,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Ej. Cómo acompañar la ansiedad académica"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Bajada o resumen breve
                </label>
                <textarea
                  className="min-h-24 w-full rounded-xl border border-slate-200 bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
                  value={proposalForm.excerpt}
                  onChange={(event) =>
                    setProposalForm((currentForm) => ({
                      ...currentForm,
                      excerpt: event.target.value,
                    }))
                  }
                  placeholder="Contá en pocas líneas de qué trata la propuesta."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Contenido o desarrollo
                </label>
                <textarea
                  required
                  minLength={50}
                  className="min-h-40 w-full rounded-xl border border-slate-200 bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
                  value={proposalForm.content}
                  onChange={(event) =>
                    setProposalForm((currentForm) => ({
                      ...currentForm,
                      content: event.target.value,
                    }))
                  }
                  placeholder="Escribí el contenido completo o una propuesta desarrollada."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Imagen sugerida
                </label>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="w-full rounded-xl border border-dashed border-primary/30 bg-primary/5 px-4 py-4 text-sm text-slate-600 outline-none transition-colors file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:font-bold file:text-background-dark hover:border-primary"
                  onChange={(event) =>
                    setProposalImage(event.target.files?.[0] ?? null)
                  }
                />

                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  Opcional. Solo JPG, PNG o WebP. Máximo 2 MB. La imagen será
                  revisada antes de usarse en el blog.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Autor visible
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
                    value={proposalForm.author_name}
                    onChange={(event) =>
                      setProposalForm((currentForm) => ({
                        ...currentForm,
                        author_name: event.target.value,
                      }))
                    }
                    placeholder="Nombre que podría mostrarse en el blog"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Categoría
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-200 bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
                    value={proposalForm.category}
                    onChange={(event) =>
                      setProposalForm((currentForm) => ({
                        ...currentForm,
                        category: event.target.value,
                      }))
                    }
                    placeholder="bienestar, educación, propósito..."
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Tu nombre
                  </label>
                  <input
                    required
                    minLength={2}
                    className="w-full rounded-xl border border-slate-200 bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
                    value={proposalForm.submitted_by_name}
                    onChange={(event) =>
                      setProposalForm((currentForm) => ({
                        ...currentForm,
                        submitted_by_name: event.target.value,
                      }))
                    }
                    placeholder="Nombre y apellido"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Email de contacto
                  </label>
                  <input
                    required
                    type="email"
                    className="w-full rounded-xl border border-slate-200 bg-background px-4 py-3 outline-none transition-colors focus:border-primary"
                    value={proposalForm.submitted_by_email}
                    onChange={(event) =>
                      setProposalForm((currentForm) => ({
                        ...currentForm,
                        submitted_by_email: event.target.value,
                      }))
                    }
                    placeholder="nombre@correo.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  className="rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 transition-colors hover:border-primary hover:text-primary"
                  onClick={() => {
                    setProposalImage(null);
                    setIsProposalModalOpen(false);
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmittingProposal}
                  className="rounded-xl bg-primary px-5 py-3 font-bold text-background-dark shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingProposal ? "Enviando..." : "Enviar propuesta"}
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
