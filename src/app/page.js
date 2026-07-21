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
import WinnerBenefitsSection from "@/components/WinnerBenefitsSection";
import RequiredDocumentsSection from "@/components/RequiredDocumentsSection";
import DelegateRegistrationSection from "@/components/DelegateRegistrationSection";
import SponsorshipSection from "@/components/SponsorshipSection";
import GeneralSponsorshipSection from "@/components/GeneralSponsorshipSection";
import RegistrationFlowSection from "@/components/RegistrationFlowSection";
import PastEditionsSection from "@/components/PastEditionsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import EcosystemPartnersSection from "@/components/EcosystemPartnersSection";
import OrganiserSection from "@/components/OrganiserSection";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

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
      <AwardCategoriesSection />
      <WinnerBenefitsSection />
      <RequiredDocumentsSection />
      <SponsorshipSection />
      <GeneralSponsorshipSection />
      <DelegateRegistrationSection />
      <AwardsSection />
      <RegistrationFlowSection />
      <PastEditionsSection />
      <TestimonialsSection />
      <EcosystemPartnersSection />
      <OrganiserSection />
      {/* <FaqSection /> */}
      <ContactSection />
      <Footer />
    </main>
  );
}
