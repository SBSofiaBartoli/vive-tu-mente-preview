"use client";

import { useEffect, useState } from "react";
import { adminApiClient, adminApiPatchClient } from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type {
  MediaFile,
  MediaFileStatus,
  UpdateMediaFileStatusPayload,
} from "@/types/media-file";

const statusLabels: Record<MediaFileStatus, string> = {
  pending: "Pendiente",
  changes_requested: "Cambios solicitados",
  approved: "Aprobado",
  rejected: "Rechazado",
  archived: "Archivado",
};

const formatFileSize = (size: number) => {
  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)} KB`;
  }

  return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export function MediaFilesPanel() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingFileId, setUpdatingFileId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const supabaseClient = createSupabaseBrowserClient();
        const { data } = await supabaseClient.auth.getSession();

        if (!data.session) {
          setErrorMessage("No se encontró una sesión activa.");
          return;
        }

        const adminFiles = await adminApiClient<MediaFile[]>(
          "/api/media-files/admin",
          {
            accessToken: data.session.access_token,
          },
        );

        setFiles(adminFiles);
      } catch {
        setErrorMessage("No se pudieron cargar los archivos.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadFiles();
  }, []);

  const updateFileStatus = async (file: MediaFile, status: MediaFileStatus) => {
    try {
      setUpdatingFileId(file.id);
      setErrorMessage("");
      setSuccessMessage("");

      const supabaseClient = createSupabaseBrowserClient();
      const { data } = await supabaseClient.auth.getSession();

      if (!data.session) {
        setErrorMessage("No se encontró una sesión activa.");
        return;
      }

      const body: UpdateMediaFileStatusPayload = {
        status,
        review_notes:
          status === "changes_requested"
            ? reviewNotes[file.id]?.trim() || null
            : null,
        rejection_reason:
          status === "rejected"
            ? rejectionReasons[file.id]?.trim() || null
            : null,
      };

      if (status === "changes_requested" && !body.review_notes) {
        setErrorMessage("Para solicitar cambios, indicá las observaciones.");
        return;
      }

      if (status === "rejected" && !body.rejection_reason) {
        setErrorMessage("Para rechazar un archivo, indicá el motivo.");
        return;
      }

      const updatedFile = await adminApiPatchClient<
        MediaFile,
        UpdateMediaFileStatusPayload
      >(`/api/media-files/admin/${file.id}/status`, {
        accessToken: data.session.access_token,
        body,
      });

      setFiles((currentFiles) =>
        currentFiles.map((currentFile) =>
          currentFile.id === file.id ? updatedFile : currentFile,
        ),
      );

      setSuccessMessage(`El archivo quedó en estado: ${statusLabels[status]}.`);
    } catch {
      setErrorMessage("No se pudo actualizar el archivo.");
    } finally {
      setUpdatingFileId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
        Cargando archivos...
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

      <div className="rounded-lg border border-[#dcebea] bg-white p-4">
        <p className="text-sm font-semibold text-[#52708a]">
          Archivos cargados
        </p>
        <p className="mt-1 text-3xl font-bold text-[#071a2f]">{files.length}</p>
      </div>

      {files.length === 0 ? (
        <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
          Todavía no hay archivos cargados.
        </div>
      ) : null}

      {files.map((file) => (
        <article
          key={file.id}
          className="rounded-lg border border-[#dcebea] bg-white p-5 shadow-sm"
        >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase text-[#39b8bb]">
                {file.section}
              </p>
              <h3 className="mt-1 text-lg font-bold text-[#071a2f]">
                {file.original_name}
              </h3>
              <p className="mt-1 text-sm text-[#52708a]">
                {file.mime_type} · {formatFileSize(file.file_size)}
              </p>
              <p className="mt-1 text-sm text-[#52708a]">
                Subido por {file.uploaded_by_name ?? "Sin nombre"}
              </p>
            </div>

            <span
              className={
                file.status === "approved"
                  ? "rounded-full bg-[#e8f7f7] px-3 py-1 text-xs font-bold text-[#168c91]"
                  : "rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-bold text-[#52708a]"
              }
            >
              {statusLabels[file.status]}
            </span>
          </div>

          {file.public_url ? (
            <a
              href={file.public_url}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91]"
            >
              Ver archivo
            </a>
          ) : null}

          <div className="mt-5 rounded-lg border border-[#dcebea] bg-[#f7fbfb] p-4">
            <p className="text-sm font-bold text-[#071a2f]">
              Revisión administrativa
            </p>

            <label className="mt-3 block">
              <span className="text-xs font-bold text-[#52708a]">
                Observaciones para cambios
              </span>
              <textarea
                value={reviewNotes[file.id] ?? ""}
                onChange={(event) =>
                  setReviewNotes((currentNotes) => ({
                    ...currentNotes,
                    [file.id]: event.target.value,
                  }))
                }
                rows={3}
                className="mt-2 w-full rounded-lg border border-[#dcebea] bg-white px-3 py-2 text-sm text-[#071a2f] outline-none transition focus:border-[#39b8bb]"
                placeholder="Indicá qué cambios debería realizar la persona que cargó el archivo."
              />
            </label>

            <label className="mt-4 block">
              <span className="text-xs font-bold text-[#52708a]">
                Motivo de rechazo
              </span>
              <textarea
                value={rejectionReasons[file.id] ?? ""}
                onChange={(event) =>
                  setRejectionReasons((currentReasons) => ({
                    ...currentReasons,
                    [file.id]: event.target.value,
                  }))
                }
                rows={3}
                className="mt-2 w-full rounded-lg border border-[#dcebea] bg-white px-3 py-2 text-sm text-[#071a2f] outline-none transition focus:border-[#39b8bb]"
                placeholder="Explicá brevemente por qué se rechaza el archivo."
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                disabled={updatingFileId === file.id}
                onClick={() => updateFileStatus(file, "approved")}
                className="rounded-full bg-[#39b8bb] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:bg-[#5fd0d2] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Aprobar
              </button>

              <button
                type="button"
                disabled={updatingFileId === file.id}
                onClick={() => updateFileStatus(file, "changes_requested")}
                className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Solicitar cambios
              </button>

              <button
                type="button"
                disabled={updatingFileId === file.id}
                onClick={() => updateFileStatus(file, "rejected")}
                className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Rechazar
              </button>

              <button
                type="button"
                disabled={updatingFileId === file.id}
                onClick={() => updateFileStatus(file, "archived")}
                className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#52708a] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Archivar
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
