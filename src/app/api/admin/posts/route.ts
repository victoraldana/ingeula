import crypto from "crypto";
import { NextResponse } from "next/server";
import { canManageScope, getAllowedScopes, getCurrentUser } from "@/lib/auth";
import { readDatabase, writeDatabase } from "@/lib/db";
import { saveUploadedFile } from "@/lib/uploads";
import {
  ALL_SCOPES,
  type ContentScope,
  type PortalPost,
  type PostCategory,
} from "@/lib/types";

const VALID_CATEGORIES: PostCategory[] = [
  "Aviso",
  "Noticia",
  "Académico",
  "Evento",
  "Investigación",
];

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const allowed = new Set(getAllowedScopes(user));
  const db = readDatabase();
  const posts = db.posts
    .filter((p) => allowed.has(p.scope))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return NextResponse.json({ posts });
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
    const category = String(formData.get("category") || "Aviso") as PostCategory;
    const summary = String(formData.get("summary") || "").trim();
    const content = String(formData.get("content") || "").trim();
    const pinned = String(formData.get("pinned") || "false") === "true";
    const coverUrlInput = String(formData.get("coverImageUrl") || "").trim();
    const coverFile = formData.get("coverFile");

    if (!ALL_SCOPES.includes(scope)) {
      return NextResponse.json({ error: "Sección inválida." }, { status: 400 });
    }

    if (!canManageScope(user, scope)) {
      return NextResponse.json(
        { error: "No tienes permisos para publicar en esta sección." },
        { status: 403 }
      );
    }

    if (!title || !summary || !content) {
      return NextResponse.json(
        { error: "Título, resumen y contenido son obligatorios." },
        { status: 400 }
      );
    }

    const safeCategory: PostCategory = VALID_CATEGORIES.includes(category)
      ? category
      : "Aviso";

    let coverImage: string | undefined = coverUrlInput || undefined;
    if (coverFile instanceof File && coverFile.size > 0) {
      const saved = await saveUploadedFile(coverFile, scope, "cover");
      coverImage = saved.fileUrl;
    }

    const now = new Date().toISOString();
    const post: PortalPost = {
      id: `post_${crypto.randomBytes(6).toString("hex")}`,
      scope,
      title,
      category: safeCategory,
      summary,
      content,
      coverImage,
      pinned,
      authorId: user.id,
      authorName: user.name,
      createdAt: now,
      updatedAt: now,
    };

    const db = readDatabase();
    db.posts.unshift(post);
    writeDatabase(db);

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "No se pudo crear la publicación.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
