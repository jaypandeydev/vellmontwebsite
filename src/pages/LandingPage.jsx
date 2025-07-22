import React from 'react';
import { useToast } from '@/components/ui/use-toast';
import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import PricingSection from '@/components/landing/PricingSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CtaSection from '@/components/landing/CtaSection';

const LandingPage = ({ companyName, logoUrl }) => {
  const { toast } = useToast();

  const handleGetStarted = () => {
    toast({
      title: "Welcome to Vellmont Services! 🚀",
      description: "Let's build something amazing together!",
    });
  };

  const handleContactSales = () => {
    toast({
      title: "Sales Team Alerted! 📞",
      description: "We'll be in touch shortly to discuss your software needs.",
    });
  };
  
  const tagline = "Redefining the standard, delivering excellence";
  const heroDescription = "We provide cutting-edge software services and innovative SaaS products to elevate your business. Partner with us to unlock your full potential.";
  const ctaText = "Ready to elevate your business?";
  const ctaDescription = "Join innovative companies leveraging Vellmont Services to achieve their goals.";

  return (
    <>
      <HeroSection 
        companyName={companyName} 
        tagline={tagline}
        description={heroDescription}
        onGetStarted={handleGetStarted} 
        onContactSales={handleContactSales} 
        logoUrl={logoUrl}
      />
      <FeaturesSection />
      <PricingSection onGetStarted={handleGetStarted} onContactSales={handleContactSales} />
      <TestimonialsSection companyName={companyName} />
      <CtaSection 
        title={ctaText}
        description={ctaDescription}
        onGetStarted={handleGetStarted} 
        onContactSales={handleContactSales} 
      />
    </>
  );
};

export default LandingPage;