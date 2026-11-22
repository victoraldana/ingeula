import type { SchoolSlug } from "@/data/schools";

export type ContentScope = "facultad" | SchoolSlug;

export type UserRole = "super_admin" | "school_admin" | "editor";

export interface PortalUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  assignedScopes: ContentScope[];
  active: boolean;
  createdAt: string;
}

export type SafePortalUser = Omit<PortalUser, "passwordHash">;

export type PostCategory =
  | "Aviso"
  | "Noticia"
  | "Académico"
  | "Evento"
  | "Investigación";

export interface PortalPost {
  id: string;
  scope: ContentScope;
  title: string;
  category: PostCategory;
  summary: string;
  content: string;
  coverImage?: string;
  pinned: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export type ResourceType =
  | "Flujograma"
  | "Pensum / PDF"
  | "Guía / Normativa"
  | "Horario"
  | "Otro";

export interface PortalResource {
  id: string;
  scope: ContentScope;
  title: string;
  resourceType: ResourceType;
  description: string;
  fileUrl: string;
  fileName: string;
  fileMime: string;
  fileSizeBytes?: number;
  isExternal: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export type VideoCategory =
  | "Clase Magistral"
  | "Laboratorio"
  | "Charla / Evento"
  | "Recorrido"
  | "Tutorial";

export interface PortalVideo {
  id: string;
  scope: ContentScope;
  title: string;
  category: VideoCategory;
  description: string;
  youtubeUrl: string;
  youtubeId: string;
  authorId: string;
  authorName: string;
  createdAt: string;
}

export interface PortalDatabase {
  users: PortalUser[];
  posts: PortalPost[];
  resources: PortalResource[];
  videos: PortalVideo[];
}

export const SCOPE_LABELS: Record<ContentScope, string> = {
  facultad: "Facultad General",
  sistemas: "Ingeniería de Sistemas",
  electrica: "Ingeniería Eléctrica",
  civil: "Ingeniería Civil",
  mecanica: "Ingeniería Mecánica",
  quimica: "Ingeniería Química",
};

export const ALL_SCOPES: ContentScope[] = [
  "facultad",
  "sistemas",
  "electrica",
  "civil",
  "mecanica",
  "quimica",
];

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Administrador (Facultad)",
  school_admin: "Administrador de Escuela",
  editor: "Editor de Contenidos",
};
