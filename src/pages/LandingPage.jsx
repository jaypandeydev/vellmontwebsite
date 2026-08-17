import React from 'react';
import Nav from '@/components/redesign/Nav';
import Hero, { HeroProofStrip } from '@/components/redesign/Hero';
import AIDemoBlock from '@/components/redesign/AIDemoBlock';
import ProductsInDetail from '@/components/redesign/ProductsInDetail';
import FeaturedShowcase from '@/components/redesign/FeaturedShowcase';
import { Thesis, Process, Endgame } from '@/components/redesign/Sections';
import {
  TechStack,
  Security,
  WhyUs,
} from '@/components/redesign/MoreSections';
import Footer from '@/components/redesign/Footer';
import Seo from '@/components/redesign/Seo';
import {
  ScrollProgress,
  BackToTop,
  GlobalSpotlight,
  GsapReveals,
  ClickSpark,
  EdgeOrbs,
} from '@/components/redesign/interactions';

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-canvas text-ink font-sans antialiased">
      <Seo
        title="Vellmont Services — AI Product Lab For Vertical SaaS"
        description="Vellmont Services is an AI-powered SaaS company building enterprise software across healthcare, logistics, finance, business automation and consumer AI."
        canonical="https://vellmontservices.com/"
        image="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
      />
      <ScrollProgress />
      <GlobalSpotlight />
      <GsapReveals />
      <ClickSpark />
      <EdgeOrbs />
      <Nav />
      <Hero />
      <HeroProofStrip />
      <Thesis />
      {/* Tinted band lifts the flagship off the page */}
      <div className="bg-gradient-to-b from-canvas-2 to-canvas border-y border-line">
        <FeaturedShowcase />
      </div>
      <ProductsInDetail />
      <AIDemoBlock />
      <TechStack />
      {/* Tinted band groups the trust + process story */}
      <div className="bg-canvas-2 border-y border-line">
        <Security />
      </div>
      <Process />
      <div className="bg-gradient-to-b from-canvas to-canvas-2 border-t border-line">
        <WhyUs />
      </div>
      <Endgame />
      <Footer />
      <BackToTop />
    </main>
  );
};

export default LandingPage;
