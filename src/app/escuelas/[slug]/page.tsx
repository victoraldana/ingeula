import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Briefcase,
  Clock,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  FolderKanban,
} from "lucide-react";
import { ENGINEERING_SCHOOLS, getSchoolBySlug } from "@/data/schools";
import { getScopeContent } from "@/lib/db";
import { SchoolDynamicContent } from "@/components/SchoolDynamicContent";

export const dynamic = "force-dynamic";

interface SchoolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SchoolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);

  if (!school) {
    return {
      title: "Escuela no encontrada",
    };
  }

  return {
    title: school.name,
    description: school.summary,
  };
}

export default async function SchoolDetailPage({ params }: SchoolPageProps) {
  const { slug } = await params;
  const school = getSchoolBySlug(slug);

  if (!school) {
    notFound();
  }

  const otherSchools = ENGINEERING_SCHOOLS.filter((s) => s.slug !== school.slug);
  const { posts, resources, videos } = getScopeContent(school.slug);

  return (
    <div>
      {/* School Hero */}
      <section className="relative overflow-hidden bg-[#001A4D] text-white">
        <div className="absolute inset-0">
          <img
            src={school.image}
            alt={school.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#00143D]/95 via-[#002366]/85 to-[#0039A6]/45" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <Link
            href="/escuelas"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-200 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Todas las Escuelas
          </Link>

          <div className="mt-6 max-w-3xl">
            <span className="inline-block rounded-sm bg-white/15 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-blue-100 backdrop-blur-sm">
              {school.code} · Facultad de Ingeniería ULA
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              {school.name}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-blue-100/90 sm:text-lg">
              {school.summary}
            </p>

            <div className="mt-8 flex flex-wrap gap-4 text-sm">
              <div className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <GraduationCap className="h-4 w-4 text-blue-300" />
                <span>
                  Título: <strong className="font-semibold">{school.degreeTitle}</strong>
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm">
                <Clock className="h-4 w-4 text-blue-300" />
                <span>
                  Duración: <strong className="font-semibold">{school.duration}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="bg-white py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
          {/* Left Column: Dynamic Content + Mission, Focus Areas, Departments */}
          <div className="space-y-12 lg:col-span-8">
            <SchoolDynamicContent
              schoolShortName={school.shortName}
              posts={posts}
              resources={resources}
              videos={videos}
            />

            {/* Mission */}
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#0039A6]">
                Identidad de la Escuela
              </span>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#001A4D]">
                Propósito y Enfoque Académico
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {school.mission}
              </p>
            </div>

            {/* Focus Areas */}
            <div>
              <h3 className="text-xl font-bold tracking-tight text-[#001A4D]">
                Áreas de Especialización
              </h3>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {school.focusAreas.map((area) => (
                  <div
                    key={area}
                    className="flex items-start gap-3 rounded-md border border-slate-200 bg-[#F8FAFC] p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#0039A6]" />
                    <span className="text-sm font-semibold text-slate-800">{area}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Departments */}
            <div>
              <div className="flex items-center gap-2">
                <Building className="h-5 w-5 text-[#0039A6]" />
                <h3 className="text-xl font-bold tracking-tight text-[#001A4D]">
                  Estructura Departamental
                </h3>
              </div>
              <div className="mt-5 space-y-4">
                {school.departments.map((dept) => (
                  <div
                    key={dept.name}
                    className="rounded-md border border-slate-200 bg-white p-5 transition-colors hover:border-[#0039A6]/40"
                  >
                    <h4 className="text-base font-bold text-[#001A4D]">{dept.name}</h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {dept.focus}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Future Modules Roadmap for this School */}
            <div className="rounded-md border border-[#0039A6]/20 bg-[#F4F7FB] p-7">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#0039A6]">
                <FolderKanban className="h-4 w-4" />
                <span>Espacio preparado para futuras secciones</span>
              </div>
              <h3 className="mt-2 text-xl font-extrabold text-[#001A4D]">
                Próximos módulos de {school.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Esta sección del portal irá incorporando gradualmente recursos propios de la
                escuela para estudiantes, docentes y egresados:
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {school.futureModules.map((mod) => (
                  <div
                    key={mod.title}
                    className="flex flex-col justify-between rounded-md border border-slate-200 bg-white p-4"
                  >
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-sm bg-[#EBF2FF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0039A6]">
                        <Sparkles className="h-3 w-3" />
                        {mod.status}
                      </span>
                      <h4 className="mt-3 text-sm font-bold text-[#001A4D]">
                        {mod.title}
                      </h4>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                        {mod.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Career Paths & Other Schools */}
          <aside className="space-y-8 lg:col-span-4">
            <div className="rounded-md border border-slate-200 bg-[#F8FAFC] p-6">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-[#0039A6]" />
                <h3 className="text-lg font-bold text-[#001A4D]">Campo Profesional</h3>
              </div>
              <ul className="mt-4 space-y-3">
                {school.careerPaths.map((path) => (
                  <li
                    key={path}
                    className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0039A6]" />
                    <span>{path}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-md border border-slate-200 bg-white p-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">
                Otras Escuelas IngeULA
              </h3>
              <div className="mt-4 space-y-2">
                {otherSchools.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/escuelas/${other.slug}`}
                    className="group flex items-center justify-between rounded-sm border border-transparent px-3 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-200 hover:bg-[#F4F7FB] hover:text-[#0039A6]"
                  >
                    <span>
                      Ingeniería {other.slug === "sistemas" ? "de Sistemas" : other.shortName}
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-[#0039A6]" />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
