import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ByTheNumbers from "@/components/ByTheNumbers";
import WhyAttend from "@/components/WhyAttend";
import WhoShouldAttend from "@/components/WhoShouldAttend";
import EventHighlights from "@/components/EventHighlights";
import AgendaSection from "@/components/AgendaSection";
import SpeakersSection from "@/components/SpeakersSection";
import JurySection from "@/components/JurySection";
import AwardsSection from "@/components/AwardsSection";
import AwardCategoriesSection from "@/components/AwardCategoriesSection";
import AwardProcessSection from "@/components/AwardProcessSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-surface text-brand-dark font-sans selection:bg-brand-primary selection:text-white">
      <Navbar />
      <Hero />
      <ByTheNumbers />
      <AboutSection />
      <WhyAttend />
      <WhoShouldAttend />
      <EventHighlights />
      <AgendaSection />
      <SpeakersSection />
      <JurySection />
      <AwardsSection />
      <AwardCategoriesSection />
      <AwardProcessSection />
    </main>
  );
}
