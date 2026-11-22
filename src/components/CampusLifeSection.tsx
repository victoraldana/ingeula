import Link from "next/link";
import { Mountain, MapPin, ArrowRight } from "lucide-react";

export function CampusLifeSection() {
  return (
    <section id="campus" className="bg-[#F4F7FB] py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-[#001A4D] text-white shadow-2xl">
          <div className="grid lg:grid-cols-12">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:col-span-7">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
                <Mountain className="h-4 w-4" />
                Núcleo La Hechicera · Mérida
              </span>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Vivir la ingeniería en el corazón de los Andes venezolanos.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-blue-100/85">
                Ubicada en el Núcleo Universitario &ldquo;Dr. Pedro Rincón Gutiérrez&rdquo;,
                la Facultad de Ingeniería integra aulas, bibliotecas especializadas,
                laboratorios experimentales, grupos estudiantiles y espacios rodeados de
                naturaleza andina.
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-blue-200">
                <MapPin className="h-4 w-4 shrink-0 text-blue-300" />
                <span>Sector La Hechicera, Mérida · Universidad de Los Andes</span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/escuelas"
                  className="inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 text-sm font-bold text-[#001A4D] transition-colors hover:bg-blue-50"
                >
                  Explorar nuestras 5 escuelas
                  <ArrowRight className="h-4 w-4 text-[#0039A6]" />
                </Link>
              </div>
            </div>

            <div className="relative min-h-[280px] lg:col-span-5">
              <img
                src="/images/hero-campus.jpg"
                alt="Vista del entorno universitario en Mérida, Andes venezolanos"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001A4D]/60 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#001A4D]/55 lg:via-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
