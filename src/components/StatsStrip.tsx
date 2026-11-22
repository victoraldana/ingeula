import { FACULTY_METRICS } from "@/data/faculty";

export function StatsStrip() {
  return (
    <section
      id="facultad"
      aria-label="Indicadores de la Facultad de Ingeniería ULA"
      className="border-b border-slate-200 bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 divide-y divide-slate-200 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {FACULTY_METRICS.map((metric) => (
            <div key={metric.label} className="px-2 py-8 sm:px-6 lg:py-10">
              <p className="text-3xl font-extrabold tracking-tight text-[#0039A6] lg:text-4xl">
                {metric.value}
              </p>
              <p className="mt-2 text-sm font-bold uppercase tracking-wide text-[#001A4D]">
                {metric.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                {metric.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
