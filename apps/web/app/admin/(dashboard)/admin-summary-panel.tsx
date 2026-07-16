"use client";

import { useEffect, useState } from "react";
import { adminApiClient } from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type { Article } from "@/types/article";
import type { EducationCard, EducationTip } from "@/types/education";
import type { Faq } from "@/types/faq";
import type { MediaFile } from "@/types/media-file";
import type { ParticipationMessage } from "@/types/participation-message";
import type { Testimonial } from "@/types/testimonial";

type SummaryCard = {
  label: string;
  value: number;
  detail: string;
};

export function AdminSummaryPanel() {
  const [summaryCards, setSummaryCards] = useState<SummaryCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const supabaseClient = createSupabaseBrowserClient();
        const { data } = await supabaseClient.auth.getSession();

        if (!data.session) {
          setErrorMessage("No se encontró una sesión activa.");
          return;
        }

        const accessToken = data.session.access_token;

        const [
          participationMessages,
          pendingArticles,
          pendingTestimonials,
          faqs,
          educationCards,
          educationTips,
          mediaFiles,
        ] = await Promise.all([
          adminApiClient<ParticipationMessage[]>(
            "/api/participation/messages/admin",
            { accessToken },
          ),
          adminApiClient<Article[]>("/api/articles/admin/pending", {
            accessToken,
          }),
          adminApiClient<Testimonial[]>("/api/testimonials/admin/pending", {
            accessToken,
          }),
          adminApiClient<Faq[]>("/api/faqs/admin", { accessToken }),
          adminApiClient<EducationCard[]>("/api/education-cards/admin", {
            accessToken,
          }),
          adminApiClient<EducationTip[]>("/api/education-tips/admin", {
            accessToken,
          }),
          adminApiClient<MediaFile[]>("/api/media-files/admin", {
            accessToken,
          }),
        ]);

        setSummaryCards([
          {
            label: "Mensajes",
            value: participationMessages.length,
            detail: `${participationMessages.filter((message) => !message.is_read).length} sin leer`,
          },
          {
            label: "Artículos pendientes",
            value: pendingArticles.length,
            detail: "Propuestas esperando revisión",
          },
          {
            label: "Testimonios pendientes",
            value: pendingTestimonials.length,
            detail: "Comentarios esperando aprobación",
          },
          {
            label: "FAQs",
            value: faqs.length,
            detail: `${faqs.filter((faq) => faq.is_active).length} activas`,
          },
          {
            label: "Educación",
            value: educationCards.length + educationTips.length,
            detail: `${educationCards.length} cards y ${educationTips.length} tips`,
          },
          {
            label: "Archivos",
            value: mediaFiles.length,
            detail: `${mediaFiles.filter((file) => file.status === "pending").length} pendientes`,
          },
        ]);
      } catch {
        setErrorMessage("No se pudo cargar el resumen del dashboard.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadSummary();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
        Cargando resumen...
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

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {summaryCards.map((card) => (
        <article
          key={card.label}
          className="rounded-lg border border-[#dcebea] bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-semibold text-[#52708a]">{card.label}</p>
          <p className="mt-2 text-4xl font-bold text-[#071a2f]">{card.value}</p>
          <p className="mt-2 text-sm font-semibold text-[#168c91]">
            {card.detail}
          </p>
        </article>
      ))}
    </div>
  );
}
