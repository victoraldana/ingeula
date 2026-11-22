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
      {/* Geometric institutional emblem inspired by Andean peaks + engineering compass */}
      <div
        className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-sm transition-transform duration-200 group-hover:scale-[1.03] ${
          isLight
            ? "bg-white text-[#0039A6]"
            : "bg-[#0039A6] text-white"
        }`}
      >
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            d="M6 27L15 9L21 20L25 14L31 27H6Z"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          <circle cx="15" cy="9" r="2" fill="currentColor" />
          <path
            d="M11 27H26"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
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
