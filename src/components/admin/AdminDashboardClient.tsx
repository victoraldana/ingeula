"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  FolderUp,
  Youtube,
  Users,
  LogOut,
  Plus,
  Trash2,
  Pin,
  ExternalLink,
  Shield,
  CheckCircle2,
  AlertCircle,
  Upload,
  Link2,
  UserCheck,
  UserX,
  FileSpreadsheet,
  Image as ImageIcon,
} from "lucide-react";
import {
  ALL_SCOPES,
  ROLE_LABELS,
  SCOPE_LABELS,
  type ContentScope,
  type PortalPost,
  type PortalResource,
  type PortalVideo,
  type PostCategory,
  type ResourceType,
  type SafePortalUser,
  type UserRole,
  type VideoCategory,
} from "@/lib/types";
import { extractYouTubeId, getYouTubeEmbedUrl } from "@/lib/youtube";

type AdminTab = "posts" | "resources" | "videos" | "users";

interface AdminDashboardClientProps {
  currentUser: SafePortalUser;
  allowedScopes: ContentScope[];
  initialPosts: PortalPost[];
  initialResources: PortalResource[];
  initialVideos: PortalVideo[];
  initialUsers: SafePortalUser[];
}

function getScopePublicHref(scope: ContentScope): string {
  return scope === "facultad" ? "/#noticias" : `/escuelas/${scope}`;
}

function formatFileSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdminDashboardClient({
  currentUser,
  allowedScopes,
  initialPosts,
  initialResources,
  initialVideos,
  initialUsers,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const isSuperAdmin = currentUser.role === "super_admin";

  const [activeTab, setActiveTab] = useState<AdminTab>("posts");
  const [scopeFilter, setScopeFilter] = useState<ContentScope | "all">("all");
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Live state
  const [posts, setPosts] = useState<PortalPost[]>(initialPosts);
  const [resources, setResources] = useState<PortalResource[]>(initialResources);
  const [videos, setVideos] = useState<PortalVideo[]>(initialVideos);
  const [users, setUsers] = useState<SafePortalUser[]>(initialUsers);

  // Default scope for creation forms
  const defaultScope: ContentScope = allowedScopes[0] || "electrica";

  // --- POST FORM STATE ---
  const [postScope, setPostScope] = useState<ContentScope>(defaultScope);
  const [postTitle, setPostTitle] = useState("");
  const [postCategory, setPostCategory] = useState<PostCategory>("Aviso");
  const [postSummary, setPostSummary] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postPinned, setPostPinned] = useState(false);
  const [postCoverFile, setPostCoverFile] = useState<File | null>(null);
  const [postSubmitting, setPostSubmitting] = useState(false);

  // --- RESOURCE FORM STATE ---
  const [resScope, setResScope] = useState<ContentScope>(defaultScope);
  const [resTitle, setResTitle] = useState("");
  const [resType, setResType] = useState<ResourceType>("Flujograma");
  const [resDescription, setResDescription] = useState("");
  const [resSourceMode, setResSourceMode] = useState<"upload" | "link">("upload");
  const [resFile, setResFile] = useState<File | null>(null);
  const [resExternalUrl, setResExternalUrl] = useState("");
  const [resSubmitting, setResSubmitting] = useState(false);

  // --- VIDEO FORM STATE ---
  const [vidScope, setVidScope] = useState<ContentScope>(defaultScope);
  const [vidTitle, setVidTitle] = useState("");
  const [vidCategory, setVidCategory] = useState<VideoCategory>("Clase Magistral");
  const [vidUrl, setVidUrl] = useState("");
  const [vidDescription, setVidDescription] = useState("");
  const [vidSubmitting, setVidSubmitting] = useState(false);

  const previewYouTubeId = useMemo(() => extractYouTubeId(vidUrl), [vidUrl]);

  // --- USER FORM STATE (super_admin only) ---
  const [usrName, setUsrName] = useState("");
  const [usrEmail, setUsrEmail] = useState("");
  const [usrPassword, setUsrPassword] = useState("");
  const [usrRole, setUsrRole] = useState<UserRole>("school_admin");
  const [usrScopes, setUsrScopes] = useState<ContentScope[]>(["electrica"]);
  const [usrSubmitting, setUsrSubmitting] = useState(false);

  function notify(type: "success" | "error", message: string) {
    setFeedback({ type, message });
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  // --- POSTS ACTIONS ---
  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    setPostSubmitting(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append("scope", postScope);
      formData.append("title", postTitle);
      formData.append("category", postCategory);
      formData.append("summary", postSummary);
      formData.append("content", postContent);
      formData.append("pinned", String(postPinned));
      if (postCoverFile) {
        formData.append("coverFile", postCoverFile);
      }

      const res = await fetch("/api/admin/posts", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as { post?: PortalPost; error?: string };
      if (!res.ok || !data.post) {
        notify("error", data.error || "No se pudo publicar el post.");
        return;
      }

      setPosts((prev) => [data.post!, ...prev]);
      setPostTitle("");
      setPostSummary("");
      setPostContent("");
      setPostPinned(false);
      setPostCoverFile(null);
      notify(
        "success",
        `Publicación creada en ${SCOPE_LABELS[data.post.scope]}. Ya está visible en el portal.`
      );
    } catch {
      notify("error", "Error al crear la publicación.");
    } finally {
      setPostSubmitting(false);
    }
  }

  async function handleTogglePinPost(post: PortalPost) {
    const res = await fetch(`/api/admin/posts/${post.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pinned: !post.pinned }),
    });
    const data = (await res.json()) as { post?: PortalPost; error?: string };
    if (!res.ok || !data.post) {
      notify("error", data.error || "No se pudo actualizar el post.");
      return;
    }
    setPosts((prev) => prev.map((p) => (p.id === post.id ? data.post! : p)));
  }

  async function handleDeletePost(id: string) {
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    if (!res.ok) {
      notify("error", "No se pudo eliminar la publicación.");
      return;
    }
    setPosts((prev) => prev.filter((p) => p.id !== id));
    notify("success", "Publicación eliminada.");
  }

  // --- RESOURCES ACTIONS ---
  async function handleCreateResource(e: React.FormEvent) {
    e.preventDefault();
    setResSubmitting(true);
    setFeedback(null);

    try {
      const formData = new FormData();
      formData.append("scope", resScope);
      formData.append("title", resTitle);
      formData.append("resourceType", resType);
      formData.append("description", resDescription);

      if (resSourceMode === "upload" && resFile) {
        formData.append("file", resFile);
      } else if (resSourceMode === "link" && resExternalUrl) {
        formData.append("externalUrl", resExternalUrl);
      }

      const res = await fetch("/api/admin/resources", {
        method: "POST",
        body: formData,
      });
      const data = (await res.json()) as {
        resource?: PortalResource;
        error?: string;
      };
      if (!res.ok || !data.resource) {
        notify("error", data.error || "No se pudo subir el recurso.");
        return;
      }

      setResources((prev) => [data.resource!, ...prev]);
      setResTitle("");
      setResDescription("");
      setResFile(null);
      setResExternalUrl("");
      notify(
        "success",
        `Recurso "${data.resource.title}" publicado en ${SCOPE_LABELS[data.resource.scope]}.`
      );
    } catch {
      notify("error", "Error al subir el recurso.");
    } finally {
      setResSubmitting(false);
    }
  }

  async function handleDeleteResource(id: string) {
    const res = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    if (!res.ok) {
      notify("error", "No se pudo eliminar el recurso.");
      return;
    }
    setResources((prev) => prev.filter((r) => r.id !== id));
    notify("success", "Recurso eliminado.");
  }

  // --- VIDEOS ACTIONS ---
  async function handleCreateVideo(e: React.FormEvent) {
    e.preventDefault();
    setVidSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: vidScope,
          title: vidTitle,
          category: vidCategory,
          description: vidDescription,
          youtubeUrl: vidUrl,
        }),
      });
      const data = (await res.json()) as { video?: PortalVideo; error?: string };
      if (!res.ok || !data.video) {
        notify("error", data.error || "No se pudo agregar el video.");
        return;
      }

      setVideos((prev) => [data.video!, ...prev]);
      setVidTitle("");
      setVidUrl("");
      setVidDescription("");
      notify(
        "success",
        `Video incrustado en ${SCOPE_LABELS[data.video.scope]}. Ya está disponible en la sección.`
      );
    } catch {
      notify("error", "Error al guardar el video.");
    } finally {
      setVidSubmitting(false);
    }
  }

  async function handleDeleteVideo(id: string) {
    const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    if (!res.ok) {
      notify("error", "No se pudo eliminar el video.");
      return;
    }
    setVideos((prev) => prev.filter((v) => v.id !== id));
    notify("success", "Video eliminado.");
  }

  // --- USERS ACTIONS (super_admin) ---
  function toggleUserScope(scope: ContentScope) {
    setUsrScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope]
    );
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setUsrSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: usrName,
          email: usrEmail,
          password: usrPassword,
          role: usrRole,
          assignedScopes: usrRole === "super_admin" ? ALL_SCOPES : usrScopes,
        }),
      });
      const data = (await res.json()) as {
        user?: SafePortalUser;
        error?: string;
      };
      if (!res.ok || !data.user) {
        notify("error", data.error || "No se pudo crear el usuario.");
        return;
      }

      setUsers((prev) => [...prev, data.user!]);
      setUsrName("");
      setUsrEmail("");
      setUsrPassword("");
      notify(
        "success",
        `Usuario ${data.user.name} (${ROLE_LABELS[data.user.role]}) creado correctamente.`
      );
    } catch {
      notify("error", "Error al crear el usuario.");
    } finally {
      setUsrSubmitting(false);
    }
  }

  async function handleToggleUserActive(target: SafePortalUser) {
    const res = await fetch(`/api/admin/users/${target.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !target.active }),
    });
    const data = (await res.json()) as {
      user?: SafePortalUser;
      error?: string;
    };
    if (!res.ok || !data.user) {
      notify("error", data.error || "No se pudo cambiar el estado del usuario.");
      return;
    }
    setUsers((prev) => prev.map((u) => (u.id === target.id ? data.user! : u)));
  }

  async function handleDeleteUser(target: SafePortalUser) {
    const res = await fetch(`/api/admin/users/${target.id}`, {
      method: "DELETE",
    });
    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      notify("error", data.error || "No se pudo eliminar el usuario.");
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== target.id));
    notify("success", `Usuario ${target.name} eliminado.`);
  }

  // Filtered views
  const filteredPosts =
    scopeFilter === "all" ? posts : posts.filter((p) => p.scope === scopeFilter);
  const filteredResources =
    scopeFilter === "all"
      ? resources
      : resources.filter((r) => r.scope === scopeFilter);
  const filteredVideos =
    scopeFilter === "all"
      ? videos
      : videos.filter((v) => v.scope === scopeFilter);

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-20">
      {/* Top Admin Header Strip */}
      <section className="bg-[#001A4D] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-sm bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">
                <Shield className="h-3.5 w-3.5" />
                {ROLE_LABELS[currentUser.role]}
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Panel de Administración IngeULA
              </h1>
              <p className="mt-1.5 text-sm text-blue-100/80">
                Sesión activa: <strong className="text-white">{currentUser.name}</strong> (
                {currentUser.email})
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {allowedScopes.map((scope) => (
                  <Link
                    key={scope}
                    href={getScopePublicHref(scope)}
                    className="inline-flex items-center gap-1 rounded-sm bg-[#0039A6] px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-blue-600"
                  >
                    {SCOPE_LABELS[scope]}
                    <ExternalLink className="h-3 w-3 opacity-80" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-sm border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#001A4D]"
              >
                Ver Portal Público
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-sm bg-red-600/90 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-red-700"
              >
                <LogOut className="h-3.5 w-3.5" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        {/* Live Metrics */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Posts Publicados
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#0039A6]">{posts.length}</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Recursos (PDF / Flujogramas)
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#0039A6]">
              {resources.length}
            </p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Videos de YouTube
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#0039A6]">{videos.length}</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-white p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isSuperAdmin ? "Usuarios Registrados" : "Secciones Asignadas"}
            </p>
            <p className="mt-2 text-3xl font-extrabold text-[#0039A6]">
              {isSuperAdmin ? users.length : allowedScopes.length}
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mt-6 flex items-center justify-between rounded-md border px-4 py-3 text-sm font-medium ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <span className="flex items-center gap-2">
              {feedback.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              {feedback.message}
            </span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="text-xs font-bold underline"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Navigation Tabs + Scope Filter */}
        <div className="mt-8 flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-center">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              className={`inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-bold transition-colors ${
                activeTab === "posts"
                  ? "bg-[#0039A6] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[#0039A6] hover:text-[#0039A6]"
              }`}
            >
              <FileText className="h-4 w-4" />
              Posts y Avisos ({posts.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("resources")}
              className={`inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-bold transition-colors ${
                activeTab === "resources"
                  ? "bg-[#0039A6] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[#0039A6] hover:text-[#0039A6]"
              }`}
            >
              <FolderUp className="h-4 w-4" />
              Recursos y Flujogramas ({resources.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("videos")}
              className={`inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-bold transition-colors ${
                activeTab === "videos"
                  ? "bg-[#0039A6] text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[#0039A6] hover:text-[#0039A6]"
              }`}
            >
              <Youtube className="h-4 w-4" />
              Videos YouTube ({videos.length})
            </button>

            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => setActiveTab("users")}
                className={`inline-flex items-center gap-2 rounded-sm px-4 py-2.5 text-sm font-bold transition-colors ${
                  activeTab === "users"
                    ? "bg-[#001A4D] text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:border-[#001A4D] hover:text-[#001A4D]"
                }`}
              >
                <Users className="h-4 w-4" />
                Usuarios y Roles ({users.length})
              </button>
            )}
          </div>

          {activeTab !== "users" && allowedScopes.length > 1 && (
            <div className="flex items-center gap-2">
              <label
                htmlFor="scope-filter"
                className="text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Filtrar sección:
              </label>
              <select
                id="scope-filter"
                value={scopeFilter}
                onChange={(e) =>
                  setScopeFilter(e.target.value as ContentScope | "all")
                }
                className="rounded-sm border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 focus:border-[#0039A6] focus:outline-none"
              >
                <option value="all">Todas mis secciones</option>
                {allowedScopes.map((s) => (
                  <option key={s} value={s}>
                    {SCOPE_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* ==================== TAB 1: POSTS ==================== */}
        {activeTab === "posts" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            {/* Create Post Form */}
            <form
              onSubmit={handleCreatePost}
              className="space-y-4 rounded-md border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5"
            >
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#001A4D]">
                <Plus className="h-5 w-5 text-[#0039A6]" />
                Nueva Publicación / Información Relevante
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Sección destino
                  </label>
                  <select
                    value={postScope}
                    onChange={(e) => setPostScope(e.target.value as ContentScope)}
                    className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                  >
                    {allowedScopes.map((scope) => (
                      <option key={scope} value={scope}>
                        {SCOPE_LABELS[scope]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Categoría
                  </label>
                  <select
                    value={postCategory}
                    onChange={(e) =>
                      setPostCategory(e.target.value as PostCategory)
                    }
                    className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                  >
                    <option value="Aviso">Aviso</option>
                    <option value="Noticia">Noticia</option>
                    <option value="Académico">Académico</option>
                    <option value="Evento">Evento</option>
                    <option value="Investigación">Investigación</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Título
                </label>
                <input
                  type="text"
                  required
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="Ej. Cronograma de inscripciones semestre A-2026"
                  className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Resumen corto
                </label>
                <textarea
                  rows={2}
                  required
                  value={postSummary}
                  onChange={(e) => setPostSummary(e.target.value)}
                  placeholder="Breve descripción visible en la tarjeta principal..."
                  className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Contenido completo
                </label>
                <textarea
                  rows={5}
                  required
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  placeholder="Escribe aquí todos los detalles, fechas, requisitos o enlaces..."
                  className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Imagen de portada (opcional)
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  onChange={(e) => setPostCoverFile(e.target.files?.[0] || null)}
                  className="mt-1.5 block w-full text-xs text-slate-600 file:mr-3 file:rounded-sm file:border-0 file:bg-[#EBF2FF] file:px-3 file:py-2 file:text-xs file:font-bold file:text-[#0039A6] hover:file:bg-blue-100"
                />
              </div>

              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={postPinned}
                  onChange={(e) => setPostPinned(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-[#0039A6]"
                />
                Fijar como publicación destacada al inicio de la sección
              </label>

              <button
                type="submit"
                disabled={postSubmitting}
                className="w-full rounded-sm bg-[#0039A6] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002B7F] disabled:opacity-60"
              >
                {postSubmitting ? "Publicando..." : "Publicar Información"}
              </button>
            </form>

            {/* Posts List */}
            <div className="space-y-4 lg:col-span-7">
              {filteredPosts.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                  No hay publicaciones en esta vista todavía. Crea la primera desde el
                  formulario.
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-sm bg-[#EBF2FF] px-2.5 py-0.5 text-[11px] font-bold text-[#0039A6]">
                          {SCOPE_LABELS[post.scope]}
                        </span>
                        <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                          {post.category}
                        </span>
                        {post.pinned && (
                          <span className="inline-flex items-center gap-1 rounded-sm bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                            <Pin className="h-3 w-3" />
                            Destacado
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={getScopePublicHref(post.scope)}
                          className="rounded-sm border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:border-[#0039A6] hover:text-[#0039A6]"
                        >
                          Ver en portal
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleTogglePinPost(post)}
                          title="Fijar / Desfijar"
                          className="rounded-sm border border-slate-200 p-1.5 text-slate-600 hover:border-amber-400 hover:text-amber-700"
                        >
                          <Pin className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePost(post.id)}
                          title="Eliminar publicación"
                          className="rounded-sm border border-slate-200 p-1.5 text-slate-600 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-[#001A4D]">
                      {post.title}
                    </h3>
                    <p className="mt-1.5 text-sm text-slate-600">{post.summary}</p>
                    <p className="mt-3 text-xs text-slate-400">
                      Por {post.authorName} ·{" "}
                      {new Date(post.createdAt).toLocaleDateString("es-VE", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </article>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 2: RESOURCES (PDF / FLUJOGRAMAS) ==================== */}
        {activeTab === "resources" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <form
              onSubmit={handleCreateResource}
              className="space-y-4 rounded-md border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5"
            >
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#001A4D]">
                <FolderUp className="h-5 w-5 text-[#0039A6]" />
                Subir Recurso (Flujograma, PDF, Guía)
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Sección destino
                  </label>
                  <select
                    value={resScope}
                    onChange={(e) => setResScope(e.target.value as ContentScope)}
                    className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                  >
                    {allowedScopes.map((scope) => (
                      <option key={scope} value={scope}>
                        {SCOPE_LABELS[scope]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Tipo de recurso
                  </label>
                  <select
                    value={resType}
                    onChange={(e) => setResType(e.target.value as ResourceType)}
                    className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                  >
                    <option value="Flujograma">Flujograma</option>
                    <option value="Pensum / PDF">Pensum / PDF</option>
                    <option value="Guía / Normativa">Guía / Normativa</option>
                    <option value="Horario">Horario</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Título del recurso
                </label>
                <input
                  type="text"
                  required
                  value={resTitle}
                  onChange={(e) => setResTitle(e.target.value)}
                  placeholder="Ej. Flujograma de Prelaciones Ingeniería Eléctrica 2026"
                  className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={resDescription}
                  onChange={(e) => setResDescription(e.target.value)}
                  placeholder="Indicaciones o versión del documento..."
                  className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                />
              </div>

              {/* Upload Mode Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setResSourceMode("upload")}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-sm border px-3 py-2 text-xs font-bold ${
                    resSourceMode === "upload"
                      ? "border-[#0039A6] bg-[#EBF2FF] text-[#0039A6]"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" />
                  Subir archivo (PDF / Imagen)
                </button>
                <button
                  type="button"
                  onClick={() => setResSourceMode("link")}
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-sm border px-3 py-2 text-xs font-bold ${
                    resSourceMode === "link"
                      ? "border-[#0039A6] bg-[#EBF2FF] text-[#0039A6]"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <Link2 className="h-3.5 w-3.5" />
                  Enlace externo
                </button>
              </div>

              {resSourceMode === "upload" ? (
                <div className="rounded-sm border border-dashed border-slate-300 bg-[#F8FAFC] p-4">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.svg,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                    onChange={(e) => setResFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-slate-600 file:mr-3 file:rounded-sm file:border-0 file:bg-[#0039A6] file:px-3 file:py-2 file:text-xs file:font-bold file:text-white hover:file:bg-[#002B7F]"
                  />
                  <p className="mt-2 text-[11px] text-slate-500">
                    Soporta PDF, PNG, JPG, SVG, WebP y documentos Office (máx. 15 MB).
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    URL del recurso (Google Drive, PDF, repositorio)
                  </label>
                  <input
                    type="url"
                    value={resExternalUrl}
                    onChange={(e) => setResExternalUrl(e.target.value)}
                    placeholder="https://..."
                    className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={resSubmitting}
                className="w-full rounded-sm bg-[#0039A6] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002B7F] disabled:opacity-60"
              >
                {resSubmitting ? "Guardando recurso..." : "Publicar Recurso"}
              </button>
            </form>

            {/* Resources List */}
            <div className="space-y-4 lg:col-span-7">
              {filteredResources.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                  No hay recursos cargados en esta sección todavía.
                </div>
              ) : (
                filteredResources.map((item) => {
                  const isImage = item.fileMime.startsWith("image/");
                  return (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-[#EBF2FF] text-[#0039A6]">
                          {isImage ? (
                            <ImageIcon className="h-5 w-5" />
                          ) : (
                            <FileSpreadsheet className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-sm bg-[#EBF2FF] px-2 py-0.5 text-[11px] font-bold text-[#0039A6]">
                              {SCOPE_LABELS[item.scope]}
                            </span>
                            <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                              {item.resourceType}
                            </span>
                          </div>
                          <h3 className="mt-1.5 text-base font-bold text-[#001A4D]">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="mt-1 text-xs text-slate-600">
                              {item.description}
                            </p>
                          )}
                          <p className="mt-1.5 text-[11px] text-slate-400">
                            {item.fileName}
                            {item.fileSizeBytes
                              ? ` · ${formatFileSize(item.fileSizeBytes)}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-2">
                        <a
                          href={item.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-sm border border-[#0039A6] px-3 py-1.5 text-xs font-bold text-[#0039A6] hover:bg-[#0039A6] hover:text-white"
                        >
                          Abrir
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => handleDeleteResource(item.id)}
                          title="Eliminar recurso"
                          className="rounded-sm border border-slate-200 p-1.5 text-slate-600 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 3: YOUTUBE VIDEOS ==================== */}
        {activeTab === "videos" && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            <form
              onSubmit={handleCreateVideo}
              className="space-y-4 rounded-md border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5"
            >
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#001A4D]">
                <Youtube className="h-5 w-5 text-red-600" />
                Incrustar Video de YouTube
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Sección destino
                  </label>
                  <select
                    value={vidScope}
                    onChange={(e) => setVidScope(e.target.value as ContentScope)}
                    className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                  >
                    {allowedScopes.map((scope) => (
                      <option key={scope} value={scope}>
                        {SCOPE_LABELS[scope]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Categoría
                  </label>
                  <select
                    value={vidCategory}
                    onChange={(e) =>
                      setVidCategory(e.target.value as VideoCategory)
                    }
                    className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                  >
                    <option value="Clase Magistral">Clase Magistral</option>
                    <option value="Laboratorio">Laboratorio</option>
                    <option value="Charla / Evento">Charla / Evento</option>
                    <option value="Recorrido">Recorrido</option>
                    <option value="Tutorial">Tutorial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Título del video
                </label>
                <input
                  type="text"
                  required
                  value={vidTitle}
                  onChange={(e) => setVidTitle(e.target.value)}
                  placeholder="Ej. Práctica de Laboratorio de Alta Tensión"
                  className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Enlace de YouTube
                </label>
                <input
                  type="url"
                  required
                  value={vidUrl}
                  onChange={(e) => setVidUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                />
              </div>

              {/* Instant Preview */}
              {previewYouTubeId && (
                <div className="overflow-hidden rounded-sm border border-slate-200 bg-black">
                  <div className="aspect-video w-full">
                    <iframe
                      src={getYouTubeEmbedUrl(previewYouTubeId)}
                      title="Vista previa de YouTube"
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Descripción
                </label>
                <textarea
                  rows={2}
                  value={vidDescription}
                  onChange={(e) => setVidDescription(e.target.value)}
                  placeholder="Contexto del video o profesor/ponente..."
                  className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={vidSubmitting}
                className="w-full rounded-sm bg-[#0039A6] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002B7F] disabled:opacity-60"
              >
                {vidSubmitting ? "Guardando..." : "Publicar Video de YouTube"}
              </button>
            </form>

            {/* Videos Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
              {filteredVideos.length === 0 ? (
                <div className="sm:col-span-2 rounded-md border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
                  No hay videos incrustados todavía.
                </div>
              ) : (
                filteredVideos.map((vid) => (
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
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-sm bg-[#EBF2FF] px-2 py-0.5 text-[11px] font-bold text-[#0039A6]">
                          {SCOPE_LABELS[vid.scope]}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteVideo(vid.id)}
                          title="Eliminar video"
                          className="rounded-sm border border-slate-200 p-1 text-slate-500 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <h3 className="mt-2 text-sm font-bold text-[#001A4D]">
                        {vid.title}
                      </h3>
                      {vid.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                          {vid.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: USERS & ROLES (SUPER ADMIN ONLY) ==================== */}
        {activeTab === "users" && isSuperAdmin && (
          <div className="mt-8 grid gap-8 lg:grid-cols-12">
            {/* Create User Form */}
            <form
              onSubmit={handleCreateUser}
              className="space-y-4 rounded-md border border-slate-200 bg-white p-6 shadow-sm lg:col-span-5"
            >
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#001A4D]">
                <Users className="h-5 w-5 text-[#0039A6]" />
                Crear Usuario y Asignar Rol
              </h2>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Nombre completo / Cargo
                </label>
                <input
                  type="text"
                  required
                  value={usrName}
                  onChange={(e) => setUsrName(e.target.value)}
                  placeholder="Ej. Prof. Carlos Pérez (Escuela de Sistemas)"
                  className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  required
                  value={usrEmail}
                  onChange={(e) => setUsrEmail(e.target.value)}
                  placeholder="sistemas@ingeula.org"
                  className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Contraseña inicial
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={usrPassword}
                  onChange={(e) => setUsrPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Rol asignado
                </label>
                <select
                  value={usrRole}
                  onChange={(e) => setUsrRole(e.target.value as UserRole)}
                  className="mt-1.5 w-full rounded-sm border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none"
                >
                  <option value="school_admin">
                    Administrador de Escuela (gestiona sus escuelas asignadas)
                  </option>
                  <option value="editor">
                    Editor de Contenidos (publica posts, recursos y videos)
                  </option>
                  <option value="super_admin">
                    Super Administrador (acceso total + gestión de usuarios)
                  </option>
                </select>
              </div>

              {usrRole !== "super_admin" && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Escuelas / Secciones que puede administrar
                  </label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {ALL_SCOPES.map((scope) => {
                      const checked = usrScopes.includes(scope);
                      return (
                        <label
                          key={scope}
                          className={`flex cursor-pointer items-center gap-2 rounded-sm border px-3 py-2 text-xs font-semibold transition-colors ${
                            checked
                              ? "border-[#0039A6] bg-[#EBF2FF] text-[#0039A6]"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleUserScope(scope)}
                            className="h-3.5 w-3.5 rounded text-[#0039A6]"
                          />
                          <span>{SCOPE_LABELS[scope]}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={usrSubmitting}
                className="w-full rounded-sm bg-[#001A4D] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0039A6] disabled:opacity-60"
              >
                {usrSubmitting ? "Creando usuario..." : "Crear Usuario"}
              </button>
            </form>

            {/* Users List */}
            <div className="space-y-3 lg:col-span-7">
              {users.map((u) => {
                const isSelf = u.id === currentUser.id;
                return (
                  <div
                    key={u.id}
                    className="flex flex-col justify-between gap-4 rounded-md border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base font-bold text-[#001A4D]">
                          {u.name}
                        </span>
                        <span
                          className={`rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            u.role === "super_admin"
                              ? "bg-[#001A4D] text-white"
                              : "bg-[#EBF2FF] text-[#0039A6]"
                          }`}
                        >
                          {ROLE_LABELS[u.role]}
                        </span>
                        {!u.active && (
                          <span className="rounded-sm bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase text-red-700">
                            Inactivo
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">{u.email}</p>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {u.assignedScopes.map((scope) => (
                          <span
                            key={scope}
                            className="rounded-sm bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700"
                          >
                            {SCOPE_LABELS[scope]}
                          </span>
                        ))}
                      </div>
                    </div>

                    {!isSelf && (
                      <div className="flex shrink-0 items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleUserActive(u)}
                          title={u.active ? "Desactivar cuenta" : "Activar cuenta"}
                          className="inline-flex items-center gap-1 rounded-sm border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-[#0039A6] hover:text-[#0039A6]"
                        >
                          {u.active ? (
                            <>
                              <UserX className="h-3.5 w-3.5" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3.5 w-3.5" />
                              Activar
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(u)}
                          title="Eliminar usuario"
                          className="rounded-sm border border-slate-200 p-1.5 text-slate-500 hover:border-red-300 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
