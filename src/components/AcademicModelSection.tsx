import { CheckCircle2, BookOpen } from "lucide-react";
import { ACADEMIC_STAGES } from "@/data/faculty";

export function AcademicModelSection() {
  return (
    <section id="modelo-academico" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Editorial Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0039A6]">
              <BookOpen className="h-4 w-4" />
              Formación Integral ULA
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#001A4D] sm:text-4xl">
              Del Ciclo Básico al liderazgo tecnológico y científico.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              La Facultad de Ingeniería de la Universidad de Los Andes combina una base
              científico-matemática de alto rigor con el entrenamiento práctico en
              laboratorios y la especialización progresiva en cada escuela.
            </p>

            <div className="mt-8 rounded-md border border-[#0039A6]/15 bg-[#F4F7FB] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0039A6]">
                Identidad Académica
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                Desde 1936, nuestra facultad ha formado generaciones de ingenieros reconocidos
                por su capacidad analítica, versatilidad y compromiso ético con la sociedad.
              </p>
            </div>
          </div>

          {/* Right 3-Stage Progression */}
          <div className="space-y-6 lg:col-span-7">
            {ACADEMIC_STAGES.map((stage) => (
              <div
                key={stage.step}
                className="group rounded-md border border-slate-200 bg-white p-7 transition-all duration-200 hover:border-[#0039A6]/40 hover:shadow-lg sm:p-8"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-[#EBF2FF] text-base font-extrabold text-[#0039A6] transition-colors group-hover:bg-[#0039A6] group-hover:text-white">
                    {stage.step}
                  </span>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold tracking-tight text-[#001A4D]">
                      {stage.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                      {stage.description}
                    </p>
                    <ul className="mt-5 grid gap-2.5 sm:grid-cols-1">
                      {stage.highlights.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2.5 text-sm font-medium text-slate-700"
                        >
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0039A6]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
