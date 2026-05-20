import React from 'react';
import Nav from '@/components/redesign/Nav';
import Hero from '@/components/redesign/Hero';
import AIDemoBlock from '@/components/redesign/AIDemoBlock';
import Products from '@/components/redesign/Products';
import { Thesis, Process, Endgame } from '@/components/redesign/Sections';
import Footer from '@/components/redesign/Footer';
import Seo from '@/components/redesign/Seo';

const LandingPage = () => {
  return (
    <main className="min-h-screen bg-white text-neutral-900 font-sans antialiased">
      <Seo
        title="Vellmont Services — Software for the industries that still run on humans. We rewire them with AI."
        description="Vellmont is an AI-first software studio rewiring the industries that still run on humans, paper, and WhatsApp — AI clinic queue management (MedQuePMS), AI astrology marketplace (Vedjyotix), AI tour operator OS (Vellroute), AI tutoring platform (Tutora), invitation manager (InviteSync), and AI GST invoicing (Vellbill). Six products live, custom AI builds available."
        canonical="https://vellmontservices.com/"
        image="https://res.cloudinary.com/dzdaksuzp/image/upload/v1750354259/Vellmont_final_logo_Png_isk7ol.png"
      />
      <Nav />
      <Hero />
      <AIDemoBlock />
      <Thesis />
      <Products />
      <Process />
      <Endgame />
      <Footer />
    </main>
  );
};

export default LandingPage;
