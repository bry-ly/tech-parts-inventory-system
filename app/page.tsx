import HeroSection from "@/components/landing/hero-section";
import ContentSection from "@/components/landing/content";
import Features from "@/components/landing/features";
import TeamSection from "@/components/landing/team";
import FAQsTwo from "@/components/landing/faqs";
import FooterSection from "@/components/landing/footer";

export default function Page() {
  return (
    <div className="relative">
      <HeroSection />
      <ContentSection />
      <Features />
      <TeamSection />
      <FAQsTwo />
      <FooterSection />
    </div>
  );
}
