"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Compass,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { ENGINEERING_SCHOOLS } from "@/data/schools";
import { HERO_SLIDES } from "@/data/faculty";

const AUTOPLAY_INTERVAL_MS = 7000;

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const totalSlides = HERO_SLIDES.length;

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused || isHovered) return;
    const timer = window.setInterval(goToNext, AUTOPLAY_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isPaused, isHovered, goToNext]);

  const currentSlide = HERO_SLIDES[activeIndex];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Destacados de la Facultad de Ingeniería ULA"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") goToNext();
        if (e.key === "ArrowLeft") goToPrev();
      }}
      tabIndex={0}
      className="relative overflow-hidden bg-[#001A4D] text-white focus:outline-none"
    >
      {/* Cross-fading Background Photography */}
      <div className="absolute inset-0">
        {HERO_SLIDES.map((slide, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={slide.id}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-all duration-700 ease-out ${
                isActive ? "scale-100 opacity-100" : "scale-105 opacity-0"
              }`}
            >
              <img
                src={slide.image}
                alt={slide.imageAlt}
                className="h-full w-full object-cover object-center"
              />
            </div>
          );
        })}

        {/* Crisp directional editorial gradient (tec.mx aesthetic) */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00143D]/95 via-[#002366]/82 to-[#0039A6]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#00143D]/92 via-transparent to-[#00143D]/25" />
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-16 sm:px-6 lg:px-8 lg:pb-18 lg:pt-24">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          {/* Active Slide Copy */}
          <div
            key={currentSlide.id}
            aria-live="polite"
            className="min-h-[340px] max-w-3xl sm:min-h-[320px] lg:min-h-[350px]"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100 backdrop-blur-sm">
              <GraduationCap className="h-4 w-4 text-blue-300" />
              <span>{currentSlide.badge}</span>
            </div>

            <h1 className="mt-6 text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              {currentSlide.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-blue-100/90 sm:text-lg">
              {currentSlide.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href={currentSlide.primaryCta.href}
                className="inline-flex items-center gap-2.5 rounded-sm bg-[#0039A6] px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-950/30 transition-all hover:bg-[#0047CC] focus:outline-none focus:ring-2 focus:ring-white/60"
              >
                {currentSlide.primaryCta.label}
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={currentSlide.secondaryCta.href}
                className="inline-flex items-center gap-2.5 rounded-sm border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white hover:text-[#001A4D]"
              >
                <Compass className="h-4 w-4" />
                {currentSlide.secondaryCta.label}
              </Link>
            </div>
          </div>

          {/* Carousel Arrow + Pause Controls */}
          <div className="flex items-center gap-2.5 self-start lg:self-end">
            <span className="mr-1 text-xs font-bold tracking-widest text-blue-200">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(totalSlides).padStart(2, "0")}
            </span>

            <button
              type="button"
              onClick={goToPrev}
              aria-label="Diapositiva anterior"
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/25 bg-[#001A4D]/60 text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-[#0039A6]"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={goToNext}
              aria-label="Siguiente diapositiva"
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/25 bg-[#001A4D]/60 text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-[#0039A6]"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Reanudar carrusel" : "Pausar carrusel"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-sm border border-white/25 bg-[#001A4D]/60 text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-[#0039A6]"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Slide Selector Indicators (Editorial Progress Tabs) */}
        <div
          role="tablist"
          aria-label="Seleccionar información destacada"
          className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4"
        >
          {HERO_SLIDES.map((slide, index) => {
            const isActive = index === activeIndex;
            return (
              <button
                key={slide.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveIndex(index)}
                className={`group text-left transition-all ${
                  isActive ? "opacity-100" : "opacity-65 hover:opacity-95"
                }`}
              >
                <div className="h-1 w-full overflow-hidden rounded-full bg-white/25">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isActive ? "w-full bg-white" : "w-0 bg-blue-300 group-hover:w-1/3"
                    }`}
                  />
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="font-bold text-blue-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="truncate font-semibold text-white">
                    {slide.shortLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Quick-Access Strip for the 5 Schools */}
        <div className="mt-10 border-t border-white/15 pt-7">
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
