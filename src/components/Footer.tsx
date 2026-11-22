import Link from "next/link";
import { MapPin, Mail, Globe, ArrowUpRight } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { ENGINEERING_SCHOOLS } from "@/data/schools";

export function Footer() {
  return (
    <footer id="contacto" className="bg-[#04122B] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Institutional Identity */}
          <div className="lg:col-span-4">
            <BrandLogo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-blue-100/75">
              Portal digital de la Facultad de Ingeniería de la Universidad de Los Andes.
              Información institucional, proyección académica y espacios dedicados para
              cada una de nuestras escuelas de ingeniería.
            </p>
            <div className="mt-6 space-y-2.5 text-sm text-blue-100/80">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                <span>
                  Núcleo Universitario Pedro Rincón Gutiérrez (La Hechicera), Mérida 5101,
                  Estado Mérida, Venezuela.
                </span>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-blue-400" />
                <span>contacto@ingeula.org</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 shrink-0 text-blue-400" />
                <span>Universidad de Los Andes · Facultad de Ingeniería</span>
              </p>
            </div>
          </div>

          {/* Escuelas */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              Escuelas de Ingeniería
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {ENGINEERING_SCHOOLS.map((school) => (
                <li key={school.slug}>
                  <Link
                    href={`/escuelas/${school.slug}`}
                    className="inline-flex items-center gap-1.5 text-blue-100/80 transition-colors hover:text-white"
                  >
                    <span>Ingeniería {school.slug === "sistemas" ? "de Sistemas" : school.shortName}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* La Facultad */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              Portal Institucional
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-blue-100/80">
              <li>
                <Link href="/#facultad" className="transition-colors hover:text-white">
                  Sobre la Facultad
                </Link>
              </li>
              <li>
                <Link href="/#modelo-academico" className="transition-colors hover:text-white">
                  Ciclo Básico y Pregrado
                </Link>
              </li>
              <li>
                <Link href="/#investigacion" className="transition-colors hover:text-white">
                  Investigación y Laboratorios
                </Link>
              </li>
              <li>
                <Link href="/#noticias" className="transition-colors hover:text-white">
                  Actualidad y Agenda
                </Link>
              </li>
              <li>
                <Link href="/#campus" className="transition-colors hover:text-white">
                  Vida en La Hechicera
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Institutional Box */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              Comunidad
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-blue-100/80">
              <li>
                <Link href="/escuelas" className="transition-colors hover:text-white">
                  Aspirantes
                </Link>
              </li>
              <li>
                <Link href="/escuelas" className="transition-colors hover:text-white">
                  Estudiantes
                </Link>
              </li>
              <li>
                <Link href="/#investigacion" className="transition-colors hover:text-white">
                  Docentes
                </Link>
              </li>
              <li>
                <Link href="/#investigacion" className="transition-colors hover:text-white">
                  Egresados ULA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-8 text-xs text-blue-100/60 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} IngeULA · Facultad de Ingeniería, Universidad de Los
            Andes. Mérida, Venezuela.
          </p>
          <p className="italic text-blue-200/70">
            Initium sapientiae timor Domini
          </p>
        </div>
      </div>
    </footer>
  );
}
