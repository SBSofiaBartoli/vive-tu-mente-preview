"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApiClient, adminApiPatchClient } from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type {
  DonationReport,
  DonationReportStatus,
  PaginatedDonationReportsResponse,
  UpdateDonationReportStatusPayload,
} from "@/types/donation-report";

const donationReportsPageSize = 10;

type DonationReportStatusFilter = DonationReportStatus | "all";

const statusLabels: Record<DonationReportStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  rejected: "Rechazado",
  archived: "Archivado",
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const formatAmount = (amount: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount);

export function DonationReportsPanel() {
  const [reports, setReports] = useState<DonationReport[]>([]);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: donationReportsPageSize,
    total: 0,
    total_pages: 1,
  });
  const [statusFilter, setStatusFilter] =
    useState<DonationReportStatusFilter>("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const hasActiveFilters = statusFilter !== "all" || searchTerm.trim() !== "";

  const loadReports = useCallback(async () => {
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
        limit: String(donationReportsPageSize),
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      const donationReportsResponse =
        await adminApiClient<PaginatedDonationReportsResponse>(
          `/api/donation-reports/admin?${params.toString()}`,
          {
            accessToken: data.session.access_token,
          },
        );

      setReports(donationReportsResponse.items);
      setPaginationMeta(donationReportsResponse.meta);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los informes de donación.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, statusFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadReports();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadReports]);

  const updateReportStatus = async (
    report: DonationReport,
    status: DonationReportStatus,
  ) => {
    try {
      setUpdatingReportId(report.id);
      setErrorMessage("");
      setSuccessMessage("");

      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      const body: UpdateDonationReportStatusPayload = {
        status,
        review_notes: reviewNotes[report.id]?.trim() || null,
        rejection_reason:
          status === "rejected"
            ? rejectionReasons[report.id]?.trim() || null
            : null,
      };

      if (status === "rejected" && !body.rejection_reason) {
        setErrorMessage("Para rechazar un informe, indicá el motivo.");
        return;
      }

      const updatedReport = await adminApiPatchClient<
        DonationReport,
        UpdateDonationReportStatusPayload
      >(`/api/donation-reports/admin/${report.id}/status`, {
        accessToken: data.session.access_token,
        body,
      });

      setReports((currentReports) =>
        currentReports.map((currentReport) =>
          currentReport.id === report.id ? updatedReport : currentReport,
        ),
      );

      void loadReports();
      setSuccessMessage(`El informe quedó en estado: ${statusLabels[status]}.`);
    } catch {
      setErrorMessage("No se pudo actualizar el informe de donación.");
    } finally {
      setUpdatingReportId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-3xl font-bold text-[#071a2f]">Donaciones</h2>
        <p className="mt-2 max-w-2xl text-[#52708a]">
          Revisión de informes de donación enviados desde el sitio público.
        </p>
      </div>

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
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-bold text-[#52708a]">Buscar</span>
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
              placeholder="Nombre o email"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#52708a]">Estado</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value as DonationReportStatusFilter,
                );
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="confirmed">Confirmado</option>
              <option value="rejected">Rechazado</option>
              <option value="archived">Archivado</option>
            </select>
          </label>
        </div>
      </section>

      <div className="flex flex-col gap-2 rounded-lg border border-[#dcebea] bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-baseline gap-3">
          <p className="text-sm font-semibold text-[#52708a]">Informes</p>
          <p className="text-2xl font-bold text-[#071a2f]">
            {paginationMeta.total}
          </p>
        </div>

        <p className="text-sm text-[#52708a]">
          {isLoading
            ? "Actualizando resultados..."
            : `Mostrando ${reports.length} resultados en esta página.`}
        </p>
      </div>

      {!isLoading && reports.length === 0 ? (
        <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
          {hasActiveFilters
            ? "No hay informes para los filtros seleccionados."
            : "Todavía no hay informes de donación."}
        </div>
      ) : null}

      {reports.map((report) => (
        <article
          key={report.id}
          className="rounded-lg border border-[#dcebea] bg-white p-4 shadow-sm"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    report.status === "confirmed"
                      ? "rounded-full bg-[#e8f7f7] px-3 py-1 text-xs font-bold text-[#168c91]"
                      : "rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-bold text-[#52708a]"
                  }
                >
                  {statusLabels[report.status]}
                </span>

                <p className="text-xs font-semibold text-[#52708a]">
                  Recibido el {formatDate(report.created_at)}
                </p>
              </div>

              <h3 className="mt-2 text-base font-bold text-[#071a2f]">
                {report.donor_name}
              </h3>

              <p className="mt-1 text-sm text-[#52708a]">
                {report.donor_email} · {formatAmount(report.amount)}
              </p>
            </div>

            {report.receipt_media_file?.public_url ? (
              <a
                href={report.receipt_media_file.public_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91]"
              >
                Ver comprobante
              </a>
            ) : (
              <p className="text-xs font-semibold text-[#52708a]">
                Sin enlace de comprobante
              </p>
            )}
          </div>

          <details className="mt-4 rounded-lg border border-[#dcebea] bg-[#f7fbfb] p-4">
            <summary className="cursor-pointer text-sm font-bold text-[#071a2f]">
              Revisión administrativa
            </summary>

            <label className="mt-4 block">
              <span className="text-xs font-bold text-[#52708a]">
                Observaciones internas
              </span>
              <textarea
                value={reviewNotes[report.id] ?? ""}
                onChange={(event) =>
                  setReviewNotes((currentNotes) => ({
                    ...currentNotes,
                    [report.id]: event.target.value,
                  }))
                }
                rows={3}
                className="mt-2 w-full rounded-lg border border-[#dcebea] bg-white px-3 py-2 text-sm text-[#071a2f] outline-none transition focus:border-[#39b8bb]"
                placeholder="Agregá una nota interna sobre la revisión del informe."
              />
            </label>

            <label className="mt-4 block">
              <span className="text-xs font-bold text-[#52708a]">
                Motivo de rechazo
              </span>
              <textarea
                value={rejectionReasons[report.id] ?? ""}
                onChange={(event) =>
                  setRejectionReasons((currentReasons) => ({
                    ...currentReasons,
                    [report.id]: event.target.value,
                  }))
                }
                rows={3}
                className="mt-2 w-full rounded-lg border border-[#dcebea] bg-white px-3 py-2 text-sm text-[#071a2f] outline-none transition focus:border-[#39b8bb]"
                placeholder="Explicá brevemente por qué se rechaza el informe."
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              {report.status !== "confirmed" && report.status !== "archived" ? (
                <button
                  type="button"
                  disabled={updatingReportId === report.id}
                  onClick={() => updateReportStatus(report, "confirmed")}
                  className="rounded-full bg-[#39b8bb] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:bg-[#5fd0d2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Confirmar
                </button>
              ) : null}

              {report.status !== "rejected" && report.status !== "archived" ? (
                <button
                  type="button"
                  disabled={updatingReportId === report.id}
                  onClick={() => updateReportStatus(report, "rejected")}
                  className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Rechazar
                </button>
              ) : null}

              {report.status !== "archived" ? (
                <button
                  type="button"
                  disabled={updatingReportId === report.id}
                  onClick={() => updateReportStatus(report, "archived")}
                  className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#52708a] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Archivar
                </button>
              ) : (
                <p className="text-xs font-semibold text-[#52708a]">
                  Este informe está archivado.
                </p>
              )}
            </div>
          </details>
        </article>
      ))}

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
