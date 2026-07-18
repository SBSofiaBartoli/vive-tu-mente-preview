"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApiClient, adminApiPatchClient } from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type {
  PaginatedTestimonialsResponse,
  Testimonial,
  TestimonialStatus,
} from "@/types/testimonial";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const roleLabels: Record<Testimonial["role"], string> = {
  participant: "Participante",
  professional: "Profesional",
  alliance: "Alianza",
  company: "Empresa",
  institution: "Institución",
  organization: "Organización",
};

const testimonialsPageSize = 10;

const statusLabels: Record<TestimonialStatus, string> = {
  pending: "Pendiente de revisión",
  approved: "Aprobado",
  rejected: "Rechazado",
};

type TestimonialStatusFilter = TestimonialStatus | "all";
type FeaturedFilter = "all" | "featured" | "not_featured";

export function TestimonialsPanel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: testimonialsPageSize,
    total: 0,
    total_pages: 1,
  });
  const [statusFilter, setStatusFilter] =
    useState<TestimonialStatusFilter>("pending");
  const [roleFilter, setRoleFilter] = useState<Testimonial["role"] | "all">(
    "all",
  );
  const [featuredFilter, setFeaturedFilter] = useState<FeaturedFilter>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [updatingTestimonialId, setUpdatingTestimonialId] = useState<
    string | null
  >(null);
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({});
  const [featuredSelections, setFeaturedSelections] = useState<
    Record<string, boolean>
  >({});
  const hasActiveFilters =
    statusFilter !== "all" ||
    roleFilter !== "all" ||
    featuredFilter !== "all" ||
    searchTerm.trim() !== "";

  const loadTestimonials = useCallback(async () => {
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
        limit: String(testimonialsPageSize),
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      if (roleFilter !== "all") {
        params.set("role", roleFilter);
      }

      if (featuredFilter === "featured") {
        params.set("is_featured", "true");
      }

      if (featuredFilter === "not_featured") {
        params.set("is_featured", "false");
      }

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      const testimonialsResponse =
        await adminApiClient<PaginatedTestimonialsResponse>(
          `/api/testimonials/admin?${params.toString()}`,
          {
            accessToken: data.session.access_token,
          },
        );

      setTestimonials(testimonialsResponse.items);
      setPaginationMeta(testimonialsResponse.meta);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los testimonios.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [featuredFilter, page, roleFilter, searchTerm, statusFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTestimonials();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadTestimonials]);

  const updateTestimonial = async (
    testimonialId: string,
    endpoint: "approve" | "reject",
  ) => {
    try {
      setUpdatingTestimonialId(testimonialId);
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
          ? { rejection_reason: rejectionReasons[testimonialId]?.trim() }
          : {};

      if (
        endpoint === "reject" &&
        !("rejection_reason" in body && body.rejection_reason)
      ) {
        setErrorMessage("Para rechazar un testimonio, indicá el motivo.");
        return;
      }

      await adminApiPatchClient<Testimonial, typeof body>(
        `/api/testimonials/admin/${testimonialId}/${endpoint}`,
        {
          accessToken: data.session.access_token,
          body,
        },
      );

      if (endpoint === "approve" && featuredSelections[testimonialId]) {
        await adminApiPatchClient<Testimonial, { is_featured: boolean }>(
          `/api/testimonials/admin/${testimonialId}/featured`,
          {
            accessToken: data.session.access_token,
            body: { is_featured: true },
          },
        );
      }

      void loadTestimonials();

      setSuccessMessage(
        endpoint === "approve"
          ? "El testimonio fue aprobado correctamente."
          : "El testimonio fue rechazado correctamente.",
      );

      setRejectionReasons((currentReasons) => {
        const nextReasons = { ...currentReasons };
        delete nextReasons[testimonialId];
        return nextReasons;
      });

      setFeaturedSelections((currentSelections) => {
        const nextSelections = { ...currentSelections };
        delete nextSelections[testimonialId];
        return nextSelections;
      });
    } catch {
      setErrorMessage("No se pudo actualizar el testimonio.");
    } finally {
      setUpdatingTestimonialId(null);
    }
  };

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
        <div className="grid gap-4 md:grid-cols-4">
          <label className="block">
            <span className="text-sm font-bold text-[#52708a]">Buscar</span>
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
              placeholder="Nombre, taller o comentario"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#52708a]">Estado</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as TestimonialStatusFilter);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#52708a]">Rol</span>
            <select
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(
                  event.target.value as Testimonial["role"] | "all",
                );
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
            >
              <option value="all">Todos</option>
              <option value="participant">Participante</option>
              <option value="professional">Profesional</option>
              <option value="alliance">Alianza</option>
              <option value="company">Empresa</option>
              <option value="institution">Institución</option>
              <option value="organization">Organización</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#52708a]">Destacado</span>
            <select
              value={featuredFilter}
              onChange={(event) => {
                setFeaturedFilter(event.target.value as FeaturedFilter);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
            >
              <option value="all">Todos</option>
              <option value="featured">Destacados</option>
              <option value="not_featured">No destacados</option>
            </select>
          </label>
        </div>
      </section>

      <div className="flex flex-col gap-2 rounded-lg border border-[#dcebea] bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-baseline gap-3">
          <p className="text-sm font-semibold text-[#52708a]">Testimonios</p>
          <p className="text-2xl font-bold text-[#071a2f]">
            {paginationMeta.total}
          </p>
        </div>

        <p className="text-sm text-[#52708a]">
          {isLoading
            ? "Actualizando resultados..."
            : `Mostrando ${testimonials.length} resultados en esta página.`}
        </p>
      </div>

      {!isLoading && testimonials.length === 0 ? (
        <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
          {hasActiveFilters
            ? "No hay testimonios para los filtros seleccionados."
            : "Todavía no hay testimonios cargados."}
        </div>
      ) : null}

      {testimonials.length > 0
        ? testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="rounded-lg border border-[#dcebea] bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#e8f7f7] px-3 py-1 text-xs font-bold text-[#168c91]">
                      {statusLabels[testimonial.status]}
                    </span>

                    <span className="text-xs font-semibold text-[#52708a]">
                      Recibido el {formatDate(testimonial.created_at)}
                    </span>
                  </div>

                  <h3 className="mt-2 truncate text-lg font-bold text-[#071a2f]">
                    {testimonial.full_name}
                  </h3>

                  <p className="mt-1 text-sm text-[#52708a]">
                    {roleLabels[testimonial.role]}
                    {testimonial.workshop_name
                      ? ` · Taller: ${testimonial.workshop_name}`
                      : ""}
                  </p>
                </div>
              </div>

              <details className="mt-4 rounded-lg border border-[#dcebea] bg-[#f7fbfb] p-4">
                <summary className="cursor-pointer text-sm font-bold text-[#071a2f]">
                  Ver comentario enviado
                </summary>
                <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#071a2f]">
                  {testimonial.comment}
                </p>
              </details>

              <details className="mt-4 rounded-lg border border-[#dcebea] bg-[#f7fbfb] p-4">
                <summary className="cursor-pointer text-sm font-bold text-[#071a2f]">
                  Revisión administrativa
                </summary>

                <label className="mt-4 block">
                  <span className="text-xs font-bold text-[#52708a]">
                    Motivo de rechazo
                  </span>
                  <textarea
                    value={rejectionReasons[testimonial.id] ?? ""}
                    onChange={(event) =>
                      setRejectionReasons((currentReasons) => ({
                        ...currentReasons,
                        [testimonial.id]: event.target.value,
                      }))
                    }
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-[#dcebea] bg-white px-3 py-2 text-sm text-[#071a2f] outline-none transition focus:border-[#39b8bb]"
                    placeholder="Explicá brevemente por qué se rechaza el testimonio."
                  />
                </label>

                {testimonial.status === "pending" ? (
                  <div className="mt-4 rounded-lg border border-[#dcebea] bg-white p-3">
                    <label className="flex items-center gap-2 text-sm font-semibold text-[#071a2f]">
                      <input
                        type="checkbox"
                        checked={featuredSelections[testimonial.id] ?? false}
                        onChange={(event) =>
                          setFeaturedSelections((currentSelections) => ({
                            ...currentSelections,
                            [testimonial.id]: event.target.checked,
                          }))
                        }
                        className="h-4 w-4 accent-[#39b8bb]"
                      />
                      Destacar al aprobar
                    </label>
                    <p className="mt-1 text-xs font-semibold text-[#52708a]">
                      Los testimonios destacados podrán mostrarse en secciones
                      principales del sitio.
                    </p>
                  </div>
                ) : null}

                {testimonial.status === "pending" ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={updatingTestimonialId === testimonial.id}
                      onClick={() =>
                        updateTestimonial(testimonial.id, "approve")
                      }
                      className="rounded-full bg-[#39b8bb] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:bg-[#5fd0d2] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Aprobar
                    </button>

                    <button
                      type="button"
                      disabled={updatingTestimonialId === testimonial.id}
                      onClick={() =>
                        updateTestimonial(testimonial.id, "reject")
                      }
                      className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Rechazar
                    </button>
                  </div>
                ) : (
                  <p className="mt-4 text-xs font-semibold text-[#52708a]">
                    Este testimonio no requiere acciones de revisión.
                  </p>
                )}
              </details>
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
