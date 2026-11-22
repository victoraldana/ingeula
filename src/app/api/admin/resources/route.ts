import crypto from "crypto";
import { NextResponse } from "next/server";
import { canManageScope, getAllowedScopes, getCurrentUser } from "@/lib/auth";
import { readDatabase, writeDatabase } from "@/lib/db";
import { saveUploadedFile } from "@/lib/uploads";
import {
  ALL_SCOPES,
  type ContentScope,
  type PortalResource,
  type ResourceType,
} from "@/lib/types";

const VALID_TYPES: ResourceType[] = [
  "Flujograma",
  "Pensum / PDF",
  "Guía / Normativa",
  "Horario",
  "Otro",
];

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const allowed = new Set(getAllowedScopes(user));
  const db = readDatabase();
  const resources = db.resources
    .filter((r) => allowed.has(r.scope))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return NextResponse.json({ resources });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const scope = String(formData.get("scope") || "") as ContentScope;
    const title = String(formData.get("title") || "").trim();
    const resourceType = String(
      formData.get("resourceType") || "Flujograma"
    ) as ResourceType;
    const description = String(formData.get("description") || "").trim();
    const externalUrl = String(formData.get("externalUrl") || "").trim();
    const uploadedFile = formData.get("file");

    if (!ALL_SCOPES.includes(scope)) {
      return NextResponse.json({ error: "Sección inválida." }, { status: 400 });
    }

    if (!canManageScope(user, scope)) {
      return NextResponse.json(
        { error: "No tienes permisos para subir recursos en esta sección." },
        { status: 403 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: "El título del recurso es obligatorio." },
        { status: 400 }
      );
    }

    const safeType: ResourceType = VALID_TYPES.includes(resourceType)
      ? resourceType
      : "Otro";

    let fileUrl = "";
    let fileName = "";
    let fileMime = "application/octet-stream";
    let fileSizeBytes: number | undefined;
    let isExternal = false;

    if (uploadedFile instanceof File && uploadedFile.size > 0) {
      const saved = await saveUploadedFile(uploadedFile, scope, "resource");
      fileUrl = saved.fileUrl;
      fileName = saved.fileName;
      fileMime = saved.fileMime;
      fileSizeBytes = saved.fileSizeBytes;
      isExternal = false;
    } else if (externalUrl) {
      try {
        const parsed = new URL(externalUrl);
        if (!["http:", "https:"].includes(parsed.protocol)) {
          throw new Error("Protocolo no permitido.");
        }
      } catch {
        return NextResponse.json(
          { error: "Ingresa un enlace válido (https://...) o adjunta un archivo." },
          { status: 400 }
        );
      }
      fileUrl = externalUrl;
      fileName = externalUrl.split("/").pop() || "recurso-externo";
      fileMime = externalUrl.toLowerCase().endsWith(".pdf")
        ? "application/pdf"
        : "text/uri-list";
      isExternal = true;
    } else {
      return NextResponse.json(
        { error: "Debes subir un archivo (PDF/imagen) o indicar un enlace externo." },
        { status: 400 }
      );
    }

    const resource: PortalResource = {
      id: `res_${crypto.randomBytes(6).toString("hex")}`,
      scope,
      title,
      resourceType: safeType,
      description,
      fileUrl,
      fileName,
      fileMime,
      fileSizeBytes,
      isExternal,
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date().toISOString(),
    };

    const db = readDatabase();
    db.resources.unshift(resource);
    writeDatabase(db);

    return NextResponse.json({ resource }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "No se pudo subir el recurso.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
