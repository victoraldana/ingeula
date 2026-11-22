import { HeroSection } from "@/components/HeroSection";
import { StatsStrip } from "@/components/StatsStrip";
import { SchoolsShowcase } from "@/components/SchoolsShowcase";
import { AcademicModelSection } from "@/components/AcademicModelSection";
import { ResearchPillarsSection } from "@/components/ResearchPillarsSection";
import { NewsSection } from "@/components/NewsSection";
import { CampusLifeSection } from "@/components/CampusLifeSection";
import { getScopeContent } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const { posts: facultyPosts } = getScopeContent("facultad");

  return (
    <>
      <HeroSection />
      <StatsStrip />
      <SchoolsShowcase />
      <AcademicModelSection />
      <ResearchPillarsSection />
      <NewsSection dynamicPosts={facultyPosts} />
      <CampusLifeSection />
    </>
  );
}
