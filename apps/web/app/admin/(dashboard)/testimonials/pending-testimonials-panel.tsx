"use client";

import { useEffect, useState } from "react";
import { adminApiClient, adminApiPatchClient } from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type { Testimonial } from "@/types/testimonial";

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

export function PendingTestimonialsPanel() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
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

  useEffect(() => {
    const loadPendingTestimonials = async () => {
      try {
        const supabaseClient = createSupabaseBrowserClient();
        const { data } = await supabaseClient.auth.getSession();

        if (!data.session) {
          setErrorMessage("No se encontró una sesión activa.");
          return;
        }

        const pendingTestimonials = await adminApiClient<Testimonial[]>(
          "/api/testimonials/admin/pending",
          {
            accessToken: data.session.access_token,
          },
        );

        setTestimonials(pendingTestimonials);
      } catch {
        setErrorMessage("No se pudieron cargar los testimonios pendientes.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadPendingTestimonials();
  }, []);

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

      setTestimonials((currentTestimonials) =>
        currentTestimonials.filter(
          (testimonial) => testimonial.id !== testimonialId,
        ),
      );

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

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
        Cargando testimonios...
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

      <div className="rounded-lg border border-[#dcebea] bg-white p-4">
        <p className="text-sm font-semibold text-[#52708a]">
          Testimonios pendientes
        </p>
        <p className="mt-1 text-3xl font-bold text-[#071a2f]">
          {testimonials.length}
        </p>
      </div>

      {testimonials.length === 0 ? (
        <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
          No hay testimonios pendientes de revisión.
        </div>
      ) : null}

      {testimonials.length > 0
        ? testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="rounded-lg border border-[#dcebea] bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-[#071a2f]">
                    {testimonial.full_name}
                  </h3>

                  <p className="mt-1 text-sm text-[#52708a]">
                    {roleLabels[testimonial.role]}
                  </p>

                  {testimonial.workshop_name ? (
                    <p className="mt-1 text-sm text-[#52708a]">
                      Taller: {testimonial.workshop_name}
                    </p>
                  ) : null}
                </div>

                <span className="rounded-full bg-[#e8f7f7] px-3 py-1 text-xs font-bold text-[#168c91]">
                  Pendiente de revisión
                </span>
              </div>

              <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#071a2f]">
                {testimonial.comment}
              </p>

              <p className="mt-4 text-xs font-semibold text-[#52708a]">
                Recibido el {formatDate(testimonial.created_at)}
              </p>

              <div className="mt-5 rounded-lg border border-[#dcebea] bg-[#f7fbfb] p-4">
                <p className="text-sm font-bold text-[#071a2f]">
                  Revisión administrativa
                </p>

                <label className="mt-3 block">
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

                <div className="mt-4 rounded-lg border border-[#dcebea] bg-white p-3">
                  <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-[#071a2f]">
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

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={updatingTestimonialId === testimonial.id}
                    onClick={() => updateTestimonial(testimonial.id, "approve")}
                    className="rounded-full bg-[#39b8bb] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:bg-[#5fd0d2] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Aprobar
                  </button>

                  <button
                    type="button"
                    disabled={updatingTestimonialId === testimonial.id}
                    onClick={() => updateTestimonial(testimonial.id, "reject")}
                    className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            </article>
          ))
        : null}
    </div>
  );
}
