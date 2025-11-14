import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import HeroSection from "@/components/landing/hero-section";
import Features from "@/components/landing/features";
import FooterSection from "@/components/landing/footer";
import ContentSection from "@/components/landing/content";
import TeamSection from "@/components/landing/team";

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
      <div id="team">
        <TeamSection />
      </div>
      <FooterSection />
    </main>
  );
}
