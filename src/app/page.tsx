import AboutSection from "@/components/landing/AboutSection";
import ActivitiesSection from "@/components/landing/ActivitySection";
import BlogSection from "@/components/landing/BlogSection";
import FAQSection from "@/components/landing/FAQSection";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/Hero";
import InfoSection from "@/components/landing/InfoSection";
import SeasonalSection from "@/components/landing/SeasonalSection";
import ToursSection from "@/components/landing/ToursSection";

const IndexPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <AboutSection />
      <ToursSection />
      <InfoSection />
      <ActivitiesSection />
      <SeasonalSection />
      <BlogSection />
      <FAQSection />
    </div>
  );
};

export default IndexPage;
