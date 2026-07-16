"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApiClient, adminApiPatchClient } from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type {
  Article,
  ArticleStatus,
  PaginatedArticlesResponse,
} from "@/types/article";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const articlesPageSize = 10;

const statusLabels: Record<ArticleStatus, string> = {
  draft: "Borrador",
  pending_review: "Pendiente de revisión",
  changes_requested: "Cambios solicitados",
  published: "Publicado",
  rejected: "Rechazado",
  archived: "Archivado",
};

type ArticleStatusFilter = ArticleStatus | "all";

export function PendingArticlesPanel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: articlesPageSize,
    total: 0,
    total_pages: 1,
  });
  const [statusFilter, setStatusFilter] =
    useState<ArticleStatusFilter>("pending_review");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingArticleId, setUpdatingArticleId] = useState<string | null>(
    null,
  );
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({});
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const loadArticles = useCallback(async () => {
    try {
      setIsLoading(true);
      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      const params = new URLSearchParams({
        page: String(page),
        limit: String(articlesPageSize),
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      if (categoryFilter.trim()) {
        params.set("category", categoryFilter.trim());
      }

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      const articlesResponse = await adminApiClient<PaginatedArticlesResponse>(
        `/api/articles/admin?${params.toString()}`,
        {
          accessToken: data.session.access_token,
        },
      );

      setArticles(articlesResponse.items);
      setPaginationMeta(articlesResponse.meta);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las propuestas de artículos.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, page, searchTerm, statusFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadArticles();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadArticles]);

  const updateArticle = async (
    articleId: string,
    endpoint: "publish" | "reject" | "request-changes",
  ) => {
    try {
      setUpdatingArticleId(articleId);
      setErrorMessage("");
      setSuccessMessage("");

      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      const body =
        endpoint === "reject"
          ? { rejection_reason: rejectionReasons[articleId]?.trim() }
          : endpoint === "request-changes"
            ? { review_notes: reviewNotes[articleId]?.trim() }
            : {};

      if (
        endpoint === "reject" &&
        !("rejection_reason" in body && body.rejection_reason)
      ) {
        setErrorMessage("Para rechazar una propuesta, indicá el motivo.");
        return;
      }

      if (
        endpoint === "request-changes" &&
        !("review_notes" in body && body.review_notes)
      ) {
        setErrorMessage("Para solicitar cambios, indicá las observaciones.");
        return;
      }

      await adminApiPatchClient<Article, typeof body>(
        `/api/articles/admin/${articleId}/${endpoint}`,
        {
          accessToken: data.session.access_token,
          body,
        },
      );

      void loadArticles();

      setSuccessMessage(
        endpoint === "publish"
          ? "La propuesta fue publicada correctamente."
          : endpoint === "reject"
            ? "La propuesta fue rechazada correctamente."
            : "La solicitud de cambios fue registrada correctamente.",
      );

      setRejectionReasons((currentReasons) => {
        const nextReasons = { ...currentReasons };
        delete nextReasons[articleId];
        return nextReasons;
      });

      setReviewNotes((currentNotes) => {
        const nextNotes = { ...currentNotes };
        delete nextNotes[articleId];
        return nextNotes;
      });
    } catch {
      setErrorMessage("No se pudo actualizar la propuesta.");
    } finally {
      setUpdatingArticleId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
        Cargando propuestas...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <div className="rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {errorMessage}
        </div>
      ) : null}

      {successMessage ? (
        <div className="rounded-lg border border-[#cbeee8] bg-[#eefafa] p-4 text-sm font-semibold text-[#168c91]">
          {successMessage}
        </div>
      ) : null}

      <section className="rounded-lg border border-[#dcebea] bg-white p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="text-sm font-bold text-[#52708a]">Buscar</span>
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
              placeholder="Título, bajada o contenido"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#52708a]">Estado</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as ArticleStatusFilter);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
            >
              <option value="all">Todos</option>
              <option value="pending_review">Pendiente de revisión</option>
              <option value="changes_requested">Cambios solicitados</option>
              <option value="published">Publicado</option>
              <option value="rejected">Rechazado</option>
              <option value="archived">Archivado</option>
              <option value="draft">Borrador</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#52708a]">Categoría</span>
            <input
              value={categoryFilter}
              onChange={(event) => {
                setCategoryFilter(event.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
              placeholder="bienestar, educación..."
            />
          </label>
        </div>
      </section>

      <div className="rounded-lg border border-[#dcebea] bg-white p-4">
        <p className="text-sm font-semibold text-[#52708a]">Artículos</p>
        <p className="mt-1 text-3xl font-bold text-[#071a2f]">
          {paginationMeta.total}
        </p>
        <p className="mt-1 text-sm text-[#52708a]">
          Mostrando {articles.length} resultados en esta página.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
          No hay artículos para los filtros seleccionados.
        </div>
      ) : null}

      {articles.length > 0
        ? articles.map((article) => (
            <article
              key={article.id}
              className="rounded-lg border border-[#dcebea] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#071a2f]">
                    {article.title}
                  </h3>

                  <p className="mt-1 text-sm text-[#52708a]">
                    Enviado por {article.submitted_by_name ?? "Sin nombre"}
                  </p>

                  {article.submitted_by_email ? (
                    <p className="mt-1 text-sm text-[#52708a]">
                      {article.submitted_by_email}
                    </p>
                  ) : null}
                </div>

                <span className="rounded-full bg-[#e8f7f7] px-3 py-1 text-xs font-bold text-[#168c91]">
                  {statusLabels[article.status]}
                </span>
              </div>

              {article.excerpt ? (
                <p className="mt-4 text-sm leading-6 text-[#071a2f]">
                  {article.excerpt}
                </p>
              ) : null}

              <details className="mt-4 rounded-lg border border-[#dcebea] bg-[#f7fbfb] p-4">
                <summary className="cursor-pointer text-sm font-bold text-[#071a2f]">
                  Ver contenido enviado
                </summary>
                <p className="mt-4 line-clamp-4 whitespace-pre-line text-sm leading-6 text-[#52708a]">
                  {article.content}
                </p>
              </details>

              <p className="mt-4 text-xs font-semibold text-[#52708a]">
                Recibido el {formatDate(article.created_at)}
              </p>

              <div className="mt-5 rounded-lg border border-[#dcebea] bg-[#f7fbfb] p-4">
                <p className="text-sm font-bold text-[#071a2f]">
                  Revisión administrativa
                </p>
                <p className="mt-1 text-xs font-semibold text-[#52708a]">
                  Contacto para devolución:{" "}
                  {article.submitted_by_email ?? "No informado"}
                </p>
                <label className="mt-3 block">
                  <span className="text-xs font-bold text-[#52708a]">
                    Motivo de rechazo
                  </span>
                  <textarea
                    value={rejectionReasons[article.id] ?? ""}
                    onChange={(event) =>
                      setRejectionReasons((currentReasons) => ({
                        ...currentReasons,
                        [article.id]: event.target.value,
                      }))
                    }
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-[#dcebea] bg-white px-3 py-2 text-sm text-[#071a2f] outline-none transition focus:border-[#39b8bb]"
                    placeholder="Explicá brevemente por qué se rechaza la propuesta."
                  />
                </label>

                <label className="mt-4 block">
                  <span className="text-xs font-bold text-[#52708a]">
                    Observaciones para solicitar cambios
                  </span>
                  <textarea
                    value={reviewNotes[article.id] ?? ""}
                    onChange={(event) =>
                      setReviewNotes((currentNotes) => ({
                        ...currentNotes,
                        [article.id]: event.target.value,
                      }))
                    }
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-[#dcebea] bg-white px-3 py-2 text-sm text-[#071a2f] outline-none transition focus:border-[#39b8bb]"
                    placeholder="Indicá qué cambios debería realizar la persona autora."
                  />
                </label>

                {article.status === "pending_review" ||
                article.status === "changes_requested" ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={updatingArticleId === article.id}
                      onClick={() => updateArticle(article.id, "publish")}
                      className="rounded-full bg-[#39b8bb] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:bg-[#5fd0d2] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Publicar
                    </button>

                    <button
                      type="button"
                      disabled={updatingArticleId === article.id}
                      onClick={() =>
                        updateArticle(article.id, "request-changes")
                      }
                      className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Solicitar cambios
                    </button>

                    <button
                      type="button"
                      disabled={updatingArticleId === article.id}
                      onClick={() => updateArticle(article.id, "reject")}
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Rechazar
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-xs font-semibold text-[#52708a]">
                    Este artículo no requiere acciones de revisión.
                  </p>
                )}
              </div>
            </article>
          ))
        : null}
      {paginationMeta.total_pages > 1 ? (
        <div className="flex items-center justify-between rounded-lg border border-[#dcebea] bg-white p-4">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() =>
              setPage((currentPage) => Math.max(1, currentPage - 1))
            }
            className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Anterior
          </button>

          <p className="text-sm font-semibold text-[#52708a]">
            Página {paginationMeta.page} de {paginationMeta.total_pages}
          </p>

          <button
            type="button"
            disabled={page >= paginationMeta.total_pages}
            onClick={() =>
              setPage((currentPage) =>
                Math.min(paginationMeta.total_pages, currentPage + 1),
              )
            }
            className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      ) : null}
    </div>
  );
}
