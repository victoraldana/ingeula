import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { FACULTY_NEWS } from "@/data/faculty";

export function NewsSection() {
  const featured = FACULTY_NEWS.find((item) => item.featured) ?? FACULTY_NEWS[0];
  const secondary = FACULTY_NEWS.filter((item) => item.id !== featured.id);

  return (
    <section id="noticias" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0039A6]">
              <Newspaper className="h-4 w-4" />
              IngeULA Conecta
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#001A4D] sm:text-4xl">
              Actualidad y Novedades de la Facultad
            </h2>
          </div>
          <Link
            href="/escuelas"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0039A6] hover:text-[#001A4D]"
          >
            Explorar secciones por escuela
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {/* Featured Story */}
          <article className="group overflow-hidden rounded-md border border-slate-200 bg-white transition-shadow hover:shadow-xl lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-4 top-4 rounded-sm bg-[#0039A6] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                {featured.category}
              </span>
            </div>
            <div className="p-7">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {featured.date}
              </p>
              <h3 className="mt-2.5 text-2xl font-bold tracking-tight text-[#001A4D] transition-colors group-hover:text-[#0039A6]">
                <Link href={featured.href}>{featured.title}</Link>
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {featured.excerpt}
              </p>
              <Link
                href={featured.href}
                className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#0039A6] hover:text-[#001A4D]"
              >
                Conocer más
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </article>

          {/* Secondary Stories */}
          <div className="flex flex-col gap-6 lg:col-span-5">
            {secondary.map((item) => (
              <article
                key={item.id}
                className="group flex flex-1 flex-col overflow-hidden rounded-md border border-slate-200 bg-[#F8FAFC] transition-all hover:border-[#0039A6]/30 hover:bg-white hover:shadow-lg sm:flex-row lg:flex-col"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-slate-900 sm:w-48 sm:shrink-0 lg:aspect-[21/9] lg:w-full">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-sm bg-white/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0039A6]">
                    {item.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      {item.date}
                    </p>
                    <h3 className="mt-1.5 text-lg font-bold leading-snug text-[#001A4D] group-hover:text-[#0039A6]">
                      <Link href={item.href}>{item.title}</Link>
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">
                      {item.excerpt}
                    </p>
                  </div>
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0039A6]"
                  >
                    Ir a la sección
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
