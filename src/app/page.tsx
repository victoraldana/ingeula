import { HeroSection } from "@/components/HeroSection";
import { StatsStrip } from "@/components/StatsStrip";
import { SchoolsShowcase } from "@/components/SchoolsShowcase";
import { AcademicModelSection } from "@/components/AcademicModelSection";
import { ResearchPillarsSection } from "@/components/ResearchPillarsSection";
import { NewsSection } from "@/components/NewsSection";
import { CampusLifeSection } from "@/components/CampusLifeSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsStrip />
      <SchoolsShowcase />
      <AcademicModelSection />
      <ResearchPillarsSection />
      <NewsSection />
      <CampusLifeSection />
    </>
  );
}
