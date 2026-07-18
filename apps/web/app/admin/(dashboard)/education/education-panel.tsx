"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminApiClient,
  adminApiPatchClient,
  adminApiPostClient,
} from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type {
  CreateEducationCardPayload,
  CreateEducationTipPayload,
  EducationCard,
  EducationTip,
  UpdateEducationCardPayload,
  UpdateEducationTipPayload,
  PaginatedEducationCardsResponse,
  PaginatedEducationTipsResponse,
} from "@/types/education";

const emptyCardForm: CreateEducationCardPayload = {
  segment_key: "",
  title: "",
  description: "",
  icon_name: "book-open",
  sort_order: 0,
  is_active: true,
};

const emptyTipForm: CreateEducationTipPayload = {
  segment_key: "",
  title: "",
  content: "",
  resource_url: null,
  is_active: true,
  starts_at: null,
  ends_at: null,
};

const educationPageSize = 10;
type EducationStatusFilter = "all" | "active" | "inactive";

export function EducationPanel() {
  const [cards, setCards] = useState<EducationCard[]>([]);
  const [tips, setTips] = useState<EducationTip[]>([]);
  const [cardsPage, setCardsPage] = useState(1);
  const [tipsPage, setTipsPage] = useState(1);
  const [cardsMeta, setCardsMeta] = useState({
    page: 1,
    limit: educationPageSize,
    total: 0,
    total_pages: 1,
  });
  const [tipsMeta, setTipsMeta] = useState({
    page: 1,
    limit: educationPageSize,
    total: 0,
    total_pages: 1,
  });
  const [cardsSearchTerm, setCardsSearchTerm] = useState("");
  const [cardsSegmentFilter, setCardsSegmentFilter] = useState("");
  const [cardsStatusFilter, setCardsStatusFilter] =
    useState<EducationStatusFilter>("all");
  const [tipsSearchTerm, setTipsSearchTerm] = useState("");
  const [tipsSegmentFilter, setTipsSegmentFilter] = useState("");
  const [tipsStatusFilter, setTipsStatusFilter] =
    useState<EducationStatusFilter>("all");
  const [cardForm, setCardForm] =
    useState<CreateEducationCardPayload>(emptyCardForm);
  const [tipForm, setTipForm] =
    useState<CreateEducationTipPayload>(emptyTipForm);
  const [isSavingTip, setIsSavingTip] = useState(false);
  const [isSavingCard, setIsSavingCard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isCardFormOpen, setIsCardFormOpen] = useState(false);
  const [isTipFormOpen, setIsTipFormOpen] = useState(false);
  const hasActiveCardFilters =
    cardsSearchTerm.trim() !== "" ||
    cardsSegmentFilter.trim() !== "" ||
    cardsStatusFilter !== "all";
  const hasActiveTipFilters =
    tipsSearchTerm.trim() !== "" ||
    tipsSegmentFilter.trim() !== "" ||
    tipsStatusFilter !== "all";

  const loadEducationData = useCallback(async () => {
    try {
      setIsLoading(true);
      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      const cardsParams = new URLSearchParams({
        page: String(cardsPage),
        limit: String(educationPageSize),
      });

      if (cardsSearchTerm.trim()) {
        cardsParams.set("search", cardsSearchTerm.trim());
      }

      if (cardsSegmentFilter.trim()) {
        cardsParams.set("segment_key", cardsSegmentFilter.trim());
      }

      if (cardsStatusFilter === "active") {
        cardsParams.set("is_active", "true");
      }

      if (cardsStatusFilter === "inactive") {
        cardsParams.set("is_active", "false");
      }

      const tipsParams = new URLSearchParams({
        page: String(tipsPage),
        limit: String(educationPageSize),
      });

      if (tipsSearchTerm.trim()) {
        tipsParams.set("search", tipsSearchTerm.trim());
      }

      if (tipsSegmentFilter.trim()) {
        tipsParams.set("segment_key", tipsSegmentFilter.trim());
      }

      if (tipsStatusFilter === "active") {
        tipsParams.set("is_active", "true");
      }

      if (tipsStatusFilter === "inactive") {
        tipsParams.set("is_active", "false");
      }

      const [adminCards, adminTips] = await Promise.all([
        adminApiClient<PaginatedEducationCardsResponse>(
          `/api/education-cards/admin?${cardsParams.toString()}`,
          {
            accessToken: data.session.access_token,
          },
        ),
        adminApiClient<PaginatedEducationTipsResponse>(
          `/api/education-tips/admin?${tipsParams.toString()}`,
          {
            accessToken: data.session.access_token,
          },
        ),
      ]);

      setCards(adminCards.items);
      setCardsMeta(adminCards.meta);
      setTips(adminTips.items);
      setTipsMeta(adminTips.meta);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo cargar la información educativa.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    cardsPage,
    cardsSearchTerm,
    cardsSegmentFilter,
    cardsStatusFilter,
    tipsPage,
    tipsSearchTerm,
    tipsSegmentFilter,
    tipsStatusFilter,
  ]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadEducationData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadEducationData]);

  const toggleCardStatus = async (card: EducationCard) => {
    try {
      setUpdatingId(card.id);
      setErrorMessage("");
      setSuccessMessage("");

      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      const updatedCard = await adminApiPatchClient<
        EducationCard,
        UpdateEducationCardPayload
      >(`/api/education-cards/admin/${card.id}`, {
        accessToken: data.session.access_token,
        body: { is_active: !card.is_active },
      });

      setCards((currentCards) =>
        currentCards.map((currentCard) =>
          currentCard.id === card.id ? updatedCard : currentCard,
        ),
      );

      void loadEducationData();

      setSuccessMessage(
        updatedCard.is_active
          ? "La card educativa fue activada."
          : "La card educativa fue desactivada.",
      );
    } catch {
      setErrorMessage("No se pudo actualizar la card educativa.");
    } finally {
      setUpdatingId(null);
    }
  };

  const toggleTipStatus = async (tip: EducationTip) => {
    try {
      setUpdatingId(tip.id);
      setErrorMessage("");
      setSuccessMessage("");

      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      const updatedTip = await adminApiPatchClient<
        EducationTip,
        UpdateEducationTipPayload
      >(`/api/education-tips/admin/${tip.id}`, {
        accessToken: data.session.access_token,
        body: { is_active: !tip.is_active },
      });

      setTips((currentTips) =>
        currentTips.map((currentTip) =>
          currentTip.id === tip.id ? updatedTip : currentTip,
        ),
      );

      void loadEducationData();

      setSuccessMessage(
        updatedTip.is_active
          ? "El tip educativo fue activado."
          : "El tip educativo fue desactivado.",
      );
    } catch {
      setErrorMessage("No se pudo actualizar el tip educativo.");
    } finally {
      setUpdatingId(null);
    }
  };

  const createEducationCard = async () => {
    try {
      setIsSavingCard(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (
        !cardForm.segment_key.trim() ||
        !cardForm.title.trim() ||
        !cardForm.description.trim() ||
        !cardForm.icon_name.trim()
      ) {
        setErrorMessage(
          "Completá los campos obligatorios de la card educativa.",
        );
        return;
      }

      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      await adminApiPostClient<EducationCard, CreateEducationCardPayload>(
        "/api/education-cards/admin",
        {
          accessToken: data.session.access_token,
          body: {
            ...cardForm,
            segment_key: cardForm.segment_key.trim(),
            title: cardForm.title.trim(),
            description: cardForm.description.trim(),
            icon_name: cardForm.icon_name.trim(),
          },
        },
      );

      void loadEducationData();
      setCardForm(emptyCardForm);
      setIsCardFormOpen(false);
      setSuccessMessage("La card educativa fue creada correctamente.");
    } catch {
      setErrorMessage("No se pudo crear la card educativa.");
    } finally {
      setIsSavingCard(false);
    }
  };

  const createEducationTip = async () => {
    try {
      setIsSavingTip(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (
        !tipForm.segment_key.trim() ||
        !tipForm.title.trim() ||
        !tipForm.content.trim()
      ) {
        setErrorMessage("Completá los campos obligatorios del tip educativo.");
        return;
      }

      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      await adminApiPostClient<EducationTip, CreateEducationTipPayload>(
        "/api/education-tips/admin",
        {
          accessToken: data.session.access_token,
          body: {
            ...tipForm,
            segment_key: tipForm.segment_key.trim(),
            title: tipForm.title.trim(),
            content: tipForm.content.trim(),
            resource_url: tipForm.resource_url?.trim() || null,
            starts_at: tipForm.starts_at || null,
            ends_at: tipForm.ends_at || null,
          },
        },
      );

      void loadEducationData();
      setTipForm(emptyTipForm);
      setIsTipFormOpen(false);
      setSuccessMessage("El tip educativo fue creado correctamente.");
    } catch {
      setErrorMessage("No se pudo crear el tip educativo.");
    } finally {
      setIsSavingTip(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
        Cargando educación...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-3xl font-bold">Educación</h2>
          <p className="mt-2 max-w-2xl text-[#52708a]">
            Administración de cards educativas, segmentos y tips de aprendizaje.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <button
            type="button"
            onClick={() => setIsCardFormOpen(true)}
            className="rounded-full bg-[#39b8bb] px-5 py-2.5 text-sm font-bold text-[#071a2f] transition hover:bg-[#5fd0d2]"
          >
            Crear nueva card
          </button>

          <button
            type="button"
            onClick={() => setIsTipFormOpen(true)}
            className="rounded-full border border-[#39b8bb] bg-white px-5 py-2.5 text-sm font-bold text-[#168c91] transition hover:bg-[#eefafa]"
          >
            Crear nuevo tip
          </button>
        </div>
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-[#dcebea] bg-white p-4">
          <p className="text-sm font-semibold text-[#52708a]">
            Cards educativas
          </p>
          <p className="mt-1 text-3xl font-bold text-[#071a2f]">
            {cardsMeta.total}
          </p>
          <p className="mt-1 text-sm text-[#52708a]">
            Mostrando {cards.length} resultados en esta página.
          </p>
        </div>

        <div className="rounded-lg border border-[#dcebea] bg-white p-4">
          <p className="text-sm font-semibold text-[#52708a]">
            Tips educativos
          </p>
          <p className="mt-1 text-3xl font-bold text-[#071a2f]">
            {tipsMeta.total}
          </p>
          <p className="mt-1 text-sm text-[#52708a]">
            Mostrando {tips.length} resultados en esta página.
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#071a2f]">Cards educativas</h3>
        <div className="rounded-lg border border-[#dcebea] bg-white p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-bold text-[#52708a]">Buscar</span>
              <input
                value={cardsSearchTerm}
                onChange={(event) => {
                  setCardsSearchTerm(event.target.value);
                  setCardsPage(1);
                }}
                className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                placeholder="Título o descripción"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#52708a]">Segmento</span>
              <input
                value={cardsSegmentFilter}
                onChange={(event) => {
                  setCardsSegmentFilter(event.target.value);
                  setCardsPage(1);
                }}
                className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                placeholder="ia-aplicada"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#52708a]">Estado</span>
              <select
                value={cardsStatusFilter}
                onChange={(event) => {
                  setCardsStatusFilter(
                    event.target.value as EducationStatusFilter,
                  );
                  setCardsPage(1);
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

        {cards.length === 0 ? (
          <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
            {hasActiveCardFilters
              ? "No hay cards educativas para los filtros seleccionados."
              : "Todavía no hay cards educativas cargadas."}
          </div>
        ) : null}

        {cards.map((card) => (
          <details
            key={card.id}
            className="rounded-lg border border-[#dcebea] bg-white shadow-sm"
          >
            <summary className="flex cursor-pointer list-none flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-[#39b8bb]">
                  {card.segment_key}
                </p>
                <h4 className="mt-1 text-base font-bold text-[#071a2f]">
                  {card.title}
                </h4>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-[#52708a]">
                  Ícono: {card.icon_name}
                </span>
                <span className="text-xs font-semibold text-[#52708a]">
                  Orden: {card.sort_order}
                </span>
                <span
                  className={
                    card.is_active
                      ? "rounded-full bg-[#e8f7f7] px-3 py-1 text-xs font-bold text-[#168c91]"
                      : "rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-bold text-[#52708a]"
                  }
                >
                  {card.is_active ? "Activa" : "Inactiva"}
                </span>
              </div>
            </summary>

            <div className="border-t border-[#dcebea] p-4">
              <p className="whitespace-pre-line text-sm leading-6 text-[#52708a]">
                {card.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={updatingId === card.id}
                  onClick={() => toggleCardStatus(card)}
                  className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {card.is_active ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>
          </details>
        ))}
        {cardsMeta.total_pages > 1 ? (
          <div className="flex items-center justify-between rounded-lg border border-[#dcebea] bg-white p-4">
            <button
              type="button"
              disabled={cardsPage <= 1}
              onClick={() =>
                setCardsPage((currentPage) => Math.max(1, currentPage - 1))
              }
              className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <p className="text-sm font-semibold text-[#52708a]">
              Página {cardsMeta.page} de {cardsMeta.total_pages}
            </p>

            <button
              type="button"
              disabled={cardsPage >= cardsMeta.total_pages}
              onClick={() =>
                setCardsPage((currentPage) =>
                  Math.min(cardsMeta.total_pages, currentPage + 1),
                )
              }
              className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#071a2f]">Tips educativos</h3>
        <div className="rounded-lg border border-[#dcebea] bg-white p-5">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="text-sm font-bold text-[#52708a]">Buscar</span>
              <input
                value={tipsSearchTerm}
                onChange={(event) => {
                  setTipsSearchTerm(event.target.value);
                  setTipsPage(1);
                }}
                className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                placeholder="Título o contenido"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#52708a]">Segmento</span>
              <input
                value={tipsSegmentFilter}
                onChange={(event) => {
                  setTipsSegmentFilter(event.target.value);
                  setTipsPage(1);
                }}
                className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                placeholder="ia-aplicada"
              />
            </label>

            <label className="block">
              <span className="text-sm font-bold text-[#52708a]">Estado</span>
              <select
                value={tipsStatusFilter}
                onChange={(event) => {
                  setTipsStatusFilter(
                    event.target.value as EducationStatusFilter,
                  );
                  setTipsPage(1);
                }}
                className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
              >
                <option value="all">Todos</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
              </select>
            </label>
          </div>
        </div>

        {tips.length === 0 ? (
          <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
            {hasActiveTipFilters
              ? "No hay tips educativos para los filtros seleccionados."
              : "Todavía no hay tips educativos cargados."}
          </div>
        ) : null}

        {tips.map((tip) => (
          <details
            key={tip.id}
            className="rounded-lg border border-[#dcebea] bg-white shadow-sm"
          >
            <summary className="flex cursor-pointer list-none flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-[#39b8bb]">
                  {tip.segment_key}
                </p>
                <h4 className="mt-1 text-base font-bold text-[#071a2f]">
                  {tip.title}
                </h4>
              </div>

              <span
                className={
                  tip.is_active
                    ? "rounded-full bg-[#e8f7f7] px-3 py-1 text-xs font-bold text-[#168c91]"
                    : "rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-bold text-[#52708a]"
                }
              >
                {tip.is_active ? "Activo" : "Inactivo"}
              </span>
            </summary>

            <div className="border-t border-[#dcebea] p-4">
              <p className="whitespace-pre-line text-sm leading-6 text-[#52708a]">
                {tip.content}
              </p>

              {tip.resource_url ? (
                <p className="mt-3 text-xs font-semibold text-[#52708a]">
                  Recurso: {tip.resource_url}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={updatingId === tip.id}
                  onClick={() => toggleTipStatus(tip)}
                  className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {tip.is_active ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>
          </details>
        ))}
        {tipsMeta.total_pages > 1 ? (
          <div className="flex items-center justify-between rounded-lg border border-[#dcebea] bg-white p-4">
            <button
              type="button"
              disabled={tipsPage <= 1}
              onClick={() =>
                setTipsPage((currentPage) => Math.max(1, currentPage - 1))
              }
              className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Anterior
            </button>

            <p className="text-sm font-semibold text-[#52708a]">
              Página {tipsMeta.page} de {tipsMeta.total_pages}
            </p>

            <button
              type="button"
              disabled={tipsPage >= tipsMeta.total_pages}
              onClick={() =>
                setTipsPage((currentPage) =>
                  Math.min(tipsMeta.total_pages, currentPage + 1),
                )
              }
              className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        ) : null}
      </section>

      {isCardFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071a2f]/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#071a2f]">
                  Crear card educativa
                </h3>
                <p className="mt-1 text-sm text-[#52708a]">
                  Creá un nuevo segmento educativo para mostrar en la sección de
                  educación.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCardFormOpen(false)}
                className="rounded-full border border-[#dcebea] px-3 py-1.5 text-xs font-bold text-[#52708a] transition hover:border-[#39b8bb] hover:text-[#168c91]"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-[#52708a]">
                    Segmento
                  </span>
                  <input
                    value={cardForm.segment_key}
                    onChange={(event) =>
                      setCardForm((currentForm) => ({
                        ...currentForm,
                        segment_key: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                    placeholder="ia-aplicada"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-[#52708a]">
                    Ícono
                  </span>
                  <input
                    value={cardForm.icon_name}
                    onChange={(event) =>
                      setCardForm((currentForm) => ({
                        ...currentForm,
                        icon_name: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                    placeholder="book-open"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-[#52708a]">Título</span>
                <input
                  value={cardForm.title}
                  onChange={(event) =>
                    setCardForm((currentForm) => ({
                      ...currentForm,
                      title: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                  placeholder="IA aplicada"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-[#52708a]">
                  Descripción
                </span>
                <textarea
                  value={cardForm.description}
                  onChange={(event) =>
                    setCardForm((currentForm) => ({
                      ...currentForm,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                  placeholder="Describí brevemente el contenido de la card."
                />
              </label>

              <div className="grid gap-4 md:grid-cols-[160px_1fr]">
                <label className="block">
                  <span className="text-sm font-bold text-[#52708a]">
                    Orden
                  </span>
                  <input
                    type="number"
                    value={cardForm.sort_order}
                    onChange={(event) =>
                      setCardForm((currentForm) => ({
                        ...currentForm,
                        sort_order: Number(event.target.value),
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                  />
                </label>

                <label className="mt-7 flex items-center gap-2 text-sm font-semibold text-[#071a2f]">
                  <input
                    type="checkbox"
                    checked={cardForm.is_active}
                    onChange={(event) =>
                      setCardForm((currentForm) => ({
                        ...currentForm,
                        is_active: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 accent-[#39b8bb]"
                  />
                  Publicar activa
                </label>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  disabled={isSavingCard}
                  onClick={createEducationCard}
                  className="rounded-full bg-[#39b8bb] px-5 py-2.5 text-sm font-bold text-[#071a2f] transition hover:bg-[#5fd0d2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Crear card
                </button>

                <button
                  type="button"
                  onClick={() => setIsCardFormOpen(false)}
                  className="rounded-full border border-[#dcebea] px-5 py-2.5 text-sm font-bold text-[#52708a] transition hover:border-[#39b8bb] hover:text-[#168c91]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isTipFormOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071a2f]/40 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-[#071a2f]">
                  Crear tip educativo
                </h3>
                <p className="mt-1 text-sm text-[#52708a]">
                  Creá tips rápidos, recursos o contenidos breves para cada
                  segmento educativo.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsTipFormOpen(false)}
                className="rounded-full border border-[#dcebea] px-3 py-1.5 text-xs font-bold text-[#52708a] transition hover:border-[#39b8bb] hover:text-[#168c91]"
              >
                Cerrar
              </button>
            </div>

            <div className="mt-5 grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-[#52708a]">
                    Segmento
                  </span>
                  <input
                    value={tipForm.segment_key}
                    onChange={(event) =>
                      setTipForm((currentForm) => ({
                        ...currentForm,
                        segment_key: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                    placeholder="ia-aplicada"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-[#52708a]">
                    Título
                  </span>
                  <input
                    value={tipForm.title}
                    onChange={(event) =>
                      setTipForm((currentForm) => ({
                        ...currentForm,
                        title: event.target.value,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                    placeholder="Prompt para organizar tu agenda semanal"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-bold text-[#52708a]">
                  Contenido
                </span>
                <textarea
                  value={tipForm.content}
                  onChange={(event) =>
                    setTipForm((currentForm) => ({
                      ...currentForm,
                      content: event.target.value,
                    }))
                  }
                  rows={4}
                  className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                  placeholder="Escribí el contenido del tip educativo."
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-[#52708a]">
                  URL de recurso
                </span>
                <input
                  value={tipForm.resource_url ?? ""}
                  onChange={(event) =>
                    setTipForm((currentForm) => ({
                      ...currentForm,
                      resource_url: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                  placeholder="https://..."
                />
              </label>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold text-[#52708a]">
                    Visible desde
                  </span>
                  <input
                    type="date"
                    value={tipForm.starts_at ?? ""}
                    onChange={(event) =>
                      setTipForm((currentForm) => ({
                        ...currentForm,
                        starts_at: event.target.value || null,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-bold text-[#52708a]">
                    Visible hasta
                  </span>
                  <input
                    type="date"
                    value={tipForm.ends_at ?? ""}
                    onChange={(event) =>
                      setTipForm((currentForm) => ({
                        ...currentForm,
                        ends_at: event.target.value || null,
                      }))
                    }
                    className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                  />
                </label>
              </div>

              <label className="flex items-center gap-2 text-sm font-semibold text-[#071a2f]">
                <input
                  type="checkbox"
                  checked={tipForm.is_active}
                  onChange={(event) =>
                    setTipForm((currentForm) => ({
                      ...currentForm,
                      is_active: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-[#39b8bb]"
                />
                Publicar activo
              </label>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  disabled={isSavingTip}
                  onClick={createEducationTip}
                  className="rounded-full bg-[#39b8bb] px-5 py-2.5 text-sm font-bold text-[#071a2f] transition hover:bg-[#5fd0d2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Crear tip
                </button>

                <button
                  type="button"
                  onClick={() => setIsTipFormOpen(false)}
                  className="rounded-full border border-[#dcebea] px-5 py-2.5 text-sm font-bold text-[#52708a] transition hover:border-[#39b8bb] hover:text-[#168c91]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
