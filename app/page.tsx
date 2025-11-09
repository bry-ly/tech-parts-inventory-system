import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import HeroSection from "@/components/landing/hero-section";
import Features from "@/components/landing/features-4";
import Pricing from "@/components/landing/pricing";
import FAQsTwo from "@/components/landing/faqs-2";
import FooterSection from "@/components/landing/footer";
import ContentSection from "@/components/landing/content-1";

export default async function Home() {
  const user = await auth.api
    .getSession({
      headers: await headers(),
    })
    .then((res) => res?.user || null);
  if (user) {
    redirect("/dashboard");
  }

  return (
    <main>
      <HeroSection />
      <div id="content">
        <ContentSection />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      <div id="faq">
        <FAQsTwo />
      </div>
      <FooterSection />
    </main>
  );
}
