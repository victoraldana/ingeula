import { NextResponse } from "next/server";
import { canManageUsers, getCurrentUser } from "@/lib/auth";
import { hashPassword, readDatabase, toSafeUser, writeDatabase } from "@/lib/db";
import { ALL_SCOPES, type ContentScope, type UserRole } from "@/lib/types";

const VALID_ROLES: UserRole[] = ["super_admin", "school_admin", "editor"];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }
  if (!canManageUsers(currentUser)) {
    return NextResponse.json(
      { error: "No tienes permisos para modificar usuarios." },
      { status: 403 }
    );
  }

  const { id } = await context.params;
  const db = readDatabase();
  const target = db.users.find((u) => u.id === id);

  if (!target) {
    return NextResponse.json(
      { error: "Usuario no encontrado." },
      { status: 404 }
    );
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      role?: UserRole;
      assignedScopes?: ContentScope[];
      active?: boolean;
      newPassword?: string;
    };

    if (typeof body.name === "string" && body.name.trim()) {
      target.name = body.name.trim();
    }

    if (body.role && VALID_ROLES.includes(body.role)) {
      if (target.id === currentUser.id && body.role !== "super_admin") {
        return NextResponse.json(
          { error: "No puedes quitarte a ti mismo el rol de Super Administrador." },
          { status: 400 }
        );
      }
      target.role = body.role;
    }

    if (target.role === "super_admin") {
      target.assignedScopes = [...ALL_SCOPES];
    } else if (Array.isArray(body.assignedScopes)) {
      const filtered = body.assignedScopes.filter((s): s is ContentScope =>
        ALL_SCOPES.includes(s)
      );
      if (filtered.length === 0) {
        return NextResponse.json(
          { error: "El usuario debe tener al menos una sección asignada." },
          { status: 400 }
        );
      }
      target.assignedScopes = filtered;
    }

    if (typeof body.active === "boolean") {
      if (target.id === currentUser.id && !body.active) {
        return NextResponse.json(
          { error: "No puedes desactivar tu propia cuenta." },
          { status: 400 }
        );
      }
      target.active = body.active;
    }

    if (typeof body.newPassword === "string" && body.newPassword.length > 0) {
      if (body.newPassword.length < 6) {
        return NextResponse.json(
          { error: "La nueva contraseña debe tener al menos 6 caracteres." },
          { status: 400 }
        );
      }
      target.passwordHash = hashPassword(body.newPassword);
    }

    writeDatabase(db);
    return NextResponse.json({ user: toSafeUser(target) });
  } catch {
    return NextResponse.json(
      { error: "No se pudo actualizar el usuario." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }
  if (!canManageUsers(currentUser)) {
    return NextResponse.json(
      { error: "No tienes permisos para eliminar usuarios." },
      { status: 403 }
    );
  }

  const { id } = await context.params;
  if (id === currentUser.id) {
    return NextResponse.json(
      { error: "No puedes eliminar tu propia cuenta activa." },
      { status: 400 }
    );
  }

  const db = readDatabase();
  const prevLen = db.users.length;
  db.users = db.users.filter((u) => u.id !== id);
  if (db.users.length === prevLen) {
    return NextResponse.json(
      { error: "Usuario no encontrado." },
      { status: 404 }
    );
  }

  writeDatabase(db);
  return NextResponse.json({ ok: true });
}
