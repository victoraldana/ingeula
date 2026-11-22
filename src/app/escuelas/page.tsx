import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap, Clock, Layers } from "lucide-react";
import { ENGINEERING_SCHOOLS } from "@/data/schools";

export const metadata: Metadata = {
  title: "Escuelas de Ingeniería",
  description:
    "Directorio oficial de las cinco escuelas de la Facultad de Ingeniería ULA: Sistemas, Eléctrica, Civil, Mecánica y Química.",
};

export default function EscuelasIndexPage() {
  return (
    <div className="bg-[#F4F7FB]">
      {/* Page Hero */}
      <section className="bg-[#001A4D] py-16 text-white lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
            <GraduationCap className="h-4 w-4" />
            <span>Oferta Académica · FI-ULA</span>
          </div>
          <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
            Escuelas de Ingeniería ULA
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-blue-100/85">
            Explora nuestras cinco escuelas académicas. Cada sección está diseñada como un
            espacio independiente preparado para albergar pensum, departamentos, laboratorios,
            noticias y recursos especializados.
          </p>
        </div>
      </section>

      {/* Detailed Directory List */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="space-y-8">
          {ENGINEERING_SCHOOLS.map((school) => (
            <article
              key={school.slug}
              className="group grid overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition-all hover:border-[#0039A6]/40 hover:shadow-xl lg:grid-cols-12"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 lg:col-span-5 lg:aspect-auto">
                <img
                  src={school.image}
                  alt={school.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-sm bg-white/95 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-[#0039A6]">
                  {school.code}
                </span>
              </div>

              <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-[#0039A6]" />
                      Título: {school.degreeTitle}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#0039A6]" />
                      {school.duration}
                    </span>
                  </div>

                  <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#001A4D] group-hover:text-[#0039A6]">
                    {school.name}
                  </h2>

                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {school.summary}
                  </p>

                  <div className="mt-5">
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
                      <Layers className="h-3.5 w-3.5" />
                      Áreas clave
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {school.focusAreas.map((area) => (
                        <span
                          key={area}
                          className="rounded-sm bg-[#F4F7FB] px-2.5 py-1 text-xs font-semibold text-slate-700"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-7 border-t border-slate-100 pt-5">
                  <Link
                    href={`/escuelas/${school.slug}`}
                    className="inline-flex items-center gap-2 rounded-sm bg-[#0039A6] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#002B7F]"
                  >
                    Entrar a la Escuela de {school.shortName}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
