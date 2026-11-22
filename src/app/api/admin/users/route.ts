import crypto from "crypto";
import { NextResponse } from "next/server";
import { canManageUsers, getCurrentUser } from "@/lib/auth";
import { hashPassword, readDatabase, toSafeUser, writeDatabase } from "@/lib/db";
import {
  ALL_SCOPES,
  type ContentScope,
  type PortalUser,
  type UserRole,
} from "@/lib/types";

const VALID_ROLES: UserRole[] = ["super_admin", "school_admin", "editor"];

export async function GET() {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }
  if (!canManageUsers(currentUser)) {
    return NextResponse.json(
      { error: "Solo el Super Administrador puede gestionar usuarios." },
      { status: 403 }
    );
  }

  const db = readDatabase();
  return NextResponse.json({
    users: db.users.map(toSafeUser),
  });
}

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }
  if (!canManageUsers(currentUser)) {
    return NextResponse.json(
      { error: "Solo el Super Administrador puede crear usuarios." },
      { status: 403 }
    );
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      password?: string;
      role?: UserRole;
      assignedScopes?: ContentScope[];
    };

    const name = (body.name || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";
    const role = body.role;
    const requestedScopes = Array.isArray(body.assignedScopes)
      ? body.assignedScopes.filter((s): s is ContentScope =>
          ALL_SCOPES.includes(s)
        )
      : [];

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nombre, correo electrónico y contraseña son obligatorios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 6 caracteres." },
        { status: 400 }
      );
    }

    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Rol inválido." }, { status: 400 });
    }

    const assignedScopes: ContentScope[] =
      role === "super_admin" ? [...ALL_SCOPES] : requestedScopes;

    if (role !== "super_admin" && assignedScopes.length === 0) {
      return NextResponse.json(
        {
          error:
            "Debes asignar al menos una escuela o sección a este usuario.",
        },
        { status: 400 }
      );
    }

    const db = readDatabase();
    if (db.users.some((u) => u.email.toLowerCase() === email)) {
      return NextResponse.json(
        { error: "Ya existe un usuario registrado con ese correo electrónico." },
        { status: 409 }
      );
    }

    const newUser: PortalUser = {
      id: `usr_${crypto.randomBytes(6).toString("hex")}`,
      name,
      email,
      passwordHash: hashPassword(password),
      role,
      assignedScopes,
      active: true,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDatabase(db);

    return NextResponse.json({ user: toSafeUser(newUser) }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "No se pudo crear el usuario." },
      { status: 500 }
    );
  }
}
