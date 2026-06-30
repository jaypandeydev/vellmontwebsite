import React from 'react';
import Nav from '@/components/redesign/Nav';
import Hero from '@/components/redesign/Hero';
import AIDemoBlock from '@/components/redesign/AIDemoBlock';
import ProductsInDetail from '@/components/redesign/ProductsInDetail';
import { Thesis, Process, Endgame } from '@/components/redesign/Sections';
import {
  TechStack,
  Security,
  WhyUs,
} from '@/components/redesign/MoreSections';
import Footer from '@/components/redesign/Footer';
import Seo from '@/components/redesign/Seo';

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-[#05070d] text-neutral-100 font-sans antialiased">
      <Seo
        title="Vellmont Services — AI Product Lab For Vertical SaaS"
        description="Vellmont builds AI-native vertical SaaS products for healthcare, tourism, finance, education, astrology and social planning. Six product systems across India and the UAE."
        canonical="https://vellmontservices.com/"
        image="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
      />
      <Nav />
      <Hero />
      <ProductsInDetail />
      <AIDemoBlock />
      <Thesis />
      <TechStack />
      <Security />
      <Process />
      <WhyUs />
      <Endgame />
      <Footer />
    </main>
  );
};

export default LandingPage;
