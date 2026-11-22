import crypto from "crypto";
import { NextResponse } from "next/server";
import { canManageScope, getAllowedScopes, getCurrentUser } from "@/lib/auth";
import { readDatabase, writeDatabase } from "@/lib/db";
import { extractYouTubeId } from "@/lib/youtube";
import {
  ALL_SCOPES,
  type ContentScope,
  type PortalVideo,
  type VideoCategory,
} from "@/lib/types";

const VALID_VIDEO_CATEGORIES: VideoCategory[] = [
  "Clase Magistral",
  "Laboratorio",
  "Charla / Evento",
  "Recorrido",
  "Tutorial",
];

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const allowed = new Set(getAllowedScopes(user));
  const db = readDatabase();
  const videos = db.videos
    .filter((v) => allowed.has(v.scope))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  return NextResponse.json({ videos });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      scope?: ContentScope;
      title?: string;
      category?: VideoCategory;
      description?: string;
      youtubeUrl?: string;
    };

    const scope = body.scope as ContentScope;
    const title = (body.title || "").trim();
    const description = (body.description || "").trim();
    const youtubeUrl = (body.youtubeUrl || "").trim();
    const category = body.category as VideoCategory;

    if (!ALL_SCOPES.includes(scope)) {
      return NextResponse.json({ error: "Sección inválida." }, { status: 400 });
    }

    if (!canManageScope(user, scope)) {
      return NextResponse.json(
        { error: "No tienes permisos para incrustar videos en esta sección." },
        { status: 403 }
      );
    }

    if (!title || !youtubeUrl) {
      return NextResponse.json(
        { error: "Título y enlace de YouTube son obligatorios." },
        { status: 400 }
      );
    }

    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
      return NextResponse.json(
        {
          error:
            "El enlace no corresponde a un video válido de YouTube (acepta youtube.com/watch?v=..., youtu.be/..., shorts o embed).",
        },
        { status: 400 }
      );
    }

    const safeCategory: VideoCategory = VALID_VIDEO_CATEGORIES.includes(category)
      ? category
      : "Charla / Evento";

    const video: PortalVideo = {
      id: `vid_${crypto.randomBytes(6).toString("hex")}`,
      scope,
      title,
      category: safeCategory,
      description,
      youtubeUrl,
      youtubeId,
      authorId: user.id,
      authorName: user.name,
      createdAt: new Date().toISOString(),
    };

    const db = readDatabase();
    db.videos.unshift(video);
    writeDatabase(db);

    return NextResponse.json({ video }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "No se pudo registrar el video de YouTube." },
      { status: 500 }
    );
  }
}
