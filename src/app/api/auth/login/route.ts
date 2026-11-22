import { NextResponse } from "next/server";
import { readDatabase, toSafeUser, verifyPassword } from "@/lib/db";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const email = (body.email || "").trim().toLowerCase();
    const password = body.password || "";

    if (!email || !password) {
      return NextResponse.json(
        { error: "Ingresa tu correo electrónico y contraseña." },
        { status: 400 }
      );
    }

    const db = readDatabase();
    const user = db.users.find((u) => u.email.toLowerCase() === email);

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Credenciales inválidas. Verifica tu correo y contraseña." },
        { status: 401 }
      );
    }

    if (!user.active) {
      return NextResponse.json(
        {
          error:
            "Tu cuenta está desactivada. Contacta al Super Administrador de la Facultad.",
        },
        { status: 403 }
      );
    }

    const token = createSessionToken(user.id);
    const response = NextResponse.json({ user: toSafeUser(user) });
    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json(
      { error: "No se pudo procesar el inicio de sesión." },
      { status: 500 }
    );
  }
}
