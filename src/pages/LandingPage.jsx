import React from 'react';
import Nav from '@/components/redesign/Nav';
import Hero from '@/components/redesign/Hero';
import Products from '@/components/redesign/Products';
import {
  Thesis,
  Services,
  WhyVellmont,
  Endgame,
} from '@/components/redesign/Sections';
import Footer from '@/components/redesign/Footer';
import Seo from '@/components/redesign/Seo';

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-[#F5EFE7] text-[#1E1A3D] font-sans antialiased">
      <Seo
        title="Vellmont Services — Software for real work"
        description="Vellmont Services is a focused product studio building production-ready software for healthcare, travel, finance, education, and everyday business — MedQuePMS, Vellroute, Vedjyotix, InviteSync, Vellbill, Tutora, and Vellpass. Book a demo to talk through a project."
        canonical="https://vellmontservices.com/"
        image="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
      />
      <Nav />
      <Hero />
      <Thesis />
      <Products />
      <Services />
      <WhyVellmont />
      <Endgame />
      <Footer />
    </main>
  );
};

export default LandingPage;
