"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, Mail, ArrowRight, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "No se pudo iniciar sesión.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Error de conexión al intentar iniciar sesión.");
      setLoading(false);
    }
  }

  function fillDemoAccount(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError(null);
  }

  return (
    <div className="min-h-[calc(100vh-140px)] bg-[#F4F7FB] py-14 sm:py-20">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-xl">
          {/* Header Banner */}
          <div className="bg-[#001A4D] px-7 py-7 text-white">
            <div className="inline-flex items-center gap-2 rounded-sm bg-white/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-200">
              <ShieldCheck className="h-3.5 w-3.5" />
              Acceso Restringido · FI-ULA
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight">
              Panel Administrador IngeULA
            </h1>
            <p className="mt-1.5 text-sm text-blue-100/80">
              Gestiona usuarios, publicaciones, flujogramas, PDFs y videos por escuela.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5 p-7">
            {error && (
              <div className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Correo institucional
              </label>
              <div className="relative mt-1.5">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ingeula.org"
                  className="w-full rounded-sm border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none focus:ring-2 focus:ring-[#0039A6]/15"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold uppercase tracking-wider text-slate-600"
              >
                Contraseña
              </label>
              <div className="relative mt-1.5">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-sm border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 focus:border-[#0039A6] focus:outline-none focus:ring-2 focus:ring-[#0039A6]/15"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#0039A6] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#002B7F] disabled:opacity-60"
            >
              {loading ? "Verificando..." : "Ingresar al Panel"}
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Quick Dev / Seed Helper */}
            <div className="rounded-sm border border-blue-100 bg-[#F4F7FB] p-4">
              <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#0039A6]">
                <KeyRound className="h-3.5 w-3.5" />
                Cuentas iniciales precargadas
              </p>
              <div className="mt-3 grid gap-2">
                <button
                  type="button"
                  onClick={() => fillDemoAccount("admin@ingeula.org", "IngeULA2026!")}
                  className="flex flex-col items-start rounded-sm border border-slate-200 bg-white px-3 py-2 text-left transition-colors hover:border-[#0039A6]"
                >
                  <span className="text-xs font-bold text-[#001A4D]">
                    Super Administrador (Todas las escuelas + Usuarios)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    admin@ingeula.org · IngeULA2026!
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    fillDemoAccount("electrica@ingeula.org", "Electrica2026!")
                  }
                  className="flex flex-col items-start rounded-sm border border-slate-200 bg-white px-3 py-2 text-left transition-colors hover:border-[#0039A6]"
                >
                  <span className="text-xs font-bold text-[#001A4D]">
                    Admin Escuela de Eléctrica (Solo sección Eléctrica)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    electrica@ingeula.org · Electrica2026!
                  </span>
                </button>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-xs font-semibold text-slate-500 hover:text-[#0039A6]"
              >
                ← Volver al portal público IngeULA
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
