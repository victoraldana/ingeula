import { Microscope, Network, Users } from "lucide-react";
import { RESEARCH_PILLARS } from "@/data/faculty";

const PILLAR_ICONS = [Microscope, Network, Users];

export function ResearchPillarsSection() {
  return (
    <section
      id="investigacion"
      className="relative overflow-hidden bg-[#001A4D] py-20 text-white lg:py-28"
    >
      {/* Subtle architectural grid accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
            Investigación, Extensión y Comunidad
          </span>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Conocimiento aplicado que trasciende las aulas.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-blue-100/85">
            La ingeniería en la ULA se construye entre laboratorios, centros de
            investigación, proyectos con la industria y una red internacional de egresados.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {RESEARCH_PILLARS.map((pillar, idx) => {
            const Icon = PILLAR_ICONS[idx % PILLAR_ICONS.length];
            return (
              <div
                key={pillar.title}
                className="flex flex-col justify-between rounded-md border border-white/15 bg-white/5 p-7 backdrop-blur-sm transition-all duration-200 hover:border-blue-300/40 hover:bg-white/10"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#0039A6] text-white">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold tracking-tight text-white">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-blue-100/80">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-7 border-t border-white/10 pt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    {pillar.metric}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
