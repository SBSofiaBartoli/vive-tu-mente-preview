"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminApiClient,
  adminApiPatchClient,
  adminApiPostClient,
} from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type {
  CreateFaqPayload,
  Faq,
  UpdateFaqPayload,
  PaginatedFaqsResponse,
} from "@/types/faq";

const emptyForm: CreateFaqPayload = {
  question: "",
  answer: "",
  category: "general",
  sort_order: 0,
  is_active: true,
};

const faqsPageSize = 10;
type FaqStatusFilter = "all" | "active" | "inactive";

export function FaqsPanel() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: faqsPageSize,
    total: 0,
    total_pages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<FaqStatusFilter>("all");
  const [form, setForm] = useState<CreateFaqPayload>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [updatingFaqId, setUpdatingFaqId] = useState<string | null>(null);
  const [editingFaqs, setEditingFaqs] = useState<
    Record<string, UpdateFaqPayload>
  >({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const hasActiveFilters =
    searchTerm.trim() !== "" ||
    categoryFilter.trim() !== "" ||
    statusFilter !== "all";

  const loadFaqs = useCallback(async () => {
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
        limit: String(faqsPageSize),
      });

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      if (categoryFilter.trim()) {
        params.set("category", categoryFilter.trim());
      }

      if (statusFilter === "active") {
        params.set("is_active", "true");
      }

      if (statusFilter === "inactive") {
        params.set("is_active", "false");
      }

      const adminFaqsResponse = await adminApiClient<PaginatedFaqsResponse>(
        `/api/faqs/admin?${params.toString()}`,
        {
          accessToken: data.session.access_token,
        },
      );

      setFaqs(adminFaqsResponse.items);
      setPaginationMeta(adminFaqsResponse.meta);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las preguntas frecuentes.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [categoryFilter, page, searchTerm, statusFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadFaqs();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadFaqs]);

  const createFaq = async () => {
    try {
      setIsSaving(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (!form.question.trim() || !form.answer.trim()) {
        setErrorMessage("La pregunta y la respuesta son obligatorias.");
        return;
      }

      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      await adminApiPostClient<Faq, CreateFaqPayload>("/api/faqs/admin", {
        accessToken: data.session.access_token,
        body: {
          ...form,
          question: form.question.trim(),
          answer: form.answer.trim(),
          category: form.category.trim() || "general",
        },
      });

      void loadFaqs();
      setForm(emptyForm);
      setIsCreateFormOpen(false);
      setSuccessMessage("La pregunta frecuente fue creada correctamente.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo crear la pregunta frecuente.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const toggleFaqStatus = async (faq: Faq) => {
    try {
      setUpdatingFaqId(faq.id);
      setErrorMessage("");
      setSuccessMessage("");

      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      const updatedFaq = await adminApiPatchClient<Faq, UpdateFaqPayload>(
        `/api/faqs/admin/${faq.id}`,
        {
          accessToken: data.session.access_token,
          body: { is_active: !faq.is_active },
        },
      );

      setFaqs((currentFaqs) =>
        currentFaqs.map((currentFaq) =>
          currentFaq.id === faq.id ? updatedFaq : currentFaq,
        ),
      );

      void loadFaqs();

      setSuccessMessage(
        updatedFaq.is_active
          ? "La pregunta frecuente fue activada."
          : "La pregunta frecuente fue desactivada.",
      );
    } catch {
      setErrorMessage("No se pudo actualizar la pregunta frecuente.");
    } finally {
      setUpdatingFaqId(null);
    }
  };

  const updateFaq = async (faq: Faq) => {
    try {
      setUpdatingFaqId(faq.id);
      setErrorMessage("");
      setSuccessMessage("");

      const changes = editingFaqs[faq.id];

      if (!changes) {
        setSuccessMessage("No hay cambios para guardar.");
        return;
      }

      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      const updatedFaq = await adminApiPatchClient<Faq, UpdateFaqPayload>(
        `/api/faqs/admin/${faq.id}`,
        {
          accessToken: data.session.access_token,
          body: changes,
        },
      );

      setFaqs((currentFaqs) =>
        currentFaqs.map((currentFaq) =>
          currentFaq.id === faq.id ? updatedFaq : currentFaq,
        ),
      );

      void loadFaqs();

      setEditingFaqs((currentEditingFaqs) => {
        const nextEditingFaqs = { ...currentEditingFaqs };
        delete nextEditingFaqs[faq.id];
        return nextEditingFaqs;
      });

      setSuccessMessage("La pregunta frecuente fue actualizada.");
    } catch {
      setErrorMessage("No se pudo actualizar la pregunta frecuente.");
    } finally {
      setUpdatingFaqId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
        Cargando preguntas frecuentes...
      </div>
    );
  }

  return (
    <div className="space-y-5">
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
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#071a2f]">
              Preguntas frecuentes
            </h3>
            <p className="mt-1 text-sm text-[#52708a]">
              Creá y administrá preguntas desplegables para las secciones del
              sitio.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateFormOpen((currentValue) => !currentValue)}
            className="w-fit rounded-full bg-[#39b8bb] px-5 py-2.5 text-sm font-bold text-[#071a2f] transition hover:bg-[#5fd0d2]"
          >
            {isCreateFormOpen ? "Cerrar formulario" : "Crear nueva pregunta"}
          </button>
        </div>

        {isCreateFormOpen ? (
          <div className="mt-5 grid gap-4 border-t border-[#dcebea] pt-5">
            <label className="block">
              <span className="text-sm font-bold text-[#52708a]">Pregunta</span>
              <input
                value={form.question}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    question: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                placeholder="Ej: ¿Cómo puedo participar?"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#52708a]">
                Respuesta
              </span>
              <textarea
                value={form.answer}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    answer: event.target.value,
                  }))
                }
                rows={4}
                className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                placeholder="Escribí la respuesta que se mostrará en el sitio."
              />
            </label>

            <div className="grid gap-4 md:grid-cols-[1fr_160px]">
              <label className="block">
                <span className="text-sm font-bold text-[#52708a]">
                  Categoría
                </span>
                <input
                  value={form.category}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      category: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                  placeholder="general"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-[#52708a]">Orden</span>
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      sort_order: Number(event.target.value),
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                />
              </label>
            </div>

            <label className="flex items-center gap-2 text-sm font-semibold text-[#071a2f]">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) =>
                  setForm((currentForm) => ({
                    ...currentForm,
                    is_active: event.target.checked,
                  }))
                }
                className="h-4 w-4 accent-[#39b8bb]"
              />
              Publicar activa
            </label>

            <button
              type="button"
              disabled={isSaving}
              onClick={createFaq}
              className="w-fit rounded-full bg-[#39b8bb] px-5 py-2.5 text-sm font-bold text-[#071a2f] transition hover:bg-[#5fd0d2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Crear pregunta
            </button>
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        <div className="rounded-lg border border-[#dcebea] bg-white p-5">
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
                placeholder="Pregunta o respuesta"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#52708a]">
                Categoría
              </span>
              <input
                value={categoryFilter}
                onChange={(event) => {
                  setCategoryFilter(event.target.value);
                  setPage(1);
                }}
                className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                placeholder="general, programas..."
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#52708a]">Estado</span>
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value as FaqStatusFilter);
                  setPage(1);
                }}
                className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
              >
                <option value="all">Todas</option>
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
              </select>
            </label>
          </div>
        </div>
        <div className="rounded-lg border border-[#dcebea] bg-white p-4">
          <p className="text-sm font-semibold text-[#52708a]">
            Preguntas frecuentes
          </p>
          <p className="mt-1 text-3xl font-bold text-[#071a2f]">
            {paginationMeta.total}
          </p>
          <p className="mt-1 text-sm text-[#52708a]">
            Mostrando {faqs.length} resultados en esta página.
          </p>
        </div>

        {faqs.length === 0 ? (
          <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
            {hasActiveFilters
              ? "No hay preguntas frecuentes para los filtros seleccionados."
              : "Todavía no hay preguntas frecuentes cargadas."}
          </div>
        ) : null}

        {faqs.map((faq) => (
          <article
            key={faq.id}
            className="rounded-lg border border-[#dcebea] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <label className="block">
                  <span className="text-xs font-bold uppercase text-[#39b8bb]">
                    Categoría
                  </span>
                  <input
                    value={editingFaqs[faq.id]?.category ?? faq.category}
                    onChange={(event) =>
                      setEditingFaqs((currentEditingFaqs) => ({
                        ...currentEditingFaqs,
                        [faq.id]: {
                          ...currentEditingFaqs[faq.id],
                          category: event.target.value,
                        },
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm text-[#071a2f] outline-none transition focus:border-[#39b8bb]"
                  />
                </label>

                <input
                  value={editingFaqs[faq.id]?.question ?? faq.question}
                  onChange={(event) =>
                    setEditingFaqs((currentEditingFaqs) => ({
                      ...currentEditingFaqs,
                      [faq.id]: {
                        ...currentEditingFaqs[faq.id],
                        question: event.target.value,
                      },
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm font-bold text-[#071a2f] outline-none transition focus:border-[#39b8bb]"
                />
              </div>

              <span
                className={
                  faq.is_active
                    ? "rounded-full bg-[#e8f7f7] px-3 py-1 text-xs font-bold text-[#168c91]"
                    : "rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-bold text-[#52708a]"
                }
              >
                {faq.is_active ? "Activa" : "Inactiva"}
              </span>
            </div>

            <textarea
              value={editingFaqs[faq.id]?.answer ?? faq.answer}
              onChange={(event) =>
                setEditingFaqs((currentEditingFaqs) => ({
                  ...currentEditingFaqs,
                  [faq.id]: {
                    ...currentEditingFaqs[faq.id],
                    answer: event.target.value,
                  },
                }))
              }
              rows={4}
              className="mt-4 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm leading-6 text-[#52708a] outline-none transition focus:border-[#39b8bb]"
            />

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#52708a]">
                Orden:
                <input
                  type="number"
                  value={editingFaqs[faq.id]?.sort_order ?? faq.sort_order}
                  onChange={(event) =>
                    setEditingFaqs((currentEditingFaqs) => ({
                      ...currentEditingFaqs,
                      [faq.id]: {
                        ...currentEditingFaqs[faq.id],
                        sort_order: Number(event.target.value),
                      },
                    }))
                  }
                  className="w-20 rounded-lg border border-[#dcebea] px-2 py-1 text-xs outline-none transition focus:border-[#39b8bb]"
                />
              </label>

              <button
                type="button"
                disabled={updatingFaqId === faq.id}
                onClick={() => updateFaq(faq)}
                className="rounded-full bg-[#39b8bb] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:bg-[#5fd0d2] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Guardar cambios
              </button>

              <button
                type="button"
                disabled={updatingFaqId === faq.id}
                onClick={() => toggleFaqStatus(faq)}
                className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {faq.is_active ? "Desactivar" : "Activar"}
              </button>
            </div>
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
      </section>
    </div>
  );
}
