import { NextResponse } from "next/server";
import { canManageScope, getCurrentUser } from "@/lib/auth";
import { readDatabase, writeDatabase } from "@/lib/db";
import { deleteUploadedFileIfLocal } from "@/lib/uploads";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { id } = await context.params;
  const db = readDatabase();
  const post = db.posts.find((p) => p.id === id);

  if (!post) {
    return NextResponse.json(
      { error: "Publicación no encontrada." },
      { status: 404 }
    );
  }

  if (!canManageScope(user, post.scope)) {
    return NextResponse.json(
      { error: "No tienes permisos para editar esta publicación." },
      { status: 403 }
    );
  }

  try {
    const body = (await request.json()) as {
      pinned?: boolean;
      title?: string;
      summary?: string;
      content?: string;
    };

    if (typeof body.pinned === "boolean") post.pinned = body.pinned;
    if (typeof body.title === "string" && body.title.trim()) {
      post.title = body.title.trim();
    }
    if (typeof body.summary === "string" && body.summary.trim()) {
      post.summary = body.summary.trim();
    }
    if (typeof body.content === "string" && body.content.trim()) {
      post.content = body.content.trim();
    }
    post.updatedAt = new Date().toISOString();

    writeDatabase(db);
    return NextResponse.json({ post });
  } catch {
    return NextResponse.json(
      { error: "No se pudo actualizar la publicación." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { id } = await context.params;
  const db = readDatabase();
  const target = db.posts.find((p) => p.id === id);

  if (!target) {
    return NextResponse.json(
      { error: "Publicación no encontrada." },
      { status: 404 }
    );
  }

  if (!canManageScope(user, target.scope)) {
    return NextResponse.json(
      { error: "No tienes permisos para eliminar esta publicación." },
      { status: 403 }
    );
  }

  deleteUploadedFileIfLocal(target.coverImage);
  db.posts = db.posts.filter((p) => p.id !== id);
  writeDatabase(db);

  return NextResponse.json({ ok: true });
}
