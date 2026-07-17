"use client";

import { useCallback, useEffect, useState } from "react";
import {
  adminApiClient,
  adminApiPatchClient,
  apiPostClient,
  apiFormDataPostClient,
} from "@/lib/api-client";
import { createSupabaseBrowserClient } from "@/lib/supabase-client";
import type {
  CreateMediaFilePayload,
  MediaFile,
  MediaFileStatus,
  PaginatedMediaFilesResponse,
  UpdateMediaFileStatusPayload,
  UploadedStorageFile,
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

const emptyUploadForm = {
  section: "general",
  uploaded_by_name: "",
  uploaded_by_email: "",
};

const mediaFilesPageSize = 10;
type MediaFileStatusFilter = MediaFileStatus | "all";

export function MediaFilesPanel() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({
    page: 1,
    limit: mediaFilesPageSize,
    total: 0,
    total_pages: 1,
  });
  const [statusFilter, setStatusFilter] =
    useState<MediaFileStatusFilter>("all");
  const [sectionFilter, setSectionFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadForm, setUploadForm] = useState(emptyUploadForm);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingFileId, setUpdatingFileId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [rejectionReasons, setRejectionReasons] = useState<
    Record<string, string>
  >({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploadFormOpen, setIsUploadFormOpen] = useState(false);
  const hasActiveFilters =
    statusFilter !== "all" ||
    sectionFilter.trim() !== "" ||
    searchTerm.trim() !== "";

  const loadFiles = useCallback(async () => {
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
        limit: String(mediaFilesPageSize),
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      if (sectionFilter.trim()) {
        params.set("section", sectionFilter.trim());
      }

      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      }

      const adminFilesResponse =
        await adminApiClient<PaginatedMediaFilesResponse>(
          `/api/media-files/admin?${params.toString()}`,
          {
            accessToken: data.session.access_token,
          },
        );

      setFiles(adminFilesResponse.items);
      setPaginationMeta(adminFilesResponse.meta);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar los archivos.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [page, searchTerm, sectionFilter, statusFilter]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadFiles();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadFiles]);

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

      void loadFiles();

      setSuccessMessage(`El archivo quedó en estado: ${statusLabels[status]}.`);
    } catch {
      setErrorMessage("No se pudo actualizar el archivo.");
    } finally {
      setUpdatingFileId(null);
    }
  };

  const uploadAndRegisterFile = async () => {
    try {
      setIsUploading(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (!selectedFile) {
        setErrorMessage("Seleccioná un archivo para subir.");
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);

      const uploadedFile = await apiFormDataPostClient<UploadedStorageFile>(
        `/api/storage/upload?section=${encodeURIComponent(uploadForm.section || "general")}`,
        formData,
      );

      await apiPostClient<MediaFile, CreateMediaFilePayload>(
        "/api/media-files",
        {
          ...uploadedFile,
          section: uploadForm.section.trim() || "general",
          uploaded_by_name: uploadForm.uploaded_by_name.trim() || null,
          uploaded_by_email: uploadForm.uploaded_by_email.trim() || null,
        },
      );

      void loadFiles();
      setSelectedFile(null);
      setUploadForm(emptyUploadForm);
      setIsUploadFormOpen(false);
      setSuccessMessage("El archivo fue subido y registrado correctamente.");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "No se pudo subir o registrar el archivo.",
      );
    } finally {
      setIsUploading(false);
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

      <section className="rounded-lg border border-[#dcebea] bg-white p-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#071a2f]">Archivos</h3>
            <p className="mt-1 text-sm text-[#52708a]">
              Subí documentos, imágenes o recursos para revisión administrativa.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsUploadFormOpen((currentValue) => !currentValue)}
            className="w-fit rounded-full bg-[#39b8bb] px-5 py-2.5 text-sm font-bold text-[#071a2f] transition hover:bg-[#5fd0d2]"
          >
            {isUploadFormOpen ? "Cerrar formulario" : "Subir nuevo archivo"}
          </button>
        </div>

        {isUploadFormOpen ? (
          <div className="mt-5 grid gap-4 border-t border-[#dcebea] pt-5">
            <label className="block">
              <span className="text-sm font-bold text-[#52708a]">Archivo</span>
              <input
                type="file"
                onChange={(event) =>
                  setSelectedFile(event.target.files?.[0] ?? null)
                }
                className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-3">
              <label className="block">
                <span className="text-sm font-bold text-[#52708a]">
                  Sección
                </span>
                <input
                  value={uploadForm.section}
                  onChange={(event) =>
                    setUploadForm((currentForm) => ({
                      ...currentForm,
                      section: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                  placeholder="blog"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-[#52708a]">
                  Nombre de quien sube
                </span>
                <input
                  value={uploadForm.uploaded_by_name}
                  onChange={(event) =>
                    setUploadForm((currentForm) => ({
                      ...currentForm,
                      uploaded_by_name: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                  placeholder="Sofía Bartoli"
                />
              </label>

              <label className="block">
                <span className="text-sm font-bold text-[#52708a]">
                  Email de contacto
                </span>
                <input
                  value={uploadForm.uploaded_by_email}
                  onChange={(event) =>
                    setUploadForm((currentForm) => ({
                      ...currentForm,
                      uploaded_by_email: event.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
                  placeholder="correo@ejemplo.com"
                />
              </label>
            </div>

            <button
              type="button"
              disabled={isUploading}
              onClick={uploadAndRegisterFile}
              className="w-fit rounded-full bg-[#39b8bb] px-5 py-2.5 text-sm font-bold text-[#071a2f] transition hover:bg-[#5fd0d2] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Subir archivo
            </button>
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-[#dcebea] bg-white p-5">
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
              placeholder="Nombre del archivo o persona"
            />
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#52708a]">Estado</span>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as MediaFileStatusFilter);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="changes_requested">Cambios solicitados</option>
              <option value="approved">Aprobado</option>
              <option value="rejected">Rechazado</option>
              <option value="archived">Archivado</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-bold text-[#52708a]">Sección</span>
            <input
              value={sectionFilter}
              onChange={(event) => {
                setSectionFilter(event.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-[#dcebea] px-3 py-2 text-sm outline-none transition focus:border-[#39b8bb]"
              placeholder="general, blog, donation..."
            />
          </label>
        </div>
      </section>

      <div className="rounded-lg border border-[#dcebea] bg-white p-4">
        <p className="text-sm font-semibold text-[#52708a]">
          Archivos cargados
        </p>
        <p className="mt-1 text-3xl font-bold text-[#071a2f]">
          {paginationMeta.total}
        </p>
        <p className="mt-1 text-sm text-[#52708a]">
          Mostrando {files.length} resultados en esta página.
        </p>
      </div>

      {files.length === 0 ? (
        <div className="rounded-lg border border-[#dcebea] bg-white p-6 text-sm font-semibold text-[#52708a]">
          {hasActiveFilters
            ? "No hay archivos para los filtros seleccionados."
            : "Todavía no hay archivos cargados."}
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
              {file.status === "pending" ||
              file.status === "changes_requested" ? (
                <button
                  type="button"
                  disabled={updatingFileId === file.id}
                  onClick={() => updateFileStatus(file, "approved")}
                  className="rounded-full bg-[#39b8bb] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:bg-[#5fd0d2] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Aprobar
                </button>
              ) : null}

              {file.status === "pending" ? (
                <button
                  type="button"
                  disabled={updatingFileId === file.id}
                  onClick={() => updateFileStatus(file, "changes_requested")}
                  className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#071a2f] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Solicitar cambios
                </button>
              ) : null}

              {file.status === "pending" ||
              file.status === "changes_requested" ? (
                <button
                  type="button"
                  disabled={updatingFileId === file.id}
                  onClick={() => updateFileStatus(file, "rejected")}
                  className="rounded-full border border-red-200 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Rechazar
                </button>
              ) : null}

              {file.status !== "archived" ? (
                <button
                  type="button"
                  disabled={updatingFileId === file.id}
                  onClick={() => updateFileStatus(file, "archived")}
                  className="rounded-full border border-[#dcebea] px-4 py-2 text-xs font-bold text-[#52708a] transition hover:border-[#39b8bb] hover:text-[#168c91] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Archivar
                </button>
              ) : null}

              {file.status === "archived" ? (
                <p className="text-xs font-semibold text-[#52708a]">
                  Este archivo está archivado.
                </p>
              ) : null}
            </div>
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
