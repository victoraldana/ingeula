import Link from "next/link";

interface BrandLogoProps {
  variant?: "dark" | "light";
  compact?: boolean;
}

export function BrandLogo({ variant = "dark", compact = false }: BrandLogoProps) {
  const isLight = variant === "light";

  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-3 focus:outline-none"
      aria-label="IngeULA - Facultad de Ingeniería Universidad de Los Andes"
    >
      {/* Official Facultad de Ingeniería ULA ("fi") Emblem */}
      <div
        className={`relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-sm transition-transform duration-200 group-hover:scale-[1.03] ${
          isLight
            ? "bg-white p-1 shadow-sm"
            : "bg-white p-0.5"
        }`}
      >
        <img
          src="/images/logo-fi-ula.png"
          alt="Logo Facultad de Ingeniería ULA"
          className="h-full w-full object-contain"
        />
      </div>

      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span
            className={`text-xl font-extrabold tracking-tight ${
              isLight ? "text-white" : "text-[#001A4D]"
            }`}
          >
            Inge<span className={isLight ? "text-blue-300" : "text-[#0039A6]"}>ULA</span>
          </span>
        </div>
        {!compact && (
          <span
            className={`mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
              isLight ? "text-blue-100/80" : "text-slate-500"
            }`}
          >
            Facultad de Ingeniería · ULA
          </span>
        )}
      </div>
    </Link>
  );
}
