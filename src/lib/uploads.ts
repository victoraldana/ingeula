import crypto from "crypto";
import fs from "fs";
import path from "path";
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
  const scopeDir = path.join(process.cwd(), "public", "uploads", scope);

  if (!fs.existsSync(scopeDir)) {
    fs.mkdirSync(scopeDir, { recursive: true });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const targetPath = path.join(scopeDir, uniqueName);
  fs.writeFileSync(targetPath, buffer);

  return {
    fileUrl: `/uploads/${scope}/${uniqueName}`,
    fileName: file.name,
    fileMime: file.type || (ext === ".pdf" ? "application/pdf" : "application/octet-stream"),
    fileSizeBytes: file.size,
  };
}

export function deleteUploadedFileIfLocal(fileUrl?: string): void {
  if (!fileUrl || !fileUrl.startsWith("/uploads/")) return;
  const normalized = path
    .normalize(fileUrl)
    .replace(/^(\.\.(\/|\\|$))+/, "");
  const fullPath = path.join(process.cwd(), "public", normalized);
  const uploadsRoot = path.join(process.cwd(), "public", "uploads");
  if (!fullPath.startsWith(uploadsRoot)) return;
  if (fs.existsSync(fullPath)) {
    try {
      fs.unlinkSync(fullPath);
    } catch {
      // Ignore file removal error so DB deletion still succeeds
    }
  }
}
