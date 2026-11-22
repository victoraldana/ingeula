"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Search,
  Menu,
  X,
  ArrowRight,
  Cpu,
  Zap,
  Building2,
  Cog,
  FlaskConical,
  MapPin,
} from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { ENGINEERING_SCHOOLS, type SchoolSlug } from "@/data/schools";

const SCHOOL_ICONS: Record<SchoolSlug, typeof Cpu> = {
  sistemas: Cpu,
  electrica: Zap,
  civil: Building2,
  mecanica: Cog,
  quimica: FlaskConical,
};

export function Header() {
  const pathname = usePathname();
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSchools = ENGINEERING_SCHOOLS.filter((school) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      school.name.toLowerCase().includes(q) ||
      school.shortName.toLowerCase().includes(q) ||
      school.tagline.toLowerCase().includes(q) ||
      school.focusAreas.some((area) => area.toLowerCase().includes(q)) ||
      school.departments.some((dep) => dep.name.toLowerCase().includes(q))
    );
  });

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Institutional Utility Bar (tec.mx style) */}
      <div className="bg-[#001A4D] text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-blue-100/90">
            <MapPin className="h-3.5 w-3.5 text-blue-300" />
            <span>Núcleo La Hechicera · Mérida, Venezuela</span>
          </div>
          <nav
            aria-label="Accesos institucionales"
            className="hidden items-center gap-5 text-blue-100/85 md:flex"
          >
            <Link href="/#facultad" className="transition-colors hover:text-white">
              La Facultad
            </Link>
            <Link href="/#investigacion" className="transition-colors hover:text-white">
              Investigación
            </Link>
            <Link href="/#campus" className="transition-colors hover:text-white">
              La Hechicera
            </Link>
            <Link href="/#contacto" className="transition-colors hover:text-white">
              Contacto
            </Link>
            <Link
              href="/admin"
              className="rounded-sm bg-white/10 px-2.5 py-0.5 font-semibold text-white transition-colors hover:bg-white/20"
            >
              Panel Admin
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        ref={menuRef}
        className={`relative border-b bg-white/95 backdrop-blur-md transition-shadow duration-200 ${
          scrolled ? "border-slate-200/90 shadow-md" : "border-slate-200/70"
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo variant="dark" />

          {/* Desktop Navigation */}
          <nav
            aria-label="Navegación principal"
            className="hidden items-center gap-1 lg:flex"
          >
            <button
              type="button"
              onClick={() => setMegaMenuOpen((prev) => !prev)}
              aria-expanded={megaMenuOpen}
              className={`inline-flex items-center gap-1.5 rounded-sm px-4 py-2.5 text-sm font-semibold transition-colors ${
                megaMenuOpen || pathname.startsWith("/escuelas")
                  ? "bg-[#EBF2FF] text-[#0039A6]"
                  : "text-slate-800 hover:bg-slate-100 hover:text-[#0039A6]"
              }`}
            >
              Escuelas
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-200 ${
                  megaMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <Link
              href="/#modelo-academico"
              className="rounded-sm px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-[#0039A6]"
            >
              Modelo Académico
            </Link>
            <Link
              href="/#investigacion"
              className="rounded-sm px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-[#0039A6]"
            >
              Investigación
            </Link>
            <Link
              href="/#noticias"
              className="rounded-sm px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-[#0039A6]"
            >
              Actualidad
            </Link>
            <Link
              href="/#campus"
              className="rounded-sm px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 hover:text-[#0039A6]"
            >
              Campus
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Buscar escuelas o áreas"
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-slate-200 text-slate-700 transition-colors hover:border-[#0039A6] hover:text-[#0039A6]"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              href="/escuelas"
              className="hidden items-center gap-2 rounded-sm bg-[#0039A6] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#002B7F] sm:inline-flex"
            >
              Explorar Escuelas
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Abrir menú de navegación"
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-slate-200 text-slate-800 lg:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Desktop Mega-Menu for Escuelas */}
        {megaMenuOpen && (
          <div className="hidden border-t border-slate-200 bg-white shadow-xl lg:block">
            <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-8">
              <div className="col-span-4 flex flex-col justify-between border-r border-slate-100 pr-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#0039A6]">
                    Oferta Académica · FI-ULA
                  </span>
                  <h3 className="mt-2 text-2xl font-bold tracking-tight text-[#001A4D]">
                    Nuestras 5 Escuelas de Ingeniería
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Cada escuela cuenta con su propio espacio dentro del portal IngeULA
                    para centralizar su oferta académica, departamentos, laboratorios y
                    próximos recursos estudiantiles.
                  </p>
                </div>
                <Link
                  href="/escuelas"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#0039A6] hover:underline"
                >
                  Ver directorio completo de escuelas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="col-span-8 grid grid-cols-2 gap-3">
                {ENGINEERING_SCHOOLS.map((school) => {
                  const Icon = SCHOOL_ICONS[school.slug];
                  return (
                    <Link
                      key={school.slug}
                      href={`/escuelas/${school.slug}`}
                      className="group flex items-start gap-3.5 rounded-md border border-transparent p-3.5 transition-all hover:border-slate-200 hover:bg-[#F4F7FB]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#EBF2FF] text-[#0039A6] transition-colors group-hover:bg-[#0039A6] group-hover:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#001A4D] group-hover:text-[#0039A6]">
                            Ingeniería {school.slug === "sistemas" ? "de Sistemas" : school.shortName}
                          </span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                            {school.code}
                          </span>
                        </div>
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                          {school.tagline}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 pb-6 pt-4 shadow-lg lg:hidden">
            <div className="space-y-1">
              <p className="px-3 pb-1 pt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0039A6]">
                Escuelas de Ingeniería
              </p>
              {ENGINEERING_SCHOOLS.map((school) => {
                const Icon = SCHOOL_ICONS[school.slug];
                return (
                  <Link
                    key={school.slug}
                    href={`/escuelas/${school.slug}`}
                    className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-semibold text-slate-800 hover:bg-[#F4F7FB] hover:text-[#0039A6]"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-[#0039A6]" />
                      {school.name}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>

            <div className="mt-4 border-t border-slate-100 pt-4">
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/#modelo-academico"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Modelo Académico
                </Link>
                <Link
                  href="/#investigacion"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Investigación
                </Link>
                <Link
                  href="/#noticias"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Actualidad
                </Link>
                <Link
                  href="/#campus"
                  className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Campus
                </Link>
              </div>
              <Link
                href="/escuelas"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-sm bg-[#0039A6] px-4 py-3 text-sm font-semibold text-white"
              >
                Ver todas las escuelas
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/admin"
                className="mt-2 flex w-full items-center justify-center rounded-sm border border-slate-200 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700"
              >
                Panel Administrador
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Quick Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-[#001A4D]/60 px-4 pt-20 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Buscador del portal IngeULA"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-md bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
              <Search className="h-5 w-5 text-[#0039A6]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar escuela, departamento o área (ej. potencia, software, estructuras...)"
                className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Cerrar búsqueda"
                className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4">
              <p className="mb-3 px-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                Escuelas y Áreas ({filteredSchools.length})
              </p>
              {filteredSchools.length === 0 ? (
                <p className="px-2 py-8 text-center text-sm text-slate-500">
                  No se encontraron escuelas para &ldquo;{searchQuery}&rdquo;.
                </p>
              ) : (
                <div className="space-y-1.5">
                  {filteredSchools.map((school) => (
                    <Link
                      key={school.slug}
                      href={`/escuelas/${school.slug}`}
                      className="flex items-center justify-between rounded-md px-3 py-3 transition-colors hover:bg-[#F4F7FB]"
                    >
                      <div>
                        <p className="text-sm font-bold text-[#001A4D]">
                          {school.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-600">
                          {school.tagline}
                        </p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[#0039A6]" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
