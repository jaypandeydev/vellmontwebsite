import React from 'react';
import Nav from '@/components/redesign/Nav';
import Hero from '@/components/redesign/Hero';
import AIDemoBlock from '@/components/redesign/AIDemoBlock';
import Products from '@/components/redesign/Products';
import ProductsInDetail from '@/components/redesign/ProductsInDetail';
import { Thesis, Process, Endgame } from '@/components/redesign/Sections';
import {
  TechStack,
  Security,
  Roadmap,
  WhyUs,
  Testimonials,
  BlogTeaser,
} from '@/components/redesign/MoreSections';
import Footer from '@/components/redesign/Footer';
import Seo from '@/components/redesign/Seo';

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-[#050816] text-neutral-100 font-sans antialiased">
      <Seo
        title="Vellmont Services — AI Operating Systems For Real Businesses"
        description="Vellmont is an AI product studio building production-grade SaaS for healthcare (MedQuePMS), tourism (Vellroute), education (Tutora), astrology (Vedjyotix), invitation management (InviteSync) and GST invoicing (Vellbill). Six products shipped across India + UAE; custom AI builds available."
        canonical="https://vellmontservices.com/"
        image="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
      />
      <Nav />
      <Hero />
      <Thesis />
      <ProductsInDetail />
      <AIDemoBlock />
      <Products />
      <TechStack />
      <Security />
      <Process />
      <Roadmap />
      <WhyUs />
      <Testimonials />
      <BlogTeaser />
      <Endgame />
      <Footer />
    </main>
  );
};

export default LandingPage;
