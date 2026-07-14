"use client";

import { useEffect, useState } from "react";
import { adminApiClient, adminApiPatchClient } from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type { ParticipationMessage } from "@/types/participation-message";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

type ParticipationFilter = "all" | "unread" | "starred" | "contacted";

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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [updatingMessageId, setUpdatingMessageId] = useState<string | null>(
    null,
  );
  const [activeFilter, setActiveFilter] = useState<ParticipationFilter>("all");

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const supabaseClient = createSupabaseBrowserClient();
        const { data } = await supabaseClient.auth.getSession();

        if (!data.session) {
          setErrorMessage("No se encontró una sesión activa.");
          return;
        }

        const participationMessages = await adminApiClient<
          ParticipationMessage[]
        >("/api/participation/messages/admin", {
          accessToken: data.session.access_token,
        });

        setMessages(participationMessages);
      } catch {
        setErrorMessage("No se pudieron cargar los mensajes de participación.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadMessages();
  }, []);

  const filteredMessages = messages.filter((message) => {
    if (activeFilter === "unread") {
      return !message.is_read;
    }

    if (activeFilter === "starred") {
      return message.is_starred;
    }

    if (activeFilter === "contacted") {
      return message.is_contacted;
    }

    return true;
  });

  const filterCounts: Record<ParticipationFilter, number> = {
    all: messages.length,
    unread: messages.filter((message) => !message.is_read).length,
    starred: messages.filter((message) => message.is_starred).length,
    contacted: messages.filter((message) => message.is_contacted).length,
  };

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

  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
        Todavía no hay mensajes de participación.
      </div>
    );
  }

  const hasFilteredMessages = filteredMessages.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 rounded-lg border border-[#dcebea] bg-white p-3">
        {filterOptions.map((option) => {
          const isActive = activeFilter === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setActiveFilter(option.value)}
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

      {!hasFilteredMessages ? (
        <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
          No hay mensajes para este filtro.
        </div>
      ) : null}

      {filteredMessages.map((message) => (
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
    </div>
  );
}
