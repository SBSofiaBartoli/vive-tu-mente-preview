"use client";

import { useEffect, useState } from "react";
import { adminApiClient, adminApiPatchClient } from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type {
  EducationCard,
  EducationTip,
  UpdateEducationCardPayload,
  UpdateEducationTipPayload,
} from "@/types/education";

export function EducationPanel() {
  const [cards, setCards] = useState<EducationCard[]>([]);
  const [tips, setTips] = useState<EducationTip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadEducationData = async () => {
      try {
        const supabaseClient = createSupabaseBrowserClient();
        const { data } = await supabaseClient.auth.getSession();

        if (!data.session) {
          setErrorMessage("No se encontró una sesión activa.");
          return;
        }

        const [adminCards, adminTips] = await Promise.all([
          adminApiClient<EducationCard[]>("/api/education-cards/admin", {
            accessToken: data.session.access_token,
          }),
          adminApiClient<EducationTip[]>("/api/education-tips/admin", {
            accessToken: data.session.access_token,
          }),
        ]);

        setCards(adminCards);
        setTips(adminTips);
      } catch {
        setErrorMessage("No se pudo cargar la información educativa.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadEducationData();
  }, []);

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

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
        Cargando educación...
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
            {cards.length}
          </p>
        </div>

        <div className="rounded-lg border border-[#dcebea] bg-white p-4">
          <p className="text-sm font-semibold text-[#52708a]">
            Tips educativos
          </p>
          <p className="mt-1 text-3xl font-bold text-[#071a2f]">
            {tips.length}
          </p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#071a2f]">Cards educativas</h3>

        {cards.length === 0 ? (
          <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
            Todavía no hay cards educativas cargadas.
          </div>
        ) : null}

        {cards.map((card) => (
          <article
            key={card.id}
            className="rounded-lg border border-[#dcebea] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-[#39b8bb]">
                  {card.segment_key}
                </p>
                <h4 className="mt-1 text-lg font-bold text-[#071a2f]">
                  {card.title}
                </h4>
                <p className="mt-2 text-sm leading-6 text-[#52708a]">
                  {card.description}
                </p>
              </div>

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

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-[#52708a]">
                Ícono: {card.icon_name}
              </span>
              <span className="text-xs font-semibold text-[#52708a]">
                Orden: {card.sort_order}
              </span>

              <button
                type="button"
                disabled={updatingId === card.id}
                onClick={() => toggleCardStatus(card)}
                className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {card.is_active ? "Desactivar" : "Activar"}
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#071a2f]">Tips educativos</h3>

        {tips.length === 0 ? (
          <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
            Todavía no hay tips educativos cargados.
          </div>
        ) : null}

        {tips.map((tip) => (
          <article
            key={tip.id}
            className="rounded-lg border border-[#dcebea] bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase text-[#39b8bb]">
                  {tip.segment_key}
                </p>
                <h4 className="mt-1 text-lg font-bold text-[#071a2f]">
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
            </div>

            <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#52708a]">
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
          </article>
        ))}
      </section>
    </div>
  );
}
