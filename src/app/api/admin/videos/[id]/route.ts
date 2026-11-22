import { NextResponse } from "next/server";
import { canManageScope, getCurrentUser } from "@/lib/auth";
import { readDatabase, writeDatabase } from "@/lib/db";

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
  const target = db.videos.find((v) => v.id === id);

  if (!target) {
    return NextResponse.json(
      { error: "Video no encontrado." },
      { status: 404 }
    );
  }

  if (!canManageScope(user, target.scope)) {
    return NextResponse.json(
      { error: "No tienes permisos para eliminar este video." },
      { status: 403 }
    );
  }

  db.videos = db.videos.filter((v) => v.id !== id);
  writeDatabase(db);

  return NextResponse.json({ ok: true });
}
