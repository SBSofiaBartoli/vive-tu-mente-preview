"use client";

import { useEffect, useState } from "react";
import { adminApiClient } from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type { ParticipationMessage } from "@/types/participation-message";

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));

export function ParticipationMessagesPanel() {
  const [messages, setMessages] = useState<ParticipationMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

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

  return (
    <div className="space-y-4">
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
        </article>
      ))}
    </div>
  );
}
