import { NextResponse } from "next/server";
import { canManageScope, getCurrentUser } from "@/lib/auth";
import { readDatabase, writeDatabase } from "@/lib/db";
import { deleteUploadedFileIfLocal } from "@/lib/uploads";

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
  const target = db.resources.find((r) => r.id === id);

  if (!target) {
    return NextResponse.json(
      { error: "Recurso no encontrado." },
      { status: 404 }
    );
  }

  if (!canManageScope(user, target.scope)) {
    return NextResponse.json(
      { error: "No tienes permisos para eliminar este recurso." },
      { status: 403 }
    );
  }

  if (!target.isExternal) {
    deleteUploadedFileIfLocal(target.fileUrl);
  }

  db.resources = db.resources.filter((r) => r.id !== id);
  writeDatabase(db);

  return NextResponse.json({ ok: true });
}
