"use client";

import { useEffect, useState } from "react";
import { adminApiClient } from "@/lib/api-client";
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

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
        Cargando propuestas...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700">
        {errorMessage}
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
        </article>
      ))}
    </div>
  );
}
