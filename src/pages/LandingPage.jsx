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
        title="Vellmont Services — Software for the industries that still run on WhatsApp"
        description="Vellmont is a software studio building production tools for Indian SMBs — clinic queue management (MedQuePMS), astrology marketplace (Vedjyotix), tour operator OS (TourConnect), tutoring platform (Tutora), invitation manager (InviteSync), and GST invoicing (Vellbill). Six products live, custom builds available."
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
