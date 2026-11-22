import Link from "next/link";
import { ArrowRight, GraduationCap, Compass } from "lucide-react";
import { ENGINEERING_SCHOOLS } from "@/data/schools";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#001A4D] text-white">
      {/* Background Campus Photography */}
      <div className="absolute inset-0">
        <img
          src="/images/hero-campus.jpg"
          alt="Campus de la Facultad de Ingeniería ULA rodeado de los Andes en Mérida"
          className="h-full w-full object-cover object-center"
        />
        {/* Crisp directional editorial gradient (tec.mx aesthetic) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00143D]/95 via-[#002366]/80 to-[#0039A6]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00143D]/90 via-transparent to-[#00143D]/25" />
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8 lg:pb-20 lg:pt-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100 backdrop-blur-sm">
            <GraduationCap className="h-4 w-4 text-blue-300" />
            <span>Universidad de Los Andes · Facultad de Ingeniería</span>
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Ingeniería con rigor científico que transforma el futuro desde los Andes.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-blue-100/90 sm:text-lg">
            Bienvenido a <strong className="font-semibold text-white">IngeULA</strong>, el
            portal de la Facultad de Ingeniería de la ULA. Explora información general de la
            facultad y descubre nuestras cinco escuelas: Sistemas, Eléctrica, Civil, Mecánica
            y Química.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/#escuelas"
              className="inline-flex items-center gap-2.5 rounded-sm bg-[#0039A6] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition-all hover:bg-[#0047CC] focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              Conoce nuestras escuelas
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/#modelo-academico"
              className="inline-flex items-center gap-2.5 rounded-sm border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#001A4D]"
            >
              <Compass className="h-4 w-4" />
              Sobre la Facultad
            </Link>
          </div>
        </div>

        {/* Bottom Quick-Access Strip for the 5 Schools */}
        <div className="mt-16 border-t border-white/15 pt-7 lg:mt-20">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-200/85">
            Acceso directo por Escuela de Ingeniería
          </p>
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {ENGINEERING_SCHOOLS.map((school) => (
              <Link
                key={school.slug}
                href={`/escuelas/${school.slug}`}
                className="group flex items-center justify-between rounded-sm border border-white/15 bg-[#001A4D]/65 px-4 py-3 backdrop-blur-md transition-all hover:border-white/50 hover:bg-[#0039A6]"
              >
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-blue-300 group-hover:text-blue-100">
                    {school.code}
                  </span>
                  <span className="mt-0.5 block text-sm font-bold text-white">
                    {school.shortName}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-blue-200 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
