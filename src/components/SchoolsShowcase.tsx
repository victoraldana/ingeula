"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Zap,
  Building2,
  Cog,
  FlaskConical,
  Layers,
} from "lucide-react";
import { ENGINEERING_SCHOOLS, type SchoolSlug } from "@/data/schools";

const SCHOOL_ICONS: Record<SchoolSlug, typeof Cpu> = {
  sistemas: Cpu,
  electrica: Zap,
  civil: Building2,
  mecanica: Cog,
  quimica: FlaskConical,
};

export function SchoolsShowcase() {
  const [selectedSlug, setSelectedSlug] = useState<SchoolSlug | "all">("all");

  const visibleSchools =
    selectedSlug === "all"
      ? ENGINEERING_SCHOOLS
      : ENGINEERING_SCHOOLS.filter((s) => s.slug === selectedSlug);

  return (
    <section id="escuelas" className="bg-[#F4F7FB] py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0039A6]">
              <Layers className="h-4 w-4" />
              Oferta Académica · Pregrado
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#001A4D] sm:text-4xl">
              Nuestras Escuelas de Ingeniería
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Cinco escuelas con identidad propia, rigor académico y proyección internacional.
              Cada sección está estructurada para crecer con información detallada, pensum,
              laboratorios y proyectos de su comunidad.
            </p>
          </div>

          <Link
            href="/escuelas"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-[#0039A6] transition-colors hover:text-[#001A4D]"
          >
            Ver comparativa y directorio completo
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Interactive School Filter Tabs */}
        <div className="mt-10 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedSlug("all")}
            className={`rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              selectedSlug === "all"
                ? "bg-[#0039A6] text-white shadow-sm"
                : "border border-slate-200 bg-white text-slate-700 hover:border-[#0039A6] hover:text-[#0039A6]"
            }`}
          >
            Todas (5)
          </button>
          {ENGINEERING_SCHOOLS.map((school) => (
            <button
              key={school.slug}
              type="button"
              onClick={() => setSelectedSlug(school.slug)}
              className={`rounded-sm px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                selectedSlug === school.slug
                  ? "bg-[#0039A6] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-[#0039A6] hover:text-[#0039A6]"
              }`}
            >
              {school.shortName}
            </button>
          ))}
        </div>

        {/* Modular Cards Grid */}
        <div
          className={`mt-8 grid gap-7 ${
            selectedSlug === "all"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1 lg:grid-cols-1"
          }`}
        >
          {visibleSchools.map((school) => {
            const Icon = SCHOOL_ICONS[school.slug];
            const isSingleFocus = selectedSlug !== "all";

            return (
              <article
                key={school.slug}
                className={`group overflow-hidden rounded-md border border-slate-200/90 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#0039A6]/35 hover:shadow-xl ${
                  isSingleFocus ? "grid lg:grid-cols-12" : "flex flex-col"
                }`}
              >
                {/* School Editorial Photo */}
                <div
                  className={`relative overflow-hidden bg-slate-900 ${
                    isSingleFocus ? "lg:col-span-5" : "aspect-[16/10]"
                  }`}
                >
                  <img
                    src={school.image}
                    alt={school.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#001A4D]/75 via-[#001A4D]/15 to-transparent" />
                  <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-sm bg-white/95 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#0039A6] shadow-sm">
                    <Icon className="h-3.5 w-3.5" />
                    {school.code}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-medium text-blue-100">
                    <span>{school.degreeTitle}</span>
                    <span className="rounded bg-white/15 px-2 py-0.5 backdrop-blur-sm">
                      {school.duration}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div
                  className={`flex flex-1 flex-col p-6 ${
                    isSingleFocus ? "lg:col-span-7 lg:p-8" : ""
                  }`}
                >
                  <h3 className="text-xl font-bold tracking-tight text-[#001A4D] transition-colors group-hover:text-[#0039A6]">
                    {school.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {school.summary}
                  </p>

                  {/* Focus Areas */}
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {school.focusAreas.slice(0, isSingleFocus ? 4 : 3).map((area) => (
                      <span
                        key={area}
                        className="rounded-sm bg-[#F4F7FB] px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  {/* Footer CTA */}
                  <div className="mt-auto border-t border-slate-100 pt-5">
                    <Link
                      href={`/escuelas/${school.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#0039A6] transition-colors hover:text-[#001A4D]"
                    >
                      Ir a la sección de {school.shortName}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Institutional Overview Callout Card (balances 5-card 3-column grid gracefully) */}
          {selectedSlug === "all" && (
            <div className="flex flex-col justify-between rounded-md bg-gradient-to-br from-[#001A4D] via-[#002B7F] to-[#0039A6] p-7 text-white shadow-lg">
              <div>
                <span className="inline-block rounded-sm bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-100">
                  Ecosistema en Crecimiento
                </span>
                <h3 className="mt-4 text-2xl font-extrabold leading-snug tracking-tight">
                  Una plataforma pensada para crecer con cada escuela.
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-blue-100/90">
                  IngeULA nace como un portal modular: cada escuela incorporará progresivamente
                  su malla curricular, laboratorios, docentes, noticias, eventos y recursos
                  académicos descargables.
                </p>
              </div>

              <div className="mt-8 border-t border-white/15 pt-5">
                <Link
                  href="/escuelas"
                  className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-blue-200"
                >
                  Explorar el mapa de escuelas
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
