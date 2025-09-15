import { useState, useEffect } from "react";
import { useLeads } from "@/hooks/useLeads";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Benefits from "@/components/Benefits";
import Pricing from "@/components/Pricing";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import LeadModal from "@/components/LeadModal";

const Index = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { trackAnalytics } = useLeads();

  useEffect(() => {
    // Track page view
    trackAnalytics('page_view', { page: 'landing' });
  }, [trackAnalytics]);

  const handleJoinClick = () => {
    trackAnalytics('cta_click', { cta_type: 'join_club', location: 'hero' });
    setIsModalOpen(true);
  };

  // const handleWhatsAppClick = () => {
  //   trackAnalytics('cta_click', { cta_type: 'whatsapp', location: 'hero' });
  //   const message = encodeURIComponent("Quiero unirme al Club SHOC (prelanzamiento)");
  //   window.open(`https://wa.me/5493885123456?text=${message}`, '_blank');
  // };

  return (
    <div className="min-h-screen bg-background">
      {/* SEO Meta Tags would be handled in index.html */}
      <Hero onJoinClick={handleJoinClick} />
      <HowItWorks />
      <Benefits />
      <Pricing onJoinClick={handleJoinClick} />
      <Gallery />
      <Testimonials />
      <FAQ />
      <FinalCTA onJoinClick={handleJoinClick} />
      <Footer />
      <LeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Index;
