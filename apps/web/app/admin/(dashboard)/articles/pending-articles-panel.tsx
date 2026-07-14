"use client";

import { useEffect, useState } from "react";
import { adminApiClient, adminApiPatchClient } from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type { Article } from "@/types/article";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

export function PendingArticlesPanel() {
  const [articles, setArticles] = useState<Article[]>([]);
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

  useEffect(() => {
    const loadPendingArticles = async () => {
      try {
        const supabaseClient = createSupabaseBrowserClient();
        const { data } = await supabaseClient.auth.getSession();

        if (!data.session) {
          setErrorMessage("No se encontró una sesión activa.");
          return;
        }

        const pendingArticles = await adminApiClient<Article[]>(
          "/api/articles/admin/pending",
          {
            accessToken: data.session.access_token,
          },
        );

        setArticles(pendingArticles);
      } catch {
        setErrorMessage("No se pudieron cargar las propuestas de artículos.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPendingArticles();
  }, []);

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

      setArticles((currentArticles) =>
        currentArticles.filter((article) => article.id !== articleId),
      );

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

  if (articles.length === 0) {
    return (
      <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
        No hay propuestas pendientes de revisión.
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

      {articles.map((article) => (
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
              Pendiente de revisión
            </span>
          </div>

          {article.excerpt ? (
            <p className="mt-4 text-sm leading-6 text-[#071a2f]">
              {article.excerpt}
            </p>
          ) : null}

          <p className="mt-4 line-clamp-4 whitespace-pre-line text-sm leading-6 text-[#52708a]">
            {article.content}
          </p>

          <p className="mt-4 text-xs font-semibold text-[#52708a]">
            Recibido el {formatDate(article.created_at)}
          </p>

          <label className="mt-4 block">
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
              onClick={() => updateArticle(article.id, "request-changes")}
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
        </article>
      ))}
    </div>
  );
}
