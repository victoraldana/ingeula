"use client";

import { useState } from "react";
import {
  Pin,
  FileText,
  Download,
  ExternalLink,
  Youtube,
  Eye,
  X,
  FolderDown,
  Newspaper,
} from "lucide-react";
import type { PortalPost, PortalResource, PortalVideo } from "@/lib/types";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

interface SchoolDynamicContentProps {
  schoolShortName: string;
  posts: PortalPost[];
  resources: PortalResource[];
  videos: PortalVideo[];
}

function formatSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SchoolDynamicContent({
  schoolShortName,
  posts,
  resources,
  videos,
}: SchoolDynamicContentProps) {
  const [expandedPostId, setExpandedPostId] = useState<string | null>(
    posts[0]?.id ?? null
  );
  const [previewResource, setPreviewResource] = useState<PortalResource | null>(
    null
  );

  const hasAnyContent =
    posts.length > 0 || resources.length > 0 || videos.length > 0;

  if (!hasAnyContent) {
    return null;
  }

  return (
    <div className="space-y-14">
      {/* 1. Posts / Información de Relevancia */}
      {posts.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0039A6]">
            <Newspaper className="h-4 w-4" />
            <span>Publicaciones Oficiales</span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#001A4D]">
            Información de Relevancia — {schoolShortName}
          </h2>

          <div className="mt-5 space-y-4">
            {posts.map((post) => {
              const isExpanded = expandedPostId === post.id;
              return (
                <article
                  key={post.id}
                  className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {post.coverImage && (
                    <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-sm bg-[#EBF2FF] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#0039A6]">
                        {post.category}
                      </span>
                      {post.pinned && (
                        <span className="inline-flex items-center gap-1 rounded-sm bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                          <Pin className="h-3 w-3" />
                          Destacado
                        </span>
                      )}
                      <span className="text-xs text-slate-400">
                        {new Date(post.createdAt).toLocaleDateString("es-VE", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="mt-3 text-xl font-bold text-[#001A4D]">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {post.summary}
                    </p>

                    {isExpanded && (
                      <div className="mt-4 whitespace-pre-line border-t border-slate-100 pt-4 text-sm leading-relaxed text-slate-700">
                        {post.content}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                      <span className="text-xs text-slate-400">
                        Publicado por {post.authorName}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedPostId(isExpanded ? null : post.id)
                        }
                        className="text-xs font-bold uppercase tracking-wider text-[#0039A6] hover:text-[#001A4D]"
                      >
                        {isExpanded ? "Ocultar detalle" : "Leer completo →"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Recursos de Interés (Flujogramas, PDFs, Guías) */}
      {resources.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0039A6]">
            <FolderDown className="h-4 w-4" />
            <span>Descargas y Documentos</span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#001A4D]">
            Recursos de Interés (Flujogramas y PDFs)
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {resources.map((res) => {
              const isImage = res.fileMime.startsWith("image/");
              return (
                <div
                  key={res.id}
                  className="flex flex-col justify-between rounded-md border border-slate-200 bg-[#F8FAFC] p-5 transition-all hover:border-[#0039A6]/40 hover:bg-white hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-sm bg-[#EBF2FF] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#0039A6]">
                        <FileText className="h-3.5 w-3.5" />
                        {res.resourceType}
                      </span>
                      {res.fileSizeBytes && (
                        <span className="text-[11px] font-medium text-slate-400">
                          {formatSize(res.fileSizeBytes)}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 text-base font-bold text-[#001A4D]">
                      {res.title}
                    </h3>
                    {res.description && (
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                        {res.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-200/70 pt-4">
                    {isImage && (
                      <button
                        type="button"
                        onClick={() => setPreviewResource(res)}
                        className="inline-flex items-center gap-1.5 rounded-sm border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-[#0039A6] hover:text-[#0039A6]"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Vista previa
                      </button>
                    )}
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download={!res.isExternal ? res.fileName : undefined}
                      className="inline-flex items-center gap-1.5 rounded-sm bg-[#0039A6] px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#002B7F]"
                    >
                      {res.isExternal ? (
                        <>
                          Abrir recurso
                          <ExternalLink className="h-3.5 w-3.5" />
                        </>
                      ) : (
                        <>
                          Descargar / Abrir
                          <Download className="h-3.5 w-3.5" />
                        </>
                      )}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. Videos de YouTube */}
      {videos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0039A6]">
            <Youtube className="h-4 w-4" />
            <span>Material Audiovisual</span>
          </div>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#001A4D]">
            Videos Destacados
          </h2>

          <div className="mt-5 grid gap-6 sm:grid-cols-2">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm"
              >
                <div className="aspect-video w-full bg-black">
                  <iframe
                    src={getYouTubeEmbedUrl(vid.youtubeId)}
                    title={vid.title}
                    className="h-full w-full"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-4">
                  <span className="rounded-sm bg-[#EBF2FF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0039A6]">
                    {vid.category}
                  </span>
                  <h3 className="mt-2 text-base font-bold text-[#001A4D]">
                    {vid.title}
                  </h3>
                  {vid.description && (
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                      {vid.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Image / Flujograma Lightbox Modal */}
      {previewResource && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#001A4D]/80 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={previewResource.title}
          onClick={() => setPreviewResource(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-md bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3.5">
              <div>
                <p className="text-sm font-bold text-[#001A4D]">
                  {previewResource.title}
                </p>
                <p className="text-xs text-slate-500">
                  {previewResource.resourceType}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewResource(null)}
                aria-label="Cerrar vista previa"
                className="rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto bg-slate-100 p-4">
              <img
                src={previewResource.fileUrl}
                alt={previewResource.title}
                className="mx-auto max-h-[68vh] w-auto rounded object-contain shadow"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
