"use client";

import { useEffect, useState } from "react";
import { adminApiClient } from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type { PaginatedArticlesResponse } from "@/types/article";
import type {
  PaginatedEducationCardsResponse,
  PaginatedEducationTipsResponse,
} from "@/types/education";
import type { PaginatedFaqsResponse } from "@/types/faq";
import type { PaginatedMediaFilesResponse } from "@/types/media-file";
import type { PaginatedParticipationMessagesResponse } from "@/types/participation-message";
import type { PaginatedTestimonialsResponse } from "@/types/testimonial";
import type { PaginatedDonationReportsResponse } from "@/types/donation-report";

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
          unreadParticipationMessages,
          pendingArticles,
          pendingTestimonials,
          faqs,
          activeFaqs,
          educationCards,
          educationTips,
          mediaFiles,
          pendingMediaFiles,
          donationReports,
          pendingDonationReports,
        ] = await Promise.all([
          adminApiClient<PaginatedParticipationMessagesResponse>(
            "/api/participation/messages/admin?page=1&limit=1",
            { accessToken },
          ),
          adminApiClient<PaginatedParticipationMessagesResponse>(
            "/api/participation/messages/admin?page=1&limit=1&is_read=false",
            { accessToken },
          ),
          adminApiClient<PaginatedArticlesResponse>(
            "/api/articles/admin?page=1&limit=1&status=pending_review",
            { accessToken },
          ),
          adminApiClient<PaginatedTestimonialsResponse>(
            "/api/testimonials/admin?page=1&limit=1&status=pending",
            { accessToken },
          ),
          adminApiClient<PaginatedFaqsResponse>(
            "/api/faqs/admin?page=1&limit=1",
            {
              accessToken,
            },
          ),
          adminApiClient<PaginatedFaqsResponse>(
            "/api/faqs/admin?page=1&limit=1&is_active=true",
            { accessToken },
          ),
          adminApiClient<PaginatedEducationCardsResponse>(
            "/api/education-cards/admin?page=1&limit=1",
            { accessToken },
          ),
          adminApiClient<PaginatedEducationTipsResponse>(
            "/api/education-tips/admin?page=1&limit=1",
            { accessToken },
          ),
          adminApiClient<PaginatedMediaFilesResponse>(
            "/api/media-files/admin?page=1&limit=1",
            { accessToken },
          ),
          adminApiClient<PaginatedMediaFilesResponse>(
            "/api/media-files/admin?page=1&limit=1&status=pending",
            { accessToken },
          ),
          adminApiClient<PaginatedDonationReportsResponse>(
            "/api/donation-reports/admin?page=1&limit=1",
            { accessToken },
          ),
          adminApiClient<PaginatedDonationReportsResponse>(
            "/api/donation-reports/admin?page=1&limit=1&status=pending",
            { accessToken },
          ),
        ]);

        setSummaryCards([
          {
            label: "Mensajes",
            value: participationMessages.meta.total,
            detail: `${unreadParticipationMessages.meta.total} sin leer`,
          },
          {
            label: "Artículos pendientes",
            value: pendingArticles.meta.total,
            detail: "Propuestas esperando revisión",
          },
          {
            label: "Testimonios pendientes",
            value: pendingTestimonials.meta.total,
            detail: "Comentarios esperando aprobación",
          },
          {
            label: "FAQs",
            value: faqs.meta.total,
            detail: `${activeFaqs.meta.total} activas`,
          },
          {
            label: "Educación",
            value: educationCards.meta.total + educationTips.meta.total,
            detail: `${educationCards.meta.total} cards y ${educationTips.meta.total} tips`,
          },
          {
            label: "Archivos",
            value: mediaFiles.meta.total,
            detail: `${pendingMediaFiles.meta.total} pendientes`,
          },
          {
            label: "Donaciones",
            value: donationReports.meta.total,
            detail: `${pendingDonationReports.meta.total} pendientes`,
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
