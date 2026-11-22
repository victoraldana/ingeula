import crypto from "crypto";
import fs from "fs";
import path from "path";
import { getUploadsRoot } from "./storage";
import type { ContentScope } from "./types";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024; // 15 MB

const ALLOWED_RESOURCE_EXTENSIONS = new Set([
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
]);

const ALLOWED_IMAGE_EXTENSIONS = new Set([
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".svg",
]);

const MIME_BY_EXT: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx":
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};

export function getMimeTypeFromFilename(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return MIME_BY_EXT[ext] || "application/octet-stream";
}

function sanitizeFilename(originalName: string): string {
  const ext = path.extname(originalName).toLowerCase();
  const base = path
    .basename(originalName, ext)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${base || "archivo"}${ext}`;
}

export interface SavedUploadResult {
  fileUrl: string;
  fileName: string;
  fileMime: string;
  fileSizeBytes: number;
}

export async function saveUploadedFile(
  file: File,
  scope: ContentScope,
  kind: "resource" | "cover"
): Promise<SavedUploadResult> {
  if (file.size === 0) {
    throw new Error("El archivo está vacío.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("El archivo supera el tamaño máximo permitido de 15 MB.");
  }

  const ext = path.extname(file.name).toLowerCase();
  const allowedSet =
    kind === "cover" ? ALLOWED_IMAGE_EXTENSIONS : ALLOWED_RESOURCE_EXTENSIONS;

  if (!allowedSet.has(ext)) {
    throw new Error(
      kind === "cover"
        ? "Formato de imagen no soportado. Usa PNG, JPG, WebP o SVG."
        : "Formato de archivo no soportado. Usa PDF, PNG, JPG, WebP, SVG o documentos Office."
    );
  }

  const safeName = sanitizeFilename(file.name);
  const uniqueName = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}-${safeName}`;
  const scopeDir = path.join(getUploadsRoot(), scope);

  fs.mkdirSync(scopeDir, { recursive: true });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const targetPath = path.join(scopeDir, uniqueName);
  fs.writeFileSync(targetPath, buffer);

  return {
    fileUrl: `/api/uploads/${scope}/${encodeURIComponent(uniqueName)}`,
    fileName: file.name,
    fileMime: file.type || getMimeTypeFromFilename(file.name),
    fileSizeBytes: file.size,
  };
}

export function resolveUploadedFilePath(
  scope: ContentScope,
  rawFilename: string
): string | null {
  const safeFile = path.basename(rawFilename);
  if (!safeFile || safeFile === "." || safeFile === "..") return null;

  const uploadsRoot = getUploadsRoot();
  const scopeDir = path.join(uploadsRoot, scope);
  const fullPath = path.join(scopeDir, safeFile);

  if (!fullPath.startsWith(scopeDir)) return null;
  if (!fs.existsSync(fullPath)) return null;

  return fullPath;
}

export function deleteUploadedFileIfLocal(fileUrl?: string): void {
  if (!fileUrl) return;

  // Handle new /api/uploads/<scope>/<filename> URLs
  if (fileUrl.startsWith("/api/uploads/")) {
    const parts = fileUrl.replace("/api/uploads/", "").split("/");
    if (parts.length !== 2) return;
    const [scope, encodedFilename] = parts;
    const safeFile = path.basename(decodeURIComponent(encodedFilename));
    const scopeDir = path.join(getUploadsRoot(), scope);
    const fullPath = path.join(scopeDir, safeFile);
    if (fullPath.startsWith(scopeDir) && fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch {
        // Ignore cleanup failure
      }
    }
    return;
  }

  // Backward compatibility for legacy /uploads/<scope>/<filename> URLs
  if (fileUrl.startsWith("/uploads/")) {
    const normalized = path
      .normalize(fileUrl)
      .replace(/^(\.\.(\/|\\|$))+/, "");
    const fullPath = path.join(process.cwd(), "public", normalized);
    const legacyRoot = path.join(process.cwd(), "public", "uploads");
    if (fullPath.startsWith(legacyRoot) && fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch {
        // Ignore cleanup failure
      }
    }
  }
}
