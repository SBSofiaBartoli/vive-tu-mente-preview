"use client";

import { useCallback, useEffect, useState } from "react";
import { adminApiClient, adminApiPatchClient } from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type {
  ParticipationMessage,
  PaginatedParticipationMessagesResponse,
} from "@/types/participation-message";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

const participationMessagesPageSize = 10;

type ParticipationFilter = "all" | "unread" | "starred" | "contacted";
type ParticipationFilterCounts = Record<ParticipationFilter, number>;

const filterOptions: Array<{
  label: string;
  value: ParticipationFilter;
}> = [
  { label: "Todos", value: "all" },
  { label: "No leídos", value: "unread" },
  { label: "Destacados", value: "starred" },
  { label: "Contactados", value: "contacted" },
];

export function ParticipationMessagesPanel() {
  const [messages, setMessages] = useState<ParticipationMessage[]>([]);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: participationMessagesPageSize,
    total: 0,
    total_pages: 1,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [interestAreaFilter, setInterestAreaFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingMessageId, setUpdatingMessageId] = useState<string | null>(
    null,
  );
  const [activeFilter, setActiveFilter] = useState<ParticipationFilter>("all");
  const [filterCounts, setFilterCounts] = useState<ParticipationFilterCounts>({
    all: 0,
    unread: 0,
    starred: 0,
    contacted: 0,
  });
  const hasActiveFilters =
    activeFilter !== "all" ||
    interestAreaFilter.trim() !== "" ||
    searchTerm.trim() !== "";

  const loadMessages = useCallback(async () => {
    try {
      setIsLoading(true);
      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      const accessToken = data.session.access_token;

      const params = new URLSearchParams({
        page: String(page),
        limit: String(participationMessagesPageSize),
      });

      if (activeFilter === "unread") {
        params.set("is_read", "false");
      }

      if (activeFilter === "starred") {
        params.set("is_starred", "true");
      }

      if (activeFilter === "contacted") {
        params.set("is_contacted", "true");
      }

      if (interestAreaFilter.trim()) {
        params.set("interest_area", interestAreaFilter.trim());
      }

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      const participationMessagesResponse =
        await adminApiClient<PaginatedParticipationMessagesResponse>(
          `/api/participation/messages/admin?${params.toString()}`,
          {
            accessToken,
          },
        );

      setMessages(participationMessagesResponse.items);
      setPaginationMeta(participationMessagesResponse.meta);
      const [allMessages, unreadMessages, starredMessages, contactedMessages] =
        await Promise.all([
          adminApiClient<PaginatedParticipationMessagesResponse>(
            "/api/participation/messages/admin?page=1&limit=1",
            { accessToken },
          ),
          adminApiClient<PaginatedParticipationMessagesResponse>(
            "/api/participation/messages/admin?page=1&limit=1&is_read=false",
            { accessToken },
          ),
          adminApiClient<PaginatedParticipationMessagesResponse>(
            "/api/participation/messages/admin?page=1&limit=1&is_starred=true",
            { accessToken },
          ),
          adminApiClient<PaginatedParticipationMessagesResponse>(
            "/api/participation/messages/admin?page=1&limit=1&is_contacted=true",
            { accessToken },
          ),
        ]);

      setFilterCounts({
        all: allMessages.meta.total,
        unread: unreadMessages.meta.total,
        starred: starredMessages.meta.total,
        contacted: contactedMessages.meta.total,
      });
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los mensajes de participación.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeFilter, interestAreaFilter, page, searchTerm]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadMessages();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadMessages]);

  const updateMessageStatus = async (
    messageId: string,
    status: Partial<
      Pick<ParticipationMessage, "is_read" | "is_starred" | "is_contacted">
    >,
  ) => {
    try {
      setUpdatingMessageId(messageId);

      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      const updatedMessage = await adminApiPatchClient<
        ParticipationMessage,
        typeof status
      >(`/api/participation/messages/admin/${messageId}/status`, {
        accessToken: data.session.access_token,
        body: status,
      });

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message.id === messageId ? updatedMessage : message,
        ),
      );
      void loadMessages();
    } catch {
      setErrorMessage("No se pudo actualizar el estado del mensaje.");
    } finally {
      setUpdatingMessageId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
        Cargando mensajes...
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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-lg border border-[#dcebea] bg-white p-3">
        {filterOptions.map((option) => {
          const isActive = activeFilter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setActiveFilter(option.value);
                setPage(1);
              }}
              className={
                isActive
                  ? "rounded-full bg-[#39b8bb] px-4 py-2 text-sm font-bold text-[#071a2f]"
                  : "rounded-full border border-[#dcebea] px-4 py-2 text-sm font-bold text-[#52708a] transition hover:border-[#39b8bb] hover:text-[#168c91]"
              }
            >
              {option.label}
              <span className="ml-2 rounded-full bg-white/70 px-2 py-0.5 text-xs">
                {filterCounts[option.value]}
              </span>
            </button>
          );
        })}
      </div>

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
              placeholder="Nombre, email, teléfono o mensaje"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#52708a]">
              Área de interés
            </span>
            <input
              value={interestAreaFilter}
              onChange={(event) => {
                setInterestAreaFilter(event.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
              placeholder="voluntariado, talleres..."
            />
          </label>
        </div>

        <p className="mt-4 text-sm font-semibold text-[#52708a]">
          Mostrando {messages.length} de {paginationMeta.total} mensajes.
        </p>
      </section>

      {messages.length === 0 ? (
        <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
          {hasActiveFilters
            ? "No hay mensajes para los filtros seleccionados."
            : "Todavía no hay mensajes de participación cargados."}
        </div>
      ) : null}

      {messages.map((message) => (
        <article
          key={message.id}
          className="rounded-lg border border-[#dcebea] bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#071a2f]">
                {message.full_name}
              </h3>

              <p className="mt-1 text-sm text-[#52708a]">{message.email}</p>

              {message.phone ? (
                <p className="mt-1 text-sm text-[#52708a]">{message.phone}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#e8f7f7] px-3 py-1 text-xs font-bold text-[#168c91]">
                {message.interest_area}
              </span>

              <span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-bold text-[#52708a]">
                {message.is_read ? "Leído" : "No leído"}
              </span>

              {message.is_starred ? (
                <span className="rounded-full bg-[#fff7db] px-3 py-1 text-xs font-bold text-[#9a6b00]">
                  Destacado
                </span>
              ) : null}

              {message.is_contacted ? (
                <span className="rounded-full bg-[#e9f8ef] px-3 py-1 text-xs font-bold text-[#187847]">
                  Contactado
                </span>
              ) : null}
            </div>
          </div>

          <p className="mt-4 whitespace-pre-line text-sm leading-6 text-[#071a2f]">
            {message.message}
          </p>

          <p className="mt-4 text-xs font-semibold text-[#52708a]">
            Enviado el {formatDate(message.created_at)}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={updatingMessageId === message.id}
              onClick={() =>
                updateMessageStatus(message.id, {
                  is_read: !message.is_read,
                })
              }
              className="rounded-full border border-[#dcebea] px-3 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {message.is_read ? "Marcar no leído" : "Marcar leído"}
            </button>

            <button
              type="button"
              disabled={updatingMessageId === message.id}
              onClick={() =>
                updateMessageStatus(message.id, {
                  is_starred: !message.is_starred,
                })
              }
              className="rounded-full border border-[#dcebea] px-3 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {message.is_starred ? "Quitar destacado" : "Destacar"}
            </button>

            <button
              type="button"
              disabled={updatingMessageId === message.id}
              onClick={() =>
                updateMessageStatus(message.id, {
                  is_contacted: !message.is_contacted,
                })
              }
              className="rounded-full border border-[#dcebea] px-3 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {message.is_contacted
                ? "Marcar no contactado"
                : "Marcar contactado"}
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
    </div>
  );
}
